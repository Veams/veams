import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { FormStateHandler } from '../../../form.state.js';
import { FormProvider } from '../../react-form.js';
import { useFormController } from '../use-form-controller.js';

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

describe('useFormController', () => {
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

  it('should return the provider controller instance', () => {
    const handleReady = jest.fn<void, [FormStateHandler<{ email: string }>]>();

    act(() => {
      root.render(
        <FormProvider initialValues={{ email: '' }} onSubmit={jest.fn()}>
          <ControllerProbe onReady={handleReady} />
        </FormProvider>
      );
    });

    const [[controller]] = handleReady.mock.calls as [[FormStateHandler<{ email: string }>]];

    expect(controller).toBeInstanceOf(FormStateHandler);

    act(() => {
      controller.setFieldValue('email', 'hello@veams.org');
    });

    expect(controller.getState().values.email).toBe('hello@veams.org');
  });

  it('should throw when used outside FormProvider', () => {
    const handleReady = jest.fn();

    expect(() => {
      act(() => {
        root.render(<ControllerProbe onReady={handleReady} />);
      });
    }).toThrow('Form hooks must be used within FormProvider.');
  });
});
