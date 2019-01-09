import { IActionHandler } from '../flux/action';
import { SetTitleAction } from '../actions/titleActions';

import { AddErrorInfoAction, RemoveErrorInfoAction, ClearErrorInfoAction } from '../actions/errorActions';

import { IconType } from '../models/iconDefinition';

import { ErrorInfo } from '../models/errorInfo';

export interface IApplicationState {
  title: string;
  icon?: IconType; 

  errors: ErrorInfo[];
}

const applicationStateInit: IApplicationState = { title: "Loading ...", errors: [] };

export const applicationStateHandler: IActionHandler<IApplicationState> = (state = applicationStateInit, action) => {
  if (action instanceof SetTitleAction) {
    state = {
      ...state,
      title: action.title,
      icon: action.icon
    };
  } else if (action instanceof AddErrorInfoAction) {
    state = {
      ...state,
      errors: [
        ...state.errors,
        action.errorInfo
      ]
    };
  } else if (action instanceof RemoveErrorInfoAction) {
    const index = state.errors.indexOf(action.errorInfo);
    if (index > -1) {
      state = {
        ...state,
        errors: [
          ...state.errors.slice(0, index),
          ...state.errors.slice(index + 1)
        ]
      };
    }
  } else if (action instanceof ClearErrorInfoAction) {
    if (state.errors && state.errors.length) {
      state = {
        ...state,
        errors: []
      };
    }
  }

  return state;
};
