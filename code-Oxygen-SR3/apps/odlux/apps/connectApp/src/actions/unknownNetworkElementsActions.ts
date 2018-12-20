import { Action } from '../../../../framework/src/flux/action';
import { Dispatch } from '../../../../framework/src/flux/store';
import { connectService } from '../services/connectService';
import { IUnknownNetworkElementsExtended } from '../models/unknownNetworkElements';

export class ApplicationBaseAction extends Action {
}

export class LoadAllUnknownNetworkElementsAction extends ApplicationBaseAction {
  constructor() {
    super();
  }
}

export class AllUnknownNetworkElementLoadedAction extends ApplicationBaseAction {
  constructor(public Elements: IUnknownNetworkElementsExtended[] | null, public error?: string) {
    super();
  }
}

const unknown_service_base = 'http://localhost:8181/restconf/';
let unknown_service_url = {
  actualNetworkElements() {
    return 'operational/network-topology:network-topology/topology/topology-netconf';
  }
}

export const loadAllUnknownNetworkElementsAsync = (dispatch: Dispatch) => {
  dispatch(new LoadAllUnknownNetworkElementsAction());
  var url = unknown_service_base + unknown_service_url.actualNetworkElements();
  console.log("unknown elements: ", url);
  var request = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    }
  };
  connectService.getUnknownConnectionStatusNew(request).then(data => {
    let result: IUnknownNetworkElementsExtended[] = [];
    connectService.getAllRequiredNetworkElements().then(elements => {
      console.log("get all required network elements: ", elements);
      data.forEach(row => {
        let isInRequiredList: boolean = false;
        elements.forEach(element => {
          if (row['node-id'] === element._source.connect.mountId) {
            isInRequiredList = true;
          }
        });
        if (!isInRequiredList) {
          let newElement: IUnknownNetworkElementsExtended = {
            name: row['node-id'],
            host: row['netconf-node-topology:host'],
            netConfPort: row['netconf-node-topology:port'],
            coreModel: row['onfCoreModelRevision'],
            airInterface: row['onfAirInterfaceRevision'],
            unknownConnectionStatus: row['netconf-node-topology:connection-status']
          };
          result.push(newElement);
        }
      });
      console.log("Printing the result here: ", result);
      dispatch(new AllUnknownNetworkElementLoadedAction(result));
    }, error => {
      console.log(error);
      dispatch(new AllUnknownNetworkElementLoadedAction(result));
    });
  });
}