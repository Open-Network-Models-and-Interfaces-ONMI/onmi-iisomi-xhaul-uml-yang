import { IDataSource, IRequiredNetworkElementExtended } from '../models/requiredNetworkElements';
import * as $ from 'jquery';
import { ILogSource } from 'models/connectionStatusLog';
import { IUnknownNetworkElementsExtended } from 'models/unknownNetworkElements';

/** 
 * Represents a web api accessor service for all Network Elements actions.
 */
class ConnectService {
  /**
    * Gets all known Required Network Elements from the backend.
    */
  public getAllRequiredNetworkElements(): Promise<IDataSource[]> {
    const base_search_url = 'http://localhost:8181/database/mwtn/required-networkelement/_search';
    let query = {
      query: {
        match: {
          required: true
        }
      }
    };
    return new Promise((resolve: (value: IDataSource[]) => void, reject: (err: any) => void) => {
      $.ajax({ method: "POST", url: base_search_url, data: JSON.stringify(query) })
        .then((data) => {
          console.log("RE data: ", data.hits.hits);
          resolve(data.hits.hits);
        }, (err) => { reject(err) });
    });

  }

  /**
    * Inserts data into the Required Network Elements backend.
    */
  public insertRequiredNetworkElement(request: IRequiredNetworkElementExtended): Promise<IRequiredNetworkElementExtended> {
    return new Promise((resolve: (value: any) => void, reject: (err: any) => void) => {
      $.ajax(request).then((success) => { 
        console.log('im in 38:',success); 
        resolve(success);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
    * Deletes data from the Required Network Elements backend.
    */
  public deleteRequiredNetworkElement(request: IRequiredNetworkElementExtended): Promise<IRequiredNetworkElementExtended> {
    return new Promise((resolve: (value: any) => void, reject: (err: any) => void) => {
      $.ajax(request).then((success) => {
        console.log('this is success: ', success);
        resolve(success);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * Gets Connection status from restConf api for the mountId.
   */
  public getConnectionStatus(request: any): Promise<any> {
    return new Promise((resolve: (value: any) => void, reject: (err: any) => void) => {
      $.ajax(request).then((success) => {
        resolve(success.node[0]['netconf-node-topology:connection-status']);
      }, (err) => { reject(err); });
    });
  }

  public unmountOrMountDevice(request: IRequiredNetworkElementExtended): Promise<IRequiredNetworkElementExtended> {
    return new Promise((resolve: (value: any) => void, reject: (err: any) => void) => {
      $.ajax(request).then((success) => { console.log('im here in unmount success:', success); });
    });
  }

  /**
    * Gets Unknown network elements from restConf api.
    */
  public getUnknownNetworkElementsList(request: any): Promise<IUnknownNetworkElementsExtended[]> {
    return new Promise((resolve: (value: any) => void, reject: (err: any) => void) => {
      $.ajax(request).then((success) => {
        console.log('getUnknown request: ', success);
        var requiredTopology = 'topology-netconf';
        var topo = success.topology.filter((topo: any) => {
          return topo['topology-id'] === requiredTopology;
        });
        console.log('what is topo: ', topo);
        if (topo.length === 0) {
          console.log('im here in unknown');
        } else if (topo[0].node) {
          console.log('im here in unknown 70.');
          var mwMountPoints = topo[0].node.filter((mountpoint: any) => {
            return mountpoint['node-id'] !== 'controller-config';
          }).map((mountpoint: any) => {
            var capId = 'netconf-node-topology:available-capabilities';
            if (mountpoint[capId] && mountpoint[capId]['available-capability']) {
              var caps = mountpoint[capId]['available-capability'].filter((cap: any) => {
                return cap.capability.includes('?revision=');
              }).map((cap: any) => {
                return {
                  module: cap.capability.split(')')[1],
                  revision: cap.capability.split('?revision=')[1].substring(0, 10)
                };
              }).sort((a: any, b: any) => {
                if (a.module < b.module) return -1;
                if (a.module > b.module) return 1;
                return 0;
              });
              mountpoint.onfCapabilities = caps;
              mountpoint.onfCoreModelRevision = caps.filter((cap: any) => {
                return cap.module === 'core-model' || cap.module === 'CoreModel-CoreNetworkModule-ObjectClasses';
              }).map((cap: any) => {
                return cap.revision;
              });
              if (mountpoint.onfCoreModelRevision.length === 1) {
                mountpoint.onfCoreModelRevision = mountpoint.onfCoreModelRevision[0];
              } else {
                console.log(' CoreModels supported by ' + mountpoint['node-id']);
              }
              mountpoint.onfAirInterfaceRevision = caps.filter((cap: any) => {
                return cap.module === 'microwave-model' || cap.module === 'MicrowaveModel-ObjectClasses-AirInterface';
              }).map((cap: any) => {
                return cap.revision;
              });
              if (mountpoint.onfAirInterfaceRevision.length === 1) {
                mountpoint.onfAirInterfaceRevision = mountpoint.onfAirInterfaceRevision[0];
              } else {
                console.log('More than 1 or no MicrowaveModel supported by ', + mountpoint['node-id']);
              }
            }
            var clusterConnectionStatus = 'netconf-node-topology:clustered-connection-status';
            if (mountpoint[clusterConnectionStatus] && mountpoint[clusterConnectionStatus]['netconf-master-node']) {
              var value = mountpoint[clusterConnectionStatus]['netconf-master-node'];
              value = value.substring(value.indexOf('@'));
              mountpoint.client = value.substring(1, value.indexOf(':'));
            } else {
              mountpoint.client = 'localhost';
            }
            return mountpoint;
          });
          resolve(mwMountPoints);
        }

        console.log('mountpoint', JSON.stringify(mwMountPoints));
        console.log("Unknownelement  request: ", mwMountPoints);
      }, (err) => { reject(err); });
    });
  }

  /**
    * Gets data from the Eventlog backend.
    */
  public getConnectionStatusLog(): Promise<ILogSource[]> {
    const base_statuslog_url = 'http://localhost:8181/database/sdnevents_v1/eventlog/_search';
    return new Promise((resolve: (value: ILogSource[]) => void, reject: (err: any) => void) => {
      $.ajax({ method: "GET", url: base_statuslog_url })
        .then((data) => { resolve(data.hits.hits); }, (err) => { reject(err) });
    });
  }
}

export const connectService = new ConnectService();
export default connectService;
