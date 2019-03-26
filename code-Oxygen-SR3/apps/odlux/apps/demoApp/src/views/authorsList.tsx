import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'; // means border

import connect from '../../../../framework/src/flux/connect';

import { loadAllAuthorsAsync } from '../actions/authorActions';
import { IAuthor } from '../models/author';

interface IAuthorsListProps {
  authors: IAuthor[],
  busy: boolean,
  onLoadAllAuthors: () => void
}

class AuthorsListComponent extends React.Component<RouteComponentProps & IAuthorsListProps> {
 
  render(): JSX.Element {
    const { authors, busy } = this.props;
    return (
      <Paper>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell numeric>Id</TableCell>
              <TableCell >First Name</TableCell>
              <TableCell >Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { authors.map(author => (
              <TableRow key={ author.id } onClick={ (e) => this.editAuthor(author) }>
                <TableCell>{ author.id }</TableCell>
                <TableCell>{ author.firstName }</TableCell>
                <TableCell>{ author.lastName }</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </Paper>
    );
  };

  public componentDidMount() {
    this.props.onLoadAllAuthors();
  }

  private editAuthor = (author: IAuthor) => {
    author && this.props.history.push(this.props.match.path + '/' + author.id);
  };
}

export const AuthorsList = withRouter(
  connect(
    ({ demoApp: state }) => ({
      authors: state.listAuthors.authors,
      busy: state.listAuthors.busy
    }),
    (dispatcher) => ({
      onLoadAllAuthors: () => {
        dispatcher.dispatch(loadAllAuthorsAsync)
      }
    }))(AuthorsListComponent));
export default AuthorsList;
