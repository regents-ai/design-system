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

## 2026-10-18 — Slimmer buttons

- Every shared button is about 40px tall (42px with its hairline), 8px by 16px inside,
  down from 58px and 16px by 24px, with its label on one line: a `.rg-button__label`
  too long for its row ends in an ellipsis instead of wrapping onto a second line, and
  a crowded row no longer squeezes a button narrower than its label. The arrow sits a
  little closer to the label. Sean, 18 Oct: the buttons were "too large and blocky".
- On touch screens every button stays at least 44px each way.
- The cut corners, each site's colours, the hover arrow and the press motion are
  unchanged. `STYLE.md` and `MOBILE.md` give the new size.

## 2026-10-19 — Buttons are back to their normal size on desktop

- Buttons are back to their normal size on desktop; 44px stays for touch targets
  only. Sean, 19 Oct 04:30Z: "Normal desktop size".

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

## 2026-10-19 — Techtree's button marks are a darker green

- Techtree's `--rg-button-border-color` and `--rg-button-mark-color` move from
  `#2FA866` to `#238450`, so a lime button's corner marks and its hover outline stand
  out at least 3:1 from the pale page (4.26:1), the card surface (4.50:1), the lime
  they sit on (3.63:1) and the dark page (3.94:1). `#2FA866` gave 2.77:1 on the pale
  page. Sentinel's Canopy read, 19 Oct: the edge and the corner marks must each reach
  3:1, without making the buttons blockier. Button size and shape are unchanged.
- The rest of Canopy keeps `#2FA866` (secondary accent, theme switch beam). `STYLE.md`
  gives the new mark green.

## 2026-10-19 — Techtree's lime buttons show their whole outline in light

- In Techtree's light theme, every main lime button now draws the whole 1px cut
  outline at rest in its mark green `#238450`, the same outline hover draws, so the
  lime's edge stands out on the pale page (3:1). Before, only the corner marks showed
  at rest, and Techtree drew the outline itself for its Sign in and Copy page buttons
  only, so Buy and Connect/Disconnect still showed just the marks. Size, shape and the
  arrow are unchanged; dark, disabled and secondary buttons and the other sites are
  unchanged. Techtree can drop its own outline once it pins this.
- `STYLE.md` and `README.md` say so; `visual_contract_test.exs` checks the two light
  rules and that dark has none.
- Evidence: level ordinary · features: shared main button, Techtree light ·
  proofs: regent_ui `mix test` 37 tests; the new test fails on three breaks (change
  removed, outline moved to dark, device-light rule outside its light block); a
  headless Chromium render of the library's own CSS reads `#238450` on all four edges
  and both cuts for Techtree light (desktop, phone width, device light) and not for
  Techtree dark, disabled, secondary, or the other three sites · gaps: WebKit not run
  on the Mac.
## 2026-10-19 — Touch ID page: no box around the crown, larger links, its own content only

- The crown files carry their own square, white for light and near-black for dark,
  which showed as a box on the page's cream or black. Each mark now blends its square
  into the page colour, so only the 13 blocks show. The crown files are unchanged.
- The two footer links are at least 44px tall, so each is a full tap target on a
  phone. The footer's paragraphs lose their 8px gap, which the taller links replace.
- The page's `<style>` and `<script>` carry `nonce="__NONCE__"`. The program serving
  the page puts a new random value there for each page and names it in its
  Content-Security-Policy, so the page runs only its own style and script.
- Evidence: level protected (the sign-in page) · features: siwa-server touch-id-page and
  agent-helpers · proofs: siwa-server `mix precommit` from a fresh copy (156 tests, 7
  properties, 51 headless Chromium checks: the crown corner equals the page colour in
  light and dark, both links 44px or taller, no policy refusals, both real helpers serve
  the page under their own policy), `build_agent_page.py --check` · gaps: WebKit not run
  on the Mac; regent_ui `mix check` not run (nothing under regent_ui changed).
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

## 2026-10-19 — No tilting cards, a copy icon on every address, one person per press

- `Regent.HolographicCard` no longer tilts toward the pointer (founder, 19 Oct): the
  light still follows it, and `point(light)` takes the light's position alone.
  `HOLOGRAPHIC_CARD_TILT`, the renderer's `tilt()`, the look's `tilt` and the
  `rg-holo-tilt` class are gone, so a site's hook drops its own tilt.
