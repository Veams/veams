import type { PackagePage } from '../../../types';
import { statusQuoQueryTrackedPairExample } from './example-tracked-pair.snippets';

export const exampleTrackedPairPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryTrackedPairExample,
          label: 'Paired tracked factories',
          language: 'ts',
        },
      ],
      id: 'tracked-pair-example',
      paragraphs: [
        'Declare dependency names once and reuse them across the tracked query and mutation.',
      ],
      title: 'Paired tracked workflow',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-tracked-pair',
  intro: 'Use the paired helper when one flow shares the same dependency names.',
  summary: 'Declare dependency keys once.',
  title: 'Paired tracked workflow',
};
