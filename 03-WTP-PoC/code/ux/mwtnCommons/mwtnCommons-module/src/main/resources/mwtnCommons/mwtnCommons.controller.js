/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module','app/mwtnCommons/mwtnCommons.services'], function(mwtnCommonsApp) {

  mwtnCommonsApp.register.controller('mwtnCommonsCtrl', ['$scope', '$rootScope', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnCommons, $mwtnLog) {

    $rootScope['section_logo'] = ''; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnCommonsInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
