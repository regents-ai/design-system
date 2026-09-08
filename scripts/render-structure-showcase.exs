# Run from regent_ui: mix run ../scripts/render-structure-showcase.exs
# Real Phoenix components, exported for browser review without a product database.
defmodule Regent.StructureShowcase do
  use Phoenix.Component
  import Regent.Structure
  import Regent.Primitives

  def page(assigns) do
    ~H"""
    <a class="showcase-skip" href="#main">Skip to content</a>
    <div class="showcase-toolbar">
      <span>Shared structure / local preview</span>
      <.field id="brand" label="Product">
        <select id="brand">
          <option value="platform">Regents</option>
          <option value="autolaunch">Autolaunch</option>
          <option value="patchbay">Patchbay</option>
          <option value="techtree">Techtree</option>
        </select>
      </.field>
      <.field id="theme" label="Theme">
        <select id="theme">
          <option>light</option>
          <option>dark</option>
        </select>
      </.field>
      <label><input id="stress" type="checkbox" /> Long labels</label>
    </div>
    <.frame>
      <.row class="rg-sheet-header">
        <:rail_content>
          <div class="showcase-brand-tab">REGENT / UI</div>
        </:rail_content>
        <header class="rg-sheet-nav">
          <a href="#capabilities">Capabilities</a><a href="#details">Details</a>
          <a href="#closing">Resources</a>
          <span class="showcase-meta">STRUCTURAL EDITION / 01</span>
        </header>
      </.row>
      <.row>
        <:rail_content>
          <nav class="rg-rail-nav" aria-label="Sections">
            <a href="#main" aria-current="location"><span>01</span> Overview</a>
            <a href="#capabilities"><span>02</span> Capabilities</a>
            <a href="#details"><span>03</span> Interface states</a>
            <a href="#closing"><span>04</span> Resources</a>
          </nav>
        </:rail_content>
        <main id="main" class="rg-hero">
          <div class="rg-hero__copy">
            <.section_bar>
              <p class="rg-section-bar__label">A shared visual language</p>
            </.section_bar>
            <h1 class="rg-hero-title">One structure.<br />Room to build.</h1>
            <p class="rg-hero-description">
              Clear boundaries. Deliberate space. A common interface for four products,
              without giving up what makes each one distinct.
            </p>
            <div class="rg-hero-actions">
              <.button id="hero-action" data-scroll-to="capabilities">
                <span
                  data-short="Explore the system"
                  data-long="Explore the shared structural design system and its accessible component states"
                >
                  Explore the system
                </span>
              </.button>
            </div>
            <.disclosure id="principle-1" index="01" summary="Structure before decoration" open>
              <p>
                Shared edges carry the page. Fine rules separate meaningful regions; space stays inside them.
              </p>
            </.disclosure>
            <.disclosure id="principle-2" index="02" summary="One geometry, eight themes">
              <p>
                Surface and foreground always travel together. Product palettes stay independent of layout.
              </p>
            </.disclosure>
            <.disclosure id="principle-3" index="03" summary="Details remain available">
              <p>
                Native disclosure keeps supporting content in the document. Errors and action outcomes stay visible.
              </p>
            </.disclosure>
          </div>
          <div class="rg-hero__figure">
            <.technical_figure class="showcase-hero-figure rg-support-figure">
              <svg
                viewBox="0 0 320 440"
                fill="none"
                stroke="currentColor"
                stroke-width="1.2"
                aria-hidden="true"
              >
                <path d="M160 24V416" stroke-dasharray="2 6" opacity=".4" />
                <path d="M160 46 224 100 160 148 96 100Z M160 46V148 M96 100H224" />
                <path d="M160 156 278 214 160 276 42 214Z" opacity=".4" />
                <circle cx="160" cy="214" r="58" /><ellipse cx="160" cy="214" rx="58" ry="23" />
                <path d="M160 292 235 332 160 372 85 332Z M85 332V350L160 390 235 350V332 M160 372V390" />
                <path d="M160 100H284 M160 214H284 M160 332H284" opacity=".6" />
                <circle
                  :for={y <- [24, 100, 214, 332, 416]}
                  cx="160"
                  cy={y}
                  r="3"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              <:caption>Illustration / boundaries, surfaces, connections</:caption>
            </.technical_figure>
          </div>
        </main>
      </.row>
      <.row>
        <section id="capabilities" class="rg-inset rg-section">
          <.section_bar class="rg-support-band">
            <h2 class="rg-section-bar__label">Capabilities</h2>
          </.section_bar>
          <div class="rg-feature-grid rg-section__body">
            <.capability_card
              :for={{title, caption, kind, index} <- features()}
              title={title}
              description={caption}
              index={index}
              tone={if index == "001", do: "accent", else: "surface"}
              data-short-title={title}
              data-long-title={title <> " across connected product experiences"}
            >
              <:media>
                <svg
                  viewBox="0 0 240 240"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                  aria-hidden="true"
                >
                  <path d="M12 24V12H24 M216 12H228V24 M228 216V228H216 M24 228H12V216" />
                  <circle
                    :for={r <- [80, 62, 44, 26]}
                    :if={kind == :circles}
                    cx="120"
                    cy={190 - r}
                    r={r}
                  />
                  <path
                    :for={y <- [36, 60, 84, 108, 132, 156]}
                    :if={kind == :triangle}
                    d={"M120 #{y}L40 194H200Z M120 #{y}V194"}
                  />
                  <circle
                    :for={{x, y} <- [{120, 87}, {84, 149}, {156, 149}]}
                    :if={kind == :overlap}
                    cx={x}
                    cy={y}
                    r="52"
                  />
                </svg>
              </:media>
              <:actions :if={index == "001"}>
                <a href="#details">Explore interface states</a>
              </:actions>
            </.capability_card>
          </div>
        </section>
      </.row>
      <.row>
        <section id="details" class="rg-inset rg-section">
          <.section_bar>
            <h2 class="rg-section-bar__label">Interface states / interactive examples</h2>
          </.section_bar>
          <div class="rg-split rg-section__body">
            <.panel id="overflow-panel" class="rg-support-panel">
              <div class="rg-panel__body showcase-stack">
                <h3 class="rg-section-title">Space for the details.</h3>
                <p>These controls are local examples. They do not submit data or connect a wallet.</p>
                <.field
                  :let={field}
                  id="sample-name"
                  label="Display name"
                  errors={[
                    "Example error: choose a name that makes this workspace easy to identify. This message remains visible and wraps without clipping."
                  ]}
                >
                  <input
                    id={field.id}
                    aria-describedby={field.described_by}
                    aria-invalid={field.aria_invalid}
                    value=""
                  />
                </.field>
                <.field :let={field} id="sample-select" label="View density">
                  <select id={field.id}>
                    <option>Comfortable</option>
                    <option>Compact</option>
                  </select>
                </.field>
                <div class="showcase-actions">
                  <.button variant="secondary" id="open-dialog">Open dialog</.button>
                  <.button disabled aria-busy="true">Pending example</.button>
                </div>
                <details class="showcase-menu">
                  <summary id="menu-trigger">Open overflow options</summary>
                  <div class="showcase-menu__items">
                    <a href="#closing">Read the component guide</a>
                    <button type="button" id="menu-close">Close options</button>
                  </div>
                </details>
              </div>
            </.panel>
            <div class="showcase-stack">
              <.notice tone="error">
                Example error — the requested action did not complete. No data was sent.
              </.notice>
              <div class="showcase-actions">
                <.status tone="success">Saved example</.status>
                <.status tone="warning">Review required</.status>
              </div>
              <.empty_state title="No items in this example">
                A real application supplies the state and its next action.
                <:action>
                  <.button variant="quiet" data-scroll-to="capabilities">
                    Return to capabilities
                  </.button>
                </:action>
              </.empty_state>
              <.disclosure id="expanded-errors" index="04" summary="Expanded validation details" open>
                <p>
                  Complete explanation remains readable at narrow widths and increased text sizes.
                </p>
                <code>example_identifier_with_a_deliberately_long_unbroken_value_for_reflow</code>
              </.disclosure>
            </div>
          </div>
        </section>
      </.row>
      <.row>
        <footer id="closing" class="rg-closing rg-section">
          <div class="rg-split">
            <div>
              <.section_bar>
                <h2 class="rg-section-bar__label">Build with the shared system</h2>
              </.section_bar>
              <h3 class="rg-section-title rg-section__body">
                Keep the palette.<br />Change the structure.
              </h3>
              <p>Presentation is shared. Product decisions remain yours.</p>
              <.button data-scroll-to="main">Back to the overview</.button>
            </div>
            <nav class="rg-link-directory" aria-label="Resources">
              <div>
                <h3>Foundations</h3>
                <a href="#main">Structure</a><a href="#capabilities">Geometry</a><a href="#details">Interaction</a>
              </div>
              <div>
                <h3>Reference</h3>
                <a href="/STYLE.md">Style guide</a><a href="/CONSUMERS.md">Consumption</a><a href="/design_system_tokens.json">Tokens</a>
              </div>
            </nav>
          </div>
          <.panel tone="accent" class="rg-wordmark-band">
            <span class="showcase-meta">ONE SHARED SYSTEM / FOUR PRODUCT IDENTITIES</span>
            <p class="rg-wordmark-band__name">Regent systems.</p>
          </.panel>
        </footer>
      </.row>
      <.row>
        <div class="rg-legal">
          <span>Regents / shared design language</span><span>Local showcase · illustrative content</span>
        </div>
      </.row>
    </.frame>
    <dialog id="sample-dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">A native dialog</h2>
      <p>Focus remains inside until this dialog closes.</p>
      <form method="dialog"><.button type="submit">Close dialog</.button></form>
    </dialog>
    """
  end

  defp features do
    [
      {"Clear boundaries",
       "Rules and shared edges give every region a deliberate place on the page.", :circles,
       "001"},
      {"Common structure",
       "One set of primitives, assembled to suit the product rather than impose a universal shell.",
       :triangle, "002"},
      {"Connected parts",
       "Independent products. Paired surfaces. A consistent language for actions and information.",
       :overlap, "003"}
    ]
  end
