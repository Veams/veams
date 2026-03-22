/**
 * Checks if a value is a plain JavaScript object.
 * Returns false for arrays, null, or class instances.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Retrieves a nested value from an object using a dot-notation path.
 * Returns undefined if the path does not exist.
 */
export function getValueAtPath(values: unknown, path: string): unknown {
  // If the path is empty, return the entire values object.
  if (!path) {
    return values;
  }

  const segments = path.split('.');
  let current: unknown = values;

  // Traverse the object structure segment by segment.
  for (const segment of segments) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

/**
 * Sets a nested value in an object using a dot-notation path.
 * Returns a new object with the updated value, maintaining immutability.
 * Creates missing intermediate objects if necessary.
 */
export function setValueAtPath<TValues extends object>(
  values: TValues,
  path: string,
  value: unknown
): TValues {
  const segments = path.split('.');

  // Return the original object if the path is invalid.
  if (segments.length === 0) {
    return values;
  }

  /**
   * Internal recursive helper to clone and update the object tree.
   */
  const setRecursive = (current: unknown, index: number): Record<string, unknown> => {
    const segment = segments[index];
    const isLeaf = index === segments.length - 1;
    // Ensure we are working with an object at each level.
    const currentObject = isPlainObject(current) ? current : {};
    // Shallow clone the current level.
    const clone: Record<string, unknown> = {
      ...currentObject,
    };

    // If we reached the end of the path, assign the new value.
    if (isLeaf) {
      clone[segment] = value;
      return clone;
    }

    // Otherwise, continue recursion for the next segment.
    clone[segment] = setRecursive(clone[segment], index + 1);
    return clone;
  };

  return setRecursive(values, 0) as TValues;
}

/**
 * Recursively collects all dot-notation paths that lead to a leaf value.
 * A leaf value is any value that is not a plain object (e.g., string, number, array).
 */
export function collectLeafPaths(values: unknown): string[] {
  const paths: string[] = [];

  /**
   * Internal traversal helper.
   */
  const traverse = (current: unknown, parentPath?: string) => {
    // If the value is not an object, it is a leaf.
    if (!isPlainObject(current)) {
      if (parentPath) {
        paths.push(parentPath);
      }

      return;
    }

    const keys = Object.keys(current);

    // Empty objects are also treated as leaf nodes.
    if (keys.length === 0) {
      if (parentPath) {
        paths.push(parentPath);
      }

      return;
    }

    // Recurse into each key of the object.
    keys.forEach((key) => {
      const nextPath = parentPath ? `${parentPath}.${key}` : key;
      traverse(current[key], nextPath);
    });
  };

  traverse(values);
  return paths;
}
