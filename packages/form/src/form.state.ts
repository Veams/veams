/**
 * Core form state management logic and types.
 */
import { NativeStateHandler, type DevToolsOptions } from '@veams/status-quo';

import { collectLeafPaths, isDeepEqual, setValueAtPath } from './path-utils.js';

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
 * Lifecycle status of asynchronous form initialization.
 * - 'ready': initial values are final (sync forms start here).
 * - 'initializing': an onInit callback is pending; values are the sync skeleton.
 * - 'error': the onInit callback failed.
 */
export type FormInitStatus = 'ready' | 'initializing' | 'error';

/**
 * The internal state structure for a form.
 */
export interface FormState<T extends FormValues> {
  // The current field values.
  values: T;
  // Current validation errors.
  errors: FormErrors<T>;
  // Generic submit-level backend error, not tied to a field path.
  submitError?: string;
  // Which fields have been interacted with.
  touched: FormTouched<T>;
  // Whether the form is currently being submitted.
  isSubmitting: boolean;
  // Whether the form is currently valid.
  isValid: boolean;
  // Whether the current values deviate from the baseline (initialValues).
  isDirty: boolean;
  // Lifecycle status of asynchronous initialization.
  initStatus: FormInitStatus;
  // Error message captured when asynchronous initialization failed.
  initError?: string;
}

/**
 * Function signature for form validation.
 */
export type ValidatorFn<T extends FormValues> = (values: T) => FormErrors<T>;

/**
 * Function signature for asynchronous initial value loading.
 * Receives an AbortSignal that fires when the handler disconnects before resolution.
 */
export type OnInitFn<T extends FormValues> = (context: { signal: AbortSignal }) => T | Promise<T>;

/**
 * Additional options for field value updates.
 */
export interface SetFieldValueOptions {
  // Whether the value update should trigger validation.
  validate?: boolean;
}

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
  // The initial data for the form. Acts as the sync skeleton while onInit is pending.
  initialValues: T;
  // Optional asynchronous loader for the real initial values, invoked once on first connect.
  onInit?: OnInitFn<T>;
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
  // Applies values as the new baseline: rebases initialValues and resets interaction state.
  initialize: (values: T) => void;
  // Reverts the form to its initial state or a new set of values.
  resetForm: (values?: T) => void;
  // Sets an explicit error message for a field.
  setFieldError: (name: FormFieldName<T>, errorMessage?: string) => void;
  // Sets a generic submit-level error message.
  setSubmitError: (errorMessage?: string) => void;
  // Updates the touched status of a specific field.
  setFieldTouched: (name: FormFieldName<T>, isTouched?: boolean) => void;
  // Updates the value of a specific field and triggers validation.
  setFieldValue: <K extends FormFieldName<T>>(
    name: K,
    value: FormFieldValue<T, K>,
    options?: SetFieldValueOptions
  ) => void;
  // Toggles the form's submitting status.
  setSubmitting: (isSubmitting: boolean) => void;
  // Marks all fields in the form as touched.
  touchAllFields: () => void;
  // Triggers a full validation of the current form values.
  validateForm: () => boolean;
}

/**
 * Central engine for form state management.
 * Extends Status Quo's NativeStateHandler — no signals dependency required.
 */
export class FormStateHandler<T extends FormValues> extends NativeStateHandler<
  FormState<T>,
  FormActions<T>
