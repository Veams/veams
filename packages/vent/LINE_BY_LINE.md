# @veams/vent Line-by-Line Guide

This file documents the maintained `vent` package files line-by-line or in very small line ranges.

Scope:

- Included: authored package files in `src/` plus package-level config.
- Excluded: generated `dist/**` output and vendored `node_modules/**`.

## `package.json`

| Lines | Explanation |
| --- | --- |
| 1 | Opens the package manifest object. |
| 2 | Declares the published package name. |
| 3 | Declares the current package version. |
| 4 | Gives npm and readers a short package summary. |
| 5-6 | Points both CommonJS-style and ESM-oriented entry metadata at the compiled root output. |
| 7 | Starts the explicit export map. |
| 8-14 | Defines the root `@veams/vent` export with JS and type entrypoints. |
| 15-21 | Defines the React subpath export `@veams/vent/react`. |
| 22-28 | Defines the plugin subpath export `@veams/vent/plugin`. |
| 29-35 | Keeps the historical `@veams/vent/plugin/vent` path available too. |
| 36 | Closes the export map. |
| 37 | Declares the root TypeScript declaration file. |
| 38 | Marks the package as ESM-first. |
| 39 | Tells bundlers there are no side-effect-only modules to preserve. |
| 40 | Starts the npm scripts block. |
| 41 | Makes `build` go through the `compile` pipeline. |
| 42 | Compiles TypeScript using the package tsconfig. |
| 43 | Adds a no-emit typecheck command. |
| 44 | Keeps `compile` as a named intermediate script. |
| 45-46 | Routes linting through ESLint across both `.ts` and `.tsx` files. |
| 47 | Runs Jest with the package config under `NODE_ENV=test`. |
| 48 | Defines the release workflow entrypoint. |
| 49 | Closes the scripts block. |
| 50-52 | Declares React as an optional peer because only the `/react` subpath needs it. |
| 53-57 | Marks that peer dependency as optional. |
| 58 | Starts development-only dependencies. |
| 59-60 | Installs SWC support for fast TypeScript transforms in tests. |
| 61-64 | Installs Jest, Node, React, and React DOM type packages. |
| 65-73 | Installs the runtime tools needed for testing, building, releasing, and local React-based examples/tests. |
| 74 | Closes the dev dependency block. |
| 75-81 | Declares npm keyword metadata. |
| 82-84 | Publishes the package as public npm package. |
| 85-86 | Declares author and license metadata. |
| 87-91 | Points repository metadata at the monorepo and the `packages/vent` folder. |
| 92-94 | Points bug reports at the shared VEAMS issues tracker. |
| 95-108 | Configures `release-it` for git tags, GitHub releases, and npm publication. |
| 109 | Closes the manifest. |

## `tsconfig.json`

| Lines | Explanation |
| --- | --- |
| 1 | Opens the TypeScript config. |
| 2 | Starts compiler options. |
| 3 | Allows synthetic default imports from compatible modules. |
| 4-5 | Enables declaration generation into `dist`. |
| 6 | Enables CommonJS interop helpers where needed. |
| 7 | Enables JSX parsing for the React subpath. |
| 8-12 | Includes the ES2022 runtime plus DOM libraries required by React bindings and tests. |
| 13 | Emits ES2022 modules. |
| 14 | Uses bundler-friendly module resolution. |
| 15 | Emits compiled files into `dist`. |
| 16 | Skips type checking of external library declarations. |
| 17 | Emits source maps. |
| 18 | Enables strict type checking. |
| 19 | Targets ES2022 output. |
| 20-22 | Looks up ambient types from the monorepo root `node_modules`. |
| 23 | Closes compiler options. |
| 24-27 | Includes all package source and React source files. |
| 28-36 | Excludes build output, coverage, node_modules, mocks, and tests from production compilation. |
| 37 | Closes the config. |

## `tsconfig.eslint.json`

| Lines | Explanation |
| --- | --- |
| 1 | Opens the ESLint-specific tsconfig. |
| 2 | Reuses the main package tsconfig. |
| 3-6 | Includes both TypeScript and TSX source for linting. |
| 7-12 | Excludes generated folders and mocks while still allowing test files to be linted. |
| 13 | Closes the config. |

## `eslint.config.mjs`

