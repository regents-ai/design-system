import type { HeerichConstructor, HeerichInstance } from "../../heerich_types"

export interface BrandPalette {
  ink: string
  charcoal: string
  gold: string
  paper: string
  olive: string
  positive: string
}

const FALLBACK: BrandPalette = {
  ink: "#034568",
  charcoal: "#315569",
  gold: "#d4a756",
  paper: "#fbf4de",
  olive: "#848078",
  positive: "#2f7d4f",
}

function cssVar(style: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = style.getPropertyValue(name).trim()
  return value === "" ? fallback : value
}

/** Resolve the brand palette from CSS custom properties on (or above) the host element. */
export function paletteFrom(el: Element): BrandPalette {
  const style = window.getComputedStyle(el)
  return {
    ink: cssVar(style, "--brand-ink", FALLBACK.ink),
    charcoal: cssVar(style, "--brand-charcoal", FALLBACK.charcoal),
    gold: cssVar(style, "--brand-gold", FALLBACK.gold),
    paper: cssVar(style, "--brand-paper", FALLBACK.paper),
    olive: cssVar(style, "--brand-olive", FALLBACK.olive),
    positive: cssVar(style, "--positive", FALLBACK.positive),
  }
}

export interface EngineOptions {
  tile?: number | [number, number] | [number, number, number]
  camera?: Record<string, unknown>
  style?: Record<string, unknown>
}

export function createEngine(Heerich: HeerichConstructor, options: EngineOptions = {}): HeerichInstance {
  return new Heerich({
    tile: options.tile ?? 14,
    camera: options.camera ?? { type: "oblique", angle: 225, distance: 0.5 },
    style: options.style,
  })
}

/** Shade a hex color toward black (amount < 0) or white (amount > 0); amount in [-1, 1]. */
export function shade(hex: string, amount: number): string {
  const parsed = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!parsed) return hex
  const num = parseInt(parsed[1], 16)
  const channels = [num >> 16, (num >> 8) & 0xff, num & 0xff].map((channel) => {
    const target = amount >= 0 ? 255 : 0
    const mixed = channel + (target - channel) * Math.abs(amount)
    return Math.max(0, Math.min(255, Math.round(mixed)))
  })
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
}

/** Standard three-tone face style for a brand color: lit top, base sides, shaded front. */
export function voxelTone(color: string): Record<string, unknown> {
  return {
    top: { fill: shade(color, 0.18) },
    left: { fill: color },
    right: { fill: shade(color, -0.16) },
    front: { fill: shade(color, -0.16) },
    default: { fill: color },
  }
}
