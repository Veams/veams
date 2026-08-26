export const statusQuoSelectorSimpleExample = `const [name] = useStateSubscription(
  handler,
  (state) => state.profile.name
);`;

export const statusQuoSelectorProvidedExample = `const [progress] = useProvidedStateSubscription(
  (state) => ({
    completed: state.completed,
    step: state.step,
  }),
  (current, next) => current.completed === next.completed && current.step === next.step
);`;

export const statusQuoSelectorSingletonExample = `const [count] = useStateSingleton(
  sharedCounterSingleton,
  (state) => state.count
);`;
