export const statusQuoHandlerDistinctExample = `import { NativeStateHandler } from '@veams/status-quo';

type SearchState = {
  version: number;
  resultIds: string[];
};

type SearchActions = {
  replace: (version: number, resultIds: string[]) => void;
};

class SearchHandler extends NativeStateHandler<SearchState, SearchActions> {
  constructor() {
    super({
      initialState: {
        version: 0,
        resultIds: [],
      },
      options: {
        distinct: {
          comparator: (previous, next) => previous.version === next.version,
        },
      },
    });
  }

  getActions(): SearchActions {
    return {
      replace: (version, resultIds) => this.setState({ version, resultIds }, 'replace'),
    };
  }
}`;
