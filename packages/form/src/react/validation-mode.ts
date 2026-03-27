/**
 * Helpers for resolving validation timing behavior in the React layer.
 */
import type { FormValidationConfig, ValidationMode } from './context.js';

/**
 * Field-level validation overrides.
 */
export interface ValidationBehaviorOverrides {
  revalidationMode?: ValidationMode;
  validationMode?: ValidationMode;
}

/**
 * Fully resolved field validation behavior after merging overrides with form defaults.
 */
export interface ResolvedValidationBehavior {
  revalidationMode: Exclude<ValidationMode, 'inherit'>;
  validationMode: Exclude<ValidationMode, 'inherit'>;
}

/**
 * Merges field-level overrides with the form-level validation defaults.
 */
export function resolveValidationBehavior(
  config: FormValidationConfig,
  overrides?: ValidationBehaviorOverrides
): ResolvedValidationBehavior {
  return {
    revalidationMode:
      overrides?.revalidationMode && overrides.revalidationMode !== 'inherit'
        ? overrides.revalidationMode
        : config.revalidationMode,
    validationMode:
      overrides?.validationMode && overrides.validationMode !== 'inherit'
        ? overrides.validationMode
        : config.validationMode,
  };
}

/**
 * Returns whether a field interaction should trigger validation.
 */
export function shouldValidateFieldInteraction(
  interaction: 'blur' | 'change',
  isTouched: boolean,
  behavior: ResolvedValidationBehavior
) {
  const activeMode = isTouched ? behavior.revalidationMode : behavior.validationMode;

  return activeMode === interaction;
}
