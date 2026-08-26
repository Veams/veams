import type { PackagePage } from '../../../types';
import {
  formAsyncInitExample,
  formDirtyPrefillExample,
  formInitializeVsResetExample,
} from './async-init-and-dirty-state.snippets';

export const asyncInitAndDirtyStatePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formAsyncInitExample,
          label: 'Async initial values with onInit',
          language: 'tsx',
        },
      ],
      bullets: [
        '`initialValues` is still required. The form shows these values while the real ones load.',
        '`onInit` runs once, when the first consumer connects. It gets an `AbortSignal` that fires if the form disconnects before the load finishes.',
        "`initStatus` starts at `'initializing'` and becomes `'ready'` when the loaded values arrive. If the load fails, it becomes `'error'` and `initError` holds the message.",
        'The loaded values become the new baseline. Nothing is marked as touched, and validation waits until the user interacts with a field.',
        "While the form is `'initializing'`, `FormProvider` ignores submits. Whether fields should be disabled during loading is up to you: read `initStatus` and decide.",
      ],
      id: 'async-init',
      paragraphs: [
        'Often the real initial values come from an API. If you apply them with `setFieldValue()` or `resetForm()`, the form treats the load like a user change.',
        '`onInit` avoids that: the form loads the values itself, as part of its own lifecycle.',
      ],
      title: 'Load initial values asynchronously',
    },
    {
      codeExamples: [
        {
          code: formInitializeVsResetExample,
          label: 'initialize() vs resetForm()',
          language: 'ts',
        },
      ],
      bullets: [
        '`initialize(values)` sets a new baseline. The values replace `initialValues`, errors and touched state are cleared, and `isDirty` becomes `false`.',
        '`resetForm()` goes back to the current baseline. `resetForm(values)` replaces the current values but keeps the old baseline.',
        'Calling `initialize()` yourself cancels a still-running `onInit`. The manual call wins.',
      ],
      id: 'initialize-vs-reset',
      paragraphs: [
        '`onInit` uses the public `initialize()` method under the hood. You can call it directly too.',
        'The rule is simple: `initialize()` sets a new baseline, `resetForm()` returns to it.',
      ],
      title: 'initialize() vs resetForm()',
    },
    {
      codeExamples: [
        {
          code: formDirtyPrefillExample,
          label: 'Server-driven prefill guarded by isDirty',
          language: 'ts',
        },
      ],
      bullets: [
        '`isDirty` deep-compares the current values with the baseline. Typing the original value back makes the form clean again.',
        '`touched` answers "did the user interact with this field?". `isDirty` answers "are the values different from the baseline?". The two are independent.',
        'Use `isDirty` to guard server prefills. You no longer need to keep a copy of the last prefilled values in your own state.',
        'After a prefill through `initialize()`, `resetForm()` returns to the prefilled values, not to the empty skeleton.',
      ],
      id: 'dirty-tracking',
      paragraphs: [
        '`isDirty` tells you whether the current values differ from the baseline.',
        'Together with `initialize()`, it replaces the usual "remember what we prefilled last time" workaround in feature handlers.',
      ],
      title: 'Track dirty state against the baseline',
    },
  ],
  eyebrow: 'Guides',
  id: 'async-init-and-dirty-state',
  intro:
    'Let the form load its initial values from an API, and let it answer whether the user has edited anything.',
  summary: 'Async initial values and dirty tracking, built into the form.',
  title: 'Async Init & Dirty State',
};
