/*
 * Copyright (c) 2017 highstreet technologies GmbH and others. All rights reserved.
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

  mwtnCompareApp.register.controller('mwtnCompareCtrl', ['$scope', '$rootScope', '$mwtnCompare', '$mwtnLog', 'orderByFilter', 'OnfNetworkElement', 'MicrowavePhysicalSection', 'MicrowaveSection',  
                                                         function($scope, $rootScope, $mwtnCompare, $mwtnLog, orderBy, OnfNetworkElement, MicrowavePhysicalSection, MicrowaveSection) {

    $rootScope.section_logo = 'src/app/mwtnCompare/images/mwtnCompare.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

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
        radioSignalIdsStatus: 'unknown',
        mapping: {},
        addActualRadioSignalId: function(rsId) {
          if (!this.actualRadioSignalIds) {
            this.actualRadioSignalIds = [];
          }
          if (this.actualRadioSignalIds.contains(rsId)) {
            return;
          }
          this.actualRadioSignalIds.push(rsId);
          this.actualRadioSignalIds.sort();
          this.checkRadioSignalIdsStatus();
        },
        clearActualNumberOfLtps: function() {
          this.actualNumberOfLtps = undefined;
          this.numberOfLTPs = false;
          this.numberOfLTPsStatus = this.requiredNumberOfLtps;
        },
        clearActualRadioSignalIds: function() {
          this.actualRadioSignalIds = undefined;
          this.radioSignalIds = false;
          this.radioSignalIdsStatus = this.requiredRadioSignalIds;
        },
        setRequiredNumberOfLtps: function(rNoLtps) {
          this.requiredNumberOfLtps = rNoLtps;
          this.checkNumberOfLTPs();
        },
        setRequiredRadioSignalIds: function(rRsIds) {
          this.requiredRadioSignalIds = rRsIds.sort();
          this.checkRadioSignalIdsStatus();
        },
        setActualNumberOfLtps: function(aNoLtps) {
          this.actualNumberOfLtps = aNoLtps;
          this.checkNumberOfLTPs();
        },
        setActualRadioSignalIds: function(aRsIds) {
          this.actualRadioSignalIds = aRsIds.sort();
          this.checkRadioSignalIdsStatus();
        },
        checkNumberOfLTPs: function() {
          if (!this.requiredNumberOfLtps) {
            this.numberOfLTPs = false;
            this.numberOfLTPsStatus = 'unknown';
          } else {
            if (!this.actualNumberOfLtps) {
              this.numberOfLTPs = false;
              this.numberOfLTPsStatus = this.requiredNumberOfLtps;
            } else {
              if (this.requiredNumberOfLtps === this.actualNumberOfLtps) {
                this.numberOfLTPs = true;
                this.numberOfLTPsStatus = this.requiredNumberOfLtps;
              } else {
                this.numberOfLTPs = false;
                this.numberOfLTPsStatus = ['required:', this.requiredNumberOfLtps, 'does not match actual:',this.actualNumberOfLtps].join(' ');
              }
            }
          }
        },
        checkRadioSignalIdsStatus: function() {
          if (!this.requiredRadioSignalIds) {
            this.radioSignalIds = false;
            this.radioSignalIdsStatus = 'unknown';
          } else {
            if (!this.actualRadioSignalIds) {
              this.radioSignalIds = false;
              this.radioSignalIdsStatus = this.requiredRadioSignalIds;
            } else {
              if (JSON.stringify(this.requiredRadioSignalIds) === JSON.stringify(this.actualRadioSignalIds)) {
                this.radioSignalIds = true;
                this.radioSignalIdsStatus = this.requiredRadioSignalIds;
              } else {
                this.radioSignalIds = false;
                this.radioSignalIdsStatus = ['required:', this.requiredRadioSignalIds, 'does not match actual:',this.actualRadioSignalIds].join(' ');
              }
            }
          }
        }
        
    };
    
    $scope.schema = {initShowObjectCtrl:false};
    $mwtnCompare.getSchema().then(function(data){
      $scope.schema = data;
    });
    
    var initNodeList = function(nodes){
      $scope.neSelection = [];
      if (nodes.length > 0) {
        nodes.map(function(ne) {
          if (ne._source.onfAirInterfaceRevision) {
            $scope.neSelection.push({id:ne._id, revision:ne._source.onfAirInterfaceRevision});
            
          }
        });
        $scope.neSelection.sort(function(a, b){
          if(a.id < b.id) return -1;
          if(a.id > b.id) return 1;
          return 0;
        });
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
        $scope.collapseAll();
        $scope.connectionStatus = 'disconnected';
        $scope.match.clearActualNumberOfLtps();
        $scope.match.clearActualRadioSignalIds();
        $mwtnCompare.getConnectionStatus(neId).then(function(connectionStatus){
          $scope.connectionStatus = connectionStatus;
         // get actual data
          if ($scope.connectionStatus === 'connected') {
            var key = 'ne';
            var spec = {
                nodeId: $scope.selection,
                revision: $scope.requiredNetworkElement.onfAirInterfaceRevision,
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
          
        },function(error){
          $scope.connectionStatus = 'disconnected';
        });

        $scope.requiredNetworkElements.map(function(rne){
          console.warn(JSON.stringify(rne._id, neId, rne._id === neId));
          if (rne._id === neId) {
            $scope.requiredNetworkElement = rne._source;
            rOnfNe = new OnfNetworkElement(rne._source['core-model:network-element']);
            $scope.match.setRequiredNumberOfLtps(rOnfNe.getNumberOfLtps());
            // required NE
            var rMwpsList = rOnfNe.getLTPMwpsList().map(function(mwpsLtp){
              var key = 'microwave-model:mw-air-interface-pac';
              if ($scope.requiredNetworkElement.onfAirInterfaceRevision.contains('2016')) {
                 key = 'MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac';
              }
              var rMwpsList = $scope.requiredNetworkElement[key].map(function(mwps){
                if (mwps.layerProtocol === mwpsLtp.getLayerProtocols()[0].getId()) {
                  return new MicrowavePhysicalSection(mwps);
                }
              });
              
              if (rMwpsList) {
                return rMwpsList.clean(undefined)[0];
              } else {
                return {};
              }
            });
            
            var rRadioSignalIds = rMwpsList.map(function(rMwps){
             return rMwps.getRadioSignalId();
            });
            $scope.match.setRequiredRadioSignalIds(rRadioSignalIds);
          }
        });
      }
    });

    var getArrayValueToHtml = function(array) {
      if (array === undefined) {
        return '';
      }
      if (array.length > 0 && ($mwtnCompare.getType(array[0]) === 'object' || $mwtnCompare.getType(array[0]) === 'array') ) {
        var converted = array.map(function(item){
          if ($mwtnCompare.getType(item) === 'object' && Object.keys(item).length === 2 ) {
            return [item[Object.keys(item)[0]], item[Object.keys(item)[1]]].join(':');            
          } else {
            return JSON.stringify(item);            
          }
        });
        return converted.join('<br/>');
      } else {
        return array.join('<br/>');
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
//        case 'nameList':
//            var requiredName = obj[labelId][0].value;
//            var actualName = '';
//            if (actualData) {
//              actualName = actualData[labelId][0].value;
//            }
//            match = ((requiredName === '' || actualName === '') || (requiredName === actualName));
//            // console.log('NAME', requiredName, actualName, match);
//            compares.push({
//              labelId : 'NE name',
//              requiredValue : requiredName,
//              actualValue : actualName,
//              match : match,
//              missingActualValueLabelId : missingActualValueLabelId,
////              unit : $scope.schema[labelId].unit,
////              description : $scope.schema[labelId].description,
//              showDescriptions : false
//            });
//            break;
          case '_ltpRefList':
            var requiredLtpLength = obj[labelId].length;
            var actualLtpLength = '';
            if (actualData) {
              actualLtpLength = actualData[labelId].length;
            }
            match = ((requiredLtpLength === '' || actualLtpLength === '') || (requiredLtpLength === actualLtpLength));
            compares.push({
              labelId : 'numberOfLTPs',
              requiredValue : requiredLtpLength,
              actualValue : actualLtpLength,
              match : match,
              missingActualValueLabelId : missingActualValueLabelId,
              unit : $scope.schema[labelId].unit,
              order: $scope.schema[labelId]['order-number'],
              description :  $scope.schema[labelId].description,
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
                order: $scope.schema[labelId]['order-number'],
                description :  $scope.schema[labelId].description,
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
              var requiredDataValue = getArrayValueToHtml(obj[labelId]);
              var actualDataValue = '';
              if (actualData) {
                actualDataValue = getArrayValueToHtml(actualData[labelId]);
              }
              match = ((requiredDataValue === '' || actualDataValue === '') || (requiredDataValue === actualDataValue));
              compares.push({
                labelId : labelId,
                requiredValue : requiredDataValue,
                actualValue : actualDataValue,
                match : match,
                missingActualValueLabelId : missingActualValueLabelId,
                unit : $scope.schema[labelId].unit,
                order: $scope.schema[labelId]['order-number'],
                description :  $scope.schema[labelId].description,
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
                order: $scope.schema[labelId]['order-number'],
                description :  $scope.schema[labelId].description,
                showDescriptions : false
              });
            }
          }
      }
      return orderBy(compares, 'order', false);
    };
    
    var updateNe = function(data) {

      var rne = $scope.requiredNetworkElement;
      if (!data) {
        rne['core-model:network-element'].compares = getCompares(rne['core-model:network-element']);
        return;        
      }
      rne['core-model:network-element'].compares = getCompares(rne['core-model:network-element'], data['core-model:network-element']);
      console.error(JSON.stringify(data));
      aOnfNe = new OnfNetworkElement(data['core-model:network-element']);
      $scope.match.setActualNumberOfLtps(aOnfNe.getNumberOfLtps());
      var aMwpsList = aOnfNe.getLTPMwpsList().map(function(mwpsLtp){
        
        var spec = {
          nodeId: $scope.selection,
          revision: $scope.requiredNetworkElement.onfAirInterfaceRevision,
          pacId: 'microwave-model:mw-air-interface-pac',
          layerProtocolId: mwpsLtp.getLayerProtocols()[0].getId(),
          partId: 'configuration'
        };

        $mwtnCompare.getPacParts(spec).then(function(success){
          updatePart(spec, success);
        }, function(error){
          updatePart(spec, error);
        });
        return mwpsLtp._lpList[0].uuid;
      });
      // console.log(aMwpsList)
      var mwClient = rne['microwave-model:mw-ethernet-container-pac'][0];
      $scope.match.mapping[mwClient.layerProtocol] = aOnfNe.getLTPEthCtpList()[0].getLayerProtocols()[0].getId();
    };

    var addShowDescriptionEvent = function(obj) {
      $scope.$watch(function() {
        return obj.showDescriptions;
      }, function(newValue, oldValue) {
        if (newValue !== oldValue) {
          obj.compares.map(function(compare){
            compare.showDescriptions = newValue;
          });
        }
      });
    };

    var updateAirInterface = function(spec, data) {
      if (!data) {
        $scope.requiredNetworkElement['microwave-model:mw-air-interface-pac'].map(function(mwps){
          mwps.compares = getCompares(mwps.airInterfaceConfiguration);
          addShowDescriptionEvent(mwps);
        });
      } else {
        var actual = new MicrowavePhysicalSection(data);
        $scope.match.addActualRadioSignalId(actual.getRadioSignalId());
        // console.log(actual.getRadioSignalId());
        $scope.requiredNetworkElement['microwave-model:mw-air-interface-pac'].map(function(mwps){
          var required = new MicrowavePhysicalSection(mwps);
          if (actual.getRadioSignalId() === required.getRadioSignalId()) {
            $scope.match.mapping[required.getLayerProtocolId()] = actual.getLayerProtocolId();
            var actualData = data.airInterfaceConfiguration;
            mwps.compares = getCompares(mwps.airInterfaceConfiguration, actualData);
            addShowDescriptionEvent(mwps);
  
            // MWS mapping
            var rMws = rOnfNe.getClientLtpIds(required.getLayerProtocolId());
            var aMws = aOnfNe.getClientLtpIds(actual.getLayerProtocolId());
            // In PoC just a 1:1 relation between MWPS and MWS
            $scope.match.mapping[rOnfNe.getLpByLtpRef(rMws[0]).uuid] = aOnfNe.getLpByLtpRef(aMws[0]).uuid;
          }
        });
     }
    };

    var updateStructure = function(spec, data) {
      if (!data) {
        $scope.requiredNetworkElement.MW_PureEthernetStructure_Pac.map(function(mws){
          mws.compares = getCompares(mws.pureEthernetStructureConfiguration);
          addShowDescriptionEvent(mws);
        });
      } else {
        $scope.requiredNetworkElement.MW_PureEthernetStructure_Pac.map(function(mws){
          if ($scope.match.mapping[mws.layerProtocol] === data.layerProtocol) {
            var actualData = data.pureEthernetStructureConfiguration;
            mws.compares = getCompares(mws.pureEthernetStructureConfiguration, actualData);
            addShowDescriptionEvent(mws);
          }
        });
      }
    };

    var updateContainer = function(spec, data) {
      // there is only one container in PoCs
      var mwClient = $scope.requiredNetworkElement.MW_EthernetContainer_Pac[0];
      if (!data) {
        mwClient.compares = getCompares(mwClient.ethernetContainerConfiguration);
        addShowDescriptionEvent(mwClient);
      } else {
        var actualData = data.ethernetContainerConfiguration;
        mwClient.compares = getCompares(mwClient.ethernetContainerConfiguration, actualData);
        addShowDescriptionEvent(mwClient);
      }
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
            revision: $scope.requiredNetworkElement.onfAirInterfaceRevision,
            pacId: info[0],
            requiredLayerProtocolId: info[1],
            layerProtocolId: $scope.match.mapping[info[1]],
            partId: 'Configuration'
          };

          if ($scope.connectionStatus !== 'connected') {
            updatePart(spec, undefined);
            return;
          }
          if (info.length > 1 && !$scope.match.mapping[info[1]]) {
            updatePart(spec, undefined);
            return;
          } 

          $scope.spinner[key] = true;
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
