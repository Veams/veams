/**
 * Shared Jest setup for all packages.
 * jest-environment-jsdom replaces Node globals and strips structuredClone,
 * which @veams/status-quo's BaseStateHandler relies on.
 *
 * The polyfill must create objects in the sandbox realm: a host-realm clone
 * (e.g. node:v8 serialize/deserialize) yields objects whose Object.prototype
 * differs from the sandbox's, breaking identity-based plain-object checks
 * like Object.getPrototypeOf(value) === Object.prototype.
 */
function cloneValue(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.map(cloneValue);
  }

  if (value instanceof Map) {
    return new Map(Array.from(value, ([key, entry]) => [cloneValue(key), cloneValue(entry)]));
  }

  if (value instanceof Set) {
    return new Set(Array.from(value, cloneValue));
  }

  const clone = {};

  for (const key of Object.keys(value)) {
    clone[key] = cloneValue(value[key]);
  }

  return clone;
}

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = cloneValue;
}
