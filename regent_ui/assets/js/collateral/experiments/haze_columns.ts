// Face budget: plinth 17x1x6 = 102 voxels (~130 visible faces) + 5 columns of
// 1x6x1 = 30 voxels (~100 visible faces in perspective): ~230 faces < 2500.
import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { paletteFrom, shade } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "haze-columns",
  name: "Haze Columns",
  class: "ambient",
  tags: ["background", "ceremonial", "glow"],
  productUse: "Backdrop for sign-in and ceremonial pages; a colonnade with drifting light beams.",
  budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" },
}

const PLINTH_WIDTH = 17
const COLUMN_HEIGHT = 6
const DEPTH = 6
const COLUMN_XS = [-6, -3, 0, 3, 6]

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)

  const engine = new Heerich({
    tile: [22, 22],
    camera: { type: "perspective", position: [0, -2.4], distance: 10 },
    style: { fill: palette.ink, stroke: shade(palette.gold, -0.2), strokeWidth: 0.5 },
  })

  const depthMix = (z: number, near: string, far: string): string => {
    const t = Math.min(1, Math.max(0, z / DEPTH))
    return t < 0.5 ? near : far
  }

  // Plinth row beneath the colonnade (perspective scene: y grows downward).
  engine.addGeometry({
    type: "box",
    position: [-Math.floor(PLINTH_WIDTH / 2), COLUMN_HEIGHT + 1, 0],
    size: [PLINTH_WIDTH, 1, DEPTH],
    style: {
      default: (_x: number, _y: number, z: number) => ({
        fill: depthMix(z, shade(palette.ink, -0.18), shade(palette.ink, -0.45)),
        stroke: depthMix(z, shade(palette.gold, -0.3), shade(palette.ink, -0.25)),
        strokeWidth: 0.4,
      }),
      top: (_x: number, _y: number, z: number) => ({
        fill: depthMix(z, shade(palette.charcoal, 0.05), shade(palette.ink, -0.35)),
        stroke: depthMix(z, shade(palette.gold, -0.1), shade(palette.gold, -0.5)),
        strokeWidth: 0.55,
      }),
    },
  })
  for (const x of COLUMN_XS) {
    engine.addGeometry({
      type: "box",
      position: [x, 1, 2],
      size: [1, COLUMN_HEIGHT, 1],
      style: {
        default: (_x: number, y: number, _z: number) => ({
          fill: shade(palette.charcoal, -0.05 * (COLUMN_HEIGHT - y)),
          stroke: shade(palette.gold, -0.35),
          strokeWidth: 0.45,
        }),
        top: {
          fill: shade(palette.gold, 0.08),
          stroke: shade(palette.gold, -0.25),
          strokeWidth: 0.6,
        },
      },
    })
  }

  el.classList.add("rg-collateral-host")
  const frame = document.createElement("div")
  frame.className = "rg-collateral-drift-frame"
  frame.style.position = "relative"
  const svgHolder = document.createElement("div")
  svgHolder.style.width = "100%"
  svgHolder.style.height = "100%"
  frame.append(svgHolder)
  el.replaceChildren(frame)
  mountSvgMarkup(svgHolder, engine.toSVG({ padding: 20 }))

  const beams: HTMLDivElement[] = []
  const beamLefts = [18, 44, 68]
  beamLefts.forEach((left: number, index: number) => {
    const beam = document.createElement("div")
    beam.className = "rg-collateral-beam"
    beam.style.inset = "auto"
    beam.style.left = `${left}%`
    beam.style.top = "0"
    beam.style.width = "16%"
    beam.style.height = "100%"
    beam.style.background = `linear-gradient(180deg, ${palette.gold}, transparent 72%)`
    beam.style.filter = "blur(14px)"
    beam.style.opacity = reducedMotion ? "0.22" : String(0.12 + index * 0.04)
    frame.append(beam)
    beams.push(beam)
  })

  const animations: JSAnimation[] = []
  if (!reducedMotion) {
    beams.forEach((beam: HTMLDivElement, index: number) => {
      animations.push(
        animate(beam, {
          translateX: [-10, 12],
          opacity: [0.1, 0.3],
          duration: 7200 + index * 1500,
          alternate: true,
          loop: true,
          ease: "inOutSine",
        }),
      )
    })
  }

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations.length = 0
      beams.length = 0
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
