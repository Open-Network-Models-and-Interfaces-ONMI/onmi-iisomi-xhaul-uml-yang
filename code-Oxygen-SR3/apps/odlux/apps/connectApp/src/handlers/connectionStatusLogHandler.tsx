import { IActionHandler } from '../../../../framework/src/flux/action';
import { LoadConnectionStatusLogAction, AllConnectionStatusLogAction } from '../actions/connectionStatusLogActions'
import { ILogSource } from '../models/connectionStatusLog';

export interface ILogListRequired {
  connectionLog: ILogSource[];
  busy: boolean;
}

const listLogInit: ILogListRequired = {
  connectionLog: [],
  busy: false
};

export const listLogHandler: IActionHandler<ILogListRequired> = (state = listLogInit, action) => {
  if (action instanceof LoadConnectionStatusLogAction) {

    state = {
      ...state,
      busy: true
    };
  
  } else if (action instanceof AllConnectionStatusLogAction) {
    if (!action.error && action.Elements) {
      state = {
        ...state,
        connectionLog: action.Elements,
        busy: false
      };
    } else {
      state = {
        ...state,
        busy: false
      };
    }
  }

  return state;
};