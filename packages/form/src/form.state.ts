/**
 * Core form state management logic and types.
 */
import { SignalStateHandler, type DevToolsOptions } from '@veams/status-quo';

import { collectLeafPaths, setValueAtPath } from './path-utils.js';

/**
 * Base type for form values, restricted to object shapes.
 */
export type FormValues = object;

/**
 * Supported primitive types for form leaf values.
 */
type Primitive = bigint | boolean | Date | null | number | string | symbol | undefined;

/**
 * Type guard to check if a value is a leaf (primitive or array).
 */
type IsLeafValue<TValue> =
  TValue extends Primitive ? true : TValue extends readonly unknown[] ? true : false;

/**
 * Helper type for constructing dot-notation paths for nested objects.
 */
type DotPath<TKey extends string, TPath extends string> = `${TKey}.${TPath}`;

/**
 * Generates a union of all possible field names in a nested object using dot-notation.
 */
export type FormFieldName<T extends FormValues> = {
  [TKey in Extract<keyof T, string>]: IsLeafValue<T[TKey]> extends true
    ? TKey
    : T[TKey] extends FormValues
      ? TKey | DotPath<TKey, FormFieldName<T[TKey]>>
      : TKey;
}[Extract<keyof T, string>];

/**
 * Resolves the type of a value at a specific dot-path.
 */
export type FormFieldValue<TValue, TPath extends string> = TPath extends `${infer Head}.${infer Tail}`
  ? Head extends keyof TValue
    ? FormFieldValue<TValue[Head], Tail>
    : never
  : TPath extends keyof TValue
    ? TValue[TPath]
    : never;

/**
 * Represents validation errors keyed by field name.
 */
export type FormErrors<T extends FormValues> = Partial<Record<FormFieldName<T>, string>>;

/**
 * Represents the touched state of fields, keyed by field name.
 */
export type FormTouched<T extends FormValues> = Partial<Record<FormFieldName<T>, boolean>>;

/**
 * The internal state structure for a form.
 */
export interface FormState<T extends FormValues> {
  // The current field values.
  values: T;
  // Current validation errors.
  errors: FormErrors<T>;
  // Which fields have been interacted with.
  touched: FormTouched<T>;
  // Whether the form is currently being submitted.
  isSubmitting: boolean;
  // Whether the form is currently valid.
  isValid: boolean;
}

/**
 * Function signature for form validation.
 */
export type ValidatorFn<T extends FormValues> = (values: T) => FormErrors<T>;

/**
 * Configuration options for the form state handler.
 */
export interface FormStateHandlerOptions {
  // Optional Redux DevTools integration settings.
  devTools?: DevToolsOptions;
}

/**
 * Initial configuration for creating a new form state handler.
 */
export interface FormStateHandlerConfig<T extends FormValues> {
  // The initial data for the form.
  initialValues: T;
  // Optional runtime settings.
  options?: FormStateHandlerOptions;
  // Optional validation logic.
  validator?: ValidatorFn<T>;
}

/**
 * Default runtime settings for the form handler.
 */
const defaultFormStateHandlerOptions: Required<FormStateHandlerOptions> = {
  devTools: {
    enabled: false,
    namespace: 'Form',
  },
};

/**
 * Defines the public actions available to manipulate the form state.
 */
export interface FormActions<T extends FormValues> {
  // Reverts the form to its initial state or a new set of values.
  resetForm: (values?: T) => void;
  // Sets an explicit error message for a field.
  setFieldError: (name: FormFieldName<T>, errorMessage?: string) => void;
  // Updates the touched status of a specific field.
  setFieldTouched: (name: FormFieldName<T>, isTouched?: boolean) => void;
  // Updates the value of a specific field and triggers validation.
  setFieldValue: <K extends FormFieldName<T>>(name: K, value: FormFieldValue<T, K>) => void;
  // Toggles the form's submitting status.
  setSubmitting: (isSubmitting: boolean) => void;
  // Marks all fields in the form as touched.
  touchAllFields: () => void;
  // Triggers a full validation of the current form values.
  validateForm: () => boolean;
}

/**
 * Central engine for form state management.
 * Extends Status Quo's SignalStateHandler for efficient reactivity.
 */
export class FormStateHandler<T extends FormValues> extends SignalStateHandler<
  FormState<T>,
  FormActions<T>
