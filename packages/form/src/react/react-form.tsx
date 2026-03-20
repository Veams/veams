import { useStateSubscription } from '@veams/status-quo/react';
import React, { useRef } from 'react';

import { FormStateHandler, type FormValues, type ValidatorFn } from '../form.state.js';
import { getValueAtPath } from '../path-utils.js';
import { FormContext, type AnyFieldValues } from './context.js';
import { useFieldMeta, type FieldMeta } from './hooks/use-field-meta.js';
import { useFormController } from './hooks/use-form-controller.js';
import { useUncontrolledField, type UseFieldOptions } from './hooks/use-uncontrolled-field.js';

import type { FormHTMLAttributes, ReactNode, SyntheticEvent } from 'react';

interface BaseFormProviderProps<T extends FormValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit'> {
  children: ReactNode;
  onSubmit: (values: T, form: FormStateHandler<T>) => void | Promise<void>;
}

interface FormProviderWithLocalState<T extends FormValues> extends BaseFormProviderProps<T> {
  formHandlerInstance?: undefined;
  initialValues: T;
  validator?: ValidatorFn<T>;
}

interface FormProviderWithExternalState<T extends FormValues> extends BaseFormProviderProps<T> {
  formHandlerInstance: FormStateHandler<T>;
  initialValues?: never;
  validator?: never;
}

export type FormProviderProps<T extends FormValues> =
  | FormProviderWithLocalState<T>
  | FormProviderWithExternalState<T>;

function getFieldValue(values: FormValues, name: string): unknown {
  return getValueAtPath(values, name);
}

export interface ControllerRenderProps {
  field: {
    name: string;
    onBlur: () => void;
    onChange: (value: unknown) => void;
    value: unknown;
  };
  fieldState: {
    error?: string;
    invalid: boolean;
    touched: boolean;
  };
}

export interface ControllerProps {
  name: string;
  render: (props: ControllerRenderProps) => ReactNode;
}

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
  const localHandlerRef = useRef<FormStateHandler<T> | null>(null);

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

  const controller = formHandlerInstance ?? localHandlerRef.current;

  if (!controller) {
    throw new Error('FormProvider could not resolve a form controller.');
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();

    if (!controller.validateForm()) {
      controller.touchAllFields();
      return;
    }

    controller.setSubmitting(true);

    try {
      await onSubmit(controller.getState().values, controller);
    } finally {
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

export function Controller({ name, render }: ControllerProps) {
  const controller = useFormController<AnyFieldValues>();
  const [value] = useStateSubscription(controller, (state) => getFieldValue(state.values, name));
  const meta = useFieldMeta(name);

  const onChange = (input: unknown) => {
    if (typeof input === 'object' && input !== null && 'target' in input) {
      const eventTarget = (
        input as { target: { checked?: boolean; type?: string; value?: unknown } }
      ).target;
      const nextValue = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;

      controller.setFieldValue(name, nextValue);
      return;
    }

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

export { useFieldMeta, useFormController, useUncontrolledField };
export type { FieldMeta, UseFieldOptions };
