import { createTimeline, stagger, utils, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "crown-coronation",
  name: "Coronation",
  class: "celebration",
  tags: ["onboarding", "complete", "crown"],
  productUse: "Onboarding and formation complete; a crown assembles from falling voxels with a gold sheen.",
  budget: { maxFaces: 1000, maxMountMs: 50, idleLoop: "none" },
}

/** The crown sigil on a 7-column grid: [x, height] pairs. */
const CROWN_COLUMNS: Array<[number, number]> = [
  [0, 3],
  [1, 2],
  [2, 4],
  [3, 3],
  [4, 4],
  [5, 2],
  [6, 3],
]

const REST_STROKE_OPACITY = 0.35
const FALL_FROM_PX = -30

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 15, camera: { type: "oblique", angle: 315, distance: 12 } })

  const crownStyle = (color: string): Record<string, unknown> => {
    const tone = voxelTone(color) as Record<string, Record<string, unknown>>
    const styled: Record<string, unknown> = {}
    for (const [face, fill] of Object.entries(tone)) {
      styled[face] = { ...fill, stroke: palette.gold, strokeWidth: 0.5, strokeOpacity: REST_STROKE_OPACITY }
    }
    return styled
  }

  // Voxel index runs column by column, top voxel first, so the stagger falls in
  // column order with each column landing top-to-bottom.
  let voxelIndex = 0
  engine.batch(() => {
    CROWN_COLUMNS.forEach(([x, height], col) => {
      for (let y = height - 1; y >= 0; y -= 1) {
        engine.addGeometry({
          type: "box",
          position: [x - 3, -y, 0],
          size: [1, 1, 1],
          meta: { vox: voxelIndex, col },
          style: crownStyle(y === height - 1 ? palette.gold : palette.ink),
        })
        voxelIndex += 1
      }
    })
  })

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 24 }))

  const fallOrder: SVGElement[] = []
  for (let vox = 0; vox < voxelIndex; vox += 1) {
    fallOrder.push(...facesByMeta(el, "vox", String(vox)))
  }
  const columnFaces = CROWN_COLUMNS.map((_, col) => facesByMeta(el, "col", String(col)))

  let timeline: Timeline | null = null
  let autoPlayId: number | null = null

  function play(): void {
    if (reducedMotion) return
    timeline?.cancel()
    utils.set(fallOrder, { translateY: FALL_FROM_PX, opacity: 0, strokeOpacity: REST_STROKE_OPACITY })

    const fallDuration = 460
    const fallStep = 9
    const fallEnd = fallDuration + fallStep * Math.max(0, fallOrder.length - 1)
    const next = createTimeline()
    next.add(
      fallOrder,
      {
        translateY: [FALL_FROM_PX, 0],
        opacity: [0, 1],
        duration: fallDuration,
        delay: stagger(fallStep),
        ease: "outBack",
      },
      0,
    )
    columnFaces.forEach((faces, col) => {
      next.add(
        faces,
        { strokeOpacity: [REST_STROKE_OPACITY, 1, REST_STROKE_OPACITY], duration: 340, ease: "inOutSine" },
        fallEnd + col * 55,
      )
    })
    timeline = next
  }

  if (!reducedMotion) {
    utils.set(fallOrder, { opacity: 0 })
    autoPlayId = window.setTimeout(() => {
      autoPlayId = null
      play()
    }, 400)
  }

  return {
    cleanup() {
      if (autoPlayId !== null) {
        window.clearTimeout(autoPlayId)
        autoPlayId = null
      }
      timeline?.cancel()
      timeline = null
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      timeline?.pause()
    },
    resume() {
      timeline?.play()
    },
    ...(reducedMotion ? {} : { play }),
  }
}
