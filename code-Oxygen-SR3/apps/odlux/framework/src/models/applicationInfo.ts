import { ComponentType } from 'react';
import { IconType } from './iconDefinition';

import { IActionHandler } from '../flux/action';
import { Middleware } from '../flux/middleware';

/** Represents the information needed about an application to integrate. */
export class ApplicationInfo {
  /** The name of the application. */
  name: string;
  /** Optional: The title of the application, if null ot undefined the name will be used. */
  title?: string;
  /** Optional: The icon of the application for the navigation and title bar. */
  icon?: IconType;
  /** Optional: The description of the application. */
  description?: string;
  /** The root component of the application. */
  rootComponent: ComponentType;
  /** Optional: The root action handler of the application. */
  rootActionHandler?: IActionHandler<{ [key: string]: any }>; 
  /** Optional: Application speciffic middlewares. */
  middlewares?: Middleware<{ [key: string]: any }>[]; 
  /** Optional: A mapping object with the exported components. */
  exportedComponents?: { [key: string]: ComponentType }
  /** Optional: The entry to be shown in the menu. If null or undefiened the name will be used. */
  menuEntry: string;
  /** Optional: The pasth for this application. If null or undefined the name will be use as path. */
  path?: string;
}
