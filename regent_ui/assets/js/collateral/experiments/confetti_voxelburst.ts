import { animate, utils, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, voxelTone } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "confetti-voxelburst",
  name: "Voxel Burst",
  class: "celebration",
  tags: ["success", "confetti", "one-shot"],
  productUse: "Success moments (claimed, minted, launched); a one-shot burst of brand-colored voxels.",
  budget: { maxFaces: 1000, maxMountMs: 50, idleLoop: "none" },
}

/** Lattice points of a small sphere; deterministic, ~60 voxels. */
function clusterPoints(): Array<[number, number, number]> {
  const points: Array<[number, number, number]> = []
  for (let x = -2; x <= 2; x += 1) {
    for (let y = -2; y <= 2; y += 1) {
      for (let z = -2; z <= 2; z += 1) {
        if (x * x + y * y + z * z <= 5) points.push([x, y, z])
      }
    }
  }
  return points
}

interface BurstTarget {
  element: SVGElement
  index: number
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 12, camera: { type: "oblique", angle: 315, distance: 12 } })

  const colors = [palette.gold, palette.gold, palette.paper, palette.positive]
  engine.batch(() => {
    clusterPoints().forEach(([x, y, z], p) => {
      engine.addGeometry({
        type: "box",
        position: [x, y, z],
        size: [1, 1, 1],
        opaque: false,
        meta: { p },
        style: voxelTone(colors[p % colors.length]),
      })
    })
  })

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 26 }))

  const targets: BurstTarget[] = Array.from(el.querySelectorAll<SVGElement>("[data-p]")).map((element) => ({
    element,
    index: Number(element.dataset.p ?? "0"),
  }))
  const elements = targets.map((target) => target.element)

  let animations: JSAnimation[] = []
  let autoPlayId: number | null = null

  function play(): void {
    if (reducedMotion) return
    animations.forEach((animation) => animation.cancel())
    animations = []
    utils.set(elements, { translateX: 0, translateY: 0, rotate: 0, opacity: 1 })
    for (const { element, index } of targets) {
      const angle = (index * 137.508 * Math.PI) / 180
      const spread = 26 + ((index * 53) % 34)
      const dx = Math.cos(angle) * spread
      const up = 18 + ((index * 31) % 22)
      const fall = 34 + ((index * 17) % 26)
      animations.push(
        animate(element, {
          translateX: [
            { to: dx * 0.6, duration: 320, ease: "outQuad" },
            { to: dx, duration: 560, ease: "linear" },
          ],
          translateY: [
            { to: -up, duration: 320, ease: "outQuad" },
            { to: fall, duration: 560, ease: "inQuad" },
          ],
          rotate: index % 2 === 0 ? 28 : -24,
          opacity: [
            { to: 1, duration: 540, ease: "linear" },
            { to: 0, duration: 340, ease: "outQuad" },
          ],
          duration: 880,
        }),
      )
    }
  }

  if (!reducedMotion) {
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
    ...(reducedMotion ? {} : { play }),
  }
}
