
export interface ILogSource {
  _source: IConnection;
}

export interface IConnection {
  event: IConnectionStatusLog;
}

export interface IConnectionStatusLog {
  timeStamp: string;
  objectId: string;
  type: string;
}

export interface IConnectionStatusLogExtended extends IConnectionStatusLog {
  [key: string]: any;
  elementStatus: string;
}

export interface IConnectionStatusLogs {
  logEntries: IConnectionStatusLogExtended[];
  search: string;
}