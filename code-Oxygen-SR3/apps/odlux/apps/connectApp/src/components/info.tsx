import * as React from "react";
import Button from "@material-ui/core/Button";
import Modal from 'react-responsive-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import { deleteRequiredNetworkElement } from '../actions/requiredNetworkElementsActions';
import { IRequiredNetworkElement, IDataConnectExtended } from '../models/requiredNetworkElements';
import { insertRequiredNetworkElement } from '../actions/requiredNetworkElementsActions';

const actionsStyles = (theme: Theme) => createStyles({
  iconStyle: {
    color: 'white'
  },
  ButtonColor: {
    color: '#ffffff',
    background: '#47a447',
    bordercolor: '#398439',
    minWidth: 40,
    width: "5px",
    margin: "1px",
    size: 5,
    padding: "2px"
  },
  deleteButtonColor: {
    color: '#ffffff',
    background: '#d9534f',
    bordercolor: '#d43f3a',
    minWidth: 40,
    width: "90px",
    margin: "10px",
    size: 5,
    padding: "4px"
  },
  hideButtonColor: {
    color: '#ffffff',
    background: '#f0ad4e',
    bordercolor: '#eea236',
    minWidth: 40,
    width: "90px",
    margin: "10px",
    size: 5,
    padding: "4px"
  },
  closeButtonColor: {
    color: '#ffffff',
    background: '#428bca',
    bordercolor: '#357ebd',
    minWidth: 40,
    width: "90px",
    margin: "10px",
    size: 5,
    padding: "4px"
  },
});

export class Info extends React.Component<{ onClickFunction: Function, onHideOrDelete: Function, rowElement: IRequiredNetworkElementExtended }, {}> {
  constructor(props: { onClickFunction: Function, onHideOrDelete: Function, rowElement: IRequiredNetworkElementExtended }) {
    super(props);
  }
  state = {
    openInfoModal: false,
    openDeleteModal: false,
    openHideModal: false,
  };

  onOpenInfoModal = () => {
    this.setState({ openInfoModal: true });
  };

  onCloseInfoModal = () => {
    this.setState({ openInfoModal: false });
  };

  onOpenDeleteModal = () => {
    this.setState({ openDeleteModal: true });
  };

  onCloseDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  };

  onOpenHideModal = () => {
    this.setState({ openHideModal: true });
  };

  onCloseHideModal = () => {
    this.setState({ openHideModal: false });
  };
  render() {

    const { openInfoModal, openDeleteModal, openHideModal } = this.state;
    const { classes }: any = this.props;
    return (
      <div>
        <Button className={ classes.ButtonColor } title="Info" onClick={ this.onOpenInfoModal }>
          <FontAwesomeIcon className={ classes.iconStyle } icon={ faInfo } />
        </Button>

        <Modal open={ openInfoModal } onClose={ this.onCloseInfoModal } center>
          <h2>{ this.props.rowElement.mountId }</h2>
          <form action="">
            <p>
              The network element does not support a native web user interface.
             </p>
            <p>
              The network element does not support a native terminal or console application.>
             </p>
            <Button className={ classes.deleteButtonColor } onClick={ this.onOpenDeleteModal} >Delete</Button>
            <Button className={ classes.hideButtonColor } onClick={ this.onOpenHideModal }  >Hide</Button>
            <Button className={ classes.closeButtonColor } onClick={ this.onCloseInfoModal } >Close</Button>
          </form>

        </Modal>
        <Modal open={ openDeleteModal} onClose={ this.onCloseDeleteModal } center> 
          <div>
            <h1> Delete </h1>
            <br />
            <span>Delete { this.props.rowElement.mountId } from the planning database.</span>
            <br />
            <br /><br />
            <span>All the planning data for this network element will be lost.</span>
            <br />
            <br />
            <br />
          </div>
          <Button className={ classes.deleteButtonColor } onClick={ this.deleteNE }>Delete</Button>
          <Button className={ classes.closeButtonColor } onClick={ this.onCloseDeleteModal } >Cancel</Button>
        </Modal>

        <Modal open={ openHideModal } onClose={ this.onCloseHideModal } center>
          <div>
            <h1> Hide </h1>
            <br />
            <span>Remove { this.props.rowElement.mountId } from the list of required network elements..</span>
            <br />
            <br /><br />
            <span>All the planning data for this network element will be lost.</span>
            <br />
            <br />
            <br />
          </div>
          <Button className={ classes.deleteButtonColor } onClick={ this.hideNE }>Hide</Button>
          <Button className={ classes.closeButtonColor } onClick={ this.onCloseHideModal } >Cancel</Button>
        </Modal>
      </div>
    );
  }

  /**
  * Delete device from Required network elements.
  */
  private deleteNE = (event: React.MouseEvent<HTMLElement>) => {

    const url = 'http://localhost:8181/database/mwtn/required-networkelement/' + this.props.rowElement.mountId;
    let request = {
      method: "DELETE",
      command: '_query',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    deleteRequiredNetworkElement(request);
    this.props.onHideOrDelete(this.props.rowElement);
    this.setState({ openInfoModal: false });
    this.setState({ openDeleteModal: false });
  }

  /**
    * Hide device from Required network elements. 
    */
  private hideNE = (event: React.MouseEvent<HTMLElement>) => {
    let view = this.props.rowElement;

    var base_url = "http://localhost:8181/database";
    var database_index = 'mwtn';
    let mountId = view.mountId;
    console.log('hide data:', view);
    var url = [base_url, database_index, 'required-networkelement', mountId].join('/');

    let connect: IRequiredNetworkElement = {
      mountId: this.props.rowElement.mountId,
      host: this.props.rowElement.host,
      port: this.props.rowElement.port,
      username: this.props.rowElement.username,
      password: this.props.rowElement.password,
    };

    let data: IDataConnectExtended = {
      connect: connect,
      nodeId: mountId,
      required: false
    };

    let jsonifiedData = JSON.stringify(data);
    let request = {
      method: "PUT",
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: jsonifiedData
    };
    insertRequiredNetworkElement(request);

    this.setState({ openInfoModal: false });
    this.setState({ openHideModal: false });
    this.props.onHideOrDelete(this.props.rowElement);
  }
}


export default withStyles(actionsStyles)(Info);

