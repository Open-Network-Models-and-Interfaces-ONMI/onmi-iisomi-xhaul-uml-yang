/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTopology/mwtnTopology.module','app/mwtnTopology/mwtnTopology.services','app/mwtnTopology/mwtnTopology.utilities'], function(mwtnTopologyApp) {

  mwtnTopologyApp.register.controller('mwtnTopologyCtrl', ['$scope', '$rootScope', 
                                                           '$mwtnTopology', '$mwtnUtilities', 
                                                           'ActualNetworkElement', 'Edge', 'Node', 
                                                           'OnfNetworkElement', 'MicrowavePhysicalSection',
                                                           'Topology', 
                                                           function($scope, $rootScope, 
                                                               $mwtnTopology, $mwtnUtilities, 
                                                               ActualNetworkElement, Edge, Node, 
                                                               OnfNetworkElement, MicrowavePhysicalSection,
                                                               Topology) {

    var active = 'orange';
    var inactive = '#dddddd';
    
    $rootScope.section_logo = 'src/app/mwtnTopology/images/logo_mwtn_topology.png';

    $scope.data = "mwtnTopology";
    $scope.topologyData = { nodes: [], edges: []};
    $scope.sigma = null;
    $scope.tabs = [
       {id: 'site', label: 'Site', links: 'Sitelinks'}, 
       {id: 'antenna', label: 'NetworkElement', links: 'NE links'}, 
       {id: 'mwps', label: '(MWPS) AirInterface', links: 'MWPS Links'}, 
       {id: 'mws', label: ' (MWS) Structure', links: 'MWS Links'}, 
       {id: 'eth', label: 'Ethernet', links: 'ETH Links'}
    ];
    $scope.currentTab = 'site';
    $scope.points = {};
    
    $scope.ActualNetworkElements = {};

    var getOperationTopology = function(){
	   $mwtnUtilities.getActualNetworkElements(function(servers){
        var netconfServers = [];
        servers.topology.map(function(topology){
        	if (topology['topology-id'] === 'topology-netconf') {
                netconfServers = topology.node;
            }
        });
        var neId = 0;
        netconfServers.map(function(server){
          var neData = {
              uuid : neId++,
              name : server['node-id'],
              ip : server['netconf-node-topology:host'],
              port : server['netconf-node-topology:port'],
              connectionStatus : server['netconf-node-topology:connection-status']
            };
          
          if ($scope.ActualNetworkElements[neData.name]) {
            $scope.ActualNetworkElements[neData.name].setConnectionStatus(neData.connectionStatus);
          } else {
            var opNe = new ActualNetworkElement(neData);
            $scope.ActualNetworkElements[opNe.getName()] = opNe;
            getPlannedTopology($scope.currentTab);
          }
          
        });
        // search for missing
        Object.keys($scope.ActualNetworkElements).map(function(neKey){
          var ne = $scope.ActualNetworkElements[neKey];
          if (ne) {
            var found = false;
            var name = ne.getName();
            netconfServers.map(function(server){
              if (name == server['node-id']) {
                found = true; 
              } 
            });
            if (!found) {
              console.log('ActualNE', name, 'deleted');
              $scope.ActualNetworkElements[ne] = undefined;
              getPlannedTopology($scope.currentTab);
            }                      
          }
        });
        
     });
    };

  var getPlannedTopology = function(layer) {
    // console.log('LOS');
    Object.keys($scope.ActualNetworkElements).map(function(neId){
      // console.log('LOS', neId);
      var actualNe = $scope.ActualNetworkElements[neId];
      if (actualNe && actualNe.isConnected()) {
        $mwtnUtilities.getActualNetworkElement(neId, function(data){
          if (data && data.NetworkElement) {
            var onfNe = new OnfNetworkElement(data.NetworkElement[0]);
            actualNe.setOnfNetworkElement(onfNe);
            
            var onfData = onfNe.getData();
            
            if (layer === 'mwps') {
              var mwpsList = onfNe.getLTPMwpsList();
              mwpsList.map(function(mwpsItem){
                if (mwpsItem) {
                  var lpId = mwpsItem._lpList[0].uuid;
                  $mwtnUtilities.getActualMW_AirInterface_Pac(neId, lpId, function(data){
                    var mwps = new MicrowavePhysicalSection(data.MW_AirInterface_Pac[0]);                 
                    actualNe.setLP(mwps);
                    drawTopology(layer);
                    console.log('LP', neId, lpId, JSON.stringify(mwps.getRadioSignalId()));
                  });
                }
              });         
            }
          } else {
            $scope.ActualNetworkElements[neId] = undefined;
          }
        });
      }
    });
    drawTopology(layer);
  };

  var drawTopology = function(layer) {
    $mwtnTopology.getPlannedTopology(layer, function(topology) {
          $scope[layer] = topology;
          var topo = new Topology(topology);
          $scope.sigma.graph.clear();
          topology.nodes.map(function(data) {
            // console.log(JSON.stringify(node));
            var node = new Node(data);
            // NE
            var ne = $scope.ActualNetworkElements[node.getLabel()];
            if (ne && 'connected' === ne.getConnectionStatus()) {
              node.setColor(active);
            } else {
              node.setColor(inactive);
            }

            if (node.getData().id.startsWith('mwps') || node.getData().id.startsWith('mws')) {
              // MWPS
              if (node.getData().radioSignalId) {
                var rsId = node.getData().radioSignalId;
                var neId = node.getNetworkElementId();
                var neItem = $scope.ActualNetworkElements[neId];
                if (neItem && 'connected' === neItem.getConnectionStatus()) {
                  var layerProtocol = neItem.getLP(rsId); 
                  if (layerProtocol) {
                    node.data.linkStatus = layerProtocol.isLinkUp() ? 'up': 'down';
                    node.data.powerStatus = layerProtocol.isPowerOn() ? 'on': 'off';
                    if(layerProtocol.isActive()){
                      console.log('active?',layerProtocol.isActive(), neId,  layerProtocol.data.layerProtocol);
                      node.setColor(active);                      
                    }
                  }
                }
              }
            }
            $scope.sigma.graph.addNode(node.getData());
          });
          topology.edges.map(function(data) {
            var edge = new Edge(data);
            
            var source = edge.getLabel('source').split('-');
            var neIdA = [source[0], source[1]].join('-');
            var neItemA = $scope.ActualNetworkElements[neIdA];
            
            var target = edge.getLabel('target').split('-');
            var neIdB = [target[0], target[1]].join('-');
            var neItemB = $scope.ActualNetworkElements[neIdB];
            
            if (neItemA && neItemB) {
              if ('connected' === neItemA.getConnectionStatus() && 'connected' === neItemB.getConnectionStatus()) {
                var nodeDataA = topo.getNodeById(edge.getSourceId());
                var nodeA = new Node(nodeDataA);
                var layerProtocolA = neItemA.getLP(nodeA.getData().radioSignalId);
                
                var nodeDataB = topo.getNodeById(edge.getTargetId());
                var nodeB = new Node(nodeDataB);
                var layerProtocolB = neItemB.getLP(nodeB.getData().radioSignalId);
                
                if (layerProtocolA && layerProtocolB) {
                  if (layerProtocolA.isActive() && layerProtocolB.isActive()) {
                    edge.setSize(3); 
                    edge.setColor(active);
                  }
                }
              }
            }
            $scope.sigma.graph.addEdge(edge.getData());
          });
          $scope.sigma.refresh();
        });
    };

    $scope.showTab = function(layer) {
        $scope.currentTab = layer;
        console.info(Object.keys($scope.ActualNetworkElements));
        getPlannedTopology(layer);
        getOperationTopology();
    };

    $scope.topologyCustfunc = function(sigmaIstance, getSlowDownNum, dragListener, resize){
        $scope.sigma = sigmaIstance;
        getPlannedTopology('site');
        getOperationTopology();
    };
    
    // odl events
    // actualNetworkElements - NE added/deleted
    var listenToActualNetworkElementsNotifications = function(socketLocation) {
      try {
        var notificatinSocket = new WebSocket(socketLocation);

        notificatinSocket.onmessage = function(event) {
          setTimeout(function() {
            getOperationTopology();
          }, 1000);
        };
        notificatinSocket.onerror = function(error) {
          console.error("Socket error: " + error);
        };
        notificatinSocket.onopen = function(event) {
          console.info("Socket connection opened.");
        };
        notificatinSocket.onclose = function(event) {
          console.info("Socket connection closed.");
        };
      } catch (e) {
        console.error("Error when creating WebSocket" + e);
      }
    };
    var path = '/network-topology:network-topology';
    $mwtnUtilities.registerForOdlEvents(path, function(socketLocation) {
      listenToActualNetworkElementsNotifications(socketLocation);
    });

  }]);

});
