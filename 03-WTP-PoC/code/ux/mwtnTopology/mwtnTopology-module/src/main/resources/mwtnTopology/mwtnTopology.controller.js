/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTopology/mwtnTopology.module', 
        'app/mwtnTopology/mwtnTopology.services', 
        'app/mwtnCommons/mwtnCommons.services'], function(mwtnTopologyApp) {

  mwtnTopologyApp.register.controller('mwtnTopologyCtrl', ['$scope', '$rootScope', '$mwtnTopology', '$mwtnLog', 
                                             function($scope, $rootScope, $mwtnTopology, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnTopology/images/mwtnTopology.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
    $scope.oneAtATime = true;
    $scope.layers = [
        {
          label : 'Site',
          section : [
              {
                label : 'Map',
                template : 'src/app/mwtnTopology/templates/maps.tpl.html'
              },
              {
                label : 'Sites',
                template : 'src/app/mwtnTopology/templates/grid.tpl.html'
              },
              {
                label : 'Site links',
                template : 'src/app/mwtnTopology/templates/grid.tpl.html'
              } ]
        },
        {
          label : 'Microwave / Miiiimeterwave',
          section : [
              {

                label : 'Map',
                template : 'src/app/mwtnTopology/templates/topology.tpl.html'
              },
              {
                label : 'Air interfaces',
                template : 'src/app/mwtnTopology/templates/grid.tpl.html'
              },
              {
                label : 'MWR links',
                template : 'src/app/mwtnTopology/templates/grid.tpl.html'
              } ]
        },
        {
          label : 'Ethernet',
          section : [
              {
                label : 'Map',
                template : 'src/app/mwtnTopology/templates/topology.tpl.html'
              },
              {
                label : 'Ports (ETH-CTPs)',
                template : 'src/app/mwtnTopology/templates/grid.tpl.html'
              },
              {
                label : 'Ethernet connections',
                template : 'src/app/mwtnTopology/templates/grid.tpl.html'
              } ]
        } ];
    
  }]);

});
