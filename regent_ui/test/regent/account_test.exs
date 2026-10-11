defmodule Regent.AccountTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  # A failed or unfinished read must never look like an empty account.
  test "agents that could not be read are never shown as none" do
    assigns = %{}

    failed = rendered_to_string(~H|<Regent.Account.agents id="a" agents={:unavailable} />|)
    loading = rendered_to_string(~H|<Regent.Account.agents id="a" agents={:loading} />|)

    assert failed =~ "Your agents couldn’t be read. Try refreshing."
    assert failed =~ ~s(role="alert")
    assert loading =~ "Loading…"
    refute failed =~ "No agents paired yet."
    refute loading =~ "No agents paired yet."
  end

  test "an ended session asks the person to sign in again" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Account.signed_out id="s" reason={:expired}>
        <:sign_in><button>Sign in</button></:sign_in>
      </Regent.Account.signed_out>
      """)

    assert html =~ "Your session ended. Sign in again to see your account."
  end
end
