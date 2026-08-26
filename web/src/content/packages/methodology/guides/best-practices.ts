import type { PackagePage } from '../../../types';
import {
  methodologyCommentsExample,
  methodologyMediaQueryBadExample,
  methodologyMediaQueryGoodExample,
  methodologyVariablesExample,
} from './best-practices.snippets';

export const bestPracticesPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Local variables should be prefixed with the component name: `$c-picture-border-color`.',
        'Global variables should be written in standard way: `$color-white`.',
        'Variables should follow a simple pattern: type, followed by category and its name.',
      ],
      codeExamples: [
        {
          code: methodologyVariablesExample,
          label: 'Variable naming',
          language: 'scss',
        },
      ],
      id: 'variables',
      paragraphs: ['It should be easy to tell global and local variables apart.'],
      title: 'Variables',
    },
    {
      codeExamples: [
        {
          code: methodologyCommentsExample,
          label: 'Comment style',
          language: 'scss',
        },
      ],
      id: 'comments',
      paragraphs: [
        'Please comment your styles whenever you see the need to. At the beginning of the selector add your comment with `// [number]: message`. Use `[number]` next to your key-value pair.',
      ],
      title: 'Comments',
    },
    {
      bullets: [
        'Resist Nesting: Minimize nesting as much as possible.',
        'Do repeat yourself: gzip will squash extra bytes.',
        'Media Query Nesting: Do not define classes in your media query blocks.',
        'Do not mix components: Avoid declaring two component classes for one HTML element.',
      ],
      id: 'styling-rules',
      paragraphs: ['These principles help maintain a clean and scalable CSS codebase.'],
      title: 'Styling Rules',
    },
    {
      codeExamples: [
        {
          code: methodologyMediaQueryGoodExample,
          label: 'Good',
          language: 'scss',
        },
        {
          code: methodologyMediaQueryBadExample,
          label: 'Bad',
          language: 'scss',
        },
      ],
      id: 'mq-nesting',
      paragraphs: ['Keep media queries nested inside the selector they affect.'],
      title: 'Media Query Nesting',
    },
  ],
  eyebrow: 'Guides',
  id: 'best-practices',
  intro: 'Consistency and clarity are the keys to a maintainable stylesheet.',
  summary: 'Maintainable styles by design.',
  title: 'SCSS Best Practices',
};
