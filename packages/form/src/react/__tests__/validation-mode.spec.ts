import {
  FormValidationConfigContext,
  defaultFormValidationConfig,
  resolveValidationBehavior,
  shouldValidateFieldInteraction,
  type FormValidationConfig,
  type ResolvedValidationBehavior,
  type ValidationBehaviorOverrides,
} from '../index.js';

describe('validation-mode public entry', () => {
  it('should resolve config values when overrides are absent', () => {
    const config: FormValidationConfig = {
      revalidationMode: 'change',
      validationMode: 'blur',
    };

    expect(resolveValidationBehavior(config)).toEqual({
      revalidationMode: 'change',
      validationMode: 'blur',
    });
  });

  it('should apply an override that is not inherit', () => {
    const config: FormValidationConfig = {
      revalidationMode: 'change',
      validationMode: 'blur',
    };
    const overrides: ValidationBehaviorOverrides = {
      revalidationMode: 'blur',
      validationMode: 'change',
    };

    expect(resolveValidationBehavior(config, overrides)).toEqual({
      revalidationMode: 'blur',
      validationMode: 'change',
    });
  });

  it('should fall back to config values when an override is inherit', () => {
    const config: FormValidationConfig = {
      revalidationMode: 'change',
      validationMode: 'blur',
    };

    expect(
      resolveValidationBehavior(config, {
        revalidationMode: 'inherit',
        validationMode: 'inherit',
      })
    ).toEqual({
      revalidationMode: 'change',
      validationMode: 'blur',
    });
  });

  it('should use validation mode before touch and revalidation mode after touch', () => {
    const behavior: ResolvedValidationBehavior = {
      revalidationMode: 'change',
      validationMode: 'blur',
    };

    expect(shouldValidateFieldInteraction('blur', false, behavior)).toBe(true);
    expect(shouldValidateFieldInteraction('change', true, behavior)).toBe(true);
  });

  it('should return false when the interaction does not match the active mode', () => {
    const behavior: ResolvedValidationBehavior = {
      revalidationMode: 'change',
      validationMode: 'blur',
    };

    expect(shouldValidateFieldInteraction('change', false, behavior)).toBe(false);
    expect(shouldValidateFieldInteraction('blur', true, behavior)).toBe(false);
  });

  it('should expose the validation config context and default config', () => {
    expect(FormValidationConfigContext).toBeDefined();
    expect(FormValidationConfigContext.Provider).toBeDefined();
    expect(defaultFormValidationConfig).toEqual({
      revalidationMode: 'change',
      validationMode: 'blur',
    });
  });
});
