htRevisionStatus.factory('$revisionStatus', function($http) {
    'use strict';

    var getRestURL = function(index, docType) {
        var url = '/db/' + index + '/' + docType + '/_search';
        return url;
    };

    var revisionStates = {};
    var revisionTypes = {};

    var initRevisionStates = function(dbIndex, callback) {
        var data = {
            from : 0,
            size : 1,
            query : {
                match_all : {}
            }
        };
        var req = {
            method : 'POST',
            url : getRestURL(dbIndex, 'mwr_link_revision_states'),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        // console.log(JSON.stringify(data));
        $http(req).success(function(data, status) {
            // console.log(JSON.stringify(data));
            return callback(null, data.hits.hits);
        }).error(function(data, status) {
            console.log('htLog: mwr_link_revision_states not found!', data, status);
            return callback(status, null);
        });
    };

    var initRevisionTypes = function(dbIndex, callback) {
        var data = {
            from : 0,
            size : 99,
            query : {
                match_all : {}
            }
        };
        var req = {
            method : 'POST',
            url : getRestURL(dbIndex, 'mwr_link_revision_type'),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        $http(req).success(function(data, status) {
            return callback(null, data.hits.hits);
        }).error(function(data, status) {
            console.log('htLog: mwr_link_revision_type not found!');
            return callback(status, null);
        });
    };

    var service = {};

    service.getRevisionStates = function(dbIndex, callback) {
        if (revisionStates[dbIndex] === undefined) {
            initRevisionStates(dbIndex, function(err, revisionStates) {
                revisionStates[dbIndex] = revisionStates[0]._source.states;
                return callback(revisionStates[dbIndex]);
            });
        } else {
            return callback(revisionStates[dbIndex]);
        }
    };

    service.getRevisionTypes = function(dbIndex, callback) {
        if (revisionTypes[dbIndex] === undefined) {
            initRevisionTypes(dbIndex, function(err, revTypes) {
                revisionTypes[dbIndex] = [];
                revTypes.map(function(revType) {
                    revisionTypes[dbIndex].push(revType._source);
                });
                return callback(revisionTypes[dbIndex]);
            });
        } else {
            return callback(revisionTypes[dbIndex]);
        }
    };
    
    service.set = function(dbIndex, revisionStatus, callback) {
        var req = {
            method : 'POST',
            url : '/api/set/mwrlinkrevisionvariant',
            headers : {
                'Content-Type' : 'application/json'
            },
            data : revisionStatus
        };
        // console.log(JSON.stringify(req));
        $http(req).success(function(data, status) {
            //console.log(data);
            return callback(null, data);
        }).error(function(data, status) {
            console.log('htLog: RevisionState set failed!');
            return callback(status, null);
        });
    };

    return service;
});
