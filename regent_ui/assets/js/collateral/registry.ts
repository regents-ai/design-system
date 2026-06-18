import type { ExperimentModule } from "./experiment"

export type ExperimentLoader = () => Promise<ExperimentModule>

/**
 * Lazy loader per experiment. Keys must stay in parity with manifest.json
 * (asserted by collateral tests); esbuild code-splitting turns each entry
 * into its own chunk so galleries only pay for what scrolls into view.
 */
export const registry: Record<string, ExperimentLoader> = {
  "chamber-drift": () => import("./experiments/chamber_drift"),
  "lattice-weave": () => import("./experiments/lattice_weave"),
  "haze-columns": () => import("./experiments/haze_columns"),
  "ink-tide": () => import("./experiments/ink_tide"),
  "starfield-depth": () => import("./experiments/starfield_depth"),
  "tilt-parallax-card": () => import("./experiments/tilt_parallax_card"),
  "hover-assemble-logo": () => import("./experiments/hover_assemble_logo"),
  "button-press-pad": () => import("./experiments/button_press_pad"),
  "toggle-flip-cube": () => import("./experiments/toggle_flip_cube"),
  "checkbox-stack-tick": () => import("./experiments/checkbox_stack_tick"),
  "input-focus-frame": () => import("./experiments/input_focus_frame"),
  "voxel-bar-relay": () => import("./experiments/voxel_bar_relay"),
  "terrain-heightmap": () => import("./experiments/terrain_heightmap"),
  "stake-vault-fill": () => import("./experiments/stake_vault_fill"),
  "launch-pipeline-track": () => import("./experiments/launch_pipeline_track"),
  "techtree-growth": () => import("./experiments/techtree_growth"),
  "podium-bids": () => import("./experiments/podium_bids"),
  "dissolve-rebuild": () => import("./experiments/dissolve_rebuild"),
  "tunnel-warp": () => import("./experiments/tunnel_warp"),
  "curtain-slats": () => import("./experiments/curtain_slats"),
  "logo-scatter-handoff": () => import("./experiments/logo_scatter_handoff"),
  "confetti-voxelburst": () => import("./experiments/confetti_voxelburst"),
  "gavel-strike": () => import("./experiments/gavel_strike"),
  "crown-coronation": () => import("./experiments/crown_coronation"),
  "vault-jackpot": () => import("./experiments/vault_jackpot"),
  "stack-build-loader": () => import("./experiments/stack_build_loader"),
  "progress-ring": () => import("./experiments/progress_ring"),
}

export function loadExperiment(id: string): Promise<ExperimentModule> | null {
  const loader = registry[id]
  return loader ? loader() : null
}
