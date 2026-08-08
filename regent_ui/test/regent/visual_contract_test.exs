defmodule Regent.VisualContractTest do
  use ExUnit.Case, async: true

  @package_root Path.expand("../..", __DIR__)
  @repository_root Path.expand("..", @package_root)
  @css_directory Path.join(@package_root, "assets/css")

  test "packaged CSS layers exactly mirror the canonical roots" do
    assert read_repository("design_system_tokens.css") ==
             read_package_css("design_system_tokens.css")

    assert read_repository("design_system_glass.css") ==
             read_package_css("design_system_glass.css")
  end

  test "generated JSON carries the exact semantic shell timings" do
    root_tokens =
      @repository_root
      |> Path.join("design_system_tokens.json")
      |> File.read!()
      |> Jason.decode!()
      |> get_in(["selectors", ":root"])

    assert root_tokens["--shell-duration-interruption"] == "100ms"
    assert root_tokens["--shell-duration-exit"] == "180ms"
    assert root_tokens["--shell-duration-entrance"] == "200ms"
    assert root_tokens["--shell-duration-border-settle"] == "100ms"
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

  test "the existing package declaration includes every consumer CSS file" do
    package_files = Mix.Project.config() |> Keyword.fetch!(:package) |> Keyword.fetch!(:files)

    assert "assets" in package_files

    for file <- ~w(regent.css design_system_tokens.css design_system_glass.css) do
      assert File.regular?(Path.join(@css_directory, file))
    end
  end

  test "canonical tokens retain all three light and dark app background families" do
    css = read_repository("design_system_tokens.css")

    for brand <- ~w(platform techtree autolaunch), theme <- ~w(light dark) do
      assert css =~ ~s(:root[data-brand="#{brand}"][data-theme="#{theme}"])
    end
  end

  test "style guide freezes the shell layout, motion, reduced-motion, and landing boundaries" do
    style = read_repository("STYLE.md")

    for contract <- [
          "one persistent viewport",
          "Document scrolling is disabled",
          "internal scrolling",
          "stable routed task context",
          "`65–80ch`",
          "neutral Regent/Platform, Techtree,\nor Autolaunch",
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

  defp read_repository(file), do: @repository_root |> Path.join(file) |> File.read!()
  defp read_package_css(file), do: @css_directory |> Path.join(file) |> File.read!()
end
