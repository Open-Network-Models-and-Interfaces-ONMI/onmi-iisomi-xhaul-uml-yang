import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { AddErrorInfoAction } from '../../../../framework/src/actions/errorActions';
import { connectService } from '../services/connectService';
import { ILogSource } from '../models/connectionStatusLog';
import { DataCallback } from '../../../../framework/src/components/material-table';
import { IConnectionStatusLogExtended, IConnection, Result } from '../models/connectionStatusLog';

export class ApplicationBaseAction extends Action {
}

export class LoadConnectionStatusLogAction extends ApplicationBaseAction {
  constructor() {
    super();
  }
}

export class AllConnectionStatusLogAction extends ApplicationBaseAction {
  constructor(public Elements: ILogSource[] | null, public error?: string) {
    super();
  }
}


const url = 'http://localhost:8181/database/sdnevents_v1/eventlog/_search';

export const fetchConnectionStatusLogs: DataCallback = async (page, rowsPerPage, orderBy, order, filter) => {
  console.log("logging page: ", page, "logging rows: ", rowsPerPage, "logging orderby: ", orderBy, "logging order: ", order, "logging filter: ", filter);
  const from = rowsPerPage && page != null && !isNaN(+page)
    ? (+page) * rowsPerPage
    : null;

  const filterKeys = filter && Object.keys(filter) || [];
  console.log(filterKeys);
  const orderby = 'event.' + orderBy;

  const query = {
    ...filterKeys.length > 0 ? {
      query: {
        bool: {
          must: filterKeys.reduce((acc, cur) => {
            console.log(acc, cur, filter);
            if (acc && filter && filter[cur]) {
              acc.push({ [filter[cur].indexOf("*") > -1 || filter[cur].indexOf("?") > -1 ? "wildcard" : "prefix"]: { ['event.' + cur]: filter[cur] } });
            }
            return acc;
          }, [] as any[])
        }
      }
    } : { "query": { "match_all": {} } },
    ...rowsPerPage ? { "size": rowsPerPage } : {},
    ...from ? { "from": from } : {},
    ...orderBy && order ? { "sort": [{ [orderby]: order }] } : {},
  };

  const result = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      'Accept': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    },
    body: JSON.stringify(query),
  });

  debugger;
  console.log(result);

  if (result.ok) {
    const queryResult: Result<IConnection> = await result.json();
    let connectionStatusLogList: IConnectionStatusLogExtended[] = [];
    if (queryResult && queryResult.hits && queryResult.hits.hits) {
      connectionStatusLogList = queryResult.hits.hits.map(e => {
        var status = 'unknown';
        if (e._source.event.type === 'ObjectCreationNotificationXml') {
          status = 'connected';

        } else if (e._source.event.type === 'ObjectDeletionNotificationXml') {
          status = 'disconnected';
        }
        let newElement: IConnectionStatusLogExtended = {
          timeStamp: e._source.event.timeStamp,
          objectId: e._source.event.objectId,
          type: e._source.event.type,
          elementStatus: status
        }
        return newElement;
      });
    };

    const data = {
      page: Math.min(page || 0, queryResult.hits.total || 0 / (rowsPerPage || 1)),
      rowCount: queryResult.hits.total,
      rows: connectionStatusLogList && connectionStatusLogList.map(h => (
        { ...h }
      )) || []
    };
    console.log(data);
    return data;
  }
  return { page: 0, rowCount: 0, rows: [] };
}

// export const loadConnectionStatusLogAsync = (dispatch: Dispatch) => {
//   dispatch(new LoadConnectionStatusLogAction());
//   connectService.getConnectionStatusLog().then(Elements => {
//     dispatch(new AllConnectionStatusLogAction(Elements));
//   }, error => {
//     dispatch(new AllConnectionStatusLogAction(null, error));
//     dispatch(new AddErrorInfoAction(error));
//   });
// }
