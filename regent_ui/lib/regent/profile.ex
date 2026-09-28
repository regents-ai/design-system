defmodule Regent.Profile do
  @moduledoc """
  Shared private-profile presentation. Products supply the page's signed-in state
  and authorized data, and wire the `data-profile-*` controls to their own identity
  adapter. A signed-in visitor is never shown "Sign in". No authentication,
  persistence or wallet action runs in this component.
  """
  use Phoenix.Component
  import Regent.Primitives

  attr :id, :string, default: "regent-profile"
  attr :signed_in, :boolean, required: true, doc: "whether the page's visitor is signed in"
  attr :profile, :map, default: nil
  attr :class, :any, default: nil

  def panel(assigns) do
    ~H"""
    <section id={@id} class={["rg-profile", @class]} data-regent-profile>
      <header>
        <h1>Profile</h1>
      </header>
      <p data-profile-status role="status" aria-live="polite">Loading profile…</p>
      <.button :if={!@signed_in} data-profile-action="sign-in">Sign in</.button>
      <.button data-profile-action="create" hidden>Set up your profile</.button>
      <form data-profile-form hidden={is_nil(@profile)}>
        <.field :let={field} id={"#{@id}-name"} label="Name">
          <input
            id={field.id}
            name="display_name"
            aria-describedby={field.described_by}
            value={@profile && @profile.display_name}
            maxlength="80"
            autocomplete="nickname"
          />
          <:hint>Your name on every Regent site. Your agents can change it too.</:hint>
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
          <.button variant="quiet" data-profile-action="sync">Refresh linked accounts</.button>
        </div>
        <.disclosure id={"#{@id}-details"} summary="Account details">
          <dl>
            <dt>Linked accounts last checked</dt>
            <dd data-profile-checked></dd>
          </dl>
          <p>
            Choosing a wallet here does not change where payments go or send a transaction.
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
