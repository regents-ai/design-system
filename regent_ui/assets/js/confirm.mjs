// Asks in `Regent.Structure.confirm`, never the browser's own box, before an action
// that can't be undone. A press on anything carrying `data-confirm` (the question) is
// stopped before the page hears it, and the window opens with the button that goes
// ahead worded by `data-confirm-action`. Cancel or Escape closes it and hands focus
// back to what was pressed. The button that goes ahead closes it and presses that
// again, this once without its question, so a link, a form's button or a LiveView
// `phx-click` acts as it would have.
let asking = null;

window.addEventListener(
  "click",
  event => {
    const control = event.target instanceof Element ? event.target.closest("[data-confirm]") : null;
    if (!control) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const dialog = document.getElementById("rg-confirm");
    dialog.querySelector("#rg-confirm-question").textContent = control.dataset.confirm;
    dialog.querySelector("[data-confirm-accept] .rg-button__label").textContent =
      control.dataset.confirmAction;
    dialog.returnValue = "";
    asking = control;
    dialog.showModal();
  },
  true
);

document.addEventListener(
  "close",
  event => {
    if (event.target.id !== "rg-confirm" || asking === null) return;
    const control = asking;
    asking = null;
    control.focus();
    if (event.target.returnValue !== "accept") return;

    const question = control.dataset.confirm;
    delete control.dataset.confirm;
    control.click();
    control.dataset.confirm = question;
  },
  true
);
