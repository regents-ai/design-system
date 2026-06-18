/**
 * Caps how many experiments animate at once and pauses everything when the
 * document is hidden. Entries are resumed in viewport-entry order.
 */
export interface Pausable {
  pause(): void
  resume(): void
}

const MAX_ACTIVE = 4

interface Entry {
  target: Pausable
  visible: boolean
  running: boolean
}

const entries: Entry[] = []
let documentListenerBound = false

function reconcile(): void {
  const hidden = typeof document !== "undefined" && document.hidden
  let active = 0
  for (const entry of entries) {
    const shouldRun = !hidden && entry.visible && active < MAX_ACTIVE
    if (shouldRun) active += 1
    if (shouldRun && !entry.running) {
      entry.running = true
      entry.target.resume()
    } else if (!shouldRun && entry.running) {
      entry.running = false
      entry.target.pause()
    }
  }
}

function bindDocumentListener(): void {
  if (documentListenerBound || typeof document === "undefined") return
  documentListenerBound = true
  document.addEventListener("visibilitychange", reconcile)
}

/** Register a pausable experiment. Returns an unregister function. */
export function scheduleAnimation(target: Pausable): {
  setVisible(visible: boolean): void
  release(): void
} {
  bindDocumentListener()
  const entry: Entry = { target, visible: false, running: false }
  entries.push(entry)
  return {
    setVisible(visible: boolean) {
      if (entry.visible === visible) return
      entry.visible = visible
      reconcile()
    },
    release() {
      const index = entries.indexOf(entry)
      if (index >= 0) entries.splice(index, 1)
      reconcile()
    },
  }
}
