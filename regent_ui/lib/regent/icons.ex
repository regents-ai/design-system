defmodule Regent.Icons do
  @moduledoc """
  Every icon a Regent page draws: the Lucide set, read from `icons/lucide` when the
  library compiles, at the library's one line weight.
  """
  use Phoenix.Component

  @paths "../../icons/lucide/*.svg" |> Path.expand(__DIR__) |> Path.wildcard()

  for path <- @paths do
    @external_resource path
  end

  @icons Map.new(@paths, fn path ->
           [_svg, shapes] = Regex.run(~r{<svg[^>]*>(.*)</svg>}s, File.read!(path))
           {Path.basename(path, ".svg"), String.replace(shapes, ~r/\s*\n\s*/, "")}
         end)

  attr :name, :string, required: true, values: Map.keys(@icons), doc: "the Lucide name"
  attr :class, :any, default: nil
  attr :rest, :global

  @doc """
  The named Lucide icon, one line of text tall and centred on the words beside it.
  It takes the colour of the text. A page sizes it with `font-size` or its own class.
  """
  def icon(assigns) do
    assigns = assign(assigns, :shapes, Map.fetch!(@icons, assigns.name))

    ~H"""
    <svg
      class={["rg-icon", @class]}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
      {@rest}
    >
      {Phoenix.HTML.raw(@shapes)}
    </svg>
    """
  end
end
