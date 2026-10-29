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

  test "a wallet author's name opens and copies its address, and its picture links its page" do
    assigns = %{
      at: ~U[2026-10-29 12:00:00Z],
      wallet: "0x1234567890abcdef1234567890abcdef12345678"
    }

    html =
      rendered_to_string(~H"""
      <Regent.Discussion.post
        id="r1"
        author="0x1234..5678"
        author_address={@wallet}
        author_href="/agents/1"
        at={@at}
        ago="now"
        href="#r1"
      >
        <:avatar><img src="/a.png" alt="" /></:avatar>
        words
        <:solved>
          <Regent.Discussion.solved
            id="s1"
            author="0x1234..5678"
            author_address={@wallet}
            at={@at}
            date="29 Oct"
            href="#r1"
          >
            answer
          </Regent.Discussion.solved>
        </:solved>
      </Regent.Discussion.post>
      """)

    assert html =~
             ~s(<a class="rg-discussion__avatar" href="/agents/1" aria-label="0x1234..5678">)

    assert html =~ ~s(id="r1-author" class="rg-address rg-address--short rg-discussion__author")
    assert html =~ ~s(id="s1-author" class="rg-address rg-address--short")
    refute html =~ "<bdi>0x1234..5678</bdi>"
  end
end
