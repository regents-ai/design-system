defmodule Regent.Profile do
  @moduledoc """
  Shared private-profile presentation. Products supply authorized data and wire
  the `data-profile-*` controls to their own identity adapter. No authentication,
  persistence or wallet action runs in this component.
  """
  use Phoenix.Component
  import Regent.Primitives

  attr :id, :string, default: "regent-profile"
  attr :profile, :map, default: nil
  attr :class, :any, default: nil

  def panel(assigns) do
    ~H"""
    <section id={@id} class={["rg-profile", @class]} data-regent-profile>
      <header>
        <h1>Profile</h1>
      </header>
      <p data-profile-status role="status" aria-live="polite">Loading profile…</p>
      <.button data-profile-action="sign-in" hidden={!is_nil(@profile)}>Sign in</.button>
      <.button data-profile-action="create" hidden>Create shared profile</.button>
      <form data-profile-form hidden={is_nil(@profile)}>
        <.field :let={field} id={"#{@id}-name"} label="Name">
          <input
            id={field.id}
            name="display_name"
            value={@profile && @profile.display_name}
            maxlength="80"
            autocomplete="nickname"
          />
        </.field>
        <.field :let={field} id={"#{@id}-wallet"} label="Wallet">
          <select id={field.id} name="wallet_address">
            <option value="">Choose a linked wallet</option>
            <option
              :for={wallet <- wallets(@profile)}
              value={wallet}
              selected={wallet == @profile.wallet.address}
            >
              {wallet}
            </option>
          </select>
        </.field>
        <p data-profile-wallet-status></p>
        <div class="rg-profile-connection">
          <div><span>X</span><strong data-profile-x>{x_label(@profile)}</strong></div>
          <.status tone="success" data-profile-x-verified hidden={!verified_x?(@profile)}>
            Verified
          </.status>
          <.button variant="secondary" data-profile-action="link-x">Connect X</.button>
        </div>
        <div class="rg-profile-actions">
          <.button type="submit">Save</.button>
          <.button variant="quiet" data-profile-action="sync">Refresh verification</.button>
        </div>
        <.disclosure id={"#{@id}-details"} summary="Account details">
          <dl>
            <dt>Profile ID</dt>
            <dd data-profile-id>{@profile && @profile.profile_id}</dd>
            <dt>Evidence</dt>
            <dd data-profile-evidence>Last synchronized Privy proof</dd>
          </dl>
          <p>Shared across Regents, Autolaunch, Patchbay and Techtree.</p>
          <p>
            Wallet selection here does not change an existing payment destination or send a transaction.
          </p>
        </.disclosure>
      </form>
    </section>
    """
  end

  defp wallets(nil), do: []
  defp wallets(profile), do: Map.get(profile, :linked_wallets, [])
  defp x_label(%{x: %{username: name}}) when is_binary(name), do: "@" <> name
  defp x_label(%{x: %{verified: true}}), do: "Connected"
  defp x_label(_), do: "Not connected"
  defp verified_x?(%{x: %{verified: true}}), do: true
  defp verified_x?(_), do: false
end
