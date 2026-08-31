defmodule Regent.VisualContractTest do
  use ExUnit.Case, async: true

  @package_root Path.expand("../..", __DIR__)
  @repository_root Path.expand("..", @package_root)
  @css_directory Path.join(@package_root, "assets/css")
  @js_directory Path.join(@package_root, "assets/js")

  @palette %{
    "--palette-tangerine-tango" => "#FF5B19",
    "--palette-charcoal" => "#161616",
    "--palette-platinum" => "#E5E3D2",
    "--palette-powder-blue" => "#AECACD"
  }

  @brand_contract %{
    "platform" => %{
      "--color-bg" => "#161616",
      "--color-surface" => "#20201E",
      "--color-surface-elevated" => "#2A2A27",
      "--color-border" => "#57564F",
      "--color-fg" => "#E5E3D2",
      "--color-fg-muted" => "#AAA99C",
      "--color-accent" => "#AECACD",
      "--color-accent-secondary" => "#FF5B19",
      "--color-fg-on-accent" => "#161616",
      "--color-success" => "#7ED8A9",
      "--color-error" => "#FF9B8F",
      "--color-warning" => "#F5C16C",
      "--color-info" => "#AECACD",
      "--brand-accent" => "#FF5B19"
    },
    "autolaunch" => %{
      "--color-bg" => "#FF5B19",
      "--color-surface" => "#FF7A45",
      "--color-surface-elevated" => "#E5E3D2",
      "--color-border" => "#161616",
      "--color-fg" => "#000000",
      "--color-fg-muted" => "#4F1600",
      "--color-accent" => "#161616",
      "--color-accent-secondary" => "#AECACD",
      "--color-fg-on-accent" => "#E5E3D2",
      "--color-success" => "#053022",
      "--color-error" => "#5A0B0B",
      "--color-warning" => "#3D1B00",
      "--color-info" => "#072C38",
      "--brand-accent" => "#AECACD"
    },
    "techtree" => %{
      "--color-bg" => "#AECACD",
      "--color-surface" => "#C4D8DA",
      "--color-surface-elevated" => "#E5E3D2",
      "--color-border" => "#3F4F51",
      "--color-fg" => "#161616",
      "--color-fg-muted" => "#3F4F51",
      "--color-accent" => "#161616",
      "--color-accent-secondary" => "#FF5B19",
      "--color-fg-on-accent" => "#E5E3D2",
      "--color-success" => "#053022",
      "--color-error" => "#5A0B0B",
      "--color-warning" => "#3D1B00",
      "--color-info" => "#072C38",
      "--brand-accent" => "#FF5B19"
    }
  }

  @color_schemes %{"platform" => "dark", "autolaunch" => "light", "techtree" => "light"}

  # regent.css fallbacks cover the moment before the canonical token layer resolves,
  # so each one must stand in for the Platform token it shadows.
  @package_fallback_sources %{
    "--color-accent" => "--color-accent",
    "--color-bg" => "--color-bg",
    "--color-error" => "--color-error",
    "--color-fg-muted" => "--color-fg-muted",
    "--color-info" => "--color-info",
    "--color-warning" => "--color-warning",
    "--glass-border-subtle" => "--color-border",
    "--glass-surface" => "--color-surface",
    "--glass-text-accent" => "--color-accent",
    "--glass-text-primary" => "--color-fg",
    "--glass-text-secondary" => "--color-fg-muted"
  }

  test "packaged CSS layers exactly mirror the canonical roots" do
    assert read_repository("design_system_tokens.css") ==
             read_package_css("design_system_tokens.css")

    assert read_repository("design_system_glass.css") ==
             read_package_css("design_system_glass.css")
  end

  test "generated JSON carries the exact canonical four-color palette" do
    root = selectors()[":root"]

    for {token, value} <- @palette, do: assert(root[token] == value)
  end

  test "generated JSON carries the exact semantic shell timings" do
    root = selectors()[":root"]

    assert root["--shell-duration-interruption"] == "100ms"
    assert root["--shell-duration-exit"] == "180ms"
    assert root["--shell-duration-entrance"] == "200ms"
    assert root["--shell-duration-border-settle"] == "100ms"
  end

  test "every brand grounds both theme selectors in the same founder colors" do
    selectors = selectors()

    for {brand, contract} <- @brand_contract,
        theme <- ~w(light dark),
        {token, value} <- contract do
      assert {brand, theme, token, resolve(selectors, brand, theme, token)} ==
               {brand, theme, token, value}
    end
  end

  # The generator carries only custom properties, so color-scheme is asserted at the source.
  test "each product pins its own color-scheme in both theme selectors" do
    declared =
      ~r/:root\[data-brand="(\w+)"\]\[data-theme="(\w+)"\]\s*\{\s*color-scheme:\s*(\w+);/
      |> Regex.scan(read_repository("design_system_tokens.css"), capture: :all_but_first)
      |> Map.new(fn [brand, theme, scheme] -> {{brand, theme}, scheme} end)

    for {brand, scheme} <- @color_schemes, theme <- ~w(light dark) do
      assert {brand, theme, declared[{brand, theme}]} == {brand, theme, scheme}
    end
  end

  test "generated tokens retain all three light and dark app background families" do
    selectors = selectors()

    for brand <- Map.keys(@brand_contract), theme <- ~w(light dark) do
      assert Map.has_key?(selectors, ~s(:root[data-brand="#{brand}"][data-theme="#{theme}"]))
    end
  end

  test "the single consumer entry resolves only package-local visual layers" do
    entry = read_package_css("regent.css")

    imports =
      ~r/^@import\s+"([^"]+)";/m
      |> Regex.scan(entry, capture: :all_but_first)
      |> List.flatten()

    assert imports == ["./design_system_tokens.css", "./design_system_glass.css"]

    combined =
      imports
      |> Enum.map(fn import -> import |> Path.basename() |> read_package_css() end)
      |> Kernel.++([entry])
      |> Enum.join("\n")

    assert combined =~ "--shell-duration-interruption: 100ms"
    assert combined =~ "--shell-duration-exit: 180ms"
    assert combined =~ "--shell-duration-entrance: 200ms"
    assert combined =~ "--shell-duration-border-settle: 100ms"
    assert combined =~ ".rg-app-shell"
  end

  test "package-local colour fallbacks stand in for the Platform ground" do
    selectors = selectors()

    fallbacks =
      ~r/var\((--[\w-]+),\s*(#[0-9A-Fa-f]{6})\)/
      |> Regex.scan(read_package_css("regent.css"), capture: :all_but_first)
      |> Map.new(fn [token, value] -> {token, value} end)

    assert Map.keys(fallbacks) == Map.keys(@package_fallback_sources)

    for {token, source} <- @package_fallback_sources do
      assert {token, fallbacks[token]} == {token, resolve(selectors, "platform", "dark", source)}
    end
  end

  test "the existing package declaration includes every consumer CSS file" do
    package_files = Mix.Project.config() |> Keyword.fetch!(:package) |> Keyword.fetch!(:files)

    assert "assets" in package_files

    for file <- ~w(regent.css design_system_tokens.css design_system_glass.css) do
      assert File.regular?(Path.join(@css_directory, file))
    end
  end

  test "scene errors are announced atomically" do
    mount = read_package_js("svg_mount.ts")

    assert mount =~ ~s|wrapper.setAttribute("role", "alert")|
    assert mount =~ ~s|wrapper.setAttribute("aria-atomic", "true")|
  end

  test "sigil focus remains visible without persistent filter promotion" do
    css = read_package_css("regent.css")

    assert css =~ ".rg-sigil-marker:focus-visible"
    assert css =~ ".rg-collateral-replayable:focus-visible"
    assert css =~ "outline: 2px solid var(--rg-node-stroke-focused)"
    assert css =~ ".rg-hover-cycle-target.is-hover-cycling"
    assert css =~ "will-change: transform, opacity"
    refute css =~ "filter var(--duration-fast"
    refute css =~ "will-change: transform, opacity, filter"
  end

  test "style guide freezes the shell layout, motion, reduced-motion, and landing boundaries" do
    style = read_repository("STYLE.md")

    for contract <- [
          "one persistent viewport",
          "Document scrolling is disabled",
          "internal scrolling",
          "stable routed task context",
          "`65–80ch`",
          "Charcoal Regent/Platform, Powder Blue\nTechtree, or Tangerine Autolaunch",
          "keeps its assigned ground in both theme choices",
          "sequential and non-overlapping",
          "outgoing DOM clone",
          "nested\nduplicate slide",
          "Movement is limited to transform and opacity",
          "OS `prefers-reduced-motion` wins",
          "Account opt-in cannot override the OS preference",
          "separate `/` marketing landing page is always light",
          "no theme control",
          "without a dark flash",
          "RegentUI is presentation only"
        ] do
      assert style =~ contract
    end

    refute style =~ "Marketing surfaces may pin themselves dark"
    refute style =~ "landing's `.rl-root`"
  end

  defp selectors do
    @repository_root
    |> Path.join("design_system_tokens.json")
    |> File.read!()
    |> Jason.decode!()
    |> Map.fetch!("selectors")
  end

  defp resolve(selectors, brand, theme, token) do
    selectors[":root"]
    |> Map.merge(selectors[~s(:root[data-brand="#{brand}"][data-theme="#{theme}"])])
    |> dereference(token)
  end

  defp dereference(scope, token) do
    case scope[token] do
      "var(" <> reference -> dereference(scope, String.trim_trailing(reference, ")"))
      value -> value
    end
  end

  defp read_repository(file), do: @repository_root |> Path.join(file) |> File.read!()
  defp read_package_css(file), do: @css_directory |> Path.join(file) |> File.read!()
  defp read_package_js(file), do: @js_directory |> Path.join(file) |> File.read!()
end
