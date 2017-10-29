app.directive('siteDetails', function() {
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/siteDetails/siteDetails.html',
        scope : {
            siteIndex : '=',
            siteId : '='
        },
        controller : function($rootScope, $scope, sitesService) {
            $scope.status = {
                message : 'Searching...',
                type : 'warning',
                isWorking : true
            };

            $scope.removeSite = function() {
                $rootScope.removeSite($scope.siteIndex, $scope.siteId);
            };

            $scope.showNewLinkButton = false;
            // TODO !!! - single site web appb???
            if ($rootScope.newLink !== undefined) {
                $scope.showNewLinkButton = true;
                $scope.createNewLinkMode = $rootScope.newLink.mode($scope.siteId);
                $scope.toggleCreateNewLinkMode = function() {
                    $scope.createNewLinkMode = $rootScope.newLink.toggle($scope.site);
                };
            }

            $scope.$watch('siteId', function(v) {
                if (v !== undefined && v !== 0) { // on init siteId is 0
                    sitesService.getSiteById($scope.siteIndex, v, function(site) {
                        if (site) {
                            $scope.site = site._source;
                            $scope.site.isFiberPoP = function() {
                                if (site.planta14) {
                                    if ($scope.site.planta14.indexOf('Fib') !== -1) {
                                        return '2014';
                                    }
                                    if ($scope.site.ultima15.indexOf('Fib') !== -1) {
                                        return '2015';
                                    }
                                    if ($scope.site.externa17.indexOf('Fib') !== -1) {
                                        return '2017';
                                    }
                                }
                                return 'false';
                            };
                            var siteIds = [];
                            siteIds.push(site._source.id.siteId);
                            // console.log(site._index, siteIds);
                            sitesService.getSiteLinksBySiteIds(site._index, siteIds, function(siteLinks) {
                                // console.log(siteLinks.length);
                                $scope.detailedSiteLinks = siteLinks;
                            });
                            sitesService.getDetailedNetworkElements(site._index, site._source.id.siteId, function(detailedNetworkElements) {
                                $scope.detailedNetworkElements = detailedNetworkElements;
                            });
                            $scope.status.message = undefined;
                            $scope.status.type = 'success';
                            $scope.status.isWorking = false;
                        } else {
                            $scope.status.message = 'Site \'' + v + '\' not found!';
                            $scope.status.type = 'danger';
                            $scope.status.isWorking = false;
                        }
                    });
                }
            });
        }
    };
});
