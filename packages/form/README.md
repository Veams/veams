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
- `FormFieldValue`
- `FormInitStatus`
- `FormState`
- `FormStateHandlerConfig`
- `FormStateHandlerOptions`
- `FormTouched`
- `FormValues`
- `OnInitFn`
- `ValidatorFn`

React entrypoint:

- `@veams/form/react`
- `FormProvider`
- `useFormController`
- `useFieldMeta`
- `useFormMeta`
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

## FormProvider Wrapper

By default, `FormProvider` renders a `<form>` element. You can change this using the `renderAs` prop (supports `'form'`, `'fieldset'`, `'div'`, or `'section'`). When using a non-form element, `onSubmit` becomes optional and the native submit event is not automatically attached.

```tsx
<FormProvider renderAs="div" initialValues={{ name: '' }}>
  {/* ... */}
</FormProvider>
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

### Custom Bindings

The library exports `FormValidationConfigContext`, `defaultFormValidationConfig`,
`resolveValidationBehavior`, and `shouldValidateFieldInteraction` from
`@veams/form/react` for custom field bindings.

```ts
import { useContext } from 'react';
import {
  FormValidationConfigContext,
  resolveValidationBehavior,
  shouldValidateFieldInteraction,
} from '@veams/form/react';

const config = useContext(FormValidationConfigContext);
const behavior = resolveValidationBehavior(config, overrides);

function handleBlur() {
  if (shouldValidateFieldInteraction('blur', touched, behavior)) {
    validateField();
  }
}
```

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

## Async Initial Values (`onInit`)

Sometimes the real initial values come from an API. Passing them synchronously is impossible, and applying them later with `setFieldValue` or `resetForm` makes the load look like a user change.

`onInit` solves this at the lifecycle level. `initialValues` stays required and acts as the synchronous skeleton; `onInit` loads the real baseline once, on the first connect:

```ts
import { FormStateHandler } from '@veams/form';

type ProfileValues = {
  name: string;
  email: string;
};

const profileForm = new FormStateHandler<ProfileValues>({
  // Synchronous skeleton — rendered while loading.
  initialValues: { name: '', email: '' },
  // Loads the real baseline. The signal aborts if the form disconnects first.
  onInit: async ({ signal }) => {
    const profile = await fetchProfile({ signal });
    return { name: profile.name, email: profile.email };
  },
  validator: validateProfile,
});
```

The form state exposes the lifecycle through `initStatus`:

- `'ready'` — values are the final baseline. Synchronous forms (no `onInit`) start here.
- `'initializing'` — `onInit` is pending; `values` are still the skeleton.
- `'error'` — `onInit` failed; `initError` holds the message.

Lifecycle rules:

- `onInit` runs once, when the first consumer connects. Repeated connects do not re-run it.
- If the form disconnects while loading, the `AbortSignal` fires, the stale result is dropped, and a later reconnect retries the load.
- The resolved values are applied via `initialize()`: they become the new baseline for `resetForm()` and `isDirty`, touched state stays empty, and the validator does not run — validation starts with the first interaction.
- While `initStatus` is `'initializing'`, `FormProvider` ignores submit events.

With the React bindings, `FormProvider` accepts `onInit` directly and `useFormMeta()` exposes the status:

```tsx
import { FormProvider, useFormMeta, useUncontrolledField } from '@veams/form/react';

function ProfileFields() {
  const { initStatus, initError } = useFormMeta<ProfileValues>();

  if (initStatus === 'error') {
    return <p role="alert">Could not load your profile: {initError}</p>;
  }

  const isLoading = initStatus === 'initializing';

  return (
    <fieldset disabled={isLoading}>
      <NameField />
      <EmailField />
    </fieldset>
  );
}

