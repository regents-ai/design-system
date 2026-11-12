# Regent Style Guide

The canonical description of the Regent visual language. Machine sources stay canonical for
values — `design_system_tokens.css` (mirrored by `design_system_tokens.json`) — this document
explains the system so a person or agent can apply it without guessing.

The product applications share primitives and interaction conventions. Each owns its layout,
navigation, content and theme. Preserve all eight approved palettes. The structural language
is a ruled technical sheet: actual aligned rules, square cells, flat cut-corner panels,
generous internal spacing and static technical figures. It is not a dark-and-orange theme.

## Identity

Regent is systematic restraint with a printed-machine character:

- **Systematic restraint** (the Stripe/Coinbase inheritance): four colors carry every surface;
  one action color per surface; semantic color reserved for status; consistent spacing,
  radius, and type scales; nothing decorated that could be plain.
- **Printed-machine character** (the Regent layer): hairline separators, uppercase
  micro-labels, mono readouts, halftone/print artwork, a flat saturated ground. The result
  should read like precision print on stock, not like a generic SaaS theme.

### Product names

Write each product's name exactly as its brand spells it: Regents, Autolaunch,
Patchbay, Techtree and Keyfleet. Keyfleet has one capital letter, never
"KeyFleet", in page text, menus, labels, documentation and code comments alike.

## Color

### Four colors carry everything

The whole system is four colors. Black is a contrast utility for text on Tangerine, not a fifth
identity color.

| Name | Token | Value |
| --- | --- | --- |
| Tangerine Tango | `--palette-tangerine-tango` | `#FF5B19` |
| Charcoal | `--palette-charcoal` | `#161616` |
| Platinum | `--palette-platinum` | `#E5E3D2` |
| Powder Blue | `--palette-powder-blue` | `#AECACD` |

The approved September 5 palettes use distinct light and dark surfaces. Dark is the
default: until a person chooses on the site, pages are dark unless their device asks
for light (founder, 2026-09-28). A choice made on the site always wins. Regents
emphasizes charcoal and Autolaunch tangerine. Patchbay uses
the Porcelain / cobalt palette Sean selected on 15 October 2026, and Techtree the
Canopy palette (forest green with a lime action) he chose from the palette mockups in
October 2026. Values live in
`design_system_tokens.css`; the older source images remain historical references. The earlier fixed-ground palettes are retired.
Patchbay uses cool neutral surfaces and cobalt actions: light canvas `#F6F7FA`,
surface `#FFFFFF`, raised `#EAEDF4`, text `#192239`, muted `#536078`, essential
border `#7B869B`, accent `#294EC3`, accent text `#FFFFFF`, tint `#E5EBFF`.
Dark uses canvas `#111726`, surface `#1B2335`, raised `#252F45`, text `#EEF2FF`,
muted `#ABB8D1`, essential border `#6D7D99`, accent `#9BB4FF`, accent text `#142247`,
tint `#273853`. Semantic status colors retain their own meaning. Other brands and
canonical logo artwork remain unchanged.
Techtree's Canopy light uses canvas `#F3F5EF`, surface `#FAFBF7`, border `#DCE3D6`,
text `#0F1B14`, action `#C8F25C` with `#0F1B14` text (`#B4E03F` on hover), marks
`#238450`, focus `#1E6B45`, info `#2E5E45`. Dark uses canvas `#0D1611`, surface
`#142019`, border `#2A3B30`, text `#E4EEE6`, the same lime action with `#0D1611` text,
marks `#238450`, focus and links `#C8F25C`, info `#CFE2D2`. Its status colors are the
shared ones. Other sites still show Techtree's product mark in Powder Blue
(`--product-techtree`).

Page background SVGs are retired; the package ships no background component and no
background images. The eight source assets stay in `site svg backgrounds/` for potential
future small illustration sections; do not use them as page backgrounds. Real layout
borders supply the page structure.
Consumer-owned artwork and route wiring need deliberate migration in the owning app;
changing this package does not claim those applications have been deployed or migrated.

### Readable pairs only

Platinum and Powder Blue are never text colors on Tangerine (2.4:1 and 1.8:1). Black or Charcoal
supplies readable text there. The pairs the system guarantees:

- Platinum on Charcoal — 14.0:1
- Black on Tangerine — 6.8:1
- Charcoal on Powder Blue — 10.5:1

Platinum and Powder Blue may be highlighted *surfaces* on a Tangerine page as long as the text
inside them is black or Charcoal.

Separators are hairlines mixed from the foreground, not solid borders:
`--hairline` (14% fg) for structure, `--hairline-strong` (26% fg) for interactive edges.

### Status stays independent of identity

Status colors report state, never identity, so each set is chosen for readability on its product's
ground rather than for brand voice.

| Status | Regent / Platform | Autolaunch and Techtree |
| --- | --- | --- |
| Success | `#7ED8A9` | `#053022` |
| Error | `#FF9B8F` | `#5A0B0B` |
| Warning | `#F5C16C` | `#3D1B00` |
| Info | `#AECACD` | `#072C38` |

Every one of these clears WCAG AA for normal text on its product's background, surface, and
elevated surface.

### Product identities

The brand attribute (`data-brand`) selects a product's whole contract. The identity constants are
also available everywhere as `--product-*` tokens for highlights that must not move the page
action color.

| Product | Identity | Token |
| --- | --- | --- |
| Regents Labs / Platform | Charcoal ground; Charcoal main button with Platinum words in light, Platinum with Charcoal words in dark; white accent with Charcoal text in light | — |
| Agent Formation | Tangerine Tango | `--product-formation` |
| Autolaunch | Tangerine Tango | `--product-autolaunch` |
| Techtree | Canopy on its own site; Powder Blue where other sites name it | `--product-techtree` |

Rules:

- One action color per surface. `--color-accent-secondary` carries the product's highlight;
  it is a note, not a second button color. `--brand-accent` is Tangerine in every theme,
  except on Patchbay (cobalt) and Techtree (lime).
- On Autolaunch, `--color-accent-secondary` is Powder Blue and is for non-text highlights only —
  chips, rules, fills, and marker shapes. Never set it as text color on Tangerine (1.8:1), and
  keep the text inside any highlighted element black or Charcoal.
- Formation renders inside the platform brand; use `--product-formation` for
  Formation-specific highlights rather than switching the page action color.
- Status colors (success, error, warning, info) are for state only, never identity.

### Supporting palette compartments

The reusable `--support-{figure,band,panel}-{surface,ink}` pairs use the other three
identity constants in both modes, without changing base/semantic values:

| Brand (primary identity) | Figure | Narrow band | Secondary panel |
| --- | --- | --- | --- |
| Regents (Charcoal) | Powder Blue | Tangerine | Platinum |
| Autolaunch (Tangerine) | Powder Blue | Charcoal | Platinum |
| Patchbay (Platinum) | Powder Blue | Tangerine | Charcoal |
| Techtree (Canopy) | Pale green / deep green | Forest green / lime | Green-black |

Charcoal surfaces use Platinum ink; the other surfaces use Charcoal ink. Techtree's
compartments change with the theme (light, then dark): figure `#E6EBDF` / `#1A2820`,
band `#1E6B45` with `#F3F5EF` ink / `#C8F25C` with `#0D1611` ink, panel `#0F1B14` /
`#142019` with pale green ink. Opt into
`rg-support-figure` on technical figures, `rg-support-band` on narrow section bars,
and `rg-support-panel` on secondary panels. Keep main surfaces/actions dominant;
do not assign arbitrary colors per card. The showcase demonstrates these as the overview
figure compartment, Capabilities band and secondary interface panel respectively.

### Capability honesty

Status chips (`live`, `beta`, `preview`, `planned`) appear wherever a product is being
presented, styled as bordered uppercase micro-labels, never hidden for marketing effect.

### Gradients

