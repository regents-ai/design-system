defmodule Regent.ProfileTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  # The form opens on the name the server read, holds it to the profile's own limit,
  # and offers nothing but saving it, beside a tip on where the name shows.
  test "the form opens on the person's name, ready to change and save" do
    assigns = %{}
    html = rendered_to_string(~H|<Regent.Profile.panel display_name="Ada" />|)

    assert html =~ ~r/<input[^>]*name="display_name"[^>]*value="Ada"/
    assert html =~ ~r/<input[^>]*name="display_name"[^>]*maxlength="80"/
    assert [_] = Regex.scan(~r/<button[^>]*type="submit"/, html)
    assert html =~ "on every Regent site"
  end
end
