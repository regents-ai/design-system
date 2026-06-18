import { createTimeline, stagger, utils, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "gavel-strike",
  name: "Gavel Strike",
  class: "celebration",
  tags: ["auction", "won", "impact"],
  productUse: "Auction won; a voxel gavel strikes and a shockwave ring ripples out.",
  budget: { maxFaces: 1000, maxMountMs: 50, idleLoop: "none" },
}

const TILE = 12
const DROP_PX = TILE * 3

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: TILE, camera: { type: "oblique", angle: 315, distance: 14 } })

  const ringStyle = (intensity: number): Record<string, unknown> => ({
    default: {
      fill: shade(palette.gold, intensity),
      opacity: 0,
      stroke: shade(palette.gold, -0.2),
      strokeWidth: 0.5,
    },
  })

  engine.batch(() => {
    // Podium and the two shockwave rings on the ground around it.
    engine.addGeometry({
      type: "box",
      position: [-2, 0, -2],
      size: [4, 1, 4],
      meta: { part: "podium" },
      style: voxelTone(palette.ink),
    })
    engine.addGeometry({
      type: "box",
      position: [-4, 0, -4],
      size: [8, 1, 8],
      meta: { ring: 1 },
      opaque: false,
      style: ringStyle(0.08),
    })
    engine.removeGeometry({ type: "box", position: [-3, 0, -3], size: [6, 1, 6] })
    engine.addGeometry({
      type: "box",
      position: [-6, 0, -6],
      size: [12, 1, 12],
      meta: { ring: 2 },
      opaque: false,
      style: ringStyle(-0.12),
    })
    engine.removeGeometry({ type: "box", position: [-5, 0, -5], size: [10, 1, 10] })
    // Gavel: charcoal head plus a gold handle, held above the podium.
    engine.addGeometry({
      type: "box",
      position: [-2, -6, -1],
      size: [3, 2, 2],
      meta: { part: "gavel" },
      style: voxelTone(palette.charcoal),
    })
    engine.addGeometry({
      type: "line",
      from: [1, -5, 0],
      to: [4, -5, 0],
      meta: { part: "gavel" },
      style: voxelTone(palette.gold),
    })
  })

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 20 }))

  const gavelFaces = facesByMeta(el, "part", "gavel")
  const podiumFaces = facesByMeta(el, "part", "podium")
  const ring1Faces = facesByMeta(el, "ring", "1")
  const ring2Faces = facesByMeta(el, "ring", "2")
  for (const face of [...ring1Faces, ...ring2Faces]) {
    face.style.setProperty("transform-box", "fill-box")
    face.style.setProperty("transform-origin", "50% 50%")
  }

  let timeline: Timeline | null = null
  let autoPlayId: number | null = null

  function play(): void {
    if (reducedMotion) return
    timeline?.cancel()
    utils.set(gavelFaces, { translateY: 0 })
    utils.set([...ring1Faces, ...ring2Faces], { opacity: 0, scale: 0.7 })

    const next = createTimeline()
    next.add(gavelFaces, { translateY: DROP_PX, duration: 140, ease: "inQuad" }, 0)
    next.add(
      ring1Faces,
      { opacity: [0, 0.9, 0], scale: [0.7, 1.25], duration: 620, ease: "outQuad", delay: stagger(4) },
      140,
    )
    next.add(
      ring2Faces,
      { opacity: [0, 0.7, 0], scale: [0.7, 1.3], duration: 680, ease: "outQuad", delay: stagger(4) },
      240,
    )
    next.add(podiumFaces, { opacity: [1, 0.72, 1], duration: 260, ease: "outQuad" }, 140)
    next.add(gavelFaces, { translateY: 0, duration: 460, ease: "outQuad" }, 430)
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
