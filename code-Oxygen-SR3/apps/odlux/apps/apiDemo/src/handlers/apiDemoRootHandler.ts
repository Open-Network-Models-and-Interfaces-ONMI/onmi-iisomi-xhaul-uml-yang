
import { combineActionHandler } from '../../../../framework/src/flux/middleware';

import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { moduleHandler, IModules } from './modulesHandler';

export interface IApiDemoStoreState {
   modules: IModules
}

declare module '../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    apiDemo: IApiDemoStoreState
  }
}

const actionHandlers = {
   modules: moduleHandler
};

export const apiDemoRootHandler = combineActionHandler<IApiDemoStoreState>(actionHandlers);
export default apiDemoRootHandler;
