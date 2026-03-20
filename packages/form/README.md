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

## Feature-Owned Form State

A feature handler can own the form handler and pass it into the React provider. This keeps cross-field validation and non-form UI state in the same feature boundary.

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
      initialValues={{ email: '', password: '' }}
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
