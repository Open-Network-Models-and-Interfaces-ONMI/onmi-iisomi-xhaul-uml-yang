import { IActionHandler } from '../../../../framework/src/flux/action';
import { AddFaultNotificationAction, ResetFaultNotificationsAction } from '../actions/notificationActions';
import { Fault } from '../models/fault';

export interface IFaultNotifications {
  faults: Fault[];
  since: Date;
}

const faultNotoficationsInit: IFaultNotifications = {
  faults: [],
  since: new Date()
};

export const faultNotificationsHandler: IActionHandler<IFaultNotifications> = (state = faultNotoficationsInit, action) => {
  if (action instanceof AddFaultNotificationAction) {
    state = {
      ...state,
      faults: [...state.faults, action.fault]
    };
  } else if (action instanceof ResetFaultNotificationsAction){
    state = {
      ...state,
      faults: [],
      since: new Date()
    };
  }

  return state;
}