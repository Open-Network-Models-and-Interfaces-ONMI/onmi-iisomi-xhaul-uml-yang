/*
 * Copyright (c) 2016 Tech Mahindra Limited, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwsdnconfigApp/mwsdnconfigApp.module', 'app/mwsdnconfigApp/mwsdnconfigApp.services'], function(mwsdnconfigAppApp) {

 mwsdnconfigAppApp.register.controller('mwsdnconfigAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', '$http', function($scope, $rootScope, mwsdnconfigAppSvc, $http) {

  console.log("Inside mwsdnconfigAppCtrl Controller");

  $rootScope['section_logo'] = 'src/app/mwsdnconfigApp/images/logo_mwtn_config.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

  $scope.mwsdnconfigAppInfo = {};
  $scope.isMwNetworkAval = true;


  mwsdnconfigAppSvc.getMwNodes($scope.isMwNetworkAval,
   function(data) {
    console.log("Controller is returned Success from getMwNodes");


    if ($scope.isMwNetworkAval) // Actual Data
    {
     $scope.mwElem = {};
     var arrayNwNodes = data["topology"][0]["node"];
     $scope.mwNodes = {};
     var neObjects = [];
     $scope.mwNodes = neObjects;

     for (var i in arrayNwNodes) {
      var nodeName = arrayNwNodes[i]["node-id"];
      // Assuming All devices are connected
      if (nodeName != "controller-config") {
       console.log("Node name", nodeName);
       // For Each Network Node Extract the list of network elements

       mwsdnconfigAppSvc.getMwNodesFullConfig(nodeName, $scope.isMwNetworkAval,
        function(data) {
         console.log("Successfully Read the NE data", nodeName);
         // Data contains a List of Network Elements
         for (var i in data.NetworkElement) {
          $scope.mwNodes.push(data.NetworkElement[i]);
         }

        },
        function(data) {
         console.log("Error in Reading NE data", nodeName);
        });
      }
     }

    } else // Test Data 
    {
     $scope.mwne = data;
     $scope.mwNodes = {};
     var neObjects = [];
     $scope.mwNodes = neObjects;
     $scope.mwConnNodes = {};
     var neArray = $scope.mwne;
     for (var i in neArray) {
      var neName = neArray[i].id;
      console.log("Name of Mw Network Element is:  ", neName);
      var jsonFilePath = 'src/app/mwsdnconfigApp/data/' + neName + '-Core.json';
      console.log("Path of Mw NE JSON is:  ", jsonFilePath);
      $http.get(jsonFilePath).success(function(data) {
       console.log("Successfully Read the NE data", neName);
       $scope.mwNodes.push(data.NetworkElement[i]);
      }).error(function(data) {
       console.log("Error in Reading NE data", neName);
      });
     }
    }
   },
   function(data) {
    console.log("Controller is returned Error from getMwNodes");
   }
  );



 }]);


 //Network Element Controller
 mwsdnconfigAppApp.register.controller('networkAppCtrl', ['$scope', '$rootScope', '$http', 'mwsdnconfigAppSvc', function($scope, $rootScope, $http, mwsdnconfigAppSvc) {

  console.log("Inside networkAppCtrl Controller");

 }]);

 // Termination Point Controller
 mwsdnconfigAppApp.register.controller('ltpAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', function($scope, $rootScope, mwsdnconfigAppSvc) {

  console.log("Inside ltpAppCtrl Controller");

 }]);

 // Layer Protocol Controller
 mwsdnconfigAppApp.register.controller('lpAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', function($scope, $rootScope, mwsdnconfigAppSvc) {

  console.log("Inside lpAppCtrl Controller");

 }]);

 // Air Interface Controller
 mwsdnconfigAppApp.register.controller('aiAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', '$http', function($scope, $rootScope, mwsdnconfigAppSvc, $http) {

  console.log("Inside aiAppCtrl Controller");

  //Set default values in the airinterface
  var aiFilePath = 'src/app/mwsdnconfigApp/data/airInt.json';

  console.log("Path of Mw NE AirInterface JSON is:  ", aiFilePath);
  $http.get(aiFilePath).success(function(data) {

   $scope.airInterfaceName = data[0].airInterfaceName;
   $scope.radioSignalId = data[0].radioSignalId;
   $scope.txFrequency = data[0].txFrequency;
   $scope.rxFrequency = data[0].rxFrequency;
   $scope.txChannelBandwidth = data[0].txChannelBandwidth;
   $scope.rxChannelBandwidth = data[0].rxChannelBandwidth;
   $scope.powerIsOn = data[0].powerIsOn;
   $scope.transmitterIsOn = data[0].transmitterIsOn;
   $scope.txPower = data[0].txPower;
   $scope.adaptiveModulationIsOn = data[0].adaptiveModulationIsOn;
   $scope.modulationMin = data[0].modulationMin;
   $scope.modulationMax = data[0].modulationMax;
   $scope.xpicIsOn = data[0].xpicIsOn;
   $scope.adaptiveModulationIsOnValue = data[0].adaptiveModulationIsOnValue;

   console.log("Success in Air Interface Configuration");
  }).error(function(data) {
   console.log("Error in Air Interface Configuration");
  });


  $scope.getAI = function() {
   mwsdnconfigAppSvc.getAI($scope.deviceId, $scope.layerProtocolId, $scope.isMwNetworkAval,
    function(data, requestpath) {
     $scope.airInterfaceName = data.airInterfaceConfiguration.airInterfaceName;
     $scope.radioSignalId = data.airInterfaceConfiguration.radioSignalId;
     $scope.txFrequency = data.airInterfaceConfiguration.txFrequency;
     $scope.rxFrequency = data.airInterfaceConfiguration.rxFrequency;
     $scope.txChannelBandwidth = data.airInterfaceConfiguration.txChannelBandwidth;
     $scope.rxChannelBandwidth = data.airInterfaceConfiguration.rxChannelBandwidth;
     $scope.powerIsOn = data.airInterfaceConfiguration.powerIsOn;
     $scope.transmitterIsOn = data.airInterfaceConfiguration.transmitterIsOn;
     $scope.txPower = data.airInterfaceConfiguration.txPower;
     $scope.adaptiveModulationIsOn = data.airInterfaceConfiguration.adaptiveModulationIsOn;
     $scope.modulationMin = data.airInterfaceConfiguration.modulationMin;
     $scope.modulationMax = data.airInterfaceConfiguration.modulationMax;
     $scope.xpicIsOn = data.airInterfaceConfiguration.xpicIsOn;
     $scope.adaptiveModulationIsOnValue = data.airInterfaceConfiguration.adaptiveModulationIsOnValue;
     $scope.requeststatus = "GET Request sent successfully";
     $scope.requestpath = requestpath;
    },
    function(data, requestpath) {
     $scope.requestpath = requestpath;
     $scope.requeststatus = "Error in Getting Air Interface Configuration";
     console.log("Error in Getting AI Configuration");
    });
  };

  $scope.saveAI = function() {
   $scope.AIConfigParams = [
    $scope.airInterfaceName,
    $scope.radioSignalId,
    $scope.txFrequency,
    $scope.rxFrequency,
    $scope.txChannelBandwidth,
    $scope.rxChannelBandwidth,
    $scope.powerIsOn,
    $scope.transmitterIsOn,
    $scope.txPower,
    $scope.adaptiveModulationIsOn,
    $scope.modulationMin,
    $scope.modulationMax,
    $scope.xpicIsOn,
    $scope.adaptiveModulationIsOnValue
   ];
   mwsdnconfigAppSvc.saveAI($scope.deviceId, $scope.layerProtocolId, $scope.isMwNetworkAval, $scope.AIConfigParams,
    function(data, requestpath) {
     $scope.requeststatus = "POST/PUT Request sent successfully";
     $scope.requestpath = requestpath;
     $scope.close("Success");
    },
    function(data, requestpath) {
     $scope.requeststatus = "POST/PUT Request sent failed"
     $scope.requestpath = requestpath;
     $scope.close("Failed");
    });
  };

  $scope.deleteAI = function() {
   mwsdnconfigAppSvc.deleteAI($scope.deviceId, $scope.layerProtocolId, function(data, requestpath) {
    $scope.requeststatus = "Delete Request sent successfully";
    $scope.requestpath = requestpath;
   }, function(data, requestpath) {
    $scope.requeststatus = "No Object Exist to delete";
    $scope.requestpath = requestpath;
   });
  };


 }]);

 //Controller for display Structure Configuration/Status/Capability
 mwsdnconfigAppApp.register.controller('mwStAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', '$http', function($scope, $rootScope, mwsdnconfigAppSvc, $http) {

  console.log("Inside mwStAppCtrl Controller");

  $scope.selectedDevices1 = "select";
  $scope.selectedLTPs1 = "select";
  $scope.selectedLP1 = "select";

  $scope.selectLTP1 = function(device) {
   $scope.lpListData1 = {};
   var lpObj1 = [];
   $scope.lpListData1 = lpObj1;
   $scope.structurePacDevice = device;
   for (var i = 0; i < $scope.mwNodes.length; i++) {
    if ($scope.mwNodes[i].uuid === device) {
     $scope.ltpListData1 = $scope.mwNodes[i]._ltpRefList;
     for (var i = 0; i < $scope.ltpListData1.length; i++) {
      $scope.lpList1 = $scope.ltpListData1[i]._lpList ;
      for (var k = 0; k < $scope.lpList1.length; k++) {
        if ($scope.lpList1[k].layerProtocolName == "MWS" ){
           $scope.lpListData1.push($scope.lpList1[k]);
           }            
        }
    }
    $scope.selectedLP1 = "select";
    }
   }
  };



  $scope.layeredProtocolDetails1 = function(layeredProtocolName) {
    $scope.tables = [];
    $scope.lpSPConfigData = {};
    var objConfigSP = [];
    $scope.lpSPConfigData = objConfigSP;
    $scope.lptimeSlotStatus = [];
    $scope.lpStrCapacity = {};
    var objStrCapacity = [];
    $scope.lpStrCapacity = objStrCapacity;   
   mwsdnconfigAppSvc.getMW_Structure_Pac($scope.structurePacDevice, layeredProtocolName, $scope.isMwNetworkAval,
    function(data) {
     $scope.lpSPConfigData.push(data.MW_Structure_Pac[0].structureConfiguration);
     $scope.lpStrCapacity.push(data.MW_Structure_Pac[0].structureCapability);
     $scope.lptimeSlotStatus = data.MW_Structure_Pac[0].structureStatus.timeSlotStatusList;
    },
    function(data) {
     console.error(JSON.stringify(data));
    });
  };


 }]);


 //Controller for display Container Configuration/Status/Capability
 mwsdnconfigAppApp.register.controller('mwContAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', '$http', function($scope, $rootScope, mwsdnconfigAppSvc, $http) {

  console.log("Inside mwContAppCtrl Controller");

  $scope.selectedDevices2 = "select";
  $scope.selectedLTPs2 = "select";
  $scope.selectedLP2 = "select";


  $scope.selectLTP2 = function(device) {
   $scope.lpListData2 = {};
   var objlp2 =[];
   $scope.lpListData2 = objlp2 ;
   $scope.containerPacDevice = device;
   for (var i = 0; i < $scope.mwNodes.length; i++) {
    if ($scope.mwNodes[i].uuid === device) {
     $scope.ltpListData2 = $scope.mwNodes[i]._ltpRefList;
     for (var i = 0; i < $scope.ltpListData2.length; i++) {
      $scope.lpList2 = $scope.ltpListData2[i]._lpList ;
      for (var k = 0; k < $scope.lpList2.length; k++) {
        if ($scope.lpList2[k].layerProtocolName == "ETH-CTP" ){
           $scope.lpListData2.push($scope.lpList2[k]);
           }            
        }            
     }
     $scope.selectedLP2 = "select";
    }
   }
  };


  $scope.layeredProtocolDetails2 = function(layeredProtocolName) {
    $scope.tables = [];
    $scope.lpCPConfigData = {};
    var objConfig = [];
    $scope.lpCPConfigData = objConfig;
    $scope.lptimeSlot = [];
    $scope.lplptimeSlotCol = {};
    $scope.lpContainerStatus = {};
    var objStatus = [];
    $scope.lpContainerStatus = objStatus;
    $scope.lpConCapability = []; 
   mwsdnconfigAppSvc.getMW_Container_Pac($scope.containerPacDevice, layeredProtocolName, $scope.isMwNetworkAval,
    function(data) {

     $scope.lpCPConfigData.push(data.MW_Container_Pac[0].containerConfiguration.container);
     $scope.lptimeSlot = data.MW_Container_Pac[0].containerConfiguration.timeSlotIDList;
     $scope.lptimeSlotCol = $scope.lptimeSlot;
     $scope.lpContainerStatus.push(data.MW_Container_Pac[0].containerStatus);
     $scope.lpConCapability = data.MW_Container_Pac[0].containerCapability.availableKindsOfContainerList;
    },
    function(data) {
     console.error(JSON.stringify(data));
    });
  };


 }]);


 // Controller for display Airinterface Configuration/Status/Capability
 mwsdnconfigAppApp.register.controller('mwAIFilterAppCtrl', ['$scope', '$rootScope', 'mwsdnconfigAppSvc', '$http', function($scope, $rootScope, mwsdnconfigAppSvc, $http) {

  console.log("Inside mwAIFilterAppCtrl Controller");

  $scope.selectedDevices = "select";
  $scope.selectedLTPs = "select";
  $scope.selectedLP = "select";
  angular.element('#tableID5').css('overflow-x', 'scroll');
  $scope.selectLTP = function(device) {
   $scope.lpListData = {};
   var objlp = [];
   $scope.lpListData = objlp;
   $scope.aiDevice = device;
   for (var i = 0; i < $scope.mwNodes.length; i++) {
    $scope.ltpListData = $scope.mwNodes[i]._ltpRefList;    
    if ($scope.mwNodes[i].uuid === device) {
    for (var i = 0; i < $scope.ltpListData.length; i++) {
      $scope.lpList = $scope.ltpListData[i]._lpList ;
      for (var k = 0; k < $scope.lpList.length; k++) {
        if ($scope.lpList[k].layerProtocolName == "MWPS" ){
           $scope.lpListData.push($scope.lpList[k]);
           }            
        }            
            
     }      
     $scope.selectedLP = "select";
    }
   }
  };


 
  $scope.layeredProtocolDetails = function(layeredProtocolName) {
    $scope.tables = [];
    $scope.lpAIConfigData = {};
    var configObj = [];
    $scope.lpAIConfigData = configObj;
    $scope.lpAIStatusData = {};
    var statusObj = [];
    $scope.lpAIStatusData = statusObj;
    $scope.lpAICapability = [];

   mwsdnconfigAppSvc.getMW_AirInterface_Pac($scope.aiDevice, layeredProtocolName, $scope.isMwNetworkAval,
    function(data) {
     // Get the Air Interface Configuraton
     $scope.lpAIConfigData.push(data.MW_AirInterface_Pac[0].airInterfaceConfiguration);
     // Get the Air Interface Status
     $scope.lpAIStatusData.push(data.MW_AirInterface_Pac[0].airInterfaceStatus);
     // Get the Air Interface Capability     
     $scope.lpAICapability = data.MW_AirInterface_Pac[0].airInterfaceCapabilityList;
     // Set the horizontal bar with tables
     angular.element('#tableID6').css('overflow-x', 'scroll');
     angular.element('#tableID7').css('overflow-x', 'scroll');
     angular.element('#tableID8').css('overflow-x', 'scroll');
    },
    function(data) {
     console.error(JSON.stringify(data));
    });

  };

 }]);


});