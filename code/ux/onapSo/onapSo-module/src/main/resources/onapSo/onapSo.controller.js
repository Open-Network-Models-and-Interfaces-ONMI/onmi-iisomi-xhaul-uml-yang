/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/onapSo/onapSo.module',
  'app/onapSo/onapSo.services'],
  function (onapSoApp) {

    onapSoApp.register.controller('onapSoCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$onapSo', '$mwtnLog',
      function (uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $onapSo, $mwtnLog) {

        var COMPONENT = 'onapSoCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'onapSoCtrl started!' });

        $rootScope.section_logo = 'src/app/onapSo/images/onapSo.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

        $scope.highlightFilteredHeader = $onapSo.highlightFilteredHeader;

        $scope.pnf = {
          pnfName: { id: 'pnfName', labelId: 'PNF_NAME', value: 'New-PNF' },
          pnfId: { id: 'pnfId', labelId: 'PNF_IDENTIFIER', value: 'New-PNF network unique identifier' },
          equipType: { id: 'equipType', labelId: 'PNF_EQUIPMENT_TYPE', value: 'Fancy equipment type' },
          equipModel: { id: 'equipModel', labelId: 'PNF_EQUIPMENT_MODEL', value: 'Best in class' },
          equipVendor: { id: 'equipVendor', labelId: 'PNF_EQUIPMENT_VENDOR', value: 'ONAP SDN-R Community' },
          ipaddressV4Oam: { id: 'ipaddressV4Oam', labelId: 'PNF_IPv4ADDRESS', value: '10.10.10.10' },
          inMaintenance: { id: 'inMaintenance', labelId: 'PNF_MAINTENANCE_MODE', value: false },
          resourceVersion: { id: 'resourceVersion', labelId: 'PNF_RESOURCE_VERSION', value: '' }
        }

        $scope.createPnfInAai = function () {
          
          var data = {
            "pnf-name": $scope.pnf.pnfName.value,
            "pnf-id": $scope.pnf.pnfId.value,
            "equip-type": $scope.pnf.equipType.value,
            "equip-model": $scope.pnf.equipModel.value,
            "equip-vendor": $scope.pnf.equipVendor.value,
            "ipaddress-v4-oam": $scope.pnf.ipaddressV4Oam.value,
            "in-maint": $scope.pnf.inMaintenance.value
          }

          $onapSo.createPnf(data).then(function (response) {
            console.info('successfully created: ', data['pnf-name']);
            $onapSo.getPnf(data).then(function (success) {
              // console.info('success', JSON.stringify(success.data));
              $scope.pnf.resourceVersion.value = success.data['resource-version'];
            }, function (error) {
              console.log('error1', JSON.stringify(error.data));
              $scope.error = error;
            });
            }, function (error) {
            console.log('error2', JSON.stringify(error.data));
            $scope.error = error;
          });
        }

        $scope.deletePnfInAai = function () {
          var data = {
            "pnf-name": $scope.pnf.pnfName.value,
          }          
          $onapSo.getPnf(data).then(function (success) {
              console.info('success', JSON.stringify(success.data));
              $scope.pnf.resourceVersion.value = success.data['resource-version'];
            data['resource-version'] = success.data['resource-version'];
            $onapSo.deletePnf(data).then(function (success) {
              console.info('success', JSON.stringify(success));
              $scope.pnf.resourceVersion.value = success.data['resource-version'];
            }, function (error) {
              console.log('error', JSON.stringify(error.data));
              $scope.error = error;
            });
            }, function (error) {
            console.log('error', JSON.stringify(error.data));
            $scope.error = error;
          });
        }

      }]);

    });
