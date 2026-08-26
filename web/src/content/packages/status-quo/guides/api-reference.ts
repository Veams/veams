import type { PackagePage } from '../../../types';
import { statusQuoGlobalSetup } from '../shared-snippets';
import { statusQuoApiImports, statusQuoSubpathImports } from './api-reference.snippets';

export const apiReferencePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoApiImports,
          label: 'Root + React exports',
          language: 'ts',
        },
        {
          code: statusQuoSubpathImports,
          label: 'Subpath exports',
          language: 'ts',
        },
      ],
      id: 'entry-points',
      paragraphs: [
        'The root package works without React and covers handlers, runtime setup, and singleton helpers. `NativeStateHandler`, `makeStateSingleton`, and `setupStatusQuo` are exported from the root. Use `@veams/status-quo/observable` for `ObservableStateHandler` (needs rxjs), `@veams/status-quo/signals` for `SignalStateHandler` (needs @preact/signals-core), `@veams/status-quo/react` for the React layer, and `@veams/status-quo/store` for store primitives.',
      ],
      title: 'Entry points',
    },
    {
      bullets: [
        '`BaseStateHandler` is the abstract root class for all handler implementations.',
        'Public instance methods are `getInitialState()`, `getState()`, `getSnapshot()`, `setState(newState, actionName?)`, `connect()`, `disconnect()`, and `destroy()`.',
        'Override `onConnect()` and `onDisconnect()` when a handler needs external subscriptions, timers, or listeners.',
        'Use it as the contract reference when building your own handler class on top of the Status Quo lifecycle and subscription model.',
      ],
      id: 'base-state-handler',
      paragraphs: [
        'This class is the conceptual center of the package. Most application code will not instantiate it directly, but the rest of the public surface builds on its state, action, and subscription contract.',
      ],
      title: 'BaseStateHandler',
    },
    {
      bullets: [
        '`makeStateSingleton(factory, options?)` promotes a handler factory into shared state.',
        '`factory` creates the handler instance. `options?.destroyOnNoConsumers` controls whether the instance is destroyed when the last subscriber leaves.',
        'Returns a `StateSingleton` definition that `useStateSingleton()` can subscribe to.',
      ],
      id: 'make-state-singleton',
      paragraphs: [
        'Use this helper when state should outlive a single component mount and be shared across multiple consumers.',
      ],
      title: 'makeStateSingleton',
    },
    {
      bullets: [
        '`NativeStateHandler` is constructed with `{ initialState, options? }`.',
        '`initialState` seeds the handler value. `options?.devTools`, `options?.distinct`, and `options?.useDistinctUntilChanged` control runtime behavior.',
        'Use it as the default concrete base when plain JavaScript state is enough and you do not need RxJS or Signals helpers.',
      ],
      id: 'native-state-handler',
      paragraphs: [
        'This is the zero-dependency concrete handler base. It keeps the external API the same as the other engines while staying as small as possible.',
      ],
      title: 'NativeStateHandler',
    },
    {
      bullets: [
        '`ObservableStateHandler` is constructed with `{ initialState, options? }`.',
        'Alongside the shared handler API, it adds `getObservable(options?)` and `getObservableItem(key)` for RxJS-oriented integrations.',
        'Use it when state composition naturally benefits from observables, operators, and stream-based transforms.',
      ],
      id: 'observable-state-handler',
      paragraphs: [
        'Import from `@veams/status-quo/observable`. Requires `rxjs` as a peer dependency.',
        'This is the RxJS-backed concrete base. The app-facing handler contract stays stable while the underlying reactive engine becomes observable-driven.',
      ],
      title: 'ObservableStateHandler',
    },
    {
      bullets: [
        '`setupStatusQuo(config?)` should be called once near app startup.',
        '`config?.devTools` sets global Redux DevTools defaults. `config?.distinct` sets package-wide distinct-update defaults.',
        'Local handler options still win when a specific instance needs different behavior.',
      ],
      codeExamples: [
        {
          code: statusQuoGlobalSetup,
          description:
            'Use `setupStatusQuo()` at your app entry point (e.g., in main.ts or index.ts) to set global defaults that apply to every handler instance, unless overridden locally.',
          label: 'Global Configuration',
          language: 'ts',
        },
      ],
      id: 'setup-status-quo',
      paragraphs: [
        'This is the package-wide runtime setup function. It keeps app-level defaults explicit instead of hiding them behind individual handler constructors.',
      ],
      title: 'setupStatusQuo',
    },
    {
      bullets: [
        '`SignalStateHandler` is constructed with `{ initialState, options? }`.',
        'Alongside the shared handler API, it adds `getSignal()` for direct signal consumption.',
        'Use it when you want a lightweight reactive engine with signal-style reads and updates.',
      ],
      id: 'signal-state-handler',
      paragraphs: [
        'Import from `@veams/status-quo/signals`. Requires `@preact/signals-core` as a peer dependency.',
        'This is the Signals-backed concrete base. It keeps the outer API aligned with the other handler implementations while exposing signal access for reactive integrations.',
      ],
      title: 'SignalStateHandler',
    },
    {
      bullets: [
        '`StateProvider({ instance, children })` takes one existing handler instance and a subtree.',
        '`instance` is the handler to share. `children` is the provider scope that should read from it.',
        'Use it when the parent owns handler creation and descendants should consume that same instance without prop drilling.',
      ],
      id: 'state-provider',
      paragraphs: [
        'This is the scoped-sharing surface in the React layer. It keeps creation ownership and consumption scope explicit.',
      ],
      title: 'StateProvider',
    },
    {
      bullets: [
        '`StateSingleton`, `StateSingletonOptions`, and `StateSubscriptionHandler` are the main exported API types.',
        '`StateSingletonOptions` describes singleton lifecycle behavior such as `destroyOnNoConsumers`.',
        'Use these types when you are wrapping Status Quo in your own abstractions and want to stay on the public contract boundary.',
      ],
      id: 'types',
      paragraphs: [
        'The type exports exist so application-level abstractions can depend on supported public interfaces rather than reaching into internal files.',
      ],
      title: 'Types',
    },
    {
      bullets: [
        '`useProvidedStateActions()` takes no parameters.',
        'Returns the action object from the nearest `StateProvider` without subscribing to state updates.',
        'Use it for command-only UI such as buttons, toolbars, or menu actions.',
      ],
      id: 'use-provided-state-actions',
      paragraphs: [
        'This is the action-only provider hook. It keeps action access separate from render subscriptions.',
      ],
      title: 'useProvidedStateActions',
    },
    {
      bullets: [
        '`useProvidedStateHandler()` takes no parameters.',
        'Returns the raw handler instance from the nearest `StateProvider`.',
        'Use it when a child component needs low-level manual composition against the shared handler.',
      ],
      id: 'use-provided-state-handler',
      paragraphs: [
        'This is the lowest-level provider hook in the React surface and the right tool when higher-level convenience hooks are too opinionated.',
      ],
      title: 'useProvidedStateHandler',
    },
    {
      bullets: [
        '`useProvidedStateSubscription(selector?, isEqual?)` subscribes to the nearest `StateProvider`.',
        '`selector?` narrows the subscribed slice. `isEqual?` customizes change detection for selected values.',
        'Returns `[selectedState, actions]` and is the provider-scoped counterpart to `useStateSubscription()`.',
      ],
      id: 'use-provided-state-subscription',
      paragraphs: [
        'Use this hook when provider scope already owns the instance and the component only needs to declare what slice should drive rerenders.',
      ],
      title: 'useProvidedStateSubscription',
    },
    {
      bullets: [
        '`useStateActions(handler)` takes one handler instance or compatible subscribable handler surface.',
        'Returns the action object without subscribing to state changes.',
        'Use it when a component should trigger behavior but should not rerender from state updates.',
      ],
      id: 'use-state-actions',
      paragraphs: [
        'This hook is the action-only counterpart to the state subscription hooks and keeps write access explicit.',
      ],
      title: 'useStateActions',
    },
    {
      bullets: [
        '`useStateFactory(factory, selector?, isEqual?, params?)` combines creation and subscription.',
        '`factory` creates the handler. `selector?` narrows the subscribed slice. `isEqual?` customizes equality. `params?` are forwarded to the factory.',
        'Returns `[selectedState, actions]` and is the shortest path from handler factory to rendered state.',
      ],
      id: 'use-state-factory',
      paragraphs: [
        'Use this hook when one component both owns the handler lifecycle and consumes its state directly.',
      ],
      title: 'useStateFactory',
    },
    {
      bullets: [
        '`useStateHandler(factory, params?)` creates one handler instance per component mount.',
        '`factory` builds the handler. `params?` is the optional tuple forwarded to that factory.',
        'Returns the raw handler instance so you can compose state reads and action reads manually.',
      ],
      id: 'use-state-handler',
      paragraphs: [
        'This is the lowest-level local React hook and the right starting point when you want full control over handler lifecycle and composition.',
      ],
      title: 'useStateHandler',
    },
    {
      bullets: [
        '`useStateSingleton(singleton, selector?, isEqual?)` subscribes to a shared singleton definition.',
        '`singleton` is the object returned by `makeStateSingleton()`. `selector?` narrows the subscribed slice. `isEqual?` customizes equality.',
        'Returns `[selectedState, actions]` while keeping creation and lifecycle ownership on the singleton definition itself.',
      ],
      id: 'use-state-singleton',
      paragraphs: [
        'Use this hook when shared state should outlive one component tree or be consumed by multiple unrelated branches.',
      ],
      title: 'useStateSingleton',
    },
    {
      bullets: [
        '`useStateSubscription(source, selector?, isEqual?)` subscribes to a handler instance or singleton.',
        'For local state, `source` is the same handler instance returned by `useStateHandler()` that you would also pass to `useStateActions(handler)`.',
        '`source` can also be a singleton definition. `selector?` narrows the subscribed slice. `isEqual?` customizes equality.',
        'Returns `[selectedState, actions]` and is the main React rendering surface for Status Quo state.',
      ],
      id: 'use-state-subscription',
      paragraphs: [
        'Use this hook when the component should rerender from state and you want the selection boundary to stay explicit.',
      ],
      title: 'useStateSubscription',
    },
  ],
  eyebrow: 'Guides',
  id: 'api-reference',
  intro:
    'Start at the root for the core pieces, then import from `@veams/status-quo/react` when you wire handlers into React.',
  summary: 'The full surface, minus the noise.',
  title: 'API Reference',
};
