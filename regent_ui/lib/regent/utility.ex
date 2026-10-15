defmodule Regent.Utility do
  @moduledoc "Quiet, readable pages for account tasks and recovery messages."
  use Phoenix.Component

  attr(:title, :string, required: true)
  attr(:context, :string, required: true)
  attr(:id, :string, default: "utility-page")
  slot(:inner_block, required: true)
  slot(:actions)
  slot(:note)

  def page(assigns) do
    ~H"""
    <main id={@id} class="rg-utility rg-utility--message" aria-labelledby={"#{@id}-title"}>
      <p class="rg-utility__context">{@context}</p>
      <h1 id={"#{@id}-title"}>{@title}</h1>
      <div class="rg-utility__body">{render_slot(@inner_block)}</div>
      <div :if={@actions != []} class="rg-utility__actions">{render_slot(@actions)}</div>
      <div :if={@note != []} class="rg-utility__note">{render_slot(@note)}</div>
    </main>
    """
  end
end
