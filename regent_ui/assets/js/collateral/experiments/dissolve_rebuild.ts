// Face budget: motif A 4x4x4 cube = 64 voxels (~48 visible shell faces); motif B
// pyramid 5x5+3x3+1 = 35 voxels (~60 visible faces). Total ~110 faces < 1500.
import { createTimeline, stagger, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, voxelTone } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "dissolve-rebuild",
  name: "Dissolve and Rebuild",
  class: "transition",
  tags: ["navigation", "page", "morph"],
  productUse: "Page-to-page handoff; the current scene dissolves into voxels that reassemble as the next motif.",
  budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" },
}

/** Deterministic outward scatter per voxel index. */
function scatterFor(seed: number): { dx: number; dy: number } {
  const angle = (seed * 137.508) % 360
  const radius = 22 + ((seed * 53) % 20)
  return {
    dx: Math.cos((angle * Math.PI) / 180) * radius,
    dy: Math.sin((angle * Math.PI) / 180) * radius,
  }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, {
    tile: 12,
    camera: { type: "oblique", angle: 315, distance: 12 },
  })

  // Build both motifs once; each is captured as a face set, then rendered as a
  // stacked SVG layer sharing one fixed viewBox so they overlay precisely.
  let voxA = 0
  for (let x = -2; x <= 1; x += 1) {
    for (let y = -3; y <= 0; y += 1) {
      for (let z = 0; z <= 3; z += 1) {
        engine.addGeometry({
          type: "box",
          position: [x, y, z],
          size: [1, 1, 1],
          meta: { motif: "a", vox: voxA },
          style: voxelTone(y === -3 ? palette.gold : palette.ink),
        })
        voxA += 1
      }
    }
  }
  const facesA = engine.getFaces()
  const boundsA = engine.getBounds(20, facesA)

  engine.clear()
  let voxB = 0
  const levels: Array<{ half: number; y: number }> = [
    { half: 2, y: 0 },
    { half: 1, y: -1 },
    { half: 0, y: -2 },
  ]
  for (const level of levels) {
    for (let x = -level.half; x <= level.half; x += 1) {
      for (let z = 1 - level.half; z <= 1 + level.half; z += 1) {
        engine.addGeometry({
          type: "box",
          position: [x, level.y, z],
          size: [1, 1, 1],
          meta: { motif: "b", vox: voxB },
          style: voxelTone(level.half === 0 ? palette.gold : palette.charcoal),
        })
        voxB += 1
      }
    }
  }
  const facesB = engine.getFaces()
  const boundsB = engine.getBounds(20, facesB)

  const minX = Math.min(boundsA.x, boundsB.x)
  const minY = Math.min(boundsA.y, boundsB.y)
  const viewBox: [number, number, number, number] = [
    minX,
    minY,
    Math.max(boundsA.x + boundsA.w, boundsB.x + boundsB.w) - minX,
    Math.max(boundsA.y + boundsA.h, boundsB.y + boundsB.h) - minY,
  ]

  el.classList.add("rg-collateral-host", "rg-collateral-replayable")
  const frame = document.createElement("div")
  frame.className = "rg-collateral-drift-frame"
  frame.style.position = "relative"
  const layerA = document.createElement("div")
  layerA.style.width = "100%"
  layerA.style.height = "100%"
  const layerB = document.createElement("div")
  layerB.style.position = "absolute"
  layerB.style.inset = "0"
  frame.append(layerA, layerB)
  el.replaceChildren(frame)
  mountSvgMarkup(layerA, engine.toSVG({ faces: facesA, viewBox }))
  mountSvgMarkup(layerB, engine.toSVG({ faces: facesB, viewBox }))

  const collect = (motif: "a" | "b"): SVGElement[] => {
    const faces = Array.from(frame.querySelectorAll<SVGElement>(`[data-motif="${motif}"]`))
    // Deterministic pseudo-shuffle for a random-feeling stagger.
    return faces
      .map((face: SVGElement, index: number) => ({ face, key: (Number(face.dataset.vox ?? "0") * 137 + index * 31) % 101 }))
      .sort((a, b) => a.key - b.key)
      .map((entry) => entry.face)
  }
  const motifFaces: Record<"a" | "b", SVGElement[]> = { a: collect("a"), b: collect("b") }
  const scatterOf = new Map<SVGElement, { dx: number; dy: number }>()
  for (const motif of ["a", "b"] as const) {
    for (const face of motifFaces[motif]) {
      scatterOf.set(face, scatterFor(Number(face.dataset.vox ?? "0")))
    }
  }

  const setHidden = (faces: SVGElement[], hidden: boolean): void => {
    for (const face of faces) {
      if (hidden) {
        const scatter = scatterOf.get(face) ?? { dx: 0, dy: 0 }
        face.style.opacity = "0"
        face.style.transform = `translate(${scatter.dx.toFixed(1)}px, ${scatter.dy.toFixed(1)}px)`
      } else {
        face.style.opacity = "1"
        face.style.transform = "translate(0px, 0px)"
      }
    }
  }

  let showing: "a" | "b" = "a"
  let timeline: Timeline | null = null

  const play = (): void => {
    const from = showing
    const to: "a" | "b" = showing === "a" ? "b" : "a"
    showing = to
    timeline?.cancel()
    timeline = null
    setHidden(motifFaces[from], false)
    setHidden(motifFaces[to], true)
    if (reducedMotion) {
      setHidden(motifFaces[from], true)
      setHidden(motifFaces[to], false)
      return
    }
    timeline = createTimeline()
    timeline.add(motifFaces[from], {
      opacity: 0,
      translateX: (target: unknown) => scatterOf.get(target as SVGElement)?.dx ?? 0,
      translateY: (target: unknown) => scatterOf.get(target as SVGElement)?.dy ?? 0,
      duration: 420,
      delay: stagger(5),
      ease: "inQuad",
    })
    timeline.add(
      motifFaces[to],
      {
        opacity: 1,
        translateX: 0,
        translateY: 0,
        duration: 460,
        delay: stagger(5),
        ease: "outBack",
      },
      420,
    )
  }

  if (reducedMotion) {
    // Static end state of the mount-time handoff: motif B assembled.
    setHidden(motifFaces.a, true)
    setHidden(motifFaces.b, false)
    showing = "b"
  } else {
    setHidden(motifFaces.b, true)
    play()
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
