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

import { ColumnModel } from './columnModel';
export { ColumnModel } from './columnModel';

type propType = string | number | null | undefined | (string|number)[];
type dataType = { [prop: string]: propType };

export type DataCallback = (page?: number, rowsPerPage?: number, orderBy?: string | null, order?: 'asc' | 'desc' | null, filter?: { [property: string]: string }) => Promise<{ page: number, rowCount: number, rows: dataType[] }>;

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

interface IMaterialTableComponentProps extends WithStyles<typeof styles> {
  columns: ColumnModel[];
  rows?: {}[];
  onRequestData?: DataCallback;
  idProperty: string | ((data: any) => React.Key);
  title?: string;
  disableSorting?: boolean;
  disableFilter?: boolean;
}

interface IMaterialTableComponentState {
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
}

class MaterialTableComponent<TData extends {} = {}> extends React.Component<IMaterialTableComponentProps, IMaterialTableComponentState> {

  constructor(props: IMaterialTableComponentProps) {
    super(props);

    const page = 0;
    const rowsPerPage = 10;

    this.state = {
      filter: {},
      showFilter: false,
      loading: false,
      order: 'asc',
      orderBy: null,
      selected: null,
      rows: this.props.rows && this.props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [],
      rowCount: this.props.rows && this.props.rows.length || 0,
      page,
      rowsPerPage
    };

    if (typeof this.props.onRequestData === "function") this.update();
  }
  render(): JSX.Element {
    const { classes, columns } = this.props;
    const { rows, rowCount, order, orderBy, selected, rowsPerPage, page, showFilter, filter } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowCount - page * rowsPerPage);
    const getId = typeof this.props.idProperty === "string" ? (data: TData) => ((data as any)[this.props.idProperty as string] as string | number) : this.props.idProperty;
    return (
      <Paper className={ classes.root }>
        <TableToolbar numSelected={ selected && selected.length } title={ this.props.title } onExportToCsv={ this.exportToCsv }
                      onToggleFilter={ () => { !this.props.disableFilter && this.setState({ showFilter: !showFilter }, this.update) } } />
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
                .map((entry: any) => {
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
                              <TableCell key={ col.property } numeric={ col.numeric || false } style={ style }>
                                { entry[col.property] }
                              </TableCell>
                            )
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

  // static getDerivedStateFromProps(props: IMaterialTableComponentProps, state: IMaterialTableComponentState) : IMaterialTableComponentState {
  //    // How to behave in case of properties changes from outside ?
  //   return state;
  // }

  private async update() {
    const { page, rowsPerPage, order, orderBy, filter } = this.state;
    try {

      if (this.props.onRequestData && typeof this.props.onRequestData === "function") {
        const response = await this.props.onRequestData(page, rowsPerPage, orderBy, order, filter);
        this.setState(response);
      } else {
        let data: dataType[] = this.props.rows || [];
        let filtered = false;
        if (this.state.showFilter) {
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
    
        this.setState({
          rows: data,
          rowCount
        });
      }
    } catch (ex) {
      this.setState({
        rows: [],
        rowCount: 0
      });
    }
  }

  private onFilterChanged = (property: string, filterTerm: string) => {
    if (this.props.disableFilter) return;
    const colDefinition = this.props.columns && this.props.columns.find(col => col.property === property);
    if (colDefinition && colDefinition.disableFilter) return;

    const filter = { ...this.state.filter, [property]: filterTerm };
    this.setState({
      filter
    }, this.update);
  };

  private onHandleRequestSort = (event: React.SyntheticEvent, property: string) => {
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
    this.setState({
      page
    }, this.update);
  };

  private onHandleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
