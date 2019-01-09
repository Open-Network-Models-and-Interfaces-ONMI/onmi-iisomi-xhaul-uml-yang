import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { TableToolbar } from './tableToolbar';
import { EnhancedTableHead } from './tableHead';
import { EnhancedTableFilter } from './tableFilter';

import { ColumnModel, ColumnType } from './columnModel';
export { ColumnModel, ColumnType } from './columnModel';

type propType = string | number | null | undefined | (string|number)[];
type dataType = { [prop: string]: propType };
type resultType<TData = dataType> = { page: number, rowCount: number, rows: TData[] };

export type DataCallback<TData = dataType> = (page?: number, rowsPerPage?: number, orderBy?: string | null, order?: 'asc' | 'desc' | null, filter?: { [property: string]: string }) =>resultType<TData> | Promise<resultType<TData>>;

function desc(a: dataType, b: dataType, orderBy: string) {
  if ((b[orderBy] || "") < (a[orderBy] || "") ) {
    return -1;
  }
  if ((b[orderBy] || "") > (a[orderBy] || "") ) {
    return 1;
  }
  return 0;
}

function stableSort(array: dataType[], cmp: (a: dataType, b: dataType) => number) {
  const stabilizedThis = array.map((el, index) => [el, index]) as [dataType, number][];
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order: 'asc' | 'desc' | null, orderBy: string) {
  return order === 'desc' ? (a: dataType, b: dataType) => desc(a, b, orderBy) : (a: dataType, b: dataType) => -desc(a, b, orderBy);
}

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

type MaterialTableComponentState = {
  order: 'asc' | 'desc';
  orderBy: string | null;
  selected: any[] | null;
  rows: {}[];
  rowCount: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  showFilter: boolean;
  filter: { [property: string]: string };
};

export type TableApi = { forceRefresh?: () => Promise<void> };

type MaterialTableComponentBaseProps = WithStyles<typeof styles> & {
  columns: ColumnModel[];
  idProperty: string | ((data: any) => React.Key);
  title?: string;
  disableSorting?: boolean;
  disableFilter?: boolean;
  onHandleClick?(event: React.MouseEvent<HTMLTableRowElement>, id: string | number): void; 
};

type MaterialTableComponentPropsWithRows = MaterialTableComponentBaseProps & { rows: {}[]; asynchronus?: boolean; };
type MaterialTableComponentPropsWithRequestData = MaterialTableComponentBaseProps & { onRequestData: DataCallback; tableApi?: TableApi; };
type MaterialTableComponentPropsWithExternalState = MaterialTableComponentBaseProps & MaterialTableComponentState & {
  onToggleFilter: () => void;
  onFilterChanged: (property: string, filterTerm: string) => void;
  onHandleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onHandleChangeRowsPerPage: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, rowsPerPage: number | null) => void;
  onHandleRequestSort: (event: React.SyntheticEvent, property: string) => void;
};

type MaterialTableComponentProps =
  MaterialTableComponentPropsWithRows |
  MaterialTableComponentPropsWithRequestData |
  MaterialTableComponentPropsWithExternalState;

function isMaterialTableComponentPropsWithRows(props: MaterialTableComponentProps): props is MaterialTableComponentPropsWithRows {
  return (props as MaterialTableComponentPropsWithRows).rows !== undefined && (props as MaterialTableComponentPropsWithRows).rows instanceof Array;
}

function isMaterialTableComponentPropsWithRequestData(props: MaterialTableComponentProps): props is MaterialTableComponentPropsWithRequestData {
  return (props as MaterialTableComponentPropsWithRequestData).onRequestData !== undefined && (props as MaterialTableComponentPropsWithRequestData).onRequestData instanceof Function;
}

function isMaterialTableComponentPropsWithRowsAndRequestData(props: MaterialTableComponentProps): props is MaterialTableComponentPropsWithExternalState {
  const propsWithExternalState = (props as MaterialTableComponentPropsWithExternalState)
  return propsWithExternalState.onFilterChanged instanceof Function &&
    propsWithExternalState.onHandleChangePage instanceof Function && 
    propsWithExternalState.onHandleChangeRowsPerPage instanceof Function &&
    propsWithExternalState.onToggleFilter instanceof Function &&
    propsWithExternalState.onHandleRequestSort instanceof Function
}

class MaterialTableComponent<TData extends {} = {}> extends React.Component<MaterialTableComponentProps, MaterialTableComponentState> {

