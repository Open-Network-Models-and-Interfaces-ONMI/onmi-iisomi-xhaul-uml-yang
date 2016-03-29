/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTopology/mwtnTopology.module'],function(mwtnTopologyApp) {


  mwtnTopologyApp.register.factory('$mwtnTopology', function($http, ENV) {
    var service = {
      base: ENV.getBaseURL("MD_SAL") + "/restconf/"
    };

    var siteTopology = 'src/app/mwtnTopology/data/siteTopology.json';
    service.getTopology = function(topologyId, callback) {
        var url = ['src/app/mwtnTopology/data/', topologyId, 'Topology.json'].join('');
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

    return service;
  });

});
