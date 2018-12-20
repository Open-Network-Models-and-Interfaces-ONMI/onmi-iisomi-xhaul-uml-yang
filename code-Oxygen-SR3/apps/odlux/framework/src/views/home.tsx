import * as React from 'react';
import Button from '@material-ui/core/Button';
import Logo from '../components/logo';

class BuggyCounter extends React.Component<{}, {counter:number}> {
  constructor(props: {}) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({ counter }) => ({
      counter: counter + 1
    }));
  }

  render() {
    if (this.state.counter === 5) {
      // Simulate a JS error
      throw new Error('I crashed!');
    }
    return <h1 onClick={ this.handleClick }>{ this.state.counter }</h1>;
  }
}

export const Home = (props: React.Props<any>) => {
  return (
    <div>
      <h1>Welcome to ODLUX.</h1>
      <Button variant="contained" color="secondary" onClick={ () => { throw new Error("This is an error") } }>
        Throw an Error1
      </Button>
      <BuggyCounter />
      <Logo />
    </div>
  )
}

export default Home;