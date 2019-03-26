import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { AddErrorInfoAction } from '../../../../framework/src/actions/errorActions';

import { IAuthor } from '../models/author';
import { authorService } from '../services/authorService';

export class ApplicationBaseAction extends Action { }


export class LoadAllAuthorsAction extends ApplicationBaseAction {
  constructor() {
    super();
  }
}

// in React Action is most times a Message
export class AllAuthorsLoadedAction extends ApplicationBaseAction {
  constructor(public authors: IAuthor[] | null, public error?: string) {
    super();

  }
}

export const loadAllAuthorsAsync = (dispatch: Dispatch) => {
  dispatch(new LoadAllAuthorsAction());
  authorService.getAllAuthors().then(authors => {
    dispatch(new AllAuthorsLoadedAction(authors));
  }, error => {
    dispatch(new AllAuthorsLoadedAction(null, error));
    dispatch(new AddErrorInfoAction(error));
  });
} 

