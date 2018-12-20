import { IActionHandler } from '../../../../framework/src/flux/action';
import { IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';
import { LoadAllRequiredNetworkElementsAction, AllrequiredNetworkElementLoadedAction } from '../actions/requiredNetworkElementsActions';

export interface IListRequired {
  networkelements: IRequiredNetworkElementExtended[];
  busy: boolean;
}

const listRequiredInit: IListRequired = {
  networkelements: [],
  busy: false
};

export const listRequiredHandler: IActionHandler<IListRequired> = (state = listRequiredInit, action) => {
  if (action instanceof LoadAllRequiredNetworkElementsAction) {

    state = {
      ...state,
      busy: true
    };
  
  } else if (action instanceof AllrequiredNetworkElementLoadedAction) {
    if (!action.error && action.Elements) {
      state = {
        ...state,
        networkelements: action.Elements,
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