import type { PackagePage } from '../../../types';
import {
  statusQuoBindSubscribableExample,
  statusQuoNamedBindSubscribableExample,
} from '../shared-snippets';

export const bindingsPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoBindSubscribableExample,
          label: 'Unnamed bindSubscribable',
          language: 'ts',
        },
      ],
      bullets: [
        'Use the unnamed form when the binding is attached once and should live for the active connection lifetime.',
        'This is the normal choice for stable upstream derivations attached in `onConnect()`.',
        'The binding is tracked for cleanup and does not need a manual handle in feature code.',
      ],
      id: 'unnamed-binding',
      paragraphs: [
        'Unnamed `bindSubscribable(...)` is the simplest form. It is a handler-owned subscription: attach it once, derive local state from the upstream source, and let the handler clean it up later.',
      ],
      title: 'Unnamed bindings for stable sync',
    },
    {
      codeExamples: [
        {
          code: statusQuoNamedBindSubscribableExample,
          label: 'List and selected item binding',
          language: 'ts',
        },
      ],
      bullets: [
        'Use the named form when a later action or lifecycle branch may need to rebind the same upstream sync.',
        'Reusing the same binding name unsubscribes the old binding before the new one is attached.',
        'Inspect `this.namedSubscriptions` inside the handler when you need to see which named bindings are currently registered.',
        'This keeps rebinding local to the handler instead of leaking duplicate listeners into the feature.',
      ],
      id: 'named-binding',
      paragraphs: [
        'Named `bindSubscribable(...)` is the replaceable form. Use it when a handler follows one upstream resource at a time, such as one active list item. A new selection then replaces the old subscription instead of adding another one. The handler can also read `this.namedSubscriptions` when feature logic needs to see the active named bindings.',
      ],
      title: 'Named bindings for replaceable sync',
    },
    {
      callout:
        'Bindings are handler lifecycle work. Cleanup belongs to `disconnect()` and `destroy()`, not to scattered feature-level unsubscribe calls.',
      bullets: [
        'Unnamed bindings are tracked with the handler subscriptions and are unsubscribed during `disconnect()` and `destroy()`.',
        'Named bindings are tracked separately, but the same cleanup path unsubscribes those as well.',
        'The cleanup phase should leave no active upstream listeners after the handler disconnects or is destroyed.',
      ],
      id: 'binding-cleanup',
      paragraphs: [
        'The important lifecycle rule is simple: the handler owns binding cleanup. Use unnamed bindings for stable connection work, named bindings for replaceable work, and rely on the base lifecycle to close both categories during teardown.',
      ],
      title: 'Disconnect and destroy cleanup phase',
    },
  ],
  eyebrow: 'Guides',
  id: 'bindings',
  intro:
    'Bindings keep handler-to-handler sync inside the state layer: one form for stable work, one for replaceable work.',
  summary: 'Unnamed, named, and destroy-time cleanup.',
  title: 'Bindings',
};
