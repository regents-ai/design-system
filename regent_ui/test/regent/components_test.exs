defmodule Regent.ComponentsTest do
  use ExUnit.Case, async: true

  import Phoenix.Component
  import Phoenix.LiveViewTest

  import Regent.Components
  import Regent.Panels

  test "surface/1 renders the scene container with encoded scene data" do
    assigns = %{scene: %{"app" => "demo"}}

    html =
      rendered_to_string(~H"""
      <.surface id="demo-surface" scene={@scene} active_face="front" theme="regent" />
      """)

    assert html =~ ~s(id="demo-surface")
    assert html =~ "rg-surface"
    assert html =~ ~s(id="demo-surface-scene")
    assert html =~ ~s(phx-hook="RegentScene")
    assert html =~ ~s(data-active-face="front")
    assert html =~ ~s(data-theme="regent")
    assert html =~ ~s(data-scene-json="{&quot;app&quot;:&quot;demo&quot;}")
  end

  test "surface/1 composes header_strip, left_rail, chamber, and ledger slots" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.surface id="composed-surface">
        <:header_strip>Header strip content</:header_strip>
        <:left_rail>Left rail content</:left_rail>
        <:right_rail>Right rail content</:right_rail>
        <:chamber>
          <.chamber id="composed-chamber" title="Chamber title">
            Chamber body
          </.chamber>
        </:chamber>
        <:ledger>
          <.ledger id="composed-ledger" title="Ledger title">
            Ledger body
          </.ledger>
        </:ledger>
      </.surface>
      """)

    assert html =~ "rg-surface-header"
    assert html =~ "Header strip content"

    assert html =~ "rg-surface-side-left"
    assert html =~ "Left rail content"

    assert html =~ "rg-surface-side-right"
    assert html =~ "Right rail content"

    assert html =~ "rg-surface-chamber"
    assert html =~ ~s(id="composed-chamber")
    assert html =~ "Chamber title"
    assert html =~ "Chamber body"

    assert html =~ "rg-surface-ledger"
    assert html =~ ~s(id="composed-ledger")
    assert html =~ "Ledger title"
    assert html =~ "Ledger body"
  end

  test "surface/1 omits empty optional slot wrappers" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <.surface id="bare-surface" />
      """)

    refute html =~ "rg-surface-header"
    refute html =~ "rg-surface-side-left"
    refute html =~ "rg-surface-side-right"
    refute html =~ "rg-surface-chamber"
    refute html =~ "rg-surface-ledger"
  end
end
