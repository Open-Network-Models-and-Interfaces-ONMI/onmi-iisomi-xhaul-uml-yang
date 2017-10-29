app.filter('nominus', function () {
    return function (value) {
        return (!value ? '' : value.replace(/-/g, ''));
    };
});

app.directive('siteLinkDetails', function() {
    'use strict';
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/siteLinkDetails/siteLinkDetails.html',
        scope : {
            siteLinkIndex : '=',
            siteLinkIdLow : '=',
            siteLinkIdHigh : '='
        },
        controller : function($rootScope, $scope, $http, sitesService) {
            $scope.status = {
                message : 'Searching...',
                type : 'warning',
                isWorking : true
            };
            
            $scope.showNewMwrLinkButton = false;
            if ($rootScope.newLink !== undefined) {
                $scope.showNewMwrLinkButton = true;
            }
            
            $scope.getSiteLinkId = function(){return{
                low:$scope.siteLinkIdLow,
                high:$scope.siteLinkIdHigh
            };};
            
            $scope.removeSiteLink = function() {
                $rootScope.removeSiteLink($scope.siteLinkIndex, $scope.getSiteLinkId() );
            };
            
            $scope.createMwrLink = function() {
                $rootScope.createMwrLink($scope.siteLinkIndex, $scope.getSiteLinkId() );
            };
            
            var updateSiteLink = function() {
                sitesService.getSiteLink($scope.siteLinkIndex, $scope.getSiteLinkId(), function(siteLink) {
                    // console.log(JSON.stringify(siteLink));
                    $scope.siteLink = siteLink;
                    $scope.status.message = undefined;
                    $scope.status.type = 'success';
                    $scope.status.isWorking = false;
                    sitesService.getSitesOfLink($scope.siteLink, function(sites) {
                        $scope.sites = sites;
                    });
                });
            };
            updateSiteLink();
        }
    };
});