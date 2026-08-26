import type { PackagePage } from '../../../types';
import { statusQuoBindSubscribableExample, statusQuoSelectorExample } from '../shared-snippets';
import {
  statusQuoSelectorProvidedExample,
  statusQuoSelectorSimpleExample,
  statusQuoSelectorSingletonExample,
} from './selectors.snippets';

export const selectorsPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoSelectorSimpleExample,
          label: 'Simple selector',
          language: 'ts',
        },
        {
          code: statusQuoSelectorExample,
          label: 'Selector with equality',
          language: 'ts',
        },
      ],
      id: 'selector-example',
      paragraphs: [
        'If a component only cares about `user.profile`, subscribe to `user.profile`. Selectors keep the store in one piece without pushing the whole state tree through every consumer.',
      ],
      title: 'Subscribe to the slice that matters',
    },
    {
      codeExamples: [
        {
          code: statusQuoSelectorProvidedExample,
          label: 'Provider-scoped selector',
          language: 'ts',
        },
        {
          code: statusQuoSelectorSingletonExample,
          label: 'Singleton selector',
          language: 'ts',
        },
      ],
      id: 'selector-surfaces',
      paragraphs: [
        'Selectors are not limited to one hook. The same pattern applies when the source comes from provider scope or a singleton.',
      ],
      title: 'Use selectors on every subscription surface',
    },
    {
      codeExamples: [
        {
          code: statusQuoBindSubscribableExample,
          label: 'Selector-style derivation with bindSubscribable',
          language: 'ts',
        },
      ],
      id: 'selector-bind-subscribable',
      paragraphs: [
        'Selectors are also useful inside handlers. `bindSubscribable()` lets you map upstream state into a derived slice and skip noisy updates with an equality check, so the same “listen only to what matters” rule applies beyond React hooks.',
      ],
      title: 'Apply selector thinking in handler composition',
    },
    {
      callout: 'Selectors are the main tool for limiting rerenders.',
      bullets: [
        'Subscribe to full state only when the component really needs all of it.',
        'Reach for a selector as soon as one branch of state clearly drives the UI.',
        'Add an equality function when the default `Object.is` check is still too noisy.',
      ],
      id: 'selector-guidelines',
      paragraphs: [
        'This is the practical scaling tool in Status Quo. One handler stays whole while each consumer only asks for the part it renders.',
      ],
      title: 'Keep rerenders boring',
    },
  ],
  eyebrow: 'Guides',
  id: 'selectors',
  intro:
    'Do not pipe the whole handler into every component just because it is easy. Subscribe to the part that really drives the UI.',
  summary: 'Listen to less. Rerender less.',
  title: 'Selectors',
};
