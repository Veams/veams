import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { FormStateHandler } from '../../form.state.js';
import {
  Controller,
  FormProvider,
  useFormController,
  useUncontrolledField,
  type UseFieldOptions,
} from '../react-form.js';

import type { ChangeEvent } from 'react';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

function EmailField({
  onRegisterReady,
  options,
}: {
  onRegisterReady?: (registerProps: {
    onBlur: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }) => void;
  options?: UseFieldOptions;
}) {
  const { meta, registerProps } = useUncontrolledField('email', options);
  onRegisterReady?.(registerProps);

  return (
    <label>
      Email
      <input {...registerProps} data-testid="email-input" />
      {meta.showError ? <span data-testid="email-error">{meta.error}</span> : null}
    </label>
  );
}

function ControlledEmailField({
  onFieldReady,
  revalidationMode,
  validationMode,
}: {
  onFieldReady?: (field: { onBlur: () => void; onChange: (value: unknown) => void }) => void;
  revalidationMode?: 'blur' | 'change' | 'submit' | 'inherit';
  validationMode?: 'blur' | 'change' | 'submit' | 'inherit';
}) {
  return (
    <Controller
      name="email"
      revalidationMode={revalidationMode}
      validationMode={validationMode}
      render={({ field, fieldState }) => (
        <>
          {onFieldReady?.(field)}
          <label>
            Email
            <input
              data-testid="controlled-email-input"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event)}
              value={String(field.value)}
            />
            {fieldState.touched && fieldState.error ? (
              <span data-testid="controlled-email-error">{fieldState.error}</span>
            ) : null}
          </label>
        </>
      )}
    />
  );
}

function ControllerProbe({
  onReady,
}: {
  onReady: (controller: FormStateHandler<{ profile: { email: string } }>) => void;
}) {
  const controller = useFormController<{ profile: { email: string } }>();
  onReady(controller);

  return null;
}

