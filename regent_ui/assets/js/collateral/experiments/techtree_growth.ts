import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "techtree-growth",
  name: "Tree Growth",
  class: "data",
  tags: ["tree", "progress", "research"],
  productUse: "Research-tree progress; branches assemble voxel by voxel as nodes unlock.",
  budget: { maxFaces: 1200, maxMountMs: 60, idleLoop: "none" },
}

interface GrowthData {
  unlocked: number
  total: number
}

interface NodeSlot {
  pos: [number, number, number]
  kind: "branch" | "leaf"
}

/** Deterministic node slots: a lower branch ring, then an upper fan above the trunk. */
const SLOTS: NodeSlot[] = [
  { pos: [-1, -2, 0], kind: "branch" },
  { pos: [1, -2, 0], kind: "branch" },
  { pos: [0, -2, -1], kind: "branch" },
  { pos: [0, -2, 1], kind: "branch" },
  { pos: [-2, -2, 0], kind: "leaf" },
  { pos: [2, -2, 0], kind: "leaf" },
  { pos: [0, -2, -2], kind: "leaf" },
  { pos: [0, -2, 2], kind: "leaf" },
  { pos: [0, -4, 0], kind: "branch" },
  { pos: [-1, -4, 0], kind: "branch" },
  { pos: [1, -4, 0], kind: "branch" },
  { pos: [-1, -5, 0], kind: "leaf" },
  { pos: [1, -5, 0], kind: "leaf" },
  { pos: [0, -5, -1], kind: "leaf" },
  { pos: [0, -5, 1], kind: "leaf" },
  { pos: [0, -6, 0], kind: "leaf" },
]

function normalizeData(data: unknown): GrowthData {
  const candidate = data as Partial<GrowthData> | undefined
  const total =
    typeof candidate?.total === "number" && Number.isFinite(candidate.total)
      ? Math.max(1, Math.min(SLOTS.length, Math.round(candidate.total)))
      : SLOTS.length
  const unlocked =
    typeof candidate?.unlocked === "number" && Number.isFinite(candidate.unlocked)
      ? Math.max(0, Math.min(total, Math.round(candidate.unlocked)))
      : Math.min(9, total)
  return { unlocked, total }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 13, camera: { type: "oblique", angle: 315, distance: 14 } })

  el.classList.add("rg-collateral-host")
  let animation: JSAnimation | null = null
  let currentUnlocked = 0

  const ghostStyle = (fill: string): Record<string, unknown> => ({
    default: {
      fill,
      fillOpacity: 0.25,
      stroke: shade(palette.ink, 0.2),
      strokeOpacity: 0.4,
      strokeWidth: 0.4,
    },
  })

  function render(data: GrowthData): void {
    animation?.cancel()
    animation = null

    engine.clear()
    engine.batch(() => {
      engine.addGeometry({
        type: "box",
        position: [-2, 1, -2],
        size: [5, 1, 5],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.2)),
      })
      engine.addGeometry({
        type: "box",
        position: [0, -3, 0],
        size: [1, 4, 1],
        meta: { part: "trunk" },
        style: voxelTone(palette.charcoal),
      })
      SLOTS.slice(0, data.total).forEach((slot, node) => {
        const unlocked = node < data.unlocked
        const color = slot.kind === "leaf" ? palette.gold : palette.ink
        engine.addGeometry({
          type: "box",
          position: slot.pos,
          size: [1, 1, 1],
          meta: { node },
          style: unlocked ? voxelTone(color) : ghostStyle(color),
          opaque: unlocked,
        })
      })
    })

    mountSvgMarkup(el, engine.toSVG({ padding: 18 }))
  }

  function assemble(from: number, to: number): void {
    const rising: SVGElement[] = []
    for (let node = from; node < to; node += 1) {
      rising.push(...facesByMeta(el, "node", String(node)))
    }
    if (rising.length === 0) return
    for (const face of rising) {
      face.style.setProperty("transform-box", "fill-box")
      face.style.setProperty("transform-origin", "50% 50%")
    }
    animation = animate(rising, {
      opacity: [0, 1],
      scale: [0.4, 1],
      duration: 480,
      delay: stagger(20),
      ease: "outBack",
    })
  }

  const first = normalizeData(ctx.data)
  currentUnlocked = first.unlocked
  render(first)
  if (!reducedMotion) assemble(0, first.unlocked)

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
      const next = normalizeData(data)
      const previousUnlocked = currentUnlocked
      currentUnlocked = next.unlocked
      render(next)
      if (!reducedMotion && next.unlocked > previousUnlocked) {
        assemble(previousUnlocked, next.unlocked)
      }
    },
  }
}
