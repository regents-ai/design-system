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
| Regents Labs / Platform | Charcoal ground; Charcoal action in dark, white action with Charcoal text in light | — |
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

## Typography

Three faces, packaged with the shared UI library and served from the consuming application's
own origin. All are Vercel Geist under the SIL Open Font License 1.1; the license ships
beside the files.

| Face | Canonical `font-family` name | Token | Use |
| --- | --- | --- | --- |
| Geist Pixel Square | `"Geist Pixel Square"` | `--font-family-title` | Deliberate brand headlines, wordmarks and editorial display moments; never routine account, settings, connection or error headings |
| Geist UI Sans | `"Geist UI Sans"` | `--font-family-sans`, `--font-family-ui`, `--font-family-paragraph` | Body, forms, navigation, labels, captions, legal text and other UI |
| Geist Mono | `"Geist Mono"` | `--font-family-mono` | Code, technical indices, addresses and readouts |

`--font-family-ui` and `--font-family-paragraph` resolve to Geist UI Sans. Routine
account, settings, connection and error headings use Sans; Pixel Square is reserved
for deliberate brand and editorial display headings. Mono is reserved for technical/code roles.

Pixel Square is genuine upright **400 only**, with `font-synthesis: none`; never fake
bold or italic Pixel. Sans and Mono support 400 and 600 with genuine italics, using
`--font-weight-regular` and `--font-weight-semibold`.

Font URL contract: the canonical CSS declares each face as
`url("/fonts/regent-ui/<file>")`, where the files are `GeistPixel-Square`, `Geist-Regular`, `Geist-Italic`,
`Geist-SemiBold`, `Geist-SemiBoldItalic`, `GeistMono-Regular`, `GeistMono-Italic`,
`GeistMono-SemiBold` and `GeistMono-SemiBoldItalic` (all `.woff2`) plus `OFL.txt`. They live in
`regent_ui/priv/static/fonts/`, generated from `geist-font/` by `scripts/generate-tokens-json.mjs`,
and `mix regent_ui.assets` copies them into the application's `priv/static/fonts/regent-ui/`.
The application serves `fonts` as a static path; no cross-origin font host is involved.

Math rendered by KaTeX keeps its own scoped KaTeX fonts, and Markdown output keeps its
structure: prose paragraphs take the paragraph role, and code spans and blocks take mono.

Patterns that generalize:

- Uppercase micro-labels at 0.6–0.7rem with 0.14–0.22em tracking (`--tracking-microlabel`)
  for kickers, figure labels ("FIG.1 — Identity"), column headings, and chips.
- Mono for anything an operator might copy: commands, slugs, versions, addresses.
- `font-variant-numeric: tabular-nums` on counters and money figures.
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
  8px below 768px, filled with the site's own accent/on-accent pair in both themes.
  A primary rests as its plain fill. Hover and keyboard focus bring in its marks in
  150ms, and hover never takes them away (founder, 2026-10-19): dark primaries show
  Powder Blue marks at the square corners and Tangerine accents along the cuts; light
  primaries show two opposite Tangerine L-edges.
  A brand may set `--rg-button-mark-color` for both dark marks and
  `--rg-button-border-color` for the light edges; Techtree sets both
  to `#238450`. The theme switch's beam follows `--rg-theme-laser-light` and
  `--rg-theme-laser-dark` the same way.
  Techtree's lime is too pale on its light page for the fill alone, so in light its
  primaries rest with a whole cut outline in `#238450`.
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
  Credits balance and account name (`arrow={false}`). Signed in, those two wear the
  same cut corners and marks as Sign in (founder, 2026-10-20).
  A button that opens another site in a new tab (`target="_blank"`) shows a
  diagonal arrow up and to the right in place of its chevron, nudged the same way on
  hover; nothing else is added to its label.
  Disabled actions use inert gray. External keyboard focus rings remain visible.
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
  color alone. Essential field/control boundaries are stronger than decorative hairlines.

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

### Addresses and transaction hashes

A contract address or transaction hash always shows its short form, then a copy icon and
a diagonal arrow up and to the right that opens it on Basescan in a new tab, the three
tight together, with the shared hover and press motion (founder, 2026-10-19). One shared
component, `Regent.Primitives.address` (`kind="tx"` for a hash), draws it everywhere;
a page never places the icons by hand. Something on Ethereum takes `chain="ethereum"`,
and its arrow opens Etherscan instead. On hover the copy icon grows a little and the
arrow leans up and right; a press gives both a little.

### Shared compositions

This table is the complete public component catalog of `regent_ui/lib`. "Used by" is
checked against each consumer's own source; "(showcase)" means only that app's component
showcase page renders it. Consumers are Regents, Autolaunch, Patchbay, Techtree,
Ash Template and Keyfleet (each `platform/`).

