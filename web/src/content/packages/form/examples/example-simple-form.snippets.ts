export const formSimpleWorkingExample = `import { useState } from 'react';
import { FormProvider, useFormController, useFormMeta, useUncontrolledField } from '@veams/form/react';

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function TextField({ description, label, name, type = 'text' }: {
  description: string;
  label: string;
  name: string;
  type?: 'email' | 'password' | 'text';
}) {
  const { meta, registerProps } = useUncontrolledField(name, { type });

  return (
    <label>
      <span>{label}</span>
      <input {...registerProps} />
      <small>{description}</small>
      {meta.showError ? <p>{meta.error}</p> : null}
    </label>
  );
}

function LoginExampleActions() {
  const controller = useFormController<{ email: string; password: string }>();
  const form = useFormMeta<{ email: string; password: string }>();

  return (
    <>
      <button
        onClick={() => {
          controller.setFieldValue('email', 'team@veams.dev');
          controller.setFieldValue('password', 'docs-ship-fast');
        }}
        type="button"
      >
        Load demo values
      </button>
      <button
        onClick={() => {
          if (!controller.validateForm()) {
            controller.touchAllFields();
          }
        }}
        type="button"
      >
        Validate now
      </button>
      <button onClick={() => controller.resetForm()} type="button">
        Reset
      </button>
      <span>Submitting: {String(form.isSubmitting)}</span>
    </>
  );
}

function LoginForm() {
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState<string | null>(null);

  return (
    <FormProvider
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={async (values) => {
        await wait(320);
        setLastSubmittedEmail(values.email);
      }}
      validator={(values) => ({
        ...(values.email ? {} : { email: 'Email is required' }),
        ...(values.password.length >= 12 ? {} : { password: 'Use at least 12 characters' }),
      })}
    >
      <TextField
        description="Try blurring this field empty first."
        label="Email"
        name="email"
        type="email"
      />
      <TextField
        description="Needs at least twelve characters."
        label="Password"
        name="password"
        type="password"
      />
      <LoginExampleActions />
      <button type="submit">Sign in</button>
      <p>Last submit: {lastSubmittedEmail ?? 'none yet'}</p>
    </FormProvider>
  );
}`;
