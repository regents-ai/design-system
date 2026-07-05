#!/usr/bin/env node
// Regenerate design_system_tokens.json from design_system_tokens.css.
// The CSS file is the source of truth; the JSON is a generated mirror of the
// custom-property declarations in each `:root...` selector block.
//
// Usage: node design-system/scripts/generate-tokens-json.mjs [--check]
//   --check  verify the JSON is in sync without rewriting it (exit 1 on drift)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cssPath = join(root, "design_system_tokens.css");
const jsonPath = join(root, "design_system_tokens.json");

const css = readFileSync(cssPath, "utf8");

const selectors = {};
const blockPattern = /(^|\n)(:root(?:\[[^\]]+\])*)\s*\{([\s\S]*?)\n\}/g;

for (const match of css.matchAll(blockPattern)) {
  const selector = match[2];
  const body = match[3];
  const vars = {};

  const declPattern = /(--[\w-]+)\s*:\s*([\s\S]*?);/g;
  for (const decl of body.matchAll(declPattern)) {
    vars[decl[1]] = decl[2].replace(/\s+/g, " ").trim();
  }

  if (Object.keys(vars).length > 0) {
    selectors[selector] = { ...(selectors[selector] ?? {}), ...vars };
  }
}

const output = `${JSON.stringify({ selectors }, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const current = readFileSync(jsonPath, "utf8");
  if (current !== output) {
    console.error("design_system_tokens.json is out of sync with the CSS. Run:");
    console.error("  node design-system/scripts/generate-tokens-json.mjs");
    process.exit(1);
  }
  console.log("design_system_tokens.json is in sync.");
} else {
  writeFileSync(jsonPath, output);
  console.log(`Wrote ${jsonPath}`);
}
