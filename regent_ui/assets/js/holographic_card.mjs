// The holographic card's foil, drawn with WebGPU through vgpu. The consuming
// application pins `vgpu` 0.3.1, mounts this renderer on the card's canvas and
// owns every browser concern: when to load it, the frame loop, reduced motion,
// device loss and the pointer. This module only draws.
//
// Adapted from the Vercel vgpu "Holographic Card" example. The material — the
// diffraction grating, the pearlescence, the etched contours, the grain and the
// guide marks — is that example's; the card silhouette, its lettering, its
// projection and its triangular fractal engraving were left behind, because
// here the canvas is the card face, the application's own markup carries the
// text and the engraved mark is the Regents crown. See THIRD_PARTY_NOTICES.md
// at the repository root.
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
}
@group(0) @binding(0) var<uniform> params: Params;

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

// Approximate visible wavelengths in micrometers with smooth display RGB responses.
fn wavelengthColor(wavelength: f32) -> vec3f {
  let response = (vec3f(wavelength) - vec3f(0.610, 0.545, 0.460)) / vec3f(0.045, 0.038, 0.032);
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  return exp(-0.5 * response * response) * visible;
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

// Broad, art-directed pearlescence underneath the finer diffraction detail.
fn pearlColor(phase: f32) -> vec3f {
  return vec3f(0.55, 0.52, 0.64) + vec3f(0.43, 0.40, 0.34)
    * cos(6.2831853 * (phase + vec3f(0.05, 0.38, 0.63)));
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

struct Engraving {
  coverage: f32,
  across: vec2f,
}

// Recursive square engraving inside one block of the crown, with screen-space
// antialiasing at every scale: each level lifts out the middle ninth.
fn carpetEngraving(local: vec2f, half: f32, aa: f32) -> Engraving {
  var q = local;
  var cellHalf = half;
  for (var level = 0; level < 3; level++) {
    let third = cellHalf / 3.0;
    let cell = clamp(round(q / (2.0 * third)), vec2f(-1), vec2f(1));
    if (all(cell == vec2f(0))) {
      // Each removed central square leaves a fine foil border.
      return Engraving(stroke(third - max(abs(q.x), abs(q.y)), 0.0008, aa * 0.65), squareGrooves(q));
    }
    q -= cell * 2.0 * third;
    cellHalf = third;
  }
  let leafEdge = cellHalf - max(abs(q.x), abs(q.y));
  return Engraving(stroke(leafEdge, 0.0006, aa * 0.5) * 0.65, squareGrooves(q));
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
  var color = vec3f(0.062, 0.068, 0.078) + 0.008 * (0.9 - p.y);
  // Fine, surface-locked grain catches the grazing reflection without animated static.
  color += noise * (0.022 + light * 0.085);
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
  let inside = 1.0 - smoothstep(-aa * 1.5, -aa * 0.5, crown.edge);
  let outside = smoothstep(aa * 0.5, aa * 1.5, crown.band - bandWidth);

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
  let engraving = carpetEngraving(crown.local, cellHalf, aa);
  let innerDiffraction = diffraction(engraving.across, lightAndView, 1.35) * illumination;
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let outerPearl = pearlColor(pearlPhase);
  let innerPearl = pearlColor(pearlPhase + dot(engraving.across, lightAndView) * 0.32 + 0.12);
  // Color washes over the material between etched lines, with a narrower silver
  // flash moving through it. Both layers respect the empty gap between outlines.
  let pearl = outerPearl * outside + innerPearl * inside;
  color += pearl * light * 0.24;
  color += (pearl * 0.5 + vec3f(0.5) * (inside + outside)) * glint * spotlight * hover * 0.12;
  let sparkle = pow(max(noise + 0.5, 0.0), 24.0) * glint * spotlight * hover;
  color += pearl * sparkle * 0.22;
  let outerFoil = vec3f(0.12, 0.14, 0.18) + outerPearl * 0.65 + outerDiffraction * 0.12;
  let innerFoil = vec3f(0.12, 0.14, 0.18) + innerPearl * 0.65 + innerDiffraction * 0.12;
  color += (contours * 0.65 * outside * outerFoil + engraving.coverage * inside * innerFoil) * reveal;

  // A delicate spectral echo stays clipped to the same engraving regions.
  let foilOffset = vec2f(0.007, -0.004) + params.tilt * 0.012;
  let foilPoint = p - foilOffset;
  let foilMark = mark - foilOffset;
  let foilPhase = etchedPhase(foilPoint);
  let foilLines = stroke(sin(foilPhase), 0.025, min(fwidth(foilPhase), 1.0));
  let foilEngraving = carpetEngraving(crownHit(foilMark, pitch, cellHalf).local, cellHalf, aa);
  let echoDiffraction = diffraction(foilEngraving.across, lightAndView, 1.35) * illumination;
  color += (foilLines * 0.65 * outside * (outerPearl + outerDiffraction * 0.2)
    + foilEngraving.coverage * inside * (innerPearl + echoDiffraction * 0.2)) * reveal * 0.22;
  // A fine line traces the band's outer edge around the crown's silhouette.
  let foilAcross = squareGrooves(crown.local);
  let foilTint = outerPearl * 0.8 + vec3f(0.2) + diffraction(foilAcross, lightAndView, 1.65) * illumination * 0.15;
  color += stroke(crown.band - bandWidth, 0.0007, aa * 0.5) * foilTint * hover * (0.12 + light * 0.5);

  // Sparse microdots and registration ticks emerge in the surrounding foil.
  let grid = (fract((p + 1.0) * 20.0) - 0.5) / 20.0;
  let dots = stroke(length(grid), 0.0008, aa * 0.4);
  color += dots * outside * reveal * 0.17;
  let guide = abs(p) - halfSize + vec2f(0.15, 0.13);
  let horizontal = stroke(guide.y, 0.0006, aa * 0.5) * (1.0 - smoothstep(0.012, 0.017, abs(guide.x)));
  let vertical = stroke(guide.x, 0.0006, aa * 0.5) * (1.0 - smoothstep(0.012, 0.017, abs(guide.y)));
  color += max(horizontal, vertical) * hover * (0.12 + light * 0.22);

  // Always-visible outline of every square: its baseline contrast does not
  // depend on hover or light.
  let outline = stroke(crown.edge, 0.0012, aa * 0.65);
  color = mix(color, vec3f(0.29, 0.32, 0.36) + tint * light * 0.16, outline);
  return vec4f(color, 1);
}
`

/** How far each eased value travels toward its target per frame. */
const EASE = {tilt: 0.14, pointer: 0.18, hover: 0.12}

const approach = (current, target, rate, snap) =>
  snap ? target : current + (target - current) * rate

/**
 * @param {HTMLCanvasElement} canvas
 * @param {readonly [number, number]} size
 * @param {() => void} onDeviceLost
 */
export async function createHolographicCardRenderer(canvas, size, onDeviceLost) {
  const gpu = await init()
  let disposed = false
  // A device this call created and could not finish equipping is still this call's
  // to release; the caller only ever learns that the renderer did not arrive.
  const {canvasSurface, foil} = await equip(gpu, canvas, size).catch(error => {
    gpu.dispose()
    throw error
  })
  // Disposing the renderer destroys the device, which resolves the same promise.
  void gpu.gpu.lost.then(() => {
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
      foil.set({
        params: {
          resolution: canvasSurface.size,
          tilt: state.tilt,
          pointer: state.pointer,
          hover: state.hover,
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
      gpu.dispose()
    },
    /** The pointer at (x, y), as fractions of the card's width and height. */
    point(x, y) {
      const px = Math.min(1, Math.max(-1, (x - 0.5) * 2))
      const py = Math.min(1, Math.max(-1, (y - 0.5) * 2))
      target.pointer = [px, py]
      target.tilt = [px * HOLOGRAPHIC_CARD_TILT, -py * HOLOGRAPHIC_CARD_TILT]
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
