export const statusQuoQueryTrackedLifecycleExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const fetchProducts = async (applicationId: string) => [{ applicationId, productId: 'product-1' }];

const removeProducts = async (variables: { applicationId: string }) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
] as const);

createQuery(
  ['product-list', { deps: { applicationId: 'app-1' }, view: { page: 1 } }],
  () => fetchProducts('app-1')
);

const cleanupProducts = createMutation(removeProducts, {
  invalidateOn: 'settled',
});

await cleanupProducts.mutate({
  applicationId: 'app-1',
});

// 'settled' invalidates after success or error.`;

export const statusQuoQueryTrackedCustomResolverExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const saveProduct = async (variables: {
  payload: { applicationId: string };
  product: { id: string };
  productName: string;
}) => variables;

const trackedMutation = manager.createMutation(saveProduct, {
  resolveDependencies: (variables: {
    payload: { applicationId: string };
    product: { id: string };
  }) => ({
    applicationId: variables.payload.applicationId,
    productId: variables.product.id,
  }),
});

await trackedMutation.mutate({
  payload: { applicationId: 'app-1' },
  product: { id: 'product-1' },
  productName: 'Ada',
});`;
