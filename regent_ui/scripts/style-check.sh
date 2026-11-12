#!/usr/bin/env bash
# Regent style check: prints file:line for each break of a STYLE.md rule in a site's own
# CSS, JS and templates, and exits 1 when it finds any. Vendored and ignored files are
# skipped. Usage: style-check.sh [root], where root holds the site's assets/ and lib/
# (a site's platform/ directory, or design-system's regent_ui/); the default is "."
# Needs ripgrep, awk and perl. It exits 2, never 0, when it could not check: one of them
# is not installed, root lacks assets/ or lib/, or a file could not be read.
set -euo pipefail
trap 'echo "style check: cannot finish, see the error above" >&2; exit 2' ERR

missing=""
command -v rg >/dev/null || missing="$missing ripgrep"
command -v awk >/dev/null || missing="$missing awk"
command -v perl >/dev/null || missing="$missing perl"
if [ -n "$missing" ]; then
  echo "style check: cannot run, not installed:$missing" >&2
  exit 2
fi

cd "${1:-.}"

exclude=(--glob '!assets/vendor/**' --glob '!**/node_modules/**' --glob '!**/style-check.sh')
found=$(mktemp)
trap 'rm -f "$found"' EXIT

# Reads rg-style "path:line:text" lines and records them under the rule's name.
emit() {
  sed -E -e "s#^\./##" -e "s/^([^:]+:[0-9]+):[[:space:]]*/\1: $1: /" >>"$found"
}

# rg exits 1 when nothing matches, a clean result. Any other exit (2 for a missing
# folder or an unreadable file) stops the check.
rg_or_none() {
  rg "$@" || [ $? -eq 1 ]
}

search() {
  local dir=$1
  shift
  rg_or_none --no-heading --with-filename --line-number "${exclude[@]}" "$@" "$dir"
}

files() {
  local dir=$1
  shift
  rg_or_none --files "${exclude[@]}" "$@" "$dir"
}

# Layers stay flat. An approved exception carries its marker on its own line.
search assets -g '*.css' 'box-shadow:' |
  rg_or_none -v 'box-shadow:\s*(none|var\(--rg-layer)' |
  rg_or_none -v 'style-check: allow shadow — \w' | emit flat

# No glass. An approved exception carries its marker on its own line.
search assets -g '*.css' 'backdrop-filter|filter:\s*blur' |
  rg_or_none -v 'style-check: allow glass — \w' | emit glass

# No weight above 400.
search assets -g '*.css' 'font-weight:\s*(bold|[5-9]00)' | emit weight

# Square or cut; pills take their radius from their height.
search assets -g '*.css' -e '9999px' -e 'border-[a-z-]*radius:' |
  rg_or_none -v 'border-[a-z-]*radius:\s*(0|0px|50%|var\(--radius\)|calc\(var\(--pill-h\) / 2\))\s*(;|\}|$)' |
  emit shape

# No stacking numbers of our own, except inside a rule (or a rule nested in one) that
# sets isolation: isolate on its artwork root.
files assets -g '*.css' | while IFS= read -r file; do
  awk '
    function scan(s) {
      if (s ~ /isolation:[ \t]*isolate/) iso[depth] = 1
      if (s ~ /z-index:[ \t]*-?[0-9]/) pending[depth] = pending[depth] FILENAME ":" FNR ":" text "\n"
    }
    function close_block() {
      if (!iso[depth]) pending[depth - 1] = pending[depth - 1] pending[depth]
      depth--
      if (depth == 0) { printf "%s", pending[0]; pending[0] = "" }
    }
    {
      text = $0
      line = $0
      gsub(/\/\*([^*]|\*+[^*\/])*\*+\//, "", line)
      seg = ""
      for (i = 1; i <= length(line); i++) {
        c = substr(line, i, 1)
        if (c == "{") { scan(seg); seg = ""; depth++; iso[depth] = 0; pending[depth] = "" }
        else if (c == "}") { scan(seg); seg = ""; close_block() }
        else seg = seg c
      }
      scan(seg)
    }
  ' "$file"
done | emit stacking

# Motion is transform and opacity. A test's expected values are not motion.
search assets -g '*.{js,mjs,ts,tsx}' -g '!*.test.*' '\b(left|top|width|height|margin[A-Za-z]*):\s*\[' | emit motion

# Icons are Lucide through the shared component: any other <svg> is artwork marked
# aria-hidden or a logo that names itself (role="img").
files lib -g '*.{ex,heex}' | while IFS= read -r file; do
  perl -0777 -ne '
    while (/<svg(?=[\s>\/])((?:[^>{]|\{[^}]*\})*)>/g) {
      my $attrs = $1;
      my $line = 1 + (substr($_, 0, $-[0]) =~ tr/\n//);
      next if $attrs =~ /\baria-hidden(?:="true"|=\{true\}|(?=[\s\/]|$))/ or $attrs =~ /\brole="img"/;
      print "$ARGV:$line:<svg without aria-hidden or role=\"img\"\n";
    }
  ' "$file"
done | emit icon

# Product names: Keyfleet has one capital letter.
search . 'KeyFleet' | emit name

# Page words never say how a page is built. Only the words a person reads are checked:
# tags, attributes, expressions and comments are left out.
files lib -g '*.heex' | while IFS= read -r file; do
  perl -0777 -ne '
    my @lines = split /\n/, $_, -1;
    my $text = $_;
    my $blank = sub { (my $s = shift) =~ s/[^\n]/ /g; $s };
    $text =~ s/(<%!--.*?--%>|<!--.*?-->|<%.*?%>)/$blank->($1)/gse;
    $text =~ s/(<(script|style)\b.*?<\/\2>)/$blank->($1)/gsie;
    $text =~ s/(\{(?:[^{}]++|(?1))*\})/$blank->($1)/gse;
    $text =~ s/(<\/?[A-Za-z.:][^>]*>)/$blank->($1)/gse;
    while ($text =~ /\b(liveview|fallback|websocket|hook|endpoint)\b/gi) {
      my $line = 1 + (substr($text, 0, $-[0]) =~ tr/\n//);
      (my $shown = $lines[$line - 1]) =~ s/^\s+//;
      print "$ARGV:$line:$shown\n";
    }
  ' "$file"
done | emit words

if [ -s "$found" ]; then
  cat "$found"
  echo "style check: $(wc -l <"$found" | tr -d " ") breaks" >&2
  exit 1
fi
