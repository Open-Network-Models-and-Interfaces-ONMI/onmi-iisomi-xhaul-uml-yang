/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTopology/mwtnTopology.module','app/mwtnTopology/mwtnTopology.services'], function(mwtnTopologyApp) {

  mwtnTopologyApp.register.controller('mwtnTopologyCtrl', ['$scope', '$rootScope', '$mwtnTopology', function($scope, $rootScope, $mwtnTopology) {

    $rootScope['section_logo'] = 'src/app/mwtnTopology/images/logo_mwtn_topology.png';

    $scope.data = "mwtnTopology";
    $scope.topologyData = { nodes: [], edges: []};
    $scope.sigma = null;
    $scope.tabs = [
       {id: 'site', label: 'Site', links: 'Sitelinks'}, 
       {id: 'antenna', label: 'Antenna', links: 'Antennalinks'}, 
       {id: 'mwps', label: 'Microwave Physical Section', links: 'MWPS Links'}, 
       {id: 'mws', label: 'Microwave Section', links: 'MWS Links'}, 
       {id: 'eth', label: 'Ethernet', links: 'ETH Links'}
    ];
    $scope.currentTab = 'site';
    $scope.points = {};
$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    $scope.showTab = function(layer) {
        console.log(layer);
        $scope.currentTab = layer;
	$mwtnTopology.getTopology(layer, function(topology){
            $scope[layer] = topology;
            $scope.sigma.graph.clear();
	    topology.nodes.map(function(node){
                // console.log(JSON.stringify(node));
                var sigmaNode = JSON.parse(JSON.stringify(node));
                if (node.site) {
                    // console.log(node.site);
                    sigmaNode.x = $scope.points[node.site][0];
                    sigmaNode.y = $scope.points[node.site][1];
                    
                }
                if (node.x && node.y) {
                    
                    sigmaNode.x = 10*sigmaNode.x;
                    sigmaNode.y = -10*sigmaNode.y;

                    if (!$scope.points[node.id]) {
                        $scope.points[node.id] = [sigmaNode.x, sigmaNode.y];
                    }
                }
                $scope.sigma.graph.addNode(sigmaNode);
            });
	    topology.edges.map(function(edge){
                // console.log(JSON.stringify(edge));
	        if (layer === 'site') {
	        
	        }
                $scope.sigma.graph.addEdge(edge);
            });
            $scope.sigma.refresh();
        });
    };

    $scope.topologyCustfunc = function(sigmaIstance, getSlowDownNum, dragListener, resize){
        
        $scope.sigma = sigmaIstance;

	$mwtnTopology.getTopology('site', function(topology){
            // console.log(JSON.stringify(topology));
            $scope.sigma.graph.clear();
            $scope.site = topology;
	    topology.nodes.map(function(node){
                var sigmaNode = JSON.parse(JSON.stringify(node));
                sigmaNode.x = 10*sigmaNode.x;
                sigmaNode.y = -10*sigmaNode.y;
                $scope.sigma.graph.addNode(sigmaNode);
            });
	    topology.edges.map(function(edge){
                $scope.sigma.graph.addEdge(edge);
            });
            $scope.sigma.refresh();
        });
    };

  }]);

});
