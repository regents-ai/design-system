<!-- BEGIN REGENT META GENERATED -->
## Repo Contract

Generated from `meta/stack.yaml` and repo `repo.yaml` files. Local notes may live outside this block.

- Repo contract: `design-system/repo.yaml`
- Owner: `design-system`
- Release group: `ops_preview`
- Owned areas: `shared_visual_language`, `tokens`, `money_action_risk_panels`, `status_badges`.
- Change API or CLI behavior in the owning YAML contract before changing code.
- Use `bd` only for execution state: tickets, claims, blockers, dependencies, and closure evidence.
<!-- END REGENT META GENERATED -->
# Regent Design System Agent Guide

This repo owns shared Regent visual assets, tokens, and Phoenix component primitives.

## Regent Dependency Skills

The Regent dependency skills are installed in `/Users/sean/Documents/regent/.agents/skills` and `/Users/sean/.codex/skills`. This repo usually needs design and Phoenix skills before dependency skills. Use Regent dependency skills only when the task crosses into product behavior:

- `platform-corpus` when design docs or components change public corpus pages or search output.
- `observability-promex-sentry` only if shared UI diagnostics, logs, or metrics are added.
- `contract-first-cli-api` only if a component change also changes a product API or CLI contract.

## Core Rules

- Shared UI components must not own product workflow state, auth decisions, money movement, or product database behavior.
- Use `GeistPixel-Circle.woff2` for titles and headers.
- Use `GeistPixel-Square.woff2` for normal text.
- Keep design tokens, terminal palettes, and component examples aligned with the product AGENTS files that consume them.
- Never read `.env` files. `.env.example` is allowed.

## Start Here

- Read `STYLE.md` first: the canonical Regent visual language (neutrals, product identity accents, typography, motion, glass, artwork, logos).
- Use this repo for shared visual assets, tokens, and Phoenix component primitives.
- Read `/Users/sean/Documents/regent/docs/shared-agent-dependency-map.md` only when a shared UI change crosses into product docs, contracts, diagnostics, or operator help.
- Do not add product-specific business rules to shared UI. Put product state and product permission in the owning product.
- Keep examples public-safe. Do not include private user data, billing data, wallet secrets, or internal support details.

## Validation

For `regent_ui` changes:

```bash
cd regent_ui
mix check
```
