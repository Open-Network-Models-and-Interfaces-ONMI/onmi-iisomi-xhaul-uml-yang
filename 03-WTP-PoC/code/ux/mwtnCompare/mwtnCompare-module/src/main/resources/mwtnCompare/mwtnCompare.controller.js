/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCompare/mwtnCompare.module','app/mwtnCompare/mwtnCompare.services','app/mwtnCommons/mwtnCommons.services',
        'app/mwtnCommons/bower_components/angular-ui-grid/ui-grid.min'], function(mwtnCompareApp) {

  mwtnCompareApp.register.controller('mwtnCompareCtrl', ['$scope', '$rootScope', '$mwtnCompare', '$mwtnLog', 
                                                         function($scope, $rootScope, $mwtnCompare, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnCompare/images/mwtnCompare.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    var initNodeList = function(nodes){
      $scope.networkElements = [];
      if (nodes.length > 0) {
        nodes.map(function(ne) {
          console.log(JSON.stringify(ne));
          if (ne.onfAirIinterfaceRevision) {
            $scope.networkElements.push({id:ne._id, revision:ne._source.onfAirIinterfaceRevision});
            
          }
        });
        $scope.networkElements.sort(function(a, b){
          if(a.id < b.id) return -1;
          if(a.id > b.id) return 1;
          return 0;
        });
        
        // select one of the nodes
        var select = parseInt(Math.random()*$scope.networkElements.length);
        console.log($scope.networkElements.length, JSON.stringify($scope.networkElements));
        $scope.networkElement = $scope.networkElements[select].id;
      }
    };
    var requiredNetworkElements = [];
    $mwtnCompare.getRequiredNetworkElements(true).then(function(nodes){
      requiredNetworkElements = nodes;
      initNodeList(nodes);
    }, function(error){
      $scope.networkElements = [];
    });

  }]);


});
