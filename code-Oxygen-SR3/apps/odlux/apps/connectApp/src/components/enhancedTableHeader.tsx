import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { IEnhancedTableHeader } from '../models/enhancedTableHeader'

class EnhancedTableHeader extends React.Component<IEnhancedTableHeader> {
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
      headerColumns
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          { headerColumns.map(column => { 
            return (
              <TableCell
                key={ column.id }
                numeric={ column.numeric }
                sortDirection={ orderBy === column.id ? order : false }
              >
                <Tooltip
                  title={ order !== undefined ? "Sort " + order : "Sort" }
                  placement={ column.numeric ? "bottom-end" : "bottom-start" }
                  enterDelay={ 300 }
                >
                  <TableSortLabel
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

export default EnhancedTableHeader;
