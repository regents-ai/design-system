defmodule Regent.Discussion do
  @moduledoc """
  Stateless forum-thread presentation, from Patchbay's discussion page: an opening
  post and its replies in one column, each author's picture beside their name, a
  thin rule between posts, the thread's counts under the title, a Solved box that
  quotes the marked answer, reply filters, a Compact replies switch and a heart on
  every post.

  Products own the records, routes, sign-in, the like action, the pictures and the
  wording of times. Compose it as:

      <Regent.Discussion.thread id="thread" title={...} replies={3} views={40} likes={5}>
        <Regent.Discussion.post id="post" opening author={...} at={...} ago="2 hours ago" href={...}>
          <:avatar>...</:avatar>
          body
          <:solved><Regent.Discussion.solved ...>excerpt</Regent.Discussion.solved></:solved>
          <:actions><Regent.Discussion.like count={2} liked={false} /></:actions>
        </Regent.Discussion.post>
        <Regent.Discussion.replies id="replies" count={3} shown={3} filters={...}>
          <Regent.Discussion.post :for={...} id={...} ...>...</Regent.Discussion.post>
        </Regent.Discussion.replies>
      </Regent.Discussion.thread>

  `discussion.mjs` (copied by `mix regent_ui.assets`) remembers the Compact replies
  choice in the browser; the switch works without it.
  """
  use Phoenix.Component

  attr :id, :string, required: true
  attr :title, :string, required: true
  attr :solved, :boolean, default: false
  attr :replies, :integer, required: true, doc: "How many replies the thread has."
  attr :views, :integer, default: nil, doc: "How many people have read it; left out when nil."
  attr :likes, :integer, default: nil, doc: "Likes across the thread; left out when nil."
  attr :last_activity_at, DateTime, default: nil

  attr :last_activity, :string,
    default: nil,
    doc: "The product's words for it, e.g. \"2 hours ago\"."

  attr :class, :any, default: nil
  slot :context, doc: "A line under the title: where it was asked, its kind."
  slot :inner_block, required: true

  def thread(assigns) do
    ~H"""
    <article
      id={@id}
      class={["rg-discussion rg-sheet", @class]}
      aria-labelledby={"#{@id}-title"}
      data-regent-discussion
    >
      <header class="rg-discussion__head">
        <h1 id={"#{@id}-title"}>
          <span :if={@solved} class="rg-discussion__solved-mark" title="Solved">
            <.icon name={:check} /><span class="rg-discussion__hidden">Solved: </span>
          </span>{@title}
        </h1>
        <p :if={@context != []} class="rg-discussion__context">{render_slot(@context)}</p>
      </header>

      <div class="rg-discussion__bar">
        <p class="rg-discussion__stats">
          <span><.icon name={:reply} /> {count(@replies, "reply", "replies")}</span>
          <span :if={@views}><.icon name={:eye} /> {count(@views, "view", "views")}</span>
          <span :if={@likes}><.icon name={:heart} /> {count(@likes, "like", "likes")}</span>
          <span :if={@last_activity && @last_activity_at}>
            Last activity
            <time datetime={DateTime.to_iso8601(@last_activity_at)}>{@last_activity}</time>
          </span>
        </p>
        <span
          :if={@replies > 0}
          id={"#{@id}-compact-control"}
          class="rg-discussion__compact"
          phx-update="ignore"
        >
          <label>
            <input type="checkbox" id={"#{@id}-compact"} data-rg-discussion-compact /> Compact replies
          </label>
        </span>
      </div>

      {render_slot(@inner_block)}
    </article>
    """
  end

  attr :id, :string, required: true
  attr :opening, :boolean, default: false, doc: "The thread's opening post rather than a reply."
  attr :author, :string, required: true
  attr :author_href, :string, default: nil
  attr :at, DateTime, required: true
  attr :ago, :string, required: true, doc: "The product's words for when, e.g. \"3 hours ago\"."
  attr :href, :string, required: true, doc: "The address of this post."
  attr :solution, :boolean, default: false, doc: "The reply the asker marked as the answer."
  attr :house, :boolean, default: false, doc: "A reply from the site itself, set on darker paper."
  slot :avatar, required: true, doc: "The author's picture, 3rem square."
  slot :label, doc: "Labels after the name, such as `label/1`."
  slot :inner_block, required: true, doc: "The post's words."
  slot :solved, doc: "The Solved box under an opening post, `solved/1`."
  slot :actions, doc: "The heart and any other buttons, bottom right."

  def post(assigns) do
    ~H"""
    <.dynamic_tag
      tag_name={if @opening, do: "section", else: "li"}
      id={@id}
      class={[
        "rg-discussion__post",
        @opening && "rg-discussion__post--opening",
        @solution && "rg-discussion__post--solution",
        @house && "rg-discussion__post--house"
      ]}
      aria-label={@opening && "The post"}
    >
      <div class="rg-discussion__avatar">{render_slot(@avatar)}</div>
      <div class="rg-discussion__main">
        <header class="rg-discussion__post-head">
          <a :if={@author_href} class="rg-discussion__author" href={@author_href}><bdi>{@author}</bdi></a>
          <span :if={!@author_href} class="rg-discussion__author"><bdi>{@author}</bdi></span>
          {render_slot(@label)}
          <a class="rg-discussion__when" href={@href}>
            <time datetime={DateTime.to_iso8601(@at)}>{@ago}</time>
          </a>
        </header>
        <div class="rg-discussion__body">{render_slot(@inner_block)}</div>
        {render_slot(@solved)}
        <footer :if={@actions != []} class="rg-discussion__actions">{render_slot(@actions)}</footer>
      </div>
    </.dynamic_tag>
    """
  end

  attr :good, :boolean, default: false, doc: "A filled label with a tick, such as Solution."
  slot :inner_block, required: true

  def label(assigns) do
    ~H"""
    <span class={["rg-discussion__label", @good && "rg-discussion__label--good"]}>
      <.icon :if={@good} name={:check} />{render_slot(@inner_block)}
    </span>
    """
  end

  attr :id, :string, required: true
  attr :author, :string, required: true
  attr :author_href, :string, default: nil
  attr :at, DateTime, required: true
  attr :date, :string, required: true, doc: "The product's words for the day it was written."
  attr :href, :string, required: true, doc: "The whole answer: its anchor, or a page showing it."

  attr :caption, :string,
    default: "The person who asked says this answer worked. That is their word, not a check."

  slot :inner_block, required: true, doc: "The answer's opening lines; they fade out."

  def solved(assigns) do
    ~H"""
    <section id={@id} class="rg-discussion__solved" aria-labelledby={"#{@id}-title"}>
      <h2 id={"#{@id}-title"}><.icon name={:check} /> Solved</h2>
      <p class="rg-discussion__solved-by">
        Answer by <a :if={@author_href} href={@author_href}><bdi>{@author}</bdi></a>
        <bdi :if={!@author_href}>{@author}</bdi>
        <time datetime={DateTime.to_iso8601(@at)}>{@date}</time>
      </p>
      <div class="rg-discussion__excerpt">{render_slot(@inner_block)}</div>
      <p class="rg-discussion__caption">{@caption}</p>
      <a href={@href}>Read the whole answer →</a>
    </section>
    """
  end

  attr :id, :string, required: true
  attr :count, :integer, required: true, doc: "Every reply in the thread."
  attr :shown, :integer, required: true, doc: "Replies on screen after the filter and paging."

  attr :filters, :list,
    default: [],
    doc:
      "`%{label: \"All replies\", href: ..., current: true}` for each filter; none hides the row."

  attr :empty, :string, default: "No replies yet."
  slot :inner_block, required: true, doc: "The replies, each a `post/1`."
  slot :footer, doc: "Paging and the reply form."

  def replies(assigns) do
    ~H"""
    <section id={@id} class="rg-discussion__conversation" aria-labelledby={"#{@id}-title"}>
      <h2 id={"#{@id}-title"}>Replies <span>{@count}</span></h2>
      <nav :if={@filters != []} class="rg-discussion__filters" aria-label="Filter replies">
        <a :for={filter <- @filters} href={filter.href} aria-current={filter.current && "page"}>
          {filter.label}
        </a>
      </nav>
      <ol :if={@shown > 0} class="rg-discussion__replies" role="list">
        {render_slot(@inner_block)}
      </ol>
      <p :if={@shown == 0} class="rg-discussion__caption">{@empty}</p>
      {render_slot(@footer)}
    </section>
    """
  end

  attr :count, :integer, required: true
  attr :liked, :boolean, required: true, doc: "Whether the reader likes this post."

  attr :likers, :list,
    default: [],
    doc: "The first few who liked it, oldest first: `%{name: ..., href: ...}` (href may be nil)."

  attr :others, :integer, default: 0, doc: "How many more liked it beyond `likers`."
  attr :type, :string, default: "button", doc: "\"submit\" inside the product's own form."

  attr :rest, :global,
    include: ~w(form name value),
    doc: "The product's own press: `phx-click` and its values, or a form's fields."

  def like(assigns) do
    ~H"""
    <span class="rg-discussion__like">
      <button
        type={@type}
        class="rg-discussion__heart"
        aria-pressed={to_string(@liked)}
        title={if @liked, do: "You like this. Press to take it back.", else: "Like this post"}
        {@rest}
      >
        <.icon name={:heart} />
        <span :if={@count > 0} aria-hidden="true">{@count}</span>
        <span class="rg-discussion__hidden">Like, {count(@count, "like", "likes")}</span>
      </button>
      <span :if={@likers != []} class="rg-discussion__liked-by">
        Liked by<span :for={{liker, index} <- Enum.with_index(@likers)}>{separator(
          index,
          length(@likers),
          @others
        )}<a :if={liker[:href]} href={liker.href}><bdi>{liker.name}</bdi></a><bdi :if={!liker[:href]}>{liker.name}</bdi></span><span :if={
          @others > 0
        }> and {count(@others, "other", "others")}</span>
      </span>
    </span>
    """
  end

  # The words before a named liker: a space before the first, "and" before the
  # last when nobody is left over, and a comma otherwise.
  defp separator(0, _named, _others), do: " "
  defp separator(index, named, 0) when index == named - 1, do: " and "
  defp separator(_index, _named, _others), do: ", "

  defp count(1, one, _many), do: "1 #{one}"
  defp count(n, _one, many), do: "#{n} #{many}"

  attr :name, :atom, required: true

  defp icon(assigns) do
    ~H"""
    <svg
      class="rg-discussion__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path(@name)} />
    </svg>
    """
  end

  defp path(:check), do: "M20 6 9 17l-5-5"
  defp path(:reply), do: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"

  defp path(:eye),
    do: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"

  defp path(:heart),
    do:
      "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"
end