| Component | Purpose | Used by |
| --- | --- | --- |
| `Regent.Primitives.button` | Primary, secondary or quiet action | All six apps |
| `Regent.Primitives.copy_button` | Copies a value or an element's text and says "Copied" (or "Selected", or "Couldn't copy") on the button and to screen readers | Ash Template, Patchbay |
| `Regent.Primitives.copy_icon` | The same copy as an icon alone, for the corner of the box it copies from; a tick once copied | Ash Template |
| `Regent.Primitives.address` | Every ENS name, address and short address a page shows: the words, which open the full address on a click, tap or Enter, a copy icon for the full address and a diagonal arrow that opens it on Basescan (Etherscan with `chain="ethereum"`), each a 44 px target on a touch screen (founder, 2026-10-19). With no `label` it shows the short form `0x1234..abcd` | Ash Template |
| `Regent.Primitives.field` | Label, hint and errors around an app-owned input | Regents, Autolaunch, Patchbay; Ash Template and Keyfleet (showcase) |
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
| `Regent.Blog.gallery` | Blog index | Regents, Autolaunch, Patchbay, Techtree |
| `Regent.Blog.article` | Blog post with sticky contents | Regents, Autolaunch, Patchbay, Techtree |
| `Regent.Blog.contents` | Table of contents inside `article` | Rendered by `Regent.Blog.article` |
| `Regent.Blog.not_found` | Missing-post page | Regents, Autolaunch, Patchbay, Techtree |
| `Regent.Discussion.thread` | Forum thread: title, Solved mark, counts and the Compact replies switch | Ash Template (showcase), Patchbay |
| `Regent.Discussion.post` | Opening post or reply with picture, name, time, words and actions | Ash Template (showcase) |
| `Regent.Discussion.solved` | Solved box quoting the marked answer under the opening post | Ash Template (showcase) |
| `Regent.Discussion.replies` | Replies heading, filters, list and empty line | Ash Template (showcase) |
| `Regent.Discussion.like` | Heart with its count and the first few who liked the post | Ash Template (showcase) |
| `Regent.Discussion.posts` | Posts listed outside a thread, such as one person's replies | Patchbay (tool history) |
| `Regent.Discussion.label` | Label after a name, such as Solution or Official | Ash Template (showcase) |
| `Regent.Account.signed_out` | The account page before sign-in, or after a session ends | Awaiting consumer adoption |
| `Regent.Account.identity` | The card at the top of the Account page: the person's picture, the name the site calls them and their wallet, each said once; an ENS name or short address in it opens and copies the full address | Ash Template |
| `Regent.Account.agents` | Paired agents with World ID backing, last contact and product-owned actions | Awaiting consumer adoption |
| `Regent.Account.agents_brief` | The person's agents in a narrow panel, three at most, each with where it was last active and how long ago; Manage beside the heading may lead to where agents are managed | Ash Template |
| `Regent.Account.pairing` | Choosing an agent and the message with its pairing code to paste it; in a narrow panel the message comes first in a short box with copy and new-code icons, then the agents five to a row, each named on hover | Ash Template |
| `Regent.Account.agent_detail` | One agent's own view: facts, World ID backing, what it may do, what it cost, activity across the sites | Ash Template |
| `Regent.Account.agent_mark` | An agent's square picture | Ash Template |
| `Regent.Account.credits_summary` | Read-only available and held Credits | Awaiting consumer adoption |
| `Regent.Account.points_summary` | Confirmed Points, today, pending activity and separate allowances | Awaiting consumer adoption |
| `Regent.Account.history` | Read-only formatted Credits or Points activity; a row may carry one link, such as a payment's "View" | Awaiting consumer adoption |
| `Regent.Profile.panel` | The Public Display Name form: the name people see for a signed-in person | Patchbay, Ash Template |
| `Regent.ThemeToggle.button` | Prism/laser light-dark control that names the theme showing | All six apps |
| `Regent.HolographicCard.card` | Pointer-lit graphite foil card | Regents, Ash Template, Keyfleet |
| `Regent.HolographicCard.foil` | The same foil as a panel face or a drawing's ink | Regents, Ash Template, Keyfleet |
| `Regent.AgentMetadata.head` | Canonical, sharing and agent-discovery head tags | Regents, Autolaunch, Patchbay, Ash Template, Keyfleet |

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

