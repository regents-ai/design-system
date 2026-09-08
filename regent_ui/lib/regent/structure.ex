defmodule Regent.Structure do
  @moduledoc """
  Ruled-sheet presentation. Import the canonical tokens and `primitives.css`.
  Applications supply content, navigation, heading semantics and all behavior.
  Panels pair surface and ink; only CSS skins are clipped, never their content.
  """
  use Phoenix.Component

  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def frame(assigns) do
    ~H"""
    <div class={["rg-sheet rg-frame", @class]} {@rest}>{render_slot(@inner_block)}</div>
    """
  end

  attr :rail, :boolean, default: true
  attr :class, :any, default: nil
  attr :rest, :global
  slot :rail_content
  slot :inner_block, required: true

  def row(assigns) do
    ~H"""
    <div class={["rg-sheet-row", !@rail && "rg-sheet-row--no-rail", @class]} {@rest}>
      <div :if={@rail} class="rg-sheet-row__rail">{render_slot(@rail_content)}</div>
      <div class="rg-sheet-row__main">{render_slot(@inner_block)}</div>
    </div>
    """
  end

  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def section_bar(assigns) do
    ~H"""
    <div class={["rg-section-bar", @class]} {@rest}>
      <span class="rg-section-bar__diamond" aria-hidden="true"></span>
      {render_slot(@inner_block)}
      <span class="rg-section-bar__leader" aria-hidden="true"></span>
    </div>
    """
  end

  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true
  slot :caption

  def technical_figure(assigns) do
    ~H"""
    <figure class={["rg-technical-figure", @class]} {@rest}>
      <div class="rg-technical-figure__art">{render_slot(@inner_block)}</div>
      <figcaption :if={@caption != []}>{render_slot(@caption)}</figcaption>
    </figure>
    """
  end

  attr :title, :string, required: true
  attr :description, :string, required: true
  attr :index, :string, default: nil
  attr :tone, :string, default: "surface", values: ~w(surface accent)
  attr :image_src, :string, default: nil
  attr :image_alt, :string, default: ""
  attr :class, :any, default: nil
  attr :rest, :global
  slot :media
  slot :actions

  def capability_card(assigns) do
    ~H"""
    <article class={["rg-feature", @class]} {@rest}>
      <.panel tone={@tone} class="rg-feature__face">
        <div class="rg-panel__heading">
          <h3>{@title}</h3>
          <span :if={@index} class="rg-panel__index">{@index}</span>
        </div>
        <.technical_figure>
          <span class="rg-feature__shimmer" aria-hidden="true"></span>
          <img :if={@image_src} src={@image_src} alt={@image_alt} />
          <%= if is_nil(@image_src) do %>
            {render_slot(@media)}
          <% end %>
        </.technical_figure>
      </.panel>
      <.panel tone={@tone} class="rg-feature__caption">
        <p>{@description}</p>
        <div :if={@actions != []} class="rg-feature__actions">{render_slot(@actions)}</div>
      </.panel>
    </article>
    """
  end

  @doc """
  A read-only paired ratio in basis points (0..10000). `nil` means unknown, not zero.
  Labels and fill share exact integer arithmetic; invalid values raise `ArgumentError`.
  `change` is caller-supplied display text, including its period when applicable.
  Footer slots own their content, never an implicit action or product state.
  """
  attr :id, :string, required: true
  attr :title, :string, required: true
  attr :eyebrow, :string, default: "Allocation"
  attr :value_bps, :integer, default: nil
  attr :label, :string, default: "Allocated"
  attr :remainder_label, :string, default: "Remaining"
  attr :change, :string, default: nil
  attr :footer_label, :string, default: "Details"
  attr :class, :any, default: nil
  attr :rest, :global
  slot :footer
  slot :footer_badge

  def ratio_card(assigns) do
    {value, remainder} = ratio_percentages(assigns.value_bps)
    badge = if assigns.value_bps == nil, do: "No data", else: "#{value}%"
    assigns = assign(assigns, value: value, remainder: remainder, badge: badge)

    ~H"""
    <article id={@id} class={["rg-ratio-card", @class]} aria-labelledby={"#{@id}-title"} {@rest}>
      <header class="rg-ratio-card__header">
        <span class="rg-ratio-card__eyebrow">{@eyebrow}</span>
        <span class="rg-ratio-card__slash" aria-hidden="true">/</span>
        <h3 id={"#{@id}-title"} class="rg-ratio-card__title">{@title}</h3>
        <span class="rg-ratio-card__header-badge">{@badge}</span>
      </header>
      <div class="rg-ratio-card__body">
        <dl class="rg-ratio-card__metrics">
          <div class="rg-ratio-card__metric">
            <dt id={"#{@id}-label"} class="rg-ratio-card__label">{@label}</dt>
            <dd class="rg-ratio-card__readout">
              <span class="rg-ratio-card__value">{@value}{if @value_bps != nil, do: "%"}</span>
              <span :if={@change} class="rg-ratio-card__change">{@change}</span>
            </dd>
          </div>
          <div class="rg-ratio-card__metric rg-ratio-card__metric--remainder">
            <dt id={"#{@id}-remainder-label"} class="rg-ratio-card__label">{@remainder_label}</dt>
            <dd class="rg-ratio-card__readout">
              <span class="rg-ratio-card__value">{@remainder}{if @value_bps != nil, do: "%"}</span>
            </dd>
          </div>
        </dl>
        <%= if @value_bps != nil do %>
          <div
            class="rg-ratio-card__meter"
            role="meter"
            aria-labelledby={"#{@id}-title #{@id}-label"}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={@value}
            aria-valuetext={"#{@label}: #{@value}%; #{@remainder_label}: #{@remainder}%"}
          >
            <span class="rg-ratio-card__fill" style={"inline-size: #{@value}%"} aria-hidden="true">
            </span>
          </div>
          <div class="rg-ratio-card__scale" aria-hidden="true">
            <span :for={tick <- [0, 25, 50, 75, 100]}>{tick}%</span>
          </div>
        <% else %>
          <p class="rg-ratio-card__empty">No data</p>
        <% end %>
      </div>
      <footer class="rg-ratio-card__footer">
        <span class="rg-ratio-card__footer-label">{@footer_label}</span>
        <div :if={@footer != []} class="rg-ratio-card__footer-content">{render_slot(@footer)}</div>
        <div :if={@footer_badge != []} class="rg-ratio-card__footer-badge">
          {render_slot(@footer_badge)}
        </div>
      </footer>
    </article>
    """
  end

  defp ratio_percentages(nil), do: {"—", "—"}

  defp ratio_percentages(bps) when is_integer(bps) and bps in 0..10000 do
    {basis_points_to_percent(bps), basis_points_to_percent(10000 - bps)}
  end

  defp ratio_percentages(_value) do
    raise ArgumentError, "value_bps must be nil or an integer in 0..10000"
  end

  defp basis_points_to_percent(bps) when rem(bps, 100) == 0, do: Integer.to_string(div(bps, 100))

  defp basis_points_to_percent(bps) do
    fraction = bps |> rem(100) |> Integer.to_string() |> String.pad_leading(2, "0")
    "#{div(bps, 100)}.#{String.trim_trailing(fraction, "0")}"
  end

  attr :tone, :string, default: "surface", values: ~w(surface accent)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def panel(assigns) do
    ~H"""
    <div class={["rg-panel", "rg-panel--#{@tone}", @class]} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end
end