Every CSS gradient names its colour space, and the space is oklch:
`linear-gradient(in oklch, blue, yellow)` (Sean, 12 November 2026). That covers
`linear-`, `radial-` and `conic-gradient` and their `repeating-` forms, hard stops
included: the rules, cuts, dots and edges the package draws with gradients say it too.
A direction, shape or starting angle comes first and the space follows it:
`linear-gradient(to right in oklch, …)`, `radial-gradient(circle at center in oklch, …)`,
`conic-gradient(from 0deg in oklch, …)`.

The rule says how a gradient blends, not where one may appear. Panels stay flat, and
this rule allows no new gradient.

`transparent` is black with no hue, and Chromium blending in oklch can repaint a
near-white colour beside it in another hue: Patchbay's dark text colour turned pink at a
hard edge. Where a gradient fades or cuts the text colour or `currentColor` to clear,
the clear stop is that colour with no opacity: `oklch(from var(--color-fg) l c h / 0)`.
The package's other clear stops measured the same as before and keep `transparent`.

The style check's `gradient` rule reports a gradient whose first argument does not say
`in oklch`.

## Typography

One face, Vercel's Geist Serif, sets every title, heading, body line, label, control,
address and figure. Geist Mono stays only for code: `code`, `kbd`, `pre` and `samp`,
including the pairing message. Both are packaged with the shared UI library, served from
the consuming application's own origin, and licensed under the SIL Open Font License 1.1;
the license ships beside the files.

| Face | Canonical `font-family` name | Token | Use |
| --- | --- | --- | --- |
| Geist Serif | `"Geist Serif"` | `--font-family-serif`, through `--font-family-title`, `--font-family-ui` and `--font-family-paragraph` | Everything that is not code |
| Geist Mono | `"Geist Mono"` | `--font-family-mono` | Code blocks, code spans and command lines only |

The three role tokens stay separate so a role can be retuned in one place; today each
resolves to `--font-family-serif`. Addresses and hashes use `--font-family-ui` with
`font-variant-numeric: tabular-nums`.

Every figure that can change while someone watches (a balance, a count, a price, a
timer, a percentage) and every column of numbers carries `rg-figure`, the one place
its digits are made equal width; no rule sets `tabular-nums` on an element of its own.
Geist Serif carries the `tnum` feature this uses. A column of figures in a table lines up on
the right, with the same number of decimals down the column. A live figure is
`Regent.Primitives.figure`: it keeps `width` characters, the widest value it can take
(5 for `10.00`), so the words beside it and the line below never move when it changes,
and it carries `data-count`, so the motion kit's `MotionCount` rolls the digits that
changed and reduced motion leaves it still.

Vercel ships Geist Serif in **regular upright 400 only**. The root sets
`font-synthesis-weight: none`, so `strong`, `b` and headings render at 400 rather than as a
browser-thickened face. No rule sets a weight above 400: hierarchy comes from size, colour
and space, and a name or amount beside quieter words takes `--color-fg` against their
`--color-fg-muted`.
Italic is allowed to slant. Headings keep `font-synthesis: none`.

Font URL contract: the canonical CSS declares each face as
`url("/fonts/regent-ui/<file>")`, where the files are `GeistSerif-Regular.woff2` and
`GeistMono-Regular.woff2` plus `OFL.txt`. They live in `regent_ui/priv/static/fonts/`,
generated from `geist-font/` by `scripts/generate-tokens-json.mjs`, and
`mix regent_ui.assets` copies them into the application's `priv/static/fonts/regent-ui/`.
The application serves `fonts` as a static path; no cross-origin font host is involved.
Text in a script Geist Serif does not cover (it is Latin only) falls to the device's serif.

Math rendered by KaTeX keeps its own scoped KaTeX fonts, and Markdown output keeps its
structure: prose paragraphs take the paragraph role, and code spans and blocks take mono.

Patterns that generalize:

- Uppercase micro-labels at 0.6–0.7rem with 0.14–0.22em tracking (`--tracking-microlabel`)
  for kickers, figure labels ("FIG.1 — Identity"), column headings, and chips.
- Mono for anything an operator might copy: commands, slugs, versions, addresses.
- `rg-figure` on counters, money figures and columns of numbers.
- Type scale tokens (`--type-*`) govern app surfaces; marketing heroes may clamp beyond the
  scale but stay on the assigned title/body/technical roles.

## Shape and spacing

- Spacing stays eight-pixel: `--space-0` is 0; `--space-1` through `--space-8` are
  8–64px. `--container-padding` and `--rg-panel-padding` default to 32px. Ruled-sheet
  panel padding becomes 24px below 1200px and 16px below 384px.
- The former universal 24px radius is replaced, not layered over. `--radius: 0px`
  keeps frames, navigation, fields, statuses, tables, secondary controls and disclosures square.
- Major panels use four fixed 45-degree cuts: `--rg-cut-panel` is 16px desktop,
  12px below 768px. Primary buttons cut top-left and bottom-right, 12px desktop and
  8px below 768px, filled with `--color-button` and lettered in `--color-fg-on-button`.
  That pair is the site's accent pair, except where the accent is too close to the page
  for the main action: Regents' white in light becomes a Charcoal fill with Platinum
  words and its charcoal in dark a Platinum fill with Charcoal words, and Techtree's
  lime in light moves into the words on its green-black `#0F1B14`. Every fill but
  Autolaunch's Tangerine, its brand fill, stands at least 3:1 against the page and its
  surfaces in both themes, and every primary's words stand at least 4.5:1 on its fill
  (founder, 2026-11-12).
  Breadcrumb chips cut the same two corners at `--rg-cut-chip` (8px) on every screen.
  A primary rests as its plain fill. Hover and keyboard focus bring in its marks in
  150ms, and hover never takes them away (founder, 2026-10-19): dark primaries show
  Powder Blue marks at the square corners and Tangerine accents along the cuts; light
  primaries show two opposite Tangerine L-edges.
  A brand may set `--rg-button-mark-color` for both dark marks and
  `--rg-button-border-color` for the light edges, on its buttons and windows alike;
  Techtree sets both to `#238450`. The theme switch's beam follows
  `--rg-theme-laser-light` and `--rg-theme-laser-dark` the same way: a brand that sets
  its own button marks sets the beam to match, as Techtree does, and every other brand
  keeps the shared beam, Tangerine in light and Powder Blue in dark.
  Powder Blue does not show on Regents' dark Platinum fill, so its dark theme sets
  `--color-button-mark` and its main buttons draw both dark marks in Tangerine. That
  token reaches the main button alone: Regents' windows and beam keep Powder Blue.
  Two buttons side by side in a header never look the same: one is primary, the other
  secondary (founder, 2026-10-19).
  An Approve button and the button it unlocks (Buy, Stake) are the same size. Once the
  approval's transaction succeeds, Approve turns grey with a green border; it stays
  enabled, unlike the inert gray of a disabled action (founder, 2026-10-19).
  Every button is about 40px tall, 8px by 16px inside, with its label on one line; a
  `.rg-button__label` too long for its row ends in an ellipsis rather than wrapping.
  Secondary actions are a bordered square surface.
  Quiet actions remain text. Copy controls and tabs do not acquire CTA chevrons, nor
  does a button that shows something rather than going on, such as the header's
  account name (`arrow={false}`). Signed in, it wears the same cut corners and marks
  as Sign in (founder, 2026-10-20).
  A button that opens another site in a new tab (`target="_blank"`) shows a
  diagonal arrow up and to the right in place of its chevron, nudged the same way on
  hover; nothing else is added to its label.
  Disabled actions use inert gray. External keyboard focus rings remain visible.
- A cut inside a cut keeps its diagonal parallel: inner cut = outer cut − 0.59 × gap
  (`--rg-cut-nest`, 2 − √2), floored at 0. A child 8px from a panel's cut corner takes
  `--rg-cut-nested-8` (12px, which lines up with a primary button), 16px takes
  `--rg-cut-nested-16` (8px); on a phone they are 8px and square. Only a child that
  touches a cut corner is cut; one away from the corner stays square.
- A pill takes its radius from its height: `--pill-h` on the pill and
  `border-radius: calc(var(--pill-h) / 2)`, never `999px`.
