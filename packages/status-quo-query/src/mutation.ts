import {
  // Import MutationObserver to observe and manage mutations.
  MutationObserver,
  // Import type for the mutation function itself.
  type MutationFunction,
  // Import options for executing a mutation.
  type MutateOptions,
  // Import configuration options for the mutation observer.
  type MutationObserverOptions,
  // Import the shape of the result returned by the mutation observer.
  type MutationObserverResult,
  // Import the status enum for mutations from Tanstack Query.
  type MutationStatus as TanstackMutationStatus,
  // Import the central QueryClient to interact with the cache.
  type QueryClient,
} from '@tanstack/query-core';

import {
  type TrackedDependencyRecord,
  type TrackingRegistry,
  type TrackedInvalidateOn,
  type TrackedMatchMode,
  type TrackedDependencyValue,
  pickTrackedDependencies,
  resolveTrackedQueries,
  toTrackedDependencyEntries,
} from './tracking';

// Re-export MutationStatus for consistent naming within the service.
export type MutationStatus = TanstackMutationStatus;

/**
 * Represents a stable snapshot of the mutation service's state.
 */
export interface MutationServiceSnapshot<TData = unknown, TError = Error, TVariables = void> {
  // The data returned from a successful mutation.
  data: TData | undefined;
  // The error object if the mutation failed.
  error: TError | null;
  // The current lifecycle status (idle, pending, success, error).
  status: MutationStatus;
  // The variables used for the most recent mutation call.
  variables: TVariables | undefined;
  // Convenience flag: true if the status is 'error'.
  isError: boolean;
  // Convenience flag: true if the status is 'idle'.
  isIdle: boolean;
  // Convenience flag: true if the status is 'pending'.
  isPending: boolean;
  // Convenience flag: true if the status is 'success'.
  isSuccess: boolean;
}

/**
 * Defines the public API for a mutation service.
 */
export interface MutationService<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
> {
  // Returns the current state snapshot of the mutation.
  getSnapshot: () => MutationServiceSnapshot<TData, TError, TVariables>;
  // Subscribes a listener to state changes; returns an unsubscribe function.
  subscribe: (
    listener: (snapshot: MutationServiceSnapshot<TData, TError, TVariables>) => void
  ) => () => void;
  // Triggers the mutation with the given variables and optional lifecycle callbacks.
  mutate: (
    variables: TVariables,
    options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>
  ) => Promise<TData>;
  // Resets the mutation state back to its initial idle state.
  reset: () => void;
  // Escape hatch: provides direct access to the underlying Tanstack Query observer result.
  unsafe_getResult: () => MutationObserverResult<TData, TError, TVariables, TOnMutateResult>;
}

/**
 * Configuration options for creating a mutation service, excluding the mutation function itself.
 */
export type MutationServiceOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
> = Omit<MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>, 'mutationFn'>;

/**
 * Function signature for the mutation factory.
 */
export interface CreateMutation {
  <TData = unknown, TError = Error, TVariables = void, TOnMutateResult = unknown>(
    // The asynchronous function that performs the mutation.
    mutationFn: MutationFunction<TData, TVariables>,
    // Optional configuration for behavior like retry or lifecycle hooks.
    options?: MutationServiceOptions<TData, TError, TVariables, TOnMutateResult>
  ): MutationService<TData, TError, TVariables, TOnMutateResult>;
}

/**
 * Additional options for tracked mutations that invalidate queries automatically.
 *
 * The tracked mutation still behaves like a normal mutation service from the outside. These
 * options only describe how the facade should derive dependency values and when it should
 * invalidate matching tracked queries after the mutation lifecycle settles.
 */
export interface TrackedMutationServiceOptions<
  TDeps extends TrackedDependencyRecord = TrackedDependencyRecord,
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
> extends MutationServiceOptions<TData, TError, TVariables, TOnMutateResult> {
  // Optional dependency keys used by the default variable reader.
  dependencyKeys?: readonly (keyof TDeps & string)[];
  // Optional custom resolver when mutation variables do not expose dependency fields directly.
  resolveDependencies?: (variables: TVariables) => Partial<TDeps>;
  // Lifecycle hook that triggers automatic invalidation.
  invalidateOn?: TrackedInvalidateOn;
  // Matching strategy for resolved dependencies.
  matchMode?: TrackedMatchMode;
}

/**
 * Function signature for tracked mutation factories.
 */
export interface CreateTrackedMutation {
  <
    TDeps extends TrackedDependencyRecord = TrackedDependencyRecord,
    TData = unknown,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
  >(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: TrackedMutationServiceOptions<TDeps, TData, TError, TVariables, TOnMutateResult>
  ): MutationService<TData, TError, TVariables, TOnMutateResult>;
}

/**
 * Prepares the mutation factory by binding it to a specific QueryClient instance.
 */
export function setupMutation(queryClient: QueryClient): CreateMutation {
  // Returns the actual factory function for creating individual mutation services.
  return function createMutation<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
  >(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: MutationServiceOptions<TData, TError, TVariables, TOnMutateResult>
  ): MutationService<TData, TError, TVariables, TOnMutateResult> {
    return createMutationService(queryClient, mutationFn, options);
  };
}

