// Local showcase controls only. No persistence, product state or network mutations.
const brands = ["platform", "autolaunch", "patchbay", "techtree"];
const themes = ["light", "dark"];
const params = new URLSearchParams(location.search);
const brand = document.querySelector("#brand");
const theme = document.querySelector("#theme");
brand.value = brands.includes(params.get("brand")) ? params.get("brand") : "platform";
theme.value = themes.includes(params.get("theme")) ? params.get("theme") : "light";
function applyTheme() {
  document.documentElement.dataset.brand = brand.value;
  document.documentElement.dataset.theme = theme.value;
  const url = new URL(location.href);
  url.searchParams.set("brand", brand.value);
  url.searchParams.set("theme", theme.value);
  history.replaceState(null, "", url);
}
brand.addEventListener("change", applyTheme);
theme.addEventListener("change", applyTheme);
applyTheme();
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
