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

## 2026-10-30 — The theme switch's beam follows the button marks

- `STYLE.md` says it once: a brand that sets its own button marks sets the beam to match,
  as Techtree does; every other brand keeps the shared beam, Tangerine in light and
  Powder Blue in dark, the colours of its button marks. Patchbay's primaries keep
  Tangerine edges, so its beam stays shared. No style changes.

## 2026-10-30 — Geist Serif everywhere

- Every role now sets Vercel's Geist Serif (Sean, 30 Oct: "switch all fonts, everywhere"):
  titles, headings, body, controls, labels, addresses, amounts and indices.
  `--font-family-serif` is the face; `--font-family-title`, `--font-family-ui` and
  `--font-family-paragraph` resolve to it. `--font-family-sans` is gone.
- Geist Mono 400 stays only for code (`code`, `kbd`, `pre`, `samp`, the pairing message
  and blog code) while Sean decides whether code goes serif too.
- Vercel ships Geist Serif in regular upright 400 only, so the root sets
  `font-synthesis-weight: none`: semibold and `strong` render at 400, never a fake bold.
- Packaged fonts are now `GeistSerif-Regular.woff2` and `GeistMono-Regular.woff2` (plus
  `OFL.txt`); Geist Sans, Geist Pixel and the other Mono files are removed from the
  package and from `geist-font/`.
- Consumers: move the pin, run `mix regent_ui.assets`, and replace any
  `--font-family-sans` or non-code `--font-family-mono` in site CSS with `--font-family-ui`.
  SIWA's `scripts/build_agent_page.py` embeds `GeistSerif-Regular.woff2` and
  `GeistMono-Regular.woff2` now.

## 2026-10-30 — No weight above 400

- Geist Serif has one weight, so every rule that asked for 500 or 600 did nothing. Those
  declarations are gone from the package CSS, and so is `--font-weight-semibold` (CSS and
  JSON tokens). Hierarchy is size, colour and space only, as `STYLE.md` now says.
- Two places relied on bold alone and now use colour or size: a discussion's "liked by"
  names take the page ink against the muted line, and headings inside a post excerpt are
  set in the title role at 1.125em.
- Consumers: delete any `font-weight` above 400 and any `var(--font-weight-semibold)` in
  site CSS, and give a name or amount beside quieter words `--color-fg` against
  `--color-fg-muted`.

## 2026-10-31 — phoenix_html 4.4.0

- `regent_ui/mix.lock` moves phoenix_html from 4.3.0 to 4.4.0, which fixes advisory
  EEF-CVE-2026-117645 (medium). Lock only; `regent_ui`'s 58 tests run clean on it. Sites
  resolve phoenix_html in their own locks, so each site bumps its own.

## 2026-11-04 — Packages to latest

- `regent_ui` lock: phoenix 1.8.15 to 1.8.16, phoenix_live_view 1.2.12 to 1.2.13, websock_adapter 0.6.0 to 0.7.0.
- `social-posts`: @types/node 24.12.2 to 26.6.6 (major), @tailwindcss/vite and tailwindcss 4.2.4 to 4.3.4, react and
  react-dom 19.2.5 to 19.3.1, react-router-dom 7.15.0 to 7.18.5, vite 8.0.10 to 8.3.5, @vitejs/plugin-react 6.0.1 to
  6.2.1, eslint 10.3.0 to 10.14.0, typescript-eslint 8.59.2 to 8.72.1, and the rest of its build tools.
- typescript stays at 6.0.3: typescript-eslint, at its newest, allows only below 6.1.
- `social-posts`: minimatch forced from 10.2.6 to 11.0.4, which closes alert 1 and the 12 moderate audit notices in the
  eslint tools. eslint and typescript-eslint ask for 10; both lint with 11 unchanged.

## 2026-11-04 — A copy button can copy a page fetched when pressed

- `Regent.Primitives.copy_button` takes `url`, beside `text` and `target`, for a text too long to carry in the page.
  It renders `data-copy-url`; the template's `assets/js/copy_buttons.ts` fetches and copies it when pressed. A site
  takes this library pin and that script together.

## 2026-11-05 — Every icon comes from Lucide

- New `Regent.Icons.icon`: any Lucide icon by name, from the whole set of 1.68.0 in
  `regent_ui/icons/lucide`, at the library's weight and centred on the words beside it.
- The library's own icons move onto it: the copy icon and its tick, frame and cross, the
  read-again and new-code icons, the explorer arrow, the tip's mark, Pair New Agent's
  plus, the disclosure chevron and the discussion marks. The arrows on buttons and the
  pill select's chevron take Lucide's shapes in `primitives.css`.
- `STYLE.md` gains the Icons rule: a site never draws its own. `THIRD_PARTY_NOTICES.md`
  carries Lucide's licence.

## 2026-11-06 — Pair New Agent opens one window

- `Regent.Account.pairing` is now the pairing window's insides, in one layout (founder,
  2026-11-05, "1a"): an agent dropdown with names and pictures, the chosen agent's
  picture large, then three numbered steps: copy the message, paste it, and a tick
  once paired. The `layout` and `messages` attributes are gone, with the `:list` and
  `:icons` layouts.
