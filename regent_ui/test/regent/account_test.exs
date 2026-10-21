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

  # A check-in light shows only where a site passes one, with its words for the hover
  # and for a screen reader; a row without one is drawn as before.
  test "an agent row shows its check-in light only when given one" do
    row = %{id: "a1", name: "Night Shift", kind: "hermes", harness: "Hermes", backed: false}
    contact = %{last_contact_iso: "2026-10-21T11:00:00Z", last_contact: "4 minutes ago"}

    action = %{
      last_action: "Wrote in General",
      last_action_iso: "2026-10-21T11:00:00Z",
      last_action_at: "4m"
    }

    late = %{light: "late", light_label: "Checked in 40 minutes ago"}

    assigns = %{
      lit: [row |> Map.merge(contact) |> Map.merge(late)],
      brief: [row |> Map.merge(action) |> Map.merge(late)],
      plain: [Map.merge(row, contact)],
      plain_brief: [row |> Map.merge(action) |> Map.merge(%{light: nil, light_label: nil})]
    }

    for html <- [
          rendered_to_string(~H|<Regent.Account.agents id="a" agents={@lit} />|),
          rendered_to_string(~H|<Regent.Account.agents_brief id="b" agents={@brief} />|)
        ] do
      assert html =~ ~s(data-light="late")
      assert html =~ ~s(aria-label="Checked in 40 minutes ago")
    end

    for html <- [
          rendered_to_string(~H|<Regent.Account.agents id="a" agents={@plain} />|),
          rendered_to_string(~H|<Regent.Account.agents_brief id="b" agents={@plain_brief} />|)
        ] do
      refute html =~ "rg-account__light"
    end
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

  @wallet "0x" <> String.duplicate("a", 40)

  defp identity(name, ens_name, wallet \\ @wallet) do
    assigns = %{name: name, ens_name: ens_name, wallet: wallet}

    rendered_to_string(~H"""
    <Regent.Account.identity
      id="who"
      name={@name}
      wallet={@wallet}
      ens_name={@ens_name}
    />
    """)
  end

  defp count(html, text), do: length(String.split(html, text)) - 1

  # Invariant: the account card says each of the name, the ENS name and the short
  # address at most once, and whichever wallet words show open and copy the full
  # address (founder, 2026-10-19).
  test "the account card says the name and the wallet once each" do
    ens_named = identity("seanwbren.eth", "seanwbren.eth")
    assert count(ens_named, "seanwbren.eth") == 1
    refute ens_named =~ "0xaaaa..aaaa"
    refute ens_named =~ "<p>"

    chosen = identity("Ada", "seanwbren.eth")
    assert count(chosen, ">Ada<") == 1
    assert count(chosen, "seanwbren.eth") == 1
    refute chosen =~ "0xaaaa..aaaa"

    chosen_no_ens = identity("Ada", nil)
    assert count(chosen_no_ens, ">Ada<") == 1
    assert count(chosen_no_ens, "0xaaaa..aaaa") == 1

    unnamed = identity("0xaaaa..aaaa", nil)
    assert count(unnamed, "0xaaaa..aaaa") == 1
    refute unnamed =~ "<p>"

    for html <- [ens_named, chosen, chosen_no_ens, unnamed] do
      assert count(html, ~s(aria-label="Copy the full address")) == 1
      assert html =~ ~s(data-copy-text="#{@wallet}")
      assert html =~ @wallet
    end

    no_wallet = identity("Ada", nil, nil)
    assert no_wallet =~ ">Ada<"
    refute no_wallet =~ "Copy the full address"
  end
end
