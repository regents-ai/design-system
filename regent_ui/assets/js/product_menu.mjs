// The keys of the one-site bar's product menu (`Regent.Site.bar`). The browser's popover
// opens and closes it, closes it on Escape or a press outside, and hands focus back to
// its button. This adds the rest: ArrowDown or ArrowUp on the button opens it on the
// first or last product; inside, the arrows move and wrap, Home and End jump, Space
// follows a product as Enter does, and Tab closes it and carries on from its button.
// Choosing a product closes it. A menu opened from the keyboard skips its drop.
// Listening on the document, it works on controller-rendered and LiveView pages alike,
// and after any redraw.
const itemsOf = menu => [...menu.querySelectorAll('[role="menuitem"]')];
const menuOf = button => document.getElementById(button.getAttribute("popovertarget"));
const closest = (target, selector) => (target instanceof Element ? target.closest(selector) : null);

// A click from a pointer has a count; Enter and Space on the button make one without.
document.addEventListener("click", event => {
  const button = closest(event.target, ".rg-bar__product");
  if (button) {
    menuOf(button).toggleAttribute("data-instant", event.detail === 0);
    return;
  }
  const item = closest(event.target, ".rg-bar__item");
  if (item) item.closest(".rg-bar__menu").hidePopover();
});

// Opened by a press on the button: focus the first product, unless a key chose one.
document.addEventListener(
  "toggle",
  event => {
    const menu = event.target;
    if (event.newState !== "open" || !(menu instanceof Element) || !menu.matches(".rg-bar__menu")) return;
    if (!menu.contains(document.activeElement)) itemsOf(menu)[0].focus();
  },
  true
);

document.addEventListener("keydown", event => {
  const button = closest(event.target, ".rg-bar__product");
  if (button && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
    event.preventDefault();
    const menu = menuOf(button);
    menu.toggleAttribute("data-instant", true);
    if (!menu.matches(":popover-open")) menu.showPopover({ source: button });
    itemsOf(menu).at(event.key === "ArrowUp" ? -1 : 0).focus();
    return;
  }

  const menu = closest(event.target, ".rg-bar__menu");
  if (!menu) return;
  const items = itemsOf(menu);
  const at = items.indexOf(document.activeElement);
  const go = index => {
    event.preventDefault();
    items.at(index % items.length).focus();
  };

  switch (event.key) {
    case "ArrowDown":
      return go(at + 1);
    case "ArrowUp":
      return go(at < 0 ? -1 : at - 1);
    case "Home":
      return go(0);
    case "End":
      return go(-1);
    case " ":
      event.preventDefault();
      return event.target.click();
    case "Tab":
      menu.hidePopover();
      return document.querySelector(`[popovertarget="${menu.id}"]`).focus();
  }
});
