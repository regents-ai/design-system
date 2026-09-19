// The holographic card's foil, drawn with WebGPU through vgpu. The consuming
// application pins `vgpu` 0.3.1, mounts this renderer on the card's canvas and
// owns every browser concern: when to load it, the frame loop, reduced motion,
// device loss and the pointer. This module only draws.
//
// Adapted from the Vercel vgpu "Holographic Card" example. The material — the
// diffraction grating, the pearlescence, the etched contours, the grain and the
// guide marks — is that example's; the card silhouette, its lettering, its
// projection and its triangular fractal engraving were left behind, because
// here the canvas is the surface, the application's own markup carries the
// text and the engraved mark is the Regents crown. A surface is either a
// graphite face, with or without the crown, or the ink of a line drawing the
// application masks the canvas to. See THIRD_PARTY_NOTICES.md at the
// repository root.
import {effect, frame, init, surface} from "vgpu"

/** Radians of tilt at the card's edge, on both axes. */
export const HOLOGRAPHIC_CARD_TILT = 0.2

/** Card units per canvas height; the example's card is 1.82 units tall. */
const CARD_HEIGHT = 1.82

const foilWgsl = /* wgsl */ `
struct Params {
  resolution: vec2f,
  tilt: vec2f,
  pointer: vec2f,
  hover: f32,
  // How much of the light's effect is kept; 1 is the account card's shine.
  shine: f32,
  // The ink colour and, in w, whether the surface is ink rather than a face.
  ink: vec4f,
  // 1 when the face carries the crown.
  crown: f32,
  // 1 when the ink sits on a light ground, so its spectrum is kept deep.
  deep: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

// The foil's spectrum is the site's palette, not the rainbow: tangerine, powder
// blue and platinum, blended around a cycle.
const TANGERINE = vec3f(1.0, 0.357, 0.098);
const POWDER_BLUE = vec3f(0.682, 0.792, 0.804);
const PLATINUM = vec3f(0.898, 0.890, 0.824);

fn brandWeight(phase: f32, centre: f32) -> f32 {
  return max(0.0, 1.0 - abs(fract(phase - centre + 0.5) - 0.5) * 3.0);
}

fn brandColor(phase: f32) -> vec3f {
  return TANGERINE * brandWeight(phase, 0.0)
    + POWDER_BLUE * brandWeight(phase, 1.0 / 3.0)
    + PLATINUM * brandWeight(phase, 2.0 / 3.0);
}

// Visible wavelengths in micrometers, laid across the palette in place of the
// rainbow: tangerine at the long end, powder blue, then platinum at the short.
fn wavelengthColor(wavelength: f32) -> vec3f {
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  let phase = (1.0 - clamp((wavelength - 0.40) / 0.30, 0.0, 1.0)) * (2.0 / 3.0);
  return brandColor(phase) * visible;
}

// Reflection grating approximation: m * wavelength = d * dot(L + V, across).
// L and V point away from the surface; across is perpendicular to the grooves.
// Based on the diffraction-order model in GPU Gems, chapter 8 (Jos Stam).
fn diffraction(across: vec2f, lightAndView: vec2f, spacing: f32) -> vec3f {
  let pathDifference = spacing * abs(dot(lightAndView, across));
  let along = dot(lightAndView, vec2f(-across.y, across.x));
  // Finite, imperfect groove patches broaden the directional reflection.
  let envelope = exp(-along * along / 0.36);
  var reflected = vec3f(0);
  for (var order = 1; order <= 3; order++) {
    let m = f32(order);
    reflected += wavelengthColor(pathDifference / m) / (m * m);
  }
  return reflected * envelope;
}

// Broad pearlescence underneath the finer diffraction detail, in the palette.
fn pearlColor(phase: f32) -> vec3f {
  return brandColor(phase) * 0.92;
}

// Foil ink has only a line's width to show itself, so it takes the palette at full strength.
fn inkColor(phase: f32) -> vec3f {
  return brandColor(phase);
}

fn grain(point: vec2f) -> f32 {
  let p = vec2u(abs(point) * 2400.0);
  var n = (p.x * 1597334677u) ^ (p.y * 3812015801u);
  n = (n ^ (n >> 16u)) * 2246822519u;
  return f32(n & 1023u) / 1023.0 - 0.5;
}

fn etchedPhase(p: vec2f) -> f32 {
  // Warp the surface before tracing contours, so their spacing flows in soft waves.
  let warp = vec2f(
    sin(p.y * 7.0 + sin(p.x * 4.0)) * 0.085,
    sin(p.x * 6.0 - p.y * 3.0) * 0.07
  );
  let q = p + warp - vec2f(0.13, 0.08);
  let radius = length(q * vec2f(1.0, 0.76));
  return radius * 142.0 + sin(atan2(q.y, q.x) * 3.0 + radius * 8.0) * 1.7;
}

// The thirteen squares of the Regents crown, in cell pitches from its centre:
// three points over two full rows, y downward like the page.
const CROWN_CELLS = array<vec2f, 13>(
  vec2f(-2, -1), vec2f(0, -1), vec2f(2, -1),
  vec2f(-2, 0), vec2f(-1, 0), vec2f(0, 0), vec2f(1, 0), vec2f(2, 0),
  vec2f(-2, 1), vec2f(-1, 1), vec2f(0, 1), vec2f(1, 1), vec2f(2, 1)
);

struct CrownHit {
  // Signed distance to the nearest square's edge, negative inside it.
  edge: f32,
  // The same distance measured along the axes, so a widened silhouette keeps
  // its corners and the gaps between neighbouring squares close up.
  band: f32,
  // The point relative to that square's centre.
  local: vec2f,
}

fn crownHit(p: vec2f, pitch: f32, half: f32) -> CrownHit {
  var cells = CROWN_CELLS;
  var hit = CrownHit(1e9, 1e9, vec2f(0));
  for (var i = 0; i < 13; i++) {
    let local = p - cells[i] * pitch;
    let q = abs(local) - half;
    let band = max(q.x, q.y);
    if (band < hit.band) {
      hit = CrownHit(length(max(q, vec2f(0))) + min(band, 0.0), band, local);
    }
  }
  return hit;
}

// Grooves run parallel to the nearest edge of a square.
fn squareGrooves(local: vec2f) -> vec2f {
  if (abs(local.x) > abs(local.y)) {
    return vec2f(1, 0);
  }
  return vec2f(0, 1);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let resolution = max(params.resolution, vec2f(1));
  // The canvas is the card face: card units, y downward like the page, the
  // height the example's card had so the engraving keeps its scale.
  let aspect = resolution.x / resolution.y;
  let halfSize = vec2f(aspect, 1.0) * ${CARD_HEIGHT / 2};
  let p = (uv - 0.5) * halfSize * 2.0;
  let aa = max(length(fwidth(p)), 0.0006);

  // The face is tilted in place, so light and view are read off the tilted plane.
  let sx = sin(params.tilt.y);
  let cx = cos(params.tilt.y);
  let sy = sin(params.tilt.x);
  let cy = cos(params.tilt.x);
  let right = vec3f(cy, 0, -sy);
  let down = vec3f(sy * sx, cx, cy * sx);
  let normal = cross(right, down);
  let eye = vec3f(0, 0, 4.5);
  let hit = right * p.x + down * p.y;

  // Matte graphite remains dark; only the pointer's grazing light reveals the foil.
  let hover = clamp(params.hover, 0.0, 1.0);
  let lightCenter = params.pointer * halfSize;
  let delta = p - lightCenter;
  let sweepDistance = delta.x * 0.72 + delta.y * 0.52 + sin(p.y * 4.0 + p.x * 3.0) * 0.08;
  let bandDistance = sweepDistance / 0.36;
  let lightBand = exp(-bandDistance * bandDistance);
  let glintDistance = sweepDistance / 0.085;
  let glint = exp(-glintDistance * glintDistance);
  let spotlight = exp(-dot(delta * vec2f(1.05, 0.72), delta * vec2f(1.05, 0.72)) * 2.6);
  let light = lightBand * spotlight * hover;
  let lightDirection = normalize(vec3f(lightCenter, 1.2) - hit);
  let viewDirection = normalize(eye - hit);
  let lightAndView = vec2f(dot(lightDirection + viewDirection, right), dot(lightDirection + viewDirection, down));
  let illumination = max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
  let tint = vec3f(0.72, 0.76, 0.8);
  let noise = grain(p + vec2f(2));
  let atRest = vec3f(0.062, 0.068, 0.078) + 0.008 * (0.9 - p.y) + noise * 0.022;
  var color = atRest;
  // Fine, surface-locked grain catches the grazing reflection without animated static.
  color += noise * light * 0.085;
  color += light * (vec3f(0.045) + tint * 0.065);

  // The engraved mark is the Regents crown in the proportions of the flat brand
  // mark (34-unit squares on a 36-unit pitch). It stands to the right of a wide
  // card and centred on a narrow one, leaving the left of the face to the
  // application's own content.
  let cellHalf = 0.115;
  let pitch = cellHalf * 2.0 * (36.0 / 34.0);
  let mark = p - vec2f(max(halfSize.x - 0.9, 0.0), 0.0);
  let crown = crownHit(mark, pitch, cellHalf);
  // The surrounding foil keeps a clear graphite band around the whole silhouette.
  let bandWidth = 0.05;
  let inside = (1.0 - smoothstep(-aa * 1.5, -aa * 0.5, crown.edge)) * params.crown;
  let outside = mix(1.0, smoothstep(aa * 0.5, aa * 1.5, crown.band - bandWidth), params.crown);

  // Separate engravings leave a clear graphite gap between the two outlines.
  let contour = etchedPhase(p);
  // Transform screen derivatives back into the card plane: microscopic grooves
  // follow the visible contours, but their 1.65um spacing is independent of zoom.
  let dx = dpdx(p);
  let dy = dpdy(p);
  let gradient = vec2f(dpdx(contour) * dy.y - dpdy(contour) * dx.y, dpdy(contour) * dx.x - dpdx(contour) * dy.x);
  let across = gradient / max(length(gradient), 0.00000001);
  let outerDiffraction = diffraction(across, lightAndView, 1.65) * illumination;
  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let reveal = hover * (0.06 + 0.24 * spotlight + light * 1.15);
  // Each square of the crown is one plain block of foil, grooved along its nearest edge.
  let blockAcross = squareGrooves(crown.local);
  let innerDiffraction = diffraction(blockAcross, lightAndView, 1.35) * illumination;
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let outerPearl = pearlColor(pearlPhase);
  let innerPearl = pearlColor(pearlPhase + dot(blockAcross, lightAndView) * 0.32 + 0.12);
  // Color washes over the material between etched lines, with a narrower silver
  // flash moving through it. Both layers respect the empty gap between outlines.
  let pearl = outerPearl * outside + innerPearl * inside;
  color += pearl * light * 0.24;
  color += (pearl * 0.5 + vec3f(0.5) * (inside + outside)) * glint * spotlight * hover * 0.12;
  let sparkle = pow(max(noise + 0.5, 0.0), 24.0) * glint * spotlight * hover;
  color += pearl * sparkle * 0.22;
  let outerFoil = vec3f(0.12, 0.14, 0.18) + outerPearl * 0.65 + outerDiffraction * 0.12;
  let innerFoil = vec3f(0.12, 0.14, 0.18) + innerPearl * 0.65 + innerDiffraction * 0.12;
  color += (contours * 0.65 * outside * outerFoil + 0.16 * inside * innerFoil) * reveal;

  // A delicate spectral echo stays clipped to the same engraving regions.
  let foilOffset = vec2f(0.007, -0.004) + params.tilt * 0.012;
  let foilPoint = p - foilOffset;
  let foilPhase = etchedPhase(foilPoint);
  let foilLines = stroke(sin(foilPhase), 0.025, min(fwidth(foilPhase), 1.0));
  color += foilLines * 0.65 * outside * (outerPearl + outerDiffraction * 0.2) * reveal * 0.22;
  // A fine line traces the band's outer edge around the crown's silhouette.
  let foilTint = outerPearl * 0.8 + vec3f(0.2) + diffraction(blockAcross, lightAndView, 1.65) * illumination * 0.15;
  color += stroke(crown.band - bandWidth, 0.0007, aa * 0.5) * params.crown * foilTint * hover * (0.12 + light * 0.5);

  // Sparse microdots and registration ticks emerge in the surrounding foil.
  let grid = (fract((p + 1.0) * 20.0) - 0.5) / 20.0;
  let dots = stroke(length(grid), 0.0008, aa * 0.4);
  color += dots * outside * reveal * 0.17;
  let guide = abs(p) - halfSize + vec2f(0.15, 0.13);
  let horizontal = stroke(guide.y, 0.0006, aa * 0.5) * (1.0 - smoothstep(0.012, 0.017, abs(guide.x)));
  let vertical = stroke(guide.x, 0.0006, aa * 0.5) * (1.0 - smoothstep(0.012, 0.017, abs(guide.y)));
  color += max(horizontal, vertical) * hover * (0.12 + light * 0.22);

  color = atRest + (color - atRest) * params.shine;

  // Always-visible outline of every square: its baseline contrast does not
  // depend on hover or light.
  let outline = stroke(crown.edge, 0.0012, aa * 0.65) * params.crown;
  color = mix(color, vec3f(0.29, 0.32, 0.36) + tint * light * 0.16 * params.shine, outline);

  // Ink: the application masks the canvas to a line drawing, so the whole
  // surface is the ink. It rests as the plain ink colour and turns spectral
  // where the light crosses it.
  let inkLight = clamp(light * 1.5 + glint * spotlight * hover * 0.7, 0.0, 1.0) * params.shine;
  let spectrum = inkColor(pearlPhase * 1.4 + sweepDistance * 0.9) * mix(1.0, 0.62, params.deep)
    + vec3f(0.18) * (1.0 - params.deep) + outerDiffraction * 0.3;
  color = mix(color, mix(params.ink.rgb, spectrum, inkLight), params.ink.a);
  return vec4f(color, 1);
}
`

