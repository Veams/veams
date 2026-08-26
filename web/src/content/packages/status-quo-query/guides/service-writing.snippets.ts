export const statusQuoQueryServiceGuideExample = `import type {
  QueryHandle,
  QueryHandleData,
  QueryHandleSnapshot,
} from '@veams/status-quo-query';

type Company = {
  id: string;
  name: string;
};

// Shared key factories keep the live handle path and snapshot path aligned.
const companiesQueryKey = ['companies'] as const;
const companyByIdQueryKey = (companyId: string) => ['company', companyId] as const;

export interface CompanyQueryHandler {
  getCompaniesQuery: () => QueryHandle<Company[], Error>;
  getCompanyQueryById: (companyId: string) => QueryHandle<Company, Error>;
  getCompanyStateById: (companyId: string) => QueryHandleSnapshot<Company, Error>;
  getCompanyDataById: (companyId: string) => QueryHandleData<Company, Error>;
}

export function createCompanyQueryHandler(): CompanyQueryHandler {
  const manager = getQueryManager();

  return {
    // Return a fresh query handle when callers need commands or subscriptions.
    getCompaniesQuery() {
      return manager.createUntrackedQuery(companiesQueryKey, fetchCompanies, {
        staleTime: companyStaleTime,
      });
    },
    // Parameterized query handles are cheap and map directly to the final query key.
    getCompanyQueryById(companyId) {
      const queryKey = companyByIdQueryKey(companyId);

      return manager.createUntrackedQuery(queryKey, () => fetchCompanyById(companyId), {
        staleTime: companyStaleTime,
      });
    },
    // Snapshot-only reads should use the manager cache APIs instead of building another handle.
    getCompanyStateById(companyId) {
      const queryKey = companyByIdQueryKey(companyId);
      const state = manager.getQueryState(queryKey);

      return {
        data: manager.getQueryData(queryKey),
        error: (state?.error as Error | null | undefined) ?? null,
        fetchStatus: state?.fetchStatus ?? 'idle',
        status: state?.status ?? 'pending',
        isError: state?.status === 'error',
        isFetching: state?.fetchStatus === 'fetching',
        isPending: state?.status === 'pending',
        isSuccess: state?.status === 'success',
      };
    },
    // Data-only reads can stay even smaller when the caller does not need fetch meta state.
    getCompanyDataById(companyId) {
      const queryKey = companyByIdQueryKey(companyId);
      const state = manager.getQueryState(queryKey);

      return {
        data: manager.getQueryData(queryKey),
        error: (state?.error as Error | null | undefined) ?? null,
      };
    },
  };
}`;
