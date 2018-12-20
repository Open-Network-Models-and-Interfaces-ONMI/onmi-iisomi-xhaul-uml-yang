import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { AddErrorInfoAction } from '../../../../framework/src/actions/errorActions';
import { connectService } from '../services/connectService';
import { ILogSource } from '../models/connectionStatusLog';

export class ApplicationBaseAction extends Action {
}

export class LoadConnectionStatusLogAction extends ApplicationBaseAction {
  constructor() {
    super();
  }
}

export class AllConnectionStatusLogAction extends ApplicationBaseAction {
  constructor(public Elements: ILogSource[] | null, public error?: string) {
    super();
  }
}

export const loadConnectionStatusLogAsync = (dispatch: Dispatch) => {
  dispatch(new LoadConnectionStatusLogAction());
  connectService.getConnectionStatusLog().then(Elements => {
    dispatch(new AllConnectionStatusLogAction(Elements));
  }, error => {
    dispatch(new AllConnectionStatusLogAction(null, error));
    dispatch(new AddErrorInfoAction(error));
  });
}
