defmodule Regent.SiteBackground do
  @moduledoc "Decorative cutting mat selected by the consuming site and light/dark tokens."
  use Phoenix.Component

  def site_background(assigns) do
    ~H"""
    <div class="rg-site-background" aria-hidden="true"></div>
    """
  end
end
