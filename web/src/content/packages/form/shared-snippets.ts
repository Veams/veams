export const formValidationModesExample = `import { Controller, FormProvider, useUncontrolledField } from '@veams/form/react';

function ControlledRolePicker({ onBlur, onChange, value }) {
  return (
    <div onBlurCapture={onBlur}>
      <button onClick={() => onChange('admin')} type="button">Admin</button>
      <button onClick={() => onChange('editor')} type="button">Editor</button>
      <button onClick={() => onChange('viewer')} type="button">Viewer</button>
      <button onClick={() => onChange('')} type="button">Clear</button>
      <p>{value || 'No role selected yet.'}</p>
    </div>
  );
}

function ChangeEmailField() {
  const { meta, registerProps } = useUncontrolledField('changeEmail', {
    validationMode: 'change',
  });

  return (
    <label>
      Email
      <input {...registerProps} type="email" />
      {meta.showError ? <p>{meta.error}</p> : null}
    </label>
  );
}

function BlurNameField() {
  const { meta, registerProps } = useUncontrolledField('blurName');

  return (
    <label>
      Name
      <input {...registerProps} />
      {meta.showError ? <p>{meta.error}</p> : null}
    </label>
  );
}

function SubmitRoleField() {
  return (
    <Controller
      name="submitRole"
      validationMode="submit"
      render={({ field, fieldState }) => (
        <>
          <ControlledRolePicker
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value as string}
          />
          {fieldState.touched && fieldState.error ? <p>{fieldState.error}</p> : null}
        </>
      )}
    />
  );
}

function AccountForm() {
  return (
    <FormProvider
      initialValues={{ blurName: '', changeEmail: '', submitRole: '' }}
      onSubmit={handleSubmit}
      validator={(values) => ({
        ...(values.blurName ? {} : { blurName: 'Name validates on blur.' }),
        ...(/\\S+@\\S+\\.\\S+/.test(values.changeEmail)
          ? {}
          : { changeEmail: 'Email validates on first change.' }),
        ...(values.submitRole ? {} : { submitRole: 'Role validates on submit.' }),
      })}
      validationMode="blur"
      revalidationMode="change"
    >
      <BlurNameField />
      <ChangeEmailField />
      <SubmitRoleField />
      <button type="submit">Run submit validation</button>
    </FormProvider>
  );
}`;

export const formControllerExample = `import { Controller, FormProvider } from '@veams/form/react';

function ControlledRolePicker({ onBlur, onChange, value }) {
  return (
    <div onBlurCapture={onBlur}>
      <button onClick={() => onChange('admin')} type="button">Admin</button>
      <button onClick={() => onChange('editor')} type="button">Editor</button>
      <button onClick={() => onChange('viewer')} type="button">Viewer</button>
      <button onClick={() => onChange('')} type="button">Clear</button>
      <p>{value || 'No role selected yet.'}</p>
    </div>
  );
}

function ControlledRoleField() {
  return (
    <Controller
      name="role"
      render={({ field, fieldState }) => (
        <>
          <ControlledRolePicker
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value as string}
          />
          {fieldState.touched && fieldState.error ? <p>{fieldState.error}</p> : null}
        </>
      )}
    />
  );
}

function RoleForm() {
  return (
    <FormProvider
      initialValues={{ role: '' }}
      validator={(values) => ({
        ...(values.role ? {} : { role: 'Choose one role before saving.' }),
      })}
      onSubmit={(values) => saveRole(values.role)}
    >
      <ControlledRoleField />
      <button type="submit">Save role</button>
    </FormProvider>
  );
}`;

export const formValidatorFlowExample = `import { FormStateHandler } from '@veams/form';

type LoginValues = {
  email: string;
  password: string;
};

const validateLogin = (values: LoginValues) => {
  const errors: Partial<Record<keyof LoginValues, string>> = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\\S+@\\S+\\.\\S+/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 12) {
    errors.password = 'Use at least 12 characters';
  }

  return errors;
};

const loginForm = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: validateLogin,
});

// Field updates re-run the validator and keep isValid in sync.
loginForm.setFieldValue('email', 'john@veams.org');

// Submit flow should validate the full snapshot before side effects.
const isValid = loginForm.validateForm();
if (!isValid) {
  loginForm.touchAllFields();
}`;
