defmodule Regent.VisualContractTest do
  use ExUnit.Case, async: true
  @package_root Path.expand("../..", __DIR__)
  @repository_root Path.expand("..", @package_root)

  test "packaged styles mirror the canonical sources" do
    for file <- ~w(design_system_tokens.css design_system_glass.css) do
      assert File.read!(Path.join(@repository_root, file)) ==
               File.read!(Path.join([@package_root, "assets/css", file]))
    end
  end

  test "all four products have approved light and dark grounds and packaged backgrounds" do
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
      assert tokens["--site-background-image"] =~ file

      assert File.read!(Path.join([@package_root, "priv/static/images", file])) ==
               File.read!(Path.join([@repository_root, "site svg backgrounds", file]))
    end
  end

  test "every declared font is packaged at its same-origin URL with only 400 and 600 weights" do
    css = File.read!(Path.join(@repository_root, "design_system_tokens.css"))
    faces = Regex.scan(~r/@font-face \{([^}]*)\}/, css, capture: :all_but_first)
    assert length(faces) == 8

    for [face] <- faces do
      [_, file] = Regex.run(~r{url\("/fonts/regent-ui/([^"]+)"\)}, face)
      assert File.exists?(Path.join([@package_root, "priv/static/fonts", file])), file
      assert face =~ ~r/font-weight: (400|600);/
      assert face =~ ~r/font-style: (normal|italic);/
    end

    assert File.exists?(Path.join(@package_root, "priv/static/fonts/OFL.txt"))
  end
end
