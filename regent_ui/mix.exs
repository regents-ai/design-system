defmodule RegentUi.MixProject do
  use Mix.Project

  @version "0.1.0"
  @description "Shared Regent Phoenix components, hooks, assets, and spatial UI primitives."

  def project do
    [
      app: :regent_ui,
      version: @version,
      elixir: "~> 1.19.5",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: @description,
      package: package(),
      aliases: aliases(),
      cli: cli()
    ]
  end

  def application do
    [extra_applications: [:logger]]
  end

  defp deps do
    [
      {:phoenix_live_view, "~> 1.1.0"},
      {:phoenix_html, "~> 4.1"},
      {:jason, "~> 1.2"}
    ]
  end

  defp package do
    [
      licenses: ["MIT"],
      files: ["lib", "assets", "priv", "mix.exs", ".formatter.exs"]
    ]
  end

  defp aliases do
    [
      check: [
        "cmd node ../scripts/generate-tokens-json.mjs --check",
        "cmd node --experimental-test-module-mocks --test test/js/collateral_hook_test.ts",
        "compile --warnings-as-errors",
        "deps.unlock --check-unused",
        "format --check-formatted",
        "test --warnings-as-errors"
      ],
      precommit: ["check"]
    ]
  end

  def cli, do: [preferred_envs: [check: :test, precommit: :test]]
end
