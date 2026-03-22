/**
 * Internal hook for accessing the FormStateHandler from context.
 */
import { useContext } from 'react';

import { type FormValues, FormStateHandler } from '../../form.state.js';
import { FormContext } from '../context.js';

/**
 * Retrieves the current FormStateHandler from the nearest FormProvider.
 * Throws an error if called outside of a FormProvider scope.
 * Allows callers to provide a generic type T to restore strict typing for form values.
 */
export function useFormController<T extends FormValues>() {
  // Read the nearest provider value from context.
  const controller = useContext(FormContext);

  // Hook usage without a provider is always a programming error.
  if (!controller) {
    throw new Error('Form hooks must be used within FormProvider.');
  }

  // Cast the generic context instance back to the requested typed instance.
  return controller as unknown as FormStateHandler<T>;
}
