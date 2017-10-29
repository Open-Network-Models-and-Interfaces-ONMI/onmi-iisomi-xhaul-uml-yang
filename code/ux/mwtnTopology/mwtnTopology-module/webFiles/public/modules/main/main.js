var app = angular.module('htSolutions', [
    'ngRoute', 'ngCookies', 'htLogin'
]);

app.config([
    '$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl : '/modules/login/login.html',
            controller : 'htLoginCtrl'
        }).otherwise({
            redirectTo : '/login'
        });
    }
]);
