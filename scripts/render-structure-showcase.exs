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
        <section id="figures" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Figures</h2>
          </.section_bar>
          <div class="showcase-figures">
            <.panel id="figure-panel">
              <div class="rg-panel__body showcase-stack">
                <dl class="showcase-figure-list">
                  <div>
                    <dt>Balance</dt>
                    <dd><.figure id="figure-balance" value="9.99" width={5} /> USDC</dd>
                  </div>
                  <div>
                    <dt>Points</dt>
                    <dd><.figure id="figure-points" value="98" width={5} /> today</dd>
                  </div>
                </dl>
                <p id="figure-below">Below</p>
                <div class="showcase-actions">
                  <.button variant="secondary" id="figure-change" arrow={false}>Change</.button>
                </div>
              </div>
            </.panel>
            <table class="showcase-table">
              <thead>
                <tr><th scope="col">Day</th><th scope="col" class="rg-figure">Points</th></tr>
              </thead>
              <tbody>
                <tr><td>Monday</td><td class="rg-figure">1,204.50</td></tr>
                <tr><td>Tuesday</td><td class="rg-figure">87.00</td></tr>
                <tr><td>Wednesday</td><td class="rg-figure">11.10</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section id="corners" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Corners</h2>
          </.section_bar>
          <div class="showcase-figures">
            <.panel id="corner-nest-8" class="showcase-nest showcase-nest--8">
              <.panel id="corner-inner-8" class="showcase-nest__inner rg-support-figure">
                <p class="rg-panel__body">8px</p>
              </.panel>
            </.panel>
            <.panel id="corner-nest-16" class="showcase-nest showcase-nest--16">
              <.panel id="corner-inner-16" class="showcase-nest__inner rg-support-figure">
                <p class="rg-panel__body">16px</p>
              </.panel>
            </.panel>
            <div class="showcase-actions" id="corner-rings">
              <.button id="ring-primary">Continue</.button>
              <.button id="ring-secondary" variant="secondary">Back</.button>
              <label class="rg-pill-select">
                <select id="ring-pill" aria-label="Sort">
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </label>
            </div>
          </div>
        </section>
        <section id="waiting" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Waiting</h2>
          </.section_bar>
          <div class="showcase-figures">
            <.waiting :for={state <- [:loading, :slow, :error, :ready]} id={"waiting-#{state}"} state={state} class="showcase-wait">
              <p class="showcase-wait__figure"><.figure value="1,204.50" /> USDC</p>
              <:retry>
                <.button variant="secondary" id={"waiting-#{state}-retry"} arrow={false}>Retry</.button>
              </:retry>
            </.waiting>
            <.panel id="waiting-steps">
              <div class="rg-panel__body showcase-stack">
                <p class="showcase-wait__step">
                  <.tick id="waiting-tick" />
                  <.status_word id="waiting-word" words={["Waiting", "Done"]} current="Waiting" />
                </p>
                <p id="waiting-below">Below</p>
                <div class="showcase-actions">
                  <.button variant="secondary" id="waiting-change" arrow={false}>Change</.button>
                </div>
              </div>
            </.panel>
          </div>
        </section>
        <section id="choices" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Choices</h2>
          </.section_bar>
          <div class="showcase-stack">
            <.segmented
              id="choice-period"
              label="Period"
              name="period"
              value="1W"
              options={for p <- ~w(1D 1W 1M 1Y All), do: %{value: p, label: p}}
            />
            <.segmented
              id="choice-whose"
              label="Whose"
              name="whose"
              value="mine"
              options={[%{value: "mine", label: "Mine"}, %{value: "all", label: "All"}]}
            />
            <.tabs
              id="choice-tabs"
              label="Account"
              tabs={[
                %{label: "Profile", href: "#profile", current: true},
                %{label: "Points", href: "#points", current: false},
                %{label: "Agents", href: "#agents", current: false},
                %{label: "Activity", href: "#activity", current: false},
                %{label: "Settings", href: "#settings", current: false}
              ]}
            />
            <p id="choices-below">Below</p>
          </div>
        </section>
        <section id="crumbs" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Breadcrumb</h2>
          </.section_bar>
          <div class="showcase-stack">
            <.breadcrumb id="crumbs-long" crumbs={sample_crumbs()} />
            <.breadcrumb id="crumbs-short" crumbs={Enum.take(sample_crumbs(), -3)} />
            <div class="showcase-crumbs-narrow">
              <.breadcrumb id="crumbs-narrow" crumbs={sample_crumbs()} />
            </div>
            <div class="showcase-crumbs-narrowest">
              <.breadcrumb id="crumbs-narrowest" crumbs={sample_crumbs()} />
            </div>
          </div>
        </section>
        <section id="cards" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Cards</h2>
          </.section_bar>
          <div class="showcase-figures">
            <Regent.HolographicCard.card id="cards-foil">
              <p class="showcase-wait__figure">Foil</p>
              <p>Graphite, lit only under the pointer.</p>
            </Regent.HolographicCard.card>
            <.capability_card id="cards-foil-face" title="Foil face" description="A panel face in foil." index="004">
              <:foil><Regent.HolographicCard.foil id="cards-foil-face-foil" class="rg-holo-foil--face" /></:foil>
              <:media>
                <svg viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
                  <circle cx="120" cy="120" r="80" /><circle cx="120" cy="120" r="44" />
                </svg>
              </:media>
            </.capability_card>
            <.panel id="cards-tip-panel">
              <div class="rg-panel__body showcase-stack">
                <p>
                  Fee <.tip id="cards-tip" label="About the fee">Paid once, in USDC.</.tip>
                </p>
                <.panel id="cards-inner-panel" class="rg-support-panel">
                  <p class="rg-panel__body">Inner</p>
                </.panel>
              </div>
            </.panel>
            <Regent.Discussion.posts id="cards-posts">
              <Regent.Discussion.post
                :for={{id, author, solution, house} <- [{"cards-answer", "Ada", true, false}, {"cards-house", "Regents", false, true}]}
                id={id}
                author={author}
                at={~U[2026-11-10 09:00:00Z]}
                ago="1 day ago"
                href={"##{id}"}
                solution={solution}
                house={house}
              >
                <:avatar><Regent.Account.agent_mark kind="muse" /></:avatar>
                <p>{if solution, do: "The marked answer.", else: "A reply from the site."}</p>
              </Regent.Discussion.post>
            </Regent.Discussion.posts>
          </div>
        </section>
        <section id="activity" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Activity</h2>
          </.section_bar>
          <div class="showcase-figures">
            <Regent.Agents.activity id="activity-running" label="Pira" steps={sample_steps(:running)} now={sample_now()} />
            <Regent.Agents.activity id="activity-asks" label="Night shift" steps={sample_steps(:asks)} now={sample_now()}>
              <:action>
                <.button type="button" id="activity-approve" arrow={false}>Approve</.button>
              </:action>
            </Regent.Agents.activity>
            <Regent.Agents.activity id="activity-failed" label="Wren" steps={sample_steps(:failed)} now={sample_now()} />
            <Regent.Agents.activity id="activity-empty" label="Ilex" steps={[]} now={sample_now()} />
            <Regent.Agents.activity id="activity-loading" label="Pira" steps={:loading} now={sample_now()} />
            <Regent.Agents.activity id="activity-unavailable" label="Pira" steps={:unavailable} now={sample_now()}>
              <:retry><.button variant="secondary" id="activity-retry" arrow={false}>Retry</.button></:retry>
            </Regent.Agents.activity>
            <div class="showcase-stack">
              <Regent.Agents.activity
                :for={state <- [:running, :asks, :failed, :done]}
                id={"activity-line-#{state}"}
                steps={sample_steps(state)}
                now={sample_now()}
                variant="line"
              />
              <Regent.Agents.activity id="activity-line-none" steps={[]} now={sample_now()} variant="line" />
              <div class="showcase-actions">
                <.button variant="secondary" id="activity-change" arrow={false}>Change</.button>
              </div>
            </div>
          </div>
          <Regent.Agents.fleet id="activity-fleet" label="Fleet" agents={sample_fleet()} now={sample_now()} />
          <div class="showcase-figures">
            <Regent.Agents.fleet id="activity-fleet-empty" label="Fleet" agents={[]} now={sample_now()} />
            <Regent.Agents.fleet id="activity-fleet-loading" label="Fleet" agents={:loading} now={sample_now()} />
          </div>
        </section>
        <section id="charts" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Charts</h2>
          </.section_bar>
          <div class="showcase-figures">
            <Regent.Charts.line id="chart-price" label="Price (USDC)" series={[sample_series("Price", 0)]} fill>
              <:period>
                <.segmented
                  id="chart-period"
                  label="Period"
                  name="chart-period"
                  value="1M"
                  options={for p <- ~w(1D 1W 1M), do: %{value: p, label: p}}
                />
              </:period>
            </Regent.Charts.line>
            <Regent.Charts.line
              id="chart-stake"
              label="Stake (REGENT)"
              series={[sample_series("Staked", 1), sample_series("Earned", 2)]}
            />
            <Regent.Charts.line id="chart-empty" label="Earnings (USDC)" series={[%{name: "Earnings", points: []}]} />
            <Regent.Charts.line id="chart-loading" label="Price (USDC)" series={:loading} />
            <Regent.Charts.line id="chart-unavailable" label="Price (USDC)" series={:unavailable}>
              <:retry><.button variant="secondary" id="chart-retry" arrow={false}>Retry</.button></:retry>
            </Regent.Charts.line>
          </div>
        </section>
        <section id="cells" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Cells</h2>
          </.section_bar>
          <div class="showcase-stack">
            <.panel id="cells-points-panel">
              <div class="rg-panel__body">
                <Regent.Cells.meter
                  id="cells-points"
                  label="Points today by source"
                  used="64"
                  capacity="100 Points"
                  max={100}
                  parts={sample_cells_points()}
                >
                  <:status>36 left today</:status>
                  <:footer>
                    <p>Resets at 00:00 UTC</p>
                    <.button variant="secondary" id="cells-points-history" arrow={false}>History</.button>
                  </:footer>
                </Regent.Cells.meter>
              </div>
            </.panel>
            <div class="showcase-figures">
              <.panel id="cells-counting-panel">
                <div class="rg-panel__body">
                  <Regent.Cells.meter
                    id="cells-counting"
                    label="Points today by source"
                    used="50"
                    capacity="100 Points"
                    max={100}
                    parts={sample_cells_points() |> Enum.take(3)}
                    busy
                  >
                    <:status>Counting</:status>
                  </Regent.Cells.meter>
                </div>
              </.panel>
              <.panel id="cells-supply-panel">
                <div class="rg-panel__body">
                  <Regent.Cells.meter
                    id="cells-supply"
                    label="REGENT supply by holder"
                    used="612.4M"
                    capacity="1B REGENT"
                    max={1_000_000_000}
                    parts={sample_cells_supply()}
                  >
                    <:status>387.6M left to mint</:status>
                  </Regent.Cells.meter>
                </div>
              </.panel>
              <.panel id="cells-seats-panel">
                <div class="rg-panel__body">
                  <Regent.Cells.meter
                    id="cells-seats"
                    label="Fleet seats by role"
                    used="14"
                    capacity="16 seats"
                    max={16}
                    parts={sample_cells_seats()}
                  >
                    <:status>2 open</:status>
                  </Regent.Cells.meter>
                </div>
              </.panel>
              <.panel id="cells-vault-panel">
                <div class="rg-panel__body">
                  <Regent.Cells.meter
                    id="cells-vault"
                    label="Vault deposits"
                    used="7,250"
                    capacity="10,000 USDC"
                    max={10_000}
                    parts={[%{key: "deposited", name: "Deposited", value: 7250, amount: "7,250 USDC", icon: "wallet"}]}
                  >
                    <:status>2,750 USDC left</:status>
                  </Regent.Cells.meter>
                </div>
              </.panel>
            </div>
            <div class="showcase-cells-narrow">
              <.panel id="cells-narrow-panel">
                <div class="rg-panel__body">
                  <Regent.Cells.meter
                    id="cells-narrow"
                    label="Points today by source"
                    used="64"
                    capacity="100 Points"
                    max={100}
                    parts={sample_cells_points()}
                  >
                    <:status>36 left today</:status>
                  </Regent.Cells.meter>
                </div>
              </.panel>
            </div>
          </div>
        </section>
        <section id="account" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Account / every state</h2>
          </.section_bar>
          <div class="showcase-account">
            <Regent.Account.identity
              id="account-identity-ens"
              name="seanwbren.eth"
              wallet={"0x" <> String.duplicate("a", 40)}
              ens_name="seanwbren.eth"
            />
            <Regent.Account.identity
              id="account-identity-chosen"
              name="Ada Lovelace"
              wallet={"0x" <> String.duplicate("a", 40)}
              ens_name="seanwbren.eth"
            />
            <Regent.Account.identity
              id="account-identity-unnamed"
              name="0xaaaa..aaaa"
              wallet={"0x" <> String.duplicate("a", 40)}
            />
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
                />
              </:footer>
            </Regent.Account.agents>
            <Regent.Account.agents id="account-pair-list-issued" agents={[]}>
              <:footer>
                <Regent.Account.pairing
                  id="account-pairing-issued"
                  harnesses={sample_harnesses()}
                  chosen="codex"
                  message={sample_message("K7Q2-M9XR-4TWD-P8LC")}
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
              may={["Read and search your notes", "Pin a note"]}
              notice={{:status, "Pira is paired."}}
              open_event="open_agent"
              rename_event="rename_agent"
            >
              <:actions><.button type="button" variant="secondary">Unpair</.button></:actions>
            </Regent.Account.agent_detail>
            <Regent.Account.agents id="account-agents-loading" agents={:loading} />
            <Regent.Account.agents id="account-agents-failed" agents={:unavailable} />
          </div>
        </section>
        <section id="points" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Points / the page</h2>
          </.section_bar>
          <Regent.Points.layout>
            <:total>
              <Regent.Points.total id="points-total" total="240" today="22" yesterday="20" rank="4" pending={1}>
                A record of everything you and your agents do across Regents.
              </Regent.Points.total>
            </:total>
            <:main>
              <Regent.Points.todo id="points-todo" left={2} groups={sample_points_todo()} />
              <Regent.Points.activity id="points-activity" rows={sample_points_activity()} more />
            </:main>
            <:side>
              <Regent.Points.board id="points-board" rows={sample_points_board()} />
              <Regent.Points.board
                id="points-board-below"
                rows={Enum.map(sample_points_board(), &%{&1 | you: false})}
                you={%{rank: 15, points: "10"}}
              />
              <Regent.Points.board id="points-board-failed" state={:error} />
              <Regent.Points.bonus
                id="points-bonus"
                nfts={4}
                percent={45}
                tiers={[
                  %{range: "1–2", percent: 20, held: false},
                  %{range: "3–6", percent: 45, held: true},
                  %{range: "7+", percent: 75, held: false}
                ]}
                periods={[%{label: "Period 1", value: "240 earned, ends 1 Dec"}]}
              />
            </:side>
          </Regent.Points.layout>
        </section>
        <section id="confirm" class="rg-inset">
          <.section_bar>
            <h2 class="rg-section-bar__label">Confirm</h2>
          </.section_bar>
          <div class="showcase-actions">
            <.button
              id="confirm-delete"
              variant="secondary"
              arrow={false}
              data-confirm="Delete this note?"
              data-confirm-action="Delete"
            >
              Delete
            </.button>
            <form id="confirm-form">
              <.button type="submit" data-confirm="Unpair this agent?" data-confirm-action="Unpair">
                Unpair
              </.button>
            </form>
            <a id="confirm-link" href="#confirm-left" data-confirm="Leave this page?" data-confirm-action="Leave">
              Leave
            </a>
            <output id="confirm-presses" class="rg-figure">0</output>
          </div>
        </section>
      </.row>
    </.frame>
    <Regent.Structure.confirm />
    <dialog id="sample-dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">A native dialog</h2>
      <p>Focus remains inside until this dialog closes.</p>
      <form method="dialog"><.button type="submit">Close dialog</.button></form>
    </dialog>
    """
  end

  defp sample_points_todo do
    [
      %{
        title: "Once",
        limit: nil,
        items: [
          %{id: "social.farcaster", label: "Farcaster account linked", points: "+10", done: false, href: "#"},
          %{id: "account.activated", label: "Account activated", points: "+25", done: true}
        ]
      },
      %{
        title: "Daily",
        limit: %{label: "Limit", used: 35, of: 100, value: "35 of 100 today"},
        items: [
          %{
            id: "patchbay.offer_bid_placed",
            label: "Patchbay Offer placed",
            points: "+5",
            done: false,
            note: "3 of 10 today",
            count: %{done: 3, of: 10}
          }
        ]
      }
    ]
  end

  # One name is long; one person chose no name and shows their wallet, one their ENS name.
  defp sample_points_board do
    for {rank, name, wallet, ens_name, points, you} <- [
          {1, "Nadia Reyes", nil, nil, "512", false},
          {2, "Maximilian Featherstonehaugh-Abernathy the Third", nil, nil, "455", false},
          {3, nil, "0x3e7a5c2b9d4f1a6e8b0c7d2e9f4a1b3c5d6ec99a", nil, "390", false},
          {3, nil, "0x9b1d4e7a2c5f8b0d3e6a9c2f5b8e1d4a7c0f3b6e", "pira.eth", "390", false},
          {5, "Ada Quill", nil, nil, "240", true}
        ],
        do: %{rank: rank, name: name, wallet: wallet, ens_name: ens_name, points: points, you: you}
  end

  defp sample_points_activity do
    [
      %{id: "1", label: "First note written by your agent", by: "Pira", at: "6 Nov, 10:40 UTC", points: "+10"},
      %{id: "2", label: "Patchbay Offer placed", by: "You", at: "4 Nov, 18:45 UTC", points: "+0", status: "Limit reached"}
    ]
  end

  # Today's Points against the daily limit, by where they were earned.
  defp sample_cells_points do
    [
      %{key: "patchbay", name: "Patchbay offers", value: 20, amount: "20", icon: "arrow-left-right",
        note: "4 offers placed"},
      %{key: "techtree", name: "Techtree notes", value: 18, amount: "18", icon: "pen-line",
        note: "Your agent wrote 3 notes"},
      %{key: "replies", name: "Replies", value: 12, amount: "12", icon: "message-square"},
      %{key: "referrals", name: "Referrals", value: 10, amount: "10", icon: "users",
        note: "2 people joined with your link"},
      %{key: "checkin", name: "Check-in", value: 4, amount: "4", icon: "calendar-check"}
    ]
  end

  # A long name, and a holder with nothing yet.
  defp sample_cells_supply do
    for {key, name, value, amount, note} <- [
          {"stakers", "Stakers", 214_800_000, "214.8M", "Locked for 30 days or more"},
          {"treasury", "Treasury", 150_000_000, "150M", nil},
          {"pools", "Liquidity pools on Base and Ethereum mainnet", 96_200_000, "96.2M", nil},
          {"team", "Team", 80_000_000, "80M", "Unlocks monthly from June 2027"},
          {"airdrop", "Airdrop", 0, "0", nil},
          {"agents", "Agents", 71_400_000, "71.4M", nil}
        ],
        do: %{key: key, name: name, value: value, amount: amount, note: note}
  end

  defp sample_cells_seats do
    for {name, seats} <- [
          {"Research", 3},
          {"Trading", 2},
          {"Writing", 2},
          {"Operations", 2},
          {"Support", 1},
          {"Design", 1},
          {"Review", 1},
          {"Data", 1},
          {"Legal", 1}
        ],
        do: %{key: String.downcase(name), name: name, value: seats, amount: "#{seats}"}
  end

  defp sample_now, do: ~U[2026-11-12 10:00:00Z]

  # Thirty days to sample_now/0, one point a day; each curve is a fixed made-up shape.
  defp sample_series(name, shape) do
    points =
      for day <- 0..29 do
        value =
          case shape do
            0 -> 1180 + 60 * :math.sin(day / 4) + day * 3.2
            1 -> 42_000 + day * 310 + 900 * :math.cos(day / 5)
            2 -> 38_000.0 + day * 180
          end

        at = DateTime.add(sample_now(), (day - 29) * 86_400)
        %{at: at, value: value, figure: sample_figure(value), time: Calendar.strftime(at, "%-d %b")}
      end

    %{name: name, points: points}
  end

  defp sample_figure(value) do
    [whole, cents] = value |> :erlang.float_to_binary(decimals: 2) |> String.split(".")
    grouped = whole |> String.reverse() |> String.replace(~r/(\d{3})(?=\d)/, "\\1,") |> String.reverse()
    grouped <> "." <> cents
  end

  # Steps oldest first, at seconds before sample_now/0; nil means not yet.
  defp sample_steps(last) do
    done = [
      {:read, "Offers board", 900, 860},
      {:think, "Pricing", 860, 700},
      {:tool, "Search notes", 700, 640},
      {:read, "Stake form", 640, 600},
      {:write, "Offer draft", 600, 400},
      {:think, "Next offer", 400, 60}
    ]

    tail =
      case last do
        :running -> [{:tool, "Search notes", 12, nil}, {:write, "Reply", nil, nil}]
        :asks -> [{:waiting_for_you, "Approve offer", 45, nil}]
        :failed -> [{:failed, "Offer draft", 30, 28}]
        :done -> [{:done, "Offer placed", 20, 20}]
      end

    for {{kind, label, started, finished}, i} <- Enum.with_index(done ++ tail) do
      %{
        id: "#{last}-#{i}",
        kind: kind,
        label: label,
        started_at: started && DateTime.add(sample_now(), -started),
        finished_at: finished && DateTime.add(sample_now(), -finished)
      }
    end
  end

  defp sample_fleet do
    for {id, name, kind, last} <- [
          {"a1", "Pira", "muse", :running},
          {"a2", "Night shift", "claude_code", :asks},
          {"a3", "An agent with a deliberately long name", "codex", :done},
          {"a4", "Wren", "hermes", :failed},
          {"a5", "Ilex", "other", nil}
        ] do
      steps = if last, do: sample_steps(last), else: []
      %{id: id, name: name, kind: kind, href: "#activity", steps: steps}
    end
  end

  # Most agents have no World ID, as on the live sites; one name is short, one long.
  defp sample_agents do
    for {id, name, kind, harness, backed, ago, wallet, light} <- [
          {"a1", "Pira", "muse", "Muse", true, "2 hours ago", "0x2222222222222222222222222222222222222222",
           {"on", "Checked in on time"}},
          {"a2", "Night shift", "claude_code", "Claude Code", false, "5 hours ago",
           "0x3333333333333333333333333333333333333333", {"late", "Checking in late"}},
          {"a3", "An agent with a deliberately long name that has to stay on one line", "codex",
           "Codex", true, "2 days ago", "0x4444444444444444444444444444444444444444",
           {"off", "Stopped checking in"}},
          {"a4", "Wren", "hermes", "Hermes", false, "3 days ago", nil, {nil, nil}},
          {"a5", "Ilex", "other", "Something else", false, "9 days ago",
           "0x5555555555555555555555555555555555555555", {nil, nil}}
        ] do
      %{
        id: id,
        name: name,
        kind: kind,
        harness: harness,
        wallet: wallet,
        backed: backed,
        last_contact_iso: "2026-10-11T08:00:00Z",
        last_contact: ago,
        light: elem(light, 0),
        light_label: elem(light, 1)
      }
    end
  end

  defp sample_harnesses do
    for {value, label} <- [{"muse", "Muse"}, {"codex", "Codex"}, {"other", "Something else"}],
        do: %{value: value, label: label}
  end

  defp sample_message(code) do
    "Pair with my Regents Labs account on regents.sh\nPairing code: #{code}\n" <>
      "Follow the \"Pair with a person's account\" steps at https://regents.sh/llms.txt"
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

  defp sample_crumbs do
    [
      %{label: "Home", icon: "house", href: "#crumbs"},
      %{
        label: "Studio",
        icon: "folder",
        href: "#crumbs",
        siblings: [%{label: "Archive", href: "#crumbs"}, %{label: "Shared", href: "#crumbs"}]
      },
      %{label: "Clients", icon: "folder", href: "#crumbs"},
      %{
        label: "Brand kit",
        icon: "folder",
        href: "#crumbs",
        siblings: [%{label: "Templates", href: "#crumbs"}, %{label: "Clients", href: "#crumbs"}]
      },
      %{label: "regents-crown-gradient.png", icon: "image", card: ["PNG", "2400×3000", "4.2 MB", "Edited 2 hours ago"]}
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
<script src="/showcase.js" defer></script>
<script src="/js/segmented.mjs" type="module"></script>
<script src="/js/tip.mjs" type="module"></script>
<script src="/js/confirm.mjs" type="module"></script></head>
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

File.rm_rf!(Path.join(out, "js"))
File.mkdir_p!(Path.join(out, "js"))
for name <- ~w(segmented.mjs tip.mjs confirm.mjs),
    do: File.cp!(Path.join(root, "regent_ui/assets/js/" <> name), Path.join(out, "js/" <> name))

for name <- ~w(showcase.css showcase.js),
    do: File.cp!(Path.join(root, "scripts/" <> name), Path.join(out, name))

IO.puts("Rendered actual Regent components to #{out}/index.html")
