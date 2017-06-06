htEngineer.factory('$engineer', function($http) {
    'use strict';

    var service = {};

    service.getResults = function(siteLinkId, callback) {
        var req = {
            method : 'POST',
            url : '/api/engineer/loslink',
            headers : {
                'Content-Type' : 'application/json'
            },
            data : {
                input : {
                    idLosLink : siteLinkId
                }
            },
        };
        // console.log(JSON.stringify(req));
        $http(req).success(function(results, status) {
            // console.log(JSON.stringify(results));
            return callback(null, results);
        }).error(function(data, status) {
            return callback(status, null);
        });
    };

    service.createMwrLinkRevision = function(dbIndex, mwrLinkRevision, callback) {
        var req = {
            method : 'POST',
            url : '/api/create/MWRLINKREVISIONVARIANT/' + mwrLinkRevision.id.siteLinkId.low + '/' + mwrLinkRevision.id.siteLinkId.high,
            headers : {
                'Content-Type' : 'application/json'
            },
            data : mwrLinkRevision
        };
        //console.log(1, JSON.stringify(req));
        $http(req).success(function(data, status) {
            // console.log(2, data);
            return callback(null, data);
        }).error(function(data, status) {
            console.log('htLog: RevisionState set failed!');
            return callback(status, null);
        });
    };

    return service;
});