| Lines | Explanation |
| --- | --- |
| 1-9 | Import Node, base ESLint, React, accessibility, globals, and TypeScript lint helpers. |
| 11 | Resolves the package root for parser project lookup. |
| 12 | Defines the main source glob. |
| 13 | Defines the test file globs. |
| 15 | Starts the flat ESLint config export. |
| 16-18 | Ignores generated coverage and build output. |
| 19-21 | Applies recommended base JavaScript and type-aware TypeScript rules. |
| 22-63 | Configures the main source rule set: browser/node globals, JSX parsing, React plugins, and custom TypeScript rules. |
| 24-37 | Sets language options for source files. |
| 38-42 | Registers React, hooks, and accessibility plugins. |
| 43-47 | Enables React version auto-detection. |
| 48-62 | Applies the actual rule bundle and custom rule overrides. |
| 64-74 | Adds a second block for tests with Jest globals and one relaxed React display-name rule. |
| 75 | Closes the config export. |

## `jest.config.cjs`

| Lines | Explanation |
| --- | --- |
| 1 | Starts the CommonJS Jest config export. |
| 2 | Tells Jest to treat TypeScript and TSX files as ESM. |
| 3 | Allows transforms inside dependencies if needed. |
| 4-7 | Uses SWC to transform JS, TS, JSX, TSX, and `.mjs` files. |
| 8-11 | Removes `.js` and `.mjs` suffixes from relative imports during tests. |
| 12 | Keeps Jest output quiet. |
| 13 | Avoids failure when no tests are present. |
| 14 | Clears mocks between tests. |
| 15-16 | Configures coverage output format and location. |
| 17-18 | Restricts test discovery to `src` and `__tests__` patterns. |
| 19 | Uses the default reporter. |
| 20 | Declares supported module file extensions. |
| 21 | Uses `jsdom` so the React tests can mount components. |
| 22 | Closes the config object. |

## `src/event-handler.ts`

| Lines | Explanation |
| --- | --- |
| 1-4 | Defines the generic callback shape, including the callback `this` context type. |
| 6-17 | Defines the public event handler contract and its aliases. |
| 19-24 | Normalizes one topic string into one or more topic names split by whitespace. |
| 26-30 | Starts the factory signature and its generic topic/data/scope parameters. |
| 31 | Creates the in-memory topic-to-listener registry. |
| 33-45 | Defines `publish`, which looks up listeners, picks a callback scope, and invokes listeners in reverse registration order. |
| 47-54 | Defines `subscribe`, which supports space-separated topic strings and stores listeners per topic. |
| 56-78 | Defines `unsubscribe`, which removes matching listeners across one or more topics and optionally deletes emptied topics. |
| 80-87 | Builds the returned handler object and wires aliases to the same implementations. |
| 89 | Returns the handler instance. |
| 92 | Re-exports the factory as the default root value. |

## `src/index.ts`

| Lines | Explanation |
| --- | --- |
| 1-4 | Re-export the root event handler factory as both named and default export. |
| 5-8 | Re-export the root event-related types. |

## `src/__tests__/index.test.ts`

| Lines | Explanation |
| --- | --- |
| 1 | Imports the root factory through the public entrypoint. |
| 3 | Defines the typed topic union used by the tests. |
| 5 | Starts the root event handler test suite. |
| 6-15 | Verifies that a subscriber receives the payload from `publish`. |
| 17-26 | Verifies duplicate subscriptions call the same callback multiple times. |
| 28-37 | Verifies a space-separated topic string subscribes one callback to both topics. |
| 39-49 | Verifies publishing one topic does not trigger subscribers of other topics. |
| 51-60 | Verifies explicit unsubscription removes the listener. |
| 62-69 | Verifies unsubscribing from an unknown topic is a safe no-op. |
| 71-82 | Verifies alias methods `on`, `trigger`, and `off` behave like their canonical counterparts. |
| 84-94 | Verifies multi-topic unsubscription mirrors multi-topic subscription. |
| 95 | Closes the suite. |

## `src/plugin/index.ts`

| Lines | Explanation |
| --- | --- |
| 1 | Re-exports the plugin value as the default subpath export. |
| 2-7 | Re-exports the plugin-related types for typed subpath consumers. |

## `src/plugin/vent.ts`

