import * as React from 'react';
import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles'; 
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const styles = (theme: Theme) => createStyles({
  toggleContainer: {
    height: 10,
    padding: `10px`,
    display: 'inline-block',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `10px 0`,
    background: "grey"
  },
  buttonColor : {
    color: 'white',
    background: '#428bca',
    bordercolor : '#357ebd', 
    minWidth: 40,       
    width: "5px",
    margin: "1px",
    size: 5,
    padding: "2px"
  }
});

class Fcaps extends React.Component<any,any> {
  
  constructor(props: any) {
    super(props);
  }
  
  onChange(e: any) {
    alert('it works!'); 
  }
  
  render(): JSX.Element {
    const { classes }= this.props;
    return (
        <ToggleButtonGroup>
          onChange={this.onChange}
          >
          <ToggleButton className={ classes.buttonColor } value={'F'}>F</ToggleButton>
          <ToggleButton className={ classes.buttonColor } value={'C'}>C</ToggleButton>
          <ToggleButton className={ classes.buttonColor } value={'A'}>A</ToggleButton>
          <ToggleButton className={ classes.buttonColor } value={'P'}>P</ToggleButton>
          <ToggleButton className={ classes.buttonColor } value={'S'}>S</ToggleButton>
        </ToggleButtonGroup>
    );
  }
}

export default withStyles(styles)(Fcaps);