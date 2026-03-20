export type Selector<Value, Selected> = (value: Value) => Selected;
export type EqualityFn<Selected> = (current: Selected, next: Selected) => boolean;

type SelectorCache<Selected> = {
  hasValue: boolean;
  value: Selected | undefined;
};

type SelectionResult<Selected> = {
  value: Selected;
  hasChanged: boolean;
};

export function createSelectorCache<Selected>(): SelectorCache<Selected> {
  return {
    hasValue: false,
    value: undefined,
  };
}

export function selectWithCache<Value, Selected>(
  selectorCache: SelectorCache<Selected>,
  value: Value,
  selector: Selector<Value, Selected>,
  isEqual: EqualityFn<Selected> = Object.is
): SelectionResult<Selected> {
  const nextSelection = selector(value);

  if (selectorCache.hasValue && isEqual(selectorCache.value as Selected, nextSelection)) {
    return {
      value: selectorCache.value as Selected,
      hasChanged: false,
    };
  }

  selectorCache.hasValue = true;
  selectorCache.value = nextSelection;

  return {
    value: nextSelection,
    hasChanged: true,
  };
}
