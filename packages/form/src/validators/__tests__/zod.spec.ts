import { toZodValidator } from '../zod.js';

type LoginValues = {
  profile: {
    email: string;
  };
  password: string;
};

describe('toZodValidator', () => {
  it('should map top-level issues to form errors', () => {
    const validator = toZodValidator<LoginValues>({
      safeParse(values) {
        const typedValues = values as LoginValues;
        const issues: Array<{ message: string; path: ReadonlyArray<unknown> }> = [];

        if (!typedValues.profile.email) {
          issues.push({
            message: 'Email is required',
            path: ['profile', 'email'],
          });
        }

        if (!typedValues.password) {
          issues.push({
            message: 'Password is required',
            path: ['password'],
          });
        }

        if (issues.length === 0) {
          return {
            data: typedValues,
            success: true as const,
          };
        }

        return {
          error: {
            issues,
          },
          success: false as const,
        };
      },
    });

    expect(
      validator({
        profile: {
          email: '',
        },
        password: '',
      })
    ).toEqual({
      'profile.email': 'Email is required',
      password: 'Password is required',
    });
  });

  it('should keep the first error for each field and ignore non-string paths', () => {
    const validator = toZodValidator<LoginValues>({
      safeParse() {
        return {
          error: {
            issues: [
              {
                message: 'Email is required',
                path: ['profile', 'email'],
              },
              {
                message: 'Second email message',
                path: ['profile', 'email'],
              },
              {
                message: 'Form-level message',
                path: [],
              },
              {
                message: 'Nested password message',
                path: ['password'],
              },
            ],
          },
          success: false as const,
        };
      },
    });

    expect(
      validator({
        profile: {
          email: '',
        },
        password: '',
      })
    ).toEqual({
      'profile.email': 'Email is required',
      password: 'Nested password message',
    });
  });
});