`rg-hero-title` is the display title: Geist Pixel Square 400, 40–72px, line-height 1.03 and
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
unknown), uppercase labels above baseline-aligned Pixel Square 400 percentages,
canonical Tangerine fill, vertical-striped remainder and five scale labels. The footer
label sits above the tiles and right-aligned optional badge. Its unique `id`
and `title` are required strings. Integer `value_bps` is `0..10000` or `nil` (default):
paired labels and the named `0..100` meter derive from the same basis points,
trimmed to at most two decimals. Invalid inputs raise `ArgumentError`; `nil` shows
em dashes and `No data` without a meter. Defaults are `eyebrow="Allocation"`,
`label="Allocated"`, `remainder_label="Remaining"`, `footer_label="Details"` and
`change={nil}`. Change text is caller-defined, including period; it is not calculated.
Optional `:footer`/`:footer_badge` slots and `class`/global attributes provide content
without implicit actions. Use `rg-ratio-card__tile` for static footer tiles.
Orange notes mix 55% Tangerine with local ink on a 12% Tangerine/local-surface tint;
never use raw orange as small badge ink in light mode. Content stays unclipped,
metrics stack at a 30rem container width, and forced colors retain system borders
and a solid Highlight meter fill. No shimmer or idle animation applies.

`Regent.Account` renders the account page's shared sections. The product must authorize
and load the account before rendering it; the package has no routes, domain dependencies,
wallet operations, purchase controls or grant controls. Credits are distinct from the
Privy wallet's USDC balance. Importing `primitives.css` includes `account.css`.

- `signed_out` requires `id` and a `sign_in` slot holding the product's own button,
  labelled "Sign in". It is one line and the button, with no heading of its own: it sits
  under the page's title. `reason` is `:signed_out` (default) or `:expired`, which says the
  session ended. It never shows figures, so a sign-in problem never reads as zero.
- `agents` requires `id` and `agents`: `:loading`, `:unavailable`, or a list of
  `%{id, name, kind, harness, backed, last_contact_iso, last_contact}`, all required:
  `kind` is the harness value, which picks the agent's picture, and `last_contact` is
  already formatted. `:unavailable` says the agents couldn't be read; only an empty
  list says "No agents paired yet." Optional `notice` reports the last action. Slots:
  `about` (tip text on what a paired agent may do here), `actions` (per-agent controls
  such as Unpair, given the agent; leave out when the site cannot change pairings) and
  `footer` (pairing controls, or a link to where agents are managed).
- `agents_brief` goes in the side panel. It requires `id` and `agents`: `:loading`,
  `:unavailable`, or a list of at most three `%{id, name, kind, last_action,
  last_action_iso, last_action_at}`, the last three `nil` until read; the site picks
  which three, such as the most recently active. Optional `manage_href` adds Manage
  beside the "Your agents" heading, such as to https://regents.sh/account: shown while
  the pointer is over the list or a key has moved into it, and always on a touch
  screen, keeping its space while hidden. The heading is plain text.
- `pairing` goes in the side panel, on every page for someone signed in. It requires
  `id`, `harnesses` (`%{value, label}` for every agent a person may choose; `value` is
  the harness value, which picks its picture). `layout={:icons}` is for the narrow
  side panel: the message first, in a short box that scrolls with a copy icon, a
  new-code icon and a help icon in their own column at its right, then the pictures
  alone, five to a row in one frame each, named under a first-row picture and over a
  second-row one on hover or keyboard focus, then the expiry line. Its optional
  `guide` is the chosen agent's own page on the site, such as `/agents/dots`, which the
  help icon links to, named "How Dots pairs"; the icon keeps its space until an agent is
  chosen. The default `:list` names
  each agent beside its picture, numbers the steps and also requires `messages`:
  every agent's message with a stand-in code, so the box keeps one size.
  `chosen` is the chosen value; `message` is that agent's message once a code is made,
  with `expires_iso` and `expires` (such as "14:05 UTC"); `outcome` is
  `{:paired, name}` once the code is used or `:unavailable` when none could be made.
  The product's events sit on the form: `phx-change` (choosing) and `phx-submit`
  ("Make a new code") both carry `harness`. What a state lacks keeps its space
  unseen, so choosing an agent never changes the height.
- `agent_detail` is a `<dialog>` the product renders while one agent is open, with its
  own hook to open it and report the close. It requires `id`, `agent`
  (`%{id, name, kind, harness, wallet, listing, paired_at, last_contact,
  last_contact_at}`, all required, dates formatted; `kind` is the harness value and
  `listing` is `nil` or `%{url, number}`),
  `verified`, `may` (what a paired agent may do on this site, a line each),
  `rename_event` (the Name form under the heading saves a new name; it carries
  `agent_id` and `name`),
  `spent` (`:loading`, `:unavailable`, or the Credits it has spent for its person,
  formatted), `activity` (`:loading`, `:unavailable`, or a line for each site and
  day, newest first: `%{site, day_iso, day, hours}`, `hours` saying when the first
  and last request that day came) and `open_event` (carries `id`). After the facts
  it answers the three questions every Regent site asks in the same words: "What
  may happen next", "What it cost", then the recent activity. Optional:
  `same_person_count`, `same_person` (`%{id, name}`), `notice`
  (`{:status | :alert, text}`), `name_error` (why a new name was refused, in a few
  words, such as "That name can't be used."; it takes the place of the name's hint,
  so nothing below moves), `target`, and an `actions` slot for the product's
  buttons beside Done, such as Unpair. The name's hint and tip say where it comes
  from and who sees it: the agent chose it when it paired, and only the person and
  the agent see it.

