import type { PackagePage } from '../../../types';
import { cssAnimationsCssUsage, cssAnimationsScssUsage } from './usage.snippets';

export const usagePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: cssAnimationsScssUsage,
          label: 'SCSS usage',
          language: 'scss',
        },
      ],
      id: 'scss-usage',
      paragraphs: [
        'For Sass users, the package provides a modular set of mixins. You can `@use` the full bundle or only the variables and animation modules you need, which keeps your CSS small.',
        'When using feedback animations, remember to include `@include fb-setup;` on the target element to initialize the required pseudo-element styling.',
      ],
      title: 'SCSS Mixins',
    },
    {
      codeExamples: [
        {
          code: cssAnimationsCssUsage,
          label: 'CSS usage',
          language: 'css',
        },
      ],
      id: 'css-usage',
      paragraphs: [
        'If you prefer plain CSS, the package ships with pre-compiled versions of every animation. These files include both the `@keyframes` definitions and a corresponding utility class (e.g., `.fb-border-simple`).',
      ],
      title: 'Pre-compiled CSS',
    },
  ],
  eyebrow: 'Guides',
  id: 'usage',
  intro: 'Learn how to integrate animations via SCSS mixins or plain CSS imports.',
  summary: 'Mixins and CSS imports.',
  title: 'Usage Guide',
};
