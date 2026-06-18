import { type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta, staggerFaceReveal } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "terrain-heightmap",
  name: "Terrain Heightmap",
  class: "data",
  tags: ["chart", "surface", "analytics"],
  productUse: "Activity and network visualizations; a voxel terrain whose elevation is the data.",
  budget: { maxFaces: 1200, maxMountMs: 60, idleLoop: "none" },
}

interface TerrainData {
  grid: number[][]
}

const MAX_SIZE = 8
const MAX_HEIGHT = 8

const DEMO_GRID: number[][] = [
  [1, 2, 2, 3, 2, 1],
  [2, 3, 4, 4, 3, 2],
  [2, 4, 6, 5, 4, 2],
  [3, 4, 5, 6, 4, 3],
  [2, 3, 4, 4, 3, 2],
  [1, 2, 2, 3, 2, 1],
]

function normalizeData(data: unknown): TerrainData {
  const candidate = data as Partial<TerrainData> | undefined
  if (!Array.isArray(candidate?.grid)) return { grid: DEMO_GRID }
  const grid = candidate.grid
    .slice(0, MAX_SIZE)
    .map((row) =>
      Array.isArray(row)
        ? row
            .slice(0, MAX_SIZE)
            .map((value) =>
              typeof value === "number" && Number.isFinite(value)
                ? Math.max(0, Math.min(MAX_HEIGHT, Math.round(value)))
                : 0,
            )
        : [],
    )
    .filter((row) => row.length > 0)
  return grid.length > 0 ? { grid } : { grid: DEMO_GRID }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 11, camera: { type: "oblique", angle: 315, distance: 14 } })

  el.classList.add("rg-collateral-host")
  let animation: JSAnimation | null = null

  const columnColor = (height: number): string => {
    if (height <= 2) return shade(palette.olive, 0.12)
    if (height <= 4) return palette.charcoal
    return palette.ink
  }

  function render(data: TerrainData, animateIn: boolean): void {
    animation?.cancel()
    animation = null

    const rows = data.grid.length
    const cols = Math.max(...data.grid.map((row) => row.length))
    const x0 = -Math.floor(cols / 2)
    const z0 = -Math.floor(rows / 2)

    engine.clear()
    engine.batch(() => {
      engine.addGeometry({
        type: "box",
        position: [x0, 1, z0],
        size: [cols, 1, rows],
        meta: { part: "base" },
        style: voxelTone(shade(palette.olive, -0.1)),
      })
      data.grid.forEach((row, z) => {
        row.forEach((value, x) => {
          if (value <= 0) return
          const peak = value >= 7
          const bodyHeight = peak ? value - 1 : value
          const cell = `${x}-${z}`
          if (bodyHeight > 0) {
            engine.addGeometry({
              type: "box",
              position: [x0 + x, 1 - bodyHeight, z0 + z],
              size: [1, bodyHeight, 1],
              meta: { cell },
              style: voxelTone(columnColor(value)),
            })
          }
          if (peak) {
            engine.addGeometry({
              type: "box",
              position: [x0 + x, 1 - value, z0 + z],
              size: [1, 1, 1],
              meta: { cell },
              style: voxelTone(palette.gold),
            })
          }
        })
      })
    })

    mountSvgMarkup(el, engine.toSVG({ padding: 16 }))

    if (animateIn && !reducedMotion) {
      animation = staggerFaceReveal(facesByMeta(el, "cell"), { from: "center", delayStep: 5, duration: 380 })
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
