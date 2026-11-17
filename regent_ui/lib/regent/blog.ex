defmodule Regent.Blog do
  @moduledoc """
  Stateless blog presentation. Supply validated RegentBlog catalog data; products own
  headers and routes. Each product names its page and its address, for example
  `name="Articles" path="/articles"`.
  """
  use Phoenix.Component

  @page_size 9

  attr :posts, :list, required: true
  attr :name, :string, required: true, doc: "The page's name, such as \"Articles\"."
  attr :path, :string, required: true, doc: "The page's address, such as \"/articles\"."
  slot :intro, doc: "One short line under the heading."

  @doc """
  The list of posts, newest first: the first nine, then each next nine behind a
  "Load more" disclosure nested in the one before, so every post is in the page.
  """
  def gallery(assigns) do
    assigns = assign(assigns, :pages, Enum.chunk_every(assigns.posts, @page_size))

    ~H"""
    <section class="rg-blog rg-sheet rg-blog--gallery" data-regent-blog aria-labelledby="blog-title">
      <div class="rg-blog__index">
        <h1 id="blog-title">{@name}</h1>
        <p :if={@intro != []} class="rg-blog__lede">{render_slot(@intro)}</p>
        <div :if={@pages != []} class="rg-blog__timeline">
          <.entries pages={@pages} path={@path} />
        </div>
        <h2 :if={@pages == []} class="rg-blog__empty">Nothing here yet</h2>
      </div>
    </section>
    """
  end

  attr :pages, :list, required: true
  attr :path, :string, required: true

  defp entries(%{pages: [page | later]} = assigns) do
    assigns = assign(assigns, page: page, later: later)

    ~H"""
    <ol class="rg-blog__list" role="list">
      <li :for={post <- @page} class="rg-blog__entry">
        <a href={"#{@path}/#{post.slug}"}>
          <time class="rg-figure" datetime={Date.to_iso8601(post.date)}>{short_date(post.date)}</time>
          <h2>{post.title}</h2>
          <p :if={post.description != ""}>{post.description}</p>
        </a>
      </li>
    </ol>
    <details :if={@later != []} class="rg-blog__more">
      <summary class="rg-button rg-button--quiet">Load more</summary>
      <.entries pages={@later} path={@path} />
    </details>
    """
  end

  attr :post, :map, required: true
  attr :name, :string, required: true, doc: "The page's name, such as \"Articles\"."
  attr :path, :string, required: true, doc: "The page's address, such as \"/articles\"."

  def article(assigns) do
    assigns = assign(assigns, :authors, authors(assigns.post))

    ~H"""
    <article class="rg-blog rg-sheet rg-blog--article" data-regent-blog aria-labelledby="blog-title">
      <header class="rg-blog__heading">
        <a href={@path} class="rg-blog__back">← Back to {@name}</a>
        <h1 id="blog-title">{@post.title}</h1>
        <div class="rg-blog__byline">
          <span :for={author <- @authors}>
            {author.name}
            <a href={author.x} rel="me noopener noreferrer" aria-label={"#{author.name} on X"}>
              @{x_handle(author.x)}
            </a>
          </span>
          <time datetime={Date.to_iso8601(@post.date)}>{date(@post.date)}</time>
        </div>
      </header>
      <figure class="rg-blog__hero">
        <img
          src={@post.image}
          alt={@post.image_alt}
          width="1600"
          height="900"
          fetchpriority="high"
          decoding="async"
        />
      </figure>
      <div class="rg-blog__body">
        <aside :if={@post.toc != []} class="rg-blog__toc-desktop">
          <.contents entries={@post.toc} />
        </aside>
        <div class="rg-blog__reading">
          <details :if={@post.toc != []} class="rg-blog__toc-mobile">
            <summary>On this page</summary>
            <.contents entries={@post.toc} />
          </details>
          <div class="rg-blog__prose">{Phoenix.HTML.raw(@post.html)}</div>
          <footer class="rg-blog__article-footer">
            <a href={@path} class="rg-blog__back">← Back to {@name}</a>
          </footer>
        </div>
      </div>
    </article>
    """
  end

  attr :entries, :list, required: true

  def contents(assigns) do
    ~H"""
    <nav class="rg-blog__contents" aria-label="Table of contents">
      <p class="rg-blog__toc-title">On this page</p>
      <ol role="list">
        <li :for={entry <- @entries} class={entry.level == 3 && "rg-blog__toc-sub"}>
          <a href={"##{entry.id}"} data-blog-heading={entry.id}>{entry.title}</a>
        </li>
      </ol>
    </nav>
    """
  end

  attr :name, :string, required: true, doc: "The page's name, such as \"Articles\"."
  attr :path, :string, required: true, doc: "The page's address, such as \"/articles\"."

  def not_found(assigns) do
    ~H"""
    <section class="rg-blog rg-sheet" aria-labelledby="blog-title">
      <header class="rg-blog__intro">
        <h1 id="blog-title">Not found</h1>
        <a href={@path} class="rg-blog__back">← Back to {@name}</a>
      </header>
    </section>
    """
  end

  defp date(date), do: Calendar.strftime(date, "%B %-d, %Y")

  defp short_date(date), do: Calendar.strftime(date, "%b %-d, %Y")

  defp authors(post) do
    case Map.get(post, :authors, []) do
      [] -> [%{name: post.author, x: post.author_x}]
      authors -> authors
    end
  end

  defp x_handle(url), do: url |> URI.parse() |> Map.fetch!(:path) |> String.trim("/")
end
