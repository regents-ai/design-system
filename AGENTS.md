<!-- BEGIN REPO CONTRACT -->
## Repo Contract

Repository ownership is documented below and in the local `repo.yaml`. Follow the workspace `regent-workflow` for execution.

- Repo contract: `design-system/repo.yaml`
- Owner: `design-system`
- Release group: `ops_preview`
- Owned areas: `shared_visual_language`, `tokens`, `money_action_risk_panels`, `status_badges`.
- Change API or CLI behavior in the owning YAML contract before changing code.
- Hermes/Astra coordinates scoped Claude/Fable work; no ticket tracker is required.
<!-- END REPO CONTRACT -->
# Regent Design System Agent Guide

This repo owns shared Regent visual assets, tokens, and Phoenix component primitives.

## Core Rules

- Shared UI components must not own product workflow state, auth decisions, money movement, or product database behavior.
- Typography is Geist UI Sans for titles, interface and body text and Geist Mono for code,
  weights 400 and 600 only, served from the packaged `/fonts/regent-ui/` files. Spacing steps
  by 8px, containers pad by `--container-padding` (24px), and every box uses the single
  `--radius` (24px). `STYLE.md` holds the exact contract.
- Keep design tokens, terminal palettes, and component examples aligned with the product AGENTS files that consume them.
- Never read `.env` files. `.env.example` is allowed.

## Start Here

- Read `STYLE.md` first: the canonical Regent visual language (neutrals, product identity accents, typography, motion, glass, artwork, logos).
- Use this repo for shared visual assets, tokens, and Phoenix component primitives.
- Do not add product-specific business rules to shared UI. Put product state and product permission in the owning product.
- Keep examples public-safe. Do not include private user data, billing data, wallet secrets, or internal support details.

## Validation

For `regent_ui` changes:

```bash
cd regent_ui
mix check
```
