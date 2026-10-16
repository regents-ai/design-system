// Closes an open `details.rg-pill-select` menu on Escape, handing focus back to its
// summary when it was inside, and on a click anywhere outside it. Escape that closes
// a pill goes no further, so a dialog holding the pill stays open. The click listener
// sits on the root element, not the document: iPhone Safari only sends a tap on plain
// text to a listener there.
const openPills = "details.rg-pill-select[open]";

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  const pills = document.querySelectorAll(openPills);
  if (pills.length === 0) return;
  event.preventDefault();
  pills.forEach(pill => {
    const focused = pill.contains(document.activeElement);
    pill.open = false;
    if (focused) pill.querySelector(":scope > summary")?.focus();
  });
});

document.documentElement.addEventListener("click", event => {
  document.querySelectorAll(openPills).forEach(pill => {
    if (!pill.contains(event.target)) pill.open = false;
  });
});
