# Shared blog presentation

Generated Markdown headings exclusively own `blog-section-*` IDs. Product shells
must not use that namespace; section names such as “Title”, “Content” and “Theme
Control” must never target the article title, main container or theme button.

`Regent.Blog.gallery/1`, `article/1`, `contents/1` and `not_found/1` provide the
standard editorial layout for Regents, Techtree, Autolaunch and Patchbay.
Data must come from the validated `regent_blog` catalog in `elixir-utils/blog`;
never pass request-supplied HTML into the article component.

- Gallery: generous heading, two image-led ruled columns on desktop, one on mobile.
  No categories; order is supplied by the catalog, newest publication date first.
- Article: centered title, author/X/date, wide cover, readable prose, sticky left
  contents rail with active section on desktop and a native disclosure on mobile.
- Typography follows the shared contract: Geist Pixel Square headings, Sans body,
  Mono code. Surfaces/ink inherit the active product and light/dark palette.
- Native fragment links work without JavaScript. The small `blog.mjs` enhancement
  updates active sections, accounts for a sticky site header, and renders local
  KaTeX as accessible MathML. It does not fetch posts, mutate auth or own themes.
- Products compose their existing header and light/dark control. Autolaunch's blog
  preference is separate from its market's existing OS-following behavior.
- Images are author-owned assets, not automatically generated product artwork.
- `structure.css` includes `blog.css`; `mix regent_ui.assets` stages `blog.mjs`.
  Consumers import the staged module and invoke `mix regent_blog.assets` before
  bundling. Do not edit generated vendor copies or fork these styles per product.

Authoring instructions and an unpublished example live in each monorepo's root
`blog/`. Keep release source contexts and pinned dependency revisions aligned when
shipping a shared component change. Development/example data is not a published post.
