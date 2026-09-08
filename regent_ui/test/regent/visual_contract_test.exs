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

  test "packaged styles mirror the canonical sources" do
    for file <- ~w(design_system_tokens.css design_system_glass.css) do
      assert File.read!(Path.join(@repository_root, file)) ==
               File.read!(Path.join([@package_root, "assets/css", file]))
    end
  end

  test "all four products preserve palettes and assets without page background artwork" do
    selectors =
      @repository_root
      |> Path.join("design_system_tokens.json")
      |> File.read!()
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    for {brand, light, dark, source} <- [
          {"platform", "#F6F4EA", "#0B0B0B", "regents"},
          {"autolaunch", "#E5E3D2", "#0E0E0E", "autolaunch"},
          {"patchbay", "#F6F4EA", "#0F0F10", "patchbay"},
          {"techtree", "#F6F4EA", "#161616", "tech"}
        ],
        {mode, ground} <- [{"light", light}, {"dark", dark}] do
      tokens = Map.fetch!(selectors, ~s(:root[data-brand="#{brand}"][data-theme="#{mode}"]))
      assert tokens["--color-bg"] == ground
      file = "cutting-mat-100x100-#{source}-#{mode}.svg"
      assert tokens["--site-background-image"] == "none"

      assert File.read!(Path.join([@package_root, "priv/static/images", file])) ==
               File.read!(Path.join([@repository_root, "site svg backgrounds", file]))
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

  test "supporting roles use the other three identities as readable surface and ink pairs" do
    selectors =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> Map.fetch!("selectors")

    for {brand, primary} <- [
          {"platform", "charcoal"},
          {"autolaunch", "tangerine-tango"},
          {"patchbay", "platinum"},
          {"techtree", "powder-blue"}
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
  end

  test "selects reserve the shared 24px chevron gap and keep a forced-colors native affordance" do
    css = File.read!(Path.join(@package_root, "assets/css/primitives.css"))
    assert css =~ "--rg-select-chevron-inset: 24px;"
    assert css =~ "padding-right: calc(var(--rg-select-chevron-inset) + 24px);"
    assert css =~ "right var(--rg-select-chevron-inset) center"
    assert css =~ ".rg-field select { appearance: auto; background-image: none; }"
  end

  test "dark platform and Patchbay primary corners are finite palette strokes, not a new skin" do
    css = File.read!(Path.join(@package_root, "assets/css/primitives.css"))

    # The root theme owns decoration, including inside locally colored panels.
    selector =
      ~s|:root:is([data-brand="platform"], [data-brand="patchbay"])[data-theme="dark"] | <>
        ".rg-button:where(:not(.rg-button--secondary):not(.rg-button--quiet))::after"

    assert [_, decoration] =
             Regex.run(~r/#{Regex.escape(selector)}\s*\{([^}]+)\}/, css)

    assert decoration =~ ~s(content: "")
    assert decoration =~ "pointer-events: none"
    assert decoration =~ "position: absolute"
    assert decoration =~ "inset: 0"
    assert decoration =~ "z-index: -1"
    assert decoration =~ "background-repeat: no-repeat"

    # The two diagonal strips are inset from the existing 45-degree cuts;
    # square corners get only two short edge strokes each, never a full border.
    for angle <- [135, 315] do
      assert decoration =~ "linear-gradient(#{angle}deg,"
    end

    assert length(Regex.scan(~r/var\(--palette-tangerine-tango\)/, decoration)) == 2
    assert length(Regex.scan(~r/var\(--palette-powder-blue\)/, decoration)) == 4
    assert decoration =~ "calc(50% + 1px) calc(50% + 2px)"

    for corner <- ["left top", "right bottom"] do
      assert decoration =~ "#{corner} / var(--rg-cut-control) var(--rg-cut-control)"
    end

    for corner <- ["right top", "left bottom"] do
      assert decoration =~ "#{corner} / var(--rg-cut-control) 1px"
      assert decoration =~ "#{corner} / 1px var(--rg-cut-control)"
    end

    for forbidden <- ["border:", "clip-path:", "animation:", "transition:", "url("] do
      refute decoration =~ forbidden
    end
  end

  test "primary decoration is absent in forced colors without clipping focus or changing reflow" do
    css = File.read!(Path.join(@package_root, "assets/css/primitives.css"))

    assert css =~
             ~r/@media \(forced-colors: none\)\s*\{\s*:root:is\([^}]+::after\s*\{[^}]+\}\s*\}/s

    [_, host] = Regex.run(~r/\.rg-button \{([^}]+)\}/, css)
    assert host =~ "overflow: visible"
    assert host =~ "overflow-wrap: anywhere"
    assert host =~ "white-space: normal"
    refute host =~ "clip-path"
    assert css =~ ".rg-button { --rg-cut-control: 8px; }"
    assert css =~ "border: 1px solid ButtonText; color: ButtonText; background: ButtonFace;"
    assert css =~ ".rg-button:disabled { color: GrayText; opacity: 1; }"
    assert css =~ "outline: 2px solid var(--rg-p-text); outline-offset: 4px;"
    assert css =~ "outline-color: Highlight;"
  end

  test "enabled primary shimmer shares an inherited color, source shape and interaction-only motion" do
    css = File.read!(Path.join(@package_root, "assets/css/structure.css"))
    primitives = File.read!(Path.join(@package_root, "assets/css/primitives.css"))

    selector =
      ~s|.rg-button:where(:not(.rg-button--secondary):not(.rg-button--quiet)):not(:disabled):not([disabled]):not([aria-disabled="true"]):is(:hover, :focus-visible)::before|

    assert css =~ selector
    assert css =~ "@media (prefers-reduced-motion: no-preference) and (forced-colors: none)"

    assert css =~
             "linear-gradient(100deg, transparent 30%, color-mix(in srgb, var(--rg-shimmer-color, var(--rg-shimmer-ink)) 42%, transparent) 50%, transparent 70%)"

    assert css =~ "background-size: 300% 100%"
    assert css =~ "from { background-position: 160% 0; }"
    assert css =~ "to { background-position: -60% 0; }"

    assert css =~
             "animation: rg-shimmer var(--rg-shimmer-duration, 1.15s) var(--ease-out) infinite"

    assert primitives =~ "--rg-shimmer-ink: var(--rg-p-on-accent)"
    assert primitives =~ "background-color: var(--rg-p-accent)"

    # Public overrides must inherit from any ancestor, not be reset by a host default.
    refute css =~ ~r/--rg-shimmer-(color|duration):/
    refute primitives =~ ~r/--rg-shimmer-(color|duration):/
  end

  test "feature shimmer runs three times slower across the full media area, never across title or caption" do
    css = File.read!(Path.join(@package_root, "assets/css/structure.css"))
    component = File.read!(Path.join(@package_root, "lib/regent/structure.ex"))

    assert css =~
             ".rg-feature:is(:hover, :focus-within) > .rg-feature__face .rg-feature__shimmer::before"

    assert css =~ "animation-duration: calc(var(--rg-shimmer-duration, 1.15s) * 3)"
    assert css =~ "--rg-shimmer-ink: var(--rg-panel-ink)"
    assert component =~ ~s(<span class="rg-feature__shimmer" aria-hidden="true"></span>)
    assert component =~ ~r/<\.technical_figure>\s*<span class="rg-feature__shimmer"/
    [_, skin] = Regex.run(~r/\.rg-feature__shimmer \{([^}]+)\}/, css)
    assert skin =~ "pointer-events: none"
    assert skin =~ "position: absolute"
    assert skin =~ "z-index: 1"
    assert skin =~ "clip-path:"
    assert skin =~ "inset: 0"
    refute skin =~ "mask"
    refute skin =~ "padding:"
    refute css =~ "--rg-feature-highlight"
    assert css =~ ".rg-feature__shimmer { display: none; }"
  end

  test "capability bands retain subgrid reflow and contain arbitrary image proportions without clipping" do
    css = File.read!(Path.join(@package_root, "assets/css/structure.css"))
    assert css =~ ".rg-feature { display: grid; grid-row: span 3; grid-template-rows: subgrid;"

    assert css =~
             ".rg-feature__face { display: grid; grid-row: span 2; grid-template-rows: subgrid;"

    assert css =~ ".rg-feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }"

    assert css =~
             ".rg-split, .rg-hero, .rg-feature-grid { grid-template-columns: minmax(0, 1fr); }"

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

  test "titles use genuine regular Pixel Square while UI and prose use Mono" do
    tokens =
      File.read!(Path.join(@repository_root, "design_system_tokens.json"))
      |> Jason.decode!()
      |> get_in(["selectors", ":root"])

    assert tokens["--font-family-title"] =~ "Geist Pixel Square"
    assert tokens["--font-family-ui"] == "var(--font-family-mono)"
    assert tokens["--font-family-paragraph"] == "var(--font-family-mono)"
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
