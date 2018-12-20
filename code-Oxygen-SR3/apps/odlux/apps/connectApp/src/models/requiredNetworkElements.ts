
/**
 * Adopting the stucture of database to get the network elements
 */
export interface IDataSource {
  _source: IDataConnect;
}

export interface IDataConnect {
  connect: IRequiredNetworkElement;
}

/**
* Represents data of Required Network Elements.
*/
export interface IRequiredNetworkElement {
  mountId: string;
  host: string;
  port: string;
  username: string;
  password: string;
}

export interface IRequiredNetworkElementExtended extends IRequiredNetworkElement {
  [key: string]: any;
  connectionStatus: string;
}

export interface IRequiredNetworkElements {
  networkElements: IRequiredNetworkElementExtended[],
  search: string
}

export interface IDataConnectExtended extends IDataConnect {
  connect: IRequiredNetworkElement;
  nodeId: string;
  required: boolean;
}

export interface IMountPointViewParams extends IRequiredNetworkElement {
  required: boolean;
  maintenancemode: boolean;
}

export interface IMountPointViewState {
  mountview: IMountPointViewParams;
  textMessage: string;
}