- `Regent.Account.menu` takes `pair_window`, the id of the site's pairing window, in
  place of `pair_href`: Pair New Agent is a button carrying `data-pair-open` that the
  site's script answers by opening the window over the page.
- `Regent.Account.agents_layout` is gone: the Agents page shows `agents/1` alone, and
  its footer's Pair New Agent opens the window.
- `pill_select.mjs` hands focus back to a pill's summary however the pill closes,
  including the page's redraw after a choice.


## 2026-11-06 — A pill in a window waits for the window

- `pill_select.mjs`: a press outside an open pill closes it only within the pill's own
  layer, its window or else the page. Pressing Pair New Agent on the page had closed the
  agent list waiting in the pairing window, so the window opened without it.
- `account.css`: the pairing dropdown's pill has no block padding, so the chosen agent's
  picture fits its 44px and a choice no longer makes it 2px taller.
- `pill_select.mjs`: Escape closes only the open pills a person can see, inside the open
  window when one is open. The agent list waiting open in the shut pairing window had
  taken every Escape, so the account menu no longer closed on it.


## 2026-11-06 — The Points page

- New `Regent.Points` (`points.css`): `layout`, `total`, `todo`, `board`, `bonus` and
  `activity`. The total sits large on the site's band colour with today, yesterday and
  the account's rank; the actions left to do come first, each with its points; the
  leaderboard marks the reader's own row; the bonus marks the tier held. One column on
  a phone, two where the page gives it 52rem or more; no part changes height as its
  figures arrive.
- `Regent.Account.points_summary` and its `.rg-account__allowances` styles are gone;
  the Points page uses `Regent.Points.total` and `todo`.
- Pairing: on a touch screen the message box's copy and new-code icons are each a 44px
  press (28px with a mouse), and the box is 90px tall in every state, so nothing moves
  when a code arrives. The showcase's pairing examples drop the `messages` input the
  component no longer takes, which had warned three times on every render.


## 2026-11-06 — Points: no Credits rows, wallets on the board

- The showcase's Points examples show a Patchbay Offer and an agent's first note in
  place of "Credits bought": Points no longer has a Credits rule.
- `Regent.Points.board`: a row whose `name` is `nil` shows its `wallet` through
  `Regent.Primitives.address` (compact, with the copy icon), labelled with `ens_name`
  when it has one, in place of a short address printed as plain text. Each row now
  takes `wallet` and `ens_name`. Every wallet is public (Sean, 6 November 2026).


## 2026-11-06 — Credits leave the shared components

Sean dropped Regent Credits on 6 November 2026: no site shows, sells or spends them.

- `Regent.Account.credits_summary` is gone, with its `.rg-account__metrics` styles.
- `Regent.Account.menu` no longer takes a `balance` slot; its `.rg-account-menu__balance`
  row and styles are gone.
- `Regent.Account.layout` no longer takes a `credits` slot. It now holds the site's own
  sections, the account card and the profile, one below the other at full width; the
  `.rg-account-layout__grid`, `__full` and `__column` classes are gone.
- `Regent.Account.agent_detail` no longer takes `spent` or `account_href`, and its
  "Spending" part is gone: the window answers what the agent may do and what it has done.
- `STYLE.md` and the showcase drop every Credits example.


## 2026-11-12 — A style check sites can run

- New `regent_ui/scripts/style-check.sh`: prints `file:line: rule: text` for each break
  of a `STYLE.md` rule in a site's own CSS, scripts and templates (soft shadows,
  stacking numbers, glass and blur, weights above 400, radii, layout animated from
  scripts, stray `<svg>`, "KeyFleet", page words that say how a page is built) and exits
  1 when it finds any. Vendored copies and ignored files are skipped. A rule is now
  checked by the build instead of remembered (November bonus pack, step 1).
- `mix regent_ui.assets` copies it into `assets/vendor/regent_ui/` with the styles;
  `CONSUMERS.md` says how a site calls it. No site runs it yet.
- The regents.sh home glass panel is the one approved glass (Sean, 12 November 2026):
  its line carries `style-check: allow glass — Sean 12 Nov 2026`. `STYLE.md`'s Glass
  section says so.
- Over this package's own files it reports 26 lines today: inset rules drawn with
  `box-shadow` in the Account, Discussion and Points styles, the theme switch's laser
  glow, its prism's rounded corners, the pill select's `999px` radius, and the negative
  stacking numbers of the panel, figure, button and foil skins. They are left as they
  are here.


## 2026-11-12 — Figures: `rg-figure` and `Regent.Primitives.figure`

- New `rg-figure` class: equal-width digits on any figure or column of numbers; a
  table cell with it lines up on the right. Geist Serif carries the `tnum` feature
  (checked against `regent_ui/priv/static/fonts/GeistSerif-Regular.woff2`).
