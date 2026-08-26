import type { PackagePage } from '../../../types';
import {
  statusQuoSelectorComponentExample,
  statusQuoSelectorHandlerExample,
} from './example-selector-optimization.snippets';

export const exampleSelectorOptimizationPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Selectors let you limit rerenders without splitting the handler apart.',
        'Return only the slice the component renders, then add an equality function when the selector creates new objects.',
        'Compare render counts to see the optimization, not just the API surface.',
      ],
      codeExamples: [
        {
          code: statusQuoSelectorHandlerExample,
          label: 'Profile handler',
          language: 'ts',
        },
        {
          code: statusQuoSelectorComponentExample,
          label: 'Selector-optimized components',
          language: 'tsx',
        },
      ],
      id: 'selector-example',
      paragraphs: [
        'This example focuses on selector optimization rather than ownership. One component subscribes to a derived identity object with a custom equality function, while another subscribes to the full snapshot and rerenders on every change.',
        'The demo makes the tradeoff visible. Toggle unrelated UI state and watch the selector-driven card stay stable until the selected name or role actually changes.',
      ],
      liveExample: 'status-quo-selector-profile',
      title: 'Selector optimization with custom equality',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-selector-optimization',
  intro: 'Use selectors to minimize rerenders while keeping one coherent handler model.',
  summary: 'Selector-based rerender control with custom equality.',
  title: 'Selector optimization with custom equality',
};
