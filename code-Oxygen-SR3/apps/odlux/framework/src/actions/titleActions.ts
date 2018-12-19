import { Action } from '../flux/action';

import { IconType } from '../models/iconDefinition'; 

export class SetTitleAction extends Action {
 
  constructor(public title: string, public icon?: IconType) {
    super();
  }
}