/*
 * @copyright 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * @license 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTdm/mwtnTdm.module',
  'app/mwtnTdm/mwtnTdm.services'],
  function (mwtnTdmApp) {

    mwtnTdmApp.register.controller('mwtnTdmCtrl', ['$scope', '$rootScope', '$timeout', '$mwtnLog', '$mwtnTdm', '$translate', 'OnfNetworkElement', 'uiGridConstants', 
      function ($scope, $rootScope, $timeout, $mwtnLog, $mwtnTdm, $translate, OnfNetworkElement, uiGridConstants) {

        var COMPONENT = 'mwtnTdmCtrl';
        $rootScope.section_logo = 'src/app/mwtnTdm/images/mwtnTdm.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
 
        $scope.highlightFilteredHeader = $mwtnTdm.highlightFilteredHeader;
        $scope.gridOptions = JSON.parse(JSON.stringify($mwtnTdm.gridOptions));
        $scope.gridOptions.onRegisterApi = function (gridApi) {
          $scope.gridApi = gridApi;
        };
        $scope.gridOptions.columnDefs = [
          // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
          { field: 'nodeId', type: 'string', displayName: 'Node', headerCellClass: $scope.highlightFilteredHeader, width: 200 },
          { field: 'layer', type: 'string', displayName: 'Layer', headerCellClass: $scope.highlightFilteredHeader, width: 100 },
          { field: 'ltpRef', type: 'string', displayName: 'Logical termiantion point', headerCellClass: $scope.highlightFilteredHeader, width: 300 },
          { field: 'reserved', type: 'number', displayName: 'Reserved E1', headerCellClass: $scope.highlightFilteredHeader, width: 150, cellClass: 'number' },
          { field: 'configured', type: 'number', displayName: 'Configured E1', headerCellClass: $scope.highlightFilteredHeader, width: 150, cellClass: 'number' },
          { field: 'utilization', type: 'number', displayName: 'Utilization [%]', headerCellClass: $scope.highlightFilteredHeader, width: 150, cellClass: 'number', sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          } }
        ];

        $scope.gridOptions.data = [];

        var getUtilization = function(row) {
          if (row.reserved === '?' || row.configured === '?'  || row.reserved < 1) {
            return '?';
          }
          return (( row.configured / row.reserved ) * 100).toFixed(2);
        };

        var cleanProgess = function() {
          $scope.progress = {
              show: false,
              max: 0,
              value: 0
          };
        };
        cleanProgess();

        var cleanMessage = function() {
          $scope.message = {
            error: undefined,
            show: true,
            startTime: undefined,
            endTime: undefined,
            duration: undefined
          };
        };
        
        var finish = function() {
          $scope.message.endTime = new Date().toISOString();
          $scope.message.duration = ((new Date($scope.message.endTime) - new Date($scope.message.startTime))/1000).toFixed(1) + 's';
          $scope.gridOptions.columnDefs.filter(function(column){
            return column.field === 'utilization';
          }).map(function(column){
            column.sort.direction = uiGridConstants.ASC;
            $scope.gridApi.core.refresh();
          });
          $timeout(cleanProgess, 1000);
        };
        $scope.scan = function() {
          cleanMessage();
          $scope.progress.show = true;
          $scope.message.startTime = new Date().toISOString();

          $mwtnTdm.getMountPoints().then(function (mountpoints) {
            $scope.gridOptions.data = [];
            if (mountpoints.length === 0) {
              $timeout(cleanProgess, 1000);
            }
            mountpoints.filter(function (mountpoint) {
              return mountpoint['netconf-node-topology:connection-status'] === 'connected';
            }).map(function (mountpoint) {
              $mwtnTdm.getActualNetworkElement(mountpoint['node-id'], '2017-03-24').then(function (success) {
                var onfNetworkElement = new OnfNetworkElement(success['network-element']);
                var tdmLtps = onfNetworkElement.getLTPMwsList().filter(function (ltp) {
                  return ltp.getConditionalPackages()[0].contains('hybrid');
                }).map(function (ltp) {
                  $scope.progress.max = $scope.progress.max + 1;
                  var row = {
                    ltpId: [ltp.getId(), onfNetworkElement.getId()].join('@'),
                    nodeId: onfNetworkElement.getName(),
                    layer: 'MWS',
                    ltpRef: ltp.getLabel(),
                    reserved: '?',
                    configured: '?',
                    utilization: '?'
                  };

                  var specConfig = {
                    nodeId: mountpoint['node-id'],
                    revision: '2017-03-24',
                    pacId: 'microwave-model:mw-hybrid-mw-structure-pac',
                    layerProtocolId: ltp.getLayerProtocols()[0].getId(),
                    partId: 'hybrid-mw-structure-configuration'
                  };
                  $mwtnTdm.getPacParts(specConfig).then(function(success){
                    success = $mwtnTdm.yangifyObject(success);
                    row.reserved = success['hybrid-mw-structure-configuration']['number-of-tdm-segments-to-be-reserved'];
                    row.utilization = getUtilization(row);
                  }, function(error){
                    // ignore
                  });

                  var specStatus = {
                    nodeId: mountpoint['node-id'],
                    revision: '2017-03-24',
                    pacId: 'microwave-model:mw-hybrid-mw-structure-pac',
                    layerProtocolId: ltp.getLayerProtocols()[0].getId(),
                    partId: 'hybrid-mw-structure-status'
                  };
                  $mwtnTdm.getPacParts(specStatus).then(function(success){
                    success = $mwtnTdm.yangifyObject(success);
                    row.configured = success['hybrid-mw-structure-status']['segment-status-list'].filter(function(item){
                      return item['segment-is-reserved-for-tdm'] === true;
                    }).length;
                    row.utilization = getUtilization(row);
                    $scope.progress.value = $scope.progress.value + 1;
                    if ($scope.progress.max === $scope.progress.value) {
                      finish();
                    }
                  }, function(error){
                    // ignore
                  });

                  $scope.gridOptions.data.push(row);
                });
                console.warn(JSON.stringify(tdmLtps));
                if (tdmLtps.length === 0 && $scope.progress.max === $scope.progress.value) {
                  finish();
                }
              });
            }, function (error) {
              $scope.gridOptions.data = [];
            });

          });
        };
        $scope.scan();

      }]);

  });