- New `Regent.Primitives.figure` for a figure that changes while someone watches. Its
  `width` keeps the characters of its widest value, so the words beside it and the line
  below stay put when it changes, and it carries `data-count` for the motion kit's
  `MotionCount` roll (November bonus pack, step 2).
- The Points, ratio card, account history, agents' last action and last-read figures
  now take `rg-figure` instead of setting `tabular-nums` themselves.
- The showcase gains a Figures section: two live figures with a Change button, and a
  column of numbers.


## 2026-11-12 — Corners: nested cuts, pills from height, rings that follow the shape

- New tokens: `--rg-cut-nest` (0.585786, 2 − √2: inner cut = outer cut − 0.59 × gap),
  `--rg-cut-nested-8` (12px) and `--rg-cut-nested-16` (8px), which a phone's 12px panel
  cut makes 8px and square, and `--rg-ring-width` and `--rg-ring-offset` (2px each).
  The JSON mirror is regenerated (November bonus pack, step 3).
- The panel's inner skin and the holographic card's foil take their nested cut from
  `--rg-cut-nest` instead of a written number; the card's still foil now uses the same
  rule instead of taking 1px off.
- A primary button's keyboard focus ring is cut to follow its corners, 2px of
  `--color-focus` 2px outside it, in place of the square outline that sat round it.
  Secondary buttons, disclosures and fields keep a square ring, now 2px outside in
  `--color-focus`; forced colours draw a plain Highlight ring.
- `rg-pill-select` takes its radius from `--pill-h` instead of `999px`, and its ring
  follows the round ends in `--color-focus`.
- The showcase gains a Corners section: cuts nested 8px and 16px inside panels, and a
  primary button, a secondary button and a pill to tab through.


## 2026-11-12 — Waiting box, status word and drawn tick

- New `Regent.Primitives.waiting`: a dashed box at the exact size of what it waits for
  (the page passes the same size class), with "Loading" for screen readers only; once
  `:slow`, "Still working" and the page's retry button; on `:error`, "Couldn't be read"
  and the retry; `:ready` shows the content in the same box, fading in over 200ms
  (November bonus pack, step 4). The package had no shimmer skeleton to replace.
- New `Regent.Primitives.status_word`: the old word rises 4px out in 140ms, the new
  one rises 4px in over 200ms, and the line keeps its widest word's width.
- New `Regent.Primitives.tick`: a dashed ring that draws its tick in over 280ms once
  done. The pairing's last step uses it in place of its own tick, whose styles and
  `data-paired` mark are gone.
- New token `--ease-in` (`cubic-bezier(0.11, 0, 0.5, 0)`) for things leaving; the JSON
  mirror is regenerated.
- All three move in CSS alone, so the template's motion kit needs nothing for them;
  reduced motion shows each at once. The showcase gains a Waiting section.


## 2026-11-12 — Segmented control and link tabs

- New `Regent.Primitives.segmented`: two to five views of the same thing as radio
  buttons in one frame cut at two corners, equal cells split by hairlines, and one
  filled indicator on the chosen cell that slides there in 200ms on a press and jumps
  for a key press or under reduced motion. The frame and the indicator are a clipped
  skin; the words and the cut focus ring round the whole control are not. A choice
  never changes its height (November bonus pack, step 5).
- New `regent_ui/assets/js/segmented.mjs`, copied by `mix regent_ui.assets`: Home and
  End choose the first and last option.
- New `Regent.Primitives.tabs`: links between sibling sections, at most five, the page
  showing marked `aria-current="page"` with a 2px bar on a hairline baseline; a row too
  wide scrolls inside itself and fades 16px at the edge that hides more.
- `Regent.Discussion.replies` draws its filters with the new tabs; its own filter
  styles, with their inset shadow and fixed Tangerine bar, are gone.
- New tokens `--color-chosen` and `--color-fg-on-chosen`: the site's action pair, ink
  on the page for Regents and the band green for Techtree light; the JSON mirror is
  regenerated.
- The motion kit's marks are `data-travel`, `data-travel-indicator`, `data-travel="kit"`,
  `--rg-travel-start` and `--rg-travel-end` (segmented) and `--rg-travel-x` and
  `--rg-travel-scale` (tabs); `CONSUMERS.md` says how it uses them. The showcase gains a
  Choices section.

## 2026-11-12 — Breadcrumb

- New `Regent.Primitives.breadcrumb`: joined chips cut at two corners, each a Lucide
  icon and a name, the page showing last and marked `aria-current="page"`. A long path
  keeps the top level, the parent and the page showing and puts the levels between in
  a "…" menu; below 40rem the levels above show their icon and first two letters, and
  below 24rem only the parent and the page showing remain. The row never wraps and
  keeps its height (November bonus pack, step 8).
- A level with `siblings` gets a chevron that opens the pages beside it; the page
  showing with `card` opens a card of its facts.
- New token `--rg-cut-chip` (8px); the JSON mirror is regenerated.
- The motion kit's marks are `data-crumbs`, `data-crumb` and `data-place`;
  `CONSUMERS.md` says how it uses them. The showcase gains a Breadcrumb section.
