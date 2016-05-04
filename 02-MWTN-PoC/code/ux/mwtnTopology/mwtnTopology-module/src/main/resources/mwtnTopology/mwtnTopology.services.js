/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(
    [ 'app/mwtnTopology/mwtnTopology.module' ],
    function(mwtnTopologyApp) {

      mwtnTopologyApp.register.factory('$mwtnTopology', function($http, ENV) {
        var service = {
          base : ENV.getBaseURL("MD_SAL") + "/restconf/"
        };

        service.getPlannedTopology = function(topologyId, callback) {
          var url = [ 'src/app/mwtnTopology/data/', topologyId,
              'Topology.json' ].join('');
          var request = {
            method : 'GET',
            url : url
          };
          $http(request).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
          });
        };

        return service;
      });
      
      mwtnTopologyApp.register.factory('Topology', function() {
        // Classes
        // Class OnfNetworkElement
        var Topology = function(data) {
          this.data = data;
          this.getData = function() {
           return this.data;
          };
          this.getNodeById = function(nodeId) {
            var nodeResult;
            this.data.nodes.map(function(node){
              if (node.id === nodeId) {
                nodeResult = node;
              }
            });
            return nodeResult;
          };
        };
        return Topology;
      });
      mwtnTopologyApp.register.factory('Node', function() {
        // Classes
        // Class Node
        var Node = function(data) {
          this.data = data;
          this.getNetworkElementId = function(){
            var part = this.data.label.split('-');
            return [part[0], part[1]].join('-');
          };
          this.setColor = function(color) {
            this.data.color = color;
          };
          this.getLabel = function() {
            if (!this.data.id.startsWith('mwps') && !this.data.id.startsWith('mws')) {
              return this.data.label;
            }
            return this.data.label.split(' ').join('+');
          };
          this.getData = function() {
            if (this.data.id.startsWith('mwps') || this.data.id.startsWith('mws')) {
              this.data.guilabel = this.getLabel();
            }
            var clone = JSON.parse(JSON.stringify(this.data));
            clone.x = 10 * this.data.x;
            clone.y = -10 * this.data.y;
            return clone;
          };
        };
        return Node;
      });
      
      mwtnTopologyApp.register.factory('Edge', function() {
        // Classes
        // Class Edge
        var Edge = function(data) {
          this.data = data;
          this.getSourceId = function() {
            return this.data.source;
          };
          this.getTargetId = function() {
            return this.data.target;
          };
          this.setColor = function(color) {
            this.data.color = color;
          };
          this.setSize = function(size) {
            this.data.size = size;
          };
          this.getLabel = function(directionality) {
            var id = this.data[directionality];
            var body = 'AirInterface';
            var vendorId = id.substring(4,5);
            if (id.startsWith('mws')) {
              body = 'Structure';
              vendorId = id.substring(3,4);
            }
            var label = this.data.label.split('-');
            var neId = vendorId + id.slice(-1);
            return [label[1], neId, 'LP', body, label[2]].join('-');
          };
          this.getData = function() {
            if (this.data.source.startsWith('mwps') || this.data.source.startsWith('mws')) {
              this.data.sourceLabel = this.getLabel('source');
              this.data.targetLabel = this.getLabel('target');
            }
           return this.data;
          };
        };
        return Edge;
      });
 });
