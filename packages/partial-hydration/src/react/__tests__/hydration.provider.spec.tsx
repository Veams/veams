import React from 'react';
import { render, screen } from '@testing-library/react';
import { HydrationProvider, useIsomorphicId } from '../hydration.provider';

describe('HydrationProvider', () => {
  it('should provide a stable isomorphic id', () => {
    const TestComponent = () => {
      const id = useIsomorphicId();
      return <div data-testid="test-id">{id}</div>;
    };

    render(
      <HydrationProvider componentId="unit-test">
        <TestComponent />
        <TestComponent />
      </HydrationProvider>
    );

    const elements = screen.getAllByTestId('test-id');
    expect(elements[0].textContent).toBe('unit-test_1');
    expect(elements[1].textContent).toBe('unit-test_2');
  });
});
