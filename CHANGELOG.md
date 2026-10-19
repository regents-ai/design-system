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

## 2026-10-16 — The "Your agents" heading link is underlined at rest

- With `href`, `agents_brief`'s heading now carries a quiet underline in the muted
  ink at all times, darkening to the heading's own ink on hover. It had underlined
  only on hover, so on a phone it did not read as a link (Sentinel's Patchbay panel
  read). The heading's size, weight and position are unchanged.

## 2026-10-16 — The pairing box links to the chosen agent's page

- `Regent.Account.pairing` takes an optional `guide`: the chosen agent's own page on
  the site, such as `/agents/dots`. In the side panel (`layout={:icons}`) a help icon
  under the copy and new-code icons links to it, named "How Dots pairs" on hover and to
  screen readers. It keeps its space until an agent is chosen, so choosing never moves
  anything. Ash Template and Keyfleet now give each agent its own page (Sean, 16 Oct:
  "each harness needs a custom page / skill / faq / link to its patchbay.help for
  troubleshooting").
- The message box grows from 5.5rem to 6.75rem so the three icons fit in its corner,
  which also shows more of the message before it scrolls.
- `STYLE.md` names the option.

## 2026-10-16 — X reads the share picture's alt text

- `Regent.AgentMetadata.head` writes `twitter:image:alt` from the same `image_alt` it
  already writes as `og:image:alt`. X reads only the twitter tag, so shared pictures
  showed there with no alt text (Sentinel's regents.sh v196 read). Sites pick it up on
  their next repin; callers change nothing.

## 2026-10-18 — The side panel's pairing box: one frame per picture, tighter, clearer

- Before a person chooses, the box now reads "Choose type of agent below to get
  pairing message." in place of "Choose your agent to get its message." (Sean, 18 Oct,
  on regents.sh: the old words sent people to "Your agents" above).
- Each picture in the side panel sits in one frame, not a frame inside a frame, and
  every agent picture (here and in agent lists) sits on white in both themes, so
  NVIDIA's black lettering and the other pictures drawn for a light ground read in
  the dark theme too.
- The copy, new-code and help icons have their own column at the right of the
  message, so no site's text styles can run the message under them.
- The pictures follow the box after a smaller gap, and "The code works once, until
  …" moves under them, so the space it keeps before a code exists no longer opens a
  gap above the pictures. A picture's name shows under a first-row picture and over a
  second-row one, so it covers only other pictures, never that line.
- `STYLE.md` describes the new order.

## 2026-10-18 — Techtree moves to the Canopy palette

- Techtree's light and dark colors in `design_system_tokens.css` (and its generated
  copies) are now Canopy, the forest green and lime palette Sean chose from the palette
  mockups: lime `#C8F25C` actions, `#2FA866` button marks, green grounds, surfaces,
  borders, links, focus and info. Status colors stay the shared ones. Every text pair
  clears 4.5:1.
- Techtree's figure, band and panel compartments now change with the theme, so they
  sit in its theme blocks.
- Two brand hooks, unset for every other brand so they draw exactly as before:
  `--rg-button-mark-color` colors a primary button's dark resting marks
  (`primitives.css`), and `--rg-theme-laser-light` / `--rg-theme-laser-dark` color the
  theme switch's beam (`theme_toggle.css`). Techtree sets them with
  `--rg-button-border-color`, and sets `--rg-shimmer-color` to its accent so a feature
  panel's hover sweep is lime rather than the Tangerine default.
- `STYLE.md` and `README.md` describe Canopy and the hooks.
- `README.md`'s token table now names Powder Blue as Techtree's mark where other sites
  name it, with Patchbay and Techtree carrying their own palettes, and `STYLE.md`'s
  artwork list gives Techtree's crown in Canopy greens instead of the old dot orbit.
- Evidence: level ordinary · features: Techtree brand tokens and hooks (no feature map in
  this repo yet) · proofs: regent_ui `mix check` 36 tests, token copies in sync, Techtree
  `make check` and a 96-load headless Chromium walk on the consuming site · gaps: WebKit
  not run on the Mac.

## 2026-10-18 — The profile form is one Public Display Name field

- `Regent.Profile.panel` is now one field, **Public Display Name**, with Save and a
  short note beside it saying whether the name saved (Sean, 18 Oct: "in account
  'Public Display Name'"). It takes the name the server already read as
  `display_name` and is shown only to a signed-in person, so it no longer offers
  Sign in, Set up your profile, a wallet choice, Connect X, Refresh linked
  accounts or Account details. Wallets and connections have their own Account tabs.
- `mountProfile` takes `openProfile` and an optional `onSaved`. Each Save opens one
  profile client from the product, so every step of one save is one person's. Save
  makes the person's profile from their sign-in the first time, then saves the name
  to the profile it read. Saves run one after another, so two quick presses keep
  the name pressed last. A save that fails outright says so instead of staying on
  "Saving…", and the form is marked busy while it saves. `saveName` is the same step
  without a page, for checks.
- The note beside Save is smaller, so two lines of it stay inside the button's
  height and never move what is below.
- The form no longer sets its own width, padding or heading margin: the page that
  holds it places it like its other panels.
