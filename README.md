# VEAMS

This is the official monorepo for [VEAMS](https://github.com/Veams/veams) packages.

## Packages

- `@veams/status-quo`: framework-agnostic state handlers and React hooks.
- `@veams/form`: form state handlers with optional React field bindings.
- `@veams/status-quo-query`: TanStack Query service helpers with a subscribable API surface.
- `@veams/partial-hydration`: framework-agnostic partial hydration engine with optional React bindings.

## Docs

The repository includes a documentation app workspace in `web/`. It is built with Vite and React, deployed to GitHub Pages, and provides routed package documentation under `/packages/:packageId/:pageId`.

## Development

Install dependencies from the repo root:

```bash
npm install
```

Common commands:

```bash
npm run build
npm run test
npm run lint
npm run docs:build
```

Run the docs app locally:

```bash
npm run dev -- --filter=@veams/docs
```

Build the documentation:

```bash
npm run docs:build
```

You can target a single package with Turbo filters, for example:

```bash
npm run build -- --filter=@veams/status-quo
```
