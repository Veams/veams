export const statusQuoQueryStatusQuoBridgeExample = `import { NativeStateHandler } from '@veams/status-quo';
import {
  toQueryMetaState,
  type QueryMetaState,
  type QueryHandle,
} from '@veams/status-quo-query';

type Company = {
  id: string;
  name: string;
};

type CompanyCardState = {
  company: Company | undefined;
  query: QueryMetaState;
};

type CompanyCardActions = {
  refresh: () => Promise<void>;
};

export class CompanyCardHandler extends NativeStateHandler<
  CompanyCardState,
  CompanyCardActions
> {
  constructor(private readonly companyQuery: QueryHandle<Company, Error>) {
    super({
      initialState: {
        company: companyQuery.getSnapshot().data,
        query: toQueryMetaState(companyQuery.getSnapshot()),
      },
    });

    this.bindSubscribable(companyQuery, (snapshot) => {
      this.setState(
        {
          company: snapshot.data,
          query: toQueryMetaState(snapshot),
        },
        'query:update'
      );
    });
  }

  getActions(): CompanyCardActions {
    return {
      refresh: async () => {
        await this.companyQuery.refetch();
      },
    };
  }
}`;
