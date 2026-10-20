defmodule Regent.PrimitivesTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest
  import Regent.Primitives

  doctest Regent.Primitives, only: [short_address: 1]

  test "fields connect supplied inputs to labels, hints and escaped errors" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.field :let={field} id="amount" label="Amount" errors={["<invalid>"]}>
        <input id={field.id} aria-describedby={field.described_by} aria-invalid={field.aria_invalid} />
        <:hint>Use whole units</:hint>
      </.field>
      """)

    assert html =~ ~s(for="amount")
    assert html =~ ~s(aria-describedby="amount-errors amount-hint")
    assert html =~ ~s(aria-invalid="true")
    assert html =~ "&lt;invalid&gt;"
    assert html =~ ~s(id="amount-hint")
  end

  test "disclosure keeps its full body while collapsed and accepts an explicit open state" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.disclosure id="evidence" summary="Evidence" index="01">Complete evidence</.disclosure>
      <.disclosure id="errors" summary="Errors" open>Visible error</.disclosure>
      """)

    refute html =~ ~s(id="evidence" open)
    assert html =~ "Complete evidence"
    assert html =~ ~s(id="errors" open)
    assert html =~ ~s(aria-hidden="true")
    assert html =~ ~s(class="rg-disclosure-index")
    assert html =~ ">01</span>"
  end

  test "a tip keeps its words in the page and names them as the button's description" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.tip id="about-approve" label="About approving">Lets REGENT staking take the USDC.</.tip>
      """)

    assert html =~ ~s(popovertarget="about-approve")
    assert html =~ ~s(aria-describedby="about-approve")
    assert html =~ ~s(aria-label="About approving")
    assert html =~ ~s(id="about-approve" class="rg-tip-body" popover)
    assert html =~ "Lets REGENT staking take the USDC."
  end

  test "buttons pass application events through without implicit disabling or submission" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.button phx-click="request_wallet" phx-value-item="a">Send</.button>
      """)

    assert html =~ ~s(type="button")
    assert html =~ ~s(phx-click="request_wallet")
    assert html =~ ~s(phx-value-item="a")
    assert html =~ ~s(class="rg-button__label")
    refute html =~ "disabled"
  end

  test "notices distinguish alerts and status without losing supplied content" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.notice tone="error">Transaction reverted</.notice>
      <.notice tone="success">Saved</.notice>
      <.empty_state title="No reports">
        <:action><a href="/new">Create report</a></:action>
      </.empty_state>
      """)

    assert html =~ ~s(role="alert")
    assert html =~ ~s(role="status")
    assert html =~ "Transaction reverted"
    assert html =~ ~s(href="/new")
  end

  test "copy buttons name their text, keep their copy state through patches and have a polite status that patches leave alone" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.copy_button id="wallet-copy" text="0xabc">Copy</.copy_button>
      """)

    assert html =~ ~s(id="wallet-copy")
    refute html =~ "phx-hook"
    assert html =~ "ignore_attrs"
    assert html =~ "data-copy-state"
    assert html =~ ~s(data-copy-text="0xabc")
    assert html =~ ~s(data-copy-status="wallet-copy-status")

    assert html =~
             ~s(<span id="wallet-copy-status" class="rg-copy__status" role="status" phx-update="ignore">)

    assert html =~ "Copied"
    assert html =~ "Couldn't copy"
    refute html =~ "Selected"
  end

  test "a copy button with a target names it and can say the text was selected instead" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.copy_button id="prompt-copy" target="prompt">Copy prompt</.copy_button>
      """)

    assert html =~ ~s(data-copy-target="prompt")
    refute html =~ "data-copy-text"
    assert html =~ "Selected"
  end

  # Invariant: an ENS name or short address always opens and copies the full address it
  # stands for, by click, tap or keyboard as well as hover (Sentinel, 19 Oct).
  test "an address shows its name and copies the full address it points to" do
    full = "0x1234567890abcdef1234567890abcdef12345678"
    assigns = %{full: full}

    html =
      rendered_to_string(~H"""
      <.address id="owner" address={@full} label="ada.eth" />
      """)

    assert html =~ ~s(popovertarget="owner-full")
    assert html =~ ~r{<span id="owner-full"[^>]*popover[^>]*>#{full}</span>}
    assert html =~ ~r{<button[^>]*rg-address__label[^>]*>\s*ada.eth\s*</button>}
    assert html =~ ~s(data-copy-text="#{full}")
    assert html =~ ~s(aria-label="Copy the full address")

    short = rendered_to_string(~H|<.address id="owner" address={@full} />|)
    assert short =~ ~r{<button[^>]*rg-address__label[^>]*>\s*0x1234..5678\s*</button>}
    assert short =~ ~s(data-copy-text="#{full}")
  end

  # Invariant: every address and transaction hash opens on its chain's explorer,
  # Basescan unless it is on Ethereum, in a new tab, beside its copy icon
  # (founder, 19 Oct).
  test "an address and a transaction hash each open on their chain's explorer" do
    address = "0x1234567890abcdef1234567890abcdef12345678"
    hash = "0x" <> String.duplicate("ab", 32)
    assigns = %{address: address, hash: hash}

    html = rendered_to_string(~H|<.address id="owner" address={@address} />|)
    assert html =~ ~s(href="https://basescan.org/address/#{address}")
    assert html =~ ~s(target="_blank")

    sent = rendered_to_string(~H|<.address id="sent" address={@hash} kind="tx" />|)
    assert sent =~ ~s(href="https://basescan.org/tx/#{hash}")
    assert sent =~ ~r{rg-address__label[^>]*>\s*0xabab..abab\s*</button>}
    assert sent =~ ~s(aria-label="Copy the transaction hash")
    assert sent =~ ~s(aria-label="Open on Basescan")

    mainnet =
      rendered_to_string(~H|<.address id="paid" address={@hash} kind="tx" chain="ethereum" />|)

    assert mainnet =~ ~s(href="https://etherscan.io/tx/#{hash}")
    assert mainnet =~ ~s(aria-label="Open on Etherscan")
  end
end
