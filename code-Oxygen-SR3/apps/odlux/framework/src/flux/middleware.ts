import { Action, IActionHandler } from './action';
import { Store, Dispatch, Enhancer } from './store';

export interface MiddlewareArg<T> {
  dispatch: Dispatch;
  getState: () => T;
}

export interface Middleware<T> {
  (obj: MiddlewareArg<T>): Function;
}

class InitialisationAction extends Action { };
const initialisationAction = new InitialisationAction();

export type ActionHandlerMapObject<S extends { [key: string]: any }, A extends Action = Action> = {
  [K in keyof S]: IActionHandler<S[K], A>
}

export const combineActionHandler = <TState extends { [key: string]: any }, TAction extends Action = Action>(actionHandlers: ActionHandlerMapObject<TState, TAction>) : IActionHandler<TState, TAction> => {
  const finalActionHandlers: ActionHandlerMapObject<TState> = {} as ActionHandlerMapObject<TState>;
  Object.keys(actionHandlers).forEach(actionHandlerKey => {
    const handler = actionHandlers[actionHandlerKey];
    if (typeof handler === 'function') {
      finalActionHandlers[actionHandlerKey] = handler;
    }
  });

  // ensure initialisation
  Object.keys(finalActionHandlers).forEach(key => {
    const actionHandler = finalActionHandlers[key];
    const initialState = actionHandler(undefined, initialisationAction);
    if (typeof initialState === 'undefined') {
      const errorMessage = `Action handler ${ key } returned undefiend during initialization.`;
      throw new Error(errorMessage);
    }
  });

  return function combination<TAction extends Action>(state: TState = ({} as TState), action: TAction) {
    let hasChanged = false;
    const nextState : TState = {} as TState;
    Object.keys(finalActionHandlers).forEach(key => {
      const actionHandler = finalActionHandlers[key];
      const previousState = state[key];
      const nextStateKey = actionHandler(previousState, action);
      if (typeof nextStateKey === 'undefined') {
        const errorMessage = `Given ${ action.constructor } and action handler ${ key } returned undefiend.`;
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateKey;
      hasChanged = hasChanged || nextStateKey !== previousState;
    });
    return (hasChanged ? nextState : state) as TState;
  };
};

export const chainMiddleware = <TStoreState>(...middlewares: Middleware<TStoreState>[]): Enhancer<TStoreState> => {
  return (store: Store<TStoreState>) => {
    const middlewareAPI = {
      getState() { return store.state },
      dispatch: <TAction extends Action>(action: TAction) => store.dispatch(action) // we want to use the combinded dispatch
      // we should NOT use the flux dispatcher here, since the action would affect ALL stores 
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    return compose(...chain)(store.dispatch) as Dispatch;
  }
};

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
const compose = (...funcs: Function[]) => {
  if (funcs.length === 0) {
    return (arg: any) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
};

