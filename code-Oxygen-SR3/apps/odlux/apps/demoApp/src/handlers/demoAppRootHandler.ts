
import { combineActionHandler } from '../../../../framework/src/flux/middleware';

import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { listAuthorsHandler, IListAuthors } from './listAuthorsHandler';
import { editAuthorHandler, IEditAuthor } from './editAuthorHandler';

export interface IDemoAppStoreState {
  listAuthors: IListAuthors;
  editAuthor: IEditAuthor;
}

declare module '../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    demoApp: IDemoAppStoreState
  }
}

const actionHandlers = {
  listAuthors: listAuthorsHandler,
  editAuthor: editAuthorHandler,
};

export const demoAppRootHandler = combineActionHandler <IDemoAppStoreState>(actionHandlers);
export default demoAppRootHandler;
