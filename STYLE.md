# Regent Style Guide

The canonical description of the Regent visual language. Machine sources stay canonical for
values — `design_system_tokens.css` (mirrored by `design_system_tokens.json`) — this document
explains the system so a person or agent can apply it without guessing.

The four applications share primitives and interaction conventions. Each owns its layout,
navigation, content and theme. Preserve all eight approved palettes. The structural language
is a ruled technical sheet: actual aligned rules, square cells, flat cut-corner panels,
generous internal spacing and static technical figures. It is not a dark-and-orange theme.

## Identity

Regent is systematic restraint with a printed-machine character:

- **Systematic restraint** (the Stripe/Coinbase inheritance): four colors carry every surface;
  one action color per surface; semantic color reserved for status; consistent spacing,
  radius, and type scales; nothing decorated that could be plain.
- **Printed-machine character** (the Regent layer): hairline separators, uppercase
  micro-labels, mono readouts, halftone/print artwork, a flat saturated ground. The result
  should read like precision print on stock, not like a generic SaaS theme.

## Color

### Four colors carry everything

The whole system is four colors. Black is a contrast utility for text on Tangerine, not a fifth
identity color.

| Name | Token | Value |
| --- | --- | --- |
| Tangerine Tango | `--palette-tangerine-tango` | `#FF5B19` |
| Charcoal | `--palette-charcoal` | `#161616` |
| Platinum | `--palette-platinum` | `#E5E3D2` |
| Powder Blue | `--palette-powder-blue` | `#AECACD` |

The approved September 5 palettes use distinct light and dark surfaces. Regents
emphasizes charcoal, Autolaunch tangerine, Patchbay platinum, and Techtree powder
blue. Exact values come from the supplied `site color palettes/` images and are
implemented in `design_system_tokens.css`. The earlier fixed-ground palettes are retired.

Page background SVGs are retired. `--site-background-image` is `none` in every theme,
and `Regent.SiteBackground` remains an inert compatibility component so consumers
can remove their calls without a breaking import. Preserve the eight assets in
`site svg backgrounds/` and the package for potential future small illustration sections;
do not use them as page backgrounds. Real layout borders supply the page structure.
Consumer-owned artwork and route wiring need deliberate migration in the owning app;
changing this package does not claim those applications have been deployed or migrated.

### Readable pairs only

Platinum and Powder Blue are never text colors on Tangerine (2.4:1 and 1.8:1). Black or Charcoal
supplies readable text there. The pairs the system guarantees:

- Platinum on Charcoal — 14.0:1
- Black on Tangerine — 6.8:1
- Charcoal on Powder Blue — 10.5:1

Platinum and Powder Blue may be highlighted *surfaces* on a Tangerine page as long as the text
inside them is black or Charcoal.

Separators are hairlines mixed from the foreground, not solid borders:
`--hairline` (14% fg) for structure, `--hairline-strong` (26% fg) for interactive edges.

### Status stays independent of identity

Status colors report state, never identity, so each set is chosen for readability on its product's
ground rather than for brand voice.

| Status | Regent / Platform | Autolaunch and Techtree |
| --- | --- | --- |
| Success | `#7ED8A9` | `#053022` |
| Error | `#FF9B8F` | `#5A0B0B` |
| Warning | `#F5C16C` | `#3D1B00` |
| Info | `#AECACD` | `#072C38` |

Every one of these clears WCAG AA for normal text on its product's background, surface, and
elevated surface.

### Product identities

The brand attribute (`data-brand`) selects a product's whole contract. The identity constants are
also available everywhere as `--product-*` tokens for highlights that must not move the page
action color.

| Product | Identity | Token |
| --- | --- | --- |
| Regents Labs / Platform | Charcoal ground, Powder Blue action | — |
| Agent Formation | Tangerine Tango | `--product-formation` |
| Autolaunch | Tangerine Tango | `--product-autolaunch` |
| Techtree | Powder Blue | `--product-techtree` |
| Techtree secondary | Tangerine Tango | `--product-techtree-bio` |

