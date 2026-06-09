defmodule Regent.Panels do
  use Phoenix.Component

  @moduledoc """
  Canonical grouped Regent function components for human-readable panels and utility UI.
  """

  attr :id, :string, required: true
  attr :title, :string, required: true
  attr :subtitle, :string, default: nil
  attr :summary, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :actions
  slot :inner_block, required: true
  slot :footer

  @doc """
  Renders a chamber: the primary narrative panel for a surface.

  Use a chamber for the main, prose-like content the user is currently working
  through — a step in a guide, the detail view for a selected scene node. It
  supports a `summary` line in addition to `subtitle`. For compact reference
  material that sits alongside the main content, use `ledger/1` instead.
  """
  def chamber(assigns) do
    ~H"""
    <section id={@id} class={["rg-chamber", @class]} {@rest}>
      <header class="rg-panel-header">
        <div>
          <h2 class="rg-panel-title">{@title}</h2>
          <p :if={@subtitle} class="rg-panel-subtitle">{@subtitle}</p>
          <p :if={@summary} class="rg-panel-summary">{@summary}</p>
        </div>
        <div :if={@actions != []} class="rg-panel-actions">{render_slot(@actions)}</div>
      </header>

      <div class="rg-panel-body">
        {render_slot(@inner_block)}
      </div>

      <footer :if={@footer != []} class="rg-panel-footer">
        {render_slot(@footer)}
      </footer>
    </section>
    """
  end

  attr :id, :string, required: true
  attr :title, :string, required: true
  attr :subtitle, :string, default: nil
  attr :kind, :string, default: "panel"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :actions
  slot :inner_block, required: true
  slot :footer

  @doc """
  Renders a ledger: a secondary reference panel for a surface.

  Use a ledger for dense, glanceable supporting material — summary tables,
  stats, quick facts — that the user keeps in view while acting in the main
  content. The `kind` attr adds a `rg-ledger-<kind>` class for styling
  variants. For the primary narrative content itself, use `chamber/1` instead.
  """
  def ledger(assigns) do
    ~H"""
    <section id={@id} class={["rg-ledger", @class, "rg-ledger-#{@kind}"]} {@rest}>
      <header class="rg-panel-header">
        <div>
          <h2 class="rg-panel-title">{@title}</h2>
          <p :if={@subtitle} class="rg-panel-subtitle">{@subtitle}</p>
        </div>
        <div :if={@actions != []} class="rg-panel-actions">{render_slot(@actions)}</div>
      </header>

      <div class="rg-panel-body">
        {render_slot(@inner_block)}
      </div>

      <footer :if={@footer != []} class="rg-panel-footer">
        {render_slot(@footer)}
      </footer>
    </section>
    """
  end

  attr :name, :string, required: true
  attr :title, :string, default: nil
  attr :class, :any, default: nil
  attr :sprite_path, :string, default: "/regent/sigils/regent-sigils.svg"
  attr :rest, :global

  def icon(assigns) do
    ~H"""
    <svg
      class={["rg-icon", @class]}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden={is_nil(@title)}
      {@rest}
    >
      <title :if={@title}>{@title}</title>
      <use href={"#{@sprite_path}##{@name}"} />
    </svg>
    """
  end
end
