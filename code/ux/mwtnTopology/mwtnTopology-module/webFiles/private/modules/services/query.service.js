if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

angular.module('htQueryService', []).factory('$query', ['$rootScope', '$http', function($rootScope, $http) {
    'use strict';
    
    var queryObjectTypes = ['nominatim', 'site', 'sitelink', 'path'];
    var queryData = {};
    queryData.nominatim = null;
    queryData.site = function(value) {
        return {
            query : {
                filtered : {
                    query : {
                        match_all : {}
                    },
                    filter : {
                        or : [
                            {
                                term : {
                                    "site.id.siteId" : value.toLowerCase()
                                }
                            }, {
                                term : {
                                    "site.siteName" : value.toLowerCase()
                                }
                            }
                        ]
                    }
                }
            }
        };
    };
    
    queryData.sitelink = function(value) {
        return {
            query : {
                filtered : {
                    query : {
                        match_all : {}
                    },
                    filter : {
                        and : [
                               {
                                   term : {
                                       "sitelink.id.low" : value[0].toLowerCase()
                                   }
                               },
                               {
                                   term : {
                                       "sitelink.id.high" : value[1].toLowerCase()
                                   }
                               }
                        ]
                    }
                }
            }
        };
    };

    
    queryData.path = function(value) {
        return {
            query : {
                filtered : {
                    query : {
                        match_all : {}
                    },
                    filter : {
                        and : [
                               {
                                   term : {
                                       "id" : parseInt(value)
                                   }
                               }
                        ]
                    }
                }
            }
        };
    };

    var getDbQueryData = function(docType, value) {
        var index = queryObjectTypes.indexOf(docType);
        return queryData[queryObjectTypes[index]](value);
    };

    var query = {};
    
    var doQuery = function(query, callback) {
        
        var result = {};
        
        var index = queryObjectTypes.indexOf(query.request.objectType);
        if (index === -1) {
            result.status = 'Error';
            result.message = 'Query of ' + query.request.objectType + ' is not supported.';
            result.data = undefined;
            return callback(result);
        }
        
        if (index === 0) {
            askOpenStreetMap(query.request.value, function(err, data){
                result.status = 'OK';
                result.message = 'Answer of OSM received.';
                result.data = data;
                return callback(result);
            });
        }
        
        if (index > 0) {
            askDatabase(query, function(err, data){
                if (err) {
                    result.status = 'Error';
                    result.message = err;
                    result.data = data;
                    return callback(result);
                }
                result.status = 'OK';
                result.message = 'Answer of database received.';
                result.data = data;
                return callback(result);
            });
        }
    };
    
    var askDatabase = function(query, callback) {
        var req = {
            method : 'POST',
            url : '/db/' + query.request.dbIndex + '/' + query.request.objectType + '/_search',
            data : getDbQueryData(query.request.objectType, query.request.value)
        };
        $http(req).success(function(data, status) {
            return callback(null, data);
        }).error(function(data, status) {
            console.error('htLog: ', 'Error whlie requesting database.', data, status);
            return callback(status, null);
        });
    };
    
    var askOpenStreetMap = function(value, callback) {
        
        var url = 'https://nominatim.openstreetmap.org/search?q={0}&countrycodes=de,br&format=json&polygon_geojson=0&limit=1';
        var route = url.format(value);

        $http.get(route).success(function(data, status) {
            return callback(null, data);
        }).error(function(data, status) {
            console.error('htLog: ', 'Error whlie requesting OpenStreetMap.', data, status);
            return callback(status, null);
        });
    };

    /**
     * public functions
     */
    var service = {};

    service.name = "Query service";

    service.queryResultNotification = function(handle, object) {
        $rootScope.$broadcast(handle, object);
    };

    service.queryResultListener = function(callback) {
        $rootScope.$on('query', callback);
    };

    service.query = function(request, callback){
        query.request = request;
        doQuery(query, function(result){
            query.result = result;
            return callback(query);
        });
    };

    return service;
}]);
