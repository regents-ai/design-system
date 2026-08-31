import assert from "node:assert/strict"
import { beforeEach, mock, test } from "node:test"

type ExperimentModule = {
  mount: (options: Record<string, unknown>) => {
    cleanup: () => void
    pause: () => void
    resume: () => void
    play?: () => void
  }
}

type Scenario = {
  loadExperiment: (id: string) => Promise<ExperimentModule> | null
  visibilityChanged: ((visible: boolean) => void) | null
  reducedMotion: boolean
  errors: string[]
  unobserved: number
  released: number
}

let scenario: Scenario

mock.module(new URL("../../assets/js/regent_motion.ts", import.meta.url).href, {
  namedExports: {
    prefersReducedMotion: () => scenario.reducedMotion,
  },
})

mock.module(new URL("../../assets/js/svg_mount.ts", import.meta.url).href, {
  namedExports: {
    mountSceneError: (_el: unknown, title: string) => scenario.errors.push(title),
  },
})

mock.module(new URL("../../assets/js/collateral/registry.ts", import.meta.url).href, {
  namedExports: {
    loadExperiment: (id: string) => scenario.loadExperiment(id),
  },
})

mock.module(new URL("../../assets/js/collateral/runtime/measure.ts", import.meta.url).href, {
  namedExports: {
    measureMount: (_id: string, mountExperiment: () => unknown) => ({
      handle: mountExperiment(),
      mountMs: 1,
    }),
  },
})

mock.module(new URL("../../assets/js/collateral/runtime/observer.ts", import.meta.url).href, {
  namedExports: {
    observeVisibility: (_el: unknown, callback: (visible: boolean) => void) => {
      scenario.visibilityChanged = callback
      return () => {
        scenario.unobserved += 1
      }
    },
  },
})

mock.module(new URL("../../assets/js/collateral/runtime/scheduler.ts", import.meta.url).href, {
  namedExports: {
    scheduleAnimation: () => ({
      setVisible: () => undefined,
      release: () => {
        scenario.released += 1
      },
    }),
  },
})

const { BrandCollateral } = await import("../../assets/js/collateral/hook.ts")

class FakeClassList {
  private values = new Set<string>()

  add(value: string): void {
    this.values.add(value)
  }

  remove(value: string): void {
    this.values.delete(value)
  }

  contains(value: string): boolean {
    return this.values.has(value)
  }
}

class FakeElement {
  dataset: Record<string, string> = { experimentId: "crown-coronation" }
  classList = new FakeClassList()
  private attributes = new Map<string, string>()
  private listeners = new Map<string, Set<(event: Record<string, unknown>) => void>>()

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name)
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value)
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name)
  }

  addEventListener(name: string, listener: (event: Record<string, unknown>) => void): void {
    const listeners = this.listeners.get(name) ?? new Set()
    listeners.add(listener)
    this.listeners.set(name, listeners)
  }

  removeEventListener(name: string, listener: (event: Record<string, unknown>) => void): void {
    this.listeners.get(name)?.delete(listener)
  }

  emit(name: string, event: Record<string, unknown> = {}): void {
    for (const listener of this.listeners.get(name) ?? []) listener(event)
  }

  listenerCount(name: string): number {
    return this.listeners.get(name)?.size ?? 0
  }
}

function hookFor(el: FakeElement): Record<string, unknown> {
  return {
    el,
    pushEvent: () => undefined,
  }
}

function experimentWith(handle: ExperimentModule["mount"] extends (...args: never[]) => infer Result ? Result : never) {
  return {
    mount: () => handle,
  }
}

async function mountVisible(hook: Record<string, unknown>): Promise<void> {
  BrandCollateral.mounted.call(hook)
  assert.ok(scenario.visibilityChanged)
  scenario.visibilityChanged(true)
  await new Promise<void>((resolve) => setImmediate(resolve))
}

beforeEach(() => {
  scenario = {
    loadExperiment: () => Promise.reject(new Error("test loader was not configured")),
    visibilityChanged: null,
    reducedMotion: false,
    errors: [],
    unobserved: 0,
    released: 0,
  }

  globalThis.window = {
    Heerich: {},
    setTimeout,
    clearTimeout,
  } as unknown as Window & typeof globalThis
})