describe('react-form', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
  });

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it('should touch invalid fields on submit and show validation errors', () => {
    const handleSubmit = jest.fn();

    act(() => {
      root.render(
        <FormProvider
          initialValues={{ email: '' }}
          onSubmit={handleSubmit}
          validator={(values) => ({
            ...(values.email ? {} : { email: 'Email is required' }),
          })}
        >
          <EmailField />
          <button type="submit">Submit</button>
        </FormProvider>
      );
    });

    const form = container.querySelector('form');

    expect(form).not.toBeNull();

    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(container.querySelector('[data-testid="email-error"]')?.textContent).toBe(
      'Email is required'
    );
  });

  it('should submit updated form values through the provider-owned controller', () => {
    const handleSubmit = jest.fn();
    const handleControllerReady = jest.fn<
      void,
      [FormStateHandler<{ profile: { email: string } }>]
    >();

    act(() => {
      root.render(
        <FormProvider
          initialValues={{ profile: { email: '' } }}
          onSubmit={handleSubmit}
          validator={(values) => ({
            ...(values.profile.email ? {} : { 'profile.email': 'Email is required' }),
          })}
        >
          <EmailField />
          <ControllerProbe onReady={handleControllerReady} />
          <button type="submit">Submit</button>
        </FormProvider>
      );
    });

    const form = container.querySelector('form');
    const [[controller]] = handleControllerReady.mock.calls as [
      [FormStateHandler<{ profile: { email: string } }>],
    ];

    expect(form).not.toBeNull();
    expect(controller).toBeInstanceOf(FormStateHandler);

    act(() => {
      controller.setFieldValue('profile.email', 'alice@example.com');
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    const [[submittedValues, submittedController]] = handleSubmit.mock.calls as [
      [{ profile: { email: string } }, FormStateHandler<{ profile: { email: string } }>],
    ];
    expect(submittedValues).toEqual({ profile: { email: 'alice@example.com' } });
    expect(submittedController).toBe(controller);
  });

  it('should bridge controlled fields through Controller', () => {
    const externalFormHandler = new FormStateHandler({
      initialValues: {
        role: 'user',
      },
    });

    act(() => {
      root.render(
        <FormProvider
          formHandlerInstance={externalFormHandler}
          onSubmit={jest.fn()}
        >
          <Controller
            name="role"
            render={({ field, fieldState }) => (
              <div>
                <button
                  id="set-admin"
                  onClick={() => field.onChange('admin')}
                  type="button"
                >
                  Set admin
                </button>
                <button id="touch-role" onClick={field.onBlur} type="button">
                  Touch role
                </button>
                <span id="role-value">{String(field.value)}</span>
                <span id="role-touched">{String(fieldState.touched)}</span>
              </div>
            )}
          />
        </FormProvider>
      );
    });

    const setAdminButton = container.querySelector('#set-admin');
    const touchRoleButton = container.querySelector('#touch-role');

    act(() => {
      setAdminButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('#role-value')?.textContent).toBe('admin');

    act(() => {
      touchRoleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('#role-touched')?.textContent).toBe('true');
    expect(externalFormHandler.getState().values.role).toBe('admin');
  });

  it('should validate invalid fields on first blur by default', () => {
    const handleRegisterReady = jest.fn<
      void,
      [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }]
    >();

    act(() => {
      root.render(
        <FormProvider
          initialValues={{ email: '' }}
          onSubmit={jest.fn()}
          validator={(values) => ({
            ...(values.email ? {} : { email: 'Email is required' }),
          })}
        >
          <EmailField onRegisterReady={handleRegisterReady} />
        </FormProvider>
      );
    });

    expect(container.querySelector('[data-testid="email-error"]')).toBeNull();

    act(() => {
      const [registerProps] = handleRegisterReady.mock.calls[
        handleRegisterReady.mock.calls.length - 1
      ] as [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }];

      registerProps.onBlur();
    });

    expect(container.querySelector('[data-testid="email-error"]')?.textContent).toBe(
      'Email is required'
    );
  });

  it('should revalidate touched fields on change by default', () => {
    const handleRegisterReady = jest.fn<
      void,
      [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }]
    >();

    act(() => {
      root.render(
        <FormProvider
          initialValues={{ email: '' }}
          onSubmit={jest.fn()}
          validator={(values) => ({
            ...(values.email ? {} : { email: 'Email is required' }),
          })}
        >
          <EmailField onRegisterReady={handleRegisterReady} />
        </FormProvider>
      );
    });

    act(() => {
      const [registerProps] = handleRegisterReady.mock.calls[
        handleRegisterReady.mock.calls.length - 1
      ] as [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }];

      registerProps.onBlur();
    });

    expect(container.querySelector('[data-testid="email-error"]')?.textContent).toBe(
      'Email is required'
    );

    act(() => {
      const [registerProps] = handleRegisterReady.mock.calls[
        handleRegisterReady.mock.calls.length - 1
      ] as [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }];

      registerProps.onChange({
        target: { value: 'alice@example.com' },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(container.querySelector('[data-testid="email-error"]')).toBeNull();
  });

  it('should allow fields to validate on first change', () => {
    const handleRegisterReady = jest.fn<
      void,
      [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }]
    >();

    act(() => {
      root.render(
        <FormProvider
          initialValues={{ email: 'alice@example.com' }}
          onSubmit={jest.fn()}
          validator={(values) => ({
            ...(values.email ? {} : { email: 'Email is required' }),
          })}
        >
          <EmailField onRegisterReady={handleRegisterReady} options={{ validationMode: 'change' }} />
        </FormProvider>
      );
    });

    expect(container.querySelector('[data-testid="email-error"]')).toBeNull();

    act(() => {
      const [registerProps] = handleRegisterReady.mock.calls[
        handleRegisterReady.mock.calls.length - 1
      ] as [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }];

      registerProps.onChange({
        target: { value: '' },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(container.querySelector('[data-testid="email-error"]')?.textContent).toBe(
      'Email is required'
    );
  });

  it('should apply validation mode overrides to Controller fields', () => {
    const handleFieldReady = jest.fn<void, [{ onBlur: () => void; onChange: (value: unknown) => void }]>();

    act(() => {
      root.render(
        <FormProvider
          initialValues={{ email: 'alice@example.com' }}
          onSubmit={jest.fn()}
          validator={(values) => ({
            ...(values.email ? {} : { email: 'Email is required' }),
          })}
        >
          <ControlledEmailField onFieldReady={handleFieldReady} validationMode="change" />
        </FormProvider>
      );
    });

    expect(container.querySelector('[data-testid="controlled-email-error"]')).toBeNull();

    act(() => {
      const [[field]] = handleFieldReady.mock.calls as [
        [{ onBlur: () => void; onChange: (value: unknown) => void }],
      ];

      field.onChange('');
    });

    expect(container.querySelector('[data-testid="controlled-email-error"]')?.textContent).toBe(
      'Email is required'
    );
  });

  it('should clear stale submitError before a new submit attempt', () => {
    const externalFormHandler = new FormStateHandler({
      initialValues: {
        email: 'alice@example.com',
      },
    });
    externalFormHandler.setSubmitError('Previous backend error');

    const handleSubmit = jest.fn();

    act(() => {
      root.render(
        <FormProvider formHandlerInstance={externalFormHandler} onSubmit={handleSubmit}>
          <button type="submit">Submit</button>
        </FormProvider>
      );
    });

    const form = container.querySelector('form');

    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(externalFormHandler.getState().submitError).toBeUndefined();
  });
});
