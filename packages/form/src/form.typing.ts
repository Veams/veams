import { FormStateHandler } from './form.state.js';

interface LoginCredentials {
  password: string;
  profile: {
    email: string;
    newsletter: boolean;
  };
}

const handler = new FormStateHandler<LoginCredentials>({
  initialValues: {
    password: '',
    profile: {
      email: '',
      newsletter: false,
    },
  },
});

handler.setFieldValue('password', 'secret');
handler.setFieldValue('profile.email', 'jane@veams.org');
handler.setFieldValue('profile.newsletter', true);
handler.setFieldTouched('profile.email', true);
handler.setFieldError('profile.email', 'Already taken');

// @ts-expect-error unknown path
handler.setFieldValue('profile.name', 'Jane');

// @ts-expect-error wrong type for nested boolean field
handler.setFieldValue('profile.newsletter', 'yes');

// @ts-expect-error wrong type for password
handler.setFieldValue('password', 123);
