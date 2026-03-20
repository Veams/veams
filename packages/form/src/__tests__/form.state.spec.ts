import { FormStateHandler } from '../form.state.js';

describe('FormStateHandler', () => {
  const validator = (values: { email: string }) => {
    const errors: Partial<Record<'email', string>> = {};

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
      isSubmitting: false,
      isValid: true,
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
      isSubmitting: false,
      isValid: true,
      touched: {},
      values: {
        email: 'reset@example.com',
      },
    });
  });
});
