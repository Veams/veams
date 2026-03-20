import type { FormFieldName, ValidatorFn } from '../form.state.js';

type ZodLikeIssue = {
  message: string;
  path: ReadonlyArray<unknown>;
};

type ZodLikeParseSuccess<TValues> = {
  data: TValues;
  success: true;
};

type ZodLikeParseFailure = {
  error: {
    issues: ReadonlyArray<ZodLikeIssue>;
  };
  success: false;
};

type ZodLikeParseResult<TValues> = ZodLikeParseSuccess<TValues> | ZodLikeParseFailure;

export interface ZodLikeSchema<TValues extends Record<string, unknown>> {
  safeParse(input: unknown): ZodLikeParseResult<TValues>;
}

/**
 * Adapts a Zod-style `safeParse` schema into a `ValidatorFn<T>`.
 *
 * The adapter maps only top-level field paths and keeps the first error per field.
 */
export function toZodValidator<TValues extends Record<string, unknown>>(
  schema: ZodLikeSchema<TValues>
): ValidatorFn<TValues> {
  return (values) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return {};
    }

    const errors: Partial<Record<FormFieldName<TValues>, string>> = {};

    for (const issue of parsed.error.issues) {
      const fieldPath = issue.path
        .filter((segment) => typeof segment === 'string' || typeof segment === 'number')
        .map((segment) => String(segment))
        .join('.');

      if (!fieldPath) {
        continue;
      }

      const fieldName = fieldPath as FormFieldName<TValues>;

      if (errors[fieldName]) {
        continue;
      }

      errors[fieldName] = issue.message;
    }

    return errors;
  };
}
