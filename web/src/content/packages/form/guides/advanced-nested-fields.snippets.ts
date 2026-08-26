export const formNestedStateExample = `import { FormStateHandler } from '@veams/form';

type ProfileValues = {
  profile: {
    email: string;
    name: string;
  };
  settings: {
    newsletter: boolean;
  };
};

const profileForm = new FormStateHandler<ProfileValues>({
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
    ...(values.profile.email ? {} : { 'profile.email': 'Email is required' }),
    ...(values.profile.name ? {} : { 'profile.name': 'Name is required' }),
  }),
});

profileForm.setFieldValue('profile.email', 'jane@veams.org');
profileForm.setFieldValue('settings.newsletter', true);
profileForm.setFieldTouched('profile.email', true);
profileForm.validateForm();`;

export const formNestedReactExample = `import { FormProvider, useUncontrolledField } from '@veams/form/react';

function ProfileEmailField() {
  const { meta, registerProps } = useUncontrolledField('profile.email');

  return (
    <label>
      Email
      <input {...registerProps} type="email" />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function NewsletterField() {
  const { registerProps } = useUncontrolledField('settings.newsletter', {
    type: 'checkbox',
  });

  return (
    <label>
      <input {...registerProps} />
      Newsletter
    </label>
  );
}

function ProfileForm() {
  return (
    <FormProvider
      initialValues={{
        profile: {
          email: '',
          name: '',
        },
        settings: {
          newsletter: false,
        },
      }}
      onSubmit={(values) => saveProfile(values)}
      validator={(values) => ({
        ...(values.profile.email ? {} : { 'profile.email': 'Email is required' }),
      })}
    >
      <ProfileEmailField />
      <NewsletterField />
      <button type="submit">Save</button>
    </FormProvider>
  );
}`;
