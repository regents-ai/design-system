// Native links and readable TeX work without this enhancement. No browser fetching of posts.
const initialized = new WeakSet();
const mathModuleURL = "/assets/regent-blog/katex.mjs";
let mathModule;

function enhanceBlog(root) {
  if (initialized.has(root)) return;
  initialized.add(root);
  const links = [...root.querySelectorAll("[data-blog-heading]")];
  const headings = [...root.querySelectorAll(".rg-blog__prose h2[id], .rg-blog__prose h3[id]")];
  const header = document.querySelector("body header:not(.rg-blog__heading):not(.rg-blog__intro)");
  let top = 24;
  let queued = false;
  function update() {
    queued = false;
    if (!root.isConnected) return cleanup();
    let current = headings[0]?.id;
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= top + 28) current = heading.id;
    }
    for (const link of links) {
      if (link.dataset.blogHeading === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  function measure() {
    const style = header && getComputedStyle(header);
    top = style && ["fixed", "sticky"].includes(style.position)
      ? Math.max(24, header.getBoundingClientRect().height + (parseFloat(style.top) || 0) + 24) : 24;
    root.style.setProperty("--rg-blog-sticky-top", `${top}px`);
    schedule();
  }
  function cleanup() {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("hashchange", schedule);
    window.removeEventListener("resize", measure);
    observer?.disconnect();
  }
  const observer = typeof ResizeObserver === "function" && header ? new ResizeObserver(measure) : null;
  if (headings.length) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);
    window.addEventListener("resize", measure);
    observer?.observe(header);
    for (const link of links) link.addEventListener("click", () => {
      const disclosure = link.closest("details");
      if (disclosure) disclosure.open = false;
    });
    measure();
  }
  const equations = [...root.querySelectorAll("[data-math-style]")];
  if (!equations.length) return;
  mathModule ||= import(mathModuleURL);
  mathModule.then(({default: katex}) => {
    for (const equation of equations) {
      try {
        katex.render(equation.textContent, equation, {
          displayMode: equation.dataset.mathStyle === "display",
          output: "mathml", trust: false, throwOnError: true, maxExpand: 1000, maxSize: 20,
        });
        equation.dataset.mathReady = "true";
      } catch { equation.dataset.mathReady = "error"; }
    }
    schedule();
  }).catch(() => { for (const equation of equations) equation.dataset.mathReady = "error"; });
}
function initialize() { document.querySelectorAll("[data-regent-blog]").forEach(enhanceBlog); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
else initialize();
window.addEventListener("phx:page-loading-stop", initialize);
