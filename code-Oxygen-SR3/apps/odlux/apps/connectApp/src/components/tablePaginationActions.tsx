import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import { IEnhancedTablePage } from '../models/tablePagination';

const actionsStyles = (theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    paddingLeft: theme.spacing.unit,
    flexShrink: 0,
    marginLeft: theme.spacing.unit * 3,
    color: theme.palette.common.black,
  },
  text :{
    color: theme.palette.common.black,
  }
});

type PageProps = RouteComponentProps<{}> & WithStyles<typeof actionsStyles>;

export class TablePaginationActions extends React.Component<IEnhancedTablePage, PageProps> {
  constructor(props: IEnhancedTablePage) {
    super(props);
  }
  public handleFirstPageButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onChangePage(event, 0);
  };

  public handleBackButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  public handleNextButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  public handleLastPageButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={ classes.root }>
        <IconButton className={ classes.text }
          onClick={ this.handleFirstPageButtonClick }
          disabled={ page === 0 }
          aria-label="First Page"
        >
          { theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon/> }
        </IconButton>
        <IconButton  className={ classes.text }
          onClick={ this.handleBackButtonClick }
          disabled={ page === 0 }
          aria-label="Previous Page"
        >
          { theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft /> }
        </IconButton>
        <IconButton  className={ classes.text }
          onClick={ this.handleNextButtonClick }
          disabled={ page >= Math.ceil(count / rowsPerPage) - 1 }
          aria-label="Next Page"
        >
          { theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight /> }
        </IconButton>
        <IconButton  className={ classes.text }
          onClick={ this.handleLastPageButtonClick }
          disabled={ page >= Math.ceil(count / rowsPerPage) - 1 }
          aria-label="Last Page"
        >
          { theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon /> }
        </IconButton>
      </div>
    );
  }
}

const PaginationActions = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

export default PaginationActions