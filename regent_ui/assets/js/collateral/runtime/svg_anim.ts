import { animate, stagger, type JSAnimation } from "../../../vendor/anime.esm.js"

/**
 * Select rendered faces by voxel meta. Heerich emits every `meta` entry as a
 * data-* attribute on its faces natively, so lowercase meta keys map straight
 * to attribute selectors.
 */
export function facesByMeta(root: ParentNode, key: string, value?: string): SVGElement[] {
  const attr = `data-${key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
  const selector = value === undefined ? `[${attr}]` : `[${attr}="${value}"]`
  return Array.from(root.querySelectorAll<SVGElement>(selector))
}

export interface FaceRevealOptions {
  duration?: number
  delayStep?: number
  from?: "first" | "last" | "center" | "random"
}

/** Staggered opacity reveal across a set of SVG face elements. Returns the animation for pause/cleanup. */
export function staggerFaceReveal(faces: Element[], options: FaceRevealOptions = {}): JSAnimation | null {
  if (faces.length === 0) return null
  const ordered =
    options.from === "random" ? shuffled(faces) : faces
  const from = options.from === "random" || options.from === undefined ? undefined : options.from
  return animate(ordered, {
    opacity: [0, 1],
    duration: options.duration ?? 420,
    delay: stagger(options.delayStep ?? 14, from ? { from } : undefined),
    ease: "outQuad",
  })
}

function shuffled<T>(items: T[]): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