test("Enter and Space replay while unrelated keys are ignored", async () => {
  let plays = 0
  const el = new FakeElement()
  const hook = hookFor(el)
  scenario.loadExperiment = () =>
    Promise.resolve(
      experimentWith({
        cleanup: () => undefined,
        pause: () => undefined,
        resume: () => undefined,
        play: () => {
          plays += 1
        },
      }),
    )

  await mountVisible(hook)

  assert.equal(el.getAttribute("role"), "button")
  assert.equal(el.getAttribute("tabindex"), "0")
  assert.equal(el.getAttribute("aria-label"), "Replay crown coronation")

  let prevented = 0
  const keyEvent = (key: string) => ({
    key,
    preventDefault: () => {
      prevented += 1
    },
  })

  el.emit("keydown", keyEvent("Escape"))
  assert.equal(plays, 0)
  assert.equal(prevented, 0)

  el.emit("keydown", keyEvent("Enter"))
  el.emit("keydown", keyEvent(" "))
  assert.equal(plays, 2)
  assert.equal(prevented, 2)
})

test("destroying while loading prevents a late experiment mount", async () => {
  let resolveLoad: (module: ExperimentModule) => void = () => undefined
  let mounts = 0
  const el = new FakeElement()
  const hook = hookFor(el)
  scenario.loadExperiment = () =>
    new Promise((resolve) => {
      resolveLoad = resolve
    })

  BrandCollateral.mounted.call(hook)
  assert.ok(scenario.visibilityChanged)
  scenario.visibilityChanged(true)
  BrandCollateral.destroyed.call(hook)

  resolveLoad({
    mount: () => {
      mounts += 1
      return { cleanup: () => undefined, pause: () => undefined, resume: () => undefined }
    },
  })
  await new Promise<void>((resolve) => setImmediate(resolve))

  assert.equal(mounts, 0)
  assert.equal(el.listenerCount("keydown"), 0)
  assert.equal(el.getAttribute("role"), null)
  assert.deepEqual(scenario.errors, [])
  assert.equal(scenario.unobserved, 1)
  assert.equal(scenario.released, 1)
  assert.equal(hook.__collateral, undefined)
})

test("destroy restores host attributes and removes replay listeners", async () => {
  let cleanups = 0
  let plays = 0
  const el = new FakeElement()
  el.setAttribute("role", "region")
  el.setAttribute("tabindex", "-1")
  el.setAttribute("aria-label", "Original label")
  const hook = hookFor(el)
  scenario.loadExperiment = () =>
    Promise.resolve(
      experimentWith({
        cleanup: () => {
          cleanups += 1
        },
        pause: () => undefined,
        resume: () => undefined,
        play: () => {
          plays += 1
        },
      }),
    )

  await mountVisible(hook)
  assert.equal(el.listenerCount("click"), 1)
  assert.equal(el.listenerCount("keydown"), 1)
  assert.equal(el.classList.contains("rg-collateral-replayable"), true)

  BrandCollateral.destroyed.call(hook)

  assert.equal(cleanups, 1)
  assert.equal(el.getAttribute("role"), "region")
  assert.equal(el.getAttribute("tabindex"), "-1")
  assert.equal(el.getAttribute("aria-label"), "Original label")
  assert.equal(el.listenerCount("click"), 0)
  assert.equal(el.listenerCount("keydown"), 0)
  assert.equal(el.classList.contains("rg-collateral-replayable"), false)
  el.emit("click")
  assert.equal(plays, 0)
})

test("reduced motion mounts a static experiment without replay semantics", async () => {
  let receivedReducedMotion: unknown = null
  let plays = 0
  const el = new FakeElement()
  const hook = hookFor(el)
  scenario.reducedMotion = true
  scenario.loadExperiment = () =>
    Promise.resolve({
      mount: (options) => {
        receivedReducedMotion = options.reducedMotion
        const mountedEl = options.el as FakeElement
        mountedEl.classList.add("rg-collateral-replayable")
        return {
          cleanup: () => undefined,
          pause: () => undefined,
          resume: () => undefined,
          play: () => {
            plays += 1
          },
        }
      },
    })

  await mountVisible(hook)

  assert.equal(receivedReducedMotion, true)
  assert.equal(el.getAttribute("role"), null)
  assert.equal(el.getAttribute("tabindex"), null)
  assert.equal(el.getAttribute("aria-label"), null)
  assert.equal(el.listenerCount("click"), 0)
  assert.equal(el.listenerCount("keydown"), 0)
  assert.equal(el.classList.contains("rg-collateral-replayable"), false)
  el.emit("click")
  el.emit("keydown", { key: "Enter", preventDefault: () => undefined })
  assert.equal(plays, 0)
})
