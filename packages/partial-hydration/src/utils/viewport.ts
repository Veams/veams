/**
 * Utility for triggering actions when an element enters the viewport.
 */

/**
 * Options for the viewport observer.
 */
export type WhenInViewportOptions = Partial<
  { once: boolean } & Pick<IntersectionObserverInit, 'threshold' | 'rootMargin'>
>;

/**
 * Interface for the observer execution.
 */
export type WhenInViewportObserver = {
  execute: (callback: (isIntersecting: boolean) => void) => IntersectionObserver;
};

/**
 * Factory function to create a viewport observer for a specific element.
 * Uses the IntersectionObserver API under the hood.
 */
export function whenInViewport(
  element: HTMLElement,
  options: WhenInViewportOptions = {}
): WhenInViewportObserver {
  const { once = false, threshold = 0, rootMargin = '0px 0px 0px 0px' } = options;

  return {
    /**
     * Starts the observation and triggers the callback when intersection state changes.
     */
    execute: (callback: (isInViewPort: boolean) => void): IntersectionObserver => {
      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[] = []): void => {
          entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
              callback(true);

              // If once is true, stop observing after the first intersection.
              if (once) {
                observer.unobserve(element);
              }
            } else {
              callback(false);
            }
          });
        },
        { rootMargin, threshold }
      );

      observer.observe(element);

      return observer;
    },
  };
}
