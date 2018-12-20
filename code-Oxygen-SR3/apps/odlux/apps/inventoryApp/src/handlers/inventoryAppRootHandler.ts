// main state handler

import { combineActionHandler } from '../../../../framework/src/flux/middleware';

import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import { counterHandler, CounterState } from './appCounterHandler';

export interface IInventoryAppStoreState {
  counterState: CounterState;
}

declare module '../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    inventoryApp: IInventoryAppStoreState
  }
}

const actionHandlers = {
  counterState: counterHandler
};

export const inventoryAppRootHandler = combineActionHandler <IInventoryAppStoreState>(actionHandlers);
export default inventoryAppRootHandler;
