defmodule Mix.Tasks.RegentUi.StageTest do
  use ExUnit.Case, async: false

  setup do
    root =
      Path.join(System.tmp_dir!(), "regent-ui-stage-test-#{System.unique_integer([:positive])}")

    source = Path.join(root, "snapshot/regent_ui")
    application = Path.join(root, "application")
    File.mkdir_p!(source)
    File.mkdir_p!(application)
    revision = String.duplicate("a", 40)
    File.write!(Path.join(root, "snapshot/.regent-revision"), revision <> "\n")
    File.write!(Path.join(source, "mix.exs"), "# package source\n")
    digest = :crypto.hash(:sha256, "# package source\n") |> Base.encode16(case: :lower)

    File.write!(
      Path.join(root, "snapshot/.regent-files.json"),
      Jason.encode!(%{"regent_ui/mix.exs" => %{"kind" => "file", "sha256" => digest}})
    )

    on_exit(fn -> File.rm_rf!(root) end)

    %{source: source, application: application, revision: revision}
  end

  defp stage(context) do
    Mix.Tasks.RegentUi.Stage.stage(
      context.source,
      context.revision,
      Path.join(context.application, "vendor")
    )
  end

  test "exports verified files and records reproducible evidence, preserving the prior copy",
       context do
    stage(context)
    destination = Path.join(context.application, "vendor/regent_ui")
    evidence = File.read!(Path.join(destination, ".regent-ui-generated")) |> Jason.decode!()
    assert evidence["revision"] == context.revision
    assert byte_size(evidence["sha256"]) == 64
    assert File.read!(Path.join(destination, "mix.exs")) == "# package source\n"
    stage(context)

    assert File.read!(Path.join(destination, ".regent-ui-generated")) |> Jason.decode!() ==
             evidence

    assert [_] = Path.wildcard(Path.join(context.application, "vendor/.regent-ui-history/*"))
  end

  test "rejects a revision mismatch before staging", context do
    context = %{context | revision: String.duplicate("b", 40)}
    assert_raise Mix.Error, ~r/requires a pinned workspace/, fn -> stage(context) end
    refute File.exists?(Path.join(context.application, "vendor"))
  end

  test "rejects changed content without replacing a previously verified package", context do
    stage(context)
    File.write!(Path.join(context.source, "mix.exs"), "# unrecorded change\n")

    assert_raise Mix.Error, ~r/differs from the pinned snapshot/, fn ->
      stage(context)
    end

    assert File.read!(Path.join(context.application, "vendor/regent_ui/mix.exs")) ==
             "# package source\n"
  end

  test "preserves an unrecognized destination", context do
    destination = Path.join(context.application, "vendor/regent_ui")
    File.mkdir_p!(destination)
    File.write!(Path.join(destination, "user-file"), "keep me")
    assert_raise Mix.Error, ~r/unrecognized/, fn -> stage(context) end
    assert File.read!(Path.join(destination, "user-file")) == "keep me"
  end
end