- Every focus ring is `--rg-ring-width` (2px) of `--color-focus`, `--rg-ring-offset`
  (2px) outside the shape, and follows it: square for square, round for a pill, cut for
  a cut button, its cut the button's plus 0.59 × its reach. A ring adds to the shape and
  never cuts into it.
- Clip visual pseudo-elements only. Panel and button hosts have no clipping or hidden
  overflow, so menus, focus rings and expanded validation remain visible. Two inset
  skins supply the diagonal perimeter. Never fake a diagonal stroke with a clipped CSS border.
- Panels are flat and opaque. No default glass, gradient, shadow, glow, hover lift or tilt.
  Pair `--rg-panel-fill` and `--rg-panel-ink`; the `accent` variant consumes the existing
  accent/on-accent pair. Local rules and texture use local ink.
  The one exception is `Regent.HolographicCard.card` (founder, 2026-09-19): a graphite foil
  card whose foil lights up under the pointer, and only then, and only on a thick frame
  round its edge; inside the frame the face stays still graphite, and the card itself never
  moves (founder, 2026-10-19). It keeps its own graphite ground and platinum ink in both themes,
  cuts its corners like every panel, and shows its still foil under reduced motion and
  forced colors.
- Real circles remain valid for geometric avatars, indicators and spinners.
- Connected features have 1px seams and separate heading, near-square figure and caption
  bands. CSS subgrid aligns bands across a row; captions grow with content. The cuts themselves
  form the diamond-shaped gaps. Do not add decorative diamonds at panel joints.
  Hover and focus-within add a faint edge and run a single ripple along the panel edge
  (see Motion); the media stays still. Only an inert visual skin clips; text, media and
  focus stay unclipped. No lift, idle animation or moving reduced-motion state.
- Active navigation has a visible structural indicator and text emphasis, not a pill or
  color alone. A chosen cell or tab takes `--color-chosen` with `--color-fg-on-chosen`:
  the site's action pair, except Regents (ink on the page) and Techtree light (its band
  green), whose action pair is too close to the page to mark a choice. Essential field/control boundaries are stronger than decorative hairlines.

### Dialogs

No modal or window ships as a default square box (founder, 2026-10-19). Every one uses
the shared cut-corner shell: like a primary button, two opposite corners are cut with
their accents and the other two are square with decorated corner marks, at panel size.
The shell is one shared component, `Regent.Structure.dialog`; a site never draws its
own. Dark windows mark their square corners in Powder Blue, light ones in Tangerine; the
cuts carry Tangerine in both.

The page behind an open window dims toward charcoal in both themes, never toward the
text color, so dark mode never turns it grey. A window's opening and closing motion
belongs to the template's motion script, not this library: a press by pointer springs the
window up, a key press opens it at once, and reduced motion keeps it still. Sites copy
that script from the template.

A question before an action that can't be undone, such as deleting a note, is asked in
one shared window, `Regent.Structure.confirm`, never the browser's own confirm box. A
site renders it once in its root layout and imports `confirm.mjs`. A control asks by
carrying `data-confirm`, its question, and `data-confirm-action`, the one or two words on
the button that goes ahead (Delete, Unpair, Block). The window holds the question and two
buttons, nothing else. Cancel takes focus first; Cancel or Escape hands focus back to the
control. Every press of the button that goes ahead does what the original press would
have done, once, and nothing blocks or merges repeat presses. That button keeps its fill
against the window's own surface. It rises like every other window, and opens at once
after a key press.

### Addresses and transaction hashes

A contract address or transaction hash always shows its short form, then a copy icon and
a diagonal arrow up and to the right that opens it on Basescan in a new tab, the three
tight together, with the shared hover and press motion (founder, 2026-10-19). One shared
component, `Regent.Primitives.address` (`kind="tx"` for a hash), draws it everywhere;
a page never places the icons by hand. Something on Ethereum takes `chain="ethereum"`,
and its arrow opens Etherscan instead; on Robinhood, `chain="robinhood"` opens Blockscout.
On a test network with no explorer, such as a local chain, `chain="test"` leaves the arrow
out. A long hex ID that is not an address, such as a Uniswap v4 pool ID, takes
`kind="id"`: its short form and a copy icon for the whole ID, and no arrow. On hover the copy icon grows a little and the
arrow leans up and right; a press gives both a little.

An address keeps its own letters: a site's uppercase, small-caps or spaced-out style
around it never reaches them, and it reads left to right on every page. Where a person must check every character, such as an address
they typed for someone else, `variant="full"` shows the whole `0x` address, wrapping,
with both icons after it, kept together so a line never breaks between them. Beside a small control in a narrow row, such as "Change" on a
phone, `variant="compact"` holds the short form's twelve characters and the copy icon,
without the arrow; a longer name ends in an ellipsis there.

### Icons

Every icon on a button, link or label is Lucide, drawn with `Regent.Icons.icon`
(founder, 2026-11-05). A site never draws its own, whether as an `<svg>` in a page, a
mask in a stylesheet or a copied path, so neighbours always share one weight, height
and baseline.

- `name` is Lucide's own name, from the whole set in `regent_ui/icons/lucide`. Any name
  there works with no change to the library, and a name that is not there fails the build.
- The line weight is the library's 1.8 on Lucide's 24 grid, with round ends. A page never
  sets its own weight or fills an outline to make it stand out; a filled heart that shows
  it is pressed is the one state that fills.
- The icon is one line of text tall and sits centred on the capitals beside it. Size it
  with `font-size` or a class on the icon; never nudge it with margins or `translate`.
- Icons are for looking at. The button or link around one carries the words, as its text
  or its `aria-label`.
- Logos stay logos: a company's mark (X, GitHub), the Regent crown and the agent pictures
  are artwork, not icons. Lucide does not carry them.
- Before shipping a button with an icon, look at it zoomed in 3 to 6 times beside its
  neighbours and compare weight, height and baseline. A width check does not see this.

### Shared compositions

This table is the complete public component catalog of `regent_ui/lib`. "Used by" is
checked against each consumer's own source; "(showcase)" means only that app's component
showcase page renders it. Consumers are Regents, Autolaunch, Patchbay, Techtree,
Ash Template and Keyfleet (each `platform/`).

