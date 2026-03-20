import {
  MutationObserver,
  type MutationFunction,
  type MutateOptions,
  type MutationObserverOptions,
  type MutationObserverResult,
  type MutationStatus as TanstackMutationStatus,
  type QueryClient,
} from '@tanstack/query-core';

export type MutationStatus = TanstackMutationStatus;

export interface MutationServiceSnapshot<TData = unknown, TError = Error, TVariables = void> {
  data: TData | undefined;
  error: TError | null;
  status: MutationStatus;
  variables: TVariables | undefined;
  isError: boolean;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
}

export interface MutationService<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
> {
  getSnapshot: () => MutationServiceSnapshot<TData, TError, TVariables>;
  subscribe: (
    listener: (snapshot: MutationServiceSnapshot<TData, TError, TVariables>) => void
  ) => () => void;
  mutate: (
    variables: TVariables,
    options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>
  ) => Promise<TData>;
  reset: () => void;
  unsafe_getResult: () => MutationObserverResult<TData, TError, TVariables, TOnMutateResult>;
}

export type MutationServiceOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
> = Omit<MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>, 'mutationFn'>;

export interface CreateMutation {
  <TData = unknown, TError = Error, TVariables = void, TOnMutateResult = unknown>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: MutationServiceOptions<TData, TError, TVariables, TOnMutateResult>
  ): MutationService<TData, TError, TVariables, TOnMutateResult>;
}

export function setupMutation(queryClient: QueryClient): CreateMutation {
  return function createMutation<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
  >(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: MutationServiceOptions<TData, TError, TVariables, TOnMutateResult>
  ): MutationService<TData, TError, TVariables, TOnMutateResult> {
    const observer = new MutationObserver<TData, TError, TVariables, TOnMutateResult>(
      queryClient,
      {
        ...options,
        mutationFn,
      }
    );

    return {
      getSnapshot: () => toMutationServiceSnapshot(observer.getCurrentResult()),
      subscribe: (listener) =>
        observer.subscribe((result) => {
          listener(toMutationServiceSnapshot(result));
        }),
      mutate: (variables, mutateOptions) => observer.mutate(variables, mutateOptions),
      reset: () => observer.reset(),
      unsafe_getResult: () => observer.getCurrentResult(),
    };
  };
}

function toMutationServiceSnapshot<TData, TError, TVariables, TOnMutateResult>(
  result: MutationObserverResult<TData, TError, TVariables, TOnMutateResult>
): MutationServiceSnapshot<TData, TError, TVariables> {
  return {
    data: result.data,
    error: result.error,
    status: result.status,
    variables: result.variables,
    isError: result.isError,
    isIdle: result.isIdle,
    isPending: result.isPending,
    isSuccess: result.isSuccess,
  };
}
