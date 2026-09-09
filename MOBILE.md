# Mobile web design and acceptance

Use this with `STYLE.md` for the four Phoenix products. This is an iPhone-oriented
web contract, not a request to replace the sites with native iOS UI or one common
marketing layout. Keep the approved palettes, ruled geometry and Pixel/Sans roles.

## First-screen hierarchy

A page can have zero horizontal overflow and still be a poor phone layout.
Judge the first useful content and action, not just whether everything fits.

| Before | After | Why |
| --- | --- | --- |
| Desktop rail turns into several full-width header rows | Compact identity/account row and a short primary navigation; secondary destinations in an accessible disclosure | Avoid spending most of the initial viewport on navigation |
| Repeated square illustrations dominate every narrow card | Product-owned compact media or list composition for directories/markets; preserve meaningful labels and real media | Help people scan objects, prices and status instead of scrolling through decorative posters |
| Unsupported GPU leaves a tall empty grid | Recognizable static artwork with the same bounded geometry; readable title and CTA independent of initialization | Older/unsupported browsers must receive a deliberate page, not a loading-shaped hole |
| Desktop copy, cards and shader merely stack without a height budget | Compose a deliberate phone reading order with bounded art and concise supporting copy | The first action and the next content group should be discoverable |

Keep Regents/Techtree's product-owned crown renderers where required; do not hide
or replace a working crown just to reduce layout work. Autolaunch stays a token
and auction market. Patchbay stays a site directory/message board. Never replace
real token images or site logos with generic marketing illustrations.

## Shared defaults implemented in CSS

On `(hover: none)` or `(pointer: coarse)`:

- `.rg-button` has a minimum 44 CSS px hit box in both dimensions, retaining larger
  rem-based sizing and the primary 3rem minimum. Do not clip the hit/focus host.
- Text-like inputs, selects and textareas within `.rg-field` use
  `font-size: max(1em, 16px)` and a 44px height floor. Larger inherited type stays
  larger. Checkbox/radio/file/hidden inputs are deliberately excluded.
- Primary/button and capability-card sweep animation does not run for sticky,
  pointer-only `:hover` after a tap. Keyboard `:focus-visible` still enables the
  approved sweep; within a card, a genuinely focus-visible descendant is required.
- Fine-pointer hover, 150ms outline transitions, primary 1.15s/card 3.45s timing,
  transparent labels, reduced motion and forced-colors behavior remain intact.

These defaults are not blanket overrides for native product controls. A product's
more-specific legacy input rule can still defeat the font floor. Remove conflicting
mobile overrides or adopt the primitive deliberately; do not add `!important`
across all inputs/links or rewrite events. Inline prose links are not buttons.

The 44px target is this design system's touch preference, not a claim that every
smaller link violates WCAG. Current Apple HIG distinguishes default and minimum
native sizes; WCAG has separate thresholds and exceptions. Inspect the actual hit
area, spacing, semantics and any expanded pseudo-element target.

## Product-owned controls and reading order

- Keep text-entry controls at least 16 CSS px on iOS; do not disable zoom or use
  `maximum-scale=1` to work around focus zoom. Choose `inputmode`, `autocomplete`,
  `enterkeyhint` and native input types for the real task, without preventing paste.
- Keep primary navigation and named account controls reachable and at the preferred
  touch size. Reflow tabs or provide a visibly scrollable labeled strip. Do not make
  business actions hover-only, or add positive tabindex values.
- Let long names, addresses, errors and translated labels wrap. Keep only genuinely
  two-dimensional data in a bounded local scroller with a label and keyboard access.
  Do not hide document overflow to conceal content loss.
- Evaluate drawers, menus and forms with the keyboard open and text enlarged.
  Preserve visible error/outcome messages, submit controls and focus restoration.
  Avoid fixed `100vh` heights for keyboard-sensitive panels; use the appropriate
  dynamic viewport constraint and internal scrolling without trapping the page.
- Default `viewport-fit=auto` already respects Safari's safe area. It is not a bug
  merely because `viewport-fit=cover` is absent. If opting into cover or placing
  fixed edge controls, use safe-area insets for those controls and retain normal
  padding as a floor. Do not add arbitrary notch padding everywhere.
- Keep GPU effects lazy, bounded in resolution and lifetime, paused offscreen/hidden,
  and static or absent under reduced motion. Decorations must not capture touch,
  intercept scrolling, hide content pending initialization or require one GPU device
  per decorative card.

## Evidence, not a new test-maintenance program

For a bounded UI change, manually inspect the actual page/components and retain
concise evidence. Do not add product-mirroring browser suites or fixture/auth work
just to declare a presentation pass.

1. Inspect `/` first at 375/390px, then 320px narrow, larger phone and landscape.
   Check the whole route as well as the initial viewport. Review supported themes.
2. Measure visible controls, font sizes, document versus local overflow, first
   useful object/action, header footprint and fallback media. Ignore closed-details
   descendants and screen-reader-only controls in visual target-size scans.
3. Exercise safe local navigation/disclosures and inspect enlarged text/reduced
   motion. A 200% root-font stress is useful but does not scale fixed-pixel text and
   is not a substitute for native Safari text enlargement or keyboard behavior.
4. Use WebKit as well as Chromium. Desktop WebKit with an iPhone descriptor is
   **not** a physical iPhone, and its WebGPU support may differ. Report unsupported
   GPU experience separately from actual GPU frame/performance checks.
5. Leave authenticated, record-dependent and consequential flows explicitly
   unverified when access/data is unavailable. Do not manufacture success through
   fixture auth or submit/sign/publish during a read-only visual audit.
6. Finish with physical iPhone Safari acceptance for browser chrome changes, notch/
   home-indicator safe areas, keyboard/zoom, VoiceOver, scrolling and GPU/battery
   behavior. A desktop emulation pass cannot establish those properties.

## Consumption boundary

Rebuild the independent shared showcase with
`mix run ../scripts/render-structure-showcase.exs` from `regent_ui/`.
Each product manager separately runs its shared-asset staging/build and checks the
actual route when adopting the change. Editing shared source does not update a
consumer's previously copied vendor CSS or a deployed site. Do not rebuild, migrate
or restart product servers during a read-only product audit.

## References

- [Apple HIG — accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple HIG — layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [WebKit — viewport and safe-area behavior](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [mobile-ios-design skill](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/mobile-ios-design/SKILL.md) — adapt the accessibility/layout principles, not its SwiftUI implementation or generic visual theme.
