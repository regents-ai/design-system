import { createTimeline, utils, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "vault-jackpot",
  name: "Vault Jackpot",
  class: "celebration",
  tags: ["rewards", "claim", "payout"],
  productUse: "Rewards claimed; vault doors swing open and gold voxels spill out.",
  budget: { maxFaces: 1000, maxMountMs: 50, idleLoop: "none" },
}

const TILE = 13
const COIN_COUNT = 12

/** Coin slots inside the 3x3x3 cavity: floor layer first, then a partial second layer. */
const COIN_SLOTS: Array<[number, number, number]> = [
  [-1, -1, -1],
  [0, -1, -1],
  [1, -1, -1],
  [-1, -1, 0],
  [0, -1, 0],
  [1, -1, 0],
  [-1, -1, 1],
  [0, -1, 1],
  [1, -1, 1],
  [-1, -2, 0],
  [0, -2, -1],
  [1, -2, 0],
]

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: TILE, camera: { type: "oblique", angle: 315, distance: 14 } })

  const coinStyle = (): Record<string, unknown> => {
    const tone = voxelTone(palette.gold) as Record<string, Record<string, unknown>>
    const hidden: Record<string, unknown> = {}
    for (const [face, fill] of Object.entries(tone)) {
      hidden[face] = { ...fill, opacity: 0 }
    }
    return hidden
  }

  engine.batch(() => {
    engine.addGeometry({
      type: "box",
      position: [-3, 1, -3],
      size: [7, 1, 7],
      meta: { part: "plinth" },
      style: voxelTone(shade(palette.olive, 0.2)),
    })
    // Vault shell with an open cavity and a 3x3 doorway cut from the front wall.
    engine.addGeometry({
      type: "box",
      position: [-2, -4, -2],
      size: [5, 5, 5],
      meta: { part: "vault" },
      style: voxelTone(palette.ink),
    })
    engine.removeGeometry({ type: "box", position: [-1, -3, -1], size: [3, 3, 3] })
    engine.removeGeometry({ type: "box", position: [-1, -3, -2], size: [3, 3, 1] })
    COIN_SLOTS.forEach(([x, y, z], coin) => {
      engine.addGeometry({
        type: "box",
        position: [x, y, z],
        size: [1, 1, 1],
        opaque: false,
        meta: { coin },
        style: coinStyle(),
      })
    })
    engine.addGeometry({
      type: "box",
      position: [-1, -3, -2],
      size: [3, 3, 1],
      opaque: false,
      meta: { part: "door" },
      style: {
        top: { fill: shade(palette.ink, 0.22), stroke: shade(palette.gold, -0.25), strokeWidth: 0.6 },
        left: { fill: shade(palette.ink, 0.08), stroke: shade(palette.gold, -0.25), strokeWidth: 0.6 },
        default: { fill: shade(palette.ink, -0.08), stroke: shade(palette.gold, -0.25), strokeWidth: 0.6 },
      },
    })
  })

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 20 }))

  const doorFaces = facesByMeta(el, "part", "door")
  for (const face of doorFaces) {
    face.style.setProperty("transform-box", "fill-box")
    face.style.setProperty("transform-origin", "50% 50%")
  }
  const coinFaces: SVGElement[][] = []
  for (let coin = 0; coin < COIN_COUNT; coin += 1) {
    coinFaces.push(facesByMeta(el, "coin", String(coin)))
  }
  const allCoinFaces = coinFaces.flat()

  let timeline: Timeline | null = null
  let autoPlayId: number | null = null

  function play(): void {
    if (reducedMotion) return
    timeline?.cancel()
    utils.set(doorFaces, { translateX: 0, skewY: 0, opacity: 1 })
    utils.set(allCoinFaces, { translateX: 0, translateY: 0, opacity: 0 })

    const next = createTimeline()
    next.add(
      doorFaces,
      { translateX: -TILE * 1.4, skewY: -9, opacity: 0.22, duration: 340, ease: "inOutQuad" },
      0,
    )
    coinFaces.forEach((faces, coin) => {
      if (faces.length === 0) return
      const dx = (coin % 2 === 0 ? 1 : -1) * (10 + ((coin * 29) % 26))
      const lift = 10 + ((coin * 13) % 12)
      const drop = 30 + ((coin * 7) % 14)
      next.add(
        faces,
        {
          translateX: [
            { to: dx * 0.5, duration: 300, ease: "outQuad" },
            { to: dx, duration: 420, ease: "linear" },
          ],
          translateY: [
            { to: -lift, duration: 300, ease: "outQuad" },
            { to: drop, duration: 420, ease: "inQuad" },
          ],
          opacity: [
            { to: 1, duration: 140, ease: "linear" },
            { to: 1, duration: 300, ease: "linear" },
            { to: 0, duration: 280, ease: "outQuad" },
          ],
          duration: 720,
        },
        280 + coin * 45,
      )
    })
    next.add(doorFaces, { translateX: 0, skewY: 0, opacity: 1, duration: 320, ease: "outQuad" }, 1480)
    timeline = next
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
      timeline?.cancel()
      timeline = null
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      timeline?.pause()
    },
    resume() {
      timeline?.play()
    },
    play,
  }
}
