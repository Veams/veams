/**
 * Adapter for Zod-style schema validation.
 */
import type { FormFieldName, ValidatorFn } from '../form.state.js';

/**
 * Minimal representation of a Zod issue.
 */
type ZodLikeIssue = {
  message: string;
  path: ReadonlyArray<unknown>;
};

/**
 * Shape of a successful Zod-style parse result.
 */
type ZodLikeParseSuccess<TValues> = {
  data: TValues;
  success: true;
};

/**
 * Shape of a failed Zod-style parse result.
 */
type ZodLikeParseFailure = {
  error: {
    issues: ReadonlyArray<ZodLikeIssue>;
  };
  success: false;
};

/**
 * Union type for Zod-style parse results.
 */
type ZodLikeParseResult<TValues> = ZodLikeParseSuccess<TValues> | ZodLikeParseFailure;

/**
 * Interface for schemas that follow the Zod contract (e.g., Zod, Valibot).
 */
export interface ZodLikeSchema<TValues extends Record<string, unknown>> {
  safeParse(input: unknown): ZodLikeParseResult<TValues>;
}

/**
 * Adapts a Zod-style `safeParse` schema into a `ValidatorFn<T>`.
 * Maps Zod issues into the dot-notation error map used by FormStateHandler.
 * Keeps only the first error encountered for each specific field path.
 */
export function toZodValidator<TValues extends Record<string, unknown>>(
  schema: ZodLikeSchema<TValues>
): ValidatorFn<TValues> {
  return (values) => {
    // Run the schema validation.
    const parsed = schema.safeParse(values);

    // Return an empty error map if validation passes.
    if (parsed.success) {
      return {};
    }

    const errors: Partial<Record<FormFieldName<TValues>, string>> = {};

    // Iterate through encountered issues.
    for (const issue of parsed.error.issues) {
      // Construct a dot-notation path from the Zod issue path array.
      const fieldPath = issue.path
        .filter((segment) => typeof segment === 'string' || typeof segment === 'number')
        .map((segment) => String(segment))
        .join('.');

      // Skip issues that do not target a specific field.
      if (!fieldPath) {
        continue;
      }

      const fieldName = fieldPath as FormFieldName<TValues>;

      // Only store the first error message for this field.
      if (errors[fieldName]) {
        continue;
      }

      errors[fieldName] = issue.message;
    }

    return errors;
  };
}
