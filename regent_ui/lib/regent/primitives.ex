defmodule Regent.Primitives do
  @moduledoc """
  Presentation primitives. Applications own routes, events, authorization and state.
  Collapsed disclosure bodies stay rendered; agent tools should expose the same
  authorized detail independently of visual expansion.
  """
  use Phoenix.Component

  attr :type, :string, default: "button", values: ~w(button submit reset)
  attr :variant, :string, default: "primary", values: ~w(primary secondary quiet)
  attr :class, :any, default: nil
  attr :rest, :global, include: ~w(disabled form name value)
  slot :inner_block, required: true

  def button(assigns) do
    ~H"""
    <button type={@type} class={["rg-button", "rg-button--#{@variant}", @class]} {@rest}>
      <span :if={@variant == "primary"} class="rg-button__label">{render_slot(@inner_block)}</span>
      <%= if @variant != "primary" do %>
        {render_slot(@inner_block)}
      <% end %>
    </button>
    """
  end

  attr :id, :string, required: true
  attr :label, :string, required: true
  attr :errors, :list, default: []
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true
  slot :hint
  @doc "Wrap an application-owned input. The slot receives label and description IDs."
  def field(assigns) do
    ids =
      if(assigns.errors == [], do: [], else: [assigns.id <> "-errors"]) ++
        if assigns.hint == [], do: [], else: [assigns.id <> "-hint"]

    assigns = assign(assigns, :described_by, Enum.join(ids, " "))

    ~H"""
    <div class={["rg-field", @class]} {@rest}>
      <label for={@id}>{@label}</label>
      {render_slot(@inner_block, %{
        id: @id,
        described_by: @described_by,
        aria_invalid: to_string(@errors != [])
      })}
      <div :if={@hint != []} id={@id <> "-hint"} class="rg-muted">{render_slot(@hint)}</div>
      <ul :if={@errors != []} id={@id <> "-errors"} class="rg-field-errors">
        <li :for={error <- @errors}>{error}</li>
      </ul>
    </div>
    """
  end

  attr :tone, :string, default: "neutral", values: ~w(neutral info success warning error)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def status(assigns) do
    ~H"""
    <span class={["rg-status", "rg-tone--#{@tone}", @class]} {@rest}>
      {render_slot(@inner_block)}
    </span>
    """
  end

  attr :tone, :string, default: "info", values: ~w(info success warning error)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def notice(assigns) do
    ~H"""
    <div
      role={if @tone == "error", do: "alert", else: "status"}
      class={["rg-notice", "rg-tone--#{@tone}", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :title, :string, required: true
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block
  slot :action

  def empty_state(assigns) do
    ~H"""
    <div class={["rg-empty", @class]} {@rest}>
      <p class="rg-empty-title">{@title}</p>
      <div :if={@inner_block != []} class="rg-muted">{render_slot(@inner_block)}</div>
      <div :if={@action != []}>{render_slot(@action)}</div>
    </div>
    """
  end

  attr :id, :string, required: true
  attr :summary, :string, required: true
  attr :index, :string, default: nil
  attr :open, :boolean, default: false
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def disclosure(assigns) do
    ~H"""
    <details
      id={@id}
      open={@open}
      class={["rg-disclosure", @index && "rg-disclosure--indexed", @class]}
      {@rest}
    >
      <summary>
        <span :if={@index} class="rg-disclosure-index">{@index}</span>
        <span class="rg-disclosure-title">{@summary}</span>
        <span class="rg-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="rg-disclosure-body">{render_slot(@inner_block)}</div>
    </details>
    """
  end
end
