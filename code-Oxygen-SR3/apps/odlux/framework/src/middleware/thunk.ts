
import { Dispatch } from '../flux/store';
import { MiddlewareApi } from '../store/applicationStore';

function createThunkMiddleware() {
  return ({ dispatch, getState }: MiddlewareApi) =>
    (next : Dispatch) : Dispatch =>
      action => {
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }

        return next(action);
      };
}

export const thunk = createThunkMiddleware();
export default thunk;