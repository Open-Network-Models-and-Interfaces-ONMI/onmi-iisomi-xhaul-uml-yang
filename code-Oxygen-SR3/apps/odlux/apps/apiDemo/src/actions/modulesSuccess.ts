import { Action } from '../../../../framework/src/flux/action';
import { ModuleResult } from '../models/module';
export class ModulesRequestSuccess extends Action {
  constructor(public result: ModuleResult) {
    super();
  }
}
// error will be handled by the framework