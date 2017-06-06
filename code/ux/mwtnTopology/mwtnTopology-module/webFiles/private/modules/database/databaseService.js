app.factory('databaseService', function($location, $http, $base64) {
    'use strict';

    var service = {};

    service.resourceType = 'radio';

    var getRestURL = function(rt) {

        var s = '/db/networknordhorn/'+rt+'/_search';
        return s;
    };

    service.tables = {
        radio : {
            columns : [
                {
                    id : 0,
                    name : 'idRadio',
                    width : 40,
                    cls: 'text-right',
                    query : '00'
                }, {
                    id : 1,
                    name : 'type',
                    width : 100,
                    query : '01'
                }, {
                    id : 2,
                    name : 'family',
                    width : 60,
                    query : '02'
                }, {
                    id : 3,
                    name : 'manufacturer',
                    width : 100,
                    query : '03'
                }, {
                    id : 4,
                    name : 'model',
                    width : 'Auto',
                    query : '04'
                }, {
                    id : 5,
                    name : 'band',
                    width : 80,
                    cls: 'text-right',
                    query : '05'
                }, {
                    id : 6,
                    name : 'bandwidth',
                    width : 'Auto',
                    cls: 'text-right',
                    query : '06'
                }, {
                    id : 7,
                    name : 'xPic',
                    width : 80,
                    query : '07'
                }, {
                    id : 8,
                    name : 'transTech',
                    width : 100,
                    query : '08'
                }, {
                    id : 9,
                    name : 'config',
                    width : 40,
                    query : '09'
                }
            ],
            search : {}
        },
        'RadioConfigurations' : {
            columns : [
                {
                    id : 0,
                    name : 'message',
                    width : 'Auto',
                    query : '10'
                }
            ],
            search : {}
        },
        'RadioModes' : {
            columns : [
                {
                    id : 0,
                    name : 'message',
                    width : 'Auto',
                    query : '21'
                }
            ],
            search : {}
        },
        antenna : {
            columns : [
                {
                    id : 0,
                    name : 'idAntenna',
                    width : 40,
                    query : '30'
                }, {
                    id : 1,
                    name : 'model',
                    width : 200,
                    query : '31'
                }, {
                    id : 2,
                    name : 'band',
                    width : 80,
                    cls: 'text-right',
                    query : '32'
                }, {
                    id : 3,
                    name : 'fLow',
                    width : 100,
                    query : '33'
                }, {
                    id : 4,
                    name : 'fHigh',
                    width : 100,
                    query : '34'
                }, {
                    id : 5,
                    name : 'xpd',
                    width : 80,
                    query : '35'
                }, {
                    id : 6,
                    name : 'dia',
                    width : 80,
                    query : '36'
                }, {
                    id : 7,
                    name : 'type',
                    width : 80,
                    query : '37'
                }, {
                    id : 8,
                    name : 'xPol',
                    width : 40,
                    query : '38'
                }, {
                    id : 9,
                    name : 'gain',
                    width : 40,
                    query : '39'
                }
            ],
            search : {}
        },
        waveguide : {
            columns : [
                {
                    id : 0,
                    name : 'model',
                    width : 'Auto',
                    query : '40'
                }, {
                    id : 1,
                    name : 'band',
                    width : 80,
                    cls: 'text-right',
                    query : '41'
                }, {
                    id : 2,
                    name : 'minLength',
                    width : 100,
                    cls: 'text-right',
                    query : '42'
                }, {
                    id : 3,
                    name : 'maxLength',
                    width : 100,
                    cls: 'text-right',
                    query : '43'
                }, {
                    id : 4,
                    name : 'lossM',
                    width : 80,
                    cls: 'text-right',
                    query : '44'
                }, {
                    id : 5,
                    name : 'type',
                    width : 80,
                    query : '45'
                }, {
                    id : 6,
                    name : 'typeFine',
                    width : 80,
                    query : '46'
                }, {
                    id : 7,
                    name : 'procStat',
                    width : 80,
                    query : '47'
                }
            ],
            search : {}
        },
        Parameters : {
            columns : [
                {
                    id : 0,
                    name : 'message',
                    width : 'Auto',
                    query : '50'
                }
            ],
            search : {}
        },
        Rain : {
            columns : [
                {
                    id : 0,
                    name : 'message',
                    width : 'Auto',
                    query : '60'
                }
            ],
            search : {}
        }
    };

    var getRequest = function(rt) {
        return {
            method : 'POST',
            url : getRestURL(rt),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : {
                from:0,
                size:999, // get all
                query : {
                    match_all : {}
                }
            },
        };
    };
    
    service.getTableData = function(rt, callback) {

        var req = getRequest(rt);
        // console.log(JSON.stringify(req));
        $http(req).success(function(data, status) {
            // console.log(rt, data.hits.total);
            service.tables[rt].rows = data.hits.hits;
            callback(null, service.tables[rt]);
        }).error(function(data, status) {
            service.tables[data.output.resourceType].rows = [];
            callback("An error occured: " + status, null);
        });
    };

    Object.keys(service.tables).map(function(key){
        console.log(key);
        var table = service.tables[key];
        table.columns.map(function(column) {
            column.query = '';
            table.search[column.name] = column.query;
        });
    });

    return service;
});
