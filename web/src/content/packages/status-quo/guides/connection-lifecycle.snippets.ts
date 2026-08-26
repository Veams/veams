export const statusQuoConnectionLifecycleBadExample = `constructor(options: SolvencyScoreCardStateHandlerOptions = {}) {
  const shouldAnimateOnLoad = options.animateOnLoad ?? true;
  const initialBaseState = {
    ...defaultState,
    ...options.initialState,
    query: {
      ...defaultState.query,
      ...options.initialState?.query,
    },
  };
  const normalizedInitialScore =
    initialBaseState.score === null ? null : clampScore(initialBaseState.score);

  super({
    initialState: {
      ...initialBaseState,
      isAnimatedIn: !shouldAnimateOnLoad,
      isCounterActive: !shouldAnimateOnLoad,
      isPointerActive: !shouldAnimateOnLoad,
      score: normalizedInitialScore,
    },
    options: {
      devTools: options.devTools ?? DEFAULT_DEVTOOLS,
    },
  });

  this.shouldAnimateOnLoad = shouldAnimateOnLoad;
  this.solvencyQueryHandler = options.solvencyQueryHandler;
  this.queryHandler = this.solvencyQueryHandler?.getSolvencyScoreQuery();

  this.bindSolvencyScoreQuery();
  this.scheduleInitialAnimation();
}`;

export const statusQuoConnectionLifecycleGoodExample = `constructor(options: SolvencyScoreCardStateHandlerOptions = {}) {
  const shouldAnimateOnLoad = options.animateOnLoad ?? true;
  const initialBaseState = {
    ...defaultState,
    ...options.initialState,
    query: {
      ...defaultState.query,
      ...options.initialState?.query,
    },
  };
  const normalizedInitialScore =
    initialBaseState.score === null ? null : clampScore(initialBaseState.score);

  super({
    initialState: {
      ...initialBaseState,
      isAnimatedIn: !shouldAnimateOnLoad,
      isCounterActive: !shouldAnimateOnLoad,
      isPointerActive: !shouldAnimateOnLoad,
      score: normalizedInitialScore,
    },
    options: {
      devTools: options.devTools ?? DEFAULT_DEVTOOLS,
    },
  });

  this.shouldAnimateOnLoad = shouldAnimateOnLoad;
  this.solvencyQueryHandler = options.solvencyQueryHandler;
  this.queryHandler = this.solvencyQueryHandler?.getSolvencyScoreQuery();
}

protected override onConnect(): void {
  this.bindSolvencyScoreQuery();
  this.scheduleInitialAnimation();
}

protected override onDisconnect(): void {
  this.cancelInitialAnimation();
}`;
