// Remembers the Compact replies choice across threads. The switch works without this.
const key = "regent-discussion-compact";

function remembered() {
  try { return localStorage.getItem(key) === "compact"; } catch { return false; }
}

function initialize() {
  const compact = remembered();
  document.querySelectorAll("[data-regent-discussion] [data-rg-discussion-compact]").forEach(input => {
    input.checked = compact;
  });
}

document.addEventListener("change", event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.matches("[data-rg-discussion-compact]")) return;
  try { localStorage.setItem(key, input.checked ? "compact" : "normal"); } catch { /* The page still changes when storage is blocked. */ }
});
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
else initialize();
window.addEventListener("phx:page-loading-stop", initialize);
