# Techtree Palette

The shared token files in this directory are the source of truth:

- `design_system_tokens.css`
- `design_system_tokens.json`

See `STYLE.md` for the full visual language.

## Direction

Techtree is the Powder Blue product: the page sits on Powder Blue with Charcoal text and Charcoal
actions. Platinum is the elevated surface and Tangerine Tango is the secondary note
(`--color-accent-secondary`) for standout proof states. The ground does not change when the reader
switches Light/Dark. Reserve the status colors for state only.

## Core Values

- Background: `#AECACD` Powder Blue
- Surface: `#C4D8DA`, elevated `#E5E3D2` Platinum
- Border and muted text: `#3F4F51`
- Text and primary action: `#161616` Charcoal, with `#E5E3D2` Platinum text on the action
- Highlight: `#FF5B19` Tangerine Tango
- Status: success `#053022`, error `#5A0B0B`, warning `#3D1B00`, info `#072C38`

Charcoal on Powder Blue is 10.5:1.

## Usage

Powder Blue and Charcoal carry the interface. Use Charcoal for primary actions, tree state, and
selected states. Tangerine is a sparing secondary note; keep the text inside a Tangerine chip
black rather than Platinum or Powder Blue.
