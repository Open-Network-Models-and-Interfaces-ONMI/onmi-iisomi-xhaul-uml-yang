/*
 * @copyright 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * @license
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnPerformanceHistory/mwtnPerformanceHistory.module',
  'app/mwtnPerformanceHistory/mwtnPerformanceHistory.services'],
  function (mwtnPerformanceHistoryoryApp) {

    mwtnPerformanceHistoryoryApp.register.controller('mwtnPerformanceHistoryCtrl', ['$scope', '$rootScope', '$window', '$translate', '$mwtnLog', '$mwtnPerformanceHistory', 'uiGridConstants', 'OnfNetworkElement',
      function ($scope, $rootScope, $window, $translate, $mwtnLog, $mwtnPerformanceHistory, uiGridConstants, OnfNetworkElement) {

      var COMPONENT = 'mwtnPerformanceHistory';
      $mwtnLog.info({ component: COMPONENT, message: 'mwtn historical Performance started!' });

      $rootScope.section_logo = 'src/app/mwtnPerformanceHistory/images/mwtnPerformance.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

      var globalFilter;

      $scope.selecteditem = {};

      //time selector
      $scope.selecteditem.timePeriod = "15 minutes";
      $scope.timePeriods = ["15 minutes", "24 hours"];

      //interface selector
      $scope.selecteditem.selectedLtpId = undefined;
      $scope.availableLtpIds = [];

      //stateobject
      $scope.state = {};
      $scope.state.filter = false;
      $scope.state.sort = false;
      $scope.state.lastfilter = null;
      $scope.state.lastSort = null;
      $scope.state.grid = null;

      //perf log configuration
      $scope.gridOptionsPerformance826 = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },

          { field: 'es', type: 'string', displayName: 'ES', width: 70 },
          { field: 'ses', type: 'string', displayName: 'SES', width: 70 },
          { field: 'uas', type: 'string', displayName: 'UAS', width: 70 }

        ],
        data: 'performance826',
        onRegisterApi: function (gridApi) {
          $scope.performancegridApi = gridApi;
          $scope.performancegridApi.core.on.filterChanged($scope, $scope.filter);
          $scope.performancegridApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.performancegridApi.grid, [$scope.gridOptionsPerformance826.columnDefs[1]]);

          $scope.performancegridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsPerformance826);
          });
        }
      };

      //receive lvl configuration
      $scope.gridOptionsReceiveLevel = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'rxmin', type: 'string', displayName: 'Rx min', width: 90 },
          { field: 'rxavg', type: 'string', displayName: 'Rx avg', width: 90 },
          { field: 'rxmax', type: 'string', displayName: 'Rx max', width: 90 }
        ],
        data: 'receiveLevel',
        onRegisterApi: function (gridApi) {
          $scope.recvGridApi = gridApi;
          $scope.recvGridApi.core.on.filterChanged($scope, $scope.filter);
          $scope.recvGridApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.recvGridApi.grid, [$scope.gridOptionsReceiveLevel.columnDefs[1]]);

          $scope.recvGridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsReceiveLevel);
          });
        }
      };

      //transmission lvl configuration
      $scope.gridOptionsTransmissionLevel = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'txmin', type: 'string', displayName: 'Tx min', width: 90 },
          { field: 'txavg', type: 'string', displayName: 'Tx avg', width: 90 },
          { field: 'txmax', type: 'string', displayName: 'Tx max', width: 90 }
        ],
        data: 'transmissionLevel',
        onRegisterApi: function (gridApi) {
          $scope.transmissionGridApi = gridApi;
          $scope.transmissionGridApi.core.on.filterChanged($scope, $scope.filter);
          $scope.transmissionGridApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.transmissionGridApi.grid, [$scope.gridOptionsTransmissionLevel.columnDefs[1]]);

          $scope.transmissionGridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsTransmissionLevel);
          });
        }
      };

      //modulation configuration
      $scope.gridOptionsModulation = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'time2S', type: 'string', displayName: 'QAM2S', width: 90 },
          { field: 'time2', type: 'string', displayName: 'QAM2', width: 90 },
          { field: 'time2L', type: 'string', displayName: 'QAM2L', width: 90 },
          { field: 'time4S', type: 'string', displayName: 'QAM4S', width: 90 },
          { field: 'time4', type: 'string', displayName: 'QAM4', width: 90 },
          { field: 'time4L', type: 'string', displayName: 'QAM4L', width: 90 },
          { field: 'time16S', type: 'string', displayName: 'QAM16S', width: 90 },
          { field: 'time16', type: 'string', displayName: 'QAM16', width: 90 },
          { field: 'time16L', type: 'string', displayName: 'QAM16L', width: 90 },
          { field: 'time32S', type: 'string', displayName: 'QAM32S', width: 90 },
          { field: 'time32', type: 'string', displayName: 'QAM32', width: 90 },
          { field: 'time32L', type: 'string', displayName: 'QAM32L', width: 90 },
          { field: 'time64S', type: 'string', displayName: 'QAM64S', width: 90 },
          { field: 'time64', type: 'string', displayName: 'QAM64', width: 90 },
          { field: 'time64L', type: 'string', displayName: 'QAM64L', width: 90 },
          { field: 'time128S', type: 'string', displayName: 'QAM128S', width: 90 },
          { field: 'time128', type: 'string', displayName: 'QAM128', width: 90 },
          { field: 'time128L', type: 'string', displayName: 'QAM128L', width: 90 },
          { field: 'time256S', type: 'string', displayName: 'QAM256S', width: 90 },
          { field: 'time256', type: 'string', displayName: 'QAM256', width: 90 },
          { field: 'time256L', type: 'string', displayName: 'QAM256L', width: 90 },
          { field: 'time512S', type: 'string', displayName: 'QAM512S', width: 90 },
          { field: 'time512', type: 'string', displayName: 'QAM512', width: 90 },
          { field: 'time512L', type: 'string', displayName: 'QAM512L', width: 90 },
          { field: 'time1024S', type: 'string', displayName: 'QAM1024S', width: 90 },
          { field: 'time1024', type: 'string', displayName: 'QAM1024', width: 90 },
          { field: 'time1024L', type: 'string', displayName: 'QAM1024L', width: 90 },
          { field: 'time2048S', type: 'string', displayName: 'QAM2048S', width: 90 },
          { field: 'time2048', type: 'string', displayName: 'QAM2048', width: 90 },
          { field: 'time2048L', type: 'string', displayName: 'QAM2048L', width: 90 },
          { field: 'time4096S', type: 'string', displayName: 'QAM4096S', width: 90 },
          { field: 'time4096', type: 'string', displayName: 'QAM4096', width: 90 },
          { field: 'time4096L', type: 'string', displayName: 'QAM4096L', width: 90 },
          { field: 'time8192S', type: 'string', displayName: 'QAM8192S', width: 90 },
          { field: 'time8192', type: 'string', displayName: 'QAM8192', width: 90 },
          { field: 'time8192L', type: 'string', displayName: 'QAM8192L', width: 90 }


        ],
        data: 'modulation',
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.core.on.filterChanged($scope, $scope.filter);
          $scope.gridApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.gridApi.grid, [$scope.gridOptionsModulation.columnDefs[1]]);

          $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsModulation);
          });
        }
      };

      //temperature configuration
      $scope.gridOptionsTemperature = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'rfTempMin', type: 'string', displayName: 'Rf Temp Min  [&deg;C]', width: 90 },
          { field: 'rfTempAvg', type: 'string', displayName: 'Rf Temp Avg  [&deg;C]', width: 90 },
          { field: 'rfTempMax', type: 'string', displayName: 'Rf Temp Max  [&deg;C]', width: 90 }

        ],
        data: 'temperature',
        onRegisterApi: function (gridApi) {
          $scope.gridTemperatureApi = gridApi;
          $scope.gridTemperatureApi.core.on.filterChanged($scope, $scope.filter);
          $scope.gridTemperatureApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.gridTemperatureApi.grid, [$scope.gridOptionsTemperature.columnDefs[1]]);

          $scope.gridTemperatureApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsTemperature);
          });
        }
      }

      //SNIR configuration
      $scope.gridOptionsSnir = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'snirMin', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MIN'),'[dB]'].join(' '), width: 90 },
          { field: 'snirAvg', type: 'string', displayName: [$translate.instant('MWTN_SNIR_AVG'),'[dB]'].join(' '), width: 90 },
          { field: 'snirMax', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MAX'),'[dB]'].join(' '), width: 90 }
        ],
        data: 'snir',
        onRegisterApi: function (gridApi) {
          $scope.gridSNIRApi = gridApi;
          $scope.gridSNIRApi.core.on.filterChanged($scope, $scope.filter);
          $scope.gridSNIRApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.gridSNIRApi.grid, [$scope.gridOptionsSnir.columnDefs[1]]);

          $scope.gridSNIRApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsSnir);
          });
        }
      }

      //CPD Configuration
      $scope.gridOptionsCrossPolarDiscrimination = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'xpdMin', type: 'string', displayName: 'CPD min  [dB]', width: 90 },
          { field: 'xpdAvg', type: 'string', displayName: 'CPD avg  [dB]', width: 90 },
          { field: 'xpdMax', type: 'string', displayName: 'CPD max  [dB]', width: 90 }

        ],
        data: 'crossPolarDiscrimination',
        onRegisterApi: function (gridApi) {
          $scope.gridXpdApi = gridApi;
          $scope.gridXpdApi.core.on.filterChanged($scope, $scope.filter);
          $scope.gridXpdApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.gridOptionsCrossPolarDiscrimination, [$scope.gridOptionsCrossPolarDiscrimination.columnDefs[1]]);

          $scope.gridXpdApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsCrossPolarDiscrimination);
          });
        }
      }

      //ethernet perf configuration
      $scope.gridOptionsPerformanceEthernetContainer = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false },
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LTP'), width: 200, visible: false },
          { field: 'radiosignal', type: 'string', displayName: 'Radio Signal Id', width: 90, visible: false },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'End time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'txEthernetBytesMaxS', type: 'number', displayName: 'Tx BytesMaxS', width: 90 },
          { field: 'txEthernetBytesMaxM', type: 'number', displayName: 'Tx BytesMaxM', width: 90 },
          { field: 'txEthernetBytesSum', type: 'number', displayName: 'Tx BytesSum', width: 90 }

        ],
        data: 'performanceEthernetContainer',
        onRegisterApi: function (gridApi) {
          $scope.gridPerfEthernetApi = gridApi;
          $scope.gridPerfEthernetApi.core.on.filterChanged($scope, $scope.filter);
          $scope.gridPerfEthernetApi.core.on.sortChanged($scope, $scope.sortChanged);
          $scope.sortChanged($scope.gridPerfEthernetApi.grid, [$scope.gridOptionsPerformanceEthernetContainer.columnDefs[1]]);

          $scope.gridPerfEthernetApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            getPage($scope.gridOptionsPerformanceEthernetContainer);
          });
        }
      };

      //filter 
      $scope.filter = function () {
        var grid = this.grid;
        var columns = [];

        //get all columns where data was typed in
        angular.forEach(grid.columns, function (value, key) {
          if (value.filters[0].term) {
            var col = findColumn(value.field);
            if (col === "time-stamp") {
              //convert timestamp to db format
              var timestamp = $mwtnPerformanceHistory.TimeStampToONFFormat(value.filters[0].term);
              columns.push({ column: col, value: timestamp });
            }
            else
              columns.push({ column: col, value: value.filters[0].term }); //create column object
          }
        });

        if (columns.length == 0) { //all filter data cleared away
          $scope.state.filter = false;
          $scope.state.lastfilter = null;

          //get unfiltered data
          getData($scope.state.lastSort, $scope.state.lastfilter, grid.options, null, null).then(function (response) {
            if (response.data.hits.hits) {
              processRequestInGrid(response, grid.options);

            }
          });

        } else {
          //base filter string
          var filter = { "query": { "bool": { "must": [] } } };

          //create filter objects
          var prefixs = [];
          prefixs.push({ prefix: globalFilter });

          columns.map(function (obj) {
            var prefixObj = {};
            prefixObj[obj.column] = obj.value;//add  like: {column: "fault.counter", value: "1"} => {"fault.counter":1}
            prefixs.push({ prefix: prefixObj }); // => {"prefix":{...}}
          });

          //add objects to must property
          filter.query.bool.must = prefixs;

          //save filter
          $scope.state.lastfilter = filter;
          $scope.state.filter = true;

          getData($scope.state.lastSort, $scope.state.lastfilter, grid.options, filter, null).then(function (response) {
            if (response.data.hits.total > 0) { //only, when hits exist
              processRequestInGrid(response, grid.options);
              //$scope.gridOptionsAlarmLog.totalItems = response.data.hits.total;
            } else {
              //clear data from list
              $scope[grid.options.data] = [];
              grid.options.totalItems = 0;

            }
          });
        }
      };

      $scope.sortChanged = function (grid, sortColumns) {    // sortColumns is an array containing just the column sorted in the grid


        if (sortColumns && sortColumns.length > 0) {
          if (sortColumns[0].sort) {
            var name = sortColumns[0].field; // the field (name) of the column sorted
            var direction = sortColumns[0].sort.direction // the direction of the column sorted: "desc" or "asc"
            sort(direction, findColumn(name), grid);
          }
        } else if (sortColumns) {
          $scope.state.sort = false;
          $scope.state.lastSort = null;

          //get unsorted data
          getData($scope.state.lastSort, $scope.state.lastfilter, grid.options, null, null).then(function (response) {
            if (response.data.hits.hits) {
              processRequestInGrid(response, grid.options);
            }
          });
        }
      };

      var sort = function (direction, columnName, grid) {
        switch (direction) {
          case uiGridConstants.ASC:

            //create sort object
            var sortObj = {};
            sortObj[columnName] = { order: 'asc' };
            var sort = [sortObj];
            //save last sort
            $scope.state.lastSort = sort;

            getData($scope.state.lastSort, $scope.state.lastfilter, grid.options, null, sort).then(function (response) {
              if (response.data.hits.hits) {
                processRequestInGrid(response, grid.options);
                $scope.state.sort = true;

              }
            });

            break;

          case uiGridConstants.DESC:

            var sortObj = {};
            sortObj[columnName] = { order: 'desc' };
            var sort = [sortObj];
            $scope.state.lastSort = sort;

            getData($scope.state.lastSort, $scope.state.lastfilter, grid.options, null, sort).then(function (response) {
              if (response.data.hits.hits) {
                processRequestInGrid(response, grid.options);
                $scope.state.sort = true;
              }
            });
            break;

          case undefined:

            $scope.state.sort = false;
            $scope.state.lastSort = null;

            getData($scope.state.lastSort, $scope.state.lastfilter, grid.options, null, null)
              .then(function (response) {
                if (response.data.hits.hits) {
                  processRequestInGrid(response, grid.options);
                }
              });

            break;
        }
      }

      function findColumn(name) {

        if (name === "timestamp") { return "time-stamp"; }
        else if (name === "layerprotocol") { return "layer-protocol-name"; }
        else if (name === "id") { return "uuid-interface"; }
        else if (name === "suspectInterval") { return "suspect-interval-flag"; }
        else if (name === "scannerId") { return "scanner-id"; }
        else if (name === "radiosignal") { return "radio-signal-id"; }
        else if (name === "es") { return "performance-data.es"; }
        else if (name === "ses") { return "performance-data.ses"; }
        else if (name === "uas") { return "performance-data.unavailability"; }
        else if (name === "rxmin") { return "performance-data.rx-level-min"; }
        else if (name === "rxmax") { return "performance-data.rx-level-max"; }
        else if (name === "rxavg") { return "performance-data.rx-level-avg"; }
        else if (name === "txmin") { return "performance-data.tx-level-min"; }
        else if (name === "txmax") { return "performance-data.tx-level-max"; }
        else if (name === "txavg") { return "performance-data.tx-level-avg"; }
        else if (name === "Tx BytesMaxS") { return "performance-data.tx-ethernet-bytes-max-s"; }
        else if (name === "Tx BytesMaxM") { return "performance-data.tx-ethernet-bytes-max-m"; }
        else if (name === "Tx BytesSum") { return "performance-data.tx-ethernet-bytes-sum"; }
        else if (name === "xpdMin") { return "performance-data.xpd-min"; }
        else if (name === "xpdAvg") { return "performance-data.xpd-avg"; }
        else if (name === "xpdMax") { return "performance-data.xpd-max"; }
        else if (name === "snirMin") { return "performance-data.snir-min"; }
        else if (name === "snirAvg") { return "performance-data.snir-avg"; }
        else if (name === "snirMax") { return "performance-data.snir-max"; }
        else if (name === "rfTempMin") { return "performance-data.rf-temp-min"; }
        else if (name === "rfTempAvg") { return "performance-data.rf-temp-avg"; }
        else if (name === "rfTempMax") { return "performance-data.rf-temp-max"; }
        else if (name === "time2S") { return "performance-data.time2-states-s"; }
        else if (name === "time2") { return "performance-data.time2-states"; }
        else if (name === "time2L") { return "performance-data.time2-states-l"; }
        else if (name === "time4S") { return "performance-data.time4-states-s"; }
        else if (name === "time4") { return "performance-data.time4-states"; }
        else if (name === "time4L") { return "performance-data.time4-states-l"; }
        else if (name === "time16S") { return "performance-data.time16-states-s"; }
        else if (name === "time16") { return "performance-data.time16-states"; }
        else if (name === "time16L") { return "performance-data.time16-states-l"; }
        else if (name === "time32S") { return "performance-data.time32-states-s"; }
        else if (name === "time32") { return "performance-data.time32-states"; }
        else if (name === "time32L") { return "performance-data.time32-states-l"; }
        else if (name === "time64S") { return "performance-data.time64-states-s"; }
        else if (name === "time64") { return "performance-data.time64-states"; }
        else if (name === "time64L") { return "performance-data.time64-states-l"; }
        else if (name === "time128S") { return "performance-data.time128-states-s"; }
        else if (name === "time128") { return "performance-data.time128-states"; }
        else if (name === "time128L") { return "performance-data.time128-states-l"; }
        else if (name === "time256S") { return "performance-data.time256-states-s"; }
        else if (name === "time256") { return "performance-data.time256-states"; }
        else if (name === "time256L") { return "performance-data.time256-states-l"; }
        else if (name === "time512S") { return "performance-data.time512-states-s"; }
        else if (name === "time512") { return "performance-data.time512-states"; }
        else if (name === "time512L") { return "performance-data.time512-states-l"; }
        else if (name === "time1024S") { return "performance-data.time1024-states-s"; }
        else if (name === "time1024") { return "performance-data.time1024-states"; }
        else if (name === "time1024L") { return "performance-data.time1024-states-l"; }
        else if (name === "time2048S") { return "performance-data.time2048-states-s"; }
        else if (name === "time2048") { return "performance-data.time2048-states"; }
        else if (name === "time2048L") { return "performance-data.time2048-states-l"; }
        else if (name === "time4096S") { return "performance-data.time4096-states-s"; }
        else if (name === "time4096") { return "performance-data.time4096-states"; }
        else if (name === "time4096L") { return "performance-data.time4096-states-l"; }
        else if (name === "time8192S") { return "performance-data.time8192-states-s"; }
        else if (name === "time8192") { return "performance-data.time8192-states"; }
        else if (name === "time8192L") { return "performance-data.time8192-states-l"; }


      };

      var checkData = function (value) {
        if (value === -1 || value === undefined) return undefined;
        else return value;
      };

      var getPage = function (grid) {

        //from, how many, sort, filter
        getData($scope.state.lastSort, $scope.state.lastfilter, grid, null, null)
          .then(function (data) {

            processRequestInGrid(data, grid);
          });
      };

      var processRequestInGrid = function (response, grid) {
        // console.log(grid.data);
        switch (grid.data) {
          case "performance826":
            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                es: checkData(entry._source['performance-data'].es),
                ses: checkData(entry._source['performance-data'].ses),
                uas: checkData(entry._source['performance-data'].unavailability),
                radiosignal: entry._source['radio-signal-id']
              };

              list.push(item);

            });
            $scope.performance826 = list;
            $scope.gridOptionsPerformance826.totalItems = response.data.hits.total;
            break;
          case "transmissionLevel":
            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                txmin: checkData(entry._source['performance-data']['tx-level-min']),
                txavg: checkData(entry._source['performance-data']['tx-level-avg']),
                txmax: checkData(entry._source['performance-data']['tx-level-max']),
                radiosignal: entry._source['radio-signal-id']
              };

              list.push(item);

            });
            $scope.transmissionLevel = list;
            $scope.gridOptionsTransmissionLevel.totalItems = response.data.hits.total;

            break;
          case "receiveLevel":

            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                rxmin: checkData(entry._source['performance-data']['rx-level-min']),
                rxavg: checkData(entry._source['performance-data']['rx-level-avg']),
                rxmax: checkData(entry._source['performance-data']['rx-level-max']),
                radiosignal: entry._source['radio-signal-id']
              };

              list.push(item);

            });
            $scope.receiveLevel = list;
            $scope.gridOptionsReceiveLevel.totalItems = response.data.hits.total;

            break;
          case "modulation":

            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                time2S: checkData(entry._source['performance-data']['time2-states-s']),
                time2: checkData(entry._source['performance-data']['time2-states']),
                time2L: checkData(entry._source['performance-data']['time2-states-l']),
                time4S: checkData(entry._source['performance-data']['time4-states-s']),
                time4: checkData(entry._source['performance-data']['time4-states']),
                time4L: checkData(entry._source['performance-data']['time4-states-l']),
                time16S: checkData(entry._source['performance-data']['time16-states-s']),
                time16: checkData(entry._source['performance-data']['time16-states']),
                time16L: checkData(entry._source['performance-data']['time16-states-l']),
                time32S: checkData(entry._source['performance-data']['time32-states-s']),
                time32: checkData(entry._source['performance-data']['time32-states']),
                time32L: checkData(entry._source['performance-data']['time32-states-l']),
                time64S: checkData(entry._source['performance-data']['time64-states-s']),
                time64: checkData(entry._source['performance-data']['time64-states']),
                time64L: checkData(entry._source['performance-data']['time64-states-l']),
                time128S: checkData(entry._source['performance-data']['time128-states-s']),
                time128: checkData(entry._source['performance-data']['time128-states']),
                time128L: checkData(entry._source['performance-data']['time128-states-l']),
                time256S: checkData(entry._source['performance-data']['time256-states-s']),
                time256: checkData(entry._source['performance-data']['time256-states']),
                time256L: checkData(entry._source['performance-data']['time256-states-l']),
                time512S: checkData(entry._source['performance-data']['time512-states-s']),
                time512: checkData(entry._source['performance-data']['time512-states']),
                time512L: checkData(entry._source['performance-data']['time512-states-l']),
                time1024S: checkData(entry._source['performance-data']['time1024-states-s']),
                time1024: checkData(entry._source['performance-data']['time1024-states']),
                time1024L: checkData(entry._source['performance-data']['time1024-states-l']),
                time2048S: checkData(entry._source['performance-data']['time2048-states-s']),
                time2048: checkData(entry._source['performance-data']['time2048-states']),
                time2048L: checkData(entry._source['performance-data']['time2048-states-l']),
                time4096S: checkData(entry._source['performance-data']['time4096-states-s']),
                time4096: checkData(entry._source['performance-data']['time4096-states']),
                time4096L: checkData(entry._source['performance-data']['time4096-states-l']),
                time8192S: checkData(entry._source['performance-data']['time8192-states-s']),
                time8192: checkData(entry._source['performance-data']['time8192-states']),
                time8192L: checkData(entry._source['performance-data']['time8192-states-l']),
                radiosignal: entry._source['radio-signal-id']
              };

              list.push(item);

            });
            $scope.modulation = list;
            $scope.gridOptionsModulation.totalItems = response.data.hits.total;

            break;

          case "temperature":
            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                rfTempMin: entry._source['performance-data']['rf-temp-min'],
                rfTempAvg: entry._source['performance-data']['rf-temp-avg'],
                rfTempMax: entry._source['performance-data']['rf-temp-max'],
                radiosignal: entry._source['radio-signal-id']
              };

              list.push(item);

            });
            $scope.temperature = list;
            $scope.gridOptionsTemperature.totalItems = response.data.hits.total;

            break;

          case "snir":
            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                snirMin: entry._source['performance-data']['snir-min'],
                snirAvg: entry._source['performance-data']['snir-avg'],
                snirMax: entry._source['performance-data']['snir-max'],
                radiosignal: entry._source['radio-signal-id']
              };

              list.push(item);

            });
            $scope.snir = list;
            $scope.gridOptionsSnir.totalItems = response.data.hits.total;

            break;

          case "crossPolarDiscrimination":
            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                xpdMin: entry._source['performance-data']['xpd-min'],
                xpdAvg: entry._source['performance-data']['xpd-avg'],
                xpdMax: entry._source['performance-data']['xpd-max'],
                radiosignal: entry._source['radio-signal-id']

              };

              list.push(item);

            });
            $scope.crossPolarDiscrimination = list;
            $scope.gridOptionsCrossPolarDiscrimination.totalItems = response.data.hits.total;

            break;


          case "performanceEthernetContainer":

            var list = [];

            response.data.hits.hits.map(function (entry) {
              var item = {
                timestamp: $mwtnPerformanceHistory.formatTimeStamp(entry._source['time-stamp']),
                id: $scope.onfNetworkElement.getLpById(entry._source['uuid-interface']).getLabel() || entry._source['uuid-interface'],
                layerProtocol: entry._source['layer-protocol-name'],
                suspectInterval: entry._source['suspect-interval-flag'],
                scannerId: entry._source['scanner-id'],
                period: entry._source['granularity-period'],
                txEthernetBytesMaxS: checkData(entry._source['performance-data']['tx-ethernet-bytes-max-s']),
                txEthernetBytesMaxM: checkData(entry._source['performance-data']['tx-ethernet-bytes-max-m']),
                txEthernetBytesSum: checkData(entry._source['performance-data']['tx-ethernet-bytes-sum'])

              };

              list.push(item);

            });
            $scope.performanceEthernetContainer = list;
            $scope.gridOptionsPerformanceEthernetContainer.totalItems = response.data.hits.total;

            break;
        }
      };

      var getData = function (sort, query, grid, currFilter, currSort) {

        // console.log(grid);
        var pagesize;
        var pagenr;

        switch (grid.data) { //get pagesize / nr according to current grid (else everything gets messy => wana get next page in grid a, get next page for grid b too)
          case 'performance826':
            pagesize = $scope.gridOptionsPerformance826.paginationPageSize;
            pagenr = $scope.gridOptionsPerformance826.paginationCurrentPage;
            break;

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

          case 'performanceEthernetContainer':
            pagesize = $scope.gridOptionsPerformanceEthernetContainer.paginationPageSize;
            pagenr = $scope.gridOptionsPerformanceEthernetContainer.paginationCurrentPage;
            break;
          
          default:
            $mwtnLog.warning({component: COMPONENT, message: ['Unexpected grid.data', grid.data, '!'].join(' ')});
        }

        if (grid !== undefined) {

          if ($scope.state.grid === null || $scope.state.grid === undefined) {
            $scope.state.grid = grid.data;
          }

          //check, if sort/filter params are for current grid
          if ($scope.state.grid !== grid.data) {
            $scope.state.sort = false;
            $scope.state.lastSort = null;
            $scope.state.filter = false;
            $scope.state.lastfilter = null;
            if (currSort !== null) {
              sort = currSort;
            } else {
              sort = null;
            }

            if (currFilter !== null) {
              query = currFilter;
            } else {
              query = null;
            }

            //update current grid
            $scope.state.grid = grid.data;
          }
        }

        if (!sort) { //default sort value
          sort = [{ 'time-stamp': { order: 'desc' } }];
          //sort=[];
        }
        if (!query) { //default filter value
          query = { query: { bool: { must: [{ prefix: globalFilter }] } } };
        }

        //add layer protocol selector to filter query
        var localQuery = angular.copy(query); //copy the object for adding layerprotocol locally
        var lpn = $scope.layerProtocol;
        if (lpn === 'ETC' && $scope.revision.contains('2016')) lpn = 'ETH-CTP';
        localQuery.query.bool.must.push({ prefix: { "layer-protocol-name": lpn } });

        //add interface selector to filter query
        if ($scope.selecteditem.selectedLtpId) {
          localQuery.query.bool.must.push({ prefix: { "uuid-interface": $scope.selecteditem.selectedLtpId } });
        }

        var selected15minPeriod = true;
        if ($scope.selecteditem.timePeriod !== $scope.timePeriods[0]) selected15minPeriod = false;
        console.warn('selected15minPeriod', selected15minPeriod);
        return $mwtnPerformanceHistory.getFilteredSortedData((pagenr - 1) * pagesize, pagesize, sort, localQuery, selected15minPeriod);
      };

      /**
       * function to calculate the current open tab
       * @param status - Object of current tab opening information
       * @param previousStatus - optional Object of previous tab opening information
       * @return latest opened tab key or undefined, in case none is currently open
       */
      var getKey = function(status, previousStatus) {
        var result = Object.keys(status).filter(function(key){
          return status[key] === true && !(previousStatus && previousStatus[key])
        });
        if (result.length > 0) {
          return result[0];
        }
      }

      // events  
      $scope.status = { performance826: true, performanceEthernetContainer: false };
      $scope.spinner = {};

      $scope.$watch(function() {
        return $scope.selecteditem;
      }, function (newValue, oldValue) {
        console.warn('selecteditem###', newValue, oldValue, $scope.networkElementId );

        if (newValue.selectedLtpId && newValue.selectedLtpId !== oldValue.selectedLtpId && $scope.onfNetworkElement) {
          $scope.layerProtocol = $scope.onfNetworkElement.getLpById(newValue.selectedLtpId).getLayer();

          $scope.performance826 = [];
          $scope.receiveLevel = [];
          $scope.transmissionLevel = [];
          $scope.modulation = [];
          $scope.temperature = [];
          $scope.performanceEthernetContainer = [];
          $scope.snir = [];
          $scope.crossPolarDiscrimination = [];
          $scope.jsonvalue = [];

          // if all tabs are closed - open first.
          var isOneTabOpen = Object.keys($scope.status).filter(function(key){
            return $scope.status[key] === true; 
          }).length > 0;
          if (!isOneTabOpen) {
            $scope.status = { performance826: $scope.layerProtocol === 'MWPS', performanceEthernetContainer: $scope.layerProtocol === 'ETC' };
          }
        }

        chooseGrid(getKey($scope.status));

      }, true);
      

      $scope.$watch('status', function (status, oldValue) {
        console.warn('status', status, oldValue,$scope.networkElementId );
        if ($scope.networkElementId && status && status !== oldValue) {
          chooseGrid(getKey(status, oldValue));
        }
      }, true);


      // $scope.$watch(function(){
      //   $scope.selecteditem.timePeriod;
      // }, function (newValue, oldValue) {
      //   console.warn('timePeriod', status, oldValue,$scope.networkElementId );
      //   if (newValue && oldValue !== "" && newValue !== oldValue) {
      //     chooseGrid(getKey($scope.status));
      //   }
      // }, true);

      $scope.collapseAll = function () {
        // close all groups
        Object.keys($scope.status).map(function (group) {
          $scope.status[group] = false;
        });
        Object.keys($scope.spinner).map(function (group) {
          $scope.spinner[group] = false;
        });
      };

      var order = $mwtnPerformanceHistory.layerProtocolNameOrder;

      /**
       * @function updateNe 
       * A function, which updates onfNetworkElement by new data.
       * @param {*} data New data recieved from OpenDaylight via RestConf
       */
      var updateNe = function(data) {
        if (!data) return;
        // update onfNetworkElement
        switch ($scope.revision) {
          case '2016-08-09':
          case '2016-08-11':
          case '2016-09-01':
          case '2017-02-17':
          case '2017-03-20':
          case '2017-03-24':
            // console.log(JSON.stringify(data));        
            $scope.onfNetworkElement = new OnfNetworkElement(data['network-element']);
            $scope.onfLtps = $scope.onfNetworkElement.getLogicalTerminationPoints().filter(function(ltp){
              return ltp.getLayer() === 'MWPS' || ltp.getLayer() === 'ETC';
            }).sort(function(a, b){
              if(order[a.getLayer()] < order[b.getLayer()]) return 1;
              if(order[a.getLayer()] > order[b.getLayer()]) return -1;
              if(a.getId() < b.getId()) return -1;
              if(a.getId() > b.getId()) return 1;
              return 0;
            });
            $scope.availableLtpIds = $scope.onfLtps.map(function(ltp){
              return {key: ltp.getLayerProtocols()[0].getId(), label:ltp.getLabel()};
            });
            if ($scope.availableLtpIds.length > 0) {
              $scope.selecteditem.selectedLtpId = $scope.availableLtpIds[0].key;
            }
            break;
          default:
            $mwtnLog.info({component: COMPONENT, message: ['The ONF Microwave Model revision', $scope.revision, ' is not supported (yet)!'].join(' ')});
            $scope.onfNetworkElement = {};
            $scope.onfLtps = {};
        }
      };

      var updatePart = function(spec, data) {
        switch (spec.pacId) {
          case 'ne':
            updateNe(data);
            break;
        }
      };

      //get data on ne selection
      $scope.$watch('networkElement', function (neId, oldValue) {
        console.warn('networkElement', neId, oldValue,$scope.networkElementId );
        
        if (neId && neId !== '' && neId !== oldValue) {
          $scope.selecteditem.selectedLtpId = undefined;
          var revision;
          $scope.networkElements.map(function (ne) {
            if (ne.id === neId) revision = ne.revision;
          });
          $scope.networkElementId = neId;
          $scope.revision = revision;

          //get data
          var filter = { "query": { "bool": { "must": [{ "prefix": { "node-name": $scope.networkElementId } }] } } };
          // var filter={"query":{"bool":{"must":[{"prefix":{"node-name": "new"}}]}}}; //first part of my local simulator name
          globalFilter = filter.query.bool.must[0].prefix;
          $scope.state.filter = true;
          $scope.state.lastfilter = filter;
          $scope.state.sort = false;
          $scope.state.lastSort = null;

          // get onf network element data
          var spec = {
            nodeId: $scope.networkElementId,
            revision: $scope.revision,
            pacId: 'ne'
          };
          console.warn('PM HIstory getPacPMHistory', JSON.stringify(spec));
          $mwtnPerformanceHistory.getPacParts(spec).then(function(success){
            $scope.collapseAll();
            // console.warn('PM HIstory getPacPMHistory', JSON.stringify(success));
            updatePart(spec, $mwtnPerformanceHistory.yangifyObject(success));
          }, function(error){
            console.error(JSON.stringify(error));
            $scope.collapseAll();
            updatePart(spec, error);
          });
        }
      });

      var chooseGrid = function (key) {
        if (!$scope.networkElementId || !key) return;

            switch (key) {

              case 'performance826':
                getData(null, null, $scope.gridOptionsPerformance826).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsPerformance826);
                  }
                });
                break;

              case 'receiveLevel':
                getData(null, null, $scope.gridOptionsReceiveLevel).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsReceiveLevel);
                  }
                });
                break;

              case 'transmissionLevel':
                getData(null, null, $scope.gridOptionsTransmissionLevel).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsTransmissionLevel);
                  }
                });
                break;

              case 'modulation':
                getData(null, null, $scope.gridOptionsModulation).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsModulation);
                  }
                });
                break;

              case 'temperature':
                getData(null, null, $scope.gridOptionsTemperature).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsTemperature);
                  }
                });
                break;

              case 'snir':
                getData(null, null, $scope.gridOptionsSnir).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsSnir);
                  }
                });
                break;

              case 'crossPolarDiscrimination':
                getData(null, null, $scope.gridOptionsCrossPolarDiscrimination).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsCrossPolarDiscrimination);
                  }
                });
                break;

              case 'performanceEthernetContainer':
                getData(null, null, $scope.gridOptionsPerformanceEthernetContainer).then(function (response) {
                  if (response.data.hits.hits) {
                    processRequestInGrid(response, $scope.gridOptionsPerformanceEthernetContainer);
                  }
                });
                break;
            }
            $window.dispatchEvent(new Event("resize"));
      };
    }]);
  });
