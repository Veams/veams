import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { FormProvider } from '../../react-form.js';
import { useFieldMeta } from '../use-field-meta.js';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

function EmailMetaProbe() {
  const meta = useFieldMeta('email');

  return (
    <div>
      <span id="email-error">{meta.error ?? ''}</span>
      <span id="email-show-error">{String(meta.showError)}</span>
      <span id="email-touched">{String(meta.touched)}</span>
    </div>
  );
}

describe('useFieldMeta', () => {
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

  it('should expose touched + showError state after invalid submit', () => {
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
          <EmailMetaProbe />
          <button type="submit">Submit</button>
        </FormProvider>
      );
    });

    expect(container.querySelector('#email-error')?.textContent).toBe('');
    expect(container.querySelector('#email-show-error')?.textContent).toBe('false');
    expect(container.querySelector('#email-touched')?.textContent).toBe('false');

    const form = container.querySelector('form');

    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(container.querySelector('#email-error')?.textContent).toBe('Email is required');
    expect(container.querySelector('#email-show-error')?.textContent).toBe('true');
    expect(container.querySelector('#email-touched')?.textContent).toBe('true');
  });
});
