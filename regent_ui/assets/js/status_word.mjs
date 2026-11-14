// Swaps the word of a `Regent.Primitives.status_word` while someone watches. The page
// only ever holds the word showing now. When the server (or the page) changes it, the
// old word leaves from a copy in the component's ignored holder, hidden from screen
// readers and inert, removed as soon as its transition ends or is cancelled; the new
// word rises in. The motion is the package's CSS, so under reduced motion nothing
// transitions and the copy goes before it is ever drawn. Patches and reconnects that
// leave the word as it was change no text, so nothing replays.
function leave(line, word) {
  const copy = document.createElement("span");
  copy.textContent = word;
  copy.setAttribute("aria-hidden", "true");
  copy.inert = true;
  // A newer change replaces a word still leaving, so one copy at most is in the page.
  line.querySelector(":scope > .rg-status-word__gone").replaceChildren(copy);
  Promise.allSettled(copy.getAnimations().map(animation => animation.finished)).then(() => copy.remove());
}

function arrive(word) {
  word.toggleAttribute("data-arriving", true);
  // Reading the style settles the word where it arrives from before it moves.
  void getComputedStyle(word).opacity;
  word.removeAttribute("data-arriving");
}

new MutationObserver(records => {
  const before = new Map();
  for (const {target, oldValue} of records) {
    const word = target.parentElement;
    if (word?.matches(".rg-status-word > .rg-status-word__word") && !before.has(word)) before.set(word, oldValue);
  }
  for (const [word, was] of before) {
    if (word.textContent === was) continue;
    leave(word.parentElement, was);
    arrive(word);
  }
}).observe(document, {subtree: true, characterData: true, characterDataOldValue: true});
