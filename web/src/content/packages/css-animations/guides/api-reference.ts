import type { PackagePage } from '../../../types';
import { cssAnimationsVarsUsage } from './api-reference.snippets';

export const apiReferencePage: PackagePage = {
  blocks: [
    {
      paragraphs: [
        'This package does not expose runtime functions. The public API is a small set of constants, types, and stylesheet entry points.',
      ],
      id: 'entry-points',
      title: 'Entry points',
    },
    {
      bullets: [
        '`ANIMATIONS` is the runtime constant export from the root package.',
        'It groups animation class names under `IN_OUT` and `FEEDBACK`, with nested categories such as `CAROUSEL`, `MOVE`, and `SCALE`.',
        'Use it when components should reference animation class names without hard-coded strings.',
      ],
      id: 'animations-constant',
      paragraphs: [
        'This is the main JavaScript-facing API surface. It gives you a typed object tree for class names instead of requiring string literals throughout the app.',
      ],
      title: 'ANIMATIONS',
    },
    {
      bullets: [
        '`AnimationName` is the exported union type of all values inside `ANIMATIONS`.',
        'Use it when props, helpers, or configuration objects should only accept valid animation class names.',
        'It stays in sync with the constant tree because the type is derived from `ANIMATIONS`.',
      ],
      id: 'animation-name-type',
      paragraphs: [
        'This is the type-safe counterpart to the `ANIMATIONS` constant and the main TypeScript reference surface of the package.',
      ],
      title: 'AnimationName',
    },
    {
      bullets: [
        'Use `pkg:@veams/css-animations/scss/animations/*.scss` when you want one specific Sass animation module instead of the whole bundle.',
        'The package exports Sass subpaths with `.scss` filenames so the Sass Node package importer can resolve them via `pkg:` URLs.',
        'Use these subpaths when bundle size or stylesheet ownership matters more than one-shot convenience.',
      ],
      id: 'animations-subpath',
      paragraphs: [
        'The wildcard animation subpath is the granular import surface of the package. It exists so teams can compose only the animations they actually ship.',
      ],
      title: 'animations/*',
    },
    {
      bullets: [
        'Import `@veams/css-animations/index.css` when you want the compiled bundle directly.',
        'This is the quickest path for non-Sass setups or prototypes that just need the shipped CSS classes and keyframes.',
        'Use it when you do not need Sass composition or per-animation imports.',
      ],
      id: 'index-css-entry',
      paragraphs: ['The compiled CSS entry is the plain-CSS distribution surface of the package.'],
      title: 'index.css',
    },
    {
      bullets: [
        'Use `pkg:@veams/css-animations/scss/mixins.scss` when a Sass module needs the low-level shared helpers from the package.',
        'This entry mainly exposes the internal keyframe helper that the animation source files build on.',
        'Use it when you are extending the package internals rather than consuming the public animation modules.',
      ],
      id: 'mixins-entry',
      paragraphs: ['The mixins entry is the composition-oriented Sass surface of the package.'],
      title: 'mixins',
    },
    {
      codeExamples: [
        {
          code: cssAnimationsVarsUsage,
          label: 'CSS Variables',
          language: 'css',
        },
      ],
      bullets: [
        'Use `pkg:@veams/css-animations/scss/variables.scss` when Sass files need the package variable definitions.',
        'The runtime CSS also respects the exposed custom properties, so values can be overridden in `:root` or a local scope.',
        'Use this entry when a team wants theming or timing overrides without forking the animation source.',
      ],
      id: 'variables-entry',
      paragraphs: [
        'The variables entry is the customization surface of the package. It is how you change timing, easing, or colors while staying on the supported public API.',
      ],
      title: 'variables',
    },
  ],
  eyebrow: 'Guides',
  id: 'api-reference',
  intro:
    'Use the root export for constants and types, then pick the stylesheet entry point that matches your build pipeline.',
  summary: 'Constants, types, and style entry points.',
  title: 'API Reference',
};
