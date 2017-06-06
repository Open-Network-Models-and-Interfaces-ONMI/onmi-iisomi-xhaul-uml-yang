app.directive('newSite', function($rootScope, sitesService, alertService, translateService) {

    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/newSite/newSite.html',
        scope : {
            name : '=',
            lat : '=',
            lon : '='
        },
        controller : function($scope, $http) {

            alertService.setMessage([
                'CREATING', 'CREATE_SUCCESS', 'CREATE_FAILED'
            ]);

            $scope.newSite = {
                siteName: 'newSite',
                geoLocation : {
                    location : {
                        lat : 0,
                        lon : 0,
                    },
                    amslGrd : 100
                }
            };

            $scope.cancelSite = function() {
                $rootScope.cancelSite();
            };

            $scope.createSite = function() {
                $scope.status = alertService.processing();
                // console.log(JSON.stringify($scope.newSite));
                var req = {
                    method : 'GET',
                    url : '/api/create/site/' + 
                        $scope.newSite.geoLocation.location.lat + 
                        '/' + 
                        $scope.newSite.geoLocation.location.lon + 
                        '/' + 
                        $scope.newSite.geoLocation.amslGrd,
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                };
                $http(req).success(function(data, status) {
                    $scope.status = alertService.success();
                    $rootScope.createNewSiteOnMap(data, function(){
                        
                    });
                }).error(function(data, status) {
                    console.log('htLog: ', data, status);
                    $scope.status = alertService.failed();
                });
            };

            var initialize = function() {
                $scope.newSite.siteName = $scope.name;
                $scope.newSite.geoLocation.location.lat = $scope.lat;
                $scope.newSite.geoLocation.location.lon = $scope.lon;
                sitesService.getAltitude($scope.lat, $scope.lon, function(err, amsl) {
                    $scope.newSite.geoLocation.amslGrd = amsl;
                });
            };
            initialize();
        }
    };
});