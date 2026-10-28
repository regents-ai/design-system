defmodule Regent.StructuredData do
  @moduledoc """
  The schema.org facts one page adds beside the site's own graph, so search
  engines and AI answers can read what the page holds: a blog post, a forum
  thread or question, or a table of data.

  Products own every fact and URL; these functions only shape them. A page's
  nodes join the site graph that `Regent.AgentMetadata.head/1` prints:

      structured_data={Regent.StructuredData.graph(site_graph, @page_data)}

  Every fact must be one the page shows. Text is plain text, never HTML.
  """

  @doc "The site graph (`%{\"@graph\" => nodes}`) with the page's own nodes after it."
  @spec graph(map(), [map()]) :: map()
  def graph(%{"@graph" => nodes} = site, page_nodes),
    do: %{site | "@graph" => nodes ++ page_nodes}

  @doc """
  A blog post, from a `regent_blog` post (`title`, `description`, `date`, `author`,
  `author_x`, `image`). `url` is the post's address and `publisher` the `@id` of
  the site's Organization node.
  """
  @spec blog_posting(map(), keyword()) :: map()
  def blog_posting(post, opts) do
    url = Keyword.fetch!(opts, :url)

    compact(%{
      "@type" => "BlogPosting",
      "@id" => url <> "#article",
      "url" => url,
      "mainEntityOfPage" => url,
      "headline" => post.title,
      "description" => present(post.description),
      "datePublished" => Date.to_iso8601(post.date),
      "image" => post.image,
      "author" => [person(%{name: post.author, url: post.author_x})],
      "publisher" => %{"@id" => Keyword.fetch!(opts, :publisher)}
    })
  end

  @doc """
  A forum thread as `Regent.Discussion` shows it.

  `kind: :question` gives a QAPage whose marked answer (`answer`) is its
  accepted answer and whose other replies are suggested answers. Search engines
  read a QAPage only with at least one answer, so a question whose page shows
  neither a marked answer nor a reply is a DiscussionForumPosting until it has
  one. `kind: :discussion` gives a DiscussionForumPosting with its replies as
  comments. The thread map holds `url`, `title`, `text`, `author`, `at`,
  `reply_count`, `replies` and, when the page shows them, `likes` and `views`.
  Each post (the answer and every reply) holds `url`, `text`, `author`, `at` and
  optionally `likes`. An author is `%{name: ..., url: ...}`, `url` optional.
  `replies` may be the replies the page shows, fewer than `reply_count`.
  """
  @spec discussion(map()) :: map()
  def discussion(%{kind: :question, replies: []} = thread)
      when not is_map_key(thread, :answer) or is_nil(thread.answer),
      do: discussion(%{thread | kind: :discussion})

  def discussion(%{kind: :question} = thread) do
    answer = thread[:answer]

    %{
      "@type" => "QAPage",
      "url" => thread.url,
      "mainEntity" =>
        compact(%{
          "@type" => "Question",
          "name" => thread.title,
          "text" => thread.text,
          "author" => person(thread.author),
          "datePublished" => DateTime.to_iso8601(thread.at),
          "answerCount" => thread.reply_count,
          "upvoteCount" => thread[:likes],
          "acceptedAnswer" => answer && post("Answer", answer),
          "suggestedAnswer" =>
            for(reply <- thread.replies, reply != answer, do: post("Answer", reply))
        })
    }
  end

  def discussion(%{kind: :discussion} = thread) do
    compact(%{
      "@type" => "DiscussionForumPosting",
      "url" => thread.url,
      "headline" => thread.title,
      "text" => thread.text,
      "author" => person(thread.author),
      "datePublished" => DateTime.to_iso8601(thread.at),
      "commentCount" => thread.reply_count,
      "interactionStatistic" => statistics(thread),
      "comment" => Enum.map(thread.replies, &post("Comment", &1))
    })
  end

  @doc """
  A table of data a page offers: `name`, `description`, `url`, and optionally
  `license` (a URL), `creator` (an `@id`), `keywords`, `date_modified` (a Date)
  and `downloads`, each `%{url: ..., format: "text/csv"}`.
  """
  @spec dataset(map()) :: map()
  def dataset(data) do
    compact(%{
      "@type" => "Dataset",
      "name" => data.name,
      "description" => data.description,
      "url" => data.url,
      "license" => data[:license],
      "creator" => data[:creator] && %{"@id" => data.creator},
      "keywords" => data[:keywords],
      "dateModified" => data[:date_modified] && Date.to_iso8601(data.date_modified),
      "distribution" =>
        for(
          download <- data[:downloads] || [],
          do: %{
            "@type" => "DataDownload",
            "contentUrl" => download.url,
            "encodingFormat" => download.format
          }
        )
    })
  end

  defp post(type, post) do
    compact(%{
      "@type" => type,
      "url" => post.url,
      "text" => post.text,
      "author" => person(post.author),
      "datePublished" => DateTime.to_iso8601(post.at),
      "upvoteCount" => post[:likes]
    })
  end

  defp person(author),
    do: compact(%{"@type" => "Person", "name" => author.name, "url" => author[:url]})

  defp statistics(thread) do
    for {action, count} <- [{"LikeAction", thread[:likes]}, {"ViewAction", thread[:views]}],
        count,
        do: %{
          "@type" => "InteractionCounter",
          "interactionType" => "https://schema.org/" <> action,
          "userInteractionCount" => count
        }
  end

  defp present(""), do: nil
  defp present(text), do: text

  # A fact the page does not have is left out rather than printed empty.
  defp compact(node), do: Map.reject(node, fn {_key, value} -> value in [nil, []] end)
end
