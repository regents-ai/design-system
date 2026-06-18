import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, voxelTone } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "hover-assemble-logo",
  name: "Hover Assemble",
  class: "micro",
  tags: ["logo", "hover", "assembly"],
  productUse: "Nav logos and link hovers; scattered voxels snap together into the mark on hover.",
  budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
}

/** A compact crown sigil drawn on a 7x5 grid: columns of [x, height] pairs. */
const CROWN_COLUMNS: Array<[number, number]> = [
  [0, 3],
  [1, 2],
  [2, 4],
  [3, 3],
  [4, 4],
  [5, 2],
  [6, 3],
]

interface ScatterTarget {
  element: SVGElement
  dx: number
  dy: number
}

function scatterFor(seed: number): { dx: number; dy: number } {
  // Deterministic pseudo-random scatter so the rest state is stable per voxel.
  const angle = (seed * 137.508) % 360
  const radius = 14 + ((seed * 71) % 18)
  return {
    dx: Math.cos((angle * Math.PI) / 180) * radius,
    dy: Math.sin((angle * Math.PI) / 180) * radius,
  }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 15, camera: { type: "oblique", angle: 315, distance: 12 } })

  let voxelIndex = 0
  engine.batch(() => {
    for (const [x, height] of CROWN_COLUMNS) {
      for (let y = 0; y < height; y += 1) {
        engine.addGeometry({
          type: "box",
          position: [x - 3, -y, 0],
          size: [1, 1, 1],
          meta: { part: "crown", vox: voxelIndex },
          style: voxelTone(y === height - 1 ? palette.gold : palette.ink),
        })
        voxelIndex += 1
      }
    }
  })

  el.classList.add("rg-collateral-host", "rg-collateral-hoverable")
  mountSvgMarkup(el, engine.toSVG({ padding: 26 }))

  const targets: ScatterTarget[] = Array.from(el.querySelectorAll<SVGElement>("[data-vox]")).map((element) => {
    const seed = Number(element.dataset.vox ?? "0")
    const { dx, dy } = scatterFor(seed)
    return { element, dx, dy }
  })

  let animations: JSAnimation[] = []
  let paused = false

  function settle(assembled: boolean, immediate: boolean): void {
    animations.forEach((animation) => animation.cancel())
    animations = []
    for (const target of targets) {
      const toX = assembled ? 0 : target.dx
      const toY = assembled ? 0 : target.dy
      if (immediate || paused) {
        target.element.style.transform = `translate(${toX}px, ${toY}px)`
        target.element.style.opacity = assembled ? "1" : "0.55"
        continue
      }
      animations.push(
        animate(target.element, {
          translateX: toX,
          translateY: toY,
          opacity: assembled ? 1 : 0.55,
          duration: assembled ? 420 : 560,
          ease: assembled ? "outBack" : "outQuad",
        }),
      )
    }
  }

  const onEnter = () => settle(true, false)
  const onLeave = () => settle(false, false)

  if (reducedMotion) {
    settle(true, true)
  } else {
    settle(false, true)
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
  }

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations = []
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
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
