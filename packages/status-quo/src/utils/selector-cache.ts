/**
 * Utility functions for caching selector results to optimize state updates.
 */

// Function signature for transforming state into a specific selected value.
export type Selector<Value, Selected> = (value: Value) => Selected;

// Function signature for comparing two selected values for equality.
export type EqualityFn<Selected> = (current: Selected, next: Selected) => boolean;

/**
 * Interface for internal selector cache storage.
 */
type SelectorCache<Selected> = {
  // Whether the cache already contains a computed value.
  hasValue: boolean;
  // The cached value of the selection result.
  value: Selected | undefined;
};

/**
 * Interface for the result of a selection operation.
 */
type SelectionResult<Selected> = {
  // The selected value (either newly computed or from cache).
  value: Selected;
  // Whether the selected value has effectively changed since the last check.
  hasChanged: boolean;
};

/**
 * Creates a new, empty selector cache.
 * Provides a simple container to track state and values across selections.
 */
export function createSelectorCache<Selected>(): SelectorCache<Selected> {
  return {
    // Initially, no value is stored in the cache.
    hasValue: false,
    value: undefined,
  };
}

/**
 * Executes a selector and returns the cached value if the result is considered equal.
 * This optimization avoids unnecessary re-renders or updates when the derived state is the same.
 */
export function selectWithCache<Value, Selected>(
  // The cache object to store and compare values.
  selectorCache: SelectorCache<Selected>,
  // The source value from which to select.
  value: Value,
  // The selector function to transform the source value.
  selector: Selector<Value, Selected>,
  // Optional equality function to compare selected values (defaults to Object.is).
  isEqual: EqualityFn<Selected> = Object.is
): SelectionResult<Selected> {
  // Execute the selector to derive the current selection value.
  const nextSelection = selector(value);

  // If the cache has a value and the new selection is equal to it, return the cached version.
  if (selectorCache.hasValue && isEqual(selectorCache.value as Selected, nextSelection)) {
    return {
      // Return the previously cached value to maintain referential stability.
      value: selectorCache.value as Selected,
      // Signal that no effective change has occurred.
      hasChanged: false,
    };
  }

  // Update the cache with the newly computed selection.
  selectorCache.hasValue = true;
  selectorCache.value = nextSelection;

  return {
    // Return the fresh selection result.
    value: nextSelection,
    // Signal that the selected value has changed.
    hasChanged: true,
  };
}
