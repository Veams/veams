import type { PackagePage } from '../../../types';

export const conceptsPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'The FormStateHandler is a plain object that manages values, errors, and validation. It does not depend on any UI library.',
          title: 'Generic Form Engine',
          visual: 'form-architecture',
        },
      ],
      id: 'form-engine',
      paragraphs: [
        '`FormStateHandler` is the core engine. It owns values, errors, touched state, and submit state outside React.',
        'That keeps form logic portable and easy to test.',
      ],
      title: 'The FormStateHandler Engine',
    },
    {
      featureCards: [
        {
          description:
            'The React bindings connect the FormStateHandler to the DOM. They use hooks and refs so inputs stay fast and uncontrolled.',
          title: 'React View Bindings',
          visual: 'form-ref-bridge',
        },
      ],
      id: 'react-bindings',
      paragraphs: [
        'The React layer connects the controller to the DOM through hooks like `useUncontrolledField()`.',
        'Native inputs stay uncontrolled by default, so React rerenders metadata instead of every typed value.',
      ],
      title: 'React Integration & Performance',
    },
    {
      bullets: [
        'Uncontrolled by default: sync the DOM to state only when needed.',
        'Central validation: one validator function for the whole form.',
        'Small subscriptions: components subscribe to single fields to avoid extra renders.',
      ],
      id: 'form-principles',
      paragraphs: ['These rules keep forms predictable and fast.'],
      title: 'Key Principles',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'concepts',
  intro: 'The package separates the generic form engine from the React bindings.',
  summary: 'Generic engine with optimized React bindings.',
  title: 'Concepts',
};
