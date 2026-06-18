// Face budget: 42 isolated non-opaque voxels x 3 visible faces = ~126 faces < 1200.
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "starfield-depth",
  name: "Starfield Depth",
  class: "ambient",
  tags: ["background", "parallax", "pointer"],
  productUse: "Empty-page backdrop (404, maintenance); sparse voxel stars with pointer parallax.",
  budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
}

const STAR_COUNT = 42
const LAYER_DEPTH_PX = [10, 6, 3]

interface StarSpot {
  x: number
  y: number
  z: number
  layer: number
}

/** Deterministic star placement derived from the index; no Math.random. */
function starSpot(index: number): StarSpot {
  const layer = index % 3
  const x = ((index * 53 + layer * 7) % 21) - 10
  const y = -(((index * 31 + layer * 5) % 13) - 6)
  const z = layer * 6
  return { x, y, z, layer }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 9,
    camera: { type: "oblique", angle: 315, distance: 10 },
  })

  const layerColor = [palette.gold, palette.paper, shade(palette.olive, 0.1)]

  for (let i = 0; i < STAR_COUNT; i += 1) {
    const spot = starSpot(i)
    engine.addGeometry({
      type: "box",
      position: [spot.x, spot.y, spot.z],
      size: [1, 1, 1],
      opaque: false,
      meta: { layer: spot.layer },
      style: voxelTone(layerColor[spot.layer]),
    })
  }

  el.classList.add("rg-collateral-host")
  mountSvgMarkup(el, engine.toSVG({ padding: 22 }))

  const layerFaces: SVGElement[][] = [0, 1, 2].map((layer: number) => facesByMeta(el, "layer", String(layer)))

  let pointerX = 0
  let pointerY = 0
  let rafId: number | null = null
  let paused = false

  const applyParallax = (): void => {
    rafId = null
    layerFaces.forEach((faces: SVGElement[], layer: number) => {
      const k = LAYER_DEPTH_PX[layer]
      const transform = `translate(${(pointerX * k).toFixed(2)}px, ${(pointerY * k).toFixed(2)}px)`
      for (const face of faces) face.style.transform = transform
    })
  }

  const onMove = (event: MouseEvent): void => {
    if (paused) return
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1
    if (rafId === null) rafId = requestAnimationFrame(applyParallax)
  }

  if (!reducedMotion) {
    el.addEventListener("mousemove", onMove)
  }

  return {
    cleanup() {
      el.removeEventListener("mousemove", onMove)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      paused = true
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    },
    resume() {
      paused = false
    },
  }
}
