export const formFeatureValidationWorkingExample = `import { NativeStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';
import { FormStateHandler } from '@veams/form';
import { FormProvider, useFormController, useFormMeta, useUncontrolledField } from '@veams/form/react';

type RegisterValues = {
  account: {
    email: string;
    password: string;
  };
};

type FeatureState = {
  attempts: number;
  lastResult: string;
};

type FeatureActions = {
  getFormHandler: () => FormStateHandler<RegisterValues>;
  submit: (values: RegisterValues) => Promise<void>;
};

class RegisterFeatureHandler extends NativeStateHandler<FeatureState, FeatureActions> {
  private readonly formHandler = new FormStateHandler<RegisterValues>({
    initialValues: {
      account: {
        email: '',
        password: '',
      },
    },
    validator: (values) => ({
      ...(values.account.email ? {} : { 'account.email': 'Email is required' }),
      ...(values.account.password.length >= 12
        ? {}
        : { 'account.password': 'Use at least 12 characters' }),
    }),
  });

  constructor() {
    super({
      initialState: {
        attempts: 0,
        lastResult: 'Waiting for submission.',
      },
    });
  }

  getActions(): FeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      submit: async (values) => {
        this.setState({
          attempts: this.getState().attempts + 1,
          lastResult: 'Submitting request...',
        });

        this.formHandler.setFieldError('account.email', undefined);
        this.formHandler.setFieldError('account.password', undefined);
        this.formHandler.setSubmitError(undefined);

        if (values.account.email.endsWith('@taken.dev')) {
          this.formHandler.setFieldError('account.email', 'This email is already taken.');
          this.setState({ lastResult: 'Backend rejected the email address.' });
          return;
        }

        if (values.account.password.toLowerCase().includes('password')) {
          this.formHandler.setFieldError(
            'account.password',
            'Choose something stronger than "password".'
          );
          this.setState({ lastResult: 'Backend rejected the password.' });
          return;
        }

        if (values.account.email === 'ops@down.dev') {
          this.formHandler.setSubmitError('Auth service temporarily unavailable.');
          this.setState({ lastResult: 'Backend returned a form-level failure.' });
          return;
        }

        this.setState({
          lastResult: \`Created account for \${values.account.email}.\`,
        });
      },
    };
  }
}

function ValidationScenarios() {
  const controller = useFormController<RegisterValues>();
  const form = useFormMeta<RegisterValues>();

  return (
    <>
      {form.submitError ? <p>{form.submitError}</p> : null}
      <button
        onClick={() => {
          controller.setFieldValue('account.email', 'alex@taken.dev');
          controller.setFieldValue('account.password', 'steady-docs-123');
        }}
        type="button"
      >
        Try taken email
      </button>
      <button
        onClick={() => {
          controller.setFieldValue('account.email', 'alex@veams.dev');
          controller.setFieldValue('account.password', 'password-password');
        }}
        type="button"
      >
        Try weak password
      </button>
      <button
        onClick={() => {
          controller.setFieldValue('account.email', 'ops@down.dev');
          controller.setFieldValue('account.password', 'steady-docs-123');
        }}
        type="button"
      >
        Try service outage
      </button>
    </>
  );
}

function RegisterSummary({ attempts, lastResult }: { attempts: number; lastResult: string }) {
  const controller = useFormController<RegisterValues>();
  const form = useFormMeta<RegisterValues>();
  const values = controller.getState().values;

  return (
    <>
      <p>Attempts: {attempts}</p>
      <p>Errors: {Object.keys(form.errors).length}</p>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <p>{lastResult}</p>
    </>
  );
}

function RegisterForm() {
  const [state, actions] = useStateFactory(() => new RegisterFeatureHandler(), []);
  const email = useUncontrolledField('account.email');
  const password = useUncontrolledField('account.password', { type: 'password' });

  return (
    <FormProvider formHandlerInstance={actions.getFormHandler()} onSubmit={actions.submit}>
      <input {...email.registerProps} />
      <input {...password.registerProps} />
      <ValidationScenarios />
      <button type="submit">Create account</button>
      <RegisterSummary attempts={state.attempts} lastResult={state.lastResult} />
    </FormProvider>
  );
}`;
