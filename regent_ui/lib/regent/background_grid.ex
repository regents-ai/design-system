defmodule Regent.BackgroundGrid do
  use Phoenix.Component

  @moduledoc """
  Decorative grid backdrop placed behind Regent surfaces.
  """

  attr :id, :string, required: true
  attr :class, :any, default: nil
  attr :rest, :global

  @doc """
  Renders a decorative grid backdrop (hidden from assistive technology).
  """
  def background_grid(assigns) do
    ~H"""
    <div id={@id} class={["rg-background-grid", @class]} aria-hidden="true" {@rest} />
    """
  end
end
