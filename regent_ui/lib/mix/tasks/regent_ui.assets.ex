defmodule Mix.Tasks.RegentUi.Assets do
  @shortdoc "Copy Regent UI styles into the consuming application's asset directory"
  @moduledoc """
  Run before the consuming application's CSS build. Files are resolved through Mix's
  dependency paths, including isolated pinned dependencies. Output is generated and
  belongs in `.gitignore`: `assets/vendor/regent_ui/`.
  """
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    dependency = Mix.Project.deps_paths() |> Map.fetch!(:regent_ui)
    source = Path.join(dependency, "assets/css")
    destination = Path.join(File.cwd!(), "assets/vendor/regent_ui")
    File.mkdir_p!(destination)

    for file <- Path.wildcard(Path.join(source, "*.css")) do
      File.cp!(file, Path.join(destination, Path.basename(file)))
    end

    images = Path.join(File.cwd!(), "priv/static/images/regent-ui")
    File.mkdir_p!(images)

    for file <- Path.wildcard(Path.join(dependency, "priv/static/images/*.svg")) do
      File.cp!(file, Path.join(images, Path.basename(file)))
    end
  end
end
