import * as angular from 'angularAMD';

const mwtnInventory = angular.module('app.mwtnInventory');

class ExtensionResult {
  public extension: [
    { "value-name": string, "value": string }
  ]
}

interface GenericGetRequest {
  url: string;
  method: "GET";
}

interface GenericPostRequest<T> {
  url: string;
  method: "POST";
  data: T
}

interface CommonService {
  genericRequest<TResult>(request: GenericGetRequest): ng.IPromise<ng.IHttpResponse<TResult>>;
  genericRequest<TRequest, TResult>(request: GenericPostRequest<TRequest>): ng.IPromise<ng.IHttpResponse<TResult>>;
  getMountPoints<TResult>(): ng.IPromise<TResult>;
}

export class InventoryService {
  constructor(private $q: ng.IQService, private $mwtnCommons: CommonService, private $mwtnDatabase, private $mwtnLog) {

  }

  /** 
   * Helperfunction to detect and convert the 'value-name-group' .
   * @param propertyName Name of the object property.
   * @param propertyValue Value of the object property.
   * @param valueName Optional: The value-name to be used instaed of the propertyName.
   * @returns A simplified property value if this is a 'value-name-group' otherwhise the propertyValue. */
  private convertValue = (propertyName: string, propertyValue: any, valueName: string = ''): any => {
    if (propertyValue && propertyValue instanceof Array && propertyValue.length == 1 && (
      valueName == null ||
      propertyValue[0]["value-name"] === propertyName ||
      propertyValue[0]["value-name"] === valueName)
    ) {
      return propertyValue[0]["value"];
    }
    return propertyValue;
  }

  /** 
   *  Converts an API object to a simplified local object.
   *  @param apiResult The API object to convert.
   *  @param valueName Optional: The value-name to be used instaed of the propertyName.
   *  @returns The simplified local object.
  */
  private convertObject = (apiResult: any, valueName: string = ''): any => {
    if (apiResult instanceof Array) {
      return apiResult.map(elm => { return this.convertObject(elm, valueName); });
    } else if (apiResult instanceof Object) {
      const keys = Object.keys(apiResult);
      let result = {};
      keys.forEach(key => {
        const value = this.convertValue(key, apiResult[key], valueName);
        result[key] = (value instanceof Object || value instanceof Array)
          ? this.convertObject(value)
          : value;
      });
      return result;
    }
    return apiResult;
  }

  /** Requests all active moint points */
  public getConnectedMountpoints(): ng.IPromise<string[]> {
    return this.$mwtnCommons.getMountPoints<{}>().then((mountpoints: {}[]) => {
      //console.log(mountpoints);
      return <string[]>mountpoints.reduce((acc: string[], cur, ind, arr) => {
        if (cur['netconf-node-topology:connection-status'] === 'connected') acc.push(cur["node-id"]);
        return acc;
      }, []);
    });
  }

  /** 
   * Requests all 'root identifiers' for the given 'node id'.
   * @param nodeId The id of the node to request the root identifiers for.
   * @returns A q.Promise containing an array of all root identifiers for the requested node id.
   * */
  public getRootIdentifiers(nodeId: string): ng.IPromise<string[]> {

    const request: GenericGetRequest = {
      url: `operational/network-topology:network-topology/topology/topology-netconf/node/${nodeId}/yang-ext:mount/core-model:network-element/extension/top-level-equipment`,
      method: "GET"
    };

    return this.$mwtnCommons.genericRequest<ExtensionResult>(request).then((result) => {
      if (result && result.status == 200 && result.data) {
        const topLevelEquipment = this.convertObject(result.data, 'top-level-equipment');
        const rootIdentifiers = topLevelEquipment && topLevelEquipment.extension && topLevelEquipment.extension.split(',');
        return rootIdentifiers && rootIdentifiers.map(identifier => identifier && identifier.trim());
      }
      return null;
    }, err => (null));
  }

  /** 
   * Requests the detail information for the given combination of 'nodeId' and 'equipmentIdentifier'.
   * @param nodeId The id of the root node.
   * @param identifier The identifier to request the details for.
   * @returns A q.Promise containing an object with all the details.
   * */
  public getEquipmentDetails(nodeId: string, identifier: string): ng.IPromise<{}> {
    const request: GenericGetRequest = {
      url: `operational/network-topology:network-topology/topology/topology-netconf/node/${nodeId}/yang-ext:mount/core-model:equipment/${identifier}`,
      method: "GET"
    };
    return this.$mwtnCommons.genericRequest<ExtensionResult>(request).then((result) => {
      if (result && result.status == 200 && result.data) {
        return this.convertObject(result.data);
      }
      return null;
    }, err => (null));
  }

  /** 
   * Requests the conditional information for the given combination of 'nodeId' and 'equipmentIdentifier'.
   * @param nodeId The id of the root node.
   * @param identifier The identifier to request the conditionals for.
   * @returns A q.Promise containing an object with all the conditional informations.
   * */
  public getEquipmentConditionals(nodeId: string, identifier: string): ng.IPromise<{}> {
    const request: GenericGetRequest = {
      url: `operational/network-topology:network-topology/topology/topology-netconf/node/${nodeId}/yang-ext:mount/onf-core-model-conditional-packages:equipment-pac/${identifier}`,
      method: "GET"
    };
    return this.$mwtnCommons.genericRequest<ExtensionResult>(request).then((result) => {
      if (result && result.status == 200 && result.data) {
        return this.convertObject(result.data);
      }
      return null;
    }, err => (null));
  }
}
mwtnInventory.service('mwtnInventoryService', ["$q", "$mwtnCommons", "$mwtnDatabase", "$mwtnLog", InventoryService]);
