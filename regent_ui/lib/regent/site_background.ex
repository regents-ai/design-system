defmodule Regent.SiteBackground do
  @moduledoc "Compatibility component. Page background artwork is retired; assets remain packaged."
  use Phoenix.Component

  def site_background(assigns) do
    ~H"""
    <div class="rg-site-background" aria-hidden="true" hidden></div>
    """
  end
end
