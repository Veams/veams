export const statusQuoQueryKeyShapeExample = `import type { TrackedQueryKey } from '@veams/status-quo-query';

const productListKey: TrackedQueryKey<{
  applicationId: string;
  categoryId: string;
}> = [
  'products',
  {
    deps: {
      applicationId: 'app-1',
      categoryId: 'hardware',
    },
    view: {
      page: 2,
      search: 'adapter',
      sort: 'price-desc',
    },
  },
] as const;

const productDetailKey: TrackedQueryKey<{
  applicationId: string;
  productId: string;
}> = [
  'product',
  {
    deps: {
      applicationId: 'app-1',
      productId: 'product-42',
    },
  },
] as const;

// deps:
// domain identity used for tracked invalidation
//
// view:
// presentation variant kept in the cache key,
// but ignored by tracked invalidation`;
