# Local synthetic content rendered by the actual shared Phoenix components.
defmodule UtilityPreview do
  use Phoenix.Component
  import Regent.Primitives

  def connection(assigns) do
    ~H"""
    <Regent.Utility.page title="This connection link no longer works">
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
      <h1>Account</h1>
      <section class="rg-account" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>
        <.field id="display-name" label="Display name">
          <input id="display-name" value="Example account" />
        </.field>
        <.button>Save changes</.button>
      </section>
      <Regent.Account.agents id="preview-agents" agents={[]}>
        <:footer><.button variant="secondary">Pair New Agent</.button></:footer>
      </Regent.Account.agents>
      <Regent.Account.signed_out id="preview-expired" reason={:expired}>
        <:sign_in><.button>Sign in</.button></:sign_in>
      </Regent.Account.signed_out>
    </main>
    """
  end

  def error(assigns) do
    ~H"""
    <Regent.Utility.page title="We can’t find that page" id="error-page">
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
  <style>body{margin:0;background:var(--utility-bg)}.preview-account{max-width:42rem;margin:auto;padding:3rem 1.5rem;box-sizing:border-box}.rg-field{margin:1.25rem 0 .5rem}</style>
  </head><body>#{body}</body></html>
  """

  File.write!(Path.join(out, "#{screen}-#{theme}.html"), html)
end

IO.puts("Rendered light/dark utility previews to #{out}")
