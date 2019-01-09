import * as React from "react";
import Button from "@material-ui/core/Button";
import Modal from '@material-ui/core/Modal';
import { IUnknownNetworkElementsExtended } from '../models/unknownNetworkElements';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${ top }%`,
    left: `${ left }%`,
    transform: `translate(-${ top }%, -${ left }%)`,
  };
}

const actionsStyles = (theme: Theme) => createStyles({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  root: {
    marginTop: "24px",
    display: "table",
    boxsizing: "content-box",
    minwidth: "15%"
  }, 
  margin: {
    width:"100%",
    textAlign: "right",
    marginTop: "24px",
    fontSize: "1.2rem"
  },
  inputBox: {
    height: "28px",
    padding: "6px 12px",
    fontSize: "14px",
    lineHeight: "1.428571429",
    color: "#858585",
    verticalAlign: "middle",
    background: "#ffffff",
    border: "2px solid #d5d5d5",
    borderRadius: "4px"
  },
  addButtonColor: {
    color: theme.palette.primary.main,
    background: theme.palette.secondary.dark,
    bordercolor: '#eea236',
    minWidth: 40,
    width: "350px",
    margin: "10px",
    size: 25,
    padding: "4px",
    textTransform:'none'
  },
  reqButtonColor: {
    color: theme.palette.primary.main,
    background: theme.palette.secondary.dark,
    bordercolor: '#357ebd',
    minWidth: 40,
    width: "150px",
    margin: "10px",
    size: 25,
    padding: "4px",
    textTransform:'none'
  },
  closeButtonColor: {
    color: theme.palette.primary.main,
    background: theme.palette.secondary.dark,
    bordercolor: '#357ebd',
    minWidth: 40,
    width: "90px",
    margin: "10px",
    size: 5,
    padding: "4px",
    textTransform:'none'
  }
});

export class AddToRequired extends React.Component<{ onAddFunction: Function, onUnmountFunction: Function, rowElement: IUnknownNetworkElementsExtended }, {}> {
  constructor(props: { onAddFunction: Function, onUnmountFunction:Function, rowElement: IUnknownNetworkElementsExtended }) {
    super(props);
  }

  state = {
    openAddModal: false
  };

  onOpenAddModal = () => {
    this.setState({ openAddModal: true });
  };

  onCloseAddModal = () => {
    this.setState({ openAddModal: false });
  };
  render() {
    const { openAddModal } = this.state;
    const { classes }: any = this.props;
    return (
      <div>
        <Button className={ classes.closeButtonColor } onClick={this.unmountUnknown} >Unmount</Button>
        <Button className={ classes.reqButtonColor } onClick={ this.onOpenAddModal }>To required NEs...</Button>
        <Modal open={ openAddModal } onClose={ this.onCloseAddModal }>
          <div style={ getModalStyle() } className={ classes.paper }>
          <h2>Add to Required network elements</h2>
          <form action="">
            <p>
              Create a new NetworkElement in planning database as clone of existing real NetworkElement.
             </p>
            <div className={ classes.root }>
              <div className={ classes.margin }>
                <span>Name:    </span>
                <input className={ classes.inputBox } id="mountId" type="text" value={ this.props.rowElement.name }
                />
              </div>
              <div className={ classes.margin }>
                <span>IP address:    </span>
                <input className={ classes.inputBox } id="host" type="text" value={ this.props.rowElement.host }
                />
              </div>
              <div className={ classes.margin }>
                <span>Port:    </span>
                <input className={ classes.inputBox } id="port" type="text" value={ this.props.rowElement.netConfPort }
                />
              </div>
              <div className={ classes.margin }>
                <span>Username:    </span>
                <input className={ classes.inputBox } id="mountusername" type="text" value={'admin'}
                />
              </div>
              <div className={ classes.margin }>
                <span>Password:    </span>
                <input className={ classes.inputBox } id="mountpassword" type="password" value={'admin'}
                />
              </div>
              <br /><br />
              <Button className={ classes.addButtonColor } onClick={ this.addNE } >Add to Required network elements</Button>
              <Button className={ classes.closeButtonColor } onClick={ this.onCloseAddModal } >Cancel</Button>
            </div>
            </form>
            </div>
        </Modal>
      </div>
    );
  }

 /**
 * Add device to Required network elements.
 */
  private addNE = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onAddFunction(this.props.rowElement);
    this.setState({ openAddModal: false });
  }

  private unmountUnknown = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onUnmountFunction(this.props.rowElement);
  }
}
export default withStyles(actionsStyles)(AddToRequired);

