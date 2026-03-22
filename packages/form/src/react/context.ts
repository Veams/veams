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
 * React Context object that holds the FormStateHandler instance.
 * Defaults to null if no Provider is found in the tree.
 */
export const FormContext = createContext<FormStateHandler<AnyFieldValues> | null>(null);
