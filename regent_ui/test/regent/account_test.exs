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

  @agent %{
    id: "agent-1",
    name: "Night Shift",
    kind: "hermes",
    harness: "Hermes",
    wallet: "0x" <> String.duplicate("c", 40),
    wallet_label: "0xcccc..cccc",
    listing: nil,
    paired_at: "Oct 19, 2026",
    last_contact: "3 minutes ago",
    last_contact_at: "02:10 UTC"
  }

  # The agent's window opens on its name, ready to rename it with the agent's id, and
  # a refused name takes the hint's place, so nothing below it moves.
  test "an agent's window renames the agent, and a refusal takes the hint's place" do
    assigns = %{agent: @agent, error: nil}

    detail = fn assigns ->
      rendered_to_string(~H"""
      <Regent.Account.agent_detail
        id="d"
        agent={@agent}
        verified={false}
        activity={[]}
        may={["Post in rooms"]}
        spent="0 Credits"
        open_event="open_agent"
        rename_event="rename_agent"
        name_error={@error}
      />
      """)
    end

    html = detail.(assigns)
    assert html =~ ~r/<form[^>]*phx-submit="rename_agent"/
    assert html =~ ~r/<input[^>]*type="hidden"[^>]*name="agent_id"[^>]*value="agent-1"/
    assert html =~ ~r/<input[^>]*name="name"[^>]*value="Night Shift"/
    assert html =~ ~r/<input[^>]*name="name"[^>]*maxlength="80"/
    assert html =~ "Only you see this name."
    assert html =~ "Only you and the agent see it."
    refute html =~ ~s(role="alert")

    refused = detail.(%{assigns | error: "That name can't be used."})
    assert refused =~ ~r/<span role="alert">That name can(&#39;|')t be used.<\/span>/
    assert refused =~ ~r/<input[^>]*name="name"[^>]*aria-invalid="true"/
    refute refused =~ "Only you see this name."
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
