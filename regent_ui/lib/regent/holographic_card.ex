defmodule Regent.HolographicCard do
  @moduledoc """
  A graphite foil card that answers the pointer with pearlescent light.

  The component renders the card's face, a stage for the application's WebGPU
  renderer and the caller's content on top. Without a renderer the static foil
  in `holographic_card.css` stands, so the card reads the same on every visitor's
  screen. Applications own the mount: `assets/js/holographic_card.mjs` exports the
  renderer, and the consumer binds it to `[data-holo-canvas]` with its own hook,
  writes the tilt to `--rg-holo-tilt-x` / `--rg-holo-tilt-y` and marks the root
  `data-holo-ready="true"` once the GPU has drawn.

  `foil/1` is the same stage for a surface that is not the whole card: the face
  of a panel (`class="rg-holo-foil--face"` inside a panel marked
  `rg-holo-ground`) or the ink of a line drawing (`class="rg-holo-foil--ink"`
  beside the drawing in a technical figure). The element the application mounts
  carries `rg-holo-tilt` when it should turn with the pointer.
  """
  use Phoenix.Component

  attr :id, :string, required: true
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def card(assigns) do
    ~H"""
    <div id={@id} class={["rg-holo", @class]} {@rest}>
      <div id={"#{@id}-stage"} class="rg-holo__stage" phx-update="ignore" aria-hidden="true">
        <canvas class="rg-holo__canvas" data-holo-canvas></canvas>
      </div>
      <div class="rg-holo__content">{render_slot(@inner_block)}</div>
    </div>
    """
  end

  attr :id, :string, required: true
  attr :class, :any, default: nil

  def foil(assigns) do
    ~H"""
    <div id={@id} class={["rg-holo-foil", @class]} phx-update="ignore" aria-hidden="true">
      <canvas class="rg-holo-foil__canvas" data-holo-canvas></canvas>
    </div>
    """
  end
end
