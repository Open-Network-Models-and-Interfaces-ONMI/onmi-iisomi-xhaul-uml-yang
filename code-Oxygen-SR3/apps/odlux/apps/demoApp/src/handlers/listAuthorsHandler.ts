import { IActionHandler } from '../../../../framework/src/flux/action';

import { IAuthor } from '../models/author';
import { LoadAllAuthorsAction, AllAuthorsLoadedAction } from '../actions/authorActions';

export interface IListAuthors {
  authors: IAuthor[];
  busy: boolean;
}

const listAuthorsInit: IListAuthors = {
  authors: [],
  busy: false
};

export const listAuthorsHandler: IActionHandler<IListAuthors> = (state = listAuthorsInit, action) => {
  if (action instanceof LoadAllAuthorsAction) {

    state = {
      ...state,
      busy: true
    };
  
  } else if (action instanceof AllAuthorsLoadedAction) {
    if (!action.error && action.authors) {
      state = {
        ...state,
        authors: action.authors,
        busy: false
      };
    } else {
      state = {
        ...state,
        busy: false
      };
    }
  }

  return state;
};