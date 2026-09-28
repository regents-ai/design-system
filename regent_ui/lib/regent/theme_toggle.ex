defmodule Regent.ThemeToggle do
  @moduledoc """
  Shared prism/laser theme control. It always names the theme that is showing:
  the page's `data-theme` when the person has chosen, otherwise their device's
  setting, dark unless it asks for light. Applications own theme persistence and
  the click, which sets the opposite of the theme showing.
  """
  use Phoenix.Component

  attr :id, :string, required: true
  attr :class, :any, default: nil
  attr :rest, :global

  def button(assigns) do
    ~H"""
    <Regent.Primitives.button
      id={@id}
      variant="secondary"
      class={["theme-toggle", "rg-theme-toggle", @class]}
      title="Switch between light and dark"
      {@rest}
    >
      <span class="theme-toggle__stage" aria-hidden="true">
        <span class="theme-toggle__laser"></span>
        <span class="theme-toggle__cube">
          <span
            :for={face <- ~w(front back left right top bottom)}
            class={"theme-toggle__face theme-toggle__face--#{face}"}
          ></span>
        </span>
      </span>
      <span class="rg-theme-toggle__state rg-theme-toggle__state--dark">
        Dark theme on. Switch to light theme.
      </span>
      <span class="rg-theme-toggle__state rg-theme-toggle__state--light">
        Light theme on. Switch to dark theme.
      </span>
    </Regent.Primitives.button>
    """
  end
end
