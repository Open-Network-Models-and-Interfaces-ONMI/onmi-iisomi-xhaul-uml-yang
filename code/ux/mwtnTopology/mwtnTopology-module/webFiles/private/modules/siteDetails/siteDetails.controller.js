/**
 * angular.js for htSiteDetails
 */
var htSiteDetails = angular.module('htSiteDetails', [
    'ui.bootstrap', 'uiGmapgoogle-maps', 'ngCookies', 'htLogin', 'alert', 'translate'
]);

htSiteDetails.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('htSites', {
            // abstract:
            // true,
            url : '/sites/:index/:id',
            templateUrl : 'modules/siteDetails/siteDetails.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                'uiGmapGoogleMapApi',
                'uiGmapIsReady',
                '$siteDetails',
                'authenticationService', 
                'alertService',
                'translateService',
                function($rootScope, $scope, $stateParams, uiGmapGoogleMapApi, IsReady, $siteDetails, authenticationService, alertService, translateService) {

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $scope.changeLanguage = translateService.changeLanguage;

                    $scope.siteIndex = $stateParams.index;
                    $scope.siteId = $stateParams.id;
                    $rootScope.title = '(' + $scope.siteId + ') htSites';

                    $scope.site = {
                        model : {},
                        get : function(dbIndex, id, callback) {
                            $scope.processing();
                            $siteDetails.getSite(dbIndex, id, function(site) {
                                $scope.success();
                                $scope.site.model = site._source;
                                return callback($scope.site.model);
                            });
                        },
                        center : function(callback) {
                            return callback({
                                latitude : $scope.site.model.geoLocation.location.lat,
                                longitude : $scope.site.model.geoLocation.location.lon
                            });
                        }
                    };

                    angular.extend($scope, {
                        map : {
                            center : {
                                latitude : 0,
                                longitude : 0
                            },
                            bounds : {
                                northeast : {
                                    latitude : 0,
                                    longitude : 0
                                },
                                southwest : {
                                    latitude : 0,
                                    longitude : 0
                                }
                            },
                            zoom : 14,
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
                                message : 'Loading completed successfully.',
                            };
                        },
                        failed : function(e) {
                            $scope.status = {
                                isWorking : false,
                                type : 'danger',
                                message : 'Error while loading model.',
                            };
                        }
                    });

                    var getIcon = function(color, weight, opacity, scale) {
                        return {
                            path : google.maps.SymbolPath.CIRCLE,
                            scale : scale,
                            strokeWeight : weight,
                            strokeColor : color,
                            fillColor : color,
                            fillOpacity : opacity,
                            anchor : new google.maps.Point(0, 0)
                        };
                    };

                    var createMarker = function(site) {
                        var color = '#888';
                        var marker = new google.maps.Marker({
                            position : new google.maps.LatLng(site.geoLocation.location.lat, site.geoLocation.location.lon),
                            map : $scope.map.control.getGMap(),
                            icon : getIcon(color, 1, 0.5, 8),
                            url : '/ux/#/sites/' + $scope.siteIndex + '/' + site.siteId,
                            zIndex : 20
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                            window.open(marker.url, '_self');
                        });
                        google.maps.event.addListener(marker, 'mouseover', function() {
                            var icon = getIcon(color, 3, 0.9, 8);
                            this.setIcon(icon);
                            tooltip.show(site.siteName);
                        });
                        google.maps.event.addListener(marker, 'mouseout', function() {
                            var icon = getIcon(color, 1, 0.5, 8);
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
                                            url : '/ux/#/siteLinks/' + $scope.siteIndex + '/' + siteLink.id,
                                        // title:
                                        // site.id
                                        });

                                        google.maps.event.addListener(line, 'click', function(evt) {
                                            window.open(line.url, '_self');
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
                        $scope.site.get($scope.siteIndex, $scope.siteId, function(site) {
                            $scope.site.center(function(center) {
                                $scope.map.center = center;
                            });
                            $siteDetails.getSiteLinks($scope.siteIndex, site.id, function(detailedSiteLinks) {
                                var map1 = $scope.map.control.getGMap();
                                detailedSiteLinks.map(function(siteLink) {

                                    $siteDetails.getSitesOfLink(siteLink, function(sites) {
                                        if (sites[0]._source.siteName === site.siteName) {
                                            createMarker(sites[1]._source);
                                        } else {
                                            createMarker(sites[0]._source);
                                        }
                                        var coordA = sites[0]._source.geoLocation.location;
                                        var coordB = sites[1]._source.geoLocation.location;
                                        var coords = [
                                            new google.maps.LatLng(coordA.lat, coordA.lon), new google.maps.LatLng(coordB.lat, coordB.lon),
                                        ];
                                        var line = new google.maps.Polyline({
                                            path : coords,
                                            map : map1,
                                            geodesic : true,
                                            strokeColor : '#0CF',
                                            strokeOpacity : 1.0,
                                            strokeWeight : 3,
                                            url : '/ux/#/siteLinks/' + $scope.siteIndex + '/' + siteLink._source.id.low + '/' + siteLink._source.id.high,
                                            zIndex : 6,
                                        });
                                        google.maps.event.addListener(line, 'click', function() {
                                            window.open(line.url, '_self');
                                        });
                                        google.maps.event.addListener(line, 'mouseover', function() {
                                            line.setOptions({
                                                strokeWeight : 6
                                            });
                                            tooltip.show(sites[0]._source.siteName + '-' + sites[1]._source.siteName);
                                        });
                                        google.maps.event.addListener(line, 'mouseout', function() {
                                            line.setOptions({
                                                strokeWeight : 3
                                            });
                                            tooltip.hide();
                                        });
                                    });
                                });
                            });
                        });
                        return callback(true);
                    };

                    $scope.$watch('map.center', function(v) {
                        if (v !== undefined && v !== 0) {
                        }
                    });

                    uiGmapGoogleMapApi.then(function(maps) {
                        init(maps, function(status) {
                            // console.log('htLog:
                            // init='
                            // +
                            // status);
                        });
                    });

                    IsReady.promise().then(function(maps) {
                        var map1 = $scope.map.control.getGMap();

                        var site = $scope.site.model;
                        var marker = new google.maps.Marker({
                            position : new google.maps.LatLng(site.geoLocation.location.lat, site.geoLocation.location.lon),
                            map : map1,
                            icon : getIcon('#0CF', 3, 0.5, 10),
                            zIndex : 10
                        // site.isAggregator
                        // ? 10
                        // : 8
                        });
                        google.maps.event.addListener(marker, 'mouseover', function() {
                            var icon = $scope.icon;
                            icon.strokeColor = marker.icon.strokeColor;
                            icon.fillColor = marker.icon.strokeColor;
                            icon.scale = marker.icon.scale;
                            icon.strokeWeight = 5;
                            icon.fillOpacity = 0.9;
                            this.setIcon(icon);
                            tooltip.show(site.siteName);
                        });
                        google.maps.event.addListener(marker, 'mouseout', function() {
                            var icon = $scope.icon;
                            icon.strokeColor = marker.icon.strokeColor;
                            icon.fillColor = marker.icon.strokeColor;
                            icon.scale = marker.icon.scale;
                            icon.strokeWeight = 3;
                            icon.fillOpacity = 0.5;
                            this.setIcon(icon);
                            tooltip.hide();
                        });
                    });
                }
            ]
        });
    }
]);
