var app = angular.module('htLogin', [
    'ui.bootstrap', 'base64', 'alert', 'translate'
]);

app.controller('htLoginCtrl', function($scope, $window, $location, authenticationService, alertService, translateService) {
    'use strict';

    window.name = 'htSolutions';
    
    alertService.setMessage([
        'LOADING', 'SUCCESS', 'FAILED'
    ]);
    $scope.changeLanguage = translateService.changeLanguage;

    // default values
    $scope.login = {};
    $scope.login.username = "";
    $scope.login.password = "";
 //    $scope.login.remember = false;
    $scope.remember = false;
    $scope.isWorking = false;
    
    authenticationService.logout(function(){
        // just to ensure that old tokens are removed
        $scope.isWorking = false;
    });

    $scope.success = function(response) {
        if (authenticationService.isAuthenticated()) {
            $window.location.href = '/ux/#/';
        } else {
            alert('Must not happen! Code 124');
            $window.location.href = '/#/login';
        }
        $scope.isWorking = false;
    };
    $scope.error = function(error) {
        $scope.message = 'LOGIN_FAILURE';
        $scope.isWorking = false;
    };

    $scope.sendLogin = function() {
        $scope.isWorking = true;
        authenticationService.login($scope.login.email, $scope.login.password, $scope.success, $scope.error);
    };

});

app.factory('authenticationService', function($http, $base64, $cookies) {
    'use strict';

    var getNewLoginRequest = function(username, password) {
        return {
            method : 'POST',
            url : '/auth/login',
            headers : {
                'Content-Type' : 'application/json'
            },
            data : {
                username: username,
                password: password
//                ,
//                key: $base64.encode(username + ":" + password),
//                authfunction: '$base64.encode(username + ":" + cleartext)' 
            }
        };
    };

    var tockenName = 'ht_session_auth_token';
    var profileName = 'ht_profile';
    
    var service = {};
    
    service.getUsername = function(profileId){
    return $base64.decode(profileId);
    };

    service.init = function (token) {
        $http.defaults.headers.common['X-Access-Token'] = token || $cookies.token;
        // console.log($cookies.get(tockenName));
        // $http.defaults.headers.common['Authorization'] = token || $cookies.get('token');
    };
    
    service.isAuthenticated = function () {
        return $cookies.get(tockenName).indexOf('Bearer ') > -1;
    };
    
    service.getProfileName = function () {
        return $cookies.get(profileName);
    };
    
    
    service.login = function (username, password, callback, error) {

        var req = getNewLoginRequest(username, password);
        
        $http(req).success(function (data, status, headers, config) {

            $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
            $http.defaults.headers.common.Accept = 'application/json, text/javascript';
            $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
            $cookies.put(tockenName, 'Bearer ' + data.token, {path:'/'});
            $cookies.put(profileName, $base64.encode(username), {path:'/'});
            callback(data);
            })
            .error(function (response) {
                service.deleteToken();
                error(response);
            });
    };
    
    service.logout = function(callback) {
        service.deleteToken();
        callback();
    };

    service.deleteToken = function() {
        if ($http.defaults.headers.common.Authorization !== null) {
          delete $http.defaults.headers.common.Authorization;
        }
        $cookies.remove(tockenName);
        $cookies.remove(profileName);
    };

    return service;
});