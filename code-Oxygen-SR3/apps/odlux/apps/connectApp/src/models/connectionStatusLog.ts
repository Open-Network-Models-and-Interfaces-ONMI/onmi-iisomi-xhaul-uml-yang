
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
  elementStatus: string;
}

export interface IConnectionStatusLogs {
  logEntries: IConnectionStatusLogExtended[];
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
