defmodule Regent.StructureTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  test "sheet composition keeps navigation, supplied heading level and figure descriptions accessible" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Structure.frame>
        <Regent.Structure.row>
          <:rail_content>
            <nav aria-label="Sections"><a href="#capabilities">Capabilities</a></nav>
          </:rail_content>
          <Regent.Structure.section_bar>
            <h2 id="capabilities" class="rg-section-bar__label">Capabilities</h2>
          </Regent.Structure.section_bar>
          <Regent.Structure.technical_figure>
            <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" /></svg>
            <:caption>One ring defines the shared boundary.</:caption>
          </Regent.Structure.technical_figure>
        </Regent.Structure.row>
      </Regent.Structure.frame>
      """)

    assert html =~ ~s(<nav aria-label="Sections">)
    assert html =~ ~s(<h2 id="capabilities")
    assert html =~ "One ring defines the shared boundary."
    assert html =~ ~s(class="rg-section-bar__leader" aria-hidden="true")
    refute html =~ "role=\"navigation\" hidden"
  end

  test "capability cards render semantic face and caption bands without an implicit action" do
    Code.ensure_loaded!(Regent.Structure)
    assert function_exported?(Regent.Structure, :capability_card, 1)

    html =
      render_component(Function.capture(Regent.Structure, :capability_card, 1),
        title: "Clear <boundaries>",
        description: "A deliberate & readable region.",
        id: "capability",
        class: "custom-card",
        "data-purpose": "example",
        style: "--rg-shimmer-color: rebeccapurple"
      )

    assert html =~ ~s(<article class="rg-feature custom-card")
    assert html =~ ~s(id="capability")
    assert html =~ ~s(data-purpose="example")
    assert html =~ ~s(style="--rg-shimmer-color: rebeccapurple")
    assert html =~ ~r/rg-panel--surface[^>]*rg-feature__face/
    assert html =~ "<h3>Clear &lt;boundaries&gt;</h3>"
    assert html =~ ~r/<figure[^>]*rg-technical-figure/
    assert html =~ ~r/rg-feature__caption[^>]*>\s*<p>A deliberate &amp; readable region\.<\/p>/
    refute html =~ "rg-panel__index"
    refute html =~ "rg-feature__actions"
    refute html =~ "<img"
    refute html =~ "onclick"
    refute html =~ "tabindex"
    refute html =~ "<button"
  end

  test "capability cards accept custom media and caller-owned actions on paired accent panels" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Structure.capability_card
        title="Connected parts"
        description="Independent products."
        index="003"
        tone="accent"
      >
        <:media>
          <svg viewBox="0 0 240 240" aria-label="Three connected rings">
            <circle cx="120" cy="120" r="52" />
          </svg>
        </:media>
        <:actions><a href="#details">Read details</a></:actions>
      </Regent.Structure.capability_card>
      """)

    assert length(Regex.scan(~r/rg-panel--accent/, html)) == 2
    assert html =~ ~s(<span class="rg-panel__index">003</span>)

    assert html =~
             ~r/<figure[^>]*>[\s\S]*<svg[^>]*aria-label="Three connected rings"[\s\S]*<\/figure>/

    assert html =~
             ~r/rg-feature__caption[\s\S]*<p>Independent products\.<\/p>[\s\S]*rg-feature__actions[\s\S]*<a href="#details">Read details<\/a>/

    refute html =~ "onclick"
    refute html =~ "tabindex"
  end

  test "capability image source takes precedence over custom media and preserves alt semantics" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Structure.capability_card
        title="Image"
        description="A supplied image."
        image_src="/images/example.png"
        image_alt="Clear & connected"
      >
        <:media><svg aria-label="Unused fallback"></svg></:media>
      </Regent.Structure.capability_card>
      """)

    assert html =~ ~s(<img src="/images/example.png" alt="Clear &amp; connected")
    refute html =~ "Unused fallback"

    decorative =
      render_component(Function.capture(Regent.Structure, :capability_card, 1),
        title: "Decoration",
        description: "An illustration.",
        image_src: "/images/decorative.png"
      )

    assert decorative =~ ~s(<img src="/images/decorative.png" alt="")
  end

  test "ratio card derives both percentages and the named meter from the same basis points" do
    for {bps, allocated, remaining} <- [
          {0, "0", "100"},
          {5620, "56.2", "43.8"},
          {10000, "100", "0"},
          {1, "0.01", "99.99"},
          {5601, "56.01", "43.99"},
          {9999, "99.99", "0.01"}
        ] do
      html = ratio_card(value_bps: bps)

      assert html =~ ~s(id="ratio-title")
      assert html =~ ~s(id="ratio-label")
      assert html =~ ~s(id="ratio-remainder-label")
      assert html =~ ~s(class="rg-ratio-card__header-badge">#{allocated}%</span>)
      assert html =~ ~s(class="rg-ratio-card__value">#{allocated}%</span>)
      assert html =~ ~s(class="rg-ratio-card__value">#{remaining}%</span>)
      assert html =~ ~s(role="meter")
      assert html =~ ~s(aria-labelledby="ratio-title ratio-label")
      assert html =~ ~s(aria-valuemin="0")
      assert html =~ ~s(aria-valuemax="100")
      assert html =~ ~s(aria-valuenow="#{allocated}")
      assert html =~ ~s(aria-valuetext="Allocated: #{allocated}%; Remaining: #{remaining}%")
      assert html =~ ~s(style="inline-size: #{allocated}%")
      assert html =~ "Allocation"
      assert html =~ "Details"
      refute html =~ "No data"
      refute html =~ "rg-ratio-card__change"
      refute html =~ "rg-ratio-card__footer-badge"
      refute html =~ "tabindex"
      refute html =~ "slider"
      refute html =~ "<button"
      refute html =~ "onclick"
    end
  end

  test "ratio card unknown state does not fabricate a zero meter" do
    for attrs <- [[], [value_bps: nil]] do
      html = ratio_card(attrs)
      assert length(Regex.scan(~r/class="rg-ratio-card__value">—<\/span>/, html)) == 2
      assert html =~ ~s(class="rg-ratio-card__header-badge">No data</span>)
      assert html =~ "No data"
      refute html =~ ~s(role="meter")
      refute html =~ "aria-valuenow"
      refute html =~ "rg-ratio-card__fill"
      refute html =~ "rg-ratio-card__scale"
      refute html =~ "0%"
    end
  end

  test "ratio card rejects invalid basis points instead of clamping or coercing" do
    for value <- [-1, 10001, 56.2, "5620"] do
      assert_raise ArgumentError, ~r/value_bps must be nil or an integer in 0\.\.10000/, fn ->
        ratio_card(value_bps: value)
      end
    end
  end

  test "ratio card escapes caller strings and renders optional footer slots without invented controls" do
    assigns = %{label: "Committed <units>", change: "+2.1 pp / 7 days <estimate>"}

    html =
      rendered_to_string(~H"""
      <Regent.Structure.ratio_card
        id="custom-ratio"
        title="Supply & demand"
        eyebrow="Pool <sample>"
        value_bps={5620}
        label={@label}
        remainder_label="Available & unassigned"
        change={@change}
        footer_label="Inputs <illustration>"
        class="custom-card"
        data-purpose="example"
      >
        <:footer><span class="rg-ratio-card__tile">{"A & B"}</span></:footer>
        <:footer_badge><span>{"Illustration & only"}</span></:footer_badge>
      </Regent.Structure.ratio_card>
      """)

    assert html =~ ~s(id="custom-ratio")
    assert html =~ ~s(class="rg-ratio-card custom-card")
    assert html =~ ~s(data-purpose="example")
    assert html =~ "Supply &amp; demand"
    assert html =~ "Pool &lt;sample&gt;"
    assert html =~ "Committed &lt;units&gt;"
    assert html =~ "Available &amp; unassigned"
    assert html =~ "+2.1 pp / 7 days &lt;estimate&gt;"
    assert html =~ "Inputs &lt;illustration&gt;"
    assert html =~ ~s(<span class="rg-ratio-card__tile">A &amp; B</span>)
    assert html =~ "<span>Illustration &amp; only</span>"
    assert html =~ ~s(aria-labelledby="custom-ratio-title custom-ratio-label")
    refute html =~ "<estimate>"
    refute html =~ "<button"
    refute html =~ "tabindex"
  end

  test "ratio skin remains unclipped and preserves a visible meter in forced colors" do
    css = File.read!(Path.expand("../../assets/css/ratio.css", __DIR__))
    structure = File.read!(Path.expand("../../assets/css/structure.css", __DIR__))

    assert structure =~ ~s(@import "./ratio.css")
    assert css =~ "background: var(--palette-tangerine-tango)"
    assert css =~ "repeating-linear-gradient"
    assert css =~ "@container rg-ratio (max-width: 30rem)"
    assert css =~ "@media (forced-colors: active)"

    assert css =~
             ~r/\.rg-ratio-card__fill\s*\{[^}]*forced-color-adjust: none;[^}]*background: Highlight;/

    refute css =~ "clip-path"
    refute css =~ "overflow: hidden"
    refute css =~ "animation:"
  end

  defp ratio_card(attrs) do
    render_component(
      Function.capture(Regent.Structure, :ratio_card, 1),
      Keyword.merge([id: "ratio", title: "Capacity"], attrs)
    )
  end

  test "panel preserves native controls and an explicit accessible name without clipping markup" do
    assigns = %{}

    html =
      rendered_to_string(~H"""
      <Regent.Structure.panel id="preview" aria-label="Preview settings" tone="accent">
        <button type="button">Open menu</button>
        <details>
          <summary>Details</summary>
          <p>Complete content</p>
        </details>
      </Regent.Structure.panel>
      """)

    assert html =~ ~s(aria-label="Preview settings")
    assert html =~ "rg-panel--accent"
    assert html =~ ~s(<button type="button">Open menu</button>)
    assert html =~ "Complete content"
    refute html =~ "clip-path"
    refute html =~ "onclick"
  end
end
