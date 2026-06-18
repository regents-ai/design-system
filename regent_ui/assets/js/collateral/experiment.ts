import type { HeerichConstructor } from "../heerich_types"

export type ExperimentClass =
  | "ambient"
  | "micro"
  | "data"
  | "transition"
  | "celebration"
  | "loading"

export interface ExperimentBudget {
  /** Hard cap on rendered heerich faces; enforced by tests. */
  maxFaces: number
  /** Mount-to-first-paint budget in milliseconds. */
  maxMountMs: number
  /** What runs while the experiment sits onscreen unattended. */
  idleLoop: "none" | "css" | "raf"
}

export interface ExperimentMeta {
  id: string
  name: string
  class: ExperimentClass
  tags: string[]
  productUse: string
  budget: ExperimentBudget
}

export interface ExperimentContext {
  el: HTMLElement
  Heerich: HeerichConstructor
  reducedMotion: boolean
  /** Parsed from data-experiment-data; data-driven experiments receive their demo payload here. */
  data?: unknown
  pushEvent?: (event: string, payload: Record<string, unknown>) => void
}

export interface ExperimentHandle {
  /** Full teardown. Must stop every animation/rAF loop and leave `el` empty. */
  cleanup(): void
  /** Offscreen: pause all anime instances and rAF loops. Idempotent. */
  pause(): void
  resume(): void
  /** Data-driven experiments: re-render in place from a new payload. */
  update?(data: unknown): void
  /** One-shot experiments (transition/celebration): replay the sequence. */
  play?(): void
}

export interface ExperimentModule {
  meta: ExperimentMeta
  mount(ctx: ExperimentContext): ExperimentHandle
}
