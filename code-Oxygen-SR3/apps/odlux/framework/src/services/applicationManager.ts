import { ApplicationInfo } from '../models/applicationInfo';
import { Event } from "../common/event";

/** Represents registry to manage all applications. */
class ApplicationManager {
    
  /** Stores all registerd applications.  */
  private _applications: { [key: string]: ApplicationInfo }; 
  
  /** Initializes a new instance of this class. */
  constructor() {
    this._applications = {};
    this.changed = new Event<void>(); 
  }

  /** The chaged event will fire if the registration has changed. */
  public changed: Event<void>;

  /** Registers a new application. */
  public registerApplication(applicationInfo: ApplicationInfo): void {
    this._applications[applicationInfo.name] = applicationInfo;
    this.changed.invoke();
  }

  /** Gets all registered applications. */
  public get applications() {
    return this._applications;
  }
}

/** A singleton instance of the application manager. */
export const applicationManager = new ApplicationManager();
export default applicationManager;