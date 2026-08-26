export const formAsyncInitWorkingExample = `import { NativeStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';
import { FormStateHandler } from '@veams/form';
import { FormProvider, useFormController, useFormMeta, useUncontrolledField } from '@veams/form/react';

type ProfileValues = {
  email: string;
  name: string;
};

type FeatureState = {
  lastServerEvent: string;
  serverVersion: number;
};

type FeatureActions = {
  getFormHandler: () => FormStateHandler<ProfileValues>;
  reloadFromServer: () => Promise<void>;
  save: (values: ProfileValues) => Promise<void>;
};

const serverProfiles: ProfileValues[] = [
  { email: 'mina@veams.dev', name: 'Mina Foster' },
  { email: 'jonas@veams.dev', name: 'Jonas Berg' },
];

class AsyncProfileFeatureHandler extends NativeStateHandler<FeatureState, FeatureActions> {
  private readonly formHandler = new FormStateHandler<ProfileValues>({
    // Synchronous skeleton, visible while onInit resolves.
    initialValues: {
      email: '',
      name: '',
    },
    // Loads the real baseline once, when the first field connects.
    onInit: async ({ signal }) => {
      const profile = await fetchProfile({ signal });

      this.setState({ lastServerEvent: 'Initial profile loaded.' });

      return profile;
    },
    validator: (values) => ({
      ...(values.name ? {} : { name: 'Name is required' }),
      ...(values.email.includes('@') ? {} : { email: 'Enter a valid email address' }),
    }),
  });

  constructor() {
    super({
      initialState: {
        lastServerEvent: 'Loading initial profile...',
        serverVersion: 0,
      },
    });
  }

  getActions(): FeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      reloadFromServer: async () => {
        const nextVersion = this.getState().serverVersion + 1;
        const profile = serverProfiles[nextVersion % serverProfiles.length];

        this.setState({ serverVersion: nextVersion });

        // The dirty guard: never overwrite what the user typed.
        if (this.formHandler.getState().isDirty) {
          this.setState({ lastServerEvent: 'Prefill skipped: unsaved edits (isDirty).' });
          return;
        }

        this.formHandler.initialize(profile);
        this.setState({ lastServerEvent: 'Prefill applied via initialize().' });
      },
      save: async (values) => {
        await persistProfile(values);

        // Saved values become the new baseline: the form is clean again.
        this.formHandler.initialize(values);
        this.setState({ lastServerEvent: \`Saved \${values.name}.\` });
      },
    };
  }
}

function TextField({ label, name }: { label: string; name: string }) {
  const { meta, registerProps } = useUncontrolledField(name);

  return (
    <label>
      <span>{label}</span>
      <input {...registerProps} />
      {meta.showError ? <p>{meta.error}</p> : null}
    </label>
  );
}

function ProfileFields() {
  const form = useFormMeta<ProfileValues>();

  return (
    <fieldset disabled={form.initStatus === 'initializing'}>
      <TextField label="Name" name="name" />
      <TextField label="Email" name="email" />
      <button
        disabled={form.initStatus !== 'ready' || !form.isDirty || form.isSubmitting}
        type="submit"
      >
        Save changes
      </button>
    </fieldset>
  );
}

function LifecyclePanel({
  lastServerEvent,
  reloadFromServer,
}: {
  lastServerEvent: string;
  reloadFromServer: () => Promise<void>;
}) {
  const controller = useFormController<ProfileValues>();
  const form = useFormMeta<ProfileValues>();

  return (
    <>
      <p>Init status: {form.initStatus}</p>
      <p>Dirty: {form.isDirty ? 'yes' : 'no'}</p>
      <p>{lastServerEvent}</p>
      <button onClick={() => void reloadFromServer()} type="button">
        Simulate server update
      </button>
      <button onClick={() => controller.resetForm()} type="button">
        Reset to baseline
      </button>
    </>
  );
}

function AsyncInitProfileForm() {
  const [featureState, actions] = useStateFactory(() => new AsyncProfileFeatureHandler(), []);

  return (
    <FormProvider<ProfileValues>
      formHandlerInstance={actions.getFormHandler()}
      onSubmit={actions.save}
    >
      <ProfileFields />
      <LifecyclePanel
        lastServerEvent={featureState.lastServerEvent}
        reloadFromServer={actions.reloadFromServer}
      />
    </FormProvider>
  );
}`;