- Forced colours: the chosen cell of a segmented control drops the text backplate that
  hid its word.

## 2026-11-12 — The package passes its own style check

- The 24 breaks `scripts/style-check.sh` found in the package's own styles are gone,
  and `mix check` now runs the check, so a new break fails it. README says so.
- Inset lines drawn with `box-shadow` are now real lines, looking the same and showing
  in forced colours, where shadows are dropped: Points chips, done points, the "You"
  tag, bonus tiers and activity status take a 1px outline drawn inside; the forced-colour
  "You" row and held tier a 2px Highlight outline; the marked discussion answer a 3px
  start border (its padding is 3px less, so the words stay put); the checked agent in
  pairing a 1px outline; and the late and stopped check-in lights a 1.5px border.
  Chrome draws that border at 1px, a hair thinner than the shadow was.
- Theme switch: its beam loses the soft glow and its prism box the .25rem rounding; it
  is now flat and square. A small deliberate change in look; the beams keep their
  Tangerine and Powder Blue.
- Stacking numbers inside the panel's edge and fill, the button's paint, the window's
  frame, the technical figure's dots and the foil card sit nested inside the root rule
  that sets `isolation: isolate`, so they cannot reach the page's layers; nothing moves.
  The foil card's stage and its still face no longer state numbers they did not need.
- The showcase gains a Cards section: the foil card, a foil feature card, a tip opening
  over a panel inside a panel, and a marked answer and a house reply.

## 2026-11-12 — Agent at work

- New `Regent.Agents.activity`: an agent's steps, the latest six on a hairline rail and
  older ones folded under "Earlier", each a mark, a verb, what it touched and its time.
  Each state has its own shape, so none rests on colour: a dashed square next, a filled
  square running, a half-filled square waiting for the person (with the page's button),
  a tick done, an empty square stopped. `variant="line"` shows the latest started step on
  one line. Loading, unread and empty steps have their own states (November bonus pack,
  step 10).
- New `Regent.Agents.fleet`: a grid of tiles, each an agent's picture, name and latest
  step; a tile with a page is one link named by the agent.
- The only motion is a short dash travelling down the rail under a running step; it
  stops when the step ends and never shows under reduced motion or forced colours.
  Marks follow the steps the page passes; nothing runs on a timer. It reuses
  `status_word`, `tick` and `figure`, and `waiting` while the steps load.
- New stylesheet `agents.css`, imported by `structure.css`. No new tokens and no new
  colours: only the foreground, muted, success, warning and error colours.
- The motion kit's marks are `data-activity`, `data-step` and `data-state`;
  `CONSUMERS.md` says how. The showcase gains an Activity section.
- `Regent.Account.agents_brief` still shows its own line; moving it to the line form is
  left for its own change.

## 2026-11-12 — Fields keep their error line and show every state

- `Regent.Primitives.field` always renders its error line (`#<id>-errors`, now a `div`
  of `p`s, `aria-live="polite"`), empty until the field has an error; it keeps one
  label line of space, so an error showing up on blur never moves the fields below it.
  `aria-describedby` names it only while it holds an error, as before.
- `primitives.css`: a field to fix doubles its edge in the error colour (an inset line,
  so its size holds) instead of a thicker edge in the text colour; errors drop their
  bullet and use the label size. A disabled field rests on the inert gray of a disabled
  action, and the fields of a LiveView form on its way (`phx-submit-loading`) dim their
  words while its submit button shows its `phx-disable-with` words.
- `STYLE.md` gains a Fields section saying so, with the rule to check a field when the
  person leaves it and to word errors as what to do.

## 2026-11-12 — The account card takes the page's spacing

- `.rg-account-identity` loses its own 24px block padding. It sat 64px under the page
  title where every other first section sits 40px under it, and 72px above the next
  panel where sections stand 48px apart. The page's section gap now places it.

## 2026-11-12 — The profile form drops its helper line

- `Regent.Profile.panel` no longer says "The name people see for you." under Public
  Display Name: the label already names it. The tip with the details (the same name on
  every Regent site, up to 80 characters) moves beside the Profile heading, as a page
  title carries its own, so the field has no hint line.

## 2026-11-12 — A field to fix doubles its edge with an outline

- `.rg-field [aria-invalid="true"]` drew its second edge with an inset `box-shadow`, which
  the style check (now part of `mix check`) refuses and forced colours drops. It is a 1px
  outline just inside the border: the same look, nothing moves, and keyboard focus still
  shows its own ring.

## 2026-11-12 — The pairing window's picture is a low band, and its list moves by the motion kit

- `Regent.Account.pairing`: the chosen agent's picture sits in a band a quarter as tall
  as it is wide (it was 16 by 9), at 48px, its own size, so it stays sharp on a phone's
  screen too. The window is about 130px shorter at 1280 wide and 100px shorter on a
  phone (founder, 11 Nov: "the image area can be much smaller"). Choosing still changes
  no height.
- The agent list is `data-panel="list"`, and `account.css` drops its own opening
  transition: the template's motion kit moves the list in and out, so every site's list
  moves the same way and reduced motion keeps it still. `STYLE.md` says so.

## 2026-11-12 — Charts

- New `Regent.Charts.line`: a price, stake or earnings line drawn as SVG on the server
  from the page's points, with no chart library and no script (November bonus pack,
  step 9). One series in the chart colour, or two with the second muted and dashed so
  they differ by shape too; an optional flat 10% fill under a lone series; a hairline
  baseline and at most four hairline rules, labelled on the right in equal-width
  figures. Above it, the latest figure and its time beside the page's period choice.
