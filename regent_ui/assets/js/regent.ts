import type { HeerichConstructor } from "./heerich_types"
import { hooks } from "./hooks"
import { BrandCollateral } from "./collateral/hook"
import { loadExperiment, registry } from "./collateral/registry"
import { HoverCycle, HoverCycleController, normalizeHoverCycleSpec } from "./regent_hover_cycle"
import { REGENT_SIGILS, sigilSvg, sigilVoxelMarkup } from "./regent_sigils"
import { prefersReducedMotion, pulseElement, revealSequence, traceSvgPaths } from "./regent_motion"
import { RegentSceneRenderer } from "./regent_scene_renderer"

export {
  hooks,
  BrandCollateral,
  loadExperiment,
  registry,
  HoverCycle,
  HoverCycleController,
  normalizeHoverCycleSpec,
  REGENT_SIGILS,
  sigilSvg,
  sigilVoxelMarkup,
  prefersReducedMotion,
  pulseElement,
  revealSequence,
  traceSvgPaths,
  RegentSceneRenderer,
}

export type {
  ExperimentClass,
  ExperimentBudget,
  ExperimentContext,
  ExperimentHandle,
  ExperimentMeta,
  ExperimentModule,
} from "./collateral/experiment"

export function installHeerich(HeerichCtor: unknown): void {
  window.Heerich = HeerichCtor as HeerichConstructor
}
