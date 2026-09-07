# Shared Design System for LiveView and iOS

This is one shared system with three explicit brand themes:

- Regent
- Autolaunch
- Techtree

The structure stays shared across products. The brand theme changes the color voice.

## Theme selection

There is no default brand theme in the shared CSS.

Consumers must set both selectors on the root element:

```html
<html data-brand="platform" data-theme="light">
```

Valid brands:

- `platform`
- `autolaunch`
- `techtree`

Valid themes:

- `light`
- `dark`

## The four colors

The entire system is four colors. Black is a contrast utility for text on Tangerine, not a fifth
identity color.

| Name | Value |
| --- | --- |
| Tangerine Tango | `#FF5B19` |
| Charcoal | `#161616` |
| Platinum | `#E5E3D2` |
| Powder Blue | `#AECACD` |

A product's ground stays the same in both themes. The theme varies the frost and shine of glass,
never the identity, foreground, action, muted, or status values.

## Brand feel

### Regent

Calm, grounded, and institutional without feeling cold.

- Charcoal is the ground and Platinum is the text.
- Powder Blue is the main action color.
- Tangerine Tango is a highlight, not the main action color.

### Autolaunch

Focused, trustworthy, and market-ready with more energy than Regent.

- Tangerine Tango is the ground and black is the text.
- Charcoal is the main action color, with Platinum text on it.
- Powder Blue is supporting emphasis, not the default button color.

### Techtree

Practical, guided, and research-led.

- Powder Blue is the ground and Charcoal is both the text and the main action color.
- Platinum is the elevated surface.
- Tangerine Tango is reserved for record or standout proof states.

### Readable pairs

Platinum and Powder Blue are never text colors on Tangerine. Black or Charcoal supplies readable
text there. They may be highlighted surfaces on a Tangerine page as long as the text inside them
is black or Charcoal.

## Typography

### Font roles

- Headers, titles and normal interface text use **Geist UI Sans** (the UI font token).
- Long-form paragraphs use the paragraph font token, which resolves to the same face.
- Code and technical text use **Geist Mono**.
- Weights are 400 and 600 only, each with a genuine italic.

### Suggested mapping

- `display` -> UI font
- `title-lg` -> UI font
- `title` -> UI font
- `headline` -> UI font
- `body` -> UI font
- `label` -> UI font
- `caption` -> UI font
- `legal` -> UI font
- `prose` -> paragraph font
- `code` -> mono font

## What stays shared

Keep these shared across all three brands:

- spacing scale
- radius scale
- typography roles
- component structure
- action hierarchy
- list and row patterns
- app shell patterns

## What changes by brand

The brand theme controls:

- which of the four colors is the ground, the text, the action, and the highlight
- the semantic status set that stays readable on that ground
- how strong or restrained the highlight feels

## LiveView implementation

Use the JSON token file as the source of truth and compile it to CSS custom properties.

Recommended LiveView component set:

- `ui.text`
- `ui.stack`
- `ui.button`
- `ui.input`
- `ui.select`
- `ui.checkbox`
- `ui.switch`
- `ui.card`
- `ui.list_cell`
- `ui.tabs`
- `ui.sidebar`
- `ui.topbar`
- `ui.modal`
- `ui.badge`
- `ui.toast`

### Text usage

- Use semantic HTML tags for structure.
- Use the text style tokens for visual hierarchy.
- Put long-form content inside `.prose` or `[data-prose="true"]`.

## iOS implementation

Mirror the same logical token names on iOS:

- `title`
- `ui`
- `paragraph`
- `mono`

Recommended SwiftUI surface:

- `AppTheme`
- `AppColor`
- `AppSpacing`
- `AppRadius`
- `AppTypography`
- `AppButtonStyle`
- `ListCell`
- `Card`
- `TopBar`
- `BottomTabs`
- `ModalSheet`

Keep the token names stable even if the concrete font registration names vary by bundle.

## Shared token source of truth

Use one JSON token file and compile it to:

- CSS custom properties for LiveView
- Swift enums or structs for iOS

The shared token source now carries:

- the four canonical colors
- the semantic contract for each brand, identical in both themes
- font roles
- font assets
- spacing
- radius
- typography

## Short version

Use one shared system structure across products, but require an explicit brand theme.

- Regent is Charcoal-grounded and calm, with Powder Blue actions.
- Autolaunch is Tangerine-grounded and more energetic, with black text and Charcoal actions.
- Techtree is Powder Blue-grounded and practical, with Charcoal text and actions.

Keep the system small, readable, and brand-specific without adding compatibility layers.
