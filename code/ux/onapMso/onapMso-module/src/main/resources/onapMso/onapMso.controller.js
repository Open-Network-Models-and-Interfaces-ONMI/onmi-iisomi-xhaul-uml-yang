/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/onapMso/onapMso.module',
  'app/onapMso/onapMso.services'],
  function (onapMsoApp) {

    onapMsoApp.register.controller('onapMsoCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$onapMso', '$mwtnLog',
      function (uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $onapMso, $mwtnLog) {

        var COMPONENT = 'onapMsoCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'onapMsoCtrl started!' });

        $rootScope.section_logo = 'src/app/onapMso/images/onapMso.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

        $scope.odlKarafVersion = $onapMso.odlKarafVersion;
        $scope.highlightFilteredHeader = $onapMso.highlightFilteredHeader;


      }]);

  });
