/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCompare/mwtnCompare.module'],function(mwtnCompareApp) {


  mwtnCompareApp.register.factory('$mwtnCompare', function($http, ENV) {
    var service = {
      base: ENV.getBaseURL("MD_SAL") + "/restconf/"
    };

    service.getReferenceValues = function(callback) {
        var url = 'src/app/mwtnCompare/data/reference-values.json';
	var request = {
            method: 'GET',
            url: url
        };
        $http(request).then(function successCallback(response) {
            callback(response.data);
        }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
        });
    };

    service.getNetworkElements = function(callback) {
        var url = 'src/app/mwtnCompare/data/networkElements.json';
	var request = {
            method: 'GET',
            url: url
        };
        $http(request).then(function successCallback(response) {
            callback(response.data);
        }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
        });
    };

    service.getDescriptions = function(callback) {
        var url = 'src/app/mwtnCompare/data/descriptions.json';
	var request = {
            method: 'GET',
            url: url
        };
        $http(request).then(function successCallback(response) {
            callback(response.data.descriptions.description);
        }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
        });
    };

    return service;
  });

});
