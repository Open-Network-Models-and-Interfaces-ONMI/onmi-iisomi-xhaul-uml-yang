htSiteManager.factory('$siteManager', function($rootScope, $http) {
    'use strict';

    var getRestURL = function(dbIndex) {
        var docType = 'site';
        var url = '/db/' + dbIndex + '/' + docType + '/_search';
        return url;
    };

    var newSite;
    
    var service = {};
    
    service.objectChangeNotification = function(handle, object) {
        $rootScope.$broadcast(handle, object);
    };
    service.objectChangeListener = function(callback) {
        $rootScope.$on('newSite', callback);
    };
    
    service.setNewSite = function(newSite) {
        this.newSite = newSite;
        this.objectChangeNotification('newSite', this.newSite);
    };
    service.getNewSite = function() {
        return newSite;
    };
    
    service.getSites = function(dbIndex, from, size, callback) {
        
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
    service.createSite = function(dbIndex, site, callback) {
        
        var docType = 'site';
        // var url = '/db/' + dbIndex + '/' + docType + '/' + site.id.siteId + '/_create';
        var url = '/api/create/site';

        var req = {
            method : 'PUT',
            url : url,
            headers : {
                'Content-Type' : 'application/json'
            },
            data : site
        };
        $http(req).success(function(data, status) {
            return callback(null, data);
        }).error(function(data, status) {
            console.error('htLog: ', data, status);
            return callback(status, data);
        });
    };

    service.deleteSite = function(siteIndex, siteId, callback) {
        // console.log(siteIndex, siteId);
        var req = {
            method : 'GET',
            url : '/api/delete/site/' + siteId,
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        $http(req).success(function(data, status) {
            callback(null, data);
        }).error(function(data, status) {
            callback(data, null);
        });
    };

    return service;
});
