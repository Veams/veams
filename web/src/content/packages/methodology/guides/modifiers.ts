import type { PackagePage } from '../../../types';
import {
  methodologyModifierExampleCss,
  methodologyModifierExampleMarkup,
} from './modifiers.snippets';

export const modifiersPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use `.is-` or `.isnt-`, `has-` or `hasnt-` for modifiers.',
        'Modifiers should only change a small part of the context.',
      ],
      id: 'role',
      paragraphs: [
        'Modifiers are for small changes to the appearance of an instrument. Use them when the change is too small to justify a full context.',
      ],
      title: 'Modifiers',
    },
    {
      codeExamples: [
        {
          code: methodologyModifierExampleMarkup,
          label: 'Modifier markup',
          language: 'html',
        },
        {
          code: methodologyModifierExampleCss,
          label: 'Modifier styling',
          language: 'css',
        },
      ],
      id: 'example',
      paragraphs: [
        'A modifier should read like a variation on an existing thing, not like a brand-new component family.',
      ],
      title: 'Keep the base instrument visible',
    },
  ],
  eyebrow: 'Guides',
  id: 'modifiers',
  intro: 'Modifiers are for variations on a thing, not replacements for the thing.',
  summary: 'Change state without changing names.',
  title: 'Modifiers',
};
