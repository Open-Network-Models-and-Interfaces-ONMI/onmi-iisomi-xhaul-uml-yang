
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

export type Inventory = {
  treeLevel: number;
  parentUuid: string;
  mountpoint: string;
  uuid: string;
  containedHolder?: (string)[] | null;
  manufacturerName?: string ;
  manufacturerIdentifier: string;
  serial: string;
  date: string;
  version: string;
  description: string;
  partTypeId: string;
  modelIdentifier: string;
  typeName: string;
}
