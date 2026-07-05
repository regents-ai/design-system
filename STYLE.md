# Regent Style Guide

The canonical description of the Regent visual language. Machine sources stay canonical for
values — `design_system_tokens.css` (mirrored by `design_system_tokens.json`) — this document
explains the system so a person or agent can apply it without guessing.

Reference implementation: the public landing page (`platform/lib/regents_web/components/landing_components.ex`
with `platform/assets/css/landing.css`). When this guide and a shipped surface disagree, fix
one of them in the same pass.

## Identity

Regent is systematic restraint with a printed-machine character:

- **Systematic restraint** (the Stripe/Coinbase inheritance): a small neutral scale carries the
  interface; one accent per surface; semantic color reserved for status; consistent spacing,
  radius, and type scales; nothing decorated that could be plain.
- **Printed-machine character** (the Regent layer): pixel display type, hairline separators,
  uppercase micro-labels, mono readouts, halftone/print artwork, near-black ground. The result
  should read like precision print on dark stock, not like a generic SaaS theme.

## Color

### Neutrals carry everything

Both themes use one hueless neutral scale (zero chroma). Dark is the brand's home; light is a
first-class equal, not an afterthought.

| Role | Dark | Light |
| --- | --- | --- |
| Background | `oklch(14.5% 0 0)` (`#0a0a0a` band) | `oklch(98.5% 0 0)` (`#fafafa` band) |
| Surface | `oklch(17.5% 0 0)` | `oklch(97% 0 0)` |
| Surface, elevated | `oklch(20.5% 0 0)` | `oklch(99.5% 0 0)` |
| Border | `oklch(32% 0 0)` | `oklch(86% 0 0)` |
| Text | `oklch(97% 0 0)` | `oklch(22% 0 0)` |
| Text, muted | `oklch(70.8% 0 0)` | `oklch(46% 0 0)` |

Never tint surfaces toward a product hue. Identity lives in the accent, artwork, and marks —
not in the ground.

Separators are hairlines mixed from the foreground, not solid borders:
`--hairline` (14% fg) for structure, `--hairline-strong` (26% fg) for interactive edges.

### Product identities

Each product owns one accent. The brand attribute (`data-brand`) selects it as `--color-accent`;
the identity constants are also available everywhere as `--product-*` tokens (theme-scoped).

| Product | Identity | Dark accent | Light accent |
| --- | --- | --- | --- |
| Platform / Regents Labs | regent blue | `oklch(70% 0.12 238)` | `oklch(46% 0.12 238)` |
| Agent Formation | forge orange-red | `oklch(68% 0.16 45)` | `oklch(52% 0.16 42)` |
| Autolaunch | bright green | `oklch(78% 0.17 155)` | `oklch(50% 0.15 155)` |
| Techtree | beaker blue | `oklch(72% 0.11 250)` | `oklch(45% 0.11 250)` |
| Techtree secondary | biology green | `oklch(76% 0.11 160)` | `oklch(52% 0.1 160)` |

Rules:

- One accent per surface. A Techtree page may add its biology green as a secondary note
  (`--color-accent-secondary`); no other surface uses two accents.
- Formation renders inside the platform brand; use `--product-formation` for
  Formation-specific highlights rather than switching the page accent.
- Status colors (success, error, warning, info) are for state only, never identity. Note that
  Autolaunch's accent is deliberately hotter (higher chroma) than semantic success green.

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

## Motion

Tokens: `--duration-fast|base|slow`, `--ease-out`, `--ease-in-out`, `--active-scale`.

- Animate only `transform` and `opacity`. Enters use ease-out; on-screen moves use ease-in-out.
- Pressables scale to `--active-scale` (0.97) on `:active`; hero-grade cards may add pointer
  tilt and a faint specular shine (`--glass-shine`), gated behind
  `@media (hover: hover) and (pointer: fine)`.
- Content is visible by default. Scroll reveals hide elements only after script takes over
  (the landing's `rl-reveal-pending` pattern) so a page without JS is fully readable.
- Reduced motion: keep opacity/color transitions, drop movement, set shader speeds to 0.
- Keyboard-triggered UI never animates.

## Glass

Liquid glass is the treatment for cards that sit over artwork:

1. Artwork layer (shader canvas or halftone pattern).
2. Frost layer: `--glass-frost` gradient + `backdrop-filter: blur(var(--glass-blur))`,
   masked so the top frosts and the lower text zone stays readable.
3. Shine layer: `--glass-shine`, opacity 0 → 1 on hover, positioned by `--shine-x/--shine-y`.
4. Content layer: logo, title, tagline; hairline inset ring via box-shadow.

The older `--glass-*` panel/shell tokens remain the vocabulary for in-app panels; both derive
from the same neutral scale.

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

- Set `data-brand` (`platform | autolaunch | techtree`) and `data-theme` (`light | dark`) on
  the root element; every token above resolves from those two attributes.
- Marketing surfaces may pin themselves dark by re-declaring the dark values under a local
  scope (the landing's `.rl-root`), leaving the app's theme toggle untouched.
- Change tokens here first (`design_system_tokens.css`), regenerate the JSON mirror, then let
  consumers pick the change up. Never fork per-component color values downstream.
- Acceptance: `cd regent_ui && mix test`, plus the platform stylesheet suite
  (`platform/test/regents_web/stylesheet_palette_test.exs`) which polices consumption.
