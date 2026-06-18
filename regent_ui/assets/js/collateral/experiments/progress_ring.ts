// Face budget: 16 isolated ring voxels x 3 visible faces = ~48 faces < 400.
import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "progress-ring",
  name: "Progress Ring",
  class: "loading",
  tags: ["loading", "determinate", "ring"],
  productUse: "Determinate progress; a ring of voxels fills clockwise toward completion.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

const SEGMENTS = 16
const RADIUS = 5

function normalizeProgress(data: unknown): number {
  const candidate = (data as { progress?: unknown } | undefined)?.progress
  const progress = typeof candidate === "number" && Number.isFinite(candidate) ? candidate : 0.7
  return Math.min(1, Math.max(0, progress))
}

function segmentPosition(index: number): [number, number, number] {
  const angle = (index / SEGMENTS) * Math.PI * 2 - Math.PI / 2
  return [Math.round(Math.cos(angle) * RADIUS), 0, Math.round(Math.sin(angle) * RADIUS)]
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 13,
    camera: { type: "oblique", angle: 315, distance: 14 },
  })

  el.classList.add("rg-collateral-host")
  let animation: JSAnimation | null = null
  let filled = 0

  const ghostStyle: Record<string, unknown> = {
    default: {
      fill: palette.olive,
      fillOpacity: 0.25,
      stroke: shade(palette.olive, -0.15),
      strokeOpacity: 0.45,
      strokeWidth: 0.4,
    },
  }

  function render(progress: number): void {
    animation?.cancel()
    animation = null

    const nextFilled = Math.round(progress * SEGMENTS)
    engine.clear()
    for (let seg = 0; seg < SEGMENTS; seg += 1) {
      engine.addGeometry({
        type: "box",
        position: segmentPosition(seg),
        size: [1, 1, 1],
        meta: { seg },
        style: seg < nextFilled ? voxelTone(palette.gold) : ghostStyle,
      })
    }
    mountSvgMarkup(el, engine.toSVG({ padding: 16 }))

    if (!reducedMotion && nextFilled > filled) {
      const newFaces: SVGElement[] = []
      for (let seg = filled; seg < nextFilled; seg += 1) {
        newFaces.push(...facesByMeta(el, "seg", String(seg)))
      }
      // Host CSS gives faces transform-box: fill-box, so scale stays local.
      animation = animate(newFaces, {
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 360,
        delay: stagger(40),
        ease: "outBack",
      })
    }
    filled = nextFilled
  }

  render(normalizeProgress(ctx.data))

  return {
    cleanup() {
      animation?.cancel()
      animation = null
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      animation?.pause()
    },
    resume() {
      animation?.play()
    },
    update(data: unknown) {
      render(normalizeProgress(data))
    },
  }
}
