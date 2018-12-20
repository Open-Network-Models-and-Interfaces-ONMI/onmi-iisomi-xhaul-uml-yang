import * as React from "react";

interface ICounterState {
  value: number;
}

export class Counter extends React.Component<{}, ICounterState> {

  constructor(props: {}) {
    super(props);

    // init state
    this.state = {
      value: 0
    };
  }

  render(): JSX.Element {
    return (
      <div onClick={ this.onCount }>
        <span>Inventory count: </span>
        <span>{ this.state.value }</span>
      </div>
    );
  }

  private onCount = () => {
    this.setState ({
      value: this.state.value + 1
    });
  };
}

export default Counter;