import { IActionHandler } from '../flux/action';
import { UpdateAuthentication } from '../actions/authentication';

import { User } from '../models/authentication';

export interface IAuthenticationState {
  user?: User;
}

const initialToken = localStorage.getItem("userToken");

const authenticationStateInit: IAuthenticationState = {
  user: initialToken && new User(initialToken) || undefined
};

export const authenticationStateHandler: IActionHandler<IAuthenticationState> = (state = authenticationStateInit, action) => {
  if (action instanceof UpdateAuthentication) {
    
    if (action.bearerToken) {
      localStorage.setItem("userToken", action.bearerToken);
    } else {
      localStorage.removeItem("userToken");
    }

    const user = action.bearerToken && new User(action.bearerToken) || undefined;
    state = {
      ...state,
      user
    };
  }

  return state;
};
