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
  attr :text, :string, default: nil, doc: "What the button copies. Give this or `target`."

  attr :target, :string,
    default: nil,
    doc: "The id of the element on the page whose text the button copies. Give this or `text`."

  attr :variant, :string, default: "secondary", values: ~w(primary secondary quiet)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  @doc """
  A button that copies `text`, or the text of the element whose id is `target`,
  on any page, live or not. The application installs the template's page-wide copy
  listener once, which copies on press and sets `data-copy-state` to `copied`,
  `selected` or `failed` for a moment; a live page keeps that state through its
  updates. The button
  then shows "Copied", "Selected" or "Couldn't copy" in place of its label, at
  the label's widest, and the polite status after it says the same for screen
  readers. When the browser refuses the clipboard, a `target` is selected for the
  person to copy themselves; a `text` cannot be, so the button says it failed.
  """
  def copy_button(%{text: text, target: target} = assigns)
      when is_nil(text) == is_nil(target) do
    raise ArgumentError, "copy_button #{assigns.id} takes exactly one of text or target"
  end

  def copy_button(assigns) do
    ~H"""
    <.button
      id={@id}
      variant={@variant}
      class={["rg-copy", @class]}
      phx-mounted={Phoenix.LiveView.JS.ignore_attributes(["data-copy-state"])}
      data-copy-text={@text}
      data-copy-target={@target}
      data-copy-status={"#{@id}-status"}
      {@rest}
    >
      <span class="rg-copy__words">
        <span class="rg-copy__idle">{render_slot(@inner_block)}</span>
        <span class="rg-copy__copied">Copied</span>
        <span :if={@target} class="rg-copy__selected">Selected</span>
        <span class="rg-copy__failed">Couldn't copy</span>
      </span>
    </.button>
    <span id={"#{@id}-status"} class="rg-copy__status" role="status" phx-update="ignore"></span>
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
