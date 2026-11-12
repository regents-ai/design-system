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
  .lines { background: linear-gradient(in oklch, red 0 0), repeating-linear-gradient(90deg in oklch, red 0 4px, blue 4px 5px); }
  .dots { background: radial-gradient(circle at center in oklch, red, blue), repeating-radial-gradient(in oklch, red 0 2px, blue 2px 4px); }
  .turn { background: conic-gradient(from var(--angle) in oklch, red, blue), repeating-conic-gradient(from 0deg in oklch longer hue, red 0 10deg, blue 10deg 20deg); }
  .mix { background: linear-gradient(to top in oklch, color-mix(in srgb, red 50%, blue) 50%, transparent 50%); }
  /* a linear-gradient(red, blue) named in a comment */
  .fade {
    mask-image: linear-gradient(
      to right in oklch,
      transparent,
      #000
    );
  }
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

  defp check(dir, env \\ []),
    do: System.cmd("bash", [@script, dir], stderr_to_stdout: true, env: env)

  # A PATH holding every tool the script runs except ripgrep.
  defp without_rg(dir) do
    bin = Path.join(dir, "bin")
    File.mkdir_p!(bin)

    for tool <- ~w(awk perl sed mktemp rm cat wc tr) do
      File.ln_s!(System.find_executable(tool), Path.join(bin, tool))
    end

    [{"PATH", bin}]
  end

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

  test "without ripgrep a site with a break does not pass, and ripgrep is named", %{dir: dir} do
    clean(dir)
    File.write!(Path.join(dir, "assets/css/app.css"), ".c { backdrop-filter: blur(4px); }\n")

    assert {output, 2} = check(dir, without_rg(dir))
    assert output =~ "ripgrep"
  end

  test "without ripgrep a clean site does not pass either", %{dir: dir} do
    clean(dir)
    assert {_, 2} = check(dir, without_rg(dir))
  end

  test "a root without lib/ stops the check", %{dir: dir} do
    site(dir, %{"assets/css/app.css" => @clean_css})
    assert {_, 2} = check(dir)
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
        {"gradient", "assets/css/app.css", ".g { background: linear-gradient(red, blue); }"},
        {"gradient", "assets/css/app.css", ".g { background: radial-gradient(red, blue); }"},
        {"gradient", "assets/css/app.css", ".g { background: conic-gradient(red, blue); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: repeating-linear-gradient(red 0 2px, blue 2px 4px); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: repeating-radial-gradient(red 0 2px, blue 2px 4px); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: repeating-conic-gradient(red 0 10deg, blue 10deg 20deg); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: linear-gradient(to right, red, blue); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: linear-gradient(color-mix(in oklch, red, blue) 0 0); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: linear-gradient(in oklch, red, blue), radial-gradient(red, blue); }"},
        {"gradient", "assets/css/app.css",
         ".g { background: linear-gradient(red 0 0), linear-gradient(blue 0 0); }"},
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

  test "a gradient over several lines breaks at the line it opens", %{dir: dir} do
    clean(dir)
    file = Path.join(dir, "assets/css/app.css")
    before = file |> File.read!() |> String.split("\n") |> length()

    File.write!(
      file,
      File.read!(file) <>
        ".g {\n  background: conic-gradient(\n    from 0deg,\n    red,\n    blue\n  );\n}\n"
    )

    assert {output, 1} = check(dir)
    assert [found] = output |> String.split("\n") |> Enum.filter(&(&1 =~ " gradient: "))
    assert String.starts_with?(found, "assets/css/app.css:#{before + 1}:")
  end
end
