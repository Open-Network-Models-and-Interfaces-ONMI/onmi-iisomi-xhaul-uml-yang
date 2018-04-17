/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/otnBrowser/otnBrowser.module',
  'app/otnBrowser/otnBrowser.services'],
  function (otnBrowserApp) {

    otnBrowserApp.register.controller('otnBrowserCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$otnBrowser', '$mwtnLog',
      function (uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $otnBrowser, $mwtnLog) {

        var COMPONENT = 'otnBrowserCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'otnBrowserCtrl started!' });

        $rootScope.section_logo = 'src/app/otnBrowser/images/otnBrowser.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

        $scope.highlightFilteredHeader = $otnBrowser.highlightFilteredHeader;

      }]);

  });