end

root = Path.expand("..", File.cwd!())
out = Path.join(root, ".showcase")
File.mkdir_p!(out)

body =
  Regent.StructureShowcase.page(%{}) |> Phoenix.HTML.Safe.to_iodata() |> IO.iodata_to_binary()

html = """
<!doctype html>
<html lang="en" data-brand="platform" data-theme="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Regent / ruled structural system</title>
<link rel="stylesheet" href="/css/design_system_tokens.css">
<link rel="stylesheet" href="/css/primitives.css">
<link rel="stylesheet" href="/showcase.css">
<script src="/showcase.js" defer></script></head>
<body>#{body}</body></html>
"""

File.write!(Path.join(out, "index.html"), html)
File.cp_r!(Path.join(root, "regent_ui/assets/css"), Path.join(out, "css"))
File.mkdir_p!(Path.join(out, "fonts"))
File.cp_r!(Path.join(root, "regent_ui/priv/static/fonts"), Path.join(out, "fonts/regent-ui"))

for name <- ~w(STYLE.md CONSUMERS.md design_system_tokens.json),
    do: File.cp!(Path.join(root, name), Path.join(out, name))

for name <- ~w(showcase.css showcase.js),
    do: File.cp!(Path.join(root, "scripts/" <> name), Path.join(out, name))

IO.puts("Rendered actual Regent components to #{out}/index.html")