Rules:

- One action color per surface. `--color-accent-secondary` (mirrored by `--brand-accent`) carries
  the product's highlight; it is a note, not a second button color.
- On Autolaunch, `--brand-accent` is Powder Blue and is for non-text highlights only — chips,
  rules, fills, and marker shapes. Never set it as text color on Tangerine (1.8:1), and keep the
  text inside any highlighted element black or Charcoal.
- Formation renders inside the platform brand; use `--product-formation` for
  Formation-specific highlights rather than switching the page action color.
- Status colors (success, error, warning, info) are for state only, never identity.

### Supporting palette compartments

The reusable `--support-{figure,band,panel}-{surface,ink}` pairs use the other three
identity constants in both modes, without changing base/semantic values or Patchbay aliases:

| Brand (primary identity) | Figure | Narrow band | Secondary panel |
| --- | --- | --- | --- |
| Regents (Charcoal) | Powder Blue | Tangerine | Platinum |
| Autolaunch (Tangerine) | Powder Blue | Charcoal | Platinum |
| Patchbay (Platinum) | Powder Blue | Tangerine | Charcoal |
| Techtree (Powder Blue) | Platinum | Tangerine | Charcoal |

Charcoal surfaces use Platinum ink; the other surfaces use Charcoal ink. Opt into
`rg-support-figure` on technical figures, `rg-support-band` on narrow section bars,
and `rg-support-panel` on secondary panels. Keep main surfaces/actions dominant;
do not assign arbitrary colors per card. The showcase demonstrates these as a hero
figure compartment, Capabilities band and secondary interface panel respectively.

### Capability honesty

Status chips (`live`, `beta`, `preview`, `planned`) appear wherever a product is being
presented, styled as bordered uppercase micro-labels, never hidden for marketing effect.

## Typography

Three faces, packaged with the shared UI library and served from the consuming application's
own origin. All are Vercel Geist under the SIL Open Font License 1.1; the license ships
beside the files.

| Face | Canonical `font-family` name | Token | Use |
| --- | --- | --- | --- |
| Geist Pixel Square | `"Geist Pixel Square"` | `--font-family-title` | All titles and subtitles, headings, section bars, disclosure titles, empty-state titles and wordmarks |
| Geist UI Sans | `"Geist UI Sans"` | `--font-family-sans`, `--font-family-ui`, `--font-family-paragraph` | Body, forms, navigation, labels, captions, legal text and other UI |
| Geist Mono | `"Geist Mono"` | `--font-family-mono` | Code, technical indices, addresses and readouts |

`--font-family-ui` and `--font-family-paragraph` resolve to Geist UI Sans. Headings
(`h1`–`h6`) and display/title/headline text styles use Pixel Square. Mono is reserved
for technical/code roles rather than general UI text.

Pixel Square is genuine upright **400 only**, with `font-synthesis: none`; never fake
bold or italic Pixel. Sans and Mono support 400 and 600 with genuine italics, using
`--font-weight-regular` and `--font-weight-semibold`.

Font URL contract: the canonical CSS declares each face as
`url("/fonts/regent-ui/<file>")`, where the files are `GeistPixel-Square`, `Geist-Regular`, `Geist-Italic`,
`Geist-SemiBold`, `Geist-SemiBoldItalic`, `GeistMono-Regular`, `GeistMono-Italic`,
`GeistMono-SemiBold` and `GeistMono-SemiBoldItalic` (all `.woff2`) plus `OFL.txt`. They live in
`regent_ui/priv/static/fonts/`, generated from `geist-font/` by `scripts/generate-tokens-json.mjs`,
and `mix regent_ui.assets` copies them into the application's `priv/static/fonts/regent-ui/`.
The application serves `fonts` as a static path; no cross-origin font host is involved.

Math rendered by KaTeX keeps its own scoped KaTeX fonts, and Markdown output keeps its
structure: prose paragraphs take the paragraph role, and code spans and blocks take mono.

