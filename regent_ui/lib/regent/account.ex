defmodule Regent.Account do
  @moduledoc """
  The account page's shared sections: the signed-out panel, the account card,
  paired agents with the pairing box and one agent's own view, and read-only
  Credits and Points.
  Products authorize and read the data, format amounts and dates, and own every
  action. No domain structs are required.

  Agent pictures and World's mark ship with this package: `mix regent_ui.assets`
  copies them to `priv/static/images/regent-ui/`, so the product serves `images`.
  An agent is named by its `kind`, the harness value the agents library gives it.

  `state` is `:ready`, `:loading`, `:stale` or `:error`. Map an idle read to
  `:loading`; a successful empty read is `:ready`. Only `:ready` and `:stale`
  display supplied values. Missing values stay unavailable, never zero.
  """
  use Phoenix.Component

  alias Regent.Primitives

  @agent_pictures %{
    "hermes" => "hermes.png",
    "grok_bot" => "grok-bot.png",
    "muse" => "muse.png",
    "openclaw" => "openclaw.png",
    "nemoclaw" => "nemoclaw.png",
    "ironclaw" => "ironclaw.png",
    "pi" => "pi.svg",
    "claude_code" => "claude-code.png",
    "codex" => "codex.png",
    "cursor" => "cursor.png",
    "gemini_cli" => "gemini-cli.png",
    "dots" => "dots.png",
    "other" => "other.svg"
  }

  # Shown only when the agent's person has connected World ID; nothing is said otherwise.
  @world_id_words "World ID Connected"

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

  attr :name, :string,
    required: true,
    doc:
      "what the site calls the person: their chosen name, their ENS name or their short address"

  attr :wallet, :string, default: nil, doc: "the account's full `0x` wallet address"
  attr :ens_name, :string, default: nil, doc: "the ENS name that points to `wallet`"
  attr :class, :any, default: nil
  attr :rest, :global
  slot :picture, doc: "the person's picture, 64 px square"

  @doc """
  The card at the top of the Account page: the person's picture, the name the site
  calls them and their wallet, each said once. When the site calls them by their ENS
  name or short address, that name is the wallet: it opens the full address and copies
  it (`Regent.Primitives.address`), and nothing repeats beneath it. A name they chose
  has their wallet beneath it, as its ENS name if it has one, else its short address.
  """
  def identity(assigns) do
    assigns =
      assign(assigns,
        name_is_wallet:
          assigns.wallet != nil and
            assigns.name in [Primitives.short_address(assigns.wallet), assigns.ens_name]
      )

    ~H"""
    <section id={@id} class={["rg-account-identity", @class]} aria-label="Your account" {@rest}>
      <p class="rg-account-identity__kicker">Your account</p>
      <div class="rg-account-identity__who">
        <div :if={@picture != []} class="rg-account-identity__picture">{render_slot(@picture)}</div>
        <div class="rg-account-identity__name">
          <h2 :if={!@name_is_wallet}>{@name}</h2>
          <h2 :if={@name_is_wallet}>
            <Primitives.address id={"#{@id}-wallet"} address={@wallet} label={@name} />
          </h2>
          <p :if={@wallet && !@name_is_wallet}>
            <Primitives.address
              id={"#{@id}-wallet"}
              address={@wallet}
              label={@ens_name}
            />
          </p>
        </div>
      </div>
    </section>
    """
  end

  attr :id, :string, required: true

  attr :agents, :any,
    required: true,
    doc:
      "`:loading`, `:unavailable`, or a list of maps with id, name, kind, harness (label), " <>
        "backed, last_contact_iso and last_contact (formatted)"

  attr :notice, :string, default: nil, doc: "the result of the last action, read out politely"

  slot :about, doc: "tip text: what a paired agent may do on this site"

  slot :actions,
    doc:
      "per-agent controls, such as Unpair, as quiet buttons; receives the agent. They show " <>
        "when the row is hovered or focused, and stay in view on touch screens"

  slot :footer, doc: "pairing controls, or where to manage agents when this site cannot"

  def agents(assigns) do
    assigns = assign(assigns, :world_id_words, @world_id_words)

    ~H"""
    <section
      id={@id}
      class="rg-account"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@agents == :loading && "true"}
    >
      <h2 id={"#{@id}-title"}>
        Agents
        <Primitives.tip id={"#{@id}-about"} label="About paired agents">
          {render_slot(@about)}
          <span class="rg-account__tip-line" data-after={@about != [] && "true"}>
            Each agent chose its own name when it paired. Only you and the agent see it;
            open an agent to rename it.
          </span>
          <span class="rg-account__tip-line" data-after="true">
            An agent shows {@world_id_words} once its person verifies with World ID.
            <a href="https://siwa.regents.sh/skill.md" target="_blank" rel="noopener noreferrer">
              How to connect (step 7)
            </a>
          </span>
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
          <.agent_mark kind={agent.kind} />
          <p class="rg-account__agent">
            <strong>{agent.name}</strong>
            <.world_id :if={agent.backed} />
          </p>
          <p class="rg-account__meta">
            <span>{agent.harness}</span>
            <span>
              Last contact <time datetime={agent.last_contact_iso}>{agent.last_contact}</time>
            </span>
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

  attr :agents, :any,
    required: true,
    doc:
      "`:loading`, `:unavailable`, or a list of at most three maps with id, name, kind, " <>
        "and last_action, last_action_iso and last_action_at (short, such as \"3m\"), " <>
        "each nil until read"

  attr :manage_href, :string,
    default: nil,
    doc: "where Manage beside the heading leads, such as https://regents.sh/account"

  @doc """
  The person's agents in a narrow panel: at most three, each agent's picture and
  name over where it was last active and how long ago. A last action not yet read
  keeps its line's space, so reading it never moves a row. With `manage_href`,
  Manage shows beside the heading while the pointer is over the list or a key has
  moved into it, and always on a touch screen; it keeps its space when hidden.
  """
  def agents_brief(assigns) do
    ~H"""
    <section
      id={@id}
      class="rg-account__brief"
      aria-labelledby={"#{@id}-title"}
      aria-busy={@agents == :loading && "true"}
    >
      <div class="rg-account__brief-head">
        <h2 id={"#{@id}-title"}>Your agents</h2>
        <a
          :if={@manage_href}
          href={@manage_href}
          class="rg-account__brief-manage"
          aria-label="Manage your agents"
        >
          Manage
        </a>
      </div>
      <p :if={@agents == :loading} role="status">Loading…</p>
      <p :if={@agents == :unavailable} role="alert">
        Your agents couldn’t be read. Try refreshing.
      </p>
      <p :if={@agents == []}>No agents paired yet.</p>
      <ul
        :if={is_list(@agents) and @agents != []}
        class="rg-account__brief-list"
        aria-labelledby={"#{@id}-title"}
      >
        <li :for={agent <- @agents} id={"#{@id}-agent-#{agent.id}"}>
          <.agent_mark kind={agent.kind} />
          <strong>{agent.name}</strong>
          <span class="rg-account__brief-last">
            <span>{agent.last_action}</span>
            <span :if={agent.last_action_at} aria-hidden="true">·</span>
            <time :if={agent.last_action_at} datetime={agent.last_action_iso}>
              {agent.last_action_at}
            </time>
          </span>
        </li>
      </ul>
    </section>
    """
  end

  attr :kind, :string, required: true, doc: "the agent's harness value, which picks its picture"
  attr :class, :any, default: nil

  def agent_mark(assigns) do
    assigns =
      assign(
        assigns,
        :src,
        "/images/regent-ui/agents/" <> Map.fetch!(@agent_pictures, assigns.kind)
      )

    ~H"""
    <span class={["rg-account__mark", @class]} aria-hidden="true">
      <img src={@src} alt="" width="48" height="48" />
    </span>
    """
  end

  @doc "World's mark and \"#{@world_id_words}\": the agent's person connected World ID."
  def world_id(assigns) do
    assigns = assign(assigns, :words, @world_id_words)

    ~H"""
    <span class="rg-account__world">
      <img
        class="rg-account__world-dark"
        src="/images/regent-ui/world/logomark-off-white.svg"
        alt=""
        width="22"
        height="22"
      />
      <img
        class="rg-account__world-light"
        src="/images/regent-ui/world/logomark-off-black.svg"
        alt=""
        width="22"
        height="22"
      />{@words}
    </span>
    """
  end

  attr :id, :string, required: true

  attr :harnesses, :list,
    required: true,
    doc: "every agent a person may choose, as %{value, label}; value is the harness value"

  attr :chosen, :string, default: nil, doc: "the chosen agent's value"

  attr :messages, :list,
    default: [],
    doc:
      "`:list` layout: every agent's message, with a stand-in code before one is made, so " <>
        "the box keeps one size"

  attr :message, :string, default: nil, doc: "the chosen agent's message once its code is made"

  attr :outcome, :any,
    default: nil,
    doc: "`{:paired, name}` once the code is used, `:unavailable` when no code could be made"

  attr :expires_iso, :string, default: nil
  attr :expires, :string, default: nil, doc: "when the code stops working, such as \"14:05 UTC\""

  attr :layout, :atom,
    default: :list,
    values: [:list, :icons],
    doc:
      "`:list` names each agent beside its picture and lists the steps; `:icons`, for a " <>
        "narrow panel, puts the message first in a short box that scrolls, the chosen agent's " <>
        "picture in its corner and small icons to copy it and make a new code, then the " <>
        "pictures alone, each but the chosen one named on hover or keyboard focus, then when " <>
        "the code stops working"

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
      assigns
      |> assign(:words, pairing_words(assigns.outcome, assigns.message, assigns.chosen))

    ~H"""
    <form id={@id} class="rg-account__pair" data-layout={@layout} {@rest}>
      <div :if={@layout == :icons} class="rg-account__prompt" role="status">
        <.agent_mark :if={@chosen} kind={@chosen} />
        <pre :if={@message}><code>{@message}</code></pre>
        <p :if={@words} class="rg-account__words" data-paired={paired?(@outcome)}>{@words}</p>
        <div class="rg-account__prompt-tools">
          <Primitives.copy_icon
            id={"#{@id}-copy"}
            text={@message || ""}
            label="Copy message"
            data-unused={is_nil(@message)}
          />
          <button
            id={"#{@id}-new"}
            type="submit"
            class="rg-account__renew"
            aria-label="Make a new code"
            title="Make a new code"
            data-unused={is_nil(@chosen)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="square"
              aria-hidden="true"
            >
              <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4" />
            </svg>
          </button>
        </div>
      </div>
      <fieldset class="rg-account__choices" aria-labelledby={"#{@id}-title"}>
        <legend id={"#{@id}-title"}>
          Choose the agent to pair
        </legend>
        <label :for={harness <- @harnesses} class="rg-account__choice">
          <input
            type="radio"
            name="harness"
            value={harness.value}
            checked={harness.value == @chosen}
            class="rg-account__radio"
          />
          <.agent_mark kind={harness.value} />
          <span class="rg-account__choice-name">{harness.label}</span>
        </label>
      </fieldset>
      <.expiry :if={@layout == :icons} message={@message} iso={@expires_iso} at={@expires} />
      <%= if @layout == :list do %>
        <ol class="rg-account__steps">
          <li>Copy this message.</li>
          <li>Paste it to your agent wherever you chat with it.</li>
          <li>Your agent appears here once it pairs. This page updates on its own.</li>
        </ol>
        <div class="rg-account__message" role="status">
          <pre :for={message <- @messages} data-unused={message != @message}><code>{message}</code></pre>
          <p :if={@words} class="rg-account__words" data-paired={paired?(@outcome)}>{@words}</p>
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
        <.expiry message={@message} iso={@expires_iso} at={@expires} />
      <% end %>
    </form>
    """
  end

  attr :message, :string, required: true
  attr :iso, :string, required: true
  attr :at, :string, required: true

  defp expiry(assigns) do
    ~H"""
    <p class="rg-account__expiry" data-unused={is_nil(@message)}>
      The code works once, until <time datetime={@iso}>{@at || "00:00 UTC"}</time>.
    </p>
    """
  end

  defp paired?({:paired, _name}), do: "true"
  defp paired?(_outcome), do: nil

  attr :id, :string, required: true

  attr :agent, :map,
    required: true,
    doc:
      "id, name, kind (harness value), harness (label), wallet (the full address), wallet_label " <>
        "(its ENS name or short form), listing (nil or %{url, number}), and " <>
        "paired_at, last_contact (relative) and last_contact_at, formatted"

  attr :verified, :boolean, required: true, doc: "its person connected World ID"
  attr :same_person_count, :integer, default: 0, doc: "agents that person runs, this one included"

  attr :same_person, :list,
    default: [],
    doc: "this account's other agents of that person: %{id, name}"

  attr :activity, :any,
    required: true,
    doc:
      "`:loading`, `:unavailable`, or a list of %{site, day_iso, day, hours}: a line for each " <>
        "site and day, newest first, `hours` saying when its first and last request came"

  attr :may, :list, required: true, doc: "what a paired agent may do on this site, a line each"

  attr :spent, :any,
    required: true,
    doc: "`:loading`, `:unavailable`, or the Credits it has spent for its person, formatted"

  attr :notice, :any, default: nil, doc: "`{:status | :alert, text}`: how the last action ended"
  attr :target, :any, default: nil, doc: "phx-target for the presses below"
  attr :open_event, :string, required: true, doc: "opens another agent; carries `id`"

  attr :rename_event, :string,
    required: true,
    doc: "saves a new name for this agent; carries `agent_id` and `name`"

  attr :name_error, :string,
    default: nil,
    doc: "why the last new name was refused, in a few words, shown in place of the name's hint"

  attr :rest, :global, doc: "the product's dialog hook, which opens it and reports its close"
  slot :actions, doc: "the product's buttons beside Done, such as Unpair"

  @doc """
  One agent: who it is and its name, which the person may change, when it paired,
  who stands behind it, then the three questions every Regent site answers in the
  same words: what may happen next, what it cost and what it has done across the
  Regent sites. "Done" closes the dialog in the browser.
  """
  def agent_detail(assigns) do
    ~H"""
    <Regent.Structure.dialog
      id={@id}
      class="rg-account__dialog"
      aria-labelledby={"#{@id}-title"}
      {@rest}
    >
      <header class="rg-account__dialog-head">
        <.agent_mark kind={@agent.kind} />
        <div>
          <p>{@agent.harness}</p>
          <h2 id={"#{@id}-title"}>{@agent.name}</h2>
        </div>
      </header>

      <form class="rg-account__name" phx-submit={@rename_event} phx-target={@target}>
        <input type="hidden" name="agent_id" value={@agent.id} />
        <Primitives.field :let={field} id={"#{@id}-name"} label="Name">
          <div class="rg-account__name-row">
            <input
              id={field.id}
              name="name"
              value={@agent.name}
              maxlength="80"
              required
              autocomplete="off"
              aria-invalid={@name_error && "true"}
              aria-describedby={field.described_by}
            />
            <Primitives.button type="submit">Save</Primitives.button>
          </div>
          <:hint>
            <span :if={@name_error} role="alert">{@name_error}</span>
            <span :if={!@name_error}>Only you see this name.</span>
            <Primitives.tip id={"#{@id}-name-about"} label="About this name">
              Your agent chose this name when it paired. Only you and the agent see it.
              A new name shows on your account on every Regent site. It may hold up to
              80 characters, with no hidden characters.
            </Primitives.tip>
          </:hint>
        </Primitives.field>
      </form>

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
          <dd>
            <Primitives.address
              id={"#{@id}-wallet"}
              address={@agent.wallet}
              label={@agent.wallet_label}
            />
          </dd>
        </div>
        <div :if={@agent.listing}>
          <dt>Registry listing</dt>
          <dd>
            <a href={@agent.listing.url} target="_blank" rel="noopener noreferrer">
              Agent #{@agent.listing.number}
            </a>
          </dd>
        </div>
        <div :if={@verified}>
          <dt>Person</dt>
          <dd>
            <span class="rg-account__human">
              <.world_id />
              <Primitives.tip id={"#{@id}-human"} label="About World ID">
                A real person verified with World ID stands behind this agent. Who they are stays private.
              </Primitives.tip>
            </span>
            <span :if={@same_person_count >= 2}>
              1 of {@same_person_count} agents run by the same person
            </span>
            <span :if={@same_person != []} class="rg-account__others">
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

      <section class="rg-account__part" aria-labelledby={"#{@id}-may"}>
        <h3 id={"#{@id}-may"}>What may happen next</h3>
        <p>While it stays paired, {@agent.name} may:</p>
        <ul>
          <li :for={line <- @may}>{line}</li>
        </ul>
        <p class="rg-account__aside">It never uses your wallet.</p>
      </section>

      <section class="rg-account__part" aria-labelledby={"#{@id}-cost"}>
        <h3 id={"#{@id}-cost"}>What it cost</h3>
        <p role="status">{spent_words(@spent)}</p>
      </section>

      <section class="rg-account__log" aria-labelledby={"#{@id}-activity"}>
        <h3 id={"#{@id}-activity"}>Recent activity</h3>
        <p>
          The Regent sites this agent signed requests on since it paired, a line for each site and day, newest first. Kept for 30 days.
        </p>
        <p :if={@activity == :loading} role="status">Reading this agent’s activity…</p>
        <p :if={@activity == :unavailable} role="status">
          This agent’s activity couldn’t be read right now. Refresh to try again.
        </p>
        <p :if={@activity == []} role="status">No requests yet since it paired.</p>
        <ol :if={is_list(@activity) and @activity != []}>
          <li :for={entry <- @activity}>
            <span>{entry.site}</span>
            <span>{entry.hours}</span>
            <time datetime={entry.day_iso}>{entry.day}</time>
          </li>
        </ol>
      </section>

      <p :if={@notice} class="rg-account__notice" role={elem(@notice, 0)}>{elem(@notice, 1)}</p>

      <div class="rg-account__dialog-actions">
        {render_slot(@actions)}
        <form method="dialog">
          <Primitives.button type="submit" value="close">Done</Primitives.button>
        </form>
      </div>
    </Regent.Structure.dialog>
    """
  end

  defp spent_words(:loading), do: "Reading what it has spent…"

  defp spent_words(:unavailable),
    do: "What it has spent couldn’t be read right now. Refresh to try again."

  defp spent_words(spent), do: "#{spent} spent for you on Regent sites."

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
  attr :title, :string, default: "Points", doc: "\"Balance\" on a page already titled Points"
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
      <h2 id={"#{@id}-title"}>{@title}</h2>
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
      "formatted maps with label, amount, occurred_at, optional status and optional link " <>
        "(`%{href, label, description}`, opened in a new tab, `description` read aloud); " <>
        "no raw domain records"

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
              <span :if={Map.get(row, :link)}>
                ·
                <a
                  href={row.link.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={row.link.description}
                >
                  {row.link.label}
                </a>
              </span>
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
    do: "#{name} paired with your account."

  defp pairing_words(:unavailable, _message, _chosen),
    do: "A pairing code couldn’t be made right now. Try again in a moment."

  defp pairing_words(nil, nil, nil), do: "Choose type of agent below to get pairing message."
  defp pairing_words(nil, _message, _chosen), do: nil

  defp agents_state(:loading), do: :loading
  defp agents_state(:unavailable), do: :error
  defp agents_state(_agents), do: :ready

  defp agents_text(:loading, _notice), do: "Loading…"
  defp agents_text(:unavailable, _notice), do: "Your agents couldn’t be read. Try refreshing."
  defp agents_text(_agents, notice), do: notice
end
