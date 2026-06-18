// Face budget: chamber 9 wide x 5 high x 14 deep shell — floor/ceiling tops
// 9x14 x2 = 252 + inner wall faces 5x14 x2 = 140 + rims ≈ 450 faces < 1500.
import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { paletteFrom, shade } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "tunnel-warp",
  name: "Tunnel Warp",
  class: "transition",
  tags: ["entrance", "camera", "depth"],
  productUse: "Entering the app; a fast camera push through a voxel chamber, under 600 ms.",
  budget: { maxFaces: 1500, maxMountMs: 60, idleLoop: "none" },
}

const WIDTH = 9
const HEIGHT = 5
const DEPTH = 14
const FAR_DISTANCE = 8.4
const NEAR_DISTANCE = 3.2
const RENDER_INTERVAL_MS = 1000 / 24

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)

  const depthMix = (z: number, near: string, far: string): string => {
    const t = Math.min(1, Math.max(0, z / DEPTH))
    return t < 0.45 ? near : t < 0.8 ? shade(near, -0.28) : far
  }

  const engine = new Heerich({
    tile: [22, 22],
    camera: { type: "perspective", position: [0, -2.4], distance: FAR_DISTANCE },
    style: { fill: palette.ink, stroke: shade(palette.gold, -0.1), strokeWidth: 0.5 },
  })

  const startX = -Math.floor(WIDTH / 2)
  const wallStyle = (glowSide: "left" | "right"): Record<string, unknown> => ({
    default: (_x: number, _y: number, z: number) => ({
      fill: depthMix(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix(z, shade(palette.gold, -0.2), shade(palette.ink, -0.2)),
      strokeWidth: 0.4,
    }),
    [glowSide]: (_x: number, _y: number, z: number) => ({
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

  el.classList.add("rg-collateral-host", "rg-collateral-replayable")
  const frame = document.createElement("div")
  frame.className = "rg-collateral-drift-frame"
  frame.style.position = "relative"
  const svgHolder = document.createElement("div")
  svgHolder.style.width = "100%"
  svgHolder.style.height = "100%"
  const flash = document.createElement("div")
  flash.style.position = "absolute"
  flash.style.inset = "0"
  flash.style.background = palette.paper
  flash.style.opacity = "0"
  flash.style.pointerEvents = "none"
  frame.append(svgHolder, flash)
  el.replaceChildren(frame)

  // Fixed viewBox captured at the far view so the push never reframes.
  const bounds = engine.getBounds(20)
  const viewBox: [number, number, number, number] = [bounds.x, bounds.y, bounds.w, bounds.h]

  const render = (distance: number): void => {
    engine.setCamera({ type: "perspective", position: [0, -2.4], distance })
    mountSvgMarkup(svgHolder, engine.toSVG({ viewBox }))
  }

  render(FAR_DISTANCE)

  let animations: JSAnimation[] = []

  const play = (): void => {
    if (reducedMotion) return
    animations.forEach((animation) => animation.cancel())
    animations = []
    flash.style.opacity = "0"
    render(FAR_DISTANCE)
    const state = { distance: FAR_DISTANCE }
    let lastRender = 0
    animations.push(
      animate(state, {
        distance: NEAR_DISTANCE,
        duration: 540,
        ease: "inQuad",
        onUpdate: () => {
          const now = performance.now()
          if (now - lastRender < RENDER_INTERVAL_MS) return
          lastRender = now
          render(state.distance)
        },
        onComplete: () => {
          render(NEAR_DISTANCE)
          animations.push(animate(flash, { opacity: [0.85, 0], duration: 320, ease: "outQuad" }))
        },
      }),
    )
  }

  play()

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations = []
      el.classList.remove("rg-collateral-host", "rg-collateral-replayable")
      el.replaceChildren()
    },
    pause() {
      animations.forEach((animation) => animation.pause())
    },
    resume() {
      animations.forEach((animation) => animation.play())
    },
    play,
  }
}
