import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta, staggerFaceReveal } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "launch-pipeline-track",
  name: "Pipeline Track",
  class: "data",
  tags: ["progress", "stages", "launch"],
  productUse: "Multi-stage progress; a token advances along an isometric track, one station per stage.",
  budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
}

interface PipelineData {
  stage: number
  stages: number
  labels?: string[]
}

const TILE = 12
const SPACING = 4

function normalizeData(data: unknown): PipelineData {
  const candidate = data as Partial<PipelineData> | undefined
  const stages =
    typeof candidate?.stages === "number" && Number.isFinite(candidate.stages)
      ? Math.max(2, Math.min(8, Math.round(candidate.stages)))
      : 5
  const stage =
    typeof candidate?.stage === "number" && Number.isFinite(candidate.stage)
      ? Math.max(1, Math.min(stages, Math.round(candidate.stage)))
      : Math.min(3, stages)
  return { stage, stages, labels: candidate?.labels }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: TILE, camera: { type: "isometric", distance: 16 } })

  el.classList.add("rg-collateral-host")
  let animations: JSAnimation[] = []
  let currentStage = 0

  const stationX = (index: number, stages: number): number =>
    index * SPACING - ((stages - 1) * SPACING + 2) / 2

  const ghostStyle = (fill: string): Record<string, unknown> => ({
    default: {
      fill,
      fillOpacity: 0.3,
      stroke: shade(palette.ink, 0.2),
      strokeOpacity: 0.4,
      strokeWidth: 0.4,
    },
  })

  function render(data: PipelineData): void {
    animations.forEach((animation) => animation.cancel())
    animations = []

    const current = data.stage - 1
    engine.clear()
    engine.batch(() => {
      for (let index = 0; index < data.stages; index += 1) {
        const sx = stationX(index, data.stages)
        const done = index <= current
        engine.addGeometry({
          type: "box",
          position: [sx, 1, -1],
          size: [2, 1, 2],
          meta: { part: "station", station: index },
          style: done ? voxelTone(palette.charcoal) : ghostStyle(palette.charcoal),
          opaque: done,
        })
        if (done) {
          engine.addGeometry({
            type: "box",
            position: [sx, 0, -1],
            size: [2, 1, 2],
            scale: [1, 0.3, 1],
            scaleOrigin: [0.5, 1, 0.5],
            opaque: false,
            meta: { part: "cap", station: index },
            style: voxelTone(palette.gold),
          })
        }
        if (index < data.stages - 1) {
          engine.addGeometry({
            type: "box",
            position: [sx + 2, 1, -1],
            size: [2, 1, 1],
            meta: { part: "rail", rail: index },
            style: index < current ? voxelTone(shade(palette.ink, -0.1)) : ghostStyle(palette.ink),
            opaque: index < current,
          })
        }
      }
      engine.addGeometry({
        type: "box",
        position: [stationX(current, data.stages), -2, -1],
        size: [1, 2, 1],
        meta: { part: "token" },
        style: voxelTone(palette.gold),
      })
    })

    mountSvgMarkup(el, engine.toSVG({ padding: 18 }))
  }

  const first = normalizeData(ctx.data)
  currentStage = first.stage
  render(first)
  if (!reducedMotion) {
    const reveal = staggerFaceReveal(facesByMeta(el, "part"), { delayStep: 6, duration: 360 })
    if (reveal) animations.push(reveal)
  }

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations = []
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      animations.forEach((animation) => animation.pause())
    },
    resume() {
      animations.forEach((animation) => animation.play())
    },
    update(data: unknown) {
      const next = normalizeData(data)
      const previousStage = currentStage
      currentStage = next.stage
      render(next)
      if (reducedMotion || next.stage === previousStage) return

      const token = facesByMeta(el, "part", "token")
      const deltaX = (previousStage - next.stage) * SPACING * TILE
      animations.push(
        animate(token, {
          translateX: [deltaX, 0],
          duration: 600,
          ease: "outQuart",
        }),
      )

      if (next.stage > previousStage) {
        const lit: SVGElement[] = []
        for (let index = previousStage; index < next.stage; index += 1) {
          lit.push(...facesByMeta(el, "station", String(index)).filter((face) => face.dataset.part === "cap"))
        }
        if (lit.length > 0) {
          animations.push(
            animate(lit, {
              opacity: [0, 1],
              translateY: [-4, 0],
              duration: 420,
              delay: stagger(20),
              ease: "outBack",
            }),
          )
        }
      }
    },
  }
}
