/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTest/mwtnTest.module','app/mwtnTest/mwtnTest.services'], function(mwtnTestApp) {

  mwtnTestApp.register.controller('mwtnTestCtrl', ['$scope', '$rootScope', '$mwtnTest', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnTest, $mwtnCommons, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnTest/images/mwtnTest.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnTestInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
