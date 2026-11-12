defmodule Regent.Points do
  @moduledoc """
  The Points page, the same on every site: the total on the site's band colour,
  the actions left to do, the leaderboard, the NFT bonus and the activity.

  Every piece takes words and figures already made for display. None reads an
  account, and none decides what earns.
  """
  use Phoenix.Component
  alias Regent.{Icons, Primitives}

  @states [:ready, :loading, :stale, :error]

  slot :total, required: true
  slot :main, required: true, doc: "the to-do list, then the activity"
  slot :side, doc: "the leaderboard, then the bonus"

  @doc """
  The page's frame: the total across the top, then two columns, or one where the
  page gives Points less than 52rem.
  """
  def layout(assigns) do
    ~H"""
    <div class="rg-points">
      <div class="rg-points__frame">
        {render_slot(@total)}
        <div class="rg-points__main">{render_slot(@main)}</div>
        <div :if={@side != []} class="rg-points__side">{render_slot(@side)}</div>
      </div>
    </div>
    """
  end

  attr :id, :string, required: true
  attr :total, :string, default: nil, doc: "the account's Points, formatted"
  attr :today, :string, default: nil, doc: "earned today, formatted, with no sign"
  attr :yesterday, :string, default: nil
  attr :rank, :string, default: nil, doc: "the account's place, such as \"3\"; nil with no points"
  attr :pending, :integer, default: 0, doc: "actions still being checked"
  attr :state, :atom, default: :ready, values: @states
  slot :inner_block, doc: "one sentence saying what Points are"

  @doc """
  The account's total, large, on the site's band colour, with today, yesterday
  and the account's place beside it.
  """
  def total(assigns) do
    assigns = assign(assigns, :note, note(assigns.state, assigns.pending))

    ~H"""
    <section
      id={@id}
      class="rg-points-total"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@state == :loading && "true"}
    >
      <header>
        <h2 id={"#{@id}-title"}>Total</h2>
        <p
          class="rg-points-total__note"
          role={if @state == :error, do: "alert", else: "status"}
          data-unseen={to_string(is_nil(@note))}
        >
          {@note || "Current figures"}
        </p>
      </header>
      <div class="rg-points-total__main">
        <p class="rg-points-total__figure rg-figure">{figure(@total, @state)}</p>
        <p :if={@inner_block != []} class="rg-points-total__about">{render_slot(@inner_block)}</p>
      </div>
      <dl class="rg-points-total__days rg-figure">
        <div>
          <dt>Today</dt>
          <dd>{gain(@today, @state)}</dd>
        </div>
        <div>
          <dt>Yesterday</dt>
          <dd>{gain(@yesterday, @state)}</dd>
        </div>
        <div>
          <dt>Rank</dt>
          <dd>{if @rank, do: "##{@rank}", else: "–"}</dd>
        </div>
      </dl>
    </section>
    """
  end

  attr :id, :string, required: true
  attr :left, :integer, default: nil, doc: "how many listed actions the account can still do"

  attr :groups, :list,
    required: true,
    doc: """
    each `%{title: "Once" | "Daily", items: [item], limit: limit | nil}`. An item is
    `%{id, label, points, done}` with optional `note` (a few words under the label),
    `count` (`%{done, of}`, drawn as a bar) and `href` (where the action is done).
    `points` is nil before earning opens. A limit is `%{label, used, of, value}`:
    the day's shared room, `value` its words, such as "35 of 100".
    """

  slot :inner_block, doc: "a line under the title, such as the notice that earning has not opened"

  @doc """
  The actions that earn: the ones left first, then the ones done, ticked. A daily
  action shows how much of today's count is used.
  """
  def todo(assigns) do
    ~H"""
    <section id={@id} class="rg-points-todo" aria-labelledby={"#{@id}-title"}>
      <header>
        <h2 id={"#{@id}-title"}>To do</h2>
        <p :if={@left} class="rg-points-todo__left" data-none={to_string(@left == 0)}>
          {if @left == 0, do: "All done", else: "#{@left} left"}
        </p>
      </header>
      {render_slot(@inner_block)}
      <div :for={group <- @groups} :if={group.items != []} class="rg-points-todo__group">
        <h3>{group.title}</h3>
        <p :if={group[:limit]} class="rg-points-todo__limit rg-figure">
          <span>{group.limit.label}</span>
          <progress max={group.limit.of} value={group.limit.used}>{group.limit.value}</progress>
          <span>{group.limit.value}</span>
        </p>
        <ul>
          <li :for={item <- sorted(group.items)} data-done={to_string(item.done)}>
            <span class="rg-points-todo__mark">
              <Icons.icon name={if item.done, do: "check", else: "circle"} />
              <span class="rg-points__unseen">{if item.done, do: "Done", else: "Left"}</span>
            </span>
            <span class="rg-points-todo__label">
              <a :if={item[:href] && !item.done} href={item.href}>{item.label}</a>
              <span :if={!(item[:href] && !item.done)}>{item.label}</span>
              <small :if={item[:note]}>{item.note}</small>
            </span>
            <progress
              :if={item[:count]}
              max={item.count.of}
              value={item.count.done}
              aria-label={"#{item.label}: #{item.count.done} of #{item.count.of} today"}
            >
              {item.count.done} of {item.count.of}
            </progress>
            <span :if={item.points} class="rg-points-todo__points rg-figure">{item.points}</span>
          </li>
        </ul>
      </div>
    </section>
    """
  end

  attr :id, :string, required: true

  attr :rows, :list,
    default: [],
    doc:
      "the highest totals, each `%{rank, name, wallet, ens_name, points, you}` and whatever the `face` slot draws: " <>
        "`name` is the name the person chose, else `nil`, and the row then shows `wallet` as an address, " <>
        "labelled with `ens_name` when it has one"

  attr :you, :map, default: nil, doc: "`%{rank, points}` for an account below the list, else nil"
  attr :state, :atom, default: :ready, values: @states
  slot :face, doc: "the picture beside a row's name; receives the row"

  @doc """
  The highest totals by name, or by wallet address with its copy icon for a person who
  chose no name. The reader's own row stands out.
  """
  def board(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-points-board"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@state == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>Leaderboard</h2>
      <p :if={@state == :loading} role="status">Loading…</p>
      <p :if={@state == :error} role="alert">Could not load. Try refreshing.</p>
      <p :if={@state in [:ready, :stale] and @rows == []}>No points yet.</p>
      <ol :if={@state in [:ready, :stale] and @rows != []}>
        <li
          :for={{row, line} <- Enum.with_index(@rows, 1)}
          data-you={to_string(row.you)}
          data-top={to_string(row.rank <= 3)}
        >
          <span class="rg-points-board__rank">{row.rank}</span>
          <span :if={@face != []} class="rg-points-board__face">{render_slot(@face, row)}</span>
          <span class="rg-points-board__name">
            <bdi :if={row.name} title={row.name}>{row.name}</bdi>
            <Primitives.address
              :if={!row.name}
              id={"#{@id}-wallet-#{line}"}
              address={row.wallet}
              label={row.ens_name}
              variant="compact"
            />
            <span :if={row.you} class="rg-points-board__tag">You</span>
          </span>
          <span class="rg-points-board__points">{row.points}</span>
        </li>
      </ol>
      <p :if={@state in [:ready, :stale] and @you} class="rg-points-board__you rg-figure">
        <span class="rg-points-board__rank">{@you.rank}</span>
        <span class="rg-points-board__name">You</span>
        <span class="rg-points-board__points">{@you.points}</span>
      </p>
    </section>
    """
  end

  attr :id, :string, required: true

  attr :state, :atom,
    default: :ready,
    values: [:closed | @states],
    doc: "`:closed` before earning opens: the tiers show and nothing is counted"

  attr :nfts, :integer, default: nil, doc: "the NFTs the account's wallets hold now"
  attr :percent, :integer, default: nil, doc: "the bonus that count earns"

  attr :message, :string,
    default: nil,
    doc: "replaces the line shown when the count could not be read"

  attr :tiers, :list,
    required: true,
    doc: "ascending, each `%{range: \"3–6\", percent: 45, held: boolean}`"

  attr :periods, :list, default: [], doc: "bonuses already added, each `%{label, value}`"
  slot :tip, doc: "the rule behind the bonus, behind a tip"

  @doc "The NFT bonus: the account's tier among the three, and the bonuses already added."
  def bonus(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-points-bonus"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@state == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>Bonus {render_slot(@tip)}</h2>
      <p
        class="rg-points-bonus__held rg-figure"
        role={if @state == :error, do: "alert", else: "status"}
      >
        <%= case @state do %>
          <% :closed -> %>
            Counted once earning opens.
          <% :loading -> %>
            Checking your NFTs…
          <% state when state in [:error, :stale] -> %>
            {@message || "Your NFTs could not be checked. Try refreshing."}
          <% :ready -> %>
            <strong>+{@percent}%</strong>
            <span>{@nfts} {if @nfts == 1, do: "NFT", else: "NFTs"} held</span>
        <% end %>
      </p>
      <ol class="rg-points-bonus__tiers rg-figure">
        <li :for={tier <- @tiers} data-held={to_string(@state == :ready and tier.held)}>
          <span>{tier.range}</span>
          <strong>+{tier.percent}%</strong>
        </li>
      </ol>
      <dl :if={@periods != []} class="rg-points-bonus__periods rg-figure">
        <div :for={period <- @periods}>
          <dt>{period.label}</dt>
          <dd>{period.value}</dd>
        </div>
      </dl>
    </section>
    """
  end

  attr :id, :string, required: true

  attr :rows, :list,
    default: [],
    doc: """
    newest first, each `%{id, label, by, at, points}` with optional `status` (shown
    only when the entry was not simply counted) and `note` (the words behind a tip)
    """

  attr :more, :boolean, default: false, doc: "older entries exist beyond these"
  slot :tip, doc: "draws a row's `note`; receives the row"

  @doc "What the account earned, newest first: the action, who did it, when and the points."
  def activity(assigns) do
    ~H"""
    <section id={@id} class="rg-points-activity" aria-labelledby={"#{@id}-title"}>
      <h2 id={"#{@id}-title"}>Activity</h2>
      <p :if={@rows == []}>Nothing earned yet.</p>
      <ol :if={@rows != []}>
        <li :for={row <- @rows} id={"#{@id}-#{row.id}"}>
          <span class="rg-points-activity__label">
            <span>{row.label} {if row[:note], do: render_slot(@tip, row)}</span>
            <small>{row.by} · {row.at}</small>
          </span>
          <span :if={row[:status]} class="rg-points-activity__status">{row.status}</span>
          <span class="rg-points-activity__points rg-figure">{row.points}</span>
        </li>
      </ol>
      <p :if={@more} class="rg-points-activity__more">Latest 50 shown.</p>
    </section>
    """
  end

  # Actions left come first; within each, the order given.
  defp sorted(items), do: Enum.sort_by(items, & &1.done)

  defp figure(_value, :loading), do: "…"
  defp figure(value, _state) when value in [nil, ""], do: "–"
  defp figure(value, _state), do: value

  defp gain(value, state) when state == :loading or value in [nil, ""], do: figure(value, state)
  defp gain(value, _state), do: "+" <> value

  defp note(:error, _pending), do: "Could not load. Try refreshing."
  defp note(:stale, _pending), do: "Last saved figures. Refresh failed."
  defp note(_state, 1), do: "1 action being checked"
  defp note(_state, pending) when pending > 1, do: "#{pending} actions being checked"
  defp note(_state, _pending), do: nil
end
