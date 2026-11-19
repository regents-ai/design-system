// Presentation only. The product adapter owns authentication and persistence:
// `openProfile` gives one save its profile client at the press of Save, so one
// save is the person's signed in then, even while it waits its turn. Saves run
// one after another, so the name pressed last is the name kept.
export function mountProfile(root, {openProfile, onSaved}) {
  const controller = new AbortController();
  const form = root.querySelector("[data-profile-form]");
  const status = root.querySelector("[data-profile-status]");
  const name = form.elements.namedItem("display_name");
  const failed = {ok: false, message: "Your name could not be saved. Try again."};
  let generation = 0;
  let previous = Promise.resolve();

  const open = () => {
    try {
      return openProfile();
    } catch {
      return null;
    }
  };

  const save = async (profile, displayName) => {
    if (!profile) return failed;
    try {
      return await saveName(profile, displayName, {signal: controller.signal});
    } catch {
      return failed;
    }
  };

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const current = ++generation;
    const displayName = name.value;
    const profile = open();
    form.setAttribute("aria-busy", "true");
    status.textContent = "Saving…";
    const saving = previous.then(() => save(profile, displayName));
    previous = saving;
    const result = await saving;
    if (controller.signal.aborted || current !== generation) return;
    form.removeAttribute("aria-busy");
    status.textContent = result.message;
    if (result.ok) {
      name.value = result.displayName ?? "";
      onSaved?.(result.displayName);
    }
  }, {signal: controller.signal});

  return () => controller.abort();
}

// A profile is made when its person signs in, so someone with none yet is asked
// to sign in again. `profile` is one save's client, kept to one person by the
// product, and the name is saved to the profile just read.
export async function saveName(profile, displayName, options = {}) {
  const read = await profile("get", {}, options);
  if (!read.ok) return {ok: false, message: refusal(read)};
  const result = await profile("update", {display_name: displayName},
    {...options, expectedProfileId: read.body.profile.profile_id});
  if (!result.ok) return {ok: false, message: refusal(result)};
  return {ok: true, displayName: result.body.profile.display_name, message: "Saved."};
}

function code(result) {
  return result.error?.code ?? result.body?.error?.code;
}

function refusal(result) {
  if (result.error?.outcome_unknown) return "It may not have saved. Refresh to check.";
  switch (code(result)) {
    case "authentication_required":
    case "identity_changed":
    case "profile_not_created":
      return "Sign in again to save your name.";
    case "invalid_display_name":
      return "That name can't be used. Remove any hidden characters.";
    default:
      return "Your name could not be saved. Try again.";
  }
}
