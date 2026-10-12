defmodule Regent.Account do
  @moduledoc """
  The account page's shared sections: the signed-out panel, paired agents with
  the pairing box and one agent's own view, and read-only Credits and Points.
  Products authorize and read the data, format amounts and dates, and own every
  action. No domain structs are required.

  `state` is `:ready`, `:loading`, `:stale` or `:error`. Map an idle read to
  `:loading`; a successful empty read is `:ready`. Only `:ready` and `:stale`
  display supplied values. Missing values stay unavailable, never zero.
  """
  use Phoenix.Component

  alias Regent.Primitives

  attr :id, :string, required: true
  attr :reason, :atom, default: :signed_out, values: [:signed_out, :expired]

  slot :sign_in,
    required: true,
    doc: "the product's own sign-in button, labelled \"Sign in\""

  def signed_out(assigns) do
    ~H"""
    <section id={@id} class="rg-account rg-account--signed-out">
      <p role={@reason == :expired && "status"}>{signed_out_text(@reason)}</p>
      {render_slot(@sign_in)}
    </section>
    """
  end

  attr :id, :string, required: true

  attr :agents, :any,
    required: true,
    doc:
      "`:loading`, `:unavailable`, or a list of maps with id, name, harness, backed, " <>
        "last_contact_iso and last_contact (formatted)"

  attr :notice, :string, default: nil, doc: "the result of the last action, read out politely"

  slot :about, doc: "tip text: what a paired agent may do on this site"

  slot :actions,
    doc: "per-agent controls, such as Unpair; receives the agent. Leave out when read-only"

  slot :footer, doc: "pairing controls, or where to manage agents when this site cannot"

  def agents(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-account"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@agents == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>
        Agents
        <Primitives.tip :if={@about != []} id={"#{@id}-about"} label="About paired agents">
          {render_slot(@about)}
        </Primitives.tip>
      </h2>
      <p
        class="rg-account__status"
        data-state={agents_state(@agents)}
        data-unseen={if agents_text(@agents, @notice), do: "false", else: "true"}
        role={if @agents == :unavailable, do: "alert", else: "status"}
      >
        {agents_text(@agents, @notice) || "Current agents"}
      </p>
      <p :if={@agents == []} class="rg-account__empty">No agents paired yet.</p>
      <ul :if={is_list(@agents) and @agents != []} class="rg-account__agents">
        <li :for={agent <- @agents} id={"#{@id}-agent-#{agent.id}"}>
          <p class="rg-account__agent">
            <strong>{agent.name}</strong>
            <span>{agent.harness}</span>
            <span>
              {if agent.backed, do: "Human-backed", else: "No World ID backing"}
              <Primitives.tip id={"#{@id}-backing-#{agent.id}"} label="About World ID backing">
                {backing_text(agent.backed)}
              </Primitives.tip>
            </span>
          </p>
          <p class="rg-account__when">
            Last contact <time datetime={agent.last_contact_iso}>{agent.last_contact}</time>
          </p>
          <div :if={@actions != []} class="rg-account__actions">
            {render_slot(@actions, agent)}
          </div>
        </li>
      </ul>
      <div :if={@footer != []} class="rg-account__footer">{render_slot(@footer)}</div>
    </section>
    """
  end

  attr :logo, :string, required: true, doc: "the agent's picture, square"
  attr :class, :any, default: nil

  def agent_mark(assigns) do
    ~H"""
    <span class={["rg-account__mark", @class]} aria-hidden="true">
      <img src={@logo} alt="" width="48" height="48" />
    </span>
    """
  end

  attr :id, :string, required: true
  attr :site, :string, required: true, doc: "the account's name, as in \"your Regents account\""

  attr :harnesses, :list,
    required: true,
    doc: "every agent a person may choose, as %{value, label, logo}"

  attr :chosen, :string, default: nil, doc: "the chosen agent's value"

  attr :messages, :list,
    required: true,
    doc: "every agent's message, with a stand-in code before one is made; the box keeps one size"

  attr :message, :string, default: nil, doc: "the chosen agent's message once its code is made"

  attr :outcome, :any,
    default: nil,
    doc: "`{:paired, name}` once the code is used, `:unavailable` when no code could be made"

  attr :expires_iso, :string, default: nil
  attr :expires, :string, default: nil, doc: "when the code stops working, such as \"14:05 UTC\""

  attr :rest, :global,
    doc:
      "the product's own events on the form: phx-change and phx-submit, both carrying " <>
        "`harness`, and phx-target"

  @doc """
  Choosing an agent and the message to paste it. Choosing sends the form's change
  event; "Make a new code" submits it. Every state shares one layout, and what a
  state lacks keeps its space unseen, so choosing never changes the height.
  """
  def pairing(assigns) do
    assigns =
      assign(assigns, :words, pairing_words(assigns.outcome, assigns.message, assigns.chosen))

    ~H"""
    <form id={@id} class="rg-account__pair" {@rest}>
      <fieldset class="rg-account__choices" aria-labelledby={"#{@id}-title"}>
        <legend id={"#{@id}-title"}>
          Select your personal agent you will pair to your {@site} account
        </legend>
        <label :for={harness <- @harnesses} class="rg-account__choice">
          <input
            type="radio"
            name="harness"
            value={harness.value}
            checked={harness.value == @chosen}
            class="rg-account__radio"
          />
          <.agent_mark logo={harness.logo} />{harness.label}
        </label>
      </fieldset>
      <ol class="rg-account__steps">
        <li>Copy this message.</li>
        <li>Paste it to your agent wherever you chat with it.</li>
        <li>Your agent appears here once it pairs. This page updates on its own.</li>
      </ol>
      <div class="rg-account__message" role="status">
        <pre :for={message <- @messages} data-unused={message != @message}><code>{message}</code></pre>
        <p
          :if={@words}
          class="rg-account__words"
          data-paired={match?({:paired, _name}, @outcome) && "true"}
        >
          {@words}
        </p>
      </div>
      <div class="rg-account__pair-actions">
        <Primitives.copy_button
          id={"#{@id}-copy"}
          text={@message || ""}
          variant="primary"
          data-unused={is_nil(@message)}
        >
          Copy message
        </Primitives.copy_button>
        <Primitives.button
          id={"#{@id}-new"}
          type="submit"
          variant="secondary"
          phx-disable-with="Making a code…"
          data-unused={is_nil(@chosen)}
        >
          Make a new code
        </Primitives.button>
      </div>
      <p class="rg-account__expiry" data-unused={is_nil(@message)}>
        The code works once, until <time datetime={@expires_iso}>{@expires || "00:00 UTC"}</time>.
      </p>
    </form>
    """
  end

  attr :id, :string, required: true

  attr :agent, :map,
    required: true,
    doc:
      "id, name, harness (label), logo, wallet, listing (nil or %{url, number}), and " <>
        "paired_at, last_contact (relative) and last_contact_at, formatted"

  attr :verified, :boolean, required: true, doc: "a person verified with World ID backs it"
  attr :same_person_count, :integer, default: 0, doc: "agents that person runs, this one included"

  attr :same_person, :list,
    default: [],
    doc: "this account's other agents of that person: %{id, name}"

  attr :activity, :any,
    required: true,
    doc: "`:loading`, `:unavailable`, or a list of %{action, site, occurred_at_iso, occurred_at}"

  attr :more, :atom,
    default: nil,
    values: [nil, :idle, :loading, :unavailable],
    doc: "nil when there is no older activity"

  attr :notice, :any, default: nil, doc: "`{:status | :alert, text}`: how the last action ended"
  attr :target, :any, default: nil, doc: "phx-target for the presses below"
  attr :open_event, :string, required: true, doc: "opens another agent; carries `id`"
  attr :more_event, :string, required: true, doc: "reads older activity; carries `id`"
  attr :rest, :global, doc: "the product's dialog hook, which opens it and reports its close"
  slot :actions, doc: "the product's buttons beside Done, such as Unpair"

  @doc """
  One agent: who it is, when it paired, who stands behind it and what it has done
  across the Regent sites. "Done" closes the dialog in the browser.
  """
  def agent_detail(assigns) do
    ~H"""
    <dialog id={@id} class="rg-account__dialog" aria-labelledby={"#{@id}-title"} {@rest}>
      <header class="rg-account__dialog-head">
        <.agent_mark logo={@agent.logo} />
        <div>
          <p>{@agent.harness}</p>
          <h2 id={"#{@id}-title"}>{@agent.name}</h2>
        </div>
      </header>

      <dl class="rg-account__facts">
        <div>
          <dt>First paired</dt>
          <dd>{@agent.paired_at}</dd>
        </div>
        <div>
          <dt>Last contact</dt>
          <dd>{@agent.last_contact} <span>{@agent.last_contact_at}</span></dd>
        </div>
        <div>
          <dt>Agent address</dt>
          <dd><code>{@agent.wallet}</code></dd>
        </div>
        <div :if={@agent.listing}>
          <dt>Registry listing</dt>
          <dd>
            <a href={@agent.listing.url} target="_blank" rel="noopener noreferrer">
              Agent #{@agent.listing.number}
            </a>
          </dd>
        </div>
        <div>
          <dt>Person</dt>
          <dd>
            <span class="rg-account__human" data-verified={to_string(@verified)}>
              <span :if={@verified} class="rg-account__check" aria-hidden="true">✓</span>
              {if @verified, do: "Verified human", else: "No verified human"}
              <Primitives.tip
                id={"#{@id}-human"}
                label={if @verified, do: "About Verified human", else: "About No verified human"}
              >
                <%= if @verified do %>
                  A real person verified with World ID stands behind this agent. Who they are stays private.
                <% else %>
                  The agent's person can vouch for it with World ID.
                  <a href="https://siwa.regents.sh/skill.md" target="_blank" rel="noopener noreferrer">
                    Step 7
                  </a>
                <% end %>
              </Primitives.tip>
            </span>
            <span :if={@verified and @same_person_count >= 2}>
              1 of {@same_person_count} agents run by the same person
            </span>
            <span :if={@verified and @same_person != []} class="rg-account__others">
              <button
                :for={other <- @same_person}
                type="button"
                phx-click={@open_event}
                phx-value-id={other.id}
                phx-target={@target}
              >
                {other.name}
              </button>
            </span>
          </dd>
        </div>
      </dl>

      <section class="rg-account__log" aria-labelledby={"#{@id}-activity"}>
        <h3 id={"#{@id}-activity"}>Recent activity</h3>
        <p>
          Every request this agent signed on a Regent site since it paired, newest first. Kept for 30 days.
        </p>
        <p :if={@activity == :loading} role="status">Reading this agent’s activity…</p>
        <p :if={@activity == :unavailable} role="status">
          This agent’s activity couldn’t be read right now. Refresh to try again.
        </p>
        <ol :if={is_list(@activity)}>
          <li :for={entry <- @activity}>
            <span>{entry.action}</span>
            <span>{entry.site}</span>
            <time datetime={entry.occurred_at_iso}>{entry.occurred_at}</time>
          </li>
        </ol>
        <div :if={is_list(@activity) and @more} class="rg-account__more">
          <Primitives.button
            id={"#{@id}-more"}
            type="button"
            variant="secondary"
            phx-click={@more_event}
            phx-value-id={@agent.id}
            phx-target={@target}
            disabled={@more == :loading}
          >
            {if @more == :loading, do: "Loading…", else: "Load more"}
          </Primitives.button>
          <p :if={@more == :unavailable} role="status">
            Older activity couldn’t be read right now. Try again.
          </p>
        </div>
      </section>

      <p :if={@notice} class="rg-account__notice" role={elem(@notice, 0)}>{elem(@notice, 1)}</p>

      <div class="rg-account__dialog-actions">
        {render_slot(@actions)}
        <form method="dialog">
          <Primitives.button type="submit" value="close">Done</Primitives.button>
        </form>
      </div>
    </dialog>
    """
  end

  attr :id, :string, required: true
  attr :available, :string, default: nil
  attr :held, :string, default: nil
  attr :state, :atom, default: :ready, values: [:ready, :loading, :stale, :error]
  attr :message, :string, default: nil
  slot :inner_block, doc: "the product's own lines and links under the figures, in the same box"

  def credits_summary(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-account"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@state == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>Credits</h2>
      <.read_status state={@state} message={@message} />
      <dl class="rg-account__metrics">
        <.metric label="Available" value={@available} state={@state} />
        <.metric label="Held" value={@held} state={@state} />
      </dl>
      {render_slot(@inner_block)}
    </section>
    """
  end

  attr :id, :string, required: true
  attr :confirmed, :string, default: nil
  attr :today, :string, default: nil
  attr :pending, :string, default: nil, doc: "formatted count of activity being verified"

  attr :allowances, :list,
    default: [],
    doc: "separate pools as %{label: string, value: formatted string or nil}"

  attr :state, :atom, default: :ready, values: [:ready, :loading, :stale, :error]
  attr :message, :string, default: nil

  def points_summary(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-account"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@state == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>Points</h2>
      <.read_status state={@state} message={@message} />
      <dl class="rg-account__metrics">
        <.metric label="Confirmed" value={@confirmed} state={@state} />
        <.metric label="Earned today" value={@today} state={@state} />
        <.metric label="Activity being verified" value={@pending} state={@state} />
      </dl>
      <div :if={@allowances != []} class="rg-account__allowances">
        <h3>Daily allowances</h3>
        <dl class="rg-account__metrics">
          <.metric
            :for={allowance <- @allowances}
            label={allowance.label}
            value={allowance.value}
            state={@state}
          />
        </dl>
      </div>
    </section>
    """
  end

  attr :id, :string, required: true
  attr :title, :string, required: true

  attr :rows, :list,
    default: [],
    doc:
      "formatted maps with label, amount, occurred_at and optional status; no raw domain records"

  attr :empty_message, :string, default: "No activity yet."
  attr :state, :atom, default: :ready, values: [:ready, :loading, :stale, :error]
  attr :message, :string, default: nil

  def history(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-account"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@state == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>{@title}</h2>
      <.read_status state={@state} message={@message} />
      <%= if @state in [:ready, :stale] do %>
        <p :if={@rows == []} class="rg-account__empty">{@empty_message}</p>
        <ol :if={@rows != []} class="rg-account__history">
          <li :for={row <- @rows}>
            <p class="rg-account__activity">{row.label}</p>
            <p class="rg-account__amount">{display_value(row.amount, @state)}</p>
            <p class="rg-account__when">
              <span :if={Map.get(row, :status)}>{row.status} · </span>{row.occurred_at}
            </p>
          </li>
        </ol>
      <% end %>
    </section>
    """
  end

  attr :label, :string, required: true
  attr :value, :string, default: nil
  attr :state, :atom, required: true

  defp metric(assigns) do
    ~H"""
    <div>
      <dt>{@label}</dt>
      <dd>{display_value(@value, @state)}</dd>
    </div>
    """
  end

  attr :state, :atom, required: true
  attr :message, :string, default: nil

  defp read_status(assigns) do
    assigns = assign(assigns, :text, assigns.message || state_message(assigns.state))

    ~H"""
    <p
      class="rg-account__status"
      data-state={@state}
      data-unseen={if is_nil(@text), do: "true", else: "false"}
      role={if @state == :error, do: "alert", else: "status"}
    >
      {@text || "Current figures"}
    </p>
    """
  end

  defp display_value(_value, :loading), do: "Loading…"
  defp display_value(_value, :error), do: "Unavailable"
  defp display_value(value, _state) when value in [nil, ""], do: "Unavailable"
  defp display_value(value, _state), do: value

  defp state_message(:ready), do: nil
  defp state_message(:loading), do: "Loading…"
  defp state_message(:stale), do: "Last saved figures. Refresh failed."
  defp state_message(:error), do: "Could not load. Try refreshing."

  defp signed_out_text(:signed_out), do: "Sign in to see your account."
  defp signed_out_text(:expired), do: "Your session ended. Sign in again to see your account."

  defp pairing_words({:paired, name}, _message, _chosen),
    do: "#{name} paired with your account. It is listed above."

  defp pairing_words(:unavailable, _message, _chosen),
    do: "A pairing code couldn’t be made right now. Try again in a moment."

  defp pairing_words(nil, nil, nil), do: "Choose your agent to get its message."
  defp pairing_words(nil, _message, _chosen), do: nil

  defp agents_state(:loading), do: :loading
  defp agents_state(:unavailable), do: :error
  defp agents_state(_agents), do: :ready

  defp agents_text(:loading, _notice), do: "Loading…"
  defp agents_text(:unavailable, _notice), do: "Your agents couldn’t be read. Try refreshing."
  defp agents_text(_agents, notice), do: notice

  defp backing_text(true),
    do:
      "A person verified with World ID stands behind this agent. This optional check " <>
        "does not change what it may do."

  defp backing_text(false),
    do: "World ID backing is optional. This agent already has its paired access."
end
