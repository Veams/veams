/**
 * React components for form management.
 * Provides the FormProvider and Controller for building interactive forms.
 */
import { useStateSubscription } from '@veams/status-quo/react';
import React, { useRef } from 'react';

import { FormStateHandler, type FormValues, type ValidatorFn } from '../form.state.js';
import { getValueAtPath } from '../path-utils.js';
import { FormContext, type AnyFieldValues } from './context.js';
import { useFieldMeta, type FieldMeta } from './hooks/use-field-meta.js';
import { useFormController } from './hooks/use-form-controller.js';
import { useUncontrolledField, type UseFieldOptions } from './hooks/use-uncontrolled-field.js';

import type { FormHTMLAttributes, ReactNode, SyntheticEvent } from 'react';

/**
 * Common properties for all FormProvider variants.
 */
interface BaseFormProviderProps<T extends FormValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit'> {
  // Child components that can access the form context.
  children: ReactNode;
  // Callback triggered on successful form submission.
  onSubmit: (values: T, form: FormStateHandler<T>) => void | Promise<void>;
}

/**
 * Props for FormProvider when it manages its own local state.
 */
interface FormProviderWithLocalState<T extends FormValues> extends BaseFormProviderProps<T> {
  formHandlerInstance?: undefined;
  // Initial values required for local state initialization.
  initialValues: T;
  // Optional validator for the local state.
  validator?: ValidatorFn<T>;
}

/**
 * Props for FormProvider when using an externally provided FormStateHandler.
 */
interface FormProviderWithExternalState<T extends FormValues> extends BaseFormProviderProps<T> {
  // The external FormStateHandler instance to use.
  formHandlerInstance: FormStateHandler<T>;
  initialValues?: never;
  validator?: never;
}

/**
 * Combined type for FormProvider props.
 */
export type FormProviderProps<T extends FormValues> =
  | FormProviderWithLocalState<T>
  | FormProviderWithExternalState<T>;

/**
 * Internal helper to resolve a value from the form state.
 */
function getFieldValue(values: FormValues, name: string): unknown {
  return getValueAtPath(values, name);
}

/**
 * Props provided to the render function of the Controller component.
 */
export interface ControllerRenderProps {
  // Standard field attributes and handlers.
  field: {
    name: string;
    onBlur: () => void;
    onChange: (value: unknown) => void;
    value: unknown;
  };
  // Current metadata status of the field.
  fieldState: {
    error?: string;
    invalid: boolean;
    touched: boolean;
  };
}

/**
 * Props for the Controller component.
 */
export interface ControllerProps {
  // Dot-notation path to the form field.
  name: string;
  // Render prop function to display the field.
  render: (props: ControllerRenderProps) => ReactNode;
}

/**
 * FormProvider component that establishes the form context for a subtree.
 * Can either manage its own local FormStateHandler or bridge an external one.
 */
export function FormProvider<T extends FormValues>(
  props: FormProviderWithLocalState<T>
): React.JSX.Element;
export function FormProvider<T extends FormValues>(
  props: FormProviderWithExternalState<T>
): React.JSX.Element;
export function FormProvider<T extends FormValues>({
  children,
  formHandlerInstance,
  initialValues,
  noValidate = true,
  onSubmit,
  validator,
  ...formProps
}: BaseFormProviderProps<T> & {
  formHandlerInstance?: FormStateHandler<T>;
  initialValues?: T;
  validator?: ValidatorFn<T>;
}) {
  // Reference to hold a locally created handler if needed.
  const localHandlerRef = useRef<FormStateHandler<T> | null>(null);

  // Initialize a local handler if no external instance is provided.
  if (!formHandlerInstance && !localHandlerRef.current) {
    if (initialValues === undefined) {
      throw new Error(
        'FormProvider requires initialValues when no formHandlerInstance is provided.'
      );
    }

    localHandlerRef.current = new FormStateHandler<T>({
      initialValues,
      validator,
    });
  }

  // Resolve which controller to use (external preferred).
  const controller = formHandlerInstance ?? localHandlerRef.current;

  if (!controller) {
    throw new Error('FormProvider could not resolve a form controller.');
  }

  /**
   * Internal submit handler that wraps the user-provided onSubmit callback.
   * Handles validation and submission status updates.
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();

    // Trigger full form validation before submission.
    if (!controller.validateForm()) {
      // Mark all fields as touched to show validation errors.
      controller.touchAllFields();
      return;
    }

    controller.setSubmitting(true);

    try {
      // Execute the provided submission logic.
      await onSubmit(controller.getState().values, controller);
    } finally {
      // Reset submitting status regardless of outcome.
      controller.setSubmitting(false);
    }
  };

  return (
    <FormContext.Provider value={controller as unknown as FormStateHandler<AnyFieldValues>}>
      <form {...formProps} noValidate={noValidate} onSubmit={(event) => void handleSubmit(event)}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

/**
 * Controller component for bridging third-party controlled components.
 * Subscribes to the specific field value and metadata.
 */
export function Controller({ name, render }: ControllerProps) {
  const controller = useFormController<AnyFieldValues>();
  // Subscribe to the specific field value from the form state.
  const [value] = useStateSubscription(controller, (state) => getFieldValue(state.values, name));
  // Retrieve current field metadata (errors, touched).
  const meta = useFieldMeta(name);

  /**
   * Internal change handler that handles both raw values and DOM events.
   */
  const onChange = (input: unknown) => {
    // Check if the input is a DOM event.
    if (typeof input === 'object' && input !== null && 'target' in input) {
      const eventTarget = (
        input as { target: { checked?: boolean; type?: string; value?: unknown } }
      ).target;
      const nextValue = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;

      controller.setFieldValue(name, nextValue);
      return;
    }

    // Otherwise, treat it as a raw value update.
    controller.setFieldValue(name, input);
  };

  return render({
    field: {
      name,
      onBlur: () => {
        controller.setFieldTouched(name, true);
      },
      onChange,
      value,
    },
    fieldState: {
      error: meta.error,
      invalid: Boolean(meta.error),
      touched: meta.touched,
    },
  });
}

// Re-export core hooks for convenient access.
export { useFieldMeta, useFormController, useUncontrolledField };
export type { FieldMeta, UseFieldOptions };