- Every chart carries a table of its points, read by screen readers and agents in
  place of the drawing. Loading and failed reads show the waiting box at the plot's
  size, and an empty read says "No activity yet.", so the chart keeps one height.
- New token `--color-chart-line`: the site's action colour, Tangerine on Regents (its
  white and charcoal actions vanish on its pages) and `#238450` on Techtree in light.
- New stylesheet `charts.css`, imported by `structure.css`. The motion kit's marks are
  `data-chart`, `data-chart-at`, `--rg-chart-x`, `data-chart-plot`, `data-chart-point`,
  `data-chart-readout` and `data-chart-line`; `CONSUMERS.md` says how. The showcase
  gains a Charts section with a stand-in for the kit's pointer rule.
- Not built here: Liveline's per-frame smoothing, momentum arrows, order book and
  candlesticks, and flow diagrams beyond the existing technical figure.

## 2026-11-12 — One window asks before an action that can't be undone

- New `Regent.Structure.confirm` and `regent_ui/assets/js/confirm.mjs`: a press on a
  control carrying `data-confirm` asks in the shared cut-corner window instead of the
  browser's own confirm box. The window holds the control's question and two buttons:
  Cancel, which takes focus first, and the button that goes ahead, worded by the
  control's `data-confirm-action` (Delete, Unpair, Block). Cancel or Escape hands focus
  back to the control. Every press of the button that goes ahead does what the original
  press would have done, once, the moment it is pressed; nothing blocks or merges
  repeat presses. The window carries `data-opened-by` (`key` or `pointer`) for the
  motion kit. `mix regent_ui.assets` copies `confirm.mjs`.
