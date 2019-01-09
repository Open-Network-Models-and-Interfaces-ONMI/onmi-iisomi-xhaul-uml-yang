import * as React from 'react';
import { IRequiredNetworkElements, IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';
import { connectNE, disconnectNE, getConnectionStatus } from '../actions/requiredNetworkElementsActions';
import { MaterialTable, DataCallback, ColumnType } from '../../../../framework/src/components/material-table';
import { fetchRequiredNetworkElements} from '../actions/requiredNetworkElementsActions';
import Mount from '../components/mount';
import Unmount from '../components/unmount';
import Info from '../components/info';
import { TableApi } from '../../../../framework/src/components/material-table';

const fetchData: DataCallback = async (page, rowsPerPage, orderBy, order, filter) => {
  return fetchRequiredNetworkElements(page, rowsPerPage, orderBy, order, filter);
};

export class RequiredNetworkElementsListComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  private readonly updateTableapi : TableApi ={};

  render(): JSX.Element {
    const {
      classes
    } = this.props;
    this.updateTableapi.forceRefresh && this.updateTableapi.forceRefresh();
    return (
      <div>
        <MaterialTable columns={[
          { property: "mountId", title: "Name", type: ColumnType.text },
          { property: "connectionStatus", title: "Connection Status", type: ColumnType.text, disableFilter: true, disableSorting: true, disablePadding: true },
          { property: "host", title: "Host", type: ColumnType.text },
          { property: "port", title: "Port", type: ColumnType.text },
          { property: "username", title: "Username", type: ColumnType.text },
          { property: "password", title: "Password", type: ColumnType.text },
          {
            property: "actions", title: "Actions", type: ColumnType.custom, customControl: (props) => (
                <div>
                  <Mount onClickFunction={ this.mountDevice  } rowElement={ props.rowData as IRequiredNetworkElementExtended } />
                  <Unmount onClickFunction={ this.unmountDevice} rowElement={ props.rowData as IRequiredNetworkElementExtended } />
                  <Info onHideOrDelete={ this.onHideOrDeleteNE } rowElement={ props.rowData as IRequiredNetworkElementExtended } />
                </div>
            )
          },
        ]} idProperty="mountId" onRequestData={ fetchData }  tableApi ={ this.updateTableapi }>
        </MaterialTable>
      </div>
    );
  };



  /**
  * Connecting the device
  */
  public mountDevice = (element: IRequiredNetworkElementExtended) => {
    connectNE(element);
  };

  /**
  * unmounting the device.
  */
  public unmountDevice = (element: IRequiredNetworkElementExtended) => {
    disconnectNE(element.mountId);
  };

  /**
  * Hide/delete the device.
  */
  public onHideOrDeleteNE = () => {
    this.updateTableapi.forceRefresh && this.updateTableapi.forceRefresh();
  }
}


export default RequiredNetworkElementsListComponent;