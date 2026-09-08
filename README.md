# Regent Design System

[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)
[![Fonts: OFL 1.1](https://img.shields.io/badge/fonts-OFL--1.1-lightgrey)](geist-font/OFL.txt)
[![Elixir 1.19](https://img.shields.io/badge/elixir-1.19-lightgrey)](https://elixir-lang.org)
[![Phoenix LiveView 1.1](https://img.shields.io/badge/liveview-1.1-lightgrey)](https://hexdocs.pm/phoenix_live_view)

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

To change a design token, edit `design_system_tokens.css` (or `design_system_glass.css`),
then regenerate every mirror of it:

```bash
node scripts/generate-tokens-json.mjs
```

> [!NOTE]
> The two root CSS files are the only sources of truth for token values.
> `design_system_tokens.json` and the copies under `regent_ui/assets/css/` are generated
> outputs. A hand-edited copy is overwritten on the next run, and
> `node scripts/generate-tokens-json.mjs --check` exits non-zero when they have drifted.

## Where this sits

```text
  client surfaces
    ios                               mobile app, wallet, action signing
    regents-cli                       operator control surface
    regents-techtree-hermes-plugin    Hermes mission-control tab
                    │
                    ▼
  platform
    ash-platform                      Phoenix, LiveView, Ash: web, API, product domains
                    │
                    ▼
  services and chain
    siwa-server                       agent request signing, nonce and replay state
    media-web                         hosted card images and video
    fly-sentinel                      operator health checks
    regent-contracts                  canonical Solidity, ABIs, deployment records
    autolaunch-contracts              frozen Autolaunch V1 Solidity

  shared libraries and standalone tools
    elixir-utils                      SIWA, ENS, XMTP, cache, Credo checks
    design-system                     tokens and regent_ui components   ◀ this repository
    python-cli                        offline Techtree skill-tree inspection
    videocontrol                      video project and timeline workflows
```

## Repository layout

| Path | What is in it |
| --- | --- |
| `STYLE.md` | The canonical style guide: color, typography, motion, glass, artwork, logos. Read this first. |
| `design_system_tokens.css` | Source of truth for every design token. |
| `design_system_glass.css` | Source of truth for the import-stable glass layer. |
| `design_system_tokens.json` | Generated mirror of the token CSS, for tools that cannot parse CSS. |
| `regent_ui/` | The Phoenix component library: components, panels, sigils, scene rendering, and their CSS and TypeScript assets. |
| `logos/` | Vector marks for Regents Labs (crown), Autolaunch (chart), and Techtree (tree), in voxel and flat styles, dark and light. |
| `geist-font/` | Canonical Geist Pixel Square and Geist Mono fonts, plus compatibility Geist sans files. |
| `images/` | Artwork, blueprints, and per-product design studies. |
| `terminal-palette.md` | Terminal color palettes, with per-product variants for Techtree and Autolaunch. |
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
| Geist Mono | `regent_ui/priv/static/fonts/GeistMono-{Regular,Italic,SemiBold,SemiBoldItalic}.woff2` | All remaining text and UI, including body, controls, code and readouts |

Mono uses weights 400 and 600, each with a genuine italic. Pixel uses 400 only.
Geist sans assets remain for compatibility, not as the default. The packaged files are generated from
`geist-font/` and served by consuming applications at `/fonts/regent-ui/`; `STYLE.md` records
the full URL contract.

## Checks

### Ruled structural showcase

The current shared language uses square grid cells, flat chamfered panels, opposing-cut
primary actions and ruled native disclosures. Eight base palettes are unchanged; supporting
surface/ink roles expose the other three identity colors in coherent compartments.
Typography is Pixel Square for titles/subtitles and Mono for all other text/UI.
Page-background SVGs are retired; the source artwork remains available for smaller sections.

```bash
cd regent_ui
mix run ../scripts/render-structure-showcase.exs
cd ..
python3 -m http.server 8766 --bind 127.0.0.1 --directory .showcase
```

Open `http://127.0.0.1:8766/`; switch product and theme on the same real-component page.
`?brand=techtree&theme=dark` selects a combination directly. The output is ignored.
`Regent.Structure` supplies frame/row, section bar, panel, technical figure and capability card;
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

All primary `.rg-button` controls share an interaction-only shimmer across all eight
palettes. Hover/focus-visible enables it only on enabled primaries; secondary/quiet/
disabled controls are excluded. Cards use hover/focus-within. `--rg-shimmer-color`
inherits from an ancestor or component style, falling back to the local contrasting
ink. `--rg-shimmer-duration` defaults to `1.15s`; cards multiply it by three (`3.45s`).
Only visual skins clip: primary corner marks, actual content and focus remain intact.
The card shimmer covers its full media area, including opaque images; title, caption
and actions remain outside it. Reduced motion removes the sweep, retaining only a
static faint card edge. Forced colors use system borders; nothing loops at idle.
`Regent.Primitives.button` protects primary-label contrast with an opaque paired-fill
`span.rg-button__label`. Include the same label wrapper when authoring a primary link
or button directly with CSS classes instead of the component.

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

## The other repositories

| Repository | What it is | What it deliberately does not do |
| --- | --- | --- |
| `ash-platform` | The Phoenix, LiveView, and Ash application: public web pages, the HTTP API, product domains, human identity, billing, and the Techtree and Autolaunch product areas. | It does not hold Solidity source or user signing keys; wallet actions remain browser-signed. |
| `autolaunch-contracts` | A clean-room Solidity implementation of the founder-frozen Autolaunch V1 system, controlled by its own `SPEC.md`. | It authorises no deployment, signature, or value movement; the older Autolaunch code in `regent-contracts` is historical reference only. |
| `elixir-utils` | A collection of standalone Elixir libraries used across the family: SIWA, ENS, XMTP, a cache, agentbook helpers, and the in-house `credo_ash` lint checks. | Each package is a library only; none of them runs a service or holds product behaviour. |
| `fly-sentinel` | A small Phoenix service that reports Fly.io observability and operator preview checks. | It observes and reports; it does not deploy, scale, or change any other application. |
| `ios` | The Expo and React Native mobile app: the mobile wallet, action signing, and mobile Regent records. | It consumes the platform HTTP contracts and owns no server-side product logic. |
| `media-web` | A standalone Phoenix service that serves hosted Regents card images and video files from `media.regents.sh`. | It only serves bytes over HTTP; it holds no identity, database, or product logic. |
| `python-cli` | The installable `regents-techtree` Python package, whose shipped surface is a deterministic offline inspection of one champion/challenger skill-tree pair. | It does not evaluate or execute an agent, and it makes no network calls once its locked dependencies are installed. |
| `regent-contracts` | The canonical home for Regent Solidity source, Foundry tests, deployment scripts, verified deployment records, ABIs, and the chain-contract manifest. | It holds no HTTP or CLI contracts, Ash resources, workflow logic, UI, or projection workers. |
| `regents-cli` | The operator control surface: the `regents` command line tool, its generated bindings, and its local runtime. | It drives the platform over published contracts and owns no product database or on-chain authority. |
| `regents-techtree-hermes-plugin` | The Hermes plugin that presents Techtree mission control across Forge, Techtree Verify, and Uplift. | It is presentation only: no second task store, no private Verify database, no identity model, no payment system, and no Hermes runtime of its own. |
| `siwa-server` | The shared Sign-In With Anything service for signed agent requests, nonce and replay state, and internal keyring endpoints. | It owns no product data or product authorization policy. |
| `videocontrol` | A separate product: video project workflows, timeline editing, preview rendering, and Codex plugin media control. | It shares the house style but no runtime, database, or contract with the Regent platform. |

## License

The code and design tokens in this repository are MIT licensed — see [LICENSE](LICENSE).
The Geist font files in `geist-font/` are licensed separately under the SIL Open Font
License 1.1; see [geist-font/OFL.txt](geist-font/OFL.txt).
