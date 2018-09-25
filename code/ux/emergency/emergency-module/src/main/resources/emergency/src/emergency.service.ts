import * as angular from 'angularAMD';

const emergency = angular.module('app.emergency');

export type FabControlLte = {
  "fap-control-lte": {
    "op-state": boolean,
    "admin-state": boolean,  // nur diesen zeigen, und eine Auswahl zwischen true und false einbauen
    "rf-tx-status": boolean,
    "fap-control-lte-gateway": {
      "s1-sig-link-port": number,
      "sec-gw-server1": string,
      "sec-gw-server2": string,
      "sec-gw-server3": string,
      "s1-sig-link-server-list": string[],
      "s1-connection-mode": string
    }
  }
};

export type LteRanCellRestriction = {
  "lte-ran-cell-restriction": {
    "x-0005b9-mo-sig-barring-for-special-ac": string,         // anzeigen
    "barring-for-emergency": boolean,
    "x-0005b9-mo-sig-barring-factor": number,                 // anzeigen , großer roter button macht aus der 95 eine 0 
    "cell-barred": boolean,
    "cell-reserved-for-operator-use": boolean,
    "x-0005b9-mo-sig-barring-time": number                    // anzeigen
  }
};

interface GenericGetRequest {
  url: string;
  method: "GET";
}

interface GenericPostRequest<T> {
  url: string;
  method: "POST" | "PUT";
  data: T
}

interface CommonService {
  genericRequest<TResult>(request: GenericGetRequest): ng.IPromise<ng.IHttpResponse<TResult>>;
  genericRequest<TRequest, TResult>(request: GenericPostRequest<TRequest>): ng.IPromise<ng.IHttpResponse<TResult>>;
  getMountPoints<TResult>(): ng.IPromise<TResult>;
}

/** 
 * Represents the accassor service for the emegency application.
 */
export class EmergencyService {
  private credentials: ng.IPromise<string>;

  /** Initialises a new instance. */
  constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $mwtnCommons: CommonService) {

  }

  public getEquiomentIds(): ng.IPromise<string[]> {
    return this.$q.resolve([
      "CommScope-OneCell-01",
      "CommScope-OneCell-02"
    ]);
  }

  /** Internal helper for getting the fab control lte response object */
  public getFabControlLte(equipmentId: string, alias: string = '1'): ng.IPromise<FabControlLte> {
    const request: GenericGetRequest = {
      url: `config/network-topology:network-topology/topology/topology-netconf/node/${equipmentId}/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/${alias}/fap-control/fap-control-lte`,
      method: "GET"
    };
    return this.$mwtnCommons.genericRequest<FabControlLte>(request).then((result) => {
      if (result && result.status == 200 && result.data) {
        return (result.data);
      }
      return null;
    }, err => (null));
  }

  /** 
   * Get the current adminUp.adminState attribute. 
   * @params equipmentId The equipmentId.
   * @params alias The alias (default = '1').
   * @returns An angular promise with the adminState.
   */
  public getAdminUpState(equipmentId: string, alias: string = '1'): ng.IPromise<boolean> {
    return this.getFabControlLte(equipmentId, alias).then((adminUp) => {
      return (adminUp["fap-control-lte"] && adminUp["fap-control-lte"]["admin-state"]);
    });
  }

  /** 
   * Set the current adminUp.adminState attribute. 
   * @params equipmentId The equipmentId.
   * @params alias The alias (default = '1').
   * @returns An angular promise with the adminState.
   */
  public setAdminUpState(adminState: boolean, equipmentId: string, alias: string = '1'): ng.IPromise<boolean> {
    return this.getFabControlLte(equipmentId, alias).then((adminUp) => {
      // set the admin state 
      adminUp["fap-control-lte"]["admin-state"] = adminState;

      // prepair the requenst
      const request: GenericPostRequest<FabControlLte> = {
        method: "PUT",
        url: `config/network-topology:network-topology/topology/topology-netconf/node/${equipmentId}/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/${alias}/fap-control/fap-control-lte`,
        data: adminUp
      };

      // execute the request and retuen the result
      return this.$mwtnCommons.genericRequest<FabControlLte, FabControlLte>(request).then((result) => {
        if (result && result.status == 200 && result.data && result.data["fap-control-lte"]) {
          return (result.data["fap-control-lte"]["admin-state"]);
        }
        return null;
      }, err => (null));
    }, err => (null));
  }

  /** Internal helper for getting the barring factor response object */
  public getLteRanCellRestriction(equipmentId: string, alias: string = '1'): ng.IPromise<LteRanCellRestriction> {
    const request: GenericGetRequest = {
      url: `config/network-topology:network-topology/topology/topology-netconf/node/${equipmentId}/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/${alias}/cell-config/lte/lte-ran/lte-ran-cell-restriction`,
      method: "GET"
    };
    return this.$mwtnCommons.genericRequest<LteRanCellRestriction>(request).then((result) => {
      if (result && result.status == 200 && result.data) {
        return (result.data);
      }
      return null;
    }, err => (null));
  }

  /** 
   * Get the current barring factor attribute.
   * @params equipmentId The equipmentId.
   * @params alias The alias (default = '1').
   * @returns An angular promise with the x-0005b9-mo-sig-barring-factor.
   */
  public getBarringFactor(equipmentId: string, alias: string = '1'): ng.IPromise<number> {
    return this.getLteRanCellRestriction(equipmentId, alias).then((lteRanCellRestriction) => {
      return (lteRanCellRestriction["lte-ran-cell-restriction"] && lteRanCellRestriction["lte-ran-cell-restriction"]["x-0005b9-mo-sig-barring-factor"]);
    });
  }

  /** 
   * Set the berring factor attribute. 
   * @params equipmentId The equipmentId.
   * @params alias The alias (default = '1').
   * @returns An angular promise with the adminState.
   */
  public setBarringFactor(barringFactor: number, equipmentId: string, alias: string = '1'): ng.IPromise<number> {
    return this.getLteRanCellRestriction(equipmentId, alias).then((lteRanCellRestriction) => {
      // set the lteRanCellRestriction.barringFactor attribute
      lteRanCellRestriction["lte-ran-cell-restriction"]["x-0005b9-mo-sig-barring-factor"] = barringFactor;

      // prepair the requenst
      const request: GenericPostRequest<LteRanCellRestriction> = {
        method: "PUT",
        url: `config/network-topology:network-topology/topology/topology-netconf/node/${equipmentId}/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/${alias}/cell-config/lte/lte-ran/lte-ran-cell-restriction`,
        data: lteRanCellRestriction
      };

      // execute the request and retuen the result
      return this.$mwtnCommons.genericRequest<LteRanCellRestriction, LteRanCellRestriction>(request).then((result) => {
        if (result && result.status == 200 && result.data && result.data["lte-ran-cell-restriction"]) {
          return (result.data["lte-ran-cell-restriction"]["x-0005b9-mo-sig-barring-factor"]);
        }
        return null;
      }, err => (null));
    }, err => (null));
  }

}

emergency.service('emergencyService', ['$q', '$http', "$mwtnCommons", EmergencyService]);