// Home and End in a `Regent.Primitives.segmented` choose its first and last option, as
// the arrow keys already move between them. The press goes through the radio's own
// click, so the page hears the choice the same way.
document.addEventListener("keydown", event => {
  if (event.key !== "Home" && event.key !== "End") return;
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.matches(".rg-segmented__input")) return;
  const inputs = input.closest(".rg-segmented").querySelectorAll(".rg-segmented__input");
  const chosen = event.key === "Home" ? inputs[0] : inputs[inputs.length - 1];
  event.preventDefault();
  chosen.focus();
  if (!chosen.checked) chosen.click();
});
