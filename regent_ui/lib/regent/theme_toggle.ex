defmodule Regent.ThemeToggle do
  @moduledoc """
  Shared prism/laser theme control. Applications own theme persistence and events;
  update the accessible state without replacing the decorative children.
  """
  use Phoenix.Component

  attr :id, :string, required: true
  attr :theme, :string, default: "dark", values: ~w(light dark)
  attr :class, :any, default: nil
  attr :rest, :global

  def button(assigns) do
    assigns =
      assign(assigns,
        theme_name: String.capitalize(assigns.theme),
        next_theme_name: if(assigns.theme == "dark", do: "Light", else: "Dark")
      )

    ~H"""
    <Regent.Primitives.button
      id={@id}
      variant="secondary"
      class={["theme-toggle", "rg-theme-toggle", @class]}
      aria-label={"Color theme: #{@theme_name}. Activate #{@next_theme_name} theme."}
      aria-pressed={to_string(@theme == "light")}
      title={"Switch to #{@next_theme_name}"}
      {@rest}
    >
      <span class="theme-toggle__stage" aria-hidden="true">
        <span class="theme-toggle__laser"></span>
        <span class="theme-toggle__cube">
          <span
            :for={face <- ~w(front back left right top bottom)}
            class={"theme-toggle__face theme-toggle__face--#{face}"}
          >
          </span>
        </span>
      </span>
      <span class="rg-theme-toggle__state" data-theme-toggle-state>{@theme_name} theme active</span>
    </Regent.Primitives.button>
    """
  end
end
