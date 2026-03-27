/**
 * React context for providing the form controller to the component tree.
 */
import { createContext } from 'react';

import { FormStateHandler } from '../form.state.js';

/**
 * Generic type for field values used within the React context layer.
 */
export type AnyFieldValues = Record<string, unknown>;

/**
 * Validation timing for field interactions.
 */
export type ValidationMode = 'change' | 'blur' | 'submit' | 'inherit';

/**
 * Resolved validation timing config used by the React integration layer.
 */
export interface FormValidationConfig {
  revalidationMode: Exclude<ValidationMode, 'inherit'>;
  validationMode: Exclude<ValidationMode, 'inherit'>;
}

/**
 * Default field validation timing in React forms.
 */
export const defaultFormValidationConfig: FormValidationConfig = {
  revalidationMode: 'change',
  validationMode: 'blur',
};

/**
 * React Context object that holds the FormStateHandler instance.
 * Defaults to null if no Provider is found in the tree.
 */
export const FormContext = createContext<FormStateHandler<AnyFieldValues> | null>(null);

/**
 * React Context object that holds validation timing config for the subtree.
 */
export const FormValidationConfigContext = createContext<FormValidationConfig>(
  defaultFormValidationConfig
);
