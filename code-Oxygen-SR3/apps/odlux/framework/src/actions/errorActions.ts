import { Action } from '../flux/action';

import { ErrorInfo } from '../models/errorInfo';
export { ErrorInfo } from '../models/errorInfo';

export class AddErrorInfoAction extends Action {

  constructor(public errorInfo: ErrorInfo) {
    super();
  }
}

export class RemoveErrorInfoAction extends Action {

  constructor(public errorInfo: ErrorInfo) {
    super();
  }
}

export class ClearErrorInfoAction extends Action {

  constructor() {
    super();
  }
}