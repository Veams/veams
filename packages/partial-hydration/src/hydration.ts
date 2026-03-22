/**
 * Core hydration logic for activating components in the DOM.
 */
import { scriptDecode } from './utils/script-replacer.js';

import { querySelectorArray } from './utils/query-selector-array.js';
import { whenInViewport } from './utils/viewport.js';

/**
 * Defines the configuration for a single component registration.
 */
export type ComponentOption<C, P> = {
  // The component constructor or function.
  Component: C;
  // Function to perform the actual rendering/activation.
  render: (Component: C, props: P, el: Element | HTMLElement, id: string) => void;
} & ComponentType;

/**
 * Union type for different hydration triggers.
 */
type ComponentType =
  | OnInitComponent
  | OnDomReadyComponent
  | OnFontsReadyComponent
  | OnInViewportComponent;

/**
 * Triggered immediately when the script runs.
 */
type OnInitComponent = {
  on: 'init';
};

/**
 * Triggered when the DOM is fully loaded.
 */
type OnDomReadyComponent = {
  on: 'dom-ready';
};

/**
 * Triggered when all fonts are loaded.
 */
type OnFontsReadyComponent = {
  on: 'fonts-ready';
};

/**
 * Triggered when the component enters the viewport.
 */
type OnInViewportComponent = {
  on: 'in-viewport';
  // Optional configuration for IntersectionObserver.
  config?: {
    rootMargin?: string;
  };
};

/**
 * Global configuration for the hydration instance.
 */
export interface HydrationOptions<C, P> {
  // Map of component names to their respective configurations.
  components: Record<string, ComponentOption<C, P>>;
}

/**
 * Internal mapping of component names grouped by their trigger events.
 */
type ComponentsMapByEvents = {
  init: string[];
  domReady: string[];
  fontsReady: string[];
  inViewport: string[];
};

/**
 * Mapping of component names to their found DOM elements.
 */
type ElementsMapByComponentName = Record<string, HTMLElement[]>;

/**
 * Possible contexts for element selection.
 */
type DocumentContext = HTMLElement | Document;

/**
 * Data attributes used for identifying components and their data.
 */
const namespace = 'data-component';
const idNamespace = 'data-internal-id';
const refNamespace = 'data-internal-ref';

/**
 * Finds a script element containing component props by its reference ID.
 */
function getElementByDataId(id: string): HTMLElement | null {
  const elements = querySelectorArray(`[${refNamespace}="${id}"]`);

  if (elements.length > 1) {
    console.error(`Seems like we have a problem with colliding ids for ${id}`);
    return null;
  }

  return elements[0];
}

/**
 * Reducer helper to group component keys by their trigger event type.
 */
function mapComponentsByEventType<C, P>(
  components: HydrationOptions<C, P>['components']
): (componentsEventMap: ComponentsMapByEvents, key: string) => ComponentsMapByEvents {
  return (componentsEventMap, key) => {
    if (components[key].on === 'init') {
      componentsEventMap.init.push(key);
    }

    if (components[key].on === 'dom-ready') {
      componentsEventMap.domReady.push(key);
    }

    if (components[key].on === 'fonts-ready') {
      componentsEventMap.fontsReady.push(key);
    }

    if (components[key].on === 'in-viewport') {
      componentsEventMap.inViewport.push(key);
    }

    return componentsEventMap;
  };
}

/**
 * Reducer helper to group found DOM elements by their component name.
 */
function mapElementsByComponentName<C, P>(
  components: HydrationOptions<C, P>['components']
): (acc: ElementsMapByComponentName, el: HTMLElement) => ElementsMapByComponentName {
  return (elementsMap, el) => {
    const componentName = el.getAttribute(namespace);

    if (!componentName) {
      console.error(
        `Component Display Name or Name is missing. Make sure you have one in place by defining "displayName" for element:\n ${el.innerHTML}`
      );

      return elementsMap;
    }

    const cmpConfig = components[componentName];

    if (!cmpConfig) {
      console.error(
        `Component ${componentName} is not in the provided componentMap. Make sure to add it!`
      );

      return elementsMap;
    }

    if (elementsMap[componentName]) {
      elementsMap[componentName].push(el);
    } else {
      elementsMap[componentName] = [el];
    }

    return elementsMap;
  };
}