- New `Regent.Primitives.address`: every ENS name, address or short address a page
  shows (founder, 19 Oct). It shows the words, the full address on hover, and an
  icon that copies the full address; for an ENS name, the address it points to.
  `Regent.Account.agent_detail` uses it for the agent's address, so the agent map
  gains `wallet_label`, the ENS name or short form the site shows.
- `mountProfile` opens a save's profile client at the press of Save, not when the
  save's turn comes. A save pressed before a switch of account, still waiting
  behind another, now belongs to the person who pressed it, so it saves to neither
  account (Sentinel's read of 19 Oct).
- A name the profile service refuses for a control or text-direction character
  (`invalid_display_name`) says "That name can't be used. Remove any hidden
  characters."

## 2026-10-19 — The full address opens on a tap

- `Regent.Primitives.address` shows the full address when its words are clicked,
  tapped or opened with Enter, in the same box as a tip, not only on hover: a phone
  has no hover (Sentinel's read of 19 Oct). On a touch screen the words and the
  copy icon each take a 44 px target without making the line taller.

## 2026-10-19 — Names say where they come from and who sees them

- `Regent.Account.agent_detail` opens on a Name form under its heading: the agent's
  name, ready to change, with Save. A new required `rename_event` carries `agent_id`
  and `name`; the optional `name_error` shows why a name was refused in place of the
  hint, so nothing below moves. The hint says "Only you see this name.", and its tip
  says the agent chose it when it paired, that only the person and the agent see it,
  and that a new name shows on every Regent site (founder, 19 Oct).
- `Regent.Account.agents`' tip adds that each agent chose its own name, that only the
  person and the agent see it, and that opening an agent renames it.
- `Regent.Profile.panel`'s hint gains a tip: people see the Public Display Name beside
  what the person posts on every Regent site, and it is the same on all of them.

## 2026-10-19 — One account card for every Account page

- New `Regent.Account.identity`: the card at the top of the Account page, with the
  person's picture, the name the site calls them and their wallet, each said once.
  When the name is their ENS name or short address it is drawn as
  `Regent.Primitives.address`, which opens and copies the full address, and nothing
  repeats beneath it; a name they chose has the wallet beneath it, as its ENS name if
  it has one, else its short address. Patchbay's card showed the ENS name twice
  (founder, 19 Oct); every site now uses this one.
- `Regent.Primitives.address` shows the short form `0x1234..abcd` when given no
  `label`, so a page passes only the full address unless it has an ENS name; the new
  `Regent.Primitives.short_address/1` gives that form. `Regent.Account.identity`
  takes no `wallet_label`.

## 2026-10-19 — The card's shine keeps to a thick frame

- `Regent.HolographicCard`'s light and foil now show only on a thick frame round a
  face's edge, 12px wide (`--rg-holo-frame`); inside the frame the face stays still
  graphite, with the crown's outline still engraved on it (founder, 19 Oct). The
  frame's inner corners are cut like its outer ones, and the registration ticks sit on
  it. The still picture shown before the light is drawn has its pearl wash on the
  same frame. Foil ink still lights wherever it is.
- The renderer reads the frame's width from the canvas on every resize; no new
  argument.
- `CONSUMERS.md` and `THIRD_PARTY_NOTICES.md` no longer describe the card's turn,
  which ended on 19 Oct.

## 2026-10-19 — An address's touch targets are never under 44px

- On a touch screen, `Regent.Primitives.address`'s words and copy icon are at least
  44px tall (`max(2.75rem, 44px)`), as buttons and fields already are, so a site with
  a smaller root font size cannot shrink them below a finger's 44px.

## 2026-10-19 — "Your agents" shows three, with Manage beside the heading

- `Regent.Account.agents_brief` lists at most three agents and no longer scrolls; the
  site picks which three (ash-template shows the three most recently active). Its
  `href`, which made the heading a link, is replaced by `manage_href`: Manage beside
  the "Your agents" heading, shown while the pointer is over the list or a key has
  moved into it, and always on a touch screen, where it is at least 44px tall. It
  keeps its space while hidden, so showing it moves nothing. The heading is plain
  text (founder, 19 Oct). A site passing `href` passes `manage_href` instead.
- A row's last line puts a dot between the site and how long ago ("Active on
  Keyfleet · 15m"); the two had run together.
- `STYLE.md` describes the new options.

## 2026-10-19 — Style guide: dialogs, addresses and button hover

- `STYLE.md` takes Sean's rules of 19 Oct. A primary button rests as its plain fill and shows its corner marks on hover and keyboard focus; hover never takes them away. Two buttons side by side in a header are one primary and one secondary. Approve and the button it unlocks are the same size, and Approve turns grey with a green border once its transaction succeeds. New sections: "Dialogs" (no default square modal; every one uses the shared cut-corner shell) and "Addresses and transaction hashes" (short form, copy icon and a diagonal arrow to Basescan, from one shared component).
- The button CSS and the README's description of it still show the old hover, where the marks grow into an outline; they change with the shared button work.

## 2026-10-19 — Pairing message sample names the Regents Labs account

- The structure showcase's sample pairing message opens "Pair with my Regents Labs account on regents.sh", the words every site now gives (Sean, 19 Oct 2026; elixir-utils `62d3d040`).

## 2026-10-19 — Shared window frame, address arrow and the new button hover

- `Regent.Structure.dialog` is the one window every site uses (founder, 19 Oct): a native `<dialog>` whose top-left and bottom-right corners are cut with a Tangerine accent along each cut, and whose other two corners are square with a mark drawn in (Powder Blue in dark, Tangerine in light). Its contents scroll inside the frame, and `--rg-dialog-size` sets its width (32rem when unset). The account page's agent window uses it; sites move their own windows onto it.
- `Regent.Primitives.address` adds a diagonal arrow that opens the address on Basescan in a new tab, right after the copy icon, and takes `kind="tx"` for a transaction hash. On hover the copy icon grows a little and the arrow leans up and right; a press gives both a little; reduced motion keeps them still.
- Primary buttons rest as their plain fill and bring in their marks on hover and keyboard focus (founder, 19 Oct): dark shows Powder Blue square-corner marks and Tangerine cut accents, light two Tangerine L-edges. The README describes the new hover.

## 2026-10-20 — An address on Ethereum opens on Etherscan

- `Regent.Primitives.address` takes `chain="ethereum"` for an address or transaction on Ethereum, and its arrow then opens Etherscan ("Open on Etherscan"); everything else still opens on Basescan, the default. Regent Credits can be bought on Base or Ethereum, so the template's Credits history and refunds page show each purchase's transaction with this one component.

## 2026-10-20 — Windows dim toward charcoal and open with motion

- The page behind an open `Regent.Structure.dialog` now dims toward charcoal in both themes (stronger in dark), where before it dimmed toward the text color and so turned light grey in dark mode.
- A window rises a little and fades in over 220 ms and leaves over 150 ms, with the dimmed page fading alongside it. With reduced motion, or in forced colors, it appears and goes at once.

## 2026-10-20 — Window motion stays in the template

- The open and close transition added to `Regent.Structure.dialog` earlier today is taken back out. It fought the template's own window motion (a spring for a pointer press, at once for a key press), so a window could still be moving after 700 ms and a key press animated. Window motion comes from the template's motion script, which sites copy. The charcoal dimming behind an open window stays.

## 2026-10-20 — A button that shows something carries no arrow

- `Regent.Primitives.button` takes `arrow={false}` for a button that shows something,
  such as the header's Credits balance or the account's name, rather than going on
  somewhere. It keeps the button's cut corners, fill and marks and drops the chevron
  (`.rg-button--no-arrow`). Sean asked for the signed-in Credits and name to wear the
  same cut corners and marks as Sign in (20 Oct); the template's header uses it.

## 2026-10-20 — A tip opens under a mouse

- New `regent_ui/assets/js/tip.mjs`, copied by `mix regent_ui.assets`: a `Regent.Primitives.tip` opens while a mouse rests on its "i", sitting beside it, and closes a moment after the mouse leaves both the "i" and its words, so the mouse can move onto the words. A click on an "i" the mouse opened keeps it open until Escape, a press elsewhere or another click. Touch, pen and keyboard open a tip with a press, as before (founder, 20 Oct: an info icon that explains the Key price on hover). Sites import it once from `app.ts`.

## 2026-10-20 — The pairing box shows the chosen agent and drops the help icon

- `Regent.Account.pairing` with `layout={:icons}` puts the chosen agent's picture in the
  top-left corner of the message box, and its copy and new-code icons are smaller
  (24 px) and centred in their column. Sean asked for both (20 Oct).
- The chosen agent's name no longer shows under its picture once it is chosen; Sean
  found it left covering the row below.
- The help icon and its `guide` attribute are gone: Sean couldn't tell what it was for.
  Each agent's own page stays reachable from the site's agent guides. A site passing
  `guide` drops it when it re-pins.

## 2026-10-21 — The heart works outside a thread

- `Regent.Discussion.like` keeps its look wherever it sits, not only inside a
  `thread` or `posts`: its button size, padding and hover shade no longer need a
  `.rg-discussion` around them. The template puts it under each room message for
  likes. `CONSUMERS.md` says so.

## 2026-10-21 — The side panel opens under the header

- `STYLE.md` gains "The side panel opens under the header": the header runs the full
  width over the side panel, the panel opens under the header's bottom line, and the
  panel's top bar lines up with the sidebar's title row. Found on Patchbay, whose panel
  slid in beside a taller header. ash-template's browser walk checks both lines; sites
  copy that check.

## 2026-10-21 — An agent's window has a place for its picture

- `Regent.Account.agent_detail` takes a `picture` slot, shown after the facts and
  before "What may happen next": the product's control to choose or remove the
  picture a person gives their agent. Every site's Account page lets a person set it,
  as regents.sh did alone until now; a site that passes nothing shows the window as
  before.

## 2026-10-21 — An agent row can show its check-in light

- `Regent.Account.agents` and `Regent.Account.agents_brief` rows may carry `light`
  (`"on"`, `"late"`, `"off"` or `nil`) and `light_label`: an 8 px dot before the row's
  last-contact line, green, amber or red, whose words are its hover text and what a
  screen reader says. A row without a light is drawn as before. Keyfleet asked for it
  (Sean's 1. a, 21 Oct 11:15Z) to match its Who's here lights; `STYLE.md` says so.

## 2026-10-21 — An agent row names its wallet

- Each row of `Regent.Account.agents` shows the agent's wallet beside its name through
  `Regent.Primitives.address`: its short form, which opens the full address on a
  click, tap or Enter, its copy icon and its explorer link. The row map gains a
  required `wallet`; when it is `nil` the row says "Address unavailable" rather than
  guess. Two agents with one name now read apart.
- The contact line and the agent's window say "Last check-in", which is what the time
  is: when the agent paired or last checked in, not when it last did anything.
- A Codex handoff asked for it (21 Oct 11:15Z); `STYLE.md` says so. Sites add `wallet`
  to their rows when they re-pin.

## 2026-10-21 — Agent rows: the wallet's controls stay reachable

An independent review of the two entries above found these, now fixed:

- With a mouse, a row's actions (such as Unpair) were laid over the row's end, so a
  click meant for the wallet's copy icon or explorer arrow pressed Unpair. They now keep
  their own column and only fade in on the row being pointed at or focused.
- On a phone, an agent with a long name, a wallet and World ID pushed the page wider
  than the screen. The wallet now has its own line under the name in every row, World ID
  is its mark alone there (a screen reader still says the words), and the name keeps at
  least 4rem.
- A row whose wallet is unknown was shorter than one with a wallet. "Address
  unavailable" takes the wallet's height, and the address's explorer arrow is the same
  size as its copy icon (it was 2 px taller), in every site.
- `light` and `light_label` are required row keys in `agents` and `agents_brief`, `nil`
  where a site has no check-ins, so a row has one shape. A light must have its words.
- The light's states have their own shapes as well as colours: filled on time, half
  filled late, an empty ring once stopped.
- Sites re-pinning add `wallet` (agents rows) and `light` and `light_label` (both
  lists) to their rows. The showcase's sample rows carry all three.

## 2026-10-23 — plug_crypto 2.2.1

- Moved plug_crypto to 2.2.1 in `regent_ui/mix.lock`, which closes the medium-severity
  EEF-CVE-2026-105963 (a wrong-typed argument could write the secret key base into the
  error log). Lockfile-only change; `mix check` audits the lock and failed on 2.2.0.
  Sites take the same pin in their own locks.

## 2026-10-23 — A figure can open its own tip

- `Regent.Primitives.tip` takes a `figure` slot: a price or a percentage that opens the
  tip's words itself, with no "i" beside it. The figure is the button, so its words
  describe it for screen readers and agents, and it opens on a press, a tap, Enter, or a
  resting mouse with `tip.mjs`, the way the "i" does. It keeps the text's own look with a
  dotted underline. `label` is needed only for the "i".
- Autolaunch asked for it (23 Oct), so its own copy of the tip can go.
## 2026-10-23 — Last read, with a read-again icon

- New `Regent.Primitives.last_read`: when figures read from the chain were last read,
  as a clock time in UTC, and an icon that asks the page to read them again
  (`phx-click`). The sites now read the chain every few minutes instead of every few
  seconds, and read again straight after a person's confirmed on-chain action or a
  press of this icon, so the page says how fresh its figures are.
- Styles in `primitives.css` (`.rg-last-read`): the icon looks like the copy icon, is a
  44 px target on a touch screen, and turns while its press is on its way, except under
  reduced motion. Its rules are two classes deep, so a site's plain-button look
  does not reach it. A page may pass `disabled` while its own limit on presses
  runs; the icon then rests dimmed.
- A tap on the icon no longer flashes the phone browser's own highlight (a blue box
  on Android); the icon's turn already shows the press.

## 2026-10-23 — ChatGPT's picture

- `Regent.Account.agent_mark` draws an agent of kind `"chatgpt"` with OpenAI's mark
  (`regent_ui/priv/static/images/agents/chatgpt.svg`), black on the white frame like the
  other pictures. Before, an agent list or pairing box holding a ChatGPT agent failed to
  draw. Sites pick it up at their next repin and `mix regent_ui.assets`; callers change
  nothing. Turning ChatGPT pairing on stays each site's own setting
  (`config :regent_agents, chatgpt_pairing: true`).

## 2026-10-24 — regent_ui accepts Elixir 1.20

- `regent_ui/mix.exs` asks for Elixir `~> 1.19` instead of `~> 1.19.5`, which ruled out 1.20 and
  made every site on Elixir 1.20.4 warn when it built regent_ui. Checked on Elixir 1.19.5 and
  1.20.4 (46 tests each). Keyfleet found it.

## 2026-10-27 — Agent list and agent window: clearer words and layout

- `Regent.Account.agents`: each row shows the agent's whole name, and the line under
  it holds the address (copy and explorer controls) and the row's actions, always in
  view. The hover-only actions and the phone-only wallet line are gone.
- `Regent.Account.agent_detail`: the agent address has a tip on how the agent made
  it with SIWA and how the app running the agent keeps its key. Headings are now
  "Allowed Agent Actions", "Spending" and "Activity". "It never uses your wallet." is
  a quote in headline size. Spending adds "More info at your account", linking to the
  new `account_href` (default `/account`). Activity drops its explainer; with nothing
  yet it reads "Your agent’s actions will appear here."

## 2026-10-27 — A tip reads in plain letters beside a small-capitals label

- `.rg-tip-body` resets letter spacing and capitals, so a tip opened from a label such
  as the agent window's "Agent address" no longer comes out in spaced capitals.

## 2026-10-27 — Pages tell search engines what they hold

- New `Regent.StructuredData`: `blog_posting/2` (from a `regent_blog` post),
  `discussion/1` (a QAPage for a question, with its marked answer accepted, or a
  DiscussionForumPosting with its replies as comments) and `dataset/1` (a data table
  and its downloads), joined to the site graph by `graph/2` and printed by
  `Regent.AgentMetadata.head`. Facts a page does not show are left out. Patchbay's
  AI-search request; `CONSUMERS.md` and `STYLE.md` say so.

## 2026-10-27 — Layers

- `STYLE.md` has a Layers section after Shape and spacing: six layers (Ground, Sheet,
  Card, Panel, Window, Tip), each showing its height by its edge, its fill and how it
  arrives, never by a soft shadow.
- New tokens: one stacking place per floating layer (`--rg-layer-card` 1, `-shade` 10,
  `-panel` 20, `-header` 30, `-tip` 50, `-skip` 60) and one shadow each for panel and
  tip, both `none`: layers stay flat (Sean, LAYERS-DEPTH a). Windows need no number;
  the browser lifts them above the page.
  The template uses the same names and words.
- `.rg-panel` lifts on focus to the card layer, and the account choice's name tip
  takes the tip layer, so regent_ui states no stacking number of its own outside
  artwork.
- `Regent.Structure.dialog` also opens as a popover (`popover` on the component), so a
  window shown above another window, such as Credits' "Where to spend", wears the same
  cut-corner frame.

## 2026-10-27 — Addresses keep their letters, and come in full and compact forms

- `Regent.Primitives.address` resets letter case, small caps and spacing on its own
  words, its full address and its tip, so a site's uppercase, small-caps or spaced-out
  label or button style no longer turns `0x1234..abcd` into `0X1234..ABCD`. The words
  always read left to right, so on a right-to-left page a long name is cut at its end.
  regents.sh asked for it; the template chief's review found the small caps and
  right-to-left cases.
- New `variant` attribute. `short` (the default) is the address as before. `full`
  shows every character of the `0x` address, wrapping, with the copy icon and the
  arrow after it, for a person checking an address they typed for someone else.
  `compact` holds the short form's twelve characters and the copy icon, without the
  arrow, so it fits beside a small control such as "Change" in a row 320 px wide; a
  longer name ends in an ellipsis there and still opens and copies in full.
- `STYLE.md` "Addresses and transaction hashes" says when to use each.

## 2026-10-28 — Claude, the connected app, has its picture

- `Regent.Account.agent_mark` knows the `claude` harness, which elixir-utils d763b80 added
  for the Claude connector, and shows it with the Claude picture Claude Code already uses.
  Before this, any agent list showing a Claude paired through the connector raised,
  because the picture map is read with `Map.fetch!`, on every site whose pin lacks this
  line, whether or not that site offers the connector. Pairings are shared, so every site
  takes this pin before any site switches the connector on.

## 2026-10-28 — An unanswered question is a forum post until it has an answer

- `Regent.StructuredData.discussion/1` gives a question whose page shows neither a marked
  answer nor a reply a `DiscussionForumPosting`, and a `QAPage` once it has one. Search
  engines read a `QAPage` only with an accepted or suggested answer, so every new question
  on every site was reported as an error until someone replied (Patchbay found it).

## 2026-10-28 — The account menu and one Account page layout

- Sean, 28 Oct 07:54Z: "instead of a sidepanel, do a upper right modal. and then the
  account route on all sites handles that privy user . and all account routes should be
  the exact same, with some local site versions shown first".
- New `Regent.Account.menu`: the account menu, a browser popover hanging under the
  header's account button on the Tip layer (firm edge, raised fill, no shadow; drops in
  over `--duration-base` and leaves over `--duration-fast`, still with reduced motion).
  It hangs from the button the site names `anchor-name: --rg-account-menu` (`position-area`)
  and is never taller than the room below that button, so a short screen scrolls it. It holds the person's picture, name
  and wallet (`Primitives.address`, left out when the name already is the wallet's ENS
  name or short address, in any letter case), their agents (`agents_brief`), Pair New
  Agent, Manage Account and Sign out. Screen readers hear it named by the person's name.
  Both links patch. On a phone it spans the screen less 8 px each side.
- New `Regent.Account.layout`: the Account page's sections in one order on every site,
  the site's own parts first, then the account card and the agents across the page,
  then Pair New Agent beside Credits and the profile; two columns from 46rem.
- `Regent.Account.identity` leaves out the wallet line when the name already is the
  wallet, as the menu does.
- `Regent.Primitives.button` passes `popovertarget` and `popovertargetaction`.
- `STYLE.md`: the side panel rule becomes the account menu rule; `agents_brief` goes in
  the menu and `pairing` on the Account page; the Account page section describes the
  shared layout.

## 2026-10-28 — Claude Duet has its own picture

- Sean, 28 Oct 15:37Z, answered the picture decision with the Claude Duet logo. The
  `claude` harness (Claude, the connected app) now shows `claude-duet.png`, the coral
  circle with the black loop, cut to 128 by 128 on the paper colour like the other
  agents. Claude Code (`claude_code`) keeps its own picture.

## 2026-10-28 — Claude Duet's picture without its paper square

- `claude-duet.png` keeps only the coral circle and the black loop; the off-white paper
  around them, and three small marks left in its corners from the screenshot it was cut
  from, are now transparent. Agent pictures sit on the mark's white tile, where the
  off-white showed as a faint square (reviewer, 28 Oct 17:38Z).

## 2026-10-28 — The account menu can carry the Credits balance on the narrowest phones

- `Regent.Account.menu` takes an optional `balance` slot: the Credits balance as one
  button that opens the site's Credits panel. It shows, as a flat row under the wallet
  like Pair New Agent (44 px tall), only at 22.49rem wide and under, where the site's
  header leaves its own balance out. At 320 px the header's seven buttons and the frame's
  gutters needed about 323 px of a 288 px row, so a person with a balance scrolled
  sideways by 15 px (design chief's review, 28 Oct). No balance, no slot, no row.
  `STYLE.md` says so.

## 2026-10-29 — An address's two icons stay on one line

- `Regent.Primitives.address` puts its copy icon and Basescan arrow in one group,
  `.rg-address__icons`, that never breaks. In `variant="full"` the wrapping address
  could leave the copy icon at the end of one line and the arrow at the start of the
  next (88 of the widths from 120 to 460 px did it). The short and compact forms keep
  every position they had; in the full form the arrow now sits as tight to the copy
  icon as it does in the short form. `STYLE.md` says so.

## 2026-10-29 — A wallet author in a discussion opens and copies their address

- `Regent.Discussion.post` and `Regent.Discussion.solved` take `author_address`: the
  author's `0x` wallet address when their name is its ENS name or short form. The name
  is then drawn with `Regent.Primitives.address` (its words open the full address, then
  the copy icon and the Basescan arrow), so a wallet author follows the 19 Oct address
  rule. On a post, `author_href` then links the author's picture, because the name's
  words open the address. Without `author_address` both look as before.

## 2026-10-29 — Blog tables fit small phones

- `blog.css`: at 40rem wide and under, prose table cells drop their 10rem minimum,
  take `10px 12px` padding and never split a word (`overflow-wrap: break-word`). A
  two-column table now fits a 320 px phone, where its second column used to start
  off-screen inside the table's scroll region; a wider table still scrolls there, each
  column as narrow as its longest word. Desktop is unchanged. Without the last rule the
  cells inherit `overflow-wrap: anywhere` and a six-column table (Techtree's wallet
  bench post) shrank to one letter per line. `BLOG.md` says so. Sean chose this design
  on 29 Oct ("use recommended"), from the 28 Oct live review of Techtree's posts.

## 2026-10-29 — Agents get their own page

- `Regent.Account.agents_layout` is the Agents page's body (`/account/agents` on every
  site): the person's agents full width, then Pair New Agent in the left column from
  a 46rem container width, its section `#<id>-pairing` as before. `Regent.Account.layout`
  no longer takes the `agents` and `pairing` slots: the Account page is the account
  card, then Credits beside the profile. The menu's `pair_href` now points at the
  Agents page, such as `/account/agents#account-pairing`. A tester could not find
  where to pair or where to see their agents; one Agents tab answers both. `STYLE.md`
  says so.

## 2026-10-29 — The Agents page's list is headed Paired

- `Regent.Account.agents/1` is headed Paired, not Agents: it now sits on the Agents
  page, under the page's own title Agents, and above Pair New Agent. Its tip is
  unchanged.

## 2026-10-30 — Addresses on Robinhood, on a test network, and long IDs

- `Regent.Primitives.address` takes `chain="robinhood"`, whose arrow opens the address
  or transaction on Blockscout (`robinhoodchain.blockscout.com`), and `chain={nil}` for
  a test network with no explorer, such as Autolaunch's local chain 31337, which leaves
  the arrow out. `kind="id"` draws a long hex ID that is not an address, such as a
  Uniswap v4 pool ID: its short form, which opens the whole ID, and a copy icon labelled
  "Copy the full ID", with no arrow. Autolaunch asked for both so its stock page can
  drop its hand-made Copy buttons. `STYLE.md` says so.

## 2026-10-30 — A test network is chain="test"; an unknown chain raises

- `Regent.Primitives.address` takes `chain="test"` for a test network with no explorer
  (copy icon, no arrow) in place of `chain={nil}`, which it no longer accepts. Any chain
  other than `"base"`, `"ethereum"`, `"robinhood"` or `"test"`, such as the atom
  `:robinhood` or a nil from a forgotten assign, raises `ArgumentError` when the page
  renders, for every kind, instead of quietly dropping the explorer link. `STYLE.md` and
  `README.md` say so.
