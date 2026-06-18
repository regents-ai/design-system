import { type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta, staggerFaceReveal } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "checkbox-stack-tick",
  name: "Stack Tick",
  class: "micro",
  tags: ["form", "success", "checkmark"],
  productUse: "Form confirmation; a voxel checkmark that builds in when a step completes.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

/**
 * Tick stroke traced on the ground plane as [x, z] cells: a short descending
 * arm into the corner, then the long rising arm. Ordered along the stroke.
 */
const TICK_PATH: Array<[number, number]> = [
  [-3, 0],
  [-2, 1],
  [-1, 2],
  [0, 1],
  [1, 0],
  [2, -1],
  [3, -2],
]

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 13, camera: { type: "oblique", angle: 315, distance: 12 } })

  engine.batch(() => {
    engine.addGeometry({
      type: "box",
      position: [-3, 1, -3],
      size: [7, 1, 7],
      meta: { part: "plinth" },
      style: voxelTone(shade(palette.olive, 0.2)),
    })
    TICK_PATH.forEach(([x, z], step) => {
      engine.addGeometry({
        type: "box",
        position: [x, 0, z],
        size: [1, 1, 1],
        meta: { part: "tick", step },
        style: voxelTone(palette.gold),
      })
    })
  })

  el.classList.add("rg-collateral-host", "rg-collateral-hoverable")
  mountSvgMarkup(el, engine.toSVG({ padding: 16 }))

  const orderedFaces: SVGElement[] = []
  for (let step = 0; step < TICK_PATH.length; step += 1) {
    orderedFaces.push(...facesByMeta(el, "step", String(step)))
  }

  let animation: JSAnimation | null = null
  let paused = false

  const reveal = (): void => {
    if (paused) return
    animation?.cancel()
    animation = staggerFaceReveal(orderedFaces, { delayStep: 40, duration: 320 })
  }

  if (!reducedMotion) {
    reveal()
    el.addEventListener("click", reveal)
  }

  return {
    cleanup() {
      animation?.cancel()
      animation = null
      el.removeEventListener("click", reveal)
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable")
      el.replaceChildren()
    },
    pause() {
      paused = true
      animation?.pause()
    },
    resume() {
      paused = false
      animation?.play()
    },
  }
}
