import { Action, IActionHandler } from '../flux/action';
import { MiddlewareArg } from '../flux/middleware';
import { Dispatch } from '../flux/store';

import { IApplicationStoreState } from '../store/applicationStore';
import { AddErrorInfoAction, ErrorInfo } from '../actions/errorActions';

const baseUrl = `${ window.location.origin }${ window.location.pathname }`;

export class ApiAction<TResult, TSuccessAction extends Action & { result: TResult }> extends Action {
  constructor(public endpoint: string, public successAction: { new(result: TResult): TSuccessAction }, public authenticate: boolean = false) {
    super();
  }
}

export const apiMiddleware = (store: MiddlewareArg<IApplicationStoreState>) => (next: Dispatch) => <A extends Action>(action: A) => {

  // So the middleware doesn't get applied to every single action
  if (action instanceof ApiAction) {
    const user = store && store.getState().framework.authentication.user;
    const token = user && user.token || null;
    let config = { headers: {} };

    if (action.authenticate) {
      if (token) {
        config = {
          ...config,
          headers: {
            ...config.headers,
            // 'Authorization': `Bearer ${ token }`
            authorization: "Basic YWRtaW46YWRtaW4="
          }
        }
      } else {
        return next(new AddErrorInfoAction({ message: 'Please login to continue.' }));
      }
    }

    fetch(action.endpoint.replace(/\/{2,}/, '/'), config)
      .then(response =>
        response.json().then(data => ({ data, response }))
      )
      .then(result => {
        next(new action.successAction(result.data));
      })
      .catch((error: any) => {
        next(new AddErrorInfoAction((error instanceof Error) ? { error: error } : { message: error.toString() }));
      });
  }

  // let all actions pass
  return next(action);
}

export default apiMiddleware;