> {
  // Reference values for resetting the form.
  private readonly initialValues: T;
  // The validation function provided during initialization.
  private readonly validator?: ValidatorFn<T>;

  /**
   * Creates a new FormStateHandler instance.
   * Initializes the internal state and optional DevTools connection.
   */
  constructor(config: FormStateHandlerConfig<T>) {
    const { initialValues, options, validator } = config;

    super({
      initialState: {
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
      },
      options: {
        ...options,
        devTools: options?.devTools ?? defaultFormStateHandlerOptions.devTools,
      },
    });

    this.initialValues = initialValues;
    this.validator = validator;
  }

  /**
   * Returns the stable action map for the form.
   */
  getActions(): FormActions<T> {
    return {
      resetForm: this.resetForm,
      setFieldError: this.setFieldError,
      setFieldTouched: this.setFieldTouched,
      setFieldValue: this.setFieldValue,
      setSubmitting: this.setSubmitting,
      touchAllFields: this.touchAllFields,
      validateForm: this.validateForm,
    };
  }

  /**
   * Resets the form state.
   * If values are provided, they become the new current values.
   */
  resetForm = (values?: T) => {
    const nextValues = values ?? this.initialValues;

    this.setState(
      {
        values: nextValues,
        errors: {} as FormErrors<T>,
        touched: {} as FormTouched<T>,
        isSubmitting: false,
        isValid: true,
      },
      'Form :: Reset'
    );
  };

  /**
   * Updates a single field value using its dot-path name.
   * Triggers synchronous validation after the update.
   */
  setFieldValue = <K extends FormFieldName<T>>(name: K, value: FormFieldValue<T, K>) => {
    const currentState = this.getState();
    // Update the nested value while maintaining immutability.
    const nextValues = setValueAtPath(currentState.values, name, value);
    // Re-run validation on the full value set.
    const nextErrors = this.validateValues(nextValues);

    this.setState(
      {
        values: nextValues,
        errors: nextErrors,
        isValid: this.isEmptyErrors(nextErrors),
      },
      `Form :: Set ${String(name)}`
    );
  };

  /**
   * Updates the touched status for a field.
   */
  setFieldTouched = (name: FormFieldName<T>, isTouched = true) => {
    const currentState = this.getState();

    this.setState(
      {
        touched: {
          ...currentState.touched,
          [name]: isTouched,
        },
      },
      `Form :: Touch ${String(name)}`
    );
  };

  /**
   * Manually sets an error for a specific field.
   */
  setFieldError = (name: FormFieldName<T>, errorMessage?: string) => {
    const currentState = this.getState();
    // Merge the new error and remove empty entries.
    const nextErrors = compactErrors<T>({
      ...currentState.errors,
      [name]: errorMessage,
    });

    this.setState(
      {
        errors: nextErrors,
        isValid: this.isEmptyErrors(nextErrors),
      },
      `Form :: Error ${String(name)}`
    );
  };

  /**
   * Updates the global isSubmitting flag.
   */
  setSubmitting = (isSubmitting: boolean) => {
    this.setState(
      {
        isSubmitting,
      },
      isSubmitting ? 'Form :: Submit Start' : 'Form :: Submit End'
    );
  };

  /**
   * Marks all possible leaf-node fields as touched.
   */
  touchAllFields = () => {
    const currentState = this.getState();
    // Use path utilities to find every interactive field.
    const touched = collectLeafPaths(currentState.values).reduce<FormTouched<T>>((result, key) => {
      result[key as FormFieldName<T>] = true;
      return result;
    }, {});

    this.setState(
      {
        touched,
      },
      'Form :: Touch All'
    );
  };

  /**
   * Performs a full validation of current values and updates error state.
   */
  validateForm = () => {
    const currentState = this.getState();
    const nextErrors = this.validateValues(currentState.values);
    const isValid = this.isEmptyErrors(nextErrors);

    this.setState(
      {
        errors: nextErrors,
        isValid,
      },
      'Form :: Validate'
    );

    return isValid;
  };

  /**
   * Checks if an error map contains any actual messages.
   */
  private isEmptyErrors(errors: FormErrors<T>) {
    return Object.keys(errors).length === 0;
  }

  /**
   * Internal helper to run the validator and clean up its output.
   */
  private validateValues(values: T): FormErrors<T> {
    if (!this.validator) {
      return {} as FormErrors<T>;
    }

    return compactErrors(this.validator(values));
  }
}

/**
 * Removes undefined, null, or empty string values from an error record.
 */
function compactErrors<T extends FormValues>(
  errors: Partial<Record<FormFieldName<T>, string | undefined>>
): FormErrors<T> {
  const nextErrors: FormErrors<T> = {};

  for (const key in errors) {
    const fieldName = key as FormFieldName<T>;
    const errorMessage = errors[fieldName];

    if (!errorMessage) {
      continue;
    }

    nextErrors[fieldName] = errorMessage;
  }

  return nextErrors;
}