- `credits_summary` requires a unique string `id`; `available` and `held` are already
  formatted strings or `nil`. The site's own lines and links under the figures go in
  its inner block, inside the same box; never wrap the section in a second framed panel.
- `points_summary` requires `id`; `confirmed`, `today` and `pending` are formatted
  strings or `nil`. `pending` counts activity being verified, not spendable Points.
  Optional `allowances` is a list of `%{label: string, value: string_or_nil}`; callers
  label activity and Credits-purchase pools separately and include the unit and
  remaining-period wording. The component never merges allowances or computes limits.
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
Use approved marks or Geist Pixel Square brand text, never borrowed wordmarks or invented metrics.

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
An open `details` pill closes on Escape, handing focus back to its summary, and on a press
outside it, through `pill_select.mjs` (copied by `mix regent_ui.assets`, imported once).

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

The page shows, in order: `Regent.Account.signed_out` until the person is signed in;
then the account card (`Regent.Account.identity`), a **Profile** section (`Regent.Profile.panel`, where the person sets their
**Public Display Name**, the name people see for them), `Regent.Account.agents`, and, where the site
offers them, `credits_summary` and `points_summary` with their `history`. A site may give
a long section its own tab under Account, such as Points, and adds its own sections after
these. Each section shows its own state: loading, could not be read, or a session
that ended. A site that cannot change pairings shows the agents read-only with a link to
where they are managed. Showing these sections never turns on spending Credits or
earning Points.

## Product layouts and disclosure

Each product chooses document scrolling, panels, rails and navigation to fit its users.
There is no required universal shell or landing-page theme. Shared components do not own
routes, authentication, persistence, wallet admission, or product workflows.

Shared CSS reads only the shared `--color-*` semantic tokens; a product's own color names stay
in that product's CSS. Do not recolor a product or replace its layout merely to consume a
common button or disclosure.

### Few words on screen

Design like a Coinbase deposit dialog (founder, 2026-10-06): the figures, the input, the
choice and the button, and nothing else until someone asks. Too much text is a defect.

- **What stays visible:** a short title or the figure that matters, labels of one to
  three words, the amount and what it costs or buys, the primary action, and anything
  needed to choose it. Errors, refusals and outcomes stay visible too, one short line
  each. A disabled button keeps a reason of a few words beside it.
- **What goes one level down:** how something works, why a step exists, timings,
  provenance, technical detail and reassurance. Put a short explanation in a tip
  (`Regent.Primitives.tip`: an "i" beside the label that opens a popover on a press, and
  under a mouse while it rests there), a longer one
  in a dropdown (`Regent.Primitives.disclosure`), and a whole topic in its own dialog
  or page behind a link. Legal and policy text are links at the foot, never paragraphs.
- **Show state with marks, not sentences:** a tick that draws in when a step is done, a
  dashed box while it waits, the changed number flashing. Words appear only when
  something went wrong or the person must act.
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

## Motion

General tokens: `--duration-fast|base|slow`, `--ease-out`, `--ease-in-out`, `--active-scale`.

- CTA motion uses Anime.js in the template's shared motion kit. A pointer entering
  a primary or secondary CTA nudges its chevron once, then returns it to rest.
  Pointer-down gives immediate, small press feedback; keyboard activation stays still.
  Only transform changes: the label and paint scale, never the clickable box.
  Motion never delays, stops or repeats the underlying action, including wallet actions.
  Disabled controls and reduced-motion contexts stay still. Button fills do not shimmer.
- Feature-card edge ripples remain independent of CTA motion. Their existing
  interaction-only treatment must not be applied to button backgrounds.
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

Account, settings, connection and recovery screens use Geist Sans, including headings.
Use `Regent.Utility.page` for standalone messages and `rg-utility` for account content.
The shared utility palette has neutral light and dark surfaces, readable secondary text,
and a restrained rule color. Product accents still belong to actions. Use open sections
and single separators, not chamfered or nested decorative frames. Titles are 24–28px,
body text 16px, context and supporting notes 14px. Do not animate errors or consent panels.
Identity, expiry, permission and recovery wording must remain accurate. Never invent a
return URL or change a consent action while changing presentation.
