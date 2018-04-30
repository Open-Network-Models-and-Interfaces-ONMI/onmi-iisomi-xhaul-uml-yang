/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnPerformanceLink/mwtnPerformanceLink.module',
  'app/mwtnPerformanceLink/mwtnPerformanceLink.services'],
  function (mwtnPerformanceLinkApp) {

    mwtnPerformanceLinkApp.register.controller('mwtnPerformanceLinkCtrl', ['$scope', '$rootScope', '$window', '$translate', '$mwtnLog', '$mwtnPerformanceLink', 'uiGridConstants',
      function ($scope, $rootScope, $window, $translate, $mwtnLog, $mwtnPerformanceLink, uiGridConstants) {

        var COMPONENT = 'mwtnPerformanceLink';
        $mwtnLog.info({ component: COMPONENT, message: 'mwtn Link Performance started!' });

        $rootScope.section_logo = 'src/app/mwtnPerformanceLink/images/mwtnPerformance.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
    
        var globalFilter;

        //time selector
        $scope.timePeriod = "15 minutes";
        $scope.timePeriods = ["15 minutes", "24 hours"];

        //interface selector
        $scope.selectedLtpIdA = 'Select LTP';
        $scope.selectedLtpIdB = 'Select LTP';
        $scope.availableLtpIdsA = ['Select LTP'];
        $scope.availableLtpIdsB = ['Select LTP'];

        var formatTimeStamp = function(timeStamp) {
          var result = $mwtnPerformanceLink.formatTimeStamp(timeStamp);
          // 2017-06-22 14:52:21.0 UTC -> 2017-06-22 14:52 UTC
          var array = result.split(' ');
          if (array && array.length === 3) {
            result = [array[0], array[1].slice(0,-5), array[2]].join(' ');
          }
          return result;
        };

        var initNodeList = function (nodes) {
          $scope.networkElements = [];
          nodes.map(function (ne) {
            // revision detection should go to commons
            if (ne['netconf-node-topology:connection-status'] === 'connected' && ne['netconf-node-topology:available-capabilities'] && ne['netconf-node-topology:available-capabilities']['available-capability']) {
              ne['netconf-node-topology:available-capabilities']['available-capability'].map(function (cap) {
                if (cap.contains('CoreModel-CoreNetworkModule-ObjectClasses')) {
                  ne.onfCoreModelRevision = cap.split('?revision=')[1].substring(0, 10);
                } else if (cap.contains('MicrowaveModel-ObjectClasses-AirInterface')) {
                  ne.onfAirInterfaceRevision = cap.split('?revision=')[1].substring(0, 10);
                } else if (!ne.onfAirInterfaceRevision && cap.contains('MicrowaveModel-ObjectClasses')) {
                  ne.onfAirInterfaceRevision = cap.split('?revision=')[1].substring(0, 10);
                }
              });
              if (ne.onfAirInterfaceRevision) {
                $scope.networkElements.push({ id: ne['node-id'], revision: ne.onfAirInterfaceRevision });
              }
            }
          });
          $scope.networkElements.sort(function (a, b) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });

          // select one of the nodes
          // var select = parseInt(Math.random() * $scope.networkElements.length);
          // $scope.networkElementA = $scope.networkElements[select].id;
          // $scope.networkElementB = $scope.networkElements[select].id;
        };

        var initLinkIds = function () {
          var functionId = 'sdnperformance';
          var docType = 'historicalperformance15min';
          if ($scope.timePeriod !== $scope.timePeriods[0]) {
            docType = 'historicalperformance24h';
          }
          var aggregations = {
            "size":0,
            "aggregations": {
              "radio-signal-id": {
                "terms": {
                  "field": "radio-signal-id"
                }
              }
            }
          };
          $mwtnPerformanceLink.getAggregations(functionId, docType, aggregations).then(function (success) {
            $scope.linkIds = success.data.aggregations['radio-signal-id'].buckets.map(function(bucket){
              return bucket.key;
            });
          }, function (error) {
            console.log(error);
            $scope.linkIds = [];
          });
        };

        $mwtnPerformanceLink.getMountPoints().then(function (mountpoints) {
          initNodeList(mountpoints);
          initLinkIds();
        }, function (error) {
          $scope.networkElements = [];
        });

        //table stuff

        //data visible on screen
        $scope.performance826 = [];
        $scope.receiveLevel = [];
        $scope.transmissionLevel = [];
        $scope.modulation = [];
        $scope.temperature = [];
        $scope.snir = [];
        $scope.crossPolarDiscrimination = [];

        $scope.paginationOptions = {
          pageNumber: 1,
          pageSize: 2,
          sort: null
        };

        //page sizes, based on time period
        $scope.pageSizes = function () {
          var arr;
          if ($scope.timePeriod && $scope.timePeriod === "15 minutes") {

            arr = [96, (96 * 2), (96 * 7)];

          } else {
            arr = [7, 30, (30 * 3), (30 * 6), (30 * 12)];
          }
          return arr;
        };

        //init page sizes
        $scope.selectPageSize = function () {

          if ($scope.timePeriod && $scope.timePeriod === "15 minutes") {

            return 96;

          } else {
            return 7;
          }

        };

        $scope.itemsMessage = function () {
          if ($scope.timePeriod && $scope.timePeriod === "15 minutes") {
            return "15 minutes items per page";
          } else {
            return "24 hours items per page";
          }
        };


        $scope.paginationStatusMessage = function (grid) {
          if (grid === 'receiveLevel') {
            let start = ($scope.gridOptionsReceiveLevel.paginationCurrentPage - 1) * $scope.gridOptionsReceiveLevel.paginationPageSize + 1;
            let end = ($scope.gridOptionsReceiveLevel.paginationCurrentPage - 1) * $scope.gridOptionsReceiveLevel.paginationPageSize + 1 + $scope.receiveLevel.length - 1;
            let total = $scope.gridOptionsReceiveLevel.totalItems;
            let message = "Showing {0} to {1} of {2} items";
            return message.format(start, end, total);
          }
          else if (grid === 'transmissionLevel') {
            let start = ($scope.gridOptionsTransmissionLevel.paginationCurrentPage - 1) * $scope.gridOptionsTransmissionLevel.paginationPageSize + 1;
            let end = ($scope.gridOptionsTransmissionLevel.paginationCurrentPage - 1) * $scope.gridOptionsTransmissionLevel.paginationPageSize + 1 + $scope.transmissionLevel.length - 1;
            let total = $scope.gridOptionsTransmissionLevel.totalItems;
            let message = "Showing {0} to {1} of {2} items";
            return message.format(start, end, total);
          }
          else if (grid === 'modulation') {
            let start = ($scope.gridOptionsModulation.paginationCurrentPage - 1) * $scope.gridOptionsModulation.paginationPageSize + 1;
            let end = ($scope.gridOptionsModulation.paginationCurrentPage - 1) * $scope.gridOptionsModulation.paginationPageSize + 1 + $scope.modulation.length - 1;
            let total = $scope.gridOptionsModulation.totalItems;
            let message = "Showing {0} to {1} of {2} items";
            return message.format(start, end, total);

          } else if (grid === 'temperature') {
            let start = ($scope.gridOptionsTemperature.paginationCurrentPage - 1) * $scope.gridOptionsTemperature.paginationPageSize + 1;
            let end = ($scope.gridOptionsTemperature.paginationCurrentPage - 1) * $scope.gridOptionsTemperature.paginationPageSize + 1 + $scope.temperature.length - 1;
            let total = $scope.gridOptionsTemperature.totalItems;
            let message = "Showing {0} to {1} of {2} items";
            return message.format(start, end, total);

          } else if (grid === 'snir') {
            let start = ($scope.gridOptionsSnir.paginationCurrentPage - 1) * $scope.gridOptionsSnir.paginationPageSize + 1;
            let end = ($scope.gridOptionsSnir.paginationCurrentPage - 1) * $scope.gridOptionsSnir.paginationPageSize + 1 + $scope.snir.length - 1;
            let total = $scope.gridOptionsSnir.totalItems;
            let message = "Showing {0} to {1} of {2} items";
            return message.format(start, end, total);

          } else if (grid === 'crossPolarDiscrimination') {
            let start = ($scope.gridOptionsCrossPolarDiscrimination.paginationCurrentPage - 1) * $scope.gridOptionsCrossPolarDiscrimination.paginationPageSize + 1;
            let end = ($scope.gridOptionsCrossPolarDiscrimination.paginationCurrentPage - 1) * $scope.gridOptionsCrossPolarDiscrimination.paginationPageSize + 1 + $scope.crossPolarDiscrimination.length - 1;
            let total = $scope.gridOptionsCrossPolarDiscrimination.totalItems;
            let message = "Showing {0} to {1} of {2} items";
            return message.format(start, end, total);
          }
        };

        //seek page based on grid
        $scope.seekPage = function (page, grid) {
          if (!page) {
            page = 1;
            return;
          }
          switch (grid) {
            case 'receiveLevel': $scope.recvGridApi.pagination.seek(parseInt(page));
              break;

            case 'transmissionLevel': $scope.transmissionGridApi.pagination.seek(parseInt(page));
              break;

            case 'modulation': $scope.gridApi.pagination.seek(parseInt(page));
              break;

            case 'temperature': $scope.gridTemperatureApi.pagination.seek(parseInt(page));
              break;

            case 'snir': $scope.gridSNIRApi.pagination.seek(parseInt(page));
              break;

            case 'crossPolarDiscrimination': $scope.gridXpdApi.pagination.seek(parseInt(page));
              break;
          }

        };
        //table configuration

        //receive lvl configuration
        $scope.gridOptionsReceiveLevel = {
          paginationPageSizes: $scope.pageSizes(),
          paginationPageSize: $scope.selectPageSize(),
          useExternalPagination: true,
          enablePaginationControls: false,
          enableFiltering: false,
          enableSorting: false,
          enableGridMenu: true,
          columnDefs: [
            { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
            { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
            { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
            { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
            { field: 'timestamp', type: 'string', displayName: 'End time', width: 200 },
            { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
            { field: 'rxmina', type: 'string', displayName: 'Rx min A', width: 90 },
            { field: 'rxavga', type: 'string', displayName: 'Rx avg A', width: 90 },
            { field: 'rxmaxa', type: 'string', displayName: 'Rx max A', width: 90 },
            { field: 'rxminb', type: 'string', displayName: 'Rx min B', width: 90 },
            { field: 'rxavgb', type: 'string', displayName: 'Rx avg B', width: 90 },
            { field: 'rxmaxb', type: 'string', displayName: 'Rx max B', width: 90 }
          ],
          data: 'receiveLevel',
          onRegisterApi: function (gridApi) {
            $scope.recvGridApi = gridApi;
            $scope.recvGridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.paginationOptions.pageNumber = newPage;
              $scope.paginationOptions.pageSize = pageSize;
              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, "receiveLevel");
            });
          }
        };

        $scope.gridOptionsTransmissionLevel = {
          paginationPageSizes: $scope.pageSizes(),
          paginationPageSize: $scope.selectPageSize(),
          useExternalPagination: true,
          enablePaginationControls: false,
          enableFiltering: false,
          enableSorting: false,
          enableGridMenu: true,
          columnDefs: [
            { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
            { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
            { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
            { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
            { field: 'timestamp', type: 'string', displayName: 'End time', width: 200 },
            { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
            { field: 'txmina', type: 'string', displayName: 'Tx min A', width: 90 },
            { field: 'txavga', type: 'string', displayName: 'Tx avg A', width: 90 },
            { field: 'txmaxa', type: 'string', displayName: 'Tx max A', width: 90 },
            { field: 'txminb', type: 'string', displayName: 'Tx min B', width: 90 },
            { field: 'txavgb', type: 'string', displayName: 'Tx avg B', width: 90 },
            { field: 'txmaxb', type: 'string', displayName: 'Tx max B', width: 90 }
          ],
          data: 'transmissionLevel',
          onRegisterApi: function (gridApi) {
            $scope.transmissionGridApi = gridApi;
            $scope.transmissionGridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.paginationOptions.pageNumber = newPage;
              $scope.paginationOptions.pageSize = pageSize;
              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, "transmissionLevel");
            });
          }
        };

        $scope.gridOptionsModulation = {
          paginationPageSizes: $scope.pageSizes(),
          paginationPageSize: $scope.selectPageSize(),
          useExternalPagination: true,
          enablePaginationControls: false,
          enableFiltering: false,
          enableSorting: false,
          enableGridMenu: true,
          columnDefs: [
            { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
            { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
            { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
            { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
            { field: 'timestamp', type: 'string', displayName: 'End time', width: 200 },
            { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
            { field: 'time2Sa', type: 'string', displayName: 'QAM2S A', width: 90 },
            { field: 'time2a', type: 'string', displayName: 'QAM2 A', width: 90 },
            { field: 'time2La', type: 'string', displayName: 'QAM2L A', width: 90 },
            { field: 'time4Sa', type: 'string', displayName: 'QAM4S A', width: 90 },
            { field: 'time4a', type: 'string', displayName: 'QAM4 A', width: 90 },
            { field: 'time4La', type: 'string', displayName: 'QAM4L A', width: 90 },
            { field: 'time16Sa', type: 'string', displayName: 'QAM16S A', width: 90 },
            { field: 'time16a', type: 'string', displayName: 'QAM16 A', width: 90 },
            { field: 'time16La', type: 'string', displayName: 'QAM16L A', width: 90 },
            { field: 'time32Sa', type: 'string', displayName: 'QAM32S A', width: 90 },
            { field: 'time32a', type: 'string', displayName: 'QAM32 A', width: 90 },
            { field: 'time32La', type: 'string', displayName: 'QAM32L A', width: 90 },
            { field: 'time64Sa', type: 'string', displayName: 'QAM64S A', width: 90 },
            { field: 'time64a', type: 'string', displayName: 'QAM64 A', width: 90 },
            { field: 'time64La', type: 'string', displayName: 'QAM64L A', width: 90 },
            { field: 'time128Sa', type: 'string', displayName: 'QAM128S A', width: 90 },
            { field: 'time128a', type: 'string', displayName: 'QAM128 A', width: 90 },
            { field: 'time128La', type: 'string', displayName: 'QAM128L A', width: 90 },
            { field: 'time256Sa', type: 'string', displayName: 'QAM256S A', width: 90 },
            { field: 'time256a', type: 'string', displayName: 'QAM256 A', width: 90 },
            { field: 'time256La', type: 'string', displayName: 'QAM256L A', width: 90 },
            { field: 'time512Sa', type: 'string', displayName: 'QAM512S A', width: 90 },
            { field: 'time512a', type: 'string', displayName: 'QAM512 A', width: 90 },
            { field: 'time512La', type: 'string', displayName: 'QAM512L A', width: 90 },
            { field: 'time1024Sa', type: 'string', displayName: 'QAM1024S A', width: 90 },
            { field: 'time1024a', type: 'string', displayName: 'QAM1024 A', width: 90 },
            { field: 'time1024La', type: 'string', displayName: 'QAM1024L A', width: 90 },
            { field: 'time2048Sa', type: 'string', displayName: 'QAM2048S A', width: 90 },
            { field: 'time2048a', type: 'string', displayName: 'QAM2048 A', width: 90 },
            { field: 'time2048La', type: 'string', displayName: 'QAM2048L A', width: 90 },
            { field: 'time4096Sa', type: 'string', displayName: 'QAM4096S A', width: 90 },
            { field: 'time4096a', type: 'string', displayName: 'QAM4096 A', width: 90 },
            { field: 'time4096La', type: 'string', displayName: 'QAM4096L A', width: 90 },
            { field: 'time8192Sa', type: 'string', displayName: 'QAM8192S A', width: 90 },
            { field: 'time8192a', type: 'string', displayName: 'QAM8192 A', width: 90 },
            { field: 'time8192La', type: 'string', displayName: 'QAM8192L A', width: 90 },

            { field: 'time2Sb', type: 'string', displayName: 'QAM2S B', width: 90 },
            { field: 'time2b', type: 'string', displayName: 'QAM2 B', width: 90 },
            { field: 'time2Lb', type: 'string', displayName: 'QAM2L B', width: 90 },
            { field: 'time4Sb', type: 'string', displayName: 'QAM4S B', width: 90 },
            { field: 'time4b', type: 'string', displayName: 'QAM4 B', width: 90 },
            { field: 'time4Lb', type: 'string', displayName: 'QAM4L B', width: 90 },
            { field: 'time16Sb', type: 'string', displayName: 'QAM16S B', width: 90 },
            { field: 'time16b', type: 'string', displayName: 'QAM16 B', width: 90 },
            { field: 'time16Lb', type: 'string', displayName: 'QAM16L B', width: 90 },
            { field: 'time32Sb', type: 'string', displayName: 'QAM32S B', width: 90 },
            { field: 'time32b', type: 'string', displayName: 'QAM32 B', width: 90 },
            { field: 'time32Lb', type: 'string', displayName: 'QAM32L B', width: 90 },
            { field: 'time64Sb', type: 'string', displayName: 'QAM64S B', width: 90 },
            { field: 'time64b', type: 'string', displayName: 'QAM64 B', width: 90 },
            { field: 'time64Lb', type: 'string', displayName: 'QAM64L B', width: 90 },
            { field: 'time128Sb', type: 'string', displayName: 'QAM128S B', width: 90 },
            { field: 'time128b', type: 'string', displayName: 'QAM128 B', width: 90 },
            { field: 'time128Lb', type: 'string', displayName: 'QAM128L B', width: 90 },
            { field: 'time256Sb', type: 'string', displayName: 'QAM256S B', width: 90 },
            { field: 'time256b', type: 'string', displayName: 'QAM256 B', width: 90 },
            { field: 'time256Lb', type: 'string', displayName: 'QAM256L B', width: 90 },
            { field: 'time512Sb', type: 'string', displayName: 'QAM512S B', width: 90 },
            { field: 'time512b', type: 'string', displayName: 'QAM512 B', width: 90 },
            { field: 'time512Lb', type: 'string', displayName: 'QAM512L B', width: 90 },
            { field: 'time1024Sb', type: 'string', displayName: 'QAM1024S B', width: 90 },
            { field: 'time1024b', type: 'string', displayName: 'QAM1024 B', width: 90 },
            { field: 'time1024Lb', type: 'string', displayName: 'QAM1024L B', width: 90 },
            { field: 'time2048Sb', type: 'string', displayName: 'QAM2048S B', width: 90 },
            { field: 'time2048b', type: 'string', displayName: 'QAM2048 B', width: 90 },
            { field: 'time2048Lb', type: 'string', displayName: 'QAM2048L B', width: 90 },
            { field: 'time4096Sb', type: 'string', displayName: 'QAM4096S B', width: 90 },
            { field: 'time4096b', type: 'string', displayName: 'QAM4096 B', width: 90 },
            { field: 'time4096Lb', type: 'string', displayName: 'QAM4096L B', width: 90 },
            { field: 'time8192Sb', type: 'string', displayName: 'QAM8192S B', width: 90 },
            { field: 'time8192b', type: 'string', displayName: 'QAM8192 B', width: 90 },
            { field: 'time8192Lb', type: 'string', displayName: 'QAM8192L B', width: 90 }
          ],
          data: 'modulation',
          onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.paginationOptions.pageNumber = newPage;
              $scope.paginationOptions.pageSize = pageSize;
              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, "modulation");
            });
          }
        };

        $scope.gridOptionsTemperature = {
          paginationPageSizes: $scope.pageSizes(),
          paginationPageSize: $scope.selectPageSize(),
          useExternalPagination: true,
          enablePaginationControls: false,
          enableFiltering: false,
          enableSorting: false,
          enableGridMenu: true,
          columnDefs: [
            { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
            { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
            { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
            { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
            { field: 'timestamp', type: 'string', displayName: 'End time', width: 200 },
            { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
            { field: 'rfTempMina', type: 'string', displayName: 'Rf Temp Min A  [&deg;C]', width: 90 },
            { field: 'rfTempAvga', type: 'string', displayName: 'Rf Temp Avg A[&deg;C]', width: 90 },
            { field: 'rfTempMaxa', type: 'string', displayName: 'Rf Temp Max A  [&deg;C]', width: 90 },
            { field: 'rfTempMinb', type: 'string', displayName: 'Rf Temp Min B [&deg;C]', width: 90 },
            { field: 'rfTempAvgb', type: 'string', displayName: 'Rf Temp Avg B [&deg;C]', width: 90 },
            { field: 'rfTempMaxb', type: 'string', displayName: 'Rf Temp Max B [&deg;C]', width: 90 }

          ],
          data: 'temperature',
          onRegisterApi: function (gridApi) {
            $scope.gridTemperatureApi = gridApi;
            $scope.gridTemperatureApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.paginationOptions.pageNumber = newPage;
              $scope.paginationOptions.pageSize = pageSize;
              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, "temperature");
            });
          }
        };

        $scope.gridOptionsSnir = {
          paginationPageSizes: $scope.pageSizes(),
          paginationPageSize: $scope.selectPageSize(),
          useExternalPagination: true,
          enablePaginationControls: false,
          enableFiltering: false,
          enableSorting: false,
          enableGridMenu: true,
          columnDefs: [
            { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
            { field: 'id', type: 'string', displayName: 'Termination point', width: 200, visible: false },
            { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
            { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
            { field: 'timestamp', type: 'string', displayName: 'End time', width: 200 },
            { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
            { field: 'snirMin', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MIN'), 'A', '[dB]'].join(' '), width: 90 },
            { field: 'snirAvg', type: 'string', displayName: [$translate.instant('MWTN_SNIR_AVG'), 'A', '[dB]'].join(' '), width: 90 },
            { field: 'snirMax', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MAX'), 'A', '[dB]'].join(' '), width: 90 },
            { field: 'snirMin', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MIN'), 'B', '[dB]'].join(' '), width: 90 },
            { field: 'snirAvg', type: 'string', displayName: [$translate.instant('MWTN_SNIR_AVG'), 'B', '[dB]'].join(' '), width: 90 },
            { field: 'snirMax', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MAX'), 'B', '[dB]'].join(' '), width: 90 }
          ],
          data: 'snir',
          onRegisterApi: function (gridApi) {
            $scope.gridSNIRApi = gridApi;
            $scope.gridSNIRApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.paginationOptions.pageNumber = newPage;
              $scope.paginationOptions.pageSize = pageSize;
              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, "snir");
            });
          }
        };


        $scope.gridOptionsCrossPolarDiscrimination = {
          paginationPageSizes: $scope.pageSizes(),
          paginationPageSize: $scope.selectPageSize(),
          useExternalPagination: true,
          enablePaginationControls: false,
          enableFiltering: false,
          enableSorting: false,
          enableGridMenu: true,
          columnDefs: [
            { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
            { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
            { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
            { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
            { field: 'timestamp', type: 'string', displayName: 'End time', width: 200 },
            { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
            { field: 'xpdMina', type: 'string', displayName: 'CPD min A [dB]', width: 90 },
            { field: 'xpdAvga', type: 'string', displayName: 'CPD avg A [dB]', width: 90 },
            { field: 'xpdMaxa', type: 'string', displayName: 'CPD max A [dB]', width: 90 },
            { field: 'xpdMinb', type: 'string', displayName: 'CPD min B [dB]', width: 90 },
            { field: 'xpdAvgb', type: 'string', displayName: 'CPD avg B [dB]', width: 90 },
            { field: 'xpdMaxb', type: 'string', displayName: 'CPD max B [dB]', width: 90 }
          ],
          data: 'crossPolarDiscrimination',
          onRegisterApi: function (gridApi) {
            $scope.gridXpdApi = gridApi;
            $scope.gridXpdApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.paginationOptions.pageNumber = newPage;
              $scope.paginationOptions.pageSize = pageSize;
              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, "crossPolarDiscrimination");
            });
          }
        };
        
        //sanitize -1 to no value
        var checkData = function (value) {
          if (value === -1 || value === undefined) return undefined;
          else return value;
        };

        var calculateMissingTimestamp = function (lastTimestamp, missingNr) {
          var dateInMS = Date.parse(lastTimestamp);
          return new Date(dateInMS + ((missingNr * 15) * 60000))
                      .toISOString()
                      .toHumanReadableTimeFormat()
                      .replace('.000', '.0');
        };

        var processResponseForGrid = function (dataA, dataB, grid) {
          // console.log(grid);
          switch (grid) {
            case "transmissionLevel":
              var list = [];
              var lookupMap = new Map(); //add data based on timestamp

              dataA.data.hits.hits.map(function (entry, index) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                lookupMap.set(timeStamp, index); //add timestamp and index to map
                var item = {
                  timestamp: timeStamp,
                  id: entry._source['uuid-interface'],
                  layerProtocol: entry._source['layer-protocol-name'],
                  suspectInterval: entry._source['suspect-interval-flag'],
                  scannerId: entry._source['scanner-id'],
                  txmina: checkData(entry._source['performance-data']['tx-level-min']),
                  txavga: checkData(entry._source['performance-data']['tx-level-avg']),
                  txmaxa: checkData(entry._source['performance-data']['tx-level-max']),
                  'radiosignal': entry._source['radio-signal-id']
                };
                list.push(item);
              });

              dataB.data.hits.hits.map(function (entry) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                var index = lookupMap.get(timeStamp); //look for timestamp in map
                if (index !== undefined) { //if a timestamp was found
                  list[index].txminb = checkData(entry._source['performance-data']['tx-level-min']); //add data to b side of element
                  list[index].txavgb = checkData(entry._source['performance-data']['tx-level-avg']);
                  list[index].txmaxb = checkData(entry._source['performance-data']['tx-level-max']);
                } else {
                  if (list[0].timestamp === $mwtnPerformanceLink.formatTimeStamp(timeStamp)) { //look, if first element in list is same (first element in map is never found against an equals)
                    list[0].txminb = checkData(entry._source['performance-data']['tx-level-min']); //add data to b side of element
                    list[0].txavgb = checkData(entry._source['performance-data']['tx-level-avg']);
                    list[0].txmaxb = checkData(entry._source['performance-data']['tx-level-max']);
                  }
                  else { //add new element for b side to list
                    list.push({
                      timestamp: timeStamp,
                      id: entry._source['uuid-interface'],
                      layerProtocol: entry._source['layer-protocol-name'],
                      suspectInterval: entry._source['suspect-interval-flag'],
                      scannerId: entry._source['scanner-id'],
                      txminb: checkData(entry._source['performance-data']['tx-level-min']),
                      txavgb: checkData(entry._source['performance-data']['tx-level-avg']),
                      txmaxb: checkData(entry._source['performance-data']['tx-level-max']),
                      'radiosignal': entry._source['radio-signal-id']
                    });
                  }
                }
              });

              $scope.transmissionLevel = list; //add list to databound table list
              $scope.gridOptionsTransmissionLevel.totalItems = getMaxItems(dataA.data.hits.total, dataB.data.hits.total);
              break;

            case "receiveLevel":

              var list = [];
              var lookupMap = new Map();

              dataA.data.hits.hits.map(function (entry, index) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                lookupMap.set(timeStamp, index);
                var item = {
                  timestamp: timeStamp,
                  id: entry._source['uuid-interface'],
                  layerProtocol: entry._source['layer-protocol-name'],
                  suspectInterval: entry._source['suspect-interval-flag'],
                  scannerId: entry._source['scanner-id'],
                  rxmina: checkData(entry._source['performance-data']['rx-level-min']),
                  rxavga: checkData(entry._source['performance-data']['rx-level-avg']),
                  rxmaxa: checkData(entry._source['performance-data']['rx-level-max']),
                  'radiosignal': entry._source['radio-signal-id']
                };

                list.push(item);
              });

              dataB.data.hits.hits.map(function (entry) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                var index = lookupMap.get(timeStamp);
                if (index !== undefined) {
                  list[index].rxminb = checkData(entry._source['performance-data']['rx-level-min']);
                  list[index].rxavgb = checkData(entry._source['performance-data']['rx-level-avg']);
                  list[index].rxmaxb = checkData(entry._source['performance-data']['rx-level-max']);
                } else {
                  if (list[0].timestamp === $mwtnPerformanceLink.formatTimeStamp(timeStamp)) {
                    list[0].rxminb = checkData(entry._source['performance-data']['rx-level-min']);
                    list[0].rxavgb = checkData(entry._source['performance-data']['rx-level-avg']);
                    list[0].rxmaxb = checkData(entry._source['performance-data']['rx-level-max']);
                  } else {
                    list.push({
                      timestamp: timeStamp,
                      id: entry._source['uuid-interface'],
                      layerProtocol: entry._source['layer-protocol-name'],
                      suspectInterval: entry._source['suspect-interval-flag'],
                      scannerId: entry._source['scanner-id'],
                      rxminb: checkData(entry._source['performance-data']['rx-level-min']),
                      rxavgb: checkData(entry._source['performance-data']['rx-level-avg']),
                      rxmaxb: checkData(entry._source['performance-data']['rx-level-max']),
                      'radiosignal': entry._source['radio-signal-id']
                    });
                  }
                }

              });


              $scope.receiveLevel = list;
              $scope.gridOptionsReceiveLevel.totalItems = getMaxItems(dataA.data.hits.total, dataB.data.hits.total);

              break;

            case "modulation":

              var list = [];

              var lookupMap = new Map();

              dataA.data.hits.hits.map(function (entry, index) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                lookupMap.set(timeStamp, index);
                var item = {
                  timestamp: timeStamp,
                  id: entry._source['uuid-interface'],
                  layerProtocol: entry._source['layer-protocol-name'],
                  suspectInterval: entry._source['suspect-interval-flag'],
                  scannerId: entry._source['scanner-id'],
                  'time2Sa': checkData(entry._source['performance-data']['time2-states-s']),
                  'time2a': checkData(entry._source['performance-data']['time2-states']),
                  'time2La': checkData(entry._source['performance-data']['time2-states-l']),
                  'time4Sa': checkData(entry._source['performance-data']['time4-states-s']),
                  'time4a': checkData(entry._source['performance-data']['time4-states']),
                  'time4La': checkData(entry._source['performance-data']['time4-states-l']),
                  'time16Sa': checkData(entry._source['performance-data']['time16-states-s']),
                  'time16a': checkData(entry._source['performance-data']['time16-states']),
                  'time16La': checkData(entry._source['performance-data']['time16-states-l']),
                  'time32Sa': checkData(entry._source['performance-data']['time32-states-s']),
                  'time32a': checkData(entry._source['performance-data']['time32-states']),
                  'time32La': checkData(entry._source['performance-data']['time32-states-l']),
                  'time64Sa': checkData(entry._source['performance-data']['time64-states-s']),
                  'time64a': checkData(entry._source['performance-data']['time64-states']),
                  'time64La': checkData(entry._source['performance-data']['time64-states-l']),
                  'time128Sa': checkData(entry._source['performance-data']['time128-states-s']),
                  'time128a': checkData(entry._source['performance-data']['time128-states']),
                  'time128La': checkData(entry._source['performance-data']['time128-states-l']),
                  'time256Sa': checkData(entry._source['performance-data']['time256-states-s']),
                  'time256a': checkData(entry._source['performance-data']['time256-states']),
                  'time256La': checkData(entry._source['performance-data']['time256-states-l']),
                  'time512Sa': checkData(entry._source['performance-data']['time512-states-s']),
                  'time512a': checkData(entry._source['performance-data']['time512-states']),
                  'time512La': checkData(entry._source['performance-data']['time512-states-l']),
                  'time1024Sa': checkData(entry._source['performance-data']['time1024-states-s']),
                  'time1024a': checkData(entry._source['performance-data']['time1024-states']),
                  'time1024La': checkData(entry._source['performance-data']['time1024-states-l']),
                  'time2048Sa': checkData(entry._source['performance-data']['time2048-states-s']),
                  'time2048a': checkData(entry._source['performance-data']['time2048-states']),
                  'time2048La': checkData(entry._source['performance-data']['time2048-states-l']),
                  'time4096Sa': checkData(entry._source['performance-data']['time4096-states-s']),
                  'time4096a': checkData(entry._source['performance-data']['time4096-states']),
                  'time4096La': checkData(entry._source['performance-data']['time4096-states-l']),
                  'time8192Sa': checkData(entry._source['performance-data']['time8192-states-s']),
                  'time8192a': checkData(entry._source['performance-data']['time8192-states']),
                  'time8192La': checkData(entry._source['performance-data']['time8192-states-l']),
                  'radiosignal': entry._source['radio-signal-id']
                };

                list.push(item);

              });

              dataB.data.hits.hits.map(function (entry) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                var index = lookupMap.get(timeStamp);
                if (index !== undefined) {

                  list[index].time2Sb = checkData(entry._source['performance-data']['time2-states-s']);
                  list[index].time2b = checkData(entry._source['performance-data']['time2-states']);
                  list[index].time2Lb = checkData(entry._source['performance-data']['time2-states-l']);
                  list[index].time4Sb = checkData(entry._source['performance-data']['time4-states-s']);
                  list[index].time4b = checkData(entry._source['performance-data']['time4-states']);
                  list[index].time4Lb = checkData(entry._source['performance-data']['time4-states-l']);
                  list[index].time16Sb = checkData(entry._source['performance-data']['time16-states-s']);
                  list[index].time16b = checkData(entry._source['performance-data']['time16-states']);
                  list[index].time16Lb = checkData(entry._source['performance-data']['time16-states-l']);
                  list[index].time32Sb = checkData(entry._source['performance-data']['time32-states-s']);
                  list[index].time32b = checkData(entry._source['performance-data']['time32-states']);
                  list[index].time32Lb = checkData(entry._source['performance-data']['time32-states-l']);
                  list[index].time64Sb = checkData(entry._source['performance-data']['time64-states-s']);
                  list[index].time64b = checkData(entry._source['performance-data']['time64-states']);
                  list[index].time64Lb = checkData(entry._source['performance-data']['time64-states-l']);
                  list[index].time128Sb = checkData(entry._source['performance-data']['time128-states-s']);
                  list[index].time128b = checkData(entry._source['performance-data']['time128-states']);
                  list[index].time128Lb = checkData(entry._source['performance-data']['time128-states-l']);
                  list[index].time256Sb = checkData(entry._source['performance-data']['time256-states-s']);
                  list[index].time256b = checkData(entry._source['performance-data']['time256-states']);
                  list[index].time256Lb = checkData(entry._source['performance-data']['time256-states-l']);
                  list[index].time512Sb = checkData(entry._source['performance-data']['time512-states-s']);
                  list[index].time512b = checkData(entry._source['performance-data']['time512-states']);
                  list[index].time512Lb = checkData(entry._source['performance-data']['time512-states-l']);
                  list[index].time1024Sb = checkData(entry._source['performance-data']['time1024-states-s']);
                  list[index].time1024b = checkData(entry._source['performance-data']['time1024-states']);
                  list[index].time1024Lb = checkData(entry._source['performance-data']['time1024-states-l']);
                  list[index].time2048Sb = checkData(entry._source['performance-data']['time2048-states-s']);
                  list[index].time2048b = checkData(entry._source['performance-data']['time2048-states']);
                  list[index].time2048Lb = checkData(entry._source['performance-data']['time2048-states-l']);
                  list[index].time4096Sb = checkData(entry._source['performance-data']['time4096-states-s']);
                  list[index].time4096b = checkData(entry._source['performance-data']['time4096-states']);
                  list[index].time4096Lb = checkData(entry._source['performance-data']['time4096-states-l']);
                  list[index].time8192Sb = checkData(entry._source['performance-data']['time8192-states-s']);
                  list[index].time8192b = checkData(entry._source['performance-data']['time8192-states']);
                  list[index].time8192Lb = checkData(entry._source['performance-data']['time8192-states-l']);
                } else {
                  if (list[0].timestamp === $mwtnPerformanceLink.formatTimeStamp(timeStamp)) {
                    list[index].time2Sb = checkData(entry._source['performance-data']['time2-states-s']);
                    list[0].time2b = checkData(entry._source['performance-data']['time2-states']);
                    list[0].time2Lb = checkData(entry._source['performance-data']['time2-states-l']);
                    list[0].time4Sb = checkData(entry._source['performance-data']['time4-states-s']);
                    list[0].time4b = checkData(entry._source['performance-data']['time4-states']);
                    list[0].time4Lb = checkData(entry._source['performance-data']['time4-states-l']);
                    list[0].time16Sb = checkData(entry._source['performance-data']['time16-states-s']);
                    list[0].time16b = checkData(entry._source['performance-data']['time16-states']);
                    list[0].time16Lb = checkData(entry._source['performance-data']['time16-states-l']);
                    list[0].time32Sb = checkData(entry._source['performance-data']['time32-states-s']);
                    list[0].time32b = checkData(entry._source['performance-data']['time32-states']);
                    list[0].time32Lb = checkData(entry._source['performance-data']['time32-states-l']);
                    list[0].time64Sb = checkData(entry._source['performance-data']['time64-states-s']);
                    list[0].time64b = checkData(entry._source['performance-data']['time64-states']);
                    list[0].time64Lb = checkData(entry._source['performance-data']['time64-states-l']);
                    list[0].time128Sb = checkData(entry._source['performance-data']['time128-states-s']);
                    list[0].time128b = checkData(entry._source['performance-data']['time128-states']);
                    list[0].time128Lb = checkData(entry._source['performance-data']['time128-states-l']);
                    list[0].time256Sb = checkData(entry._source['performance-data']['time256-states-s']);
                    list[0].time256b = checkData(entry._source['performance-data']['time256-states']);
                    list[0].time256Lb = checkData(entry._source['performance-data']['time256-states-l']);
                    list[0].time512Sb = checkData(entry._source['performance-data']['time512-states-s']);
                    list[0].time512b = checkData(entry._source['performance-data']['time512-states']);
                    list[0].time512Lb = checkData(entry._source['performance-data']['time512-states-l']);
                    list[0].time1024Sb = checkData(entry._source['performance-data']['time1024-states-s']);
                    list[0].time1024b = checkData(entry._source['performance-data']['time1024-states']);
                    list[0].time1024Lb = checkData(entry._source['performance-data']['time1024-states-l']);
                    list[0].time2048Sb = checkData(entry._source['performance-data']['time2048-states-s']);
                    list[0].time2048b = checkData(entry._source['performance-data']['time2048-states']);
                    list[0].time2048Lb = checkData(entry._source['performance-data']['time2048-states-l']);
                    list[0].time4096Sb = checkData(entry._source['performance-data']['time4096-states-s']);
                    list[0].time4096b = checkData(entry._source['performance-data']['time4096-states']);
                    list[0].time4096Lb = checkData(entry._source['performance-data']['time4096-states-l']);
                    list[0].time8192Sb = checkData(entry._source['performance-data']['time8192-states-s']);
                    list[0].time8192b = checkData(entry._source['performance-data']['time8192-states']);
                    list[0].time8192Lb = checkData(entry._source['performance-data']['time8192-states-l']);
                  }
                  else {
                    var item = {
                      timestamp: timeStamp,
                      id: entry._source['uuid-interface'],
                      layerProtocol: entry._source['layer-protocol-name'],
                      suspectInterval: entry._source['suspect-interval-flag'],
                      scannerId: entry._source['scanner-id'],
                      'time2Sb': checkData(entry._source['performance-data']['time2-states-s']),
                      'time2b': checkData(entry._source['performance-data']['time2-states']),
                      'time2Lb': checkData(entry._source['performance-data']['time2-states-l']),
                      'time4Sb': checkData(entry._source['performance-data']['time4-states-s']),
                      'time4b': checkData(entry._source['performance-data']['time4-states']),
                      'time4Lb': checkData(entry._source['performance-data']['time4-states-l']),
                      'time16Sb': checkData(entry._source['performance-data']['time16-states-s']),
                      'time16b': checkData(entry._source['performance-data']['time16-states']),
                      'time16Lb': checkData(entry._source['performance-data']['time16-states-l']),
                      'time32Sb': checkData(entry._source['performance-data']['time32-states-s']),
                      'time32b': checkData(entry._source['performance-data']['time32-states']),
                      'time32Lb': checkData(entry._source['performance-data']['time32-states-l']),
                      'time64Sb': checkData(entry._source['performance-data']['time64-states-s']),
                      'time64b': checkData(entry._source['performance-data']['time64-states']),
                      'time64Lb': checkData(entry._source['performance-data']['time64-states-l']),
                      'time128Sb': checkData(entry._source['performance-data']['time128-states-s']),
                      'time128b': checkData(entry._source['performance-data']['time128-states']),
                      'time128Lb': checkData(entry._source['performance-data']['time128-states-l']),
                      'time256Sb': checkData(entry._source['performance-data']['time256-states-s']),
                      'time256b': checkData(entry._source['performance-data']['time256-states']),
                      'time256Lb': checkData(entry._source['performance-data']['time256-states-l']),
                      'time512Sb': checkData(entry._source['performance-data']['time512-states-s']),
                      'time512b': checkData(entry._source['performance-data']['time512-states']),
                      'time512Lb': checkData(entry._source['performance-data']['time512-states-l']),
                      'time1024Sb': checkData(entry._source['performance-data']['time1024-states-s']),
                      'time1024b': checkData(entry._source['performance-data']['time1024-states']),
                      'time1024Lb': checkData(entry._source['performance-data']['time1024-states-l']),
                      'time2048Sb': checkData(entry._source['performance-data']['time2048-states-s']),
                      'time2048b': checkData(entry._source['performance-data']['time2048-states']),
                      'time2048Lb': checkData(entry._source['performance-data']['time2048-states-l']),
                      'time4096Sb': checkData(entry._source['performance-data']['time4096-states-s']),
                      'time4096b': checkData(entry._source['performance-data']['time4096-states']),
                      'time4096Lb': checkData(entry._source['performance-data']['time4096-states-l']),
                      'time8192Sb': checkData(entry._source['performance-data']['time8192-states-s']),
                      'time8192b': checkData(entry._source['performance-data']['time8192-states']),
                      'time8192Lb': checkData(entry._source['performance-data']['time8192-states-l']),
                      'radiosignal': entry._source['radio-signal-id']
                    };

                    list.push(item);
                  }
                }
              });
              $scope.modulation = list;
              $scope.gridOptionsModulation.totalItems = getMaxItems(dataA.data.hits.total, dataB.data.hits.total);

              break;

            case "temperature":

              var list = [];
              var lookupMap = new Map();

              dataA.data.hits.hits.map(function (entry, index) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                lookupMap.set(timeStamp, index);
                var item = {
                  'timestamp': $mwtnPerformanceLink.formatTimeStamp(timeStamp),
                  id: entry._source['uuid-interface'],
                  layerProtocol: entry._source['layer-protocol-name'],
                  suspectInterval: entry._source['suspect-interval-flag'],
                  scannerId: entry._source['scanner-id'],
                  rfTempMina: entry._source['performance-data']['rf-temp-min'],
                  rfTempAvga: entry._source['performance-data']['rf-temp-avg'],
                  rfTempMaxa: entry._source['performance-data']['rf-temp-max'],
                  'radiosignal': entry._source['radio-signal-id']
                };

                list.push(item);
              });

              dataB.data.hits.hits.map(function (entry) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                var index = lookupMap.get(timeStamp);
                if (index !== undefined) {
                  list[index].rfTempMinb = entry._source['performance-data']['rf-temp-min'];
                  list[index].rfTempMaxb = entry._source['performance-data']['rf-temp-max'];
                  list[index].rfTempAvgb = entry._source['performance-data']['rf-temp-avg'];
                } else {
                  if (list[0].timestamp === $mwtnPerformanceLink.formatTimeStamp(timeStamp)) {
                    list[0].rfTempMinb = entry._source['performance-data']['rf-temp-min'];
                    list[0].rfTempMaxb = entry._source['performance-data']['rf-temp-max'];
                    list[0].rfTempAvgb = entry._source['performance-data']['rf-temp-avg'];
                  } else {
                    list.push({
                      'timestamp': $mwtnPerformanceLink.formatTimeStamp(timeStamp),
                      id: entry._source['uuid-interface'],
                      layerProtocol: entry._source['layer-protocol-name'],
                      suspectInterval: entry._source['suspect-interval-flag'],
                      scannerId: entry._source['scanner-id'],
                      rfTempMinb: entry._source['performance-data']['rf-temp-min'],
                      rfTempAvgb: entry._source['performance-data']['rf-temp-avg'],
                      rfTempMaxb: entry._source['performance-data']['rf-temp-max'],
                      'radiosignal': entry._source['radio-signal-id']
                    });
                  }
                }
              });

              $scope.temperature = list;
              $scope.gridOptionsTemperature.totalItems = getMaxItems(dataA.data.hits.total, dataB.data.hits.total);

              break;

            case "snir":

              var list = [];
              var lookupMap = new Map();

              dataA.data.hits.hits.map(function (entry, index) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                lookupMap.set(timeStamp, index);
                var item = {
                  'timestamp': $mwtnPerformanceLink.formatTimeStamp(timeStamp),
                  id: entry._source['uuid-interface'],
                  layerProtocol: entry._source['layer-protocol-name'],
                  suspectInterval: entry._source['suspect-interval-flag'],
                  scannerId: entry._source['scanner-id'],
                  snirMina: entry._source['performance-data']['snir-min'],
                  snirAvga: entry._source['performance-data']['snir-avg'],
                  snirMaxa: entry._source['performance-data']['snir-max'],
                  'radiosignal': entry._source['radio-signal-id']
                };

                list.push(item);
              });

              dataB.data.hits.hits.map(function (entry) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);  
                var index = lookupMap.get(timeStamp);
                if (index !== undefined) {
                  list[index].snirMinb = entry._source['performance-data']['snir-min'];
                  list[index].snirMaxb = entry._source['performance-data']['snir-max'];
                  list[index].snirAvgb = entry._source['performance-data']['snir-max'];
                }
                else {
                  if (list[0].timestamp === $mwtnPerformanceLink.formatTimeStamp(timeStamp)) {
                    list[0].snirMinb = entry._source['performance-data']['snir-min'];
                    list[0].snirMaxb = entry._source['performance-data']['snir-max'];
                    list[0].snirAvgb = entry._source['performance-data']['snir-max'];
                  } else {
                    list.push({
                      'timestamp': $mwtnPerformanceLink.formatTimeStamp(timeStamp),
                      id: entry._source['uuid-interface'],
                      layerProtocol: entry._source['layer-protocol-name'],
                      suspectInterval: entry._source['suspect-interval-flag'],
                      scannerId: entry._source['scanner-id'],
                      snirMinb: entry._source['performance-data']['snir-min'],
                      snirAvgb: entry._source['performance-data']['snir-avg'],
                      snirMaxb: entry._source['performance-data']['snir-max'],
                      'radiosignal': entry._source['radio-signal-id']
                    });
                  }
                }
              });
              $scope.snir = list;
              $scope.gridOptionsSnir.totalItems = getMaxItems(dataA.data.hits.total, dataB.data.hits.total);

              break;

            case "crossPolarDiscrimination":
              var list = [];

              var lookupMap = new Map();

              dataA.data.hits.hits.map(function (entry, index) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                lookupMap.set(timeStamp, index);
                var item = {
                  'timestamp': $mwtnPerformanceLink.formatTimeStamp(timeStamp),
                  id: entry._source['uuid-interface'],
                  layerProtocol: entry._source['layer-protocol-name'],
                  suspectInterval: entry._source['suspect-interval-flag'],
                  scannerId: entry._source['scanner-id'],
                  xpdMina: entry._source['performance-data']['xpd-min'],
                  xpdAvga: entry._source['performance-data']['xpd-avg'],
                  xpdMaxa: entry._source['performance-data']['xpd-max'],
                  'radiosignal': entry._source['radio-signal-id']

                };

                list.push(item);

              });

              dataB.data.hits.hits.map(function (entry) {
                var timeStamp = formatTimeStamp(entry._source['time-stamp']);
                var index = lookupMap.get(timeStamp);
                if (index !== undefined) {
                  list[index].xpdMinb = entry._source['performance-data']['xpd-min'];
                  list[index].xpdMaxb = entry._source['performance-data']['xpd-max'];
                  list[index].xpdAvgb = entry._source['performance-data']['xpd-avg'];
                }
                else {
                  if (list[0].timestamp === $mwtnPerformanceLink.formatTimeStamp(timeStamp)) {

                    list[0].xpdMinb = entry._source['performance-data']['xpd-min'];
                    list[0].xpdMaxb = entry._source['performance-data']['xpd-max'];
                    list[0].xpdAvgb = entry._source['performance-data']['xpd-avg'];

                  } else {
                    list.push({
                      'timestamp': $mwtnPerformanceLink.formatTimeStamp(timeStamp),
                      id: entry._source['uuid-interface'],
                      layerProtocol: entry._source['layer-protocol-name'],
                      suspectInterval: entry._source['suspect-interval-flag'],
                      scannerId: entry._source['scanner-id'],
                      xpdMinb: entry._source['performance-data']['xpd-min'],
                      xpdAvgb: entry._source['performance-data']['xpd-avg'],
                      xpdMaxb: entry._source['performance-data']['xpd-max'],
                      'radiosignal': entry._source['radio-signal-id']

                    });
                  }

                }
              });

              $scope.crossPolarDiscrimination = list;
              $scope.gridOptionsCrossPolarDiscrimination.totalItems = getMaxItems(dataA.data.hits.total, dataB.data.hits.total);

              break;
          }
        };


        var getMaxItems = function (a, b) {
          if ($scope.networkElementA === $scope.networkElementB && $scope.selectedLtpIdA === $scope.selectedLtpIdB) {
            //assume same network element and intefaces selected, return only 1 length
            return a;
          } else {
            return a + b;
          }
        }

        //get data for pm link interafces / ne's from db
        var getDataFromNEs = function (networkElementA, selectedLtpIdA, networkElementB, selectedLtpIdB, grid) {
          var pagesize;
          var pagenr;

          switch (grid) { //get pagesize / nr according to current grid (else everything gets messy => wana get next page in grid a, get next page for grid b too)
            case 'receiveLevel':
              pagesize = $scope.gridOptionsReceiveLevel.paginationPageSize;
              pagenr = $scope.gridOptionsReceiveLevel.paginationCurrentPage;
              break;

            case 'transmissionLevel':
              pagesize = $scope.gridOptionsTransmissionLevel.paginationPageSize;
              pagenr = $scope.gridOptionsTransmissionLevel.paginationCurrentPage;
              break;

            case 'modulation':
              pagesize = $scope.gridOptionsModulation.paginationPageSize;
              pagenr = $scope.gridOptionsModulation.paginationCurrentPage;
              break;

            case 'temperature':
              pagesize = $scope.gridOptionsTemperature.paginationPageSize;
              pagenr = $scope.gridOptionsTemperature.paginationCurrentPage;
              break;

            case 'snir':
              pagesize = $scope.gridOptionsSnir.paginationPageSize;
              pagenr = $scope.gridOptionsSnir.paginationCurrentPage;
              break;

            case 'crossPolarDiscrimination':
              pagesize = $scope.gridOptionsCrossPolarDiscrimination.paginationPageSize;
              pagenr = $scope.gridOptionsCrossPolarDiscrimination.paginationCurrentPage;

              break;
          }

          var dataA;
          var dataB;
          getData((pagenr - 1) * pagesize, pagesize, networkElementA, selectedLtpIdA).then(function (response) {
            dataA = response;
            getData((pagenr - 1) * pagesize, pagesize, networkElementB, selectedLtpIdB).then(function (response) {
              dataB = response;
              drawLineChart(dataA, dataB, grid);
              processResponseForGrid(dataA, dataB, grid);
            });
          });
        };

        //override points on graphs
        var overridePoints = function (series, overrideArray) {


          let patternArray = ['rect', 'triangle', 'point', 'rectRot'];
          let patternCounter = 0;


          for (let i = 0; i < series.length; i++) {

            overrideArray[i].pointStyle = patternArray[patternCounter];
            patternCounter++;

            if (patternCounter === 4) patternCounter = 0;
            overrideArray[i].pointRadius = 10;
          }

        };

        var drawLineChart = function (dataA, dataB, grid) {

          //create a sorted lookup array

          var tempSet = new Set(); //remove duplicate timestamps

          dataA.data.hits.hits.map(function (item) {
            tempSet.add($mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']));
          });

          dataB.data.hits.hits.map(function (item) {
            tempSet.add($mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']));
          });

          // console.log(tempSet);
          var tempArr = Array.from(tempSet); //create an array from unique timestamps

          tempArr.sort(function (a, b) { //sort it
            if (a > b) { return 1; }
            else if (a < b) { return -1; }
            else {
              return 0;
            }
          });

          //process data according to grid
          switch (grid) {
            case 'receiveLevel': {

              //chart specific data
              $scope.receiveData = [];
              $scope.receiveSeries = [];
              $scope.receiveLabels = [];
              $scope.receiveDatasetOverride = [];

              $scope.receiveOptions = {
                scales: {
                  xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    afterTickToLabelConversion: function (data) { //adds our custom timestamp labels

                      var xLabels = data.ticks;
                      xLabels.forEach(function (labels, i) {
                        var timestamp = $scope.toolTipMap.get(parseInt(labels));
                        if (parseInt(labels) == labels)
                          xLabels[i] = timestamp;
                        else
                          xLabels[i] = '';
                      });

                      //calculate last timestamp if label is missing
                      if (xLabels[xLabels.length - 1] === undefined) {
                        var timestamp = $scope.toolTipMap.get($scope.toolTipMap.size - 1);
                        let stopper = true;
                        let counter = 0;
                        let labelLength = xLabels.length - 1;
                        while (stopper) {
                          if (labelLength % 10 == 0) {
                            stopper = false;
                          } else {
                            labelLength++;
                            counter++;
                          }
                        }

                        xLabels[xLabels.length - 1] = calculateMissingTimestamp(timestamp, counter);
                      }



                    }
                  }],
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                },
                tooltips: {
                  enabled: true,
                  mode: 'point',
                  callbacks: {
                    title: function (tooltipItem, data) { //picks right tool tip
                      var vaue = $scope.toolTipMap.get(tooltipItem[0].xLabel); //changes int label to timestamp
                      return vaue;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: "bottom"
                }
              };

              $scope.testMap = new Map();
              $scope.toolTipMap = new Map();

              tempArr.map(function (item, index) {
                $scope.testMap.set(item, index);
                $scope.toolTipMap.set(index, item);
              });

              //process a side

              var maxListA = [];
              var minListA = [];
              var avgListA = [];

              //add data to array
              dataA.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.testMap.get(timestamp);
                if (test) {
                  maxListA.push({ x: test, y: item._source['performance-data']['rx-level-max'] });
                  minListA.push({ x: test, y: item._source['performance-data']['rx-level-min'] });
                  avgListA.push({ x: test, y: item._source['performance-data']['rx-level-avg'] });
                } else {
                  maxListA.push({ x: 0, y: item._source['performance-data']['rx-level-max'] }); //for some odd reason first is not found, although available within map
                  minListA.push({ x: 0, y: item._source['performance-data']['rx-level-min'] });
                  avgListA.push({ x: 0, y: item._source['performance-data']['rx-level-avg'] });
                }
              });

              //add series names and data
              $scope.receiveSeries.push('Rx max A', 'Rx min A', 'Rx avg A');


              $scope.receiveData.push(maxListA);
              $scope.receiveData.push(minListA);
              $scope.receiveData.push(avgListA);

              //add y axis override
              $scope.receiveDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.receiveDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.receiveDatasetOverride.push({ yAxisID: 'y-axis-1' });


              //process b side

              var maxListB = [];
              var minListB = [];
              var avgListB = [];

              dataB.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.testMap.get(timestamp);
                if (test) {
                  maxListB.push({ x: test, y: item._source['performance-data']['rx-level-max'] });
                  minListB.push({ x: test, y: item._source['performance-data']['rx-level-min'] });
                  avgListB.push({ x: test, y: item._source['performance-data']['rx-level-avg'] });
                } else {
                  maxListB.push({ x: 0, y: item._source['performance-data']['rx-level-max'] });
                  minListB.push({ x: 0, y: item._source['performance-data']['rx-level-min'] });
                  avgListB.push({ x: 0, y: item._source['performance-data']['rx-level-avg'] });
                  console.log("timestamp" + timestamp + "at first position in map" + $scope.testMap.get(timestamp) + "wasnt found.");
                }
              });

              //add series names and data 
              $scope.receiveSeries.push('Rx max B', 'Rx min B', 'Rx avg B');

              $scope.receiveData.push(maxListB);
              $scope.receiveData.push(minListB);
              $scope.receiveData.push(avgListB);

              //add y axis override id 
              $scope.receiveDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.receiveDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.receiveDatasetOverride.push({ yAxisID: 'y-axis-1' });

              overridePoints($scope.receiveSeries, $scope.receiveDatasetOverride);


            }

              break;

            case 'transmissionLevel': {

              $scope.transmissionData = [];
              $scope.transmissionSeries = [];
              $scope.transmissionDatasetOverride = [];

              $scope.transmissionOptions = {
                scales: {
                  xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    afterTickToLabelConversion: function (data) { //adds our custom timestamp labels

                      var xLabels = data.ticks;
                      xLabels.forEach(function (labels, i) {
                        var timestamp = $scope.transmissiontoolTipMap.get(parseInt(labels));
                        if (parseInt(labels) == labels)
                          xLabels[i] = timestamp;
                        else
                          xLabels[i] = '';

                      });

                      //calculate last timestamp if label is missing
                      if (xLabels[xLabels.length - 1] === undefined) {
                        let timestamp = $scope.transmissiontoolTipMap.get($scope.transmissiontoolTipMap.size - 1);
                        let stopper = true;
                        let counter = 0;
                        let labelLength = xLabels.length - 1;
                        while (stopper) {
                          if (labelLength % 10 == 0) {
                            stopper = false;
                          } else {
                            labelLength++;
                            counter++;
                          }
                        }

                        xLabels[xLabels.length - 1] = calculateMissingTimestamp(timestamp, counter);
                      }
                    }
                  }],
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                },
                tooltips: {
                  enabled: true,
                  mode: 'point',
                  callbacks: {
                    title: function (tooltipItem, data) { //picks right tool tip
                      var vaue = $scope.transmissiontoolTipMap.get(tooltipItem[0].xLabel);
                      return vaue;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: "bottom"
                }
              };


              $scope.transmissiontestMap = new Map();
              $scope.transmissiontoolTipMap = new Map();

              tempArr.map(function (item, index) {
                $scope.transmissiontestMap.set(item, index);
                $scope.transmissiontoolTipMap.set(index, item);
              });

              var maxListA = [];
              var minListA = [];
              var avgListA = [];

              dataA.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.transmissiontestMap.get(timestamp);
                if (test) {
                  maxListA.push({ x: test, y: item._source['performance-data']['tx-level-max'] });
                  minListA.push({ x: test, y: item._source['performance-data']['tx-level-min'] });
                  avgListA.push({ x: test, y: item._source['performance-data']['tx-level-avg'] });
                } else {

                  maxListA.push({ x: 0, y: item._source['performance-data']['tx-level-max'] });
                  minListA.push({ x: 0, y: item._source['performance-data']['tx-level-min'] });
                  avgListA.push({ x: 0, y: item._source['performance-data']['tx-level-avg'] });
                }
              });

              $scope.transmissionSeries.push('Tx max A', 'Tx min A', 'Tx avg A');


              $scope.transmissionData.push(maxListA);
              $scope.transmissionData.push(minListA);
              $scope.transmissionData.push(avgListA);

              $scope.transmissionDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.transmissionDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.transmissionDatasetOverride.push({ yAxisID: 'y-axis-1' });

              var maxListB = [];
              var minListB = [];
              var avgListB = [];

              dataB.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);
                var test = $scope.transmissiontestMap.get(timestamp);
                if (test) {
                  maxListB.push({ x: test, y: item._source['performance-data']['tx-level-max'] });
                  minListB.push({ x: test, y: item._source['performance-data']['tx-level-min'] });
                  avgListB.push({ x: test, y: item._source['performance-data']['tx-level-avg'] });
                } else {

                  maxListB.push({ x: 0, y: item._source['performance-data']['tx-level-max'] });
                  minListB.push({ x: 0, y: item._source['performance-data']['tx-level-min'] });
                  avgListB.push({ x: 0, y: item._source['performance-data']['tx-level-avg'] });
                }
              });

              $scope.transmissionSeries.push('Tx max B', 'Tx min B', 'Tx avg B');

              $scope.transmissionData.push(maxListB);
              $scope.transmissionData.push(minListB);
              $scope.transmissionData.push(avgListB);

              $scope.transmissionDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.transmissionDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.transmissionDatasetOverride.push({ yAxisID: 'y-axis-1' });

              overridePoints($scope.transmissionSeries, $scope.transmissionDatasetOverride);
            }

              break;

            case 'modulation': {

              $scope.modulationData = [];
              $scope.modultaionSeries = [];
              $scope.modulationDatasetOverride = [];

              $scope.modulationOptions = {
                scales: {
                  xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    afterTickToLabelConversion: function (data) { //adds our custom timestamp labels

                      var xLabels = data.ticks;
                      xLabels.forEach(function (labels, i) {
                        var timestamp = $scope.modLabelMap.get(parseInt(labels));
                        if (parseInt(labels) == labels)
                          xLabels[i] = timestamp;
                        else
                          xLabels[i] = '';

                      });

                      //calculate last timestamp if label is missing
                      if (xLabels[xLabels.length - 1] === undefined) {
                        var timestamp = $scope.modLabelMap.get($scope.modLabelMap.size - 1);
                        let stopper = true;
                        let counter = 0;
                        let labelLength = xLabels.length - 1;
                        while (stopper) {
                          if (labelLength % 10 == 0) {
                            stopper = false;
                          } else {
                            labelLength++;
                            counter++;
                          }

                        }

                        xLabels[xLabels.length - 1] = calculateMissingTimestamp(timestamp, counter);
                      }
                    }
                  }],
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                },
                tooltips: {
                  enabled: true,
                  mode: 'point',
                  callbacks: {
                    title: function (tooltipItem, data) { //picks right tool tip

                      var vaue = $scope.modtestMap.get(tooltipItem[0].xLabel);
                      return vaue;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: "bottom"
                }

              };

              $scope.modtestMap = new Map();
              $scope.modLabelMap = new Map();

              tempArr.map(function (item, index) {
                $scope.modtestMap.set(item, index);
                $scope.modLabelMap.set(index, item);
              });

              var time2S = [];
              var time2 = [];
              var time2L = [];
              var time4S = [];
              var time4 = [];
              var time4L = [];
              var time16S = [];
              var time16 = [];
              var time16L = [];
              var time32S = [];
              var time32 = [];
              var time32L = [];
              var time64S = [];
              var time64 = [];
              var time64L = [];
              var time128S = [];
              var time128 = [];
              var time128L = [];
              var time256S = [];
              var time256 = [];
              var time256L = [];
              var time512S = [];
              var time512 = [];
              var time512L = [];
              var time1024S = [];
              var time1024 = [];
              var time1024L = [];
              var time2048S = [];
              var time2048 = [];
              var time2048L = [];
              var time4096S = [];
              var time4096 = [];
              var time4096L = [];
              var time8192S = [];
              var time8192 = [];
              var time8192L = [];

              dataA.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.modtestMap.get(timestamp);
                if (test) {

                  //check if data is not undefined, if yes: add
                  let t2s = checkData(item._source['performance-data']['time2-states-s']);
                  if (t2s != undefined)
                    time2S.push({ x: test, y: t2s });

                  let t2 = checkData(item._source['performance-data']['time2-states']);
                  if (t2 != undefined)
                    time2.push({ x: test, y: t2 });

                  let t2L = checkData(item._source['performance-data']['time2-states-l']);
                  if (t2L != undefined)
                    time2L.push({ x: test, y: t2L });

                  let t4s = checkData(item._source['performance-data']['time4-states-s']);
                  if (t4s != undefined)
                    time4S.push({ x: test, y: t4s });

                  let t4 = checkData(item._source['performance-data']['time4-states']);
                  if (t4 != undefined)
                    time4.push({ x: test, y: t4 });

                  let t4L = checkData(item._source['performance-data']['time4-states-l']);
                  if (t4L != undefined)
                    time4L.push({ x: test, y: t4L });

                  let t16s = checkData(item._source['performance-data']['time16-states-s']);
                  if (t16s != undefined)
                    time16S.push({ x: test, y: t16s });


                  let t16 = checkData(item._source['performance-data']['time16-states']);
                  if (t16 != undefined)
                    time16.push({ x: test, y: t16 });


                  let t16L = checkData(item._source['performance-data']['time16-states-l']);
                  if (t16L != undefined)
                    time16L.push({ x: test, y: t16L });

                  let t32s = checkData(item._source['performance-data']['time32-states-s']);
                  if (t32s != undefined)
                    time32S.push({ x: test, y: t32s });

                  let t32 = checkData(item._source['performance-data']['time32-states']);
                  if (t32 != undefined)
                    time32.push({ x: test, y: t32 });


                  let t32L = checkData(item._source['performance-data']['time32-states-l']);
                  if (t32L != undefined)
                    time32L.push({ x: test, y: t32L });



                  let t64s = checkData(item._source['performance-data']['time64-states-s']);
                  if (t64s != undefined)
                    time64S.push({ x: test, y: t64s });

                  let t64 = checkData(item._source['performance-data']['time64-states']);
                  if (t64 != undefined)
                    time64.push({ x: test, y: t64 });

                  let t64L = checkData(item._source['performance-data']['time64-states-l']);
                  if (t64L != undefined)
                    time64L.push({ x: test, y: t64L });


                  let t128s = checkData(item._source['performance-data']['time128-states-s']);
                  if (t128s != undefined)
                    time128S.push({ x: test, y: t128s });

                  let t128 = checkData(item._source['performance-data']['time128-states']);
                  if (t128 != undefined)
                    time128.push({ x: test, y: t128 });

                  let t128L = checkData(item._source['performance-data']['time128-states-l']);
                  if (t128L != undefined)
                    time128L.push({ x: test, y: t128L });


                  let t256s = checkData(item._source['performance-data']['time256-states-s']);
                  if (t256s != undefined)
                    time256S.push({ x: test, y: t256s });

                  let t256 = checkData(item._source['performance-data']['time256-states']);
                  if (t256 != undefined)
                    time256.push({ x: test, y: t256 });

                  let t256L = checkData(item._source['performance-data']['time256-states-l']);
                  if (t256L != undefined)
                    time256L.push({ x: test, y: t256L });

                  let t512s = checkData(item._source['performance-data']['time512-states-s']);
                  if (t512s != undefined)
                    time512S.push({ x: test, y: t512s });

                  let t512 = checkData(item._source['performance-data']['time512-states']);
                  if (t512 != undefined)
                    time512.push({ x: test, y: t512 });

                  let t512L = checkData(item._source['performance-data']['time512-states-l']);
                  if (t512L != undefined)
                    time512L.push({ x: test, y: t512L });

                  let t1024s = checkData(item._source['performance-data']['time1024-states-s']);
                  if (t1024s != undefined)
                    time1024S.push({ x: test, y: t1024s });

                  let t1024 = checkData(item._source['performance-data']['time1024-states']);
                  if (t1024 != undefined)
                    time1024.push({ x: test, y: t1024 });

                  let t1024L = checkData(item._source['performance-data']['time1024-states-l']);
                  if (t1024L != undefined)
                    time1024L.push({ x: test, y: t1024L });

                  let t2048s = checkData(item._source['performance-data']['time2048-states-s']);
                  if (t2048s != undefined)
                    time2048S.push({ x: test, y: t2048s });

                  let t2048 = checkData(item._source['performance-data']['time2048-states']);
                  if (t2048 != undefined)
                    time2048.push({ x: test, y: t2048 });

                  let t2048L = checkData(item._source['performance-data']['time2048-states-l']);
                  if (t2048L != undefined)
                    time2048L.push({ x: test, y: t2048L });

                  let t4096s = checkData(item._source['performance-data']['time4096-states-s']);
                  if (t4096s != undefined)
                    time4096S.push({ x: test, y: t4096s });

                  let t4096 = checkData(item._source['performance-data']['time4096-states']);
                  if (t4096 != undefined)
                    time4096.push({ x: test, y: t4096 });

                  let t4096L = checkData(item._source['performance-data']['time4096-states-l']);
                  if (t4096L != undefined)
                    time4096L.push({ x: test, y: t4096L });

                  let t8192s = checkData(item._source['performance-data']['time8192-states-s']);
                  if (t8192s != undefined)
                    time8192S.push({ x: test, y: t8192s });

                  let t8192 = checkData(item._source['performance-data']['time8192-states']);
                  if (t8192 != undefined)
                    time8192.push({ x: test, y: t8192 });

                  let t8192L = checkData(item._source['performance-data']['time8192-states-l']);
                  if (t8192L != undefined)
                    time8192L.push({ x: test, y: t8192L });

                } else {

                  let t2s = checkData(item._source['performance-data']['time2-states-s']);
                  if (t2s != undefined)
                    time2S.push({ x: 0, y: t2s });

                  let t2 = checkData(item._source['performance-data']['time2-states']);
                  if (t2 != undefined)
                    time2.push({ x: 0, y: t2 });

                  let t2L = checkData(item._source['performance-data']['time2-states-l']);
                  if (t2L != undefined)
                    time2L.push({ x: 0, y: t2L });

                  let t4s = checkData(item._source['performance-data']['time4-states-s']);
                  if (t4s != undefined)
                    time4S.push({ x: 0, y: t4s });

                  let t4 = checkData(item._source['performance-data']['time4-states']);
                  if (t4 != undefined)
                    time4.push({ x: 0, y: t4 });

                  let t4L = checkData(item._source['performance-data']['time4-states-l']);
                  if (t4L != undefined)
                    time4L.push({ x: 0, y: t4L });

                  let t16s = checkData(item._source['performance-data']['time16-states-s']);
                  if (t16s != undefined)
                    time16S.push({ x: 0, y: t16s });


                  let t16 = checkData(item._source['performance-data']['time16-states']);
                  if (t16 != undefined)
                    time16.push({ x: 0, y: t16 });


                  let t16L = checkData(item._source['performance-data']['time16-states-l']);
                  if (t16L != undefined)
                    time16L.push({ x: 0, y: t16L });

                  let t32s = checkData(item._source['performance-data']['time32-states-s']);
                  if (t32s != undefined)
                    time32S.push({ x: 0, y: t32s });

                  let t32 = checkData(item._source['performance-data']['time32-states']);
                  if (t32 != undefined)
                    time32.push({ x: 0, y: t32 });


                  let t32L = checkData(item._source['performance-data']['time32-states-l']);
                  if (t32L != undefined)
                    time32L.push({ x: 0, y: t32L });

                  let t64s = checkData(item._source['performance-data']['time64-states-s']);
                  if (t64s != undefined)
                    time64S.push({ x: 0, y: t64s });

                  let t64 = checkData(item._source['performance-data']['time64-states']);
                  if (t64 != undefined)
                    time64.push({ x: 0, y: t64 });

                  let t64L = checkData(item._source['performance-data']['time64-states-l']);
                  if (t64L != undefined)
                    time64L.push({ x: 0, y: t64L });


                  let t128s = checkData(item._source['performance-data']['time128-states-s']);
                  if (t128s != undefined)
                    time128S.push({ x: 0, y: t128s });

                  let t128 = checkData(item._source['performance-data']['time128-states']);
                  if (t128 != undefined)
                    time128.push({ x: 0, y: t128 });

                  let t128L = checkData(item._source['performance-data']['time128-states-l']);
                  if (t128L != undefined)
                    time128L.push({ x: 0, y: t128L });


                  let t256s = checkData(item._source['performance-data']['time256-states-s']);
                  if (t256s != undefined)
                    time256S.push({ x: 0, y: t256s });

                  let t256 = checkData(item._source['performance-data']['time256-states']);
                  if (t256 != undefined)
                    time256.push({ x: 0, y: t256 });

                  let t256L = checkData(item._source['performance-data']['time256-states-l']);
                  if (t256L != undefined)
                    time256L.push({ x: 0, y: t256L });

                  let t512s = checkData(item._source['performance-data']['time512-states-s']);
                  if (t512s != undefined)
                    time512S.push({ x: 0, y: t512s });

                  let t512 = checkData(item._source['performance-data']['time512-states']);
                  if (t512 != undefined)
                    time512.push({ x: 0, y: t512 });

                  let t512L = checkData(item._source['performance-data']['time512-states-l']);
                  if (t512L != undefined)
                    time512L.push({ x: 0, y: t512L });

                  let t1024s = checkData(item._source['performance-data']['time1024-states-s']);
                  if (t1024s != undefined)
                    time1024S.push({ x: 0, y: t1024s });

                  let t1024 = checkData(item._source['performance-data']['time1024-states']);
                  if (t1024 != undefined)
                    time1024.push({ x: 0, y: t1024 });

                  let t1024L = checkData(item._source['performance-data']['time1024-states-l']);
                  if (t1024L != undefined)
                    time1024L.push({ x: 0, y: t1024L });

                  let t2048s = checkData(item._source['performance-data']['time2048-states-s']);
                  if (t2048s != undefined)
                    time2048S.push({ x: 0, y: t2048s });

                  let t2048 = checkData(item._source['performance-data']['time2048-states']);
                  if (t2048 != undefined)
                    time2048.push({ x: 0, y: t2048 });

                  let t2048L = checkData(item._source['performance-data']['time2048-states-l']);
                  if (t2048L != undefined)
                    time2048L.push({ x: 0, y: t2048L });

                  let t4096s = checkData(item._source['performance-data']['time4096-states-s']);
                  if (t4096s != undefined)
                    time4096S.push({ x: 0, y: t4096s });

                  let t4096 = checkData(item._source['performance-data']['time4096-states']);
                  if (t4096 != undefined)
                    time4096.push({ x: 0, y: t4096 });

                  let t4096L = checkData(item._source['performance-data']['time4096-states-l']);
                  if (t4096L != undefined)
                    time4096L.push({ x: 0, y: t4096L });

                  let t8192s = checkData(item._source['performance-data']['time8192-states-s']);
                  if (t8192s != undefined)
                    time8192S.push({ x: 0, y: t8192s });

                  let t8192 = checkData(item._source['performance-data']['time8192-states']);
                  if (t8192 != undefined)
                    time8192.push({ x: 0, y: t8192 });

                  let t8192L = checkData(item._source['performance-data']['time8192-states-l']);
                  if (t8192L != undefined)
                    time8192L.push({ x: 0, y: t8192L });

                }
              });

              //check, if array has items, if yes: add series and data to chart
              //reduces amount of labels shown in chart => shows only series' with data
              if (time2S.length > 0) {
                $scope.modultaionSeries.push('QAM2S A');
                $scope.modulationData.push(time2S);
              }

              if (time2.length > 0) {
                $scope.modultaionSeries.push('QAM2 A');
                $scope.modulationData.push(time2);
              }

              if (time2L.length > 0) {
                $scope.modultaionSeries.push('QAM2L A');
                $scope.modulationData.push(time2L);
              }

              if (time4S.length > 0) {
                $scope.modultaionSeries.push('QAM4S A');
                $scope.modulationData.push(time4S);
              }

              if (time4.length > 0) {
                $scope.modultaionSeries.push('QAM4 A');
                $scope.modulationData.push(time4);
              }

              if (time4L.length > 0) {
                $scope.modultaionSeries.push('QAM4L A');
                $scope.modulationData.push(time4L);
              }

              if (time16S.length > 0) {
                $scope.modultaionSeries.push('QAM16S A');
                $scope.modulationData.push(time16S);
              }


              if (time16.length > 0) {
                $scope.modultaionSeries.push('QAM16 A');
                $scope.modulationData.push(time16);
              }

              if (time16L.length > 0) {
                $scope.modultaionSeries.push('QAM16L A');
                $scope.modulationData.push(time16L);
              }

              if (time32S.length > 0) {
                $scope.modulationData.push(time32S);
                $scope.modultaionSeries.push('QAM32S A');
              }

              if (time32.length > 0) {
                $scope.modulationData.push(time32);
                $scope.modultaionSeries.push('QAM32 A');
              }

              if (time32L.length > 0) {
                $scope.modulationData.push(time32L);
                $scope.modultaionSeries.push('QAM32L A');
              }


              if (time64S.length > 0) {
                $scope.modulationData.push(time64S);
                $scope.modultaionSeries.push('QAM64S A');
              }


              if (time64.length > 0) {
                $scope.modulationData.push(time64);
                $scope.modultaionSeries.push('QAM64 A');
              }

              if (time64L.length > 0) {
                $scope.modulationData.push(time64L);
                $scope.modultaionSeries.push('QAM64L A');
              }


              if (time128S.length > 0) {
                $scope.modultaionSeries.push('QAM128S A');
                $scope.modulationData.push(time128S);
              }

              if (time128.length > 0) {
                $scope.modultaionSeries.push('QAM128 A');
                $scope.modulationData.push(time128);
              }

              if (time128L.length > 0) {
                $scope.modultaionSeries.push('QAM128L A');
                $scope.modulationData.push(time128L);
              }

              if (time256S.length > 0) {
                $scope.modulationData.push(time256S);
                $scope.modultaionSeries.push('QAM256S A');
              }

              if (time256.length > 0) {
                $scope.modulationData.push(time256);
                $scope.modultaionSeries.push('QAM256 A');
              }

              if (time256L.length > 0) {
                $scope.modulationData.push(time256L);
                $scope.modultaionSeries.push('QAM256L A');
              }

              if (time512S.length > 0) {
                $scope.modultaionSeries.push('QAM512S A');
                $scope.modulationData.push(time512S);
              }

              if (time512.length > 0) {
                $scope.modultaionSeries.push('QAM512 A');
                $scope.modulationData.push(time512);
              }

              if (time512S.length > 0) {
                $scope.modultaionSeries.push('QAM512S A');
                $scope.modulationData.push(time512S);
              }

              if (time512.length > 0) {
                $scope.modultaionSeries.push('QAM512 A');
                $scope.modulationData.push(time512);
              }

              if (time512L.length > 0) {
                $scope.modultaionSeries.push('QAM512L A');
                $scope.modulationData.push(time512L);

              }

              if (time1024S.length > 0) {
                $scope.modultaionSeries.push('QAM1024S A');
                $scope.modulationData.push(time1024S);
              }

              if (time1024.length > 0) {
                $scope.modultaionSeries.push('QAM1024 A');
                $scope.modulationData.push(time1024);
              }


              if (time1024L.length > 0) {
                $scope.modultaionSeries.push('QAM1024L A');
                $scope.modulationData.push(time1024L);
              }


              if (time2048S.length > 0) {
                $scope.modultaionSeries.push('QAM2048S A');
                $scope.modulationData.push(time2048S);
              }

              if (time2048.length > 0) {
                $scope.modultaionSeries.push('QAM2048 A');
                $scope.modulationData.push(time2048);
              }

              if (time2048L.length > 0) {
                $scope.modultaionSeries.push('QAM2048L A');
                $scope.modulationData.push(time2048L);

              }

              if (time4096S.length > 0) {
                $scope.modultaionSeries.push('QAM4096S A');
                $scope.modulationData.push(time4096S);
              }

              if (time4096.length > 0) {
                $scope.modultaionSeries.push('QAM4096 A');
                $scope.modulationData.push(time4096);
              }


              if (time4096L.length > 0) {
                $scope.modultaionSeries.push('QAM4096L A');
                $scope.modulationData.push(time4096L);
              }

              if (time8192S.length > 0) {
                $scope.modultaionSeries.push('QAM8192S A');
                $scope.modulationData.push(time8192S);
              }


              if (time8192.length > 0) {
                $scope.modultaionSeries.push('QAM8192 A');
                $scope.modulationData.push(time8192);
              }

              if (time8192L.length > 0) {
                $scope.modultaionSeries.push('QAM8192L A');
                $scope.modulationData.push(time8192L);
              }

              //process data for b side

              time2S = [];
              time2 = [];
              time2L = [];
              time4S = [];
              time4 = [];
              time4L = [];
              time16S = [];
              time16 = [];
              time16L = [];
              time32S = [];
              time32 = [];
              time32L = [];
              time64S = [];
              time64 = [];
              time64L = [];
              time128S = [];
              time128 = [];
              time128L = [];
              time256S = [];
              time256 = [];
              time256L = [];
              time512S = [];
              time512 = [];
              time512L = [];
              time1024S = [];
              time1024 = [];
              time1024L = [];
              time2048S = [];
              time2048 = [];
              time2048L = [];
              time4096S = [];
              time4096 = [];
              time4096L = [];
              time8192S = [];
              time8192 = [];
              time8192L = [];

              dataB.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);
                var test = $scope.modtestMap.get(timestamp);
                if (test) {
                  let t2s = checkData(item._source['performance-data']['time2-states-s']);
                  if (t2s != undefined)
                    time2S.push({ x: test, y: t2s });

                  let t2 = checkData(item._source['performance-data']['time2-states']);
                  if (t2 != undefined)
                    time2.push({ x: test, y: t2 });

                  let t2L = checkData(item._source['performance-data']['time2-states-l']);
                  if (t2L != undefined)
                    time2L.push({ x: test, y: t2L });

                  let t4s = checkData(item._source['performance-data']['time4-states-s']);
                  if (t4s != undefined)
                    time4S.push({ x: test, y: t4s });

                  let t4 = checkData(item._source['performance-data']['time4-states']);
                  if (t4 != undefined)
                    time4.push({ x: test, y: t4 });

                  let t4L = checkData(item._source['performance-data']['time4-states-l']);
                  if (t4L != undefined)
                    time4L.push({ x: test, y: t4L });

                  let t16s = checkData(item._source['performance-data']['time16-states-s']);
                  if (t16s != undefined)
                    time16S.push({ x: test, y: t16s });


                  let t16 = checkData(item._source['performance-data']['time16-states']);
                  if (t16 != undefined)
                    time16.push({ x: test, y: t16 });


                  let t16L = checkData(item._source['performance-data']['time16-states-l']);
                  if (t16L != undefined)
                    time16L.push({ x: test, y: t16L });

                  let t32s = checkData(item._source['performance-data']['time32-states-s']);
                  if (t32s != undefined)
                    time32S.push({ x: test, y: t32s });

                  let t32 = checkData(item._source['performance-data']['time32-states']);
                  if (t32 != undefined)
                    time32.push({ x: test, y: t32 });


                  let t32L = checkData(item._source['performance-data']['time32-states-l']);
                  if (t32L != undefined)
                    time32L.push({ x: test, y: t32L });



                  let t64s = checkData(item._source['performance-data']['time64-states-s']);
                  if (t64s != undefined)
                    time64S.push({ x: test, y: t64s });

                  let t64 = checkData(item._source['performance-data']['time64-states']);
                  if (t64 != undefined)
                    time64.push({ x: test, y: t64 });

                  let t64L = checkData(item._source['performance-data']['time64-states-l']);
                  if (t64L != undefined)
                    time64L.push({ x: test, y: t64L });


                  let t128s = checkData(item._source['performance-data']['time128-states-s']);
                  if (t128s != undefined)
                    time128S.push({ x: test, y: t128s });

                  let t128 = checkData(item._source['performance-data']['time128-states']);
                  if (t128 != undefined)
                    time128.push({ x: test, y: t128 });

                  let t128L = checkData(item._source['performance-data']['time128-states-l']);
                  if (t128L != undefined)
                    time128L.push({ x: test, y: t128L });


                  let t256s = checkData(item._source['performance-data']['time256-states-s']);
                  if (t256s != undefined)
                    time256S.push({ x: test, y: t256s });

                  let t256 = checkData(item._source['performance-data']['time256-states']);
                  if (t256 != undefined)
                    time256.push({ x: test, y: t256 });

                  let t256L = checkData(item._source['performance-data']['time256-states-l']);
                  if (t256L != undefined)
                    time256L.push({ x: test, y: t256L });

                  let t512s = checkData(item._source['performance-data']['time512-states-s']);
                  if (t512s != undefined)
                    time512S.push({ x: test, y: t512s });

                  let t512 = checkData(item._source['performance-data']['time512-states']);
                  if (t512 != undefined)
                    time512.push({ x: test, y: t512 });

                  let t512L = checkData(item._source['performance-data']['time512-states-l']);
                  if (t512L != undefined)
                    time512L.push({ x: test, y: t512L });

                  let t1024s = checkData(item._source['performance-data']['time1024-states-s']);
                  if (t1024s != undefined)
                    time1024S.push({ x: test, y: t1024s });

                  let t1024 = checkData(item._source['performance-data']['time1024-states']);
                  if (t1024 != undefined)
                    time1024.push({ x: test, y: t1024 });

                  let t1024L = checkData(item._source['performance-data']['time1024-states-l']);
                  if (t1024L != undefined)
                    time1024L.push({ x: test, y: t1024L });

                  let t2048s = checkData(item._source['performance-data']['time2048-states-s']);
                  if (t2048s != undefined)
                    time2048S.push({ x: test, y: t2048s });

                  let t2048 = checkData(item._source['performance-data']['time2048-states']);
                  if (t2048 != undefined)
                    time2048.push({ x: test, y: t2048 });

                  let t2048L = checkData(item._source['performance-data']['time2048-states-l']);
                  if (t2048L != undefined)
                    time2048L.push({ x: test, y: t2048L });

                  let t4096s = checkData(item._source['performance-data']['time4096-states-s']);
                  if (t4096s != undefined)
                    time4096S.push({ x: test, y: t4096s });

                  let t4096 = checkData(item._source['performance-data']['time4096-states']);
                  if (t4096 != undefined)
                    time4096.push({ x: test, y: t4096 });

                  let t4096L = checkData(item._source['performance-data']['time4096-states-l']);
                  if (t4096L != undefined)
                    time4096L.push({ x: test, y: t4096L });

                  let t8192s = checkData(item._source['performance-data']['time8192-states-s']);
                  if (t8192s != undefined)
                    time8192S.push({ x: test, y: t8192s });

                  let t8192 = checkData(item._source['performance-data']['time8192-states']);
                  if (t8192 != undefined)
                    time8192.push({ x: test, y: t8192 });

                  let t8192L = checkData(item._source['performance-data']['time8192-states-l']);
                  if (t8192L != undefined)
                    time8192L.push({ x: test, y: t8192L });

                } else {

                  let t2s = checkData(item._source['performance-data']['time2-states-s']);
                  if (t2s != undefined)
                    time2S.push({ x: 0, y: t2s });

                  let t2 = checkData(item._source['performance-data']['time2-states']);
                  if (t2 != undefined)
                    time2.push({ x: 0, y: t2 });

                  let t2L = checkData(item._source['performance-data']['time2-states-l']);
                  if (t2L != undefined)
                    time2L.push({ x: 0, y: t2L });

                  let t4s = checkData(item._source['performance-data']['time4-states-s']);
                  if (t4s != undefined)
                    time4S.push({ x: 0, y: t4s });

                  let t4 = checkData(item._source['performance-data']['time4-states']);
                  if (t4 != undefined)
                    time4.push({ x: 0, y: t4 });

                  let t4L = checkData(item._source['performance-data']['time4-states-l']);
                  if (t4L != undefined)
                    time4L.push({ x: 0, y: t4L });

                  let t16s = checkData(item._source['performance-data']['time16-states-s']);
                  if (t16s != undefined)
                    time16S.push({ x: 0, y: t16s });


                  let t16 = checkData(item._source['performance-data']['time16-states']);
                  if (t16 != undefined)
                    time16.push({ x: 0, y: t16 });


                  let t16L = checkData(item._source['performance-data']['time16-states-l']);
                  if (t16L != undefined)
                    time16L.push({ x: 0, y: t16L });

                  let t32s = checkData(item._source['performance-data']['time32-states-s']);
                  if (t32s != undefined)
                    time32S.push({ x: 0, y: t32s });

                  let t32 = checkData(item._source['performance-data']['time32-states']);
                  if (t32 != undefined)
                    time32.push({ x: 0, y: t32 });


                  let t32L = checkData(item._source['performance-data']['time32-states-l']);
                  if (t32L != undefined)
                    time32L.push({ x: 0, y: t32L });

                  let t64s = checkData(item._source['performance-data']['time64-states-s']);
                  if (t64s != undefined)
                    time64S.push({ x: 0, y: t64s });

                  let t64 = checkData(item._source['performance-data']['time64-states']);
                  if (t64 != undefined)
                    time64.push({ x: 0, y: t64 });

                  let t64L = checkData(item._source['performance-data']['time64-states-l']);
                  if (t64L != undefined)
                    time64L.push({ x: 0, y: t64L });


                  let t128s = checkData(item._source['performance-data']['time128-states-s']);
                  if (t128s != undefined)
                    time128S.push({ x: 0, y: t128s });

                  let t128 = checkData(item._source['performance-data']['time128-states']);
                  if (t128 != undefined)
                    time128.push({ x: 0, y: t128 });

                  let t128L = checkData(item._source['performance-data']['time128-states-l']);
                  if (t128L != undefined)
                    time128L.push({ x: 0, y: t128L });


                  let t256s = checkData(item._source['performance-data']['time256-states-s']);
                  if (t256s != undefined)
                    time256S.push({ x: 0, y: t256s });

                  let t256 = checkData(item._source['performance-data']['time256-states']);
                  if (t256 != undefined)
                    time256.push({ x: 0, y: t256 });

                  let t256L = checkData(item._source['performance-data']['time256-states-l']);
                  if (t256L != undefined)
                    time256L.push({ x: 0, y: t256L });

                  let t512s = checkData(item._source['performance-data']['time512-states-s']);
                  if (t512s != undefined)
                    time512S.push({ x: 0, y: t512s });

                  let t512 = checkData(item._source['performance-data']['time512-states']);
                  if (t512 != undefined)
                    time512.push({ x: 0, y: t512 });

                  let t512L = checkData(item._source['performance-data']['time512-states-l']);
                  if (t512L != undefined)
                    time512L.push({ x: 0, y: t512L });

                  let t1024s = checkData(item._source['performance-data']['time1024-states-s']);
                  if (t1024s != undefined)
                    time1024S.push({ x: 0, y: t1024s });

                  let t1024 = checkData(item._source['performance-data']['time1024-states']);
                  if (t1024 != undefined)
                    time1024.push({ x: 0, y: t1024 });

                  let t1024L = checkData(item._source['performance-data']['time1024-states-l']);
                  if (t1024L != undefined)
                    time1024L.push({ x: 0, y: t1024L });

                  let t2048s = checkData(item._source['performance-data']['time2048-states-s']);
                  if (t2048s != undefined)
                    time2048S.push({ x: 0, y: t2048s });

                  let t2048 = checkData(item._source['performance-data']['time2048-states']);
                  if (t2048 != undefined)
                    time2048.push({ x: 0, y: t2048 });

                  let t2048L = checkData(item._source['performance-data']['time2048-states-l']);
                  if (t2048L != undefined)
                    time2048L.push({ x: 0, y: t2048L });

                  let t4096s = checkData(item._source['performance-data']['time4096-states-s']);
                  if (t4096s != undefined)
                    time4096S.push({ x: 0, y: t4096s });

                  let t4096 = checkData(item._source['performance-data']['time4096-states']);
                  if (t4096 != undefined)
                    time4096.push({ x: 0, y: t4096 });

                  let t4096L = checkData(item._source['performance-data']['time4096-states-l']);
                  if (t4096L != undefined)
                    time4096L.push({ x: 0, y: t4096L });

                  let t8192s = checkData(item._source['performance-data']['time8192-states-s']);
                  if (t8192s != undefined)
                    time8192S.push({ x: 0, y: t8192s });

                  let t8192 = checkData(item._source['performance-data']['time8192-states']);
                  if (t8192 != undefined)
                    time8192.push({ x: 0, y: t8192 });

                  let t8192L = checkData(item._source['performance-data']['time8192-states-l']);
                  if (t8192L != undefined)
                    time8192L.push({ x: 0, y: t8192L });

                }
              });

              if (time2S.length > 0) {
                $scope.modultaionSeries.push('QAM2S B');
                $scope.modulationData.push(time2S);
              }

              if (time2.length > 0) {
                $scope.modultaionSeries.push('QAM2 B');
                $scope.modulationData.push(time2);
              }

              if (time2L.length > 0) {
                $scope.modultaionSeries.push('QAM2L B');
                $scope.modulationData.push(time2L);
              }

              if (time4S.length > 0) {
                $scope.modultaionSeries.push('QAM4S B');
                $scope.modulationData.push(time4S);
              }

              if (time4.length > 0) {
                $scope.modultaionSeries.push('QAM4 B');
                $scope.modulationData.push(time4);
              }

              if (time4L.length > 0) {
                $scope.modultaionSeries.push('QAM4L B');
                $scope.modulationData.push(time4L);
              }

              if (time16S.length > 0) {
                $scope.modultaionSeries.push('QAM16S B');
                $scope.modulationData.push(time16S);
              }


              if (time16.length > 0) {
                $scope.modultaionSeries.push('QAM16 B');
                $scope.modulationData.push(time16);
              }


              if (time16L.length > 0) {
                $scope.modultaionSeries.push('QAM16L B');
                $scope.modulationData.push(time16L);
              }

              if (time32S.length > 0) {
                $scope.modulationData.push(time32S);
                $scope.modultaionSeries.push('QAM32S B');
              }

              if (time32.length > 0) {
                $scope.modulationData.push(time32);
                $scope.modultaionSeries.push('QAM32 B');
              }

              if (time32L.length > 0) {
                $scope.modulationData.push(time32L);
                $scope.modultaionSeries.push('QAM32L B');
              }


              if (time64S.length > 0) {
                $scope.modulationData.push(time64S);
                $scope.modultaionSeries.push('QAM64S B');
              }


              if (time64.length > 0) {
                $scope.modulationData.push(time64);
                $scope.modultaionSeries.push('QAM64 B');
              }

              if (time64L.length > 0) {
                $scope.modulationData.push(time64L);
                $scope.modultaionSeries.push('QAM64L B');
              }


              if (time128S.length > 0) {
                $scope.modultaionSeries.push('QAM128S B');
                $scope.modulationData.push(time128S);
              }

              if (time128.length > 0) {
                $scope.modultaionSeries.push('QAM128 B');
                $scope.modulationData.push(time128);
              }

              if (time128L.length > 0) {
                $scope.modultaionSeries.push('QAM128L B');
                $scope.modulationData.push(time128L);
              }

              if (time256S.length > 0) {
                $scope.modulationData.push(time256S);
                $scope.modultaionSeries.push('QAM256S B');
              }

              if (time256.length > 0) {
                $scope.modulationData.push(time256);
                $scope.modultaionSeries.push('QAM256 B');
              }

              if (time256L.length > 0) {
                $scope.modulationData.push(time256L);
                $scope.modultaionSeries.push('QAM256L B');
              }

              if (time512S.length > 0) {
                $scope.modultaionSeries.push('QAM512S B');
                $scope.modulationData.push(time512S);

              }

              if (time512.length > 0) {
                $scope.modultaionSeries.push('QAM512 B');
                $scope.modulationData.push(time512);

              }

              if (time512S.length > 0) {
                $scope.modultaionSeries.push('QAM512S B');
                $scope.modulationData.push(time512S);
              }

              if (time512.length > 0) {
                $scope.modultaionSeries.push('QAM512 B');
                $scope.modulationData.push(time512);
              }

              if (time512L.length > 0) {
                $scope.modultaionSeries.push('QAM512L B');
                $scope.modulationData.push(time512L);
              }

              if (time1024S.length > 0) {
                $scope.modultaionSeries.push('QAM1024S B');
                $scope.modulationData.push(time1024S);

              }

              if (time1024.length > 0) {
                $scope.modultaionSeries.push('QAM1024 B');
                $scope.modulationData.push(time1024);
              }


              if (time1024L.length > 0) {
                $scope.modultaionSeries.push('QAM1024L B');
                $scope.modulationData.push(time1024L);

              }


              if (time2048S.length > 0) {
                $scope.modultaionSeries.push('QAM2048S B');
                $scope.modulationData.push(time2048S);

              }

              if (time2048.length > 0) {
                $scope.modultaionSeries.push('QAM2048 B');
                $scope.modulationData.push(time2048);
              }

              if (time2048L.length > 0) {
                $scope.modultaionSeries.push('QAM2048L B');
                $scope.modulationData.push(time2048L);
              }

              if (time4096S.length > 0) {
                $scope.modultaionSeries.push('QAM4096S B');
                $scope.modulationData.push(time4096S);
              }

              if (time4096.length > 0) {
                $scope.modultaionSeries.push('QAM4096 B');
                $scope.modulationData.push(time4096);
              }


              if (time4096L.length > 0) {
                $scope.modultaionSeries.push('QAM4096L B');
                $scope.modulationData.push(time4096L);

              }

              if (time8192S.length > 0) {
                $scope.modultaionSeries.push('QAM8192S B');
                $scope.modulationData.push(time8192S);

              }


              if (time8192.length > 0) {
                $scope.modultaionSeries.push('QAM8192 B');
                $scope.modulationData.push(time8192);

              }

              if (time8192L.length > 0) {
                $scope.modultaionSeries.push('QAM8192L B');
                $scope.modulationData.push(time8192L);

              }

              let patternArray = ['rect', 'triangle', 'point', 'cross'];
              let patternCounter = 0;

              //add y axis override and remove color below graph for all items in chart series
              for (let i = 0; i < $scope.modultaionSeries.length; i++) {
                $scope.modulationDatasetOverride.push({ yAxisID: 'y-axis-1' });
                $scope.modulationDatasetOverride[i].fill = false;

                //override points in graph
                $scope.modulationDatasetOverride[i].pointStyle = patternArray[patternCounter];
                patternCounter++;
                if (patternCounter === 4) patternCounter = 0;
                $scope.modulationDatasetOverride[i].pointRadius = 10;

              }
            }

              break;

            case 'temperature': {

              $scope.tempData = [];
              $scope.tempSeries = [];
              $scope.tempDatasetOverride = [];

              $scope.tempOptions = {
                scales: {
                  xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    afterTickToLabelConversion: function (data) { //adds our custom timestamp labels

                      var xLabels = data.ticks;
                      xLabels.forEach(function (labels, i) {
                        var timestamp = $scope.tempLabelMap.get(parseInt(labels));
                        if (parseInt(labels) == labels)
                          xLabels[i] = timestamp;
                        else
                          xLabels[i] = '';
                      });

                      //calculate last timestamp if label is missing
                      if (xLabels[xLabels.length - 1] === undefined) {
                        var timestamp = $scope.tempLabelMap.get($scope.tempLabelMap.size - 1);
                        let stopper = true;
                        let counter = 0;
                        let labelLength = xLabels.length - 1;
                        while (stopper) {
                          if (labelLength % 10 == 0) {
                            stopper = false;
                          } else {
                            labelLength++;
                            counter++;
                          }
                        }

                        xLabels[xLabels.length - 1] = calculateMissingTimestamp(timestamp, counter);
                      }
                    }
                  }],
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                },
                tooltips: {
                  enabled: true,
                  mode: 'point',
                  callbacks: {
                    title: function (tooltipItem, data) { //picks right tool tip

                      var vaue = $scope.tempLabelMap.get(tooltipItem[0].xLabel);
                      return vaue;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: "bottom"
                }
              };

              $scope.temptestMap = new Map();
              $scope.tempLabelMap = new Map();


              tempArr.map(function (item, index) {
                $scope.temptestMap.set(item, index);
                $scope.tempLabelMap.set(index, item);
              });

              //process data for a side
              var maxListA = [];
              var minListA = [];
              var avgListA = [];

              dataA.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.temptestMap.get(timestamp);
                if (test) {
                  maxListA.push({ x: test, y: item._source['performance-data']['rf-temp-max'] });
                  minListA.push({ x: test, y: item._source['performance-data']['rf-temp-min'] });
                  avgListA.push({ x: test, y: item._source['performance-data']['rf-temp-avg'] });
                } else {

                  maxListA.push({ x: 0, y: item._source['performance-data']['rf-temp-max'] });
                  minListA.push({ x: 0, y: item._source['performance-data']['rf-temp-min'] });
                  avgListA.push({ x: 0, y: item._source['performance-data']['rf-temp-avg'] });
                }
              });

              $scope.tempSeries.push('Rf temp max A', 'Rf temp min A', 'Rf temp avg A');


              $scope.tempData.push(maxListA);
              $scope.tempData.push(minListA);
              $scope.tempData.push(avgListA);

              $scope.tempDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.tempDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.tempDatasetOverride.push({ yAxisID: 'y-axis-1' });

              //process data fro side b

              var maxListB = [];
              var minListB = [];
              var avgListB = [];

              dataB.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);
                var test = $scope.temptestMap.get(timestamp);
                if (test) {
                  maxListB.push({ x: test, y: item._source['performance-data']['rf-temp-max'] });
                  minListB.push({ x: test, y: item._source['performance-data']['rf-temp-min'] });
                  avgListB.push({ x: test, y: item._source['performance-data']['rf-temp-avg'] });
                } else {

                  maxListB.push({ x: 0, y: item._source['performance-data']['rf-temp-max'] });
                  minListB.push({ x: 0, y: item._source['performance-data']['rf-temp-min'] });
                  avgListB.push({ x: 0, y: item._source['performance-data']['rf-temp-avg'] });
                }
              });

              $scope.tempSeries.push('Rf temp max B', 'Rf temp min B', 'Rf temp avg B');



              $scope.tempData.push(maxListB);
              $scope.tempData.push(minListB);
              $scope.tempData.push(avgListB);

              $scope.tempDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.tempDatasetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.tempDatasetOverride.push({ yAxisID: 'y-axis-1' });

              overridePoints($scope.tempSeries, $scope.tempDatasetOverride);
            }
              break;

            case 'snir': {

              $scope.snirChartData = [];
              $scope.snirSeries = [];
              $scope.snirsetOverride = [];

              $scope.snirOptions = {
                scales: {
                  xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    afterTickToLabelConversion: function (data) { //adds our custom timestamp labels

                      var xLabels = data.ticks;
                      xLabels.forEach(function (labels, i) {
                        var timestamp = $scope.snirLabelMap.get(parseInt(labels));
                        if (parseInt(labels) == labels)
                          xLabels[i] = timestamp;
                        else
                          xLabels[i] = '';
                      });

                      //calculate last timestamp if label is missing
                      if (xLabels[xLabels.length - 1] === undefined) {
                        var timestamp = $scope.snirLabelMap.get($scope.snirLabelMap.size - 1);
                        let stopper = true;
                        let counter = 0;
                        let labelLength = xLabels.length - 1;
                        while (stopper) {
                          if (labelLength % 10 == 0) {
                            stopper = false;
                          } else {
                            labelLength++;
                            counter++;
                          }
                        }

                        xLabels[xLabels.length - 1] = calculateMissingTimestamp(timestamp, counter);
                      }
                    }
                  }],
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                },
                tooltips: {
                  enabled: true,
                  mode: 'point',
                  callbacks: {
                    title: function (tooltipItem, data) { //picks right tool tip

                      var vaue = $scope.snirLabelMap.get(tooltipItem[0].xLabel);
                      return vaue;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: "bottom"
                }
              };

              $scope.snirtestMap = new Map();
              $scope.snirLabelMap = new Map();

              tempArr.map(function (item, index) {
                $scope.snirtestMap.set(item, index);
                $scope.snirLabelMap.set(index, item);
              });

              var maxListA = [];
              var minListA = [];
              var avgListA = [];

              dataA.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.snirtestMap.get(timestamp);
                if (test) {
                  maxListA.push({ x: test, y: item._source['performance-data']['rf-temp-max'] });
                  minListA.push({ x: test, y: item._source['performance-data']['rf-temp-min'] });
                  avgListA.push({ x: test, y: item._source['performance-data']['rf-temp-avg'] });
                } else {
                  maxListA.push({ x: 0, y: item._source['performance-data']['rf-temp-max'] });
                  minListA.push({ x: 0, y: item._source['performance-data']['rf-temp-min'] });
                  avgListA.push({ x: 0, y: item._source['performance-data']['rf-temp-avg'] });
                }
              });

              $scope.snirSeries.push('Snir max A', 'Snir min A', 'Snir avg A');


              $scope.snirChartData.push(maxListA);
              $scope.snirChartData.push(minListA);
              $scope.snirChartData.push(avgListA);

              $scope.snirsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.snirsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.snirsetOverride.push({ yAxisID: 'y-axis-1' });

              var maxListB = [];
              var minListB = [];
              var avgListB = [];

              dataB.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);
                var test = $scope.snirtestMap.get(timestamp);
                if (test) {
                  maxListB.push({ x: test, y: item._source['performance-data']['rf-temp-max'] });
                  minListB.push({ x: test, y: item._source['performance-data']['rf-temp-min'] });
                  avgListB.push({ x: test, y: item._source['performance-data']['rf-temp-avg'] });
                } else {
                  maxListB.push({ x: 0, y: item._source['performance-data']['rf-temp-max'] });
                  minListB.push({ x: 0, y: item._source['performance-data']['rf-temp-min'] });
                  avgListB.push({ x: 0, y: item._source['performance-data']['rf-temp-avg'] });
                }
              });

              $scope.snirSeries.push('Snir max B', 'Snir min B', 'Snir avg B');



              $scope.snirChartData.push(maxListB);
              $scope.snirChartData.push(minListB);
              $scope.snirChartData.push(avgListB);

              $scope.snirsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.snirsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.snirsetOverride.push({ yAxisID: 'y-axis-1' });

              overridePoints($scope.snirSeries, $scope.snirsetOverride);
            }
              break;

            case 'crossPolarDiscrimination': {

              $scope.xpdChartData = [];
              $scope.xpdSeries = [];
              $scope.crossPolarDiscriminationsetOverride = [];

              $scope.xpdOptions = {
                scales: {
                  xAxes: [{

                    type: 'linear',
                    position: 'bottom',
                    afterTickToLabelConversion: function (data) { //adds our custom timestamp labels

                      var xLabels = data.ticks;
                      xLabels.forEach(function (labels, i) {
                        var timestamp = $scope.xpdLabelMap.get(parseInt(labels));
                        if (parseInt(labels) == labels)
                          xLabels[i] = timestamp;
                        else
                          xLabels[i] = '';

                      });

                      //calculate last timestamp if label is missing
                      if (xLabels[xLabels.length - 1] === undefined) {
                        var timestamp = $scope.xpdLabelMap.get($scope.xpdLabelMap.size - 1);
                        let stopper = true;
                        let counter = 0;
                        let labelLength = xLabels.length - 1;
                        while (stopper) {
                          if (labelLength % 10 == 0) {
                            stopper = false;
                          } else {
                            labelLength++;
                            counter++;
                          }
                        }

                        xLabels[xLabels.length - 1] = calculateMissingTimestamp(timestamp, counter);
                      }
                    }
                  }],
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                },
                tooltips: {
                  enabled: true,
                  mode: 'point',
                  callbacks: {
                    title: function (tooltipItem, data) { //picks right tool tip

                      var vaue = $scope.xpdLabelMap.get(tooltipItem[0].xLabel);
                      return vaue;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: "bottom"
                }
              };

              $scope.xpdtestMap = new Map();
              $scope.xpdLabelMap = new Map();

              tempArr.map(function (item, index) {
                $scope.xpdtestMap.set(item, index);
                $scope.xpdLabelMap.set(index, item);
              });

              var maxListA = [];
              var minListA = [];
              var avgListA = [];

              dataA.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);

                var test = $scope.xpdtestMap.get(timestamp);
                if (test) {
                  maxListA.push({ x: test, y: item._source['performance-data']['xpd-max'] });
                  minListA.push({ x: test, y: item._source['performance-data']['xpd-min'] });
                  avgListA.push({ x: test, y: item._source['performance-data']['xpd-avg'] });
                } else {
                  maxListA.push({ x: 0, y: item._source['performance-data']['xpd-max'] });
                  minListA.push({ x: 0, y: item._source['performance-data']['xpd-min'] });
                  avgListA.push({ x: 0, y: item._source['performance-data']['xpd-avg'] });
                }
              });

              $scope.xpdSeries.push('CPD max A', 'CPD min A', 'CPD avg A');


              $scope.xpdChartData.push(maxListA);
              $scope.xpdChartData.push(minListA);
              $scope.xpdChartData.push(avgListA);

              $scope.crossPolarDiscriminationsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.crossPolarDiscriminationsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.crossPolarDiscriminationsetOverride.push({ yAxisID: 'y-axis-1' });

              var maxListB = [];
              var minListB = [];
              var avgListB = [];

              dataB.data.hits.hits.map(function (item, index) {
                var timestamp = $mwtnPerformanceLink.formatTimeStamp(item._source['time-stamp']);
                var test = $scope.xpdtestMap.get(timestamp);
                if (test) {
                  maxListB.push({ x: test, y: item._source['performance-data']['xpd-max'] });
                  minListB.push({ x: test, y: item._source['performance-data']['xpd-min'] });
                  avgListB.push({ x: test, y: item._source['performance-data']['xpd-avg'] });
                } else {
                  maxListB.push({ x: 0, y: item._source['performance-data']['xpd-max'] });
                  minListB.push({ x: 0, y: item._source['performance-data']['xpd-min'] });
                  avgListB.push({ x: 0, y: item._source['performance-data']['xpd-avg'] });
                }
              });

              $scope.xpdSeries.push('CPD max B', 'CPD min B', 'CPD avg B');

              $scope.xpdChartData.push(maxListB);
              $scope.xpdChartData.push(minListB);
              $scope.xpdChartData.push(avgListB);

              $scope.crossPolarDiscriminationsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.crossPolarDiscriminationsetOverride.push({ yAxisID: 'y-axis-1' });
              $scope.crossPolarDiscriminationsetOverride.push({ yAxisID: 'y-axis-1' });

              overridePoints($scope.xpdSeries, $scope.crossPolarDiscriminationsetOverride);

            }
              break;

          }
        };

        var getColor = function (hexcolorCode) {
          var color = {
            backgroundColor: hexcolorCode, pointBackgroundColor: hexcolorCode,
            pointHoverBackgroundColor: hexcolorCode,
            borderColor: hexcolorCode,
            pointBorderColor: hexcolorCode,
            pointHoverBorderColor: hexcolorCode,
            fill: false
          };
          return color;
        };

        var getData = function (from, size, networkElement, selectedLtpId) {

          var sort = [{ "time-stamp": { order: 'desc' } }];

          var query = { "query": { "bool": { "must": [{ prefix: { "node-name": networkElement } }] } } };


          //add layer protocol selector to filter query
          query.query.bool.must.push({ prefix: { "layer-protocol-name": "MWPS" } });

          //add interface selector to filter query
          if (selectedLtpId && selectedLtpId !== 'Select LTP') {
            query.query.bool.must.push({ prefix: { "uuid-interface": selectedLtpId } });
          }

          var selected15minPeriod = true;
          if ($scope.timePeriod !== $scope.timePeriods[0]) selected15minPeriod = false;

          return $mwtnPerformanceLink.getFilteredSortedData(from, size, sort, query, selected15minPeriod);
        };

        $scope.status = { ne: false };
        $scope.spinner = { ne: false };

        // events  
        $scope.$watch('linkId', function (newValue, oldValue) {
          if (newValue && oldValue !== "" && newValue !== oldValue) {

            var functionId = 'sdnperformance';
            var docType = 'historicalperformance15min';
            if ($scope.timePeriod !== $scope.timePeriods[0]) {
              docType = 'historicalperformance24h';
            }
            var aggregations = {
              "size":0,
              "query": {
                "match": {
                  "radio-signal-id": newValue
                }
              },
              "aggregations": {
                "node-name": {
                  "terms": {
                    "field": "node-name"
                  }
                },
                "ltp": {
                  "terms": {
                    "field": "uuid-interface"
                  }
                }
              }
            };
            $mwtnPerformanceLink.getAggregations(functionId, docType, aggregations).then(function (success) {
              console.log(JSON.stringify(success));
              var nodes = success.data.aggregations['node-name'].buckets.map(function(bucket){
                return bucket.key;
              });
              console.warn(nodes);
              if (nodes.length = 0) {
                $scope.networkElementA = '';
                $scope.networkElementB = '';
              } else if (nodes.length = 1) {
                $scope.networkElementA = nodes[0];
                $scope.networkElementB = '';
              } else if (nodes.length = 2) {
                $scope.networkElementA = nodes[0];
                $scope.networkElementB = nodes[1]
              } else {
                $scope.networkElementA = nodes[0];
                $scope.networkElementB = nodes[1]
                console.warn('Check nodes for radio signal id: ' + newValue + ' ' + JSON.stringify(nodes));
              }
              var ltps  = success.data.aggregations['ltp'].buckets.map(function(bucket){
                return bucket.key;
              });
              if (ltps.length = 0) {
                $scope.selectedLtpIdA = '';
                $scope.selectedLtpIdB = '';
              } else if (ltps.length = 1) {
                $scope.selectedLtpIdA = ltps[0];
                $scope.selectedLtpIdB = ltps[0];
              } else if (ltps.length = 2) {
                // TODO Who belongs to whom - just guessing ;/
                $scope.selectedLtpIdA = ltps[0];
                $scope.selectedLtpIdB = ltps[1]
              } else {
                $scope.selectedLtpIdA = ltps[0];
                $scope.selectedLtpIdB = ltps[1]
                console.warn('Check ltps for radio signal id: ' + newValue + ' ' + JSON.stringify(nodes));
              }
            }, function (error) {
              console.log(error);
              $scope.networkElementA = '';
              $scope.networkElementB = '';
              $scope.selectedLtpIdA = '';
              $scope.selectedLtpIdB = '';
            });
          }
        });

        $scope.$watch('selectedLtpIdA', function (newValue, oldValue) {
          if (newValue && oldValue !== "" && newValue !== oldValue) {
            //TODO: get data based on open grids
            Object.keys($scope.status).map(function (key) {
              if ($scope.status[key]) {
                $scope.defaultColors = [];
                $scope.defaultColors.push(getColor('#0062ff'));
                $scope.defaultColors.push(getColor('#b9341b'));
                $scope.defaultColors.push(getColor('#f0141f'));
                $scope.defaultColors.push(getColor('#4c7759'));
                $scope.defaultColors.push(getColor('#55b64e'));
                $scope.defaultColors.push(getColor("#6c8995"));

                getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, key)
                $window.dispatchEvent(new Event("resize"));
              }
            });
          }

        }, true);

        $scope.$watch('selectedLtpIdB', function (newValue, oldValue) {
          if (newValue && oldValue !== "" && newValue !== oldValue && newValue != 'Select LTP') {
            Object.keys($scope.status).map(function (key) {
              if ($scope.status[key]) {
                $scope.defaultColors = [];
                $scope.defaultColors.push(getColor('#0062ff'));
                $scope.defaultColors.push(getColor('#b9341b'));
                $scope.defaultColors.push(getColor('#f0141f'));
                $scope.defaultColors.push(getColor('#4c7759'));
                $scope.defaultColors.push(getColor('#55b64e'));
                $scope.defaultColors.push(getColor("#6c8995"));

                getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, key)
                $window.dispatchEvent(new Event("resize"));
              }
            });
          }

        }, true);

        $scope.$watch('status', function (status, oldValue) {
          Object.keys(status).map(function (key) {
            if ($scope.networkElementIdA && $scope.networkElementIdB && status[key] && status[key] !== oldValue[key]) {


              //add a set of default colors for line graphs with 6 values
              $scope.defaultColors = [];
              $scope.defaultColors.push(getColor('#0062ff'));
              $scope.defaultColors.push(getColor('#b9341b'));
              $scope.defaultColors.push(getColor('#f0141f'));
              $scope.defaultColors.push(getColor('#4c7759'));
              $scope.defaultColors.push(getColor('#55b64e'));
              $scope.defaultColors.push(getColor("#6c8995"));

              getDataFromNEs($scope.networkElementIdA, $scope.selectedLtpIdA, $scope.networkElementIdB, $scope.selectedLtpIdB, key)
              $window.dispatchEvent(new Event("resize"));

            }

          });
        }, true);

        $scope.$watch('timePeriod', function (newValue, oldValue) {

          if (newValue && oldValue !== "" && newValue !== oldValue) {

            //change page sizes and tell gridapi to update

            $scope.gridOptionsReceiveLevel.paginationPageSizes = $scope.pageSizes();
            $scope.gridOptionsReceiveLevel.paginationPageSize = $scope.gridOptionsReceiveLevel.paginationPageSizes[0];
            $scope.recvGridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

            $scope.gridOptionsTransmissionLevel.paginationPageSizes = $scope.pageSizes();
            $scope.gridOptionsTransmissionLevel.paginationPageSize = $scope.gridOptionsTransmissionLevel.paginationPageSizes[0];
            $scope.transmissionGridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);


            $scope.gridOptionsModulation.paginationPageSizes = $scope.pageSizes();
            $scope.gridOptionsModulation.paginationPageSize = $scope.gridOptionsModulation.paginationPageSizes[0];
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

            $scope.gridOptionsTemperature.paginationPageSizes = $scope.pageSizes();
            $scope.gridOptionsTemperature.paginationPageSize = $scope.gridOptionsTemperature.paginationPageSizes[0];
            $scope.gridTemperatureApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

            $scope.gridOptionsSnir.paginationPageSizes = $scope.pageSizes();
            $scope.gridOptionsSnir.paginationPageSize = $scope.gridOptionsSnir.paginationPageSizes[0];
            $scope.gridSNIRApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

            $scope.gridOptionsCrossPolarDiscrimination.paginationPageSizes = $scope.pageSizes();
            $scope.gridOptionsCrossPolarDiscrimination.paginationPageSize = $scope.gridOptionsCrossPolarDiscrimination.paginationPageSizes[0];
            $scope.gridXpdApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

            //get new interface data
            getInterfaces($scope.networkElementIdA, $scope.availableLtpIdsA);
            getInterfaces($scope.networkElementIdB, $scope.availableLtpIdsB);
          }

        }, true);

        $scope.collapseAll = function () {
          // close all groups
          Object.keys($scope.status).map(function (group) {
            $scope.status[group] = false;
          });
          Object.keys($scope.spinner).map(function (group) {
            $scope.spinner[group] = false;
          });
        };

        //get data on ne selection

        $scope.$watch('networkElementA', function (neId, oldValue) {
          if (neId && neId !== '' && neId !== oldValue) {
            var revision;
            $scope.networkElements.map(function (ne) {
              if (ne.id === neId) revision = ne.revision;
            });
            $scope.networkElementIdA = neId;
            $scope.revisionA = revision;

            getInterfaces(neId, $scope.availableLtpIdsA);
            $scope.collapseAll();

          }
        });

        $scope.$watch('networkElementB', function (neId, oldValue) {
          if (neId && neId !== '' && neId !== oldValue) {
            var revision;
            $scope.networkElements.map(function (ne) {
              if (ne.id === neId) revision = ne.revision;
            });
            $scope.networkElementIdB = neId;
            $scope.revisionB = revision;

            getInterfaces(neId, $scope.availableLtpIdsB);
            $scope.collapseAll();

          }
        });

        var getInterfaces = function (networkElement, networkList) {

          //clear interface array
          var length = networkList.length;
          networkList.splice(1, length);

          //request to get interfaces
          var aggr = {
            "size": 0,
            "aggregations": {
              "neinterfaces": {
                "filter": {
                  "bool": {
                    "must": [
                      {
                        "term": {
                          "node-name": networkElement
                        }
                      },
                      {
                        "term": {
                          "layer-protocol-name": "MWPS"
                        }
                      }
                    ]
                  }
                },
                "aggregations": {
                  "interfaces": {
                    "terms": {
                      "field": "uuid-interface"
                    }
                  }
                }
              }
            }
          };


          var selected15minPeriod = true;
          if ($scope.timePeriod !== $scope.timePeriods[0]) selected15minPeriod = false;

          $mwtnPerformanceLink.getInterfaces(aggr, selected15minPeriod).then(function (response) {

            if (response.data.aggregations.neinterfaces.interfaces.buckets.length >= 0) {
              response.data.aggregations.neinterfaces.interfaces.buckets.map(function (item) {
                networkList.push(item.key);
              });
            }


          });
        };


      }]);
  });
