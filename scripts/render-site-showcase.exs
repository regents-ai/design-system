# Run from regent_ui: mix run ../scripts/render-site-showcase.exs
# The one-site bar (Regent.Site.bar) on a sample page for each product, exported for
# browser review. Serve .showcase/site/ at / with any static file server.
defmodule Regent.SiteShowcase do
  use Phoenix.Component

  attr :product, :string, required: true
  attr :name, :string, required: true
  attr :links, :list, required: true

  def page(assigns) do
    ~H"""
    <Regent.Site.bar id="bar" product={@product}>
      <:links :if={@links != []}>
        <a :for={{label, index} <- Enum.with_index(@links)} href="#" aria-current={index == 0 && "page"}>
          {label}
        </a>
      </:links>
      <:account>
        <Regent.ThemeToggle.button id="theme" />
        <Regent.Primitives.button id="sign-in" arrow={false}>Sign in</Regent.Primitives.button>
      </:account>
    </Regent.Site.bar>
    <main id="main" class="site-sample">
      <h1>{@name}</h1>
      <p class="site-sample__large">Large words in the page's own ink.</p>
      <p>Body words on the ground, at the size every page reads at.</p>
      <p class="site-sample__muted">A quieter line under them.</p>
      <p><a id="sample-link" href="#">A link in the product's colour</a></p>
      <div class="site-sample__row">
        <Regent.Primitives.button id="sample-primary">Continue</Regent.Primitives.button>
        <Regent.Primitives.button id="sample-secondary" variant="secondary">Details</Regent.Primitives.button>
      </div>
      <Regent.Primitives.segmented
        id="sample-view"
        label="View"
        name="view"
        value="mine"
        options={[%{value: "mine", label: "Mine"}, %{value: "all", label: "All"}]}
      />
      <Regent.Structure.panel class="site-sample__panel">
        <p>Words on a panel's surface.</p>
      </Regent.Structure.panel>
      <p><a href="/index.html">All pages</a></p>
    </main>
    """
  end
end

root = Path.expand("..", File.cwd!())
out = Path.join(root, ".showcase/site")
File.rm_rf!(out)
File.mkdir_p!(out)

long_links =
  ~w(Overview Activity Markets Agents Notebooks Proposals Members History Reports Archive Support Settings)

pages =
  Enum.flat_map(Regent.Site.products(), fn product ->
    if product.id == "regents" do
      for home <- ~w(ink tangerine blue), do: {"regents-#{home}", product, home, ~w(Overview Activity)}
    else
      [{product.id, product, "blue", ~w(Overview Activity)}]
    end
  end) ++
    [
      {"links-none", hd(Regent.Site.products()), "blue", []},
      {"links-long", hd(Regent.Site.products()), "blue", long_links}
    ]

theme_script = """
document.getElementById("theme").addEventListener("click", () => {
  const root = document.documentElement;
  const showing = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  root.dataset.theme = showing === "light" ? "dark" : "light";
});
"""

sample_css = """
.site-sample { display: grid; gap: var(--space-3); justify-items: start; max-inline-size: 48rem; padding: var(--space-6) var(--space-4); }
.site-sample > * { margin: 0; }
.site-sample h1 { font-size: var(--type-display-size); line-height: var(--type-display-line); }
.site-sample__large { font-size: var(--type-title-size); line-height: var(--type-title-line); }
.site-sample__muted { color: var(--color-fg-muted); }
.site-sample a { color: var(--color-link); }
.site-sample :focus-visible { outline: var(--rg-ring-width) solid var(--color-focus); outline-offset: var(--rg-ring-offset); }
.site-sample__row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.site-sample__panel { padding: var(--space-3); }
@media (max-width: 48rem) { .site-sample { padding: var(--space-4) var(--space-2); } }
"""

for {file, product, home, links} <- pages do
  body =
    %{product: product.id, name: product.name, links: links}
    |> Regent.SiteShowcase.page()
    |> Phoenix.HTML.Safe.to_iodata()
    |> IO.iodata_to_binary()

  html = """
  <!doctype html>
  <html lang="en" data-brand="#{product.brand}" data-product="#{product.id}" data-home="#{home}">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>#{product.name} · Regents</title>
  <link rel="stylesheet" href="/css/design_system_tokens.css">
  <link rel="stylesheet" href="/css/primitives.css">
  <style>#{sample_css}</style>
  <script src="/js/product_menu.mjs" type="module"></script>
  <script src="/js/segmented.mjs" type="module"></script>
  <script type="module">#{theme_script}</script></head>
  <body>#{body}</body></html>
  """

  File.write!(Path.join(out, file <> ".html"), html)
end

index = """
<!doctype html>
<html lang="en" data-brand="platform">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>One site · Regents</title>
<link rel="stylesheet" href="/css/design_system_tokens.css">
<style>body { padding: var(--space-4); } a { display: block; min-block-size: 2.75rem; color: var(--color-link); }</style></head>
<body><h1>One site</h1>
#{Enum.map_join(pages, "\n", fn {file, _, _, _} -> ~s(<a href="/#{file}.html">#{file}</a>) end)}
</body></html>
"""

File.write!(Path.join(out, "index.html"), index)
File.cp_r!(Path.join(root, "regent_ui/assets/css"), Path.join(out, "css"))
File.mkdir_p!(Path.join(out, "fonts"))
File.cp_r!(Path.join(root, "regent_ui/priv/static/fonts"), Path.join(out, "fonts/regent-ui"))
File.mkdir_p!(Path.join(out, "js"))

for name <- ~w(product_menu.mjs segmented.mjs),
    do: File.cp!(Path.join(root, "regent_ui/assets/js/" <> name), Path.join(out, "js/" <> name))

IO.puts("Rendered the one-site bar on #{length(pages)} pages to #{out}/index.html")
