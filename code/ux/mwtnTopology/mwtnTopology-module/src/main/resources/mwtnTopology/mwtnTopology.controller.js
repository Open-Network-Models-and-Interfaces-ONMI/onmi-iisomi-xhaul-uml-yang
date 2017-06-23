/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
  }
}

if (Number.prototype.toDegrees === undefined) {
  Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
  };
}

// If array is empty, undefined is returned.  If not empty, the first element
// that evaluates to false is returned.  If no elements evaluate to false, the
// last element in the array is returned.
Array.prototype.and = function (defaultValue) {
  for (var i = 0, len = this.length - 1; i < len && this[i]; i++);
  return this.length ?  this[i] : defaultValue;
};

// If array is empty, undefined is returned.  If not empty, the first element
// that evaluates to true is returned.  If no elements evaluate to true, the
// last element in the array is returned.
Array.prototype.or = function () {
  for (var i = 0, len = this.length - 1; i < len && !this[i]; i++);
  return this[i];
};


var eventsFabric = function () {
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function (topic, listener) {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: function () {
          delete topics[topic][index];
        }
      };
    },
    publish: function (topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function (item) {
        item(info != undefined ? info : {});
      });
    }
  };
};

var lastOpenedInfoWindow = null; 

define(['app/mwtnCommons/bower_components/lodash/dist/lodash',
  'app/mwtnCommons/bower_components/cytoscape/dist/cytoscape',
  'app/mwtnTopology/mwtnTopology.module',
  'app/mwtnTopology/mwtnTopology.services',
  'app/mwtnCommons/mwtnCommons.services'
], function (_, cytoscape, mwtnTopologyApp) {

  // remove '_' from global scope but use it here as '_'.
  _.noConflict();

  /********************************************* Sites *************************/

  mwtnTopologyApp.directive('mwtnTopologyMap', ["$timeout", "$q", "$mwtnTopology", function ($timeout, $q, $mwtnTopology) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div style="position:realtive;width:100%;height:700px" ng-transclude=""></div>',
      controller: function () { 
        
      },
      transclude: true,
      scope: {
        manualMapBounds: "=?",
        onBoundsChanged: "&?"
      },
      link: function (scope, element, attrs, ctrl) {

        var mapApiReadyDefer = $q.defer();
        var disbaleNotifications = true;
        //var includeCenter = false;
      
        var initialMapOptions = {
          center: new google.maps.LatLng(0, 0),
          mapTypeId: google.maps.MapTypeId.HYBRID,
          panControl: false,
          rotateControl: false,
          streetViewControl: false,
          tilt: 0,
          zoom: 0
        };

        // Wait at least one digest cycle before init the google map.
        $timeout(function () {
          ctrl.map = new google.maps.Map(element[0], initialMapOptions);
                   
          // Wait until google maps is fully intialized to attach nessessary event handler.
          waitUntilGoogleMapsIsReady();
        });

        element.on("$destroy", function () {
          if (scope.waitUntilGoogleMapsIsReadyTimeoutId) {
            $timeout.cancel(scope.waitUntilGoogleMapsIsReadyTimeoutId);
          }
          if (scope.onDragEndListener) {
            google.maps.event.removeListener(scope.onDragEndListener);
            delete (scope.onDragEndListener);
          }
          if (scope.onZoomChangedListener) {
            google.maps.event.removeListener(scope.onZoomChangedListener);
            delete (scope.onZoomChangedListener);
          }

          window.removeEventListener('resize', onBoundsChanged);
          
        });

        scope.$watch("manualMapBounds", function (newBounds, oldBounds) {
          mapApiReadyDefer.promise.then(function () {

            // if this was an uri change from an not user originated action just return;            
            if (newBounds.internal) return;
            
            // values must exist and at least one must be different or initial load (new === old)
            if (newBounds.bottom != null && newBounds.left != null && newBounds.top != null && newBounds.right != null) {
              fitBounds(ctrl.map, new google.maps.LatLngBounds(
                new google.maps.LatLng(newBounds.bottom, newBounds.left),
                new google.maps.LatLng(newBounds.top, newBounds.right)));
            } else if (newBounds.lat != null && newBounds.lng != null && newBounds.zoom != null && (newBounds.lat != oldBounds.lat || newBounds.lng != oldBounds.lng || newBounds.zoom != oldBounds.zoom || newBounds === oldBounds)) {
              disbaleNotifications = true;
              google.maps.event.addListenerOnce(ctrl.map, 'bounds_changed', function (event) {
                disbaleNotifications = false;
                onBoundsChanged(false);
                
              });
              ctrl.map.setCenter({ lat: newBounds.lat, lng: newBounds.lng });
              ctrl.map.setZoom(newBounds.zoom);
              
            } 
            console.log("manualMapBounds", newBounds);
          });
        });

        /**
         * An asynchronous function that is called continuously every 100 milliseconds until the google maps control has finished its first complete draw.
         * Then it sets up all event handlers and reports its bounds.
         */
        function waitUntilGoogleMapsIsReady() {
          var getBoundsApi = ctrl.map.getBounds();
          if (getBoundsApi) {
            delete (scope.waitUntilGoogleMapsIsReadyTimeoutId);
            // Change to dragend https://developers.google.com/maps/documentation/javascript/events?hl=de
            scope.onDragEndListener = ctrl.map.addListener('dragend', function () {
              onBoundsChanged(true);
            });
            scope.onZoomChangedListener = ctrl.map.addListener('zoom_changed', function () {
              onBoundsChanged(true);
            });
            window.addEventListener('resize', function () {
              onBoundsChanged(false);
            });

            disbaleNotifications = false;
            mapApiReadyDefer.resolve();
          } else {
            scope.waitUntilGoogleMapsIsReadyTimeoutId = $timeout(waitUntilGoogleMapsIsReady, 100);
          }
        }

        /**
         * Gets the current bound and zoom level of the map control and reports it to its parent component.
         * Hint: do not call directly use fitBounds helper function since there is a google bug in the fit bounds function.
         */
        function onBoundsChanged(userOriginated) {
          if (!disbaleNotifications && scope.onBoundsChanged && angular.isFunction(scope.onBoundsChanged)) {

            var getBoundsApi = ctrl.map.getBounds();
            var northEastApi = getBoundsApi.getNorthEast();
            var southWestApi = getBoundsApi.getSouthWest();
            var center = ctrl.map.getCenter();

            var data = {
              top: northEastApi.lat(),
              right: northEastApi.lng(),
              bottom: southWestApi.lat(),
              left: southWestApi.lng(),
              lat: center.lat(),
              lng: center.lng(),
              zoom: ctrl.map.getZoom()
            };

            console.log("onBoundsChanged", data);
            
            scope.onBoundsChanged({
              data: data,
              userOriginated: userOriginated === true
            });
          }
        }

        // bug: the original google code will fit bounds will add some extra space, this function will fix it
        function fitBounds(map, bounds) {
          var oldBounds = map.getBounds();

          // ensure there is any change
          if (oldBounds.toUrlValue() == bounds.toUrlValue()) {
            return;
          }

          disbaleNotifications = true;
          google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
            // bugfix: this is a fix for the https://issuetracker.google.com/issues/35820423 
            //         the map does sometime zoom out if it gets its one bounds
            
            // var newSpan = map.getBounds().toSpan();              // the span of the map set by Google fitBounds (always larger by what we ask)
            // var askedSpan = bounds.toSpan();                     // the span of what we asked for
            // var latRatio = (newSpan.lat() / askedSpan.lat()) - 1;  // the % of increase on the latitude
            // var lngRatio = (newSpan.lng() / askedSpan.lng()) - 1;  // the % of increase on the longitude
            // // if the % of increase is too big (> to a threshold) we zoom in
            // if (Math.min(latRatio, lngRatio) > 0.46) {
            //   // 0.46 is the threshold value for zoming in. It has been established empirically by trying different values.
            //   this.setZoom(this.getZoom() + 1);
            // }
            disbaleNotifications = false;
            onBoundsChanged(false);
            
          });
          map.fitBounds(bounds); // does the job asynchronously
        }
      }
    };
  }]);

  mwtnTopologyApp.directive('mwtnTopologyMapSites', ['$compile', '$rootScope', function ($compile, $rootScope) {

   
    return {
      restrict: 'E',
      require: '^mwtnTopologyMap',
      scope: {
        sites: "=",
        selectedSite: "=",
        api: "="
      },
      link: function (scope, element, attrs, mwtnTopologyMapController) {

        // todo: shouild come from a service
        var normalIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          strokeColor: '#00ccff',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00ccff',
          fillOpacity: 0.35,
          zIndex: 2
        };

        var highlightIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          strokeColor: '#eaae3c',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#eaae3c',
          fillOpacity: 0.65,
          zIndex: 2
        };

        var selectedIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          strokeColor: '#00FD30',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FD30',
          fillOpacity: 0.35,
          zIndex: 2
        };


        scope.displayedSites = {};
        scope.knownSites = {};
        
       
        scope.$watch("selectedSite", function (newSiteId, oldSiteId) {
                    
          if (oldSiteId && scope.displayedSites[oldSiteId]) {
            scope.displayedSites[oldSiteId].setOptions({
              icon: normalIcon
            });
          }

          if (newSiteId && scope.displayedSites[newSiteId]) {
            scope.displayedSites[newSiteId].setOptions({
              icon: selectedIcon
            });
          }

        });

        if (!scope.api) return;
        
        /**
         * Updates the google map markers
         * @param addedSiteIds {string[]} The ids of the sites which are added to the scope.displayedSites dictionary.
         * @param removedFromVisibleIds {string[]} The ids of sites which are removed from the visible bounding rectangle.
         * @param movedFromVisibleToKnownIds {string[]} The ids of sites which are moved from the visible bounding rectangle to the extended bounding rectangle.
         * @param removedFromKnownIds {string[]} The ids of sites which are removed from the extended bounding rectangle.
         * @param movedFromKnownToVisibleIds {string[]} The ids of sites which are moved from the extended bounding rectangle to the visible bounding rectangle.
         */
        scope.api.updateSites = function (addedSiteIds, removedFromVisibleIds, movedFromVisibleToKnownIds, removedFromKnownIds, movedFromKnownToVisibleIds) {
          if (!addedSiteIds) addedSiteIds = [];
          if (!removedFromVisibleIds) removedFromVisibleIds = [];
          if (!movedFromVisibleToKnownIds) movedFromVisibleToKnownIds = [];
          if (!removedFromKnownIds) removedFromKnownIds = [];
          if (!movedFromKnownToVisibleIds) movedFromKnownToVisibleIds = [];

          removedFromVisibleIds.forEach(function (siteId) {
            var marker = scope.displayedSites[siteId];
            if (marker) {
              marker.setMap(null);
              delete marker;
              delete scope.displayedSites[siteId];
            }
          });

          removedFromKnownIds.forEach(function (siteId) {
            var marker = scope.knownSites[siteId];
            if (marker) {
              marker.setMap(null);
              delete marker;
              delete scope.knownSites[siteId];
            }
          });

          movedFromVisibleToKnownIds.forEach(function (siteId) {
            var marker = scope.displayedSites[siteId];
            if (marker) {
              marker.setVisible(false);
              scope.knownSites[siteId] = marker;
              delete scope.displayedSites[siteId];
            }
          });

          movedFromKnownToVisibleIds.forEach(function (siteId) {
            var marker = scope.knownSites[siteId];
            if (marker) {
              marker.setVisible(true);
              scope.displayedSites[siteId] = marker;
              delete scope.knownSites[siteId];
            }
          });

          addedSiteIds.forEach(function (newSiteId) {
            var newSite = scope.sites[newSiteId];
            if (newSite && !scope.displayedSites[newSiteId]) {

              // create the marker
              var marker = new google.maps.Marker({
                map: mwtnTopologyMapController.map,
                position: newSite.location,
                title: newSite.name,
                icon: normalIcon
              });

              // add event listeners to the marker
              marker.addListener('click', function () {
                // cloase all already opened windows
                if (lastOpenedInfoWindow) {
                  lastOpenedInfoWindow.close();
                  lastOpenedInfoWindow = null;
                }

                // compile the content
                var infoWindowTemplate = '<mwtn-topology-site-details site-id="siteId" />';
                var infoWindowScope = $rootScope.$new();
                infoWindowScope['siteId'] = newSiteId;
                var infoWindowContent = $compile(infoWindowTemplate)(infoWindowScope)[0];

                // create the info window
                var infowindow = new google.maps.InfoWindow({
                  content: infoWindowContent,
                  disableAutoPan: true
                });

                // open the window and keek a refenrece to close it if new window opens               
                infowindow.open(mwtnTopologyMapController.map, marker);
                lastOpenedInfoWindow = infowindow;

                // remove the reference if the windows is closed                
                infowindow.addListener('closeclick', function () {
                  lastOpenedInfoWindow = null;
                });
              });

              marker.addListener('mouseover', function () {
                marker.setOptions({ icon: highlightIcon });
              });

              marker.addListener('mouseout', function () {
                marker.setOptions({ icon: normalIcon });
              });

              // store marker
              scope.displayedSites[newSiteId] = marker;
            }
          });
        };

      }
    }
  }]);

  mwtnTopologyApp.directive('mwtnTopologyMapSiteLinks', ['$compile', '$rootScope', function ($compile, $rootScope) {
    return {
      restrict: 'E',
      require: '^mwtnTopologyMap',
      scope: {
        selectedSiteLink : "=",
        siteLinks: "=",
        api: "="
      },
      link: function (scope, element, attrs, mwtnTopologyMapController) {

        var normalColor = "#00ccff";
        var selectedColor = "#00FD30";

        scope.$watch("selectedSiteLink", function (newSiteLinkId, oldSiteLinkId) {

          if (oldSiteLinkId && scope.displayedSiteLinks[oldSiteLinkId]) {
            scope.displayedSiteLinks[oldSiteLinkId].setOptions({
               strokeColor: normalColor,
            });
          }

          if (newSiteLinkId && scope.displayedSiteLinks[newSiteLinkId]) {
            scope.displayedSiteLinks[newSiteLinkId].setOptions({
               strokeColor: selectedColor,
            });
          }

        });

        scope.displayedSiteLinks = {};

        /**
         * Updates the google map Polylines
         * @param addedSiteLinkIds {string[]} The ids of sites links which are added to the scope.displayedSiteLinks dictionary and the google map.
         * @param removedSiteLinkIds {string[]} The ids of sites links which are removed from the visible bounding rectangle within the google map.
         */
        scope.api.updateSiteLinks = function (addedSiteLinkIds, removedSiteLinkIds) {
          if (!addedSiteLinkIds) addedSiteLinkIds = [];
          if (!removedSiteLinkIds) removedSiteLinkIds = [];

          removedSiteLinkIds.forEach(function (siteLinkId) {
            var polyline = scope.displayedSiteLinks[siteLinkId];
            if (polyline) {
              polyline.setMap(null);
              delete polyline;
              delete scope.displayedSiteLinks[siteLinkId];
            }
          });

          addedSiteLinkIds.forEach(function (siteLinkId) {
            var siteLink = scope.siteLinks[siteLinkId];
            if (siteLink && !scope.displayedSiteLinks[siteLinkId]) {
              
              // create the poly line
              var polyline = new google.maps.Polyline({
                map: mwtnTopologyMapController.map,
                path: [siteLink.siteA.location, siteLink.siteZ.location],
                strokeColor: '#00ccff',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                zIndex: 1
              });

              // add event listeners to the polyline
              polyline.addListener('click', function (event) {
                // cloase all already opened windows
                if (lastOpenedInfoWindow) {
                  lastOpenedInfoWindow.close();
                  lastOpenedInfoWindow = null;
                }

                // compile the content
                var infoWindowTemplate = '<mwtn-topology-link-details link-id="linkId"></mwtn-topology-link-details>';
                var infoWindowScope = $rootScope.$new();
                infoWindowScope['linkId'] = siteLinkId;
                var infoWindowContent = $compile(infoWindowTemplate)(infoWindowScope)[0];

                // create the info window
                var infowindow = new google.maps.InfoWindow({
                  content: infoWindowContent,
                  disableAutoPan: true
                });

                // open the window and keek a refenrece to close it if new window opens               
                // adjust and show the info window
                infowindow.setPosition(event.latLng);
                infowindow.open(mwtnTopologyMapController.map);
                lastOpenedInfoWindow = infowindow;

                // remove the reference if the windows is closed                
                infowindow.addListener('closeclick', function () {
                  lastOpenedInfoWindow = null;
                });
               
              });

              polyline.addListener('mouseover', function () {
                polyline.setOptions({ strokeWeight: 6 });
              });

              polyline.addListener('mouseout', function () {
                polyline.setOptions({ strokeWeight: 3 });
              });
              
              // store the ployline              
              scope.displayedSiteLinks[siteLinkId] = polyline;
            }
          });
        };

      }
    };
  }]);

  mwtnTopologyApp.controller('mwtnTopologySiteDetailsController', ['$scope', '$timeout', '$mwtnTopology', function ($scope, $timeout, $mwtnTopology) {
    var vm = this;
    vm.site = null;   
    
    $scope.$watch(function () { return vm.siteId }, function (newSiteId, oldSiteId) {
      if (!newSiteId) return;

      vm.status = {
        message: 'Searching...',
        type: 'warning',
        isWorking: true
      };

      $mwtnTopology.getSiteDetailsBySiteId(newSiteId).then(function (siteDetails) {
        vm.site = siteDetails;
          
        vm.status = {
          message: undefined,
          type: 'success',
          isWorking: false
        };
      }, function (err) {
        vm.status = {
          message: err,
          type: 'error',
          isWorking: false
        };
      });
    });   
    
  }]);
  
  mwtnTopologyApp.directive('mwtnTopologySiteDetails',  function () {
    return {
      scope : { siteId : "=" },
      restrict: 'E',
      controller: 'mwtnTopologySiteDetailsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'src/app/mwtnTopology/templates/siteDetails.tpl.html'
    };
  });

  mwtnTopologyApp.controller('mwtnTopologyLinkDetailsController', ['$scope', '$timeout', '$mwtnTopology', function ($scope, $timeout, $mwtnTopology) {
    var vm = this;
    vm.site = null;

    $scope.$watch(function () { return vm.linkId }, function (newLinkId, oldLinkId) {
      if (!newLinkId) return;

      vm.status = {
        message: 'Searching...',
        type: 'warning',
        isWorking: true
      };
      
      // getLinkDetailsByLinkId
      $mwtnTopology.getLinkDetailsByLinkId(newLinkId).then(function (linkDetails) {
        vm.link = linkDetails;

        vm.status = {
          message: undefined,
          type: 'success',
          isWorking: false
        };
      }, function (err) {
        vm.status = {
          message: err,
          type: 'error',
          isWorking: false
        };
      });
    });

  }]);

  mwtnTopologyApp.directive('mwtnTopologyLinkDetails', function () {
    return {
      scope: { linkId: "=" },
      restrict: 'E',
      controller: 'mwtnTopologyLinkDetailsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'src/app/mwtnTopology/templates/linkDetails.tpl.html'
    };
  });

  mwtnTopologyApp.controller('mwtnTopologyFrameController', ['$scope', '$timeout', '$state', '$mwtnTopology', function ($scope, $timeout, $state, $mwtnTopology) {
    var vm = this;

    $scope.$watch(function () { return $state.params.view; }, function (newVal, oldVal, scope) {
      if (newVal) {
        vm.activeTab = newVal
      }
    });  

    // hide all tabs until the google api is fully loaded.
    // initialize with true is the promise is resolved === 1
    vm.googleIsReady = $mwtnTopology.googleMapsApiPromise.$$state.status === 1;

    if (!vm.googleIsReady) $mwtnTopology.googleMapsApiPromise.then(function () {
      $timeout(function () {
        vm.googleIsReady = true;
      });
    });
    
  }]);

  mwtnTopologyApp.directive('mwtnTopologyFrame', function () {
    return {
      restrict: 'E',
      controller: 'mwtnTopologyFrameController',
      controllerAs: 'vm',
      templateUrl: 'src/app/mwtnTopology/templates/frame.tpl.html'
    };
  });

  mwtnTopologyApp.controller('mwtnTopologySiteViewController', ['$scope', '$q', '$timeout', '$state', '$mwtnTopology', function ($scope, $q, $timeout, $state, $mwtnTopology) {
    var vm = this;
    // Determines if a database request loop should be canceld.
    var cancelRequested = false;
    // Represents a defer which is resolved, if a cancel was requested and fulfilled.
    var cancelDefer = $q.defer();
    // Represents the new bounding rectangle who was set with the last user action to change the map bounds.
    // The value is saved until the cancel operation is fulfilled.
    /** @type {{top: number, right: number, bottom: number, left: number, zoom: number}} */
    var waitForCancelMapBoundAndZoom;
    // While getting all sites collect all site link ids which are available through visible and known sites.
    // This dictionary will be cleared each time a new map bound is changed and a new database request loop is started.
    var collectedSiteLinkIds = {};

    vm.status = {
      // Determines the bounds of the map which is manually set by the code. These are the initial values.
      manualMapBounds: {
        top: !Number.isNaN(+$state.params.top) ? +$state.params.top : undefined,
        bottom: !Number.isNaN(+$state.params.bottom) ? +$state.params.bottom : undefined,
        left: !Number.isNaN(+$state.params.left) ? +$state.params.left : undefined,
        right: !Number.isNaN(+$state.params.right) ? +$state.params.right : undefined,
        zoom: !Number.isNaN(+$state.params.zoom) ? +$state.params.zoom : undefined,
        lat: !Number.isNaN(+$state.params.lat) ? +$state.params.lat : undefined,
        lng: !Number.isNaN(+$state.params.lng) ? +$state.params.lng : undefined
      },
      
      // Determines if the accordeon group element for SiteMap, SiteGrid or SiteLinkGrid is open.
      siteMapIsOpen: true,
      siteGridIsOpen: true,
      siteLinkGridIsOpen: true,
      sitePathGridIsOpen: false,

      // Determines if a processing is running.
      processing: false,
      totalSitesInBoundingBox: 0,
      loadedSitesInBoundingBox: 0,
      maximumCountOfVisibleSites: 300,

      // selectet Elements
      site: null,
      siteLink: null,
      sitePath: null
    };

    // Contains the known and visible sites as well as known site links as dictionaries.
    vm.knownSites = {};
    vm.visibleSites = {};
    vm.knownSiteLinks = {};

    // Api-Object that will be filled with update methods from the mwtnTopologyMapSites Component.
    vm.mapSitesComponentApi = {};
    // Api-Object that will be filled with update methods from the mwtnTopologyMapSiteLinks Component.
    vm.mapSiteLinksComponentApi = {};

    //addedSiteLinkIds, removedSiteLinkIds

    initializeMapBounds();

    function initializeMapBounds() {

      vm.status.manualMapBounds = {
        top: !Number.isNaN(+$state.params.top) ? +$state.params.top : undefined,
        bottom: !Number.isNaN(+$state.params.bottom) ? +$state.params.bottom : undefined,
        left: !Number.isNaN(+$state.params.left) ? +$state.params.left : undefined,
        right: !Number.isNaN(+$state.params.right) ? +$state.params.right : undefined,
        zoom: !Number.isNaN(+$state.params.zoom) ? +$state.params.zoom : undefined,
        lat: !Number.isNaN(+$state.params.lat) ? +$state.params.lat : undefined,
        lng: !Number.isNaN(+$state.params.lng) ? +$state.params.lng : undefined
      };

      // Calculate the initial map control bound, if we have no initial bounds 
      if ((vm.status.manualMapBounds.top == null && vm.status.manualMapBounds.bottom == null && vm.status.manualMapBounds.right == null && vm.status.manualMapBounds.left == null && vm.status.manualMapBounds.lat == null && vm.status.manualMapBounds.lng == null && $state.params.site == null && $state.params.siteLink == null && $state.params.sitePath == null)) {
        $mwtnTopology.getOuterBoundingRectangleForSites().then(function (bounds) {
          // Ensures that the new value is set within a digest cycle. 
          vm.status.manualMapBounds = bounds;
        });
      }
    }  

    $scope.$watch(function () { return $state.params.site; }, function (newVal, oldVal, scope) {
      if (newVal) {
        $mwtnTopology.getSiteDetailsBySiteId(newVal).then(function (siteDetails) {
          if (siteDetails) {
            // just update the location of the browser if the location has changed      
            $state.go('main.mwtnTopology', {
              lat: siteDetails.location.lat,
              lng: siteDetails.location.lng,
              zoom: 19,
              top: null,
              bottom: null,
              right: null,
              left: null,
              site: $state.params.site,
              siteLink: null,
              sitePath: null,
              internal: false
            }, {
                notify: false
            });
          };
        }, function (err) {
          
        }); 
      }
    });
    
    $scope.$watch(function () { return $state.params.siteLink; }, function (newVal, oldVal, scope) {
      if (newVal) {
        $mwtnTopology.getLinkDetailsByLinkId(newVal).then(function (link) {
          if (link) {

            var top = link.siteA.location.lat >= link.siteZ.location.lat ? link.siteA.location.lat : link.siteZ.location.lat;
            var bottom = link.siteA.location.lat >= link.siteZ.location.lat ? link.siteZ.location.lat : link.siteA.location.lat;

            // todo: this code is not able to handle links which overlap the -100|180 ° borderline
            var left = link.siteA.location.lng <= link.siteZ.location.lng ? link.siteA.location.lng : link.siteZ.location.lng;
            var right = link.siteA.location.lng <= link.siteZ.location.lng ? link.siteZ.location.lng : link.siteA.location.lng;
            // just update the location of the browser if the location has changed      
            $state.go('main.mwtnTopology', {
              lat: null,
              lng: null,
              zoom: $state.params.zoom,
              top: top,
              bottom: bottom,
              right: right,
              left: left,
              site: null,
              siteLink: $state.params.siteLink,
              sitePath: null,
              internal: false
            }, {
                notify: false
              });
          };
        }, function (err) {

        }); 
      }
    });

    $scope.$watchCollection(function () { return [+$state.params.top, +$state.params.bottom, +$state.params.left, +$state.params.right, +$state.params.lat, +$state.params.lng, +$state.params.zoom]; }, function (newVal, oldVal, scope) {
      if (oldVal == null || oldVal === newVal) return; // ignore initial value
     
      if (!vm.status.siteMapIsOpen) {
        vm.status.siteMapIsOpen = true;
        return;
      }

      vm.status.manualMapBounds = {
        top: !Number.isNaN(newVal[0]) ? newVal[0] : undefined,
        bottom: !Number.isNaN(newVal[1]) ? newVal[1] : undefined,
        left: !Number.isNaN(newVal[2]) ? newVal[2] : undefined,
        right: !Number.isNaN(newVal[3]) ? newVal[3] : undefined,
        zoom: !Number.isNaN(newVal[6]) ? newVal[6] : undefined,
        internal: !!$state.params.internal
      };

      if (!Number.isNaN(newVal[4]) && !Number.isNaN(newVal[5])) {
        vm.status.manualMapBounds.lat = newVal[4];
        vm.status.manualMapBounds.lng = newVal[5];
      } else {
        vm.status.manualMapBounds.lat = undefined;
        vm.status.manualMapBounds.lng = undefined;
      }
      
      if (!!$state.params.internal) $state.params.internal = false;
     
    });   
   
    $scope.$watchCollection(function () { return vm.status.siteMapIsOpen }, function (newVal, oldVal, scope) {
      if (oldVal == newVal) return; // ignore initial value
      if (newVal) {
        // Map (re)-opend
        initializeMapBounds();
      } else {
        // Map closed
        vm.status.loadedSitesInBoundingBox = 0;
        vm.status.totalSitesInBoundingBox = 0;
        vm.status.manualMapBounds = {};
        vm.knownSites = {};
        vm.visibleSites = {};
        vm.knownSiteLinks = {};
      };
      // tell all sub components the visuability of the map view
      $scope.$broadcast('mapViewVisuability', newVal); 
    });

    /* callback and helper methods */
    /**
     * A callback function which is called by the map control of the user changed the bounds of the map.
     * @param mapBoundsAndZoom {{top: number, right: number, bottom: number, left: number, zoom: number}} The new bounds and the new zoom level of the map control.
     */
    vm.mapBoundsChanged = function (mapBoundsAndZoom, userOriginated) {

      // just update the location of the browser if the location has changed      
      $state.go('main.mwtnTopology', {
        lat: mapBoundsAndZoom.lat,
        lng: mapBoundsAndZoom.lng,
        zoom: mapBoundsAndZoom.zoom,
        top: null,
        bottom: null,
        right: null,
        left: null,
        site: !userOriginated ? $state.params.site : null,
        siteLink: !userOriginated ? $state.params.siteLink : null,
        sitePath: !userOriginated ? $state.params.sitePath : null,
        internal: true
      }, {
        notify: false
      });
      console.log("handleBoundsChanged", mapBoundsAndZoom);

      if (vm.status.siteMapIsOpen) refreshAllSites(mapBoundsAndZoom);
    };

    /**
     * Refreshes all visible elements in the given view port
     * @param mapBoundsAndZoom {{top: number, right: number, bottom: number, left: number, zoom: number}} The new bounds and the new zoom level of the map control.
     */    
    function refreshAllSites(mapBoundsAndZoom) {
     
      // Datenbankabfragen werden werden in kleine Chunks zerlegt.
      // Jeder Chunk enthält maximal ${chunkSize} (100) Sites und die Anzahl aller Sites für die spezifische Abfrage in der Antwort.
      // Sind noch nicht alle Chunks von der Datenbank angefordert worden, wird zuerst der nächste Chunk angefordert.
      // Der aktuell zurückgegebene Chunk wird aber erst verarbeitet, bevor in einer weiteren Callback-Situation der nächste Datenbank-Chunk abgeholt wird.
      // Dadurch werden kontinuierlich alle Sites auch auf der Map ergänzt, sobald sie verarbeitet wurden und es kommt zu keiner Verzögerung im Benutzerinterface.
      // Im Maximum werden aber ${vm.status.maximumCountOfVisibleSites} (2500) Sites abgerufen, um die Google Map nicht zu überlasten.

      // Fallunterscheidung: gibt es bereits eine aktive Datenbankabfrage zu den Sites?
      // => Nein: Starte eine neue Datenbankabfrage
      // => Ja: Breche die aktuelle Verarbeitung ab, aktualisiere den Status und starte dann eine neue Datenbankabfrage.
      if (vm.status.processing) {
        waitForCancelMapBoundAndZoom = mapBoundsAndZoom;

        if (cancelRequested) {
          console.log("Cancel is already requested.");
          return;
        }

        // Request a database loop cancel.
        cancelRequested = true;
        console.log("New Cancel requested.")

        // Wait until the current database loos was canceled.
        cancelDefer.promise.then(function () {
          // The database loop is canceled. Create a new defer for the next possible cancel request.
          console.log("Cancel fulfilled.");
          cancelDefer = $q.defer();
          // Restart the database loop with the new bounding rectangle.
          beginProcessing(waitForCancelMapBoundAndZoom);
        });

        // Do not start a database loop here - so leave the method.
        return;
      }

      // Start a new database loop here.
      beginProcessing(mapBoundsAndZoom);

      /**
       * The private function which begins a new database processing loop.
       * @param mapBoundsAndZoom {{top: number, right: number, bottom: number, left: number, zoom: number}} The new bounds and the new zoom level of the map control.
       */
      function beginProcessing(mapBoundsAndZoom) {
        // Set the processing flag to true.
        vm.status.processing = true;

        var chunkSize = 100;
        var chunkSiteStartIndex = 0;

        // If a site link cannot convert its siteA or siteZ (id) Parameter to a real site object these ids will collected.
        // After a subsequent database call to get these sites the queued site links will be converted.
        var additionalSiteIds = [];
        var queuedSiteLinksToConvert = [];

        // Entferne Sites, welche aufgrund des neuen Bounds leicht außer Sicht sind von den sichtbaren Sites.
        // Hinzufügen von Sites aus den leicht außer Sicht Bereich zum sichtbaren Bereich.
        var movedOrRemovedSites = refreshOutOfSightSites(mapBoundsAndZoom);
        var removedFromVisibleIds = movedOrRemovedSites.removedFromVisibleIds;
        var movedFromVisibleToKnownIds = movedOrRemovedSites.movedFromVisibleToKnownIds;
        var removedFromKnownIds = movedOrRemovedSites.removedFromKnownIds;
        var movedFromKnownToVisibleIds = movedOrRemovedSites.movedFromKnownToVisibleIds;
        var removedSiteLinkIds = movedOrRemovedSites.removedSiteLinkIds;

        // While getting all sites collect all site link ids which are available through visible and known sites.
        collectedSiteLinkIds = {};

        doSiteRequestLoop();

        /* internal function within beginProcessing */
        /**
         * Starts a new database request loop to get all sites.
         */
        function doSiteRequestLoop() {
          requestNextSiteChunk(mapBoundsAndZoom, chunkSize, chunkSiteStartIndex).then(
            /**
             * @param result {{addedSiteIds: string[], total: number}} An array with the ids of the sites which are added to the vm.visibleSites dictionary.
             */
            function (result) {
              // update the frontend before continue with the next database request.
              vm.mapSitesComponentApi.updateSites && vm.mapSitesComponentApi.updateSites(result.addedSiteIds, removedFromVisibleIds, movedFromVisibleToKnownIds, removedFromKnownIds, movedFromKnownToVisibleIds);
              removedSiteLinkIds && removedSiteLinkIds.length && vm.mapSiteLinksComponentApi.updateSiteLinks && vm.mapSiteLinksComponentApi.updateSiteLinks([], removedSiteLinkIds);
              // to not re-remove and re-move already removed and moved sites clear the arrays for any subsequent database requests.
              removedFromVisibleIds = [];
              movedFromVisibleToKnownIds = [];
              removedFromKnownIds = [];
              movedFromKnownToVisibleIds = [];
              removedSiteLinkIds = [];

              if (cancelRequested) {
                // reset the cancelRequested flag and resolve the cancel request.
                cancelRequested = false;
                cancelDefer.resolve();
                return;
              }

              // Enforce angular to process a new digest cycle.
              $timeout(function () {
                vm.status.totalSitesInBoundingBox = result.total;
                vm.status.loadedSitesInBoundingBox = Math.min(chunkSiteStartIndex + chunkSize, result.total);
                if (chunkSiteStartIndex + chunkSize >= result.total || chunkSiteStartIndex + chunkSize >= vm.status.maximumCountOfVisibleSites) {
                  // This was the last database request to get sites.
                  // Remove all known site link ids from the collectedSiteLinkIds dictionary.
                  var knownSiteLinkIds = Object.keys(vm.knownSiteLinks);
                  knownSiteLinkIds.forEach(function (knownSiteLinkId) {
                    if (collectedSiteLinkIds[knownSiteLinkId]) {
                      delete collectedSiteLinkIds[knownSiteLinkId];
                    }
                  });

                  // Start the request loop for site links now.
                  doSiteLinkRequestLoop(Object.keys(collectedSiteLinkIds));
                } else {
                  // There are more data, request the database again.
                  chunkSiteStartIndex += chunkSize;

                  doSiteRequestLoop();
                }
              });

            }, processError);
        }

        function endProcessing() {
          vm.status.processing = false;

          $timeout(function () {
            vm.status.site = $state.params.site;
            vm.status.siteLink = $state.params.siteLink;
          });
        }

        /**
         * Starts a new database request loop to get all site links.
         */
        function doSiteLinkRequestLoop(siteLinkIds) {
          var requestedSiteLinkIds = siteLinkIds.splice(0, chunkSize);

          $mwtnTopology.getSiteLinksByIds(requestedSiteLinkIds).then(
            /**
             * Processes the database result.
             * The returned site links doesn't contain site objects but site ids.
             * In a subsequent step these ids will be converted into real site objects.
             * @param result {{id: string, siteA: string, siteZ: string}[]} The database result.
             */
            function (result) {
              // Subsequent convert.
              // All site links which siteA and siteZ site ids are known could be added to vm.knownSiteLinks.
              // The rest has to saved until all requests are finished.
              // Another database call will get the additional sites to convert these site links.
              var addedSiteLinkIds = result.reduce(function (accumulator, currentSiteLink) {
                var siteA = vm.visibleSites[currentSiteLink.siteA] || vm.knownSites[currentSiteLink.siteA];
                var siteZ = vm.visibleSites[currentSiteLink.siteZ] || vm.knownSites[currentSiteLink.siteZ];
                if (siteA && siteZ) {
                  vm.knownSiteLinks[currentSiteLink.id] = {
                    id: currentSiteLink.id,
                    siteA: siteA,
                    siteZ: siteZ
                  };
                  accumulator.push(currentSiteLink.id);
                } else {
                  // Theoretically, only siteA or siteZ can be unknown. I still check both separately.
                  var isPushed = false;
                  if (!siteA) {
                    additionalSiteIds.push(currentSiteLink.siteA);
                    queuedSiteLinksToConvert.push(currentSiteLink);
                    isPushed = true;
                  }
                  if (!siteZ) {
                    additionalSiteIds.push(currentSiteLink.siteZ);
                    isPushed || queuedSiteLinksToConvert.push(currentSiteLink);
                  }
                }
                return accumulator;
              }, []);

              // update the frontend before continue with the next database request.
              vm.mapSiteLinksComponentApi.updateSiteLinks && vm.mapSiteLinksComponentApi.updateSiteLinks(addedSiteLinkIds);

              if (cancelRequested) {
                // reset the cancelRequested flag and resolve the cancel request.
                cancelRequested = false;
                cancelDefer.resolve();
                return;
              }

              // Enforce angular to process a new digest cycle. (And to let angular time to redraw the map.)
              $timeout(function () {
                if (siteLinkIds.length === 0) {
                  if (additionalSiteIds.length === 0) {
                    endProcessing();
                    return;
                  }

                  // Only get a maximum of chunkSize additional sites.
                  // Site links more than that will not be drawed in the map due to performance reasons.
                  // If the user zooms in the additional site links will be requested again.
                  $mwtnTopology.getSitesByIds(additionalSiteIds.splice(0, chunkSize)).then(
                    /**
                     * Processes the database result to gain new sites within the bounding box of the database request.
                     * @param result {{total: number, sites: {id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]}}[]}} The database result.
                     */
                    function (result) {
                      var addedSiteLinkIds = queuedSiteLinksToConvert.reduce(function (accumulator, currentSiteLink) {
                        var siteA = vm.visibleSites[currentSiteLink.siteA] || vm.knownSites[currentSiteLink.siteA] || result.sites.find(
                          function (site) {
                            return site.id === currentSiteLink.siteA
                          });
                        var siteZ = vm.visibleSites[currentSiteLink.siteZ] || vm.knownSites[currentSiteLink.siteZ] || result.sites.find(
                          function (site) {
                            return site.id === currentSiteLink.siteZ
                          });
                        if (siteA && siteZ) {
                          vm.knownSiteLinks[currentSiteLink.id] = {
                            id: currentSiteLink.id,
                            siteA: siteA,
                            siteZ: siteZ
                          };
                          accumulator.push(currentSiteLink.id);
                        }
                        return accumulator;
                      }, []);
                      // update the frontend the last time until the user changed the map position.
                      vm.mapSiteLinksComponentApi.updateSiteLinks && vm.mapSiteLinksComponentApi.updateSiteLinks(addedSiteLinkIds);

                      // all done - puh.
                      endProcessing();
                    }, processError);

                } else {
                  // There are more data, request the database again.
                  doSiteLinkRequestLoop(siteLinkIds);
                }
              });

            }, processError);
        }

      }
    };

    /**
     * Recalculates the targets site container for Sites within knownSites and visibleSites.
     * @param mapBoundsAndZoom {{top: number, right: number, bottom: number, left: number, zoom: number}} The new bounds and the new zoom level of the map control.
     */
    function refreshOutOfSightSites(mapBoundsAndZoom) {
      var additionalWidth = (mapBoundsAndZoom.right - mapBoundsAndZoom.left) / 4;
      var additionalHeight = (mapBoundsAndZoom.top - mapBoundsAndZoom.bottom) / 4;
      var slightlyTop = mapBoundsAndZoom.top + additionalHeight;
      var slightlyRight = mapBoundsAndZoom.right + additionalWidth;
      var slightlyBottom = mapBoundsAndZoom.bottom - additionalHeight;
      var slightlyLeft = mapBoundsAndZoom.left - additionalWidth;

      var removedFromVisibleIds = [];
      var movedFromVisibleToKnownIds = [];
      var removedFromKnownIds = [];
      var movedFromKnownToVisibleIds = [];
      var removedSiteLinkIds = [];

      var visibleSiteKeys = Object.keys(vm.visibleSites);
      var knownSiteKeys = Object.keys(vm.knownSites);
      var knownSiteLinkKeys = Object.keys(vm.knownSiteLinks);

      visibleSiteKeys.forEach(function (siteId) {
        /** @var {{id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]}} site */
        var site = vm.visibleSites[siteId];

        if (site.location.lat > slightlyTop || site.location.lng > slightlyRight || site.location.lat < slightlyBottom || site.location.lng < slightlyLeft) {
          // This site is completly out of sight - so remove it and add the id to the removedFromVisibleIds list.
          delete vm.visibleSites[siteId];
          removedFromVisibleIds.push(siteId);
          return;
        }

        if (site.location.lat > mapBoundsAndZoom.top || site.location.lng > mapBoundsAndZoom.right || site.location.lat < mapBoundsAndZoom.bottom || site.location.lng < mapBoundsAndZoom.left) {
          // This site is moved from the visible map bounds to the extended map bounds and will only hide but stay in the google object.
          vm.knownSites[siteId] = site;
          delete vm.visibleSites[siteId];
          movedFromVisibleToKnownIds.push(siteId);
          return;
        }
      });

      knownSiteKeys.forEach(function (siteId) {
        /** @type {{id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]}} site */
        var site = vm.knownSites[siteId];

        if (site.location.lat > slightlyTop || site.location.lng > slightlyRight || site.location.lat < slightlyBottom || site.location.lng < slightlyLeft) {
          // This site is completly out of sight - so remove it and add the id to the removedFromKnownIds list.
          delete vm.knownSites[siteId];
          removedFromKnownIds.push(siteId);
          return;
        }

        if (site.location.lat <= mapBoundsAndZoom.top && site.location.lng <= mapBoundsAndZoom.right && site.location.lat >= mapBoundsAndZoom.bottom && site.location.lng >= mapBoundsAndZoom.left) {
          // This site is moved from the extended map bounds to the visible map bounds. Therefore the hidden google maps object should set visible again.
          vm.visibleSites[siteId] = site;
          delete vm.knownSites[siteId];
          movedFromKnownToVisibleIds.push(siteId);
          return;
        }
      });

      knownSiteLinkKeys.forEach(function (siteLinkId) {
        /** @type {{id: string, siteA: {id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]}}, siteZ: {id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]}}}} siteLink */
        var siteLink = vm.knownSiteLinks[siteLinkId];
        var siteA = siteLink.siteA;
        var siteZ = siteLink.siteZ;

        if ((siteA.location.lat > slightlyTop || siteA.location.lng > slightlyRight || siteA.location.lat < slightlyBottom || siteA.location.lng < slightlyLeft) &&
          (siteZ.location.lat > slightlyTop || siteZ.location.lng > slightlyRight || siteZ.location.lat < slightlyBottom || siteZ.location.lng < slightlyLeft)) {
          // This site link is completly out of sight - so remove it and add the id to the removedSiteLinkIds list.
          delete vm.knownSiteLinks[siteLinkId];
          removedSiteLinkIds.push(siteLinkId);
        }
      });

      return {
        removedFromVisibleIds: removedFromVisibleIds,
        movedFromVisibleToKnownIds: movedFromVisibleToKnownIds,
        removedFromKnownIds: removedFromKnownIds,
        movedFromKnownToVisibleIds: movedFromKnownToVisibleIds,
        removedSiteLinkIds: removedSiteLinkIds
      };
    }

    /**
     * Requests a chunk of sites from the database.
     * @param mapBoundsAndZoom {{top: number, right: number, bottom: number, left: number, zoom: number}} The bounds and the zoom level of the map control to request the next chunk for.
     * @param chunkSize {number} The chunk size of a single database request. To big values will block the user interface, to small values will lead in to many database requests.
     * @param chunkSiteStartIndex {number} The index of the first site returned by the database.
     */
    function requestNextSiteChunk(mapBoundsAndZoom, chunkSize, chunkSiteStartIndex) {
      var requestNextSiteChunkDefer = $q.defer();
      var addedSiteIds = [];

      // Request the next chunk.
      $mwtnTopology.getSitesInBoundingBox(mapBoundsAndZoom, chunkSize, chunkSiteStartIndex).then(
        /**
         * Processes the database result to gain new sites within the bounding box of the database request.
         * @param result {{chunkSize: number, chunkSiteStartIndex: number, total: number, sites: {id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]}}[]}} The database result.
         */
        function (result) {
          result.sites.forEach(function (site) {
            // The map bounds may have changed since the start of the database request.
            // Therefore check if the site is within the bounding rectangle.

            if (!$mwtnTopology.isInBounds(mapBoundsAndZoom, site.location)) {
              return;
            }
           
            // add all site link ids to the selectedSiteLinkIds dictionary.
            site.references.siteLinks.forEach(function (siteLinkId) {
              collectedSiteLinkIds[siteLinkId] = true;
            });

            // check, if the site is within the knownSites dictionary.
            if (vm.knownSites[site.id]) {
              delete vm.knownSites[site.id];
            }

            // check if the site is within the visibleSites dictionary.
            if (vm.visibleSites[site.id]) {
              // Override the site (refresh)
              vm.visibleSites[site.id] = site;
            } else {
              // Add the site to the dictionary and remember the siteId.
              vm.visibleSites[site.id] = site;
              addedSiteIds.push(site.id);
            }
          });

          requestNextSiteChunkDefer.resolve({
            addedSiteIds: addedSiteIds,
            total: result.total
          });
        }, requestNextSiteChunkDefer.reject);

      return requestNextSiteChunkDefer.promise;
    }

    /**
     * Handles error messages by writing the information to the javascript console.
     * Resets the processing flag.
     * @param error Information about the error.
     */
    function processError(error) {
      // Reset the processing flag.
      vm.status.processing = false;
      // Write the error information to the console.
      console.error(error);
    }

  }]);

  mwtnTopologyApp.directive('mwtnTopologySiteView', function () {
    return {
      restrict: 'E',
      controller: 'mwtnTopologySiteViewController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'src/app/mwtnTopology/templates/siteView.tpl.html',
      scope: {
        initialMapBounds: "="
      }
    };
  });

  mwtnTopologyApp.controller('mwtnTopologySiteGridController', ['$scope', '$timeout', '$state', '$mwtnCommons', '$mwtnTopology', 'uiGridConstants', function ($scope, $timeout, $state, $mwtnCommons, $mwtnTopology, uiGridConstants) {
    var vm = this;

    // The page number to show in the grid.
    var paginationPage = 1;
    // The page size.
    var paginationPageSize = 10;
    // The grid column object with current sorting informations.
    var sortColumn = null;
    // The grid column object with current sorting informations.
    var gridFilters = [];
    // caches all sites at the current grid page
    var sitesAtCurrentPageCache = {};

    vm.showAllSites = false;

    vm.onNavigateToSite = function (row) {
      var site = sitesAtCurrentPageCache[row.entity.id];
      $state.go("main.mwtnTopology", { lat: site.location.lat, lng: site.location.lng, zoom: 19, site: site.id, internal: false }, { notify: false });
    };
    
    // see http://ui-grid.info/docs/#/tutorial/317_custom_templates
    var buttonCellTemplate = '<div class="ui-grid-cell-contents tooltip-uigrid" title="TOOLTIP"><i ng-click="grid.appScope.vm.onNavigateToSite(row)" ng-class="{\'fa\':true, \'fa-map-marker\': true, \'{{COL_FIELD}}\':true}" aria-hidden="true"></i></div>';

    vm.gridOptions = Object.assign({}, $mwtnCommons.gridOptions, {
      showGridFooter: false, // disable the grid footer because the pagination component sets its own.
      paginationPageSizes: [10, 25, 50, 100],
      paginationPageSize: paginationPageSize,
      useExternalPagination: true,
      useExternalFiltering: true, 
      useExternalSorting: true,
      totalItems: 0,
      columnDefs: [{
          field: "id",
          type: "string",
          displayName: "Id"
        },
        {
          field: "name",
          type: "string",
          displayName: "Name"
        },
        {
          field: "location",
          type: "string",
          displayName: "Location"
        },
        {
          field: "amslGround",
          type: "string",
          displayName: "AmslGround"
        },
        {
          field: "countLinks",
          type: "number",
          displayName: "Count(SiteLinks)"
        },
        {
          field: "countNetworkElements",
          type: "number",
          displayName: "Count(Network Elements)"
        },
        {
          field: "buttons",
          type: "string",
          displayName: "",
          width: 80,
          enableFiltering: false,
          enableSorting: false,
          cellTemplate: buttonCellTemplate,
          pinnedRight: true
        }
      ],
      data: [],
      onRegisterApi: function (gridApi) {
        // http://ui-grid.info/docs/#/api/ui.grid.core.api:PublicApi
        vm.gridApi = gridApi;

        vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          // Save the current sort column for later use.
          sortColumn =  (!sortColumns || sortColumns.length === 0)
              ? null
              : sortColumns[0];
          loadPage();
        });

        vm.gridApi.pagination.on.paginationChanged($scope, function (newPage, newPageSize) {
          // Save the pagination informations for later use.
          paginationPage = newPage;
          paginationPageSize = newPageSize;
          loadPage();
        });

        vm.gridApi.core.on.filterChanged($scope, function () { 
          // Save the all filters for later use.
          var filters = [];
          this.grid.columns.forEach(function (col, ind) {
            if (col.filters[0] && col.filters[0].term) {
              filters.push({ field: col.field, term: col.filters[0].term });
            }
          });
          gridFilters = filters;
          loadPage();
        });

        loadPage();
      }
    });

    $scope.$on("mapViewVisuability", function (event, data) {
      vm.showAllSites = !data;
    });

    $scope.$watch("visibleSites", function (newVisibleSites, oldVisibleSites) {
      console.log("watch: visibleSites");
      if (!vm.showAllSites) loadPage();
    }, true); // deep watch, maybe find a better solution; e.g. with an api object like the site in the map.

    $scope.$watch(function () { return vm.showAllSites; }, loadPage);

    function loadPage() {
      if (vm.showAllSites) {
        loadRemotePage();
      } else {
        loadLocalPage();
      }
    }

    /**
     * Calculates the page content of the grid and sets the values to the gridOprions.data object.
     */
    function loadLocalPage() {
      var siteIds = Object.keys($scope.visibleSites);
    
      var tempData = siteIds.filter(function (siteId, ind, arr) { 
        var site = $scope.visibleSites[siteId];
        return gridFilters.map(function (filter) {
          switch (filter.field) {
            case "countLinks":
              return (site.references.siteLinks ? site.references.siteLinks.length : 0) == +filter.term;
            default:
              return site[filter.field].contains(filter.term);
          }
        }).and(true);
      }).map(function (siteId) {
        var site = $scope.visibleSites[siteId];
        var orderBy;

        if (!sortColumn || !sortColumn.sort.direction) {
          return { 
            id: siteId
          }
        }

        switch (sortColumn.field) {
          case "countLinks":
            orderBy = site.references.siteLinks ? site.references.siteLinks.length : 0;
            break;
          case "countNetworkElements":
            orderBy = site.references.networkElements ? site.references.networkElements.length : 0;
            break;
          case "buttons":
            orderBy = siteId;
            break;
          default:
            orderBy = site[sortColumn.field];
            break;
        }

        return {
          id: siteId,
          orderBy: orderBy
        };
      });
      
      if (sortColumn && sortColumn.sort.direction) {
        tempData.sort(function (left, right) {
          if (left === right || left.orderBy === right.orderBy) {
            return 0;
          }
          if (left.orderBy > right.orderBy) {
            return (sortColumn.sort.direction === uiGridConstants.ASC) ? 1 : -1;
          }
          return (sortColumn.sort.direction === uiGridConstants.ASC) ? -1 : 1;
        });
      }  

      var maxPageNumber = Math.max(1, Math.ceil(tempData.length / paginationPageSize));
      var currentPage = Math.min(maxPageNumber, paginationPage);
      var orderedSitesAtCurrentPage = tempData.slice((currentPage - 1) * paginationPageSize, currentPage * paginationPageSize);

      sitesAtCurrentPageCache = {};
      var orderedData = [];
      
      orderedSitesAtCurrentPage.forEach(function (orderedSite) {
        var site = $scope.visibleSites[orderedSite.id];
        sitesAtCurrentPageCache[site.id] = site;
        orderedData.push({
          id: orderedSite.id,
          name: site.name,
          location: site.location.lat.toLocaleString("en-US", {
            minimumFractionDigits: 4
          }) + ", " + site.location.lng.toLocaleString("en-US", {
            minimumFractionDigits: 4
          }),
          amslGround: site.amslGround,
          countLinks: site.references.siteLinks ? site.references.siteLinks.length : 0,
          countNetworkElements: site.references.networkElements ? site.references.networkElements.length : 0
        });
      });

      $timeout(function () {
        vm.gridOptions.data = orderedData;
        vm.gridOptions.totalItems = tempData.length;
      });
    }

    /**
     * Loads the page content for the grid and sets the values to the gridOprions.data object.
     */
    function loadRemotePage() {
     
      $mwtnTopology.getSites((sortColumn && sortColumn.field), sortColumn && ((sortColumn.sort.direction && sortColumn.sort.direction === uiGridConstants.ASC) ? 'asc' : 'desc') , gridFilters, paginationPageSize, (paginationPage - 1) * paginationPageSize).then(function (result) {
        sitesAtCurrentPageCache = result.sites.reduce(function (acc, cur, ind, arr) {
          acc[cur.id] = cur;
          return acc;
        }, {});
        vm.gridOptions.data = result.sites.map(function (site) {
          return {
            id: site.id,
            name: site.name,
            location: site.location.lat.toLocaleString("en-US", {
              minimumFractionDigits: 4
            }) + ", " + site.location.lng.toLocaleString("en-US", {
              minimumFractionDigits: 4
            }),
            amslGround: site.amslGround,
            countLinks: site.references.siteLinks ? site.references.siteLinks.length : 0,
            countNetworkElements: site.references.networkElements ? site.references.networkElements.length : 0
        } });
        vm.gridOptions.totalItems = result.total;
      });
    } 
  }]);

  mwtnTopologyApp.directive('mwtnTopologySiteGrid', function () {
    return {
      restrict: 'E',
      replace: false,
      controller: 'mwtnTopologySiteGridController',
      controllerAs: 'vm',
      scope: {
        visibleSites: "="
      },
      templateUrl: 'src/app/mwtnTopology/templates/siteGrid.tpl.html'
    };
  });

  mwtnTopologyApp.controller('mwtnTopologySiteLinkGridController', ['$scope', '$timeout', '$state', '$mwtnCommons', '$mwtnTopology', 'uiGridConstants', function ($scope, $timeout, $state, $mwtnCommons, $mwtnTopology, uiGridConstants) {
    var vm = this;

    // The page number to show in the grid.
    var paginationPage = 1;
    // The page size.
    var paginationPageSize = 10;
    // The grid column object with current sorting informations.
    var sortColumn = null;
    // The grid column object with current sorting informations.
    var gridFilters = [];

    var linksAtCurrentPageCache = {};

    vm.showAllLinks = false;

    vm.onNavigateToLink = function (row) {
      var link = linksAtCurrentPageCache[row.entity.id];
      
      var top = link.siteA.location.lat >= link.siteZ.location.lat ? link.siteA.location.lat : link.siteZ.location.lat;
      var bottom = link.siteA.location.lat >= link.siteZ.location.lat ? link.siteZ.location.lat : link.siteA.location.lat;
      
      // todo: this code is not able to handle links which overlap the -100|180 ° borderline
      var left = link.siteA.location.lng <= link.siteZ.location.lng ? link.siteA.location.lng : link.siteZ.location.lng;
      var right = link.siteA.location.lng <= link.siteZ.location.lng ? link.siteZ.location.lng : link.siteA.location.lng;

     $state.go("main.mwtnTopology", { top: top, bottom: bottom, left: left, right: right, siteLink: link.id, internal: false }, { notify: false });
      console.log(link);
    };

    // see http://ui-grid.info/docs/#/tutorial/317_custom_templates
    var buttonCellTemplate = '<div class="ui-grid-cell-contents tooltip-uigrid" title="TOOLTIP"><i ng-click="grid.appScope.vm.onNavigateToLink(row)" ng-class="{\'fa\':true, \'fa-map-marker\': true, \'{{COL_FIELD}}\':true}" aria-hidden="true"></i></div>';

    vm.gridOptions = Object.assign({}, $mwtnCommons.gridOptions, {
      // enableFiltering: false,
      showGridFooter: false, // disable the grid footer because the pagination component sets its own.
      paginationPageSizes: [10, 25, 50, 100],
      paginationPageSize: paginationPageSize,
      useExternalPagination: true,
      useExternalFiltering: true, 
      useExternalSorting: true,
      totalItems: 0,
      columnDefs: [{
        field: "id",
        type: "string",
        displayName: "Id"
      },
      {
        field: "name",
        type: "string",
        displayName: "Name"
        },
      {
        field: "siteIdA",
        type: "string",
        displayName: "SiteA"
      },
      {
        field: "siteIdZ",
        type: "string",
        displayName: "SiteZ"
      },
      {
        field: "buttons",
        type: "string",
        displayName: "",
        width: 80,
        enableFiltering: false,
        enableSorting: false,
        cellTemplate: buttonCellTemplate,
        pinnedRight: true
      }
      ],
      data: [],
      onRegisterApi: function (gridApi) {
        // http://ui-grid.info/docs/#/api/ui.grid.core.api:PublicApi
        vm.gridApi = gridApi;

        vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          // save the current sort column for later use.
          sortColumn = (!sortColumns || sortColumns.length === 0) ?
            null :
            sortColumns[0];

          loadPage();
        });

        vm.gridApi.pagination.on.paginationChanged($scope, function (newPage, newPageSize) {
          paginationPage = newPage;
          paginationPageSize = newPageSize;
          loadPage();
        });

        vm.gridApi.core.on.filterChanged($scope, function () {
          // Save the all filters for later use.
          var filters = [];
          this.grid.columns.forEach(function (col, ind) {
            if (col.filters[0] && col.filters[0].term) {
              filters.push({ field: col.field, term: col.filters[0].term });
            }
          });
          gridFilters = filters;
          loadPage();
        });

        loadPage();
      }
    });

    $scope.$on("mapViewVisuability", function (event, data) {
      vm.showAllLinks = !data;
    });

    $scope.$watch("knownSiteLinks", function (newKnownSiteLinks, oldKnownSiteLinks) {
      console.log("watch: knownSiteLinks");
      loadPage();
    }, true); // deep watch, maybe find a better solution; e.g. with an api object like the site in the map.

    $scope.$watch(function () { return vm.showAllLinks; }, loadPage);

    function loadPage() {
      if (vm.showAllLinks) {
        loadRemotePage();
      } else {
        loadLocalPage();
      }
    }

    /**
        * Calculates the page content of the grid and sets the values to the gridOprions.data object.
        */
    function loadLocalPage() {
      var linkIds = Object.keys($scope.knownSiteLinks);

      var tempData = linkIds.filter(function (linkId, ind, arr) {
        var link = $scope.knownSiteLinks[linkId];
        return gridFilters.map(function (filter) {
          switch (filter.field) {
            case 'siteIdA':
              return link.siteA.id.contains(filter.term);
            case 'siteIdZ':
              return link.siteZ.id.contains(filter.term);
            default:
              return link[filter.field].contains(filter.term);
          }
        }).and(true);
      }).map(function (linkId) {
        var link = $scope.knownSiteLinks[linkId];
        var orderBy;

        if (!sortColumn || !sortColumn.sort.direction) {
          return {
            id: linkId
          }
        }

        switch (sortColumn.field) {
          case 'siteIdA':
            orderBy = link.siteA.id;  
            break;  
          case 'siteIdZ':
            orderBy = link.siteZ.id;    
            break;  
          default:
            orderBy = link[sortColumn.field];
            break;
        }

        return {
          id: linkId,
          orderBy: orderBy
        };
      });

      if (sortColumn && sortColumn.sort.direction) {
        tempData.sort(function (left, right) {
          if (left === right || left.orderBy === right.orderBy) {
            return 0;
          }
          if (left.orderBy > right.orderBy) {
            return (sortColumn.sort.direction === uiGridConstants.ASC) ? 1 : -1;
          }
          return (sortColumn.sort.direction === uiGridConstants.ASC) ? -1 : 1;
        });
      }

      var maxPageNumber = Math.max(1, Math.ceil(tempData.length / paginationPageSize));
      var currentPage = Math.min(maxPageNumber, paginationPage);
      var orderedSitesAtCurrentPage = tempData.slice((currentPage - 1) * paginationPageSize, currentPage * paginationPageSize);

      linksAtCurrentPageCache = {};
      var orderedData = [];
      
      orderedSitesAtCurrentPage.forEach(function (orderdLink) {
        var link = $scope.knownSiteLinks[orderdLink.id];
        linksAtCurrentPageCache[link.id] = link;
        orderedData.push({
          id: link.id,
          name: link.name,
          siteIdA: link.siteA.id,
          siteIdZ: link.siteZ.id
        });
      });

      $timeout(function () {
        vm.gridOptions.data = orderedData;
        vm.gridOptions.totalItems = tempData.length;
      });
    }

    /**
     * Loads the page content for the grid and sets the values to the gridOprions.data object.
     */
    function loadRemotePage() {
      linksAtCurrentPageCache = {};

      // the links for one page
      $mwtnTopology.getLinks((sortColumn && sortColumn.field), sortColumn && ((sortColumn.sort.direction && sortColumn.sort.direction === uiGridConstants.ASC) ? 'asc' : 'desc'), gridFilters, paginationPageSize, (paginationPage - 1) * paginationPageSize).then(function (result) {
        // get all site id s  
        var siteIds = {};
        result.links.forEach(function (link) {
          siteIds[link.siteA] = link.siteA;
          siteIds[link.siteZ] = link.siteZ;
        });

        // load all sites         
        $mwtnTopology.getSitesByIds(Object.keys(siteIds)).then(function (sitesResult) {
          var sites = sitesResult.sites.reduce(function (acc, cur, ind, arr) {
            acc[cur.id] = cur;
            return acc;
          },{});
          result.links.forEach(function (link) {
            linksAtCurrentPageCache[link.id] = {
              id: link.id,
              name: link.name,
              siteA: sites[link.siteA],
              siteZ: sites[link.siteZ]
            };
          });
          vm.gridOptions.data = result.links.map(function (link) {
            return {
              id: link.id,
              name: link.name,
              siteIdA: link.siteA,
              siteIdZ: link.siteZ
            }
          });
          vm.gridOptions.totalItems = result.total;

        });
      });
    } 
    

  }]);

  mwtnTopologyApp.directive('mwtnTopologySiteLinkGrid', function () {
    return {
      restrict: 'E',
      replace: false,
      controller: 'mwtnTopologySiteLinkGridController',
      controllerAs: 'vm',
      templateUrl: 'src/app/mwtnTopology/templates/siteLinkGrid.tpl.html',
      scope: {
        knownSiteLinks: "="
      },
    };
  });

  mwtnTopologyApp.controller('mwtnTopologySitePathGridController', ['$scope', function ($scope) {
    var vm = this;

    vm.showAllPaths = false;

    $scope.$on("mapViewVisuability", function (event, data) {
      vm.showAllPaths = !data;
    });

  }]);

  mwtnTopologyApp.directive('mwtnTopologySitePathGrid', function () {
    return {
      restrict: 'E',
      replace: false,
      controller: 'mwtnTopologySitePathGridController',
      controllerAs: 'vm',
      templateUrl: 'src/app/mwtnTopology/templates/sitePathGrid.tpl.html'
    };
  });


  /********************************************* Physical *************************/

    mwtnTopologyApp.controller('mwtnTopologyPhysicalViewController', ['$scope', '$q', '$timeout', '$state', '$mwtnTopology', function ($scope, $q, $timeout, $state, $mwtnTopology) {
      var vm = this;
      vm.status = {
        graphIsOpen: false,
        networkElementsIsOpen: false,
        LinksIsOpen: false
      };
     

    }]);

    mwtnTopologyApp.directive('mwtnTopologyPhysicalView', function () {
      return {
        restrict: 'E',
        controller: 'mwtnTopologyPhysicalViewController',
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'src/app/mwtnTopology/templates/physicalView.tpl.html',
        scope: {
         
        }
      };
    });

    mwtnTopologyApp.factory("mwtnTopologyPhysicalPathData", function () {
      var colors = {
        root: '#f54',
        port: '#377',
        device: '#252',
        site: '#525',
        edge: '#49a',
        white: '#eed',
        grey: '#555',
        selected: '#ff0'
      };

      var styles = [{
            selector: 'node',
            css: {
              'content': 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'background-color': '#666666',
              'border-color': '#000000',
              'border-width': '1px',
              'color': '#ffffff'
            }
          },
          {
            selector: 'node[layer = "MWPS"]',
            css: {
              'content': 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'background-color': '#316ac5',
              'border-color': '#000000',
              'border-width': '1px',
              'color': '#ffffff'
            }
          },
          {
            selector: 'node[layer = "ETH-TTP"]',
            css: {
              'content': 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'background-color': '#008800',
              'border-color': '#004400',
              'border-width': '1px',
              'color': '#ffffff'
            }
          },
          {
            selector: '$node > node',
            css: {
              'shape': 'roundrectangle',
              'padding-top': '10px',
              'padding-left': '10px',
              'padding-bottom': '10px',
              'padding-right': '10px',
              'text-valign': 'top',
              'text-halign': 'center',
              'background-color': '#eeeeee',
              'color': '#444444',
              'border-color': '#888888'
            }
          },
          {
            selector: '$node > node > node',
            css: {
              'shape': 'roundrectangle',
              'padding-top': '10px',
              'padding-left': '10px',
              'padding-bottom': '10px',
              'padding-right': '10px',
              'text-valign': 'top',
              'text-halign': 'center',
              'background-color': '#fefefe',
              'color': '#444444',
              'border-color': '#888888'
            }
          },
          {
            selector: 'node[type = "device"]',
            css: {
              'background-color': '#eeeeee',
              'border-color': '#888888',
              'border-width': '1px',
              'color': '#444444'
            }
          },
          {
            selector: 'node[active = "false"]',
            css: {
              'opacity': '0.3'
            }
          },
          {
            selector: 'edge',
            css: {
              'content': 'data(id)',
              'target-arrow-shape': 'triangle',
              'line-color': '#666666',
              'color': '#000000'
            }
          },
          {
            selector: 'edge[layer = "MWPS"]',
            css: {
              'content': 'data(id)',
              'target-arrow-shape': 'triangle',
              'width': '5px',
              'line-color': '#316ac5',
              'color': '#000000'
            }
          },
          {
            selector: ':selected',
            css: {
              'background-color': 'black',
              'line-color': 'black',
              'target-arrow-color': 'black',
              'source-arrow-color': 'black'
            }
          },
          {
            selector: 'edge[active = "false"]',
            css: {
              'opacity': '0.3'
            }
          }
        ];
      
      var elements =  {
        nodes: [
          { data: { id: 'north', label : 'north' , type: 'site', latitude:'50,734916', longitude:'50,734916'}  },
          { data: { id: 'north-east', label : 'north-east' , type: 'site', latitude:'50,733028', longitude:'50,733028'}  },
          { data: { id: 'north-west', label : 'north-west' , type: 'site', latitude:'50,73023', longitude:'50,73023'}  },
          { data: { id: 'east', label : 'east' , type: 'site', latitude:'50,725672', longitude:'50,725672'}  },
          { data: { id: 'west', label : 'west' , type: 'site', latitude:'50,721914', longitude:'50,721914'}  },
          { data: { id: 'south-east', label : 'south-east' , type: 'site', latitude:'50,717158', longitude:'50,717158'}  },
          { data: { id: 'south-west', label : 'south-west' , type: 'site', latitude:'50,714359', longitude:'50,714359'}  },
          { data: { id: 'south', label : 'south' , type: 'site', latitude:'50,712472', longitude:'50,712472'}  },
          
          { data: { id: 'ADVA-A', label : 'ADVA-A' , parent : 'west', type: 'device', active: 'false' , latitude:'west', longitude:'west'}  },
          { data: { id: 'ADVA-B', label : 'ADVA-B' , parent : 'north-west', type: 'device', active: 'true' }  },
          { data: { id: 'ADVA-Y', label : 'ADVA-Y' , parent : 'north-east', type: 'device', active: 'true' }  },
          { data: { id: 'ADVA-Z', label : 'ADVA-Z' , parent : 'south', type: 'device', active: 'true' }  },
          { data: { id: 'Aviat-A', label : 'Aviat-A' , parent : 'north-east', type: 'device', active: 'true' }  },
          { data: { id: 'Aviat-Z', label : 'Aviat-Z' , parent : 'east', type: 'device', active: 'true' }  },
          { data: { id: 'Ceragon-A', label : 'Ceragon-A' , parent : 'north-west', type: 'device', active: 'true' }  },
          { data: { id: 'Ceragon-Z', label : 'Ceragon-Z' , parent : 'west', type: 'device', active: 'true' }  },
          { data: { id: 'DragonWave-A', label : 'DragonWave-A' , parent : 'south-west', type: 'device', active: 'true' }  },
          { data: { id: 'DragonWave-Z', label : 'DragonWave-Z' , parent : 'south', type: 'device', active: 'true' }  },
          { data: { id: 'ELVA-1-A', label : 'ELVA-1-A' , parent : 'north', type: 'device', active: 'true' }  },
          { data: { id: 'ELVA-1-Z', label : 'ELVA-1-Z' , parent : 'south-west', type: 'device', active: 'true' }  },
          { data: { id: 'Ericsson-A', label : 'Ericsson-A' , parent : 'north-east', type: 'device', active: 'true' }  },
          { data: { id: 'Ericsson-Z', label : 'Ericsson-Z' , parent : 'east', type: 'device', active: 'true' }  },
          { data: { id: 'Fujitsu-A', label : 'Fujitsu-A' , parent : 'east', type: 'device', active: 'true' }  },
          { data: { id: 'Fujitsu-Z', label : 'Fujitsu-Z' , parent : 'south-east', type: 'device', active: 'true' }  },
          { data: { id: 'Huawei-A', label : 'Huawei-A' , parent : 'south-west', type: 'device', active: 'true' }  },
          { data: { id: 'Huawei-Z', label : 'Huawei-Z' , parent : 'south', type: 'device', active: 'true' }  },
          { data: { id: 'Intracom-A', label : 'Intracom-A' , parent : 'south', type: 'device', active: 'true' }  },
          { data: { id: 'Intracom-Z', label : 'Intracom-Z' , parent : 'south-east', type: 'device', active: 'true' }  },
          { data: { id: 'NEC-A', label : 'NEC-A' , parent : 'north', type: 'device', active: 'true' }  },
          { data: { id: 'NEC-Z', label : 'NEC-Z' , parent : 'north-east', type: 'device', active: 'true' }  },
          { data: { id: 'Nokia-A', label : 'Nokia-A' , parent : 'west', type: 'device', active: 'true' }  },
          { data: { id: 'Nokia-Z', label : 'Nokia-Z' , parent : 'south-west', type: 'device', active: 'true' }  },
          { data: { id: 'SIAE-A', label : 'SIAE-A' , parent : 'south', type: 'device', active: 'true' }  },
          { data: { id: 'SIAE-Z', label : 'SIAE-Z' , parent : 'south-east', type: 'device', active: 'true' }  },
          { data: { id: 'ZTE-A', label : 'ZTE-A' , parent : 'north-west', type: 'device', active: 'true' }  },
          { data: { id: 'ZTE-Z', label : 'ZTE-Z' , parent : 'north', type: 'device', active: 'true' }  },
          
          { data: { id: 'Aviat-Z#5', label : '#5' , parent : 'Aviat-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1984, y: 390 } },
          { data: { id: 'Aviat-Z#1', label : '#1' , parent : 'Aviat-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1984, y: 321 } },
          { data: { id: 'Ericsson-Z#5', label : '#5' , parent : 'Ericsson-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1777, y: 393 } },
          { data: { id: 'Ericsson-Z#1', label : '#1' , parent : 'Ericsson-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1777, y: 318 } },
          { data: { id: 'Ericsson-Z#2', label : '#2' , parent : 'Ericsson-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1756, y: 336 } },
          { data: { id: 'Fujitsu-A#5', label : '#5' , parent : 'Fujitsu-A' , type:'port', layer:'ETY', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1859, y: 567 } },
          { data: { id: 'Fujitsu-A#1', label : '#1' , parent : 'Fujitsu-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1845, y: 644 } },
          { data: { id: 'Fujitsu-A#2', label : '#2' , parent : 'Fujitsu-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,725672', longitude:'7,158488'}, position: { x: 1872, y: 644 } },
          { data: { id: 'ELVA-1-A#2', label : '#2' , parent : 'ELVA-1-A' , type:'port', layer:'ETY', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 895, y: 150 } },
          { data: { id: 'ELVA-1-A#1', label : '#1' , parent : 'ELVA-1-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 815, y: 150 } },
          { data: { id: 'NEC-A#3', label : '#3' , parent : 'NEC-A' , type:'port', layer:'ETY', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 955, y: -52 } },
          { data: { id: 'NEC-A#1', label : '#1' , parent : 'NEC-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 1035, y: -52 } },
          { data: { id: 'ZTE-Z#4', label : '#4' , parent : 'ZTE-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 707, y: -67 } },
          { data: { id: 'ZTE-Z#5', label : '#5' , parent : 'ZTE-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 747, y: -27 } },
          { data: { id: 'ZTE-Z#1', label : '#1' , parent : 'ZTE-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,734916', longitude:'7,137636'}, position: { x: 667, y: -27 } },
          { data: { id: 'ADVA-Y#1', label : '#1' , parent : 'ADVA-Y' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1392, y: 229 } },
          { data: { id: 'ADVA-Y#2', label : '#2' , parent : 'ADVA-Y' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1449, y: 172 } },
          { data: { id: 'ADVA-Y#3', label : '#3' , parent : 'ADVA-Y' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1392, y: 172 } },
          { data: { id: 'ADVA-Y#4', label : '#4' , parent : 'ADVA-Y' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1449, y: 229 } },
          { data: { id: 'Aviat-A#5', label : '#5' , parent : 'Aviat-A' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1654, y: -47 } },
          { data: { id: 'Aviat-A#1', label : '#1' , parent : 'Aviat-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1654, y: 22 } },
          { data: { id: 'Ericsson-A#4', label : '#4' , parent : 'Ericsson-A' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1605, y: 229 } },
          { data: { id: 'Ericsson-A#5', label : '#5' , parent : 'Ericsson-A' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1605, y: 172 } },
          { data: { id: 'Ericsson-A#1', label : '#1' , parent : 'Ericsson-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1671, y: 214 } },
          { data: { id: 'Ericsson-A#2', label : '#2' , parent : 'Ericsson-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1654, y: 235 } },
          { data: { id: 'NEC-Z#3', label : '#3' , parent : 'NEC-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1392, y: 16 } },
          { data: { id: 'NEC-Z#4', label : '#4' , parent : 'NEC-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1449, y: 16 } },
          { data: { id: 'NEC-Z#2', label : '#2' , parent : 'NEC-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1449, y: -41 } },
          { data: { id: 'NEC-Z#1', label : '#1' , parent : 'NEC-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,733028', longitude:'7,151086'}, position: { x: 1392, y: -41 } },
          { data: { id: 'ADVA-B#1', label : '#1' , parent : 'ADVA-B' , type:'port', layer:'ETY', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 380, y: 381 } },
          { data: { id: 'ADVA-B#2', label : '#2' , parent : 'ADVA-B' , type:'port', layer:'ETY', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 380, y: 301 } },
          { data: { id: 'Ceragon-A#1', label : '#1' , parent : 'Ceragon-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 147, y: 375 } },
          { data: { id: 'Ceragon-A#2', label : '#2' , parent : 'Ceragon-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 129, y: 354 } },
          { data: { id: 'Ceragon-A#5', label : '#5' , parent : 'Ceragon-A' , type:'port', layer:'ETY', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 195, y: 312 } },
          { data: { id: 'ZTE-A#3', label : '#3' , parent : 'ZTE-A' , type:'port', layer:'ETY', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 380, y: 168 } },
          { data: { id: 'ZTE-A#4', label : '#4' , parent : 'ZTE-A' , type:'port', layer:'ETY', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 345, y: 148 } },
          { data: { id: 'ZTE-A#5', label : '#5' , parent : 'ZTE-A' , type:'port', layer:'ETY', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 345, y: 108 } },
          { data: { id: 'ZTE-A#1', label : '#1' , parent : 'ZTE-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,73023', longitude:'7,126017'}, position: { x: 408, y: 99 } },
          { data: { id: 'ADVA-Z#1', label : '#1' , parent : 'ADVA-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1139, y: 1001 } },
          { data: { id: 'ADVA-Z#2', label : '#2' , parent : 'ADVA-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1196, y: 944 } },
          { data: { id: 'ADVA-Z#3', label : '#3' , parent : 'ADVA-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1139, y: 944 } },
          { data: { id: 'ADVA-Z#4', label : '#4' , parent : 'ADVA-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1196, y: 1001 } },
          { data: { id: 'DragonWave-Z#2', label : '#2' , parent : 'DragonWave-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1133, y: 1252 } },
          { data: { id: 'DragonWave-Z#1', label : '#1' , parent : 'DragonWave-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1053, y: 1252 } },
          { data: { id: 'Huawei-Z#3', label : '#3' , parent : 'Huawei-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1046, y: 1094 } },
          { data: { id: 'Huawei-Z#4', label : '#4' , parent : 'Huawei-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 989, y: 1094 } },
          { data: { id: 'Huawei-Z#5', label : '#5' , parent : 'Huawei-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1058, y: 1123 } },
          { data: { id: 'Huawei-Z#1', label : '#1' , parent : 'Huawei-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 978, y: 1123 } },
          { data: { id: 'Intracom-A#2', label : '#2' , parent : 'Intracom-A' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1203, y: 1252 } },
          { data: { id: 'Intracom-A#1', label : '#1' , parent : 'Intracom-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1283, y: 1252 } },
          { data: { id: 'SIAE-A#4', label : '#4' , parent : 'SIAE-A' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1289, y: 1094 } },
          { data: { id: 'SIAE-A#5', label : '#5' , parent : 'SIAE-A' , type:'port', layer:'ETY', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1278, y: 1123 } },
          { data: { id: 'SIAE-A#1', label : '#1' , parent : 'SIAE-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1334, y: 1086 } },
          { data: { id: 'SIAE-A#2', label : '#2' , parent : 'SIAE-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,712472', longitude:'7,143887'}, position: { x: 1354, y: 1106 } },
          { data: { id: 'Fujitsu-Z#5', label : '#5' , parent : 'Fujitsu-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1855, y: 821 } },
          { data: { id: 'Fujitsu-Z#2', label : '#2' , parent : 'Fujitsu-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1868, y: 743 } },
          { data: { id: 'Fujitsu-Z#1', label : '#1' , parent : 'Fujitsu-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1841, y: 743 } },
          { data: { id: 'Intracom-Z#5', label : '#5' , parent : 'Intracom-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1755, y: 998 } },
          { data: { id: 'Intracom-Z#1', label : '#1' , parent : 'Intracom-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1714, y: 1018 } },
          { data: { id: 'SIAE-Z#4', label : '#4' , parent : 'SIAE-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1590, y: 784 } },
          { data: { id: 'SIAE-Z#5', label : '#5' , parent : 'SIAE-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1647, y: 784 } },
          { data: { id: 'SIAE-Z#2', label : '#2' , parent : 'SIAE-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1599, y: 847 } },
          { data: { id: 'SIAE-Z#1', label : '#1' , parent : 'SIAE-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,717158', longitude:'7,155506'}, position: { x: 1581, y: 826 } },
          { data: { id: 'DragonWave-A#2', label : '#2' , parent : 'DragonWave-A' , type:'port', layer:'ETY', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 455, y: 1178 } },
          { data: { id: 'DragonWave-A#1', label : '#1' , parent : 'DragonWave-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 535, y: 1178 } },
          { data: { id: 'ELVA-1-Z#2', label : '#2' , parent : 'ELVA-1-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 455, y: 878 } },
          { data: { id: 'ELVA-1-Z#1', label : '#1' , parent : 'ELVA-1-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 535, y: 878 } },
          { data: { id: 'Huawei-A#5', label : '#5' , parent : 'Huawei-A' , type:'port', layer:'ETY', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 605, y: 1028 } },
          { data: { id: 'Huawei-A#1', label : '#1' , parent : 'Huawei-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 685, y: 1028 } },
          { data: { id: 'Nokia-Z33', label : '33' , parent : 'Nokia-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 385, y: 1028 } },
          { data: { id: 'Nokia-Z31', label : '31' , parent : 'Nokia-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,714359', longitude:'7,130437'}, position: { x: 305, y: 1028 } },
          { data: { id: 'ADVA-A#1', label : '#1' , parent : 'ADVA-A' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: 124, y: 564 } },
          { data: { id: 'ADVA-A#2', label : '#2' , parent : 'ADVA-A' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: 124, y: 507 } },
          { data: { id: 'Ceragon-Z#1', label : '#1' , parent : 'Ceragon-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: -96, y: 556 } },
          { data: { id: 'Ceragon-Z#2', label : '#2' , parent : 'Ceragon-Z' , type:'port', layer:'MWPS', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: -117, y: 538 } },
          { data: { id: 'Ceragon-Z#4', label : '#4' , parent : 'Ceragon-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: -159, y: 547 } },
          { data: { id: 'Ceragon-Z#5', label : '#5' , parent : 'Ceragon-Z' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: -159, y: 604 } },
          { data: { id: 'Nokia-A13', label : '13' , parent : 'Nokia-A' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: 40, y: 801 } },
          { data: { id: 'Nokia-A34', label : '34' , parent : 'Nokia-A' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: 28, y: 772 } },
          { data: { id: 'Nokia-A11', label : '11' , parent : 'Nokia-A' , type:'port', layer:'ETY', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: -29, y: 772 } },
          { data: { id: 'Nokia-A31', label : '31' , parent : 'Nokia-A' , type:'port', layer:'MWPS', active:'true', latitude:'50,721914', longitude:'7,120521'}, position: { x: 28, y: 829 } },
          
          { data: { id: 'Spirent#1', label : '#1' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service13'  }, position: { x: 707, y: -167 } },
          { data: { id: 'Spirent#2', label : '#2' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service24'  }, position: { x: -259, y: 547 } },
          { data: { id: 'Spirent#3', label : '#3' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service13'  }, position: { x: 1292, y: 172 } },
          { data: { id: 'Spirent#4', label : '#4' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service24'  }, position: { x: 1490, y: 784 } },
          { data: { id: 'Spirent#5', label : '#5' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service56'  }, position: { x: 1754, y: -47 } },
          { data: { id: 'Spirent#6', label : '#6' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service56'  }, position: { x: 455, y: 1278 } },
          { data: { id: 'Spirent#7', label : '#7' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service78'  }, position: { x: 895, y: 250 } },
          { data: { id: 'Spirent#8', label : '#8' , parent : 'Spirent' , type:'host', layer:'ETH-TTP', active:'true', service:'service78'  }, position: { x: 455, y: 778 } },


        ],
        edges: [
          
          { data: { id: '21', source: 'Aviat-A#1', target: 'Aviat-Z#1', label: '21' , length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' }},
          { data: { id: '31', source: 'Ceragon-A#1', target: 'Ceragon-Z#1', label: '31' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '32', source: 'Ceragon-A#2', target: 'Ceragon-Z#2', label: '32' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '41', source: 'DragonWave-A#1', target: 'DragonWave-Z#1', label: '41' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '121', source: 'ELVA-1-A#1', target: 'ELVA-1-Z#1', label: '121' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: 'ERI1', source: 'Ericsson-A#1', target: 'Ericsson-Z#1', label: 'ERI1' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: 'ERI2', source: 'Ericsson-A#2', target: 'Ericsson-Z#2', label: 'ERI2' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '61', source: 'Fujitsu-A#1', target: 'Fujitsu-Z#1', label: '61' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '62', source: 'Fujitsu-A#2', target: 'Fujitsu-Z#2', label: '62' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '71', source: 'Huawei-A#1', target: 'Huawei-Z#1', label: '71' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '131', source: 'Intracom-A#1', target: 'Intracom-Z#1', label: '131' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '81', source: 'NEC-A#1', target: 'NEC-Z#1', label: '81' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '82', source: 'Nokia-A31', target: 'Nokia-Z31', label: '82' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '101', source: 'SIAE-A#1', target: 'SIAE-Z#1', label: '101' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '102', source: 'SIAE-A#2', target: 'SIAE-Z#2', label: '102' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          { data: { id: '111', source: 'ZTE-A#1', target: 'ZTE-Z#1', label: '111' ,length: '0' , azimuthAZ: '0' , azimuthZA: '180' , layer: 'MWPS' , active: 'true' } },
          
          { data: { id: 'ETY01', source: 'ADVA-A#1', target: 'Nokia-A34', label: 'ADVA-A#1-Nokia-A34' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY02', source: 'ADVA-A#2', target: 'ZTE-A#4', label: 'ADVA-A#2-ZTE-A#4' , layer: 'ETY' , active: 'false' } },
          { data: { id: 'ETY03', source: 'ADVA-B#1', target: 'Nokia-A13', label: 'ADVA-B#1-Nokia-A13' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY04', source: 'ADVA-B#2', target: 'ZTE-A#3', label: 'ADVA-B#2-ZTE-A#3' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY05', source: 'ADVA-Y#1', target: 'Huawei-Z#4', label: 'ADVA-Y#1-Huawei-Z#4' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY06', source: 'ADVA-Y#2', target: 'NEC-Z#4', label: 'ADVA-Y#2-NEC-Z#4' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY07', source: 'ADVA-Y#3', target: 'Spirent#3', label: 'ADVA-Y#3-Spirent#3' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY08', source: 'ADVA-Y#4', target: 'Ericsson-A#4', label: 'ADVA-Y#4-Ericsson-A#4' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY09', source: 'ADVA-Z#1', target: 'Huawei-Z#3', label: 'ADVA-Z#1-Huawei-Z#3' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY10', source: 'ADVA-Z#2', target: 'NEC-Z#3', label: 'ADVA-Z#2-NEC-Z#3' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY11', source: 'ADVA-Z#4', target: 'SIAE-A#4', label: 'ADVA-Z#4-SIAE-A#4' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY12', source: 'Aviat-A#5', target: 'Spirent#5', label: 'Aviat-A#5-Spirent#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY13', source: 'Aviat-Z#5', target: 'Fujitsu-A#5', label: 'Aviat-Z#5-Fujitsu-A#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY14', source: 'Ceragon-A#5', target: 'ZTE-A#5', label: 'Ceragon-A#5-ZTE-A#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY15', source: 'Ceragon-Z#4', target: 'Spirent#2', label: 'Ceragon-Z#4-Spirent#2' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY16', source: 'Ceragon-Z#5', target: 'Nokia-A11', label: 'Ceragon-Z#5-Nokia-A11' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY17', source: 'DragonWave-A#2', target: 'Spirent#6', label: 'DragonWave-A#2-Spirent#6' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY18', source: 'DragonWave-Z#2', target: 'Intracom-A#2', label: 'DragonWave-Z#2-Intracom-A#2' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY19', source: 'ELVA-1-A#2', target: 'Spirent#7', label: 'ELVA-1-A#2-Spirent#7' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY20', source: 'ELVA-1-Z#2', target: 'Spirent#8', label: 'ELVA-1-Z#2-Spirent#8' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY21', source: 'Ericsson-A#5', target: 'NEC-Z#2', label: 'Ericsson-A#5-NEC-Z#2' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY22', source: 'Ericsson-Z#5', target: 'SIAE-Z#5', label: 'Ericsson-Z#5-SIAE-Z#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY23', source: 'Fujitsu-Z#5', target: 'Intracom-Z#5', label: 'Fujitsu-Z#5-Intracom-Z#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY24', source: 'Huawei-A#5', target: 'Nokia-Z33', label: 'Huawei-A#5-Nokia-Z33' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY25', source: 'Huawei-Z#5', target: 'SIAE-A#5', label: 'Huawei-Z#5-SIAE-A#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY26', source: 'NEC-A#3', target: 'ZTE-Z#5', label: 'NEC-A#3-ZTE-Z#5' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY27', source: 'SIAE-Z#4', target: 'Spirent#4', label: 'SIAE-Z#4-Spirent#4' , layer: 'ETY' , active: 'true' } },
          { data: { id: 'ETY28', source: 'ZTE-Z#4', target: 'Spirent#1', label: 'Spirent#1-ZTE-Z#4' , layer: 'ETY' , active: 'true' } },

        ]
      };
      
      var events = eventsFabric();

      var result = {
        colors: colors,
        elements: elements,
        styles: styles,
        events: events
      };

      var someMethodChangingTheElements = function () {
        // @Martin: hier kannst Du die Elements ändern, anschließend mußt Du das Ereignis veröffentlichen
        //          das Ereigniss wird in der Directive aufgefangen und die Grig wird neu gezeichnet

        // Hinweis: Die Reihenfolge muss so bleiben und du kannst NUR result.elements ändern.

        events.publish("elementsChanged", {
          elements: result.elements
        });
      };

      return result;
    });
  
    mwtnTopologyApp.directive("mwtnTopologyPhysicalPathGraph", ["mwtnTopologyPhysicalPathData", function (pathGraphData) {

          return {
            restrict: 'E',
            replace: true,
            template: '<div style="height:500px;width: 100%;"></div>',
            controller: function () {

            },
            scope: {

            },
            link: function (scope, element, attrs, ctrl) {

              var cy = cytoscape({
                container: element[0],

                boxSelectionEnabled: false,
                autounselectify: true,

                style: pathGraphData.styles,
                elements: pathGraphData.elements,
                layout: {
                  name: 'preset',
                  padding: 5
                }
              });

              // @ Martin: Hier wird das Ereignis aus dem Service aboniert.
              //           Es ist möglich mehrere Ereignisse zu definieren.
              pathGraphData.events.subscribe("elementsChanged", function (data) {
                
                // @Martin: cy aktualisiert sich mit Hilfe der Referenz auf die Elemente aus dem Service
                cy.json({
                  elements: pathGraphData.elements // oder data.elements
                });
              });

              // pathGraphData.events.subscribe("styleChanged", function () {
              //   cy.json({
              //      style: pathGraphData.styles
              //   });
              // });

        }
      }
    }]);

    mwtnTopologyApp.controller("mwtnTopologyNetworkElementsGridController", ['$scope', '$timeout', '$state', '$mwtnCommons', '$mwtnTopology', 'uiGridConstants', 'mwtnTopologyPhysicalPathData', function ($scope, $timeout, $state, $mwtnCommons, $mwtnTopology, uiGridConstants, mwtnTopologyPhysicalPathData) {
     var vm = this;

     // The page number to show in the grid.
     var paginationPage = 1;
     // The page size.
     var paginationPageSize = 10;
     // The grid column object with current sorting informations.
     var sortColumn = null;
     // The grid column object with current sorting informations.
     var gridFilters = [];
     // caches all sites at the current grid page

      vm.gridOptions = Object.assign({}, $mwtnCommons.gridOptions, {
        showGridFooter: false, // disable the grid footer because the pagination component sets its own.
        paginationPageSizes: [10, 25, 50, 100],
        paginationPageSize: paginationPageSize,
        useExternalPagination: true,
        useExternalFiltering: true,
        useExternalSorting: true,
        totalItems: 0,
        columnDefs: [{
            field: "id",
            type: "string",
            displayName: "Id"
          },
          {
            field: "layer",
            type: "string",
            displayName: "Layer"
          },
          {
            field: "active",
            type: "string",
            displayName: "Active"
          },
          {
            field: "latitude",
            type: "string",
            displayName: "Latitude"
          },
          {
            field: "longitude",
            type: "string",
            displayName: "Longitude"
          }
        ],
        data: [],
        onRegisterApi: function (gridApi) {
          // http://ui-grid.info/docs/#/api/ui.grid.core.api:PublicApi
          vm.gridApi = gridApi;

          vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            // Save the current sort column for later use.
            sortColumn = (!sortColumns || sortColumns.length === 0) ?
              null :
              sortColumns[0];
            loadPage();
          });

          vm.gridApi.pagination.on.paginationChanged($scope, function (newPage, newPageSize) {
            // Save the pagination informations for later use.
            paginationPage = newPage;
            paginationPageSize = newPageSize;
            loadPage();
          });

          vm.gridApi.core.on.filterChanged($scope, function () {
            // Save the all filters for later use.
            var filters = [];
            this.grid.columns.forEach(function (col, ind) {
              if (col.filters[0] && col.filters[0].term) {
                filters.push({
                  field: col.field,
                  term: col.filters[0].term
                });
              }
            });
            gridFilters = filters;
            loadPage();
          });

          loadPage();
        }
      });

      /**
       * Calculates the page content of the grid and sets the values to the gridOprions.data object.
       */
      function loadPage() {

        // extract all ports        
        var ports = mwtnTopologyPhysicalPathData.elements.nodes.filter(function (node, ind, arr) {
          return node && node.data && node.data.type === 'port';
        }).reduce(function (acc, cur, ind, arr) {
          if (cur.data) acc[cur.data.id] = cur.data;
          return acc;
        }, {});
        
        // get all port ids
        var portIds = Object.keys(ports);

        // apply the grid filters
        var tempData = portIds.filter(function (portId, ind, arr) {
          var port = ports[portId];
          return gridFilters.map(function (filter) {
            switch (filter.field) {
              case "active":
                return port[filter.field].toString().contains(filter.term);
              default:
                return port[filter.field].contains(filter.term);
            }
          }).and(true);
        }).map(function (portId) {
          var port = ports[portId];
          var orderBy;

          if (!sortColumn || !sortColumn.sort.direction) {
            return {
              id: port.id
            }
          }

          switch (sortColumn.field) {
            case "active":
               orderBy = port[sortColumn.field] ? 1 : 0;
               break;
            default:
              orderBy = port[sortColumn.field];
              break;
          }

          return {
            id: port.id,
            orderBy: orderBy
          };
        });

        if (sortColumn && sortColumn.sort.direction) {
          tempData.sort(function (left, right) {
            if (left === right || left.orderBy === right.orderBy) {
              return 0;
            }
            if (left.orderBy > right.orderBy) {
              return (sortColumn.sort.direction === uiGridConstants.ASC) ? 1 : -1;
            }
            return (sortColumn.sort.direction === uiGridConstants.ASC) ? -1 : 1;
          });
        }

        var maxPageNumber = Math.max(1, Math.ceil(tempData.length / paginationPageSize));
        var currentPage = Math.min(maxPageNumber, paginationPage);
        var orderedPortsAtCurrentPage = tempData.slice((currentPage - 1) * paginationPageSize, currentPage * paginationPageSize);

        portsAtCurrentPageCache = {};
        var orderedData = [];

        orderedPortsAtCurrentPage.forEach(function (orderedPort) {
          var port = ports[orderedPort.id];
          portsAtCurrentPageCache[port.id] = port;
          orderedData.push({
            id: orderedPort.id,
            layer: port.layer,
            active: port.active,
            latitude: port.latitude.toLocaleString("en-US", {
              minimumFractionDigits: 4
            }),
            longitude: port.longitude.toLocaleString("en-US", {
              minimumFractionDigits: 4
            })
          });
        });

        $timeout(function () {
          vm.gridOptions.data = orderedData;
          vm.gridOptions.totalItems = tempData.length;
        });
      }

      // subscribe to the elementsChanged event to reload the grid page if the data in the service has chenged      
      mwtnTopologyPhysicalPathData.events.subscribe("elementsChanged", function (data){
        loadPage();
      });

    }]);
  
    mwtnTopologyApp.directive("mwtnTopologyNetworkElementsGrid", [ function () {
      return {
        restrict: 'E',
        replace: false,
        controller: 'mwtnTopologyNetworkElementsGridController',
        controllerAs: 'vm',
        scope: {
         
        },
        templateUrl: 'src/app/mwtnTopology/templates/networkElementsGrid.tpl.html'
      };
    }]);
  
    mwtnTopologyApp.controller("mwtnTopologyLinksGridController", ['$scope', '$timeout', '$state', '$mwtnCommons', '$mwtnTopology', 'uiGridConstants', 'mwtnTopologyPhysicalPathData', function ($scope, $timeout, $state, $mwtnCommons, $mwtnTopology, uiGridConstants, mwtnTopologyPhysicalPathData) {
      var vm = this;

      // The page number to show in the grid.
      var paginationPage = 1;
      // The page size.
      var paginationPageSize = 10;
      // The grid column object with current sorting informations.
      var sortColumn = null;
      // The grid column object with current sorting informations.
      var gridFilters = [];
      // caches all sites at the current grid page

      vm.gridOptions = Object.assign({}, $mwtnCommons.gridOptions, {
        showGridFooter: false, // disable the grid footer because the pagination component sets its own.
        paginationPageSizes: [10, 25, 50, 100],
        paginationPageSize: paginationPageSize,
        useExternalPagination: true,
        useExternalFiltering: true,
        useExternalSorting: true,
        totalItems: 0,
        columnDefs: [{
          field: "id",
          type: "string",
          displayName: "Id"
        },
        {
          field: "source",
           type: "string",
           displayName: "PortA"
        },
        {
          field: "target",
          type: "string",
          displayName: "PortZ"
        },
        {
          field: "layer",
          type: "string",
          displayName: "Layer"
        },
        {
          field: "length",
          type: "string",
          displayName: "Length"
        },
        {
          field: "azimuthAZ",
          type: "string",
          displayName: "azimuthAZ"
        },
        {
          field: "azimuthZA",
          type: "string",
          displayName: "azimuthZA"
        }
        ],
        data: [],
        onRegisterApi: function (gridApi) {
          // http://ui-grid.info/docs/#/api/ui.grid.core.api:PublicApi
          vm.gridApi = gridApi;

          vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            // Save the current sort column for later use.
            sortColumn = (!sortColumns || sortColumns.length === 0) ?
              null :
              sortColumns[0];
            loadPage();
          });

          vm.gridApi.pagination.on.paginationChanged($scope, function (newPage, newPageSize) {
            // Save the pagination informations for later use.
            paginationPage = newPage;
            paginationPageSize = newPageSize;
            loadPage();
          });

          vm.gridApi.core.on.filterChanged($scope, function () {
            // Save the all filters for later use.
            var filters = [];
            this.grid.columns.forEach(function (col, ind) {
              if (col.filters[0] && col.filters[0].term) {
                filters.push({
                  field: col.field,
                  term: col.filters[0].term
                });
              }
            });
            gridFilters = filters;
            loadPage();
          });

          loadPage();
        }
      });

      /**
       * Calculates the page content of the grid and sets the values to the gridOprions.data object.
       */
      function loadPage() {
        // extract all ports        
        var ports = mwtnTopologyPhysicalPathData.elements.nodes.filter(function (node, ind, arr) {
          return node && node.data && node.data.type === 'port';
        }).reduce(function (acc, cur, ind, arr) {
          if (cur.data) acc[cur.data.id] = cur.data;
          return acc;
          }, {});
        
        // extract all links        
        var links = mwtnTopologyPhysicalPathData.elements.edges.filter(function (node, ind, arr) {
          return true; // node && node.data && node.data.type === 'port';
        }).reduce(function (acc, cur, ind, arr) {
          if (cur.data) {
            acc[cur.data.id] = cur.data;
            if (cur.data.layer === 'MWPS') {
              var portA = ports[cur.data.source];
              var portZ = ports[cur.data.target];
            }  
            acc[cur.data.id].length = $mwtnTopology
          }
          return acc;
        }, {});

        // get all link ids
        var linkIds = Object.keys(links);

        // apply the grid filters
        var tempData = linkIds.filter(function (linkId, ind, arr) {
          var link = links[linkId];
          return gridFilters.map(function (filter) {
            switch (filter.field) {
              case "length":
              case "azimuthAZ":
              case "azimuthZA":
                return true;  
              default:
                return link[filter.field].contains(filter.term);
            }
          }).and(true);
        }).map(function (linkId) {
          var link = links[linkId];
          var orderBy;

          if (!sortColumn || !sortColumn.sort.direction) {
            return {
              id: link.id
            }
          }

          switch (sortColumn.field) {
            case "length":
            case "azimuthAZ":
            case "azimuthZA":
             
              break;
            default:
              orderBy = link[sortColumn.field];
              break;
          }

          return {
            id: link.id,
            orderBy: orderBy
          };
        });

        if (sortColumn && sortColumn.sort.direction) {
          tempData.sort(function (left, right) {
            if (left === right || left.orderBy === right.orderBy) {
              return 0;
            }
            if (left.orderBy > right.orderBy) {
              return (sortColumn.sort.direction === uiGridConstants.ASC) ? 1 : -1;
            }
            return (sortColumn.sort.direction === uiGridConstants.ASC) ? -1 : 1;
          });
        }

        var maxPageNumber = Math.max(1, Math.ceil(tempData.length / paginationPageSize));
        var currentPage = Math.min(maxPageNumber, paginationPage);
        var orderedLinksAtCurrentPage = tempData.slice((currentPage - 1) * paginationPageSize, currentPage * paginationPageSize);

        linksAtCurrentPageCache = {};
        var orderedData = [];

        orderedLinksAtCurrentPage.forEach(function (orderedLink) {
          var link = links[orderedLink.id];
          linksAtCurrentPageCache[link.id] = link;
          orderedData.push({
            id: orderedLink.id,
            source: link.source,
            target: link.target,
            layer: link.layer,
            length: 0,
            azimuthAZ: 0,
            azimuthZA: 0
          });
        });

        $timeout(function () {
          vm.gridOptions.data = orderedData;
          vm.gridOptions.totalItems = tempData.length;
        });
      }

      // subscribe to the elementsChanged event to reload the grid page if the data in the service has chenged      
      var subscription = mwtnTopologyPhysicalPathData.events.subscribe("elementsChanged", function (data) {
        loadPage();
        // to unsubscribe call subscription.remove();
      });

    }]);

    mwtnTopologyApp.directive("mwtnTopologyLinksGrid", [function () {
      return {
        restrict: 'E',
        replace: false,
        controller: 'mwtnTopologyLinksGridController',
        controllerAs: 'vm',
        scope: {

        },
        templateUrl: 'src/app/mwtnTopology/templates/linksGrid.tpl.html'
      };
    }]);
  /********************************************* Ethernet *************************/

    mwtnTopologyApp.controller('mwtnTopologyEthernetViewController', ['$scope', '$q', '$timeout', '$state', '$mwtnTopology', function ($scope, $q, $timeout, $state, $mwtnTopology) {
      var vm = this;
      vm.status = {
          topologyIsOpen: false,
          portsOpen: false,
          ethConnectionsIsOpen: false
      }


    }]);

    mwtnTopologyApp.directive('mwtnTopologyEthernetView', function () {
      return {
          restrict: 'E',
          controller: 'mwtnTopologyEthernetViewController',
          controllerAs: 'vm',
          bindToController: true,
          templateUrl: 'src/app/mwtnTopology/templates/ethernetView.tpl.html',
          scope: {
           
          }
        };
    });

  /********************************************* IEEE 1588v2 (PTP) *************************/

  mwtnTopologyApp.controller('mwtnTopologyIeee1588ViewController', ['$scope', '$q', '$timeout', '$state', '$mwtnTopology', function ($scope, $q, $timeout, $state, $mwtnTopology) {
    var vm = this;
    vm.status = {
      topologyIsOpen: false,
      portsOpen: false,
      ethConnectionsIsOpen: false
    }


  }]);

  mwtnTopologyApp.directive('mwtnTopologyIeee1588View', function () {
    return {
      restrict: 'E',
      controller: 'mwtnTopologyIeee1588ViewController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'src/app/mwtnTopology/templates/ieee1588View.tpl.html',
      scope: {

      }
    };
  });
  
  /**
   * The following controller isnt used anymore.
   * It may contain useful functions for later use.
   * @MF: you can savely remove this code if you whish.
   */
  mwtnTopologyApp.register.controller('mwtnTopologyCtrl', ['$scope', '$rootScope', '$q', '$mwtnTopology', '$mwtnLog', 'uiGridConstants',
    function ($scope, $rootScope, $q, $mwtnTopology, $mwtnLog, uiGridConstants) {

      /* non-scope fields */
      // template for the site icons
      var siteIconTemplate = {
        scale: 12,
        fillColor: '#2677FF',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeOpacity: 1,
        strokeWeight: 6
      };

      /* $rootScope fields */
      $rootScope['section_logo'] = 'src/app/mwtnTopology/images/mwtnTopology.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

      /* $scope fields ($scope fields are automaticly watched by angular) */

      // determines if the google api is finally loaded.
      $scope.googleIsReady = false;

      // receive a promise for indicating if the google maps api is finally loaded.
      // $mwtnTopology.googleMapsApiPromise.then(function () {
      //   siteIconTemplate.path = google.maps.SymbolPath.CIRCLE;
      //   $scope.googleIsReady = true;
      // });

      // global object to store data from database
      $scope.data = {};

      // definitions of tabs and accordions
      $scope.layers = [{
        label: 'Site',
        section: [{
            id: 'site-map',
            label: 'Map',
            template: 'src/app/mwtnTopology/templates/maps.tpl.html',
            status: true
          },
          {
            id: 'site-grid',
            label: 'Sites',
            template: 'src/app/mwtnTopology/templates/nodes.tpl.html'
          },
          {
            id: 'sitelink-grid',
            label: 'Site links',
            template: 'src/app/mwtnTopology/templates/links.tpl.html'
          }
        ]
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
      }];

      // global objects for map
      // available options for $scope.mapObjects.map.options: https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
      $scope.mapObjects = {
        map: {
          center: "[45, -73]", //{ latitude: 45, longitude: -73 },
          zoom: 8,
          options: {
            mapTypeId: "hybrid", // set the map type to hybrid (satellite + street name overlay)
            streetViewControl: false // disable streetview control
          },
          exists: false,

        },
        sites: {
          models: [],
          events: {
            click: function (marker, eventName, model, args) {
              console.info('htLog:', marker, eventName, model, args);
              // TODO switch to selected
            },
            mouseover: function (marker, eventName, model, args) {
              // console.info('htLog:', marker, eventName, model, args);
              model.show = true;
              $scope.mapObjects.sites.tooltipOptions.content = '<b>' + model.title + '</b>';
              $scope.mapObjects.sites.tooltip = model;
            },
            mouseout: function (marker, eventName, model, args) {
              // console.info('htLog:', marker, eventName, model, args);
              model.show = false;
              $scope.mapObjects.sites.tooltip = model;
            }
          },
          getIcon: function (color, weight, opacity, scale) {
            var icon = $scope.mapObjects.sites.icon;
            icon.strokeColor = color;
            icon.fillColor = color;
            icon.strokeWeight = weight;
            icon.fillOpacity = opacity;
            icon.scale = scale;
            return icon;
          },
          tooltipOptions: {
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
          tooltip: {
            show: false
          }

        },
        siteLinks: {
          models: [],
          draw: function () {
            // prevent nullreference with a ?:-operator => $scope.data.siteLinks may be undefined on first call of draw.
            $scope.mapObjects.siteLinks.models = $scope.data.siteLinks ?
              $scope.data.siteLinks.map(function (link) {
                var pointA = $scope.data.sites.filter(function (site) {
                  return site.id.toString() === link.sites[0].toString();
                });
                var pointB = $scope.data.sites.filter(function (site) {
                  return site.id.toString() === link.sites[1].toString();
                });
                var path = [{
                  latitude: pointA[0].latitude,
                  longitude: pointA[0].longitude
                }, {
                  latitude: pointB[0].latitude,
                  longitude: pointB[0].longitude
                }];
                return {
                  id: link.id,
                  //                        index : siteLink._index,
                  //                        siteLinkId : siteLink._source.id,
                  path: path,
                  stroke: {
                    color: '#ffffff',
                    weight: 3
                  },
                  editable: false,
                  draggable: false,
                  geodesic: true,
                  visible: true,
                  options: {
                    zIndex: 16,
                    title: link.id + ': ' + pointA[0].name + '-' + pointB[0].name
                  }
                };
              }) : [];
          },
          events: {
            click: function (marker, eventName, model, args) {
              console.info('htLog:', marker, eventName, model, args);
              // TODO switch to selected
            },
            mouseover: function (line, eventName, model, args) {
              var event = JSON.parse(JSON.stringify(args));
              model.stroke.weight = 6;
              model.show = true;
              model.latitude = event['0'].latLng.lat;
              model.longitude = event['0'].latLng.lng;
              $scope.mapObjects.sites.tooltipOptions.content = '<b>' + model.options.title + '</b>';
              $scope.mapObjects.sites.tooltip = model;
            },
            mouseout: function (line, eventName, model, args) {
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
      $scope.map.bounds = {
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

      /*
      uiGmapGoogleMapApi.then(function (maps) {
        // available options for $scope.mapObjects.map.options: https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
        $scope.mapObjects.map.options.mapTypeId = maps.MapTypeId.HYBRID;
        $scope.mapObjects.map.options.streetViewControl = false;
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

      }, function (error) {
        console.error('Something wrong with maps.', error)
      });
      */

      // get sites and update map and grid
      var updateSite = function () {
        console.log('updateSite', $scope.mapObjects.map.exists);

        $mwtnTopology.getAllData('mwtn', 'site', 0, 9999, undefined).then(function (sites) {
          // console.log(JSON.stringify(sites));
          if (sites.data.hits.hits) {
            var hits = sites.data.hits.hits;
            $scope.data.sites = hits.map(function (hit) {
              return hit._source
            });
            sortById($scope.data.sites);

            // show sites and on map
            if ($scope.mapObjects.map.exists) {
              drawSites($scope.data.sites);
            }

            // sites
            $scope.gridOptionsNodes.columnDefs = getColumnDefs($scope.data.sites);
            $scope.gridOptionsNodes.data = $scope.data.sites;
            $mwtnTopology.getAllData('mwtn', 'site-link', 0, 9999, undefined).then(function (sites) {

              var hits = sites.data.hits.hits;
              $scope.data.siteLinks = hits.map(function (hit) {
                return hit._source
              });
              sortById($scope.data.siteLinks);

              if ($scope.mapObjects.map.exists) {
                $scope.mapObjects.siteLinks.draw();
              }

              // sitelinks
              var mapped = $scope.data.siteLinks.map(function (link) {
                var pointA = $scope.data.sites.filter(function (site) {
                  return site.id.toString() === link.sites[0].toString();
                });
                var pointB = $scope.data.sites.filter(function (site) {
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
          }
        }, function (error) {
          $scope.sites = [];
        });

      };

      var drawSites = function (sites) {
        $scope.mapObjects.sites.models = sites.map(function (site) {
          return {
            id: site.id,
            position: "[" + site.latitude + "," + site.longitude + "]",
            title: site.name,
            icon: $scope.mapObjects.sites.getIcon('#ffffff', 3, 0.5, 10)
          };
        });
      };

      // check if something is needed below
      $scope.topologyData = {
        nodes: [],
        edges: []
      };
      $scope.sigma = null;


      $scope.highlightFilteredHeader = $mwtnTopology.highlightFilteredHeader;


      // helper functions
      var initTables = function () {
        $scope.gridOptionsNodes = JSON.parse(JSON.stringify($mwtnTopology.gridOptions));
        $scope.gridOptionsNodes.columnDefs = [];
        $scope.gridOptionsNodes.data = [];

        $scope.gridOptionsLinks = JSON.parse(JSON.stringify($mwtnTopology.gridOptions));
        $scope.gridOptionsLinks.columnDefs = [];
        $scope.gridOptionsLinks.data = [];
      };

      var sortById = function (array) {
        // TODO impl
        return array;
      };

      var getColumnDefs = function (array) {
        if (!array || array.length === 0) {
          return [];
        }
        return Object.keys(array[0]).map(function (key) {
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
            width: '140',
            sort: sort
          };
        });
      };

      var contains = function (array, objectId) {
        var result = false;
        array.map(function (item) {
          if (item.id === objectId) {
            result = true;
          }
        });
        return result;
      };

      var getRemoteNes = function (nodeId) {
        if (!$scope.mwpsLinks) {
          return;
        }
        var result = $scope.mwpsLinks.map(function (link) {
          if (link.source.slice(4, 6) - nodeId === 0) {
            return link.target.slice(4, 6);
          } else if (link.target.slice(4, 6) - nodeId === 0) {
            return link.source.slice(4, 6);
          }
        });
        // remove doublicates
        result = result.filter(function (item, pos) {
          return result.indexOf(item) == pos;
        });
        return result.clean(null);
      };


      var geoCalculation = {
        distance: function (lat1, lon1, lat2, lon2) {
          var R = 6371; // km
          var φ1 = lat1.toRadians();
          var φ2 = lat2.toRadians();
          var Δφ = (lat2 - lat1).toRadians();
          var Δλ = (lon2 - lon1).toRadians();

          var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return (R * c);
        },
        azimuth: function (lat1, lon1, lat2, lon2) {
          var φ1 = lat1.toRadians();
          var φ2 = lat2.toRadians();
          var Δλ = (lon2 - lon1).toRadians();

          // see http://mathforum.org/library/drmath/view/55417.html
          var y = Math.sin(Δλ) * Math.cos(φ2);
          var x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
          var θ = Math.atan2(y, x);

          return ((θ.toDegrees() + 360) % 360);
        }
      };


      var getNetworkElement = function (nodeId) {
        var ne;
        $scope.neNodes.map(function (node) {
          if (node.id - nodeId === 0) {
            ne = node;
          }
        });
        return ne;
      }
      var getSite = function (siteId) {
        var result;
        $scope.sites.map(function (site) {
          if (siteId - site.id === 0) {
            result = site;
          }
        });
        return result;
      };

      var getNodePos = function (node) {
        var x = 0;
        var y = 0;

        if (!node) {
          return {
            x: 1000 * x,
            y: -1000 * y
          };
        }

        // short cut: in the PoC there is always only one remote NE0

        if (!node.remotes || node.remotes.length === 0) {
          var localSite = getSite(node.siteRef);
          return {
            x: 1000 * localSite.longitude,
            y: -1000 * localSite.latitude
          };
        };

        var remoteId = node.remotes[0];
        var remoteNode = getNetworkElement(remoteId);

        var localSite = getSite(node.siteRef);
        var remoteSite = getSite(remoteNode.siteRef);

        var RADIUS = 0.00009;

        var azimuth = geoCalculation.azimuth(localSite.latitude, localSite.longitude, remoteSite.latitude, remoteSite.longitude);
        x = localSite.longitude + Math.sin(azimuth.toRadians()) * RADIUS;
        y = localSite.latitude + Math.cos(azimuth.toRadians()) * RADIUS;

        // console.log(node.siteRef, remoteNode.siteRef, azimuth, JSON.stringify({x: x, y: -y}));
        return {
          x: 1000 * x,
          y: -1000 * y
        };
      };


      var updateMwps = function () {
        console.log('updateMwps');

        $scope.sigma.graph.clear();
        $scope.sites.map(function (site) {
          var node = JSON.parse(JSON.stringify(site));
          node.id = 'site' + node.id;
          node.label = node.name;
          node.x = 1000 * node.longitude;
          node.y = -1000 * node.latitude; // Math.cos(node.latitude);
          node.size = 16;
          node.color = '#dddddd';
          if (!contains($scope.topologyData.nodes, node.id)) {
            $scope.sigma.graph.addNode(node);
          }
        });
        $scope.neNodes.map(function (ne) {
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
        $scope.gridOptionsNodes.data = $scope.mwpsNodes;

        // links
        $scope.gridOptionsLinks.columnDefs = getColumnDefs($scope.mwpsLinks);
        $scope.gridOptionsLinks.data = $scope.mwpsLinks;

      };

      var initMwps = function () {
        console.log('initMwps');

        // links
        var mwpsLinksObj = {};
        var siteLinksObj = {};
        $scope.mwpsLinks = [];
        $scope.siteLinks = [];

        $scope.mwpsNodes.map(function (mwps) {
          if (!mwpsLinksObj[mwps.radioSignalId]) {
            mwpsLinksObj[mwps.radioSignalId] = [];
          }
          mwpsLinksObj[mwps.radioSignalId].push(mwps.id);
          mwpsLinksObj[mwps.radioSignalId].sort();

          Object.keys(mwpsLinksObj).map(function (key) {
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
          siteLinksObj[mwps.radioSignalId] = a.filter(function (item, pos) {
            return a.indexOf(item) == pos;
          });
          siteLinksObj[mwps.radioSignalId].sort();
        });
        Object.keys(siteLinksObj).map(function (key) {
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

      var updateEthernet = function () {
        console.log('updateEthernet');

      };

      // events
      var SECTIONS = {
        MAP: 0,
        NODES: 1,
        LINKS: 2
      };
      var LAYERS = {
        SITE: 0,
        MWPS: 1,
        ETHERNET: 2
      };

      // check UI events
      $scope.$watch('activeTab', function (newValue, oldValue) {
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

      $scope.topologyCustfunc = function (sigmaIstance, getSlowDownNum, dragListener, resize) {
        $scope.sigma = sigmaIstance;

        if (!$scope.initDone) {
          initTables();
          $mwtnTopology.getNodes('site').then(function (success) {

            var hits = success.data.hits.hits;
            $scope.sites = hits.map(function (hit) {
              return hit._source
            });
            sortById($scope.sites);

            $mwtnTopology.getRequiredNetworkElements(true).then(function (success) {
              $scope.requiredNetworkElements = success;

              $scope.neNodes = success.map(function (hit) {
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
              success.map(function (hit) {
                hit._source.MW_AirInterface_Pac.map(function (mwps) {
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

            }, function (error) {
              $scope.getRequiredNetworkElements = [];
              $scope.neNodes = [];
              $scope.mwpsNodes = [];
              $scope.initDone = false;
            });

          }, function (error) {
            $scope.error = 'Cannot get data from server.';
            $scope.sites = [];
            $scope.gridOptionsNodes.data = [];
            $scope.initDone = false;
          });
        }
      };

    }
  ]);

 mwtnTopologyApp.filter('coordinateFilter', coordinateFilter);

  function coordinateFilter($sce) {

    return function (coordinate, conversion, type, places) {

      // The filter will be running as we type values into the input boxes, which returns undefined
      // and brings up an error in the console. Here wait until the coordinate is defined
      if (coordinate != undefined) {

        // Check for user input that is a positive or negative number with the option
        // that it is a float. Match only the numbers and not the white space or other characters
        var pattern = /[-+]?[0-9]*\.?[0-9]+/g
        var match = String(coordinate).match(pattern);

        if (conversion === "toDD" && match && coordinateIsValid(match, type)) {
          // If the match array only has one item, the user has provided decimal degrees
          // and we can just return what the user typed in
          if (match.length === 1) {
            return parseFloat(match);
          }

          // If the match array has a length of three then we know degrees, minutes, and seconds
          // were provided so we can convert it to decimal degrees
          if (match.length === 3) {
            return toDecimalDegrees(match);
          }
        }

        else if (conversion === 'toDMS' && match && coordinateIsValid(match, type)) {
          // When converting from decimal degrees to degrees, minutes and seconds, if
          // the match array has one item we know the user has input decimal degrees
          // so we can convert it to degrees, minutes and seconds
          if (match.length === 1) {
            return toDegreesMinutesSeconds(match, type);
          }

          // To properly format the converted coordinates we will need to add in HTML entities
          // which means we'll need to bind the returned string as HTML and thus we need
          // to use $sce (Strict Contextual Escaping) to say that we trust what is being bound as HTML
          if (match.length === 3) {
            return $sce.trustAsHtml(match[0] + '&deg; ' + match[1] + '&prime; ' + match[2] + '&Prime; ');
          }
        }

        // Output a notice that the coordinates are invalid if they are
        else if (!coordinateIsValid(match, type)) {
          return "Invalid Coordinate!";
        }

        function toDecimalDegrees(coord) {
          // Setup for all parts of the DMS coordinate and the necessary math to convert
          // from DMS to DD
          var degrees = parseInt(coord[0]);
          var minutes = parseInt(coord[1]) / 60;
          var seconds = parseInt(coord[2]) / 3600;

          // When the degrees value is negative, the math is a bit different
          // than when the value is positive. This checks whether the value is below zero
          // and does subtraction instead of addition if it is. 
          if (degrees < 0) {
            var calculated = degrees - minutes - seconds;
            return calculated.toFixed(places || 4);
          }
          else {
            var calculated = degrees + minutes + seconds
            return calculated.toFixed(places || 4);
          }
        }

        // This function converts from DD to DMS. Math.abs is used a lot because
        // for the minutes and seconds, negative values aren't valid 
        function toDegreesMinutesSeconds(decimal_degrees, type) {

          var dd = decimal_degrees[0];
          var direction = 'E';

          if (type === 'lat') {
            if (dd < 0) {
              direction = 'S';
            } else {
              direction = 'N'
            }
          } else {
            if (dd < 0) {
              direction = 'W';
            } else {
              direction = 'E'
            }
          }

          dd = Math.abs(dd);
          var degrees = Math.floor(dd);
          var frac = dd - degrees; // get fractional part
          var min = Math.floor(frac * 60);
          var sec = frac * 3600 - min * 60;

          var formated = [degrees, '° ', ("0" + min).slice(-2), '\' ', ("0" + sec.toFixed(4)).slice(-7), '\" ', direction];
          return formated.join('');

          //           var degrees = coordinate[0].split('.')[0];
          //           var minutes = Math.abs(Math.floor(60 * (Math.abs(coordinate[0]) - Math.abs(degrees))));
          //           var seconds = 3600 * (Math.abs(coordinate[0]) - Math.abs(degrees) - Math.abs(minutes) / 60).toFixed(2);

          //            return $sce.trustAsHtml(degrees + '° ' + minutes + '\' ' + seconds + '\" ');

        }

        // This function checks whether the coordinate value the user enters is valid or not. 
        // If the coordinate doesn't pass one of these rules, the function will return false
        // which will then alert the user that the coordinate is invalid.
        function coordinateIsValid(coordinate, type) {
          if (coordinate) {

            // The degree values of latitude coordinates have a range between -90 and 90
            if (coordinate[0] && type === 'lat') {
              if (!(-90 <= +(coordinate[0]) <= 90)) return false;
            }
            // The degree values longitude coordinates have a range between -180 and 180
            else if (coordinate[0] && type === 'lon') {
              if (!(-180 <= +(coordinate[0]) <= 180)) return false;
            }
            // Minutes and seconds can only be between 0 and 60
            if (coordinate[1]) {
              if (!(0 <= +(coordinate[1]) <= 60)) return false;
            }
            if (coordinate[2]) {
              if (!(0 <= +(coordinate[2]) <= 60)) return false;
            }
          }

          // If the coordinate made it through all the rules above, the function
          // returns true because the coordinate is good
          return true;
        }
      }
    }
  }  
});