import * as React from 'react';
import TablePagination from "@material-ui/core/TablePagination";
import EnhancedTableHeader from '../components/enhancedTableHeader';
import PaginationActions from '../components/tablePaginationActions';
import { Table, TableBody, TableCell, TableRow, TableFooter } from '@material-ui/core/';
import { IHeaderCell, IEnhancedTableHeader } from '../models/enhancedTableHeader';
import { IEnhancedTablePage } from '../models/tablePagination';
import { IConnectionStatusLogs, IConnectionStatusLogExtended } from '../models/connectionStatusLog';

interface IConnectionStatusProps {
  connectionLog: IConnectionStatusLogExtended[],
  busy: boolean,
  onLoadConnectionStatusLog: () => void
}

function desc(a: IConnectionStatusLogExtended, b: IConnectionStatusLogExtended, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array: IConnectionStatusLogExtended[], cmp: Function) {
  array.sort((a, b) => {
    return cmp(a, b);
  });
  return array;
}

/**
  * Column header Sort.
  */
function getSorting(order: "asc" | "desc" | undefined, orderBy: string) {
  return order === "desc"
    ? (a: IConnectionStatusLogExtended, b: IConnectionStatusLogExtended) => desc(a, b, orderBy)
    : (a: IConnectionStatusLogExtended, b: IConnectionStatusLogExtended) => -desc(a, b, orderBy);
}

/**
  * Filter
  */
function searchingFor(search: string) {
  return function (x: any) {
    return x.objectId.includes(search) || x.timeStamp.includes(search) || x.elementStatus.includes(search);
  }
}

/**
  * Header columns.
  */
const columns_Log: IHeaderCell[] = [
  {
    id: "timeStamp",
    numeric: false,
    label: "Timestamp"
  },
  {
    id: "objectId",
    numeric: false,
    label: "Node name"
  },
  {
    id: "type",
    numeric: false,
    label: "Type"
  }
];

export class ConnectionStatusLogComponent extends React.Component<IConnectionStatusProps, IEnhancedTableHeader & IEnhancedTablePage & IConnectionStatusLogs> {
  constructor(props: IConnectionStatusProps, state: IEnhancedTableHeader & IEnhancedTablePage & IConnectionStatusLogs) {
    super(props, state);
    console.log("Props on 26: ", props);
    this.state = {
      logEntries: [],
      onRequestSort: () => { },
      onChangePage: () => { },
      order: undefined,
      orderBy: "",
      headerColumns: [],
      rowsPerPage: 5,
      page: 0,
      count: 0,
      theme: [],
      classes: '',
      search: ''
    };
    this.searchHandler = this.searchHandler.bind(this);
  }

  public searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ search: event.target.value });
  };

  public handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, page: number) => {
    this.setState({ page });
  };

  public handleChangeRowsPerPage = (event: any) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  public handleRequestSort = (event: React.MouseEvent<HTMLElement>, property: string) => {
    const orderBy = property;
    if (this.state.orderBy === property && this.state.order === "desc") {
      this.setState({
        order: "asc",
        orderBy: orderBy
      });
    } else {
      this.setState({
        order: "desc",
        orderBy: orderBy
      });
    }
  };


  render(): JSX.Element {
    const {
      connectionLog,
      busy
    } = this.props;
    const { rowsPerPage, page, search } = this.state;
    const { order, orderBy } = this.state;

    console.log("my data 172:", connectionLog);

    var connectionStatusLogList: IConnectionStatusLogExtended[];
    connectionStatusLogList = connectionLog.map(e => {
      {
        var status = 'unknown';
        if (e._source.event.type === 'ObjectCreationNotificationXml') {
          status = 'connected';

        } else if (e._source.event.type === 'ObjectDeletionNotificationXml') {
          status = 'disconnected';
        }
        let newElement: IConnectionStatusLogExtended = {
          timeStamp: e._source.event.timeStamp,
          objectId: e._source.event.objectId,
          type: e._source.event.type,
          elementStatus: status
        }
        return newElement;
      }
    });

    if (this.state.search) {
      connectionStatusLogList = connectionStatusLogList.filter(row => {
        return row.objectId.includes(this.state.search) || row.timeStamp.includes(this.state.search) || row.elementStatus.includes(this.state.search);
      })
    }

    return (
      <div>
        <Table >
          <div>
            Search: <input type="text"
              onChange={ this.searchHandler } 
              value={ this.state.search }
            />
          </div>
          <EnhancedTableHeader
            onRequestSort={ this.handleRequestSort }
            order={ order }
            orderBy={ orderBy }
            headerColumns={ columns_Log }
          />
          <TableBody>
            { stableSort(connectionStatusLogList, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter(searchingFor(this.state.search))
              .map(status => (
                <TableRow >
                  <TableCell>{ status.timeStamp }</TableCell>
                  <TableCell>{ status.objectId }</TableCell>
                  <TableCell>{ status.elementStatus }</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={ 3 }
                count={ connectionStatusLogList.length }
                rowsPerPage={ rowsPerPage }
                page={ page }
                onChangePage={ this.handleChangePage }
                onChangeRowsPerPage={ this.handleChangeRowsPerPage }
                ActionsComponent={ PaginationActions }
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  };
}

export default ConnectionStatusLogComponent;