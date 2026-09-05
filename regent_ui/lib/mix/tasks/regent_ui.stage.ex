defmodule Mix.Tasks.RegentUi.Stage do
  @shortdoc "Stage the resolved UI package for an application-only Docker context"
  @moduledoc """
  Run before building a consuming application's release image. Exports only the
  declared package source into `vendor/regent_ui`; previous generated copies are
  preserved under `vendor/.regent-ui-history`. Ignore both paths in Git, and omit
  the history and `.regent-ui-stage-*` paths from Docker contexts.
  """
  use Mix.Task

  @entries ~w(lib assets priv mix.exs .formatter.exs)

  @impl Mix.Task
  def run([]) do
    source = Mix.Project.deps_paths() |> Map.fetch!(:regent_ui)
    stage(source, System.get_env("REGENT_UI_REVISION"), Path.expand("vendor"))
  end

  @doc false
  def stage(source, revision, vendor) do
    snapshot = Path.dirname(source)

    unless is_binary(revision) and Regex.match?(~r/\A[0-9a-f]{40}\z/, revision) and
             File.read(Path.join(snapshot, ".regent-revision")) == {:ok, revision <> "\n"} do
      Mix.raise(
        "Stage requires a pinned workspace dependency and REGENT_UI_REVISION; run through worktree-run"
      )
    end

    expected =
      snapshot
      |> Path.join(".regent-files.json")
      |> File.read!()
      |> Jason.decode!()
      |> Map.filter(fn {name, _} ->
        Enum.any?(
          @entries,
          &(name == "regent_ui/#{&1}" or String.starts_with?(name, "regent_ui/#{&1}/"))
        )
      end)
      |> Map.new(fn {name, value} -> {String.replace_prefix(name, "regent_ui/", ""), value} end)

    destination = Path.join(vendor, "regent_ui")
    marker = ".regent-ui-generated"

    if File.exists?(destination) and not File.regular?(Path.join(destination, marker)) do
      Mix.raise("Refusing to replace an unrecognized vendor/regent_ui directory")
    end

    case File.lstat(destination) do
      {:ok, %{type: :symlink}} -> Mix.raise("Refusing a symlinked staging destination")
      _ -> :ok
    end

    id = Integer.to_string(System.system_time(:nanosecond))
    staging = Path.join(vendor, ".regent-ui-stage-#{id}")
    File.mkdir_p!(staging)

    for entry <- @entries,
        File.exists?(Path.join(source, entry)) do
      File.cp_r!(Path.join(source, entry), Path.join(staging, entry), dereference_symlinks: false)
    end

    actual = package_files(staging)

    unless map_size(expected) > 0 and actual == expected do
      Mix.raise(
        "Shared UI package differs from the pinned snapshot; staged candidate preserved for inspection"
      )
    end

    digest =
      actual
      |> Enum.sort()
      |> Enum.map(fn {name, value} -> [name, value["sha256"]] end)
      |> Jason.encode!()
      |> sha256()

    evidence = Jason.encode!(%{revision: revision, sha256: digest}, pretty: true) <> "\n"
    File.write!(Path.join(staging, marker), evidence)

    if File.exists?(destination) do
      history = Path.join(vendor, ".regent-ui-history")
      File.mkdir_p!(history)
      File.rename!(destination, Path.join(history, id))
    end

    File.rename!(staging, destination)

    Mix.shell().info(
      "Staged regent_ui revision #{revision}, content SHA256 #{digest}; no deployment performed"
    )
  end

  defp package_files(directory) do
    directory
    |> Path.join("**/*")
    |> Path.wildcard(match_dot: true)
    |> Enum.reject(&(File.lstat!(&1).type == :directory))
    |> Map.new(fn path ->
      if File.lstat!(path).type != :regular do
        Mix.raise("Shared UI package must contain regular files only")
      end

      {Path.relative_to(path, directory),
       %{"kind" => "file", "sha256" => sha256(File.read!(path))}}
    end)
  end

  defp sha256(value), do: :crypto.hash(:sha256, value) |> Base.encode16(case: :lower)
end
