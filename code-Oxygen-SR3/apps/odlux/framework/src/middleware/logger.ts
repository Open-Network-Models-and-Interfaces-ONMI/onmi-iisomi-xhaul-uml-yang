import { Dispatch } from '../flux/store';
import { MiddlewareApi } from '../store/applicationStore';


function createLoggerMiddleware() {
  return function logger({ getState }: MiddlewareApi) {
    return (next: Dispatch): Dispatch => action => {
      console.log('will dispatch', action);
      const returnValue = next(action);
      console.log('state after dispatch', getState());
      return returnValue;
    };
  }
}

export const logger = createLoggerMiddleware();
export default logger;