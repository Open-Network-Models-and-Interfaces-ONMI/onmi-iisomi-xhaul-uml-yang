/*
 * @copyright 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * @license 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTest/mwtnTest.module',
        'app/mwtnTest/mwtnTest.services'],
        function(mwtnTestApp) {

  mwtnTestApp.register.controller('mwtnTestCtrl', ['$scope', '$rootScope', '$mwtnLog', '$mwtnTest', '$translate', 'OnfNetworkElement', 'LogicalTerminationPoint', 
    function($scope, $rootScope, $mwtnLog, $mwtnTest, $translate, OnfNetworkElement, LogicalTerminationPoint) {

    var COMPONENT = 'mwtnTestCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnTestCtrl started!'});
    $rootScope.section_logo = 'src/app/mwtnTest/images/mwtnTest.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    var pacTemplate = {
        'layer-protocol': 'unknown'           
    };

    // get important infromation from yang modules
    $mwtnTest.getModules().then(function(success){

      var pacOrder = {
        'onf-ethernet-conditional-packages:ethernet-pac' : 1,
        'microwave-model:mw-air-interface-diversity-pac' : 1,
        'microwave-model:mw-air-interface-hsb-end-point-pac' : 1,
        'microwave-model:mw-air-interface-hsb-fc-switch-pac' : 2,
        'onf-core-model-conditional-packages:holder-pac' : 3,
        'onf-core-model-conditional-packages:connector-pac' : 4,
        'onf-core-model-conditional-packages:equipment-pac' : 5,
        'microwave-model:mw-ethernet-container-pac' : 6,
        'MicrowaveModel-ObjectClasses-EthernetContainer:MW_EthernetContainer_Pac' : 7,
        'microwave-model:mw-ethernet-container-pac' : 8,
        'microwave-model:mw-tdm-container-pac': 9,
        'microwave-model:mw-pure-ethernet-structure-pac': 10,
        'microwave-model:mw-hybrid-mw-structure-pac': 11,
        'MicrowaveModel-ObjectClasses-PureEthernetStructure:MW_PureEthernetStructure_Pac' : 12,
        'microwave-model:mw-air-interface-pac' : 13,
        'MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac' : 14
      };


      $scope.modules = success;
      $scope.orderedPacs = [];
      $scope.parts = [];
      Object.keys(success).map(function(module){
        Object.keys(success[module]).filter(function(key){
          return key.endsWith('-pac') || key.endsWith('_Pac');
        }).map(function(pacName){
          $scope.orderedPacs.push([module, pacName].join(':'));
          // sort 
          $scope.orderedPacs.sort(function(a, b) {
            if (!pacOrder[a]) console.warn(a);
            if (!pacOrder[b]) console.warn(b);
            if(pacOrder[a] > pacOrder[b]) return 1;
            if(pacOrder[a] < pacOrder[b]) return -1;
            return 0;
          })

          if (pacName === 'mw-air-interface-pac') {
            $scope.parts = Object.keys(success[module][pacName]).filter(function(conditionalPackage){
              return success[module][pacName][conditionalPackage]['local-name'];
            }).map(function(conditionalPackage){
              return success[module][pacName][conditionalPackage]['local-name'];
            });
          }
        });
      });
      console.log(JSON.stringify($scope.parts));
    }, function(error){
      $scope.modules = undefined;
      $scope.orderedPacs = undefined;
      $scope.parts = undefined;
    });

    $mwtnTest.getMountPoints().then(function(mountpoints){
      initNodeList(mountpoints);
    }, function(error){
      $scope.networkElements = [];
    });
    
    var order = {
        'MWPS': 6,
        'MWS': 5,
        'ETC': 4,
        'TDM': 3,
        'ETY': 2,
        'ETH-CTP': 1,
        'ETH': 1,
    };
    
    /**
     * A function which scanns the mountpoints for connected network-elements and adds it to networkElements.
     * @param {{"onfAirInterfaceRevision": string, "node-id": string, "netconf-node-topology:connection-status": string}[]} mountpoints An array of mountpoints from OpenDaylight.
     */    
    var initNodeList = function(mountpoints) {
      $scope.loading = true;
      $scope.mountPoints = mountpoints;
      $scope.networkElements = mountpoints.filter(function(mountpoint){
        return mountpoint['netconf-node-topology:connection-status'] === 'connected';
      }).map(function(mountpoint){
        return {id:mountpoint['node-id'], revision:mountpoint.onfAirInterfaceRevision};  
      }).sort(function(a, b){
        if(a.id < b.id) return -1;
        if(a.id > b.id) return 1;
        return 0;
      });
      
      $scope.networkElement = undefined;
      // select one of the nodes
      var select = parseInt(Math.random()*$scope.networkElements.length);
      if (select !== undefined && $scope.networkElements[select]) {
        $scope.networkElement = $scope.networkElements[select].id; 
        $scope.mountpoint = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === $scope.networkElement;
        })[0];
      }
      $scope.loading = false;
    };
        
    /**
     * @function updateNe 
     * A function, which updates onfNetworkElement by new data.
     * @param {*} data New data recieved from OpenDaylight via RestConf
     */
    var updateNe = function(data) {
      if (!data) return;
      // update onfNetworkElement
      switch ($scope.mountpoint.onfCoreModelRevision) {
      case '2016-03-23':
        $scope.onfNetworkElement = JSON.parse(JSON.stringify(data['network-element'][0]));
        $scope.onfLtps = data['network-element'][0].ltp;
        $scope.onfNetworkElement.ltp = undefined;
        break;
      case '2016-08-09':
      case '2016-08-11':
      case '2017-02-17':
      case '2017-03-20':
        // console.log(JSON.stringify(data));
        $scope.onfNetworkElement = new OnfNetworkElement(data['network-element']);
        $scope.onfLtps = $scope.onfNetworkElement.getLogicalTerminationPoints();
        // $scope.onfNetworkElement.ltp = undefined;
        break;
      default:
        $mwtnLog.info({component: COMPONENT, message: ['The ONF CoreModel revision', $scope.mountpoint.onfCoreModelRevision, ' is not supported (yet)!'].join(' ')});
        $scope.onfNetworkElement = {};
        $scope.onfLtps = {};
      }
      
      // update onfLTPs
      $scope.onfLtps.sort(function(a, b){
        if(order[a.getLayer()] < order[b.getLayer()]) return -1;
        if(order[a.getLayer()] > order[b.getLayer()]) return 1;
        if(a.getId() < b.getId()) return -1;
        if(a.getId() > b.getId()) return 1;
        return 0;
      });
      
      // calculate conditional packages
      $scope.pacs = {};
      $scope.onfLtps.map(function(ltp) {
        ltp.getLayerProtocols().map(
          /**
           * A function processing a layer-protocol object
           * @param {LayerProtocol} lp A layer-protocol object
           */
          function(lp) {
            var template = JSON.parse(JSON.stringify(pacTemplate));
            template['layer-protocol'] = lp.getId();
            var conditionalPackage = lp.getConditionalPackage(true);
            // console.log(conditionalPackage);
            if (conditionalPackage !== '') {
              if ($scope.pacs[conditionalPackage] === undefined) {
                // create missing pac array
                $scope.pacs[conditionalPackage] = [];
              }
              $scope.pacs[conditionalPackage].push(template);
            } else {
              $mwtnLog.info({component: COMPONENT, message: 'The condtional package ' + conditionalPackage + ' is not supported (yet)!'});
            }
        });
      });
      
      // sort the conditional packages
      if ($scope.orderedPacs) {
        $scope.orderedPacs.filter(function(item){
          return $scope.pacs[item] !== undefined;
        }).map(function(item){
          $scope.pacs[item].sort(function(a, b){
            if(a['layer-protocol'] < b['layer-protocol']) return -1;
            if(a['layer-protocol'] > b['layer-protocol']) return 1;
            return 0;
          });
        });
      }
      data.revision = undefined;
    };

    var updateNetworkElementCurrentProblems = function(data) {
      if (!data) return;
      $scope.neCurrentProblems = data;
    };

    var updateLtp = function(data) {
      $scope.onfLtps.map(function(ltp){
        if (ltp.getData().uuid === data.data.ltp[0].uuid) {
          ltp = new LogicalTerminationPoint(data.data.ltp[0]);
        }
      });
    };

    /**
     * @deprecated since all conditaional packages are handle the same way even for
     *             3rd and 4th PoC model - 2nd PoC model not supported any more.
     * @param {*} lpId 
     * @param {*} part 
     * @param {*} data 
     */
    var updateAirInterface = function(lpId, part, data) {
      // console.log(JSON.stringify(data), lpId);
      $scope.airinterfaces.map(function(airinterface){
        // console.log(JSON.stringify(airinterface));
        if (airinterface['layer-protocol'] === lpId) {
          if (Object.keys(data)[0].startsWith('air-interface')) {
            airinterface[part] = data;            
          } else if (part === 'Capability') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            airinterface[part] = data['mw-air-interface-pac'][0]['air-interface-capability-list'];            
          } else if (part === 'CurrentProblems') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            airinterface[part] = data['mw-air-interface-pac'][0]['air-interface-current-problem-list'];            
          }
        }
      });
      data.revision = undefined;
    };

    /**
     * @deprecated since all conditaional packages are handle the same way even for
     *             3rd and 4th PoC model - 2nd PoC model not supported any more.
     * @param {*} lpId 
     * @param {*} part 
     * @param {*} data 
     */
    var updateStructure = function(lpId, part, data) {
      // console.log(JSON.stringify(data), lpId);
      $scope.structures.map(function(structure){
        // console.log(JSON.stringify(structure));
        if (structure['layer-protocol'] === lpId) {
          if (Object.keys(data)[0].contains('tructure')) {
            structure[part] = data;            
          } else if (part === 'Capability') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            structure[part] = data['mw-structure-pac'][0]['structure.capability-list'];            
          } else if (part === 'CurrentProblems') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            structure[part] = data['mw-structure-pac'][0]['structure-current-problem-list'];            
          }
        }
      });
      data.revision = undefined;
    };

    /**
     * @deprecated since all conditaional packages are handle the same way even for
     *             3rd and 4th PoC model - 2nd PoC model not supported any more.
     * @param {*} lpId 
     * @param {*} part 
     * @param {*} data 
     */
    var updateContainer = function(lpId, part, data) {
      // console.log(JSON.stringify(data), lpId);
      $scope.containers.map(function(container){
        // console.log(JSON.stringify(container));
        if (container['layer-protocol'] === lpId) {
          if (Object.keys(data)[0].contains('ontainer') ) {
            container[part] = data;            
          } else if (part === 'Capability') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            container[part] = data['mw-container-pac'][0]['container-capability-list'];            
          } else if (part === 'CurrentProblems') {
            // 2. PoC
            // console.log(part, JSON.stringify(data));
            container[part] = data['mw-container-pac'][0]['container-current-problem-list'];            
          }
        }
      });
      data.revision = undefined;
    };

    /**
     * Creates a template of a conditional packages with its subclasses
     * @param {{pacId: string, layerProtocolId: string, partId:string}} spec - Specification object of a conditional package subclass
     */
    var initPac = function(spec) {
      $scope.pacs[spec.pacId].filter(function(conditionalPackage){
        return conditionalPackage['layer-protocol'] === spec.layerProtocolId;
      }).map(function(pac){
        $scope.parts.map(function(localName){
          pac[localName] = {id:$mwtnTest.getPartGlobalId(spec, localName),localName: localName, data:'No data available'}
        });
      });
    };

    /**
     * Updates an existing template of a conditional packages with its subclasses
     * @param {{pacId: string, layerProtocolId: string, partId:string}} spec - Specification object of a conditional package subclass
     */
    var updateSubClassData = function(spec, data) {
      $scope.pacs[spec.pacId].filter(function(conditionalPackage){
        return conditionalPackage['layer-protocol'] === spec.layerProtocolId;
      }).map(function(conditionalPackage){
        conditionalPackage[$mwtnTest.getPartLocalId(spec)].data = data[$mwtnTest.yangify(spec.partId)];
      });
    };

    var updatePart = function(spec, data) {
      switch (spec.pacId) {
        case 'ne':
          updateNe(data);
          break;
        case 'neCurrentProblems':
          updateNetworkElementCurrentProblems(data);
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
        // 3rd Poc
        case 'MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac':
        case 'MicrowaveModel-ObjectClasses-PureEthernetStructure:MW_PureEthernetStructure_Pac':
        case 'MicrowaveModel-ObjectClasses-EthernetContainer:MW_EthernetContainer_Pac':
        // 4th Poc
        case 'microwave-model:mw-air-interface-pac':
        case 'microwave-model:mw-air-interface-diversity-pac':
        case 'microwave-model:mw-pure-ethernet-structure-pac':
        case 'microwave-model:mw-hybrid-mw-structure-pac':
        case 'microwave-model:mw-tdm-container-pac':
        case 'microwave-model:mw-ethernet-container-pac':
        case 'onf-ethernet-conditional-packages:ethernet-pac':
          if (!spec.partId) {
            initPac(spec);
          } else {
            updateSubClassData(spec, data);
          }
          break;  
      }
    };
    
    // events
    $scope.status = {ne:false};
    $scope.spinner = {ne:false};
    $scope.separator = $mwtnTest.separator; //'&nbsp;'

    $scope.myClipboard = {
      data : {'key': 'value'},
      supported : true,
      getJson : function() {
        return JSON.stringify(this.data, null, ' ');
      },
      copyToClipboard : function() {
        var message = 'Copied to clipboard! ' + this.getJson();
        $mwtnLog.info({component: COMPONENT, message: message});
      },
      error : function(err) {
        $mwtnLog.error({component: COMPONENT, message: err});
      }
    };
    
    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).filter(function(key){
        return $scope.networkElementId && status[key] && status[key] !== oldValue[key];
      }).map(function(key){
        $scope.spinner[key] = true;
        var info = key.split($scope.separator);
        var spec = {
          nodeId: $scope.networkElementId,
          revision: $scope.revision,
          pacId: info[0],
          layerProtocolId: info[1],
          partId: info[2]
        };
        $mwtnTest.getPacParts(spec).then(function(success){
          success = $mwtnTest.yangifyObject(success)
          $scope.myClipboard.data = success; 
          updatePart(spec, success);
          $scope.spinner[key] = false;
        }, function(error){
          updatePart(spec, error);
          $scope.spinner[key] = false;
        });
        $scope.mountpoint = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === $scope.networkElementId;
        })[0];
        if (key === 'mountpoint') {
          $scope.spinner['mountpoint'] = false;
          $scope.myClipboard.data = $scope.mountpoint;
        }
      });
    }, true);
    
    $scope.collapseAll = function() {
      // close all groups
      Object.keys($scope.status).map(function(group){
        $scope.status[group] = false;
      });
      Object.keys($scope.spinner).map(function(group){
        $scope.spinner[group] = false;
      });
    };
    
    $scope.$watch('networkElement', function(neId, oldValue) {
      if (neId && neId !== '' && neId !== oldValue) {
        
        // clear old data
        $scope.airinterfaces = [];
        $scope.structures = [];
        $scope.containers = [];
        $scope.onfLtps = [];

        $scope.networkElementId = neId;
        $scope.revision = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === neId;
        }).map(function(mountpoint){
          return mountpoint.onfCoreModelRevision;
        })[0];

        var neAlarms = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === neId;
        }).map(function(mountpoint){
          return mountpoint.onfCapabilities.filter(function(cap){
            return cap.module === 'MicrowaveModel-NetworkElement-CurrentProblemList' || cap.module === 'Onf-CoreModel-ConditionalPackages';
          });
        });
        if (neAlarms.length === 1 && neAlarms[0].length === 1 ) {
          $translate('MWTN_LOADING').then(function (translation) {
            $scope.neCurrentProblems = translation;
          });
        } else {
          $scope.neCurrentProblems = undefined;
        }
        
        var spec = {
          nodeId: $scope.networkElementId,
          revision: $scope.revision,
          pacId: 'ne'
        };
        $mwtnTest.getPacParts(spec).then(function(success){
          $scope.collapseAll();
          updatePart(spec, $mwtnTest.yangifyObject(success));
        }, function(error){
          $scope.collapseAll();
          updatePart(spec, error);
        });
      }
    });

  }]);

});
