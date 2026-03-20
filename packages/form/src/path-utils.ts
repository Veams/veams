function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
}

export function getValueAtPath(values: unknown, path: string): unknown {
  if (!path) {
    return values;
  }

  const segments = path.split('.');
  let current: unknown = values;

  for (const segment of segments) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

export function setValueAtPath<TValues extends object>(
  values: TValues,
  path: string,
  value: unknown
): TValues {
  const segments = path.split('.');

  if (segments.length === 0) {
    return values;
  }

  const setRecursive = (current: unknown, index: number): Record<string, unknown> => {
    const segment = segments[index];
    const isLeaf = index === segments.length - 1;
    const currentObject = isPlainObject(current) ? current : {};
    const clone: Record<string, unknown> = {
      ...currentObject,
    };

    if (isLeaf) {
      clone[segment] = value;
      return clone;
    }

    clone[segment] = setRecursive(clone[segment], index + 1);
    return clone;
  };

  return setRecursive(values, 0) as TValues;
}

export function collectLeafPaths(values: unknown): string[] {
  const paths: string[] = [];

  const traverse = (current: unknown, parentPath?: string) => {
    if (!isPlainObject(current)) {
      if (parentPath) {
        paths.push(parentPath);
      }

      return;
    }

    const keys = Object.keys(current);

    if (keys.length === 0) {
      if (parentPath) {
        paths.push(parentPath);
      }

      return;
    }

    keys.forEach((key) => {
      const nextPath = parentPath ? `${parentPath}.${key}` : key;
      traverse(current[key], nextPath);
    });
  };

  traverse(values);
  return paths;
}
