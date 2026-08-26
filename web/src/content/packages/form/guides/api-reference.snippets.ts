export const formCustomBindingExample = `import { useContext } from 'react';
import {
  FormValidationConfigContext,
  resolveValidationBehavior,
  shouldValidateFieldInteraction,
  useFieldMeta,
  useFormController,
  type ValidationBehaviorOverrides,
} from '@veams/form/react';

// A custom binding for a widget that VEAMS Form does not cover.
function useColorPickerField(name: string, overrides?: ValidationBehaviorOverrides) {
  const controller = useFormController();
  const meta = useFieldMeta(name);
  const config = useContext(FormValidationConfigContext);
  const behavior = resolveValidationBehavior(config, overrides);

  const onChange = (nextValue: string) => {
    if (!meta.touched && behavior.validationMode === 'change') {
      controller.setFieldTouched(name, true);
    }

    controller.setFieldValue(name, nextValue, {
      validate: shouldValidateFieldInteraction('change', meta.touched, behavior),
    });
  };

  const onBlur = () => {
    if (!meta.touched) {
      controller.setFieldTouched(name, true);
    }

    if (shouldValidateFieldInteraction('blur', meta.touched, behavior)) {
      controller.validateForm();
    }
  };

  return { meta, onBlur, onChange };
}`;

export const formApiImports = `import {
  FormStateHandler,
  type FormActions,
  type FormFieldName,
  type FormState,
  type ValidatorFn,
} from '@veams/form';

import {
  Controller,
  FormProvider,
  FormValidationConfigContext,
  defaultFormValidationConfig,
  resolveValidationBehavior,
  shouldValidateFieldInteraction,
  useFieldMeta,
  useFormController,
  useFormMeta,
  useUncontrolledField,
  type FormValidationConfig,
  type ResolvedValidationBehavior,
  type ValidationBehaviorOverrides,
  type ValidationMode,
} from '@veams/form/react';`;
