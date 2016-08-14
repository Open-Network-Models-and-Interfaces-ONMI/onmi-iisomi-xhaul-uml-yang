/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnClosedLoop/mwtnClosedLoop.module','app/mwtnClosedLoop/mwtnClosedLoop.services','app/mwtnCommons/mwtnCommons.services'], function(mwtnClosedLoopApp) {

  mwtnClosedLoopApp.register.controller('mwtnClosedLoopCtrl', ['$scope', '$rootScope', '$mwtnClosedLoop', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnClosedLoop, $mwtnCommons, $mwtnLog) {

    $mwtnLog.info('mwtnClosedLoopCtrl started!');
    $rootScope['section_logo'] = 'src/app/mwtnClosedLoop/images/mwtnClosedLoop.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnClosedLoopInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
