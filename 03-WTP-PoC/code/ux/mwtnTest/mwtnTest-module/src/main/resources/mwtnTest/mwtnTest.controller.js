/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTest/mwtnTest.module',
        'app/mwtnTest/mwtnTest.services'],
        function(mwtnTestApp) {

  mwtnTestApp.register.controller('mwtnTestCtrl', ['$scope', '$rootScope', '$mwtnLog', '$mwtnTest',  function($scope, $rootScope, $mwtnLog, $mwtnTest) {

    var COMPONENT = 'mwtnTestCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnTestCtrl started!'});

    $rootScope['section_logo'] = 'src/app/mwtnTest/images/mwtnTest.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
    $scope.parts = ['Capability', 'Configuration', 'Status', 'CurrentProblems', 'CurrentPerformance', 'HistoricalPerformances']
    var initPac = {
        layerProtocol: 'unknown'              
    };
    $scope.parts.map(function(part){
      initPac[part] = {info: 'No data available'};
    });
    
    var initNodeList = function(nodes){
      $scope.networkElements = [];
      nodes.map(function(ne) {
        // revision detection should go to commons
        if (ne['netconf-node-topology:connection-status'] === 'connected' && ne['netconf-node-topology:available-capabilities'] && ne['netconf-node-topology:available-capabilities']['available-capability']) {
          ne['netconf-node-topology:available-capabilities']['available-capability'].map(function(cap){
            if (cap.contains('CoreModel-CoreNetworkModule-ObjectClasses')) {
              ne.onfCoreModelRevision = cap.split('?revision=')[1].substring(0,10);
            } else if (cap.contains('MicrowaveModel-ObjectClasses-AirInterface')) {
              ne.onfAirIinterfaceRevision = cap.split('?revision=')[1].substring(0,10);
            }  else if (!ne.onfAirIinterfaceRevision && cap.contains('MicrowaveModel-ObjectClasses')) {
              ne.onfAirIinterfaceRevision = cap.split('?revision=')[1].substring(0,10);
            } 
          });
          if (ne.onfAirIinterfaceRevision) {
            $scope.networkElements.push({id:ne['node-id'], revision:ne.onfAirIinterfaceRevision});
          }
        }
      });
      $scope.networkElements.sort(function(a, b){
        if(a.id < b.id) return -1;
        if(a.id > b.id) return 1;
        return 0;
      });
      
      // select one of the nodes
      var select = parseInt(Math.random()*$scope.networkElements.length);
      $scope.networkElement = $scope.networkElements[select].id;      
    };
    
    $mwtnTest.getActualNetworkElements().then(function(nodes){
      initNodeList(nodes);
    }, function(error){
      $scope.networkElements = [];
    });
    
    var order = {
        'MWPS':1,
        'MWS':2,
        'ETH-CTP':3
    }
    var updateNe = function(data) {
      if (!data) return;

      // update onfNetworkElement
      switch (data.revision) {
      case '2016-03-23':
        $scope.onfNetworkElement = JSON.parse(JSON.stringify(data.NetworkElement[0]));
        $scope.onfLtps = data.NetworkElement[0]._ltpRefList;
        $scope.onfNetworkElement._ltpRefList = undefined;
        break;
      default:
        $scope.onfNetworkElement = JSON.parse(JSON.stringify(data.NetworkElement));
        $scope.onfLtps = data.NetworkElement._ltpRefList;
        $scope.onfNetworkElement._ltpRefList = undefined;
      }
      
      // update onfLTPs
      $scope.onfLtps.sort(function(a, b){
        if(order[a._lpList[0].layerProtocolName] < order[b._lpList[0].layerProtocolName]) return -1;
        if(order[a._lpList[0].layerProtocolName] > order[b._lpList[0].layerProtocolName]) return 1;
        if(a._lpList[0].uuid < b._lpList[0].uuid) return -1;
        if(a._lpList[0].uuid > b._lpList[0].uuid) return 1;
        return 0;
      });
      
      // calculate conditional packages
      $scope.airinterfaces = [];
      $scope.structures = [];
      $scope.containers = [];
      $scope.onfLtps.map(function(ltp){
        var lpId = ltp._lpList[0].uuid;
        switch (ltp._lpList[0].layerProtocolName) {
          case "MWPS":
            var init = JSON.parse(JSON.stringify(initPac));
            init.layerProtocol = lpId;
            $scope.airinterfaces.push(init);
            break;
          case "MWS":
            var init = JSON.parse(JSON.stringify(initPac));
            init.layerProtocol = lpId;
            $scope.structures.push(init);
            break;
          case "ETH-CTP":
            var init = JSON.parse(JSON.stringify(initPac));
            init.layerProtocol = lpId;
            $scope.containers.push(init);
            break;
          default:
            $mwtnLog.info({component: COMPONENT, message: 'The layerProtocol ' + ltp._lpList[0].layerProtocolName + ' is not supported (yet)!'});
        }
      });
      
      // sort the groups
      ['airinterfaces', 'structures', 'containers'].map(function(pacs){
        $scope[pacs].sort(function(a, b){
          if(a.layerProtocol < b.layerProtocol) return -1;
          if(a.layerProtocol > b.layerProtocol) return 1;
          return 0;
        });
      });
      data.revision = undefined;
    };

    var updateLtp = function(data) {
      $scope.onfLtps.map(function(ltp){
        if (ltp.uuid === data.data._ltpRefList[0].uuid) {
          ltp = data.data._ltpRefList[0];
        }
      });
    };

    var updateAirInterface = function(lpId, part, data) {
      // console.log(JSON.stringify(data), lpId);
      $scope.airinterfaces.map(function(airinterface){
        // console.log(JSON.stringify(airinterface));
        if (airinterface.layerProtocol === lpId) {
          if (Object.keys(data)[0].startsWith('airInterface')) {
            airinterface[part] = data;            
          } else if (part === 'Capability') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            airinterface[part] = data.MW_AirInterface_Pac[0].airInterfaceCapabilityList;            
          } else if (part === 'CurrentProblems') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            airinterface[part] = data.MW_AirInterface_Pac[0].airInterfaceCurrentProblemList;            
          }
        }
      });
      data.revision = undefined;
    };

    var updateStructure = function(lpId, part, data) {
      // console.log(JSON.stringify(data), lpId);
      $scope.structures.map(function(structure){
        // console.log(JSON.stringify(structure));
        if (structure.layerProtocol === lpId) {
          if (Object.keys(data)[0].contains('tructure')) {
            structure[part] = data;            
          } else if (part === 'Capability') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            structure[part] = data.MW_Structure_Pac[0].structureCapabilityList;            
          } else if (part === 'CurrentProblems') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            structure[part] = data.MW_Structure_Pac[0].structureCurrentProblemList;            
          }
        }
      });
      data.revision = undefined;
    };

    var updateContainer = function(lpId, part, data) {
      // console.log(JSON.stringify(data), lpId);
      $scope.containers.map(function(container){
        // console.log(JSON.stringify(container));
        if (container.layerProtocol === lpId) {
          if (Object.keys(data)[0].contains('ontainer') ) {
            container[part] = data;            
          } else if (part === 'Capability') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            container[part] = data.MW_Container_Pac[0].containerCapabilityList;            
          } else if (part === 'CurrentProblems') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            container[part] = data.MW_Container_Pac[0].containerCurrentProblemList;            
          }
        }
      });
      data.revision = undefined;
    };

    var updatePart = function(spec, data) {
      switch (spec.pacId) {
      case 'ne':
        updateNe(data);
        break;
      case 'ltp':
        updateLtp(data);
        break;
      case 'airinterface':
        console.log(JSON.stringify(spec, JSON.stringify(data)));
        updateAirInterface(spec.layerProtocolId, spec.partId, data);
        break;
      case 'structure':
        console.log(JSON.stringify(data));
        updateStructure(spec.layerProtocolId, spec.partId, data);
        break;
      case 'container':
        console.log(JSON.stringify(data));
        updateContainer(spec.layerProtocolId, spec.partId, data);
        break;
      }
    };
    
    // events
    $scope.status = {ne:false};
    $scope.separator = $mwtnTest.separator; //'&nbsp;'
    
    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).map(function(key){
        if ($scope.networkElementId && status[key] && status[key] !== oldValue[key]) {
          
          
          var info = key.split($scope.separator);
          var spec = {
            nodeId: $scope.networkElementId,
            revision: $scope.revision,
            pacId: info[0],
            layerProtocolId: info[1],
            partId: info[2]
          };
          $mwtnTest.getPacParts(spec).then(function(success){
            updatePart(spec, success);
          }, function(error){
            updatePart(spec, error);
          });
        }
      });   
    }, true);
    
    $scope.collapseAll = function() {
      // close all groups
      Object.keys($scope.status).map(function(group){
        $scope.status[group] = false;
      });
    };
    
    $scope.$watch('networkElement', function(neId, oldValue) {
      if (neId && neId !== '' && neId !== oldValue) {
        var revision;
        $scope.networkElements.map(function(ne){
          if (ne.id === neId) revision = ne.revision;
        });
        $scope.networkElementId = neId;
        $scope.revision = revision;

        var spec = {
          nodeId: neId,
          revision: revision,
          pacId: 'ne'
        };
        $mwtnTest.getPacParts(spec).then(function(success){
          $scope.collapseAll();
          updatePart(spec, success);
        }, function(error){
          $scope.collapseAll();
          updatePart(spec, error);
        });
      }
    });

  }]);

});
