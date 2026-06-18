export interface MountMeasurement {
  id: string
  mountMs: number
}

type MeasurementListener = (measurement: MountMeasurement) => void

const listeners = new Set<MeasurementListener>()

export function onMountMeasured(listener: MeasurementListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Time a mount function and report it to listeners (the gallery shows these in a dev HUD). */
export function measureMount<T>(id: string, mountFn: () => T): { handle: T; mountMs: number } {
  const start = performance.now()
  const handle = mountFn()
  const mountMs = performance.now() - start
  for (const listener of listeners) listener({ id, mountMs })
  return { handle, mountMs }
}
