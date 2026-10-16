# Changelog

This file is append-only. Add new dated entries at the end, in chronological order.
Do not edit, reorder, or remove existing entries; append corrections separately.
Changes before 16 October 2026 are in the commit history.

## 2026-10-16 — Filter pills close on Escape and outside presses

- New `regent_ui/assets/js/pill_select.mjs`: an open `details.rg-pill-select` menu
  closes on Escape, handing focus back to its summary when focus was inside it, and on
  a press anywhere outside it. Patchbay's R5 read found the menu stayed open.
- `mix regent_ui.assets` copies it next to the other browser modules; a site imports it
  once from its `app.ts`. `STYLE.md` and `CONSUMERS.md` say so.
- This file starts here.

## 2026-10-16 — An Escape that closes a pill stops there

- `pill_select.mjs`: an Escape that closes an open pill goes no further, so a dialog
  holding the pill stays open until the next Escape, as Patchbay's own fix did.

## 2026-10-16 — Outside taps close a pill on iPhones too

- `pill_select.mjs` closes an open pill on the pointerdown of a press outside it, not
  on its click: iPhone Safari sends no click for a tap on plain text, so the menu stayed
  open there. `STYLE.md` says the menu sits over the page, so closing it moves nothing
  under the press.
