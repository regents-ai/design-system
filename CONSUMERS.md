# Shared design system: consumer configuration

## Current contract

The standalone local Touch ID shell is `standalone/agent-key.html`. SIWA's
`scripts/build_agent_page.py` embeds this shell, the canonical tokens, three regular
Geist fonts and the crown marks into its Python/Node clients and the Regents CLI.
The shell owns presentation only; SIWA owns passkey behavior and state messages in
`assets/agent/passkey.js`. No remote assets are loaded on the local credential page.
Ash Template and the sites link to the shared SIWA guide and client instead of
maintaining copies of this page.

`Regent.AgentMetadata.head` owns canonical, sharing and agent-discovery head tags,
including JSON-LD encoding with script-safe escaping. Call it once from the root
layout, replacing the corresponding local tags; keep the document title, viewport,
CSRF, provider configuration and styles/scripts product-owned. Pass truthful brand,
canonical URL, share image and alt, and a structured-data map. `image_width` and
`image_height` are optional and print only when set: give them for a picture whose
size is known, such as the site's own, and leave them out for a page's own picture,
such as a blog post's cover. Optional guide,
sitemap and OpenAPI links must name real routes. `markdown` defaults to false:
enable it only for the product's explicit supported-page set. Site classification
is optional and caller-owned, never selected to inflate a score. `nonce` supports
the consumer's existing CSP without weakening it. This presentation-only component
does not implement HTTP negotiation, authentication, routes or WebMCP registration.
The workspace `ash-webmcp` skill governs staged adoption and those separate owners.

The page's theme is `data-theme` on the root: `light` or `dark` once the person has
chosen on the site, and no `data-theme` at all until they do. With no choice the page
is dark, or light when their device asks for light (`prefers-color-scheme: light`);
the tokens and shared CSS follow the device by themselves. A product's own CSS that
changes with the theme covers the no-choice case the same way (see the last block of
`design_system_tokens.css`), or uses `light-dark()`, which follows the root's
`color-scheme`.

`Regent.ThemeToggle.button` owns the shared animated prism/laser theme icon used
by all six product platforms. Pass `id` and the product's event data attribute. The
button always names the theme that is showing: it carries one sentence for each
theme and the shared CSS shows the right one, so the server needs no theme and
product script never rewrites its words, ARIA or title. Theme persistence and the
click stay product-owned: the click sets `data-theme` and the saved choice to the
opposite of the theme showing, which is `data-theme` when set, otherwise `light`
when `matchMedia("(prefers-color-scheme: light)")` matches and `dark` when it does
not. Its styles ship through `primitives.css`. The prism turns only while the button
is pointed at or focused; reduced motion disables rotation.
The button is a borderless 2.75rem press target with the prism as a 1.75rem box with
slightly rounded corners in its middle, and pointing at it shows the other theme's
colours. A product header gives it no border, background, corners or height of its own;
it only sets the gap to the icons beside it.

`Regent.Primitives.copy_button` owns the copy button's markup: pass `id`, either the
`text` to copy or the `target` id of an element on the page whose text it copies, and
the label as its slot. It works on every page, LiveView or controller-rendered: the
product calls the template's `installCopyButtons()` (`assets/js/copy_buttons.ts`) once
from `app.ts`, and that one page-wide listener copies `data-copy-text` or the target's
text, selects the target instead when the browser refuses the clipboard, sets
`data-copy-state` to `copied`, `selected` or `failed` for a moment and writes the same
word into the element named by `data-copy-status`. The button tells LiveView to leave
`data-copy-state` alone on patches (`JS.ignore_attributes`), and the component renders
the status element as a polite `role="status"` with `phx-update="ignore"`, so a patch
never clears either. There is no copy hook.

`Regent.Discussion` owns the forum thread's look, from Patchbay's discussion page:
`thread` (title, Solved mark, reply, view and like counts, Compact replies switch),
`post` (opening post or reply: picture slot, name, time, words, `solved` and `actions`
slots), `solved`, `replies` (filters as `%{label, href, current}`, the list and its empty
line), `like`, `label`, and `posts` (posts listed outside a thread, such as one person's
replies across threads). `thread` and `posts` take the product's own attributes. The
product owns the records, routes, sign-in, pictures, the
words for times, and the like press: pass `phx-click` and its values to `like`, or wrap it
in the product's form with `type="submit"`. Import `discussion.mjs` (copied by
`mix regent_ui.assets`) once to remember the Compact replies choice; the switch works
without it and survives LiveView patches.