  constructor(props: MaterialTableComponentProps) {
    super(props);

    const page = isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.page : 0;
    const rowsPerPage = isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.rowsPerPage || 10 : 10;

    this.state = {
      filter: isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.filter || {} : {},
      showFilter: isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.showFilter : false,
      loading: isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.loading : false,
      order: isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.order : 'asc',
      orderBy: isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.orderBy : null,
      selected: isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.selected : null,
      rows: isMaterialTableComponentPropsWithRows(this.props) && this.props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [],
      rowCount: isMaterialTableComponentPropsWithRows(this.props) && this.props.rows.length || 0,
      page,
      rowsPerPage,
    };

    if (isMaterialTableComponentPropsWithRequestData(this.props)) {
      this.update();
    
      if (this.props.tableApi) {
        this.props.tableApi.forceRefresh = () => this.update();
      }
    }
  }
  render(): JSX.Element {
    const { classes, columns } = this.props;
    const { rows, rowCount, order, orderBy, selected, rowsPerPage, page, showFilter, filter } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowCount - page * rowsPerPage);
    const getId = typeof this.props.idProperty === "string" ? (data: TData) => ((data as any)[this.props.idProperty as string] as string | number) : this.props.idProperty;
    const toggleFilter = isMaterialTableComponentPropsWithRowsAndRequestData(this.props) ? this.props.onToggleFilter : () => { !this.props.disableFilter && this.setState({ showFilter: !showFilter }, this.update) }
    return (
      <Paper className={ classes.root }>
        <TableToolbar numSelected={ selected && selected.length } title={ this.props.title } onExportToCsv={ this.exportToCsv }
          onToggleFilter={ toggleFilter } />
        <div className={ classes.tableWrapper }>
          <Table className={ classes.table } aria-labelledby="tableTitle">
            <EnhancedTableHead
              columns={ columns }
              numSelected={ selected && selected.length }
              order={ order }
              orderBy={ orderBy }
              onSelectAllClick={ this.handleSelectAllClick }
              onRequestSort={ this.onHandleRequestSort }
              rowCount={ rows.length }
            />
            <TableBody>
              { showFilter && <EnhancedTableFilter columns={ columns } filter={ filter } onFilterChanged={ this.onFilterChanged } /> || null }
              { rows // may need ordering here 
                .map((entry: { [key: string]: any }) => {
                  const isSelected = this.isSelected(getId(entry));
                  return (
                    <TableRow
                      hover
                      onClick={ event => this.handleClick(event, getId(entry)) }
                      role="checkbox"
                      aria-checked={ isSelected }
                      tabIndex={ -1 }
                      key={ getId(entry) }
                      selected={ isSelected }
                    >
                      <TableCell padding="checkbox" style={ { width: "50px" } }>
                        <Checkbox checked={ isSelected } />
                      </TableCell>
                      {
                        this.props.columns.map(
                          col => {
                            const style = col.width ? { width: col.width } : {};
                            return (
                              <TableCell key={ col.property } numeric={ col.type === ColumnType.numeric } style={ style }>
                                { col.type === ColumnType.custom && col.customControl
                                  ? <col.customControl rowData={ entry } />
                                  : entry[col.property]
                                }
                              </TableCell>
                            );
                          }
                        )
                      }
                    </TableRow>
                  );
                }) }
              { emptyRows > 0 && (
                <TableRow style={ { height: 49 * emptyRows } }>
                  <TableCell colSpan={ this.props.columns.length } />
                </TableRow>
              ) }
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={ [5, 10, 25] }
          component="div"
          count={ rowCount }
          rowsPerPage={ rowsPerPage }
          page={ page }
          backIconButtonProps={ {
            'aria-label': 'Previous Page',
          } }
          nextIconButtonProps={ {
            'aria-label': 'Next Page',
          } }
          onChangePage={ this.onHandleChangePage }
          onChangeRowsPerPage={ this.onHandleChangeRowsPerPage }
        />
      </Paper>
    );
  }

  static getDerivedStateFromProps(props: MaterialTableComponentProps, state: MaterialTableComponentState & { _rawRows: {}[] }): MaterialTableComponentState & { _rawRows: {}[] } {
    if (isMaterialTableComponentPropsWithRows(props) && props.asynchronus && state._rawRows !== props.rows) {
      const newState = MaterialTableComponent.updateRows(props, state);
      return {
        ...state,
        ...newState,
        _rawRows: props.rows || []
      };
    }
    return state;
  }

  private static updateRows(props: MaterialTableComponentPropsWithRows, state: MaterialTableComponentState): { rows: {}[], rowCount: number } {
    try {
      const { page, rowsPerPage, order, orderBy, filter } = state;
      let data: dataType[] = props.rows || [];
      let filtered = false;
      if (state.showFilter) {
        Object.keys(filter).forEach(prop => {
          const exp = filter[prop];
          filtered = filtered || !!exp;
          data = exp ? data.filter((val) => {
            const value = val[prop];
            return value && value.toString().indexOf(exp) > -1;
          }) : data;
        });
      }

      const rowCount = data.length;

      data = (orderBy && order
        ? stableSort(data, getSorting(order, orderBy))
        : data).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

      return {
        rows: data,
        rowCount
      };
    } catch{
      return {
        rows: [],
        rowCount: 0
      }
    }
  }

  private async update() {
    if (isMaterialTableComponentPropsWithRequestData(this.props)) {
      const response = await Promise.resolve(
        this.props.onRequestData(
          this.state.page, this.state.rowsPerPage, this.state.orderBy, this.state.order, this.state.showFilter && this.state.filter || {})
      );
      this.setState(response);
    } else {
      this.setState(MaterialTableComponent.updateRows(this.props, this.state));
    }
  }

  private onFilterChanged = (property: string, filterTerm: string) => {
    if (isMaterialTableComponentPropsWithRowsAndRequestData(this.props)) {
      this.props.onFilterChanged(property, filterTerm);
      return;
    }
    if (this.props.disableFilter) return;
    const colDefinition = this.props.columns && this.props.columns.find(col => col.property === property);
    if (colDefinition && colDefinition.disableFilter) return;

    const filter = { ...this.state.filter, [property]: filterTerm };
    this.setState({
      filter
    }, this.update);
  };

  private onHandleRequestSort = (event: React.SyntheticEvent, property: string) => {
    if (isMaterialTableComponentPropsWithRowsAndRequestData(this.props)) {
      this.props.onHandleRequestSort(event, property);
      return;
    }
    if (this.props.disableSorting) return;
    const colDefinition = this.props.columns && this.props.columns.find(col => col.property === property);
    if (colDefinition && colDefinition.disableSorting) return;

    const orderBy = this.state.orderBy === property && this.state.order === 'desc' ? null : property;
    const order = this.state.orderBy === property && this.state.order === 'asc' ? 'desc' : 'asc';
    this.setState({
      order,
      orderBy
    }, this.update);
  };

  handleSelectAllClick: () => {};
 
  private onHandleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    if (isMaterialTableComponentPropsWithRowsAndRequestData(this.props)) {
      this.props.onHandleChangePage(event, page);
      return;
    }
    this.setState({
      page
    }, this.update);
  };

  private onHandleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (isMaterialTableComponentPropsWithRowsAndRequestData(this.props)) {
      this.props.onHandleChangeRowsPerPage(event, +(event && event.target.value));
      return;
    }
    const rowsPerPage = +(event && event.target.value);
    if (rowsPerPage && rowsPerPage > 0) {
      this.setState({
        rowsPerPage
      }, this.update);
    }
  };

  private isSelected(id: string | number): boolean {
    let selected = this.state.selected || [];
    const selectedIndex = selected.indexOf(id);
    return (selectedIndex > -1);
  }

  private handleClick(event: React.MouseEvent<HTMLTableRowElement>, id: string | number): void {
    if (this.props.onHandleClick instanceof Function) {
      this.props.onHandleClick(event, id);
      return;
    }
    let selected = this.state.selected || [];
    const selectedIndex = selected.indexOf(id);
    if (selectedIndex > -1) {
      selected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1)
      ];
    } else {
      selected = [
        ...selected,
        id
      ];
    }
    this.setState({
      selected
    });
  }

  private exportToCsv = () => {
    let file;
    const data: string[] = [];
    data.push(this.props.columns.map(col => col.title || col.property).join(',')+"\r\n");
    this.state.rows && this.state.rows.forEach((row : any)=> {
      data.push(this.props.columns.map(col => row[col.property]).join(',') + "\r\n");
    });
    const properties = { type: 'text/csv' }; // Specify the file's mime-type.
    try {
      // Specify the filename using the File constructor, but ...
      file = new File(data, "export.csv", properties);
    } catch (e) {
      // ... fall back to the Blob constructor if that isn't supported.
      file = new Blob(data, properties);
    }
    const url = URL.createObjectURL(file);
    window.location.replace(url);
  }
}

export const MaterialTable = withStyles(styles)(MaterialTableComponent);