| Component | Purpose | Used by |
| --- | --- | --- |
| `Regent.Primitives.button` | Primary, secondary or quiet action | All six apps |
| `Regent.Primitives.copy_button` | Copies a value, an element's text or a page fetched when pressed, and says "Copied" (or "Selected", or "Couldn't copy") on the button and to screen readers | Ash Template, Patchbay |
| `Regent.Icons.icon` | Any Lucide icon, by name, at the library's weight and centred on the words beside it | Ash Template |
| `Regent.Primitives.copy_icon` | The same copy as an icon alone, for the corner of the box it copies from; a tick once copied | Ash Template |
| `Regent.Primitives.figure` | A figure that changes while someone watches, with equal-width digits, the width of its widest value kept and `data-count` for the motion kit's roll | Awaiting consumer adoption |
| `Regent.Primitives.waiting` | A dashed box at the exact size of what it waits for, which then shows it: "Still working" and the page's retry once slow, "Couldn't be read" and the retry on a failure. No grey bars, shimmer or pulse | Awaiting consumer adoption |
| `Regent.Primitives.status_word` | A status word that changes while someone watches ("Waiting" to "Done"), keeping the width of its widest word | Awaiting consumer adoption |
| `Regent.Primitives.tick` | A step's mark: a dashed ring while it waits, a tick that draws in once it is done | Ash Template, through `Regent.Account.pairing` |
| `Regent.Primitives.segmented` | Two to five views of the same thing (1D / 1W / 1M, Mine / All): a cut frame of equal cells whose filled indicator slides to the chosen one; arrow keys, Home and End choose, and a choice never changes the height | Awaiting consumer adoption |
| `Regent.Primitives.tabs` | Links between sibling sections of one page, each its own address, at most five; the page showing has a bar on the baseline that slides to the next | Patchbay; Ash Template (showcase); both through `Regent.Discussion.replies` |
| `Regent.Primitives.breadcrumb` | Where a deep page sits and the way back up: joined chips cut at two corners, each an icon and a name, the page showing last; a long path folds the levels between into a "…" menu, a narrow row shows each level above as its icon and first two letters, a level's chevron opens the pages beside it and the page showing opens a card of its facts | Awaiting consumer adoption |
| `Regent.Primitives.last_read` | When figures read from the chain were last read ("Updated 23 Oct, 14:05 UTC") and an icon that asks for them to be read again; the icon turns while its press is on its way | Ash Template |
| `Regent.Primitives.address` | Every ENS name, address and short address a page shows: the words, which open the full address on a click, tap or Enter, a copy icon for the full address and a diagonal arrow that opens it on Basescan (Etherscan with `chain="ethereum"`, Blockscout with `chain="robinhood"`, none with `chain="test"`; any other value raises), each a 44 px target on a touch screen (founder, 2026-10-19). With no `label` it shows the short form `0x1234..abcd`; `variant="full"` shows every character and `variant="compact"` drops the arrow beside a small control; `kind="id"` copies a long ID, such as a pool ID, with no arrow | Ash Template |
| `Regent.Primitives.field` | Label, optional tip, live limit and errors around an app-owned input | Regents, Autolaunch, Patchbay; Ash Template and Keyfleet (showcase) |
| `Regent.Primitives.status` | Bordered state chip | Autolaunch, Techtree; Regents, Ash Template and Keyfleet (showcase) |
| `Regent.Primitives.notice` | Info, success, warning or error message | Regents, Autolaunch, Patchbay, Ash Template, Keyfleet |
| `Regent.Primitives.empty_state` | Titled empty result with an optional action | Patchbay; Regents, Ash Template and Keyfleet (showcase) |
| `Regent.Primitives.disclosure` | Native details/summary with an optional index | Regents, Autolaunch, Patchbay, Techtree; Ash Template and Keyfleet (showcase) |
| `Regent.Structure.frame` | Ruled page frame | All six apps |
| `Regent.Structure.row` | Row with the optional rail and main column | All six apps |
| `Regent.Structure.section_bar` | Section heading bar with diamond and leader | Regents, Autolaunch, Techtree; Ash Template and Keyfleet (showcase) |
| `Regent.Structure.panel` | Flat cut-corner panel, `surface` or `accent` | Regents, Autolaunch, Patchbay, Techtree; Ash Template and Keyfleet (showcase) |
| `Regent.Structure.technical_figure` | Figure compartment for static art | Regents, Techtree; Ash Template and Keyfleet (showcase) |
| `Regent.Structure.capability_card` | Feature card with heading, figure and caption bands | Regents, Autolaunch, Ash Template, Keyfleet |
| `Regent.Structure.ratio_card` | Read-only basis-point allocation sheet | Regents |
| `Regent.Structure.confirm` | The one window that asks before an action that can't be undone, worded by the control's `data-confirm` and `data-confirm-action` (with `confirm.mjs`) | Ash Template (showcase) |
| `Regent.Blog.gallery` | Blog index | Regents, Autolaunch, Patchbay, Techtree |
| `Regent.Blog.article` | Blog post with sticky contents | Regents, Autolaunch, Patchbay, Techtree |
| `Regent.Blog.contents` | Table of contents inside `article` | Rendered by `Regent.Blog.article` |
| `Regent.Blog.not_found` | Missing-post page | Regents, Autolaunch, Patchbay, Techtree |
| `Regent.Discussion.thread` | Forum thread: title, Solved mark, counts and the Compact replies switch | Ash Template (showcase), Patchbay |
| `Regent.Discussion.post` | Opening post or reply with picture, name, time, words and actions; with `author_address`, a wallet author's ENS name or short address is drawn with `Regent.Primitives.address` and the picture links their page | Ash Template (showcase) |
| `Regent.Discussion.solved` | Solved box quoting the marked answer under the opening post; `author_address` draws a wallet author the same way | Ash Template (showcase) |
| `Regent.Discussion.replies` | Replies heading, filters (as `Regent.Primitives.tabs`), list and empty line | Ash Template (showcase) |
| `Regent.Discussion.like` | Heart with its count and the first few who liked the post | Ash Template (showcase) |
| `Regent.Discussion.posts` | Posts listed outside a thread, such as one person's replies | Patchbay (tool history) |
| `Regent.Discussion.label` | Label after a name, such as Solution or Official | Ash Template (showcase) |
| `Regent.Account.signed_out` | The account page before sign-in, or after a session ends | Awaiting consumer adoption |
| `Regent.Account.identity` | The card at the top of the Account page: the person's picture, the name the site calls them and their wallet, each said once; an ENS name or short address in it opens and copies the full address | Ash Template |
| `Regent.Account.agents` | Paired agents with World ID backing, last contact and product-owned actions | Awaiting consumer adoption |
| `Regent.Account.menu` | The account menu every page opens from the account's button at the top right: picture, name and wallet, three agents, Pair New Agent, the site's theme switch, Manage Account and Sign out | Ash Template |
| `Regent.Account.layout` | The Account page's sections in the one order and layout every site shares, with the site's own parts first | Ash Template |
| `Regent.Account.agents_brief` | The person's agents in the account menu, three at most, each with where it was last active and how long ago; Manage beside the heading may lead to where agents are managed | Ash Template |
| `Regent.Account.pairing` | The pairing window's insides: an agent dropdown with names and pictures, the chosen agent's picture in a low band, then three numbered steps (copy the message, paste it, a tick once paired) | Ash Template |
| `Regent.Account.agent_detail` | One agent's own view: facts, World ID backing, what it may do, activity across the sites | Ash Template |
| `Regent.Account.agent_mark` | An agent's square picture | Ash Template |
| `Regent.Agents.activity` | An agent at work, from the steps the server sends: the latest six on a hairline rail with older ones folded under "Earlier", each a mark whose shape says its state (dashed square next, filled square running, half-filled square waiting for the person with the page's button, a tick done, an empty square stopped), a verb, what it touched and its time; `variant="line"` shows the latest started step on one line for menus and lists | Awaiting consumer adoption |
| `Regent.Agents.fleet` | Many agents at once: a grid of tiles, each the agent's picture, name and latest step on one line; a tile with a page is a link named by the agent | Awaiting consumer adoption |
| `Regent.Charts.line` | A price, stake or earnings line over time, drawn from the page's points: one series in the chart colour, or two with the second muted and dashed, on a hairline baseline and at most four hairline rules labelled on the right; the latest figure and its time above, beside the page's period choice; a table of every point for screen readers and agents; the waiting box while it loads and "No activity yet." for an empty read, at one height | Awaiting consumer adoption |
| `Regent.Cells.meter` | One total split among a few named parts against a capacity: the total and the capacity above, a status line, a bar of square cells with a run per part as wide as its share and dim cells for the rest, and the parts listed with a mark, name and amount; pointing at a part lights it and puts its note in the status line | Awaiting consumer adoption |
| `Regent.Points.layout`, `total`, `todo`, `board`, `bonus`, `activity` | The Points page: the total on the band colour with today, yesterday and rank; the actions left; the leaderboard; the NFT bonus; the activity | Ash Template |
| `Regent.Account.history` | Read-only formatted Points activity; a row may carry one link, such as a payment's "View" | Awaiting consumer adoption |
| `Regent.Profile.panel` | The Public Display Name form: the name people see for a signed-in person | Patchbay, Ash Template |
| `Regent.ThemeToggle.button` | Prism/laser light-dark control that names the theme showing | All six apps |
| `Regent.HolographicCard.card` | Pointer-lit graphite foil card | Regents, Ash Template, Keyfleet |
| `Regent.HolographicCard.foil` | The same foil as a panel face or a drawing's ink | Regents, Ash Template, Keyfleet |
| `Regent.AgentMetadata.head` | Canonical, sharing and agent-discovery head tags | Regents, Autolaunch, Patchbay, Ash Template, Keyfleet |
| `Regent.StructuredData` | A page's own schema.org facts: blog post, forum thread or question, data table | Ash Template |

The foil's WebGPU renderer is `regent_ui/assets/js/holographic_card.mjs`; `Regent.Discussion`
remembers Compact replies with `discussion.mjs`; `Regent.Blog`'s
contract and content ownership boundary is in [BLOG.md](BLOG.md); `Regent.AgentMetadata`
and `Regent.ThemeToggle` wiring is in [CONSUMERS.md](CONSUMERS.md).
`primitives.css` imports `structure.css` (including `ratio.css`); consumers still import the canonical tokens first.
`row` reserves the same optional 176px rail and 32px gutter on every row. Set `rail={false}`
on **every** row for a no-rail frame; otherwise empty rail slots preserve alignment. Rail
content lives in `:rail_content`. The maximum frame is 1600px with 32px outer margins. Below
1200px use 144px rail and 24px margins/gutters; below 1024px each rail stacks above its main
column; below 768px columns stack and margins are 16px.
Each boundary has one owner: frame edges, row bottom, rail right, main left.

Section bars contain the caller's real heading (with `rg-section-bar__label`), an 8px
decorative diamond and a CSS patterned leader. Decorations are aria-hidden; the leader
disappears on mobile before labels become too small. Bars wrap and grow.

`rg-hero-title` is the display title: Geist Serif 400, 40–72px, line-height 1.03 and
tracking -0.045em. It is an opt-in display role, not an override for dense application typography.

Disclosures remain native `details`/`summary`. Optional `index` uses a mono column;
summary rows are at least 64px, and expanded content aligns with the title and pads
24px below. Essential errors and outcomes stay outside collapsed details.

`capability_card` requires string `title` and `description`. Optional string `index`
defaults to `nil`; `tone` is `surface` (default) or `accent`; `image_src` defaults to
`nil` and `image_alt` to `""`. A supplied image takes precedence over the optional
`:media` slot (for custom SVG). Optional `:actions` holds real caller-owned links or
controls. `class` and global attributes are forwarded to the semantic `article.rg-feature`.
The face panel contains an `h3`, optional index and figure; a separate caption panel
contains the description and actions. There is no implicit click handler, added tab
stop or product state. Images/SVGs use a square, full-width contained media box;
informative images need an explicit alt, while decorative images keep the empty default.

`ratio_card` is a static bracketed metric sheet: square frame, four inert corner
L-strokes, header/footer rules, a computed percentage header badge (`No data` when
unknown), uppercase labels above baseline-aligned Geist Serif 400 percentages,
canonical Tangerine fill, vertical-striped remainder and five scale labels. The footer
label sits above the tiles and right-aligned optional badge. Its unique `id`
and `title` are required strings. Integer `value_bps` is `0..10000` or `nil` (default):
paired labels and the named `0..100` meter derive from the same basis points,
trimmed to at most two decimals. Invalid inputs raise `ArgumentError`; `nil` shows
em dashes and `No data` without a meter. Defaults are `label="Allocated"`,
`remainder_label="Remaining"`, `footer_label="Details"` and `change={nil}`. Change text is caller-defined, including period; it is not calculated.
Optional `:footer`/`:footer_badge` slots and `class`/global attributes provide content
without implicit actions. Use `rg-ratio-card__tile` for static footer tiles.
Orange notes mix 55% Tangerine with local ink on a 12% Tangerine/local-surface tint;
never use raw orange as small badge ink in light mode. Content stays unclipped,
metrics stack at a 30rem container width, and forced colors retain system borders
and a solid Highlight meter fill. No shimmer or idle animation applies.

`Regent.Account` renders the account page's shared sections. The product must authorize
and load the account before rendering it; the package has no routes, domain dependencies,
wallet operations, purchase controls or grant controls. Importing `primitives.css`
includes `account.css`.

- `signed_out` requires `id` and a `sign_in` slot holding the product's own button,
  labelled "Sign in". It is one line and the button, with no heading of its own: it sits
  under the page's title. `reason` is `:signed_out` (default) or `:expired`, which says the
  session ended. It never shows figures, so a sign-in problem never reads as zero.
- `agents` requires `id` and `agents`: `:loading`, `:unavailable`, or a list of
  `%{id, name, kind, harness, wallet, backed, last_contact_iso, last_contact, light,
  light_label}`, all required: `kind` is the harness value, which picks the agent's picture; `wallet` is
  the agent's own address, shown on the line under its whole name through
  `Regent.Primitives.address` (its short form, which opens and copies the full
  address), or "Address unavailable" when it is `nil`, never guessed from the name.
  The row's actions (See Actions, Unpair) follow the address on that same line and
  are always shown. A long name wraps rather than being cut; on a phone World ID is
  its mark alone.
  `last_contact` is already
  formatted, from when the agent paired or last checked in ("Last check-in"). `:unavailable` says the agents couldn't be read; only an empty
  list says "No agents paired yet." Optional `notice` reports the last action. Slots:
  `about` (tip text on what a paired agent may do here), `actions` (per-agent controls
  such as Unpair, given the agent; leave out when the site cannot change pairings) and
  `footer` (Pair New Agent, opening the pairing window, or a link to where agents are
  managed).
- `agents` and `agents_brief` rows always carry `light` (`"on"`, `"late"`, `"off"` or
  `nil`) and `light_label`. For a site whose agents check in: an 8 px mark before the
  row's last-contact line, a filled `--color-success` dot, a half-filled
  `--color-warning` dot or an empty `--color-error` ring, so the shape tells them apart
  without colour, with `light_label` as its hover and screen-reader words; a light
  always has its words. A site without check-ins passes `nil` for both, which draws
  nothing.
- `agents_brief` goes in the account menu. It requires `id` and `agents`: `:loading`,
  `:unavailable`, or a list of at most three `%{id, name, kind, last_action,
  last_action_iso, last_action_at, light, light_label}`, the three last_action keys
  `nil` until read; the site picks
  which three, such as the most recently active. Optional `manage_href` adds Manage
  beside the "Your agents" heading, such as to https://regents.sh/account: shown while
  the pointer is over the list or a key has moved into it, and always on a touch
  screen, keeping its space while hidden. The heading is plain text.
- `menu` is the account menu, a `popover` the header's account button names with
  `popovertarget`. It requires `id`, `name`, `manage_href` (the site's Account page),
  `pair_window` (the id of its pairing window) and the `picture`
  (40 px) and `agents` (`agents_brief`) slots; `wallet` and `ens_name` add the wallet
  line, left out when the name already is the wallet. The optional `theme` slot is
  the site's light and dark switch, a row between Pair New Agent and Manage Account
  (Sean, 8 November 2026). Manage Account patches.
  Pair New Agent is a button naming the window with `aria-controls` and carrying
  `data-pair-open`; the site's script closes the menu and opens the window over the
  page. Sign out carries `data-account-target="sign-out"`. The site closes the menu
  when a link in it is followed, since a LiveView page change leaves a popover open.
- `layout` is the Account page's body: `id`, then the `identity` and `profile`
  slots, and any number of `site` slots for this site's own parts, which come first.
  Every section runs full width, one below the other.
- `pairing` is what the pairing window holds, the same on every site (founder,
  2026-11-05): Pair New Agent, in the account menu and on the Agents page, opens one
  window (`Regent.Structure.dialog`) with it inside, and a pairing link's page shows it
  in the page. It requires `id` and `harnesses` (`%{value, label}` for every agent a
  person may choose; `value` is the harness value, which picks its picture). In order:
  the agent dropdown, a `details.rg-pill-select` with a field's square corners whose
  list (each agent's picture and name, two to a row) drops over what is below and is
  open while nothing is chosen; the chosen agent's picture, centred in a band a quarter
  as tall as it is wide; then three numbered steps: the message in a short box that scrolls, with small copy and new-code icons
  in their own column at its right and the expiry line under it; "Paste it to" the
  chosen agent; and a dashed ring that becomes a tick drawing in once the agent paired.
  The site keeps each agent's code until it expires, so choosing another agent and
  coming back shows the same message (founder, 2026-10-20). `chosen` is the chosen
  value; `message` is that agent's message once a code is made, with `expires_iso`
  and `expires` (such as "14:05 UTC"); `outcome` is `{:paired, name}` once the code is
  used or `:unavailable` when none could be made. The product's events sit on the
  form: `phx-change` (choosing) and `phx-submit` (the new-code icon) both carry
  `harness`. The redraw after a choice closes the dropdown, and `pill_select.mjs`
  hands focus back to its summary. The list is `data-panel="list"`: it moves in and
  out by the template's motion script, which a site copies, never by this library's
  styles. What a state lacks keeps its space unseen, so choosing an agent never
  changes the height, and a box still waiting is dashed.
- `agent_detail` is a `<dialog>` the product renders while one agent is open, with its
  own hook to open it and report the close. It requires `id`, `agent`
  (`%{id, name, kind, harness, wallet, listing, paired_at, last_contact,
  last_contact_at}`, all required, dates formatted; `kind` is the harness value and
  `listing` is `nil` or `%{url, number}`),
  `verified`, `may` (what a paired agent may do on this site, a line each),
  `rename_event` (the Name form under the heading saves a new name; it carries
  `agent_id` and `name`),
  `activity` (`:loading`, `:unavailable`, or a line for each site and
  day, newest first: `%{site, day_iso, day, hours}`, `hours` saying when the first
  and last request that day came) and `open_event` (carries `id`). After the facts
  it answers the two questions every Regent site asks in the same words, under
  "Allowed Agent Actions" (closing on the quoted promise that it never uses the
  person's wallet) and "Activity". The agent address carries a tip on how the agent made it with
  SIWA and how its harness keeps the key. Optional:
  `same_person_count`, `same_person` (`%{id, name}`), `notice`
  (`{:status | :alert, text}`), `name_error` (why a new name was refused, in a few
  words, such as "That name can't be used."; it shows in the name field's error line,
  so nothing below moves), `target`, an `actions` slot for the product's
  buttons beside Done, such as Unpair, and a `picture` slot, after the facts, for
  the product's control to choose or remove the picture the person gave the agent. The name's tip says where it comes
  from and who sees it: the agent chose it when it paired, and only the person and
  the agent see it.

- `Regent.Points` draws the Points page from figures the site has already formatted;
  it reads nothing and computes no limit. `layout` takes `total`, `main` and `side`
  slots: one column on a phone in the order total, to do, leaderboard, bonus,
  activity; two columns where the page gives Points 52rem or more (measured on the
  component, not the window, so a side panel never squeezes it). `total` takes
  `total`, `today`, `yesterday` and `rank` as strings or `nil`, `pending` (actions
  still being checked) and one sentence in its inner block. `todo` takes `left` and `groups`; `board` takes
  `rows`, the reader's own row below the list as `you`, and a `face` slot for the
  picture; `bonus` takes `tiers` and `periods`; `activity` takes `rows` and `more`.
- Colour on the Points page marks three things only: the total and each action's
  points (the band pair), the reader's own row, tier and count left (the figure
  pair), and a finished action (success). A leaderboard name keeps to one line and
  ends in an ellipsis. A person who chose no name shows as their wallet through
  `Regent.Primitives.address` (compact, with the copy icon), labelled with their ENS
  name when they have one: every wallet is public (Sean, 6 November 2026).
- `history` requires `id` and `title`. `rows` defaults to `[]`, with each row shaped
  `%{label: string, amount: string_or_nil, occurred_at: string, status: optional_string}`.
  Include units in `amount` and the timezone in `occurred_at`. Products supply the
  authorized order and attribution. `empty_message` defaults to `"No activity yet."`.

All three accept `state` (`:ready`, `:loading`, `:stale`, `:error`, default `:ready`)
and optional short `message`. Map an idle read to `:loading`; an empty successful read
is `:ready`. Loading/error hide supplied figures and history; stale retains them with
an explicit warning. Missing/empty amounts say `Unavailable`, never zero. Only a
successful empty history shows the empty message. Keep allowance labels stable while
loading. Products clear old-account data when ownership changes; `:stale` is only for
previously authorized data from the same account. Status text has a reserved line;
long custom messages may wrap. Semantics use named sections, definition lists and
ordered history; values wrap at narrow widths. No animation or JavaScript is required.
Package checks and synthetic rendering do not establish real consumer acceptance.

Feature groups remain small HTML compositions, not a page-builder API.
Use three/two/one feature columns and 1px gaps; an odd final card never spans a whole row.
Use approved marks or Geist Serif brand text, never borrowed wordmarks or invented metrics.

### Cells

`Regent.Cells.meter` shows one total split among a few named parts against a
capacity: a balance by asset, Points by source, a fleet's seats, a token's supply (Sean,
12 November 2026: "whatever this style is, I want to make it part of our general design
system. using vgpu.sh"). A trend over time is a chart (`Regent.Charts.line`); a single
value against its limit is a progress bar.

- **Built from square cells.** The bar is rows of 3px cells with 2px between them, as
  many whole cells as fit. Each part is a run of cells as wide as its share of the
  capacity, starting and ending on a cell edge, with a 1px edge in its colour; the rest
  of the capacity is dim cells. Corners are square; there is no shadow, blur or glow.
  A part worth nothing draws no run.
- **Chart colours, in turn.** Parts take the chart's two series colours in order: the
  chart colour, then the muted foreground, then the chart colour again. A chart takes
  at most two series; the meter keeps going in turn, and each run's edge keeps two
  neighbours of one colour apart. Status colours never carry a part.
- **One line above the bar.** It holds the page's status, such as what is left.
  Pointing at a part, in the bar or the list, or focusing its row, lights that part,
  dims the others and puts its name, amount and note in that line; the line keeps its
  height, so nothing moves. A row is a keyboard stop only when its part has a note.
- **The list.** Three columns where they fit, then two, then one; each row a Lucide
  icon or a small square of cells in the part's colour, the name, which ends in an
  ellipsis, and the amount in equal-width figures on the right. Screen readers read each
  part once, as its name and amount, then its note; the bar is hidden from them.
- **Flat without the picture.** The package draws the meter still, in CSS. The moving
  picture, the cells that twinkle, the bright head while counting and the sparks when a
  part is released, belongs to a site's vgpu canvas behind the cells, never to CSS glow.
  The canvas reaches one bar's height above the bar, so released cells rise as sparks
  over the status line; it takes up no room, so nothing moves with or without it, and
  the words under it stay selectable.
  Reduced motion keeps only the short fade of a lit part; forced colours draw the parts
  in the text colour with their edges, the rest in grey, and a lit part in the
  highlight colour.

### Mobile controls and acceptance

Read [MOBILE.md](MOBILE.md) for phone hierarchy, touch targets, input/keyboard and
safe-area guidance, GPU fallbacks and the WebKit-versus-physical-iPhone evidence boundary.
On coarse-pointer or no-hover devices, shared buttons preserve a 44 CSS px minimum
hit box in both dimensions. Text-like inputs, selects and textareas inside `rg-field`
use `max(1em, 16px)` and a 44px height floor;
larger inherited text remains larger. Never disable page zoom to compensate for a
small input. Product-owned native controls and stronger legacy overrides still
need deliberate adoption; this is not a universal form reset.

Filter and toolbar dropdowns use `rg-pill-select`: a label (or a `details` whose summary
opens a menu) wrapping the control. It is fully rounded with a 1px border, its text inset
18px and a drawn arrow 16px in from the right, in the text's colour in both themes. A
dropdown inside a form stays an `rg-field` select, so its corners match the inputs beside it.
An open `details` pill a person can see closes on Escape, handing focus back to its summary, and on a press
outside it in its own layer (its window, or else the page), through `pill_select.mjs` (copied by `mix regent_ui.assets`, imported once).

## Layers

Six layers name what sits on what: Ground, Sheet, Card, Panel, Window and Tip. Ground
is the page; a sheet is the one surface you work on (`Regent.Structure.panel`); cards
sit on a sheet; a panel slides in from the edge it stays against (the phone
menu); a window opens in the middle over a shade (`Regent.Structure.dialog`); a
tip or menu is the highest and the shortest-lived. The higher a thing sits, the shorter
it stays.

Height shows three ways at once: a firmer edge, a lighter fill and how it arrives.
Never in a soft shadow.

| Layer | Edge | Fill | Arrives |
| --- | --- | --- | --- |
| Ground | None | The page | Still |
| Sheet | Light, four cut corners | Surface | Still |
| Card | A rule between rows | Surface | Settles in |
| Panel | Firm, on its open side | The page | Slides from its edge |
| Window | Firmer, two cut corners | Surface, over a shade | Rises |
| Tip | Firm | Raised | Drops in |

- Each layer that floats has one stacking place, and nothing states a number of its
  own: `--rg-layer-card` 1, `--rg-layer-shade` 10, `--rg-layer-panel` 20,
  `--rg-layer-header` 30, `--rg-layer-tip` 50 and `--rg-layer-skip` 60 (the skip
  link). A window, and a tip or menu the browser lifts above the page itself (a
  modal dialog, a popover), needs none.
- Panels and tips name their shadow, and it is none: `--rg-layer-panel-shadow` and
  `--rg-layer-tip-shadow`. A window's cut-corner frame draws its own edge. Layers
  stay flat (Sean, LAYERS-DEPTH a, 27 October 2026); nothing floats on a soft
  shadow.
- Artwork that orders its own pieces (a cube, the crown, a hero) keeps its own numbers
  inside itself; they never meet the page's layers. Its root sets `isolation: isolate`
  and the numbered rules sit nested inside that root's rule, so the style check sees
  them contained. A panel's edge and fill, a button's paint, a window's frame, a
  figure's dots and the foil card's layers are such pieces.
- A thin line inside a box (a chip's edge, a chosen tile, a check-in ring) is a real
  border or outline, never an inset shadow, so forced colours still draws it.
- With reduced motion asked for, nothing moves: a page's headline and its cards fade
  in, and windows, panels and menus are simply there.
- The template's `/showcase/grammar` shows the pieces by name, how they move and the
  six layers drawn.

## Shared base and local additions

Every site keeps the shared base. A site may add to it; an addition is not a defect.

- **The base:** the tokens and semantic colours, the `Regent.*` components with their
  markup and states, a visible, unclipped focus ring on every control, 44px touch targets
  on phones, reduced motion winning over every animation, forced-colours borders and
  readable pairs, the account page (below) and the motion rules in Motion.
- **Allowed additions:** a site's own layout, navigation, homepage, pages, palette choice,
  artwork, product components and extra motion, as long as the base still holds on them.
- **Not allowed:** a local override that removes part of the base, such as clipping the
  focus ring, hiding focus in forced colours, moving a control on focus, shrinking a touch
  target or animating when reduced motion is on. Fix the local CSS rather than the shared
  component, unless the shared component is wrong for every site; then fix it here.

### The account page

Every site that signs people in has one page called **Account** at `/account`.
The words are fixed: **Sign in** and **Sign out** (never "Sign In", "Log out" or
"Disconnect"), **Account** for the page and its header link, and **Profile** for the
profile section inside it. The header's account control stays site-owned, since it
holds the site's sign-in wiring, but uses these words.

The page is the same on every site (founder, 2026-10-28: "all account routes should be
the exact same, with some local site versions shown first"). It shows
`Regent.Account.signed_out` until the person is signed in; then `Regent.Account.layout`
draws, in order: the site's own parts (its `site` slots), the account card
(`Regent.Account.identity`), then the **Profile** section (`Regent.Profile.panel`,
where the person sets their **Public Display Name**, the name people see for them),
each across the page. A site may give a
long section its own tab under Account, such as Points, drawn with `Regent.Points`. Each section shows its own state: loading, could not be read, or a session
that ended. A site that cannot change pairings shows the agents read-only with a link to
where they are managed. Showing these sections never turns on earning Points.

## Product layouts and disclosure

Each product chooses document scrolling, panels, rails and navigation to fit its users.
There is no required universal shell or landing-page theme. Shared components do not own
routes, authentication, persistence, wallet admission, or product workflows.

Shared CSS reads only the shared `--color-*` semantic tokens; a product's own color names stay
in that product's CSS. Do not recolor a product or replace its layout merely to consume a
common button or disclosure.

### Few words on screen

Design like a Coinbase deposit dialog (founder, 2026-10-06): the figures, the input, the
choice and the button, and nothing else until someone asks. Make every screen as simple
as Linear's website or Apple Notes (founder, 2026-11-02): simple purpose, simple design,
simple code. If a screen needs a tagline or helper line to make sense, fix the layout
instead: the order, the grouping, the control itself. Too much text is a defect.

- **Never on screen:** a tagline or subtitle under a heading, a small label above one (a
  kicker, eyebrow or breadcrumb that repeats the page or site name), a line under an
  input saying what to type, and a caption under a page's picture. Shared components
  carry no slot for these.

- **What stays visible:** a short title or the figure that matters, labels of one to
  three words, the amount and what it costs or buys, the primary action, and anything
  needed to choose it. Errors, refusals and outcomes stay visible too, one short line
  each. A disabled button keeps a reason of a few words beside it.
- **What goes one level down:** how something works, why a step exists, timings,
  provenance, technical detail and reassurance. Put a short explanation in a tip
  (`Regent.Primitives.tip`: an "i" beside the label that opens a popover on a press, and
  under a mouse while it rests there; given a `figure`, such as a price, the figure
  itself opens it and there is no "i"), a longer one
  in a dropdown (`Regent.Primitives.disclosure`), and a whole topic in its own dialog
  or page behind a link. Legal and policy text are links at the foot, never paragraphs.
- **Show state with marks, not sentences:** a tick that draws in when a step is done
  (`Regent.Primitives.tick`), a dashed box while it waits (`Regent.Primitives.waiting`),
  the changed number flashing. Words appear only when something went wrong or the person
  must act.
- **One idea per line.** No paragraph under a button, no sentence that repeats a label,
  no "you can" or "this lets you" lines. Cut every word a person would not miss.

Hidden words stay in the page. A tip's words describe its button and a closed dropdown's
body stays rendered, so screen readers and agents read the full detail without opening
anything. Authorized agent tools return the same detail independently of visual
expansion; DOM hiding is not access control.

### Choices never change the height

Picking an option — a chain, a tab, a mode, a toggle — never makes a dialog, panel or card
grow or shrink, and never moves what sits below it (founder, 2026-10-07). A row, button or
line that one option uses and another does not keeps its space, unseen
(`visibility: hidden`, made `inert`), rather than appearing and disappearing. An unused
row sits after the rows in use, so the rest close up at the top and the empty space falls
at the end. Check every option at desktop and phone width; the height must match.

### Text never moves the boxes below it

A line of text that shows in one state and not another — a tab's description, a hint, a
status, an error — never pushes a card, list or panel below it up or down (founder,
2026-10-07). Its line keeps its space in every state: give every option its own line, or
keep the space with the line unseen (`visibility: hidden`) rather than adding and
removing it. Switching tabs above a list must leave the list's top edge where it was.
Check every state at desktop and phone width; the box below must not move.

### Fields

`Regent.Primitives.field` puts the label above its input, with an optional `tip` slot
beside the label for what a person rarely needs, and keeps a line under it for
errors, empty until the field has one, so an error never moves the fields below it, and a
screen reader says the error as it appears. A form checks a field when the person leaves
it (`phx-debounce="blur"`), never while they type, and its errors say what to do ("Fill
this in.", "Add at least 2."), never which rule broke. Keyboard focus draws the 2px ring;
a field to fix doubles its edge in the error colour without changing size; a disabled
field rests on the inert gray of a disabled action; while a LiveView form is on its way
its fields' words dim and its submit button shows its `phx-disable-with` words.

### The account menu hangs under its button

Signed in, the account's button at the top right of every page opens the account menu
(`Regent.Account.menu`), never a panel down the side (founder, 2026-10-28: "instead of
a sidepanel, do a upper right modal"). It is a menu on the Tip layer: a firm edge, the
raised fill, no shadow, dropping in from under the button with its right edge on the
button's. The page keeps its full width under it. On a phone it spans the screen less
8 px each side. ash-template's shell is the reference; its browser walk measures it at
1280, 2000, 390 and 320 wide (`platform/test/browser/account_menu.spec.ts`), and every
site copies that check.

## Motion

General tokens: `--duration-fast|base|slow`, `--ease-out`, `--ease-in-out`, `--ease-in` (leaving only), `--active-scale`.

- CTA motion uses Anime.js in the template's shared motion kit. A pointer entering
  a primary or secondary CTA nudges its chevron once, then returns it to rest.
  Pointer-down gives immediate, small press feedback; keyboard activation stays still.
  Only transform changes: the label and paint scale, never the clickable box.
  Motion never delays, stops or repeats the underlying action, including wallet actions.
  Disabled controls and reduced-motion contexts stay still. Button fills do not shimmer.
- Feature-card edge ripples remain independent of CTA motion. Their existing
  interaction-only treatment must not be applied to button backgrounds.
- Something waiting is a dashed box at its final size (`Regent.Primitives.waiting`),
  never a shimmer skeleton; what lands fades in over 200ms in its place. A status word
  that changes leaves rising 4px and fading in 140ms on `--ease-in` and the new one rises
  4px in over 200ms on `--ease-out`, on a line as wide as its widest word. A done step's
  tick draws in over 280ms. All three are the package's own CSS; reduced motion shows
  each at once.
- A segmented control's indicator and a tab's bar travel to the new choice on a
  press; a key press puts them there at once, and so does reduced motion. They move by
  transform alone and the words never move. The package slides the segmented indicator
  in CSS; the template's motion kit adds the stretch that leads with the new side, and
  slides the tabs' bar from the tab before.
- An agent's running step is the one moving thing in its activity: a 6px dash travels
  down the rail under it every 1.2s, by transform alone, and stops when the step
  ends. Marks follow the data the page passes and never a timer; a finished step's
  tick draws in, and a new verb changes like any status word. Reduced motion and forced
  colours hide the dash; the filled square still says it runs.
- A chart's line is 1.5px whatever its width, in `--color-chart-line`: the site's action
  colour, or Tangerine on Regents and the green marks on Techtree in light, where the
  action colour is too close to the page. A flat 10% fill may sit under a lone series;
  no gradient, and status colours never carry a series. The package draws it still. The
  template's motion kit adds a 1px rule that snaps to the nearest point under the
  pointer or the arrow keys, with the figure above reading that point, and moves the
  line to a new period: a 280ms `--ease-in-out` morph when the point counts match,
  otherwise a 200ms crossfade. A key press moves the rule without motion, reduced
  motion swaps the line at once, and the chart's height never changes.
- A breadcrumb keeps its row height and never wraps. When the path changes, the
  template's motion kit raises the new page showing 4px into place over 280ms, fades
  the crumbs that went in 140ms, and the old page showing turns to a plain level; its
  menus and card grow from the button that opened them. Without the kit the new path
  simply shows.
- Content is visible by default. Scroll reveals hide elements only after script takes over,
  so a page without JS is fully readable.
- OS `prefers-reduced-motion` wins: remove movement, swap layout immediately, and allow only a
  brief color/opacity dissolve. A later Account opt-in cannot override the OS preference.
- Keyboard-triggered buttons never animate. Reduced
  motion and forced colors disable shimmer entirely (no static area gradient); reduced
  motion keeps only the static faint card edge, and forced colors keep system-color borders.

## Glass

There is no glass layer. Shared structure uses opaque semantic surfaces, no blur, and no
animation dependency. The interaction-only shimmer is the restrained exception to
undecorated panel skins.
Two exceptions are approved, each by Sean's letter: the regents.sh home's glass panel
(Sean, 12 November 2026) and the template's world cube lab page, whose glass panes keep
their shadow (Sean, 12 November 2026). Each of their lines carries a marker the style
check accepts, with who approved it and when after the dash: a blur line
`/* style-check: allow glass — Sean 12 Nov 2026 */`, a `box-shadow:` line
`/* style-check: allow shadow — Sean 12 Nov 2026 */`. A glass marker never excuses a
shadow, nor a shadow marker glass. A marker is only for an exception Sean has approved
by name; no other line may carry one.

## Artwork

Existing product artwork (not defaults for new structural compositions):

- **Halftone CMYK** over generated dark source art: hero and section-band backgrounds.
- **Mesh gradient** in forge tones: Agent Formation.
- **God rays** in Tangerine Tango: Autolaunch.
- **Crown** in Canopy greens: Techtree.

Use static SVG technical figures in dedicated compartments: sparse circles, wireframes,
triangles and leader lines, 1–1.5px non-scaling strokes. Informative art needs a text
equivalent; decorative SVGs are aria-hidden. Local dots use approximately 0.6px radius,
4px pitch and 10% opacity. Never put texture behind copy, tables, code, fields or buttons;
never stack patterns. No page background SVGs. Existing optional animation mounts must
respect reduced motion. Placeholder content is labeled `Placeholder`; invented diagrams
are labeled `Illustration`.

## Logos

`logos/` holds the canonical marks — these are the site-wide logos going forward:

- **Crown** = Regents Labs, **chart** = Autolaunch, **tree** = Techtree.
- `voxel` style for hero placements; `flat` below ~48px (favicons, avatars, chips).
- `dark` scheme on near-black surfaces, `light` scheme on white; production rasters,
  favicons, and share images live in `logos/png/`.

See `logos/README.md` for grid, palette, and export details. Do not restyle, tint, or shadow
the marks; pick the correct scheme instead.

## Consumption

- Use `Regent.Primitives` for buttons, fields/errors, statuses, notices, empty states and
  disclosures. Apps supply slots, routes, events and state.
- Run `mix regent_ui.assets` before the consuming CSS build. Ignore the generated
  `assets/vendor/regent_ui/` and `priv/static/fonts/regent-ui/` directories. Import the
  canonical tokens and then `primitives.css`; the package has no global body or page
  stylesheet.
- Each site pins one reviewed design-system commit in `platform/mix.exs`; Mix fetches it,
  in development and in release images alike. How a new release reaches the sites is
  under "Taking a new release" in [CONSUMERS.md](CONSUMERS.md).
- The package requires LiveView 1.2, which every consumer locks. Verify representative
  consuming pages; do not upgrade frameworks incidentally.
- Change shared token values at their source and regenerate the JSON/package mirrors.
- Verify keyboard focus, labels/errors, mobile wrapping, empty states and reduced motion
  in each product theme. A component render test alone is not visual QA.

### Structural acceptance and showcase

From `regent_ui/`, run `mix run ../scripts/render-structure-showcase.exs`, then from the
repository root run `python3 -m http.server 8766 --bind 127.0.0.1 --directory .showcase`.
Open `http://127.0.0.1:8766/`. This renders actual shared Phoenix components to one HTML
document; product/theme selectors only change root attributes. It needs no product database.
Use its long-label toggle, expanded errors, disabled state, native select/dialog and overflow
options for desktop, 320px reflow, 200% text, keyboard, reduced-motion and forced-colors review.
Do not treat this as completed adoption in every product. Verify a bounded consumer after
the shared visual direction is accepted, before rolling pinned revisions to the other apps.

## Utility screens

Account, settings, connection and recovery screens use Geist Serif, including headings.
Use `Regent.Utility.page` for standalone messages and `rg-utility` for account content.
The shared utility palette has neutral light and dark surfaces, readable secondary text,
and a restrained rule color. Product accents still belong to actions. Use open sections
and single separators, not chamfered or nested decorative frames. Titles are 24–28px,
body text 16px, context and supporting notes 14px. Do not animate errors or consent panels.
Identity, expiry, permission and recovery wording must remain accurate. Never invent a
return URL or change a consent action while changing presentation.
