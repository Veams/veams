import type { PackagePage } from '../../../types';
import { formOverviewCards } from './overview.snippets';

export const overviewPage: PackagePage = {
  blocks: [
    {
      featureCards: formOverviewCards,
      id: 'ownership-map',
      paragraphs: ['Feature state owns form state. React only binds inputs to that controller.'],
      title: 'Ownership map',
    },
    {
      bullets: [
        'The root entrypoint works without any UI framework.',
        'React bindings live under `@veams/form/react`.',
        'A feature handler can own the form handler instead of React owning it.',
      ],
      id: 'shape',
      paragraphs: [
        'The root package gives you `FormStateHandler`. The React entrypoint only handles field bindings.',
      ],
      title: 'Keep the form model generic',
    },
    {
      bullets: [
        'Validation lives close to the values.',
        'Touched state is stored explicitly, not guessed from component flags.',
        'Submit state is part of the same form snapshot.',
      ],
      id: 'why',
      paragraphs: ['Keep values, errors, touched state, and submit state in one place.'],
      title: 'One handler for the full form lifecycle',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'Typed values, errors, touched state, and submit state in one handler.',
    'A root API that does not depend on React.',
    'React helpers for uncontrolled native fields and controlled third-party inputs.',
  ],
  heroParagraphs: [
    'VEAMS Form keeps ownership clear: one generic controller, plus optional React bindings for the view.',
  ],
  id: 'overview',
  intro:
    'Start with the package split: generic form state at the root, React bindings under `@veams/form/react`.',
  summary: 'Explicit form state with optional React wiring.',
  title: 'Overview',
};
