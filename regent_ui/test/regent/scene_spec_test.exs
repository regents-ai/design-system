defmodule Regent.SceneSpecTest do
  use ExUnit.Case, async: true

  alias Regent.SceneSpec

  describe "scene/5" do
    test "builds the scene envelope with camera defaults" do
      face = SceneSpec.face("face-1", "Face", "sigil", [], [])
      scene = SceneSpec.scene("demo", "regent", "face-1", face)

      assert scene["app"] == "demo"
      assert scene["theme"] == "regent"
      assert scene["activeFace"] == "face-1"
      assert scene["sceneVersion"] == 1
      assert scene["camera"] == %{"type" => "oblique", "angle" => 315, "distance" => 24}
      assert scene["faces"] == [face]
      refute Map.has_key?(scene, "meta")
    end

    test "includes optional keys only when given" do
      face = SceneSpec.face("face-1", "Face", "sigil", [], [])

      scene =
        SceneSpec.scene("demo", "regent", "face-1", face,
          scene_version: 7,
          distance: 30,
          camera_target_id: "node-1",
          meta: %{"a" => 1}
        )

      assert scene["sceneVersion"] == 7
      assert scene["camera"]["distance"] == 30
      assert scene["cameraTargetId"] == "node-1"
      assert scene["meta"] == %{"a" => 1}
    end
  end

  describe "face/6" do
    test "builds a face map with orientation default" do
      face = SceneSpec.face("face-1", "Title", "sigil-x", [:cmd], [:marker])

      assert face == %{
               "id" => "face-1",
               "title" => "Title",
               "sigil" => "sigil-x",
               "orientation" => "front",
               "landmarkTargetId" => nil,
               "commands" => [:cmd],
               "markers" => [:marker]
             }
    end
  end

  describe "command builders" do
    test "add_box/4 builds an add box command" do
      command = SceneSpec.add_box("box-1", [0, 0, 0], [2, 2, 2], style: %{"default" => %{}})

      assert command["id"] == "box-1"
      assert command["primitive"] == "box"
      assert command["op"] == "add"
      assert command["position"] == [0, 0, 0]
      assert command["size"] == [2, 2, 2]
      assert command["style"] == %{"default" => %{}}
      refute Map.has_key?(command, "mode")
    end

    test "remove_box/4 builds a remove box command" do
      command = SceneSpec.remove_box("box-1", [0, 0, 0], [2, 2, 2])

      assert command["primitive"] == "box"
      assert command["op"] == "remove"
    end

    test "add_sphere/4 builds an add sphere command" do
      command = SceneSpec.add_sphere("sphere-1", [1, 1, 1], 2)

      assert command["primitive"] == "sphere"
      assert command["op"] == "add"
      assert command["center"] == [1, 1, 1]
      assert command["radius"] == 2
    end

    test "add_line/4 builds an add line command" do
      command = SceneSpec.add_line("line-1", [0, 0, 0], [3, 0, 0])

      assert command["primitive"] == "line"
      assert command["op"] == "add"
      assert command["from"] == [0, 0, 0]
      assert command["to"] == [3, 0, 0]
    end
  end

  describe "marker/2" do
    test "drops nil values and keeps provided ones" do
      marker = SceneSpec.marker("marker-1", label: "Node", status: "active")

      assert marker == %{
               "id" => "marker-1",
               "label" => "Node",
               "status" => "active",
               "meta" => %{}
             }
    end
  end

  describe "styles" do
    test "node_style/1 returns a default fill/stroke map per status" do
      assert %{"default" => %{"fill" => _, "stroke" => _}} = SceneSpec.node_style("active")
      assert %{"default" => %{"fill" => _, "stroke" => _}} = SceneSpec.node_style("unknown")
    end

    test "ghost_style/0 returns a dashed transparent style" do
      assert SceneSpec.ghost_style() == %{
               "default" => %{
                 "fill" => "none",
                 "stroke" => "var(--rg-node-stroke-ghost, #7a88a8)",
                 "opacity" => 0.6,
                 "strokeDasharray" => "3 2"
               }
             }
    end

    test "intent_style/2 overlays intent stroke onto a base style" do
      base = %{"default" => %{"fill" => "red"}}
      styled = SceneSpec.intent_style(base, "navigate")

      assert styled["default"]["fill"] == "red"
      assert styled["default"]["stroke"] == "var(--rg-intent-stroke-navigate, #79c5ff)"
      assert SceneSpec.intent_style(base, nil) == base
    end
  end

  describe "geometry helpers" do
    test "center_from_box/2 computes grid-aligned centers" do
      assert SceneSpec.center_from_box([0, 0, 0], [3, 3, 3]) == [1, 1, 2]
      assert SceneSpec.center_from_box([2, 2, 0], 1) == [2, 2, 0]
    end

    test "anchor/2 delegates to center_from_box/2" do
      assert SceneSpec.anchor([0, 0, 0], [3, 3, 3]) ==
               SceneSpec.center_from_box([0, 0, 0], [3, 3, 3])
    end

    test "sphere_center/2 and sphere_radius/1 derive sphere geometry" do
      assert SceneSpec.sphere_center([0, 0, 0], [2, 4, 6]) == [1.0, 2.0, 3.0]
      assert SceneSpec.sphere_radius([2, 4, 6]) == 3.0
    end

    test "inset_position/1 and inset_size/1 shrink a box" do
      assert SceneSpec.inset_position([1, 1, 1]) == [2, 2, 1]
      assert SceneSpec.inset_size([4, 4, 4]) == [2, 2, 3]
      assert SceneSpec.inset_size([1, 1, 1]) == [1, 1, 1]
    end
  end
end
