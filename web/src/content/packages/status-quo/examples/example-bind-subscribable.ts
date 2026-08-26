import type { PackagePage } from '../../../types';
import { statusQuoNamedBindSubscribableExample } from '../shared-snippets';

export const exampleBindSubscribablePage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use `bindSubscribable()` when one handler should derive part of its state from another subscribable source.',
        'Leave the binding unnamed when it is a stable sync that should simply be cleaned up on `disconnect()` or `destroy()`.',
        'Give the binding a name when the same sync may be re-established later from an action or lifecycle branch.',
        'Reusing the same name replaces the previous upstream subscription before registering the new one.',
      ],
      codeExamples: [
        {
          code: statusQuoNamedBindSubscribableExample,
          label: 'List and selected item binding',
          language: 'ts',
        },
      ],
      id: 'bind-subscribable-example',
      paragraphs: [
        'This example focuses on handler-to-handler composition instead of React ownership. One binding keeps the list itself synchronized while the handler is connected, while another binding follows exactly one selected item at a time.',
        "The snippet shows both modes: the list binding is unnamed because it is attached once in `onConnect()` and only needs lifecycle cleanup, while `selectItem({ id })` uses `this.bindSubscribable('item', getListItem(params.id), ...)` so each new selection replaces the previous item subscription.",
      ],
      title: 'Named and unnamed sync with `bindSubscribable()`',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-bind-subscribable',
  intro:
    'Use `bindSubscribable()` when one handler should react to another subscribable source without pushing that wiring into components.',
  summary: 'Unnamed stable sync plus named replaceable sync.',
  title: 'Named and unnamed sync with `bindSubscribable()`',
};
