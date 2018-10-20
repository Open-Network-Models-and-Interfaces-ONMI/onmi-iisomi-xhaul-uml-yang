/*
 * Copyright (c) 2014 Inocybe Technologies, and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['common/login/login.module', 'common/authentification/auth.services'], function(login) {

  login.controller('LoginCtrl', function ($scope, $http, $window, Auth, $location) {
        // default values
        $scope.login = {};
        $scope.login.username = "";
        $scope.login.password = "";
        $scope.login.remember = false;
        $scope.rememberme = true;

        $scope.sendLogin = function () {
            Auth.login($scope.login.username, $scope.login.password, $scope.success, $scope.errorDisplay);
        };

        $scope.success = function(response) {
            $window.location.href = 'index.html';
        };
        $scope.errorDisplay = function (error) {
           $scope.error = "Unable to login";

        };
    });

    login.controller('forgotPasswordCtrl', function ($scope, $http) {
        $scope.recover = {};
        $scope.recover.email = "";
        $scope.sendForgotPassword = function () {
            $http.post('/recover', $scope.recover).success(function (data) {
                if (data.recover) {
                    console.log("email sent");
                }
                else {
                    console.log("email not sent");
                }
            });

        };
    });

   login.controller('registerCtrl', function ($scope, $http) {
        $scope.register = {};
        $scope.register.email = "";
        $scope.register.username = "";
        $scope.register.password = "";
        $scope.register.repeatPassword = "";
        $scope.register.userAgreement = false;

        $scope.sendRegister = function () {
            $http.post('/register', $scope.register).success(function (data) {
                if (data.register) {
                    console.log("registration is successful");
                }
                else {
                    console.log("registration failed");
                }
            });
        };
    });
});
