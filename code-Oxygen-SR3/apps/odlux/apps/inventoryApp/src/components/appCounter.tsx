import * as React from "react";
import connect, { Connect, IDispatcher } from '../../../../framework/src/flux/connect';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';
import { IncrementCounterAction } from '../actions/counterActions';

const mapState2Props = (state: IApplicationStoreState ) => {
  return {
    countValue: state.inventoryApp.counterState.value
  };
};

const mapDispatch2Props = (dispatcher : IDispatcher) => {
  return {
    incrementCounter: () => {
      dispatcher.dispatch(new IncrementCounterAction());
    }
  };
};

type CounterComponentProps = Connect<typeof mapState2Props, typeof mapDispatch2Props>;

const CounterComponent : React.SFC<CounterComponentProps> = (props) => {
  return (
    <div onClick={ props.incrementCounter }>
      AppCounter { props.countValue }
    </div>
  );
};

export const Counter = connect ( mapState2Props, mapDispatch2Props ) (CounterComponent)