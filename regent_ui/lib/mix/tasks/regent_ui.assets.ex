defmodule Mix.Tasks.RegentUi.Assets do
  @shortdoc "Copy Regent UI styles into the consuming application's asset directory"
  @moduledoc """
  Run before the consuming application's CSS build. Files are resolved through Mix's
  dependency paths, including isolated pinned dependencies. Output is generated and
  belongs in `.gitignore`: `assets/vendor/regent_ui/`, `priv/static/fonts/regent-ui/`
  and `priv/static/images/regent-ui/`. The packaged CSS declares its fonts at
  `/fonts/regent-ui/<file>` and the components show pictures from
  `/images/regent-ui/<path>`, so the application must serve `priv/static/fonts` and
  `priv/static/images`.
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

    for pattern <- [
          "profile.*",
          "blog.mjs",
          "discussion.mjs",
          "holographic_card.*",
          "pill_select.mjs",
          "tip.mjs"
        ],
        file <- Path.wildcard(Path.join(dependency, "assets/js/#{pattern}")) do
      File.cp!(file, Path.join(destination, Path.basename(file)))
    end

    fonts = Path.join(File.cwd!(), "priv/static/fonts/regent-ui")
    File.mkdir_p!(fonts)

    for file <- Path.wildcard(Path.join(dependency, "priv/static/fonts/*")) do
      File.cp!(file, Path.join(fonts, Path.basename(file)))
    end

    pictures = Path.join(dependency, "priv/static/images")
    images = Path.join(File.cwd!(), "priv/static/images/regent-ui")
    File.rm_rf!(images)

    for file <- Path.wildcard(Path.join(pictures, "**/*.*")) do
      target = Path.join(images, Path.relative_to(file, pictures))
      File.mkdir_p!(Path.dirname(target))
      File.cp!(file, target)
    end
  end
end
