import * as React from "react";
import { Button } from "@material-ui/core/";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';


const actionStyles = (theme: Theme) => createStyles({
  iconStyle: {
    color: 'white',
  },
  ButtonColor: {
    color: 'white',
    background: '#428bca',
    bordercolor: '#357ebd',
    minWidth: 40,
    width: "5px",
    margin: "1px",
    size: 5,
    padding: "2px"
  }

});

export class Mount extends React.Component<{ onClickFunction: Function, rowElement: IRequiredNetworkElementExtended }, {}> {
  constructor(props: { onClickFunction: Function, rowElement: IRequiredNetworkElementExtended }) {
    super(props);
  }

  render(): JSX.Element {
    const { classes }: any = this.props;

    return (
      <Button onClick={this.mountDevice} title="Mount" className={classes.ButtonColor}>
        <FontAwesomeIcon icon={faLink} className={classes.iconStyle} />
      </Button>
    );
  }

  /**
  * Connect/mount the device
  */
  private mountDevice = async (event: React.MouseEvent<HTMLElement>) => {
    console.log(this.props.rowElement);
    this.props.rowElement.connectionStatus='connecting..'
    this.props.onClickFunction(this.props.rowElement);
  }

}
export default withStyles(actionStyles)(Mount);