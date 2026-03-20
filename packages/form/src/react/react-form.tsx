import { useStateSubscription } from '@veams/status-quo/react';
import React, { createContext, useContext, useEffect, useRef } from 'react';

import { FormStateHandler, type FormState, type FormValues, type ValidatorFn } from '../form.state.js';

import type {
  ChangeEvent,
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  SyntheticEvent,
} from 'react';

type AnyFieldValues = FormValues;
type FieldValue = string | number | boolean | string[] | undefined;
type InputType = NonNullable<InputHTMLAttributes<HTMLInputElement>['type']>;
type FormSnapshot = FormState<AnyFieldValues>;

export interface FieldMeta {
  error?: string;
  showError: boolean;
  touched: boolean;
}

interface RegisterInputFieldProps {
  defaultChecked?: boolean;
  defaultValue?: string;
  name: string;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ref: RefObject<HTMLInputElement | null>;
  type: InputType;
  value?: string;
}

interface RegisterSelectFieldProps {
  defaultValue?: string | string[];
  multiple?: boolean;
  name: string;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  ref: RefObject<HTMLSelectElement | null>;
}

interface RegisterTextareaFieldProps {
  defaultValue?: string;
  name: string;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  ref: RefObject<HTMLTextAreaElement | null>;
}

interface BaseFormProviderProps<T extends FormValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit'> {
  children: ReactNode;
  onSubmit: (values: T, form: FormStateHandler<T>) => void | Promise<void>;
}

interface FormProviderWithInitialValues<T extends FormValues> extends BaseFormProviderProps<T> {
  formHandlerInstance?: FormStateHandler<T>;
  initialValues: T;
  validator?: ValidatorFn<T>;
}

export type FormProviderProps<T extends FormValues> = FormProviderWithInitialValues<T>;

interface InputFieldOptions {
  element?: 'input';
  type?: InputType;
  value?: string;
}

interface SelectFieldOptions {
  element: 'select';
  multiple?: boolean;
}

interface TextareaFieldOptions {
  element: 'textarea';
}

export type UseFieldOptions = InputFieldOptions | SelectFieldOptions | TextareaFieldOptions;

function isInputFieldOptions(options: UseFieldOptions): options is InputFieldOptions {
  return options.element === undefined || options.element === 'input';
}

function isSelectFieldOptions(options: UseFieldOptions): options is SelectFieldOptions {
  return options.element === 'select';
}

