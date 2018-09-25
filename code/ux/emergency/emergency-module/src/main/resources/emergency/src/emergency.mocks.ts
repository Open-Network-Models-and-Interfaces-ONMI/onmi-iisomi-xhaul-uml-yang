export const initialize = ($httpBackend: ng.IHttpBackendService) => {
  let fabControlData = {
    "CommScope-OneCell-01": {
      "fap-control-lte": {
        "op-state": false,
        "admin-state": false,  // nur diesen zeigen, und eine Auswahl zwischen true und false einbauen
        "rf-tx-status": true,
        "fap-control-lte-gateway": {
          "s1-sig-link-port": 45,
          "sec-gw-server1": "secgwserver1",
          "sec-gw-server2": "secgwserver1",
          "sec-gw-server3": "secgwserver3",
          "s1-sig-link-server-list": [
            "10.9.50.66"
          ],
          "s1-connection-mode": "one"
        }
      }
    },
    "CommScope-OneCell-02": {
      "fap-control-lte": {
        "op-state": false,
        "admin-state": false,  // nur diesen zeigen, und eine Auswahl zwischen true und false einbauen
        "rf-tx-status": true,
        "fap-control-lte-gateway": {
          "s1-sig-link-port": 45,
          "sec-gw-server1": "secgwserver1",
          "sec-gw-server2": "secgwserver1",
          "sec-gw-server3": "secgwserver3",
          "s1-sig-link-server-list": [
            "10.9.50.66"
          ],
          "s1-connection-mode": "one"
        }
      }
    }
  };

  let barrinFactorData = {
    "CommScope-OneCell-01": {
      "lte-ran-cell-restriction": {
        "x-0005b9-mo-sig-barring-for-special-ac": "00000000", // anzeigen
        "barring-for-emergency": true,
        "x-0005b9-mo-sig-barring-factor": 95,                 // anzeigen , großer roter button macht aus der 95 eine 0 
        "cell-barred": true,
        "cell-reserved-for-operator-use": true,
        "x-0005b9-mo-sig-barring-time": 4                     // anzeigen
      }
    }, "CommScope-OneCell-02": {
      "lte-ran-cell-restriction": {
        "x-0005b9-mo-sig-barring-for-special-ac": "00000000", // anzeigen
        "barring-for-emergency": true,
        "x-0005b9-mo-sig-barring-factor": 95,                 // anzeigen , großer roter button macht aus der 95 eine 0 
        "cell-barred": true,
        "cell-reserved-for-operator-use": true,
        "x-0005b9-mo-sig-barring-time": 4                     // anzeigen
      }
    }
  };
  
  $httpBackend.whenGET(/config\/network-topology:network-topology\/topology\/topology-netconf\/node\/(.*)\/yang-ext:mount\/bbf-tr-196-2-0-3-full:fap-service\/1\/fap-control\/fap-control-lte/i, undefined, ['equipmentId'] ).respond((method, url, data, header, param) => {
    return [200, fabControlData[param.equipmentId]];
  });

  $httpBackend.whenPUT(/config\/network-topology:network-topology\/topology\/topology-netconf\/node\/(.*)\/yang-ext:mount\/bbf-tr-196-2-0-3-full:fap-service\/1\/fap-control\/fap-control-lte/i, undefined, undefined, ['equipmentId']).respond((method, url, data, header, param) => {
    fabControlData[param.equipmentId] = data; 
    return [200, fabControlData[param.equipmentId]];
  });

  $httpBackend.whenGET(/config\/network-topology:network-topology\/topology\/topology-netconf\/node\/(.*)\/yang-ext:mount\/bbf-tr-196-2-0-3-full:fap-service\/1\/cell-config\/lte\/lte-ran\/lte-ran-cell-restriction/i, undefined, ['equipmentId']).respond((method, url, data, header, param) => {
    return [200, barrinFactorData[param.equipmentId]];
  });

  $httpBackend.whenPUT(/config\/network-topology:network-topology\/topology\/topology-netconf\/node\/(.*)\/yang-ext:mount\/bbf-tr-196-2-0-3-full:fap-service\/1\/cell-config\/lte\/lte-ran\/lte-ran-cell-restriction/i, undefined, undefined, ['equipmentId']).respond((method, url, data, header, param) => {
    barrinFactorData[param.equipmentId] = data;
    return [200, barrinFactorData[param.equipmentId]];
  });

};

