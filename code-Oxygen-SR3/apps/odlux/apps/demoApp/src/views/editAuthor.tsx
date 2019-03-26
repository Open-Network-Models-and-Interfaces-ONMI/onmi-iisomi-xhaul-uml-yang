import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type EditAuthorProps = RouteComponentProps<{ authorId: string}>;

class EditAuthorComponent extends React.Component<EditAuthorProps> {
  render(): JSX.Element {
    return (
      <div>
        <h2>Edit Author { this.props.match.params.authorId }</h2>
      </div>
    )
  }
}

export const EditAuthor = withRouter(EditAuthorComponent);
export default EditAuthor;