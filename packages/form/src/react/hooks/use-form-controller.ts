import { useContext } from 'react';

import { type FormValues, FormStateHandler } from '../../form.state.js';
import { FormContext } from '../context.js';

/**
 * Returns the current form controller from context and restores the caller's generic type.
 * The runtime instance is shared through FormContext; the type parameter is compile-time only.
 */
export function useFormController<T extends FormValues>() {
  // Read the nearest provider value.
  const controller = useContext(FormContext);

  // Hook usage without provider is always a programming error.
  if (!controller) {
    throw new Error('Form hooks must be used within FormProvider.');
  }

  // Context stores a generic handler, but callers can recover their concrete T shape.
  return controller as unknown as FormStateHandler<T>;
}