| Lines | Explanation |
| --- | --- |
| 1 | Imports the root event factory and the event handler type. |
| 3-5 | Defines the string-to-string event map shape used by Veams. |
| 7-9 | Defines plugin options, currently just extra events. |
| 11-15 | Defines the minimum Veams object shape that this plugin mutates. |
| 17-25 | Defines the plugin contract, including `this` typing for `initialize`. |
| 27-29 | Declares the default plugin options. |
| 31 | Starts the concrete plugin object. |
| 32-50 | Implements initialization: merge options, attach a new Vent bus, merge extra events, and return the mutated Veams object. |
| 52-54 | Stores the default `options` object on the plugin itself. |
| 55 | Gives the plugin its stable Veams registration name. |
| 56 | Closes the plugin object. |
| 58 | Exports the plugin as the subpath default. |

## `src/plugin/__tests__/plugin.test.ts`

| Lines | Explanation |
| --- | --- |
| 1 | Imports the concrete plugin implementation. |
| 3 | Starts the plugin test suite. |
| 4-23 | Verifies plugin initialization attaches a Vent instance and merges incoming event names with existing Veams events. |
| 25-35 | Verifies initialization also works when Veams starts without an `EVENTS` object. |
| 36 | Closes the suite. |

## `src/react/index.ts`

| Lines | Explanation |
| --- | --- |
| 1-6 | Re-exports the intentionally small React surface: provider, hooks, and provider prop type. |

## `src/react/vent-provider.tsx`

| Lines | Explanation |
| --- | --- |
| 1 | Imports React primitives needed for context and effect-managed subscriptions. |
| 3 | Imports the root event types without pulling runtime code twice. |
| 5-8 | Defines the provider props: children plus a concrete Vent instance. |
| 10 | Creates the shared React context with `null` as the missing-provider sentinel. |
| 12-21 | Implements `VentProvider`, which writes the provided handler into context for descendants. |
| 23-31 | Implements `useVent`, which reads the context and throws a clear error when no provider exists. |
| 33-37 | Starts the `useVentSubscribe` hook signature. |
| 38 | Reads the current Vent instance from context. |
| 39 | Stores the latest callback in a ref so resubscription is not tied to callback identity. |
| 41-43 | Keeps the callback ref current after each render. |
| 45-55 | Subscribes on mount/topic change and unsubscribes on cleanup, while delegating actual callback work to the latest ref value. |
| 56 | Closes the hook. |

## `src/react/__tests__/vent-provider.spec.tsx`

| Lines | Explanation |
| --- | --- |
| 1-5 | Import React test helpers, the event factory, and the React Vent API under test. |
| 7-11 | Declare the React 19 `act()` environment flag for Jest. |
| 13 | Defines the typed topics used by the test bus. |
| 15-17 | Defines the payload shape used in React tests. |
| 19-29 | Creates a consumer component that reads the bus from context and exposes it to the test. |
| 31-41 | Creates a subscriber component that uses `useVentSubscribe`. |
| 43 | Starts the React provider test suite. |
| 44-45 | Declares DOM container handles shared across tests. |
| 47-49 | Enables the React `act()` environment before all tests. |
| 51-55 | Creates a fresh DOM container and root before each test. |
| 57-63 | Unmounts and removes the DOM container after each test. |
| 65-67 | Resets the `act()` environment flag after all tests. |
| 69-82 | Verifies the provider exposes the exact bus instance through `useVent`. |
| 84-116 | Verifies subscription works and cleanup stops future notifications after unmount. |
| 118-155 | Verifies a new callback prop does not force a resubscribe, while the latest callback still runs. |
| 157-168 | Verifies `useVent` throws the intended error outside a provider. |
| 169 | Closes the suite. |

## `README.md`

| Lines | Explanation |
| --- | --- |
| 1-3 | Introduce the package and its purpose. |
| 5-9 | Show installation. |
| 11-23 | List root and subpath exports. |
| 25-51 | Show the root quick start, including multi-topic subscription support. |
| 53-67 | Show how the dedicated plugin entry integrates with Veams. |
| 69-94 | Show the intentionally narrow React entrypoint. |
| 96-112 | Summarize the public API methods and aliases. |

## `CHANGELOG.md`

| Lines | Explanation |
| --- | --- |
| 1-2 | Record the modern ESM release milestone. |
| 4-5 | Record removal of the old VeamsDOM dependency. |
| 7-8 | Record an older repository metadata fix. |
| 10-12 | Record the initial release. |
