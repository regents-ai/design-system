// Closes an open `details.rg-pill-select` menu a person can see on Escape, handing focus
// back to its summary when it was inside, and on a click outside it in its own layer. Escape that closes
// a pill goes no further, so a dialog holding the pill stays open. The click listener
// sits on the root element, not the document: iPhone Safari only sends a tap on plain
// text to a listener there. However a pill closes, by the page's next redraw after a
// choice too, focus that was inside it goes back to its summary.
const openPills = "details.rg-pill-select[open]";

// The pill focus was last inside: a closing pill hides its focused choice, and the
// browser may hand focus to the page before the pill hears it closed.
let focusedPill = null;

document.addEventListener("focusin", event => {
  focusedPill = event.target instanceof Element ? event.target.closest(".rg-pill-select") : null;
});

document.addEventListener(
  "toggle",
  event => {
    const pill = event.target;
    if (!(pill instanceof HTMLDetailsElement) || !pill.matches(".rg-pill-select") || pill.open) return;
    const lost = document.activeElement === document.body && focusedPill === pill;
    if (lost || pill.contains(document.activeElement)) pill.querySelector(":scope > summary")?.focus();
  },
  true
);

// The open pills a person can see now: on screen, and inside the open window when
// one is open. A pill waiting in a shut window never takes an Escape.
const seenPills = () => {
  const windows = document.querySelectorAll("dialog:modal");
  const layer = windows[windows.length - 1] ?? document.documentElement;
  return [...layer.querySelectorAll(openPills)].filter(pill => pill.checkVisibility());
};

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  const pills = seenPills();
  if (pills.length === 0) return;
  event.preventDefault();
  pills.forEach(pill => {
    const focused = pill.contains(document.activeElement);
    pill.open = false;
    if (focused) pill.querySelector(":scope > summary")?.focus();
  });
});

// A click outside a pill closes it only within the pill's own layer: the window
// (`dialog`) it sits in, or else the page. The press on the page that opens a window
// leaves the pills waiting inside that window as they are.
document.documentElement.addEventListener("click", event => {
  document.querySelectorAll(openPills).forEach(pill => {
    const layer = pill.closest("dialog") ?? document.documentElement;
    if (!pill.contains(event.target) && layer.contains(event.target)) pill.open = false;
  });
});
