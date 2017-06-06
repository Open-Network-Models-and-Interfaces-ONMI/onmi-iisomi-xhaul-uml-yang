htRevisionStatus.factory('$mwrLink', function($http) {
    'use strict';

    var getRestURL = function(dbIndex) {
        var docType = 'mwrlinkrevisionvariant';
        var url = '/db/' + dbIndex + '/' + docType + '/_search';
        return url;
    };

    var service = {};

    service.get = function(dbIndex, id, callback) {

        var data = {
            from : 0,
            size : 1,
            query : {
                filtered : {
                    query : {
                        match_all : {}
                    },
                    filter : {
                        and : [
                            {
//                                term : {
//                                    low : id.siteLinkId.low
//                                }
//                            }, {
//                                term : {
//                                    high : id.siteLinkId.high
//                                }
//                            }, {
                                term : {
                                    mwrLinkId : id.mwrLinkId
                                }
                            }, {
                                term : {
                                    revision : id.revision
                                }
                            }, {
                                term : {
                                    variant : id.variant
                                }
                            }
                        ]
                    }
                }
            }
        };
        var req = {
            method : 'POST',
            url : getRestURL(dbIndex),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        // console.log(JSON.stringify(req.data));
        $http(req).success(function(data, status) {
            // console.log(JSON.stringify(data));
            return callback(null, data.hits.hits[0]._source);
        }).error(function(data, status) {
            console.log('htLog: Request to DB failed! ', JSON.stringify(req));
                return callback(status, null);
        });
    };

    return service;
});
