// Face budget: crown sigil = 21 voxels x <=3 visible faces = ~63 faces < 1500.
import { createTimeline, stagger, type Timeline } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, voxelTone } from "../runtime/engine"

export const meta: ExperimentMeta = {
  id: "logo-scatter-handoff",
  name: "Scatter Handoff",
  class: "transition",
  tags: ["hero", "scroll", "logo"],
  productUse: "Hero-to-content handoff; the mark scatters into depth and regroups as the next section's sigil.",
  budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" },
}

/** The crown sigil on a 7x5 grid: columns of [x, height] pairs (local copy). */
const CROWN_COLUMNS: Array<[number, number]> = [
  [0, 3],
  [1, 2],
  [2, 4],
  [3, 3],
  [4, 4],
  [5, 2],
  [6, 3],
]

/** Approximate screen pixels per grid unit at tile 15. */
const UNIT_PX = 15

interface VoxTargets {
  scatter: { dx: number; dy: number }
  seal: { dx: number; dy: number }
}

/** Deterministic outward scatter per voxel index. */
function scatterFor(seed: number): { dx: number; dy: number } {
  const angle = (seed * 137.508) % 360
  const radius = 26 + ((seed * 71) % 22)
  return {
    dx: Math.cos((angle * Math.PI) / 180) * radius,
    dy: Math.sin((angle * Math.PI) / 180) * radius,
  }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 15, camera: { type: "oblique", angle: 315, distance: 12 } })

  // Per-voxel crown grid positions, recorded while building the scene.
  const crownGrid: Array<{ x: number; y: number }> = []
  let voxelIndex = 0
  for (const [x, height] of CROWN_COLUMNS) {
    for (let y = 0; y < height; y += 1) {
      engine.addGeometry({
        type: "box",
        position: [x - 3, -y, 0],
        size: [1, 1, 1],
        meta: { part: "crown", vox: voxelIndex },
        style: voxelTone(y === height - 1 ? palette.gold : palette.ink),
      })
      crownGrid.push({ x: x - 3, y: -y })
      voxelIndex += 1
    }
  }

  el.classList.add("rg-collateral-host", "rg-collateral-replayable")
  mountSvgMarkup(el, engine.toSVG({ padding: 26 }))

  // Map voxel i -> 3x3 seal slot, expressed as an approximate pixel delta from
  // the voxel's crown position.
  const targetsByVox = new Map<number, VoxTargets>()
  crownGrid.forEach((grid: { x: number; y: number }, vox: number) => {
    const slot = vox % 9
    const sealX = (slot % 3) - 1
    const sealY = -Math.floor(slot / 3)
    targetsByVox.set(vox, {
      scatter: scatterFor(vox),
      seal: { dx: (sealX - grid.x) * UNIT_PX, dy: (sealY - grid.y) * UNIT_PX },
    })
  })

  const faces = Array.from(el.querySelectorAll<SVGElement>("[data-vox]"))
  const targetsOf = (target: unknown): VoxTargets =>
    targetsByVox.get(Number((target as SVGElement).dataset.vox ?? "0")) ?? {
      scatter: { dx: 0, dy: 0 },
      seal: { dx: 0, dy: 0 },
    }

  const applyArrangement = (arrangement: "crown" | "seal"): void => {
    for (const face of faces) {
      const targets = targetsOf(face)
      face.style.opacity = "1"
      face.style.transform =
        arrangement === "crown"
          ? "translate(0px, 0px)"
          : `translate(${targets.seal.dx.toFixed(1)}px, ${targets.seal.dy.toFixed(1)}px)`
    }
  }

  let arrangement: "crown" | "seal" = "crown"
  let timeline: Timeline | null = null

  const play = (): void => {
    const from = arrangement
    const to: "crown" | "seal" = arrangement === "crown" ? "seal" : "crown"
    arrangement = to
    timeline?.cancel()
    timeline = null
    if (reducedMotion) {
      applyArrangement(to)
      return
    }
    applyArrangement(from)
    timeline = createTimeline()
    timeline.add(faces, {
      opacity: 0.2,
      translateX: (target: unknown) => targetsOf(target).scatter.dx,
      translateY: (target: unknown) => targetsOf(target).scatter.dy,
      duration: 380,
      delay: stagger(8),
      ease: "inQuad",
    })
    timeline.add(
      faces,
      {
        opacity: 1,
        translateX: (target: unknown) => (to === "crown" ? 0 : targetsOf(target).seal.dx),
        translateY: (target: unknown) => (to === "crown" ? 0 : targetsOf(target).seal.dy),
        duration: 460,
        delay: stagger(8),
        ease: "outBack",
      },
      400,
    )
  }

  applyArrangement("crown")

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
