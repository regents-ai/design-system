// Local showcase controls only. No persistence, product state or network mutations.
const brands = ["platform", "autolaunch", "patchbay", "techtree"];
// "system" leaves data-theme off, as a site does before the person chooses.
const themes = ["light", "dark", "system"];
const params = new URLSearchParams(location.search);
const brand = document.querySelector("#brand");
const theme = document.querySelector("#theme");
brand.value = brands.includes(params.get("brand")) ? params.get("brand") : "platform";
theme.value = themes.includes(params.get("theme")) ? params.get("theme") : "light";
function applyTheme() {
  document.documentElement.dataset.brand = brand.value;
  if (theme.value === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme.value;
  const url = new URL(location.href);
  url.searchParams.set("brand", brand.value);
  url.searchParams.set("theme", theme.value);
  history.replaceState(null, "", url);
}
brand.addEventListener("change", applyTheme);
theme.addEventListener("change", applyTheme);
applyTheme();
// The toggle chooses the opposite of the theme showing, as a product's click does.
document.querySelector("#showcase-theme-toggle").addEventListener("click", () => {
  const showing = document.documentElement.dataset.theme ??
    (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  theme.value = showing === "dark" ? "light" : "dark";
  applyTheme();
});
// Showcase-only stress metadata stays on the component's public global attrs.
// Adapt it to the same heading data-short/data-long contract as other labels.
for (const card of document.querySelectorAll(".rg-feature[data-long-title]")) {
  const heading = card.querySelector(".rg-panel__heading h3");
  heading.dataset.short = card.dataset.shortTitle;
  heading.dataset.long = card.dataset.longTitle;
}
document.querySelector("#stress").addEventListener("change", event => {
  for (const node of document.querySelectorAll("[data-long]")) {
    node.textContent = event.target.checked ? node.dataset.long : node.dataset.short;
  }
});
for (const button of document.querySelectorAll("[data-scroll-to]")) {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTo);
    target.scrollIntoView();
    target.tabIndex = -1;
    target.focus({preventScroll: true});
  });
}
const dialog = document.querySelector("#sample-dialog");
document.querySelector("#open-agent").addEventListener("click", () =>
  document.querySelector("#account-agent").showModal());
document.querySelector("#open-dialog").addEventListener("click", () => dialog.showModal());
document.querySelector("#menu-close").addEventListener("click", () => {
  document.querySelector(".showcase-menu").open = false;
  document.querySelector("#menu-trigger").focus();
});
document.querySelector(".showcase-menu").addEventListener("keydown", event => {
  if (event.key === "Escape") {
    event.currentTarget.open = false;
    document.querySelector("#menu-trigger").focus();
  }
});
// A live figure changes as a page's figure would after a read: the widths it keeps
// mean the words beside it and the line below stay where they are.
const figureValues = {"figure-balance": ["9.99", "10.00"], "figure-points": ["98", "1,024"]};
document.querySelector("#figure-change").addEventListener("click", () => {
  for (const [id, [one, other]] of Object.entries(figureValues)) {
    const figure = document.getElementById(id);
    figure.textContent = figure.textContent === one ? other : one;
  }
});
// A step finishes as a page's would after its read: the tick draws in and the word
// swaps, and the line below stays where it is.
document.querySelector("#waiting-change").addEventListener("click", () => {
  const tick = document.querySelector("#waiting-tick");
  tick.toggleAttribute("data-done");
  for (const word of document.querySelectorAll("#waiting-word > span")) word.toggleAttribute("data-on");
});
// The tabs stand in for a page's own links: a press marks the tab it lands on.
for (const tab of document.querySelectorAll("#choice-tabs a")) {
  tab.addEventListener("click", event => {
    event.preventDefault();
    for (const other of document.querySelectorAll("#choice-tabs a")) other.removeAttribute("aria-current");
    tab.setAttribute("aria-current", "page");
  });
}
// A step ends as a page's would after the server says so: the running mark becomes a
// drawn tick and its travelling dash stops; the waiting line's word swaps to Done.
document.querySelector("#activity-change").addEventListener("click", () => {
  for (const mark of document.querySelectorAll("#activity-running [data-state='running'] .rg-activity__mark, #activity-line-running .rg-activity__mark")) {
    const done = mark.dataset.state === "running";
    mark.dataset.state = done ? "done" : "running";
    mark.querySelector(".rg-tick").toggleAttribute("data-done", done);
    mark.parentElement.querySelector(".rg-activity__trace")?.toggleAttribute("hidden", done);
  }
  const asks = document.querySelector("#activity-line-asks");
  const mark = asks.querySelector(".rg-activity__mark");
  const done = mark.dataset.state === "asks";
  mark.dataset.state = done ? "done" : "asks";
  mark.querySelector(".rg-tick").toggleAttribute("data-done", done);
  for (const word of asks.querySelectorAll(".rg-status-word__word")) {
    word.toggleAttribute("data-on", word.textContent.trim() === (done ? "Done" : "Waiting for you"));
  }
});
