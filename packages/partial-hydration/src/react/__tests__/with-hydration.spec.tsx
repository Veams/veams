import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { withHydration } from '../with-hydration.js';

describe('WithHydration HOC', () => {
  const ComponentToWrap = () => {
    return <div>Component to wrap</div>;
  };
  ComponentToWrap.displayName = 'ComponentToWrap';

  describe('Providing a component', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      container.remove();
    });

    it('should create a script tag before component markup', () => {
      const Hydrated = withHydration(ComponentToWrap);

      act(() => {
        createRoot(container).render(<Hydrated />);
      });

      const scriptEl = container.querySelector('script');

      expect(scriptEl?.nextElementSibling?.innerHTML).toBe('<div>Component to wrap</div>');
    });

    it('should create a unique component id matching with the script tag ref', () => {
      const Hydrated = withHydration(ComponentToWrap);

      act(() => {
        createRoot(container).render(<Hydrated />);
      });

      const scriptEl = container.querySelector('script');
      const el = scriptEl?.nextElementSibling;

      expect(el?.getAttribute('data-internal-id')).toBe(
        scriptEl?.getAttribute('data-internal-ref')
      );
    });

    it('should add a class to the component wrapper when given', () => {
      const Hydrated = withHydration(ComponentToWrap, { modifiers: 'test-class' });

      act(() => {
        createRoot(container).render(<Hydrated />);
      });

      const scriptEl = container.querySelector('script');
      const el = scriptEl?.nextElementSibling;

      expect(el?.getAttribute('class')).toBe('test-class');
    });

    it('should provide the passed props as stringified object in script tag', () => {
      const props = { test: { deep: { nested: true, html: '<script></script>' } } };
      const Hydrated = withHydration<{
        test?: { deep: { nested: boolean; html: string } };
      }>(ComponentToWrap);

      act(() => {
        createRoot(container).render(<Hydrated {...props} />);
      });

      const scriptEl = container.querySelector('script');

      expect(scriptEl?.textContent).toBe(
        '{"test":{"deep":{"nested":true,"html":"&lt;script>&lt;/script&gt;"}}}'
      );
    });

    it('should use displayName', () => {
      const CustomComponent = () => {
        return <div>Custom one</div>;
      };
      CustomComponent.displayName = 'DifferentName';
      const HydratedWithDisplayName = withHydration(CustomComponent);

      act(() => {
        createRoot(container).render(<HydratedWithDisplayName />);
      });

      const scriptEl = container.querySelector('script');

      expect(scriptEl?.nextElementSibling?.getAttribute('data-component')).toBe('DifferentName');
    });
  });
});
