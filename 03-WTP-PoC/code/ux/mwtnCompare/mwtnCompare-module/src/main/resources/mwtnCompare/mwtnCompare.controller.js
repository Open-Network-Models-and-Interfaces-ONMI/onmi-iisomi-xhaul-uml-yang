/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCompare/mwtnCompare.module','app/mwtnCompare/mwtnCompare.services','app/mwtnCommons/mwtnCommons.services'], function(mwtnCompareApp) {

  mwtnCompareApp.register.controller('mwtnCompareCtrl', ['$scope', '$rootScope', '$mwtnCompare', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnCompare, $mwtnCommons, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnCompare/images/mwtnCompare.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnCompareInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
