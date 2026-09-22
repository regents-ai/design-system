# Shared design system: consumer configuration

## Current contract

`Regent.AgentMetadata.head` owns canonical, sharing and agent-discovery head tags,
including JSON-LD encoding with script-safe escaping. Call it once from the root
layout, replacing the corresponding local tags; keep the document title, viewport,
CSRF, provider configuration and styles/scripts product-owned. Pass truthful brand,
canonical URL, image dimensions/alt and a structured-data map. Optional guide,
sitemap and OpenAPI links must name real routes. `markdown` defaults to false:
enable it only for the product's explicit supported-page set. Site classification
is optional and caller-owned, never selected to inflate a score. `nonce` supports
the consumer's existing CSP without weakening it. This presentation-only component
does not implement HTTP negotiation, authentication, routes or WebMCP registration.
The workspace `ash-webmcp` skill governs staged adoption and those separate owners.

`Regent.ThemeToggle.button` owns the shared animated prism/laser theme icon used
by all six product platforms. Pass `id`, `theme` (`light`/`dark`) and the product's
event data attribute. Theme persistence and events stay product-owned; update
ARIA/title and `[data-theme-toggle-state]`, never the button's entire text content.
Its styles ship through `primitives.css`; reduced motion disables rotation.

`Regent.HolographicCard.card` owns the pointer-lit graphite foil card. Pass `id`, the
product's hook attribute and the content that sits on the face; the component renders the
face, a `phx-update="ignore"` stage holding `[data-holo-canvas]`, and the content on top.
`mix regent_ui.assets` copies `holographic_card.mjs` and its `.d.mts` next to the styles;
`createHolographicCardRenderer(canvas, size, onDeviceLost)` draws the foil with `vgpu`,
which the consumer pins at exactly `0.3.1`. The product owns the mount: when to load the
chunk, the frame loop, reduced motion, device loss and the pointer. It calls
`point(card, light)` with the pointer as fractions of the card that turns and of the canvas
the light falls on, `rest()` on leave, writes `tilt()` to
`--rg-holo-tilt-x` / `--rg-holo-tilt-y` in radians, and marks the root
`data-holo-ready="true"` once a frame has drawn. Without a renderer the static foil in
`holographic_card.css` is the whole picture. Attribution for the foil material is in
`THIRD_PARTY_NOTICES.md`.

The same foil covers part of a card through `Regent.HolographicCard.foil`. As a face, pass
it in `capability_card`'s `foil` slot (or put it first inside any panel marked
`rg-holo-ground`) with `class="rg-holo-foil--face"`; the mounted element takes `rg-holo-tilt`
when it should turn. As ink, put it beside an inline line drawing in a technical figure with
`class="rg-holo-foil--ink"`, set the canvas's `mask-image` to `holographicInkMask(svg)` and
pass the drawing's colour as `look.ink` and the colour it sits on as `look.ground`, so the
ink lights in the two palette colours that stand out from it. The renderer's fourth argument, `look`, also takes
`crown` (`false`, or `"beside"` to engrave it only where it stands clear of the content) and
`tilt` / `shine`, which scale the turn and the light against the account card's. Every
surface on a page shares one GPU device.

