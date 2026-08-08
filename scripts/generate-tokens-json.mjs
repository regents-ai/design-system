#!/usr/bin/env node
// Regenerate design_system_tokens.json and RegentUI's packaged CSS mirrors.
// The root CSS files are the sources of truth; every other representation is
// a generated output checked here.
//
// Usage: node scripts/generate-tokens-json.mjs [--check]
//   --check  verify the JSON is in sync without rewriting it (exit 1 on drift)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cssPath = join(root, "design_system_tokens.css");
const jsonPath = join(root, "design_system_tokens.json");
const glassPath = join(root, "design_system_glass.css");
const packagedCssPath = join(root, "regent_ui", "assets", "css", "design_system_tokens.css");
const packagedGlassPath = join(root, "regent_ui", "assets", "css", "design_system_glass.css");

const css = readFileSync(cssPath, "utf8");
const glass = readFileSync(glassPath, "utf8");

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

const outputs = [
  [jsonPath, output],
  [packagedCssPath, css],
  [packagedGlassPath, glass],
];

if (process.argv.includes("--check")) {
  const drifted = outputs
    .filter(([path, expected]) => {
      try {
        return readFileSync(path, "utf8") !== expected;
      } catch (error) {
        if (error.code === "ENOENT") return true;
        throw error;
      }
    })
    .map(([path]) => path.slice(root.length + 1));

  if (drifted.length > 0) {
    console.error(`Generated visual contract is out of sync: ${drifted.join(", ")}. Run:`);
    console.error("  node scripts/generate-tokens-json.mjs");
    process.exit(1);
  }
  console.log("Generated visual contract is in sync.");
} else {
  for (const [path, content] of outputs) {
    writeFileSync(path, content);
    console.log(`Wrote ${path}`);
  }
}
