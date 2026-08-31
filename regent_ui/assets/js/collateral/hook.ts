import type { RegentHook, RegentHookContext } from "../regent_hook_types.ts"
import { prefersReducedMotion } from "../regent_motion.ts"
import { mountSceneError } from "../svg_mount.ts"
import type { ExperimentHandle, ExperimentModule } from "./experiment.ts"
import { loadExperiment } from "./registry.ts"
import { measureMount } from "./runtime/measure.ts"
import { observeVisibility } from "./runtime/observer.ts"
import { scheduleAnimation } from "./runtime/scheduler.ts"

/** How long an experiment may sit offscreen (paused) before it is fully unmounted. */
const OFFSCREEN_UNMOUNT_MS = 8000

interface CollateralState {
  module: ExperimentModule | null
  handle: ExperimentHandle | null
  alive: boolean
  visible: boolean
  loading: boolean
  unobserve: () => void
  schedule: ReturnType<typeof scheduleAnimation>
  offscreenTimer: number | null
  onClick: ((event: MouseEvent) => void) | null
  onKeydown: ((event: KeyboardEvent) => void) | null
  onUpdate: ((event: Event) => void) | null
  replayAttributes: {
    role: string | null
    tabIndex: string | null
    ariaLabel: string | null
  } | null
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

function restoreAttribute(el: HTMLElement, name: string, value: string | null): void {
  if (value === null) {
    el.removeAttribute(name)
  } else {
    el.setAttribute(name, value)
  }
}

function mountExperiment(hook: CollateralHookContext, state: CollateralState): void {
  if (hook.__collateral !== state || !state.alive || !state.visible || state.handle || !state.module) return
  const el = hook.el
  const Heerich = window.Heerich
  if (!Heerich) {
    mountSceneError(el, "Voxel engine unavailable", ["Heerich was not installed before hooks mounted."])
    return
  }

  const id = el.dataset.experimentId ?? "unknown"
  const reducedMotion = prefersReducedMotion()
  const { handle, mountMs } = measureMount(id, () =>
    state.module!.mount({
      el,
      Heerich,
      reducedMotion,
      data: parseData(el),
      pushEvent: (event, payload) => hook.pushEvent(event, payload),
    }),
  )
  state.handle = handle
  el.dataset.mountMs = mountMs.toFixed(1)
  // Mount paused; the scheduler decides when it actually runs.
  handle.pause()
  state.schedule.setVisible(state.visible)

  if (handle.play && !reducedMotion) {
    const play = () => state.handle?.play?.()
    state.replayAttributes = {
      role: el.getAttribute("role"),
      tabIndex: el.getAttribute("tabindex"),
      ariaLabel: el.getAttribute("aria-label"),
    }
    el.setAttribute("role", "button")
    el.setAttribute("tabindex", "0")
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", `Replay ${id.replace(/-/g, " ")}`)

    state.onClick = play
    state.onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return
      event.preventDefault()
      play()
    }
    el.addEventListener("click", state.onClick)
    el.addEventListener("keydown", state.onKeydown)
    el.classList.add("rg-collateral-replayable")
  } else {
    el.classList.remove("rg-collateral-replayable")
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
  if (state.onKeydown) {
    hook.el.removeEventListener("keydown", state.onKeydown)
    state.onKeydown = null
  }
  if (state.replayAttributes) {
    restoreAttribute(hook.el, "role", state.replayAttributes.role)
    restoreAttribute(hook.el, "tabindex", state.replayAttributes.tabIndex)
    restoreAttribute(hook.el, "aria-label", state.replayAttributes.ariaLabel)
    state.replayAttributes = null
  }
  hook.el.classList.remove("rg-collateral-replayable")
  if (state.onUpdate) {
    hook.el.removeEventListener("collateral:update", state.onUpdate)
    state.onUpdate = null
  }
  state.handle?.cleanup()
  state.handle = null
}

async function ensureLoaded(hook: CollateralHookContext, state: CollateralState): Promise<void> {
  if (hook.__collateral !== state || !state.alive || state.module || state.loading) return
  const id = hook.el.dataset.experimentId ?? ""
  const loading = loadExperiment(id)
  if (!loading) {
    if (hook.__collateral === state && state.alive) {
      mountSceneError(hook.el, "Unknown experiment", [`No experiment registered for "${id}".`])
    }
    return
  }
  state.loading = true
  try {
    const module = await loading
    if (hook.__collateral !== state || !state.alive) return
    state.module = module
  } catch (error) {
    if (hook.__collateral === state && state.alive) {
      mountSceneError(hook.el, "Experiment failed to load", [String(error)])
    }
    return
  } finally {
    state.loading = false
  }
  if (hook.__collateral === state && state.alive && state.visible) mountExperiment(hook, state)
}

export const BrandCollateral: RegentHook = {
  mounted(this: CollateralHookContext) {
    const hook = this
    const state: CollateralState = {
      module: null,
      handle: null,
      alive: true,
      visible: false,
      loading: false,
      unobserve: () => undefined,
      schedule: scheduleAnimation({
        pause: () => state.handle?.pause(),
        resume: () => state.handle?.resume(),
      }),
      offscreenTimer: null,
      onClick: null,
      onKeydown: null,
      onUpdate: null,
      replayAttributes: null,
    }
    hook.__collateral = state

    state.unobserve = observeVisibility(hook.el, (visible) => {
      if (hook.__collateral !== state || !state.alive) return
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
    state.alive = false
    this.__collateral = undefined
    if (state.offscreenTimer !== null) window.clearTimeout(state.offscreenTimer)
    state.unobserve()
    unmountExperiment(this, state)
    state.schedule.release()
  },
}
