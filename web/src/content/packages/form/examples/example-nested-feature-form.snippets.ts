export const formNestedFeatureWorkingExample = `import { NativeStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';
import { FormStateHandler } from '@veams/form';
import { FormProvider, useFormController, useFormMeta, useUncontrolledField } from '@veams/form/react';

type ProfileValues = {
  profile: {
    email: string;
    name: string;
  };
  settings: {
    newsletter: boolean;
  };
};

type FeatureState = {
  lastSavedName: string;
  saveCount: number;
  status: 'idle' | 'saved';
};

type FeatureActions = {
  getFormHandler: () => FormStateHandler<ProfileValues>;
  loadExampleProfile: () => void;
  saveProfile: (values: ProfileValues) => Promise<void>;
};

class ProfileFeatureHandler extends NativeStateHandler<FeatureState, FeatureActions> {
  private readonly formHandler = new FormStateHandler<ProfileValues>({
    initialValues: {
      profile: {
        email: '',
        name: '',
      },
      settings: {
        newsletter: false,
      },
    },
    validator: (values) => ({
      ...(values.profile.name ? {} : { 'profile.name': 'Name is required' }),
      ...(values.profile.email.includes('@')
        ? {}
        : { 'profile.email': 'Enter a valid email address' }),
    }),
  });

  constructor() {
    super({
      initialState: {
        lastSavedName: 'Nobody yet',
        saveCount: 0,
        status: 'idle',
      },
    });
  }

  getActions(): FeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      loadExampleProfile: () => {
        this.formHandler.setFieldValue('profile.name', 'Mina Foster');
        this.formHandler.setFieldValue('profile.email', 'mina@veams.dev');
        this.formHandler.setFieldValue('settings.newsletter', true);
      },
      saveProfile: async (values) => {
        this.setState({
          lastSavedName: values.profile.name,
          saveCount: this.getState().saveCount + 1,
          status: 'saved',
        });
      },
    };
  }
}

function CheckboxField({ label, name }: { label: string; name: string }) {
  const { registerProps } = useUncontrolledField(name, { type: 'checkbox' });

  return (
    <label>
      <input {...registerProps} />
      <span>{label}</span>
    </label>
  );
}

function ProfileSummary({
  lastSavedName,
  loadExampleProfile,
  saveCount,
}: {
  lastSavedName: string;
  loadExampleProfile: () => void;
  saveCount: number;
}) {
  const controller = useFormController<ProfileValues>();
  const form = useFormMeta<ProfileValues>();
  const values = controller.getState().values;

  return (
    <>
      <p>Saves: {saveCount}</p>
      <p>Touched fields: {Object.keys(form.touched).length}</p>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <p>Last saved profile: {lastSavedName}</p>
      <button onClick={loadExampleProfile} type="button">
        Load demo profile
      </button>
      <button onClick={() => controller.resetForm()} type="button">
        Reset values
      </button>
    </>
  );
}

function ProfileFields() {
  const email = useUncontrolledField('profile.email');
  const name = useUncontrolledField('profile.name');

  return (
    <>
      <input {...name.registerProps} placeholder="Name" />
      <input {...email.registerProps} placeholder="Email" />
      <CheckboxField label="Subscribe to release notes" name="settings.newsletter" />
    </>
  );
}

function ProfileFeatureForm() {
  const [state, actions] = useStateFactory(() => new ProfileFeatureHandler(), []);

  return (
    <FormProvider
      formHandlerInstance={actions.getFormHandler()}
      onSubmit={actions.saveProfile}
    >
      <ProfileFields />
      <button type="submit">Save profile</button>
      <ProfileSummary
        lastSavedName={state.lastSavedName}
        loadExampleProfile={actions.loadExampleProfile}
        saveCount={state.saveCount}
      />
    </FormProvider>
  );
}`;
