import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "voxel-bar-relay",
  name: "Voxel Bar Relay",
  class: "data",
  tags: ["chart", "dashboard", "bars"],
  productUse: "Dashboard stats; a 3D bar chart whose columns grow and reorder as numbers change.",
  budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
}

interface BarData {
  values: number[]
  labels?: string[]
}

const MAX_BAR_HEIGHT = 9

function normalizeData(data: unknown): BarData {
  const candidate = data as Partial<BarData> | undefined
  const values = Array.isArray(candidate?.values)
    ? candidate.values.filter((value): value is number => typeof value === "number" && value >= 0).slice(0, 12)
    : [4, 9, 6, 12, 7, 10, 5]
  return { values, labels: candidate?.labels }
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

  const barColor = (index: number, count: number): string => {
    if (count <= 1) return palette.gold
    const t = index / (count - 1)
    return t < 0.34 ? palette.charcoal : t < 0.67 ? palette.ink : palette.gold
  }

  function render(data: BarData, animateIn: boolean): void {
    animation?.cancel()
    animation = null

    const max = Math.max(...data.values, 1)
    engine.clear()
    engine.batch(() => {
      const count = data.values.length
      const startX = -count
      engine.addGeometry({
        type: "box",
        position: [startX - 1, 1, -1],
        size: [count * 2 + 1, 1, 4],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.25)),
      })
      data.values.forEach((value, index) => {
        const height = Math.max(1, Math.round((value / max) * MAX_BAR_HEIGHT))
        engine.addGeometry({
          type: "box",
          position: [startX + index * 2, 1 - height, 0],
          size: [1, height, 2],
          meta: { part: "bar", bar: index },
          style: voxelTone(barColor(index, count)),
        })
      })
    })

    mountSvgMarkup(el, engine.toSVG({ padding: 14 }))

    if (animateIn && !reducedMotion) {
      const bars = facesByMeta(el, "bar")
      animation = animate(bars, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 460,
        delay: stagger(8),
        ease: "outQuart",
      })
    }
  }

  render(normalizeData(ctx.data), true)

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
      render(normalizeData(data), true)
    },
  }
}
