defmodule Regent.StyleCheckTest do
  use ExUnit.Case, async: true

  @script Path.expand("../../scripts/style-check.sh", __DIR__)
  # Spelled in two parts so this file passes the check it tests.
  @wrong_name "Key" <> "Fleet"

  @clean_css """
  .card { box-shadow: none; border-radius: 0; }
  .tip { box-shadow: var(--rg-layer-tip-shadow); z-index: var(--rg-layer-tip); }
  .pill { --pill-h: 40px; border-radius: calc(var(--pill-h) / 2); }
  .dot { border-radius: 50%; font-weight: 400; }
  .art { isolation: isolate; .piece { z-index: 2; } }
  .home { backdrop-filter: blur(20px); /* style-check: allow glass — Sean 12 Nov 2026 */ }
  .cube { box-shadow: 0 24px 48px black; /* style-check: allow shadow — Sean 12 Nov 2026 */ }
  """

  @clean_heex """
  <div phx-hook="Reveal" data-endpoint={@endpoint}>
    <svg aria-hidden="true" viewBox="0 0 4 4"><circle r="1" /></svg>
    <svg
      role="img" aria-label="Regents"></svg>
    <%!-- a fallback named in a comment --%>
    <p>Keyfleet {@hook_count}</p>
  </div>
  """

  defp site(dir, files) do
    for {path, body} <- files do
      file = Path.join(dir, path)
      File.mkdir_p!(Path.dirname(file))
      File.write!(file, body)
    end

    dir
  end

  setup do
    dir = Path.join(System.tmp_dir!(), "regent-style-check-#{System.unique_integer([:positive])}")
    on_exit(fn -> File.rm_rf!(dir) end)
    %{dir: dir}
  end

  defp check(dir), do: System.cmd("bash", [@script, dir], stderr_to_stdout: true)

  defp clean(dir) do
    site(dir, %{
      "assets/css/app.css" => @clean_css,
      "assets/js/app.ts" => "animate(el, { translateY: [8, 0], opacity: [0, 1] })\n",
      "lib/app/page.html.heex" => @clean_heex,
      "assets/vendor/regent_ui/copied.css" =>
        ".x { box-shadow: 0 0 4px red } /* #{@wrong_name} */\n"
    })
  end

  test "a clean site passes, vendored copies included", %{dir: dir} do
    assert {_, 0} = dir |> clean() |> check()
  end

  for {rule, path, line} <- [
        {"flat", "assets/css/app.css", ".a { box-shadow: 0 4px 12px black; }"},
        {"flat", "assets/css/app.css",
         ".a { box-shadow: 0 4px 12px black; /* style-check: allow shadow — */ }"},
        {"flat", "assets/css/app.css",
         ".a { box-shadow: 0 4px 12px black; /* style-check: allow glass — Sean 12 Nov 2026 */ }"},
        {"stacking", "assets/css/app.css", ".b { z-index: 3; }"},
        {"glass", "assets/css/app.css", ".c { backdrop-filter: blur(4px); }"},
        {"glass", "assets/css/app.css",
         ".c { filter: blur(2px); /* style-check: allow glass */ }"},
        {"glass", "assets/css/app.css",
         ".c { backdrop-filter: blur(4px); /* style-check: allow glass — */ }"},
        {"glass", "assets/css/app.css",
         ".c { backdrop-filter: blur(4px); /* style-check: allow shadow — Sean 12 Nov 2026 */ }"},
        {"weight", "assets/css/app.css", ".d { font-weight: 600; }"},
        {"shape", "assets/css/app.css", ".e { border-radius: 9999px; }"},
        {"shape", "assets/css/app.css", ".f { border-top-left-radius: 4px; }"},
        {"motion", "assets/js/app.ts", "animate(el, { height: [0, 120] })"},
        {"icon", "lib/app/page.html.heex", ~s(<svg viewBox="0 0 24 24"><path d="M0 0" /></svg>)},
        {"name", "lib/app/page.html.heex", "<p>Made with #{@wrong_name}</p>"},
        {"words", "lib/app/page.html.heex", "<p>Runs on LiveView.</p>"}
      ] do
    test "a #{rule} break fails at its line: #{line}", %{dir: dir} do
      clean(dir)
      file = Path.join(dir, unquote(path))
      File.write!(file, File.read!(file) <> unquote(line) <> "\n")

      at =
        "#{unquote(path)}:#{file |> File.read!() |> String.split("\n") |> length() |> Kernel.-(1)}:"

      assert {output, 1} = check(dir)
      assert [found] = output |> String.split("\n") |> Enum.filter(&String.starts_with?(&1, at))
      assert found =~ " #{unquote(rule)}: "
    end
  end
end
