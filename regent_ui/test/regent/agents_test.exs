defmodule Regent.AgentsTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  doctest Regent.Agents, only: [short_duration: 1]

  @now ~U[2026-11-12 10:00:00Z]

  defp step(id, kind, started, finished) do
    %{
      id: id,
      kind: kind,
      label: "Offers board",
      started_at: started && DateTime.add(@now, -started),
      finished_at: finished && DateTime.add(@now, -finished)
    }
  end

  defp states(html) do
    Regex.scan(~r/<li class="rg-activity__step" data-step="[^"]+" data-state="([a-z]+)"/, html)
    |> Enum.map(fn [_, state] -> state end)
  end

  defp full(steps) do
    assigns = %{steps: steps, now: @now}

    rendered_to_string(~H"""
    <Regent.Agents.activity id="a" label="Pira" steps={@steps} now={@now} />
    """)
  end

  defp line(steps) do
    assigns = %{steps: steps, now: @now}

    rendered_to_string(~H"""
    <Regent.Agents.activity id="a" steps={@steps} now={@now} variant="line" />
    """)
  end

  test "each step's state follows its own fields, and only a running step moves" do
    html =
      full([
        step("1", :read, 90, 60),
        step("2", :tool, 12, nil),
        step("3", :write, nil, nil)
      ])

    assert states(html) == ~w(done running queued)
    assert length(Regex.scan(~r/rg-activity__trace/, html)) == 1
    assert length(Regex.scan(~r/data-done/, html)) == 1
    assert html =~ ~s(datetime="PT30S")
    assert html =~ ~s(datetime="PT12S")

    finished = full([step("1", :read, 90, 60), step("2", :tool, 12, 2)])
    assert states(finished) == ~w(done done)
    refute finished =~ "rg-activity__trace"
  end

  test "a step waiting for the person carries the page's button; a failed step stops" do
    assigns = %{steps: [step("1", :waiting_for_you, 45, nil), step("2", :failed, 30, 28)]}

    html =
      rendered_to_string(~H"""
      <Regent.Agents.activity id="a" label="Pira" steps={@steps} now={~U[2026-11-12 10:00:00Z]}>
        <:action :let={step}><button id={"approve-#{step.id}"}>Approve</button></:action>
      </Regent.Agents.activity>
      """)

    assert states(html) == ~w(asks failed)
    assert html =~ ~s(id="approve-1")
    refute html =~ ~s(id="approve-2")
  end

  test "the latest six steps show and older ones fold under one disclosure" do
    steps = for i <- 1..9, do: step("#{i}", :read, 100 - i, 99 - i)
    html = full(steps)
    [earlier, latest] = String.split(html, "data-activity")

    assert length(states(earlier)) == 3
    assert length(states(latest)) == 6
    assert earlier =~ "<details"
    refute full(Enum.take(steps, 6)) =~ "<details"
  end

  test "the line shows the latest step that has started, not one still waiting to start" do
    html =
      line([step("1", :read, 90, 60), step("2", :tool, 12, nil), step("3", :write, nil, nil)])

    assert html =~ ~s(data-state="running")
    refute html =~ ~s(data-state="queued")
    assert line([step("1", :write, nil, nil)]) =~ ~s(data-state="queued")
  end

  test "loading and failed reads hold a box at size; nothing is guessed" do
    assert full(:loading) =~ ~s(aria-busy="true")
    assert full(:unavailable) =~ ~s(role="alert")
    refute full([]) =~ "rg-activity__step"
  end

  test "a step of an unknown kind is refused" do
    assert_raise ArgumentError, fn -> full([%{step("1", :read, 9, 1) | kind: :sleep}]) end
  end

  test "a fleet tile with a page is a link named by its agent" do
    assigns = %{
      agents: [
        %{
          id: "a1",
          name: "Pira",
          kind: "muse",
          href: "/agents/a1",
          steps: [step("1", :tool, 5, nil)]
        },
        %{id: "a2", name: "Wren", kind: "codex", href: nil, steps: []}
      ]
    }

    html =
      rendered_to_string(~H"""
      <Regent.Agents.fleet id="f" label="Fleet" agents={@agents} now={~U[2026-11-12 10:00:00Z]} />
      """)

    assert html =~ ~r{<a class="rg-fleet__face" href="/agents/a1">\s*<span[^>]*rg-fleet__mark}
    assert length(Regex.scan(~r/<a /, html)) == 1
    assert html =~ ~s(data-state="running")
  end
end
