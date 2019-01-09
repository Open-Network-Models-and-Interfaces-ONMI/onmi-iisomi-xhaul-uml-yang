import * as $ from 'jquery'; 
import { Action, IActionHandler } from '../flux/action';
import { MiddlewareArg } from '../flux/middleware';
import { Dispatch } from '../flux/store';

import { IApplicationStoreState } from '../store/applicationStore';
import { AddErrorInfoAction, ErrorInfo } from '../actions/errorActions';

const absoluteUri = /^(https?:\/\/|blob:)/i;
const baseUrl = `${ window.location.origin }${ window.location.pathname }`;

/**
  * The PlainObject type is a JavaScript object containing zero or more key-value pairs.
  */ 
interface PlainObject<T = any> {
  [key: string]: T;
}

interface AjaxParameter {
   /**
     * The HTTP method to use for the request (e.g. "POST", "GET", "PUT").
     */
  method?: string;
  /**
    * An object of additional header key/value pairs to send along with requests using the XMLHttpRequest
    * transport. The header X-Requested-With: XMLHttpRequest is always added, but its default
    * XMLHttpRequest value can be changed here. Values in the headers setting can also be overwritten from
    * within the beforeSend function.
    */
  headers?: PlainObject<string | null | undefined>;
}

class RestBaseAction extends Action { }

export const createRestApiAccessor = <TResult extends PlainObject>(urlOrPath: string, initialValue: TResult) => {
  const isLocalRequest = !absoluteUri.test(urlOrPath);
  const uri = isLocalRequest ? `${ baseUrl }/${ urlOrPath }`.replace(/\/{2,}/, '/') : urlOrPath ;
 
  class RestRequestAction extends RestBaseAction { constructor(public settings?: AjaxParameter) { super(); } }

  class RestResponseAction extends RestBaseAction { constructor(public result: TResult) { super(); } }

  class RestErrorAction extends RestBaseAction { constructor(public error?: Error | string) { super(); } }
  
  type RestAction = RestRequestAction | RestResponseAction | RestErrorAction;

  /** Represents our middleware to handle rest backend requests */
  const restMiddleware = (api: MiddlewareArg<IApplicationStoreState>) =>
    (next: Dispatch) => (action: RestAction): RestAction => {
      
      // pass all actions through by default
      next(action);
      // handle the RestRequestAction
      if (action instanceof RestRequestAction) {
        const state = api.getState();
        const authHeader = isLocalRequest && state && state.framework.authentication.user && state.framework.authentication.user.token
          ? { "Authentication": "Bearer " + state.framework.authentication.user.token } : { };
        $.ajax({
          url: uri,
          method: (action.settings && action.settings.method) || "GET",
          headers: { ...authHeader, ...action.settings && action.settings.headers ? action.settings.headers : { } },
        }).then((data: TResult) => {
           next(new RestResponseAction(data));
        }).catch((err: any) => {
          next(new RestErrorAction());
          next(new AddErrorInfoAction((err instanceof Error) ? { error: err } : { message: err.toString() }));
        });
      }
      // allways return action
      return action;
  };
  
  /** Represents our action handler to handle our actions */
  const restActionHandler: IActionHandler<TResult> = (state = initialValue, action) => {
    if (action instanceof RestRequestAction) {
      return {
        ...(state as any),
        busy: true
      };
    } else if (action instanceof RestResponseAction) {
      return action.result;
    } else if (action instanceof RestErrorAction) {
      return initialValue;
    }
    return state;
  };

  return {
    requestAction: RestRequestAction,
    actionHandler: restActionHandler,
    middleware: restMiddleware,
  };
}