function toFieldString(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

function getFieldValue(values: FormValues, name: string): unknown {
  return values[name];
}

function getFieldError(errors: Partial<Record<string, string>>, name: string): string | undefined {
  return errors[name];
}

function isFieldTouched(touched: Partial<Record<string, boolean>>, name: string): boolean {
  return Boolean(touched[name]);
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

const FormContext = createContext<FormStateHandler<AnyFieldValues> | null>(null);

export function FormProvider<T extends FormValues>({
  children,
  formHandlerInstance,
  initialValues,
  noValidate = true,
  onSubmit,
  validator,
  ...formProps
}: FormProviderProps<T>) {
  const localHandlerRef = useRef<FormStateHandler<T> | null>(null);

  if (!formHandlerInstance && !localHandlerRef.current) {
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
    <FormContext.Provider value={controller as FormStateHandler<AnyFieldValues>}>
      <form {...formProps} noValidate={noValidate} onSubmit={(event) => void handleSubmit(event)}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export function useFormController<T extends FormValues>() {
  const controller = useContext(FormContext);

  if (!controller) {
    throw new Error('Form hooks must be used within FormProvider.');
  }

  return controller as FormStateHandler<T>;
}

export function useFieldMeta(name: string): FieldMeta {
  const controller = useFormController<AnyFieldValues>();
  const [error] = useStateSubscription(controller, (state) => getFieldError(state.errors, name));
  const [touched] = useStateSubscription(controller, (state) =>
    isFieldTouched(state.touched, name)
  );

  return {
    error,
    showError: touched && Boolean(error),
    touched,
  };
}

export function useUncontrolledField(
  name: string,
  options?: InputFieldOptions
): { meta: FieldMeta; registerProps: RegisterInputFieldProps };
export function useUncontrolledField(
  name: string,
  options: SelectFieldOptions
): { meta: FieldMeta; registerProps: RegisterSelectFieldProps };
export function useUncontrolledField(
  name: string,
  options: TextareaFieldOptions
): { meta: FieldMeta; registerProps: RegisterTextareaFieldProps };
export function useUncontrolledField(name: string, options: UseFieldOptions = {}) {
  const controller = useFormController<AnyFieldValues>();
  const fieldRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);
  const meta = useFieldMeta(name);
  const initialValue = useRef(getFieldValue(controller.getState().values, name) as FieldValue).current;
  const element = options.element ?? 'input';
  const inputType: InputType = isInputFieldOptions(options) ? (options.type ?? 'text') : 'text';
  const radioValue = isInputFieldOptions(options) ? options.value : undefined;
  const multiple = isSelectFieldOptions(options) && options.multiple === true;

  useEffect(() => {
    return controller.subscribe((state: FormSnapshot) => {
      if (!fieldRef.current) {
        return;
      }

      const currentValue = getFieldValue(state.values, name);

      switch (element) {
        case 'select': {
          const select = fieldRef.current as HTMLSelectElement;

          if (multiple) {
            const selectedValues = Array.isArray(currentValue)
              ? currentValue.map((entry) => toFieldString(entry))
              : [];

            Array.from(select.options).forEach((option) => {
              option.selected = selectedValues.includes(option.value);
            });
            return;
          }

          select.value = toFieldString(currentValue);
          return;
        }

        case 'textarea': {
          const textarea = fieldRef.current as HTMLTextAreaElement;
          const normalizedValue = toFieldString(currentValue);

          if (textarea.value !== normalizedValue) {
            textarea.value = normalizedValue;
          }
          return;
        }

        default: {
          const input = fieldRef.current as HTMLInputElement;
          const inputValue = currentValue as FieldValue;

          if (inputType === 'checkbox') {
            input.checked = Boolean(inputValue);
            return;
          }

          if (inputType === 'radio') {
            input.checked = inputValue === radioValue;
            return;
          }

          const normalizedValue = inputValue !== undefined ? String(inputValue) : '';

          if (input.value !== normalizedValue) {
            input.value = normalizedValue;
          }
        }
      }
    });
  }, [controller, element, inputType, multiple, name, radioValue]);

  const handleBlur = () => {
    controller.setFieldTouched(name, true);
  };

  if (element === 'select') {
    const registerProps: RegisterSelectFieldProps = {
      multiple,
      name,
      onBlur: handleBlur,
      onChange: (event) => {
        if (multiple) {
          const nextValue = Array.from(event.target.options)
            .filter((option) => option.selected)
            .map((option) => option.value);

          controller.setFieldValue(name, nextValue);
          return;
        }

        controller.setFieldValue(name, event.target.value);
      },
      ref: fieldRef as RefObject<HTMLSelectElement | null>,
    };

    if (multiple) {
      registerProps.defaultValue = Array.isArray(initialValue)
        ? initialValue.map((entry) => toFieldString(entry))
        : [];
    } else {
      registerProps.defaultValue = initialValue !== undefined ? String(initialValue) : '';
    }

    return { meta, registerProps };
  }

  if (element === 'textarea') {
    const registerProps: RegisterTextareaFieldProps = {
      defaultValue: initialValue !== undefined ? String(initialValue) : '',
      name,
      onBlur: handleBlur,
      onChange: (event) => {
        controller.setFieldValue(name, event.target.value);
      },
      ref: fieldRef as RefObject<HTMLTextAreaElement | null>,
    };

    return { meta, registerProps };
  }

  const registerProps: RegisterInputFieldProps = {
    name,
    onBlur: handleBlur,
    onChange: (event) => {
      const nextValue =
        inputType === 'checkbox'
          ? event.target.checked
          : inputType === 'radio'
            ? radioValue
            : event.target.value;

      controller.setFieldValue(name, nextValue);
    },
    ref: fieldRef as RefObject<HTMLInputElement | null>,
    type: inputType,
  };

  if (inputType === 'checkbox') {
    registerProps.defaultChecked = Boolean(initialValue);
  } else if (inputType === 'radio') {
    registerProps.defaultChecked = initialValue === radioValue;
    registerProps.value = radioValue;
  } else {
    registerProps.defaultValue = initialValue !== undefined ? String(initialValue) : '';
  }

  return { meta, registerProps };
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
