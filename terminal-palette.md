# Platform Palette

The shared token files in this directory are the source of truth:

- `design_system_tokens.css`
- `design_system_tokens.json`

See `STYLE.md` for the full visual language.

## Direction

Regent sits on a Charcoal ground with Platinum text, and takes Powder Blue as its single action
color. Tangerine Tango is the highlight, used sparingly. The ground does not change when the
reader switches Light/Dark. Reserve the status colors for state only. Formation highlights inside
Platform use `--product-formation` (Tangerine) without changing the page action color.

## Core Values

- Background: `#161616` Charcoal
- Surface: `#20201E`, elevated `#2A2A27`
- Border: `#57564F`
- Text: `#E5E3D2` Platinum, muted `#AAA99C`
- Primary action: `#AECACD` Powder Blue, with `#161616` Charcoal text on it
- Highlight: `#FF5B19` Tangerine Tango
- Status: success `#7ED8A9`, error `#FF9B8F`, warning `#F5C16C`, info `#AECACD`

Platinum on Charcoal is 14.0:1; Charcoal on Powder Blue is 10.5:1.

## Usage

Charcoal and Platinum carry the interface. Use Powder Blue for primary actions, links, selected
states, and a small number of active highlights. Tangerine is an accent note, never body text on a
Powder Blue button.
