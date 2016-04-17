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

  $scope.networkElements = {};
  
  
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
    // console.log('rne', rneHash);
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
          // console.log('ane', aneHash);
          // console.log(JSON.stringify(topology.node));
          $scope.actualNetworkElements = topology.node;
        }
      });
    });
  }; 
  getActualNetworkElements();
  
  $scope.requiredLayerProtocols = {};
  var getActualMW_AirInterface_Pac = function(neId, lpId, callback) {
    $mwtnCompare.getActualMW_AirInterface_Pac(neId, lpId, function(pac) {
      $scope.networkElements[neId].actual[lpId] = pac;
      
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
        // console.log('check555', index, hash, $scope.requiredLayerProtocols[hash]);
      }
      return callback(pac);
    });
  };

  var getActualMW_Structure_Pac = function(neId, lpId, callback) {
    $mwtnCompare.getActualMW_Structure_Pac(neId, lpId, function(pac) {
      $scope.networkElements[neId].actual[lpId] = pac;

      var index = rneHash.indexOf(neId);
      var rne = $scope.referenceValues.network.networkElement[index];
      var ane = $scope.networkElements[neId].actual[neId];
      
      extractAssociations(ane.NetworkElement[0], function(ra){
        rne.associations.actual = ra;  
        actualCombineAssociationsWithRadioSignalIds(rne, pac.MW_Structure_Pac[0]);
        // console.log('44444444444444444444444444444444444444444444');
        // console.log('Check444',  pac.MW_Structure_Pac[0].structurePlanning.radioSignalIds);
        var serachActualRsId;
        pac.MW_Structure_Pac[0].structurePlanning.radioSignalIds.map(function(id) {
          serachActualRsId = id;
        });
        // console.log('CHECK', 'MW_Structure_Pac', JSON.stringify(pac.MW_Structure_Pac.length));
        $scope.networkElements[neId].actual[neId].NetworkElement[0]._ltpRefList
            .map(function(ltp) {
              if (ltp._lpList[0].layerProtocolName === 'MWS') {
                // console.log('CHECK', ltp._lpList[0].layerProtocolName);
                // console.log('CHECK', JSON.stringify(ltp._lpList[0].uuid));
                if ($scope.networkElements[neId].actual[ltp._lpList[0].uuid] !== undefined) {
                  // console.log('CHECK', JSON.stringify($scope.networkElements[neId].actual[ltp._lpList[0].uuid]));
 //                 // console.log('CHECK', $scope.networkElements[neId].actual[ltp._lpList[0].uuid]);
                  var actualRsIds = $scope.networkElements[neId].actual[ltp._lpList[0].uuid].MW_Structure_Pac[0].structurePlanning.radioSignalIds;
                  // console.log('CHECK', 'actualRadioSignalIds', actualRsIds);
//                  mws.structurePlanning = {};
//                  mws.structurePlanning.configuredCapacity = JSON.stringify(mws.structureStatus.timeSlotStatusList.length);
//                  mws.structurePlanning.effectiveCapacity = JSON.stringify(mws.structureCapability.timeSlotCapacity  );
                  actualRsIds.map(function(rsId){
                    $scope.referenceValues.network.networkElement.map(function(refNe){
                      // console.log('CHECK', JSON.stringify(refNe.radioSignalIdHash));
                    });
                    // console.log('CHECK', rsId, JSON.stringify($scope.radioSignalIds));
                  });
                  // console.log('CHECK', 'actualRadioSignalIds', actualRsIds);
                  if (actualRsIds) {
                    actualRsIds.map(function(actualRsId){
                        if (serachActualRsId === actualRsId) {
                        // console.log('check444', actualRsId);
  
                        var index = rneHash.indexOf(neId);
                        var rne = $scope.referenceValues.network.networkElement[index];
                        
                        if ($scope.radioSignalsIds[actualRsId]) {
                          var requiredNEs = $scope.radioSignalsIds[actualRsId].required.map(function(radioSignal){return radioSignal.networkElement;});
                          // console.log('check444', JSON.stringify(requiredNEs));
                          index = requiredNEs.indexOf(neId);
                          // console.log('check4444', JSON.stringify($scope.radioSignalsIds[actualRsId].required[index].logicalTerminationPoint));
                          var hash = [neId, $scope.radioSignalsIds[actualRsId].required[index].layerProtocol].join('-');
                          // console.log('check444', JSON.stringify($scope.radioSignalsIds[actualRsId].required[index]));
                          var search = $scope.radioSignalsIds[actualRsId].required[index].logicalTerminationPoint;
                          // console.log('check444 search ', search)
                          // console.log('check444 search ', JSON.stringify(rne.radioSignalIdHash[search]));
                          var requiredRsId = rne.radioSignalIdHash[search];
                          if (requiredRsId === actualRsId) {
                            // console.log('check444 hurra');
                          } else {
                            // console.log('check444 auch gut');                        
                          }
                          
                          // find aactual mws for hash
                          // console.log('check44444 ass req', JSON.stringify(rne.associations.required));
                          // console.log('check444444', search);
                          var found;
                          for (var key in rne.associations.required) {
                            // console.log('check 4444444', key, search);
                            if (key === search) {
                              // console.log('check44', JSON.stringify(rne.associations.required[key].clients));
                              for (var mws in rne.associations.required[key].clients) {
                                // console.log('check444', mws);
                                // TODO hack
                                found = rne.associations.required[key].clients[mws].lp;
                              }
                            }
                          }
                          
                          hash = [neId, found].join('-');
                          // console.log('check444 foundhash', hash, pac.MW_Structure_Pac[0].layerProtocol, requiredRsId, actualRsId);
                          $scope.requiredLayerProtocols[hash] = pac.MW_Structure_Pac[0].layerProtocol;
                          // console.log('check4444', index, hash, $scope.requiredLayerProtocols[hash]);
                          
                        }
                      }
                    });
                  }
                }
              }
            });
        callback(pac);
      });
    });
  };

  var getActualMW_Container_Pac = function(neId, lpId, callback) {
    // console.log('eth getData');
    $mwtnCompare.getActualMW_Container_Pac(neId, lpId, function(pac) {
      // console.log('eth data received');
      $scope.networkElements[neId].actual[lpId] = pac;

      var refNeIndex = -1; 
      var index = 0;
      $scope.referenceValues.network.networkElement.map(function(refNe){
        if (refNe.name === neId) {
          refNeIndex = index;
        }
        index = index +1;
      });
      var rne = $scope.referenceValues.network.networkElement[refNeIndex];

      var actualName = pac.MW_Container_Pac[0].containerConfiguration.container.containerName.toLowerCase();
      var requiredLayerProtocol;
      
      // console.log('analyse eth', rne.MW_Container_Pac.length, actualName);
      rne.MW_Container_Pac.map(function(mwClient){
        var requiredName = mwClient.containerConfiguration.container.containerName.toLowerCase();
        // console.log('analyse eth', requiredName, actualName, requiredName === actualName);
        if (requiredName === actualName) {
          // console.log('analyse eth', JSON.stringify(mwClient.layerProtocol));
          // console.log('analyse eth', JSON.stringify(mwClient.containerConfiguration.container));
          requiredLayerProtocol = mwClient.layerProtocol;
        }
      });
      
      var hash = [neId, requiredLayerProtocol].join('-');
      $scope.requiredLayerProtocols[hash] = pac.MW_Container_Pac[0].layerProtocol;

      callback(pac);
      // console.log('analyse eth', JSON.stringify($scope.requiredLayerProtocols));
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
      if ($scope.referenceValues && $scope.requiredNetworkElements[rneIndex].connectionStatus === 'connected') {
        // console.log('yippy0', $scope.referenceValues);
        var refNeIndex = -1; 
        var index = 0;
        $scope.referenceValues.network.networkElement.map(function(refNe){
          if (refNe.name === neId) {
            refNeIndex = index;
          }
          index = index +1;
        });
        var rne = $scope.referenceValues.network.networkElement[refNeIndex];
        // console.log('yippy', rne.name);
        $mwtnCompare.getActualNetworkElement(neId, function(ne) {
          $scope.networkElements[neId].actual[neId] = ne;
          rne.actualNetworkElementData = ne;
          

          extractAssociations(ne.NetworkElement[0], function(ra){
            rne.associations.actual = ra;  
          });
          
          
          rne.NetworkElement[0].compares = getCompares(rne.NetworkElement[0], ne.NetworkElement[0]);
          
          // console.log(JSON.stringify(ne.NetworkElement[0]._ltpRefList));
          ne.NetworkElement[0]._ltpRefList.map(function(ltp) {
            
//            // console.log(JSON.stringify(ltp.uuid));
//            
//            // console.log(' - clients', JSON.stringify(ltp._clientLtpRefList[0]));
//            // console.log(' - servers', JSON.stringify(ltp._serverLtpRefList));
            ltp._lpList.map(function(lp) {
              switch (lp.layerProtocolName) {
              case 'MWPS':
                // console.log('yippy2', lp.layerProtocolName);
                getActualMW_AirInterface_Pac(neId, lp.uuid, function(aMwps){
                  //// console.log(JSON.stringify(aMwps));
//                  ne.MW_AirInterface_Pac.map(function(mwpsPac) {
//                    var radioSignalId = mwpsPac.airInterfaceConfiguration.radioSignalId;
//                    
                  rne.radioSignalIdHash[lp.uuid] = aMwps.MW_AirInterface_Pac[0].airInterfaceConfiguration.radioSignalId;
                  
                  // console.log('yippy22 ne', JSON.stringify(ne.radioSignalIdHash));
                  // console.log('yippy22 ren', JSON.stringify(rne.radioSignalIdHash));
                });
                break;
              case 'MWS':
                // console.log('yippy2', lp.layerProtocolName);
                getActualMW_Structure_Pac(neId, lp.uuid, function(aMws){
                  // console.log('yippy21', lp.layerProtocolName);
                  // console.log('yippy3', JSON.stringify(rne));
                });
                break;
              case 'ETH-CTP':
                // console.log('yippy2', lp.layerProtocolName);
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
    // console.log(JSON.stringify(keys));
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
      return rne.open;
    }, function(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        var index = rneHash.indexOf(rne.name);
        var status = $scope.requiredNetworkElements[index].connectionStatus;
        if (status === 'connected') {
          compareNetworkElement(rne.name);
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
        if (newValue === 'connected') {
          // setTimeout(function() {
            $mwtnCompare.getActualNetworkElement(rne.name, function(data) {
              $scope.networkElements[rne.name].actual[rne.name] = data;

              rne.actualNetworkElementData = data;   // TODO to be deleted         
              rne.NetworkElement[0].compares = getCompares(rne.NetworkElement[0], data.NetworkElement[0]);
            });
          // ImpI}, 10);
        } else if (newValue === 'disconnected') {
          rne.actualNetworkElementData = undefined;
          rne.NetworkElement[0].compares = getCompares(rne.NetworkElement[0]);
          clearDatabase(rne.name);
        }     
    }); 
  };

  var typeOf = function(object) {
    var firstShot = typeof object;
    if (firstShot !== 'object') {
      return firstShot;
    } 
    else if (object === null) {
      return 'null';
    }
    else if (object.constructor === [].constructor) {
      return 'array';
    }
    else if (object.constructor === {}.constructor) {
      return 'object';
    }
    else {
      return 'don\'t know';
    } 
  };
  
  var getArrayValueToString = function(array) {
    if (array === undefined) {
      return '';
    }
    if (array.length > 0 && (typeOf(array[0]) === 'object' || typeOf(array[0]) === 'array') ) {
      var converted = array.map(function(item){
        return JSON.stringify(item);
      });
      return converted.join(', ');
    } else {
      return array.join(', ');
    }
  };
  
  var getCompares = function(obj, actualData) {
    var compares = [];

    for (var labelId in obj) {
      var missingActualValueLabelId = 'not connected';
      var match = false;

      switch (labelId) {
        case 'compares':
          break;
        case 'nameList':
          var requiredName = obj[labelId][0].value;
          var actualName = '';
          if (actualData) {
            actualName = actualData[labelId][0].value;
          }
          match = ((requiredName === '' || actualName === '') || (requiredName === actualName));
          // console.log('NAME', requiredName, actualName, match);
          compares.push({
            labelId : 'NE name',
            requiredValue : requiredName,
            actualValue : actualName,
            match : match,
            missingActualValueLabelId : missingActualValueLabelId,
            unit : $scope.getUnit(labelId),
            description : $scope.getDescription(labelId),
            showDescriptions : false
          });
          break;
        case '_ltpRefList':
          var requiredLtpLength = obj[labelId].length;
          var actualLtpLength = '';
          if (actualData) {
            actualLtpLength = actualData[labelId].length;
          }
          match = ((requiredLtpLength === '' || actualLtpLength === '') || (requiredLtpLength === actualLtpLength));
          compares.push({
            labelId : 'Number of LTPs',
            requiredValue : requiredLtpLength,
            actualValue : actualLtpLength,
            match : match,
            missingActualValueLabelId : missingActualValueLabelId,
            unit : $scope.getUnit(labelId),
            description : $scope.getDescription(labelId),
            showDescriptions : false
          });
          break;
        default:
          if (labelId === 'installedCapacity') {
            missingActualValueLabelId = '<pure planning value>';
          }
          if (labelId === 'timeSlotIDList') {
            var requiredTimeSlotIDListLength = obj[labelId].length;
            var actualTimeSlotIDListLength = '';
            if (actualData) {
              actualTimeSlotIDListLength = actualData[labelId].length;
            }
            compares.push({
              labelId : 'currentNumberOfTimeSlots',
              requiredValue : requiredTimeSlotIDListLength,
              actualValue : actualTimeSlotIDListLength,
              match : true,
              missingActualValueLabelId : missingActualValueLabelId,
              unit : $scope.getUnit(labelId),
              description : $scope.getDescription(labelId),
              showDescriptions : false
            });
          }
          
          switch(typeOf(obj[labelId])) {
          case 'object':
            if (actualData) {
              var withActual = getCompares(obj[labelId], actualData[labelId]); 
              compares = compares.concat(withActual);
            } else {
              var withoutActual = getCompares(obj[labelId]); 
              compares = compares.concat(withoutActual);
            }
            break;
          case 'array':
            var requiredDataValue = getArrayValueToString(obj[labelId]);
            var actualDataValue = '';
            if (actualData) {
              actualDataValue = getArrayValueToString(actualData[labelId]);
            }
            match = ((requiredDataValue === '' || actualDataValue === '') || (requiredDataValue === actualDataValue));
            compares.push({
              labelId : labelId,
              requiredValue : requiredDataValue,
              actualValue : actualDataValue,
              match : match,
              missingActualValueLabelId : missingActualValueLabelId,
              unit : $scope.getUnit(labelId),
              description : $scope.getDescription(labelId),
              showDescriptions : false
            });
            break;
          default:
            var requiredValue = obj[labelId];
            var actualValue = actualData ? actualData[labelId] : '';
//            // console.log('match');
//            // console.log('match1', requiredValue, (requiredValue === ''));
//            // console.log('match2', actualValue, (actualValue === ''));
//            // console.log('match3', requiredValue, actualValue, (requiredValue === actualValue));
//            // console.log('match4', (requiredValue === '' || actualValue === '') || (requiredValue === actualValue));
            match = (requiredValue === '' || actualValue === '') || (requiredValue === actualValue);
            compares.push({
              labelId : labelId,
              requiredValue : requiredValue,
              actualValue : actualValue,
              match : match,
              missingActualValueLabelId : missingActualValueLabelId,
              unit : $scope.getUnit(labelId),
              description : $scope.getDescription(labelId),
              showDescriptions : false
            });
          }
        }
    }
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
        if (lpId) {
          getActualMW_AirInterface_Pac(rne.name, lpId, function(aMwps) {
            var actualData = aMwps.MW_AirInterface_Pac[0].airInterfaceConfiguration;
            mwps.compares = getCompares(mwps.airInterfaceConfiguration, actualData);
          });
        }
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
          //// console.log(JSON.stringify(mwps));
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
  
  var registerMwsForAccordionEvents = function(rne, mws) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return mws.open;
    }, function(newValue, oldValue) {
      // console.log(rne.name, 'registerMwsForAccordionEvents', newValue);
      
      if (newValue && newValue !== oldValue && $scope.requiredNetworkElements[index].connectionStatus === 'connected') {
        var hash = [ rne.name, mws.layerProtocol ].join('-');
        var lpId = $scope.requiredLayerProtocols[hash];
        // console.log('HIER!!!', hash, lpId);
        getActualMW_Structure_Pac(rne.name, lpId, function(aMws) {
          var actualData = aMws.MW_Structure_Pac[0].structureConfiguration;
          var compareMwsConfiguration = getCompares(mws.structureConfiguration, actualData);
          var compareMwsPlanning = getCompares(mws.structurePlanning, aMws.MW_Structure_Pac[0].structurePlanning);
          // console.log('HIER!!!', JSON.stringify(aMws.MW_Structure_Pac[0].structurePlanning));
          mws.compares = compareMwsConfiguration.concat(compareMwsPlanning); 
          
        });
      } else {
        var compareMwsConfiguration = getCompares(mws.structureConfiguration);
        var compareMwsPlanning = getCompares(mws.structurePlanning);
        mws.compares = compareMwsConfiguration.concat(compareMwsPlanning); 
      }
    });
    $scope.$watch(function() {
      return mws.showDescriptions;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        mws.compares.map(function(compare){
          compare.showDescriptions = newValue; 
        });
      }
    });
  };

  var registerMwsForConnectionStatusChangedEvents = function(rne, mws) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return $scope.requiredNetworkElements[index].connectionStatus;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === 'connected') {
          var hash = [ rne.name, mws.layerProtocol ].join('-');
          var lpId = $scope.requiredLayerProtocols[hash];
          // console.log('HIER!!!', hash, lpId);
          if (lpId && lpId !== null) {
          getActualMW_Structure_Pac(rne.name, lpId, function(aMws) {
            var actualData = aMws.MW_Structure_Pac[0].structureConfiguration;
            var compareMwsConfiguration = getCompares(mws.structureConfiguration, actualData);
            var compareMwsPlanning = getCompares(mws.structurePlanning, aMws.MW_Structure_Pac[0].structurePlanning);
            // console.log('HIER!!!', JSON.stringify(aMws.MW_Structure_Pac[0].structurePlanning));
            mws.compares = compareMwsConfiguration.concat(compareMwsPlanning); 
            
          });
        }
      } else {
          var compareMwsConfiguration = getCompares(mws.structureConfiguration);
          var compareMwsPlanning = getCompares(mws.structurePlanning);
          mws.compares = compareMwsConfiguration.concat(compareMwsPlanning); 
        }
      }
    });
  };
  
  var registerMwClientForAccordionEvents = function(rne, mwClient) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return mwClient.open;
    }, function(newValue, oldValue) {
      // console.log(rne.name, 'registerMwsForAccordionEvents', newValue);
      
      if (newValue && newValue !== oldValue && $scope.requiredNetworkElements[index].connectionStatus === 'connected') {
        var hash = [ rne.name, mwClient.layerProtocol ].join('-');
        // console.log('needed eth', hash);
        var lpId = $scope.requiredLayerProtocols[hash];
        // console.log('eth', hash, lpId);
        getActualMW_Container_Pac(rne.name, lpId, function(aMwClient) {
          // console.log('eth', 'actualData??');
          var actualData = aMwClient.MW_Container_Pac[0].containerConfiguration;
          // console.log('eth', 'actualData', JSON.stringify(actualData));
          mwClient.compares = getCompares(mwClient.containerConfiguration, actualData);
        });
      } else {
        mwClient.compares = getCompares(mwClient.containerConfiguration);
      }
    });
    $scope.$watch(function() {
      return mwClient.showDescriptions;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        mwClient.compares.map(function(compare){
          compare.showDescriptions = newValue;
        });
      }
    });
  };

  var registerMwClientForConnectionStatusChangedEvents = function(rne, mwClient) {
    var index = rneHash.indexOf(rne.name);
    $scope.$watch(function() {
      return $scope.requiredNetworkElements[index].connectionStatus;
    }, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === 'connected') {
          //// console.log(JSON.stringify(mws));
          var hash = [rne.name, mwClient.layerProtocol].join('-');
          var lpId = $scope.requiredLayerProtocols[hash];
          // console.log(hash, lpId);
          if (lpId && lpId !== null) {
            getActualMW_Container_Pac(rne.name, lpId, function(aMwClient){
              var actualData = aMwClient.MW_Container_Pac[0].structureConfiguration;
              // TODO mwClient.compares = getCompares(mwClient.structureConfiguration, actualData);
            });
          }
        } else {
          // TODO mwClient.compares = getCompares(mwClient.structureConfiguration);
        }
      }
    });
  };
  
   var getLayerProtocol = function(ne, search) {
    var result = 'notFound!';
    ne._ltpRefList.map(function(ltp){
      if (ltp.uuid === search) {
        result = ltp._lpList[0].uuid;
        var hash = [ne.uuid, result].join('-');
        // TODO look for actualLP $scope.requiredLayerProtocols[hash] = 'null';
      }
    }); 
    return result;
  };

  
  var getRadioSignalId = function(neId, lpId) {
    return [neId, lpId].join('-');
  };
  
  var extractAssociations = function(ne, callback) {
    var tree = {};
    ne._ltpRefList.map(function(ltp){
      if (ltp._lpList[0].layerProtocolName === 'MWS') {
        tree[ltp._serverLtpRefList[0]] = {
            radioSignalId: getRadioSignalId(ne.uuid, getLayerProtocol(ne, ltp._serverLtpRefList[0])),
            lp: getLayerProtocol(ne, ltp._serverLtpRefList[0]),
            clients : {}
        };
        tree[ltp._serverLtpRefList[0]].clients[ltp.uuid] = {
            lp: getLayerProtocol(ne, ltp.uuid),
            clients : {}
        };
        tree[ltp._serverLtpRefList[0]].clients[ltp.uuid].clients[ltp._clientLtpRefList[0]] = {
            lp:getLayerProtocol(ne, ltp._clientLtpRefList[0])
        };
       }
    });
    callback(tree);
  };

  var actualCombineAssociationsWithRadioSignalIds = function(ne, mws){
    var mwpsList = [];
    for (var mwps in ne.associations.actual) {
      for (var mwpsMws in ne.associations.actual[mwps].clients) {
        if (ne.associations.actual[mwps].clients[mwpsMws].lp === mws.layerProtocol) {
          // console.log('ssssssssss', mwps, JSON.stringify(ne.associations.actual[mwps].lp));
          mwpsList.push(ne.associations.actual[mwps].lp); 
        }
      }
    }
    mws.structurePlanning = {};
    mws.structurePlanning.configuredCapacity = mws.structureStatus.timeSlotStatusList.length * mws.structureCapability.timeSlotCapacity;
    
    var count = 0;
    mws.structureStatus.timeSlotStatusList.map(function(timeSlot){
      if (timeSlot.operationalStatus === 'ENABLED') {
        count = count + 1;
      }
    });
    
    mws.structurePlanning.effectiveCapacity = count * mws.structureCapability.timeSlotCapacity;
    
    mws.structurePlanning.radioSignalIds = [];
    mwpsList.map(function(mwpsItem){
      mws.structurePlanning.radioSignalIds.push(ne.radioSignalIdHash[mwpsItem]);
    });
    // console.log('CHECK111', JSON.stringify(mwpsList));
    // console.log('CHECK111', JSON.stringify(ne.associations.actual));
    // console.log('CHECK111', JSON.stringify(ne.radioSignalIdHash));
    // console.log('CHECK111', JSON.stringify(mws.structurePlanning.radioSignalIds));
  };
  
  var combineAssociationsWithRadioSignalIds = function(ne, mws){
    var mwpsList = [];
    for (var mwps in ne.associations.required) {
      for (var mwpsMws in ne.associations.required[mwps].clients) {
        if (ne.associations.required[mwps].clients[mwpsMws].lp === mws.layerProtocol) {
          mwpsList.push(mwps); 
        }
      }
    }
    mws.structurePlanning.configuredCapacity = '';
    mws.structurePlanning.effectiveCapacity = '';
    mws.structurePlanning.radioSignalIds = [];
    mwpsList.map(function(mwpsItem){
      mws.structurePlanning.radioSignalIds.push(ne.radioSignalIdHash[mwpsItem]);
    });
  };
  
  var getActualRadioSignalIds = function(ne) {
  };
  
  var getRequiredRadioSignalIds = function(ne) {
    var arr = [];  
    ne.radioSignalIdHash = {};
    ne.MW_AirInterface_Pac.map(function(mwpsPac) {
        var radioSignalId = mwpsPac.airInterfaceConfiguration.radioSignalId;
        var radioSignal = {
            networkElement : ne.name,
            logicalTerminationPoint: null,
            layerProtocol : mwpsPac.layerProtocol
        };        
        ne.NetworkElement[0]._ltpRefList.map(function(ltp) {
          if (ltp._lpList[0].uuid === mwpsPac.layerProtocol) {
            radioSignal.logicalTerminationPoint = ltp.uuid;
            ne.radioSignalIdHash[ltp.uuid] = radioSignalId;
          } 
        });        
     
        // should be deleted start
        if (!$scope.radioSignalsIds[radioSignalId]) {
          $scope.radioSignalsIds[radioSignalId] = {
            required : [],
            actual : []
          };
        }
        $scope.radioSignalsIds[radioSignalId].required.push(radioSignal);
        // should be deleted end

        arr.push(radioSignalId);
      });
      extractAssociations(ne.NetworkElement[0], function(ra){
        ne.associations = {required: ra};
      });
      return arr;
  };

  $mwtnCompare
      .getReferenceValues(function(referenceValues) {
        $scope.referenceValues = referenceValues;
        // console.log(JSON.stringify($scope.referenceValues.network.networkElement));
        $scope.referenceValues.network.networkElement
            .map(function(ne) {
              $scope.networkElements[ne.name] = {required:ne, actual:{}};
              
              ne.radioSignalIds = getRequiredRadioSignalIds(ne);
              registerNeForAccordionEvents(ne);
              registerNeForConnectionStatusChangedEvents(ne);
              
              ne.MW_AirInterface_Pac.map(function(mwps){
                registerMwpsForAccordionEvents(ne, mwps);
                registerMwpsForConnectionStatusChangedEvents(ne, mwps);
              });

              ne.MW_Structure_Pac.map(function(mws){
                registerMwsForAccordionEvents(ne, mws);
                registerMwsForConnectionStatusChangedEvents(ne, mws);
                combineAssociationsWithRadioSignalIds(ne, mws);
              });
              
              ne.MW_Container_Pac.map(function(mwClient){
                registerMwClientForAccordionEvents(ne, mwClient);
                registerMwClientForConnectionStatusChangedEvents(ne, mwClient);
              });

              // add timeSlotIdList
              var mwsCount = ne.MW_Structure_Pac.length;
              ne.MW_Container_Pac
                  .map(function(pac) {
                    var length = pac.containerConfiguration.container.numberOfTimeSlotsRequired;
                    pac.containerConfiguration.timeSlotIDList = [];
                    for (var mws = 0; mws < mwsCount; mws++) {
                      var serverId = ne.MW_Structure_Pac[mws].layerProtocol;
                      for (var timeSlot = 0; timeSlot < length / mwsCount; timeSlot++) {
                        pac.containerConfiguration.timeSlotIDList.push({'structureID':serverId,'timeSlotID':timeSlot});
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
    if (index !== -1){
      $scope.requiredNetworkElements[index].connectionStatus = 'disconnecting...';
    }
    $mwtnCompare.disconnect(neName, function(response) {
      if (index !== -1){
        $scope.requiredNetworkElements[index].connectionStatus = 'disconnected';
      }
    });
  };


  $scope.connect = function(ne) {
    var index = rneHash.indexOf(ne.name);
    $scope.requiredNetworkElements[index].connectionStatus = 'connecting...';
    $mwtnCompare.connect(ne, function(status, response) {
      // IMPORTANT: Do noting and wait until the connectionStatus changes, there will be an event.;
      if (status === 'ok')
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
          var msgInfo = JSON.parse(JSON.stringify(info));
          if (msgInfo.open) {msgInfo.open = undefined;}
          if (msgInfo.compares) {msgInfo.compares = undefined;}
          msg.info = msgInfo;
          return msg;
        }
      }
    });

    modalInstance.result.then(function(result) {
      // console.log(result);
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
        console.error("Socket error: " + error);
      };
      notificatinSocket.onopen = function(event) {
        console.info("Socket connection opened.");
      };
      notificatinSocket.onclose = function(event) {
        console.info("Socket connection closed.");
      };
    } catch (e) {
      console.error("Error when creating WebSocket" + e);
    }
  };
  var path = '/network-topology:network-topology';
  $mwtnCompare.registerForOdlEvents(path, function(socketLocation) {
    listenToActualNetworkElementsNotifications(socketLocation);
  });

  // Class MwStructure
  var MwStructure = function(mwStructureJson){
    this.data = mwStructureJson;

    this.getEffectiveCapacity = function(){
      var numOfEnabledTimeSlots = 0;
      var timeSlotStatusArr = this.data.structureStatus.timeSlotStatusList;
      for(var i = 0; i < timeSlotStatusArr.length; i++){
        if (timeSlotStatusArr[i].operationalStatus == "ENABLED"){
          numOfEnabledTimeSlots++;
        }
      }
      log(LogLevelEnum.DEBUG, "Number of enabled time slots is " + numOfEnabledTimeSlots);
      return numOfEnabledTimeSlots * this.data.structureCapability.timeSlotCapacity;
    };

    this.getConfiguredCapacity = function(){
      return this.data.structureCapability.totalNumberOfTimeSlots * this.data.structureCapability.timeSlotCapacity;
    };

    this.getTimeSlotCapacity = function(){
      return this.data.structureCapability.timeSlotCapacity;
    };
  };
  
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
