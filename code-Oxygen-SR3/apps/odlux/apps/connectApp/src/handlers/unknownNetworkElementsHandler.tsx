import { IActionHandler } from '../../../../framework/src/flux/action';
import { LoadAllUnknownNetworkElementsAction, AllUnknownNetworkElementLoadedAction } from '../actions/unknownNetworkElementsActions'
import { IUnknownNetworkElementsExtended } from '../models/unknownNetworkElements';

export interface IUnknownList {
  unknownNetworkElements: IUnknownNetworkElementsExtended[];
  busy: boolean;
}

const listLogInit: IUnknownList = {
  unknownNetworkElements: [],
  busy: false
};

export const listUnknownHandler: IActionHandler<IUnknownList> = (state = listLogInit, action) => {
  if (action instanceof LoadAllUnknownNetworkElementsAction) {

    state = {
      ...state,
      busy: true
    };
  
  } else if (action instanceof AllUnknownNetworkElementLoadedAction) {
    if (!action.error && action.Elements) {
      state = {
        ...state,
        unknownNetworkElements: action.Elements,
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