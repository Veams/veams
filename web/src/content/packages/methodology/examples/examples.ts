import type { PackagePage } from '../../../types';
import { methodologyPatternExampleCss, methodologyPatternExampleMarkup } from './examples.snippets';

export const examplesPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: methodologyPatternExampleMarkup,
          label: 'Combined markup',
          language: 'html',
        },
        {
          code: methodologyPatternExampleCss,
          label: 'Combined CSS',
          language: 'css',
        },
      ],
      id: 'combined-example',
      paragraphs: [
        'This slice shows the methodology in practice. A region owns the page band, components own the reusable content pieces, utilities stay small, and modifier or context rules only appear where they are really needed.',
      ],
      title: 'See the pieces together',
    },
  ],
  eyebrow: 'Examples',
  id: 'examples',
  intro: 'Examples work best when the instruments appear together in one realistic page slice.',
  summary: 'See the pieces together.',
  title: 'Examples',
};
