import type { RegentHook, RegentHookContext } from "../regent_hook_types"
import { prefersReducedMotion } from "../regent_motion"
import { mountSceneError } from "../svg_mount"
import type { ExperimentHandle, ExperimentModule } from "./experiment"
import { loadExperiment } from "./registry"
import { measureMount } from "./runtime/measure"
import { observeVisibility } from "./runtime/observer"
import { scheduleAnimation } from "./runtime/scheduler"

/** How long an experiment may sit offscreen (paused) before it is fully unmounted. */
const OFFSCREEN_UNMOUNT_MS = 8000

interface CollateralState {
  module: ExperimentModule | null
  handle: ExperimentHandle | null
  visible: boolean
  loading: boolean
  unobserve: () => void
  schedule: ReturnType<typeof scheduleAnimation>
  offscreenTimer: number | null
  onClick: ((event: MouseEvent) => void) | null
  onUpdate: ((event: Event) => void) | null
}

type CollateralHookContext = RegentHookContext & { __collateral?: CollateralState }

function parseData(el: HTMLElement): unknown {
  const raw = el.dataset.experimentData
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

function mountExperiment(hook: CollateralHookContext, state: CollateralState): void {
  if (state.handle || !state.module) return
  const el = hook.el
  const Heerich = window.Heerich
  if (!Heerich) {
    mountSceneError(el, "Voxel engine unavailable", ["Heerich was not installed before hooks mounted."])
    return
  }

  const id = el.dataset.experimentId ?? "unknown"
  const { handle, mountMs } = measureMount(id, () =>
    state.module!.mount({
      el,
      Heerich,
      reducedMotion: prefersReducedMotion(),
      data: parseData(el),
      pushEvent: (event, payload) => hook.pushEvent(event, payload),
    }),
  )
  state.handle = handle
  el.dataset.mountMs = mountMs.toFixed(1)
  // Mount paused; the scheduler decides when it actually runs.
  handle.pause()
  state.schedule.setVisible(state.visible)

  if (handle.play) {
    state.onClick = () => handle.play?.()
    el.addEventListener("click", state.onClick)
    el.classList.add("rg-collateral-replayable")
  }

  if (handle.update) {
    state.onUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail
      state.handle?.update?.(detail)
    }
    el.addEventListener("collateral:update", state.onUpdate)
  }
}

function unmountExperiment(hook: CollateralHookContext, state: CollateralState): void {
  if (state.onClick) {
    hook.el.removeEventListener("click", state.onClick)
    state.onClick = null
  }
  if (state.onUpdate) {
    hook.el.removeEventListener("collateral:update", state.onUpdate)
    state.onUpdate = null
  }
  state.handle?.cleanup()
  state.handle = null
}

async function ensureLoaded(hook: CollateralHookContext, state: CollateralState): Promise<void> {
  if (state.module || state.loading) return
  const id = hook.el.dataset.experimentId ?? ""
  const loading = loadExperiment(id)
  if (!loading) {
    mountSceneError(hook.el, "Unknown experiment", [`No experiment registered for "${id}".`])
    return
  }
  state.loading = true
  try {
    state.module = await loading
  } catch (error) {
    mountSceneError(hook.el, "Experiment failed to load", [String(error)])
    return
  } finally {
    state.loading = false
  }
  if (state.visible) mountExperiment(hook, state)
}

export const BrandCollateral: RegentHook = {
  mounted(this: CollateralHookContext) {
    const hook = this
    const state: CollateralState = {
      module: null,
      handle: null,
      visible: false,
      loading: false,
      unobserve: () => undefined,
      schedule: scheduleAnimation({
        pause: () => state.handle?.pause(),
        resume: () => state.handle?.resume(),
      }),
      offscreenTimer: null,
      onClick: null,
      onUpdate: null,
    }
    hook.__collateral = state

    state.unobserve = observeVisibility(hook.el, (visible) => {
      state.visible = visible
      state.schedule.setVisible(visible)
      if (visible) {
        if (state.offscreenTimer !== null) {
          window.clearTimeout(state.offscreenTimer)
          state.offscreenTimer = null
        }
        if (state.handle) return
        if (state.module) {
          mountExperiment(hook, state)
        } else {
          void ensureLoaded(hook, state)
        }
      } else if (state.handle) {
        state.offscreenTimer = window.setTimeout(() => {
          state.offscreenTimer = null
          unmountExperiment(hook, state)
        }, OFFSCREEN_UNMOUNT_MS)
      }
    })
  },

  destroyed(this: CollateralHookContext) {
    const state = this.__collateral
    if (!state) return
    if (state.offscreenTimer !== null) window.clearTimeout(state.offscreenTimer)
    state.unobserve()
    unmountExperiment(this, state)
    state.schedule.release()
    this.__collateral = undefined
  },
}
