import { IActionHandler } from '../flux/action';

import { ApplicationInfo } from '../models/applicationInfo';
import { applicationManager } from '../services/applicationManager';

export interface IApplicationRegistration {
  [name: string]: ApplicationInfo;
}

const applicationRegistrationInit: IApplicationRegistration = applicationManager.applications;

export const applicationRegistryHandler: IActionHandler<IApplicationRegistration> = (state = applicationRegistrationInit, action) => {
  return state;
};
