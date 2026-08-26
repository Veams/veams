import type { PackagePage } from '../../../types';

export const faqPage: PackagePage = {
  blocks: [
    {
      bullets: [
        '`view` is still part of the TanStack cache key, so page 1 and page 2 remain separate cache entries.',
        'Tracked invalidation intentionally matches only `deps`, because pagination, sorting, and filters usually describe presentation variants rather than domain identity.',
        'That split keeps the cache key expressive without turning every UI variant into an invalidation dependency.',
      ],
      id: 'faq-deps-vs-view',
      paragraphs: [
        '`view` still shapes cache identity, but tracked invalidation ignores it on purpose.',
      ],
      title: 'Why `view` is not tracked',
    },
    {
      bullets: [
        'If one mutation truly should refresh only one page, use `query.invalidate()` or `manager.invalidateQueries({ queryKey, exact: true })` for that exact key.',
        'If page-specific invalidation is part of the domain semantics, move that value from `view` into `deps` intentionally.',
        'Broad tracked invalidation is often the right tradeoff after create, delete, rename, or filter-affecting updates because those writes can shift pagination, sorting, and list membership across multiple views.',
      ],
      id: 'faq-narrow-vs-broad',
      paragraphs: [
        'The default favors correctness across related list variants. Narrow invalidation stays available when you need it.',
      ],
      title: 'When to stay broad and when to narrow',
    },
  ],
  eyebrow: 'Guides',
  id: 'faq',
  intro:
    'These questions usually come from the split between cache identity and invalidation semantics.',
  summary: 'Common edge cases.',
  title: 'FAQ',
};
