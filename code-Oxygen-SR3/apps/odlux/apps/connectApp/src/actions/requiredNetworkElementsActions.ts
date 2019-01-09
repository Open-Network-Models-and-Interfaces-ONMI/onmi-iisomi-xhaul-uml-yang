import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { AddErrorInfoAction } from '../../../../framework/src/actions/errorActions';
import { Result,IDataConnect, IRequiredNetworkElementExtended, IRequiredNetworkElement } from '../models/requiredNetworkElements';
import { connectService } from '../services/connectService';
import { DataCallback } from '../../../../framework/src/components/material-table';

export class ApplicationBaseAction extends Action {
}

export class LoadAllRequiredNetworkElementsAction extends ApplicationBaseAction {
  constructor() {
    super();
  }
}

export class AllrequiredNetworkElementLoadedAction extends ApplicationBaseAction {
  constructor(public Elements: IRequiredNetworkElementExtended[] | null, public error?: string) {
    super();
  }
}

export const insertRequiredNetworkElement = (request: any) => {
 return connectService.insertRequiredNetworkElement(request);
}

export const deleteRequiredNetworkElement = (request: any) => {
  return connectService.deleteRequiredNetworkElement(request);
}

export const getConnectionStatus = async (request: any) => {
  return connectService.getConnectionStatus(request).then((data) => {
    return data;
  });
}

export const unmountOrMountDevice = (request: any) => {
  return connectService.unmountOrMountDevice(request);
}

export const disconnectNE = function (nodeId: string) {
  console.log('Im here in 95:', nodeId);
  const service_base = 'http://localhost:8181/restconf/';
  var url = [service_base, service_url.unmount(nodeId)].join('');
  var request = {
    method: 'DELETE',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    }
  };
  console.log('Im here in 107:', request);
  unmountOrMountDevice(request);
};


export const connectNE = function (element: IRequiredNetworkElement) {
  console.log('Im here in 95:', element);
  let upd_xml = [
    '<node xmlns="urn:TBD:params:xml:ns:yang:network-topology">',
      `<node-id>${element.mountId}</node-id>`,
      `<host xmlns="urn:opendaylight:netconf-node-topology">${element.host}</host>`,
      `<port xmlns="urn:opendaylight:netconf-node-topology">${element.port}</port>`,
      `<username xmlns="urn:opendaylight:netconf-node-topology">${element.username}</username>`,
      `<password xmlns="urn:opendaylight:netconf-node-topology">${element.password}</password>`,
    '  <tcp-only xmlns="urn:opendaylight:netconf-node-topology">false</tcp-only>',

    '  <!-- non-mandatory fields with default values, you can safely remove these if you do not wish to override any of these values-->',
    '  <reconnect-on-changed-schema xmlns="urn:opendaylight:netconf-node-topology">false</reconnect-on-changed-schema>',
    '  <connection-timeout-millis xmlns="urn:opendaylight:netconf-node-topology">20000</connection-timeout-millis>',
    '  <max-connection-attempts xmlns="urn:opendaylight:netconf-node-topology">100</max-connection-attempts>',
    '  <between-attempts-timeout-millis xmlns="urn:opendaylight:netconf-node-topology">2000</between-attempts-timeout-millis>',
    '  <sleep-factor xmlns="urn:opendaylight:netconf-node-topology">1.5</sleep-factor>',

    '  <!-- keepalive-delay set to 0 turns off keepalives-->',
    '  <keepalive-delay xmlns="urn:opendaylight:netconf-node-topology">120</keepalive-delay>',
    '</node>'].join('');

  console.log('updated xml:', upd_xml);

  const service_base = 'http://localhost:8181/restconf/';
  var url = [service_base, service_url.mount(element.mountId)].join('');
  var request = {
    method: 'PUT',
    url: url,
    headers: {
      'Content-Type': 'application/xml',
      'Accept': 'application/xml',
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    },
    data: upd_xml
  };
  console.log('Im here in 107:', request);
  unmountOrMountDevice(request);
};

const service_base = 'http://localhost:8181/restconf/';
let service_url = {
  connectionStatus: function (neId: string) {
    return 'operational/network-topology:network-topology/topology/topology-netconf/node/' + neId;
  },
  mount: function (neId: string) {
    return 'config/network-topology:network-topology/topology/topology-netconf/node/' + neId;
  },
  unmount: function (neId: string) {
    return 'config/network-topology:network-topology/topology/topology-netconf/node/' + neId;
  },
}

