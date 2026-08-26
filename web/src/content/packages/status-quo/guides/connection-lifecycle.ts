import type { PackagePage } from '../../../types';
import {
  statusQuoConnectionLifecycleBadExample,
  statusQuoConnectionLifecycleGoodExample,
} from './connection-lifecycle.snippets';

export const connectionLifecyclePage: PackagePage = {
  blocks: [
    {
      callout: 'Constructors create snapshots. Connection lifecycle starts effects.',
      codeExamples: [
        {
          code: statusQuoConnectionLifecycleBadExample,
          description:
            'This starts a query subscription and animation timer during construction. In React, `useStateHandler()` creates the instance during render, so these effects can run before commit.',
          label: 'Bad: constructor starts effects',
          language: 'ts',
        },
        {
          code: statusQuoConnectionLifecycleGoodExample,
          description:
            'The constructor stays render-safe. `onConnect()` starts the query binding and timer after a mounted subscriber exists; `onDisconnect()` stops feature-specific effects.',
          label: 'Good: effects start on connect',
          language: 'ts',
        },
      ],
      id: 'connection-lifecycle-example',
      paragraphs: [
        'A handler instance should be cheap to create and safe to inspect. Build the initial state, normalize options, keep injected dependencies, and expose a working `getSnapshot()` from the constructor. Start external work only when a consumer actually subscribes.',
      ],
      title: 'Keep constructors render-safe',
    },
    {
      bullets: [
        'Use `onConnect()` for query observers, router listeners, DOM listeners, browser events, timers, intervals, and handler-to-handler subscriptions that should only be live while the handler has mounted consumers.',
        'Use `onDisconnect()` for feature cleanup that is not already represented as a managed subscription, such as cancelling animation frames or clearing timer handles.',
        'Use `bindSubscribable()` inside `onConnect()` for stable live bindings; the base handler clears managed bindings after `onDisconnect()`.',
        'Keep pure initialization in the constructor: initial snapshot shaping, option normalization, dependency assignment, and action setup.',
      ],
      id: 'when-to-use-connection-lifecycle',
      paragraphs: [
        'Use the connection lifecycle whenever the handler watches something outside itself or schedules future work. If the code would need an unsubscribe, cancel, removeEventListener, or clearTimeout path, it belongs in `onConnect()` and `onDisconnect()`, not in the constructor.',
      ],
      title: 'When to use it',
    },
    {
      bullets: [
        '`new Handler()` must not subscribe, add listeners, start timers, or kick off animations.',
        '`handler.getSnapshot()` should work before `connect()`.',
        'The first committed subscriber connects the handler; the last subscriber disconnects it after a deferred cleanup tick.',
        'Multiple subscribers are safe because `BaseStateHandler` ref-counts `connect()` and `disconnect()`.',
        '`destroy()` remains final cleanup and also closes any active connection.',
      ],
      id: 'connection-lifecycle-rules',
      paragraphs: [
        'This keeps React Strict Mode and render retries from accidentally duplicating external effects. Development may still connect and disconnect more often, but construction stays pure and effect work happens after commit.',
      ],
      title: 'Rules of thumb',
    },
  ],
  eyebrow: 'Guides',
  id: 'connection-lifecycle',
  intro:
    'Use connection lifecycle for external effects so handler construction stays pure and render-safe.',
  summary: 'Pure constructors, connected effects.',
  title: 'Connection Lifecycle',
};
