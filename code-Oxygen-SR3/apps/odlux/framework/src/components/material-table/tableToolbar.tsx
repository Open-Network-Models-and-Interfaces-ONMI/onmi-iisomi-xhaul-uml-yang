import * as React from 'react';
import { ColumnModel } from './columnModel';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreIcon from '@material-ui/icons/MoreVert';
import FilterListIcon from '@material-ui/icons/FilterList';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
    display: "flex",
    flex: "auto",
    flexDirection: "row"
  },
  title: {
    flex: '0 0 auto',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

interface ITableToolbarComponentProps extends WithStyles<typeof styles> {
  numSelected: number | null;
  title?: string;
  onToggleFilter: () => void;
  onExportToCsv: () => void;
}

class TableToolbarComponent extends React.Component<ITableToolbarComponentProps, { anchorEl: EventTarget & HTMLElement | null }> {
  constructor(props: ITableToolbarComponentProps) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  private handleMenu  = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { numSelected, classes } = this.props;
    const open = !!this.state.anchorEl;

    return (
      <Toolbar className={ `${ classes.root } ${ numSelected && numSelected > 0 ? classes.highlight : '' } ` } >
        <div className={ classes.title }>
          { numSelected && numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              { numSelected } selected
          </Typography>
          ) : (
              <Typography variant="headline" id="tableTitle">
                { this.props.title || null }
              </Typography>
            ) }
        </div>
        <div className={ classes.spacer } />
        <div className={ classes.actions }>
          { numSelected && numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list" onClick={ () => { this.props.onToggleFilter && this.props.onToggleFilter() } }>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            ) }
          <Tooltip title="Actions">
            <IconButton color="inherit"
              aria-owns={ open ? 'menu-appbar' : undefined }
              aria-haspopup="true"
              onClick={ this.handleMenu } >
              <MoreIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={ this.state.anchorEl }
            anchorOrigin={ {
              vertical: 'top',
              horizontal: 'right',
            } }
            transformOrigin={ {
              vertical: 'top',
              horizontal: 'right',
            } }
            open={ open }
            onClose={ this.handleClose }
          >
            <MenuItem onClick={ this.props.onExportToCsv }>Export as CSV</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    );
  }
};

export const TableToolbar = withStyles(styles)(TableToolbarComponent);