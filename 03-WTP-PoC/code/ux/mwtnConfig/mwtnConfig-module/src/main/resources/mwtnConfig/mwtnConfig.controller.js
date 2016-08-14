/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnConfig/mwtnConfig.module','app/mwtnConfig/mwtnConfig.services', 'app/mwtnCommons/mwtnCommons.services'], function(mwtnConfigApp) {

  mwtnConfigApp.register.controller('mwtnConfigCtrl', ['$scope', '$rootScope', '$mwtnConfig', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnConfig, $mwtnCommons, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnConfig/images/mwtnConfig.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnConfigInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
