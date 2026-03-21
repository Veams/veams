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
    // Create a new MutationObserver instance to manage this specific mutation's lifecycle.
    const observer = new MutationObserver<TData, TError, TVariables, TOnMutateResult>(
      queryClient,
      {
        ...options,
        mutationFn,
      }
    );

    // Return the implementation of the MutationService interface.
    return {
      // Map the current observer state to our service's snapshot format.
      getSnapshot: () => toMutationServiceSnapshot(observer.getCurrentResult()),
      // Subscribe to observer changes and notify the listener with updated snapshots.
      subscribe: (listener) =>
        observer.subscribe((result) => {
          listener(toMutationServiceSnapshot(result));
        }),
      // Proxy the mutate call to the underlying observer.
      mutate: (variables, mutateOptions) => observer.mutate(variables, mutateOptions),
      // Reset the underlying observer state.
      reset: () => observer.reset(),
      // Provide direct access to the raw observer result when needed.
      unsafe_getResult: () => observer.getCurrentResult(),
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
