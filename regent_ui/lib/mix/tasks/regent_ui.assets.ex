defmodule Mix.Tasks.RegentUi.Assets do
  @shortdoc "Copy Regent UI styles into the consuming application's asset directory"
  @moduledoc """
  Run before the consuming application's CSS build. Files are resolved through Mix's
  dependency paths, including isolated pinned dependencies. Output is generated and
  belongs in `.gitignore`: `assets/vendor/regent_ui/`, `priv/static/images/regent-ui/`
  and `priv/static/fonts/regent-ui/`. The packaged CSS declares its fonts at
  `/fonts/regent-ui/<file>`, so the application must serve `priv/static/fonts`.
  """
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    dependency = Mix.Project.deps_paths() |> Map.fetch!(:regent_ui)
    source = Path.join(dependency, "assets/css")
    destination = Path.join(File.cwd!(), "assets/vendor/regent_ui")
    File.mkdir_p!(destination)

    for extension <- ~w(css json),
        file <- Path.wildcard(Path.join(source, "*.#{extension}")) do
      File.cp!(file, Path.join(destination, Path.basename(file)))
    end

    for file <- Path.wildcard(Path.join(dependency, "assets/js/profile.*")) do
      File.cp!(file, Path.join(destination, Path.basename(file)))
    end

    for {source, destination} <- [
          {"priv/static/images/*.svg", "priv/static/images/regent-ui"},
          {"priv/static/fonts/*", "priv/static/fonts/regent-ui"}
        ] do
      target = Path.join(File.cwd!(), destination)
      File.mkdir_p!(target)

      for file <- Path.wildcard(Path.join(dependency, source)) do
        File.cp!(file, Path.join(target, Path.basename(file)))
      end
    end
  end
end