function ProfileForm() {
  return (
    <FormProvider
      initialValues={{ name: '', email: '' }}
      onInit={({ signal }) => fetchProfileValues({ signal })}
      onSubmit={saveProfile}
      validator={validateProfile}
    >
      <ProfileFields />
      <button type="submit">Save</button>
    </FormProvider>
  );
}
```

Fields are not force-disabled during `'initializing'` — disabling is a UI decision the consumer makes through `initStatus`, as shown above.

### `initialize()` vs `resetForm()`

`onInit` is sugar over the public `initialize(values)` primitive. The two reset-like actions have a deliberate semantic split:

- `initialize(values)` — **set a new baseline.** Rebases `initialValues`, clears errors/touched, sets `isDirty` to `false`, marks `initStatus` as `'ready'`. Use it whenever loaded data should become "what the form started from" — async prefills, switching the edited entity, loading a draft.
- `resetForm(values?)` — **go back to the baseline.** Without arguments it reverts to the current baseline. With values it sets them as current values but does *not* rebase — a later `resetForm()` still returns to the baseline.

```ts
const form = new FormStateHandler({ initialValues: { email: '' } });

form.initialize({ email: 'loaded@veams.org' }); // new baseline
form.setFieldValue('email', 'typed@veams.org');
form.resetForm();                               // back to 'loaded@veams.org', not ''
```

A manual `initialize()` call also cancels a still-pending `onInit` — the explicit call wins.

## Dirty Tracking (`isDirty`)

`isDirty` reports whether the current values deviate from the baseline (`initialValues`), using deep structural comparison. It answers a different question than `touched`:

- `touched` — *"has the user interacted with this field?"* (per field, set on blur)
- `isDirty` — *"do the values differ from the baseline?"* (whole form, value-based)

Typing a value and then typing the original value back makes the form clean again:

```ts
const form = new FormStateHandler({
  initialValues: { email: 'base@veams.org' },
});

form.getState().isDirty;                       // false
form.setFieldValue('email', 'new@veams.org');
form.getState().isDirty;                       // true
form.setFieldValue('email', 'base@veams.org');
form.getState().isDirty;                       // false — values match the baseline again
```

`isDirty` interacts with the baseline actions as follows:

| Action | Effect on `isDirty` |
| --- | --- |
| `setFieldValue(...)` | recomputed against the baseline |
| `resetForm()` | `false` (values equal the baseline) |
| `resetForm(values)` | recomputed — stays `true` if `values` differ from the (unrebased) baseline |
| `initialize(values)` | `false` (the values *are* the new baseline) |

Typical consumer uses: an unsaved-changes guard, or disabling save buttons.

```tsx
import { useFormMeta } from '@veams/form/react';

function SaveBar() {
  const { isDirty, isSubmitting } = useFormMeta<ProfileValues>();

  return (
    <button disabled={!isDirty || isSubmitting} type="submit">
      Save changes
    </button>
  );
}
```

### Server-Driven Prefill Without Shadow State

`initialize()` and `isDirty` together replace the common "remember what we prefilled last time" boilerplate. A feature handler that prefills a form from a server query only needs one rule — *never overwrite user edits*:

```ts
class CompanyEditFormStateHandler extends NativeStateHandler<State, Actions> {
  private readonly formHandler = new FormStateHandler<CompanyValues>({
    initialValues: emptyCompanyValues,
    validator: validateCompany,
  });

  protected override onConnect(): void {
    this.bindSubscribable(this.companyProfileQuery, this.syncWithCompanyProfileQuery);
  }

  private syncWithCompanyProfileQuery = (snapshot: QuerySnapshot): void => {
    if (snapshot.status !== 'success') return;

    // The form knows whether the user edited anything since the last baseline.
    if (this.formHandler.getState().isDirty) return;

    // Apply the server data as the new baseline — not as a user change.
    this.formHandler.initialize(toFormValues(snapshot.data));
  };
}
```

The flow: every successful query emission rebases the form while it is untouched; as soon as the user edits anything, `isDirty` becomes `true` and prefills stop. No copies of the last prefilled values, no manual comparison helpers. As a bonus, a user-triggered `resetForm()` returns to the *prefilled* baseline instead of the empty skeleton.

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