`Regent.HolographicCard.card` owns the pointer-lit graphite foil card. Pass `id`, the
product's hook attribute and the content that sits on the face; the component renders the
face, a `phx-update="ignore"` stage holding `[data-holo-canvas]`, and the content on top.
`mix regent_ui.assets` copies `holographic_card.mjs` and its `.d.mts` next to the styles;
`createHolographicCardRenderer(canvas, size, onDeviceLost)` draws the foil with `vgpu`,
which the consumer pins itself, together with `@vgpu/wgsl`: both at 0.6.0. vgpu 0.6 only
accepts a prepared shader, so the renderer prepares the foil's WGSL as it loads. On
13 October 2026 the card was drawn in Chrome with 0.6.0: a full frame, lit by the pointer,
crown engraved. A typecheck does not prove this, because the renderer is plain
JavaScript; a site moving to another vgpu version draws the card before it releases. The
product owns the mount: when to load the
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
classes coherently, not random per-card accents.
Shared selects reserve a 24px right chevron inset and 48px text padding, with native
forced-colors appearance. Primary CTAs cut two corners and use the site's accent
pair in both themes, with Powder Blue and Tangerine marks in dark mode and Tangerine
L-edges in light mode that grow into a cut outline on hover and focus. Secondary CTAs
use the site's surface and foreground with a visible border.
The template's `hooks/motion/buttons.ts` supplies a single chevron nudge on pointer
entry and a small press response on pointer-down through Anime.js. Copy that module
and its `mountMotion` integration when adopting this package. CSS-only consumers
receive the same static appearance. Quiet, copy, theme and tab controls do not gain
CTA chevrons. Reduced motion and keyboard activation stay still. Hit areas never
scale and actions are never delayed. Disabled controls stay still.
Feature-card edge ripples remain independent and retain their existing overrides.
Import canonical token CSS then
`primitives.css`, which now includes `structure.css`. Use `Regent.Structure` for the
optional ruled frame, section bars, cut panels and technical figures, and existing
`Regent.Primitives` for primary/secondary/quiet buttons and indexed native disclosures.
The old universal 24px radius is retired: plain cells are square; panel skins cut
16px/12px (desktop/mobile); primary button skins cut 12px/8px.

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
  package's CSS, JSON and browser modules into ignored `assets/vendor/regent_ui/`, its fonts
  into ignored `priv/static/fonts/regent-ui/` and its pictures (agent pictures, World's mark)
  into ignored `priv/static/images/regent-ui/`. Never hand-edit those outputs.
- Build each app after updating the shared revision. Production bundles are local assets, so
  deployed sites receive a change only after their own builds and deployments.
- Shared component edits reach every app that renders that component (see the Shared
  compositions table in `STYLE.md`). A shared token import does not turn a product-owned
  component into a shared one; avoid copying a component into an app to recolor it.

## Release builds

Each app pins one design-system commit in `platform/mix.exs`:

```elixir
@design_system "https://github.com/regents-ai/design-system.git"
@design_system_ref "<full commit>"
{:regent_ui, git: @design_system, ref: @design_system_ref, sparse: "regent_ui"}
```

`mix.lock` records the same commit. The release image runs `mix deps.get`, which fetches
exactly that commit; the repository is public, so the build takes no credentials. Only a
commit published on GitHub can be pinned, and a pin never names a branch.

## Taking a new release

Publishing a design-system commit starts the sites' updates; nothing moves on its own.
After the commit is on GitHub, run from an ash-template checkout:

```bash
scripts/regent-ui-update <full design-system commit>
```

For each of Regents, Autolaunch, Patchbay, Keyfleet and Techtree, the script works in that
site's standing update checkout (`worktrees/ui-standardization/update-<site>`), starts a new
branch from the site's `origin/main`, or from the branch given with
`--base <site>=<branch>` when a site releases from a release branch, sets the pin, updates
`mix.lock` for `regent_ui` alone, and runs `mix compile --warnings-as-errors`,
`mix assets.build` (which runs `mix regent_ui.assets`) and the site's `npm run typecheck`.
It commits the pin and lock on that branch and pushes nothing. It refuses a commit that
would drop design-system changes the site already has.

It ends with a table: each site is either **updated** (branch and commit named) or
**blocked** (the step that failed and its log). A blocked site stays on its old pin until
its owner fixes it; nothing is hidden. Each site's owner then reviews, pushes and releases
the branch as usual. Ash Template is updated first, by hand, as the place a shared change
is tried before the sites take it.

## Reproduce the build

Run `node scripts/generate-tokens-json.mjs --check` from the design-system root and
`mix check` from its `regent_ui/` directory. Then run `mix assets.build` inside each affected
consumer's `platform/` directory and review light and dark pages, a mobile viewport and
keyboard focus. Do not copy generated assets from another application's checkout.

## Consumers

The consumers are `repos/regents/platform`, `repos/autolaunch/platform`,
`repos/patchbay/platform`, `repos/techtree/platform`, `repos/ash-template/platform` and
`repos/keyfleet/platform`. Each pins `regent_ui` to one design-system commit, as under
"Release builds".

### Utility pages

Use `Regent.Utility.page` for standalone errors and recovery messages. Use `rg-utility`
on account/settings content; `Regent.Account` sections and dialogs share the same
Sans typography and neutral palette. Keep Pixel for deliberate brand moments.
Shared OAuth consent markup must adopt the utility classes alongside this package;
release the shared CSS first. No consent policy, status or callback behavior changes.
Render `mix run ../scripts/render-utility-showcase.exs` from regent_ui for local
light/dark examples with synthetic account data. These are not live account sessions.
