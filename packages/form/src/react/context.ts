import { createContext } from 'react';

import { FormStateHandler } from '../form.state.js';

// The React layer always works with a generic object-like value shape.
// Concrete generic types are recovered by useFormController<T>().
export type AnyFieldValues = Record<string, unknown>;

// Context carries one resolved FormStateHandler instance per provider tree.
export const FormContext = createContext<FormStateHandler<AnyFieldValues> | null>(null);
