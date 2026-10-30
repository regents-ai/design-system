defmodule Regent.Primitives do
  @moduledoc """
  Presentation primitives. Applications own routes, events, authorization and state.
  Collapsed disclosure bodies stay rendered; agent tools should expose the same
  authorized detail independently of visual expansion.
  """
  use Phoenix.Component

  attr :type, :string, default: "button", values: ~w(button submit reset)
  attr :variant, :string, default: "primary", values: ~w(primary secondary quiet)

  attr :arrow, :boolean,
    default: true,
    doc:
      "false for a button that shows something, such as a balance or a name, rather than going on"

  attr :class, :any, default: nil
  attr :rest, :global, include: ~w(disabled form name value popovertarget popovertargetaction)
  slot :inner_block, required: true

  def button(assigns) do
    ~H"""
    <button
      type={@type}
      class={["rg-button", "rg-button--#{@variant}", !@arrow && "rg-button--no-arrow", @class]}
      {@rest}
    >
      <span class="rg-button__label">{render_slot(@inner_block)}</span>
    </button>
    """
  end

  attr :id, :string, required: true
  attr :text, :string, default: nil, doc: "What the button copies. Give this or `target`."

  attr :target, :string,
    default: nil,
    doc: "The id of the element on the page whose text the button copies. Give this or `text`."

  attr :variant, :string, default: "secondary", values: ~w(primary secondary quiet)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  @doc """
  A button that copies `text`, or the text of the element whose id is `target`,
  on any page, live or not. The application installs the template's page-wide copy
  listener once, which copies on press and sets `data-copy-state` to `copied`,
  `selected` or `failed` for a moment; a live page keeps that state through its
  updates. The button
  then shows "Copied", "Selected" or "Couldn't copy" in place of its label, at
  the label's widest, and the polite status after it says the same for screen
  readers. When the browser refuses the clipboard, a `target` is selected for the
  person to copy themselves; a `text` cannot be, so the button says it failed.
  """
  def copy_button(%{text: text, target: target} = assigns)
      when is_nil(text) == is_nil(target) do
    raise ArgumentError, "copy_button #{assigns.id} takes exactly one of text or target"
  end

  def copy_button(assigns) do
    ~H"""
    <.button
      id={@id}
      variant={@variant}
      class={["rg-copy", @class]}
      phx-mounted={Phoenix.LiveView.JS.ignore_attributes(["data-copy-state"])}
      data-copy-text={@text}
      data-copy-target={@target}
      data-copy-status={"#{@id}-status"}
      {@rest}
    >
      <span class="rg-copy__words">
        <span class="rg-copy__idle">{render_slot(@inner_block)}</span>
        <span class="rg-copy__copied">Copied</span>
        <span :if={@target} class="rg-copy__selected">Selected</span>
        <span class="rg-copy__failed">Couldn't copy</span>
      </span>
    </.button>
    <span id={"#{@id}-status"} class="rg-copy__status" role="status" phx-update="ignore"></span>
    """
  end

  attr :id, :string, required: true
  attr :text, :string, default: nil, doc: "What the icon copies. Give this or `target`."

  attr :target, :string,
    default: nil,
    doc: "The id of the element on the page whose text the icon copies. Give this or `text`."

  attr :label, :string, required: true, doc: "what a press copies, read out and shown on hover"
  attr :class, :any, default: nil
  attr :rest, :global

  @doc """
  `copy_button/1` as an icon alone, for a box that holds what it copies. The same
  page-wide listener copies on press; the icon turns to a tick once copied, or a
  cross when the browser refuses, and the polite status after it says so.
  """
  def copy_icon(%{text: text, target: target} = assigns)
      when is_nil(text) == is_nil(target) do
    raise ArgumentError, "copy_icon #{assigns.id} takes exactly one of text or target"
  end

  def copy_icon(assigns) do
    ~H"""
    <button
      id={@id}
      type="button"
      class={["rg-copy", "rg-copy--icon", @class]}
      aria-label={@label}
      title={@label}
      phx-mounted={Phoenix.LiveView.JS.ignore_attributes(["data-copy-state"])}
      data-copy-text={@text}
      data-copy-target={@target}
      data-copy-status={"#{@id}-status"}
      {@rest}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="square"
        aria-hidden="true"
      >
        <path class="rg-copy__idle" d="M8 8h12v12H8zM16 8V4H4v12h4" />
        <path class="rg-copy__copied" d="m5 12.5 4.5 4.5L19 7.5" />
        <path class="rg-copy__selected" d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3" />
        <path class="rg-copy__failed" d="m6 6 12 12M18 6 6 18" />
      </svg>
    </button>
    <span id={"#{@id}-status"} class="rg-copy__status" role="status" phx-update="ignore"></span>
    """
  end

  attr :id, :string, required: true

  attr :at, DateTime,
    default: nil,
    doc: "when the figures beside it were last read, or nil before the first reading"

  attr :label, :string,
    default: "Read again now",
    doc: "what a press of the icon does, read out and shown on hover"

  attr :class, :any, default: nil

  attr :rest, :global,
    include: ~w(disabled),
    doc: "the press, such as `phx-click`, and `disabled` while the page rests the icon"

  @doc """
  When the figures beside it were last read from the chain, and an icon that asks
  for them to be read again. The time is a clock time in UTC, so it stays right
  however long the page is open. The press is the page's own (`phx-click`); the new
  time arrives with the new figures, and the icon turns while the press is on its way.
  """
  def last_read(assigns) do
    ~H"""
    <span id={@id} class={["rg-last-read", @class]}>
      <time :if={@at} datetime={DateTime.to_iso8601(@at)}>
        Updated {Calendar.strftime(@at, "%-d %b, %H:%M UTC")}
      </time>
      <span :if={!@at}>Not read yet</span>
      <button
        id={"#{@id}-again"}
        type="button"
        class="rg-last-read__again"
        aria-label={@label}
        title={@label}
        {@rest}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="square"
          aria-hidden="true"
        >
          <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15" />
        </svg>
      </button>
    </span>
    """
  end

  @explorers %{
    "base" => %{name: "Basescan", host: "basescan.org"},
    "ethereum" => %{name: "Etherscan", host: "etherscan.io"},
    "robinhood" => %{name: "Blockscout", host: "robinhoodchain.blockscout.com"}
  }

  attr :id, :string, required: true

  attr :address, :string,
    required: true,
    doc: "the full `0x` address, transaction hash or long ID"

  attr :kind, :string,
    default: "address",
    values: ~w(address tx id),
    doc:
      "`tx` for a transaction hash; `id` for a long hex ID, such as a Uniswap v4 pool ID, which no explorer opens"

  attr :chain, :string,
    default: "base",
    values: ["base", "ethereum", "robinhood", nil],
    doc:
      "the chain it is on, whose explorer the arrow opens: Basescan, Etherscan or Blockscout for Robinhood; nil for a test network with no explorer, such as a local chain, and no arrow"

  attr :label, :string,
    default: nil,
    doc:
      "what shows in the short and compact forms: the ENS name that points to `address`; its short form `0x1234..abcd` if nil"

  attr :variant, :string,
    default: "short",
    values: ~w(short full compact),
    doc:
      "`short`: the name or short form, copy icon and explorer arrow; `full`: every character, wrapping, for a person to check, with both icons; `compact`: the name or short form and the copy icon only, beside a small control in a narrow row"

  attr :class, :any, default: nil
  attr :rest, :global

  @doc """
  Every ENS name, address, short address and transaction hash a Regent page shows
  (founder, 2026-10-19): the words, which open the full address on a click, tap or
  Enter, then, tight together, an icon that copies it and a diagonal arrow that opens
  it on its chain's explorer in a new tab: Basescan, Etherscan for Ethereum or
  Blockscout for Robinhood. For an ENS name all three give the address it points to.
  On a test network with no explorer (`chain={nil}`) and for a long ID that is not an
  address (`kind="id"`), such as a Uniswap v4 pool ID, the words and the copy icon
  stand alone.

  Where a person must check every character, such as an address they typed for
  someone else, `variant="full"` shows the whole address, wrapping, and nothing
  else in its place. Beside a small control in a narrow row, `variant="compact"`
  keeps the words and the copy icon and leaves the arrow out.
  """
  def address(assigns) do
    explorer = if assigns.kind != "id", do: @explorers[assigns.chain]

    assigns =
      assign(assigns,
        label: assigns.label || short_address(assigns.address),
        copy: copy_label(assigns.kind),
        explorer: explorer && explorer.name,
        href: explorer && "https://#{explorer.host}/#{assigns.kind}/#{assigns.address}"
      )

    ~H"""
    <span id={@id} class={["rg-address", "rg-address--#{@variant}", @class]} {@rest}>
      <span :if={@variant == "full"} class="rg-address__words">{@address}</span>
      <%= if @variant != "full" do %>
        <button type="button" class="rg-address__label" popovertarget={"#{@id}-full"}>
          {@label}
        </button>
        <span id={"#{@id}-full"} class="rg-tip-body rg-address__full" popover>{@address}</span>
      <% end %>
      <span class="rg-address__icons">
        <.copy_icon id={"#{@id}-copy"} text={@address} label={@copy} />
        <a
          :if={@variant != "compact" and @explorer}
          id={"#{@id}-explorer"}
          class="rg-address__explorer"
          href={@href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"Open on #{@explorer}"}
          title={"Open on #{@explorer}"}
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="square"
            aria-hidden="true"
          >
            <path d="M2 10 10 2M3.5 2H10v6.5" />
          </svg>
        </a>
      </span>
    </span>
    """
  end

  defp copy_label("tx"), do: "Copy the transaction hash"
  defp copy_label("id"), do: "Copy the full ID"
  defp copy_label("address"), do: "Copy the full address"

  @doc """
  An address's short form, `0x`, its first four and last four characters joined by
  `..`, as every Regent page shows one.

      iex> Regent.Primitives.short_address("0x1234567890abcdef1234567890abcdef12345678")
      "0x1234..5678"
  """
  def short_address(<<"0x", head::binary-size(4), rest::binary>>) when byte_size(rest) > 4,
    do: "0x" <> head <> ".." <> binary_part(rest, byte_size(rest) - 4, 4)

  attr :id, :string, required: true
  attr :label, :string, required: true
  attr :errors, :list, default: []
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true
  slot :hint
  @doc "Wrap an application-owned input. The slot receives label and description IDs."
  def field(assigns) do
    ids =
      if(assigns.errors == [], do: [], else: [assigns.id <> "-errors"]) ++
        if assigns.hint == [], do: [], else: [assigns.id <> "-hint"]

    assigns = assign(assigns, :described_by, Enum.join(ids, " "))

    ~H"""
    <div class={["rg-field", @class]} {@rest}>
      <label for={@id}>{@label}</label>
      {render_slot(@inner_block, %{
        id: @id,
        described_by: @described_by,
        aria_invalid: to_string(@errors != [])
      })}
      <div :if={@hint != []} id={@id <> "-hint"} class="rg-muted">{render_slot(@hint)}</div>
      <ul :if={@errors != []} id={@id <> "-errors"} class="rg-field-errors">
        <li :for={error <- @errors}>{error}</li>
      </ul>
    </div>
    """
  end

  attr :tone, :string, default: "neutral", values: ~w(neutral info success warning error)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def status(assigns) do
    ~H"""
    <span class={["rg-status", "rg-tone--#{@tone}", @class]} {@rest}>
      {render_slot(@inner_block)}
    </span>
    """
  end

  attr :tone, :string, default: "info", values: ~w(info success warning error)
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def notice(assigns) do
    ~H"""
    <div
      role={if @tone == "error", do: "alert", else: "status"}
      class={["rg-notice", "rg-tone--#{@tone}", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :title, :string, required: true
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block
  slot :action

  def empty_state(assigns) do
    ~H"""
    <div class={["rg-empty", @class]} {@rest}>
      <p class="rg-empty-title">{@title}</p>
      <div :if={@inner_block != []} class="rg-muted">{render_slot(@inner_block)}</div>
      <div :if={@action != []}>{render_slot(@action)}</div>
    </div>
    """
  end

  attr :id, :string, required: true

  attr :label, :string,
    default: nil,
    doc: ~s(The "i" button's name, such as "About approving". A figure is its own name.)

  attr :class, :any, default: nil
  attr :rest, :global

  slot :figure,
    doc: "A figure, such as a price, that opens the words itself, in place of the \"i\"."

  slot :inner_block, required: true

  @doc """
  A small "i" button that opens a short explanation beside it, so the words a
  person rarely needs stay off the screen. Given a `figure`, the figure itself
  opens them and there is no "i". The explanation stays in the page and
  describes the button, so screen readers and agents read it without opening it.
  The browser's own popover opens it on a click, tap or Enter and closes it on
  Escape or a press elsewhere. With `tip.mjs` imported, it also opens while a mouse
  rests on the "i" or the figure and closes when the mouse leaves; a click then
  keeps it open.
  """
  def tip(assigns) do
    ~H"""
    <span class={["rg-tip", @class]} {@rest}>
      <button
        type="button"
        class={["rg-tip-button", @figure != [] && "rg-tip-button--figure"]}
        popovertarget={@id}
        aria-label={@figure == [] && @label}
        aria-describedby={@id}
      >
        {render_slot(@figure)}
        <svg :if={@figure == []} viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" /><path d="M8 7.25v4M8 4.75v.01" />
        </svg>
      </button>
      <span id={@id} class="rg-tip-body" popover role="tooltip">{render_slot(@inner_block)}</span>
    </span>
    """
  end

  attr :id, :string, required: true
  attr :summary, :string, required: true
  attr :index, :string, default: nil
  attr :open, :boolean, default: false
  attr :class, :any, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def disclosure(assigns) do
    ~H"""
    <details
      id={@id}
      open={@open}
      class={["rg-disclosure", @index && "rg-disclosure--indexed", @class]}
      {@rest}
    >
      <summary>
        <span :if={@index} class="rg-disclosure-index">{@index}</span>
        <span class="rg-disclosure-title">{@summary}</span>
        <span class="rg-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="rg-disclosure-body">{render_slot(@inner_block)}</div>
    </details>
    """
  end
end
