import * as React from 'react';
import TablePagination from "@material-ui/core/TablePagination";
import EnhancedTableHeader from '../components/enhancedTableHeader';
import PaginationActions from '../components/tablePaginationActions';
import AddToRequired from '../components/addToRequired'
import { Table, TableBody, TableCell, TableRow, TableFooter } from '@material-ui/core/';
import { IHeaderCell, IEnhancedTableHeader } from '../models/enhancedTableHeader'
import { IEnhancedTablePage } from '../models/tablePagination';
import { IUnknownNetworkElements, IUnknownNetworkElementsExtended } from '../models/unknownNetworkElements';
import { disconnectNE } from '../actions/requiredNetworkElementsActions'
import { IRequiredNetworkElement, IDataConnectExtended } from '../models/requiredNetworkElements';
import { insertRequiredNetworkElement } from '../actions/requiredNetworkElementsActions';

interface IUnknownNetworkElementsProps {
  unknownNetworkElements: IUnknownNetworkElementsExtended[],
  busy: boolean,
  onLoadUnknownNetworkElements: () => void
}

interface IComponentState {
  init: boolean
}

function desc(a: IUnknownNetworkElementsExtended, b: IUnknownNetworkElementsExtended, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array: IUnknownNetworkElementsExtended[], cmp: Function) {
  array.sort((a, b) => {
    return cmp(a, b);
  });
  return array;
}

function getSorting(order: "asc" | "desc" | undefined, orderBy: string) {
  return order === "desc"
    ? (a: IUnknownNetworkElementsExtended, b: IUnknownNetworkElementsExtended) => desc(a, b, orderBy)
    : (a: IUnknownNetworkElementsExtended, b: IUnknownNetworkElementsExtended) => -desc(a, b, orderBy);
}

function searchingFor(search: string) {
  return function (x: any) {
    return x.name.includes(search) ;
  }

}

const columns_unknown: IHeaderCell[] = [
  {
    id: "name",
    numeric: false,
    label: "Name"
  },
  {
    id: "ipaddress",
    numeric: false,
    label: "IP address"
  },
  {
    id: "netConfPort",
    numeric: false,
    label: "NetConf port"
  },
  {
    id: "coreModel",
    numeric: true,
    label: "CoreModel revision"
  },
  {
    id: "airInterface",
    numeric: false,
    label: "AirInterface revision"
  },
  {
    id: "unknownConnectionStatus",
    numeric: false,
    label: "Connection status"
  },
  {
    id: "actions",
    numeric: false,
    label: "Actions"
  }
];



export class UnknownNetworkElementsListComponent extends React.Component<IUnknownNetworkElementsProps, IUnknownNetworkElements & IEnhancedTableHeader & IEnhancedTablePage & IComponentState> {
  constructor(props: IUnknownNetworkElementsProps, state: IUnknownNetworkElements & IEnhancedTableHeader & IEnhancedTablePage & IComponentState) {
    super(props, state);
    console.log("Props on 26: ", props);
    this.state = {
      unknownNetworkElements: [],
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
      search: '',
      init: false
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
      unknownNetworkElements,
      busy
    } = this.props;
    console.log("props here: ", this.props);
    const { rowsPerPage, page, search } = this.state;
    const { order, orderBy } = this.state;

    console.log("my data 270:", unknownNetworkElements);
    var unknownNetworkElementsList: IUnknownNetworkElementsExtended[];
    if (this.state.unknownNetworkElements.length > 0 || this.state.init) {
      unknownNetworkElementsList = this.state.unknownNetworkElements;
    } else {
      unknownNetworkElementsList = unknownNetworkElements;
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
            headerColumns={ columns_unknown }
          />

          <TableBody>
            { stableSort(unknownNetworkElementsList, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter(searchingFor(this.state.search))
              .map(element => (
                <TableRow>
                  <TableCell>{ element.name }</TableCell>
                  <TableCell>{ element.host }</TableCell>
                  <TableCell>{ element.netConfPort }</TableCell>
                  <TableCell>{ element.coreModel }</TableCell>
                  <TableCell>{ element.airInterface }</TableCell>
                  <TableCell>{ element.unknownConnectionStatus }</TableCell>
                  <TableCell>
                  <AddToRequired onAddFunction= {this.addToRequiredNE} onUnmountFunction = {this.unmount} rowElement={element} />
                    </TableCell>
                </TableRow>
              )) }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={ 3 }
                count={ unknownNetworkElementsList.length }
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