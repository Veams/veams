# Changelog

## Unreleased

- Fixed `QueryHandle.subscribe(...)` to mount the TanStack `QueryClient` lifecycle while a query handle subscription is active, restoring `refetchOnWindowFocus` and reconnect behavior for stale subscribed queries.
- Documented how `staleTime`, `refetchOnWindowFocus`, `bindSubscribable(...)`, and passive cache reads interact in the wrapper.

## 0.1.0

- Initial package scaffold for TanStack Query and mutation services.
