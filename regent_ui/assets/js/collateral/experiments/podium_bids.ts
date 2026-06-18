import { animate, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "podium-bids",
  name: "Podium Bids",
  class: "data",
  tags: ["leaderboard", "auction", "ranking"],
  productUse: "Live leaderboards; podium columns that grow and swap places as rankings change.",
  budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
}

interface PodiumEntry {
  label: string
  value: number
}

interface PodiumData {
  entries: PodiumEntry[]
}

const TILE = 13
const MAX_COLUMN_HEIGHT = 8
/** Slot x centers, winner in the middle, runners-up fanning outward. */
const SLOT_X = [0, -2.2, 2.2, -4.4, 4.4]

const DEMO_ENTRIES: PodiumEntry[] = [
  { label: "AURA", value: 86 },
  { label: "MINT", value: 64 },
  { label: "PLEX", value: 51 },
  { label: "NOVA", value: 38 },
  { label: "HALO", value: 22 },
]

function normalizeData(data: unknown): PodiumData {
  const candidate = data as Partial<PodiumData> | undefined
  if (!Array.isArray(candidate?.entries)) return { entries: DEMO_ENTRIES }
  const entries = candidate.entries
    .filter(
      (entry): entry is PodiumEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as PodiumEntry).label === "string" &&
        typeof (entry as PodiumEntry).value === "number" &&
        Number.isFinite((entry as PodiumEntry).value) &&
        (entry as PodiumEntry).value >= 0,
    )
    .map((entry, index) => ({
      label: entry.label.replace(/[^\w-]/g, "").slice(0, 12) || `entry-${index}`,
      value: entry.value,
    }))
    .slice(0, SLOT_X.length)
  return entries.length > 0 ? { entries } : { entries: DEMO_ENTRIES }
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: TILE, camera: { type: "oblique", angle: 315, distance: 14 } })

  el.classList.add("rg-collateral-host")
  let animations: JSAnimation[] = []
  const previousSlotX = new Map<string, number>()

  const slotColors = [palette.gold, palette.charcoal, palette.ink, palette.olive, palette.olive]

  function render(data: PodiumData, animateIn: boolean): void {
    animations.forEach((animation) => animation.cancel())
    animations = []

    const sorted = data.entries.slice().sort((a, b) => b.value - a.value)
    const maxValue = Math.max(...sorted.map((entry) => entry.value), 1)

    engine.clear()
    engine.batch(() => {
      engine.addGeometry({
        type: "box",
        position: [-6, 1, -2],
        size: [12, 1, 4],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.25)),
      })
      sorted.forEach((entry, slot) => {
        const height = Math.max(1, Math.round((entry.value / maxValue) * MAX_COLUMN_HEIGHT))
        engine.addGeometry({
          type: "box",
          position: [SLOT_X[slot] - 1, 1 - height, -1],
          size: [2, height, 2],
          meta: { slot, key: entry.label },
          style: voxelTone(slotColors[slot]),
        })
      })
    })

    mountSvgMarkup(el, engine.toSVG({ padding: 16 }))

    if (animateIn && !reducedMotion) {
      sorted.forEach((entry, slot) => {
        const faces = facesByMeta(el, "key", entry.label)
        if (faces.length === 0) return
        const fromX = previousSlotX.get(entry.label)
        const toX = SLOT_X[slot]
        if (fromX !== undefined && fromX !== toX) {
          animations.push(
            animate(faces, {
              translateX: [(fromX - toX) * TILE, 0],
              duration: 620,
              ease: "outQuart",
            }),
          )
        } else if (fromX === undefined) {
          animations.push(
            animate(faces, {
              opacity: [0, 1],
              translateY: [8, 0],
              duration: 420,
              ease: "outQuad",
            }),
          )
        }
      })
    }

    previousSlotX.clear()
    sorted.forEach((entry, slot) => previousSlotX.set(entry.label, SLOT_X[slot]))
  }

  render(normalizeData(ctx.data), true)

  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel())
      animations = []
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      animations.forEach((animation) => animation.pause())
    },
    resume() {
      animations.forEach((animation) => animation.play())
    },
    update(data: unknown) {
      render(normalizeData(data), true)
    },
  }
}
