import type { PackagePage } from '../../../types';
import {
  statusQuoCompositionComponentExample,
  statusQuoCompositionHandlerExample,
} from './example-base-hook-composition.snippets';

export const exampleBaseHookCompositionPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use the base hooks when the shortcut starts hiding too much.',
        'Keep `useStateHandler()`, `useStateActions()`, and `useStateSubscription()` separate when each concern should be explicit.',
        'This composition style works well when the parent should pass the handler down intentionally.',
      ],
      codeExamples: [
        {
          code: statusQuoCompositionHandlerExample,
          label: 'Checklist handler',
          language: 'ts',
        },
        {
          code: statusQuoCompositionComponentExample,
          label: 'Checklist components',
          language: 'tsx',
        },
      ],
      id: 'composition-example',
      paragraphs: [
        'This example stays local, but it deliberately avoids the shortcut. The parent creates one handler instance with `useStateHandler()`, summary components subscribe only to the data they render, and controls read actions separately with `useStateActions()`.',
        'That split is the value of base composition: ownership is still local, but lifecycle, subscriptions, and commands are each expressed in the place that actually needs them.',
      ],
      liveExample: 'status-quo-composition-checklist',
      title: 'Base hook composition without shortcuts',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-base-hook-composition',
  intro: 'Use base hooks directly when ownership and subscriptions should stay explicit.',
  summary: 'Composable lifecycle, subscriptions, and actions.',
  title: 'Base hook composition without shortcuts',
};
