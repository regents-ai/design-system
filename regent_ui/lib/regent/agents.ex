defmodule Regent.Agents do
  @moduledoc """
  An agent at work, drawn from the steps the site's server sends: what it is doing now
  and what it did, without a log to read.

  A step is `%{id, kind, label, started_at, finished_at}`. `kind` is one of `:read`,
  `:think`, `:tool`, `:write`, `:waiting_for_you`, `:done` or `:failed`; `label` names what
  the step touched in one to four words (never a tool's inputs, a key, a wallet detail or
  a message body); `started_at` is `nil` while the step waits to start and `finished_at`
  is `nil` until it ends. Steps come oldest first. Every mark and word follows these
  fields alone; nothing here runs on a timer, and the page passes `now` for the times.

  Each state has its own shape, so none relies on colour: a dashed square waits to
  start, a filled square is running, a half-filled square waits for the person, a tick
  is done and an empty square has stopped.
  """
  use Phoenix.Component

  alias Regent.Primitives

  @kinds [:read, :think, :tool, :write, :waiting_for_you, :done, :failed]
  @verbs %{
    read: "Reading",
    think: "Thinking",
    tool: "Running",
    write: "Writing",
    waiting_for_you: "Waiting for you",
    done: "Done",
    failed: "Stopped"
  }
  @states %{
    queued: "Next",
    running: "Running",
    asks: "Waiting",
    done: "Done",
    failed: "Stopped"
  }
  @shown 6

  attr :id, :string, required: true

  attr :label, :string,
    default: nil,
    doc: "what the list is, read out, such as \"Pira's activity\" (full form)"

  attr :steps, :any,
    required: true,
    doc: "`:loading`, `:unavailable`, or the steps the viewer may see, oldest first"

  attr :now, DateTime, required: true, doc: "the time the page was drawn, for each step's time"

  attr :variant, :string,
    default: "full",
    values: ~w(full line),
    doc: "`full` lists the steps; `line` shows the latest on one line"

  attr :class, :any, default: nil
  attr :rest, :global

  slot :action,
    doc:
      "the page's button for a step waiting for the person, such as Approve, given the step; full form only"

  slot :retry, doc: "the page's retry button, shown when the steps couldn't be read"

  @doc """
  The steps an agent took, the latest six on a rail with older ones folded under
  "Earlier", or with `variant="line"` its latest started step on one line (mark,
  "Running", "Offers board", "12s") for menus, lists and fleet tiles.
  """
  def activity(%{steps: steps} = assigns) when steps in [:loading, :unavailable] do
    ~H"""
    <Primitives.waiting
      id={@id}
      state={if @steps == :loading, do: :loading, else: :error}
      class={["rg-activity", "rg-activity--#{@variant}", @class]}
      {@rest}
    >
      <span></span>
      <:retry :if={@retry != []}>{render_slot(@retry)}</:retry>
    </Primitives.waiting>
    """
  end

  def activity(%{variant: "line"} = assigns) do
    steps = Enum.map(assigns.steps, &step/1)
    assigns = assign(assigns, step: current(steps), verbs: Map.values(@verbs))

    ~H"""
    <p id={@id} class={["rg-activity rg-activity--line", @class]} {@rest}>
      <%= if @step do %>
        <.mark step={@step} />
        <Primitives.status_word
          class="rg-activity__verb"
          words={@verbs}
          current={@step.verb}
          data-state={@step.state}
        />
        <span class="rg-activity__label"><bdi>{@step.label}</bdi></span>
        <.time step={@step} now={@now} />
      <% else %>
        <span class="rg-activity__none">No activity</span>
      <% end %>
    </p>
    """
  end

  def activity(assigns) do
    steps = Enum.map(assigns.steps, &step/1)
    {earlier, latest} = Enum.split(steps, max(length(steps) - @shown, 0))
    assigns = assign(assigns, earlier: earlier, latest: latest)

    ~H"""
    <section id={@id} class={["rg-activity rg-activity--full", @class]} aria-label={@label} {@rest}>
      <p :if={@latest == []} class="rg-activity__none">No activity yet.</p>
      <details :if={@earlier != []} class="rg-activity__earlier">
        <summary>
          <Regent.Icons.icon name="chevron-right" class="rg-activity__fold" />
          {"Earlier · "}<Primitives.figure value={Integer.to_string(length(@earlier))} />{if length(
                                                                                               @earlier
                                                                                             ) == 1,
                                                                                             do:
                                                                                               " step",
                                                                                             else:
                                                                                               " steps"}
        </summary>
        <ol class="rg-activity__steps" role="list">
          <.row :for={step <- @earlier} step={step} now={@now} action={@action} />
        </ol>
      </details>
      <ol :if={@latest != []} class="rg-activity__steps" role="list" data-activity>
        <.row :for={step <- @latest} step={step} now={@now} action={@action} />
      </ol>
    </section>
    """
  end

  attr :id, :string, required: true
  attr :label, :string, required: true, doc: "what the grid is, read out, such as \"Fleet\""

  attr :agents, :any,
    required: true,
    doc:
      "`:loading`, `:unavailable`, or `%{id, name, kind, href, steps}` for each agent: `kind` picks its picture, `href` is its page or `nil`, `steps` as for `activity/1`"

  attr :now, DateTime, required: true, doc: "the time the page was drawn, for each step's time"
  attr :class, :any, default: nil
  attr :rest, :global
  slot :retry, doc: "the page's retry button, shown when the agents couldn't be read"

  @doc """
  Many agents at once, such as a fleet: a grid of square tiles, each the agent's
  picture, its name and its latest step on one line. A running agent's tile shows the
  filled mark; nothing else on a tile moves. With `href`, the whole tile is a link
  named by the agent.
  """
  def fleet(%{agents: agents} = assigns) when agents in [:loading, :unavailable] do
    ~H"""
    <Primitives.waiting
      id={@id}
      state={if @agents == :loading, do: :loading, else: :error}
      class={["rg-fleet", @class]}
      {@rest}
    >
      <span></span>
      <:retry :if={@retry != []}>{render_slot(@retry)}</:retry>
    </Primitives.waiting>
    """
  end

  def fleet(assigns) do
    ~H"""
    <div id={@id} class={["rg-fleet", @class]} {@rest}>
      <p :if={@agents == []} class="rg-activity__none">No agents yet.</p>
      <ul :if={@agents != []} class="rg-fleet__tiles" role="list" aria-label={@label}>
        <li :for={agent <- @agents} class="rg-fleet__tile">
          <.dynamic_tag
            tag_name={if agent.href, do: "a", else: "div"}
            class="rg-fleet__face"
            {if agent.href, do: %{href: agent.href}, else: %{}}
          >
            <Regent.Account.agent_mark kind={agent.kind} class="rg-fleet__mark" />
            <span class="rg-fleet__name"><bdi>{agent.name}</bdi></span>
            <.activity
              id={"#{@id}-#{agent.id}"}
              steps={agent.steps}
              now={@now}
              variant="line"
            />
          </.dynamic_tag>
        </li>
      </ul>
    </div>
    """
  end

  attr :step, :map, required: true
  attr :now, DateTime, required: true
  attr :action, :list, required: true

  defp row(assigns) do
    ~H"""
    <li class="rg-activity__step" data-step={@step.id} data-state={@step.state}>
      <span class="rg-activity__rail" aria-hidden="true">
        <span :if={@step.state == :running} class="rg-activity__trace"></span>
      </span>
      <.mark step={@step} />
      <span class="rg-activity__verb">{@step.verb}</span>
      <span class="rg-activity__label"><bdi>{@step.label}</bdi></span>
      <.time step={@step} now={@now} />
      <span :if={@step.state == :asks and @action != []} class="rg-activity__action">
        {render_slot(@action, @step.source)}
      </span>
    </li>
    """
  end

  attr :step, :map, required: true

  defp mark(assigns) do
    ~H"""
    <span class="rg-activity__mark" data-state={@step.state}>
      <Primitives.tick class="rg-activity__tick" done={@step.state == :done} aria-hidden="true" />
      <span :if={@step.state_word} class="rg-activity__state">{@step.state_word}</span>
    </span>
    """
  end

  attr :step, :map, required: true
  attr :now, DateTime, required: true

  defp time(assigns) do
    assigns = assign(assigns, :seconds, seconds(assigns.step, assigns.now))

    ~H"""
    <time
      class="rg-activity__time"
      datetime={@seconds && "PT#{@seconds}S"}
      data-unused={is_nil(@seconds)}
    >
      <Primitives.figure value={(@seconds && short_duration(@seconds)) || ""} width={3} />
    </time>
    """
  end

  # What the agent is doing now: its latest step that has started, or the next one.
  defp current(steps),
    do: steps |> Enum.reverse() |> Enum.find(&(&1.state != :queued)) || List.last(steps)

  defp step(
         %{id: id, kind: kind, label: label, started_at: started, finished_at: finished} = source
       )
       when kind in @kinds do
    state = state(kind, started, finished)
    verb = Map.fetch!(@verbs, kind)
    state_word = Map.fetch!(@states, state)

    %{
      id: id,
      label: label,
      started_at: started,
      finished_at: finished,
      state: state,
      verb: verb,
      # Read out only where the verb does not already say it ("Done", then "Reading").
      state_word: if(String.starts_with?(verb, state_word), do: nil, else: state_word),
      source: source
    }
  end

  defp step(step), do: raise(ArgumentError, "not an activity step: #{inspect(step)}")

  defp state(:failed, _, _), do: :failed
  defp state(:done, _, _), do: :done
  defp state(_, nil, _), do: :queued
  defp state(_, _, %DateTime{}), do: :done
  defp state(:waiting_for_you, _, nil), do: :asks
  defp state(_, _, nil), do: :running

  defp seconds(%{started_at: nil}, _now), do: nil

  defp seconds(%{started_at: started, finished_at: finished}, now),
    do: max(DateTime.diff(finished || now, started), 0)

  @doc """
  A step's time, rounded down to its largest unit: "12s", "3m", "5h", "2d".

      iex> Regent.Agents.short_duration(42)
      "42s"
      iex> Regent.Agents.short_duration(3 * 3600 + 59)
      "3h"
  """
  def short_duration(seconds) when seconds < 60, do: "#{seconds}s"
  def short_duration(seconds) when seconds < 3600, do: "#{div(seconds, 60)}m"
  def short_duration(seconds) when seconds < 86_400, do: "#{div(seconds, 3600)}h"
  def short_duration(seconds), do: "#{div(seconds, 86_400)}d"
end
