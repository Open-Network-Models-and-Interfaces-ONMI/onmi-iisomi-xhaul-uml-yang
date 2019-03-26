import { Action } from '../../../../framework/src/flux/action';

import { Fault } from '../models/fault';

export class FaultApplicationBaseAction extends Action { }


export class AddFaultNotificationAction extends FaultApplicationBaseAction {
  constructor(public fault:Fault) {
    super();
  }
}

export class ResetFaultNotificationsAction extends FaultApplicationBaseAction {
 
}
