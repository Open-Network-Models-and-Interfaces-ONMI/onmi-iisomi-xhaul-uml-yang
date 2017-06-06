/**
 * angular.js for htProfil
 */
var htProfil = angular.module('htProfile', [
    'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);

htProfil.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('profil', {
            // abstract:
            // true,
            url : '/profile',
            templateUrl : 'modules/profile/profile.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$modal', 
                '$base64', 
                'profileService', 
                'siteMarkerService', 
                'authenticationService', 
                'alertService',
                'translateService',
                function($rootScope, $scope, $modal, $base64, profileService, siteMarkerService, authenticationService, alertService, translateService) {

                    var client = new ZeroClipboard(document.getElementById("copy-button"));
                    client.on("copy", function(event) {
                        var clipboard = event.clipboardData;
                        clipboard.setData("text/plain", JSON.stringify($scope.profile, null, ' '));
                    });
//                    $scope.items = [
//                        'item1', 'item2', 'item3'
//                    ];
                    $scope.openPaste = function() {
                        var modalInstance = $modal.open({
                            animation : true,
                            templateUrl : '/ux/modules/profile/profile.paste.html',
                            controller : 'ModalInstanceCtrl',
                            size : 'lg',
                            resolve : {
                                items : function() {
                                    return $scope.items;
                                }
                            }
                        });

                        modalInstance.result.then(function(text) {
                            try {
                                var json = JSON.parse(text);
                                if (json.common.version === '0.1.0') {
                                    $scope.profile = json;
                                } else {
                                    console.info("Not a valid profile ;( ");
                                }
                            } catch (e) {
                                console.info("Not a valid profile ;( ");
                                return false;
                            }

                        }, function() {
                            console.log('Modal dismissed at: ' + new Date());
                        });
                    };

                    $scope.profileId = authenticationService.getProfileName();
                    $scope.username = authenticationService.getUsername($scope.profileId);
                    $rootScope.title = '(' + $scope.username + ') htProfile';

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $scope.changeLanguage = translateService.changeLanguage;

                    $scope.status = alertService.processing();

                    $scope.shape = siteMarkerService.shape;
                    $scope.stroke = {
                        types : [
                            'solid', 'dotted', 'dashed', 'double'
                        ],
                    };

                    // color defaults to avoid warnings until profile is loaded
                    $scope.profile = {
                        site : {
                            normal : {
                                stroke : {
                                    color : '#00ccff'
                                },
                                fill : {
                                    color : '#00ccff'
                                }
                            },
                            selected : {
                                stroke : {
                                    color : '#dd0000'
                                },
                                fill : {
                                    color : '#dd0000'
                                }
                            },
                            'new' : {
                                stroke : {
                                    color : '#dd0000'
                                },
                                fill : {
                                    color : '#dd0000'
                                }
                            },
                            hover : {
                                stroke : {
                                    color : '#00ccff'
                                },
                                fill : {
                                    color : '#00ccff'
                                }
                            }
                        },
                        siteLink : {
                            normal : {
                                stroke : {
                                    color : '#00ccff'
                                }
                            },
                            selected : {
                                stroke : {
                                    color : '#00ccff'
                                }
                            },
                            'new' : {
                                stroke : {
                                    color : '#00ccff'
                                }
                            },
                            hover : {
                                stroke : {
                                    color : '#00ccff'
                                }
                            }
                        }
                    };

                    profileService.getProfileData($scope.profileId, function(err, data) {
                        if (err) {
                            $scope.status = alertService.failed(err);
                            console.log('htLog: Profile could not be loaded.' + err);
                            $scope.profile = {};
                        } else {
                            $scope.status = alertService.success();
                            $scope.profile = data;
                            updateSiteMarker();
                        }
                    });

                    $scope.restoreDefaults = function() {
                        profileService.profile = profileService.defaultProfile;
                        $scope.profile = profileService.defaultProfile;
                        // dont save immediately
                        // $scope.status = alertService.processing();
                        // profileService.restoreDefaults($scope.profileId,
                        // function(err, data){
                        // if (err) {
                        // $scope.status = alertService.failed(err);
                        // console.log('htLog: Profile could not be set to
                        // default.' + err);
                        // } else {
                        // $scope.status = alertService.success();
                        // $scope.profile = data;
                        // }
                        // });
                    };
                    $scope.apply = function() {
                        console.log('apply');
                        $scope.status = alertService.processing();
                        profileService.apply($scope.profileId, $scope.profile, function(err, data) {
                            if (err) {
                                $scope.status = alertService.failed(err);
                                console.log('htLog: Profile could not be set.' + err);
                            } else {
                                $scope.status = alertService.success();
                                $scope.profile = data;
                            }
                        });
                    };

                    /***********************************************************
                     * Angular Google Map
                     */
                    var mapCenter = {
                        latitude : 52.25566931416853,
                        longitude : 12.98757791519165
                    };
                    var mapOptions = {
                        mapTypeId : 'hybrid',
                        backgroundColor : '#dd0000',
                        draggable : false,
                        disableDoubleClickZoom : false,
                        mapTypeControl : false,
                        panControl : false,
                        rotateControl : false,
                        streetViewControl : false,
                        overviewMapControl : false,
                        zoomControl : false,
                        scaleControl : false,
                        scrollwheel : false
                    };
                    $scope.map = {
                        center : mapCenter,
                        options : mapOptions,
                        zoom : 18,
                    };
                    var siteMarkersEvents = {
                        click : function(marker, eventName, model, args) {
                            // TODO switch to selected
                        },
                        mouseover : function(marker, eventName, model, args) {
                            var options = {
                                type:model.type,
                                status:'hover'
                            };
                            siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
                                model.icon = siteMarker.icon;
                                $scope.$apply();
                            });
                        },
                        mouseout : function(marker, eventName, model, args) {
                            var options = {
                                type:model.type,
                                status:'normal'
                            };
                            siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
                                model.icon = siteMarker.icon;
                                $scope.$apply();
                            });
                        }
                    };
                    var location = {
                        lat : $scope.map.center.latitude,
                        lon : $scope.map.center.longitude
                    };
                    var site = {
                        _index : 'configuration',
                        id:{siteId : 0},
                        siteName : 'Example',
                        geoLocation : {
                            location : location
                        },
                        siteLinks : [
                            'ExampleSiteLink'
                        ]
                    };
                    $scope.mapObjects = {
                        sites : {
                            events : siteMarkersEvents,
                            models : [],
                            rebuild : false
                        }
                    };
                    var updateSiteMarker = function() {
                        var options = {
                            type:'site',
                            status:'normal'
                        };
                        siteMarkerService.createSiteMarker(0, site, options, function(siteMarker) {
                            if ($scope.mapObjects.sites.models.length === 0) {
                                $scope.mapObjects.sites.models.push(siteMarker);
                            }
                            $scope.mapObjects.sites.models[0].icon = siteMarker.icon;
                        });
                    };

                    $scope.$watch('profile', function(newValue, oldValue) {
                        updateSiteMarker();
                    }, true);

                }
            ]
        });
    }
]);

htProfil.controller('ModalInstanceCtrl', function($scope, $modalInstance) {

    $scope.text = 'Paste your profile json string here.';

    $scope.ok = function() {
        $modalInstance.close($scope.text);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});