/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/onapDcae/onapDcae.module',
  'app/onapDcae/onapDcae.services'],
  function (onapDcaeApp) {

    onapDcaeApp.register.controller('onapDcaeCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$onapDcae', '$mwtnLog',
      function (uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $onapDcae, $mwtnLog) {

        var COMPONENT = 'onapDcaeCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'onapDcaeCtrl started!' });

        $rootScope.section_logo = 'src/app/onapDcae/images/onapDcae.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

      }]);

  });
