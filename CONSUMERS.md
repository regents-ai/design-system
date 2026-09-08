# Shared design system: consumer configuration

## Current structural contract (supersedes background/geometry rollout notes below)

Preserve the eight base palette values. Use Geist Pixel Square 400 for every title and
subtitle, Geist UI Sans 400/600 for body and UI, and Geist Mono for code/technical indices.
Never synthesize bold Pixel. The generator packages `GeistPixel-Square.woff2` from
`geist-font/GeistPixel/webfonts/`; rerun `mix regent_ui.assets` and serve
`/fonts/regent-ui/` from the consumer origin. Supporting figure/band/panel surface and ink
roles expose the other three palette constants per brand; use their paired utility
classes coherently, not random per-card accents. Patchbay aliases remain unchanged.
Shared selects reserve a 24px right chevron inset and 48px text padding, with native
forced-colors appearance. Enabled primaries use a restrained orange 1.15s hover/focus
area sheen; capability cards use the same gradient at 3.45s. `--rg-shimmer-color` is an
inherited source override (default Tangerine, mixed 75% with Platinum at 24% strength).
`--rg-shimmer-duration` controls base speed; cards multiply by three. Custom colors
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

Page background SVGs are no longer used. The shared background component is inert and
`--site-background-image` is `none`; SVG assets remain packaged for future smaller
illustration sections. Remove product-owned background mounts during deliberate consumer
adoption. The historic home exceptions below do not override this new direction.
No product routes, authentication, wallets or database state are changed by this refactor.

See `STYLE.md` for the current API and real-component showcase commands. Shared changes
are verified first; consumer rollout follows visual acceptance and each app's own build.

## Historical palette rollout evidence

September 5, 2026. Approved rollout tracked in central Regent graph **regent-qht.9**
and Techtree graph **techtree-p90**. This records the differences encountered in
this rollout, not an audit of every backend setting in the repositories.

## One edit, four consumers

- **Palette source:** `design_system_tokens.css`. The supplied `site color palettes/`
  images document the approved values. Edit the CSS tokens to change a palette.
- **Background source:** the eight SVGs in `site svg backgrounds/`. Replace the
  matching file there; filenames identify the site and light/dark mode.
- **Component source:** `regent_ui/lib/regent/` and `regent_ui/assets/css/primitives.css`.
- `node scripts/generate-tokens-json.mjs` regenerates JSON, packaged token CSS,
  and packaged SVGs. `--check` detects stale generated copies without editing files.
- Every consumer runs `mix regent_ui.assets` before its asset build. This copies
  the resolved package's CSS/JSON into ignored `assets/vendor/regent_ui/` and its
  SVGs into ignored `priv/static/images/regent-ui/`. Never hand-edit those outputs.
- The showcase imports the same generated palette JSON and serves the same
  packaged SVGs. It no longer owns independent default colors or image copies.
- Build each app after updating the shared revision. Production bundles are local
  assets, so deployed sites receive the change after their own builds/deployments.
  Editing the source does not mutate a running production deployment.

## Differences found and disposition

