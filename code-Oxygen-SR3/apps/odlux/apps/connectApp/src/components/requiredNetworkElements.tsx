import * as React from 'react';
import connect from '../../../../framework/src/flux/connect';
import TablePagination from "@material-ui/core/TablePagination";
import Mount from '../components/mount';
import Unmount from '../components/unmount';
import Info from '../components/info';
import Fcaps from '../components/fcaps';
import EnhancedTableHeader from '../components/enhancedTableHeader';
import PaginationActions from '../components/tablePaginationActions';
import { Table, TableBody, TableCell, TableRow, TableFooter } from '@material-ui/core/';
import { IHeaderCell, IEnhancedTableHeader } from '../models/enhancedTableHeader'
import { IRequiredNetworkElements, IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';
import { IEnhancedTablePage } from '../models/tablePagination';
import { connectNE, disconnectNE } from '../actions/requiredNetworkElementsActions'
import { loadAllRequiredNetworkElementsAsync } from '../actions/requiredNetworkElementsActions';

interface INetworkListProps {
  networkElements: IRequiredNetworkElementExtended[],
  busy: boolean,
  onLoadAllRequiredNetworkElements: () => void
}


function desc(a: IRequiredNetworkElementExtended, b: IRequiredNetworkElementExtended, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array: IRequiredNetworkElementExtended[], cmp: Function) {
  array.sort((a, b) => {
    return cmp(a, b);
  });
  return array;
}


function getSorting(order: "asc" | "desc" | undefined, orderBy: string) {
  return order === "desc"
    ? (a: IRequiredNetworkElementExtended, b: IRequiredNetworkElementExtended) => desc(a, b, orderBy)
    : (a: IRequiredNetworkElementExtended, b: IRequiredNetworkElementExtended) => -desc(a, b, orderBy);
}

function searchingFor(search: string) {
  return function (x: any) {
    return x.mountId.includes(search) || x.host.includes(search);
  }

}


const columns: IHeaderCell[] = [
  {
    id: "mountId",
    numeric: false,
    label: "Name"
  },
  {
    id: "connectionStatus",
    numeric: false,
    label: "Connection Status"
  },
  {
    id: "host",
    numeric: false,
    label: "IP Address"
  },
  {
    id: "port",
    numeric: true,
    label: "Port"
  },
  {
    id: "client",
    numeric: false,
    label: "Client"
  },
  {
    id: "username",
    numeric: false,
    label: "User Name"
  },
  {
    id: "password",
    numeric: false,
    label: "Password"
  },
  {
    id: "actions",
    numeric: false,
    label: "Actions"
  }
];


export class RequiredNetworkElementsListComponent extends React.Component<INetworkListProps, IRequiredNetworkElements & IEnhancedTableHeader & IEnhancedTablePage> {
  constructor(props: INetworkListProps, state: IRequiredNetworkElements & IEnhancedTableHeader & IEnhancedTablePage) {
    super(props, state);
    console.log("Props on 26: ", props);
    //initiating state
    this.state = {
      networkElements: [],
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
      networkElements,
      busy
    } = this.props;

    const { rowsPerPage, page, search } = this.state;
    const { order, orderBy } = this.state;

    console.log("my data 171:", networkElements);
    var networkElementsList: IRequiredNetworkElementExtended[];
    if (this.state.networkElements.length > 0) {
      networkElementsList = this.state.networkElements;
    } else {
      networkElementsList = networkElements;
    }

    if (this.state.search) {
      networkElementsList = networkElementsList.filter(row => {
        return row.mountId.includes(this.state.search) || row.host.includes(this.state.search);
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
            headerColumns={ columns }
          />
          <TableBody>
            { stableSort(networkElementsList, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter(searchingFor(this.state.search))
              .map(element => (
                <TableRow >
                  <TableCell>{ element.mountId }</TableCell>
                  <TableCell>{ element.connectionStatus }</TableCell>
                  <TableCell>{ element.host }</TableCell>
                  <TableCell>{ element.port.toString() }</TableCell>
                  <TableCell>{ '' }</TableCell>
                  <TableCell>{ element.username }</TableCell>
                  <TableCell>{ '*****' }</TableCell>
                  <TableCell><Mount onClickFunction={ this.mountDevice } rowElement={ element } />
                    <Unmount onClickFunction={ this.unmountDevice } rowElement={ element } />
                    <Info onClickFunction={ this.mountDevice } rowElement={ element } onHideOrDelete={ this.onHideOrDeleteNE }/> 
                  </TableCell>
                </TableRow>
              )) 
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={ 3 }
                count={ networkElementsList.length }
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

  public componentDidMount() {
    this.props.onLoadAllRequiredNetworkElements();
  }
  public onHideOrDeleteNE = (element: IRequiredNetworkElementExtended) => {
    let currentNetworkElements: IRequiredNetworkElementExtended[] = [];
    let networkElements: IRequiredNetworkElementExtended[] = [];
    if(this.state.networkElements.length > 0) {
      currentNetworkElements = this.state.networkElements;
    } else {
      currentNetworkElements = this.props.networkElements;
    }
    currentNetworkElements.forEach(ne => {
      if(ne.mountId !== element.mountId) {
        networkElements.push(ne);
      }
    });
    this.setState({networkElements: networkElements});
  }

  /**
  * Connecting the device
  */
  public mountDevice = (element: IRequiredNetworkElementExtended) => {
    console.log("Element selected to mount: ", element, this.state);
    connectNE(element);
    var networkElements: IRequiredNetworkElementExtended[];
    console.log('element in 230:', this.state.networkElements);

    if (this.state.networkElements.length > 0) {
      networkElements = this.state.networkElements.map(ne => {
        if (element.mountId === ne.mountId) {
          return element;
        } else {
          return ne;
        }
      });
    } else {
      console.log('element in 240:', this.state.networkElements);
      networkElements = this.props.networkElements.map(ne => {
        if (element.mountId === ne.mountId) {
          console.log('element:;', element);
          return element;
        } else {
          console.log('ne;', ne);
          return ne;
        }
      });

      console.log('element in 244:', networkElements);
    }

    this.setState({ networkElements: networkElements });
  };

  /**
    * unmounting the device.
    */
  public unmountDevice = (element: IRequiredNetworkElementExtended) => {
    console.log("Element selected to unmount: ", element, this.state);
    disconnectNE(element.mountId);
    console.log('came back from mounting');
    var networkElements: IRequiredNetworkElementExtended[];
    if (this.state.networkElements.length > 0) {
      networkElements = this.state.networkElements.map(ne => {
        if (element.mountId === ne.mountId) {
          return element;
        } else {
          return ne;
        }
      });
    } else {
      networkElements = this.props.networkElements.map(ne => {
        if (element.mountId === ne.mountId) {
          return element;
        } else {
          return ne;
        }
      });
    }
    this.setState({ networkElements: networkElements });
  };
}


export default RequiredNetworkElementsListComponent;