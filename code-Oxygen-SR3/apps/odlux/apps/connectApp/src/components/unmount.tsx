import * as React from "react";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlink } from "@fortawesome/free-solid-svg-icons";
import { IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';
import { withStyles, Theme } from "@material-ui/core";


const actionStyles = (theme: Theme) => ({
  iconStyle: {
    color: 'white',
  },
  ButtonColor: {
    color: 'white',
    background: '#f0ad4e',
    bordercolor: '#eea236',
    minWidth: 40,
    width: "5px",
    margin: "1px",
    size: 5,
    padding: "2px"
  }
}); 

export class Unmount extends React.Component<{ onClickFunction: Function, rowElement: IRequiredNetworkElementExtended }, {}> {
  constructor(props: { onClickFunction: Function, rowElement: IRequiredNetworkElementExtended }) {
    super(props);
  }
  render(): JSX.Element {
    const { classes }: any = this.props;
    return (
      <Button className={ classes.ButtonColor } onClick={ this.unmountDevice } title="Unmount">
        <FontAwesomeIcon icon={ faUnlink } className={ classes.iconStyle } />
      </Button>
    );
  }

  /**
    * disconnect/unmount the device in Required network elements
    */
  private unmountDevice = (event: React.MouseEvent<HTMLElement>) => {
    this.props.rowElement.connectionStatus = "disconnected";
    this.props.onClickFunction(this.props.rowElement);
  }
  
}
export default withStyles(actionStyles)(Unmount);