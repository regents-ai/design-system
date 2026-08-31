# Regent social-post previews

Local Vite workspace for reviewing the fixed-size 600×800 social-post compositions kept with
the design system. It is a preview and capture surface, not a shipped Regent application.

## Run locally

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. The available preview routes are:

- `/` — agent revenue and capital-formation posts
- `/1` — staking and agent-services posts

Each composition is rendered at its intended 600×800 capture size. Use the browser's element
screenshot support to capture an individual post rather than the full preview page.

## Checks

```bash
npm run lint
npm run build
```

`npm run build` type-checks the workspace and creates the production preview in `dist/`.

## Editing

- `src/App.tsx` owns the post copy and route composition.
- `src/components/` owns the deterministic canvas backgrounds.
- `src/index.css` owns shared post treatments and reduced-motion behavior.

Keep preview copy public-safe and preserve the 600×800 output size unless the intended social
format changes.