Patterns that generalize:

- Uppercase micro-labels at 0.6–0.7rem with 0.14–0.22em tracking (`--tracking-microlabel`)
  for kickers, figure labels ("FIG.1 — Identity"), column headings, and chips.
- Mono for anything an operator might copy: commands, slugs, versions, addresses.
- `font-variant-numeric: tabular-nums` on counters and money figures.
- Type scale tokens (`--type-*`) govern app surfaces; marketing heroes may clamp beyond the
  scale but stay on the assigned title/body/technical roles.

## Shape and spacing

- Spacing stays eight-pixel: `--space-0` is 0; `--space-1` through `--space-8` are
  8–64px. `--container-padding` and `--rg-panel-padding` default to 32px. Ruled-sheet
  panel padding becomes 24px below 1200px and 16px below 384px.
- The former universal 24px radius is replaced, not layered over. `--radius: 0px`
  keeps frames, navigation, fields, statuses, tables, secondary controls and disclosures square.
- Major panels use four fixed 45-degree cuts: `--rg-cut-panel` is 16px desktop,
  12px below 768px. Primary buttons cut top-left and bottom-right only, 12px desktop
  and 8px mobile. Secondary actions are square outlines; quiet actions are text.
- Across **all four brands**, dark primary controls rest with 1px Powder Blue L-strokes
  at the top-right/bottom-left square corners and Tangerine accents inset 1px along
  the top-left/bottom-right cuts. Light controls rest with two opposite Tangerine
  L-edges and no diagonal marks. Rest marks occupy cut-sized tiles (12px/8px).
- Enabled primary hover/focus-visible grows the four straight edges to full length
  and crossfades the cut accents into a continuous matching cut outline in **150ms**.
  Base transitions reverse on leave, including an interrupted entrance, without JS
  or additional markup. CSS reversal shortening applies to interrupted transitions;
  complete rest-to-hover and hover-to-rest transitions each take 150ms.
  `--rg-button-border-color` overrides the active outline and light rest edges,
  falling back to `--rg-shimmer-color`, then Tangerine. Dark rest marks keep their
  canonical blue/orange pairing. Only `::after` clips; hit areas remain rectangular.
  Reduced motion swaps outline states instantly. Forced colors omit decoration and
  retain a rectangular system border plus the distinct external keyboard focus ring.
- Clip visual pseudo-elements only. Panel and button hosts have no clipping or hidden
  overflow, so menus, focus rings and expanded validation remain visible. Two inset
  skins supply the diagonal perimeter. Never fake a diagonal stroke with a clipped CSS border.
- Panels are flat and opaque. No default glass, gradient, shadow, glow, hover lift or tilt.
  Pair `--rg-panel-fill` and `--rg-panel-ink`; the `accent` variant consumes the existing
  accent/on-accent pair, including Patchbay aliases. Local rules and texture use local ink.
- Real circles remain valid for geometric avatars, indicators and spinners.
- Connected features have 1px seams and separate heading, near-square figure and caption
  bands. CSS subgrid aligns bands across a row; captions grow with content. The cuts themselves
  form the diamond-shaped gaps. Do not add decorative diamonds at panel joints.
  Hover and focus-within add a faint edge and a shared full-area shimmer over the face media.
  Only an inert visual skin clips; text, media and focus stay unclipped. No lift,
  idle animation or moving reduced-motion state.
- Active navigation has a visible structural indicator and text emphasis, not a pill or
  color alone. Essential field/control boundaries are stronger than decorative hairlines.

### Shared compositions

