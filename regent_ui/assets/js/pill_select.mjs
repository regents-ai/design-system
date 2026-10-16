// Closes an open `details.rg-pill-select` menu on Escape, handing focus back to its
// summary when it was inside, and on a press anywhere outside it. Escape that closes
// a pill goes no further, so a dialog holding the pill stays open. The press is a
// pointerdown because iPhone Safari sends no click for a tap on plain text; the menu
// sits over the page, so closing it moves nothing under the press.
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

document.addEventListener("pointerdown", event => {
  document.querySelectorAll(openPills).forEach(pill => {
    if (!pill.contains(event.target)) pill.open = false;
  });
});
