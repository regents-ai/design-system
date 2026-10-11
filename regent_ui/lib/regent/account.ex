defmodule Regent.Account do
  @moduledoc """
  The account page's shared sections: the signed-out panel, paired agents, and
  read-only Credits and Points. Products authorize and read the data, format
  amounts and dates, and own every action. No domain structs are required.

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
