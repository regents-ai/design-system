import { animate, createTimeline, type JSAnimation, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "input-focus-frame",
  name: "Focus Frame",
  class: "micro",
  tags: ["form", "focus", "frame"],
  productUse: "Input focus affordance; a thin voxel frame that lights up around the active field.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

const REST_STROKE_OPACITY = 0.35
const CHASE_ORDER = ["top", "right", "bottom", "left"] as const

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 12, camera: { type: "oblique", angle: 315, distance: 12 } })

  const restOpacity = reducedMotion ? 1 : REST_STROKE_OPACITY
  const frameFace = (fill: string): Record<string, unknown> => ({
    fill,
    stroke: palette.gold,
    strokeWidth: 0.6,
    strokeOpacity: restOpacity,
  })
  const frameStyle = {
    top: frameFace(shade(palette.ink, 0.14)),
    left: frameFace(palette.ink),
    default: frameFace(shade(palette.ink, -0.16)),
  }

  engine.batch(() => {
    engine.addGeometry({ type: "box", position: [-5, 0, -2], size: [10, 1, 1], meta: { side: "top" }, style: frameStyle })
    engine.addGeometry({ type: "box", position: [-5, 0, 1], size: [10, 1, 1], meta: { side: "bottom" }, style: frameStyle })
    engine.addGeometry({ type: "box", position: [-5, 0, -1], size: [1, 1, 2], meta: { side: "left" }, style: frameStyle })
    engine.addGeometry({ type: "box", position: [4, 0, -1], size: [1, 1, 2], meta: { side: "right" }, style: frameStyle })
  })

  el.classList.add("rg-collateral-host", "rg-collateral-hoverable")
  mountSvgMarkup(el, engine.toSVG({ padding: 14 }))

  let chase: Timeline | null = null
  let fade: JSAnimation | null = null
  let paused = false

  const onEnter = (): void => {
    if (paused) return
    fade?.cancel()
    fade = null
    chase?.cancel()
    const timeline = createTimeline()
    CHASE_ORDER.forEach((side, index) => {
      timeline.add(
        facesByMeta(el, "side", side),
        { strokeOpacity: [REST_STROKE_OPACITY, 1], duration: 150, ease: "inOutQuad" },
        index * 150,
      )
    })
    chase = timeline
  }

  const onLeave = (): void => {
    if (paused) return
    chase?.cancel()
    chase = null
    fade?.cancel()
    fade = animate(facesByMeta(el, "side"), {
      strokeOpacity: REST_STROKE_OPACITY,
      duration: 260,
      ease: "outQuad",
    })
  }

  if (!reducedMotion) {
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
  }

  return {
    cleanup() {
      chase?.cancel()
      chase = null
      fade?.cancel()
      fade = null
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable")
      el.replaceChildren()
    },
    pause() {
      paused = true
      chase?.pause()
      fade?.pause()
    },
    resume() {
      paused = false
      chase?.play()
      fade?.play()
    },
  }
}
