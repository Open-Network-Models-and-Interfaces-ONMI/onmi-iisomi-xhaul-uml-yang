import { Action } from '../../../../framework/src/flux/action';

export class IncrementCounterAction extends Action {
    constructor (public step: number = 1) {
        super();
    }
}
