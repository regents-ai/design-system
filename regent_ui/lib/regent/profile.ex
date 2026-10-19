defmodule Regent.Profile do
  @moduledoc """
  The shared profile form: the person's Public Display Name, the name people see
  for them. Products render it only for a signed-in person, with the name the
  server already read, and wire the form to their identity adapter with
  `mountProfile`. No authentication or persistence runs in this component.
  """
  use Phoenix.Component
  import Regent.Primitives

  attr :id, :string, default: "regent-profile"
  attr :display_name, :string, default: nil, doc: "the person's current name, if they set one"
  attr :class, :any, default: nil

  def panel(assigns) do
    ~H"""
    <section id={@id} class={["rg-profile", @class]} data-regent-profile>
      <header>
        <h2>Profile</h2>
      </header>
      <form data-profile-form>
        <.field :let={field} id={"#{@id}-name"} label="Public Display Name">
          <input
            id={field.id}
            name="display_name"
            aria-describedby={field.described_by}
            value={@display_name}
            maxlength="80"
            autocomplete="nickname"
          />
          <:hint>
            The name people see for you.
            <.tip id={"#{@id}-name-about"} label="About your Public Display Name">
              People see this name beside what you post on every Regent site, and it is
              the same on all of them. It may hold up to 80 characters, with no hidden
              characters.
            </.tip>
          </:hint>
        </.field>
        <div class="rg-profile-actions">
          <.button type="submit">Save</.button>
          <p data-profile-status role="status" aria-live="polite"></p>
        </div>
      </form>
    </section>
    """
  end
end
