# Structural refactor acceptance record

> Historical baseline, before the Pixel/Mono, supporting-palette, select and feature
> refinements. Font-preservation claims and browser evidence below describe that
> earlier snapshot, not current verification. See the workspace artifact
> `artifacts/structural-design/refinements-implementation.md` for implementation checks;
> fresh browser acceptance of the refinements is recorded separately by the coordinator.

## Scope and outcome

Shared design-system implementation and local showcase are ready for visual approval. No consumer products were migrated, no deployment was performed, and no commit or push was made.

The same real Phoenix-rendered structure was inspected across Regents (`platform`), Autolaunch, Patchbay and Techtree in light/dark: **16 desktop/mobile records**. All existing palette color values and font tokens were compared against HEAD and preserved; generated token mirrors were regenerated.

## Implemented

- Canonical square cells, 16/12px four-corner panel cuts and 12/8px opposing button cuts; eight-pixel spacing preserved.
- Continuous responsive frame with optional rail; section bars, split hero, connected three-band feature panels, closing composition and technical figures.
- Visual skins are clipped; interactive hosts remain unclipped with visible overflow and keyboard outlines.
- Paired local surfaces/ink, including Patchbay aliases and local error/status ink.
- SVG page background selection disabled in all eight themes; existing SVG assets retained. Legacy generic chamber/ledger panels now use flat shared skins.
- STYLE.md and consumer/readme guidance updated; historical spatial document explicitly marked noncanonical.

## Executed checks

- `cd regent_ui && mix check`: **36 tests, zero failures**, generated assets in sync.
- `mix run ../scripts/render-structure-showcase.exs`: actual shared components exported successfully.
- `node --check scripts/showcase.js`; `git diff --check`: passed.
- Chromium at 1440px and 390px for every theme; stress reflow at 320px, including 200% root text size. Intermediate widths from 768 through 1920 and no-rail reflow were also inspected.
- Tab/Shift-Tab focus, Enter disclosure activation, expanding long content/errors, menu hit-testing beyond panel bounds, native modal open/focus/Escape, and labeled modal close by pointer and keyboard passed.
- All sampled text/surface pairs exceeded 4.5:1 (minimum 5.05:1). Separate accent-panel field/error/status audit passed in all eight themes. Essential field borders exceeded 3:1; primary buttons retained visible 2px keyboard outlines.
- Reduced-motion check found no active animations. Forced-colors fallback supplied rectangular boundaries with cut skins disabled.
- A disposable Mix consumer installed the locked package and ran `mix regent_ui.assets`; copied CSS files, including the new structure import, matched package source bytes.

## Review resolution

The independent review found that the showcase Close dialog button defaulted to `type="button"`. This was reproduced, corrected at the call site to `type="submit"`, and rechecked across all 16 records with pointer and keyboard activation plus focus restoration. The shared safe button default was retained. Previously flagged local ink and generic legacy panel issues were corrected before final verification.

## Evidence

Local evidence directory: `/Users/sean/Documents/regent/artifacts/structural-design/`.

- `matrix.json`: final 16-record layout/interaction/contrast matrix, with screenshot paths.
- `local-pairs.json`, `focus-borders.json`, `extra.json`: local contrast, focus/boundaries and intermediate-width evidence.
- `final-review.md`: independent pre-fix report; this record documents its resolution.
- `*-desktop.png`, `*-mobile.png` and focus/menu screenshots: rendered evidence.

Recreate the showcase with the command above; serve `.showcase` on localhost. The current local preview is http://127.0.0.1:8766/ with product/theme selectors.

## Limits and outstanding work

- Protected-file approval timed out twice. Workspace/design-system AGENTS.md and the canonical workflow skill were **not changed**. Mandatory Claude/Fable wording and any old shape instruction there remain pending protected-file approval; direct Astra implementation was explicitly authorized for this session.
- This is Chromium local-fixture acceptance, not full WCAG certification, screen-reader acceptance, Safari/Firefox acceptance or production consumer approval. Native select styling/focus were checked, but native popup keyboard selection was not confirmed by the background browser harness.
- Product rollout and actual application routes remain deferred until shared visual approval. The disposable consumer check proves package asset consumption, not product integration.
- Existing nil-wallet profile behavior and pre-existing locked-dependency advisories were not changed by this structural refactor.
