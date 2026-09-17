defmodule Regent.AgentMetadata do
  @moduledoc """
  Public discovery metadata. The caller owns every URL, brand, capability and
  structured-data fact. This component does not add routes or grant authority.
  Only advertise a Markdown representation when that exact page supports it.
  """
  use Phoenix.Component

  attr :title, :string, required: true
  attr :description, :string, required: true
  attr :canonical, :string, required: true
  attr :site_name, :string, required: true
  attr :site_type, :string, default: nil, values: [nil, "content", "business", "app", "store"]
  attr :image, :string, required: true
  attr :image_width, :integer, required: true
  attr :image_height, :integer, required: true
  attr :image_alt, :string, required: true
  attr :twitter_site, :string, default: nil
  attr :markdown, :boolean, default: false
  attr :agent_guide, :string, default: nil
  attr :sitemap, :string, default: nil
  attr :service_description, :string, default: nil
  attr :structured_data, :map, required: true
  attr :nonce, :string, default: nil

  def head(assigns) do
    assigns =
      assign(
        assigns,
        :json_ld,
        assigns.structured_data
        |> Phoenix.json_library().encode!()
        |> String.replace("<", "\\u003c")
      )

    ~H"""
    <link
      :if={@agent_guide}
      rel="alternate"
      type="text/plain"
      title="Agent guide"
      href={@agent_guide}
    />
    <link :if={@markdown} rel="alternate" type="text/markdown" href={@canonical} />
    <link rel="canonical" href={@canonical} />
    <link :if={@sitemap} rel="sitemap" type="application/xml" href={@sitemap} />
    <link
      :if={@service_description}
      rel="service-desc"
      type="application/vnd.oai.openapi+json"
      href={@service_description}
    />
    <meta name="description" content={@description} />
    <meta :if={@site_type} name="is-agentic-site-type" content={@site_type} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={@site_name} />
    <meta property="og:title" content={@title} />
    <meta property="og:description" content={@description} />
    <meta property="og:url" content={@canonical} />
    <meta property="og:image" content={@image} />
    <meta property="og:image:width" content={@image_width} />
    <meta property="og:image:height" content={@image_height} />
    <meta property="og:image:alt" content={@image_alt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta :if={@twitter_site} name="twitter:site" content={@twitter_site} />
    <meta name="twitter:title" content={@title} />
    <meta name="twitter:description" content={@description} />
    <meta name="twitter:image" content={@image} />
    <script type="application/ld+json" nonce={@nonce}>
      <%= Phoenix.HTML.raw(@json_ld) %>
    </script>
    """
  end
end
