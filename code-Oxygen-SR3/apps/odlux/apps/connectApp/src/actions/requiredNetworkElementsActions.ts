import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { AddErrorInfoAction } from '../../../../framework/src/actions/errorActions';
import { IRequiredNetworkElementExtended, IRequiredNetworkElement } from '../models/requiredNetworkElements';
import { connectService } from '../services/connectService';
import { String } from 'typescript-string-operations';

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
  connectService.insertRequiredNetworkElement(request);
}

export const deleteRequiredNetworkElement = (request: any) => {
  connectService.deleteRequiredNetworkElement(request).then(success => {
    setTimeout(() => {
      connectService.getAllRequiredNetworkElements().then(elements => {
        console.log('im here in delete req:', elements);
      });
    }, 1000);
  })
}

export const getConnectionStatus = (request: any) => {
  return connectService.getConnectionStatus(request).then((data) => {
    return data;
  });
}

export const unmountOrMountDevice = (request: any) => {
  return connectService.unmountOrMountDevice(request);
}

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

export const loadAllRequiredNetworkElementsAsync = (dispatch: Dispatch) => {
  dispatch(new LoadAllRequiredNetworkElementsAction());
  let promises: Promise<IRequiredNetworkElementExtended>[];
  connectService.getAllRequiredNetworkElements().then(elements => {
    promises = elements.map(element => {
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
    Promise.all(promises).then(function (results) {
      dispatch(new AllrequiredNetworkElementLoadedAction(results));
    });
  }, error => {
    dispatch(new AllrequiredNetworkElementLoadedAction(null, error));
    dispatch(new AddErrorInfoAction(error));
  });
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
  let xml = [
    '<node xmlns="urn:TBD:params:xml:ns:yang:network-topology">',
    '  <node-id>{0}</node-id>',
    '  <host xmlns="urn:opendaylight:netconf-node-topology">{1}</host>',
    '  <port xmlns="urn:opendaylight:netconf-node-topology">{2}</port>',
    '  <username xmlns="urn:opendaylight:netconf-node-topology">{3}</username>',
    '  <password xmlns="urn:opendaylight:netconf-node-topology">{4}</password>',
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

  let upd_xml = String.Format(xml, element.mountId, element.host, element.port, element.username, element.password);
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