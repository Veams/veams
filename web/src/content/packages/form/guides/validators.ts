import type { PackagePage } from '../../../types';
import { formValidatorFlowExample } from '../shared-snippets';
import {
  formValidatorServerErrorsExample,
  formValidatorTinyAdapterReference,
  formValidatorTouchedFieldsExample,
  formValidatorZodExample,
} from './validators.snippets';

export const validatorsPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formValidatorFlowExample,
          label: 'Typed validator flow',
          language: 'ts',
        },
      ],
      bullets: [
        'Keep validators deterministic: same input values should always return the same error map.',
        'Return only active errors. Missing keys should mean valid fields.',
        'Use the validator for cross-field rules when one field depends on another.',
      ],
      id: 'validator-basics',
      paragraphs: [
        'A validator is a pure function. It gets all form values and returns an error map.',
        'The same validator runs for field updates and for the full submit check.',
      ],
      title: 'Model validation as one typed function',
    },
    {
      codeExamples: [
        {
          code: formValidatorServerErrorsExample,
          label: 'Merge API validation errors',
          language: 'ts',
        },
      ],
      bullets: [
        'Use `validateForm()` for client-side rules before submit.',
        'Use `setFieldError()` for backend field errors after submit.',
        'Use `setSubmitError()` for backend failures that do not belong to one field.',
        'Call `touchAllFields()` on invalid submit so errors become visible immediately.',
      ],
      id: 'validator-submit-cycle',
      paragraphs: [
        'Split validation clearly: local rules go in the validator, backend field errors in `setFieldError()`, and form-level failures in `setSubmitError()`.',
        'That keeps the submit cycle easy to follow.',
      ],
      title: 'Compose client and server validation',
    },
    {
      codeExamples: [
        {
          code: formValidatorTouchedFieldsExample,
          label: 'Touched-only validation',
          language: 'ts',
        },
      ],
      bullets: [
        'Call `validateTouchedFields()` when the form must only show errors for the fields the user already touched.',
        'The action runs the same validator as `validateForm()`. It then removes the errors of untouched paths.',
        'An error stays when its path is a touched path, a parent of a touched path, or a child of a touched path.',
        'Mark one field with `setFieldTouched(name)`. Mark every leaf field with `touchAllFields()`.',
        '`isValid` follows the stored error map. After this action it describes the touched fields only.',
        'Keep `validateForm()` for the submit check, because it stores the errors of every field.',
      ],
      callout:
        'The filter applies to one run. `setFieldValue()` and the React blur validation call the full `validateForm()` pipeline, so the next interaction writes the full error map again. A cross-field error on an untouched path also disappears: a "Passwords do not match" error on `passwordConfirm` is dropped while the user touched `password` only.',
      id: 'validator-touched-fields',
      paragraphs: [
        'A long form should not show an error for a field the user did not reach yet.',
        '`validateTouchedFields()` gives you that progressive feedback without a second validator.',
      ],
      title: 'Validate only the touched fields',
    },
    {
      codeExamples: [
        {
          code: formValidatorZodExample,
          label: 'Schema adapter with Zod',
          language: 'ts',
        },
      ],
      bullets: [
        'Use `toZodValidator(schema)` from `@veams/form/validators/zod` for the common case.',
        'Keep the schema and the adapter close together inside the feature.',
      ],
      id: 'validator-zod-adapter',
      paragraphs: [
        'If your project already uses a schema library, one small adapter is enough.',
        'The form still works with its normal validator function.',
      ],
      title: 'Integrate schema validation without coupling',
    },
    {
      codeExamples: [
        {
          code: formValidatorTinyAdapterReference,
          label: 'Tiny adapter reference',
          language: 'ts',
        },
      ],
      id: 'validator-zod-adapter-reference',
      paragraphs: [
        'Need custom issue mapping or schema wrappers? Start from this tiny adapter.',
        'The package currently ships a Zod adapter only.',
      ],
      title: 'Adapter Reference',
    },
  ],
  eyebrow: 'Guides',
  id: 'validators',
  intro:
    'One typed validator is the source of truth. Server errors are added through explicit updates.',
  summary: 'Predictable validation from input to submit.',
  title: 'Validators',
};
