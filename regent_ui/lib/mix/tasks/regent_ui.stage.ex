defmodule Mix.Tasks.RegentUi.Stage do
  @shortdoc "Stage the resolved UI package for an application-only Docker context"
  @moduledoc """
  Run before building a consuming application's release image. Exports only the
  declared package source into `vendor/regent_ui`; previous generated copies are
  preserved under `vendor/.regent-ui-history`. Ignore both paths in Git, and omit
  the history and `.regent-ui-stage-*` paths from Docker contexts.
  """
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    source = Mix.Project.deps_paths() |> Map.fetch!(:regent_ui)
    vendor = Path.expand("vendor")
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

    for entry <- ~w(lib assets priv mix.exs .formatter.exs),
        File.exists?(Path.join(source, entry)) do
      File.cp_r!(Path.join(source, entry), Path.join(staging, entry), dereference_symlinks: false)
    end

    File.write!(Path.join(staging, marker), "Generated from the resolved regent_ui dependency.\n")

    if File.exists?(destination) do
      history = Path.join(vendor, ".regent-ui-history")
      File.mkdir_p!(history)
      File.rename!(destination, Path.join(history, id))
    end

    File.rename!(staging, destination)
    Mix.shell().info("Staged regent_ui from the resolved dependency; no deployment performed")
  end
end
