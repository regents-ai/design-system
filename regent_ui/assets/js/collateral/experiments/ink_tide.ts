// Face budget: bounds 29x5x7 = 1015 cells; even a fully-filled slab exposes only
// the shell: ~203 top faces + ~180 flank faces ≈ 400 faces < 2500.
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "ink-tide",
  name: "Ink Tide",
  class: "ambient",
  tags: ["footer", "wave", "procedural"],
  productUse: "Footer ambient strip; a low voxel tide that slowly swells and recedes.",
  budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "raf" },
}

const BOUNDS: [[number, number, number], [number, number, number]] = [
  [-14, 0, -3],
  [14, 4, 3],
]
const FRAME_MS = 100 // ~10fps
const PHASE_STEP = 0.14

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 12,
    camera: { type: "oblique", angle: 315, distance: 14 },
  })

  let phase = 0
  const surfaceAt = (x: number, z: number): number => {
    const swell = 2 + 1.5 * Math.sin(x * 0.42 + z * 0.55 + phase) * Math.cos(z * 0.3 - phase * 0.6)
    return Math.min(4, Math.max(0, Math.round(swell)))
  }

  const tideStyle: Record<string, unknown> = {
    top: (x: number, y: number, z: number) => {
      const crest = y === surfaceAt(x, z)
      return crest
        ? { fill: palette.paper, stroke: shade(palette.gold, -0.1), strokeWidth: 0.5 }
        : { fill: shade(palette.ink, 0.08), stroke: shade(palette.ink, -0.3), strokeWidth: 0.4 }
    },
    default: (x: number, y: number, z: number) => {
      const depth = Math.max(0, y - surfaceAt(x, z))
      return {
        fill: shade(palette.ink, -0.12 * depth - 0.08),
        stroke: shade(palette.ink, -0.4),
        strokeWidth: 0.4,
      }
    },
  }

  const renderTide = () =>
    engine.renderTest({
      bounds: BOUNDS,
      test: (x: number, y: number, z: number) => y >= surfaceAt(x, z),
      style: tideStyle,
    })

  el.classList.add("rg-collateral-host")
  const frame = document.createElement("div")
  frame.className = "rg-collateral-drift-frame"
  el.replaceChildren(frame)

  // Fixed viewBox from the max-amplitude envelope so the strip never jumps.
  const envelopeFaces = engine.renderTest({
    bounds: BOUNDS,
    test: () => true,
    style: tideStyle,
  })
  const envelope = engine.getBounds(16, envelopeFaces)
  const viewBox: [number, number, number, number] = [envelope.x, envelope.y, envelope.w, envelope.h]

  const renderFrame = (): void => {
    const faces = renderTide()
    mountSvgMarkup(frame, engine.toSVG({ faces, viewBox }))
  }

  renderFrame()

  let rafId: number | null = null
  let lastTick = 0

  const tick = (now: number): void => {
    if (now - lastTick >= FRAME_MS) {
      lastTick = now
      phase += PHASE_STEP
      renderFrame()
    }
    rafId = requestAnimationFrame(tick)
  }

  const startLoop = (): void => {
    if (reducedMotion || rafId !== null) return
    lastTick = 0
    rafId = requestAnimationFrame(tick)
  }
  const stopLoop = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  startLoop()

  return {
    cleanup() {
      stopLoop()
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      stopLoop()
    },
    resume() {
      startLoop()
    },
  }
}
