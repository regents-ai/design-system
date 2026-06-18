/**
 * Standalone browser harness for the collateral library — no Phoenix required.
 * Bundle with esbuild and open harness.html to eyeball every experiment and
 * read mount timings + face counts. Also drives the automated visual smoke.
 */
import { Heerich } from "heerich"
import manifest from "./manifest.json"
import type { ExperimentHandle } from "./experiment"
import { registry } from "./registry"
import { onMountMeasured } from "./runtime/measure"

interface HarnessReportEntry {
  id: string
  mountMs: number | null
  faceCount: number | null
  error: string | null
}

declare global {
  interface Window {
    __collateralReport?: {
      done: boolean
      entries: HarnessReportEntry[]
    }
  }
}

window.Heerich = Heerich as unknown as typeof window.Heerich

const report: { done: boolean; entries: HarnessReportEntry[] } = { done: false, entries: [] }
window.__collateralReport = report

const mountTimes = new Map<string, number>()
onMountMeasured(({ id, mountMs }) => mountTimes.set(id, mountMs))

const grid = document.getElementById("grid")
if (!grid) throw new Error("harness.html must provide #grid")

async function mountAll(): Promise<void> {
  for (const entry of manifest.experiments) {
    const card = document.createElement("section")
    card.className = "card"
    const stage = document.createElement("div")
    stage.className = "stage"
    const label = document.createElement("p")
    label.textContent = `${entry.name} (${entry.class})`
    card.append(stage, label)
    grid!.append(card)

    const reportEntry: HarnessReportEntry = {
      id: entry.id,
      mountMs: null,
      faceCount: null,
      error: null,
    }
    report.entries.push(reportEntry)

    let handle: ExperimentHandle | null = null
    try {
      const loader = registry[entry.id]
      if (!loader) throw new Error("missing registry entry")
      const module = await loader()
      handle = module.mount({
        el: stage,
        Heerich: window.Heerich!,
        reducedMotion: false,
        data: (entry as { demoData?: unknown }).demoData,
      })
      handle.resume()
      reportEntry.mountMs = mountTimes.get(entry.id) ?? null
      reportEntry.faceCount = stage.querySelectorAll("polygon, path").length
      const budget = entry.budget.maxFaces
      if (reportEntry.faceCount > budget) {
        reportEntry.error = `face count ${reportEntry.faceCount} exceeds budget ${budget}`
      }
      label.textContent += ` — ${reportEntry.faceCount} faces, ${reportEntry.mountMs?.toFixed(1) ?? "?"} ms`
      if (reportEntry.error) {
        card.classList.add("failed")
        label.textContent += ` — OVER BUDGET`
      }
    } catch (error) {
      reportEntry.error = String(error)
      card.classList.add("failed")
      label.textContent += ` — ERROR: ${String(error)}`
    }
  }
  report.done = true
  const failures = report.entries.filter((entry) => entry.error !== null)
  const summary = document.getElementById("summary")
  if (summary) {
    summary.textContent = failures.length === 0
      ? `All ${report.entries.length} experiments mounted cleanly.`
      : `${failures.length}/${report.entries.length} failed: ${failures.map((f) => f.id).join(", ")}`
    summary.className = failures.length === 0 ? "ok" : "bad"
  }
}

void mountAll()
