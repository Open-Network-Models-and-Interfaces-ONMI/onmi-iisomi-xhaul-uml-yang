import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { IEnhancedTableHeader } from '../models/enhancedTableHeader';
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const actionsStyles = (theme: Theme) => ({
  text :{
    color: theme.palette.common.black,
  }
});

type PageProps = RouteComponentProps<{classes: any}> & WithStyles<typeof actionsStyles>;

class EnhancedTableHeader extends React.Component<IEnhancedTableHeader,PageProps> {
  constructor(props: IEnhancedTableHeader) {
    super(props);
  }
  createSortHandler = (property: string) => (event: React.MouseEvent<HTMLElement>) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      order,
      orderBy,
      headerColumns,
      classes
    } = this.props;

    return (
      <TableHead className={classes.text}>
        <TableRow className={classes.text}>
          { headerColumns.map(column => { 
            return (
              <TableCell  className={classes.text}
                key={ column.id }
                numeric={ column.numeric }
                sortDirection={ orderBy === column.id ? order : false }
              >
                <Tooltip  className={classes.text}
                  title={ order !== undefined ? "Sort " + order : "Sort" }
                  placement={ column.numeric ? "bottom-end" : "bottom-start" }
                  enterDelay={ 300 }
                >
                  <TableSortLabel  className={classes.text}
                    active={ orderBy === column.id }
                    direction={ order }
                    onClick={ this.createSortHandler(column.id) }
                  >
                    { column.label }
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
           }, this) 
          }
        </TableRow>
      </TableHead>
    );
  }
}

// const EnhancedTableHeader = withStyles(actionsStyles, { withTheme: true })(
//   EnhancedTableHeaders,
// );

export default EnhancedTableHeader;
