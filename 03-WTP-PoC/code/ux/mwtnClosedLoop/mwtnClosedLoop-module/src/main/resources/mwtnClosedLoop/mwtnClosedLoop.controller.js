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

    var timerIterationList = [
        {id : 1, name : "5 seconds"},
        {id : 2, name : "30 seconds"},
        {id : 3, name : "60 seconds"},
        {id : 4, name : "5 minutes"},
        {id : 5, name : "1 hour"}]

    $scope.timerIterationList = timerIterationList;
    $scope.timerIteration = timerIterationList[0];

    $scope.timerStatus = true;

    $scope.executeNow = function() {
        console.log('Execute NOW');
        $mwtnCommons.executeClosedLoopAutomation().then(function(message){
          $mwtnLog.info({component: 'mwtnClosedLoopCtrl', message: 'Closed loop automation was started'});
          alert('Closed loop automation was started');
        }, function(error){
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: error});
          alert('Error: '+error);
        });
    };

    $scope.save = function() {
        console.log('Change timer ...');
        $mwtnCommons.saveClosedLoopAutomation(true, 100).then(function(message){
          $mwtnLog.info({component: 'mwtnClosedLoopCtrl', message: 'Timer was changed'});
          alert('Timer was changed')
        }, function(error){
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: error});
          alert('Error: '+error);
        });
    };

  }]);


});
