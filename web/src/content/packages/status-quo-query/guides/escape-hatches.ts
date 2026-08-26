import type { PackagePage } from '../../../types';
import { statusQuoQueryEscapeHatchExample } from './escape-hatches.snippets';

export const escapeHatchesPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryEscapeHatchExample,
          label: 'Unsafe escape hatches',
          language: 'ts',
        },
      ],
      id: 'unsafe-example',
      paragraphs: [
        'These escape hatches are there for advanced cases. They are intentionally marked as unsafe.',
      ],
      title: 'Use escape hatches deliberately',
    },
    {
      callout: 'Unsafe access should be the exception, not the normal integration path.',
      bullets: [
        '`unsafe_getResult()` exposes the raw observer result for one handle.',
        '`unsafe_getClient()` exposes the raw `QueryClient`.',
        'Prefer the smaller facade until it is genuinely insufficient, including `manager.fetchQuery(...)` for one-off reads.',
      ],
      id: 'unsafe-guidelines',
      paragraphs: ['Stay on the smaller facade unless you truly need raw TanStack access.'],
      title: 'Keep the small facade as the default',
    },
  ],
  eyebrow: 'Guides',
  id: 'escape-hatches',
  intro: 'Use escape hatches only when the facade is not enough.',
  summary: 'Stay small unless you need raw access.',
  title: 'Escape Hatches',
};
