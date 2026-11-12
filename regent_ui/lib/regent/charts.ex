defmodule Regent.Charts do
  @moduledoc """
  Charts drawn on the server as SVG from the points the page passes: a price, a stake,
  earnings over a period. No chart library and no script; the motion kit may follow the
  pointer and move the line through the marks listed in `CONSUMERS.md`.

  A point is `%{at, value, figure, time}`: `at` a `DateTime`, `NaiveDateTime` or `Date`
  that places it across the chart, `value` a number that places it up the chart,
  `figure` the value as the page shows it ("1,204.50") and `time` the time as the page
  shows it ("12 Nov, 14:00 UTC"). Every chart carries a table of its points that screen
  readers and agents read in place of the drawing.
  """
  use Phoenix.Component

  alias Regent.Primitives

  @max_ticks 4

  attr :id, :string, required: true

  attr :label, :string,
    required: true,
    doc: "what the chart shows, one or two words with its unit, such as \"Price (USDC)\""

  attr :series, :any,
    required: true,
    doc:
      "`:loading`, `:slow`, `:unavailable`, or one or two `%{name, points}`, points oldest first: the first is drawn in the site's chart colour, the second muted and dashed"

  attr :fill, :boolean,
    default: false,
    doc: "a flat fill under the line; only with one series"

  attr :class, :any, default: nil
  attr :rest, :global

  slot :period, doc: "the page's period choice above the chart, a `Regent.Primitives.segmented`"
  slot :retry, doc: "the page's retry button, shown once slow or when the points couldn't be read"

  @doc """
  A line chart: one series in the site's chart colour, or two with the second muted and
  dashed, on a hairline baseline and at most four hairline rules labelled on the right.
  Above it, the latest figure of the first series and its time, beside the page's period
  choice. The chart keeps its height in every state: while the points load it is the
  waiting box, and a read with no points says "No activity yet."
  """
  def line(%{series: series} = assigns) when series in [:loading, :slow, :unavailable] do
    assigns = assign(assigns, state: waiting_state(series))

    ~H"""
    <div id={@id} class={["rg-chart", @class]} data-chart {@rest}>
      <.head id={@id} label={@label} period={@period} />
      <Primitives.waiting id={"#{@id}-plot"} state={@state} class="rg-chart__plot">
        <span></span>
        <:retry :if={@retry != []}>{render_slot(@retry)}</:retry>
      </Primitives.waiting>
    </div>
    """
  end

  def line(assigns) do
    series = validate!(assigns)

    case Enum.flat_map(series, & &1.points) do
      [] ->
        ~H"""
        <div id={@id} class={["rg-chart", @class]} data-chart {@rest}>
          <.head id={@id} label={@label} period={@period} />
          <div class="rg-chart__plot rg-chart__plot--none">
            <p class="rg-chart__none">No activity yet.</p>
          </div>
        </div>
        """

      points ->
        assigns = assign(assigns, plot(series, points))

        ~H"""
        <div id={@id} class={["rg-chart", @class]} data-chart {@rest}>
          <.head
            id={@id}
            label={@label}
            period={@period}
            latest={@latest}
            width={@width}
            legend={@legend}
          />
          <div class="rg-chart__plot" role="img" aria-labelledby={"#{@id}-label"} data-chart-plot>
            <div class="rg-chart__lines">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line
                  :for={tick <- @ticks}
                  class="rg-chart__grid"
                  x1="0"
                  x2="100"
                  y1={tick.y}
                  y2={tick.y}
                  vector-effect="non-scaling-stroke"
                />
                <path :if={@fill} class="rg-chart__fill" d={@area} />
                <path
                  :for={{line, index} <- Enum.with_index(@lines)}
                  class="rg-chart__line"
                  d={line}
                  data-chart-line={index}
                  vector-effect="non-scaling-stroke"
                />
              </svg>
              <span class="rg-chart__rule" aria-hidden="true"></span>
            </div>
            <div class="rg-chart__ticks" aria-hidden="true">
              <span
                :for={tick <- @ticks}
                class="rg-chart__tick rg-figure"
                style={"--rg-chart-y: #{tick.y}%"}
              >
                {tick.label}
              </span>
            </div>
          </div>
          <table class="rg-chart__table">
            <caption>{@label}</caption>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th :for={s <- @series} scope="col">{s.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr :for={row <- @rows} data-chart-point data-x={row.x} data-y={row.y}>
                <th scope="row">{row.time}</th>
                <td :for={figure <- row.figures} class="rg-figure">{figure}</td>
              </tr>
            </tbody>
          </table>
        </div>
        """
    end
  end

  attr :id, :string, required: true
  attr :label, :string, required: true
  attr :period, :list, required: true
  attr :latest, :map, default: nil
  attr :width, :integer, default: nil
  attr :legend, :list, default: []

  # The label, the figure read from the line and its time, and the page's period choice.
  # Without points the figure's line keeps its space, unseen, so nothing below moves.
  defp head(assigns) do
    ~H"""
    <div class="rg-chart__head">
      <div class="rg-chart__reading">
        <p id={"#{@id}-label"} class="rg-chart__label">{@label}</p>
        <p class="rg-chart__readout" data-unused={is_nil(@latest)}>
          <Primitives.figure
            class="rg-chart__figure"
            value={(@latest && @latest.figure) || "—"}
            width={@width}
            data-chart-readout="figure"
          />
          <span class="rg-chart__time" data-chart-readout="time">{@latest && @latest.time}</span>
        </p>
        <ul :if={@legend != []} class="rg-chart__legend" role="list">
          <li :for={{name, index} <- Enum.with_index(@legend)} data-series={index}>{name}</li>
        </ul>
      </div>
      <div :if={@period != []} class="rg-chart__period">{render_slot(@period)}</div>
    </div>
    """
  end

  defp waiting_state(:unavailable), do: :error
  defp waiting_state(state), do: state

  defp validate!(%{id: id, series: series, fill: fill}) do
    if not is_list(series) or length(series) not in 1..2 do
      raise ArgumentError, "chart #{id} takes one or two series, got #{inspect(series)}"
    end

    if fill and length(series) > 1 do
      raise ArgumentError, "chart #{id} fills under one series only"
    end

    Enum.map(series, fn
      %{name: name, points: points} when is_binary(name) and is_list(points) ->
        %{name: name, points: Enum.map(points, &point!/1)}

      other ->
        raise ArgumentError, "not a chart series: #{inspect(other)}"
    end)
  end

  defp point!(%{at: at, value: value, figure: figure, time: time} = point)
       when is_number(value) and is_binary(figure) and is_binary(time) do
    %{point | at: seconds(at)}
  end

  defp point!(point), do: raise(ArgumentError, "not a chart point: #{inspect(point)}")

  defp seconds(%DateTime{} = at), do: DateTime.to_unix(at)

  defp seconds(%NaiveDateTime{} = at),
    do: at |> DateTime.from_naive!("Etc/UTC") |> DateTime.to_unix()

  defp seconds(%Date{} = at), do: seconds(DateTime.new!(at, ~T[00:00:00]))

  # Everything the drawing needs, in the SVG's 0..100 box: y runs down, so the
  # highest rule sits at 0.
  defp plot([first | _] = series, points) do
    {x_min, x_max} = points |> Enum.map(& &1.at) |> Enum.min_max()
    ticks = ticks(points |> Enum.map(& &1.value) |> Enum.min_max())
    {lo, hi} = {List.first(ticks), List.last(ticks)}
    x = fn at -> if x_max == x_min, do: 100.0, else: (at - x_min) / (x_max - x_min) * 100 end
    y = fn value -> (hi - value) / (hi - lo) * 100 end
    place = fn p -> {round2(x.(p.at)), round2(y.(p.value))} end
    lines = Enum.map(series, &path(Enum.map(&1.points, place)))

    %{
      series: series,
      lines: lines,
      area: area(Enum.map(first.points, place)),
      ticks: for(t <- ticks, do: %{y: round2(y.(t)), label: format(t, step(ticks))}),
      rows: rows(series, place),
      latest: List.last(first.points),
      width: first.points |> Enum.map(&String.length(&1.figure)) |> Enum.max(fn -> nil end),
      legend: if(length(series) == 2, do: Enum.map(series, & &1.name), else: [])
    }
  end

  # One point alone draws a level line across the chart.
  defp path([{_x, y}]), do: "M0 #{y}H100"
  defp path([]), do: ""

  defp path([{x, y} | rest]),
    do: Enum.join(["M#{x} #{y}" | Enum.map(rest, fn {x, y} -> "L#{x} #{y}" end)])

  defp area([]), do: ""
  defp area([{_x, y}]), do: "M0 #{y}H100V100H0Z"
  defp area([{x0, _} | _] = placed), do: path(placed) <> "V100H#{x0}Z"

  # One row per time, oldest first; a series with no point at that time leaves its cell
  # empty. Each row carries where its first point sits, for the motion kit's rule.
  defp rows(series, place) do
    series
    |> Enum.with_index()
    |> Enum.flat_map(fn {s, index} -> Enum.map(s.points, &{&1, index}) end)
    |> Enum.group_by(fn {p, _} -> p.at end)
    |> Enum.sort_by(fn {at, _} -> at end)
    |> Enum.map(fn {_at, [{first, _} | _] = here} ->
      {x, y} = place.(first)
      by_series = Map.new(here, fn {p, index} -> {index, p.figure} end)

      %{
        x: x,
        y: y,
        time: first.time,
        figures: for(index <- 0..(length(series) - 1), do: Map.get(by_series, index))
      }
    end)
  end

  # At most four evenly stepped rules that cover every value, the lowest the baseline,
  # each step 1, 2, 2.5 or 5 times a power of ten.
  defp ticks({min, max}) when min == max do
    pad = if min == 0, do: 1, else: abs(min) / 10
    ticks({min - pad, max + pad})
  end

  defp ticks({min, max}), do: ticks(min, max, nice((max - min) / (@max_ticks - 1)))

  defp ticks(min, max, step) do
    lo = Float.floor(min / step) * step
    hi = Float.ceil(max / step) * step
    count = round((hi - lo) / step) + 1

    if count > @max_ticks,
      do: ticks(min, max, nice(step * 1.01)),
      else: for(i <- 0..(count - 1), do: lo + i * step)
  end

  defp nice(raw) do
    power = :math.pow(10, Float.floor(:math.log10(raw)))
    Enum.find([1, 2, 2.5, 5, 10], &(&1 * power >= raw)) * power
  end

  defp step([a, b | _]), do: b - a

  # Every label shows as many decimals as the step needs: 25 none, 2.5 one, 0.25 two.
  defp format(value, step) do
    decimals = Enum.find(0..6, 6, &whole?(step * :math.pow(10, &1)))

    case String.split(:erlang.float_to_binary(value / 1, decimals: decimals), ".") do
      [whole, part] -> group(whole) <> "." <> part
      [whole] -> group(whole)
    end
  end

  defp whole?(n), do: abs(n - round(n)) < 1.0e-6

  defp group("-" <> whole), do: "−" <> group(whole)

  defp group(whole) do
    whole
    |> String.reverse()
    |> String.graphemes()
    |> Enum.chunk_every(3)
    |> Enum.map_join(",", &Enum.join/1)
    |> String.reverse()
  end

  defp round2(n), do: Float.round(n / 1, 2)
end
