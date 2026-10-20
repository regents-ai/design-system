// Opens a `Regent.Primitives.tip` while a mouse rests on its "i", and closes it a moment
// after the mouse leaves both the "i" and its words, so the mouse can cross onto the words.
// A click on an "i" the mouse opened keeps its words open until Escape, a press elsewhere
// or another click on the "i". Touch, pen and keyboard open a tip only by a press, which
// the browser's popover handles on its own.
const leaveDelay = 120;
const openedByMouse = new WeakSet();
let closing;

const tipAt = target => (target instanceof Element ? target.closest(".rg-tip") : null);
const wordsOf = tip => tip.querySelector(":scope > .rg-tip-body");

document.addEventListener("pointerover", event => {
  const tip = tipAt(event.target);
  if (!tip || event.pointerType !== "mouse") return;
  clearTimeout(closing);
  const button = event.target.closest(".rg-tip-button");
  const words = wordsOf(tip);
  if (!button || words.matches(":popover-open")) return;
  words.showPopover({ source: button });
  openedByMouse.add(words);
});

document.addEventListener("pointerout", event => {
  const tip = tipAt(event.target);
  if (!tip || event.pointerType !== "mouse" || tip.contains(event.relatedTarget)) return;
  const words = wordsOf(tip);
  if (!openedByMouse.has(words) || !words.matches(":popover-open")) return;
  clearTimeout(closing);
  closing = setTimeout(() => {
    if (openedByMouse.has(words) && words.matches(":popover-open")) words.hidePopover();
  }, leaveDelay);
});

document.addEventListener("click", event => {
  const button = event.target instanceof Element ? event.target.closest(".rg-tip-button") : null;
  if (!button) return;
  const words = wordsOf(button.closest(".rg-tip"));
  if (!openedByMouse.has(words) || !words.matches(":popover-open")) return;
  event.preventDefault();
  openedByMouse.delete(words);
});

document.addEventListener(
  "toggle",
  event => {
    if (event.newState === "closed") openedByMouse.delete(event.target);
  },
  true
);
