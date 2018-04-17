/*
 * @copyright 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * @license 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnBrowser/mwtnBrowser.module',
        'app/mwtnBrowser/mwtnBrowser.services'],
        function(mwtnBrowserApp) {

    var getControlType = function(type) {
      var result = 'text'
      switch (type) {
        case 'boolean':
          result = 'checkbox';
          break;
        case 'number':
          result = 'number';
          break;
        case 'string':
        case 'array':
        case 'object':
          break;
        default:
          var message = 'Check control type for ' + type;
          $mwtnLog.warning({ component: COMPONENT, message: message });
      }
      return result;
    };

    mwtnBrowserApp.register.controller('ptpDefaultDsViewController', ['$scope', '$uibModalInstance', '$mwtnGlobal', '$mwtnCommons', '$mwtnDatabase', '$mwtnLog', 'defaultDs', 
      function ($scope, $uibModalInstance, $mwtnGlobal, $mwtnCommons, $mwtnDatabase, $mwtnLog, defaultDs) {

      var vm = this;
      var COMPONENT = 'ptpDefaultDsViewController';
      $scope.data = defaultDs;

      $scope.getType = $mwtnGlobal.getType;


      $mwtnCommons.getPtpDefaultDs(defaultDs).then(function (success) {

        $scope.configuredData = success;
        $scope.viewData = $mwtnGlobal.getViewData($scope.configuredData['default-ds']);

        $mwtnDatabase.getSchema().then(function(schema){
          var ordered = {};
          var clone = JSON.parse(JSON.stringify($scope.viewData));
          var keys = Object.keys(clone).map(function(key){
            if ($mwtnGlobal.getType(key) !== 'string') {
              console.log('key', key);
              return;
            }
            var item = clone[key];
            if (!schema[key]) {
              var message = 'No schema information for ' + key;
              $mwtnLog.warning({ component: COMPONENT, message: message });
              item['order-number'] = $mwtnCommons.getOrderNumber(97, item);
              item.description = 'No description available.';
              item.visible = true;
              return key;
            }
            if (schema[key].controlType === undefined) {
              item.controlType = getControlType(item.type);
            } else {
              item.controlType = schema[key].controlType;
            }
            item.unit = schema[key].unit;
            item['is-read-only'] = schema[key]['is-read-only'];
            if (schema[key].min) {
              item.min = schema[key].min;
            }
            if (schema[key].max) {
              item.max = schema[key].max;
              if (item.unit) {
                item.unit = schema[key].min + '..' + schema[key].max + ' ' + item.unit;
              } else {
                item.unit = schema[key].min + '..' + schema[key].max;
              }
            }


            item['order-number'] = $mwtnCommons.getOrderNumber(schema[key]['order-number'], item);
            item.description = schema[key].description;
            if (item.description === undefined || item.description === '') {
              item.description = 'No description available.';
            }
            // hide complex types for now -> TODO
            if (item.type === 'array' || item.type === 'object') {
              item.visible = false;
            }
            return key;
          }).sort(function(a,b){
            if (clone[a]['order-number'] < clone[b]['order-number']) return -1;
            if (clone[a]['order-number'] > clone[b]['order-number']) return 1;
            return 0;
          }).map(function(key){
            ordered[key] = clone[key];
          });
          $scope.viewData = ordered;
        }, function(error){
          $scope.empty = true;
        });
                  
      }, function (error) {
        $scope.configuredData = undefined;
        $mwtnLog.error({ component: COMPONENT, message: 'Requesting PTP default ds ' + JSON.stringify($scope.data) + ' failed!' });
      });

      $scope.$watch('viewData', function(newValue, oldValue) {
        if (oldValue && newValue !== oldValue) {
          Object.keys(newValue).filter(function(key){
            return newValue[key]['is-read-only'] !== true && newValue[key].controlType === 'number' ;
          }).map(function(key){
            if (newValue[key].value < newValue[key].min) newValue[key].value = newValue[key].min;
            if (newValue[key].value > newValue[key].max) newValue[key].value = newValue[key].max;
            if (!newValue[key].value) newValue[key].value = newValue[key].min;
          });
        }
      }, true);

      $scope.newData = {};
      $scope.ok = function () {
        $scope.processing = true;
        $scope.newData = {};
        Object.keys($scope.viewData).map(function(key){
          $scope.newData[key] = $scope.viewData[key].value;
        });

        $mwtnCommons.setPtpDefaultDs($scope.data, $scope.newData).then(function(success){
          $scope.applied = {text: 'Applied: ' + new Date().toISOString(), class:'mwtnSuccess'};
          $scope.processing = false;
        }, function(error){
          $scope.applied = {text: 'Error: ' + new Date().toISOString(), class:'mwtnError'};
          $scope.processing = false;
          $mwtnLog.error({component: COMPONENT, message: JSON.stringify(error)});
        });

      };
    
      $scope.cancel = function () {
        $uibModalInstance.close($scope.newData);
      };

      // events


    }]);

    mwtnBrowserApp.register.controller('ptpPortConfigViewController', ['$scope', '$uibModalInstance', '$mwtnGlobal', '$mwtnCommons', '$mwtnDatabase', '$mwtnLog', 'valueData', 
      function ($scope, $uibModalInstance, $mwtnGlobal, $mwtnCommons, $mwtnDatabase, $mwtnLog, data) {

      var vm = this;
      var COMPONENT = 'ptpPortConfigViewController';

      $scope.data = data;

      $scope.getType = $mwtnGlobal.getType;
      console.warn(JSON.stringify(data));
      $mwtnCommons.getPtpPort(data).then(function (success) {
        
        $scope.configuredData = success;
        
        $scope.viewData = $mwtnGlobal.getViewData($scope.configuredData['port-ds-list'][0]);
        $mwtnDatabase.getSchema().then(function(schema){
          var ordered = {};
          var clone = JSON.parse(JSON.stringify($scope.viewData));
          var keys = Object.keys(clone).map(function(key){
            if ($mwtnGlobal.getType(key) !== 'string') {
              console.log('key', key);
              return;
            }
            var item = clone[key];
            if (!schema[key]) {
              var message = 'No schema information for ' + key;
              $mwtnLog.warning({ component: COMPONENT, message: message });
              item['order-number'] = $mwtnCommons.getOrderNumber(97, item);
              item.description = 'No description available.';
              item.visible = true;
              return key;
            }
            if (schema[key].controlType === undefined) {
              item.controlType = getControlType(item.type);
            } else {
              item.controlType = schema[key].controlType;
            }
            item.unit = schema[key].unit;
            console.warn(key, schema[key]['is-read-only']);
            item['is-read-only'] = schema[key]['is-read-only'];
            if (schema[key].min) {
              item.min = schema[key].min;
            }
            if (schema[key].max) {
              item.max = schema[key].max;
              if (item.unit) {
                item.unit = schema[key].min + '..' + schema[key].max + ' ' + item.unit;
              } else {
                item.unit = schema[key].min + '..' + schema[key].max;
              }
            }


            item['order-number'] = $mwtnCommons.getOrderNumber(schema[key]['order-number'], item);
            item.description = schema[key].description;
            if (item.description === undefined || item.description === '') {
              item.description = 'No description available.';
            }
            // hide complex types for now -> TODO
            if (item.type === 'array' || item.type === 'object') {
              item.visible = false;
            }
            return key;
          }).sort(function(a,b){
            if (clone[a]['order-number'] < clone[b]['order-number']) return -1;
            if (clone[a]['order-number'] > clone[b]['order-number']) return 1;
            return 0;
          }).map(function(key){
            ordered[key] = clone[key];
          });
          $scope.viewData = ordered;
        }, function(error){
          $scope.empty = true;
        });
                  
      }, function (error) {
        $scope.configuredData = undefined;
        $mwtnLog.error({ component: COMPONENT, message: 'Requesting PTP port ' + JSON.stringify($scope.data) + ' failed!' });
      });

      $scope.$watch('viewData', function(newValue, oldValue) {
        if (oldValue && newValue !== oldValue) {
          Object.keys(newValue).filter(function(key){
            return newValue[key]['is-read-only'] !== true && newValue[key].controlType === 'number' ;
          }).map(function(key){
            if (newValue[key].value < newValue[key].min) newValue[key].value = newValue[key].min;
            if (newValue[key].value > newValue[key].max) newValue[key].value = newValue[key].max;
            if (!newValue[key].value) newValue[key].value = newValue[key].min;
          });
        }
      }, true);

      $scope.newData = {};
      $scope.ok = function () {
        $scope.processing = true;
        $scope.newData = {};
        Object.keys($scope.viewData).map(function(key){
          $scope.newData[key] = $scope.viewData[key].value;
        });

        $mwtnCommons.setPtpPort($scope.data, $scope.newData).then(function(success){
          $scope.applied = {text: 'Applied: ' + new Date().toISOString(), class:'mwtnSuccess'};
          $scope.processing = false;
        }, function(error){
          $scope.applied = {text: 'Error: ' + new Date().toISOString(), class:'mwtnError'};
          $scope.processing = false;
          $mwtnLog.error({component: COMPONENT, message: JSON.stringify(error)});
        });

      };
    
      $scope.cancel = function () {
        $uibModalInstance.close($scope.newData);
      };

      // events


    }]);

    mwtnBrowserApp.register.controller('mwtnPtpPortsController', ['$scope', '$filter', '$uibModal', '$mwtnGlobal', '$mwtnCommons', '$mwtnLog',
      function ($scope, $filter, $uibModal, $mwtnGlobal, $mwtnCommons, $mwtnLog) {
        var vm = this;
        var COMPONENT = 'mwtnPtpPortsController';

        $scope.info = false;
        var data = JSON.parse(JSON.stringify($scope.data));
        if (!data) {
          var message = 'No data to be displayed!";'
          $mwtnLog.info({ component: COMPONENT, message: message });
          data = [{'message':message}];
        }

        if ($mwtnGlobal.getType(data) !== 'array')  {
          var message = 'Data must be of type "array"!';
          $mwtnLog.info({ component: COMPONENT, message: message });
          data = [{'message':message}];
        }

        if (data.length === 0)  {
          var message = 'Data list must have at least one entry!';
          $mwtnLog.info({ component: COMPONENT, message: message });
          data = [{'message':message}];
        }

        if ($mwtnGlobal.getType(data[0]) !== 'object')  {
          data = data.map(function(item){
            return {value: item};
          });
        }

        $scope.ptpPorts = [];

        $scope.gridOptions = JSON.parse(JSON.stringify($mwtnCommons.gridOptions));
        $scope.gridOptions.data = 'ptpPorts';
        $scope.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;

        // $scope.getTableHeight = function() {
        //   var rowHeight = 30; 
        //   var headerHeight = 40; 
        //   var maxCount = 12;
        //   var rowCount = $scope.gridOptions.data.length + 2;
        //   if (rowCount > maxCount) {
        //     return {
        //         height: (maxCount * rowHeight + headerHeight) + 'px'
        //     };
        //   }
        //   return {}; // use auto-resize feature
        // };

        var getCellTemplate = function(field) {
          var object = ['transmission-mode-list', 'performance-data'];
          if (object.contains(field)) {
            return ['<div class="ui-grid-cell-contents">',
                    '<i class="fa fa-info-circle pointer" aria-hidden="true"',
                    ' ng-click="grid.appScope.show(grid.getCellValue(row, col))"></i> ',
                    '{{grid.getCellValue(row, col)}}</div>'].join('');
          } else if (field === 'action') {
            return [
              '<a class="vCenter" ng-class="{attention: grid.appScope.hover, hidden: onfAirInterfaceRevision}" >',
              '  <i class="fa fa-pencil-square-o pointer" aria-hidden="true"  ng-click="grid.appScope.show(row.entity)"></i>',
              '</a>' ].join('<span>&nbsp;</span>');
          } else {
            return '<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col)}}</div>';
          }
        };

        $scope.show = function(value){
          var type = $mwtnGlobal.getType(value);
          // if (type === 'object')
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/mwtnBrowser/templates/ptpPortConfigView.tpl.html',
            controller: 'ptpPortConfigViewController',
            size: 'huge',
            resolve: {
              valueData: function () {
                return {networkElement: $scope.networkElement, value:value};
              }
            }
          });
          modalInstance.result.then(function(object) {
            console.warn(JSON.stringify(object));
            $scope.ptpPorts.map(function(row, index){
              if (row['port-number'] === object['port-number']) {
                console.log($scope.ptpPorts[index]['onf-ptp-dataset:master-only']);
                $scope.ptpPorts[index] = object;
                console.log($scope.ptpPorts[index]['onf-ptp-dataset:master-only']);
              };
            });
          }, function () {
              // ignore;
          });
        };

        var enable = data.length > 10;
        $scope.gridOptions.columnDefs = Object.keys(data[0]).map(function (field) {
          var type = $mwtnGlobal.getType(data[0][field]);
          var labelId = $mwtnGlobal.getLabelId(field);
          var displayName = $filter('translate')(labelId);
          var visible = $mwtnGlobal.getVisibilityOf(field);
          if (labelId.contains('$$') || labelId === 'MWTN_SPEC') {
            visible = false;
          }
          return {
            field: field,
            type: type,
            displayName: displayName,
            enableSorting: true,
            enableFiltering: enable,
            headerCellClass: $scope.highlightFilteredHeader,
            cellTemplate: getCellTemplate(field),
            cellClass: type,
            visible: visible
          };
        });
        $scope.gridOptions.columnDefs.push({
            field: 'action',
            displayName: 'Action',
            enableSorting: false,
            enableFiltering: false,
            headerCellClass: $scope.highlightFilteredHeader,
            cellTemplate: getCellTemplate('action'),
            width: 100,
            visible: true,  
            pinnedRight : true

          });
        if ($scope.gridOptions.data.length < 10) {
          $scope.gridOptions.minRowsToShow =  data.length; // 10 is default
        } 
        $scope.ptpPorts = data.map(function(item){
          item.action = '';
          return item;
        });
        // .sort(function(a, b){
        //           if (a.type === 'object') return -1;
        //           if (a.type === 'array' ) return -2;
        //           return 0;
        //         })

        $scope.myClipboard = {
          data: $scope.data,
          supported: true,
          getJson: function () {
            return JSON.stringify(this.data, null, ' ');
          },
          copyToClipboard: function () {
            var message = 'Copied to clipboard! ' + this.getJson();
            $mwtnLog.info({ component: COMPONENT, message: message });
          },
          error: function (err) {
            $mwtnLog.error({ component: COMPONENT, message: err });
          }
        };
    }]);

    mwtnBrowserApp.register.directive('mwtnPtpPorts', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          path: '=',
          networkElement: '='
        },
        controller: 'mwtnPtpPortsController',
        controllerAs: 'vm',
        templateUrl: 'src/app/mwtnBrowser/templates/mwtnPtpPorts.tpl.html'
      };
    });

    mwtnBrowserApp.register.controller('mwtnPtpClockViewerController', ['$scope', '$timeout', '$uibModal', '$mwtnGlobal', '$mwtnCommons', '$mwtnDatabase', '$mwtnLog', '$mwtnBrowser',
      function ($scope, $timeout, $uibModal, $mwtnGlobal, $mwtnCommons, $mwtnDatabase, $mwtnLog, $mwtnBrowser) {
        var vm = this;
        var COMPONENT = 'mwtnPtpClockViewerController';
        if ($scope.data) {
          $scope.replace = false;
          if ($scope.path && $scope.path.endsWith('-configuration') ) {
            $scope.replace = true;
          }
          $scope.viewData = $mwtnGlobal.getViewData($scope.data, $scope.ne);
          var path = [undefined, undefined, undefined];
          if ($scope.path) {
            path = $scope.path.split($mwtnCommons.separator);
          }

          var processData = function(schema) {
            var ordered = {};
            var clone = JSON.parse(JSON.stringify($scope.viewData));
            var keys = Object.keys(clone).map(function(key){
              if ($mwtnGlobal.getType(key) !== 'string') {
                console.log('key', key);
                return;
              }
              var item = clone[key];
              if (!schema[key]) {
                var message = 'No schema information for ' + key;
                $mwtnLog.warning({ component: COMPONENT, message: message });
                item['order-number'] = $mwtnCommons.getOrderNumber(97, item);
                item.description = 'No description available.';
                item.visible = true;
                return key;
              }
              item.unit = schema[key].unit;
              item.description = schema[key].description;
              item['order-number'] = $mwtnCommons.getOrderNumber(schema[key]['order-number'], item);
              if (item.description === undefined || item.description === '') {
                item.description = 'No description available.';
              }
              return key;
            }).sort(function(a,b){
              if (clone[a]['order-number'] < clone[b]['order-number']) return -1;
              if (clone[a]['order-number'] > clone[b]['order-number']) return 1;
              return 0;
            }).map(function(key){
              if ($mwtnGlobal.getType( clone[key].value ) === 'object') {
                Object.keys(clone[key].value).filter(function(subKey){
                  return subKey.endsWith('-identity');
                }).map(function(subKey){
                  var clockId = clone[key].value[subKey];
                  if ($mwtnGlobal.getType(clockId) === 'object') {
                    if (clockId['clock-identity']) {
                      var ascii = clockId['clock-identity'].base64ToHex();
                      clone[key].value[subKey]['clock-identity'] = [clone[key].value[subKey]['clock-identity'], '(ascii:', ascii, ')'].join(' ');
                    }
                  } else {
                    var ascii = clone[key].value[subKey].base64ToHex();
                    clone[key].value[subKey] = [clone[key].value[subKey], '(ascii:', ascii, ')'].join(' ');
                  }
                });
                ordered[key] = clone[key];
              } else {
                ordered[key] = clone[key];
              }
            });
            $scope.info = false;
            if (Object.keys(ordered).length === 0) {
              $scope.info = 'An empty object is displayed. Please check if the NetConf server has send an empty object.';
            }
            return ordered;
          };


          $mwtnDatabase.getSchema().then(function(schema){
            $scope.schema = schema;
            $scope.viewData = processData($scope.schema);
          }, function(error){
            // ignore;
          });
        }

        $scope.show = function(value){
          var type = $mwtnGlobal.getType(value);
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/mwtnBrowser/templates/ptpDefaultDsConfigView.tpl.html',
            controller: 'ptpDefaultDsViewController',
            size: 'huge',
            resolve: {
              defaultDs: function () {
                return {networkElement: $scope.networkElement, value:value};
              }
            }
          });
          modalInstance.result.then(function(object) {
            $mwtnBrowser.refreshPTP();
          }, function () {
              // ignore;
          });
        };
    }]);
    
    mwtnBrowserApp.register.directive('mwtnPtpClockViewer', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          path: '=',
          ne: '=', // flag if ne class
          networkElement: '='
        },
        controller: 'mwtnPtpClockViewerController',
        controllerAs: 'vm',
        templateUrl: 'src/app/mwtnBrowser/templates/mwtnPtpClockViewer.tpl.html'
      };
    });


  mwtnBrowserApp.register.controller('mwtnBrowserCtrl', ['$scope', '$rootScope', '$mwtnLog', '$mwtnCommons', '$mwtnEthernet', '$mwtnBrowser', '$translate', 'OnfNetworkElement', 'PtpClock', 'LogicalTerminationPoint', 
    function($scope, $rootScope, $mwtnLog, $mwtnCommons, $mwtnEthernet, $mwtnBrowser, $translate, OnfNetworkElement, PtpClock, LogicalTerminationPoint) {

    var COMPONENT = 'mwtnBrowserCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnBrowserCtrl started!'});
    $rootScope.section_logo = 'src/app/mwtnBrowser/images/mwtnBrowser.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    var pacTemplate = {
        'layer-protocol': 'unknown'           
    };

    $scope.fcDeletion = {
      nodeId: $scope.networkElementId, 
      ltp:'', 
      info: 'handle with care, no further warning, qualified user expected ;)'
    };
    $scope.deleteForwardingConstruct = function() {
      $scope.fcDeletion.nodeId = $scope.networkElementId;
      $scope.fcDeletion.info = 'Processing ...';
      $scope.fcDeletion.error = undefined;
      if ($scope.fcDeletion.ltp === undefined || $scope.fcDeletion.ltp === '') {
        $scope.fcDeletion.error = 'Please select a valid LTP#1.!';
        return;
      }
      $mwtnEthernet.deleteForwardingConstruct($scope.fcDeletion).then(function(success){
        console.log(success);
        $scope.fcDeletion.info = success;
      }, function(error){
        console.log(error);
        $scope.fcDeletion.error = error;
      });
    }

    $scope.fcCreation = {
      nodeId: $scope.networkElementId, 
      ltp1:'', 
      ltp2:'', 
      vlan:42, 
      info:'handle with care, no further warning, qualified user expected ;)'
    };
    $scope.createForwardingConstruct = function() {
      console.warn(JSON.stringify($scope.networkElementId));
      console.warn(JSON.stringify($scope.networkElement));
      $scope.fcCreation.nodeId = $scope.networkElementId;
      $scope.fcCreation.info = 'Processing ...';
      $scope.fcCreation.error = undefined;
      if ($scope.fcCreation.ltp1 === undefined || $scope.fcCreation.ltp1 === '') {
        $scope.fcCreation.error = 'Please select a valid LTP#1!';
        return;
      }
      if ($scope.fcCreation.ltp2 === undefined || $scope.fcCreation.ltp2 === '') {
        $scope.fcCreation.error = 'Please select a valid LTP#2!';
        return;
      }
      if ($scope.fcCreation.vlan === undefined) {
        $scope.fcCreation.error = 'Please select a valid vlan-id!';
        return;
      }
      if ($scope.fcCreation.ltp1 === $scope.fcCreation.ltp2) {
        $scope.fcCreation.error = 'Please select different LTPs. Loopback is not supported yet!';
        return;
      }
      $mwtnEthernet.createForwardingConstruct($scope.fcCreation).then(function(success){
        console.log(success);
        $scope.fcCreation.info = success;
      }, function(error){
        console.log(error);
        $scope.fcCreation.error = error;
      });
    }

    // get important infromation from yang modules
    console.error('help');
    $mwtnBrowser.getModules().then(function(success){

      var pacOrder = [
        'onf-otn-odu-conditional-packages:otn-odu-termination-pac',
        'onf-otn-odu-conditional-packages:otn-odu-connection-pac',
        'onf-ethernet-conditional-packages:ethernet-pac',
        'microwave-model:mw-air-interface-diversity-pac',
        'microwave-model:mw-air-interface-hsb-end-point-pac',
        'microwave-model:mw-air-interface-hsb-fc-switch-pac',
        'onf-core-model-conditional-packages:holder-pac',
        'onf-core-model-conditional-packages:connector-pac',
        'onf-core-model-conditional-packages:equipment-pac',
        'microwave-model:mw-ethernet-container-pac',
        'MicrowaveModel-ObjectClasses-EthernetContainer:MW_EthernetContainer_Pac',
        'microwave-model:mw-ethernet-container-pac',
        'microwave-model:mw-tdm-container-pac',
        'microwave-model:mw-pure-ethernet-structure-pac',
        'microwave-model:mw-hybrid-mw-structure-pac',
        'MicrowaveModel-ObjectClasses-PureEthernetStructure:MW_PureEthernetStructure_Pac',
        'microwave-model:mw-air-interface-pac',
        'MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac'
      ];

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
            if (!pacOrder.indexOf(a)) console.warn(a);
            if (!pacOrder.indexOf(b)) console.warn(b);
            if(pacOrder.indexOf(a) > pacOrder.indexOf(b)) return 1;
            if(pacOrder.indexOf(a) < pacOrder.indexOf(b)) return -1;
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
    }, function(error){
      $scope.modules = undefined;
      $scope.orderedPacs = undefined;
      $scope.parts = undefined;
    });
            
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
        case '2017-10-20':
        // console.log(JSON.stringify(data));        
          $scope.onfNetworkElement = new OnfNetworkElement(data['network-element']);
          var fd = $scope.onfNetworkElement.getForwardingDomain();
          $scope.forwardingDomain = undefined;
          $scope.forwardingConstructs = undefined;
          if (fd && fd.length > 0) {
            $scope.forwardingDomain = fd[0]; // $mwtnBrowser.getViewData(fd[0]);
            $scope.forwardingConstructs = [];
            if (fd[0].fc) {
              fd[0].fc.map(function(id){
                $mwtnBrowser.getForwardingConstruct($scope.networkElement, id).then(function(fc){

                  // TODO make robust
                  if (fc['forwarding-construct'] && fc['forwarding-construct'][0]) {
                    var item = fc['forwarding-construct'][0];
                    if (item['fc-port'] && 
                        item['fc-port'][0] && item['fc-port'][0].ltp && item['fc-port'][0].ltp[0]  && 
                        item['fc-port'][1] && item['fc-port'][1].ltp && item['fc-port'][1].ltp[0]) {
                      $scope.forwardingConstructs.push( {
                        uuid: item.uuid,
                        'fc-port#1': $scope.onfNetworkElement.getLtp( item['fc-port'][0].ltp[0] ).getLabel(),
                        'fc-port#2': $scope.onfNetworkElement.getLtp( item['fc-port'][1].ltp[0] ).getLabel()
                      });
                    }
                  }
                });
              });
            }
          }
          $scope.onfLtps = $scope.onfNetworkElement.getLogicalTerminationPoints();
          // $scope.onfNetworkElement.ltp = undefined;
          break;
        default:
          $mwtnLog.info({component: COMPONENT, message: ['The ONF CoreModel revision', $scope.mountpoint.onfCoreModelRevision, ' is not supported (yet)!'].join(' ')});
          $scope.onfNetworkElement = {};
          $scope.onfLtps = {};
      }
      
      var order = $mwtnBrowser.layerProtocolNameOrder;
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
              console.error(conditionalPackage, JSON.stringify(template));
            } else {
              $mwtnLog.info({component: COMPONENT, message: 'No conditional package for  ' + ltp.getLabel() });
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
      if (data && data['network-element-current-problems'] && data['network-element-current-problems']['current-problem-list'] ) {
          data.revision = undefined;
          $scope.neCurrentProblems = data['network-element-current-problems']['current-problem-list'];
      } else {
          $scope.neCurrentProblems = [];
      }
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
          pac[localName] = {id:$mwtnBrowser.getPartGlobalId(spec, localName),localName: localName, data:'No data available'}
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
        conditionalPackage[$mwtnBrowser.getPartLocalId(spec)].data = data[$mwtnBrowser.yangify(spec.partId)];
      });
    };

    var updatePart = function(spec, data) {
      switch (spec.pacId) {
        case 'ne':
          updateNe(data);
          break;
        case 'forwardingDomain':
          // TODO $scope.forwardingDomain = new ForwardingDomain(data);
          break;
        case 'neCurrentProblems':
          updateNetworkElementCurrentProblems(data);
          break;
        case 'clock':
          if (data) {
            $scope.clock = new PtpClock(data);
          } else {
            $scope.clock = undefined;
          }
          break;
        case 'ltp':
          updateLtp(data);
          break;
        case 'airinterface':
          console.warn(JSON.stringify(spec, JSON.stringify(data)));
          updateAirInterface(spec.layerProtocolId, spec.partId, data);
          break;
        case 'structure':
          console.warn(JSON.stringify(data));
          updateStructure(spec.layerProtocolId, spec.partId, data);
          break;
        case 'container':
          console.warn(JSON.stringify(data));
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
    $scope.separator = $mwtnBrowser.separator; //'&nbsp;'

    $scope.collapseAll = function() {
      // close all groups
      Object.keys($scope.status).map(function(group){
        $scope.status[group] = false;
      });
      Object.keys($scope.spinner).map(function(group){
        $scope.spinner[group] = false;
      });
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
        $mwtnBrowser.getPacParts(spec).then(function(success){
          success = $mwtnBrowser.yangifyObject(success)
          updatePart(spec, success);
          $scope.spinner[key] = false;
        }, function(error){
          updatePart(spec, error);
          $scope.spinner[key] = false;
        });
      });
    }, true);

    $scope.$watch('networkElement', function(neId, oldValue) {
      if (neId && neId !== '' && neId !== oldValue) {

        $scope.collapseAll();
        
        // clear old data
        $scope.airinterfaces = [];
        $scope.structures = [];
        $scope.containers = [];
        $scope.onfLtps = [];
        $scope.clock = undefined;

        $scope.networkElementId = neId;
        $scope.revision = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === neId;
        }).map(function(mountpoint){
          $scope.mountpoint = mountpoint;
          return mountpoint.onfCoreModelRevision;
        })[0];

        var spec = {
          nodeId: $scope.networkElementId,
          revision: $scope.revision,
          pacId: 'ne'
        };
        $mwtnBrowser.getPacParts(spec).then(function(success){
          updatePart(spec, $mwtnBrowser.yangifyObject(success));
        }, function(error){
          updatePart(spec, error);
        });

        // network element alarms
        var neAlarms = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === neId;
        }).map(function(mountpoint){
          return mountpoint.onfCapabilities.filter(function(cap){
            return cap.module === 'MicrowaveModel-NetworkElement-CurrentProblemList' || cap.module === 'onf-core-model-conditional-packages';
          });
        });
        
        if (neAlarms.length === 1 && neAlarms[0].length === 1 ) {
          $translate('MWTN_LOADING').then(function (translation) {
            $scope.neCurrentProblems = translation;
          });
        } else {
          $scope.neCurrentProblems = undefined;
        }

        // ptp-clock
        var ptpClock = $scope.mountPoints.filter(function(mountpoint){
          return mountpoint['node-id'] === neId;
        }).map(function(mountpoint){
          return mountpoint.onfCapabilities.filter(function(cap){
            return cap.module === 'onf-ptp-dataset';
          });
        });
        if (ptpClock.length === 1 && ptpClock[0].length === 1 ) {
          $translate('MWTN_LOADING').then(function (translation) {
            $scope.clock = {'translation': translation};
          });
        } else {
          $scope.clock = undefined;
        }
        
      }
    });

  }]);

});
