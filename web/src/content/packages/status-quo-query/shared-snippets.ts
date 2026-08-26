export const statusQuoQueryQuickStart = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);
const applicationId = 'app-1';
const productId = 'product-1';

const fetchProduct = async (currentApplicationId: string, currentProductId: string) => ({
  applicationId: currentApplicationId,
  name: 'Ada',
  productId: currentProductId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => ({
  ...variables,
  saved: true as const,
});

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

const productQuery = createQuery(
  ['product', { deps: { applicationId, productId }, view: { page: 1 } }],
  () => fetchProduct(applicationId, productId),
  { enabled: false }
);

const updateProduct = createMutation(saveProduct, {
  invalidateOn: 'success',
});

await productQuery.refetch();
await updateProduct.mutate({
  applicationId,
  productId,
  productName: 'Ada',
});`;

export const statusQuoQueryReactiveDependenciesExample = `import { QueryClient } from '@tanstack/query-core';
import {
  setupQueryManager,
  type QueryDependencyTuple,
} from '@veams/status-quo-query';

type User = {
  companyId: string;
  role: 'analyst' | 'viewer';
};

type Config = {
  region: string;
  companyProfileEnabled: boolean;
};

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const userQuery = manager.createQuery(['user', { deps: { userId: '42' } }] as const, async () => ({
  companyId: 'company-7',
  role: 'analyst' as const,
}));

const configQuery = manager.createQuery(['config', { deps: { scope: 'global' } }] as const, async () => ({
  region: 'eu',
  companyProfileEnabled: true,
}));

const companyProfileQuery = manager.createQuery(
  ['company-profile', { deps: { companyId: 'pending', region: 'pending' }, view: { kind: 'profile' } }],
  ({ queryKey }) => fetchCompanyProfile(queryKey[1].deps.companyId, queryKey[1].deps.region),
  {
    enabled: false,
    dependsOn: <QueryDependencyTuple<[User, Config]>>[
      [userQuery, configQuery],
      ([userSnapshot, configSnapshot]) => {
        const companyId = userSnapshot.data?.companyId;
        const region = configSnapshot.data?.region;

        if (!companyId || !region || !configSnapshot.data?.companyProfileEnabled) {
          return { enabled: false };
        }

        return {
          enabled: true,
          queryKey: [
            'company-profile',
            {
              deps: { companyId, region },
              view: { kind: 'profile' },
            },
          ],
        };
      },
    ],
  }
);

await companyProfileQuery.refetch();`;

export const statusQuoQueryReactSubscriptionExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';
import { useQueryHandle } from '@veams/status-quo-query/react';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const companyQuery = manager.createUntrackedQuery(
  ['company', 'company-7'] as const,
  async () => ({ id: 'company-7', name: 'North Hub' }),
  { enabled: false }
);

function CompanyHeader() {
  const snapshot = useQueryHandle(companyQuery);

  if (snapshot.isPending) {
    return <p>Loading company...</p>;
  }

  if (snapshot.isError) {
    return <p>Could not load company.</p>;
  }

  return (
    <header>
      <h2>{snapshot.data?.name}</h2>
      <button onClick={() => void companyQuery.refetch()} type="button">
        Refresh
      </button>
    </header>
  );
}`;

export const statusQuoQueryInvalidateExample = `await userQuery.invalidate({ refetchType: 'none' });
await manager.invalidateQueries({ queryKey: ['user'] });

manager.setQueryData(['user', 42], (current) =>
  current ? { ...current, name: 'Ada' } : current
);`;
