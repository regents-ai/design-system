defmodule Regent.ProfileTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  test "a signed-in visitor is never shown Sign in" do
    assigns = %{}
    html = rendered_to_string(~H"<Regent.Profile.panel signed_in />")

    refute html =~ "Sign in"
    refute html =~ ~s(data-profile-action="sign-in")
    assert html =~ "Set up your profile"
    assert html =~ "Refresh linked accounts"
    assert html =~ "Your name on every Regent site."
  end

  test "a signed-out visitor is offered Sign in" do
    assigns = %{}
    html = rendered_to_string(~H"<Regent.Profile.panel signed_in={false} />")

    assert html =~ ~s(data-profile-action="sign-in")
    assert html =~ "Sign in"
  end
end