| Area | Before | Standard after this rollout |
| --- | --- | --- |
| Palette source | Shared fixed-ground themes, independent showcase arrays, Regents aliases, Autolaunch overrides, Patchbay literals and Techtree light-dark literals | Shared brand/mode tokens; local names map onto those tokens |
| Brands | Shared tokens covered three sites; Patchbay had no brand attribute | `platform`, `autolaunch`, `patchbay`, `techtree` |
| Theme names | Techtree used `orange`/`titanium`; other apps used light/dark or forced dark | Document theme is `light` or `dark` everywhere |
| Mode behavior | Shared Autolaunch/Techtree grounds did not change by mode; Patchbay forced dark | Eight approved palettes with actual light/dark surfaces |
| Theme controls | Regents cookie + shell control; Autolaunch system preference; Patchbay none; Techtree custom cookie/control | Existing controls remain product-owned; Patchbay gains a persisted control. All drive the same brand/mode contract |
| CSS imports | Autolaunch imported a mutable sibling path; other apps used generated package copies | All import generated `assets/vendor/regent_ui/` styles |
| CSS scope | Regents/Autolaunch use the full shared shell stylesheet; Patchbay/Techtree retain their own page layouts | Keep this difference: all use shared tokens and primitives, without imposing a universal layout |
| Mix paths | Autolaunch hardcoded sibling package paths | All support `REGENT_DEPS_ROOT`; isolated contexts pin the shared revision |
| Browser dependency paths | Autolaunch esbuild assumed `../deps` | Resolve through `Mix.Project.deps_path()` so isolated dependencies work |
| Build aliases | Autolaunch did not run the shared asset task | Both asset build and deployment aliases stage shared assets in all four apps |
| Image serving | Autolaunch omitted `images` from its static allowlist | All serve `/images/regent-ui/` |
| Backgrounds | Regents route masks, Autolaunch CSS gradients, Patchbay solid fields, Techtree site-wide GPU canvas | Shared cutting mat component everywhere except the two explicit home routes |
| Home exceptions | Distinct Regents field/prism and Techtree optics | Preserve both existing renderers on `/`; no shared mat there |
| Contrast | Some components reused pale primary fill colors for text/focus | Separate primary fill, readable link, and focus tokens |
| Error documents | Techtree errors retained unsupported theme names and no brand | Supported Techtree brand/theme plus shared background |
| Local ports | Autolaunch tests fixed port 4050; other contexts accepted PORT | Autolaunch accepts PORT too; each worktree gets a unique reserved port |
| Nested project | All four monorepos keep their Mix project in `platform/` | Worktree tooling selects each product's `platform/` directory |
| Database setup | Regents migration history assumes retained platform tables; other apps can migrate empty local databases | Keep product-owned schemas; Regents uses its existing guarded test fixture. Do not replay archived migration history to solve a visual change |
| Browser fixtures | App suites differ in seeding, authorization fixtures, server pools, and teardown | Use each app's disposable database and focused browser runs; do not merge authentication or domain fixtures into the UI package |
| Existing work | Autolaunch had extensive uncommitted design changes | Candidate includes an isolated snapshot; integrate only this rollout's delta |

## Historical boundaries at the palette rollout

Applications keep their domains, databases, routes, authorization, wallet behavior,
page layouts, and deployment schedules. The shared background component has no
routing logic. Regents and Techtree own their `/` exception in their root layouts.
Regents' marketing homepage remains on its existing dark presentation so its
preserved full-page artwork and text continue to agree.

## Reproduce the build

Run `node scripts/generate-tokens-json.mjs --check` from the design-system root,
and `mix check` from its `regent_ui/` directory.
Then select dependency paths and isolated ports/databases for each consumer.
Record the shared commit and local run settings in the assignment. Run `mix assets.build`
inside each prepared Mix root (`platform/` in all four monorepos). Review light and dark
pages, a mobile viewport, keyboard focus, and both homepage exceptions. Do not
copy generated assets from another application's checkout.

## Rollout verification

- All four isolated application asset builds pass against shared revision
  `669d367e2b1b1b4c281cc2eddb6938e7cb453386`.
- Shared package: 32 checks pass; generated CSS, JSON and SVG mirrors match.
- Focused application checks: Regents 25, Autolaunch 10, Patchbay 16, Techtree 32;
  all pass. Regents TypeScript checking and six showcase browser scenarios pass.
- Browser matrix: all eight site/mode combinations render and serve their SVGs;
  desktop and 390px mobile pages have no horizontal overflow. Patchbay's choice
  survives reload, and Autolaunch follows system changes. Both home exceptions
  retain their original canvases and omit the shared mat.
- Local screenshots and machine-readable results live under the workspace's
  `artifacts/theme-rollout/`. This is local verification, not a production rollout.

Shared component edits propagate to every app that consumes that component.
Product-owned components still need deliberate migration when their behavior and
structure match; a shared token import does not turn every local component into a
shared one. Avoid copying a component into an app to customize its palette.

## Product monorepo locations

The active consumers are `repos/regents/platform`, `repos/autolaunch/platform`,
`repos/patchbay/platform` and `repos/techtree/platform`. Use the product names
`regents`, `autolaunch`, `patchbay`, `techtree` with the worktree commands. Internal
OTP names and CSS brand identifiers are unchanged.
