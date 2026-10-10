defmodule Regent.Account do
  @moduledoc """
  Read-only Credits and Points presentation. Products authorize and read the data,
  format amounts and dates, and own every action. No domain structs are required.

  `state` is `:ready`, `:loading`, `:stale` or `:error`. Map an idle read to
  `:loading`; a successful empty read is `:ready`. Only `:ready` and `:stale`
  display supplied values. Missing values stay unavailable, never zero.
  """
  use Phoenix.Component

  attr :id, :string, required: true
  attr :available, :string, default: nil
  attr :held, :string, default: nil
  attr :state, :atom, default: :ready, values: [:ready, :loading, :stale, :error]
  attr :message, :string, default: nil

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
      data-unseen={is_nil(@text)}
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
end
