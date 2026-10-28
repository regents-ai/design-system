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
  # and for a screen reader; a site without check-ins passes nil and draws none.
  test "an agent row shows its check-in light only when given one" do
    row = %{
      id: "a1",
      name: "Night Shift",
      kind: "hermes",
      harness: "Hermes",
      wallet: nil,
      backed: false
    }

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
      plain: [row |> Map.merge(contact) |> Map.merge(%{light: nil, light_label: nil})],
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

  # Two agents may share a name; each row names its own wallet, opened and copied in
  # full, and a row whose wallet is unknown says so rather than borrowing another's.
  test "each agent row shows its own wallet, or says it is unavailable" do
    row = fn id, wallet ->
      %{
        id: id,
        name: "Night Shift",
        kind: "hermes",
        harness: "Hermes",
        wallet: wallet,
        backed: false,
        last_contact_iso: "2026-10-21T11:00:00Z",
        last_contact: "4 minutes ago",
        light: nil,
        light_label: nil
      }
    end

    a = "0x" <> String.duplicate("a", 36) <> "1234"
    b = "0x" <> String.duplicate("b", 36) <> "5678"
    assigns = %{agents: [row.("a1", a), row.("a2", b), row.("a3", nil)]}
    html = rendered_to_string(~H|<Regent.Account.agents id="list" agents={@agents} />|)

    in_row = fn id ->
      [_, rest] = String.split(html, ~s(<li id="list-agent-#{id}">), parts: 2)
      rest |> String.split("</li>", parts: 2) |> hd()
    end

    assert in_row.("a1") =~ "0xaaaa..1234"
    assert in_row.("a1") =~ ~s(data-copy-text="#{a}")
    refute in_row.("a1") =~ b
    assert in_row.("a2") =~ "0xbbbb..5678"
    assert in_row.("a2") =~ ~s(data-copy-text="#{b}")
    refute in_row.("a2") =~ a
    assert in_row.("a3") =~ "Address unavailable"
    refute in_row.("a3") =~ "0x"
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

  defp menu(name, ens_name, wallet) do
    assigns = %{name: name, ens_name: ens_name, wallet: wallet}

    rendered_to_string(~H"""
    <Regent.Account.menu
      id="who"
      name={@name}
      wallet={@wallet}
      ens_name={@ens_name}
      manage_href="/account"
      pair_href="/account#account-pairing"
    >
      <:picture></:picture>
      <:agents></:agents>
    </Regent.Account.menu>
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

  # Invariant: the account menu, like the account card, says the name and the
  # wallet once each, the ENS name always as the wallet it points to, and a short
  # address in another letter case is still the wallet.
  test "the account menu says the name and the wallet once each" do
    checksummed = "0x" <> String.duplicate("aB", 20)
    lower = String.downcase(checksummed)

    for {name, ens_name, wallet, words} <- [
          {"seanwbren.eth", "seanwbren.eth", @wallet, "seanwbren.eth"},
          {"0xaaaa..aaaa", nil, @wallet, "0xaaaa..aaaa"},
          {"0xaBaB..aBaB", nil, lower, "0xaBaB..aBaB"},
          {"Ada", "seanwbren.eth", @wallet, "seanwbren.eth"}
        ] do
      html = menu(name, ens_name, wallet)
      assert html =~ ~s(aria-label="#{name}")
      shown = String.replace(html, ~s(aria-label="#{name}"), "")
      assert count(shown, words) == 1
      assert count(shown, ~s(aria-label="Copy the full address")) == 1
      assert shown =~ ~s(data-copy-text="#{wallet}")
    end

    refute menu("0xaBaB..aBaB", nil, lower) =~ "0xabab..abab"
  end
end
