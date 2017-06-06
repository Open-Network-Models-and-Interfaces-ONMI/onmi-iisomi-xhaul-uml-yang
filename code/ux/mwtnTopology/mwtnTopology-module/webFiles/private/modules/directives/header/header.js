app.directive('htHeader', function() {
    'use strict';
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/header/header.html',
        scope : {
            headline : '@headline'
        },
        controller : function($scope, translateService, $header) {
            $scope.status = $header.status;
            $scope.changeLanguage = translateService.changeLanguage;
            $header.attributeValueChangeListener(function() {
                $scope.status = $header.status;
            });

        }
    };
});
app.factory('$header', function($rootScope) {
    
    var notificationId = 'statusChanged';
    var service = {};

    service.status = {};
    
    service.setStatus = function(status) {
        service.status = status;
        this.attributeValueChangeNotification(notificationId);
    };
    
    service.attributeValueChangeNotification = function(handle) {
        $rootScope.$broadcast(handle);
    };
    
    service.attributeValueChangeListener = function(callback) {
        $rootScope.$on(notificationId, callback);
    };

    return service;
});
