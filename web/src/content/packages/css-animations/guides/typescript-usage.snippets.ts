export const cssAnimationsTsUsage = `import { ANIMATIONS } from '@veams/css-animations';

// Use constants for type-safe class names or animation names
function MyComponent({ isError }) {
  return (
    <div className={isError ? ANIMATIONS.FEEDBACK.BORDER_SIMPLE : ''}>
      Content
    </div>
  );
}`;
