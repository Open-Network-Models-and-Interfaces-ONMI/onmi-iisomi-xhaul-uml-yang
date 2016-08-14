/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTopology/mwtnTopology.module', 'app/mwtnTopology/mwtnTopology.services', 'app/mwtnCommons/mwtnCommons.services'], function(mwtnTopologyApp) {

  mwtnTopologyApp.register.controller('mwtnTopologyCtrl', ['$scope', '$rootScope', '$mwtnTopology', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnTopology, $mwtnCommons, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnTopology/images/mwtnTopology.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnTopologyInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