> {
  // Reference values for resetting the form. Rebased by initialize().
  private initialValues: T;
  // The validation function provided during initialization.
  private readonly validator?: ValidatorFn<T>;
  // Optional asynchronous loader for the real initial values.
  private readonly onInit?: OnInitFn<T>;
  // Guards the onInit callback against running more than once per init cycle.
  private initRan = false;
  // Abort controller for a pending onInit invocation.
  private initAbortController: AbortController | null = null;

  /**
   * Creates a new FormStateHandler instance.
   * Initializes the internal state and optional DevTools connection.
   */
  constructor(config: FormStateHandlerConfig<T>) {
    const { initialValues, onInit, options, validator } = config;

    super({
      initialState: {
        values: initialValues,
        errors: {},
        submitError: undefined,
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
        initStatus: onInit ? 'initializing' : 'ready',
        initError: undefined,
      },
      options: {
        ...options,
        devTools: options?.devTools ?? defaultFormStateHandlerOptions.devTools,
      },
    });

    this.initialValues = initialValues;
    this.validator = validator;
    this.onInit = onInit;
  }

  /**
   * Returns the stable action map for the form.
   */
  getActions(): FormActions<T> {
    return {
      initialize: this.initialize,
      resetForm: this.resetForm,
      setFieldError: this.setFieldError,
      setSubmitError: this.setSubmitError,
      setFieldTouched: this.setFieldTouched,
      setFieldValue: this.setFieldValue,
      setSubmitting: this.setSubmitting,
      touchAllFields: this.touchAllFields,
      validateForm: this.validateForm,
    };
  }

  /**
   * Applies values as the new baseline of the form.
   * Rebases initialValues (so resetForm reverts to them), clears interaction
   * state, and marks initialization as complete. Does not run the validator —
   * validation starts with the first interaction.
   */
  initialize = (values: T) => {
    // Cancel a pending onInit invocation; a manual initialize wins.
    this.initAbortController?.abort();
    this.initAbortController = null;
    this.initRan = true;
    this.initialValues = values;

    this.setState(
      {
        values,
        errors: {},
        submitError: undefined,
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
        initStatus: 'ready',
        initError: undefined,
      },
      'Form :: Initialize'
    );
  };

  /**
   * Resets the form state.
   * If values are provided, they become the new current values.
   * Does not rebase initialValues — use initialize() to set a new baseline.
   */
  resetForm = (values?: T) => {
    const nextValues = values ?? this.initialValues;

    this.setState(
      {
        values: nextValues,
        errors: {},
        submitError: undefined,
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: !isDeepEqual(nextValues, this.initialValues),
      },
      'Form :: Reset'
    );
  };

  /**
   * Updates a single field value using its dot-path name.
   * Triggers synchronous validation after the update.
   */
  setFieldValue = <K extends FormFieldName<T>>(
    name: K,
    value: FormFieldValue<T, K>,
    options?: SetFieldValueOptions
  ) => {
    const currentState = this.getState();
    // Update the nested value while maintaining immutability.
    const nextValues = setValueAtPath(currentState.values, name, value);
    const shouldValidate = options?.validate ?? true;
    const nextErrors = shouldValidate ? this.validateValues(nextValues) : currentState.errors;

    this.setState(
      {
        values: nextValues,
        errors: nextErrors,
        submitError: undefined,
        isValid: this.isEmptyErrors(nextErrors),
        isDirty: !isDeepEqual(nextValues, this.initialValues),
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
   * Manually sets a generic submit-level error message.
   */
  setSubmitError = (errorMessage?: string) => {
    this.setState(
      {
        submitError: errorMessage,
      },
      errorMessage ? 'Form :: Submit Error' : 'Form :: Submit Error Clear'
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
   * Starts the asynchronous initialization when the first consumer connects.
   */
  protected onConnect(): void {
    this.runInit();
  }

  /**
   * Aborts a pending initialization when the last consumer disconnects.
   * Resets the guard so a later reconnect retries the load.
   */
  protected onDisconnect(): void {
    if (!this.initAbortController) {
      return;
    }

    const abortController = this.initAbortController;

    this.initAbortController = null;
    this.initRan = false;
    abortController.abort();
  }

  /**
   * Invokes the onInit callback once and applies its result via initialize().
   */
  private runInit(): void {
    if (!this.onInit || this.initRan) {
      return;
    }

    this.initRan = true;

    const abortController = new AbortController();
    this.initAbortController = abortController;

    let result: T | Promise<T>;

    try {
      result = this.onInit({ signal: abortController.signal });
    } catch (error) {
      this.failInit(error);
      return;
    }

    Promise.resolve(result).then(
      (values) => {
        // Drop stale results after abort or a manual initialize().
        if (abortController.signal.aborted || this.initAbortController !== abortController) {
          return;
        }

        this.initialize(values);
      },
      (error: unknown) => {
        // An aborted load is not an error; the guard was already reset.
        if (abortController.signal.aborted || this.initAbortController !== abortController) {
          return;
        }

        this.failInit(error);
      }
    );
  }

  /**
   * Transitions the form into the init error status.
   */
  private failInit(error: unknown): void {
    this.initAbortController = null;

    this.setState(
      {
        initStatus: 'error',
        initError: error instanceof Error ? error.message : String(error),
      },
      'Form :: Init Error'
    );
  }

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
      return {};
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