/**
 * Data structure passed to the component initialization callbacks.
 */
type InitComponentProps<C, P> = {
  element: HTMLElement;
  cmpName: string;
  cmpRef: string;
  cmpConfig: ComponentOption<C, P>;
};

/**
 * High-level initializer for a set of components based on a list of names.
 */
function initComponents<C, P>(props: {
  components: HydrationOptions<C, P>['components'];
  componentsMap: string[];
  context: DocumentContext;
  initCallback?: (props: InitComponentProps<C, P>) => void;
  withLogging?: boolean;
}): () => void {
  const {
    context,
    componentsMap,
    components,
    initCallback = initComponent,
    withLogging = true,
  } = props;

  return () => {
    // Select all potential component wrappers in the current context.
    const componentWrapperElements = querySelectorArray(`[${namespace}]`, context);

    if (componentWrapperElements.length === 0 && componentsMap.length > 0) {
      if (withLogging) {
        console.info('No components for hydration found in the DOM.');
      }

      return;
    }

    // Map DOM elements to their respective component names.
    const elementsMap = componentWrapperElements.reduce(
      mapElementsByComponentName<C, P>(components),
      {}
    );

    // Process each component key provided in componentsMap.
    componentsMap.forEach((key) => {
      const elements = elementsMap[key];

      elements?.forEach((el) => {
        const cmpName = el.getAttribute(namespace) as string;
        const cmpConfig: ComponentOption<C, P> = components[cmpName];

        initCallback({
          element: el,
          cmpName,
          cmpRef: el.getAttribute(idNamespace) as string,
          cmpConfig,
        });
      });
    });
  };
}

/**
 * Performs the actual hydration of a single component.
 * Decodes props from the DOM and executes the render function.
 */
function initComponent<C, P>(props: InitComponentProps<C, P>): void {
  const { element, cmpName, cmpConfig } = props;
  const id = element.getAttribute(idNamespace) || '';
  let parsedProps: P;
  let script = element.previousElementSibling;

  // Skip if already initialized to prevent duplicate activation.
  if (element.dataset.initialized === 'true') {
    console.info(
      `Component is already initialized - we skip the hydration process for ${cmpName} with the Id ${id}!`
    );
    return;
  }

  // Ensure we find the correct script tag containing the component data.
  if (!script || script.getAttribute(refNamespace) !== id) {
    console.info(
      `Component Script was moved for ${cmpName} with the Id ${id}. We will use the generated id to find the right props now!`
    );

    script = getElementByDataId(id);
  }

  const cmpProps = script?.textContent;

  if (!cmpProps) {
    console.error(
      `Component Props are missing for ${cmpName}. Make sure you have your props in place!`
    );
    return;
  }

  // Parse and decode the props from the script content.
  try {
    parsedProps = JSON.parse(scriptDecode(cmpProps));
  } catch (e) {
    console.error(
      `Seems like your props is an invalid object. Parsing was not possible for ${cmpName}: ${e}`
    );
    return;
  }

  // Trigger the framework-specific render function.
  cmpConfig.render(
    cmpConfig.Component,
    parsedProps as P,
    element,
    id
  );
  // Mark as initialized in the DOM.
  element.dataset.initialized = 'true';

  // Notify the system that a component has been hydrated.
  window.dispatchEvent(
    new CustomEvent('hydration:component:rendered', {
      detail: {
        id,
        name: cmpName,
      },
    })
  );
}

/**
 * Wraps component initialization with a viewport-based trigger.
 */
