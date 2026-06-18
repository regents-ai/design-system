import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "button-press-pad",
  name: "Press Pad",
  class: "micro",
  tags: ["button", "press", "feedback"],
  productUse: "Primary call-to-action feedback; a voxel key that physically depresses on press.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

const TILE = 14

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: TILE, camera: { type: "oblique", angle: 315, distance: 12 } })

  const restStroke = shade(palette.gold, -0.4)
  const baseFace = (fill: string): Record<string, unknown> => ({
    fill,
    stroke: restStroke,
    strokeWidth: 0.5,
  })

  engine.batch(() => {
    engine.addGeometry({
      type: "box",
      position: [-2, 0, -2],
      size: [5, 2, 4],
      meta: { part: "base" },
      style: {
        top: baseFace(shade(palette.ink, 0.16)),
        left: baseFace(palette.ink),
        right: baseFace(shade(palette.ink, -0.18)),
        front: baseFace(shade(palette.ink, -0.18)),
        default: baseFace(palette.ink),
      },
    })
    engine.addGeometry({
      type: "box",
      position: [-1, -2, -1],
      size: [3, 1, 2],
      meta: { part: "cap" },
      style: voxelTone(palette.gold),
    })
  })

  el.classList.add("rg-collateral-host", "rg-collateral-hoverable")
  mountSvgMarkup(el, engine.toSVG({ padding: 16 }))

  const capFaces = facesByMeta(el, "part", "cap")
  const baseFaces = facesByMeta(el, "part", "base")

  let animations: JSAnimation[] = []
  let paused = false

  const settle = (pressed: boolean): void => {
    animations.forEach((animation) => animation.cancel())
    animations = []
    if (paused) return
    animations.push(
      animate(capFaces, {
        translateY: pressed ? TILE * 0.6 : 0,
        duration: pressed ? 90 : 260,
        ease: pressed ? "outQuad" : "outBack",
      }),
      animate(baseFaces, {
        stroke: pressed ? palette.gold : restStroke,
        duration: pressed ? 90 : 260,
        ease: "outQuad",
      }),
    )
  }

  const onDown = (): void => settle(true)
  const onUp = (): void => settle(false)

  if (!reducedMotion) {
    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointerleave", onUp)
  }

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations = []
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointerleave", onUp)
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable")
      el.replaceChildren()
    },
    pause() {
      paused = true
      animations.forEach((animation) => animation.pause())
    },
    resume() {
      paused = false
      animations.forEach((animation) => animation.play())
    },
  }
}
