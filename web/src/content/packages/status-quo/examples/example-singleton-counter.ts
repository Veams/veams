import type { PackagePage } from '../../../types';
import {
  statusQuoSingletonComponentExample,
  statusQuoSingletonHandlerExample,
} from '../shared-snippets';

export const exampleSingletonCounterPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use `makeStateSingleton()` only when several consumers truly need the same handler instance.',
        'The singleton owns lifecycle, so components only subscribe to it.',
        'This is the promotion path from local state to shared state.',
      ],
      codeExamples: [
        {
          code: statusQuoSingletonHandlerExample,
          label: 'Counter singleton handler',
          language: 'ts',
        },
        {
          code: statusQuoSingletonComponentExample,
          label: 'Counter singleton consumers',
          language: 'tsx',
        },
      ],
      id: 'singleton-example',
      paragraphs: [
        'This example shows the moment where local state should become shared state. The handler is lifted into a singleton because both panels need the same counter value and neither component should recreate the instance.',
        'The handler file only defines the shared counter and exports the singleton. The React file stays thin and uses `useStateSingleton()` from two different consumers.',
      ],
      liveExample: 'status-quo-singleton-workspace',
      title: 'Singleton counter shared across consumers',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-singleton-counter',
  intro:
    'Promote local state to shared state only when multiple consumers need one handler instance.',
  summary: 'One counter handler shared by multiple consumers.',
  title: 'Singleton counter shared across consumers',
};
