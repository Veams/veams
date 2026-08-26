import type { PackagePage } from '../../../types';
import { statusQuoNamedBindSubscribableExample } from '../shared-snippets';
import {
  statusQuoBaseCompositionExample,
  statusQuoShortcutCompositionExample,
} from './composition.snippets';

export const compositionPage: PackagePage = {
  blocks: [
    {
      callout:
        'Shortcuts are for components. Base hooks are there when the shortcut starts hiding too much.',
      codeExamples: [
        {
          code: statusQuoBaseCompositionExample,
          label: 'Base composition',
          language: 'tsx',
        },
        {
          code: statusQuoShortcutCompositionExample,
          label: 'Shortcut composition',
          language: 'tsx',
        },
      ],
      bullets: [
        '`useStateFactory()` is the normal fast path for local state.',
        '`useStateSingleton()` is the same shortcut when the instance is shared.',
        'Drop to `useStateHandler()` plus `useStateActions()` and `useStateSubscription()` when you want to split those concerns on purpose.',
      ],
      id: 'hooks-composition',
      paragraphs: [
        'Most of the time, the shortcut APIs are exactly what you want. They keep component code small and readable. The lower-level hooks are still worth knowing because they let you subscribe narrowly, grab actions without state, or stage the pieces separately.',
      ],
      title: 'Base hooks versus shortcuts',
    },
    {
      codeExamples: [
        {
          code: statusQuoNamedBindSubscribableExample,
          label: 'List and selected item binding',
          language: 'ts',
        },
      ],
      bullets: [
        'Keep syncing logic inside the handler instead of scattering it across component effects.',
        '`bindSubscribable()` works with any source that exposes `subscribe()` and optionally `getSnapshot()`.',
        'Pass a subscription name when later binds should replace an earlier sync instead of stacking another listener.',
        'This is useful when an action needs to refresh upstream wiring without leaking the previous subscription.',
        'Selectors and equality checks matter here too, especially when noisy upstream changes should not trigger work.',
      ],
      id: 'handler-composition',
      paragraphs: [
        '`bindSubscribable()` is the low-level composition tool. Use it when one handler should react to another handler, a singleton, or another subscribable source. Named bindings are the safer option when the same sync may be re-established later from an action or lifecycle branch.',
      ],
      title: 'Compose handlers, not components',
    },
  ],
  eyebrow: 'Guides',
  id: 'composition',
  intro:
    'There are two kinds of composition here: wiring hooks in React and wiring handlers to other subscribable sources.',
  summary: 'Shortcuts when you can. Low-level when it pays off.',
  title: 'Composition',
};
