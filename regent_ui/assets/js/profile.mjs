// Presentation only. The product adapter owns authentication and persistence.
export function mountProfile(root, {profile, onSaved}) {
  const controller = new AbortController();
  const form = root.querySelector("[data-profile-form]");
  const status = root.querySelector("[data-profile-status]");
  const name = form.elements.namedItem("display_name");
  let generation = 0;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const current = ++generation;
    status.textContent = "Saving…";
    const result = await saveName(profile, name.value, {signal: controller.signal});
    if (controller.signal.aborted || current !== generation) return;
    status.textContent = result.message;
    if (result.ok) {
      name.value = result.displayName ?? "";
      onSaved?.(result.displayName);
    }
  }, {signal: controller.signal});

  return () => controller.abort();
}

// A person who has never saved a name has no profile yet: it is made from their
// sign-in first, then the name is saved to it.
export async function saveName(profile, displayName, options = {}) {
  const input = {display_name: displayName};
  let result = await profile("update", input, options);
  if (code(result) === "profile_not_created") {
    const made = await profile("sync", {}, options);
    if (made.ok) result = await profile("update", input, options);
    else result = made;
  }
  if (result.ok) {
    return {ok: true, displayName: result.body.profile.display_name, message: "Saved."};
  }
  return {ok: false, message: refusal(result)};
}

function code(result) {
  return result.error?.code ?? result.body?.error?.code;
}

function refusal(result) {
  if (result.error?.outcome_unknown) return "It may not have saved. Refresh to check.";
  switch (code(result)) {
    case "authentication_required":
    case "identity_changed":
      return "Sign in again to save your name.";
    case "identity_evidence_conflict":
      return "Your sign-in changed. Refresh and try again.";
    default:
      return "Your name could not be saved. Try again.";
  }
}
