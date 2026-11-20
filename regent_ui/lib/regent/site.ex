defmodule Regent.Site do
  @moduledoc """
  The one site: the eight products regents.sh holds, and the bar every one of its pages
  wears. `products/0` is the only list of them; `bar/1` draws it.

  The page's root carries the product three ways, all from the same id: `data-product`
  (the product's look, from `design_system_tokens.css`), `data-brand` (the ground it
  stands on, `brand/1`) and the bar's `product`. It also carries `data-home`, the home
  colour: `ink`, `tangerine` or `blue`.

  The bar's menu is the browser's own popover, placed under its button by CSS anchor
  positioning; `product_menu.mjs`, imported once, adds the arrow keys. It needs no
  server state, so it works the same on controller-rendered and LiveView pages.
  """
  use Phoenix.Component

  # The flat marks from logos/ (background dropped), as squares of one size:
  # {viewBox, square size, square corners}.
  @marks %{
    crown:
      {"31 46 178 106", 34,
       [
         {31, 46},
         {103, 46},
         {175, 46},
         {31, 82},
         {67, 82},
         {103, 82},
         {139, 82},
         {175, 82},
         {31, 118},
         {67, 118},
         {103, 118},
         {139, 118},
         {175, 118}
       ]},
    autolaunch:
      {"15 33 286 178", 34,
       [
         {15, 177},
         {51, 177},
         {87, 177},
         {123, 177},
         {159, 177},
         {195, 177},
         {15, 141},
         {15, 105},
         {87, 105},
         {123, 105},
         {15, 69},
         {159, 69},
         {195, 69},
         {15, 33},
         {231, 33},
         {267, 33}
       ]},
    techtree:
      {"14 47 382 334", 22,
       [
         {110, 47},
         {134, 47},
         {158, 47},
         {14, 71},
         {38, 71},
         {62, 71},
         {86, 71},
         {110, 71},
         {134, 71},
         {158, 71},
         {182, 71},
         {206, 71},
         {230, 71},
         {254, 71},
         {110, 95},
         {134, 95},
         {158, 95},
         {134, 119},
         {134, 143},
         {134, 167},
         {134, 191},
         {134, 215},
         {230, 215},
         {254, 215},
         {278, 215},
         {134, 239},
         {158, 239},
         {182, 239},
         {206, 239},
         {230, 239},
         {254, 239},
         {278, 239},
         {302, 239},
         {326, 239},
         {350, 239},
         {374, 239},
         {230, 263},
         {254, 263},
         {278, 263},
         {254, 287},
         {254, 311},
         {254, 335},
         {254, 359}
       ]}
  }

  @paths Map.new(@marks, fn {name, {view_box, size, squares}} ->
           {name,
            {view_box,
             Enum.map_join(squares, fn {x, y} -> "M#{x} #{y}h#{size}v#{size}h-#{size}z" end)}}
         end)

  # The menu's order: the five products, a rule, then the three protocol pieces.
  @products [
    %{
      id: "regents",
      name: "Regents",
      href: "/",
      brand: "platform",
      mark: :crown,
      group: :products
    },
    %{
      id: "techtree",
      name: "Techtree",
      href: "/techtree",
      brand: "techtree",
      mark: :techtree,
      group: :products
    },
    %{
      id: "keyfleet",
      name: "Keyfleet",
      href: "/keyfleet",
      brand: "platform",
      mark: :crown,
      group: :products
    },
    %{
      id: "autolaunch",
      name: "Autolaunch",
      href: "/autolaunch",
      brand: "autolaunch",
      mark: :autolaunch,
      group: :products
    },
    %{
      id: "patchbay",
      name: "Patchbay",
      href: "/patchbay",
      brand: "patchbay",
      mark: :crown,
      group: :products
    },
    %{
      id: "protocol",
      name: "Protocol",
      href: "/stake",
      brand: "platform",
      mark: :crown,
      group: :protocol
    },
    %{
      id: "siwa",
      name: "SIWA",
      href: "/siwa",
      brand: "platform",
      mark: :crown,
      group: :protocol
    },
    %{
      id: "cloak",
      name: "Cloak",
      href: "/cloak",
      brand: "platform",
      mark: :crown,
      group: :protocol
    }
  ]

  @ids Enum.map(@products, & &1.id)
  @by_id Map.new(@products, &{&1.id, &1})

  @doc """
  The eight products in menu order, each `%{id, name, href, brand, mark, group}`.
  """
  def products, do: @products

  @doc """
  The `data-brand` a product's pages set on the root: the ground its look stands on.
  """
  def brand(product), do: Map.fetch!(@by_id, product).brand

  attr :id, :string, required: true
  attr :product, :string, required: true, values: @ids, doc: "the current product's id"
  attr :class, :any, default: nil
  attr :rest, :global

  slot :links, doc: "the product's own links, shown from 48rem up"

  slot :account,
    required: true,
    doc: "signed out, the theme switch and Sign in; signed in, the account button and its menu"

  @doc """
  The bar: the crown (home), the current product's mark and name opening the menu of
  all eight, the product's own links, and Account. The crown, the product button and
  Account keep the same size and place on every product.
  """
  def bar(assigns) do
    assigns =
      assign(assigns,
        current: Map.fetch!(@by_id, assigns.product),
        groups: Enum.chunk_by(@products, & &1.group)
      )

    ~H"""
    <header id={@id} class={["rg-bar", @class]} {@rest}>
      <a class="rg-bar__crown" href="/" aria-label="Regents home">
        <.mark name={:crown} />
      </a>
      <button
        id={"#{@id}-button"}
        class="rg-bar__product"
        type="button"
        popovertarget={"#{@id}-menu"}
        aria-haspopup="menu"
      >
        <.tile product={@current} />
        <span class="rg-bar__name">{@current.name}</span>
        <Regent.Icons.icon name="chevron-down" class="rg-bar__chevron" />
      </button>
      <div
        id={"#{@id}-menu"}
        class="rg-bar__menu"
        popover
        role="menu"
        aria-labelledby={"#{@id}-button"}
      >
        <%= for {group, index} <- Enum.with_index(@groups) do %>
          <div :if={index > 0} class="rg-bar__rule" role="separator"></div>
          <a
            :for={product <- group}
            class="rg-bar__item"
            role="menuitem"
            tabindex="-1"
            href={product.href}
            aria-current={product.id == @product && "true"}
          >
            <.tile product={product} />
            {product.name}
          </a>
        <% end %>
      </div>
      <nav :if={@links != []} class="rg-bar__links" aria-label={@current.name}>
        {render_slot(@links)}
      </nav>
      <div class="rg-bar__account">{render_slot(@account)}</div>
    </header>
    """
  end

  attr :product, :map, required: true

  defp tile(assigns) do
    ~H"""
    <span class="rg-bar__tile" data-product={@product.id} aria-hidden="true">
      <.mark name={@product.mark} />
    </span>
    """
  end

  attr :name, :atom, required: true

  defp mark(assigns) do
    {view_box, path} = Map.fetch!(@paths, assigns.name)
    assigns = assign(assigns, view_box: view_box, path: path)

    ~H"""
    <svg viewBox={@view_box} aria-hidden="true" focusable="false"><path d={@path} /></svg>
    """
  end
end
