// Closes an open `details.rg-pill-select` menu on Escape, handing focus back to its
// summary when it was inside, and on a press anywhere outside it.
const openPills = "details.rg-pill-select[open]";

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(openPills).forEach(pill => {
    const focused = pill.contains(document.activeElement);
    pill.open = false;
    if (focused) pill.querySelector(":scope > summary")?.focus();
  });
});

document.addEventListener("click", event => {
  document.querySelectorAll(openPills).forEach(pill => {
    if (!pill.contains(event.target)) pill.open = false;
  });
});
