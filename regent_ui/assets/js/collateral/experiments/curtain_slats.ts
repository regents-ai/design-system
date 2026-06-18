// Face budget: 7 slats x 1x8x1 = 56 voxels in a contiguous row (~80 visible
// faces) + 2 reveal voxels (~6 faces): ~90 faces < 1500.
import { createTimeline, stagger, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "curtain-slats",
  name: "Curtain Slats",
  class: "transition",
  tags: ["modal", "reveal", "drawer"],
  productUse: "Modal and drawer reveals; vertical voxel slats rotate open in sequence.",
  budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" },
}

const SLATS = 7
const SLAT_HEIGHT = 8

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 13,
    camera: { type: "oblique", angle: 315, distance: 12 },
  })

  const goldEdge = shade(palette.gold, -0.15)
  const slatTone = (color: string): Record<string, unknown> => ({
    top: { fill: shade(color, 0.18), stroke: goldEdge, strokeWidth: 0.5 },
    front: { fill: shade(color, -0.16), stroke: goldEdge, strokeWidth: 0.5 },
    right: { fill: shade(color, -0.16), stroke: goldEdge, strokeWidth: 0.5 },
    default: { fill: color, stroke: goldEdge, strokeWidth: 0.5 },
  })

  for (let slat = 0; slat < SLATS; slat += 1) {
    engine.addGeometry({
      type: "box",
      position: [slat - 3, 1 - SLAT_HEIGHT, 0],
      size: [1, SLAT_HEIGHT, 1],
      meta: { slat },
      style: slatTone(slat % 2 === 0 ? palette.ink : palette.charcoal),
    })
  }
  // Gold sigil pair revealed behind the curtain.
  engine.addGeometry({
    type: "box",
    position: [0, -4, 2],
    size: [1, 2, 1],
    meta: { part: "reveal" },
    style: voxelTone(palette.gold),
  })

  el.classList.add("rg-collateral-host", "rg-collateral-replayable")
  mountSvgMarkup(el, engine.toSVG({ padding: 22 }))

  const slatFaces: SVGElement[][] = []
  for (let slat = 0; slat < SLATS; slat += 1) {
    slatFaces.push(facesByMeta(el, "slat", String(slat)))
  }
  const revealFaces = facesByMeta(el, "part", "reveal")

  const setOpenState = (open: boolean): void => {
    slatFaces.forEach((faces: SVGElement[], slat: number) => {
      for (const face of faces) {
        face.style.opacity = open ? "0.12" : "1"
        face.style.transform = open ? `translateX(${(slat - 3) * 4 + 13}px) rotate(-14deg)` : ""
      }
    })
    for (const face of revealFaces) {
      face.style.opacity = open ? "1" : "0"
    }
  }

  let timeline: Timeline | null = null

  const play = (): void => {
    timeline?.cancel()
    timeline = null
    if (reducedMotion) {
      setOpenState(true)
      return
    }
    setOpenState(false)
    timeline = createTimeline()
    slatFaces.forEach((faces: SVGElement[], slat: number) => {
      timeline?.add(
        faces,
        {
          opacity: 0.12,
          translateX: (slat - 3) * 4 + 13,
          rotate: -14,
          duration: 380,
          ease: "inOutQuad",
        },
        slat * 90,
      )
    })
    timeline.add(
      revealFaces,
      { opacity: [0, 1], scale: [0.6, 1], duration: 420, delay: stagger(30), ease: "outBack" },
      SLATS * 90 + 160,
    )
  }

  if (reducedMotion) {
    setOpenState(true)
  } else {
    setOpenState(false)
  }

  return {
    cleanup() {
      timeline?.cancel()
      timeline = null
      el.classList.remove("rg-collateral-host", "rg-collateral-replayable")
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
