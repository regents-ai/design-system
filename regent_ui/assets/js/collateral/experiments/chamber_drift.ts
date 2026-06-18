import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { paletteFrom, shade } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "chamber-drift",
  name: "Chamber Drift",
  class: "ambient",
  tags: ["background", "hero", "depth"],
  productUse: "Page hero backdrop with slow parallax depth, like the entrance hall of the product.",
  budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" },
}

const WIDTH = 11
const HEIGHT = 6
const DEPTH = 20

function depthMix(z: number, near: string, far: string): string {
  const t = Math.min(1, Math.max(0, z / DEPTH))
  return t < 0.45 ? near : t < 0.8 ? shade(near, -0.28) : far
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)

  const engine = new Heerich({
    tile: [22, 22],
    camera: { type: "perspective", position: [0, -2.4], distance: 8.4 },
    style: { fill: palette.ink, stroke: shade(palette.gold, -0.1), strokeWidth: 0.5 },
  })

  const startX = -Math.floor(WIDTH / 2)
  const wallStyle = (axisGlow: "left" | "right") => ({
    default: (_x: number, _y: number, z: number) => ({
      fill: depthMix(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix(z, shade(palette.gold, -0.2), shade(palette.ink, -0.2)),
      strokeWidth: 0.4,
    }),
    [axisGlow]: (_x: number, _y: number, z: number) => ({
      fill: depthMix(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix(z, palette.gold, shade(palette.gold, -0.45)),
      strokeWidth: 0.7,
    }),
  })

  engine.addGeometry({
    type: "box",
    position: [startX, 0, 0],
    size: [WIDTH, 1, DEPTH],
    style: {
      default: (_x: number, _y: number, z: number) => ({
        fill: depthMix(z, shade(palette.ink, -0.12), shade(palette.ink, -0.5)),
        stroke: depthMix(z, shade(palette.gold, -0.25), shade(palette.ink, -0.3)),
        strokeWidth: 0.4,
      }),
    },
  })
  engine.addGeometry({ type: "box", position: [startX, 1, 0], size: [1, HEIGHT, DEPTH], style: wallStyle("right") })
  engine.addGeometry({
    type: "box",
    position: [startX + WIDTH - 1, 1, 0],
    size: [1, HEIGHT, DEPTH],
    style: wallStyle("left"),
  })
  engine.addGeometry({
    type: "box",
    position: [startX, HEIGHT + 1, 0],
    size: [WIDTH, 1, DEPTH],
    style: {
      default: (_x: number, _y: number, z: number) => ({
        fill: depthMix(z, shade(palette.charcoal, 0.06), shade(palette.ink, -0.45)),
        stroke: depthMix(z, shade(palette.gold, -0.05), shade(palette.ink, -0.25)),
        strokeWidth: 0.5,
      }),
      top: (_x: number, _y: number, z: number) => ({
        fill: depthMix(z, shade(palette.charcoal, 0.12), shade(palette.ink, -0.4)),
        stroke: depthMix(z, palette.gold, shade(palette.gold, -0.5)),
        strokeWidth: 0.66,
      }),
    },
  })

  el.classList.add("rg-collateral-host")
  const frame = document.createElement("div")
  frame.className = "rg-collateral-drift-frame"
  el.replaceChildren(frame)
  mountSvgMarkup(frame, engine.toSVG({ padding: 18 }))

  const animations: JSAnimation[] = []
  if (!reducedMotion) {
    animations.push(
      animate(frame, {
        translateY: [-4, 4],
        scale: [1.015, 1.045],
        duration: 9000,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      }),
    )
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
