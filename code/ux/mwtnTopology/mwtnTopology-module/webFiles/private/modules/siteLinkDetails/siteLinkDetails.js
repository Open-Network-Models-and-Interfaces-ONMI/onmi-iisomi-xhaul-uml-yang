/**
 * angular.js for htSiteLinkDetails
 */
var htSiteLinkDetails = angular.module('htSiteLinkDetails', [
    'ui.bootstrap', 'ui.router', 'uiGmapgoogle-maps', 'alert', 'translate'
]);

htSiteLinkDetails.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';

        $stateProvider.state('siteLinks', {
            // abstract: true,
            url : '/siteLinks/:index/:low/:high',
            templateUrl : 'modules/siteLinkDetails/siteLinkDetails.html',
            controller : [
                '$rootScope',
                '$scope',
                '$http',
                '$stateParams',
                'uiGmapGoogleMapApi',
                'uiGmapIsReady',
                'sitesService',
                'authenticationService',
                'alertService',
                'translateService',
                function($rootScope, $scope, $http, $stateParams, uiGmapGoogleMapApi, IsReady, sitesService, authenticationService, alertService,
                                translateService) {

                    var isSitesExists = false;
                    var isMapExists = false;
                    var checkInitStatus = function() {
                        if (isSitesExists && isMapExists) {
                            initialize();
                        }
                    };
                    
                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $scope.changeLanguage = translateService.changeLanguage;

                    $scope.siteLinkIndex = $stateParams.index;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    $scope.siteLinkId = $stateParams.low + '-' + $stateParams.high;
                    $rootScope.title = '(' + $scope.siteLinkId + ') htSiteLinks';

                    $scope.siteLink = {
                        data : {},
                        get : function(id, callback) {
                            $scope.processing();
                            sitesService.getSiteLink($scope.siteLinkIndex, id, function(siteLink) {
                                $scope.success();
                                $scope.siteLink.data = siteLink;
                                sitesService.getSitesOfLink($scope.siteLink.data, function(sites) {
                                    $scope.sites = sites;
                                    
                                    isSitesExists = true;
                                    checkInitStatus();

                                    $scope.siteLink.bounds(function(bounds) {
                                        $scope.map.bounds = bounds;
                                    });
                                    return callback(null, $scope.siteLink.data);
                                });
                            });

                        },
                        bounds : function(callback) {
                            var north = 0;
                            var south = 0;
                            var east = 0;
                            var west = 0;

                            // console.log('### ' +
                            // JSON.stringify($scope.siteLink));
                            if ($scope.sites[0]._source.geoLocation.location.lat < $scope.sites[1]._source.geoLocation.location.lat) {
                                south = $scope.sites[0]._source.geoLocation.location.lat;
                                north = $scope.sites[1]._source.geoLocation.location.lat;
                            } else {
                                south = $scope.sites[1]._source.geoLocation.location.lat;
                                north = $scope.sites[0]._source.geoLocation.location.lat;
                            }
                            if ($scope.sites[0]._source.geoLocation.location.lon < $scope.sites[1]._source.geoLocation.location.lon) {
                                west = $scope.sites[0]._source.geoLocation.location.lon;
                                east = $scope.sites[1]._source.geoLocation.location.lon;
                            } else {
                                west = $scope.sites[1]._source.geoLocation.location.lon;
                                east = $scope.sites[0]._source.geoLocation.location.lon;
                            }
                            return callback({
                                northeast : {
                                    latitude : north,
                                    longitude : east
                                },
                                southwest : {
                                    latitude : south,
                                    longitude : west
                                }
                            });
                        }
                    };

                    angular.extend($scope, {
                        map : {
                            center : {
                                latitude : 0,
                                longitude : 0
                            },
                            zoom : 8,
                            control : {}
                        },
                        options : {
                            zoomControl : true,
                            zoomControlOptions : {
                                position : google.maps.ControlPosition.LEFT_TOP
                            },
                            scaleControl : false,
                            mapTypeId : 'terrain',
                            mapTypeControl : true,
                            mapTypeControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP,
                                mapTypeIds : [
                                    'hybrid', 'roadmap', 'terrain', 'satellite'
                                ]
                            },
                            panControl : false,
                            panControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP
                            },
                            rotateControl : false,
                            rotateControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP
                            },
                            streetViewControl : false,
                            streetViewControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP
                            },
                            overviewMapControl : false,
                            overviewMapControlOptions : {
                                opened : true
                            },
                            scrollwheel : false
                        },
                        processing : function() {
                            $scope.status = {
                                isWorking : true,
                                type : 'warning',
                                message : 'Loading...'
                            };
                        },
                        clear : function() {
                            $scope.status = {};
                        },
                        success : function() {
                            $scope.status = {
                                isWorking : false,
                                type : 'success',
                                message : 'Loading completed successfully.'
                            };
                        },
                        failed : function(e) {
                            $scope.status = {
                                isWorking : false,
                                type : 'danger',
                                message : 'Error while loading data.'
                            };
                        }
                    });

                    var init = function(maps, callback) {
                        $scope.icon = {
                            path : google.maps.SymbolPath.CIRCLE,
                            scale : 10,
                            strokeWeight : 3,
                            strokeColor : '#0CF',
                            fillColor : '#0CF',
                            fillOpacity : 0.5,
                            anchor : new google.maps.Point(0, 0)
                        };

                        var id = {
                            low : $scope.siteLinkIdLow,
                            high : $scope.siteLinkIdHigh
                        };
                        $scope.siteLink.get(id, function(err, siteLink) {
                            var map1 = $scope.map.control.getGMap();
                            var color = '#0CF';

                            $scope.sites.map(function(site) {
                                var marker = new google.maps.Marker({
                                    position : new google.maps.LatLng(site._source.geoLocation.location.lat, site._source.geoLocation.location.lon),
                                    map : map1,
                                    icon : getIcon(color, 3, 0.5, 10),
                                    url : '/ux/#/sites/' + site._index + '/' + site._source.id.siteId,
                                    zIndex : 10
                                // site.isAggregator
                                // ? 10
                                // : 8
                                });
                                google.maps.event.addListener(marker, 'click', function() {
                                    window.open(marker.url, '_self');
                                });
                                google.maps.event.addListener(marker, 'mouseover', function() {
                                    var icon = getIcon(color, 5, 0.9, 10);
                                    this.setIcon(icon);
                                    tooltip.show(site._source.siteName);
                                });
                                google.maps.event.addListener(marker, 'mouseout', function() {
                                    var icon = getIcon(color, 3, 0.5, 10);
                                    this.setIcon(icon);
                                    tooltip.hide();
                                });
                            });
                            return callback(true);
                        });
                    };

                    uiGmapGoogleMapApi.then(function(maps) {
                        init(maps, function(status) {
                            // console.log('htLog: init=' +
                            // status);
                        });
                    });

                    var getIcon = function(color, weight, opacity, scale) {
                        var icon = $scope.icon;
                        icon.strokeColor = color;
                        icon.fillColor = color;
                        icon.strokeWeight = weight;
                        icon.fillOpacity = opacity;
                        icon.scale = scale;
                        return icon;
                    };

                    var createMarker = function(site) {

                        var color = '#bbbbbb';
                        var marker = new google.maps.Marker({
                            position : new google.maps.LatLng(site.location.lat, site.location.lng),
                            map : $scope.map.control.getGMap(),
                            icon : getIcon(color, 1, 0.5, 5),
                            url : '/ux/#/sites/' + $scope.siteLinkIndex + '/' + site.id,
                            zIndex : 8
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                            window.open(marker.url, '_self');
                        });
                        google.maps.event.addListener(marker, 'mouseover', function() {
                            var icon = getIcon(color, 3, 0.9, 5);
                            this.setIcon(icon);
                            tooltip.show(site.id);
                        });
                        google.maps.event.addListener(marker, 'mouseout', function() {
                            var icon = getIcon(color, 1, 0.5, 5);
                            this.setIcon(icon);
                            tooltip.hide();
                        });
                    };

                    var createLink =
                                    function(siteLink) {

                                        var color = '#bbbbbb';

                                        var coords =
                                                        [
                                                            new google.maps.LatLng(siteLink.locationA.lat, siteLink.locationA.lng),
                                                            new google.maps.LatLng(siteLink.locationB.lat, siteLink.locationB.lng)
                                                        ];
                                        var line = new google.maps.Polyline({
                                            path : coords,
                                            map : $scope.map.control.getGMap(),
                                            geodesic : true,
                                            strokeColor : color,
                                            strokeOpacity : 0.5,
                                            strokeWeight : 1,
                                            url : '/ux/#/siteLinks/' + $scope.siteLinkIndex + '/' + siteLink.id
                                        // title:
                                        // site.id
                                        });

                                        google.maps.event.addListener(line, 'click', function(evt) {
                                            window.open(line.url, 'self');
                                        });
                                        google.maps.event.addListener(line, 'mouseover', function() {
                                            line.setOptions({
                                                strokeWeight : 3
                                            });
                                            tooltip.show(siteLink.id);
                                        });
                                        google.maps.event.addListener(line, 'mouseout', function() {
                                            line.setOptions({
                                                strokeWeight : 1
                                            });
                                            tooltip.hide();
                                        });
                                    };

                    var initialize = function() {
                        var map1 = $scope.map.control.getGMap();
                        var color = '#00CCFF';
                        var coordA = $scope.sites[0]._source.geoLocation.location;
                        var coordB = $scope.sites[1]._source.geoLocation.location;
                        var coords = [
                            new google.maps.LatLng(coordA.lat, coordA.lon), new google.maps.LatLng(coordB.lat, coordB.lon)
                        ];
                        var line = new google.maps.Polyline({
                            path : coords,
                            map : map1,
                            geodesic : true,
                            strokeColor : color,
                            strokeOpacity : 1.0,
                            strokeWeight : 3,
                            zIndex : 6,
                        });
                        google.maps.event.addListener(line, 'mouseover', function() {
                            line.setOptions({
                                strokeWeight : 6
                            });
                            tooltip.show($scope.sites[0]._source.siteName + '-' + $scope.sites[1]._source.siteName);
                        });
                        google.maps.event.addListener(line, 'mouseout', function() {
                            line.setOptions({
                                strokeWeight : 3
                            });
                            tooltip.hide();
                        });
                        // doLayer($scope.map.bounds);
                    };

                    IsReady.promise().then(function(maps) {
                        isMapExists = true;
                        checkInitStatus();
                    });

                }
            ]
        });
    }
]);