`Regent.Structure` supplies `frame`, `row`, `section_bar`, `panel`, `technical_figure`,
`capability_card`, and `ratio_card`.
`primitives.css` imports `structure.css` (including `ratio.css`); consumers still import the canonical tokens first.
`row` reserves the same optional 176px rail and 32px gutter throughout header, hero,
features and footer. Set `rail={false}` on **every** row for a no-rail frame; otherwise
empty rail slots preserve alignment. Rail content lives in `:rail_content`. The maximum
frame is 1600px with 32px outer margins. Below 1200px use 144px rail and 24px margins/gutters;
below 1024px navigation reflows in-document; below 768px columns stack and margins are 16px.
Each boundary has one owner: frame edges, row bottom, rail right, main left, hero divider.

Section bars contain the caller's real heading (with `rg-section-bar__label`), an 8px
decorative diamond and a CSS patterned leader. Decorations are aria-hidden; the leader
disappears on mobile before labels become too small. Bars wrap and grow.

Use `rg-hero` with copy/actions/disclosures before the illustration in DOM order. Hero
titles are Geist Pixel Square 400, 40–72px, line-height 1.03 and tracking -0.045em. Descriptions use
16px/24px with a 52ch maximum. Heading-to-copy spacing is 24px; action spacing is 48px.
These are opt-in display roles, not overrides for dense application typography.

Disclosures remain native `details`/`summary`. Optional `index` uses a mono column;
summary rows are at least 64px, and expanded content aligns with the title and pads
24px below. Essential errors and outcomes stay outside collapsed details.

`capability_card` requires string `title` and `description`. Optional string `index`
defaults to `nil`; `tone` is `surface` (default) or `accent`; `image_src` defaults to
`nil` and `image_alt` to `""`. A supplied image takes precedence over the optional
`:media` slot (for custom SVG). Optional `:actions` holds real caller-owned links or
controls. `class` and global attributes are forwarded to the semantic `article.rg-feature`.
The face panel contains an `h3`, optional index and figure; a separate caption panel
contains the description and actions. There is no implicit click handler, added tab
stop or product state. Images/SVGs use a square, full-width contained media box;
informative images need an explicit alt, while decorative images keep the empty default.

`ratio_card` is a static bracketed metric sheet: square frame, four inert corner
L-strokes, header/footer rules, a computed percentage header badge (`No data` when
unknown), uppercase labels above baseline-aligned Pixel Square 400 percentages,
canonical Tangerine fill, vertical-striped remainder and five scale labels. The footer
label sits above the tiles and right-aligned optional badge. Its unique `id`
and `title` are required strings. Integer `value_bps` is `0..10000` or `nil` (default):
paired labels and the named `0..100` meter derive from the same basis points,
trimmed to at most two decimals. Invalid inputs raise `ArgumentError`; `nil` shows
em dashes and `No data` without a meter. Defaults are `eyebrow="Allocation"`,
`label="Allocated"`, `remainder_label="Remaining"`, `footer_label="Details"` and
`change={nil}`. Change text is caller-defined, including period; it is not calculated.
Optional `:footer`/`:footer_badge` slots and `class`/global attributes provide content
without implicit actions. Use `rg-ratio-card__tile` for static footer tiles.
Orange notes mix 55% Tangerine with local ink on a 12% Tangerine/local-surface tint;
never use raw orange as small badge ink in light mode. Content stays unclipped,
metrics stack at a 30rem container width, and forced colors retain system borders
and a solid Highlight meter fill. No shimmer or idle animation applies.

Feature groups and closing sections remain small HTML compositions, not a page-builder API.
Use three/two/one feature columns and 1px gaps; an odd final card never spans a whole row.
The closing copy/action, link directory, broad brand band and legal row reuse frame tracks.
Use approved marks or Geist Pixel Square brand text, never borrowed wordmarks or invented metrics.

## Product layouts and disclosure

Each product chooses document scrolling, panels, rails and navigation to fit its users.
There is no required universal shell or landing-page theme. Shared components do not own
routes, authentication, persistence, wallet admission, or product workflows.

Keep pages text-light: show the object, current state and primary action first. Put supporting
explanation, provenance and technical detail behind a labeled chevron using native details
and summary. Keep errors, transaction outcomes, costs and information needed to choose an
action visible. Collapsed content stays rendered. Authorized agent tools return the same
complete detail independently of visual expansion; DOM hiding is not access control.

