defmodule Regent.CellsTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  defp part(key, value, extra \\ %{}),
    do:
      Map.merge(
        %{key: key, name: String.capitalize(key), value: value, amount: "#{value}"},
        extra
      )

  defp meter(parts, opts \\ []) do
    assigns = %{
      parts: parts,
      max: Keyword.get(opts, :max, 100),
      busy: Keyword.get(opts, :busy, false)
    }

    rendered_to_string(~H"""
    <Regent.Cells.meter
      id="m"
      label="Points by source"
      used="64"
      capacity="100 Points"
      max={@max}
      parts={@parts}
      busy={@busy}
    />
    """)
  end

  # Each part's place along the bar, in millionths of the capacity.
  defp runs(html) do
    for [key, start, share] <-
          Regex.scan(
            ~r/data-cells-key="([^"]+)" style="--rg-cells-start: ([\d.]+); --rg-cells-share: ([\d.]+)"/,
            html,
            capture: :all_but_first
          ),
        do: {key, millionths(start), millionths(share)}
  end

  defp millionths(fraction), do: fraction |> String.replace(".", "") |> String.to_integer()

  # What a screen reader reads in each part: the words outside anything aria-hidden.
  defp read(html) do
    for [li] <- Regex.scan(~r/<li\b[^>]*>(.*?)<\/li>/s, html, capture: :all_but_first) do
      ~r/<[^>]+>|[^<]+/
      |> Regex.scan(li)
      |> Enum.reduce({[], []}, fn [token], {open, words} ->
        hidden = match?([true | _], open)

        cond do
          String.starts_with?(token, "</") ->
            {tl(open), words}

          String.ends_with?(token, "/>") ->
            {open, words}

          String.starts_with?(token, "<") ->
            {[hidden or token =~ ~s(aria-hidden="true") | open], words}

          hidden ->
            {open, words}

          true ->
            {open, [token | words]}
        end
      end)
      |> elem(1)
      |> Enum.reverse()
      |> Enum.join()
      |> String.split()
      |> Enum.join(" ")
    end
  end

  test "each part starts where the one before ends, as wide as its share of the capacity" do
    html = meter([part("a", 20), part("b", 18.5), part("c", 12)])

    assert runs(html) == [{"a", 0, 200_000}, {"b", 200_000, 185_000}, {"c", 385_000, 120_000}]
  end

  test "parts that fill the capacity add up to the whole bar exactly, and never past it" do
    for {values, max} <- [
          {[0.1, 0.2], 0.3},
          {[1, 1, 1], 3},
          {[214.8, 150, 96.2, 80, 0, 71.4], 612.4}
        ] do
      shares =
        values
        |> Enum.with_index()
        |> Enum.map(fn {value, i} -> part("p#{i}", value) end)
        |> meter(max: max)
        |> runs()
        |> Enum.map(fn {_key, _start, share} -> share end)

      assert Enum.sum(shares) == 1_000_000
    end
  end

  test "parts that add up to more than the capacity are refused" do
    assert_raise ArgumentError, ~r/more than the capacity/, fn ->
      meter([part("a", 60), part("b", 41)])
    end
  end

  test "a zero part has no run, and the next part starts where it would have" do
    html = meter([part("a", 30), part("none", 0), part("b", 10)])

    assert runs(html) == [{"a", 0, 300_000}, {"none", 300_000, 0}, {"b", 300_000, 100_000}]
  end

  test "a screen reader reads each part's name and amount, then its note" do
    html =
      meter([
        part("stakers", 40, %{amount: "40M", note: "Locked for 30 days"}),
        part("team", 20, %{amount: "20M", icon: "users"})
      ])

    assert read(html) == ["Stakers, 40M. Locked for 30 days", "Team, 20M"]
  end

  test "only a part with a note is a stop for the keyboard" do
    html = meter([part("a", 10, %{note: "Ten"}), part("b", 10)])

    assert [_a, _b] = Regex.scan(~r/<li\b[^>]*>/, html)
    assert [[stop]] = Regex.scan(~r/<li\b[^>]*tabindex="0"[^>]*>/, html)
    assert stop =~ ~s(data-cells-key="a")
  end

  test "the meter is busy while counting and idle otherwise" do
    counting = meter([part("a", 10)], busy: true)
    idle = meter([part("a", 10)])

    assert counting =~ ~s(aria-busy="true")
    assert counting =~ ~s(data-cells-state="counting")
    refute idle =~ "aria-busy"
    assert idle =~ ~s(data-cells-state="idle")
  end
end
