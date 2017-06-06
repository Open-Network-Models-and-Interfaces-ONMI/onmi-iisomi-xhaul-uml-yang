app.directive('newMwrLink', function(sitesService, alertService, translateService) {

    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/newMwrLink/newMwrLink.html',
        scope : {
            dbIndex : '@dbIndex',
            siteIdA : '=',
            siteIdB : '=',
            revisionType : '='
        },
        controller : function($rootScope, $scope, $http) {

            alertService.setMessage([
                'CREATING', 'CREATE_SUCCESS', 'CREATE_FAILED'
            ]);

            $scope.mpA = 'new';
            sitesService.getSiteById($scope.dbIndex, $scope.siteIdA, function(site){
                $scope.siteA = site;
                if ($scope.siteA._source.antennamountingpositions.length > 0) {
                    $scope.mpA = 'item0';
                }
                console.log($scope.mpA);
            });

            $scope.mpB = 'new';
            sitesService.getSiteById($scope.dbIndex, $scope.siteIdB, function(site){
                $scope.siteB = site;
                if ($scope.siteB._source.antennamountingpositions.length > 0) {
                    $scope.mpB = 'item0';
                }
                console.log($scope.mpB);
            });

            $scope.cancelMwrLink = function() {
                console.log($scope.mpA, $scope.mpB);
                $rootScope.cancelMwrLink({dbIndex: $scope.dbIndex, siteLinkId: {low: $scope.siteIdA, high: $scope.siteIdB}});
            };

            $scope.createMwrLink = function() {
                $scope.status = alertService.processing();
                var req = {
                    method : 'GET',
                    url : '/api/create/MWRLINKREVISIONVARIANT/' + $scope.siteIdA + '/' + $scope.siteIdB,
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                };
                // console.log(JSON.stringify(req));
                $http(req).success(function(data, status) {
                    //console.log(JSON.stringify(data));
                    $scope.status = alertService.success();
                    $rootScope.mwrLinkCreated({dbIndex: $scope.dbIndex, siteLinkId: {low: $scope.siteIdA, high: $scope.siteIdB}}, data); 
                }).error(function(data, status) {
                    console.log(data, status);
                    $scope.status = alertService.failed();
                });
            };
        }
    };
});