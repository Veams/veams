import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { FormStateHandler } from '../../../form.state.js';
import { FormProvider } from '../../react-form.js';
import { useFormController } from '../use-form-controller.js';
import { useFormMeta } from '../use-form-meta.js';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

function ControllerProbe({
  onReady,
}: {
  onReady: (controller: FormStateHandler<{ email: string }>) => void;
}) {
  const controller = useFormController<{ email: string }>();
  onReady(controller);

  return null;
}

function FormMetaProbe() {
  const meta = useFormMeta<{ email: string }>();

  return (
    <div>
      <span id="errors">{JSON.stringify(meta.errors)}</span>
      <span id="is-submitting">{String(meta.isSubmitting)}</span>
      <span id="is-valid">{String(meta.isValid)}</span>
      <span id="submit-error">{meta.submitError ?? ''}</span>
      <span id="touched">{JSON.stringify(meta.touched)}</span>
    </div>
  );
}

describe('useFormMeta', () => {
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

  it('should expose aggregate form metadata including all field errors', () => {
    const handleReady = jest.fn<void, [FormStateHandler<{ email: string }>]>();

    act(() => {
      root.render(
        <FormProvider initialValues={{ email: '' }} onSubmit={jest.fn()}>
          <ControllerProbe onReady={handleReady} />
          <FormMetaProbe />
        </FormProvider>
      );
    });

    const [[controller]] = handleReady.mock.calls as [[FormStateHandler<{ email: string }>]];

    act(() => {
      controller.setFieldError('email', 'Email is required');
      controller.setFieldTouched('email', true);
      controller.setSubmitError('Backend unavailable');
      controller.setSubmitting(true);
    });

    expect(container.querySelector('#errors')?.textContent).toBe('{"email":"Email is required"}');
    expect(container.querySelector('#is-submitting')?.textContent).toBe('true');
    expect(container.querySelector('#is-valid')?.textContent).toBe('false');
    expect(container.querySelector('#submit-error')?.textContent).toBe('Backend unavailable');
    expect(container.querySelector('#touched')?.textContent).toBe('{"email":true}');
  });
});