- A primary button inside any window keeps a visible fill against the window's own
  surface (Regents' white and charcoal actions matched it).
- Shared parts carry no taglines, helper text or small labels (founder, 2 Nov): the
  ratio card loses `eyebrow`, the technical figure its `caption` slot, the blog
  gallery its `site` attribute and tagline, the utility page its `context` label, the
  account card its "Your account" label, and the blog's empty and Not found pages their
  helper lines. Discussion's Solved sentence moves into a tip beside the heading
  (`caption` attribute removed). The agent's name refusal now shows in the name field's
  error line; its "Only you see this name." line is gone and its tip stays.
  `Regent.Primitives.field` gains a `tip` slot beside the label. STYLE.md's "Few words
  on screen" gains the rule.
- Consumers: render `<Regent.Structure.confirm />` once in the root layout, import
  `confirm.mjs` from `app.ts` before the LiveSocket connects and drop `import
  "phoenix_html"` when it was there only for `data-confirm`, give every `data-confirm` a
  `data-confirm-action`, and stop passing `eyebrow`, `site`, `context`, `caption` and the
  technical figure's `<:caption>`.

## 2026-11-08 — The account menu holds the theme switch

Sean, 8 November 2026: put the light and dark switch "in the account sidepanel that
shows when clicking the account" (the account menu).

- `Regent.Account.menu` takes an optional `theme` slot, the site's light and dark
  switch, shown in its own row (`.rg-account-menu__theme`: the switch's words at the
  start, the switch at the end) between Pair New Agent and Manage Account. A menu given
  none has no row. ash-template passes its glass switch; `Regent.ThemeToggle` stays
  for the sites until each moves to that switch.

## 2026-11-12 — Points and like counts are shared figures

- `Regent.Points` (the total, each board row's points and your own row) and the like
  count on `Regent.Discussion`'s heart are now `Regent.Primitives.figure`, so they carry
  `data-count` and equal-width digits. A site that marks the part around them with its
  count motion rolls only the digits that changed; a site that does nothing sees no
  change. The template asked for this after moving its own live figures over.

## 2026-11-12 — The style check's motion rule skips test files

- `regent_ui/scripts/style-check.sh`: the motion rule (animate transform and opacity,
  never left, top, width, height or margin) no longer reads `*.test.*` files. The
  template's `parts_motion.test.ts` holds a test's expected value with a `left:` key,
  which is not motion. Nothing else in the check changes: the glass and flat-layer
  rules stay as they are.

## 2026-11-12 — The main button stands out in light

Sean, 12 November 2026: the main button read faint on a light page, because its fill
was too close to the page colour.

- Two new tokens carry a main button's fill and words: `--color-button` and
  `--color-fg-on-button`. They are the site's accent pair, except in light: Regents
  (white) fills Charcoal with Platinum words, and Techtree fills its green-black
  `#0F1B14` with lime words. Autolaunch's Tangerine and Patchbay's cobalt are
  unchanged, and so is every site in dark.
- In light Regents' fill now stands 16.4:1 against the page (it was 1.1:1) and
  Techtree's 16.1:1 (it was 1.2:1), with words at 14:1 and 13.7:1 on them. Hover,
  keyboard focus and disabled look as before.
- Techtree's light main buttons no longer rest with the whole cut outline; the dark
  fill does that job. A Techtree page that drew the outline itself can drop it.
- `--color-accent` keeps its values, so accent panels, chosen tabs, chart lines and the
  theme switch's prism look as they did. A site that recolours one button still sets
  `--rg-p-accent` and `--rg-p-on-accent` on it.

## 2026-11-12 — A second approved exception: the world cube keeps its glass and shadow

Sean, 12 November 2026: the template's world cube lab page keeps its glass panes and
their shadow, "marked in the style check the same way as the regents.sh home".

- `regent_ui/scripts/style-check.sh`: the flat rule skips a `box-shadow:` line that
  carries `style-check: allow shadow — <who and when>`, as the glass rule skips a line
  carrying `style-check: allow glass — <who and when>`. A glass marker does not excuse a
  shadow, nor a shadow marker glass.
- Both markers now need a word after the dash. The glass marker had taken any character,
  so `/* style-check: allow glass — */` passed on the comment's closing star. No site
  carries a marker yet.
- `STYLE.md`'s Glass section names the two exceptions, the regents.sh home (12 Nov) and
  the world cube lab page (12 Nov), and how to write each marker: a marker is only for
  an exception Sean has approved by name.

## 2026-11-12 — The style check never passes when it could not check

The template's release lead found that `regent_ui/scripts/style-check.sh` passed on a
machine without ripgrep, even on a site with a glass line: every search ended in
`|| true`, which also hid "command not found".

- The script first looks for ripgrep, awk and perl. When one is not installed it stops
  with exit 2 and names it on one line. Exit 1 still means breaks were found.
- A search now passes only when ripgrep finds nothing (its exit 1). Any other ripgrep
  error, such as a file it cannot read, stops the check with exit 2. An unreadable
  template had passed before.
- A root without `assets/` or `lib/` stops the check with exit 2. Before, it skipped
  that folder's rules, so a run from the wrong folder passed.
- `CONSUMERS.md`'s Style check section says so.

## 2026-11-12 — The main button stands out in dark too

Sean, 12 November 2026: strengthen the main button in dark as well, following the light
change.

- Regents' dark main button was Charcoal on a near-black page: 1.1:1 against the page
  and 1.0:1 against its surfaces. It is now the mirror of light, a Platinum `#E5E3D2`
  fill with Charcoal words: 15.2:1 against the page, 14.3:1 against the surface, and
  words at 14:1 on it. A chosen dark theme and the device's dark both change.
- Autolaunch (6.2:1), Patchbay (8.8:1) and Techtree (14.3:1) already stood out in dark
  and are unchanged. Autolaunch keeps its Tangerine.
- Powder Blue marks barely show on Platinum (1.3:1), so a new token,
  `--color-button-mark`, draws both of a main button's dark hover and focus marks in
  one colour where a theme sets it. Regents' dark theme sets Tangerine: 2.4:1 on the
  fill, 6.3:1 against the page. Its windows' marks and the theme switch's beam keep
  Powder Blue. Keyboard focus keeps its Powder Blue ring (11.4:1 against the page), and
  a disabled button stays inert grey, now 7.9:1 apart from a resting one.
- The confirm window's going-ahead button takes a tenth of Charcoal into its Platinum:
  11.7:1 against the window, words at 11.5:1 on it.
- Light is unchanged, picture for picture, and so are secondary and quiet buttons. The
  contrast test now measures dark as well as light.
- A Regents main button in dark does not show on a Platinum panel (`rg-support-panel`);
  `CONSUMERS.md` says so. A button that sets its own `--rg-p-accent` keeps it.

## 2026-11-12 — Gradients blend in oklch

Sean, 12 November 2026: "use 'in oklch' for gradients, such as background:
linear-gradient(in oklch, blue, yellow);".

- `STYLE.md` gains "Gradients" under Color: every CSS gradient, hard stops included,
  names oklch, after any direction, shape or starting angle. Panels stay flat; the rule
  allows no new gradient.
- Every gradient in `regent_ui/assets/css/` now says `in oklch`: the panel and window
  edges and cuts, the edge sweep, figure dots, button cuts, edges and focus ring, the
  select chevron, segmented rules, tab fades, ratio card marks and meter, the foil sheen,
  the activity trace and the half-lit warning boxes, and the discussion excerpt fade. The
  token sources and the showcase's own CSS have none.
- The activity trace and the figure dots fade the text colour to clear. Their clear stop
  is now that colour with no opacity, `oklch(from … l c h / 0)`: with `transparent`,
  Chromium painted Patchbay's dark trace pink and moved the dark figure dots by up to
  15/255.
- Before and after pictures of the showcase, four brands, light and dark, 390 and 1280
  wide: 80 of 160 are identical to the pixel and the other 80 differ by 1/255 on at most
  117 pixels, where edge pixels round differently.
- The style check gains a `gradient` rule: a `linear-`, `radial-` or `conic-gradient`, or
  a `repeating-` one, whose first argument does not say `in oklch`, however many lines it
  runs over. Words inside a nested function or a comment do not count. `CONSUMERS.md`
  tells sites to convert their own gradients when they take this version.
- Browsers without oklch gradients (before Chrome 111, Safari 16.2, Firefox 127) drop
  each converted declaration and draw no gradient there.

## 2026-11-12 — Cells

Sean, 12 November 2026: "whatever this style is, I want to make it part of our general
design system. using vgpu.sh".

- New `Regent.Cells.meter` (`cells.css`, imported by `structure.css`): one total split
  among a few named parts against a capacity. The total and the capacity above, a
  status line, a bar of square cells (3px with 2px between, ten rows) in which each
  part is a run as wide as its share and the rest is dim cells, and the parts as a list
  of mark, name and amount, three columns, then two, then one.
- Every edge lands on a whole cell, so the cells stay crisp and still as the page
  resizes. Parts take the chart colour and the muted foreground in turn, each run with
  a 1px edge; a part worth nothing draws no run. Parts that add up to more than the
  capacity raise.
- Pointing at a part or its row, or focusing a row with a note, lights the part, dims
  the others and puts its name, amount and note in the status line, in CSS alone.
  Screen readers read each part once, as its name and amount, then its note.
- The moving picture is a site's vgpu canvas behind the cells: `CONSUMERS.md` lists the
  marks (`data-cells-state`, `data-cells-capacity`, `data-cells-key`,
  `--rg-cells-start`, `--rg-cells-share`, `--rg-cells-color`, `data-cells-canvas` and
  `data-cells-ready`). The package draws no twinkle, bright head or sparks.
- `STYLE.md` gains "Cells", and the showcase a Cells section: Points today by source,
  counting, a token's supply with a long name and a holder at zero, a fleet's nine
  roles, a single part, and 320 wide.

## 2026-11-12 — Social posts blend in oklch

- The 20 gradients in `social-posts/src/index.css` now say `in oklch`, as `STYLE.md`
  "Gradients" asks; they were the last outside `regent_ui/`. The four posts on its two
  pages draw the same to the pixel, in the preview and the build. The two post
  backgrounds no page uses yet move by at most 4/255, most where the Greco base blends
  dark violet into dark brown.

## 2026-11-12 — The Cells canvas has room above the bar

- `[data-cells-canvas]` now reaches `--rg-cells-headroom` (48px, one bar high) above the
  bar, over the status line, so a released part's sparks rise past the bar's top edge as
  they do in the reference film, instead of being cut off there. The canvas is the
  headroom plus the bar tall; a hook reads the headroom once from the root's computed
  style and draws the cells that far down. `CONSUMERS.md` and `STYLE.md` say so.
- The stage stays out of the flow and lets presses and text selection through to the
  status line and the total. Without a hook the showcase draws the same to the pixel at
  390 and 1280, light and dark, for all four brands, and no element's box moves, with
  or without the hook's ready mark.
- The canvas's shape changes for every hook at once; the template's hook follows it.

## 2026-11-12 — Far-apart colours blend through a neutral

- `STYLE.md`, "Gradients": two colours far apart on the wheel, Tangerine and Powder
  Blue, no longer blend straight into each other, because in oklch that blend passes
  through gold and green. The brand's pale neutral sits between them; where the
  gradient lies against a surface of that colour, the muted text colour does. Sean
  chose this on 12 November 2026 after seeing the template's Enter App ring and
  Fractal still. Words only: the package draws no such gradient, and each site changes
  its own.

## 2026-11-12 — A colour per Cells part

- New tokens `--color-category-1` to `--color-category-8` in every brand and theme. The
  first is the chart colour; the other seven are clearly different hues near the
  brand's palette, close in lightness and chroma, chosen in oklch and written in hex.
  Regents and Autolaunch share one set.
- The visual contract test measures them: each after the first clears 3:1 on the page
  and on a panel, every pair is at least 15 apart in OKLab ΔE ×100, neighbours in order
  (the eighth beside the first too) at least 8 apart under simulated protanopia and
  deuteranopia, and none after the first comes within 15 of a status colour. The first
  stays the chart colour as it was, so Tangerine is still below 3:1 on the light Regents
  page (2.82:1) and on the light Autolaunch page and panel (2.40:1 and 2.82:1).
- `Regent.Cells.meter`: each part takes the category colour of its place, a ninth
  starting again at the first, and the list's mark takes the same colour. The two-colour
  alternation, the chart colour then the muted foreground, is gone. The edge, the dim
  cells and forced colours are as before, and `--rg-cells-color` still carries the
  part's colour to a site's hook.
- `STYLE.md` gains "Category colours", and "Cells" says a colour per part, with a table
  past eight. `CONSUMERS.md` says where `--rg-cells-color` comes from. The showcase's
  Points meter has eight parts beside the fleet's nine.

## 2026-11-12 — Status colour table matches the tokens

- `STYLE.md`, "Status stays independent of identity": the table listed light-theme
  values no token holds. It now shows the dark, light and Patchbay light values as
  `design_system_tokens.css` has them. Words only; no colour changed.

## 2026-11-12 — Cornflower, a drawing colour

- New swatch `--palette-cornflower`, `#4D79E4` (oklch 60% 0.169 265), the same in both
  themes, for the lines and trails in pictures, first the three large trails of
  Keyfleet's Worldline (Sean, 12 November 2026). It is never text, a button or a fill,
  and no brand's `--color-*` token points at it, so nothing on any page changes until a
  site draws with it.
- The visual contract test measures it: at least 3:1 on the dark Regents page (4.85:1),
  Charcoal (4.46:1), the light page (3.68:1) and the light panel (4.06:1); 27 from Powder
  Blue (OKLab ΔE ×100) and at least 8 under simulated protanopia and deuteranopia; at
  least 15 from every theme's status colours. Its two shades, mixed in oklab at 66% and
  40% toward Charcoal in the dark theme and toward the page in the light one, keep its
  hue within 5° and stay at least 10 apart.
- `STYLE.md` gains "Cornflower" and the palette table a fifth row; the README's table
  too.

## 2026-11-13 — The Points Bonus card says when Points has ended

- `Regent.Points.bonus` takes `state={:ended}`, for after the last season (Sean, 13 Nov:
  Points runs three 30-day seasons and stops). The line reads "Points has ended."; the
  tiers and the bonuses already added still show, and no tier is marked held, as in
  `:closed`. A site sets it from `RegentPoints.Seasons.phase/1`: `:before` is `:closed`,
  `:ended` is `:ended`.

## 2026-11-13 — A name or address sits on the text line beside it

- `.rg-address` aligns to the baseline instead of the middle, so a name or wallet address
  inside a sentence or a row of words no longer drops below them. Patchbay has run this
  as a local rule since its v381 (Sean's decision 145 a, 13 Nov: take it into the shared
  design system); a site carrying its own copy of the rule can delete it once it takes
  this version.

## 2026-11-13 — A site can move the Points total's figure alone

- `Regent.Points.total` passes its global attributes (`phx-hook`, `data-*` and the
  rest) to the element whose text is the total, which now has the id `"<id>-figure"`.
  A site that rolls the total its own way puts its hook there instead of wrapping the
  whole section, which broke the rule that makes the total span the row and could not
  reach the figure alone.
- While the total is loading or absent that element still shows "…" or "–", now with
  `data-placeholder="true"`, and is no longer drawn by `Regent.Primitives.figure`: it
  has no `data-count`, so a count's roll never starts from it. The figure primitive is
  unchanged. A site that passes nothing sees the same page, to the pixel, and no site's
  Points page runs a count roll over the total.

## 2026-11-13 — Leaderboard: the "You" tag never runs into the points

- `Regent.Points.board`: on a narrow row the name or wallet gives way first, ending in
  an ellipsis, so the "You" tag and the copy icon keep their room beside the points.
  A wallet's short form held its full width there, so at 390 px the reader's own row
  put the tag over their points (seen on Patchbay). Checked at 320, 360 and 390 px with
  a long name, a wallet, an ENS name and a seven-digit total, light and dark, mouse and
  touch: no row overlaps. At 1280 px the page is unchanged to the pixel.

## 2026-11-14 — Points total: no figure runs into another or past the card

- `Regent.Points.total`: on a wide page a total of six digits or more ran into Today
  (seen at 1280 px), and on a phone a seven-digit Today pushed Rank off the card (seen
  at 390 px). Today, yesterday and rank now move to a line under the others when the
  card has no room left; on a wide page they move together under the total when it
  leaves them no room. One-per-line on the narrowest cards, a figure too wide to sit
  beside its name goes under it.
- The total stays on one line and is never cut. Seven digits fit at full size; a longer
  total steps its size down to the card's width, and its line keeps the full size's
  height, so a total that grows a digit never moves what sits below it. The element
  holding the total gives its count of digits and separators as the custom properties
  `--rg-points-total-digits` and `--rg-points-total-marks`, from which the size is set.
- Checked with totals of 1, 3, 5, 6, 7 and 9 digits, Today and Yesterday of 1 to 7
  digits and ranks of 1 to 6 digits, loading and absent, at 320, 360, 390, 768, 1280
  and 1600 px, light and dark, mouse and touch, and a cross-section of them at every
  component width from 240 to 1600 px in 4 px steps: no figure overlaps another or
  leaves the card, and no page scrolls sideways (before, 15,388 of 50,952 checks
  failed and 16 of 24 pages scrolled sideways). The usual short figures are unchanged to the pixel at
  390 and 1280 px. Where three figures filled the line to within a fraction of a pixel
  (a three-digit Today beside a six-digit Yesterday at 360 px, a seven-digit Yesterday
  beside its name at 320 px) the last now moves to the next line.
