import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "tilt-parallax-card",
  name: "Tilt Parallax Card",
  class: "micro",
  tags: ["card", "hover", "depth"],
  productUse: "Product and agent cards; a voxel stack that tilts with the pointer to give cards physical depth.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

const MAX_SHIFT_PX = 6
const MAX_TILT_DEG = 3

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 14, camera: { type: "oblique", angle: 315, distance: 12 } })

  engine.batch(() => {
    engine.addGeometry({
      type: "box",
      position: [-2, 0, -2],
      size: [5, 1, 5],
      meta: { part: "plinth" },
      style: voxelTone(shade(palette.olive, 0.22)),
    })
    engine.addGeometry({
      type: "box",
      position: [0, -1, 0],
      size: [1, 1, 1],
      meta: { part: "stack" },
      style: voxelTone(palette.charcoal),
    })
    engine.addGeometry({
      type: "box",
      position: [0, -2, 0],
      size: [1, 1, 1],
      meta: { part: "stack" },
      style: voxelTone(palette.ink),
    })
    engine.addGeometry({
      type: "box",
      position: [0, -3, 0],
      size: [1, 1, 1],
      meta: { part: "stack" },
      style: voxelTone(palette.gold),
    })
  })

  el.classList.add("rg-collateral-host", "rg-collateral-hoverable")
  const frame = document.createElement("div")
  el.replaceChildren(frame)
  mountSvgMarkup(frame, engine.toSVG({ padding: 18 }))

  const pose = { x: 0, y: 0, tilt: 0 }
  const applyPose = (): void => {
    frame.style.transform = `translate(${pose.x}px, ${pose.y}px) rotate(${pose.tilt}deg)`
  }

  let rafId: number | null = null
  let restAnimation: JSAnimation | null = null
  let paused = false

  const onMove = (event: MouseEvent): void => {
    if (paused) return
    restAnimation?.cancel()
    restAnimation = null
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))
    pose.x = nx * MAX_SHIFT_PX
    pose.y = ny * MAX_SHIFT_PX
    pose.tilt = nx * MAX_TILT_DEG
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null
        applyPose()
      })
    }
  }

  const onLeave = (): void => {
    if (paused) return
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    restAnimation?.cancel()
    restAnimation = animate(pose, {
      x: 0,
      y: 0,
      tilt: 0,
      duration: 520,
      ease: "outBack",
      onUpdate: applyPose,
    })
  }

  if (!reducedMotion) {
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
  }

  return {
    cleanup() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      restAnimation?.cancel()
      restAnimation = null
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable")
      el.replaceChildren()
    },
    pause() {
      paused = true
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      restAnimation?.pause()
    },
    resume() {
      paused = false
      restAnimation?.play()
    },
  }
}
