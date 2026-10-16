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

## 2026-10-16 — Outside taps: a click on the root element

- `pill_select.mjs` goes back to closing a pill on a click outside it, now heard on the
  root element (`document.documentElement`) instead of the document: iPhone Safari
  sends a tap on plain text there, and the pointerdown close brought back a layout
  shift when one pill is swapped for another (Sentinel's WebKit iPhone read). This
  replaces the previous entry's pointerdown close and drops its `STYLE.md` line.

## 2026-10-16 — Touch ID page names who opened it and says when to close it

- `standalone/agent-key.html` gains a bold "Opened by …" line at the top of the card
  (`#opener`) and a bold "You can safely close this page" line under the Touch ID
  button (`#done`). SIWA's `assets/agent/passkey.js` fills the first and shows the
  second once Touch ID succeeds. The closing line keeps its space while hidden, so
  nothing below it moves. SIWA v61 shipped this by editing its generated copy; this
  moves the layout to its source so `build_agent_page.py --check` matches again.

## 2026-10-16 — The side panel's "Your agents" heading can be a link

- `Regent.Account.agents_brief` takes an optional `href`. With it, the "Your agents"
  heading itself is the link, in the heading's own colour and size, underlined on hover
  and ringed on keyboard focus. Without it the heading is plain text, as before.
  Patchbay hid the shared heading and placed its own link to `/account` over it; it can
  now pass `href` instead (Sentinel's request).
- `STYLE.md` lists `agents_brief`'s options.

## 2026-10-16 — The ratio card no longer crashes WebKit

- `ratio.css`: the header and footer badge border is now written as one flat colour
  mix. It was a mix of two other mixes (note ink at 35% over note fill), and WebKit
  crashes the page on a `color-mix()` whose two colours are both `color-mix()` values.
  Headless WebKit (Playwright build 2311) crashed on the regents.sh stake page because
  of it, as Sentinel found. The colour is the same to the pixel in Chromium and WebKit,
  light and dark.

## 2026-10-16 — STYLE.md: agents need their `kind`

- `STYLE.md`'s field lists for `Regent.Account.agents` and `agent_detail` now name
  `kind`, the harness value that picks the agent's picture, and say every field is
  required; both components read it directly. `agent_detail`'s list drops `logo`, which
  it never reads (Sentinel's docs note on d653c0a).
