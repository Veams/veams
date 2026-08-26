import type { PackagePage } from '../../../types';
import { formValidationModesExample, formValidatorFlowExample } from '../shared-snippets';
import { formApiImports, formCustomBindingExample } from './api-reference.snippets';

export const apiReferencePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formApiImports,
          label: 'Public entry points',
          language: 'ts',
        },
      ],
      id: 'entry-points',
      paragraphs: ['The public surface is small: one root entrypoint and one React subpath.'],
      title: 'Entry points',
    },
    {
      bullets: [
        '`Controller({ name, render, validationMode?, revalidationMode? })` connects controlled inputs through a render prop.',
        '`name` is the dot-path field name. `render` receives `{ field, fieldState }` so controlled widgets can bind `value`, `onChange`, and `onBlur`.',
        '`validationMode?` and `revalidationMode?` override the `FormProvider` timing for that field only.',
        'Use it for third-party inputs that need controlled props. Native fields should usually stay on `useUncontrolledField()`.',
      ],
      id: 'controller-api',
      paragraphs: ['This is the narrow bridge for controlled widgets.'],
      title: 'Controller',
    },
    {
      bullets: [
        '`FormProvider(props)` has two valid shapes.',
        'Local mode takes `{ children, initialValues, onInit?, onSubmit?, renderAs?, validator?, validationMode?, revalidationMode?, ...formProps }`. External mode takes `{ children, formHandlerInstance, onSubmit?, renderAs?, validationMode?, revalidationMode?, ...formProps }`.',
        "`renderAs` defaults to `'form'` but supports `'fieldset'`, `'div'`, or `'section'`. `onSubmit(values, form)` is optional, receives the validated values and the resolved `FormStateHandler`. The provider calls `validateForm()` and `touchAllFields()` before invoking it.",
        '`validationMode` defaults to `blur`. `revalidationMode` defaults to `change`.',
        "`onInit?` loads the real initial values asynchronously in local mode. While it is pending (`initStatus: 'initializing'`), the provider ignores submit events. In external mode, configure `onInit` on the handler instead.",
      ],
      id: 'form-provider-api',
      paragraphs: [
        'Use `FormProvider` to create a controller locally or to connect an existing one to a React subtree.',
      ],
      title: 'FormProvider',
    },
    {
      codeExamples: [
        {
          code: formValidationModesExample,
          label: 'Validation timing defaults and overrides',
          language: 'tsx',
        },
      ],
      bullets: [
        'React forms validate on first blur by default.',
        'Touched fields revalidate on change by default so stale errors clear while the user types.',
        'Use `validationMode` and `revalidationMode` on `FormProvider`, `useUncontrolledField()`, and `Controller` to override that timing.',
        'The bindings always call `validateForm()`. Call `validateTouchedFields()` yourself when only the touched fields must hold an error.',
      ],
      id: 'validation-timing-api',
      paragraphs: [
        'Validation timing lives in the React binding layer, not in the core handler API.',
      ],
      title: 'Validation Timing',
    },
    {
      codeExamples: [
        {
          code: formCustomBindingExample,
          label: 'Custom field binding',
          language: 'ts',
        },
      ],
      bullets: [
        '`FormValidationConfigContext` holds the validation timing of the nearest `FormProvider`. Read it with `useContext()`.',
        "`defaultFormValidationConfig` is the fallback config outside a provider: `validationMode: 'blur'` and `revalidationMode: 'change'`.",
        "`resolveValidationBehavior(config, overrides?)` merges field-level overrides with the form defaults. An `'inherit'` override keeps the form value.",
        "`shouldValidateFieldInteraction(interaction, isTouched, behavior)` returns `true` when a `'blur'` or `'change'` interaction must run validation. It reads `validationMode` before the first touch and `revalidationMode` after it.",
        '`FormValidationConfig`, `ResolvedValidationBehavior`, and `ValidationBehaviorOverrides` type the config, the merge result, and the field overrides.',
      ],
      id: 'custom-bindings-api',
      paragraphs: [
        'A custom binding must follow the same validation timing as the built-in bindings.',
        'These exports give your binding the rules that `useUncontrolledField()` and `Controller` use internally.',
      ],
      title: 'Custom Bindings',
    },
    {
      codeExamples: [
        {
          code: formValidatorFlowExample,
          label: 'Handler validation lifecycle',
          language: 'ts',
        },
      ],
      bullets: [
        '`new FormStateHandler(config)` takes `{ initialValues, onInit?, validator?, options? }`.',
        '`initialValues` sets the first `values` and defines the shape the form keeps. `validator?` returns the typed field-error map. `options?.devTools` configures the Status Quo devtools integration.',
        "`onInit?` loads the real initial values from an async source. It runs once on the first connect, gets `{ signal }` for abort handling, and applies its result through `initialize()`. `initStatus` tracks the lifecycle as `'ready' | 'initializing' | 'error'`, and `initError` holds the failure message.",
        'The state snapshot is `{ values, errors, submitError, touched, isSubmitting, isValid, isDirty, initStatus, initError }`.',
        '`isDirty` is `true` when the current values differ from the baseline (`initialValues`). It updates on `setFieldValue()`, `resetForm()`, and `initialize()`, and is independent of `touched`.',
        "`initialize(values)` sets a new baseline: the values replace `initialValues`, errors and touched state are cleared, `isDirty` becomes `false`, and `initStatus` becomes `'ready'`. It does not run the validator. A manual call cancels a pending `onInit`.",
        '`errors` holds active field messages keyed by dot-path. Missing keys mean valid fields. `submitError` is the form-level backend message and stays separate from field validation.',
        '`isValid` only looks at the field error map. A `submitError` can exist while `isValid` is still `true`.',
        '`setFieldValue(name, value, options?)` updates the nested value, optionally reruns the validator, updates `errors`, and clears a stale `submitError`.',
        '`validateForm()` reruns the validator, stores the resulting field errors, and returns `true` or `false` for submit flow control.',
        '`validateTouchedFields()` reruns the validator but keeps only the errors of touched fields. It returns `true` when no touched field has an error. `isValid` then reflects the touched fields only, so use `validateForm()` for the submit check. The filter applies to one run: the next `setFieldValue()` or React blur validation writes the full error map again. A cross-field error on an untouched path is not stored.',
        '`setFieldError(name, errorMessage?)` is for backend field errors. `setSubmitError(errorMessage?)` is for backend failures that do not belong to one field.',
        '`setFieldTouched(name, isTouched?)` marks one field. `touchAllFields()` marks every leaf field so all validation messages show at once.',
        '`resetForm(values?)` goes back to the current baseline, or applies the given values, and clears `errors`, `submitError`, `touched`, and submit state. It never changes the baseline. Use `initialize()` for that.',
        '`setSubmitting(isSubmitting)` is for custom submit flows outside `FormProvider`. With `FormProvider`, the provider manages that flag around `onSubmit` for you.',
      ],
      id: 'form-state-handler-api',
      paragraphs: [
        'This is the root controller for the full form lifecycle.',
        'Field validation state lives in `errors` and `isValid`. Form-level failures live in `submitError`.',
      ],
      title: 'FormStateHandler',
    },
    {
      bullets: [
        '`toZodValidator(schema)` takes one schema-like object with `safeParse(values)` and `error.issues`.',
        'It returns a `ValidatorFn<TValues>` that maps schema issues into the standard field-error shape.',
        'Use it when a feature already owns a Zod schema and the form should keep its normal validator function.',
      ],
      id: 'to-zod-validator-api',
      paragraphs: ['The adapter keeps schema integration narrow.'],
      title: 'toZodValidator',
    },
    {
      bullets: [
        '`useFieldMeta(name)` takes one field name or dot-path.',
        'It returns `{ error, touched, showError }` for that field only.',
        'Use it when a component only needs validation metadata and should not subscribe to the whole form.',
      ],
      id: 'use-field-meta-api',
      paragraphs: ['This is the smallest read surface in the React layer.'],
      title: 'useFieldMeta',
    },
    {
      bullets: [
        '`useFormController()` takes no parameters.',
        'It returns the current `FormStateHandler` from the nearest `FormProvider`.',
        'It throws when used outside a `FormProvider`, so a missing provider fails fast.',
      ],
      id: 'use-form-controller-api',
      paragraphs: ['Use this hook when a component needs the controller itself.'],
      title: 'useFormController',
    },
    {
      bullets: [
        '`useFormMeta()` takes no parameters.',
        'It returns form-level metadata: `{ errors, submitError, touched, isSubmitting, isValid, isDirty, initStatus, initError }`.',
        'Use it for error summaries, submit banners, unsaved-changes guards, or loading states while `onInit` runs.',
      ],
      id: 'use-form-meta-api',
      paragraphs: ['This is the broad read surface for form-level UI.'],
      title: 'useFormMeta',
    },
    {
      bullets: [
        '`useUncontrolledField(name, options?)` takes one field name or dot-path plus optional field configuration.',
        '`options?` depends on the element type. It covers checkboxes, radios, selects, default values, value extraction, and `validationMode` / `revalidationMode` overrides.',
        'It returns the registration props and `meta` you need to bind native inputs without controlled React state.',
      ],
      id: 'use-uncontrolled-field-api',
      paragraphs: ['This is the default field hook for native inputs.'],
      title: 'useUncontrolledField',
    },
  ],
  eyebrow: 'Guides',
  id: 'api-reference',
  intro:
    'The API is split by responsibility: generic form state at the root, React bindings under the subpath.',
  summary: 'Everything public.',
  title: 'API Reference',
};
