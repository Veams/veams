/**
 * Hook for wiring uncontrolled native fields to the form controller.
 */
import { useEffect, useRef } from 'react';

import { type FormState, type FormValues } from '../../form.state.js';
import { getValueAtPath } from '../../path-utils.js';
import type { AnyFieldValues } from '../context.js';
import { useFieldMeta, type FieldMeta } from './use-field-meta.js';
import { useFormController } from './use-form-controller.js';

import type { ChangeEvent, InputHTMLAttributes, RefObject } from 'react';

/**
 * Supported value types for native form fields.
 */
type FieldValue = string | number | boolean | string[] | undefined;

/**
 * Valid HTML input types.
 */
type InputType = NonNullable<InputHTMLAttributes<HTMLInputElement>['type']>;

/**
 * Snapshot of the form state for internal use.
 */
type FormSnapshot = FormState<AnyFieldValues>;

/**
 * Props returned for binding a standard <input /> element.
 */
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

/**
 * Props returned for binding a <select /> element.
 */
interface RegisterSelectFieldProps {
  defaultValue?: string | string[];
  multiple?: boolean;
  name: string;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  ref: RefObject<HTMLSelectElement | null>;
}

/**
 * Props returned for binding a <textarea /> element.
 */
interface RegisterTextareaFieldProps {
  defaultValue?: string;
  name: string;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  ref: RefObject<HTMLTextAreaElement | null>;
}

/**
 * Configuration options for input elements.
 */
interface InputFieldOptions {
  element?: 'input';
  type?: InputType;
  value?: string;
}

/**
 * Configuration options for select elements.
 */
interface SelectFieldOptions {
  element: 'select';
  multiple?: boolean;
}

/**
 * Configuration options for textarea elements.
 */
interface TextareaFieldOptions {
  element: 'textarea';
}

/**
 * Union type for all supported field options.
 */
export type UseFieldOptions = InputFieldOptions | SelectFieldOptions | TextareaFieldOptions;

/**
 * Type guard for input options.
 */
function isInputFieldOptions(options: UseFieldOptions): options is InputFieldOptions {
  return options.element === undefined || options.element === 'input';
}

/**
 * Type guard for select options.
 */
function isSelectFieldOptions(options: UseFieldOptions): options is SelectFieldOptions {
  return options.element === 'select';
}

/**
 * Normalizes any value into a string suitable for DOM attributes.
 */
function toFieldString(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

/**
 * Resolves a value from form state for a given path.
 */
function getFieldValue(values: FormValues, name: string): unknown {
  return getValueAtPath(values, name);
}

// Overload signatures for different element types to provide correct props.
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
 * The DOM keeps the input value, and the hook synchronizes state changes back to the DOM element
 * using an imperative reference to avoid React re-renders for value changes.
 */
export function useUncontrolledField(name: string, options: UseFieldOptions = {}) {
  // Resolve the form controller from context.
  const controller = useFormController<AnyFieldValues>();
  // Create a ref to the DOM element for imperative updates.
  const fieldRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);
  // Get field metadata (errors, touched status).
  const meta = useFieldMeta(name);
  // Store the initial value once to use as defaultValue/defaultChecked.
  const initialValue = useRef(getFieldValue(controller.getState().values, name) as FieldValue).current;

  const element = options.element ?? 'input';
  const inputType: InputType = isInputFieldOptions(options) ? (options.type ?? 'text') : 'text';
  const radioValue = isInputFieldOptions(options) ? options.value : undefined;
  const multiple = isSelectFieldOptions(options) && options.multiple === true;

  /**
   * Effect hook that manages the imperative bridge from state handler to DOM.
   * Subscribes to the form controller and updates the DOM node directly.
   */
  useEffect(() => {
    return controller.subscribe((state: FormSnapshot) => {
      // Skip updates if the element is not yet mounted.
      if (!fieldRef.current) {
        return;
      }

      const currentValue = getFieldValue(state.values, name);

      // Imperatively update the DOM based on the element type.
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

  /**
   * Common blur handler to mark the field as touched.
   */
  const handleBlur = () => {
    controller.setFieldTouched(name, true);
  };

  // Construct props for SELECT elements.
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

  // Construct props for TEXTAREA elements.
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

  // Construct props for INPUT elements.
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

  // Wire initial values to defaultValue or defaultChecked.
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