Patchbay retains its existing `--pb-*` theme: `--pb-text`, `--pb-text-muted`, `--pb-surface`,
`--pb-line`, `--pb-accent`, `--pb-accent-ink`, `--pb-good` and `--pb-bad` map directly to the
shared primitives. The other products use their `--color-*` semantic tokens. Do not recolor
Patchbay or replace a product layout merely to consume a common button or disclosure.

## Motion

General tokens: `--duration-fast|base|slow`, `--ease-out`, `--ease-in-out`, `--active-scale`.
Shell phase tokens: `--shell-duration-interruption` (100ms), `--shell-duration-exit` (180ms),
`--shell-duration-entrance` (200ms), and `--shell-duration-border-settle` (100ms).

Shell transitions are sequential and non-overlapping. On interruption, fade for 100ms, then
resolve the newest destination. The outgoing view exits from 0–180ms; only after that exit
completes does the incoming view enter from 180–380ms. The border shimmer/settle follows for
100ms and ends at about 480ms. Do not keep an outgoing DOM clone, and do not add a nested
duplicate slide inside the route transition. Movement is limited to transform and opacity.

- Animate only `transform` and `opacity` except the shared interaction-only background
  shimmer and 150ms primary-outline paint transitions below. Enters use ease-out;
  on-screen moves use ease-in-out.
- Shared structural controls retain clear focus. No card lift, pointer-following shine,
  perspective or idle decorative animation is enabled.
- Every enabled primary `.rg-button` shimmers on hover/focus-visible, with no per-use
  opt-in and no palette-specific gating. Secondary, quiet, native disabled, `[disabled]`
  and `aria-disabled="true"` controls do not shimmer. Cards shimmer on hover/focus-within.
  Both use `rg-shimmer`: a 100-degree linear gradient, transparent stops at 30%/70%,
  restrained orange highlight at 50%, `300% 100%` size, moving from `160% 0` to `-60% 0`
  with `var(--ease-out)`. Loops exist only for the active interaction.
- `--rg-shimmer-color` is an inherited optional source-color override, defaulting to
  Tangerine (`--palette-tangerine-tango`, fallback `#ff5b19`), never paired gray/blue ink.
  The highlight mixes 75% of that source with canonical Platinum, then applies 24% strength against
  transparent. This preserves warmth on pale fills, remains visible on Tangerine itself,
  and keeps default text contrast without an opaque label rectangle. Custom colors,
  local fill/ink overrides and opacity remain the caller's contrast responsibility;
  there is no runtime color validator or conditional recoloring.
  `--rg-shimmer-duration` defaults to `1.15s` for buttons; cards use
  `calc(var(--rg-shimmer-duration, 1.15s) * 3)` (default `3.45s`).
  Button `::before` remains the clipped accent fill/sweep, while `::after` owns the outline.
  Existing `rg-button__label` spans are transparent and optional for CSS-only links.
  Primary text never underlines, including under later consumer `.sc a:hover` rules.
  Card `.rg-feature__shimmer` is an aria-hidden, pointer-inert full-media-area overlay
  inside `.rg-technical-figure__art`, so opaque images cannot hide the area sweep.
  Heading, caption and actions stay outside the overlay, preserving their paired ink.
  Only the visual overlay clips; actual media, content and external focus rings do not.
