/**
 * Hook for observing aggregate form metadata.
 */
import { useStateSubscription } from '@veams/status-quo/react';

import type { FormErrors, FormTouched, FormValues } from '../../form.state.js';
import type { AnyFieldValues } from '../context.js';
import { useFormController } from './use-form-controller.js';

/**
 * Aggregated metadata for the full form.
 */
export interface FormMeta<T extends FormValues> {
  // Current field-level validation errors.
  errors: FormErrors<T>;
  // Whether the form is currently being submitted.
  isSubmitting: boolean;
  // Whether the field-level error map is empty.
  isValid: boolean;
  // Generic backend or submit-level error message.
  submitError?: string;
  // Current touched state for all fields.
  touched: FormTouched<T>;
}

/**
 * Subscribes to aggregate form metadata.
 */
export function useFormMeta<T extends FormValues>(): FormMeta<T> {
  const controller = useFormController<AnyFieldValues>();

  const [errors] = useStateSubscription(controller, (state) => state.errors);
  const [isSubmitting] = useStateSubscription(controller, (state) => state.isSubmitting);
  const [isValid] = useStateSubscription(controller, (state) => state.isValid);
  const [submitError] = useStateSubscription(controller, (state) => state.submitError);
  const [touched] = useStateSubscription(controller, (state) => state.touched);

  return {
    errors: errors as FormErrors<T>,
    isSubmitting,
    isValid,
    submitError,
    touched: touched as FormTouched<T>,
  };
}
