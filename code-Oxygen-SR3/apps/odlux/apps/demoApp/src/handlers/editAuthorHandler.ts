import { IActionHandler } from '../../../../framework/src/flux/action';

import { IAuthor } from '../models/author';
export interface IEditAuthor {
  author: IAuthor | null;
  isDirty: boolean;
}

const editAuthorInit: IEditAuthor = {
  author: null,
  isDirty: false
};

export const editAuthorHandler: IActionHandler<IEditAuthor> = (state = editAuthorInit, action) => {
  return state;
};
