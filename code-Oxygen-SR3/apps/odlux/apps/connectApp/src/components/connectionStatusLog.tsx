import * as React from 'react';
import { IConnectionStatusLogs } from '../models/connectionStatusLog';
import { MaterialTable, DataCallback, ColumnType } from '../../../../framework/src/components/material-table';
import { fetchConnectionStatusLogs }  from '../actions/connectionStatusLogActions'


const fetchData: DataCallback = async (page, rowsPerPage, orderBy, order, filter) => {
  return fetchConnectionStatusLogs(page, rowsPerPage, orderBy, order, filter);
};


export class ConnectionStatusLogComponent extends React.Component<{}, IConnectionStatusLogs> {
  constructor(props: {}, state: IConnectionStatusLogs) {
    super(props, state);
    console.log("Props on 26: ", props);
    this.state = {
      logEntries: [],
    };
  }
  render(): JSX.Element {

    return (
      <div>
        <MaterialTable columns={[
          { property: "timeStamp", title: "Time", type: ColumnType.text },
          { property: "objectId", title: "Name", type: ColumnType.text },
          { property: "elementStatus", title: "Connection status", type: ColumnType.text },
        ]} idProperty="_id" onRequestData={fetchData} >

        </MaterialTable>
      </div>
    );
  };
}

export default ConnectionStatusLogComponent;