export const formAsyncInitExample = `import { FormProvider, useFormMeta, useUncontrolledField } from '@veams/form/react';

type ProfileValues = {
  name: string;
  email: string;
};

function ProfileFields() {
  const { initStatus, initError } = useFormMeta<ProfileValues>();

  if (initStatus === 'error') {
    return <p role="alert">Could not load your profile: {initError}</p>;
  }

  return (
    <fieldset disabled={initStatus === 'initializing'}>
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
}`;

export const formInitializeVsResetExample = `const form = new FormStateHandler({
  initialValues: { email: '' },
});

// initialize() sets a NEW baseline: rebases initialValues,
// clears errors and touched state, sets isDirty to false.
form.initialize({ email: 'loaded@veams.org' });

form.setFieldValue('email', 'typed@veams.org');

// resetForm() goes BACK to the baseline: 'loaded@veams.org', not ''.
form.resetForm();`;

export const formDirtyPrefillExample = `class CompanyEditFormStateHandler extends NativeStateHandler<State, Actions> {
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

    // Apply the server data as the new baseline, not as a user change.
    this.formHandler.initialize(toFormValues(snapshot.data));
  };
}`;
