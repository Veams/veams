export const formValidatorServerErrorsExample = `import { FormStateHandler } from '@veams/form';

type SignupValues = {
  email: string;
  password: string;
};

const form = new FormStateHandler<SignupValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: (values) => ({
    ...(values.email ? {} : { email: 'Email is required' }),
    ...(values.password ? {} : { password: 'Password is required' }),
  }),
});

async function submitSignup() {
  if (!form.validateForm()) {
    form.touchAllFields();
    return;
  }

  try {
    await signupApi(form.getState().values);
  } catch (error) {
    if (isApiValidationError(error)) {
      form.setFieldError('email', error.fieldErrors.email);
      form.setFieldError('password', error.fieldErrors.password);
      return;
    }

    throw error;
  }
}`;

export const formValidatorTouchedFieldsExample = `import { FormStateHandler } from '@veams/form';

type ProfileValues = {
  contact: {
    email: string;
    phone: string;
  };
  name: string;
};

const profileForm = new FormStateHandler<ProfileValues>({
  initialValues: {
    contact: {
      email: '',
      phone: '',
    },
    name: '',
  },
  validator: (values) => ({
    ...(values.name ? {} : { name: 'Name is required' }),
    ...(values.contact.email ? {} : { 'contact.email': 'Email is required' }),
    ...(values.contact.phone ? {} : { 'contact.phone': 'Phone is required' }),
  }),
});

// The user edits the name and does not reach the contact group.
profileForm.setFieldTouched('name');

// Only the name error is stored. Both contact errors stay out of the map.
const areTouchedFieldsValid = profileForm.validateTouchedFields();

// A touched parent path keeps the errors of its children.
profileForm.setFieldTouched('contact');
profileForm.validateTouchedFields();

// The submit check still validates every field.
function handleSubmit() {
  if (!profileForm.validateForm()) {
    profileForm.touchAllFields();
    return;
  }

  saveProfile(profileForm.getState().values);
}`;

export const formValidatorZodExample = `import { z } from 'zod';
import { FormStateHandler } from '@veams/form';
import { toZodValidator } from '@veams/form/validators/zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(12, 'Use at least 12 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const loginForm = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: toZodValidator(loginSchema),
});`;

export const formValidatorTinyAdapterReference = `type ZodLikeIssue = {
  message: string;
  path: ReadonlyArray<unknown>;
};

type ZodLikeSchema<TValues extends Record<string, unknown>> = {
  safeParse(input: unknown):
    | { success: true }
    | { success: false; error: { issues: ReadonlyArray<ZodLikeIssue> } };
};

const toZodValidator = <TValues extends Record<string, unknown>>(
  schema: ZodLikeSchema<TValues>
) => {
  return (values: TValues) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return {};
    }

    const errors: Partial<Record<keyof TValues, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];

      if (typeof field !== 'string') {
        continue;
      }

      const fieldName = field as keyof TValues;

      if (!errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    }

    return errors;
  };
};`;
