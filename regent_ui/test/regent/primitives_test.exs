defmodule Regent.PrimitivesTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest
  import Regent.Primitives

  test "fields connect supplied inputs to labels, hints and escaped errors" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.field :let={field} id="amount" label="Amount" errors={["<invalid>"]}>
        <input id={field.id} aria-describedby={field.described_by} aria-invalid={field.invalid} />
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
      <.disclosure id="evidence" summary="Evidence">Complete evidence</.disclosure>
      <.disclosure id="errors" summary="Errors" open>Visible error</.disclosure>
      """)

    refute html =~ ~s(id="evidence" open)
    assert html =~ "Complete evidence"
    assert html =~ ~s(id="errors" open)
    assert html =~ ~s(aria-hidden="true")
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
end
