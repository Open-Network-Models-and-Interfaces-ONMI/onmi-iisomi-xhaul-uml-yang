import * as React from 'react';

export class Counter extends React.Component<{}, { counter: number }> {
  constructor(props: {}) {
    super(props);

    this.state = {
      counter: 0
    };
  }
  
  render() {
    return (
      <button onClick={ () => this.setState({ counter: this.state.counter + 1 }) }>{ this.state.counter }</button>
    )
  }
}