/** The narrowest face, in widths per height, whose crown stands clear of the content beside it. */
const CROWN_BESIDE_ASPECT = 2.4

/** How far each eased value travels toward its target per frame. */
const EASE = {tilt: 0.14, pointer: 0.18, hover: 0.12}

const approach = (current, target, rate, snap) =>
  snap ? target : current + (target - current) * rate

const clamp = (value, limit) => Math.min(limit, Math.max(-limit, value))

// Every surface on a page draws on one device: a page may carry a dozen of
// them, and a browser hands out devices far less freely than canvases. The
// device goes back when the last surface lets go of it.
let lease

function acquireDevice() {
  lease ??= {gpu: init(), surfaces: 0}
  lease.surfaces += 1
  return lease
}

function releaseDevice(held) {
  held.surfaces -= 1
  if (held.surfaces > 0) return
  if (lease === held) lease = undefined
  void held.gpu.then(gpu => gpu.dispose(), () => {})
}

/**
 * The mask that turns a foil canvas into the ink of an inline line drawing:
 * strokes and hatching show the foil, and filled shapes keep hiding the lines
 * behind them, as they do in the drawing itself.
 *
 * @param {SVGSVGElement} drawing
 */
export function holographicInkMask(drawing) {
  const copy = /** @type {SVGSVGElement} */ (drawing.cloneNode(true))
  copy.removeAttribute("id")
  copy.removeAttribute("class")
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  copy.setAttribute("stroke", "#fff")
  for (const shape of copy.querySelectorAll("[fill]")) {
    if (!shape.getAttribute("fill").startsWith("url(")) shape.setAttribute("fill", "#000")
  }
  const viewBox = copy.getAttribute("viewBox")
  const inner = new XMLSerializer().serializeToString(copy)
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><style>*{vector-effect:non-scaling-stroke}</style><mask id="ink" style="mask-type:luminance">${inner}</mask><rect width="100%" height="100%" fill="#fff" mask="url(#ink)"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(mask)}")`
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {readonly [number, number]} size
 * @param {() => void} onDeviceLost
 * @param {{crown?: boolean | "beside", ink?: readonly [number, number, number], tilt?: number, shine?: number}} [look]
 *   `crown` engraves the Regents crown (default true); `"beside"` engraves it only
 *   while the face is wide enough for it to stand clear of the content. `ink` makes the surface
 *   the ink of a masked line drawing, in that resting colour. `tilt` and `shine`
 *   scale the turn and the light against the account card's, which is 1 for both.
 */
