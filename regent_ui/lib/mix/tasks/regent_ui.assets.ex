defmodule Mix.Tasks.RegentUi.Assets do
  @shortdoc "Copy Regent UI styles into the consuming application's asset directory"
  @moduledoc """
  Run before the consuming application's CSS build. Files are resolved through Mix's
  dependency paths, including isolated pinned dependencies. Output is generated and
  belongs in `.gitignore`: `assets/vendor/regent_ui/` and `priv/static/fonts/regent-ui/`.
  The packaged CSS declares its fonts at `/fonts/regent-ui/<file>`, so the application
  must serve `priv/static/fonts`.
  """
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    dependency = Mix.Project.deps_paths() |> Map.fetch!(:regent_ui)
    source = Path.join(dependency, "assets/css")
    destination = Path.join(File.cwd!(), "assets/vendor/regent_ui")
    # The directory is fully generated; clearing it keeps retired files from lingering.
    File.rm_rf!(destination)
    File.mkdir_p!(destination)

    for extension <- ~w(css json),
        file <- Path.wildcard(Path.join(source, "*.#{extension}")) do
      File.cp!(file, Path.join(destination, Path.basename(file)))
    end

    for pattern <- ["profile.*", "blog.mjs", "holographic_card.*"],
        file <- Path.wildcard(Path.join(dependency, "assets/js/#{pattern}")) do
      File.cp!(file, Path.join(destination, Path.basename(file)))
    end

    fonts = Path.join(File.cwd!(), "priv/static/fonts/regent-ui")
    File.mkdir_p!(fonts)

    for file <- Path.wildcard(Path.join(dependency, "priv/static/fonts/*")) do
      File.cp!(file, Path.join(fonts, Path.basename(file)))
    end
  end
end