- Content is visible by default. Scroll reveals hide elements only after script takes over
  (the landing's `rl-reveal-pending` pattern) so a page without JS is fully readable.
- OS `prefers-reduced-motion` wins: remove movement, swap layout immediately, and allow only a
  brief color/opacity dissolve. A later Account opt-in cannot override the OS preference.
- Keyboard-triggered UI never animates except this explicit focus shimmer. Reduced
  motion and forced colors disable shimmer entirely (no static area gradient); reduced
  motion keeps only the static faint card edge, and forced colors keep system-color borders.

## Glass

`design_system_glass.css` and its tokens remain import-stable for existing specialized
renderers. They are legacy opt-in assets, not the current panel treatment. New shared
structure uses opaque semantic surfaces, no blur, and no new animation dependency.
The interaction-only shimmer is the restrained exception to undecorated panel skins.

## Artwork

Existing product artwork (not defaults for new structural compositions):

- **Halftone CMYK** over generated dark source art: hero and section-band backgrounds.
- **Mesh gradient** in forge tones: Agent Formation.
- **God rays** in Tangerine Tango: Autolaunch.
- **Dot orbit** constellation (Powder Blue + Tangerine Tango): Techtree.

Use static SVG technical figures in dedicated compartments: sparse circles, wireframes,
triangles and leader lines, 1–1.5px non-scaling strokes. Informative art needs a text
equivalent; decorative SVGs are aria-hidden. Local dots use approximately 0.6px radius,
4px pitch and 10% opacity. Never put texture behind copy, tables, code, fields or buttons;
never stack patterns. No page background SVGs. Existing optional animation mounts must
respect reduced motion. Placeholder content is labeled `Placeholder`; invented diagrams
are labeled `Illustration`.

## Logos

`logos/` holds the canonical marks — these are the site-wide logos going forward:

- **Crown** = Regents Labs, **chart** = Autolaunch, **tree** = Techtree.
- `voxel` style for hero placements; `flat` below ~48px (favicons, avatars, chips).
- `dark` scheme on near-black surfaces, `light` scheme on white; production rasters,
  favicons, and share images live in `logos/png/`.

See `logos/README.md` for grid, palette, and export details. Do not restyle, tint, or shadow
the marks; pick the correct scheme instead.

## Consumption

- Use `Regent.Primitives` for buttons, fields/errors, statuses, notices, empty states and
  disclosures. Apps supply slots, routes, events and state.
- Run `mix regent_ui.assets` before the consuming CSS build. Ignore the generated
  `assets/vendor/regent_ui/`, `priv/static/images/regent-ui/` and `priv/static/fonts/regent-ui/`
  directories and import `primitives.css` for primitives only. Existing spatial surfaces can
  import generated `regent.css`; it has global styling.
- Dependency paths resolve through Mix, including pinned isolated checkouts.
- For a standalone Docker context, run `mix regent_ui.stage` first and copy generated
  `vendor/regent_ui` into the image. Set `REGENT_UI_PATH` to that path in the image.
  Run `mix regent_ui.stage` from the consumer’s `platform/` directory with `REGENT_UI_PATH` set to the selected shared UI checkout.
  It requires the pinned snapshot and `REGENT_UI_REVISION`, verifies exported content,
  and records revision plus SHA256 in `.regent-ui-generated`. Retain that build evidence.
  Ignore staging/history outputs; this command packages local source and never deploys.
- The package supports locked LiveView 1.1 and 1.2 consumers. Verify both lines and
  representative consuming pages; do not upgrade frameworks incidentally.
- Change shared token values at their source and regenerate the JSON/package mirrors.
- Verify keyboard focus, labels/errors, mobile wrapping, empty states and reduced motion
  in each product theme. A component render test alone is not visual QA.

### Structural acceptance and showcase

From `regent_ui/`, run `mix run ../scripts/render-structure-showcase.exs`, then from the
repository root run `python3 -m http.server 8766 --bind 127.0.0.1 --directory .showcase`.
Open `http://127.0.0.1:8766/`. This renders actual shared Phoenix components to one HTML
document; product/theme selectors only change root attributes. It needs no product database.
Use its long-label toggle, expanded errors, disabled state, native select/dialog and overflow
options for desktop, 320px reflow, 200% text, keyboard, reduced-motion and forced-colors review.
Do not treat this as completed adoption in four products. Verify a bounded consumer after
the shared visual direction is accepted, before rolling pinned revisions to the other apps.