Preserve the eight base palette values. Use Geist Pixel Square 400 for every title and
subtitle, Geist UI Sans 400/600 for body and UI, and Geist Mono for code/technical indices.
Never synthesize bold Pixel. The generator packages `GeistPixel-Square.woff2` from
`geist-font/GeistPixel/webfonts/`; rerun `mix regent_ui.assets` and serve
`/fonts/regent-ui/` from the consumer origin. Supporting figure/band/panel surface and ink
roles expose the other three palette constants per brand; use their paired utility
classes coherently, not random per-card accents. Patchbay aliases remain unchanged.
Shared selects reserve a 24px right chevron inset and 48px text padding, with native
forced-colors appearance. Enabled primaries use a restrained orange 1.15s hover/focus
area sheen; feature cards ripple a single band along their panel edge at 2.3s per turn. `--rg-shimmer-color` is an
inherited source override (default Tangerine, mixed 75% with Platinum at 24% strength).
`--rg-shimmer-duration` controls base speed; the card edge ripple doubles it. Custom colors
and fill/ink overrides require caller contrast review. Labels are transparent; CSS-only
primary links need no label wrapper and never underline, even under `.sc a:hover`.
Dark rest has blue opposite square corners plus orange cut accents; light rest has
two opposite orange L-edges. Enabled hover/focus grows a continuous cut outline with
150ms base transitions on entry and exit, naturally reversing interruptions.
`--rg-button-border-color` overrides the outline, falling back to shimmer color then
Tangerine. Reduced motion means instant outline states and no sweep; forced colors
retain a system border. No new markup, JS, semantic changes or clipped host/content.
Import canonical token CSS then
`primitives.css`, which now includes `structure.css`. Use `Regent.Structure` for the
optional ruled frame, section bars, cut panels and technical figures, and existing
`Regent.Primitives` for primary/secondary/quiet buttons and indexed native disclosures.
The old universal 24px radius is retired: plain cells are square; panel skins cut
16px/12px and primary-action skins cut 12px/8px (desktop/mobile).

Page background SVGs are no longer used; the package ships no background component and no
background images. The source SVGs stay in `site svg backgrounds/` for future smaller
illustration sections. Remove product-owned background mounts during deliberate consumer
adoption.

See [MOBILE.md](MOBILE.md) for the iPhone-oriented composition and acceptance contract.
Coarse/no-hover shared buttons retain a 44px minimum hit box, and text-like `rg-field`
controls have a 16px font floor without shrinking larger inherited text. Pointer-only
sticky hover no longer leaves button/card sweeps running on touch; keyboard focus
still works. These defaults do not fix raw product controls or stronger legacy CSS
overrides automatically. Product managers own adoption and actual-route checks.

See `STYLE.md` for the current API and real-component showcase commands. Shared changes
are verified first; consumer rollout follows visual acceptance and each app's own build.

## One edit, every consumer

- **Palette source:** `design_system_tokens.css`. The `site color palettes/` images document
  the approved values; edit the CSS tokens to change a palette.
- **Component source:** `regent_ui/lib/regent/` and `regent_ui/assets/`.
- `node scripts/generate-tokens-json.mjs` regenerates the JSON, the packaged token CSS and the
  packaged fonts; `--check` reports stale generated copies without editing files.
- Every consumer runs `mix regent_ui.assets` before its asset build. It copies the resolved
  package's CSS, JSON and browser modules into ignored `assets/vendor/regent_ui/` and its fonts
  into ignored `priv/static/fonts/regent-ui/`. Never hand-edit those outputs.
- Build each app after updating the shared revision. Production bundles are local assets, so
  deployed sites receive a change only after their own builds and deployments.
- Shared component edits reach every app that renders that component (see the Shared
  compositions table in `STYLE.md`). A shared token import does not turn a product-owned
  component into a shared one; avoid copying a component into an app to recolor it.

## Reproduce the build

Run `node scripts/generate-tokens-json.mjs --check` from the design-system root and
`mix check` from its `regent_ui/` directory. Then run `mix assets.build` inside each affected
consumer's `platform/` directory and review light and dark pages, a mobile viewport and
keyboard focus. Do not copy generated assets from another application's checkout.

## Consumers

The consumers are `repos/regents/platform`, `repos/autolaunch/platform`,
`repos/patchbay/platform`, `repos/techtree/platform`, `repos/ash-template/platform` and
`repos/keyfleet/platform`, plus the `repos/elixir-utils/erc8004` component library. Each
resolves `regent_ui` as a path dependency, honoring `REGENT_UI_PATH` for pinned checkouts.
