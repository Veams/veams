import type { PackagePage } from '../../../types';
import { statusQuoQueryReactiveDependenciesExample } from '../shared-snippets';

export const exampleReactiveDependenciesPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryReactiveDependenciesExample,
          label: 'Reactive tracked dependency example',
          language: 'ts',
        },
      ],
      id: 'reactive-dependency-example',
      paragraphs: [
        'Two source query handles resolve first. The downstream query derives its final key from them.',
      ],
      title: 'Reactive dependency example',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-reactive-dependencies',
  intro: 'Use `dependsOn` when a query should read upstream query handles before it runs.',
  summary: 'A downstream query derived from upstream services.',
  title: 'Reactive dependency example',
};
