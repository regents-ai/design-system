defmodule Regent.StructuredDataTest do
  use ExUnit.Case, async: true

  alias Regent.StructuredData

  @asker %{name: "ada"}
  @helper %{name: "grace", url: "https://example.test/u/grace"}

  defp reply(id, likes \\ nil),
    do: %{
      url: "https://example.test/t/1##{id}",
      text: "Reply #{id}",
      author: @helper,
      at: ~U[2026-10-27 08:00:00Z],
      likes: likes
    }

  defp thread(kind, extra \\ %{}) do
    Map.merge(
      %{
        kind: kind,
        url: "https://example.test/t/1",
        title: "Why does sign-in close?",
        text: "It closes before my wallet opens.",
        author: @asker,
        at: ~U[2026-10-27 07:00:00Z],
        reply_count: 3,
        replies: [reply("a", 2), reply("b")]
      },
      extra
    )
  end

  test "a page's nodes follow the site graph" do
    site = %{"@context" => "https://schema.org", "@graph" => [%{"@type" => "WebSite"}]}

    assert StructuredData.graph(site, [%{"@type" => "Dataset"}]) == %{
             "@context" => "https://schema.org",
             "@graph" => [%{"@type" => "WebSite"}, %{"@type" => "Dataset"}]
           }
  end

  test "a solved question names its marked answer and suggests the rest" do
    [marked, _other] = thread(:question).replies
    page = StructuredData.discussion(thread(:question, %{answer: marked, likes: 5}))
    question = page["mainEntity"]

    assert page["@type"] == "QAPage"
    assert question["answerCount"] == 3
    assert question["upvoteCount"] == 5
    assert question["acceptedAnswer"]["text"] == "Reply a"
    assert question["acceptedAnswer"]["upvoteCount"] == 2
    assert Enum.map(question["suggestedAnswer"], & &1["text"]) == ["Reply b"]
    assert question["author"] == %{"@type" => "Person", "name" => "ada"}
  end

  test "an open question has no accepted answer" do
    question = StructuredData.discussion(thread(:question))["mainEntity"]

    refute Map.has_key?(question, "acceptedAnswer")
    assert length(question["suggestedAnswer"]) == 2
  end

  test "a discussion counts its likes and views only when the page shows them" do
    shown = StructuredData.discussion(thread(:discussion, %{likes: 4, views: 40}))

    assert shown["@type"] == "DiscussionForumPosting"
    assert shown["commentCount"] == 3
    assert Enum.map(shown["comment"], & &1["@type"]) == ["Comment", "Comment"]

    assert Enum.map(
             shown["interactionStatistic"],
             &{&1["interactionType"], &1["userInteractionCount"]}
           ) ==
             [{"https://schema.org/LikeAction", 4}, {"https://schema.org/ViewAction", 40}]

    refute Map.has_key?(StructuredData.discussion(thread(:discussion)), "interactionStatistic")
  end

  test "a blog post carries its author's profile and the site as publisher" do
    post = %{
      title: "Launch notes",
      description: "",
      date: ~D[2026-10-20],
      author: "Sean",
      author_x: "https://x.com/regents_sh",
      image: "https://example.test/cover.png"
    }

    node =
      StructuredData.blog_posting(post,
        url: "https://example.test/blog/launch-notes",
        publisher: "https://example.test/#organization"
      )

    assert node["datePublished"] == "2026-10-20"

    assert node["author"] == [
             %{"@type" => "Person", "name" => "Sean", "url" => "https://x.com/regents_sh"}
           ]

    assert node["publisher"] == %{"@id" => "https://example.test/#organization"}
    refute Map.has_key?(node, "description")
  end

  test "a dataset lists each download with its format" do
    node =
      StructuredData.dataset(%{
        name: "Agent Wallet Bench",
        description: "Scores for agents handling a wallet.",
        url: "https://example.test/bench",
        date_modified: ~D[2026-10-27],
        downloads: [%{url: "https://example.test/bench.csv", format: "text/csv"}]
      })

    assert node["dateModified"] == "2026-10-27"

    assert node["distribution"] == [
             %{
               "@type" => "DataDownload",
               "contentUrl" => "https://example.test/bench.csv",
               "encodingFormat" => "text/csv"
             }
           ]

    refute Map.has_key?(node, "license")
  end

  test "page text cannot close the script it is printed in" do
    import Phoenix.Component
    import Phoenix.LiveViewTest

    assigns = %{
      data:
        StructuredData.graph(%{"@graph" => []}, [
          StructuredData.discussion(
            thread(:discussion, %{text: "</script><script>alert(1)</script>"})
          )
        ])
    }

    html =
      rendered_to_string(~H"""
      <Regent.AgentMetadata.head
        title="A thread"
        description="A thread"
        canonical="https://example.test/t/1"
        site_name="Example"
        image="https://example.test/mark.png"
        image_alt="The site mark"
        structured_data={@data}
      />
      """)

    refute html =~ "</script><script>"
    assert html =~ "\\u003c/script>"
  end
end
