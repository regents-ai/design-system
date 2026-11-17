defmodule Regent.BlogTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  defp posts(count) do
    for i <- 1..count//1 do
      %{
        slug: "post-#{i}",
        title: "Post #{i}",
        description: if(rem(i, 5) == 0, do: "", else: "About post #{i}"),
        date: Date.add(~D[2026-11-16], -i)
      }
    end
  end

  defp gallery(posts) do
    assigns = %{posts: posts}

    rendered_to_string(~H"""
    <Regent.Blog.gallery posts={@posts} name="Articles" path="/articles" />
    """)
  end

  defp entries(html), do: length(String.split(html, ~s(class="rg-blog__entry"))) - 1

  test "twenty posts show nine, and the rest wait in Load more groups nested one in the other" do
    html = gallery(posts(20))

    assert html |> String.split("<details") |> Enum.map(&entries/1) == [9, 9, 2]

    assert Regex.scan(~r{</?details}, html) |> List.flatten() ==
             ["<details", "<details", "</details", "</details"]

    assert length(String.split(html, "<summary")) == 3
  end

  test "every post links to its own page under the page's address, newest first, with no pictures" do
    html = gallery(posts(12))

    assert Regex.scan(~r{href="([^"]+)"}, html, capture: :all_but_first) |> List.flatten() ==
             Enum.map(1..12, &"/articles/post-#{&1}")

    refute html =~ "<img"
  end

  test "nine posts need no Load more, and no posts show the empty state instead of a list" do
    nine = gallery(posts(9))
    assert entries(nine) == 9
    refute nine =~ "<details"

    assert gallery(posts(10)) |> String.split("<details") |> Enum.map(&entries/1) == [9, 1]

    empty = gallery([])
    assert entries(empty) == 0
    refute empty =~ "<ol"
    assert empty =~ ~s(class="rg-blog__empty")
  end
end
