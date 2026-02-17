# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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

[1.0.0]: https://github.com/Veams/status-quo/releases/tag/v1.0.0
