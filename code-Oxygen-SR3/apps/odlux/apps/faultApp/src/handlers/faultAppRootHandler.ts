// main state handler

import { combineActionHandler } from '../../../../framework/src/flux/middleware';

// ** do not remove **
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

import { IFaultNotifications, faultNotificationsHandler } from '../handlers/notificationActionHandler';

export interface IFaultAppStoreState {
  faultNotifications: IFaultNotifications
}

declare module '../../../../framework/src/store/applicationStore' {
  interface IApplicationStoreState {
    faultApp: IFaultAppStoreState
  }
}

const actionHandlers = {
  faultNotifications: faultNotificationsHandler
};

export const faultAppRootHandler = combineActionHandler<IFaultAppStoreState>(actionHandlers);
export default faultAppRootHandler;
