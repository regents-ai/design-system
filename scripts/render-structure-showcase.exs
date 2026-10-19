# Run from regent_ui: mix run ../scripts/render-structure-showcase.exs
# Real Phoenix components, exported for browser review without a product database.
defmodule Regent.StructureShowcase do
  use Phoenix.Component
  import Regent.Structure
  import Regent.Primitives

  def page(assigns) do
    ~H"""
    <a class="showcase-skip" href="#main">Skip to content</a>
    <div class="showcase-toolbar">
      <span>Shared structure / local preview</span>
      <.field id="brand" label="Product">
        <select id="brand">
          <option value="platform">Regents</option>
          <option value="autolaunch">Autolaunch</option>
          <option value="patchbay">Patchbay</option>
          <option value="techtree">Techtree</option>
        </select>
      </.field>
      <.field id="theme" label="Theme">
        <select id="theme">
          <option>light</option>
          <option>dark</option>
          <option value="system">device setting</option>
        </select>
      </.field>
      <Regent.ThemeToggle.button id="showcase-theme-toggle" />
      <label><input id="stress" type="checkbox" /> Long labels</label>
    </div>
    <.frame>
      <.row>
        <main id="main" class="rg-inset showcase-stack">
          <.section_bar>
            <p class="rg-section-bar__label">A shared visual language</p>
          </.section_bar>
          <h1 class="rg-hero-title">One structure.<br />Room to build.</h1>
          <p>
            Clear boundaries. Deliberate space. A common interface for four products,
            without giving up what makes each one distinct.
          </p>
          <.button id="hero-action" data-scroll-to="capabilities">
            <span
              data-short="Explore the system"
              data-long="Explore the shared structural design system and its accessible component states"
            >
              Explore the system
            </span>
          </.button>
          <.disclosure id="principle-1" index="01" summary="Structure before decoration" open>
            <p>
              Shared edges carry the page. Fine rules separate meaningful regions; space stays inside them.
            </p>
          </.disclosure>
          <.disclosure id="principle-2" index="02" summary="One geometry, eight themes">
            <p>
              Surface and foreground always travel together. Product palettes stay independent of layout.
            </p>
          </.disclosure>
          <.disclosure id="principle-3" index="03" summary="Details remain available">
            <p>
              Native disclosure keeps supporting content in the document. Errors and action outcomes stay visible.
              Few words on screen
              <.tip id="principle-3-tip" label="About few words">
                Explanations wait in a tip like this one, a dropdown or their own dialog.
              </.tip>
            </p>
          </.disclosure>
          <.technical_figure class="showcase-hero-figure rg-support-figure">
            <svg
              viewBox="0 0 320 440"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              aria-hidden="true"
            >
              <path d="M160 24V416" stroke-dasharray="2 6" opacity=".4" />
              <path d="M160 46 224 100 160 148 96 100Z M160 46V148 M96 100H224" />
              <path d="M160 156 278 214 160 276 42 214Z" opacity=".4" />
              <circle cx="160" cy="214" r="58" /><ellipse cx="160" cy="214" rx="58" ry="23" />
              <path d="M160 292 235 332 160 372 85 332Z M85 332V350L160 390 235 350V332 M160 372V390" />
              <path d="M160 100H284 M160 214H284 M160 332H284" opacity=".6" />
              <circle
                :for={y <- [24, 100, 214, 332, 416]}
                cx="160"
                cy={y}
                r="3"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <:caption>Illustration / boundaries, surfaces, connections</:caption>
          </.technical_figure>
        </main>
      </.row>
      <.row>
        <section id="capabilities" class="rg-inset">
          <.section_bar class="rg-support-band">
            <h2 class="rg-section-bar__label">Capabilities</h2>
          </.section_bar>
          <div class="rg-feature-grid">
            <.capability_card
              :for={{title, caption, kind, index} <- features()}
              title={title}
              description={caption}
              index={index}
              tone={if index == "001", do: "accent", else: "surface"}
              data-short-title={title}
              data-long-title={title <> " across connected product experiences"}
            >
              <:media>
                <svg
                  viewBox="0 0 240 240"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                  aria-hidden="true"
                >
                  <path d="M12 24V12H24 M216 12H228V24 M228 216V228H216 M24 228H12V216" />
                  <circle
                    :for={r <- [80, 62, 44, 26]}
                    :if={kind == :circles}
                    cx="120"
                    cy={190 - r}
                    r={r}
                  />
                  <path
                    :for={y <- [36, 60, 84, 108, 132, 156]}
                    :if={kind == :triangle}
                    d={"M120 #{y}L40 194H200Z M120 #{y}V194"}
                  />
                  <circle
                    :for={{x, y} <- [{120, 87}, {84, 149}, {156, 149}]}
                    :if={kind == :overlap}
                    cx={x}
                    cy={y}
                    r="52"
                  />
                </svg>
              </:media>
              <:actions :if={index == "001"}>
                <a href="#details">Explore interface states</a>
              </:actions>
            </.capability_card>
          </div>
        </section>
      </.row>
      <.row>
        <section id="details" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Interface states / interactive examples</h2>
          </.section_bar>
          <div class="showcase-stack">
            <.panel id="overflow-panel" class="rg-support-panel">
              <div class="rg-panel__body showcase-stack">
                <h3>Space for the details.</h3>
                <p>These controls are local examples. They do not submit data or connect a wallet.</p>
                <.field
                  :let={field}
                  id="sample-name"
                  label="Display name"
                  errors={[
                    "Example error: choose a name that makes this workspace easy to identify. This message remains visible and wraps without clipping."
                  ]}
                >
                  <input
                    id={field.id}
                    aria-describedby={field.described_by}
                    aria-invalid={field.aria_invalid}
                    value=""
                  />
                </.field>
                <.field :let={field} id="sample-select" label="View density">
                  <select id={field.id}>
                    <option>Comfortable</option>
                    <option>Compact</option>
                  </select>
                </.field>
                <div class="showcase-actions">
                  <label class="rg-pill-select">
                    <select id="sample-pill-select" aria-label="Sort">
                      <option>Newest</option>
                      <option>Most raised</option>
                    </select>
                  </label>
                </div>
                <div class="showcase-actions">
                  <.button variant="secondary" id="open-dialog">Open dialog</.button>
                  <.button disabled aria-busy="true">Pending example</.button>
                </div>
                <details class="showcase-menu">
                  <summary id="menu-trigger">Open overflow options</summary>
                  <div class="showcase-menu__items">
                    <a href="#main">Back to the overview</a>
                    <button type="button" id="menu-close">Close options</button>
                  </div>
                </details>
              </div>
            </.panel>
            <div class="showcase-stack">
              <.notice tone="error">
                Example error — the requested action did not complete. No data was sent.
              </.notice>
              <div class="showcase-actions">
                <.status tone="success">Saved example</.status>
                <.status tone="warning">Review required</.status>
              </div>
              <.empty_state title="No items in this example">
                A real application supplies the state and its next action.
                <:action>
                  <.button variant="quiet" data-scroll-to="capabilities">
                    Return to capabilities
                  </.button>
                </:action>
              </.empty_state>
              <.disclosure id="expanded-errors" index="04" summary="Expanded validation details" open>
                <p>
                  Complete explanation remains readable at narrow widths and increased text sizes.
                </p>
                <code>example_identifier_with_a_deliberately_long_unbroken_value_for_reflow</code>
              </.disclosure>
            </div>
          </div>
        </section>
        <section id="account" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Account / every state</h2>
          </.section_bar>
          <div class="showcase-account">
            <Regent.Account.signed_out id="account-signed-out">
              <:sign_in><.button type="button">Sign in</.button></:sign_in>
            </Regent.Account.signed_out>
            <Regent.Account.signed_out id="account-expired" reason={:expired}>
              <:sign_in><.button type="button">Sign in</.button></:sign_in>
            </Regent.Account.signed_out>
            <Regent.Account.agents id="account-agents" agents={sample_agents()}>
              <:about>What a paired agent may do on this site.</:about>
              <:actions :let={agent}>
                <.button type="button" variant="quiet" aria-label={"Unpair #{agent.name}"}>
                  Unpair
                </.button>
              </:actions>
              <:footer><.button type="button" variant="secondary">Pair an agent</.button></:footer>
            </Regent.Account.agents>
            <Regent.Account.agents id="account-agents-none" agents={[]}>
              <:footer><a href="#account">Pair or unpair agents on regents.sh</a></:footer>
            </Regent.Account.agents>
            <Regent.Account.agents id="account-pair-list" agents={[]}>
              <:footer>
                <Regent.Account.pairing
                  id="account-pairing"
                  harnesses={sample_harnesses()}
                  messages={sample_messages("XXXXXXXXXXXXXXXXXXXXXXXX")}
                />
              </:footer>
            </Regent.Account.agents>
            <Regent.Account.agents id="account-pair-list-issued" agents={[]}>
              <:footer>
                <Regent.Account.pairing
                  id="account-pairing-issued"
                  harnesses={sample_harnesses()}
                  chosen="codex"
                  messages={sample_messages("K7Q2-M9XR-4TWD-P8LC")}
                  message={hd(sample_messages("K7Q2-M9XR-4TWD-P8LC"))}
                  expires_iso="2026-10-12T14:05:00Z"
                  expires="14:05 UTC"
                />
              </:footer>
            </Regent.Account.agents>
            <Regent.Account.agents id="account-pair-list-paired" agents={[]}>
              <:footer>
                <Regent.Account.pairing
                  id="account-pairing-paired"
                  harnesses={sample_harnesses()}
                  chosen="codex"
                  messages={sample_messages("XXXXXXXXXXXXXXXXXXXXXXXX")}
                  outcome={{:paired, "Pira"}}
                />
              </:footer>
            </Regent.Account.agents>
            <div>
              <.button id="open-agent" type="button" variant="secondary">Open an agent</.button>
            </div>
            <Regent.Account.agent_detail
              id="account-agent"
              agent={sample_detail()}
              verified={true}
              same_person_count={3}
              same_person={[%{id: "a3", name: "Wren"}, %{id: "a4", name: "Ilex"}]}
              activity={sample_activity()}
              may={["Read and search your notes", "Pin a note for 1 Credit, within the spending you allow"]}
              spent="3.00 Credits"
              notice={{:status, "Pira is paired."}}
              open_event="open_agent"
            >
              <:actions><.button type="button" variant="secondary">Unpair</.button></:actions>
            </Regent.Account.agent_detail>
            <Regent.Account.agents id="account-agents-loading" agents={:loading} />
            <Regent.Account.agents id="account-agents-failed" agents={:unavailable} />
            <Regent.Account.credits_summary id="account-credits" available="12.50" held="2.00" />
            <Regent.Account.credits_summary id="account-credits-loading" state={:loading} />
            <Regent.Account.credits_summary id="account-credits-failed" state={:error} />
            <Regent.Account.points_summary
              id="account-points"
              confirmed="1,240"
              today="35"
              pending="2"
              allowances={[
                %{label: "Activity", value: "35 of 100"},
                %{label: "Credits", value: "0 of 100"}
              ]}
              state={:stale}
            />
          </div>
        </section>
      </.row>
    </.frame>
    <dialog id="sample-dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">A native dialog</h2>
      <p>Focus remains inside until this dialog closes.</p>
      <form method="dialog"><.button type="submit">Close dialog</.button></form>
    </dialog>
    """
  end

  # Most agents have no World ID, as on the live sites; one name is short, one long.
  defp sample_agents do
    for {id, name, kind, harness, backed, ago} <- [
          {"a1", "Pira", "muse", "Muse", true, "2 hours ago"},
          {"a2", "Night shift", "claude_code", "Claude Code", false, "5 hours ago"},
          {"a3", "An agent with a deliberately long name that has to stay on one line", "codex",
           "Codex", false, "2 days ago"},
          {"a4", "Wren", "hermes", "Hermes", false, "3 days ago"},
          {"a5", "Ilex", "other", "Something else", false, "9 days ago"}
        ] do
      %{
        id: id,
        name: name,
        kind: kind,
        harness: harness,
        backed: backed,
        last_contact_iso: "2026-10-11T08:00:00Z",
        last_contact: ago
      }
    end
  end

  defp sample_harnesses do
    for {value, label} <- [{"muse", "Muse"}, {"codex", "Codex"}, {"other", "Something else"}],
        do: %{value: value, label: label}
  end

  defp sample_messages(code) do
    [
      "Pair with my Regents account.\nPairing code: #{code}\n" <>
        "Follow the \"Pair with a person's account\" steps at https://regents.sh/llms.txt"
    ]
  end

  defp sample_detail do
    %{
      id: "a1",
      name: "Pira",
      kind: "muse",
      harness: "Muse",
      paired_at: "3 October 2026, 09:12 UTC",
      last_contact: "2 hours ago",
      last_contact_at: "11 October 2026, 08:00 UTC",
      wallet: "0x2222222222222222222222222222222222222222",
      wallet_label: "0x2222..2222",
      listing: %{url: "https://8004scan.io/agents/base/42", number: 42}
    }
  end

  defp sample_activity do
    [
      %{
        site: "Regents Labs",
        day_iso: "2026-10-11",
        day: "11 October 2026",
        hours: "08:00 to 09:14 UTC"
      },
      %{site: "Autolaunch", day_iso: "2026-10-10", day: "10 October 2026", hours: "17:42 UTC"}
    ]
  end

  defp features do
    [
      {"Clear boundaries",
       "Rules and shared edges give every region a deliberate place on the page.", :circles,
       "001"},
      {"Common structure",
       "One set of primitives, assembled to suit the product rather than impose a universal shell.",
       :triangle, "002"},
      {"Connected parts",
       "Independent products. Paired surfaces. A consistent language for actions and information.",
       :overlap, "003"}
    ]
  end
