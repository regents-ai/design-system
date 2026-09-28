defmodule Regent.ThemeToggleTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  test "the toggle carries a sentence for each theme and lets the page's CSS pick the one showing" do
    assigns = %{}
    html = rendered_to_string(~H[<Regent.ThemeToggle.button id="theme" data-theme-toggle />])

    assert html =~ "Dark theme on. Switch to light theme."
    assert html =~ "Light theme on. Switch to dark theme."
    assert html =~ "data-theme-toggle"
    refute html =~ "aria-label"
    refute html =~ "aria-pressed"

    css = File.read!(Path.expand("../../assets/css/theme_toggle.css", __DIR__))
    assert css =~ ~s|:root[data-theme="light"] .rg-theme-toggle__state--dark { display: none; }|
    assert css =~ ":root:not([data-theme]) .rg-theme-toggle__state--light { display: block; }"
  end
end
