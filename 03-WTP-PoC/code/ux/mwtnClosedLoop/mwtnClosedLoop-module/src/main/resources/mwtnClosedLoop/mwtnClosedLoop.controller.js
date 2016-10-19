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

    $scope.timerOptionList = [
        {id : '5seconds', name : "5 seconds"},
        {id : '30seconds', name : "30 seconds"},
        {id : '1minute', name : "One minute"},
        {id : '2minutes', name : "Two minutes"},
        {id : '30minutes', name : "30 minutes"},
        {id : '1hour', name : "One hour"}]

    $scope.executeNow = function() {
        console.log('Execute NOW');
        $mwtnCommons.executeClosedLoopAutomation().then(function(message){
          $mwtnLog.info({component: 'mwtnClosedLoopCtrl', message: 'Closed loop automation was started'});
          alert('Closed loop automation was started');
        }, function(error){
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: 'Cannot execute Closed Loop Automation'});
          alert('Cannot execute Closed Loop Automation');
        });
    };

    $scope.save = function() {
        $mwtnCommons.saveClosedLoopAutomation($scope.timerEnabled, $scope.timerOption).then(function(message){
          $mwtnLog.info({component: 'mwtnClosedLoopCtrl', message: 'Timer was changed'});
          alert('Timer was changed')
        }, function(error){
          console.log(error);
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: 'Cannot save timer'});
          alert('Cannot save timer');
        });
    };

    $scope.read = function() {
        $mwtnCommons.readClosedLoopAutomation().then(function(message){
           $scope.timerEnabled = message.data.output.enabled;
           $scope.timerOption = message.data.output.option;
        }, function(error){
          console.log(error);
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: 'Cannot read data from the server'});
          alert('Cannot read data from the server');
        });
     };

     $scope.read();

  }]);


});
