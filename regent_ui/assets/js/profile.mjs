// Presentation only. The product adapter owns authentication and persistence.
export function mountProfile(root, adapter) {
  const win = root.ownerDocument.defaultView;
  let stop = bindProfile(root, adapter);
  const hide = () => { stop?.(); stop = null; };
  const show = event => { if (event.persisted && !stop) stop = bindProfile(root, adapter); };
  win?.addEventListener("pagehide", hide);
  win?.addEventListener("pageshow", show);
  return () => {
    hide();
    win?.removeEventListener("pagehide", hide);
    win?.removeEventListener("pageshow", show);
  };
}

function bindProfile(root, {profile, signIn, linkX, onIdentityChange}) {
  const controller = new AbortController();
  const find = selector => root.querySelector(selector);
  const status = find("[data-profile-status]");
  const form = find("[data-profile-form]");
  let generation = 0;
  let displayed = null;
  const message = text => { status.textContent = text; };

  const hidePrivate = () => {
    displayed = null;
    find("[data-profile-wallet-status]").textContent = "";
    const name = form.elements.namedItem("display_name");
    name.value = "";
    name.defaultValue = "";
    form.hidden = true;
    find("[data-profile-id]").textContent = "";
    find("[data-profile-x]").textContent = "Not connected";
    find("[data-profile-x-verified]").hidden = true;
    find("select[name=wallet_address]").replaceChildren();
    find("[data-profile-evidence]").textContent = "";
  };

  const render = value => {
    displayed = value;
    form.hidden = false;
    find("[data-profile-action=sign-in]").hidden = true;
    find("[data-profile-action=create]").hidden = true;
    form.elements.namedItem("display_name").value = value.display_name ?? "";
    const select = form.elements.namedItem("wallet_address");
    const choice = (label, address) => {
      const option = root.ownerDocument.createElement("option");
      option.textContent = label;
      option.value = address;
      return option;
    };
    select.replaceChildren(choice("Choose a linked wallet", ""));
    for (const wallet of value.linked_wallets ?? []) select.append(choice(wallet, wallet));
    const selected = value.wallet?.address;
    if (selected && !(value.linked_wallets ?? []).includes(selected)) {
      select.append(choice(`${selected} · no longer linked`, selected));
    }
    select.value = selected ?? "";
    find("[data-profile-wallet-status]").textContent = selected && !value.wallet.verified
      ? "Selected wallet is no longer verified. Choose a linked wallet." : "";
    find("[data-profile-x]").textContent = value.x?.username ? `@${value.x.username}` : value.x ? "Connected" : "Not connected";
    find("[data-profile-x-verified]").hidden = !value.x?.verified;
    find("[data-profile-id]").textContent = value.profile_id;
    find("[data-profile-evidence]").textContent =
      `Last synchronized ${new Date(value.evidence_issued_at * 1000).toLocaleString()}`;
  };

  const run = async (operation, input = {}) => {
    const current = ++generation;
    message(operation === "get" ? "Loading profile…" : "Saving…");
    try {
      const result = await profile(operation, input, {
        signal: controller.signal,
        ...(operation === "update" ? {expectedProfileId: displayed?.profile_id} : {}),
      });
      if (controller.signal.aborted || current !== generation) return result;
      if (result.ok && result.body?.profile) {
        render(result.body.profile);
        message(operation === "get" ? "" : "Saved.");
      } else {
        const code = result.error?.code ?? result.body?.error?.code;
        if (["authentication_required", "identity_changed"].includes(code)) {
          hidePrivate();
          find("[data-profile-action=sign-in]").hidden = false;
          find("[data-profile-action=create]").hidden = true;
          message("Sign in to view your profile.");
        } else if (code === "profile_not_created") {
          hidePrivate();
          find("[data-profile-action=sign-in]").hidden = true;
          find("[data-profile-action=create]").hidden = false;
          message("Your shared profile is ready to create.");
        } else {
          message(result.error?.outcome_unknown
            ? "The result is uncertain. Refresh before trying again."
            : code === "identity_evidence_conflict"
              ? "Verification changed. Refresh and try again."
              : "Profile could not be updated. Try again.");
        }
      }
      return result;
    } catch {
      if (!controller.signal.aborted && current === generation) message("Profile is unavailable. Try again.");
    }
  };

  root.addEventListener("click", async event => {
    const action = event.target.closest?.("[data-profile-action]")?.dataset.profileAction;
    if (!action) return;
    event.preventDefault();
    try {
      if (action === "sign-in") await signIn();
      if (action === "link-x") {
        message("Complete verification in the account window.");
        await linkX(); // Opening the provider is not proof of verification.
      }
      if (action === "sync" || action === "create") await run("sync");
    } catch {
      message("Account connection could not be completed.");
    }
  }, {signal: controller.signal});

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!displayed) return;
    const name = form.elements.namedItem("display_name").value;
    const wallet = form.elements.namedItem("wallet_address").value || null;
    // A name edit must not resubmit a retained, now-unlinked wallet selection.
    const input = {display_name: name};
    if (wallet !== (displayed.wallet?.address ?? null)) input.wallet_address = wallet;
    void run("update", input);
  }, {signal: controller.signal});

  const stopListening = onIdentityChange?.(() => {
    ++generation;
    hidePrivate();
    void run("get");
  });
  void run("get"); // Hydration never writes a profile or opens a login modal.
  return () => { controller.abort(); stopListening?.(); hidePrivate(); };
}
