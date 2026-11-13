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

  test "every declared font is packaged at its same-origin URL, regular upright only" do
    css = File.read!(Path.join(@repository_root, "design_system_tokens.css"))
    faces = Regex.scan(~r/@font-face \{([^}]*)\}/, css, capture: :all_but_first)
    assert length(faces) == 2

    for [face] <- faces do
      [_, file] = Regex.run(~r{url\("/fonts/regent-ui/([^"]+)"\)}, face)
      assert File.exists?(Path.join([@package_root, "priv/static/fonts", file])), file
      assert face =~ "font-weight: 400;"
      assert face =~ "font-style: normal;"
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

    assert css =~
             "outline: var(--rg-ring-width) solid var(--color-focus); outline-offset: var(--rg-ring-offset);"

    assert css =~
             "outline: var(--rg-ring-width) solid Highlight; outline-offset: var(--rg-ring-offset);"
  end

  test "in light and dark, main buttons stand out from the page and their words read on them" do
    selectors =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    # Autolaunch's Tangerine is its brand fill, so it is held to the words target only.
    stands_out = ~w(platform patchbay techtree)

    for brand <- ~w(platform autolaunch patchbay techtree), theme <- ~w(light dark) do
      tokens =
        [
          ":root",
          ~s(:root[data-brand="#{brand}"]),
          ~s(:root[data-brand="#{brand}"][data-theme="#{theme}"])
        ]
        |> Enum.map(&Map.get(selectors, &1, %{}))
        |> Enum.reduce(&Map.merge(&2, &1))

      shade = &luminance(resolve(tokens, &1))
      fill = shade.("--color-button")
      site = "#{brand} in #{theme}"

      if brand in stands_out do
        assert contrast(fill, shade.("--color-bg")) >= 3, site
        assert contrast(fill, shade.("--color-surface")) >= 3, site
      end

      assert contrast(shade.("--color-fg-on-button"), fill) >= 4.5, site
    end
  end

  # Measured as the dataviz method measures a categorical palette: distance is OKLab
  # ΔE ×100, at least 15 for full colour vision and 8 under Machado, Oliveira and
  # Fernandes (2009) protanopia and deuteranopia at full severity.
  test "in light and dark, the eight category colours read on the page and a panel and stay apart" do
    selectors =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    for brand <- ~w(platform autolaunch patchbay techtree), theme <- ~w(light dark) do
      tokens =
        [
          ":root",
          ~s(:root[data-brand="#{brand}"]),
          ~s(:root[data-brand="#{brand}"][data-theme="#{theme}"])
        ]
        |> Enum.map(&Map.get(selectors, &1, %{}))
        |> Enum.reduce(&Map.merge(&2, &1))

      site = "#{brand} in #{theme}"
      [first | rest] = palette = for n <- 1..8, do: resolve(tokens, "--color-category-#{n}")

      # The first is the chart colour, so a one-part meter looks as a chart does.
      assert first == resolve(tokens, "--color-chart-line"), site

      for colour <- rest, ground <- ~w(--color-bg --color-surface) do
        ratio = contrast(luminance(colour), luminance(resolve(tokens, ground)))
        assert ratio >= 3, "#{site}: #{colour} on #{ground} is #{Float.round(ratio, 2)}:1"
      end

      for {a, i} <- Enum.with_index(palette), {b, j} <- Enum.with_index(palette), i < j do
        assert delta_e(a, b, :normal) >= 15, "#{site}: #{a} and #{b}"
      end

      # Neighbours in the bar, the eighth beside a ninth that starts again at the first.
      for {a, b} <- Enum.zip(palette, rest ++ [first]), vision <- [:protan, :deutan] do
        assert delta_e(a, b, vision) >= 8, "#{site}: #{a} and #{b} under #{vision}"
      end

      # A part is never taken for a status: an error, a success, a warning or a note.
      for colour <- rest,
          status <- ~w(--color-error --color-success --color-warning --color-info) do
        assert delta_e(colour, resolve(tokens, status), :normal) >= 15,
               "#{site}: #{colour} and #{status}"
      end
    end
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

  test "every role sets Geist Serif, packaged regular upright, and weight is never synthesized" do
    tokens =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> get_in(["selectors", ":root"])

    assert tokens["--font-family-serif"] == ~s("Geist Serif", serif)

    for role <- ~w(--font-family-title --font-family-ui --font-family-paragraph) do
      assert tokens[role] == "var(--font-family-serif)"
    end

    file = "GeistSerif-Regular.woff2"

    assert File.read!(Path.join([@package_root, "priv/static/fonts", file])) ==
             File.read!(Path.join([@repository_root, "geist-font/GeistSerif/webfonts", file]))

    css = File.read!(Path.join(@repository_root, "design_system_tokens.css"))

    [face] =
      Regex.scan(~r/@font-face \{[^}]*font-family: "Geist Serif";[^}]*\}/, css)
      |> List.flatten()

    assert face =~ "font-weight: 400;"
    assert face =~ "font-style: normal;"
    assert css =~ "font-synthesis-weight: none;"
  end

  defp resolve(tokens, name) do
    case Map.fetch!(tokens, name) do
      "var(" <> reference -> resolve(tokens, String.trim_trailing(reference, ")"))
      "#" <> _ = hex -> hex
    end
  end

  # Linear-light sRGB channels of a #RRGGBB colour.
  defp linear("#" <> hex) do
    for <<pair::binary-size(2) <- hex>> do
      channel = String.to_integer(pair, 16) / 255

      if channel <= 0.04045,
        do: channel / 12.92,
        else: :math.pow((channel + 0.055) / 1.055, 2.4)
    end
  end

  # WCAG relative luminance of a #RRGGBB colour.
  defp luminance(hex) do
    [r, g, b] = linear(hex)
    0.2126 * r + 0.7152 * g + 0.0722 * b
  end

  defp contrast(a, b), do: (max(a, b) + 0.05) / (min(a, b) + 0.05)

  @machado %{
    protan: [
      [0.152286, 1.052583, -0.204868],
      [0.114503, 0.786281, 0.099216],
      [-0.003882, -0.048116, 1.051998]
    ],
    deutan: [
      [0.367322, 0.860646, -0.227968],
      [0.280085, 0.672501, 0.047413],
      [-0.011820, 0.042940, 0.968881]
    ]
  }

  # A colour's linear channels as a reader with full colour vision, or with no
  # long-wavelength (protan) or middle-wavelength (deutan) cones, sees them.
  defp seen(hex, :normal), do: linear(hex)

  defp seen(hex, vision) do
    channels = linear(hex)

    for row <- Map.fetch!(@machado, vision) do
      row |> Enum.zip_with(channels, &*/2) |> Enum.sum() |> max(0.0) |> min(1.0)
    end
  end

  defp oklab([r, g, b]) do
    [l, m, s] =
      for [x, y, z] <- [
            [0.4122214708, 0.5363325363, 0.0514459929],
            [0.2119034982, 0.6806995451, 0.1073969566],
            [0.0883024619, 0.2817188376, 0.6299787005]
          ],
          do: :math.pow(x * r + y * g + z * b, 1 / 3)

    for [x, y, z] <- [
          [0.2104542553, 0.7936177850, -0.0040720468],
          [1.9779984951, -2.4285922050, 0.4505937099],
          [0.0259040371, 0.7827717662, -0.8086757660]
        ],
        do: x * l + y * m + z * s
  end

  # How far apart two colours look, as OKLab distance ×100.
  defp delta_e(a, b, vision) do
    oklab(seen(a, vision))
    |> Enum.zip_with(oklab(seen(b, vision)), &(&1 - &2))
    |> Enum.map(&(&1 * &1))
    |> Enum.sum()
    |> :math.sqrt()
    |> Kernel.*(100)
  end
end
