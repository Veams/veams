import { FormStateHandler } from '../form.state.js';

describe('FormStateHandler', () => {
  const validator = (values: { email: string }) => {
    const errors: Partial<Record<'email', string>> = {};

    if (!values.email) {
      errors.email = 'Email is required';
    }

    return errors;
  };

  const multiFieldValidator = (values: { company: string; email: string }) => {
    const errors: Partial<Record<'company' | 'email', string>> = {};

    if (!values.company) {
      errors.company = 'Company is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    }

    return errors;
  };

  it('should initialize without validation errors', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    expect(handler.getState()).toEqual({
      errors: {},
      initError: undefined,
      initStatus: 'ready',
      isDirty: false,
      isSubmitting: false,
      isValid: true,
      submitError: undefined,
      touched: {},
      values: {
        email: '',
      },
    });
  });

  it('should update values and validation state inline', () => {
    const handler = new FormStateHandler({
      initialValues: { email: 'test@example.com' },
      validator,
    });

    handler.setFieldValue('email', '');

    expect(handler.getState().values.email).toBe('');
    expect(handler.getState().errors.email).toBe('Email is required');
    expect(handler.getState().isValid).toBe(false);
  });

  it('should allow value updates without triggering validation', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    handler.validateForm();
    handler.setFieldValue('email', 'hello@veams.org', { validate: false });

    expect(handler.getState().values.email).toBe('hello@veams.org');
    expect(handler.getState().errors.email).toBe('Email is required');
    expect(handler.getState().isValid).toBe(false);
  });

  it('should update nested values via dot-paths', () => {
    const handler = new FormStateHandler({
      initialValues: {
        profile: {
          email: '',
        },
      },
      validator: (values) => ({
        ...(values.profile.email ? {} : { 'profile.email': 'Email is required' }),
      }),
    });

    handler.setFieldValue('profile.email', 'alice@veams.org');

    expect(handler.getState().values).toEqual({
      profile: {
        email: 'alice@veams.org',
      },
    });
    expect(handler.getState().errors['profile.email']).toBeUndefined();
  });

  it('should validate touched fields and store touched field errors', () => {
    const handler = new FormStateHandler({
      initialValues: { company: '', email: '' },
      validator: multiFieldValidator,
    });

    handler.setFieldTouched('email');
    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(false);
    expect(handler.getState().errors).toEqual({
      email: 'Email is required',
    });
    expect(handler.getState().isValid).toBe(false);
  });

  it('should remove untouched field errors and keep validateForm behavior', () => {
    const handler = new FormStateHandler({
      initialValues: { company: '', email: 'hello@veams.org' },
      validator: multiFieldValidator,
    });

    handler.setFieldTouched('email');
    const isTouchedValid = handler.validateTouchedFields();

    expect(isTouchedValid).toBe(true);
    expect(handler.getState().errors).toEqual({});
    expect(handler.getState().isValid).toBe(true);

    const isFullyValid = handler.validateForm();

    expect(isFullyValid).toBe(false);
    expect(handler.getState().errors).toEqual({
      company: 'Company is required',
    });
    expect(handler.getState().isValid).toBe(false);
  });

  it('should keep parent-path errors for touched child paths', () => {
    const handler = new FormStateHandler({
      initialValues: {
        profile: {
          email: '',
        },
      },
      validator: () => ({
        profile: 'Profile is invalid',
      }),
    });

    handler.setFieldTouched('profile.email');
    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(false);
    expect(handler.getState().errors).toEqual({
      profile: 'Profile is invalid',
    });
    expect(handler.getState().isValid).toBe(false);
  });

  it('should keep child-path errors for touched parent paths', () => {
    const handler = new FormStateHandler({
      initialValues: {
        profile: {
          email: '',
        },
      },
      validator: () => ({
        'profile.email': 'Email is required',
      }),
    });

    handler.setFieldTouched('profile');
    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(false);
    expect(handler.getState().errors).toEqual({
      'profile.email': 'Email is required',
    });
    expect(handler.getState().isValid).toBe(false);
  });

  it('should clear errors and set valid state when no field is touched', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(true);
    expect(handler.getState().errors).toEqual({});
    expect(handler.getState().isValid).toBe(true);
  });

  it('should ignore fields whose touched entry is false', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    handler.setFieldTouched('email', false);
    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(true);
    expect(handler.getState().errors).toEqual({});
    expect(handler.getState().isValid).toBe(true);
  });

  it('should validate touched fields without a validator', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
    });

    handler.setFieldTouched('email');
    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(true);
    expect(handler.getState().errors).toEqual({});
    expect(handler.getState().isValid).toBe(true);
  });

  it('should keep submitError unchanged when validating touched fields', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    handler.setSubmitError('Backend unavailable');
    handler.setFieldTouched('email');
    const isValid = handler.validateTouchedFields();

    expect(isValid).toBe(false);
    expect(handler.getState().errors).toEqual({
      email: 'Email is required',
    });
    expect(handler.getState().submitError).toBe('Backend unavailable');
  });

  it('should restore the full error map on field change after touched validation', () => {
    const handler = new FormStateHandler({
      initialValues: { company: '', email: 'hello@veams.org' },
      validator: multiFieldValidator,
    });

    handler.setFieldTouched('email');
    handler.validateTouchedFields();
    handler.setFieldValue('email', 'next@veams.org');

    expect(handler.getState().errors).toEqual({
      company: 'Company is required',
    });
    expect(handler.getState().isValid).toBe(false);
  });

  it('should expose validateTouchedFields through getActions', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    expect(handler.getActions().validateTouchedFields).toBe(handler.validateTouchedFields);
  });

  it('should handle manual field errors', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
    });

    handler.setFieldError('email', 'Server error');
    expect(handler.getState().errors.email).toBe('Server error');
    expect(handler.getState().isValid).toBe(false);

    handler.setFieldError('email', undefined);
    expect(handler.getState().errors.email).toBeUndefined();
    expect(handler.getState().isValid).toBe(true);
  });

  it('should handle submit-level errors separately from field errors', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
    });

    handler.setSubmitError('Backend unavailable');

    expect(handler.getState().submitError).toBe('Backend unavailable');
    expect(handler.getState().errors).toEqual({});
    expect(handler.getState().isValid).toBe(true);

    handler.setSubmitError(undefined);

    expect(handler.getState().submitError).toBeUndefined();
  });

  it('should clear submitError when a field value changes', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    handler.setSubmitError('Backend unavailable');
    handler.setFieldValue('email', 'hello@veams.org');

    expect(handler.getState().submitError).toBeUndefined();
  });

  it('should mark all fields as touched', () => {
    const handler = new FormStateHandler({
      initialValues: { company: '', email: '' },
    });

    handler.touchAllFields();

    expect(handler.getState().touched).toEqual({
      company: true,
      email: true,
    });
  });

  it('should mark nested leaf fields as touched', () => {
    const handler = new FormStateHandler({
      initialValues: {
        profile: {
          email: '',
        },
        preferences: {
          newsletter: false,
        },
      },
    });

    handler.touchAllFields();

    expect(handler.getState().touched).toEqual({
      'preferences.newsletter': true,
      'profile.email': true,
    });
  });

  it('should reset values, errors, and touched state', () => {
    const handler = new FormStateHandler({
      initialValues: { email: '' },
      validator,
    });

    handler.setFieldValue('email', '');
    handler.setFieldTouched('email', true);
    handler.resetForm({ email: 'reset@example.com' });

    expect(handler.getState()).toEqual({
      errors: {},
      initError: undefined,
      initStatus: 'ready',
      // Reset with values differing from the unrebased baseline is dirty.
      isDirty: true,
      isSubmitting: false,
      isValid: true,
      submitError: undefined,
      touched: {},
      values: {
        email: 'reset@example.com',
      },
    });
  });

  describe('isDirty', () => {
    it('should track deviation from the baseline and revert on equal values', () => {
      const handler = new FormStateHandler({
        initialValues: { email: 'base@veams.org' },
      });

      expect(handler.getState().isDirty).toBe(false);

      handler.setFieldValue('email', 'edited@veams.org');
      expect(handler.getState().isDirty).toBe(true);

      // Typing back the baseline value makes the form clean again.
      handler.setFieldValue('email', 'base@veams.org');
      expect(handler.getState().isDirty).toBe(false);
    });

    it('should compare nested values deeply', () => {
      const handler = new FormStateHandler({
        initialValues: { profile: { email: '', tags: ['a'] } },
      });

      handler.setFieldValue('profile.tags', ['a', 'b']);
      expect(handler.getState().isDirty).toBe(true);

      handler.setFieldValue('profile.tags', ['a']);
      expect(handler.getState().isDirty).toBe(false);
    });

    it('should clear on resetForm without values and reflect provided values', () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
      });

      handler.setFieldValue('email', 'edited@veams.org');
      handler.resetForm();
      expect(handler.getState().isDirty).toBe(false);

      // Reset with values differing from the (unrebased) baseline stays dirty.
      handler.resetForm({ email: 'other@veams.org' });
      expect(handler.getState().isDirty).toBe(true);
    });

    it('should clear on initialize and compare against the new baseline', () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
      });

      handler.setFieldValue('email', 'edited@veams.org');
      handler.initialize({ email: 'loaded@veams.org' });
      expect(handler.getState().isDirty).toBe(false);

      handler.setFieldValue('email', 'changed@veams.org');
      expect(handler.getState().isDirty).toBe(true);

      // Reverting to the rebased baseline, not the constructor values.
      handler.setFieldValue('email', 'loaded@veams.org');
      expect(handler.getState().isDirty).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should apply values as the new baseline and rebase resetForm', () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        validator,
      });

      handler.setFieldValue('email', 'typed@veams.org');
      handler.setFieldTouched('email', true);
      handler.initialize({ email: 'loaded@veams.org' });

      expect(handler.getState().values.email).toBe('loaded@veams.org');
      expect(handler.getState().touched).toEqual({});
      expect(handler.getState().errors).toEqual({});
      expect(handler.getState().initStatus).toBe('ready');

      // resetForm without arguments reverts to the initialized baseline.
      handler.setFieldValue('email', 'changed@veams.org');
      handler.resetForm();

      expect(handler.getState().values.email).toBe('loaded@veams.org');
    });

    it('should not run the validator on initialize', () => {
      const handler = new FormStateHandler({
        initialValues: { email: 'valid@veams.org' },
        validator,
      });

      handler.initialize({ email: '' });

      expect(handler.getState().errors).toEqual({});
      expect(handler.getState().isValid).toBe(true);
    });
  });

  describe('onInit', () => {
    it('should start in initializing status when onInit is provided', () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit: () => Promise.resolve({ email: 'loaded@veams.org' }),
      });

      expect(handler.getState().initStatus).toBe('initializing');
    });

    it('should load values on connect and transition to ready', async () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit: () => Promise.resolve({ email: 'loaded@veams.org' }),
      });

      handler.connect();
      await Promise.resolve();

      expect(handler.getState().values.email).toBe('loaded@veams.org');
      expect(handler.getState().initStatus).toBe('ready');
      expect(handler.getState().touched).toEqual({});
    });

    it('should invoke onInit only once across repeated connects', async () => {
      const onInit = jest.fn(() => Promise.resolve({ email: 'loaded@veams.org' }));
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit,
      });

      handler.connect();
      handler.connect();
      await Promise.resolve();

      expect(onInit).toHaveBeenCalledTimes(1);
    });

    it('should transition to error status when onInit rejects', async () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit: () => Promise.reject(new Error('API down')),
      });

      handler.connect();
      await Promise.resolve();
      await Promise.resolve();

      expect(handler.getState().initStatus).toBe('error');
      expect(handler.getState().initError).toBe('API down');
      expect(handler.getState().values.email).toBe('');
    });

    it('should abort a pending init on disconnect and drop the stale result', async () => {
      let abortSignal: AbortSignal | undefined;
      let resolveInit: (values: { email: string }) => void = () => undefined;
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit: ({ signal }) => {
          abortSignal = signal;
          return new Promise<{ email: string }>((resolve) => {
            resolveInit = resolve;
          });
        },
      });

      handler.connect();
      handler.disconnect();

      expect(abortSignal?.aborted).toBe(true);

      // A late resolution must not apply stale values.
      resolveInit({ email: 'stale@veams.org' });
      await Promise.resolve();

      expect(handler.getState().values.email).toBe('');
      expect(handler.getState().initStatus).toBe('initializing');
    });

    it('should retry the load when reconnecting after an aborted init', async () => {
      const onInit = jest.fn(() => Promise.resolve({ email: 'loaded@veams.org' }));
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit,
      });

      handler.connect();
      handler.disconnect();
      handler.connect();
      await Promise.resolve();

      expect(onInit).toHaveBeenCalledTimes(2);
      expect(handler.getState().values.email).toBe('loaded@veams.org');
      expect(handler.getState().initStatus).toBe('ready');
    });

    it('should let a manual initialize win over a pending onInit', async () => {
      let resolveInit: (values: { email: string }) => void = () => undefined;
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit: () =>
          new Promise<{ email: string }>((resolve) => {
            resolveInit = resolve;
          }),
      });

      handler.connect();
      handler.initialize({ email: 'manual@veams.org' });

      resolveInit({ email: 'stale@veams.org' });
      await Promise.resolve();

      expect(handler.getState().values.email).toBe('manual@veams.org');
      expect(handler.getState().initStatus).toBe('ready');
    });

    it('should transition to error status when onInit throws synchronously', () => {
      const handler = new FormStateHandler({
        initialValues: { email: '' },
        onInit: () => {
          throw new Error('sync failure');
        },
      });

      handler.connect();

      expect(handler.getState().initStatus).toBe('error');
      expect(handler.getState().initError).toBe('sync failure');
    });
  });
});
