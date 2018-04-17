/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/ethService/ethService.module',
  'app/ethService/ethService.services'],
  function (ethServiceApp) {

    ethServiceApp.register.controller('ethServiceCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$ethService', '$mwtnLog',
      function (uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $ethService, $mwtnLog) {

        var COMPONENT = 'ethServiceCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'ethServiceCtrl started!' });

        $rootScope.section_logo = 'src/app/ethService/images/ethService.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

        $scope.highlightFilteredHeader = $ethService.highlightFilteredHeader;

      }]);

  });
