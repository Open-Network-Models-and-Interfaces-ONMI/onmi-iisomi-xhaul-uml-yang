import { combineActionHandler } from '../../../../framework/src/flux/middleware';
import { listRequiredHandler, IListRequired } from './requiredNetworkElementsHandler';
import { listLogHandler, ILogListRequired } from './connectionStatusLogHandler';
import { listUnknownHandler, IUnknownList} from './unknownNetworkElementsHandler';

export interface IConnectAppStoreState {
 // listRequired: IListRequired;
 // listLog: ILogListRequired;
  listUnknown: IUnknownList;
}

declare module '../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    connectApp: IConnectAppStoreState
  }
}

const actionHandlers = {
 // listRequired: listRequiredHandler,
 // listLog: listLogHandler,
  listUnknown: listUnknownHandler
};

export const connectAppRootHandler = combineActionHandler <IConnectAppStoreState>(actionHandlers);
export default connectAppRootHandler;
