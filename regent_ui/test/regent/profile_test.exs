defmodule Regent.ProfileTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  test "the form shows the person's Public Display Name, ready to change" do
    assigns = %{}
    html = rendered_to_string(~H|<Regent.Profile.panel display_name="Ada" />|)

    assert html =~ "Public Display Name"
    assert html =~ ~s(value="Ada")
    assert html =~ ~s(maxlength="80")
    assert html =~ "Save"
    refute html =~ "Sign in"
  end
end
