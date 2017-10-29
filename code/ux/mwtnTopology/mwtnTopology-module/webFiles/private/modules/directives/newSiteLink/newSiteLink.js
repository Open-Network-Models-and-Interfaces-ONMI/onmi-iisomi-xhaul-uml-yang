app.directive('newSiteLink', function(alertService, translateService) {

    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/newSiteLink/newSiteLink.html',
        scope : {
            siteIdA : '=',
            siteIdB : '='
        },
        controller : function($rootScope, $scope, $http) {

            alertService.setMessage([
                'CREATING', 'CREATE_SUCCESS', 'CREATE_FAILED'
            ]);

            $scope.sites = [];

            $scope.cancelLosLink = function() {
                $rootScope.cancelSiteLink();
            };

            $scope.createLosLink = function() {
                $scope.status = alertService.processing();
                var req = {
                    method : 'GET',
                    url : '/api/create/loslink/' + $scope.sites[0] + '/' + $scope.sites[1],
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                };
                // console.log(JSON.stringify(req));
                $http(req).success(function(data, status) {
                    // console.log(JSON.stringify(data));
                    $scope.status = alertService.success();
                    $rootScope.createNewSitelinkInDB(data.loslink, function(){
                        // do nothing
                    });
                }).error(function(data, status) {
                    console.log(data, status);
                    $scope.status = alertService.failed();
                });
            };

            var init = function() {
                $scope.sites = [$scope.siteIdA, $scope.siteIdB];
            };
            init();

            $scope.$watch('siteIdA', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    init();
                }
            });

            $scope.$watch('siteIdB', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    init();
                }
            });
        }
    };
});