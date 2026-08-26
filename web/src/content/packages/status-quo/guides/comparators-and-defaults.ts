import type { PackagePage } from '../../../types';
import {
  statusQuoBindSubscribableExample,
  statusQuoGlobalSetup,
  statusQuoSelectorExample,
} from '../shared-snippets';
import { statusQuoHandlerDistinctExample } from './comparators-and-defaults.snippets';

export const comparatorsAndDefaultsPage: PackagePage = {
  blocks: [
    {
      callout:
        'Comparison rules belong in the handler first. Hook-level equality is the final override.',
      bullets: [
        'Handler-level distinct comparison decides whether updates should propagate at all.',
        'Hook-level `isEqual` only decides whether one selected value should rerender one subscriber.',
        'Treat those as different responsibilities instead of mixing them together in the component.',
      ],
      id: 'comparison-layers',
      paragraphs: [
        'Status Quo has two comparison layers on purpose. The handler owns the broad rule for what counts as a real update. Subscription hooks come later in the pipeline and are best for UI-specific selection.',
      ],
      title: 'Know the two comparison layers',
    },
    {
      codeExamples: [
        {
          code: statusQuoGlobalSetup,
          label: 'Global handler-level distinct comparator',
          language: 'ts',
        },
        {
          code: statusQuoHandlerDistinctExample,
          label: 'Per-handler distinct comparator',
          language: 'ts',
        },
        {
          code: statusQuoSelectorExample,
          label: 'Hook-level custom equality',
          language: 'ts',
        },
      ],
      bullets: [
        'Handler distinct comparison defaults to an `Object.is` fast path with JSON structural fallback, including `Map` and `Set` serialization support.',
        'You can set that rule globally through `setupStatusQuo({ distinct })` or override it on one handler with `options.distinct`.',
        'Hook subscription equality defaults to `Object.is`.',
        'If a selector creates a fresh object, `Object.is` will treat it as changed until you provide a custom equality function.',
      ],
      id: 'comparison-defaults',
      paragraphs: [
        'The defaults differ because the layers differ. Handler distinct comparison is broader and protects the state pipeline itself. Its JSON fallback uses a replacer, so `Map` and `Set` values compare by content instead of collapsing to empty objects. Keep that rule global, or set a different comparator per handler through constructor options. Hook equality is narrower and only filters one selected subscription result.',
      ],
      title: 'Understand the defaults',
    },
    {
      codeExamples: [
        {
          code: statusQuoBindSubscribableExample,
          label: 'Handler-owned comparison with bindSubscribable',
          language: 'ts',
        },
      ],
      bullets: [
        'Prefer handler-owned comparators when the rule belongs to the feature, source sync, or every consumer of that state.',
        'Use hook-level `isEqual` when a single component is projecting a temporary view model or other UI-only shape.',
        'Component-level tuning is possible, but it should stay the exception rather than the place where state semantics live.',
      ],
      id: 'comparison-guidelines',
      paragraphs: [
        'If the same comparison rule would otherwise be copied into several components, move it down into the handler. Keep the state handler as the primary definition of behavior, and let hooks stay thin: subscribe, select, render, trigger actions.',
      ],
      title: 'Keep ownership with the handler',
    },
  ],
  eyebrow: 'Guides',
  id: 'comparators-and-defaults',
  intro:
    'Comparators exist at the handler layer and at the subscription layer. Keep the main rule in the handler. Use hook-level equality only when one component needs local render tuning.',
  summary: 'Handler-first comparison rules, hook-level escape hatches.',
  title: 'Comparators and Defaults',
};
