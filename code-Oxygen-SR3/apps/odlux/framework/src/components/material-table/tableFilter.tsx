
import * as React from 'react';
import { ColumnModel } from './columnModel';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';


import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';


const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
});

interface IEnhancedTableFilterComponentProps extends WithStyles<typeof styles> {
  onFilterChanged: (property: string, filterTerm: string) => void;
  filter: { [property: string]: string };
  columns: ColumnModel[];
}

class EnhancedTableFilterComponent extends React.Component<IEnhancedTableFilterComponentProps> {
  createFilterHandler = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onFilterChanged && this.props.onFilterChanged(property, event.target.value);
  };

  render() {
    const { columns, filter, classes } = this.props;
    return (
      <TableRow>
        <TableCell padding="checkbox" style={ { width: "50px" } }>
        </TableCell>
        { columns.map(col => {
          const style = col.width ? { width: col.width } : {};
          return (
            <TableCell
              key={ col.property }
              padding={ col.disablePadding ? 'none' : 'default' }
              style={ style }
            >
              { col.disableFilter ? null : <Input
                className={ classes.input }
                inputProps={ {
                  'aria-label': 'Filter',
                } }
                value={ filter[col.property] || '' }
                onChange={ this.createFilterHandler(col.property) }
              /> }
            </TableCell>
          );
        }, this) }
      </TableRow>
    );
  }
}

export const EnhancedTableFilter = withStyles(styles)(EnhancedTableFilterComponent);