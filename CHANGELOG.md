# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.3.0] - 2026-02-25

### Added
- `setupStatusQuo(config)` runtime setup for global distinct update behavior.

### Changed
- Handler distinct comparison now supports global defaults (`setupStatusQuo`) with per-handler override precedence.

## [1.2.0] - 2026-02-25

### Added
- New composable hook APIs:
  - `useStateHandler(factory, params?)`
  - `useStateActions(handler)`
  - `useStateSubscription(source, selector?, isEqual?)`
- Selector + equality support across shortcut hooks:
  - `useStateFactory(factory, selector?, isEqual?, params?)`
  - `useStateSingleton(singleton, selector?, isEqual?)`
- `StateSingletonOptions` with `destroyOnNoConsumers?: boolean` (default: `true`).
- Ref-counted singleton lifecycle handling so shared singleton instances are only destroyed when the last consumer unmounts.
- New hook test coverage for:
  - composed API usage (`useStateHandler + useStateActions + useStateSubscription`)
  - selector subscriptions with and without custom equality
  - singleton subscription behavior and `destroyOnNoConsumers: false`
  - full-snapshot subscription behavior.

### Changed
- `useStateFactory` now composes `useStateHandler` + `useStateSubscription` internally.
- `useStateSubscription` now:
  - accepts either `StateSubscriptionHandler` or `StateSingleton`
  - returns `[selectedState, actions]`
  - supports selector/equality without requiring separate selector-specific hook APIs.
- `useStateSingleton` is now a shortcut over `useStateSubscription(singleton, selector?, isEqual?)`.
- `makeStateSingleton` now accepts options and manages instance destruction through explicit lifecycle controls.
- Public exports extended:
  - Added `useStateHandler`, `useStateActions`, `useStateSubscription`
  - Added exported `StateSingletonOptions` type.
- Observable handler naming aligned with signal convention:
  - Added `getObservable(key)` as the canonical API.

### Deprecated
- `ObservableStateHandler#getObservableItem(key)` is now deprecated in favor of `getObservable(key)`.

### Documentation
- README rewritten with a dedicated API guide that documents base composition, shortcut composition, singleton lifecycle options, and usage examples.
- Playground documentation significantly expanded:
  - dedicated API section grouped by base composition, shortcut composition, and helper functions
  - clearer singleton lifecycle explanation and examples
  - improved card hierarchy and spacing for readability
  - responsive/toggleable navigation for better mobile usage.

## [1.0.0] - 2026-02-17

### Added
- `SignalStateHandler` (signals-backed state handler).
- `BaseStateHandler` to share devtools and lifecycle APIs.
- `bindSubscribable` helper for managing external subscriptions.
- Playground/demo with GitHub Pages deployment.

### Changed
- `StateHandler` renamed to `ObservableStateHandler`.
- `StateSubscriptionHandler` now uses `subscribe/getSnapshot` (no `getObservable`).
- Devtools options moved under `options.devTools`.

### Migration
- Update imports:
  - From: `StateHandler`
  - To: `ObservableStateHandler`
- Implement `subscribe()` and `getSnapshot()` on custom handlers.
- Replace `getObservable()` usage with `subscribe()` in custom integrations.
- Update devtools config:
  - From: `super({ initialState, devTools: { ... } })`
  - To: `super({ initialState, options: { devTools: { ... } } })`

[1.3.0]: https://github.com/Veams/status-quo/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Veams/status-quo/compare/v1.0.0...v1.2.0
[1.0.0]: https://github.com/Veams/status-quo/releases/tag/v1.0.0
