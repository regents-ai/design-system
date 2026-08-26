# Autolaunch Palette

The shared token files in this directory are the source of truth:

- `design_system_tokens.css`
- `design_system_tokens.json`

See `STYLE.md` for the full visual language.

## Direction

Autolaunch is the Tangerine Tango product: the whole page sits on Tangerine with black text.
Charcoal is the action color, Powder Blue is the highlight, and Platinum is the elevated surface.
The ground does not change when the reader switches Light/Dark. Reserve the status colors for
state only.

## Core Values

- Background: `#FF5B19` Tangerine Tango
- Surface: `#FF7A45`, elevated `#E5E3D2` Platinum
- Border: `#161616` Charcoal
- Text: `#000000` black, muted `#4F1600`
- Primary action: `#161616` Charcoal, with `#E5E3D2` Platinum text on it
- Highlight: `#AECACD` Powder Blue
- Status: success `#053022`, error `#5A0B0B`, warning `#3D1B00`, info `#072C38`

Black on Tangerine is 6.8:1.

## Usage

Tangerine carries the page and black carries the text. Platinum and Powder Blue are highlighted
surfaces only, and the text inside them stays black or Charcoal — neither is ever text directly on
Tangerine (2.4:1 and 1.8:1). Use Charcoal for primary actions, launch state, and selected states.
