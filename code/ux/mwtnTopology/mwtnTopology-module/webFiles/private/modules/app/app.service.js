app.factory('$app', function($http) {
    'use strict';

    var getNewRequest = function(method, url, data) {
        return {
            method : method,
            url : url,
            headers : {
                'Content-Type' : 'application/json'
            }
        };
    };

    var service = {};

    service.dbIndex = '';
    
    service.getDbIndex = function (callback) {
        var url = '/api/serverInfo';
        var req = getNewRequest('GET', url);
        $http(req).success(function(data, status) {
            service.dbIndex = data.networkIndex;
            console.log(JSON.stringify(data));
            return callback(service.dbIndex);
        }).error(function (data, status){
            console.log('htLog: ', data, status);
            return callback(service.dbIndex);
        });
    };
    
    return service;

});