end

root = Path.expand("..", File.cwd!())
out = Path.join(root, ".showcase")
File.mkdir_p!(out)

body =
  Regent.StructureShowcase.page(%{}) |> Phoenix.HTML.Safe.to_iodata() |> IO.iodata_to_binary()

html = """
<!doctype html>
<html lang="en" data-brand="platform" data-theme="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Regent / ruled structural system</title>
<link rel="stylesheet" href="/css/design_system_tokens.css">
<link rel="stylesheet" href="/css/primitives.css">
<link rel="stylesheet" href="/showcase.css">
<script src="/showcase.js" defer></script></head>
<body>#{body}</body></html>
"""

File.write!(Path.join(out, "index.html"), html)
File.rm_rf!(Path.join(out, "css"))
File.cp_r!(Path.join(root, "regent_ui/assets/css"), Path.join(out, "css"))
File.mkdir_p!(Path.join(out, "fonts"))
File.cp_r!(Path.join(root, "regent_ui/priv/static/fonts"), Path.join(out, "fonts/regent-ui"))
File.rm_rf!(Path.join(out, "images"))
File.mkdir_p!(Path.join(out, "images"))
File.cp_r!(Path.join(root, "regent_ui/priv/static/images"), Path.join(out, "images/regent-ui"))

for name <- ~w(showcase.css showcase.js),
    do: File.cp!(Path.join(root, "scripts/" <> name), Path.join(out, name))

IO.puts("Rendered actual Regent components to #{out}/index.html")
