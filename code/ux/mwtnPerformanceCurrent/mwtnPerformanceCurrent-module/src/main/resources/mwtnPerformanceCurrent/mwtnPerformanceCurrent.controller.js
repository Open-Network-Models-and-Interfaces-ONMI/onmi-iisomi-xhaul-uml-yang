/*
 * @copyright 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * @license
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnPerformanceCurrent/mwtnPerformanceCurrent.module',
  'app/mwtnPerformanceCurrent/mwtnPerformanceCurrent.services'],
  function (mwtnPerformanceCurrentApp) {

    mwtnPerformanceCurrentApp.register.controller('mwtnPerformanceCurrentCtrl', ['$scope', '$rootScope', '$window', '$translate', '$mwtnLog', '$mwtnPerformanceCurrent', 'uiGridConstants', 'OnfNetworkElement', 
                                                 function ($scope, $rootScope, $window, $translate, $mwtnLog, $mwtnPerformanceCurrent, uiGridConstants, OnfNetworkElement) {

      var COMPONENT = 'mwtnPerformanceCurrent';
      $mwtnLog.info({ component: COMPONENT, message: 'mwtnPerformanceCurrent started!' });

      $rootScope.section_logo = 'src/app/mwtnPerformanceCurrent/images/mwtnPerformance.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

      var radioSignalMap = new Map(); //holds uuid/singalid

      var initPac = {
        layerProtocol: 'unknown'
      };

      $scope.layerProtocol = 'MWPS';
      $scope.layerProtocols = ['MWPS', 'ETC'];

      var updateNe = function (data) {
        if (!data) return;

        // update onfNetworkElement
        switch (data.revision) {
          case '2016-03-23':
            $mwtnLog.info({ component: COMPONENT, message: 'Revision ' + data.revision + 'not supported!' });
            break;
          default: //4. PoC
            $scope.onfNetworkElement = JSON.parse(JSON.stringify(data['network-element']));
            $scope.onfLtps = data['network-element'].ltp;
            $scope.onfNetworkElement.ltpRefList = undefined;
        }

        // update onfLTPs
        var order = $mwtnPerformanceCurrent.layerProtocolNameOrder;
        $scope.onfLtps.sort(function (a, b) {
          if (order[a.lp[0]['layer-protocol-name']] < order[b.lp[0]['layer-protocol-name']]) return -1;
          if (order[a.lp[0]['layer-protocol-name']] > order[b.lp[0]['layer-protocol-name']]) return 1;
          if (a.lp[0].uuid < b.lp[0].uuid) return -1;
          if (a.lp[0].uuid > b.lp[0].uuid) return 1;
          return 0;
        });

        // calculate conditional packages
        $scope.airinterfaces = [];
        $scope.ethernets = [];
        $scope.tdms = [];
        $scope.onfLtps.map(function (ltp) {
          var lpId = ltp.lp[0].uuid;



          switch (ltp.lp[0]['layer-protocol-name']) {
            case "MWPS":
              var init = JSON.parse(JSON.stringify(initPac));
              init.layerProtocol = lpId;
              $scope.airinterfaces.push(init);

              break;
            case "ETH-CTP":
            case "ETC":
              var init = JSON.parse(JSON.stringify(initPac));
              init.layerProtocol = lpId;
              $scope.ethernets.push(init);
              break;

            default:
              $mwtnLog.info({ component: COMPONENT, message: 'The layerProtocol ' + ltp.lp[0]['layer-protocol-name'] + ' is not supported (yet)!' });
          }
        });

        data.revision = undefined;
      };

      var updateAirInterface = function (data, key) {
        // console.log(JSON.stringify(data), lpId);

        if (Object.keys(data)[0].startsWith('air-interface-current-performance')) {

          $scope.jsonvalue.push(data);
          var label = new OnfNetworkElement($scope.onfNetworkElement).getLpById(data['layer-protocol']).getLabel() || data['layer-protocol'];
          var radioSignal = radioSignalMap.get(data['layer-protocol'])
          var list = data['air-interface-current-performance']['current-performance-data-list'] || data['air-interface-current-performance']['current-performance-data']; 
          list.map(function(item) {


            var timestamp = $mwtnPerformanceCurrent.formatTimeStamp(item.timestamp);

            switch (key) {

              case 'performance826':
                $scope.performance826.push({
                  timestamp: timestamp,
                  elapsedTime: checkData(item['elapsed-time']),
                  suspectInterval: item['suspect-interval-flag'],
                  scannerId: item['scanner-id'],
                  id: label,
                  period: item['granularity-period'],
                  es: item['performance-data'].es,
                  ses: item['performance-data'].ses,
                  uas: item['performance-data'].unavailability,
                  radioSignal: radioSignal
                });
                break;

              case 'receiveLevel':
                $scope.receiveLevel.push({
                  timestamp: timestamp,
                  elapsedTime: checkData(item['elapsed-time']),
                  suspectInterval: item['suspect-interval-flag'],
                  scannerId: item['scanner-id'],
                  id: label,
                  period: item['granularity-period'],
                  rxmin: checkData(item['performance-data']['rx-level-min']),
                  rxmax: checkData(item['performance-data']['rx-level-max']),
                  rxavg: checkData(item['performance-data']['rx-level-avg']),
                  radioSignal: radioSignal
                });
                break;

              case 'transmissionLevel':

                $scope.transmissionLevel.push({
                  timestamp: timestamp,
                  elapsedTime: checkData(item['elapsed-time']),
                  suspectInterval: item['suspect-interval-flag'],
                  scannerId: item['scanner-id'],
                  id: label,
                  period: item['granularity-period'],
                  txmin: checkData(item['performance-data']['tx-level-min']),
                  txmax: checkData(item['performance-data']['tx-level-max']),
                  txavg: checkData(item['performance-data']['tx-level-avg']),
                  radioSignal: radioSignal
                });

                break;

              case 'modulation':

                $scope.modulation.push(
                  {
                    timestamp: timestamp,
                    elapsedTime: checkData(item['elapsed-time']),
                    suspectInterval: item['suspect-interval-flag'],
                    scannerId: item['scanner-id'],
                    id: label,
                    period: item['granularity-period'],
                    time2S: checkData(item['performance-data']['time2-states-s']),
                    time2: checkData(item['performance-data']['time2-states']),
                    time2L: checkData(item['performance-data']['time2-states-l']),
                    time4S: checkData(item['performance-data']['time4-states-s']),
                    time4: checkData(item['performance-data']['time4-states']),
                    time4L: checkData(item['performance-data']['time4-states-l']),
                    time16S: checkData(item['performance-data']['time16-states-s']),
                    time16: checkData(item['performance-data']['time16-states']),
                    time16L: checkData(item['performance-data']['time16-states-l']),
                    time32S: checkData(item['performance-data']['time32-states-s']),
                    time32: checkData(item['performance-data']['time32-states']),
                    time32L: checkData(item['performance-data']['time32-states-l']),
                    time64S: checkData(item['performance-data']['time64-states-s']),
                    time64: checkData(item['performance-data']['time64-states']),
                    time64L: checkData(item['performance-data']['time64-states-l']),
                    time128S: checkData(item['performance-data']['time128-states-s']),
                    time128: checkData(item['performance-data']['time128-states']),
                    time128L: checkData(item['performance-data']['time128-states-l']),
                    time256S: checkData(item['performance-data']['time256-states-s']),
                    time256: checkData(item['performance-data']['time256-states']),
                    time256L: checkData(item['performance-data']['time256-states-l']),
                    time512S: checkData(item['performance-data']['time512-states-s']),
                    time512: checkData(item['performance-data']['time512-states']),
                    time512L: checkData(item['performance-data']['time512-states-l']),
                    time1024S: checkData(item['performance-data']['time1024-states-s']),
                    time1024: checkData(item['performance-data']['time1024-states']),
                    time1024L: checkData(item['performance-data']['time1024-states-l']),
                    time2048S: checkData(item['performance-data']['time2048-states-s']),
                    time2048: checkData(item['performance-data']['time2048-states']),
                    time2048L: checkData(item['performance-data']['time2048-states-l']),
                    time4096S: checkData(item['performance-data']['time4096-states-s']),
                    time4096: checkData(item['performance-data']['time4096-states']),
                    time4096L: checkData(item['performance-data']['time4096-states-l']),
                    time8192S: checkData(item['performance-data']['time8192-states-s']),
                    time8192: checkData(item['performance-data']['time8192-states']),
                    time8192L: checkData(item['performance-data']['time8192-states-l']),
                    radioSignal: radioSignal
                  });

                break;

              case 'temperature':

                $scope.temperature.push({
                  timestamp: timestamp,
                  elapsedTime: checkData(item['elapsed-time']),
                  suspectInterval: item['suspect-interval-flag'],
                  scannerId: item['scanner-id'],
                  id: label,
                  period: item['granularity-period'],
                  rfTempMin: item['performance-data']['rf-temp-min'],
                  rfTempAvg: item['performance-data']['rf-temp-avg'],
                  rfTempMax: item['performance-data']['rf-temp-max'],
                  radioSignal: radioSignal
                });
                break;

              case 'snir':

                $scope.snir.push({
                  timestamp: timestamp,
                  elapsedTime: checkData(item['elapsed-time']),
                  suspectInterval: item['suspect-interval-flag'],
                  scannerId: item['scanner-id'],
                  id: label,
                  period: item['granularity-period'],
                  snirMin: item['performance-data']['snir-min'],
                  snirAvg: item['performance-data']['snir-avg'],
                  snirMax: item['performance-data']['snir-max'],
                  radioSignal: radioSignal
                }
                );

                break;

              case 'crossPolarDiscrimination':

                $scope.cpdData.push({

                  timestamp: timestamp,
                  elapsedTime: checkData(item['elapsed-time']),
                  suspectInterval: item['suspect-interval-flag'],
                  scannerId: item['scanner-id'],
                  id: label,
                  period: item['granularity-period'],
                  xpdMin: item['performance-data']['xpd-min'],
                  xpdAvg: item['performance-data']['xpd-avg'],
                  xpdMax: item['performance-data']['xpd-max'],
                  radioSignal: radioSignal
                });

                break;
            }

          });

        }
      };

      var updateContainer = function (lpId, part, data) {
        // console.log(JSON.stringify(data), lpId);
        var label = new OnfNetworkElement($scope.onfNetworkElement).getLpById(data['layer-protocol']).getLabel() || data['layer-protocol'];

        if (Object.keys(data)[0].contains('ethernet-container')) {
          $scope.ethernetJsonValue.push(data);

          var list = data['ethernet-container-current-performance']['current-performance-data-list'] || data['ethernet-container-current-performance']['current-performance-data']
          list.map(function (item) {

            $scope.performanceEthernetContainer.push({
              timestamp: $mwtnPerformanceCurrent.formatTimeStamp(item['timestamp']),
              elapsedTime: checkData(item['elapsed-time']),
              suspectInterval: item['suspect-interval-flag'],
              scannerId: item['scanner-id'],
              period: item['granularity-period'],
              txEthernetBytesMaxS: checkData(item['performance-data']['tx-ethernet-bytes-max-s']),
              txEthernetBytesMaxM: checkData(item['performance-data']['tx-ethernet-bytes-max-m']),
              txEthernetBytesSum: checkData(item['performance-data']['tx-ethernet-bytes-sum']),
              id: label
            });
          });
        }
      };

      //replace -1 with undefined in json data
      var checkData = function (value) {
        if (value === -1 || value === undefined) return undefined;
        else return value;
      };

      //perf log configuration
      $scope.gridOptionsPerformance826 = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'es', type: 'string', displayName: 'ES', width: 70 },
          { field: 'ses', type: 'string', displayName: 'SES', width: 70 },
          { field: 'uas', type: 'string', displayName: 'UAS', width: 70 }
        ],
        data: 'performance826'
      };

      //receive lvl configuration
      $scope.gridOptionsReceiveLevel = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'rxmin', type: 'string', displayName: 'Rx min   [dBm]', width: 90 },
          { field: 'rxavg', type: 'string', displayName: 'Rx avg   [dBm]', width: 90 },
          { field: 'rxmax', type: 'string', displayName: 'Rx max   [dBm]', width: 90 }

        ],
        data: 'receiveLevel'
      };

      //transmission lvl configuration
      $scope.gridOptionsTransmissionLevel = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'txmin', type: 'string', displayName: 'Tx min   [dBm]', width: 90 },
          { field: 'txavg', type: 'string', displayName: 'Tx avg   [dBm]', width: 90 },
          { field: 'txmax', type: 'string', displayName: 'Tx max   [dBm]', width: 90 }

        ],
        data: 'transmissionLevel'
      };

      //modulation configuration
      $scope.gridOptionsModulation = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
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
        data: 'modulation', onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
        }
      };

      //temperature configuration
      $scope.gridOptionsTemperature = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'rfTempMin', type: 'string', displayName: 'Rf Temp Min  [&deg;C]', width: 90 },
          { field: 'rfTempAvg', type: 'string', displayName: 'Rf Temp Avg  [&deg;C]', width: 90 },
          { field: 'rfTempMax', type: 'string', displayName: 'Rf Temp Max  [&deg;C]', width: 90 }

        ],
        data: 'temperature'
      }

      //SNIR configuration
      $scope.gridOptionsSnir = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'layerProtocol', type: 'string', displayName: 'Layer Protocol Name', width: 90, visible: false},
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'snirMin', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MIN'),'[dB]'].join(' '), width: 90 },
          { field: 'snirAvg', type: 'string', displayName: [$translate.instant('MWTN_SNIR_AVG'),'[dB]'].join(' '), width: 90 },
          { field: 'snirMax', type: 'string', displayName: [$translate.instant('MWTN_SNIR_MAX'),'[dB]'].join(' '), width: 90 }
        ],
        data: 'snir'
      }

      //CPD Configuration
      $scope.gridOptionsCrossPolarDiscrimination = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'radioSignal', type: 'string', displayName: 'Radio Signal Id', width: 90 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'xpdMin', type: 'string', displayName: 'CPD min  [dB]', width: 90 },
          { field: 'xpdAvg', type: 'string', displayName: 'CPD avg  [dB]', width: 90 },
          { field: 'xpdMax', type: 'string', displayName: 'CPD max  [dB]', width: 90 }

        ],
        data: 'cpdData'
      }

      //ethernet perf configuration
      $scope.gridOptionsPerformanceEthernetContainer = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableFiltering: true,
        enableGridMenu: true,
        columnDefs: [
          
          { field: 'id', type: 'string', displayName: $translate.instant('MWTN_LP'), width: 300 },
          { field: 'scannerId', type: 'string', displayName: 'Scanner Id', width: 90 },
          {
            field: 'timestamp', type: 'string', displayName: 'Request time', width: 200, sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            }
          },
          { field: 'elapsedTime', type: 'string', displayName: 'Elapsed Time', width: 100 },
          { field: 'period', type: 'string', displayName: 'Period', width: 200 },
          { field: 'suspectInterval', type: 'string', displayName: 'Suspect Interval Flag', width: 100 },
          { field: 'txEthernetBytesMaxS', type: 'number', displayName: 'Tx BytesMaxS', width: 90 },
          { field: 'txEthernetBytesMaxM', type: 'number', displayName: 'Tx BytesMaxM', width: 90 },
          { field: 'txEthernetBytesSum', type: 'number', displayName: 'Tx BytesSum', width: 90 }

        ],
        data: 'performanceEthernetContainer'
      };

      var updatePart = function (spec, data, key) {
        switch (spec.pacId) {
          case 'ne':
            updateNe(data);
            break;

          case 'airinterface':
            console.log(JSON.stringify(spec, JSON.stringify(data)));
            updateAirInterface(data, key);
            break;

          case 'container':
            updateContainer(spec.layerProtocolId, spec.partId, data);
            break;

        }
      };

      var refreshAirInterface = function (key) {
        //get performance data from interfaces
        for (var interf of $scope.airinterfaces) {
          var airIterfaceSpec = {
            nodeId: $scope.networkElementId,
            revision: $scope.revision,
            pacId: 'airinterface',
            partId: 'CurrentPerformance',
            layerProtocolId: interf.layerProtocol
          };
          $mwtnPerformanceCurrent.getPacParts(airIterfaceSpec).then(function (data) {
            var yangfiedObj = $mwtnPerformanceCurrent.yangifyObject(data);
            updatePart(airIterfaceSpec, yangfiedObj, key);
          });
        }
      };

      $scope.collapseAll = function () {
        // close all groups
        Object.keys($scope.status).map(function (group) {
          $scope.status[group] = false;
        });
        Object.keys($scope.spinner).map(function (group) {
          $scope.spinner[group] = false;
        });
      };

      // events
      $scope.status = { performanceEthernetContainer: true };
      $scope.spinner = {};
      $scope.separator = $mwtnPerformanceCurrent.separator; //'&nbsp;'

      //get data on ne selection
      $scope.$watch('networkElement', function (neId, oldValue) {
        if (neId && neId !== '' && neId !== oldValue) {
          $scope.collapseAll();

          // clear lists visible on screen
          $scope.performance826 = [];
          $scope.receiveLevel = [];
          $scope.transmissionLevel = [];
          $scope.modulation = [];
          $scope.temperature = [];
          $scope.snir = [];
          $scope.cpdData = [];
          $scope.jsonvalue = [];
          $scope.performanceEthernetContainer = [];
          $scope.ethernetJsonValue = [];

          var revision;
          $scope.networkElements.map(function (ne) {
            if (ne.id === neId) revision = ne.revision;
          });
          $scope.networkElementId = neId;
          $scope.revision = revision;

          var spec = {
            nodeId: neId,
            revision: revision,
            pacId: 'ne'
          };

          //get ne data
          $mwtnPerformanceCurrent.getPacParts(spec).then(function (success) {
            var yangfiedObj = $mwtnPerformanceCurrent.yangifyObject(success);

            updatePart(spec, yangfiedObj);

            //get performance data from interfaces
            $scope.airinterfaces.map(function(airInterface) {

              //get configuration for airinterfaces
              var airIterfaceSpec = {
                nodeId: neId,
                revision: revision,
                pacId: 'airinterface',
                partId: 'Configuration',
                layerProtocolId: airInterface.layerProtocol
              };

              //get radioSignalID and add it to map
              $mwtnPerformanceCurrent.getPacParts(airIterfaceSpec).then(function (data) {
                var yangfiedObj = $mwtnPerformanceCurrent.yangifyObject(data);
                radioSignalMap.set(yangfiedObj['layer-protocol'], yangfiedObj['air-interface-configuration']['radio-signal-id']);
              });
            });

          }, function (error) {
            updatePart(spec, error);
          });
        }
      });

      $scope.$watch('layerProtocol', function (newValue, oldValue) {

        if (newValue && oldValue !== "" && newValue !== oldValue) {
          $scope.collapseAll();
        }

      }, true);

      //update data within tables on accordion - open
      $scope.$watch('status', function (status, oldValue) {
        Object.keys(status).map(function (key) {
          if ($scope.networkElementId && status[key] && status[key] !== oldValue[key]) {
            switch (key) {

              case 'performance826':
                $scope.performance826 = [];
                refreshAirInterface(key);
                break;

              case 'receiveLevel':
                $scope.receiveLevel = [];
                refreshAirInterface(key);
                break;

              case 'transmissionLevel':
                $scope.transmissionLevel = [];
                refreshAirInterface(key);
                break;

              case 'modulation':
                $scope.modulation = [];
                refreshAirInterface(key);
                break;

              case 'temperature':
                $scope.temperature = [];
                refreshAirInterface(key);
                break;

              case 'snir':
                $scope.snir = [];
                refreshAirInterface(key);
                break;

              case 'crossPolarDiscrimination':
                $scope.cpdData = [];
                refreshAirInterface(key);
                break;

              case 'performanceEthernetContainer':
                $scope.performanceEthernetContainer = [];
                $scope.ethernetJsonValue = [];

                //get performance data for ethernet
                $scope.ethernets.map(function (item) {
                  var ethernetSpec = {
                    nodeId: $scope.networkElementId,
                    revision: $scope.revision,
                    pacId: 'container',
                    partId: 'CurrentPerformance',
                    layerProtocolId: item.layerProtocol
                  };

                  $mwtnPerformanceCurrent.getPacParts(ethernetSpec).then(function (data) {
                    var yangfiedObj = $mwtnPerformanceCurrent.yangifyObject(data);
                    updatePart(ethernetSpec, yangfiedObj);
                  });
                });
                break;

            }
            $window.dispatchEvent(new Event("resize"));
          }
        });
      }, true);

    }]);
  });
