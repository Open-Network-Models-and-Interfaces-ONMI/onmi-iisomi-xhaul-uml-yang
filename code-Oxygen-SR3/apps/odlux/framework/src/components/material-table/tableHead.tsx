
import * as React from 'react';
import { ColumnModel } from './columnModel';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

interface IEnhancedTableHeadComponentProps {
  numSelected: number | null;
  onRequestSort: (event: React.SyntheticEvent, property: string) => void;
  onSelectAllClick: () => void;
  order: 'asc' | 'desc';
  orderBy: string | null;
  rowCount: number;
  columns: ColumnModel[];
}

class EnhancedTableHeadComponent extends React.Component<IEnhancedTableHeadComponentProps> {
  createSortHandler = (property: string) => (event: React.SyntheticEvent) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, columns } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" style={ { width: "50px" } }>
            <Checkbox
              indeterminate={ numSelected && numSelected > 0 && numSelected < rowCount || undefined }
              checked={ numSelected === rowCount }
              onChange={ onSelectAllClick }
            />
          </TableCell>
          { columns.map(col => {
            const style = col.width ? { width: col.width } : {};
            return (
              <TableCell
                key={ col.property }
                numeric={ col.numeric || false }
                padding={ col.disablePadding ? 'none' : 'default' }
                sortDirection={ orderBy === (col.property) ? order : false }
                style={ style }
              >
                { col.disableSorting
                  ? <TableSortLabel
                    active={ false }
                    direction={ undefined }
                  >
                    { col.title || col.property }
                  </TableSortLabel>
                  : <Tooltip
                    title="Sort"
                    placement={ col.numeric ? 'bottom-end' : 'bottom-start' }
                    enterDelay={ 300 }
                  >
                    <TableSortLabel
                      active={ orderBy === col.property }
                      direction={ order || undefined }
                      onClick={ this.createSortHandler(col.property) }
                    >
                      { col.title || col.property }
                    </TableSortLabel>
                  </Tooltip> }
              </TableCell>
            );
          }, this) }
        </TableRow>
      </TableHead>
    );
  }
}

export const EnhancedTableHead = EnhancedTableHeadComponent;