# @veams/form

Form state handlers plus optional React bindings for the VEAMS StatusQuo ecosystem.

This package keeps form state generic at the root entrypoint and ships React-only helpers under `@veams/form/react`.

## Docs

Live docs:

[https://veams.github.io/status-quo/packages/form/overview](https://veams.github.io/status-quo/packages/form/overview)

## Install

```bash
npm install @veams/form @veams/status-quo react
```

## Package Exports

Root exports:

- `FormStateHandler`
- `FormActions`
- `FormErrors`
- `FormFieldName`
- `FormState`
- `FormStateHandlerConfig`
- `FormStateHandlerOptions`
- `FormTouched`
- `FormValues`
- `ValidatorFn`

React entrypoint:

- `@veams/form/react`
- `FormProvider`
- `useFormController`
- `useFieldMeta`
- `useUncontrolledField`
- `Controller`

Validator adapters:

- `@veams/form/validators`
- `@veams/form/validators/zod`
- `toZodValidator(schema)`

## Quickstart

Create a generic form handler:

```ts
import { FormStateHandler } from '@veams/form';

type LoginValues = {
  email: string;
  password: string;
};

const loginForm = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: (values) => {
    const errors: Partial<Record<keyof LoginValues, string>> = {};

    if (!values.email) {
      errors.email = 'Email is required';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  },
});

loginForm.setFieldValue('email', 'hello@veams.org');
loginForm.validateForm();
```

Nested values are supported through dot-path field names:

```ts
type ProfileForm = {
  profile: {
    email: string;
  };
};

const profileForm = new FormStateHandler<ProfileForm>({
  initialValues: {
    profile: {
      email: '',
    },
  },
});

profileForm.setFieldValue('profile.email', 'nested@veams.org');
profileForm.setFieldTouched('profile.email', true);
```

## React Quickstart

Use `FormProvider` to own one handler instance locally and `useUncontrolledField()` to bind native elements:

```tsx
import { FormProvider, useUncontrolledField } from '@veams/form/react';

function EmailField() {
  const { meta, registerProps } = useUncontrolledField('email');

  return (
    <label>
      Email
      <input {...registerProps} type="email" />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function LoginForm() {
  return (
    <FormProvider
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values) => {
        await submitLogin(values);
      }}
      validator={(values) => ({
        ...(values.email ? {} : { email: 'Email is required' }),
        ...(values.password ? {} : { password: 'Password is required' }),
      })}
    >
      <EmailField />
      <button type="submit">Sign in</button>
    </FormProvider>
  );
}
```

## Validation Timing

In the React layer, fields validate on first blur by default and revalidate on change after they have been touched once.
That keeps empty fields quiet until the user leaves them, while still clearing stale errors as they type a fix.

```tsx
<FormProvider
  initialValues={{ email: '', password: '' }}
  onSubmit={handleSubmit}
  validator={validator}
  validationMode="blur"
  revalidationMode="change"
>
  <EmailField />
</FormProvider>
```

You can override that behavior per field:

```tsx
function EmailField() {
  const { meta, registerProps } = useUncontrolledField('email', {
    validationMode: 'change',
  });

  return (
    <label>
      Email
      <input {...registerProps} type="email" />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function RoleField() {
  return (
    <Controller
      name="role"
      validationMode="submit"
      render={({ field, fieldState }) => (
        <>
          <RoleSelect
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value as string}
          />
          {fieldState.touched && fieldState.error ? <span>{fieldState.error}</span> : null}
        </>
      )}
    />
  );
}
```

Available modes are `'change'`, `'blur'`, `'submit'`, and `'inherit'`.
`'inherit'` means "use the current `FormProvider` defaults".

## Uncontrolled Field Principle

Native fields should stay uncontrolled by default in VEAMS Form, while `FormStateHandler` remains the source of truth for values, errors, touched state, and submit state.

Why this default is useful:

- Lower render churn: typing updates the DOM directly without forcing controlled React value props on every keystroke.
- Native behavior stays intact: browser input semantics, selection handling, and autofill work naturally.
- Cleaner component code: field components mostly spread `registerProps` and render `meta`.
- Clear ownership boundaries: feature/form behavior stays in the handler, React stays a binding layer.

When a component requires controlled props (`value` + `onChange`), use `Controller` intentionally for that field only.

## Feature-Owned Form State

A feature handler can own the form handler and pass it into the React provider. This keeps cross-field validation and non-form UI state in the same feature boundary.
When `formHandlerInstance` is provided, `initialValues` and `validator` stay on the handler and are not passed to `FormProvider`.

```ts
import { SignalStateHandler } from '@veams/status-quo';
import { FormStateHandler } from '@veams/form';

type LoginValues = {
  email: string;
  password: string;
};

type LoginState = {
  isPasswordVisible: boolean;
};

type LoginActions = {
  getFormHandler: () => FormStateHandler<LoginValues>;
  submitLogin: (values: LoginValues) => Promise<void>;
  togglePasswordVisibility: () => void;
};

class LoginStateHandler extends SignalStateHandler<LoginState, LoginActions> {
  private readonly formHandler = new FormStateHandler<LoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validator: (values) => ({
      ...(values.email ? {} : { email: 'Email is required' }),
      ...(values.password ? {} : { password: 'Password is required' }),
    }),
  });

  constructor() {
    super({
      initialState: {
        isPasswordVisible: false,
      },
    });
  }

  getActions(): LoginActions {
    return {
      getFormHandler: () => this.formHandler,
      submitLogin: async (_values) => undefined,
      togglePasswordVisibility: () => {
        this.setState({
          isPasswordVisible: !this.getState().isPasswordVisible,
        });
      },
    };
  }
}
```

```tsx
import { useStateFactory } from '@veams/status-quo/react';
import { FormProvider, useUncontrolledField } from '@veams/form/react';

function PasswordField({ isVisible }: { isVisible: boolean }) {
  const { meta, registerProps } = useUncontrolledField('password', {
    type: isVisible ? 'text' : 'password',
  });

  return (
    <label>
      Password
      <input {...registerProps} />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function LoginFeature() {
  const [state, actions] = useStateFactory(() => new LoginStateHandler(), []);

  return (
    <FormProvider
      formHandlerInstance={actions.getFormHandler()}
      onSubmit={actions.submitLogin}
    >
      <PasswordField isVisible={state.isPasswordVisible} />
      <button onClick={actions.togglePasswordVisibility} type="button">
        Toggle password visibility
      </button>
      <button type="submit">Sign in</button>
    </FormProvider>
  );
}
```

## Controlled Components

Use `Controller` when a third-party field expects `value` and `onChange` instead of native uncontrolled props.
It supports the same `validationMode` and `revalidationMode` overrides as `useUncontrolledField()`.

```tsx
import { Controller, FormProvider } from '@veams/form/react';

function ControlledRoleSelect() {
  return (
    <Controller
      name="role"
      render={({ field, fieldState }) => (
        <>
          <RoleSelect onBlur={field.onBlur} onChange={field.onChange} value={field.value as string} />
          {fieldState.touched && fieldState.error ? <span>{fieldState.error}</span> : null}
        </>
      )}
    />
  );
}

function RoleForm() {
  return (
    <FormProvider
      initialValues={{ role: 'user' }}
      onSubmit={(values) => saveRole(values.role)}
    >
      <ControlledRoleSelect />
      <button type="submit">Save</button>
    </FormProvider>
  );
}
```

## Form-Level Submit Errors

Keep backend errors that are not tied to one field out of the field error map.
Use `setSubmitError()` for those cases and read aggregate state through `useFormMeta()`.

```tsx
import { FormProvider, useFormMeta } from '@veams/form/react';

function SubmitErrorBanner() {
  const { submitError } = useFormMeta<{ email: string; password: string }>();

  return submitError ? <p role="alert">{submitError}</p> : null;
}
```

## Schema Validators (Zod)

`@veams/form` does not depend on Zod, but it exposes a lightweight adapter for Zod-style `safeParse` schemas.
The package currently includes only the Zod adapter because that is the most common schema setup in current usage. PRs for additional adapters are welcome as long as the package remains dependency-free.

```ts
import { z } from 'zod';
import { FormStateHandler } from '@veams/form';
import { toZodValidator } from '@veams/form/validators/zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(12, 'Use at least 12 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const form = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: toZodValidator(loginSchema),
});
```

If you work directly with `FormStateHandler`, `setFieldValue(name, value, { validate: false })` updates the value without rerunning the validator.
The React bindings use that option internally when a field is configured to wait for blur or submit before validating.
