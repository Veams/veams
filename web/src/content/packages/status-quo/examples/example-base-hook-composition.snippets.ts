export const statusQuoCompositionHandlerExample = `import { NativeStateHandler } from '@veams/status-quo';

type ChecklistState = {
  completed: number;
  total: number;
};

type ChecklistActions = {
  complete: () => void;
  reopen: () => void;
  reset: () => void;
};

const initialChecklistState: ChecklistState = {
  completed: 1,
  total: 4,
};

class ChecklistHandler extends NativeStateHandler<ChecklistState, ChecklistActions> {
  constructor() {
    super({ initialState: initialChecklistState });
  }

  getActions(): ChecklistActions {
    return {
      complete: () =>
        this.setState(
          { completed: Math.min(this.getState().completed + 1, this.getState().total) },
          'complete'
        ),
      reopen: () =>
        this.setState({ completed: Math.max(this.getState().completed - 1, 0) }, 'reopen'),
      reset: () => this.setState({ ...initialChecklistState }, 'reset'),
    };
  }
}

export const createChecklistHandler = () => new ChecklistHandler();`;

export const statusQuoCompositionComponentExample = `import {
  useStateActions,
  useStateHandler,
  useStateSubscription,
} from '@veams/status-quo/react';

import { createChecklistHandler } from './checklist-handler';

type ChecklistHandler = ReturnType<typeof createChecklistHandler>;

function ChecklistExample() {
  const handler = useStateHandler(createChecklistHandler, []);

  return (
    <>
      <ChecklistSummary handler={handler} />
      <ChecklistControls handler={handler} />
    </>
  );
}

function ChecklistSummary({ handler }: { handler: ChecklistHandler }) {
  const [completed] = useStateSubscription(handler, (state) => state.completed);
  const [total] = useStateSubscription(handler, (state) => state.total);

  return (
    <p>
      {completed} of {total} done
    </p>
  );
}

function ChecklistControls({ handler }: { handler: ChecklistHandler }) {
  const actions = useStateActions(handler);
  const [canComplete] = useStateSubscription(handler, (state) => state.completed < state.total);
  const [canReopen] = useStateSubscription(handler, (state) => state.completed > 0);

  return (
    <>
      <button disabled={!canComplete} onClick={actions.complete} type="button">
        Complete one
      </button>
      <button disabled={!canReopen} onClick={actions.reopen} type="button">
        Reopen one
      </button>
      <button onClick={actions.reset} type="button">
        Reset
      </button>
    </>
  );
}`;
