defmodule Regent.Blog do
  @moduledoc "Stateless blog presentation. Supply validated RegentBlog catalog data; products own headers and routes."
  use Phoenix.Component

  attr :posts, :list, required: true
  attr :site, :string, required: true

  def gallery(assigns) do
    ~H"""
    <section class="rg-blog rg-sheet rg-blog--gallery" data-regent-blog aria-labelledby="blog-title">
      <header class="rg-blog__intro">
        <p class="rg-blog__eyebrow">Blog</p>
        <h1 id="blog-title">Latest updates from {@site}.</h1>
      </header>
      <ol :if={@posts != []} class="rg-blog__grid" role="list">
        <li :for={post <- @posts}>
          <article class="rg-blog__card">
            <a href={"/blog/#{post.slug}"} class="rg-blog__card-link">
              <img
                src={post.image}
                alt={post.image_alt}
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <div class="rg-blog__card-copy">
                <div class="rg-blog__meta">
                  <span>{post.author}</span><time datetime={Date.to_iso8601(post.date)}>{date(post.date)}</time>
                </div>
                <h2>{post.title}</h2>
                <p :if={post.description != ""}>{post.description}</p>
              </div>
            </a>
          </article>
        </li>
      </ol>
      <div :if={@posts == []} class="rg-blog__empty">
        <h2>No posts yet.</h2>
        <p>Updates will appear here, newest first.</p>
      </div>
    </section>
    """
  end

  attr :post, :map, required: true

  def article(assigns) do
    ~H"""
    <article class="rg-blog rg-sheet rg-blog--article" data-regent-blog aria-labelledby="blog-title">
      <header class="rg-blog__heading">
        <a href="/blog" class="rg-blog__back">← All posts</a>
        <h1 id="blog-title">{@post.title}</h1>
        <div class="rg-blog__byline">
          <span>{@post.author}</span>
          <a href={@post.author_x} rel="me noopener noreferrer" aria-label={"#{@post.author} on X"}>
            @{x_handle(@post.author_x)}
          </a>
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
            <a href="/blog" class="rg-blog__back">← All posts</a>
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

  def not_found(assigns) do
    ~H"""
    <section class="rg-blog rg-sheet" aria-labelledby="blog-title">
      <header class="rg-blog__intro">
        <p class="rg-blog__eyebrow">Blog · 404</p>
        <h1 id="blog-title">Post not found.</h1>
        <p>This post is not available.</p>
        <a href="/blog" class="rg-blog__back">← All posts</a>
      </header>
    </section>
    """
  end

  defp date(date), do: Calendar.strftime(date, "%B %-d, %Y")
  defp x_handle(url), do: url |> URI.parse() |> Map.fetch!(:path) |> String.trim("/")
end
