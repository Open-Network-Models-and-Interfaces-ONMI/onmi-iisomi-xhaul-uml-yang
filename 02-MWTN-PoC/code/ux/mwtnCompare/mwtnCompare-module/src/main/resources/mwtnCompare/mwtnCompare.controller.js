/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

var modules = [ 'app/mwtnCompare/mwtnCompare.module',
    'app/mwtnCompare/mwtnCompare.services', 
    'app/mwtnCompare/mwtnCompare.directives'];

var mwtnCompareCtrl = function($scope, $rootScope, $modal, $mwtnCompare) {

  $rootScope.section_logo = 'src/app/mwtnCompare/images/logo_mwtn_compare.png';

  $scope.mwtnCompareInfo = {};
  $scope.radioSignalsIds = {};

  $scope.oneAtATime = true;
  $scope.getKeys = function(object) {
    return Object.keys(object);
  };
  $scope.getUnit = function(key) {
    if ($scope.descriptionKeys) {
      var index = $scope.descriptionKeys.indexOf(key);
      if (index === -1) {
        return '';
      }
      return $scope.descriptions[index].unit;
    }
  };
  $scope.getDescription = function(key) {
    if ($scope.descriptionKeys) {
      var index = $scope.descriptionKeys.indexOf(key);
      if (index === -1) {
        return '';
      }
      return $scope.descriptions[index].p;
    }
  };

  $scope.data = "mwtnCompare";
  var rneHash = [];
  var aneHash = [];
  $scope.unknownNetworkElements = [];
  $mwtnCompare.getRequiredNetworkElements(function(networkElements) {
    networkElements.network.networkElement.map(function(ne) {
      ne.connectionStatus = 'disconnected';      
    });
    $scope.networkName = networkElements.network.name;
    rneHash = networkElements.network.networkElement.map(function(ne) {
      return ne.name;
    });
    console.log('rne', rneHash);
    $scope.requiredNetworkElements = networkElements.network.networkElement;  
  });
  
  var getActualNetworkElements = function() {
    aneHash = [];
    if ($scope.requiredNetworkElements) {
      $scope.requiredNetworkElements.map(function(ne) {
        ne.connectionStatus = 'disconnected';
      });
    }
    $mwtnCompare.getActualNetworkElements(function(networkElements) {
      $scope.unknownNetworkElements = [];
      networkElements.topology.map(function(topology) {
        if (topology['topology-id'] === 'topology-netconf') {
          aneHash = topology.node.map(function(ne) {
            return ne['node-id'];
          });
          console.log('ane', aneHash);
          $scope.actualNetworkElements = topology.node;
        }
      });
    });
  }; 
  getActualNetworkElements();

  $scope.requiredLayerProtocols = {};
  var getActualMW_AirInterface_Pac = function(neId, lpId, callback) {
    // console.log('1', neId, lpId);
    $mwtnCompare.getActualMW_AirInterface_Pac(neId, lpId, function(pac) {
      var rs = pac.MW_AirInterface_Pac[0].airInterfaceConfiguration.radioSignalId;
      if (!$scope.radioSignalsIds[rs]) {
        console.error('Unknown RadioSignalId', neId, rs);
      } else {
        var found = false;
        $scope.radioSignalsIds[rs].actual.map(function(radioSignal){
          // console.log(neId, radioSignal.networkElement, lpId, radioSignal.layerProtocol, neId === radioSignal.layerProtocol && lpId === radioSignal.layerProtocol);
          if (neId === radioSignal.networkElement && lpId === radioSignal.layerProtocol) {found = true;}
        });
        if (!found) {
          $scope.radioSignalsIds[rs].actual.push({
            networkElement : neId,
            logicalTerminationPoint : null,
            layerProtocol : pac.MW_AirInterface_Pac[0].layerProtocol
          });
        }
        var requiredNEs = $scope.radioSignalsIds[rs].required.map(function(radioSignal){return radioSignal.networkElement;});
        var index = requiredNEs.indexOf(neId);
        var hash = [neId, $scope.radioSignalsIds[rs].required[index].layerProtocol].join('-');
        $scope.requiredLayerProtocols[hash] = pac.MW_AirInterface_Pac[0].layerProtocol;
      }
      return callback(pac);
    });
  };

  var getActualMW_Structure_Pac = function(neId, lpId) {
    $mwtnCompare.getActualMW_Structure_Pac(neId, lpId, function(pac) {
      // console.log(JSON.stringify(pac));
    });
  };

  var getActualMW_Container_Pac = function(neId, lpId) {
    $mwtnCompare.getActualMW_Container_Pac(neId, lpId, function(pac) {
      // console.log(JSON.stringify(pac));
    });
  };

  var compareNetworkElement = function(neId) {
    var aneIndex = aneHash.indexOf(neId);
    var rneIndex = rneHash.indexOf(neId);
    if (rneIndex === -1 && aneIndex > -1) {
      var name = $scope.actualNetworkElements[aneIndex]['node-id'];
      var exists = false;
      $scope.unknownNetworkElements.map(function(une) {
        if (une['node-id'] === name) {
          exists = true;
        }
      });
      if (!exists) {
        $scope.unknownNetworkElements.push($scope.actualNetworkElements[aneIndex]);
      }
    } else {
      // console.log(neId, aneIndex, rneIndex,
      // $scope.actualNetworkElements[aneIndex]['node-id'],
      // $scope.requiredNetworkElements[rneIndex].name);
      $scope.requiredNetworkElements[rneIndex].ip = $scope.actualNetworkElements[aneIndex]['netconf-node-topology:host'];
      $scope.requiredNetworkElements[rneIndex].port = $scope.actualNetworkElements[aneIndex]['netconf-node-topology:port'];
      $scope.requiredNetworkElements[rneIndex].connectionStatus = $scope.actualNetworkElements[aneIndex]['netconf-node-topology:connection-status'];
      if ($scope.requiredNetworkElements[rneIndex].connectionStatus === 'connected') {
        $mwtnCompare.getActualNetworkElement(neId, function(ne) {
          // console.log(JSON.stringify(ne.NetworkElement[0]._ltpRefList));
          ne.NetworkElement[0]._ltpRefList.map(function(ltp) {
            // console.log(JSON.stringify(ltp._lpList));
            ltp._lpList.map(function(lp) {
              switch (lp.layerProtocolName) {
              case 'MWPS':
                getActualMW_AirInterface_Pac(neId, lp.uuid, function(aMwps){});
                break;
              case 'MWS':
                getActualMW_Structure_Pac(neId, lp.uuid, function(aMws){});
                break;
              case 'ETH-CTP':
                getActualMW_Container_Pac(neId, lp.uuid, function(aMwConfig){});
                break;
              }
            });

          });
        });
      }
    }
  };

  var clearDatabase = function(neName)  {
    var keys = Object.keys($scope.radioSignalsIds);
    console.log(JSON.stringify(keys));
    keys.map(function(key){
      var index = 0;
      $scope.radioSignalsIds[key].actual.map(function(radioSignal){
        if (radioSignal.networkElement === neName) {
          $scope.radioSignalsIds[key].actual.splice(index, 1);
        }
        index = index + 1;
      });
    });
  };
  
  var registerNeForAccordionEvents = function(rne) {
    $scope.$watch(function() {
      return rne.NetworkElement.open;
    }, function(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        var index = rneHash.indexOf(rne.name);
        var status = $scope.requiredNetworkElements[index].connectionStatus;
        if (status === 'connected') {
          $mwtnCompare.getActualNetworkElement(rne.name, function(data) {
            rne.actualNetworkElementData = data;
          });
        } else {
          rne.actualNetworkElementData = undefined;
          clearDatabase(rne.name);
        }
      }
    });
  };

  var registerNeForConnectionStatusChangedEvents = function(rne) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return $scope.requiredNetworkElements[index].connectionStatus;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === 'connected') {
          $mwtnCompare.getActualNetworkElement(rne.name, function(data) {
            rne.actualNetworkElementData = data;           
          });
        } else {
          rne.actualNetworkElementData = undefined;
          clearDatabase(rne.name);
        }
      }
    });
  };

  var getCompares = function(obj, actualData) {
    var compares = [];
    var labelIds = Object.keys(obj);
    labelIds.map(function(labelId) {
      var missingActualValueLabelId = 'not connected';
      if (actualData && !actualData[labelId]) {
        missingActualValueLabelId = 'not delivered';
      }
      compares.push({
        labelId : labelId,
        requiredValue : obj[labelId],
        actualValue : actualData ? actualData[labelId] : '',
        missingActualValueLabelId : missingActualValueLabelId,
        unit : $scope.getUnit(labelId),
        description : $scope.getDescription(labelId),
        showDescriptions : false
      });
    });
    return compares;
  };

  var registerMwpsForAccordionEvents = function(rne, mwps) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return mwps.open;
    }, function(newValue, oldValue) {
      // console.log(rne.name, 'registerMwpsForAccordionEvents', newValue);
      
      if (newValue && newValue !== oldValue && $scope.requiredNetworkElements[index].connectionStatus === 'connected') {
        var hash = [ rne.name, mwps.layerProtocol ].join('-');
        var lpId = $scope.requiredLayerProtocols[hash];
        // console.log(hash, lpId);
        getActualMW_AirInterface_Pac(rne.name, lpId, function(aMwps) {
          var actualData = aMwps.MW_AirInterface_Pac[0].airInterfaceConfiguration;
          mwps.compares = getCompares(mwps.airInterfaceConfiguration, actualData);
        });
      } else {
        mwps.compares = getCompares(mwps.airInterfaceConfiguration);
      }
    });
    $scope.$watch(function() {
      return mwps.showDescriptions;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        mwps.compares.map(function(compare){
          compare.showDescriptions = newValue;
        });
      }
    });
  };

  var registerMwpsForConnectionStatusChangedEvents = function(rne, mwps) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return $scope.requiredNetworkElements[index].connectionStatus;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === 'connected') {
          //console.log(JSON.stringify(mwps));
          var hash = [rne.name, mwps.layerProtocol].join('-');
          var lpId = $scope.requiredLayerProtocols[hash];
          // console.log(hash, lpId);
          if (lpId) {
            getActualMW_AirInterface_Pac(rne.name, lpId, function(aMwps){
              var actualData = aMwps.MW_AirInterface_Pac[0].airInterfaceConfiguration;
              mwps.compares = getCompares(mwps.airInterfaceConfiguration, actualData);
            });
          }
        } else {
          mwps.compares = getCompares(mwps.airInterfaceConfiguration);
        }
      }
    });
  };

  var buildRadioSignalIds = function(referenceValues, callback) {
    referenceValues.network.networkElement.map(function(ne){
      ne.MW_AirInterface_Pac.map(function(mwpsPac){
        var radioSignalId = mwpsPac.airInterfaceConfiguration.radioSignalId;

        var radioSignal = {
            networkElement : ne.name,
            logicalTerminationPoint: null,
            layerProtocol : mwpsPac.layerProtocol
        };        
        ne.NetworkElement._ltpRefList.map(function(ltp) {
          if (ltp._lpList.uuid === mwpsPac.layerProtocol) {
            radioSignal.logicalTerminationPoint = ltp.uuid;
          }
        });        
     
        if (!$scope.radioSignalsIds[radioSignalId]) {
          $scope.radioSignalsIds[radioSignalId] = {
            required : [],
            actual : []
          };
        }
        $scope.radioSignalsIds[radioSignalId].required.push(radioSignal);
        
      });
      callback();
    });
  };
  
  $mwtnCompare
      .getReferenceValues(function(referenceValues) {
        buildRadioSignalIds(referenceValues, function(){});
        $scope.referenceValues = referenceValues;
        // console.log(JSON.stringify($scope.referenceValues.network.networkElement));
        $scope.referenceValues.network.networkElement
            .map(function(ne) {
              registerNeForAccordionEvents(ne);
              registerNeForConnectionStatusChangedEvents(ne);
              
              ne.MW_AirInterface_Pac.map(function(mwps){
                registerMwpsForAccordionEvents(ne, mwps);
                registerMwpsForConnectionStatusChangedEvents(ne, mwps);
              });

              ne.MW_Structure_Pac.map(function(mws){
                
              });
              
              ne.MW_Container_Pac.map(function(mwClient){
                
              });
              
              // add timeSlotIdList
              var mwsCount = ne.MW_Structure_Pac.length;
              ne.MW_Container_Pac
                  .map(function(pac) {
                    var length = pac.containerConfiguration.container.numberOfTimeSlotsRequired;
                    pac.containerConfiguration.timeSlotIDList = [];
                    for (var mws = 0; mws < mwsCount; mws++) {
                      var serverId = ne.MW_Structure_Pac[mws].structureConfiguration.serverID;
                      for (var timeSlot = 0; timeSlot < length / mwsCount; timeSlot++) {
                        pac.containerConfiguration.timeSlotIDList.push([
                            serverId, timeSlot + 1 ].join('.'));
                      }
                    }
                  });
            });
      });
  $mwtnCompare.getDescriptions(function(descriptions) {
    $scope.descriptions = descriptions;
    $scope.descriptionKeys = descriptions.map(function(desc) {
      return desc.id;
    });
  });

  $scope.disconnect = function(neName) {
    var index = rneHash.indexOf(neName);
    $scope.requiredNetworkElements[index].connectionStatus = 'disconnecting...';
    $mwtnCompare.disconnect(neName, function(response) {
      $scope.requiredNetworkElements[index].connectionStatus = 'disconnected';
    });
  };

  $scope.connect = function(ne) {
    var index = rneHash.indexOf(ne.name);
    $scope.requiredNetworkElements[index].connectionStatus = 'connecting...';
    $mwtnCompare.connect(ne, function(response) {
      $scope.requiredNetworkElements[index].connectionStatus = 'connected';
    });
  };

  var messages = {
    connect : {
      messageId : 'connect',
      title : 'Connect',
      description : [
          'Attention: Please be careful! Qualified user expected! ',
          'However, the "Connect" feature is not yet implemented.' ]
    },
    disconnect : {
      messageId : 'disconnect',
      title : 'Disconnect',
      description : [
          'Attention: Please be careful! Qualified user expected! ',
          'However, the "Disconnect" feature is not yet implemented.' ]
    },
    changeNetworkElementName : {
      messageId : 'changeNetworkElementName',
      title : 'Change network element name',
      description : [
          'Attention: Please be careful! Qualified user expected! ',
          'However, the "Change network element name" feature is not yet implemented.' ]
    },
    operation2Planning : {
      messageId : 'operation2Planning',
      title : 'Operation to planning',
      description : [
          'Attention: Please be careful! Qualified user expected! ',
          'However, the "Operation to planning" feature is not yet implemented.' ]
    },
    planning2Operation : {
      messageId : 'planning2Operation',
      title : 'Planning to operation',
      description : [
          'Attention: Please be careful! Qualified user expected! ',
          'The follwing values will be configured in the network element.',
          'However, the "Planning to operation" feature is not yet implemented.' ]
    }
  };
  $scope.message = function(messageId, info) {

    var modalInstance = $modal.open({
      animation : true,
      templateUrl : 'src/app/mwtnCompare/templates/message.html',
      controller : 'messageInstanceCtrl',
      resolve : {
        model : function() {
          var msg = messages[messageId];
          msg.info = info;
          return msg;
        }
      }
    });

    modalInstance.result.then(function(result) {
      console.log(result);
    }, function() {
      console.info('Message dismissed at: ' + new Date());
    });
  };

  // dlux events
  var compareNetworkElements = function() {
    if ($scope.requiredNetworkElements && $scope.actualNetworkElements) {
      $scope.actualNetworkElements.map(function(ne) {
        compareNetworkElement(ne['node-id']);
      });
    }
  };

  $scope.$watch(function() {
    return $scope.requiredNetworkElements;
  }, function(newValue, oldValue) {
    if (newValue !== oldValue) {
      compareNetworkElements();
    }
  });
  $scope.$watch(function() {
    return $scope.actualNetworkElements;
  }, function(newValue, oldValue) {
    if (newValue !== oldValue) {
      compareNetworkElements();
    }
  });

  // odl events
  // actualNetworkElements - NE added/deleted
  var listenToActualNetworkElementsNotifications = function(socketLocation) {
    try {
      var notificatinSocket = new WebSocket(socketLocation);

      notificatinSocket.onmessage = function(event) {
        setTimeout(function() {
          getActualNetworkElements();
        }, 1000);
      };
      notificatinSocket.onerror = function(error) {
        console.log("Socket error: " + error);
      };
      notificatinSocket.onopen = function(event) {
        console.log("Socket connection opened.");
      };
      notificatinSocket.onclose = function(event) {
        console.log("Socket connection closed.");
      };
    } catch (e) {
      console.error("Error when creating WebSocket" + e);
    }
  };
  var path = '/network-topology:network-topology';
  $mwtnCompare.registerForOdlEvents(path, function(socketLocation) {
    listenToActualNetworkElementsNotifications(socketLocation);
  });

};

define(modules, function(mwtnCompareApp) {

  mwtnCompareApp.register.controller('mwtnCompareCtrl', [ '$scope',
      '$rootScope', '$modal', '$mwtnCompare', mwtnCompareCtrl]);
      

  mwtnCompareApp.register.controller('messageInstanceCtrl', function($scope,
      $modalInstance, model) {

    $scope.model = model;
    $scope.ok = function() {
      $modalInstance.close('OK');
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });

});
