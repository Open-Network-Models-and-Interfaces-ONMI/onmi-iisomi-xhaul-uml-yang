htSiteManager.factory('$pathManager', function($rootScope, $http) {
    'use strict';

    var getRestURL = function(dbIndex) {
        var docType = 'path';
        var url = '/db/' + dbIndex + '/' + docType + '/_search';
        return url;
    };
    
    var service = {};
    
    service.getPaths = function(dbIndex, from, size, callback) {
        
        var req = {
            method : 'POST',
            url : getRestURL(dbIndex),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : {
                from : from,
                size : size,
                query : {
                    match_all : {}
                }
            }
        };
        $http(req).success(function(data, status) {
            // console.log(data.hits.total, data.hits.hits.length);
            return callback(null, data.hits.total, data.hits.hits);
        }).error(function(data, status) {
            return callback(status, data);
        });
    };

    service.getPath = function(path) {
        if (!path) {
            return [];
        }
        
        var segments = path._source.pathSegments;
        var startSite = path._source.startNe.siteRef;
        
        var result = [];
        result.push(startSite);

        var index = 0;
        var start = startSite;
        // order matters! -> not asynch, start by 0
        while (index < segments.length) {
            var segment = segments[index].references.owningLOSLinkReference;
            if (segment) {
                if (start === segment.low) {
                    result.push(segment.high);
                    start = segment.high;
                } else {
                    result.push(segment.low);
                    start = segment.low;
                }
            } else {
                result.push('unknown');
                start = null;
            }
            index = index + 1;
        }
        
        return result;
    };

    return service;
});
