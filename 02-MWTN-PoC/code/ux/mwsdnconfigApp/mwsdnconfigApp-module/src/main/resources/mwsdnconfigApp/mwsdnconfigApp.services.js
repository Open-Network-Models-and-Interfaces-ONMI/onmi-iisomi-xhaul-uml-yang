/*
 * Copyright (c) 2016 Tech Mahindra Limited, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwsdnconfigApp/mwsdnconfigApp.module'], function(mwsdnconfigAppApp) {

var netconfTopologyPathConfig = '/restconf/config/network-topology:network-topology/topology/topology-netconf';
var netconfTopologyPathOper = '/restconf/operational/network-topology:network-topology/topology/topology-netconf';

 mwsdnconfigAppApp.register.factory('mwconfigRestAngular', function(Restangular, ENV) {
  return Restangular.withConfig(function(RestangularConfig) {
   RestangularConfig.setBaseUrl(ENV.getBaseURL("MD_SAL"));
  });
 });

 mwsdnconfigAppApp.register.factory('mwsdnconfigAppSvc', function(mwconfigRestAngular, $http) {
  var svc = {
   base: function() {
    return mwconfigRestAngular.one('restconf').one('config').one('network-topology:network-topology').one('topology').one('topology-netconf');
   }

  };

  svc.getMwNodes = function(isMwNetworkAval, successCallBack, errorCallBack) {
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathOper;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/mwnodes.json';
   }
   $http.get(requestUri).success(function(data) {
    console.log("Services::Get Nodes Successful");
    successCallBack(data);
   }).error(function(data) {
    console.log("Services::Error in Get Nodes Successful");
    errorCallBack(data);
   });
  };

  svc.getMwNodesFullConfig = function(nodeName, isMwNetworkAval, successCallBack, errorCallBack) {
   var mountPointUri = "/node/" + nodeName + "/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/" + nodeName;
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathOper + mountPointUri;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/mwnodes.json';
   }
   $http.get(requestUri).success(function(data) {
    console.log("Services::Get Nodes Successful");
    successCallBack(data);
   }).error(function(data) {
    console.log("Services::Error in Get Nodes Successful");
    errorCallBack(data);
   });
  };

  svc.getMW_AirInterface_Pac = function(nodeName, lpName, isMwNetworkAval, successCallBack, errorCallBack) {
   var aiPacUri = "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/" + lpName;
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathOper + aiPacUri;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/' + nodeName + '-MW_AirInterface_Pac.json';;
   }
   $http.get(requestUri).success(function(data) {
    console.log("getMW_AirInterface_Pac Successful");
    successCallBack(data);
   }).error(function(data) {
    console.log("getMW_AirInterface_Pac Failed");
    errorCallBack(data);
   });
  };

  svc.getMW_Container_Pac = function(nodeName, lpName, isMwNetworkAval, successCallBack, errorCallBack) {
   var containerPacUri = "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Container_Pac/" + lpName;
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathOper + containerPacUri;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/' + nodeName + '-MW_Container_Pac.json';;
   }
   $http.get(requestUri).success(function(data) {
    console.log("getMW_Container_Pac Successful");
    successCallBack(data);
   }).error(function(data) {
    console.log("getMW_Container_Pac Failed");
    errorCallBack(data);
   });
  };

  svc.getMW_Structure_Pac = function(nodeName, lpName, isMwNetworkAval, successCallBack, errorCallBack) {
   var structurePacUri = "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Structure_Pac/" + lpName;
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathOper + structurePacUri;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/' + nodeName + '-MW_Structure_Pac.json';;
   }
   $http.get(requestUri).success(function(data) {
    console.log("getMW_Structure_Pac Successful");
    successCallBack(data);
   }).error(function(data) {
    console.log("getMW_Structure_Pac Failed");
    errorCallBack(data);
   });
  };

  svc.getAI = function(nodeName, lpName, isMwNetworkAval, successCallBack, errorCallBack) {
   var containerPacUri = "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/" + lpName + "/airInterfaceConfiguration";
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathOper + containerPacUri;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/' + nodeName + '-Connection.json';;
   }
   $http.get(requestUri).success(function(data) {
    console.log("getAI Successful");
    successCallBack(data, requestUri);
   }).error(function(data) {
    console.log("getAI Failed");
    errorCallBack(data, requestUri);
   });
  };



  svc.deleteAI = function(nodeName, lpName, successCallBack, errorCallBack) {
   var aiPacUri = "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/" + lpName + "/airInterfaceConfiguration";
   var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathConfig + aiPacUri ;

   $http.delete(requestUri).success(function(data) {
    console.log("Services::deleteAI Successful");
    successCallBack(data, requestUri);
   }).error(function(data) {
    console.log("Services::Error in deleteAI");
    errorCallBack(data, requestUri);
   });
  };

  svc.saveAI = function(nodeName, lpName, isMwNetworkAval, AIConfigParams, successCallBack, errorCallBack) {
   var addAI = {
    "airInterfaceConfiguration": {
     "airInterfaceName": AIConfigParams[0],
     "radioSignalId": AIConfigParams[1],
     "txFrequency": AIConfigParams[2],
     "rxFrequency": AIConfigParams[3],
     "txChannelBandwidth": AIConfigParams[4],
     "rxChannelBandwidth": AIConfigParams[5],
     "powerIsOn": AIConfigParams[6],
     "transmitterIsOn": AIConfigParams[7],
     "txPower": AIConfigParams[8],
     "adaptiveModulationIsOn": AIConfigParams[9],
     "modulationMin": AIConfigParams[10],
     "modulationMax": AIConfigParams[11],
     "xpicIsOn": AIConfigParams[12],
     "adaptiveModulationIsOnValue": AIConfigParams[13]
    }
   };

   var aiPacUri = "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/" + lpName + "/airInterfaceConfiguration";
   if (isMwNetworkAval) {
    var requestUri = mwconfigRestAngular.configuration.baseUrl + netconfTopologyPathConfig + aiPacUri;
   } else {
    var requestUri = 'src/app/mwsdnconfigApp/data/' + nodeName + '-Connection.json';;
   }


   $http.put(requestUri, addAI)
    .success(function(data) {
     successCallBack(data, requestUri);
    })
    .error(function(data) {
     errorCallBack(data, requestUri);
    });

  };

  /*
   * You can define all of your REST API interactions here.
   */

  return svc;
 });

});