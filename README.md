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
| `geist-font/` | The Geist and Geist Mono source font files (and the unused Geist Pixel faces). |
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
| Geist UI Sans | `regent_ui/priv/static/fonts/Geist-{Regular,Italic,SemiBold,SemiBoldItalic}.woff2` | Titles, headers, interface and body text |
| Geist Mono | `regent_ui/priv/static/fonts/GeistMono-{Regular,Italic,SemiBold,SemiBoldItalic}.woff2` | Code, readouts, identifiers |

Weights 400 and 600 only, each with a genuine italic. The packaged files are generated from
`geist-font/` and served by consuming applications at `/fonts/regent-ui/`; `STYLE.md` records
the full URL contract.

## Checks

One command must pass before a change is proposed:

```bash
cd regent_ui && mix check
```

It compiles with warnings as errors, verifies no unused dependency locks, checks formatting,
and runs the test suite with warnings as errors. If you touched a token file, also run
`node scripts/generate-tokens-json.mjs --check`.

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
