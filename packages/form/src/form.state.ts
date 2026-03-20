import { SignalStateHandler, type DevToolsOptions } from '@veams/status-quo';

export type FormValues = Record<string, unknown>;
export type FormFieldName<T extends FormValues> = Extract<keyof T, string>;
export type FormErrors<T extends FormValues> = Partial<Record<FormFieldName<T>, string>>;
export type FormTouched<T extends FormValues> = Partial<Record<FormFieldName<T>, boolean>>;

export interface FormState<T extends FormValues> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
}

export type ValidatorFn<T extends FormValues> = (values: T) => FormErrors<T>;

export interface FormStateHandlerOptions {
  devTools?: DevToolsOptions;
}

export interface FormStateHandlerConfig<T extends FormValues> {
  initialValues: T;
  options?: FormStateHandlerOptions;
  validator?: ValidatorFn<T>;
}

const defaultFormStateHandlerOptions: Required<FormStateHandlerOptions> = {
  devTools: {
    enabled: false,
    namespace: 'Form',
  },
};

export interface FormActions<T extends FormValues> {
  resetForm: (values?: T) => void;
  setFieldError: (name: FormFieldName<T>, errorMessage?: string) => void;
  setFieldTouched: (name: FormFieldName<T>, isTouched?: boolean) => void;
  setFieldValue: <K extends FormFieldName<T>>(name: K, value: T[K]) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  touchAllFields: () => void;
  validateForm: () => boolean;
}

export class FormStateHandler<T extends FormValues> extends SignalStateHandler<
  FormState<T>,
  FormActions<T>
> {
  private readonly initialValues: T;
  private readonly validator?: ValidatorFn<T>;

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

  setFieldValue = <K extends FormFieldName<T>>(name: K, value: T[K]) => {
    const currentState = this.getState();
    const nextValues = {
      ...currentState.values,
      [name]: value,
    } as T;
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

  setFieldError = (name: FormFieldName<T>, errorMessage?: string) => {
    const currentState = this.getState();
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

  setSubmitting = (isSubmitting: boolean) => {
    this.setState(
      {
        isSubmitting,
      },
      isSubmitting ? 'Form :: Submit Start' : 'Form :: Submit End'
    );
  };

  touchAllFields = () => {
    const currentState = this.getState();
    const touched = Object.keys(currentState.values).reduce<FormTouched<T>>((result, key) => {
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

  private isEmptyErrors(errors: FormErrors<T>) {
    return Object.keys(errors).length === 0;
  }

  private validateValues(values: T): FormErrors<T> {
    if (!this.validator) {
      return {} as FormErrors<T>;
    }

    return compactErrors(this.validator(values));
  }
}

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
