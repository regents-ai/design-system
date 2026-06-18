import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "toggle-flip-cube",
  name: "Flip Cube",
  class: "micro",
  tags: ["toggle", "state", "rotate"],
  productUse: "Two-state toggles (theme, view mode); a cube that rolls between two styled faces.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 16, camera: { type: "oblique", angle: 315, distance: 12 } })

  const colorAt = (x: number): string => (x < 0 ? palette.ink : x > 0 ? palette.gold : palette.charcoal)

  engine.addGeometry({
    type: "box",
    position: [-1, -1, -1],
    size: [3, 3, 3],
    meta: { part: "cube" },
    style: {
      top: (x: number) => ({ fill: shade(colorAt(x), 0.18) }),
      left: (x: number) => ({ fill: colorAt(x) }),
      right: (x: number) => ({ fill: shade(colorAt(x), -0.16) }),
      front: (x: number) => ({ fill: shade(colorAt(x), -0.16) }),
      default: (x: number) => ({ fill: colorAt(x) }),
    },
  })

  el.classList.add("rg-collateral-host", "rg-collateral-hoverable")
  const frame = document.createElement("div")
  el.replaceChildren(frame)
  mountSvgMarkup(frame, engine.toSVG({ padding: 20 }))

  let flipped = false
  let flipAnimation: JSAnimation | null = null
  let paused = false

  const applyState = (): void => {
    el.dataset.state = flipped ? "on" : "off"
  }

  const onClick = (): void => {
    if (paused) return
    flipped = !flipped
    applyState()
    flipAnimation?.cancel()
    flipAnimation = null
    if (reducedMotion) {
      frame.style.transform = flipped ? "scaleX(-1)" : "scaleX(1)"
      return
    }
    flipAnimation = animate(frame, {
      scaleX: flipped ? -1 : 1,
      scaleY: [1, 0.86, 1],
      duration: 460,
      ease: "inOutQuad",
    })
  }

  applyState()
  el.addEventListener("click", onClick)

  return {
    cleanup() {
      flipAnimation?.cancel()
      flipAnimation = null
      el.removeEventListener("click", onClick)
      delete el.dataset.state
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable")
      el.replaceChildren()
    },
    pause() {
      paused = true
      flipAnimation?.pause()
    },
    resume() {
      paused = false
      flipAnimation?.play()
    },
  }
}
