# Regent Style Guide

The canonical description of the Regent visual language. Machine sources stay canonical for
values — `design_system_tokens.css` (mirrored by `design_system_tokens.json`) — this document
explains the system so a person or agent can apply it without guessing.

The four applications share primitives and interaction conventions. Each owns its layout,
navigation, content and theme. The founder-approved palettes and SVGs are shared across all four sites.

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

`site svg backgrounds/` supplies eight cutting mats. `regent_ui.assets` packages
these with the shared primitives. Every product route uses its matching mat except
Regents `/` and Techtree `/`, which retain their existing background artwork.
Applications own these route exceptions; the shared component owns no routing.

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

### Capability honesty

Status chips (`live`, `beta`, `preview`, `planned`) appear wherever a product is being
presented, styled as bordered uppercase micro-labels, never hidden for marketing effect.

## Typography

Two faces, packaged with the shared UI library and served from the consuming application's
own origin. Both are Vercel Geist under the SIL Open Font License 1.1; the license ships
beside the files.

| Face | Canonical `font-family` name | Token | Use |
| --- | --- | --- | --- |
| Geist UI Sans | `"Geist UI Sans"` | `--font-family-sans`, `--font-family-ui`, `--font-family-paragraph` | Titles, headlines, display numbers, app body, forms, dense product UI, long-form prose |
| Geist Mono | `"Geist Mono"` | `--font-family-mono` | Code, readouts, identifiers, addresses, tabular figures |

`--font-family-sans` is the face; `--font-family-ui` and `--font-family-paragraph` are the
semantic roles that resolve to it. Headings (`h1`–`h6`) and every `data-text-style` use
`--font-family-ui`. There is no separate title or display face.

Only weights 400 and 600 exist, each with a genuine italic: `--font-weight-regular` and
`--font-weight-semibold`. Do not request other weights; the browser would synthesize them.

Font URL contract: the canonical CSS declares each face as
`url("/fonts/regent-ui/<file>")`, where the files are `Geist-Regular`, `Geist-Italic`,
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
  scale but stay on the two faces.

## Shape and spacing

- Spacing scale: `--space-0` is 0 and `--space-1` through `--space-7` step by 8px
  (8, 16, 24, 32, 40, 48, 56px). Containers, cards and sections pad their contents with
  `--container-padding` (24px).
- One radius: `--radius` (24px) rounds every box, including containers, cards, fields,
  buttons and chips. There are no size variants and no full or 999px pill override. A control
  shorter than 48px clamps the radius naturally into a pill without any forced height increase.
- Real circles (`border-radius: 50%`) are reserved for geometric avatars, indicators and
  spinners.
- Cards and panels sit on `--color-surface-elevated` with a 1px `--hairline` border and no
  (or barely-there) shadow.
- Sidebar and nav active states are soft accent-tinted pills (~8% accent over transparent)
  with accent text and icon — never inset bars or hard borders.

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

- Animate only `transform` and `opacity`. Enters use ease-out; on-screen moves use ease-in-out.
- Pressables scale to `--active-scale` (0.97) on `:active`; hero-grade cards may add pointer
  tilt and a faint specular shine (`--glass-shine`), gated behind
  `@media (hover: hover) and (pointer: fine)`.
- Content is visible by default. Scroll reveals hide elements only after script takes over
  (the landing's `rl-reveal-pending` pattern) so a page without JS is fully readable.
- OS `prefers-reduced-motion` wins: remove movement, swap layout immediately, and allow only a
  brief color/opacity dissolve. A later Account opt-in cannot override the OS preference.
- Keyboard-triggered UI never animates.

## Glass

Liquid glass is the treatment for cards that sit over artwork:

1. Artwork layer (shader canvas or halftone pattern).
2. Frost layer: `--glass-frost` gradient + `backdrop-filter: blur(var(--glass-blur))`,
   masked so the top frosts and the lower text zone stays readable.
3. Shine layer: `--glass-shine`, opacity 0 → 1 on hover, positioned by `--shine-x/--shine-y`.
4. Content layer: logo, title, tagline; hairline inset ring via box-shadow.

The older `--glass-*` panel/shell tokens remain the vocabulary for in-app panels; both derive
from the same four-color palette.

## Artwork

Generative print artwork, not stock imagery ("Paper Shaders", `@paper-design/shaders`):

- **Halftone CMYK** over generated dark source art: hero and section-band backgrounds.
- **Mesh gradient** in forge tones: Agent Formation.
- **God rays** in Tangerine Tango: Autolaunch.
- **Dot orbit** constellation (Powder Blue + Tangerine Tango): Techtree.

Static contexts use a CSS halftone dot pattern (radial-gradient grid) instead of a live canvas.
Every mount respects reduced motion and pauses offscreen. Placeholder content is always labeled
`Placeholder`; invented figures are labeled `Illustration`.

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
