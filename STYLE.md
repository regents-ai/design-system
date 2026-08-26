# Regent Style Guide

The canonical description of the Regent visual language. Machine sources stay canonical for
values — `design_system_tokens.css` (mirrored by `design_system_tokens.json`) — this document
explains the system so a person or agent can apply it without guessing.

Reference implementation: the public landing page (`platform/lib/regents_web/components/landing_components.ex`
with `platform/assets/css/landing.css`). When this guide and a shipped surface disagree, fix
one of them in the same pass.

## Identity

Regent is systematic restraint with a printed-machine character:

- **Systematic restraint** (the Stripe/Coinbase inheritance): four colors carry every surface;
  one action color per surface; semantic color reserved for status; consistent spacing,
  radius, and type scales; nothing decorated that could be plain.
- **Printed-machine character** (the Regent layer): pixel display type, hairline separators,
  uppercase micro-labels, mono readouts, halftone/print artwork, a flat saturated ground. The
  result should read like precision print on stock, not like a generic SaaS theme.

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

Identity lives in the ground, not in a lone accent. Each product owns a base color and keeps it
whichever Light/Dark the reader picks: `data-theme` still varies the frost and shine of glass, but
it never moves a product's ground, foreground, action, muted, or status values.

| Role | Regent / Platform | Autolaunch | Techtree |
| --- | --- | --- | --- |
| Background | `#161616` Charcoal | `#FF5B19` Tangerine | `#AECACD` Powder Blue |
| Surface | `#20201E` | `#FF7A45` | `#C4D8DA` |
| Surface, elevated | `#2A2A27` | `#E5E3D2` Platinum | `#E5E3D2` Platinum |
| Border | `#57564F` | `#161616` Charcoal | `#3F4F51` |
| Text | `#E5E3D2` Platinum | `#000000` black | `#161616` Charcoal |
| Text, muted | `#AAA99C` | `#4F1600` | `#3F4F51` |
| Primary action | `#AECACD` Powder Blue | `#161616` Charcoal | `#161616` Charcoal |
| Text on action | `#161616` Charcoal | `#E5E3D2` Platinum | `#E5E3D2` Platinum |
| Highlight | `#FF5B19` Tangerine | `#AECACD` Powder Blue | `#FF5B19` Tangerine |
| `color-scheme` | `dark` | `light` | `light` |

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
- Formation renders inside the platform brand; use `--product-formation` for
  Formation-specific highlights rather than switching the page action color.
- Status colors (success, error, warning, info) are for state only, never identity.

### Capability honesty

Status chips (`live`, `beta`, `preview`, `planned`) appear wherever a product is being
presented, styled as bordered uppercase micro-labels, never hidden for marketing effect.

## Typography

| Face | Token | Use |
| --- | --- | --- |
| Geist Pixel Circle | `--font-family-title` | Titles, headlines, display numbers |
| Geist Pixel Square | `--font-family-pixel` | Body on marketing/terminal-flavored surfaces |
| Geist UI Sans | `--font-family-ui` / `--font-family-sans` | App body, forms, dense product UI |
| Geist Mono | `--font-family-mono` | Code, readouts, identifiers, tabular figures |

Patterns from the landing that generalize:

- Uppercase micro-labels at 0.6–0.7rem with 0.14–0.22em tracking (`--tracking-microlabel`)
  for kickers, figure labels ("FIG.1 — Identity"), column headings, and chips.
- Mono for anything an operator might copy: commands, slugs, versions, addresses.
- `font-variant-numeric: tabular-nums` on counters and money figures.
- Type scale tokens (`--type-*`) govern app surfaces; marketing heroes may clamp beyond the
  scale but stay on the two pixel faces.

## Shape

- Radius scale: `--radius-sm|md|lg|full`. Cards and panels sit on `--color-surface-elevated`
  at `--radius-lg` with a 1px `--hairline` border and no (or barely-there) shadow.
- Buttons are pill-shaped via `--radius-button` (points at `--radius-full`); revert that one
  token to `var(--radius-md)` to restore soft rectangles everywhere.
- Sidebar and nav active states are soft accent-tinted pills (~8% accent over transparent)
  with accent text and icon — never inset bars or hard borders.

## Application shell

The product application is one persistent viewport. Document scrolling is disabled inside that
shell; headers, rails, task panes, and other components own their internal scrolling. Route
changes preserve a stable routed task context instead of replacing the application frame. A
long-form reading pane remains a normal `65–80ch` column inside the same viewport rather than
becoming a separate document-scrolling layout.

Route metadata selects one of three app background families: neutral Regent/Platform, Techtree,
or Autolaunch. Each family supports both light and dark themes. Background artwork is supplied by
the consuming application; these families do not imply fallback artwork or component color forks.

The separate `/` marketing landing page is always light. It has no theme control and must render
without a dark flash. Its composition and copy remain independent from the persistent app shell.

RegentUI is presentation only. It owns no route or LiveView lifecycle, product workflow,
authentication decision, persistence, or money behavior.

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
- **God rays** in greens: Autolaunch.
- **Dot orbit** constellation (blues + biology green): Techtree.

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

- RegentUI package consumers import only `assets/css/regent.css`; that package-relative entry
  imports the generated token and glass layers before its component styles.
- Set `data-brand` (`platform | autolaunch | techtree`) and `data-theme` (`light | dark`) on
  the root element; every token above resolves from those two attributes.
- The separate `/` landing remains always light and outside the app theme contract. It exposes
  no theme control and must render without a dark flash.
- Change tokens here first (`design_system_tokens.css`), regenerate the JSON mirror, then let
  consumers pick the change up. Never fork per-component color values downstream.
- Acceptance: `cd regent_ui && mix test`, plus the platform stylesheet suite
  (`platform/test/regents_web/stylesheet_palette_test.exs`) which polices consumption.
