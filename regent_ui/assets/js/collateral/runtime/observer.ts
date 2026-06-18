type VisibilityCallback = (visible: boolean) => void

let sharedObserver: IntersectionObserver | null = null
const callbacks = new WeakMap<Element, VisibilityCallback>()

function ensureObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry.isIntersecting)
      }
    },
    { rootMargin: "200px" },
  )
  return sharedObserver
}

/** Observe an element's viewport visibility on the shared observer. Returns an unobserve function. */
export function observeVisibility(el: Element, callback: VisibilityCallback): () => void {
  const observer = ensureObserver()
  callbacks.set(el, callback)
  observer.observe(el)
  return () => {
    callbacks.delete(el)
    observer.unobserve(el)
  }
}
