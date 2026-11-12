// Asks in `Regent.Structure.confirm`, never the browser's own box. A press on anything
// carrying `data-confirm` (the question) is stopped before the page hears it, and the
// window opens with the going-ahead button worded by `data-confirm-action`. Cancel or
// Escape closes it and hands focus back to what was pressed. The going-ahead button
// closes it and presses that again, this once without its question, so a link, a
// form's button, a LiveView `phx-click` or a wallet button acts as it would have: once
// for each press, every time. Both buttons act the moment they are pressed, so a quick
// second press is never lost. The window carries `data-opened-by` ("key" or "pointer")
// so the motion kit opens it at once after a key press.
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
    dialog.dataset.openedBy = event.detail === 0 ? "key" : "pointer";
    asking = control;
    dialog.showModal();
  },
  true
);

document.addEventListener(
  "submit",
  event => {
    const dialog = event.target.closest("#rg-confirm");
    if (dialog === null) return;
    event.preventDefault();
    const control = asking;
    asking = null;
    dialog.close();
    control.focus();
    if (event.submitter.value !== "accept") return;

    const question = control.dataset.confirm;
    delete control.dataset.confirm;
    control.click();
    control.dataset.confirm = question;
  },
  true
);

// Escape closes the window without a press.
document.addEventListener(
  "close",
  event => {
    if (event.target.id !== "rg-confirm" || event.target.open || asking === null) return;
    const control = asking;
    asking = null;
    control.focus();
  },
  true
);
