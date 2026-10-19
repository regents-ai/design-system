defmodule Regent.VisualContractTest do
  use ExUnit.Case, async: true
  @package_root Path.expand("../..", __DIR__)
  @repository_root Path.expand("..", @package_root)

  test "shape roles preserve the eight-pixel scale without a universal rounded box" do
    tokens =
      @repository_root
      |> Path.join("design_system_tokens.json")
      |> File.read!()
      |> Jason.decode!()
      |> get_in(["selectors", ":root"])

    assert tokens["--space-1"] == "8px"
    assert tokens["--radius"] == "0px"
    assert tokens["--rg-cut-panel"] == "16px"
    assert tokens["--rg-cut-control"] == "12px"
    assert tokens["--rg-panel-padding"] == "var(--space-4)"
  end

  test "packaged tokens mirror the canonical source" do
    assert File.read!(Path.join(@repository_root, "design_system_tokens.css")) ==
             File.read!(Path.join([@package_root, "assets/css", "design_system_tokens.css"]))
  end

  test "all four products preserve their light and dark grounds" do
    selectors =
      @repository_root
      |> Path.join("design_system_tokens.json")
      |> File.read!()
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    for {brand, light, dark} <- [
          {"platform", "#F6F4EA", "#0B0B0B"},
          {"autolaunch", "#E5E3D2", "#0E0E0E"},
          {"patchbay", "#F6F7FA", "#111726"},
          {"techtree", "#F3F5EF", "#0D1611"}
        ],
        {mode, ground} <- [{"light", light}, {"dark", dark}] do
      tokens = Map.fetch!(selectors, ~s(:root[data-brand="#{brand}"][data-theme="#{mode}"]))
      assert tokens["--color-bg"] == ground
    end
  end

  test "with no choice made on the site, each product is dark unless the device asks for light" do
    css = File.read!(Path.join(@repository_root, "design_system_tokens.css"))

    selectors =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    [_, device_light] = String.split(css, "@media (prefers-color-scheme: light) {\n")

    for brand <- ~w(platform autolaunch patchbay techtree) do
      no_choice = ~s|:root[data-brand="#{brand}"]:not([data-theme])|
      assert css =~ ~s(:root[data-brand="#{brand}"][data-theme="dark"],\n#{no_choice} {)

      [_, body] = Regex.run(~r/#{Regex.escape(no_choice)} \{([^}]*)\}/, device_light)

      copy =
        Regex.scan(~r/(--[\w-]+)\s*:\s*([^;]+);/, body, capture: :all_but_first)
        |> Map.new(fn [name, value] -> {name, value} end)

      assert body =~ "color-scheme: light;"
      assert copy == selectors[~s(:root[data-brand="#{brand}"][data-theme="light"])]
    end
  end

  test "every declared font is packaged at its same-origin URL with only 400 and 600 weights" do
    css = File.read!(Path.join(@repository_root, "design_system_tokens.css"))
    faces = Regex.scan(~r/@font-face \{([^}]*)\}/, css, capture: :all_but_first)
    assert length(faces) == 9

    for [face] <- faces do
      [_, file] = Regex.run(~r{url\("/fonts/regent-ui/([^"]+)"\)}, face)
      assert File.exists?(Path.join([@package_root, "priv/static/fonts", file])), file
      assert face =~ ~r/font-weight: (400|600);/
      assert face =~ ~r/font-style: (normal|italic);/
    end

    assert File.exists?(Path.join(@package_root, "priv/static/fonts/OFL.txt"))
  end

  test "supporting roles use the other identities, or Patchbay's and Techtree's own roles, as readable pairs" do
    selectors =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    for {brand, primary} <- [
          {"platform", "charcoal"},
          {"autolaunch", "tangerine-tango"}
        ] do
      roles = Map.get(selectors, ~s(:root[data-brand="#{brand}"]), %{})
      surfaces = for role <- ~w(figure band panel), do: roles["--support-#{role}-surface"]
      expected = ~w(charcoal platinum tangerine-tango powder-blue) -- [primary]
      assert Enum.sort(surfaces) == Enum.sort(Enum.map(expected, &"var(--palette-#{&1})"))

      for role <- ~w(figure band panel) do
        ink =
          if roles["--support-#{role}-surface"] == "var(--palette-charcoal)",
            do: "platinum",
            else: "charcoal"

        assert roles["--support-#{role}-ink"] == "var(--palette-#{ink})"
      end
    end

    # Patchbay's Porcelain and cobalt palette (Sean, 15 Oct 2026) pairs its own roles.
    assert Map.take(selectors[~s(:root[data-brand="patchbay"])], [
             "--support-figure-surface",
             "--support-figure-ink",
             "--support-band-surface",
             "--support-band-ink",
             "--support-panel-surface",
             "--support-panel-ink"
           ]) == %{
             "--support-figure-surface" => "var(--color-surface-elevated)",
             "--support-figure-ink" => "var(--color-fg)",
             "--support-band-surface" => "var(--color-accent)",
             "--support-band-ink" => "var(--color-fg-on-accent)",
             "--support-panel-surface" => "var(--color-surface)",
             "--support-panel-ink" => "var(--color-fg)"
           }

    # Techtree's Canopy palette changes its roles with the theme.
    support = fn mode ->
      selectors[~s(:root[data-brand="techtree"][data-theme="#{mode}"])]
      |> Map.filter(fn {name, _} -> String.starts_with?(name, "--support-") end)
    end

    assert support.("light") == %{
             "--support-figure-surface" => "#E6EBDF",
             "--support-figure-ink" => "#0F1B14",
             "--support-band-surface" => "#1E6B45",
             "--support-band-ink" => "#F3F5EF",
             "--support-panel-surface" => "#0F1B14",
             "--support-panel-ink" => "#E8F0EA"
           }

    assert support.("dark") == %{
             "--support-figure-surface" => "#1A2820",
             "--support-figure-ink" => "#E4EEE6",
             "--support-band-surface" => "#C8F25C",
             "--support-band-ink" => "#0D1611",
             "--support-panel-surface" => "#142019",
             "--support-panel-ink" => "#E4EEE6"
           }
  end

  test "selects reserve the shared 24px chevron gap and keep a forced-colors native affordance" do
    css = File.read!(Path.join(@package_root, "assets/css/primitives.css"))
    assert css =~ "--rg-select-chevron-inset: 24px;"
    assert css =~ "padding-right: calc(var(--rg-select-chevron-inset) + 24px);"
    assert css =~ "right var(--rg-select-chevron-inset) center"
    assert css =~ ".rg-field select { appearance: auto; background-image: none; }"
  end

  test "buttons preserve forced-color focus and keep their label on one line" do
    css = File.read!(Path.join(@package_root, "assets/css/primitives.css"))

    [_, host] = Regex.run(~r/\.rg-button \{([^}]+)\}/, css)
    assert host =~ "overflow: visible"
    assert host =~ "white-space: nowrap"
    refute host =~ "clip-path"
    [_, label] = Regex.run(~r/\.rg-button__label \{([^}]+)\}/, css)
    assert label =~ "text-overflow: ellipsis"
    assert css =~ "border: 1px solid ButtonText; color: ButtonText; background: ButtonFace;"
    assert css =~ ".rg-button:disabled { color: GrayText; opacity: 1; }"
    assert css =~ "outline: 2px solid var(--rg-p-text); outline-offset: 4px;"
    assert css =~ "outline-color: Highlight;"
  end

  test "feature cards ripple the panel edge on interaction" do
    css = File.read!(Path.join(@package_root, "assets/css/structure.css"))

    assert css =~ ".rg-feature:is(:hover, :focus-within) > .rg-panel::before"
    assert css =~ "conic-gradient(from var(--rg-edge-angle)"

    assert css =~
             "animation: rg-edge-ripple calc(var(--rg-shimmer-duration, 1.15s) * 2) linear infinite"

    assert css =~ "@keyframes rg-edge-ripple"
    assert css =~ ~s|@property --rg-edge-angle|
  end

  test "capability bands retain subgrid reflow and contain arbitrary image proportions without clipping" do
    css = File.read!(Path.join(@package_root, "assets/css/structure.css"))
    assert css =~ ".rg-feature { display: grid; grid-row: span 3; grid-template-rows: subgrid;"

    assert css =~
             ".rg-feature__face { display: grid; grid-row: span 2; grid-template-rows: subgrid;"

    assert css =~ ".rg-feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }"

    assert css =~ ".rg-feature-grid { grid-template-columns: minmax(0, 1fr); }"

    [_, image] =
      Regex.run(
        ~r/\.rg-feature__face \.rg-technical-figure__art > :is\(img, svg\) \{([^}]+)\}/,
        css
      )

    assert image =~ "width: 100%"
    assert image =~ "aspect-ratio: 1"
    assert image =~ "object-fit: contain"
    assert image =~ "max-inline-size: 100%"

    assert css =~
             ".rg-feature .rg-panel__index { min-inline-size: 0; white-space: normal; overflow-wrap: anywhere; }"

    assert css =~ ".rg-feature__actions { display: flex; flex-wrap: wrap;"

    assert css =~
             ":where(.rg-feature, .rg-feature *, .rg-feature *::before, .rg-feature *::after) { box-sizing: border-box; }"

    for selector <- [".rg-feature", ".rg-feature__face", ".rg-feature__caption"] do
      [_, host] = Regex.run(~r/#{Regex.escape(selector)} \{([^}]+)\}/, css)
      refute host =~ "clip-path"
      refute host =~ "overflow: hidden"
    end
  end

  test "titles use genuine regular Pixel Square while UI and prose use Sans" do
    tokens =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> get_in(["selectors", ":root"])

    assert tokens["--font-family-title"] =~ "Geist Pixel Square"
    assert tokens["--font-family-ui"] == "var(--font-family-sans)"
    assert tokens["--font-family-paragraph"] == "var(--font-family-sans)"
    file = "GeistPixel-Square.woff2"

    assert File.read!(Path.join([@package_root, "priv/static/fonts", file])) ==
             File.read!(Path.join([@repository_root, "geist-font/GeistPixel/webfonts", file]))

    css = File.read!(Path.join(@repository_root, "design_system_tokens.css"))

    [face] =
      Regex.scan(~r/@font-face \{[^}]*font-family: "Geist Pixel Square";[^}]*\}/, css)
      |> List.flatten()

    assert face =~ "font-weight: 400;"
    assert face =~ "font-style: normal;"
    assert css =~ "font-synthesis: none;"
  end
end
