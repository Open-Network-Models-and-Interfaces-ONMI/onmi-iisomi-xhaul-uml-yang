/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCompare/mwtnCompare.module',
        'app/mwtnCompare/mwtnCompare.services',
        'app/mwtnCommons/mwtnCommons.services', 
        'app/mwtnCompare/mwtnCompare.directives',
        'app/mwtnCommons/bower_components/angular-ui-grid/ui-grid.min'], function(mwtnCompareApp) {

  mwtnCompareApp.register.controller('mwtnCompareCtrl', ['$scope', '$rootScope', '$mwtnCompare', '$mwtnLog', 'OnfNetworkElement', 'MicrowavePhysicalSection', 'MicrowaveSection',  
                                                         function($scope, $rootScope, $mwtnCompare, $mwtnLog, OnfNetworkElement, MicrowavePhysicalSection, MicrowaveSection) {

    $rootScope['section_logo'] = 'src/app/mwtnCompare/images/mwtnCompare.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    var rOnfNe;
    var aOnfNe;
    
    $scope.status = {ne:false};
    $scope.spinner = {ne:false};
    $scope.separator = $mwtnCompare.separator; //'&nbsp;'
    $scope.connectionStatus = 'disconnected';
    $scope.oneATime = true;
    $scope.match = {
        numberOfLTPs: false,
        numberOfLTPsStatus: 'unknown',
        radioSignalIds: false,
        radioSignalIdsStatus: 'unknown'
    };
    
    $scope.schema = {initShowObjectCtrl:false};
    $mwtnCompare.getSchema().then(function(data){
      $scope.schema = data;
    });
    
    var initNodeList = function(nodes){
      $scope.neSelection = [];
      if (nodes.length > 0) {
        nodes.map(function(ne) {
          if (ne._source.onfAirIinterfaceRevision) {
            $scope.neSelection.push({id:ne._id, revision:ne._source.onfAirIinterfaceRevision});
            
          }
        });
        $scope.neSelection.sort(function(a, b){
          if(a.id < b.id) return -1;
          if(a.id > b.id) return 1;
          return 0;
        });
        
        // select one of the nodes
        var select = parseInt(Math.random()*$scope.neSelection.length);
        $scope.selection = $scope.neSelection[select].id;
      }
    };
    $scope.requiredNetworkElements = [];
    $mwtnCompare.getRequiredNetworkElements(true).then(function(nodes){
      $scope.requiredNetworkElements = nodes;
      initNodeList(nodes);
    }, function(error){
      $scope.neSelection = [];
      $scope.requiredNetworkElements = [];
    });

    $scope.collapseAll = function() {
      // close all groups
      Object.keys($scope.status).map(function(group){
        $scope.status[group] = false;
      });
      Object.keys($scope.spinner).map(function(group){
        $scope.spinner[group] = false;
      });
    };


  // events
    $scope.$watch('selection', function(neId, oldValue) {
      if (neId && neId !== '' && neId !== oldValue) {
        $scope.connectionStatus = 'disconnected';
        $mwtnCompare.getConnectionStatus(neId).then(function(connectionStatus){
          $scope.connectionStatus = connectionStatus;
        },function(error){
          $scope.connectionStatus = 'disconnected';
        });
        $scope.requiredNetworkElements.map(function(rne){
          if (rne._id === neId) {
            $scope.requiredNetworkElement = rne._source;
            rOnfNe = new OnfNetworkElement(rne._source.NetworkElement);
            var key = 'ne';
            var spec = {
                nodeId: $scope.selection,
                revision: $scope.requiredNetworkElement.onfAirIinterfaceRevision,
                pacId: key,
              };
              $mwtnCompare.getPacParts(spec).then(function(success){
                updatePart(spec, success);
                $scope.spinner[key] = false;
              }, function(error){
                updatePart(spec, error);
                $scope.spinner[key] = false;
              });
          }
        });
      }
    });

    var getArrayValueToString = function(array) {
      if (array === undefined) {
        return '';
      }
      if (array.length > 0 && ($mwtnCompare.getType(array[0]) === 'object' || $mwtnCompare.getType(array[0]) === 'array') ) {
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
        case 'open':
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
//              unit : $scope.schema[labelId].unit,
//              description : $scope.schema[labelId].description,
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
              unit : $scope.schema[labelId].unit,
              description : $scope.schema[labelId].description,
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
                unit : $scope.schema[labelId].unit,
                description : $scope.schema[labelId].description,
                showDescriptions : false
              });
            }
            
            switch($mwtnCompare.getType(obj[labelId])) {
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
                unit : $scope.schema[labelId].unit,
                description : $scope.schema[labelId].description,
                showDescriptions : false
              });
              break;
            default:
              var requiredValue = obj[labelId];
              var actualValue = actualData ? actualData[labelId] : '';
//              // console.log('match');
//              // console.log('match1', requiredValue, (requiredValue === ''));
//              // console.log('match2', actualValue, (actualValue === ''));
//              // console.log('match3', requiredValue, actualValue, (requiredValue === actualValue));
//              // console.log('match4', (requiredValue === '' || actualValue === '') || (requiredValue === actualValue));
              match = (requiredValue === '' || actualValue === '') || (requiredValue === actualValue);
              compares.push({
                labelId : labelId,
                requiredValue : requiredValue,
                actualValue : actualValue,
                match : match,
                missingActualValueLabelId : missingActualValueLabelId,
                unit : $scope.schema[labelId].unit,
                description : $scope.schema[labelId].description,
                showDescriptions : false
              });
            }
          }
      }
      return compares;
    };
    
    var updateNe = function(data) {
      console.log(data);
      var rne = $scope.requiredNetworkElement;
      rne.NetworkElement.compares = getCompares(rne.NetworkElement, data.NetworkElement);
      aOnfNe = new OnfNetworkElement(data.NetworkElement);
      
      console.log(JSON.stringify(rOnfNe.getLTPMwpsList()), JSON.stringify(aOnfNe.getLTPMwpsList()));
      console.log(JSON.stringify(rOnfNe.getLTPMwpsList()), JSON.stringify(aOnfNe.getLTPMwpsList()));
    };

    var updateAirInterface = function(spec, data) {
      console.log(JSON.stringify(data), spec.requiredLayerProtocolId);
      $scope.requiredNetworkElement.MW_AirInterface_Pac.map(function(mwps){
        if (mwps.layerProtocol === spec.requiredLayerProtocolId) {
          var actualData = data.airInterfaceConfiguration;
          mwps.compares = getCompares(mwps.airInterfaceConfiguration, actualData);
        }
      });
    };

    var updateStructure = function(spec, data) {
      console.log(JSON.stringify(data), spec.requiredLayerProtocolId);
      $scope.requiredNetworkElement.MW_PureEthernetStructure_Pac.map(function(mws){
        console.log(JSON.stringify(mws.layerProtocol), rLpId, mws.layerProtocol === rLpId);
        if (mws.layerProtocol === spec.requiredLayerProtocolId) {
          var actualData = data.pureEthernetStructureConfiguration;
          console.log(actualData);
          mws.compares = getCompares(mws.pureEthernetStructureConfiguration, actualData);
          
        }
      });
    };

    var updateContainer = function(spec, data) {
      console.log(JSON.stringify(data), spec.requiredLayerProtocolId);
      $scope.requiredNetworkElement.MW_EthernetContainer_Pac.map(function(mwClient){
        if (mwClient.layerProtocol === spec.requiredLayerProtocolId) {
          var actualData = data.ethernetContainerConfiguration;
          mwClient.compares = getCompares(mwClient.ethernetContainerConfiguration, actualData);
        }
      });
    };

    var updatePart = function(spec, data) {
      switch (spec.pacId) {
      case 'ne':
        updateNe(data);
        break;
      case 'airinterface':
        // console.log(JSON.stringify(spec, JSON.stringify(data)));
        updateAirInterface(spec, data);
        break;
      case 'structure':
        // console.log(JSON.stringify(data));
        updateStructure(spec, data);
        break;
      case 'container':
        // console.log(JSON.stringify(data));
        updateContainer(spec, data);
        break;
      }
    };

    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).map(function(key){
        if ($scope.selection && status[key] && status[key] !== oldValue[key]) {
          
          var info = key.split($scope.separator);
          var spec = {
            nodeId: $scope.selection,
            revision: $scope.requiredNetworkElement.onfAirIinterfaceRevision,
            pacId: info[0],
            requiredLayerProtocolId: info[1],
            layerProtocolId: info[1], // HACK must be a function of actuelNE uuids
            partId: 'Configuration'
          };

          $scope.spinner[key] = true;
          if ($scope.connectionStatus !== 'connected') {
            updatePart(spec, undefined)
            return;
          }
          
          $mwtnCompare.getPacParts(spec).then(function(success){
            updatePart(spec, success);
            $scope.spinner[key] = false;
          }, function(error){
            updatePart(spec, error);
            $scope.spinner[key] = false;
          });
        }
      });   
    }, true);

  
  }]);


});
