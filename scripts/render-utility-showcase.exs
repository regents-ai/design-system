# Local synthetic content rendered by the actual shared Phoenix components.
defmodule UtilityPreview do
  use Phoenix.Component
  import Regent.Primitives

  def connection(assigns) do
    ~H"""
    <Regent.Utility.page
      title="This connection link no longer works"
      context="Ash Template · Connected apps"
    >
      <p>It expired or has already been used. Return to the app and start connecting again.</p>
      <:note>
        <p>No new access was granted.</p>
      </:note>
    </Regent.Utility.page>
    """
  end

  def account(assigns) do
    ~H"""
    <main class="rg-utility preview-account">
      <p class="rg-utility__context">Ash Template · Account</p>
      <h1>Account</h1>
      <p class="preview-description">Manage your profile, agents and connected accounts.</p>
      <section class="rg-account" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>
        <.field id="display-name" label="Display name">
          <input id="display-name" value="Example account" />
        </.field>
        <p class="preview-note">Preview data only. No account is connected.</p>
        <.button>Save changes</.button>
      </section>
      <Regent.Account.agents id="preview-agents" agents={[]}>
        <:footer><.button variant="secondary">Pair an agent</.button></:footer>
      </Regent.Account.agents>
      <Regent.Account.signed_out id="preview-expired" reason={:expired}>
        <:sign_in><.button>Sign in</.button></:sign_in>
      </Regent.Account.signed_out>
    </main>
    """
  end

  def error(assigns) do
    ~H"""
    <Regent.Utility.page title="We can’t find that page" context="Ash Template" id="error-page">
      <p>Use the homepage or one of the links below to continue.</p>
      <:actions><a class="rg-button" href="/">Go to the homepage</a></:actions>
      <:note>
        <nav aria-label="Recovery links">
          <ul class="rg-utility__links">
            <li><a href="/docs">Docs</a></li><li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </:note>
    </Regent.Utility.page>
    """
  end
end

root = Path.expand("..")
out = Path.join(root, ".utility-preview")
File.mkdir_p!(out)
File.cp_r!(Path.join(root, "regent_ui/assets/css"), Path.join(out, "css"))
File.mkdir_p!(Path.join(out, "fonts"))
File.cp_r!(Path.join(root, "regent_ui/priv/static/fonts"), Path.join(out, "fonts/regent-ui"))

for theme <- ["light", "dark"], screen <- [:connection, :account, :error] do
  body =
    apply(UtilityPreview, screen, [%{}]) |> Phoenix.HTML.Safe.to_iodata() |> IO.iodata_to_binary()

  html = """
  <!doctype html><html lang="en" data-brand="platform" data-theme="#{theme}"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>#{screen} · #{theme} · Local preview</title>
  <link rel="stylesheet" href="/css/design_system_tokens.css"><link rel="stylesheet" href="/css/primitives.css">
  <style>body{margin:0;background:var(--utility-bg)}.preview-account{max-width:42rem;margin:auto;padding:3rem 1.5rem;box-sizing:border-box}.preview-description{color:var(--color-fg-muted);margin:0 0 2rem}.rg-field{margin:1.25rem 0 .5rem}.preview-note{font-size:.875rem;color:var(--color-fg-muted)}</style>
  </head><body>#{body}</body></html>
  """

  File.write!(Path.join(out, "#{screen}-#{theme}.html"), html)
end

IO.puts("Rendered light/dark utility previews to #{out}")
