import { useStateSubscription } from '@veams/status-quo/react';

import type { AnyFieldValues } from '../context.js';
import { useFormController } from './use-form-controller.js';

export interface FieldMeta {
  error?: string;
  showError: boolean;
  touched: boolean;
}

function getFieldError(errors: Partial<Record<string, string>>, name: string): string | undefined {
  // Field errors are keyed by field name/path.
  return errors[name];
}

function isFieldTouched(touched: Partial<Record<string, boolean>>, name: string): boolean {
  // Unknown keys should behave as "not touched".
  return Boolean(touched[name]);
}

/**
 * Subscribes to one field's UX metadata (`error` + `touched`) and derives `showError`.
 * This keeps rendering logic simple at input call-sites.
 */
export function useFieldMeta(name: string): FieldMeta {
  // Use the generic runtime controller from provider scope.
  const controller = useFormController<AnyFieldValues>();

  // Error and touched are subscribed independently to keep selectors narrowly scoped.
  const [error] = useStateSubscription(controller, (state) => getFieldError(state.errors, name));
  const [touched] = useStateSubscription(controller, (state) =>
    isFieldTouched(state.touched, name)
  );

  // A field-level error is only shown after the field has been touched.
  return {
    error,
    showError: touched && Boolean(error),
    touched,
  };
}
