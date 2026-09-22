<!-- BEGIN REPO CONTRACT -->
## Repo Contract

Repository ownership is documented below and in the local `repo.yaml`. Follow the workspace `regent-workflow` for execution.

- Repo contract: `design-system/repo.yaml`
- Owner: `design-system`
- Release group: `ops_preview`
- Owned areas: `shared_visual_language`, `tokens`.
- Change API or CLI behavior in the owning YAML contract before changing code.
- Hermes/Astra coordinates scoped Claude/Fable work; no ticket tracker is required.
<!-- END REPO CONTRACT -->
# Regent Design System Agent Guide

This repo owns the shared Regent visual language: tokens, fonts, palettes, logos and the
`regent_ui` Phoenix component package consumed by the Regents, Autolaunch, Patchbay, Techtree,
Ash Template and KeyFleet platforms and the `elixir-utils/erc8004` components.

## Start here

- `STYLE.md` is the canonical contract. Read it before changing anything visual.
- `design_system_tokens.css` owns every palette and typography value; `node scripts/generate-tokens-json.mjs`
  regenerates the JSON mirror, the packaged CSS and the packaged fonts. Never hand-edit generated
  copies or a consumer's `assets/vendor/regent_ui/`.
- `regent_ui/lib/regent/` owns shared presentation: `Primitives`, `Structure`, `Blog`, `Profile`,
  `ThemeToggle`, `HolographicCard` and `AgentMetadata`. The Shared compositions table in
  `STYLE.md` lists every public component and which apps use it. `regent_ui/assets/css/` owns
  their styles and `regent_ui/assets/js/` their browser modules. A defect in a shared control is
  fixed here once, not in per-product overrides.
- Third-party material redistributed here is recorded in `THIRD_PARTY_NOTICES.md`.
- `CONSUMERS.md` records the current consumer contract. `BLOG.md` and `MOBILE.md` hold the blog
  and mobile contracts.

## Core rules

- Shared components render; products decide. No routes, authentication, persistence, wallet
  admission, money movement or product workflow state lives in this package.
- Typography: Geist Pixel Square 400 for titles, subtitles and headings; Geist UI Sans 400/600
  for body and interface text; Geist Mono for code, addresses and technical identifiers. Never
  synthesize bold or italic Pixel. Fonts are served same-origin from `/fonts/regent-ui/`.
- Shape: a ruled technical sheet. `--radius` is 0; panels use fixed 45-degree cuts and primary
  buttons cut two corners. Only inert CSS skins clip; content, menus and focus rings never do.
  Flat, opaque surfaces with paired surface/ink roles; no glass, blur, glow, lift or idle motion.
- Palette: preserve the eight brand/mode definitions (`platform`, `autolaunch`, `patchbay`,
  `techtree` × `light`, `dark`). Shared CSS reads only the shared `--color-*` names. Status
  colors report state, never identity.
- Motion: transform and opacity only, plus the interaction-only primary/card sheen and the
  150ms outline transitions defined in `STYLE.md`. Reduced motion and forced colors are honored.
- Keep examples public-safe: no private user data, billing data, wallet secrets or support details.
- Never read `.env` files. `.env.example` is allowed.

## Validation

```bash
node scripts/generate-tokens-json.mjs --check
cd regent_ui && mix check
mix run ../scripts/render-structure-showcase.exs   # from regent_ui/, renders .showcase/
```

A passing package check is not consumer acceptance: rebuild each affected platform with
`mix assets.build` and look at the real pages in both modes before calling a shared change done.
