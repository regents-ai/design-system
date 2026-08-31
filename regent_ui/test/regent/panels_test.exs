defmodule Regent.PanelsTest do
  use ExUnit.Case, async: true

  import Phoenix.Component
  import Phoenix.LiveViewTest

  import Regent.Panels

  describe "chamber/1" do
    test "renders title, subtitle, summary, and slots" do
      assigns = %{}

      html =
        rendered_to_string(~H"""
        <.chamber
          id="test-chamber"
          title="Chamber title"
          subtitle="Chamber subtitle"
          summary="Chamber summary"
          class="extra-class"
        >
          <:actions><button>Act</button></:actions>
          Chamber body
          <:footer>Chamber footer</:footer>
        </.chamber>
        """)

      assert html =~ ~s(id="test-chamber")
      assert html =~ "rg-chamber"
      assert html =~ "extra-class"
      assert html =~ "Chamber title"
      assert html =~ "Chamber subtitle"
      assert html =~ "Chamber summary"
      assert html =~ "<button>Act</button>"
      assert html =~ "Chamber body"
      assert html =~ "Chamber footer"
    end

    test "omits optional sections when not provided" do
      assigns = %{}

      html =
        rendered_to_string(~H"""
        <.chamber id="bare-chamber" title="Just a title">
          Body
        </.chamber>
        """)

      refute html =~ "rg-panel-subtitle"
      refute html =~ "rg-panel-summary"
      refute html =~ "rg-panel-actions"
      refute html =~ "rg-panel-footer"
    end
  end

  describe "ledger/1" do
    test "renders title, kind variant, and slots" do
      assigns = %{}

      html =
        rendered_to_string(~H"""
        <.ledger
          id="test-ledger"
          title="Ledger title"
          subtitle="Ledger subtitle"
          kind="briefing"
          class="extra-class"
        >
          <:actions><button>Act</button></:actions>
          Ledger body
          <:footer>Ledger footer</:footer>
        </.ledger>
        """)

      assert html =~ ~s(id="test-ledger")
      assert html =~ "rg-ledger"
      assert html =~ "rg-ledger-briefing"
      assert html =~ "extra-class"
      assert html =~ "Ledger title"
      assert html =~ "Ledger subtitle"
      assert html =~ "<button>Act</button>"
      assert html =~ "Ledger body"
      assert html =~ "Ledger footer"
    end

    test "defaults kind to panel" do
      assigns = %{}

      html =
        rendered_to_string(~H"""
        <.ledger id="default-ledger" title="Title">Body</.ledger>
        """)

      assert html =~ "rg-ledger-panel"
    end
  end

  describe "icon/1" do
    test "exposes a titled icon as a named image" do
      assigns = %{}

      html =
        rendered_to_string(~H"""
        <.icon name="gate" title="Open gate" />
        """)

      assert html =~ ~s(role="img")
      assert html =~ ~s(aria-label="Open gate")
      refute html =~ "aria-hidden"
      assert html =~ "<title>Open gate</title>"
    end

    test "keeps an untitled icon decorative" do
      assigns = %{}

      html =
        rendered_to_string(~H"""
        <.icon name="gate" />
        """)

      assert html =~ ~s(aria-hidden="true")
      refute html =~ ~s(role="img")
      refute html =~ "aria-label"
      refute html =~ "<title>"
    end
  end
end
