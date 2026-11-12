defmodule Regent.ChartsTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  @start ~U[2026-11-01 00:00:00Z]

  defp points(values, from \\ 0) do
    for {value, i} <- Enum.with_index(values, from) do
      %{at: DateTime.add(@start, i * 86_400), value: value, figure: "#{value}", time: "day #{i}"}
    end
  end

  defp chart(series, opts \\ []) do
    assigns = %{series: series, fill: Keyword.get(opts, :fill, false)}

    rendered_to_string(~H"""
    <Regent.Charts.line id="c" label="Price" series={@series} fill={@fill} />
    """)
  end

  # What a screen reader or agent reads: each row's time and its figures.
  defp table(html) do
    [body] = Regex.run(~r/<tbody>(.*)<\/tbody>/s, html, capture: :all_but_first)

    for [row] <- Regex.scan(~r/<tr[^>]*>(.*?)<\/tr>/s, body, capture: :all_but_first) do
      for [cell] <- Regex.scan(~r/<t[hd][^>]*>(.*?)<\/t[hd]>/s, row, capture: :all_but_first),
          do: String.trim(cell)
    end
  end

  defp rules(html) do
    for [y, label] <-
          Regex.scan(~r/--rg-chart-y: ([\d.]+)%">\s*([^<]+?)\s*</, html, capture: :all_but_first),
        do: {String.to_float(y), label}
  end

  defp line_ys(html) do
    [d] = Regex.run(~r/d="(M[^"]+)"\s+data-chart-line="0"/, html, capture: :all_but_first)

    for [y] <- Regex.scan(~r/[ML][\d.]+ ([\d.]+)/, d, capture: :all_but_first),
        do: String.to_float(y)
  end

  test "every point reaches the table, and two series share one row per time" do
    html =
      chart([
        %{name: "Staked", points: points([10, 20, 30])},
        %{name: "Earned", points: points([5], 2)}
      ])

    assert table(html) == [["day 0", "10", ""], ["day 1", "20", ""], ["day 2", "30", "5"]]
  end

  test "at most four rules cover every value, and the line stays between them" do
    for values <- [
          [1204.5, 1180.25, 1310.75],
          [0.031, 0.05],
          [-3, 7],
          [12_345_678, 23_456_789],
          [5],
          [0, 0]
        ] do
      html = chart([%{name: "Price", points: points(values)}])
      ys = Enum.map(rules(html), &elem(&1, 0))

      assert length(ys) in 2..4
      assert Enum.min(ys) == 0.0 and Enum.max(ys) == 100.0
      assert Enum.all?(line_ys(html), &(&1 >= 0 and &1 <= 100))
    end
  end

  test "the figure above reads the latest point" do
    html = chart([%{name: "Price", points: points([1, 2, 3])}])

    [figure] =
      Regex.run(~r/data-chart-readout="figure"[^>]*>([^<]+)</, html, capture: :all_but_first)

    assert figure == "3"
  end

  test "loading, unread and empty keep the plot's box, and only a read says it is empty" do
    assert chart(:loading) =~ ~s(class="rg-waiting rg-chart__plot" data-state="loading")
    assert chart(:unavailable) =~ ~s(data-state="error")
    assert chart([%{name: "Price", points: []}]) =~ "rg-chart__plot rg-chart__plot--none"
  end

  test "a fill goes under one series only, and a point must carry its words" do
    assert_raise ArgumentError, fn ->
      chart([%{name: "A", points: points([1])}, %{name: "B", points: points([2])}], fill: true)
    end

    assert_raise ArgumentError, fn -> chart([%{name: "A", points: [%{at: @start, value: 1}]}]) end
  end
end