export const fetchRequiredNetworkElements: DataCallback = async (page, rowsPerPage, orderBy, order, filter) => {
  console.log("logging page: ",page,"logging rows: ", rowsPerPage, "logging orderby: ",orderBy, "logging order: ",order, "logging filter: ",filter);
  const url = 'http://localhost:8181/database/mwtn/required-networkelement/_search';
  const from = rowsPerPage && page != null && !isNaN(+page)
    ? (+page) * rowsPerPage
    : null;

  const filterKeys = filter && Object.keys(filter) || [];
  console.log(filterKeys);
  const orderby = 'connect.'+ orderBy;
 
  const query = {
    ...filterKeys.length > 0 ? {
      query: {
        bool: {
          must: filterKeys.reduce((acc, cur) => {
            console.log(acc,cur,filter);
            if (acc && filter && filter[cur]) {
              acc.push({ [filter[cur].indexOf("*") > -1 || filter[cur].indexOf("?") > -1 ? "wildcard" : "prefix"]: { ['connect.'+ cur]: filter[cur] } });
            }
            return acc;
          }, [] as any[])
        }
      } 
    }: { "query": { "match": {"required": true} } },
    ...rowsPerPage ? { "size": rowsPerPage } : {} ,
    ...from ? { "from": from } : {},
    ...orderBy && order ? { "sort": [{ [orderby]: order }] } : {},
  };
  console.log(query, url)
  const result = await fetch(url, {
    method: "POST",       // *GET, POST, PUT, DELETE, etc.
    mode: "cors",      // no-cors, cors, *same-origin
    cache: "no-cache",    // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    
    body: JSON.stringify(query), // body data type must match "Content-Type" header
    
  });

  // debugger;
  // console.log(result);

  if (result.ok) {
    const queryResult: Result<IDataConnect> = await result.json();
    let promises: Promise<IRequiredNetworkElementExtended>[];
    if(queryResult && queryResult.hits  && queryResult.hits.hits) {
      promises = queryResult.hits.hits.map(element => {
        var url = service_base + service_url.connectionStatus(element._source.connect.mountId);
        var request = {
          method: 'GET',
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic YWRtaW46YWRtaW4='
          }
        };
        let newElement: IRequiredNetworkElementExtended = {
          mountId: element._source.connect.mountId,
          host: element._source.connect.host,
          port: element._source.connect.port,
          username: element._source.connect.username,
          password: element._source.connect.password,
          connectionStatus: 'disconnected'
        }
        return getConnectionStatus(request).then(data => {
          newElement.connectionStatus = data;
          return newElement;
        }, () => {
          return newElement;
        });
      });
      let elements = await Promise.all(promises);
      console.log("elements: ", elements);
      const data = {
        page: Math.min(page || 0, queryResult.hits.total || 0 / (rowsPerPage || 1)), 
        rowCount: queryResult.hits.total, 
        rows: elements && elements.map(h => (
          { ...h }
          )) || []
      };
      console.log(data);
      return data;
    }
  }

  return { page: 0, rowCount: 0, rows: [] };
};

// commented - not required after table-component is introduced
// export const loadAllRequiredNetworkElementsAsync = (dispatch: Dispatch) => {
//   dispatch(new LoadAllRequiredNetworkElementsAction());
//   let promises: Promise<IRequiredNetworkElementExtended>[];
//   connectService.getAllRequiredNetworkElements().then(elements => {
//     promises = elements.map(element => {
//       var url = service_base + service_url.connectionStatus(element._source.connect.mountId);
//       var request = {
//         method: 'GET',
//         url: url,
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': 'Basic YWRtaW46YWRtaW4='
//         }
//       };
//       let newElement: IRequiredNetworkElementExtended = {
//         mountId: element._source.connect.mountId,
//         host: element._source.connect.host,
//         port: element._source.connect.port,
//         username: element._source.connect.username,
//         password: element._source.connect.password,
//         connectionStatus: 'disconnected'
//       }
//       return getConnectionStatus(request).then(data => {
//         newElement.connectionStatus = data;
//         return newElement;
//       }, () => {
//         return newElement;
//       });
//     });
//     Promise.all(promises).then(function (results) {
//       dispatch(new AllrequiredNetworkElementLoadedAction(results));
//     });
//   }, error => {
//     dispatch(new AllrequiredNetworkElementLoadedAction(null, error));
//     dispatch(new AddErrorInfoAction(error));
//   });
// }

