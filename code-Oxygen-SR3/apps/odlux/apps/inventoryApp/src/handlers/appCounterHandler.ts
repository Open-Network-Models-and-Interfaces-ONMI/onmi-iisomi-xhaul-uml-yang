import { IActionHandler } from '../../../../framework/src/flux/action';
import { IncrementCounterAction } from '../actions/counterActions';
import { ICounter } from '../models/counter';

export type CounterState = ICounter; 

const counterInit: CounterState = {
  value: 0
};

export const counterHandler: IActionHandler<CounterState> = (state = counterInit, action) => {
  if (action instanceof IncrementCounterAction) {
    state = {
      value: state.value + action.step
    };
  }
  return state;
};
