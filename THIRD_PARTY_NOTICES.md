# Third-party notices

Third-party material redistributed inside this repository, and the terms it arrives under.

## vgpu — holographic card foil

The foil drawn by `regent_ui/assets/js/holographic_card.mjs` is adapted from the
"Holographic Card" example published with Vercel's `vgpu` project.

- Project: `vercel-labs/vgpu` — https://github.com/vercel-labs/vgpu
- Example: https://vgpu.sh/examples/holographic-card, as published on 2026-09-19
- License: MIT

### What was taken

The fragment shader's material, kept line for line where it could be: the reflection
grating approximation (after the diffraction-order model in GPU Gems chapter 8, Jos Stam),
the pearlescent wash, the surface-locked grain, the warped etched contours, the recursive
triangular engraving with its grooves, the spectral echo, the microdots and registration
ticks, and the sweep, glint and spotlight that reveal them under the pointer. The renderer's
shape — a `vgpu` surface, one `effect`, the tilt/pointer/hover parameters and their easing —
follows the example's `renderer.ts` and `scene.ts`.

### What was left behind

The React wrapper, the projected card silhouette with its rounded box, halo and shadow,
the baked Geist lettering and its texture, the cross mark and the rim light. Here the
canvas is the card face itself and the consuming application's markup carries the text,
so the engraved mark moved to the right of a wide face and the guide ticks follow the
face's own edges.

The consumer pins `vgpu` at exactly `0.3.1`; this package ships no copy of it.

### License

```
MIT License

Copyright (c) 2025 Vercel, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
