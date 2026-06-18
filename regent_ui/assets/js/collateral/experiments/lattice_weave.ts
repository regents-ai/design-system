// Face budget: 17x17 ground bounds = 289 cells, checker test keeps ~145 voxels,
// isolated ground voxels show <=3 faces each: ~435 faces < 2500.
import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "lattice-weave",
  name: "Lattice Weave",
  class: "ambient",
  tags: ["background", "section", "ripple"],
  productUse: "Section background; a flat voxel lattice that ripples gently to signal a live surface.",
  budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" },
}

const HALF = 8
const THREADS = 4

function mod(value: number, n: number): number {
  return ((value % n) + n) % n
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 12,
    camera: { type: "oblique", angle: 315, distance: 14 },
  })

  const inkDeep = shade(palette.ink, -0.25)
  const topStyle = (x: number, _y: number, z: number): Record<string, unknown> => {
    const goldThread = mod(x - z, 8) === 0
    return {
      fill: mod(x + z, 4) === 0 ? palette.ink : inkDeep,
      stroke: goldThread ? palette.gold : shade(palette.ink, -0.45),
      strokeWidth: goldThread ? 0.6 : 0.4,
    }
  }

  for (let thread = 0; thread < THREADS; thread += 1) {
    engine.addGeometry({
      type: "fill",
      // Heerich fill bounds are upper-exclusive; y must span 0..1 for one flat layer.
      bounds: [
        [-HALF, 0, -HALF],
        [HALF, 1, HALF],
      ],
      test: (x: number, _y: number, z: number) => mod(x + z, 2) === 0 && mod(z, THREADS) === thread,
      meta: { thread },
      style: {
        top: topStyle,
        default: (x: number, _y: number, z: number) => ({
          fill: shade(palette.ink, -0.5),
          stroke: mod(x - z, 8) === 0 ? shade(palette.gold, -0.3) : shade(palette.ink, -0.55),
          strokeWidth: 0.4,
        }),
      },
    })
  }

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 18 }))

  const animations: JSAnimation[] = []
  if (!reducedMotion) {
    for (let thread = 0; thread < THREADS; thread += 1) {
      const faces = facesByMeta(el, "thread", String(thread))
      if (faces.length === 0) continue
      animations.push(
        animate(faces, {
          opacity: [1, 0.45],
          duration: 3200,
          delay: stagger(4, { start: thread * 760 }),
          loop: true,
          alternate: true,
          ease: "inOutSine",
        }),
      )
    }
  }

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations.length = 0
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      animations.forEach((animation) => animation.pause())
    },
    resume() {
      animations.forEach((animation) => animation.play())
    },
  }
}
