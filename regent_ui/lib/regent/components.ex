defmodule Regent.Components do
  use Phoenix.Component

  @moduledoc """
  Canonical grouped Regent function components for the spatial layer.
  """

  attr :id, :string, required: true
  attr :scene, :map, default: %{}
  attr :scene_json, :string, default: nil
  attr :active_face, :string, default: nil
  attr :selected_target_id, :string, default: nil
  attr :scene_version, :integer, default: 0
  attr :camera_type, :string, default: "oblique"
  attr :camera_angle, :integer, default: 315
  attr :camera_distance, :integer, default: 25
  attr :theme, :string, default: "regent"
  attr :hook, :string, default: "RegentScene"
  attr :class, :string, default: nil
  attr :sigil_pack_url, :string, default: "/regent/sigils/regent-sigils.svg"
  attr :rest, :global

  slot :header_strip
  slot :left_rail
  slot :right_rail
  slot :chamber
  slot :ledger

  @doc """
  Renders a Regent spatial surface: a scene container driven by the `RegentScene`
  hook, framed by optional layout slots.

  The scene itself is rendered client-side from `scene` (a `Regent.SceneSpec` map)
  or a pre-encoded `scene_json` string. The slots compose the chrome around it:
  `header_strip` across the top, `left_rail`/`right_rail` down the sides, and
  `chamber`/`ledger` panels below the scene.

  ## Example

      <.surface id="home-surface" scene={@scene} active_face={@active_face}>
        <:header_strip>
          <h1>Launch console</h1>
        </:header_strip>
        <:left_rail>
          <nav>Section links</nav>
        </:left_rail>
        <:chamber>
          <.chamber id="home-chamber" title="Current step">
            Step details go here.
          </.chamber>
        </:chamber>
        <:ledger>
          <.ledger id="home-ledger" title="Summary">
            Reference table goes here.
          </.ledger>
        </:ledger>
      </.surface>
  """
  def surface(assigns) do
    assigns =
      assign(
        assigns,
        :scene_json,
        if(is_binary(assigns.scene_json),
          do: assigns.scene_json,
          else: Jason.encode!(assigns.scene || %{})
        )
      )

    ~H"""
    <section id={@id} class={["rg-surface", @class]} data-regent-role="surface">
      <header :if={@header_strip != []} class="rg-surface-header">
        {render_slot(@header_strip)}
      </header>

      <div class="rg-surface-body">
        <aside :if={@left_rail != []} class="rg-surface-side rg-surface-side-left">
          {render_slot(@left_rail)}
        </aside>

        <div class="rg-surface-center">
          <div class="rg-surface-main">
            <div
              id={"#{@id}-scene"}
              class="rg-surface-scene"
              phx-hook={@hook}
              phx-update="ignore"
              data-scene-json={@scene_json}
              data-scene-version={@scene_version}
              data-active-face={@active_face}
              data-selected-target-id={@selected_target_id}
              data-camera-type={@camera_type}
              data-camera-angle={@camera_angle}
              data-camera-distance={@camera_distance}
              data-theme={@theme}
              data-sigil-pack-url={@sigil_pack_url}
              {@rest}
            >
              <noscript>
                Regent surface requires JavaScript for the spatial scene. Chamber and ledger content still render without it.
              </noscript>
            </div>

            <div :if={@chamber != []} class="rg-surface-chamber">
              {render_slot(@chamber)}
            </div>

            <div :if={@ledger != []} class="rg-surface-ledger">
              {render_slot(@ledger)}
            </div>
          </div>
        </div>

        <aside :if={@right_rail != []} class="rg-surface-side rg-surface-side-right">
          {render_slot(@right_rail)}
        </aside>
      </div>
    </section>
    """
  end
end