/**
 * Prepares a tracked mutation factory that coordinates invalidation through the shared registry.
 *
 * The implementation intentionally wraps the normal mutation service instead of re-implementing
 * TanStack lifecycle behavior. TanStack still owns retries, callbacks, and state transitions;
 * the facade only adds dependency resolution plus the follow-up invalidation pass.
 */
export function setupTrackedMutation(
  queryClient: QueryClient,
  trackingRegistry: TrackingRegistry,
  defaultDependencyKeys?: readonly string[]
): CreateTrackedMutation {
  return function createTrackedMutation<
    TDeps extends TrackedDependencyRecord = TrackedDependencyRecord,
    TData = unknown,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
  >(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: TrackedMutationServiceOptions<TDeps, TData, TError, TVariables, TOnMutateResult>
  ): MutationService<TData, TError, TVariables, TOnMutateResult> {
    // Split tracked-only options from the underlying TanStack mutation observer options.
    const {
      dependencyKeys,
      invalidateOn = 'success',
      matchMode = 'intersection',
      resolveDependencies,
      ...mutationOptions
    } = options ?? {};
    // Reuse the normal mutation service so snapshots and subscription behavior stay identical.
    const service = createMutationService(queryClient, mutationFn, mutationOptions);
    // The paired helper injects dependency keys here, while standalone tracked mutations can
    // still provide them directly or bypass them with a custom resolver.
    const resolvedDependencyKeys = (dependencyKeys ?? defaultDependencyKeys);

    const invalidateTrackedQueries = async (variables: TVariables) => {
      // Resolve the mutation variables into the same named dependency shape that tracked queries
      // registered under when they were created.
      const dependencies = resolveTrackedMutationDependencies(
        variables,
        resolvedDependencyKeys,
        resolveDependencies
      );
      // Ask the registry for matching query hashes using the selected invalidation breadth.
      const queryHashes = trackingRegistry.match(
        toTrackedDependencyEntries(dependencies, 'Tracked mutation dependency resolution'),
        matchMode
      );
      // Filter the registry result down to currently live TanStack queries before invalidating.
      const queries = resolveTrackedQueries(queryClient, queryHashes);

      await Promise.all(
        queries.map((query) =>
          queryClient.invalidateQueries({
            exact: true,
            queryKey: query.queryKey,
          })
        )
      );
    };

    return {
      ...service,
      mutate: async (variables, mutateOptions) => {
        try {
          // Let TanStack finish the mutation first so its own callbacks and state machine remain
          // authoritative. The facade only coordinates the follow-up invalidation.
          const result = await service.mutate(variables, mutateOptions);

          if (invalidateOn === 'success' || invalidateOn === 'settled') {
            await invalidateTrackedQueries(variables);
          }

          return result;
        } catch (error) {
          if (invalidateOn === 'error' || invalidateOn === 'settled') {
            try {
              await invalidateTrackedQueries(variables);
            } catch {
              // Preserve the original mutation failure as the primary rejection. If invalidation
              // also fails here, the caller still sees the mutation error that triggered this path.
            }
          }

          throw error;
        }
      },
    };
  };
}

/**
 * Internal helper to transform a raw Tanstack mutation result into our public snapshot format.
 */
function toMutationServiceSnapshot<TData, TError, TVariables, TOnMutateResult>(
  result: MutationObserverResult<TData, TError, TVariables, TOnMutateResult>
): MutationServiceSnapshot<TData, TError, TVariables> {
  // Extract and return the relevant fields for the UI or other services.
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

function createMutationService<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
>(
  queryClient: QueryClient,
  mutationFn: MutationFunction<TData, TVariables>,
  options?: MutationServiceOptions<TData, TError, TVariables, TOnMutateResult>
): MutationService<TData, TError, TVariables, TOnMutateResult> {
  // Keep the original mutation implementation in one place so tracked and untracked mutations
  // always expose the same observer-backed runtime behavior.
  const observer = new MutationObserver<TData, TError, TVariables, TOnMutateResult>(queryClient, {
    ...options,
    mutationFn,
  });

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
}

function resolveTrackedMutationDependencies<
  TDeps extends TrackedDependencyRecord,
  TVariables,
>(
  variables: TVariables,
  dependencyKeys: readonly (keyof TDeps & string)[] | undefined,
  resolveDependencies:
    | ((variables: TVariables) => Partial<TDeps>)
    | undefined
): Partial<Record<string, TrackedDependencyValue>> {
  // A custom resolver takes precedence because it can adapt nested payloads or renamed fields.
  if (resolveDependencies) {
    return resolveDependencies(variables);
  }

  // Without a custom resolver, tracked mutations need known dependency keys so the default
  // variable picker knows which fields are invalidation-relevant.
  if (!dependencyKeys || dependencyKeys.length === 0) {
    throw new Error(
      'Tracked mutations require resolveDependencies or dependencyKeys to derive invalidation targets.'
    );
  }

  return pickTrackedDependencies(dependencyKeys, variables);
}