function initComponentWhenInViewport<C, P>(props: InitComponentProps<C, P>): IntersectionObserver {
  const { element, cmpConfig } = props;

  const rootMargin = cmpConfig.on === 'in-viewport' ? cmpConfig.config?.rootMargin : undefined;

  return whenInViewport(element, {
    once: true,
    rootMargin,
  }).execute((isInViewport) => {
    if (isInViewport) {
      initComponent(props);
    }
  });
}

/**
 * Main factory to create a hydration instance.
 * Returns an object with an init method to start the hydration process.
 */
export function createHydration<C, P>(options: HydrationOptions<C, P>) {
  const initialComponentsMap: ComponentsMapByEvents = {
    init: [],
    domReady: [],
    fontsReady: [],
    inViewport: [],
  };
  const { components } = options;
  // Pre-sort components by their activation triggers.
  const componentsMapByEvents: ComponentsMapByEvents = Object.keys(components).reduce(
    mapComponentsByEventType<C, P>(components),
    initialComponentsMap
  );
  // Track global ready states.
  let globalEvents = {
    isInit: false,
    isDOMReady: false,
    isFontsReady: false,
  };

  /**
   * Helper to execute a callback when the DOM is ready.
   */
  const registerDOMReady = (cb: () => void) => {
    const handler = () => {
      globalEvents = {
        ...globalEvents,
        isDOMReady: true,
      };

      cb();
    };

    if (globalEvents.isDOMReady) {
      cb();
      return;
    }

    if (document.readyState !== 'loading') {
      handler();

      return;
    }

    document.addEventListener('DOMContentLoaded', () => {
      handler();
    });
  };

  /**
   * Helper to execute a callback when all fonts are ready.
   */
  const registerFontsReady = (cb: () => void) => {
    if (globalEvents.isFontsReady) {
      cb();
      return;
    }

    document.fonts.ready.then(() => {
      globalEvents = {
        ...globalEvents,
        isFontsReady: true,
      };

      cb();
    });
  };

  // Internal storage for observer instances (Intersection or Mutation).
  const observers: { disconnect: VoidFunction }[] = [];

  return {
    /**
     * Entry point to start hydration.
     * Hooks into global events and manages the component lifecycle.
     */
    init(context: DocumentContext) {
      // Immediate activation.
      initComponents<C, P>({ components, componentsMap: componentsMapByEvents.init, context })();

      // Viewport-based activation.
      registerDOMReady(
        initComponents<C, P>({
          components,
          componentsMap: componentsMapByEvents.inViewport,
          context,
          initCallback: (props) => {
            observers.push(initComponentWhenInViewport(props));
          },
        })
      );

      // DOM-ready activation.
      registerDOMReady(
        initComponents<C, P>({ components, componentsMap: componentsMapByEvents.domReady, context })
      );

      // Fonts-ready activation.
      registerFontsReady(
        initComponents<C, P>({
          components,
          componentsMap: componentsMapByEvents.fontsReady,
          context,
        })
      );

      // Watch for dynamically added DOM elements to support runtime hydration.
      registerDOMReady(() => {
        observers.push(
          whenElementAdded((element) => {
            initComponents<C, P>({
              components,
              componentsMap: componentsMapByEvents.domReady,
              context: element,
              withLogging: false,
            })();
            initComponents<C, P>({
              components,
              componentsMap: componentsMapByEvents.inViewport,
              context: element,
              initCallback: (props) => {
                observers.push(initComponentWhenInViewport(props));
              },
              withLogging: false,
            })();
          })
        );
      });
    },
    /**
     * Cleans up all active DOM observers.
     */
    clearAllObservers: () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
    },
  };
}

/**
 * Helper to watch for new elements being added to the document body.
 */
function whenElementAdded(callback: (element: HTMLElement) => void): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      Array.from(mutation.addedNodes).filter(isHTMLElement).forEach(callback);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return observer;
}

/**
 * Type guard to check if a Node is an HTMLElement.
 */
function isHTMLElement(node: Node | null): node is HTMLElement {
  return node?.nodeType === 1;
}
