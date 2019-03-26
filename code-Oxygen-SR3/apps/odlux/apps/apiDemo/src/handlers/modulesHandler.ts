import { IActionHandler } from '../../../../framework/src/flux/action';

import { ModulesRequestSuccess } from '../actions/modulesSuccess';
import { Module } from '../models/module';

export type IModules = Module[]

const modulesInit: IModules = [];

export const moduleHandler: IActionHandler<IModules> = (state = modulesInit, action) => {
  if (action instanceof ModulesRequestSuccess) {
    return action.result.modules.module;
  }

  return state;
};
