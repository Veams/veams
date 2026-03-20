import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { FormStateHandler } from '../../../form.state.js';
import { FormProvider } from '../../react-form.js';
import { useUncontrolledField } from '../use-uncontrolled-field.js';

import type { ChangeEvent } from 'react';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

function EmailField({
  onRegisterReady,
}: {
  onRegisterReady: (registerProps: {
    onBlur: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }) => void;
}) {
  const { registerProps } = useUncontrolledField('email');
  onRegisterReady(registerProps);

  return <input {...registerProps} id="email-input" />;
}

describe('useUncontrolledField', () => {
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

  it('should sync value from controller to DOM and from DOM to controller', () => {
    const formHandler = new FormStateHandler({
      initialValues: {
        email: '',
      },
    });
    const handleRegisterReady = jest.fn<
      void,
      [
        {
          onBlur: () => void;
          onChange: (event: ChangeEvent<HTMLInputElement>) => void;
        },
      ]
    >();

    act(() => {
      root.render(
        <FormProvider formHandlerInstance={formHandler} onSubmit={jest.fn()}>
          <EmailField onRegisterReady={handleRegisterReady} />
        </FormProvider>
      );
    });

    const input = container.querySelector('#email-input') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    expect(input?.value).toBe('');

    act(() => {
      formHandler.setFieldValue('email', 'state@veams.org');
    });

    expect(input?.value).toBe('state@veams.org');

    act(() => {
      const [[registerProps]] = handleRegisterReady.mock.calls as [
        [{ onBlur: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void }],
      ];

      registerProps.onChange({
        target: { value: 'dom@veams.org' },
      } as unknown as ChangeEvent<HTMLInputElement>);
      registerProps.onBlur();
    });

    expect(formHandler.getState().values.email).toBe('dom@veams.org');
    expect(formHandler.getState().touched.email).toBe(true);
  });
});
