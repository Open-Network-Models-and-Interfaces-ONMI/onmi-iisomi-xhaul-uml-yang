/**
  * Represents an action in the odlux flux architecture.
  */
export abstract class Action { }

export interface IActionHandler<TState, TAction extends Action = Action> {
  (state: TState | undefined, action: TAction): TState;
}