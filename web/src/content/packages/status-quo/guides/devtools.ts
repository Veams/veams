import type { PackagePage } from '../../../types';
import { statusQuoDevToolsExample, statusQuoGlobalDevToolsSetup } from './devtools.snippets';

export const devtoolsPage: PackagePage = {
  blocks: [
    {
      callout:
        'If the Redux DevTools browser extension is missing, Status Quo logs that once and keeps running without a devtools connection.',
      codeExamples: [
        {
          code: statusQuoGlobalDevToolsSetup,
          label: 'Global default',
          language: 'ts',
        },
        {
          code: statusQuoDevToolsExample,
          label: 'Per-handler override',
          language: 'ts',
        },
      ],
      id: 'devtools-setup',
      paragraphs: [
        'Status Quo can connect handlers to the **Redux DevTools** browser extension without changing the handler model. Turn it on once through `setupStatusQuo({ devTools: { enabled: true } })`, then override per handler with `options.devTools` when you need a custom namespace or want to opt a handler out.',
      ],
      title: 'Wire handlers into Redux DevTools',
    },
    {
      bullets: [
        'Works for `NativeStateHandler`, `ObservableStateHandler`, and `SignalStateHandler`.',
        'Every `setState(nextState, actionName)` call is sent to the Redux DevTools timeline.',
        'If you omit `namespace`, Status Quo uses the handler class name by default.',
      ],
      id: 'devtools-defaults',
      paragraphs: [
        'That class-name fallback is the convenience path when devtools are enabled globally. If you want a stable or shorter label, set `options.devTools.namespace` on that handler explicitly.',
      ],
      title: 'Global defaults, local overrides',
    },
    {
      bullets: [
        'Reset, commit, jump to action, and jump to state are supported from the extension UI.',
        'The handler remains the source of truth; the extension is only a debugging surface.',
        'Explicit action names matter here because they become the timeline labels.',
      ],
      id: 'devtools-behavior',
      paragraphs: [
        'This is intentionally lightweight. Status Quo does not turn handlers into Redux stores. It only mirrors transitions into the extension so you can inspect and replay state changes while keeping the handler model intact.',
      ],
      title: 'What the integration actually does',
    },
  ],
  eyebrow: 'Guides',
  id: 'devtools',
  intro:
    'Use Redux DevTools when you want to inspect handler transitions in the browser without changing the state model itself.',
  summary: 'Inspect transitions with Redux DevTools.',
  title: 'Devtools',
};
