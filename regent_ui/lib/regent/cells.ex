defmodule Regent.Cells do
  @moduledoc """
  One total split among a few named parts, against a capacity: a balance by asset,
  Points by source, a fleet's seats, a token's supply. The bar is square cells, each
  part a run of cells as wide as its share of the capacity, the rest dim cells.

  The package draws it still, in CSS only. A site's hook may draw the moving picture
  in the canvas behind the cells; `CONSUMERS.md` lists its marks.
  """
  use Phoenix.Component

  alias Regent.{Icons, Primitives}

  # Shares are millionths of the capacity, so they add up exactly.
  @scale 1_000_000

  attr :id, :string, required: true
  attr :label, :string, required: true, doc: "what the meter shows, for screen readers"
  attr :used, :string, required: true, doc: "the total of the parts as the page shows it"

  attr :capacity, :string,
    required: true,
    doc: "the capacity as the page shows it, with its unit, such as \"100 Points\""

  attr :max, :any, required: true, doc: "the capacity as a number, above zero"

  attr :parts, :list,
    required: true,
    doc: """
    in order, each `%{key, name, value, amount}` with optional `icon` (a Lucide name) and
    `note` (one line): `key` stays the same across renders, `value` is a number and
    `amount` the value as the page shows it. The values add up to at most `max`.
    """

  attr :busy, :boolean, default: false, doc: "true while the total is still being counted"
  attr :class, :any, default: nil
  attr :rest, :global, doc: "the site's hook"

  slot :status, doc: "the line above the bar, such as what is left"
  slot :footer, doc: "the line under the parts, such as the page's action"

  @doc """
  The total and its capacity above, a line for the status, the bar of cells, and the
  parts as a list: a mark, the name and the amount. Pointing at a part or its row, or
  focusing a row with a note, lights that part, dims the others and puts its name,
  amount and note in the status line.
  """
  def meter(assigns) do
    assigns = assign(assigns, :parts, parts!(assigns))

    ~H"""
    <div
      id={@id}
      class={["rg-cells", @class]}
      role="group"
      aria-label={@label}
      aria-busy={@busy && "true"}
      data-cells-state={if @busy, do: "counting", else: "idle"}
      data-cells-capacity={@max}
      {@rest}
    >
      <p class="rg-cells__total">
        <Primitives.figure class="rg-cells__used" value={@used} />
        <span class="rg-cells__capacity">of {@capacity}</span>
      </p>
      <div class="rg-cells__meter">
        <p class="rg-cells__status">{render_slot(@status)}</p>
        <div id={"#{@id}-stage"} class="rg-cells__stage" phx-update="ignore" aria-hidden="true">
          <canvas class="rg-cells__canvas" data-cells-canvas></canvas>
        </div>
        <span class="rg-cells__track" aria-hidden="true"></span>
        <ul class="rg-cells__parts" role="list">
          <li
            :for={part <- @parts}
            class="rg-cells__part"
            data-cells-key={part.key}
            style={"--rg-cells-start: #{share(part.start)}; --rg-cells-share: #{share(part.share)}"}
            tabindex={part.note && "0"}
          >
            <span class="rg-cells__run" aria-hidden="true"></span>
            <span class="rg-cells__line" aria-hidden="true">
              <span class="rg-cells__line-name">{part.name}</span>
              <span class="rg-figure">{part.amount}</span>
              <span :if={part.note}>{part.note}</span>
            </span>
            <Icons.icon :if={part.icon} name={part.icon} class="rg-cells__mark" />
            <span :if={!part.icon} class="rg-cells__mark rg-cells__mark--cell" aria-hidden="true"></span>
            <span class="rg-cells__name">{part.name}</span><span class="rg-cells__hidden">, </span><span class="rg-cells__amount rg-figure">{part.amount}</span><span
              :if={part.note}
              class="rg-cells__hidden"
            >. {part.note}</span>
          </li>
        </ul>
      </div>
      <div :if={@footer != []} class="rg-cells__foot">{render_slot(@footer)}</div>
    </div>
    """
  end

  # Each part starts where the one before it ends; both edges are rounded to a
  # millionth of the capacity, so the shares add up to the last edge exactly.
  defp parts!(%{id: id, max: max, parts: parts}) do
    if not is_number(max) or max <= 0 do
      raise ArgumentError, "cells #{id} needs a capacity above zero, got #{inspect(max)}"
    end

    {parts, {_sum, last}} =
      Enum.map_reduce(parts, {0, 0}, fn part, {sum, start} ->
        part = part!(part)
        sum = sum + part.value
        stop = round(sum / max * @scale)
        {Map.merge(part, %{start: start, share: stop - start}), {sum, stop}}
      end)

    if last > @scale do
      raise ArgumentError, "cells #{id}: the parts add up to more than the capacity"
    end

    parts
  end

  defp part!(%{key: key, name: name, value: value, amount: amount} = part)
       when is_binary(key) and is_binary(name) and is_number(value) and value >= 0 and
              is_binary(amount) do
    %{
      key: key,
      name: name,
      value: value,
      amount: amount,
      icon: Map.get(part, :icon),
      note: Map.get(part, :note)
    }
  end

  defp part!(part), do: raise(ArgumentError, "not a cells part: #{inspect(part)}")

  defp share(millionths), do: :erlang.float_to_binary(millionths / @scale, decimals: 6)
end