export async function createHolographicCardRenderer(canvas, size, onDeviceLost, look = {}) {
  const {crown = true, ink, tilt: tiltScale = 1, shine = 1} = look
  const inkLuminance = ink ? 0.2126 * ink[0] + 0.7152 * ink[1] + 0.0722 * ink[2] : 0
  const held = acquireDevice()
  let disposed = false
  // A lease this call took and could not use is still this call's to give back;
  // the caller only ever learns that the renderer did not arrive.
  const {gpu, canvasSurface, foil} = await held.gpu
    .then(gpu => equip(gpu, canvas, size).then(equipped => ({gpu, ...equipped})))
    .catch(error => {
      if (lease === held) lease = undefined
      releaseDevice(held)
      throw error
    })
  // Disposing the device resolves the same promise, so only a surface still in
  // use reports a loss; the next surface asks for a fresh device.
  void gpu.gpu.lost.then(() => {
    if (lease === held) lease = undefined
    if (!disposed) onDeviceLost()
  })

  const target = {tilt: [0, 0], pointer: [0, 0], hover: 0}
  const state = {tilt: [0, 0], pointer: [0, 0], hover: 0}

  return {
    resize(width, height) {
      canvasSurface.resize([width, height])
    },
    /** Eases every value toward its target; true while something still moved. */
    step(snap) {
      let moved = false
      for (const key of ["tilt", "pointer"]) {
        for (const axis of [0, 1]) {
          const next = approach(state[key][axis], target[key][axis], EASE[key], snap)
          if (Math.abs(next - state[key][axis]) > 0.0005) moved = true
          state[key][axis] = next
        }
      }
      const hover = approach(state.hover, target.hover, EASE.hover, snap)
      if (Math.abs(hover - state.hover) > 0.0005) moved = true
      state.hover = hover
      return moved
    },
    present() {
      const [width, height] = canvasSurface.size
      const room = crown !== "beside" || width / height >= CROWN_BESIDE_ASPECT
      foil.set({
        params: {
          resolution: canvasSurface.size,
          tilt: state.tilt,
          pointer: state.pointer,
          hover: state.hover,
          shine,
          ink: ink ? [...ink, 1] : [0, 0, 0, 0],
          crown: crown && room && !ink ? 1 : 0,
          deep: ink && inkLuminance < 0.5 ? 1 : 0,
        },
      })
      frame(gpu, current => current.pass(canvasSurface, foil))
    },
    async settled() {
      await gpu.gpu.queue.onSubmittedWorkDone()
      await gpu.settled()
    },
    dispose() {
      if (disposed) return
      disposed = true
      canvasSurface.dispose()
      releaseDevice(held)
    },
    /**
     * The pointer, as fractions of two boxes: the card that turns, and the
     * canvas the light falls on. They differ when the foil is only part of the
     * card, and the light may then stand a little outside the canvas.
     */
    point(card, light) {
      const px = clamp((card[0] - 0.5) * 2, 1)
      const py = clamp((card[1] - 0.5) * 2, 1)
      target.tilt = [px * HOLOGRAPHIC_CARD_TILT * tiltScale, -py * HOLOGRAPHIC_CARD_TILT * tiltScale]
      target.pointer = [clamp((light[0] - 0.5) * 2, 1.8), clamp((light[1] - 0.5) * 2, 1.8)]
      target.hover = 1
    },
    /** The pointer has left: the light fades and the face settles flat. */
    rest() {
      target.tilt = [0, 0]
      target.hover = 0
    },
    /** The eased tilt in radians: about the vertical axis, then the horizontal. */
    tilt() {
      return [state.tilt[0], state.tilt[1]]
    },
  }
}

async function equip(gpu, canvas, size) {
  const canvasSurface = surface(gpu, canvas, {
    autoResize: false,
    alphaMode: "opaque",
    label: "holographic-card",
  })
  canvasSurface.resize(size)
  const foil = effect(gpu, foilWgsl, {label: "holographic-card.foil"})
  await foil.compile({colors: [canvasSurface.format]})
  return {canvasSurface, foil}
}
