import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"
import { mountSvgMarkup } from "../../svg_mount"
import type { ExperimentContext, ExperimentHandle, ExperimentMeta } from "../experiment"
import { createEngine, paletteFrom, shade, voxelTone } from "../runtime/engine"
import { facesByMeta } from "../runtime/svg_anim"

export const meta: ExperimentMeta = {
  id: "stake-vault-fill",
  name: "Vault Fill",
  class: "data",
  tags: ["staking", "progress", "vault"],
  productUse: "Staking progress; a glass vault that fills with gold voxels as the staked share grows.",
  budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
}

interface VaultData {
  ratio: number
}

const LAYER_COUNT = 5

function normalizeData(data: unknown): VaultData {
  const candidate = data as Partial<VaultData> | undefined
  const ratio =
    typeof candidate?.ratio === "number" && Number.isFinite(candidate.ratio)
      ? Math.max(0, Math.min(1, candidate.ratio))
      : 0.62
  return { ratio }
}

function layersFor(ratio: number): number {
  return Math.floor(ratio * LAYER_COUNT)
}

export function mount(ctx: ExperimentContext): ExperimentHandle {
  const { el, Heerich, reducedMotion } = ctx
  const palette = paletteFrom(el)
  const engine = createEngine(Heerich, { tile: 13, camera: { type: "oblique", angle: 315, distance: 14 } })

  el.classList.add("rg-collateral-host")
  let animation: JSAnimation | null = null
  let currentLayers = 0
  let disposed = false

  const glassFace: Record<string, unknown> = {
    fill: palette.ink,
    fillOpacity: 0.12,
    stroke: shade(palette.ink, 0.3),
    strokeWidth: 0.5,
  }

  function render(ratio: number, animateFrom: number | null): void {
    animation?.cancel()
    animation = null

    const layers = layersFor(ratio)
    currentLayers = layers

    engine.clear()
    engine.batch(() => {
      engine.addGeometry({
        type: "box",
        position: [-4, 1, -4],
        size: [8, 1, 8],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.2)),
      })
      engine.addGeometry({
        type: "box",
        position: [-3, -5, -3],
        size: [6, 6, 6],
        meta: { part: "shell" },
        style: { default: glassFace },
        opaque: false,
      })
      engine.removeGeometry({ type: "box", position: [-2, -5, -2], size: [4, 6, 4] })
      for (let layer = 0; layer < layers; layer += 1) {
        engine.addGeometry({
          type: "box",
          position: [-2, -layer, -2],
          size: [4, 1, 4],
          meta: { layer },
          style: voxelTone(palette.gold),
        })
      }
      if (layers > 0) {
        engine.addGeometry({
          type: "box",
          position: [-2, -layers, -2],
          size: [4, 1, 4],
          scale: [1, 0.3, 1],
          scaleOrigin: [0.5, 1, 0.5],
          opaque: false,
          meta: { part: "surface" },
          style: {
            top: { fill: palette.paper, stroke: shade(palette.gold, -0.2), strokeWidth: 0.4 },
            default: { fill: shade(palette.paper, -0.12), stroke: shade(palette.gold, -0.2), strokeWidth: 0.4 },
          },
        })
      }
    })

    mountSvgMarkup(el, engine.toSVG({ padding: 22 }))

    if (reducedMotion || animateFrom === null) return

    if (layers > animateFrom) {
      const rising: SVGElement[] = []
      for (let layer = animateFrom; layer < layers; layer += 1) {
        rising.push(...facesByMeta(el, "layer", String(layer)))
      }
      rising.push(...facesByMeta(el, "part", "surface"))
      animation = animate(rising, {
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 420,
        delay: stagger(9),
        ease: "outQuad",
      })
    } else {
      const surface = facesByMeta(el, "part", "surface")
      if (surface.length > 0) {
        animation = animate(surface, { opacity: [0, 1], duration: 300, ease: "outQuad" })
      }
    }
  }

  render(normalizeData(ctx.data).ratio, reducedMotion ? null : 0)

  return {
    cleanup() {
      disposed = true
      animation?.cancel()
      animation = null
      el.classList.remove("rg-collateral-host")
      el.replaceChildren()
    },
    pause() {
      animation?.pause()
    },
    resume() {
      animation?.play()
    },
    update(data: unknown) {
      const next = normalizeData(data)
      const nextLayers = layersFor(next.ratio)
      if (!reducedMotion && nextLayers < currentLayers) {
        // Drain top-down: fade the surface and the emptied layers, then re-render.
        const falling: SVGElement[] = [...facesByMeta(el, "part", "surface")]
        for (let layer = currentLayers - 1; layer >= nextLayers; layer -= 1) {
          falling.push(...facesByMeta(el, "layer", String(layer)))
        }
        animation?.cancel()
        animation = animate(falling, {
          opacity: 0,
          duration: 240,
          delay: stagger(8),
          ease: "inQuad",
        })
        void animation.then(() => {
          if (disposed) return
          render(next.ratio, nextLayers)
        })
      } else {
        render(next.ratio, reducedMotion ? null : currentLayers)
      }
    },
  }
}
