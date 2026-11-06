defmodule Regent.PointsTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  # A read that failed or has not finished must never look like an account with nothing.
  test "a total that could not be read is never shown as zero" do
    assigns = %{}

    failed = rendered_to_string(~H|<Regent.Points.total id="t" state={:error} />|)
    loading = rendered_to_string(~H|<Regent.Points.total id="t" state={:loading} />|)

    assert failed =~ ~s(role="alert")
    assert failed =~ "Could not load. Try refreshing."
    refute failed =~ "+0"
    assert loading =~ ~s(aria-busy="true")
    refute loading =~ "+0"
  end

  # The leaderboard has the same rule: a failed read shows no "No points yet".
  test "a leaderboard that could not be read is never shown as empty" do
    assigns = %{}
    failed = rendered_to_string(~H|<Regent.Points.board id="b" state={:error} />|)

    assert failed =~ ~s(role="alert")
    refute failed =~ "No points yet."
  end

  # A person sees their own place wherever they sit: marked in the list, or on a
  # row of its own under it.
  test "the reader's place shows in the list or under it, never twice" do
    assigns = %{
      rows: [
        %{rank: 1, name: "Nadia", wallet: nil, ens_name: nil, points: "512", you: false},
        %{rank: 2, name: "Ada", wallet: nil, ens_name: nil, points: "240", you: true}
      ]
    }

    listed = rendered_to_string(~H|<Regent.Points.board id="b" rows={@rows} />|)

    assert listed =~ ~s(data-you="true")
    refute listed =~ "rg-points-board__you"

    assigns = %{rows: Enum.map(assigns.rows, &%{&1 | you: false})}

    below =
      rendered_to_string(
        ~H|<Regent.Points.board id="b" rows={@rows} you={%{rank: 15, points: "10"}} />|
      )

    refute below =~ ~s(data-you="true")
    assert below =~ "rg-points-board__you"
  end

  # Every wallet is public: a person who chose no name shows as their full wallet,
  # copyable, never a short form printed as text.
  test "a person with no name shows their wallet with its copy icon" do
    wallet = "0x3e7a5c2b9d4f1a6e8b0c7d2e9f4a1b3c5d6ec99a"

    assigns = %{
      rows: [
        %{rank: 1, name: nil, wallet: wallet, ens_name: nil, points: "512", you: false},
        %{rank: 2, name: nil, wallet: wallet, ens_name: "pira.eth", points: "240", you: false}
      ]
    }

    html = rendered_to_string(~H|<Regent.Points.board id="b" rows={@rows} />|)

    assert html =~ ~s(id="b-wallet-1-copy")
    assert html =~ ~s(id="b-wallet-2-copy")
    assert html =~ "0x3e7a..c99a"
    assert html =~ "pira.eth"
  end

  # The action a person can still do comes before the ones done, and only it links
  # to where it is done.
  test "actions left come first and only they link out" do
    assigns = %{
      groups: [
        %{
          title: "Once",
          limit: nil,
          items: [
            %{id: "a", label: "Account activated", points: "+25", done: true, href: "/account"},
            %{
              id: "b",
              label: "X account linked",
              points: "+10",
              done: false,
              href: "/account/connections"
            }
          ]
        }
      ]
    }

    html = rendered_to_string(~H|<Regent.Points.todo id="t" left={1} groups={@groups} />|)

    {left, _} = :binary.match(html, "X account linked")
    {done, _} = :binary.match(html, "Account activated")
    assert left < done
    assert html =~ ~s(href="/account/connections")
    refute html =~ ~s(href="/account">)
  end
end
