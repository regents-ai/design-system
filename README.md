# Regent Design System

[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)
[![Fonts: OFL 1.1](https://img.shields.io/badge/fonts-OFL--1.1-lightgrey)](geist-font/OFL.txt)
[![Elixir 1.19](https://img.shields.io/badge/elixir-1.19-lightgrey)](https://elixir-lang.org)
[![Phoenix LiveView 1.2](https://img.shields.io/badge/liveview-1.2-lightgrey)](https://hexdocs.pm/phoenix_live_view)

The shared visual language for the Regent family of products, maintained by Regents Labs.
It holds one style guide, one set of design tokens, the logo and font assets, and
`regent_ui` — a Phoenix component library that the product applications depend on.

> [!IMPORTANT]
> This repository is internal shared plumbing, not a product. It is consumed as a path
> dependency by the Regent applications rather than published to Hex.

## Quickstart

The component library lives in `regent_ui`. From the repository root:

```bash
cd regent_ui
mix deps.get
mix check
```

To change a design token, edit `design_system_tokens.css`, then regenerate every mirror of it:

```bash
node scripts/generate-tokens-json.mjs
```

> [!NOTE]
> `design_system_tokens.css` at the repository root is the only source of truth for token values.
> `design_system_tokens.json` and the copies under `regent_ui/assets/css/` are generated
> outputs. A hand-edited copy is overwritten on the next run, and
> `node scripts/generate-tokens-json.mjs --check` exits non-zero when they have drifted.

## Where this sits

```text
  product platforms (each depends on regent_ui by path from its platform/ directory)
    regents                  regents.sh: $REGENT staking and the Regents Labs home
    autolaunch               token auctions on Base
    patchbay                 broken-tool reports and bounded repairs
    techtree                 agent Skill improvement and shared evidence
    ash-template             quickstart monorepo: website, HTTP API and CLI
    keyfleet                 KeyFleet website, HTTP API and CLI

  shared libraries
    elixir-utils/erc8004     ERC-8004 components built on Regent.Structure.panel
    design-system            tokens and regent_ui components   ◀ this repository
```

## Repository layout

| Path | What is in it |
| --- | --- |
| `STYLE.md` | The canonical style guide: color, typography, shape, motion, artwork, logos. Read this first. |
| `design_system_tokens.css` | Source of truth for every design token. |
| `design_system_tokens.json` | Generated mirror of the token CSS, for tools that cannot parse CSS. |
| `regent_ui/` | The Phoenix component library: primitives, ruled-sheet structure, blog, profile, theme toggle, holographic card and agent metadata, with their CSS, fonts and small browser modules. `STYLE.md` lists every component and which apps use it. |
| `logos/` | Vector marks for Regents Labs (crown), Autolaunch (chart), and Techtree (tree), in voxel and flat styles, dark and light. |
| `geist-font/` | Canonical Geist Pixel Square, Geist UI Sans and Geist Mono fonts. |
| `images/` | Artwork, blueprints, and per-product design studies. |
| `scripts/` | The token generator. |

## Design tokens

The whole system is four colors, defined in `design_system_tokens.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--palette-tangerine-tango` | `#FF5B19` | Formation and Autolaunch product accent |
| `--palette-charcoal` | `#161616` | Near-black ground |
| `--palette-platinum` | `#E5E3D2` | Light ground, and text on dark |
| `--palette-powder-blue` | `#AECACD` | Techtree product accent |

Spacing, radius, and type scales are defined alongside them. `STYLE.md` explains how to
apply them; the CSS file is what to read for exact values.

## Typography

| Face | Packaged files | Used for |
| --- | --- | --- |
| Geist Pixel Square | `regent_ui/priv/static/fonts/GeistPixel-Square.woff2` | All titles and subtitles, upright 400 only; no synthetic bold/italic |
| Geist UI Sans | `regent_ui/priv/static/fonts/Geist-{Regular,Italic,SemiBold,SemiBoldItalic}.woff2` | Body, controls, navigation, captions, labels and other UI |
| Geist Mono | `regent_ui/priv/static/fonts/GeistMono-{Regular,Italic,SemiBold,SemiBoldItalic}.woff2` | Code, technical indices, addresses and readouts |

Sans and Mono use weights 400 and 600, each with a genuine italic. Pixel uses 400 only.
The packaged files are generated from
`geist-font/` and served by consuming applications at `/fonts/regent-ui/`; `STYLE.md` records
the full URL contract.

## Checks

### Ruled structural showcase

The current shared language uses square grid cells, flat chamfered panels, opposing-cut
primary actions and ruled native disclosures. Eight base palettes are unchanged; supporting
surface/ink roles expose the other three identity colors in coherent compartments.
Typography is Pixel Square for titles/subtitles, Sans for body/UI, and Mono for technical text.
Page-background SVGs are retired; the source artwork remains available for smaller sections.

```bash
cd regent_ui
mix run ../scripts/render-structure-showcase.exs
cd ..
python3 -m http.server 8766 --bind 127.0.0.1 --directory .showcase
```

Open `http://127.0.0.1:8766/`; switch product and theme on the same real-component page.
`?brand=techtree&theme=dark` selects a combination directly. The output is ignored.
`Regent.Structure` supplies frame/row, section bar, panel, technical figure, capability card
and ratio card;
`primitives.css` imports the shared structural rules. See `STYLE.md` for integration.

### Capability cards and shared shimmer

```heex
<div class="rg-feature-grid" style="--rg-shimmer-color: var(--palette-powder-blue)">
  <Regent.Structure.capability_card
    title="Clear boundaries"
    description="Rules and shared edges give every region a deliberate place."
    index="001"
    tone="surface"
    image_src="/images/boundaries.svg"
    image_alt="Three connected boundaries"
  >
    <:actions><a href="#details">Read details</a></:actions>
  </Regent.Structure.capability_card>
</div>
```

`title` and `description` are required strings. Optional `index` and `image_src`
default to `nil`; `tone` accepts `surface` (default) or `accent`; `image_alt` defaults
to `""` for decorative images. Supply custom SVG in `:media` instead of `image_src`
(the image wins when both are supplied). `:actions` is optional and owns no implicit
behavior. `class` and global attributes, including inline `style`, reach the article.
Cards retain aligned heading/figure/caption subgrid bands in three/two/one columns.

All primary `.rg-button` controls and CSS-only primary links share an interaction-only
orange area sheen across all eight palettes. Hover/focus-visible enables it only on
enabled primaries; secondary/quiet/disabled controls are excluded. Cards ripple their panel edge on
hover/focus-within. `--rg-shimmer-color` inherits from an ancestor or component,
defaulting to Tangerine; the highlight mixes 75% source with Platinum, at 24% strength.
This restrained orange mix preserves default label contrast without an opaque patch;
custom color/fill/ink overrides require caller contrast review. `--rg-shimmer-duration`
defaults to `1.15s`; the card edge ripple doubles it (`2.3s` per turn).

Dark primaries rest with blue TR/BL square corners and orange TL/BR cut accents;
light primaries have two opposite orange L-edges. Enabled hover/focus-visible grows
and crossfades these into a continuous cut outline, with **150ms base transitions in
both directions**, including native reversal from an interrupted state. Set inherited
`--rg-button-border-color` to override the outline; it falls back to shimmer color,
then Tangerine. No JavaScript or additional markup is required. The
`span.rg-button__label` that `Regent.Primitives.button` renders is transparent;
plain-text primary links work.
Primary text does not underline, including under consumer `.sc a:hover` rules.

Only visual skins clip; content, rectangular hit areas and external focus remain intact.
The card ripple travels only the panel edge; the media, title, caption and actions carry
no overlay. Reduced motion removes the sweep and the ripple, swaps the button outline
instantly, and retains only a static faint card edge. Forced colors use system
borders; nothing loops at idle.

### Read-only ratio cards

```heex
<Regent.Structure.ratio_card
  id="allocation-example"
  title="Capacity illustration"
  value_bps={5620}
  change="+2.1 pp / 7 days (illustration)"
>
  <:footer>
    <span class="rg-ratio-card__tile">A</span>
    <span class="rg-ratio-card__tile">B</span>
  </:footer>
  <:footer_badge>Illustration</:footer_badge>
</Regent.Structure.ratio_card>
```

Required strings: unique `id` and `title`. `value_bps` accepts integer `0..10000`
(default `nil`); `5620` renders **56.2% / 43.8%** from the same integer basis.
The named read-only meter uses matching `0..100` values and fill. Invalid values
raise `ArgumentError`; unknown data renders two em dashes and `No data`, not a zero meter.
Optional strings: `eyebrow="Allocation"`, `label="Allocated"`,
`remainder_label="Remaining"`, `footer_label="Details"`, `change={nil}`.
The caller defines the change's units/period; it is display text only. Optional
`:footer` and `:footer_badge` slots provide content; `rg-ratio-card__tile` styles
static footer tiles without inventing buttons. `class` and global attributes reach
the article. The square bracketed sheet stacks paired metrics in containers at or
below 30rem, uses Pixel Square 400 display numbers, and keeps content/focus unclipped.
Canonical orange fills the meter; its computed percentage also appears in a read-only
header badge (`No data` when unknown). Uppercase labels sit above the metrics;
the footer label sits above the tiles and right badge. Orange-tinted notes use locally contrasting ink
in both themes. Forced colors retain a solid system-color fill and borders. No
animation, data loading, authentication, wallet or product workflow is included.

### Package checks

One command must pass before a change is proposed:

```bash
cd regent_ui && mix check
```

It first verifies that every generated mirror of the canonical token sources is current
(`node scripts/generate-tokens-json.mjs --check`, so Node.js is required), then compiles
with warnings as errors, verifies no unused dependency locks, checks formatting, and runs
the test suite with warnings as errors.

The token verification only makes sense inside this repository checkout, where the root
CSS sources and `scripts/` exist. A staged copy of the package (see `mix regent_ui.stage`)
has no sources, so `mix check` fails there rather than passing an unverified tree; run the
check from this repository before staging.

## Boundaries

Shared UI stays shared. Components in `regent_ui` must not own product workflow state,
authorisation decisions, money movement, or product database behaviour — those belong to
the product that owns them.

## License

The code and design tokens in this repository are MIT licensed — see [LICENSE](LICENSE).
The Geist font files in `geist-font/` are licensed separately under the SIL Open Font
License 1.1; see [geist-font/OFL.txt](geist-font/OFL.txt).
