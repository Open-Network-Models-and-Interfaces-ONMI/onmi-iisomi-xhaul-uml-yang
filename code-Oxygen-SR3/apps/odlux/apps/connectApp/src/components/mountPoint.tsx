import * as React from "react";
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import { IRequiredNetworkElement, IDataConnectExtended, IMountPointViewState } from '../models/requiredNetworkElements';
import { insertRequiredNetworkElement } from '../actions/requiredNetworkElementsActions';
import { connectNE } from '../actions/requiredNetworkElementsActions'

const actionsStyles = (theme: Theme) => createStyles({
  root: {
    marginTop: "24px",
    padding: "8px 500px 24px",
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
  textcolor: {
    color: "green"
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
  }
});


class MountPoints extends React.Component<any, IMountPointViewState> {
  constructor(props: any) {
    super(props);
    let view = {
      mountId: "new-netconf-server",
      host: "127.0.0.1",
      port: "12600",
      username: "admin",
      password: "admin",
      required: false,
      maintenancemode: false
    };
    this.state = {
      mountview: view,
      textMessage: ""
    }
  }

  render(): JSX.Element {
    const { classes } = this.props;
    return (
      <form onSubmit={ this.handleSubmit }>
        <div className={ classes.root }>
          <div className={ classes.margin }>
            <span>Name:    </span>
            <input className={ classes.inputBox } id="mountId" type="text" placeholder="new-netconf-server"
              value={ this.state.mountview.mountId } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <span>IP address:    </span>
            <input className={ classes.inputBox } id="host" type="text" placeholder="127.0.0.1" 
              value={ this.state.mountview.host } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <span>Port:    </span>
            <input className={ classes.inputBox } id="port" type="text" placeholder="830" 
              value={ this.state.mountview.port } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <span>Username:    </span>
            <input className={ classes.inputBox } id="mountusername" type="text" placeholder="admin" 
              value={ this.state.mountview.username } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <span>Password:    </span>
            <input className={ classes.inputBox } id="mountpassword" type="password" placeholder="admin" 
              value={ this.state.mountview.password } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <span>Required:    </span>
            <input id="required" type="checkbox" checked={ this.state.mountview.required } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <span>Maintenance:   </span>
            <input id="maintenancemode" type="checkbox" checked={ this.state.mountview.maintenancemode } onChange={ this.handleChange } />
          </div>
          <div className={ classes.margin }>
            <button type="submit" value="Submit" onClick={ this.showMessage }>Mount</button>
          </div>
        </div>
        <div className={ classes.margin }>
          <div className={ classes.textcolor }>
            { this.state.textMessage }
          </div>
        </div>
      </form>
    );
  }

  public showMessage = () => {
    if (this.handleSubmit && this.state.mountview.required) {
      this.setState({
        textMessage: 'Successfully Mounted and added to Required network elements'
      });
    }
    else if (this.handleSubmit && !this.state.mountview.required)
      this.setState({
        textMessage: 'Successfully Mounted and not added to Required network elements'
      });
    else {
      this.setState({
        textMessage: 'Could not be Mounted'
      });
    }
  }
  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Text", event.target.id);
    let view = this.state.mountview;
    switch (event.target.id) {
      case "mountId":
        view.mountId = event.target.value;
        break;
      case "host":
        view.host = event.target.value;
        break;
      case "port":
        view.port = event.target.value;
        break;
      case "mountusername":
        view.username = event.target.value;
        break;
      case "mountpassword":
        view.password = event.target.value;
        break;
      case "required":
        view.required = event.target.checked;
        break;
      case "maintenancemode":
        view.maintenancemode = event.target.checked;
        break;
      default:
        break;
    }
    this.setState({ mountview: view });
  };

  public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let view = this.state.mountview;

    var base_url = "http://localhost:8181/database";
    var database_index = 'mwtn';
    let mountId = view.mountId;

    var url = [base_url, database_index, 'required-networkelement', mountId].join('/');

    let connectElement: IRequiredNetworkElement = {
      mountId: view.mountId,
      host: view.host,
      port: view.port,
      username: view.username,
      password: view.password
    };

    connectNE(connectElement);
    let data: IDataConnectExtended = {
      connect: connectElement,
      nodeId: mountId,
      required: true
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
    if (view.required) {
      insertRequiredNetworkElement(request);
    }
    else {
      console.log("Not added to required network elements");
    }
  };

}

export default withStyles(actionsStyles)(MountPoints);

