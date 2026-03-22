/**
 * Hook for observing specific field metadata (errors and touched status).
 */
import { useStateSubscription } from '@veams/status-quo/react';

import type { AnyFieldValues } from '../context.js';
import { useFormController } from './use-form-controller.js';

/**
 * Represents the metadata status for a single form field.
 */
export interface FieldMeta {
  // Current validation error message, if any.
  error?: string;
  // Computed flag indicating if the error should be displayed (usually touched && error).
  showError: boolean;
  // Whether the user has interacted with the field.
  touched: boolean;
}

/**
 * Internal helper to retrieve an error for a specific field name.
 */
function getFieldError(errors: Partial<Record<string, string>>, name: string): string | undefined {
  return errors[name];
}

/**
 * Internal helper to retrieve the touched status for a specific field name.
 */
function isFieldTouched(touched: Partial<Record<string, boolean>>, name: string): boolean {
  return Boolean(touched[name]);
}

/**
 * Subscribes to one field's metadata and derives UX flags.
 * Uses fine-grained subscriptions to minimize component re-renders.
 */
export function useFieldMeta(name: string): FieldMeta {
  // Access the form controller from context.
  const controller = useFormController<AnyFieldValues>();

  // Subscribe to error updates for this field.
  const [error] = useStateSubscription(controller, (state) => getFieldError(state.errors, name));
  // Subscribe to touched status updates for this field.
  const [touched] = useStateSubscription(controller, (state) =>
    isFieldTouched(state.touched, name)
  );

  // Return the combined metadata object.
  return {
    error,
    showError: touched && Boolean(error),
    touched,
  };
}
