
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
  connectionStatus: string;
}

export interface IRequiredNetworkElements {
  networkElements: IRequiredNetworkElementExtended[],
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

export type Result<TSource extends {}> = {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
  hits: {
    total: number;
    max_score: number;
    hits?: (HitEntry<TSource>)[] | null;
  };
}

export type HitEntry<TSource extends {}> = {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: TSource;
}
