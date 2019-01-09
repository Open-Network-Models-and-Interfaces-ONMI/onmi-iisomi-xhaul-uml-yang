
import { DataCallback } from '../components/material-table';
import { Result, HitEntry } from '../models';

type propType = string | number | null | undefined | (string | number)[];
type dataType = { [prop: string]: propType };
type resultType<TData = dataType> = { page: number, rowCount: number, rows: TData[] };

export function createSearchDataHandler<TResult extends {} = dataType>(uri: string, additionalParameters?: {}): DataCallback<(TResult & { _id: string })>;
export function createSearchDataHandler<TResult extends {} = dataType, TData = dataType>(uri: string, additionalParameters: {} | null | undefined, mapResult: (res: HitEntry<TResult>, index: number, arr: HitEntry<TResult>[]) => (TData & { _id: string }), mapRequest?: (name?: string | null) => string): DataCallback<(TData & { _id: string })> 
export function createSearchDataHandler<TResult, TData>(uri: string, additionalParameters?: {} | null | undefined, mapResult?: (res: HitEntry<TResult>, index: number, arr: HitEntry<TResult>[]) => (TData & { _id: string }), mapRequest?: (name?: string | null) => string): DataCallback<(TData & { _id: string })> {
  const url = `${ window.location.origin }/database/${uri}/_search`;
  const fetchData: DataCallback<(TData & { _id: string }) > = async (page, rowsPerPage, orderBy, order, filter) => {
    const from = rowsPerPage && page != null && !isNaN(+page)
      ? (+page) * rowsPerPage
      : null;

    const filterKeys = filter && Object.keys(filter) || [];
    
    const query = {
      ...filterKeys.length > 0 ? {
        query: {
          bool: {
            must: filterKeys.reduce((acc, cur) => {
              if (acc && filter && filter[cur]) {
                acc.push({ [filter[cur].indexOf("*") > -1 || filter[cur].indexOf("?") > -1 ? "wildcard" : "prefix"]: { [mapRequest ? mapRequest(cur) : cur]: filter[cur] } });
              }
              return acc;
            }, [] as any[])
          }
        }
      } : { "query": { "match_all": {} } },
      ...rowsPerPage ? { "size": rowsPerPage } : {},
      ...from ? { "from": from } : {},
      ...orderBy && order ? { "sort": [{ [mapRequest ? mapRequest(orderBy) : orderBy]: order }] } : {},
      ...additionalParameters ? additionalParameters : {}
    };
    const result = await fetch(url, {
      method: "POST",       // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors",      // no-cors, cors, *same-origin
      cache: "no-cache",    // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(query), // body data type must match "Content-Type" header
    });

    if (result.ok) {
      const queryResult: Result<TResult & { _id: string }> = await result.json();
      let rows: (TData & { _id: string })[] = [];

      if (queryResult && queryResult.hits && queryResult.hits.hits) {
        rows = queryResult.hits.hits.map( mapResult ? mapResult :  h => (
          { ...(h._source as any as TData), _id: h._id }
        )) || []
      }

      const data = {
        page: Math.min(page || 0, queryResult.hits.total || 0 / (rowsPerPage || 1)), rowCount: queryResult.hits.total, rows: rows
      };
      return data;
    }

    return { page: 0, rowCount: 0, rows: [] };
  };

  return fetchData;
}

