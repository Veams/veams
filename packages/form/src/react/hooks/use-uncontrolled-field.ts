import { useEffect, useRef } from 'react';

import { type FormState, type FormValues } from '../../form.state.js';
import { getValueAtPath } from '../../path-utils.js';
import type { AnyFieldValues } from '../context.js';
import { useFieldMeta, type FieldMeta } from './use-field-meta.js';
import { useFormController } from './use-form-controller.js';

import type { ChangeEvent, InputHTMLAttributes, RefObject } from 'react';

type FieldValue = string | number | boolean | string[] | undefined;
type InputType = NonNullable<InputHTMLAttributes<HTMLInputElement>['type']>;
type FormSnapshot = FormState<AnyFieldValues>;

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
  // DOM values are string-based. Normalize scalar values into stable strings.
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  // Fallback for null/undefined/objects keeps the field empty.
  return '';
}

function getFieldValue(values: FormValues, name: string): unknown {
  // Dot-path lookups are resolved through the form path utility.
  return getValueAtPath(values, name);
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
/**
 * Wires an uncontrolled native field to the form controller.
 *
 * The DOM keeps the input value, while this hook synchronizes:
 * 1. initial value from form state -> field default props
 * 2. live form updates -> DOM element
 * 3. field events -> form state
 */
export function useUncontrolledField(name: string, options: UseFieldOptions = {}) {
  // Resolve the form controller from provider scope.
  const controller = useFormController<AnyFieldValues>();
  // Keep a ref to the native element so we can imperatively sync external form updates.
  const fieldRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);
  // Reuse shared field UX metadata hook.
  const meta = useFieldMeta(name);
  // Capture the initial form value once for defaultValue/defaultChecked wiring.
  const initialValue = useRef(getFieldValue(controller.getState().values, name) as FieldValue).current;
  // Choose field kind from options.
  const element = options.element ?? 'input';
  // Input-only options are ignored for select/textarea variants.
  const inputType: InputType = isInputFieldOptions(options) ? (options.type ?? 'text') : 'text';
  // Radio values come from options.value.
  const radioValue = isInputFieldOptions(options) ? options.value : undefined;
  // Select multiple mode is explicit.
  const multiple = isSelectFieldOptions(options) && options.multiple === true;

  useEffect(() => {
    // Subscribe once and keep uncontrolled DOM in sync when form state changes externally.
    return controller.subscribe((state: FormSnapshot) => {
      // Bail out until the ref has been attached.
      if (!fieldRef.current) {
        return;
      }

      // Resolve the current form value for this field path.
      const currentValue = getFieldValue(state.values, name);

      switch (element) {
        case 'select': {
          const select = fieldRef.current as HTMLSelectElement;

          if (multiple) {
            // In multi-select mode we sync selected flags per option.
            const selectedValues = Array.isArray(currentValue)
              ? currentValue.map((entry) => toFieldString(entry))
              : [];

            Array.from(select.options).forEach((option) => {
              option.selected = selectedValues.includes(option.value);
            });
            return;
          }

          // Single select uses direct value assignment.
          select.value = toFieldString(currentValue);
          return;
        }

        case 'textarea': {
          const textarea = fieldRef.current as HTMLTextAreaElement;
          const normalizedValue = toFieldString(currentValue);

          // Skip unnecessary DOM writes.
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

          // Skip unnecessary DOM writes.
          if (input.value !== normalizedValue) {
            input.value = normalizedValue;
          }
        }
      }
    });
  }, [controller, element, inputType, multiple, name, radioValue]);

  const handleBlur = () => {
    // Blur marks the field as touched for UX behavior.
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
