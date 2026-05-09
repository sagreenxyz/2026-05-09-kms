---
title: Development Environment Test
---

# Development Environment Test

This page validates that the Astro development environment is functioning correctly.

## Quick Checks

- [ ] The page loads at `/dev-environment-test`
- [ ] Markdown headings render correctly
- [ ] Bullet and numbered lists render correctly
- [ ] Tables render correctly
- [ ] Code blocks render correctly
- [ ] Link rendering works

## Numbered Steps

1. Start the dev server with `npm run dev`.
2. Open `/dev-environment-test` in the browser.
3. Confirm all sections on this page are visible.

## Table Test

| Check | Expected Result |
|------|-----------------|
| Routing | Page resolves at `/dev-environment-test` |
| Markdown | Typography is rendered |
| Build | `npm run build` succeeds |

## Code Block Test

```bash
npm run dev
npm run build
npm run preview
```

## Inline Code Test

The project should build into the `dist` directory.

## Link Test

Return to the [Home Page](/).

## Result

If everything above looks correct, the development environment is working as expected.
