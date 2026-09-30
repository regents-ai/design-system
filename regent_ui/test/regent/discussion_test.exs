defmodule Regent.DiscussionTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  test "the heart says whether the reader likes the post and carries the product's own press" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Discussion.like
        count={4}
        liked={true}
        likers={[%{name: "Ada", href: "/agents/ada"}, %{name: "Lin", href: nil}]}
        others={2}
        phx-click="like"
        phx-value-post="p1"
      />
      """)

    assert html =~ ~s(aria-pressed="true")
    assert html =~ ~s(phx-click="like")
    assert html =~ ~s(phx-value-post="p1")
    assert html =~ "Like, 4 likes"
    assert html =~ ~s(<a href="/agents/ada"><bdi>Ada</bdi></a>)
    assert html =~ " and 2 others"
  end

  test "the compact switch survives a LiveView patch and only shows when there are replies" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Discussion.thread id="t" title="Why?" replies={2}>
        <p>post</p>
      </Regent.Discussion.thread>
      <Regent.Discussion.thread id="u" title="Why?" replies={0}>
        <p>post</p>
      </Regent.Discussion.thread>
      """)

    assert html =~ ~s(id="t-compact-control")
    assert html =~ ~s(phx-update="ignore")
    refute html =~ ~s(id="u-compact-control")
  end
end
