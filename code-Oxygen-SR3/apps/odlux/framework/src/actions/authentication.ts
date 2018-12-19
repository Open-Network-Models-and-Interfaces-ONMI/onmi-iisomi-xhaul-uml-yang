import { Action } from '../flux/action';

export class UpdateAuthentication extends Action {

  constructor(public bearerToken: string | null) {
    super();
  }
}