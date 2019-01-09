import * as React from 'react';
import { fetchRequiredNetworkElements, connectNE, getConnectionStatus } from '../actions/requiredNetworkElementsActions';
import { MaterialTable, DataCallback , ColumnType} from '../../../../framework/src/components/material-table';
import { IUnknownNetworkElements, IUnknownNetworkElementsExtended } from '../models/unknownNetworkElements';
import { disconnectNE } from '../actions/requiredNetworkElementsActions'
import { IRequiredNetworkElement, IDataConnectExtended } from '../models/requiredNetworkElements';
import { insertRequiredNetworkElement } from '../actions/requiredNetworkElementsActions';
import AddToRequired from '../components/addToRequired';
import { TableApi } from '../../../../framework/src/components/material-table';

interface IUnknownNetworkElementsProps {
  unknownNetworkElements: IUnknownNetworkElementsExtended[],
  busy: boolean,
}

interface IComponentState {
  init: boolean
}

export class UnknownNetworkElementsListComponent extends React.Component<IUnknownNetworkElementsProps, IUnknownNetworkElements & IComponentState> {
  constructor(props: IUnknownNetworkElementsProps, state: IUnknownNetworkElements & IComponentState) {
    super(props, state);
    console.log("Props on 26: ", props);
    this.state = {
      unknownNetworkElements: [],
      init: false
    };
  }

  private readonly updateTableapi : TableApi ={};

  render(): JSX.Element {
    const {
      unknownNetworkElements,
      busy
    } = this.props;

    this.updateTableapi.forceRefresh && this.updateTableapi.forceRefresh();
    console.log("my data 150:", unknownNetworkElements);
    var unknownNetworkElementsList: IUnknownNetworkElementsExtended[];
    if (this.state.unknownNetworkElements.length > 0 || this.state.init) {
      unknownNetworkElementsList = this.state.unknownNetworkElements;
    } else {
      unknownNetworkElementsList = unknownNetworkElements;
    }

    let unknownNetworkElementsRows = unknownNetworkElementsList.map(row => {
      return { ...row, _id: row.name };
    });

  this.updateTableapi.forceRefresh && this.updateTableapi.forceRefresh();
    return (
      <div>
        <MaterialTable asynchronus rows={unknownNetworkElementsRows} columns={[
          { property: "name", title: "Name", type: ColumnType.text },
          { property: "host", title: "Host", type: ColumnType.text },
          { property: "netConfPort", title: "Netconf port", type: ColumnType.text },
          { property: "coreModel", title: "Core Model", type: ColumnType.text },
          { property: "airInterface", title: "Air interface", type: ColumnType.text },
          { property: "unknownConnectionStatus", title: "Connection Status", type: ColumnType.text },
          {
            property: "actions", title: "Actions", type: ColumnType.custom, customControl: (props) => (
              <div>
                <AddToRequired onAddFunction= {this.addToRequiredNE} onUnmountFunction = {this.unmount} rowElement={props.rowData as IUnknownNetworkElementsExtended} />
              </div>
            )
          },
        ]} idProperty="_id" tableApi= { this.updateTableapi } >
        </MaterialTable>
      </div>
    );
  };

  /**
    * unmount device from Unknown network elements.
    */
  public unmount = (element: IUnknownNetworkElementsExtended) => {
    disconnectNE(element.name);
    this.updateTable(element);
  };

  public addToRequiredNE = (element: IUnknownNetworkElementsExtended) => {
    console.log('Im here in 107:', element);

    let view = element;
    var base_url = "http://localhost:8181/database";
    var database_index = 'mwtn';
    let mountId = view.name;

    var url = [base_url, database_index, 'required-networkelement', mountId].join('/');
    let connect1: IRequiredNetworkElement = {
      mountId: view.name,
      host: view.host,
      port: view.netConfPort,
      username: 'admin',
      password: 'admin'
    }
    let data: IDataConnectExtended = {
      connect: connect1,
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
    insertRequiredNetworkElement(request);
    this.updateTable(element);
  }

  /**
    * Adding device to the Required network elements.
    */
  public updateTable = (element: IUnknownNetworkElementsExtended) => {
    var unknownNetworkElements: IUnknownNetworkElementsExtended[] = [];
    console.log(this.state.init);
    if (this.state.unknownNetworkElements.length > 0 || this.state.init) {
      this.state.unknownNetworkElements.forEach(ne => {
        if (element.name !== ne.name) {
          unknownNetworkElements.push(ne);
        }
      });
    } else {
      this.props.unknownNetworkElements.forEach(ne => {
        if (element.name !== ne.name) {
          unknownNetworkElements.push(ne);
        }
      });
    }
    this.setState({ unknownNetworkElements: unknownNetworkElements, init: true });
  }
}

export default UnknownNetworkElementsListComponent;