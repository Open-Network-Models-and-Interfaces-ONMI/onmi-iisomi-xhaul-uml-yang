/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}

if (Number.prototype.toDegrees === undefined) {
  Number.prototype.toDegrees = function() { 
    return this * 180 / Math.PI; 
  };
}

define(['app/mwtnTopology/mwtnTopology.module', 
        'app/mwtnTopology/mwtnTopology.services', 
        'app/mwtnCommons/mwtnCommons.services'], function(mwtnTopologyApp) {

  mwtnTopologyApp.register.controller('mwtnTopologyCtrl', ['$scope', '$rootScope', '$mwtnTopology', '$mwtnLog', 'uiGridConstants', 'uiGmapGoogleMapApi',
                                             function($scope, $rootScope, $mwtnTopology, $mwtnLog, uiGridConstants, uiGmapGoogleMapApi) {

    $rootScope['section_logo'] = 'src/app/mwtnTopology/images/mwtnTopology.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
   
    // number of accordion tabs open at time
    $scope.oneAtATime = true;
    
    // global object to store data from database
    $scope.data = {};
    
    // definitions of tabs and accordions
    $scope.layers = [
        {
          label : 'Site',
          section : [
              {
                id: 'site-map',
                label : 'Map',
                template : 'src/app/mwtnTopology/templates/maps.tpl.html',
                status: true
              },
              {
                id: 'site-grid',
                label : 'Sites',
                template : 'src/app/mwtnTopology/templates/nodes.tpl.html'
              },
              {
                id: 'sitelink-grid',
                label : 'Site links',
                template : 'src/app/mwtnTopology/templates/links.tpl.html'
              } ]
//        },
//        {
//          label : 'Microwave / Miiiimeterwave',
//          section : [
//              {
//                id: 'mwps-map',
//                label : 'Map',
//                template : 'src/app/mwtnTopology/templates/maps.tpl.html'
//              },
//              {
//                id: 'mwps-grid',
//                label : 'Air interfaces',
//                template : 'src/app/mwtnTopology/templates/nodes.tpl.html'
//              },
//              {
//                id:'mwpslinks-grid',
//                label : 'MWR links',
//                template : 'src/app/mwtnTopology/templates/links.tpl.html'
//              } ]
//        },
//        {
//          label : 'Ethernet',
//          section : [
//              {
//                id: 'ethernet-map',
//                label : 'Map',
//                template : 'src/app/mwtnTopology/templates/maps.tpl.html'
//              },
//              {
//                id: 'ethernet-grid',
//                label : 'Ports (ETH-CTPs)',
//                template : 'src/app/mwtnTopology/templates/nodes.tpl.html'
//              },
//              {
//                id:'ethernetlinks-grid',
//                label : 'Ethernet connections',
//                template : 'src/app/mwtnTopology/templates/links.tpl.html'
//              } ]
        } ];

    // global objects for map
    $scope.mapObjects = {
        map: { center: { latitude: 45, longitude: -73 }, 
            zoom: 8,
            options: {},
            exists: false
        },
        sites: {
        	models : [],
            draw: function(){
    	        $scope.mapObjects.sites.models = $scope.data.sites.map(function(site){
    	            return {
    	              id: site.id,
    	              latitude: site.latitude,
    	              longitude: site.longitude,
    	              title: site.name,
    	              icon: $scope.mapObjects.sites.getIcon('#ffffff', 3, 0.5, 10)
    	            };       
    	        });
            },
        	events : {
	          click : function(marker, eventName, model, args) {
	              console.info('htLog:', marker, eventName, model, args);
	              // TODO switch to selected
	          },
              mouseover : function(marker, eventName, model, args) {
                // console.info('htLog:', marker, eventName, model, args);
                model.show = true;
                $scope.mapObjects.sites.tooltipOptions.content = '<b>' + model.title + '</b>';
                $scope.mapObjects.sites.tooltip = model;
              },
              mouseout : function(marker, eventName, model, args) {
                // console.info('htLog:', marker, eventName, model, args);
                model.show = false;
                $scope.mapObjects.sites.tooltip = model;
              }
	        },
        	getIcon : function(color, weight, opacity, scale) {
                var icon = $scope.mapObjects.sites.icon;
                icon.strokeColor = color;
                icon.fillColor = color;
                icon.strokeWeight = weight;
                icon.fillOpacity = opacity;
                icon.scale = scale;
                return icon;
            },
            tooltipOptions : {
    	      boxClass: 'infobox',
    	      boxStyle: {
    	        backgroundColor: 'white',
    	        border: '2px solid #337ab7',
    	        borderRadius: '5px',
    	        padding: '5px 2px 5px 15px',
    	        width: '200px',
    	        height: '100'
    	      },
    	      content: 'hello',
    	      disableAutoPan: true,
    	      maxWidth: 0,

    	      zIndex: null,
    	      // closeBoxMargin: '10px',
    	      // closeBoxURL: 'http://www.google.com/intl/en_us/mapfiles/close.gif',

    	      isHidden: false,
    	      pane: 'floatPane',
    	      enableEventPropagation: false
    	    },
    	    tooltip : {show: false}

        }, 
        siteLinks: {
        	models : [],
            draw: function(){
    	        $scope.mapObjects.siteLinks.models = $scope.data.siteLinks.map(function(link){
		        	var pointA = $scope.data.sites.filter(function(site){
		        		return site.id.toString() === link.sites[0].toString();
		        	});
		        	var pointB = $scope.data.sites.filter(function(site){
		        		return site.id.toString() === link.sites[1].toString();
		        	});
		        	var path = [
    	                        {
    	                          latitude : pointA[0].latitude,
    	                          longitude : pointA[0].longitude
    	                        }, {
    	                          latitude : pointB[0].latitude,
    	                          longitude : pointB[0].longitude
    	                        }
    	                      ];
                    return {
                        id : link.id,
//                        index : siteLink._index,
//                        siteLinkId : siteLink._source.id,
                        path : path,
                        stroke : {
                          color : '#ffffff',
                          weight : 3
                        },
                        editable : false,
                        draggable : false,
                        geodesic : true,
                        visible : true,
                        options : {
                          zIndex : 16,
                          title : link.id + ': ' + pointA[0].name + '-' + pointB[0].name
                        }
                    };
    	        });
            },
        	events : {
	              click : function(marker, eventName, model, args) {
                      console.info('htLog:', marker, eventName, model, args);
                      // TODO switch to selected
                  },
        	      mouseover : function(line, eventName, model, args) {
        	    	  var event = JSON.parse(JSON.stringify(args));
                      model.stroke.weight = 6;
                      model.show = true;
                      model.latitude = event['0'].latLng.lat;
                      model.longitude = event['0'].latLng.lng;
                      $scope.mapObjects.sites.tooltipOptions.content = '<b>' + model.options.title + '</b>';
                      $scope.mapObjects.sites.tooltip = model;
        	      },
        	      mouseout : function(line, eventName, model, args) {
        	          // console.log('htLog:', line, eventName, model, args);
        	          model.stroke.weight = 3;
                      model.show = false;
                      $scope.mapObjects.sites.tooltipOptions.content = '<b>' + model.options.title + '</b>';
                      $scope.mapObjects.sites.tooltip = model;
        	      }
  	        }
        }   
    };

    
 /*
  * $scope.map.bounds = {
    northeast: {
        latitude: myBounds.getNorthEast().lat(),
        longitude: myBounds.getNorthEast().lng()
    },
    southwest: {
        latitude: myBounds.getSouthWest().lat(),
        longitude: myBounds.getSouthWest().lng()
    }
};
*/
    // draw map, when loaded
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.mapObjects.map.options.mapTypeId = maps.MapTypeId.HYBRID;
        $scope.mapObjects.map.exists = true;
        $scope.mapObjects.sites.icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#2677FF',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeOpacity: 1,
            strokeWeight: 6
        };
        $scope.mapObjects.sites.draw();
        $scope.mapObjects.siteLinks.draw();
        
    }, function(error){
    	console.error('Something wrong with maps.', error)
    });
    

    // get sites and update map and grid
    var updateSite = function() {
        console.log('updateSite', $scope.mapObjects.map.exists);
  
	    $mwtnTopology.getNodes('site').then(function(success){
	
	        var hits = success.data.hits.hits;
	        $scope.data.sites = hits.map(function(hit){
	          return hit._source
	        });
	        sortById($scope.data.sites);

	        // show sites and on map
	        if ($scope.mapObjects.map.exists) {
	        	$scope.mapObjects.sites.draw();
	        }

	        // sites
	        $scope.gridOptionsNodes.columnDefs = getColumnDefs($scope.data.sites);
	        $scope.gridOptionsNodes.data = $scope.data.sites;
	        
		    $mwtnTopology.getNodes('site-link').then(function(success){
		    	
		        var hits = success.data.hits.hits;
		        $scope.data.siteLinks = hits.map(function(hit){
		          return hit._source
		        });
		        sortById($scope.data.siteLinks);

		        if ($scope.mapObjects.map.exists) {
		        	$scope.mapObjects.siteLinks.draw();
		        }

		        // sitelinks
		        var mapped = $scope.data.siteLinks.map(function(link){
		        	var pointA = $scope.data.sites.filter(function(site){
		        		return site.id.toString() === link.sites[0].toString();
		        	});
		        	var pointB = $scope.data.sites.filter(function(site){
		        		return site.id.toString() === link.sites[1].toString();
		        	});
		        	return {
		        		id: link.id,
		        		siteA: pointA[0].name,
		        		siteB: pointB[0].name,
		        		length: $mwtnTopology.getDistance(pointA[0].latitude, pointA[0].longitude, pointB[0].latitude, pointB[0].longitude)
		        	};
		        });
		        $scope.gridOptionsLinks.columnDefs = getColumnDefs(mapped);
		        $scope.gridOptionsLinks.data = mapped;
		    });
	    });
    };
    
    
    
    // check if something is needed below
    $scope.topologyData = { nodes: [], edges: []};
    $scope.sigma = null;

    
    $scope.highlightFilteredHeader = $mwtnTopology.highlightFilteredHeader;
    
    var initTables = function() {
      $scope.gridOptionsNodes = JSON.parse(JSON.stringify($mwtnTopology.gridOptions));
      $scope.gridOptionsNodes.columnDefs = [];
      $scope.gridOptionsNodes.data = [];

      $scope.gridOptionsLinks = JSON.parse(JSON.stringify($mwtnTopology.gridOptions));
      $scope.gridOptionsLinks.columnDefs = [];
      $scope.gridOptionsLinks.data = [];
    };
    
    var sortById = function(array) {
      // TODO impl
      return array;
    };
    
    var getColumnDefs = function(array) {
      if (!array || array.length === 0) {
        return [];
      }
      return Object.keys(array[0]).map(function(key){
        var sort;
        if (key === 'id') {
          sort = {
            direction: uiGridConstants.ASC,
            ignoreSort: false,
            priority: 0
           };
        }
        return { 
          field: key, 
          type: 'string', 
          // displayName: key,  
          headerCellClass: $scope.highlightFilteredHeader, 
          width : '140',
          sort: sort
         };
      });
    };
    
    var contains = function(array, objectId) {
      var result = false;
      array.map(function(item){
        if (item.id === objectId){
          result = true;
        }
      });
      return result;
    };
    
    var getRemoteNes = function(nodeId) {
      if (!$scope.mwpsLinks) {
        return;
      }
      var result = $scope.mwpsLinks.map(function(link){
        if (link.source.slice(4,6) - nodeId === 0) {
          return link.target.slice(4,6);
        } else if (link.target.slice(4,6) - nodeId === 0) {
          return link.source.slice(4,6);
        }
      });
      // remove doublicates
      result = result.filter(function(item, pos) {
        return result.indexOf(item) == pos;
      });      
      return result.clean(null);
    };
    

    var geoCalculation = {
      distance: function(lat1, lon1, lat2, lon2) {
          var R = 6371; // km
          var φ1 = lat1.toRadians();
          var φ2 = lat2.toRadians();
          var Δφ = (lat2-lat1).toRadians();
          var Δλ = (lon2-lon1).toRadians();

          var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

          return (R * c);
      },
      azimuth: function(lat1, lon1, lat2, lon2) {
        var φ1 = lat1.toRadians();
        var φ2 = lat2.toRadians();
        var Δλ = (lon2-lon1).toRadians();

        // see http://mathforum.org/library/drmath/view/55417.html
        var y = Math.sin(Δλ) * Math.cos(φ2);
        var x = Math.cos(φ1)*Math.sin(φ2) -
                Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
        var θ = Math.atan2(y, x);

        return ((θ.toDegrees()+360) % 360);      
      }
    };
    
    
    var getNetworkElement = function(nodeId) {
      var ne;
      $scope.neNodes.map(function(node){
        if (node.id - nodeId === 0) {
          ne = node;
        }
      });
      return ne;
    }
    var getSite = function(siteId) {
      var result;
      $scope.sites.map(function(site){
        if (siteId - site.id === 0){
          result = site;
        }
      });
      return result;
    };
    
    var getNodePos = function(node) {
      var x = 0;
      var y = 0;
      
      if (!node) {
        return {x: 1000*x, y: -1000*y};
      } 
      
      // short cut: in the PoC there is always only one remote NE0

      if (!node.remotes || node.remotes.length === 0) {
        var localSite = getSite(node.siteRef);
        return {x:1000*localSite.longitude, y:-1000*localSite.latitude};
      };
      
      var remoteId = node.remotes[0];
      var remoteNode = getNetworkElement(remoteId);
      
      var localSite = getSite(node.siteRef);
      var remoteSite = getSite(remoteNode.siteRef);
      
      var RADIUS = 0.00009;

      var azimuth = geoCalculation.azimuth(localSite.latitude, localSite.longitude, remoteSite.latitude, remoteSite.longitude);
      x = localSite.longitude + Math.sin(azimuth.toRadians())*RADIUS;
      y = localSite.latitude  + Math.cos(azimuth.toRadians())*RADIUS;

      // console.log(node.siteRef, remoteNode.siteRef, azimuth, JSON.stringify({x: x, y: -y}));
      return {x: 1000*x, y: -1000*y};
    };
    

    var updateMwps = function() {
      console.log('updateMwps');
    
      $scope.sigma.graph.clear();
      $scope.sites.map(function(site){
        var node = JSON.parse(JSON.stringify(site));
        node.id = 'site' + node.id;
        node.label = node.name;
        node.x = 1000*node.longitude;
        node.y = -1000*node.latitude; // Math.cos(node.latitude);
        node.size = 16;
        node.color = '#dddddd';
        if (!contains($scope.topologyData.nodes, node.id)) {
          $scope.sigma.graph.addNode(node);
        }
      });
      $scope.neNodes.map(function(ne){
        var node = JSON.parse(JSON.stringify(ne));
        var pos = getNodePos(node); 
        node.id = 'ne' + node.id;
        node.x = pos.x;
        node.y = pos.y;
        node.size = 8;
        node.color = '#888888';        
        if (!contains($scope.topologyData.nodes, node.id)) {
          $scope.sigma.graph.addNode(node);
        }
      })

      // nodes
      $scope.gridOptionsNodes.columnDefs = getColumnDefs($scope.mwpsNodes);
      $scope.gridOptionsNodes.data =  $scope.mwpsNodes;

      // links
      $scope.gridOptionsLinks.columnDefs = getColumnDefs($scope.mwpsLinks);
      $scope.gridOptionsLinks.data =  $scope.mwpsLinks;

    };

    var initMwps = function() {
      console.log('initMwps');
      
      // links
      var mwpsLinksObj = {};
      var siteLinksObj = {};
      $scope.mwpsLinks = [];
      $scope.siteLinks = [];
      
      $scope.mwpsNodes.map(function(mwps){
        if (!mwpsLinksObj[mwps.radioSignalId]) {
          mwpsLinksObj[mwps.radioSignalId] = [];
        }
        mwpsLinksObj[mwps.radioSignalId].push(mwps.id);
        mwpsLinksObj[mwps.radioSignalId].sort();
        
        Object.keys(mwpsLinksObj).map(function(key){
          var link = mwpsLinksObj[key];
          if (link.length === 2) {
            // console.log(JSON.stringify(link));
            // {"id": "mwpsl11", "label": "MWPS-Ceragon-1", "source": "mwps111", "target": "mwps142", "size": 1, "color": "#dddddd", "radioSignalId":11 },
    
            var id = 'rs' + key;
            if (!contains($scope.mwpsLinks, id)) {
              $scope.mwpsLinks.push({
                id: id,
                label: id,
                source: link[0],
                target: link[1],
                radioSignalId: key
              });
            }
          }
        });
        
        if (!siteLinksObj[mwps.radioSignalId]) {
          siteLinksObj[mwps.radioSignalId] = [];
        }
        siteLinksObj[mwps.radioSignalId].push(mwps.siteRef);
        var a = JSON.parse(JSON.stringify(siteLinksObj[mwps.radioSignalId]));
        siteLinksObj[mwps.radioSignalId] = a.filter(function(item, pos) {
          return a.indexOf(item) == pos;
        });      
        siteLinksObj[mwps.radioSignalId].sort();
      });
      Object.keys(siteLinksObj).map(function(key){
        var link = siteLinksObj[key];
        var id = ['sl', link[0], link[1]].join('-');
        if (!contains($scope.siteLinks, id)) {
          var siteA = getSite(link[0]);
          var siteB = getSite(link[1]);
          $scope.siteLinks.push({
            id: id,
            source: link[0],
            target: link[1],
            siteA: siteA.name,
            siteB: siteB.name,
            distance: geoCalculation.distance(siteA.latitude, siteA.longitude, siteB.latitude, siteB.longitude),
            azimuthAB: geoCalculation.azimuth(siteA.latitude, siteA.longitude, siteB.latitude, siteB.longitude),
            azimuthBA: geoCalculation.azimuth(siteB.latitude, siteB.longitude, siteA.latitude, siteA.longitude)
          });
        }
      });
    };
  
  var updateEthernet = function() {
    console.log('updateEthernet');
    
  };
  
  // events
  var SECTIONS = {
    MAP: 0,
    NODES: 1,
    LINKS: 2
  };
  var LAYERS = {
    SITE:0,
    MWPS:1,
    ETHERNET:2
  };

  // check UI events
  $scope.$watch('activeTab', function(newValue, oldValue){
    if (newValue !== oldValue) {
      initTables();
      $scope.layers[newValue].section[SECTIONS.MAP].status = true;
      switch (newValue) {
      case LAYERS.SITE:
        updateSite();
        break;
      case LAYERS.MWPS:
        updateMwps();
        break;
      case LAYERS.ETHERNET:
        updateEthernet();
        break;
      }
    }
  });

  // start app
  $scope.error = undefined;
  
  $scope.topologyCustfunc = function(sigmaIstance, getSlowDownNum, dragListener, resize){
    $scope.sigma = sigmaIstance;
    
    if (!$scope.initDone) {
    initTables();
    $mwtnTopology.getNodes('site').then(function(success){

      var hits = success.data.hits.hits;
      $scope.sites = hits.map(function(hit){
        return hit._source
      });
      sortById($scope.sites);

      $mwtnTopology.getRequiredNetworkElements(true).then(function(success){
        $scope.requiredNetworkElements = success; 
        
        $scope.neNodes = success.map(function(hit){
          var id = hit._source.nodeId.split('-')[1];
          var remotes = getRemoteNes(id);
          // console.log(id, remotes);
          return {
            id: id,
            label: hit._source.nodeId,
            siteRef: parseInt(hit._source.siteRef),
            remotes: remotes
          }
        });
        
        sortById($scope.neNodes);
        
        $scope.mwpsNodes = [];
        success.map(function(hit){
          hit._source.MW_AirInterface_Pac.map(function(mwps){
            $scope.mwpsNodes.push({
              id: ['mwps', hit._source.nodeId.slice(-2), mwps.layerProtocol.slice(-1)].join(''),
              nodeId: hit._source.nodeId,
              localId: mwps.layerProtocol,
              label: [hit._source.nodeId, mwps.layerProtocol].join('-'),
              name: mwps.airInterfaceConfiguration.airInterfaceName,
              radioSignalId: mwps.airInterfaceConfiguration.radioSignalID,
              siteRef: hit._source.siteRef
            });
          });
        });
        sortById($scope.mwpsNodes);
        initMwps();
        updateSite();
        $scope.initDone = true;
        
      }, function(error){
        $scope.getRequiredNetworkElements = [];
        $scope.neNodes = [];
        $scope.mwpsNodes = [];
        $scope.initDone = false;
      });

    }, function(error) {
      $scope.error = 'Cannot get data from server.';
      $scope.sites = [];
      $scope.gridOptionsNodes.data = [];
      $scope.initDone = false;
    });
    }
  };

  }]);

});
