import { Event } from "../common/event"

import { Action } from './action';
import { IActionHandler } from './action';

export interface Dispatch {
  <TAction extends Action>(action: TAction): TAction;
}

export interface Enhancer<TStoreState> {
  (store: Store<TStoreState>): Dispatch;
}

class InitialisationAction extends Action { };
const initialisationAction = new InitialisationAction();

export class Store<TStoreState> {

  constructor(actionHandler: IActionHandler<TStoreState>, enhancer?: Enhancer<TStoreState>)
  constructor(actionHandler: IActionHandler<TStoreState>, initialState: TStoreState, enhancer?: Enhancer<TStoreState>)
  constructor(actionHandler: IActionHandler<TStoreState>, initialState?: TStoreState | Enhancer<TStoreState>, enhancer?: Enhancer<TStoreState>) {
    if (typeof initialState === 'function') {
      enhancer = initialState as Enhancer<TStoreState>;
      initialState = undefined;
    }

    this._isDispatching = false;
     
    this.changed = new Event<void>(); // sollten wir hier eventuell sogar den state mit übergeben ?

    this._actionHandler = actionHandler;
    
    this._state = initialState as TStoreState;
    if (enhancer) this._dispatch = enhancer(this);

    this._dispatch(initialisationAction);
  }

  public changed: Event<void>;

  private _dispatch: Dispatch = <TAction extends Action>(payload: TAction): TAction => {
    if (payload == null || !(payload instanceof Action)) {
      throw new Error(
        'Actions must inherit from type Action. ' +
        'Use a custom middleware for async actions.'
      );
    }
    
    if (this._isDispatching) {
      throw new Error('ActionHandler may not dispatch actions.');
    }

    const oldState = this._state;
    try {
      this._isDispatching = true;
      this._state = this._actionHandler(oldState, payload);
    } finally {
      this._isDispatching = false;
    }

    if (this._state !== oldState) {
      this.changed.invoke();
    }

    return payload;
  }

  public get dispatch(): Dispatch {
    return this._dispatch;
  }

  public get state() {
    return this._state
  }

  private _state: TStoreState;
  private _isDispatching: boolean;
  private _actionHandler: IActionHandler<TStoreState>;

}

