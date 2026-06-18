// Face budget: 3x3x5 column = 45 voxels; occlusion leaves the outer shell only:
// ~9 top + ~30 side faces per visible flank ≈ 70 faces < 400.
import { createTimeline, stagger, utils, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "stack-build-loader",
  name: "Stack Build Loader",
  class: "loading",
  tags: ["loading", "indeterminate", "loop"],
  productUse: "Indeterminate loading; a small voxel column builds and unbuilds in a calm loop.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "raf" },
}

const STEPS = 5
const STEP_MS = 200

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 16,
    camera: { type: "oblique", angle: 315, distance: 12 },
  })

  for (let step = 0; step < STEPS; step += 1) {
    engine.addGeometry({
      type: "box",
      position: [-1, -step, -1],
      size: [3, 1, 3],
      meta: { step },
      style: voxelTone(step === STEPS - 1 ? palette.gold : palette.ink),
    })
  }

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 20 }))

  let timeline: Timeline | null = null

  if (!reducedMotion) {
    const stepFaces: SVGElement[][] = []
    for (let step = 0; step < STEPS; step += 1) {
      stepFaces.push(facesByMeta(el, "step", String(step)))
    }
    stepFaces.forEach((faces: SVGElement[]) => utils.set(faces, { opacity: 0 }))

    timeline = createTimeline({ loop: true })
    // Build bottom-up.
    for (let step = 0; step < STEPS; step += 1) {
      timeline.add(
        stepFaces[step],
        { opacity: [0, 1], duration: STEP_MS, delay: stagger(8), ease: "outQuad" },
        step * STEP_MS,
      )
    }
    // Brief hold, then unbuild top-down.
    const unbuildStart = STEPS * STEP_MS + 200
    for (let i = 0; i < STEPS; i += 1) {
      timeline.add(
        stepFaces[STEPS - 1 - i],
        { opacity: [1, 0], duration: STEP_MS, delay: stagger(8), ease: "inQuad" },
        unbuildStart + i * STEP_MS,
      )
    }
  }

  return {
    cleanup() {
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
  }
}
