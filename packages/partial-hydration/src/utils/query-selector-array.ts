/**
 * Utility for selecting DOM elements and returning them as a standard array.
 */

/**
 * Executes querySelectorAll and converts the result into a true Array.
 */
export function querySelectorArray(
  elem: string,
  context: HTMLElement | Document = document
): HTMLElement[] {
  if (!elem) {
    throw new Error(
      'In order to work with querySelectorArray you need to define an element as string!'
    );
  }

  // Convert NodeList to a proper Array for easier iteration and manipulation.
  return Array.prototype.slice.call(context.querySelectorAll(elem));
}
