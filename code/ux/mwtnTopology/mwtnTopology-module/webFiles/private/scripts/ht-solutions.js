(function() {
    'use strict';

    function Enum() {
        for (var i = 0; i < arguments.length; ++i) {
            this[arguments[i]] = i;
        }
        return this;
    }

    var alert = angular.module('alert', []);

    alert.factory('alertService', function() {

        var alert = {};
        alert.id = new Enum('PROCESSING', 'SUCCESS', 'FAILED', 'WARNING');
        alert.isWorking = [
            true, false, false
        ];
        alert.type = [
            'warning', 'success', 'danger', 'warning'
        ];
        alert.message = [
            'CALCULATING', 'CALCULATION_OK', 'CALCULATION_FAILED', 'WARNING'
        ];

        var status = function(id) {
            return {
                isWorking : alert.isWorking[id],
                type : alert.type[id],
                message : alert.message[id]
            };
        };

        var service = {};

        service.setMessage = function(ids) {
            alert.message = ids;
        };

        service.processing = function() {
            return status(alert.id.PROCESSING);
        };

        service.success = function() {
            return status(alert.id.SUCCESS);
        };

        service.warning = function() {
          return status(alert.id.WARNING);
      };


        service.failed = function(err) {
            console.log(err);
            return status(alert.id.FAILED);
        };

        service.clear = function() {
            return {};
        };

        return service;
    });
})();
(function() {
    'use strict';
    var app = angular.module('translate', [
        'pascalprecht.translate'
    ]);

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix : '/modules/languages/lang-',
            suffix : '.json'
        });

        $translateProvider.fallbackLanguage('en_US');
        $translateProvider.preferredLanguage('en_US');
        $translateProvider.useSanitizeValueStrategy('escaped');
    }]);

    app.factory('translateService', ['$translate', function($translate) {

        var service = {};

        service.org = $translate;
        
        service.en_US = {
            sEmptyTable : "No data available in table",
            sInfo : "Showing _START_ to _END_ of _TOTAL_ entries",
            sInfoEmpty : "Showing 0 to 0 of 0 entries",
            sInfoFiltered : "(filtered from _MAX_ total entries)",
            sInfoPostFix : "",
            sInfoThousands : ",",
            sLengthMenu : "Show _MENU_ entries",
            sLoadingRecords : "Loading...",
            sProcessing : "Processing...",
            sSearch : "Search:",
            sZeroRecords : "No matching records found",
            oPaginate : {
                sFirst : "<span title='Show first entry' class='glyphicon glyphicon-fast-backward'></span>",
                sPrevious : "<span title='Show previous entries' class='glyphicon glyphicon-step-backward'></span>",
                sNext : "<span title='Show next entries' class='glyphicon glyphicon-step-forward'></span>",
                sLast : "<span title='Show last entry' class='glyphicon glyphicon-fast-forward'></span>"
            },
            oAria : {
                sSortAscending : ": activate to sort column ascending",
                sSortDescending : ": activate to sort column descending"
            }
        };

        service.de_DE = {
            sEmptyTable : "Keine Daten in der Tabelle vorhanden",
            sInfo : "_START_ bis _END_ von _TOTAL_ Einträgen",
            sInfoEmpty : "0 bis 0 von 0 Einträgen",
            sInfoFiltered : "(gefiltert von _MAX_ Einträgen)",
            sInfoPostFix : "",
            sInfoThousands : ".",
            sLengthMenu : "_MENU_ Einträge anzeigen",
            sLoadingRecords : "Wird geladen...",
            sProcessing : "Bitte warten...",
            sSearch : "Suchen",
            sZeroRecords : "Keine Einträge vorhanden.",
            oPaginate : {
                sFirst : "<span title='Show first entry' class='glyphicon glyphicon-fast-backward'></span>",
                sPrevious : "<span title='Show previous entries' class='glyphicon glyphicon-step-backward'></span>",
                sNext : "<span title='Show next entries' class='glyphicon glyphicon-step-forward'></span>",
                sLast : "<span title='Show last entry' class='glyphicon glyphicon-fast-forward'></span>"
            },
            oAria : {
                sSortAscending : ": aktivieren, um Spalte aufsteigend zu sortieren",
                sSortDescending : ": aktivieren, um Spalte absteigend zu sortieren"
            }
        };

        service.es_ES = {
            sProcessing : "Procesando...",
            sLengthMenu : "Mostrar _MENU_ registros",
            sZeroRecords : "No se encontraron resultados",
            sEmptyTable : "Ningan dato disponible en esta tabla",
            sInfo : "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty : "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered : "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix : "",
            sSearch : "Buscar:",
            sUrl : "",
            sInfoThousands : ",",
            sLoadingRecords : "Cargando...",
            oPaginate : {
                sFirst : "<span title='Show first entry' class='glyphicon glyphicon-fast-backward'></span>",
                sPrevious : "<span title='Show previous entries' class='glyphicon glyphicon-step-backward'></span>",
                sNFext : "<span title='Show next entries' class='glyphicon glyphicon-step-forward'></span>",
                sLast : "<span title='Show last entry' class='glyphicon glyphicon-fast-forward'></span>"
            },
            oAria : {
                sSortAscending : ": Activar para ordenar la columna de manera ascendente",
                sSortDescending : ": Activar para ordenar la columna de manera descendente"
            }
        };

        service.changeLanguage = function(key, dtOptions) {
            $translate.use(key);
            if (dtOptions !== undefined && dtOptions !== null) {
                dtOptions.withOption('language', service[key]);
            }
        };

        return service;
    }]);
})();
var app = angular.module('htLogin', [
  'ui.bootstrap', 'base64', 'alert', 'translate'
]);

app.controller('htLoginCtrl', ['$scope', '$window', '$location', 'authenticationService', 'alertService', 'translateService', function($scope, $window, $location, authenticationService, alertService, translateService) {
  'use strict';

  window.name = 'htSolutions';

  alertService.setMessage([
    'LOADING', 'SUCCESS', 'FAILED'
  ]);
  $scope.changeLanguage = translateService.changeLanguage;

  // default values
  $scope.login = {};
  $scope.login.username = "";
  $scope.login.password = "";
  // $scope.login.remember = false;
  $scope.remember = false;
  $scope.isWorking = false;

  authenticationService.logout(function() {
    // just to ensure that old tokens are removed
    $scope.isWorking = false;
  });

  $scope.success = function(response) {
    console.log('htLog:', response);
    if (authenticationService.isAuthenticated()) {
      $window.location.href = '/ux/#/';
    } else {
      console.info('Must not happen! Code 124');
      $window.location.href = '/#/login';
    }
    $scope.isWorking = false;
  };
  $scope.error = function(error) {
    console.log(error);
    $scope.message = 'LOGIN_FAILURE';
    $scope.isWorking = false;
  };

  $scope.sendLogin = function() {
    $scope.isWorking = true;
    authenticationService.login($scope.login.email, $scope.login.password, $scope.success, $scope.error);
  };

}]);

app.factory('authenticationService', ['$http', '$base64', '$cookies', function($http, $base64, $cookies) {
  'use strict';

  var getNewLoginRequest = function(username, password) {
    return {
      method : 'POST',
      url : '/auth/login',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {
        username : username,
        password : password
      // ,
      // key: $base64.encode(username + ":" + password),
      // authfunction: '$base64.encode(username + ":" + cleartext)'
      }
    };
  };

  var tockenName = 'ht_session_auth_token';
  var profileName = 'ht_profile';

  var service = {};

  service.getUsername = function(profileId) {
    return $base64.decode(profileId);
  };

  service.init = function(token) {
    $http.defaults.headers.common['X-Access-Token'] = token || $cookies.token;
    // console.log($cookies.get(tockenName));
    // $http.defaults.headers.common['Authorization'] = token ||
    // $cookies.get('token');
  };

  service.isAuthenticated = function() {
    return $cookies.get(tockenName).indexOf('Bearer ') > -1;
  };

  service.getProfileName = function() {
    return $cookies.get(profileName);
  };

  service.login = function(username, password, callback, error) {
    var req = getNewLoginRequest(username, password);
    console.log(JSON.stringify(req));
    $http(req).success(function(data, status, headers, config) {
      console.log(JSON.stringify(data), status, headers, config);
      $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
      $http.defaults.headers.common.Accept = 'application/json, text/javascript';
      $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
      $cookies.put(tockenName, 'Bearer ' + data.token, {
        path : '/'
      });
      $cookies.put(profileName, $base64.encode(username), {
        path : '/'
      });
      callback(data);
    }).error(function(response) {
      service.deleteToken();
      error(response);
    });
  };

  service.logout = function(callback) {
    service.deleteToken();
    callback();
  };

  service.deleteToken = function() {
    if ($http.defaults.headers.common.Authorization !== null) {
      delete $http.defaults.headers.common.Authorization;
    }
    $cookies.remove(tockenName);
    $cookies.remove(profileName);
  };

  return service;
}]);


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  };
}

angular.module('htQueryService', []).factory('$query', [
  '$rootScope', '$http', function($rootScope, $http) {
    'use strict';

    var queryObjectTypes = [
      'nominatim', 'database', 'site', 'sitelink', 'mwrlinkrevisionvariant', 'path'
    ];
    var queryData = {};
    queryData.nominatim = null;
    queryData.database = function(value) {
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
                }, {
                  term : {
                    "sitelink.name" : value
                  }
                }, {
                  and : [
                    {
                      term : {
                        "sitelink.id.high" : value.toLowerCase().split('-')[0]
                      }
                    }, {
                      term : {
                        "sitelink.id.low" : value.toLowerCase().split('-')[1] || ''
                      }
                    }
                  ]
                }, {
                  term : {
                    "mwrlinkrevisionvariant.id.mwrLinkId" : value
                  }
                }
              ]
            }
          }
        }
      };
    };

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
              or : [
                {
                  term : {
                    "sitelink.name" : value
                  }
                }, {
                  and : [
                    {
                      term : {
                        "sitelink.id.high" : value.split('-')[0].toLowerCase()
                      }
                    }, {
                      term : {
                        "sitelink.id.low" : value.split('-')[1].toLowerCase()
                      }
                    }
                  ]

                }
              ]
            }
          }
        }
      };
    };

    queryData.mwrlinkrevisionvariant = function(value) {
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
                    "mwrlinkrevisionvariant.id.mwrLinkId" : value
                  }
                }
              ]
            }
          }
        }
      };
    };

    queryData.path = function(values) {
      return {
        query : {
          filtered : {
            query : {
              match_all : {}
            },
            filter : {
              and : [
                {
                  terms : {
                	  id: values
                    // "id" : parseInt(value)
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
        askOpenStreetMap(query.request.values, function(err, data) {
          result.status = 'OK';
          result.message = 'Answer of OSM received.';
          result.data = data;
          return callback(result);
        });
      }

      if (index > 0) {
        askDatabase(query, function(err, data) {
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
        url : ['/db', query.request.dbIndex, query.request.objectType, '_search'].join('/'),
        data : getDbQueryData(query.request.objectType, query.request.value)
      };
      if (query.request.objectType === 'database') {
        req.url = ['/db', query.request.dbIndex, '_search'].join('/');
      }

      $http(req).success(function(data, status) {
    	  console.log('htLog:', data.hits.hits.length, status);
    	  //console.log('htLog:', JSON.stringify(data), status);
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
        console.log('htLog:', data, status);
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

    service.query = function(request, callback) {
      query.request = request;
      doQuery(query, function(result) {
        query.result = result;
        return callback(query);
      });
    };

    return service;
  }
]);

/**
 * angular.js for htBsConnections
 */
var htBsConnections =
    angular.module('htBsConnections', [
      'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.resizeColumns',
      'htLogin', 'htDatabase', 'alert', 'translate'
    ]);

htBsConnections
    .config([
      '$stateProvider',
      function($stateProvider) {
        'use strict';
        $stateProvider
            .state(
                'bsConnections',
                {
                  // abstract:
                  // true,
                  url : '/bsConnections/:dbIndex',
                  templateUrl : '/ux/modules/bsConnections/bsConnections.html',
                  controller : [
                    '$rootScope',
                    '$scope',
                    '$stateParams',
                    'uiGridConstants',
                    '$bsConnections',
                    '$header',
                    'alertService',
                    function($rootScope, $scope, $stateParams, uiGridConstants, $bsConnections, $header, alertService) {
                      $scope.dbIndex = $stateParams.dbIndex;
                      $rootScope.title = 'htBsConnections';

                      alertService.setMessage([
                                               'LOADING', 'SUCCESS', 'FAILED'
                                           ]);

                      var routeCellTemplate =
                          [
                           '<div class="ui-grid-cell-contents">',
                           '<span>{{row.entity[col.field]}} </span>',
                            '<a class="vCenter text-right" >',
                            '<span title="{{grid.appScope.getTitle( COL_FIELD , 2)}}" ng-click="grid.appScope.open(row.entity[col.field])" class="pointer glyphicon glyphicon-info-sign"></span>',
                            '<span> </span>',
                            '<span title="{{grid.appScope.getTitle( COL_FIELD , 1)}}" ng-click="grid.appScope.show(row.entity[col.field])" class="pointer glyphicon glyphicon-map-marker"></span>',
                            '</a>',
                            '</div>'].join('');
                      
                      var networkElementCellTemplate =
                          [
                           '<div class="ui-grid-cell-contents">',
                           '<span>{{COL_FIELD}} </span>',
                           '<a class="vCenter text-right" >',
                           '<span title="Show details of network element: {{COL_FIELD}}" ng-click="grid.appScope.showNetworkElement(row.entity[col.field])" class="pointer glyphicon glyphicon-info-sign"></span>',
                           '</a>',
                           '</div>'].join('');
                      
                      var siteCellTemplate = [
                                              '<div class="ui-grid-cell-contents">',
                                              '<span>{{COL_FIELD}} </span>',
                                              '<a class="vCenter text-right" >',
                                              '<span title="Show details of site: {{COL_FIELD}}" ng-click="grid.appScope.showSite(row.entity[col.field])" class="pointer glyphicon glyphicon-info-sign"></span>',
                                              '</a>',
                                              '</div>'].join('');


                      $scope.highlightFilteredHeader = function(row, rowRenderIndex, col) {
                        if (col.filters[0].term) {
                          return 'header-filtered';
                        } else {
                          return '';
                        }
                      };

                      var message = [
                        'Delete', 'Show in network map', 'Show details'
                      ];
                      $scope.getTitle = function(value, msgId) {
                          var info = message[msgId] + ': ' + value;
                          return info;
                      };

                      $scope.show = function(value) {
                        var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?path=' + value;
                        window.open(link, 'htNetworkMap');
                      };

                      $scope.open = function(value) {
                        var link = '/ux/#/paths/' + $scope.dbIndex + '/' + value;
                        window.open(link, 'htSolutions');
                      };

                      $scope.showNetworkElement = function(value) {
                    	  console.log('value', value);
                          var link = '/ux/#/networkElements/' + $scope.dbIndex + '/' + value;
                          window.open(link, 'htSolutions');
                        };

                        $scope.showSite = function(value) {
                      	  console.log('value', value);
                            var link = '/ux/#/sites/' + $scope.dbIndex + '/' + value;
                            window.open(link, 'htSolutions');
                          };

                      var defaultGridSort = {
                              direction: uiGridConstants.ASC,
                              priority: 1
                            };
                      var defaultDatabaseSort = {ROUID:{order:'asc'}};
                      var defaultDatabaseFilter = {
                      		bool: {
                   		      must : []
                      		}
                      };
                      
                      var paginationOptions = {
	                    		    pageNumber: 1,
	                    		    pageSize: 10,
	                    		    sort: [defaultDatabaseSort],
	                    		    filter: defaultDatabaseFilter
	                    		  };
                      
                      $scope.gridOptions = {};
                      $scope.gridOptions.data = [];
                      $scope.gridOptions.enableColumnResizing = true;
                      $scope.gridOptions.enableSorting = true;
                      $scope.gridOptions.enableFiltering = true;
                      $scope.gridOptions.enableGridMenu = true;
                      $scope.gridOptions.showGridFooter = true;
                      // $scope.gridOptions.showColumnFooter = true;
                      $scope.gridOptions.fastWatch = true;
                      $scope.gridOptions.enableRowSelection = true;
                      $scope.gridOptions.enableRowHeaderSelection = true;
                      $scope.gridOptions.multiSelect = false;

                      $scope.gridOptions.paginationPageSizes = [10, 100, 1000];
                      $scope.gridOptions.paginationPageSize = 10;
                      $scope.gridOptions.useExternalPagination = true;
                      $scope.gridOptions.useExternalSorting = true;
                      $scope.gridOptions.useExternalFiltering = true;
                      $scope.gridOptions.gridMenuCustomItems = [
                        {
                          title : 'Rotate Grid',
                          action : function($event) {
                            console.log($event);
                            this.grid.element.toggleClass('rotated');
                          },
                          order : 2100
                        }
                      ];

                      // check Excel reference for semi auto code generation
                      // add pinnedLeft : true, sort: defaultGridSort for id field
                      $scope.gridOptions.columnDefs = [
{ pinnedLeft : true, sort: defaultGridSort,
	 field: 'ROUID', displayName: 'ROUID', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : routeCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'PATHTOCNAME', displayName: 'PATHTOCNAME', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'SOURCE', displayName: 'SOURCE', type: 'string', width: '*', minWidth: 80, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'PLANER', displayName: 'PLANER', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO29B', displayName: 'TODO29B', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ASSESSMENT18Y', displayName: 'ASSESSMENT18Y', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'QUALITY18B', displayName: 'QUALITY18B', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ASSESSMENT56Y', displayName: 'ASSESSMENT56Y', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'QUALITY56Y', displayName: 'QUALITY56Y', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'EQUIPPING', displayName: 'EQUIPPING', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'SITESTART', displayName: 'SITESTART', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : siteCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'SITESTARTPR', displayName: 'SITESTARTPR', type: 'string', width: '*', minWidth: 160, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'SITESTARTEPlus', displayName: 'SITESTARTEPlus', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTART', displayName: 'NESTART', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : networkElementCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTTYPE', displayName: 'NESTARTTYPE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTSTATUS', displayName: 'NESTARTSTATUS', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTKAT', displayName: 'NESTARTKAT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTDUEDATE', displayName: 'NESTARTDUEDATE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTPRJNAME', displayName: 'NESTARTPRJNAME', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST29B', displayName: 'NESTARTST29B', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST18B', displayName: 'NESTARTST18B', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST56Y', displayName: 'NESTARTST56Y', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST56YCOMMENT', displayName: 'NESTARTST56YCOMMENT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST90', displayName: 'NESTARTST90', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST156Y', displayName: 'NESTARTST156Y', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST156YCOMMENT', displayName: 'NESTARTST156YCOMMENT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NESTARTST190', displayName: 'NESTARTST190', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'SITEEND', displayName: 'SITEEND', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : siteCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEEND', displayName: 'NEEND', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : networkElementCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDTYPE', displayName: 'NEENDTYPE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDDUEDATE', displayName: 'NEENDDUEDATE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDKAT', displayName: 'NEENDKAT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDST62W', displayName: 'NEENDST62W', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDST90', displayName: 'NEENDST90', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDFT', displayName: 'NEENDFT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDFTTYPE', displayName: 'NEENDFTTYPE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDFTDUEDATE', displayName: 'NEENDFTDUEDATE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDFTKAT', displayName: 'NEENDFTKAT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDFTST76', displayName: 'NEENDFTST76', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'NEENDFTST90', displayName: 'NEENDFTST90', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TYP', displayName: 'TYP', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'CAP', displayName: 'CAP', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'E1', displayName: 'E1', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LEN', displayName: 'LEN', type: 'string', width: '*', minWidth: 60, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'SITEPATH', displayName: 'SITEPATH', type: 'string', width: '*', minWidth: 300, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_01', displayName: 'USRLINK_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_01', displayName: 'LINKREV_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_01', displayName: 'LINKVAR_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_01', displayName: 'STATUS_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_01', displayName: 'ST82S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_01', displayName: 'ST85S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_01', displayName: 'ST90S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_01', displayName: 'ST95S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_01', displayName: 'TDCN_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_01', displayName: 'TODO_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_02', displayName: 'USRLINK_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_02', displayName: 'LINKREV_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_02', displayName: 'LINKVAR_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_02', displayName: 'STATUS_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_02', displayName: 'ST82S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_02', displayName: 'ST85S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_02', displayName: 'ST90S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_02', displayName: 'ST95S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_02', displayName: 'TDCN_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_02', displayName: 'TODO_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_03', displayName: 'USRLINK_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_03', displayName: 'LINKREV_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_03', displayName: 'LINKVAR_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_03', displayName: 'STATUS_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_03', displayName: 'ST82S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_03', displayName: 'ST85S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_03', displayName: 'ST90S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_03', displayName: 'ST95S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_03', displayName: 'TDCN_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_03', displayName: 'TODO_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_04', displayName: 'USRLINK_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_04', displayName: 'LINKREV_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_04', displayName: 'LINKVAR_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_04', displayName: 'STATUS_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_04', displayName: 'ST82S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_04', displayName: 'ST85S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_04', displayName: 'ST90S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_04', displayName: 'ST95S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_04', displayName: 'TDCN_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_04', displayName: 'TODO_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_05', displayName: 'USRLINK_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_05', displayName: 'LINKREV_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_05', displayName: 'LINKVAR_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_05', displayName: 'STATUS_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_05', displayName: 'ST82S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_05', displayName: 'ST85S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_05', displayName: 'ST90S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_05', displayName: 'ST95S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_05', displayName: 'TDCN_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_05', displayName: 'TODO_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_06', displayName: 'USRLINK_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_06', displayName: 'LINKREV_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_06', displayName: 'LINKVAR_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_06', displayName: 'STATUS_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_06', displayName: 'ST82S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_06', displayName: 'ST85S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_06', displayName: 'ST90S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_06', displayName: 'ST95S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_06', displayName: 'TDCN_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_06', displayName: 'TODO_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_07', displayName: 'USRLINK_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_07', displayName: 'LINKREV_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_07', displayName: 'LINKVAR_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_07', displayName: 'STATUS_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_07', displayName: 'ST82S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_07', displayName: 'ST85S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_07', displayName: 'ST90S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_07', displayName: 'ST95S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_07', displayName: 'TDCN_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_07', displayName: 'TODO_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_08', displayName: 'USRLINK_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_08', displayName: 'LINKREV_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_08', displayName: 'LINKVAR_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_08', displayName: 'STATUS_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_08', displayName: 'ST82S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_08', displayName: 'ST85S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_08', displayName: 'ST90S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_08', displayName: 'ST95S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_08', displayName: 'TDCN_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_08', displayName: 'TODO_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_09', displayName: 'USRLINK_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_09', displayName: 'LINKREV_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_09', displayName: 'LINKVAR_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_09', displayName: 'STATUS_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_09', displayName: 'ST82S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_09', displayName: 'ST85S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_09', displayName: 'ST90S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_09', displayName: 'ST95S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_09', displayName: 'TDCN_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_09', displayName: 'TODO_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_10', displayName: 'USRLINK_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_10', displayName: 'LINKREV_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_10', displayName: 'LINKVAR_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_10', displayName: 'STATUS_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_10', displayName: 'ST82S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_10', displayName: 'ST85S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_10', displayName: 'ST90S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_10', displayName: 'ST95S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_10', displayName: 'TDCN_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_10', displayName: 'TODO_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_11', displayName: 'USRLINK_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_11', displayName: 'LINKREV_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_11', displayName: 'LINKVAR_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_11', displayName: 'STATUS_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_11', displayName: 'ST82S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_11', displayName: 'ST85S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_11', displayName: 'ST90S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_11', displayName: 'ST95S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_11', displayName: 'TDCN_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_11', displayName: 'TODO_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_12', displayName: 'USRLINK_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_12', displayName: 'LINKREV_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_12', displayName: 'LINKVAR_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_12', displayName: 'STATUS_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_12', displayName: 'ST82S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_12', displayName: 'ST85S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_12', displayName: 'ST90S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_12', displayName: 'ST95S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_12', displayName: 'TDCN_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_12', displayName: 'TODO_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_13', displayName: 'USRLINK_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_13', displayName: 'LINKREV_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_13', displayName: 'LINKVAR_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_13', displayName: 'STATUS_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_13', displayName: 'ST82S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_13', displayName: 'ST85S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_13', displayName: 'ST90S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_13', displayName: 'ST95S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_13', displayName: 'TDCN_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_13', displayName: 'TODO_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'USRLINK_14', displayName: 'USRLINK_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKREV_14', displayName: 'LINKREV_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'LINKVAR_14', displayName: 'LINKVAR_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'STATUS_14', displayName: 'STATUS_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST82S_14', displayName: 'ST82S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST85S_14', displayName: 'ST85S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST90S_14', displayName: 'ST90S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'ST95S_14', displayName: 'ST95S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TDCN_14', displayName: 'TDCN_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
	{field: 'TODO_14', displayName: 'TODO_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader}
                      ];

                      $scope.gridOptions.onRegisterApi = function(gridApi) {
                          $scope.gridApi = gridApi;
                          $scope.gridApi.core.on.filterChanged( $scope, function() {
                              var grid = this.grid;
                              var filter = JSON.parse(JSON.stringify(defaultDatabaseFilter));
                              grid.columns.map(function(column){
                            	  if (column.enableFiltering && column.filters[0].term) {
                            		//console.log('+++',  JSON.stringify(defaultDatabaseFilter));
                                	  var wildcard =   {
                            			wildcard: {}
                            	      };
                            		  wildcard.wildcard[column.field] = {
                              	        value: ['*', column.filters[0].term.toString().toLowerCase(), '*'].join('')
                        	          };
                            		  filter.bool.must.push(wildcard);
                            	  }        	  
                              });
                              paginationOptions.filter = filter;
                              getPage();
                          });
                          $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                              
                        	if (sortColumns.length === 0) {
                              paginationOptions.sort = [defaultDatabaseSort];                              
                            } else {
                              var containsIndex = false;
                              var sort = sortColumns.map(function(column){
                            	  if (column.colDef.field === 'id') {
                            		  containsIndex = true;
                            	  }
                            	  var r = {};
                            	  r[column.colDef.field] = {'order': column.sort.direction };
                            	  return r;
                              });
                              if (!containsIndex) {
                            	  sort.push(defaultDatabaseSort);
                              }
                              console.log(JSON.stringify(sort));
                              paginationOptions.sort = sort; //sortColumns[0].sort.direction;
                            }
                            getPage();
                          });
                          $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            paginationOptions.pageNumber = newPage;
                            paginationOptions.pageSize = pageSize;
                            getPage();
                          });
                        };

                      var reduce = function(bsConnection) {
                        return {
                        	ROUID  : bsConnection._source.ROUID,
                        	PATHTOCNAME  : bsConnection._source.PATHTOCNAME,
                        	SOURCE  : bsConnection._source.SOURCE,
                        	PLANER  : bsConnection._source.PLANER,
                        	TODO29B  : bsConnection._source.TODO29B,
                        	ASSESSMENT18Y  : bsConnection._source.ASSESSMENT18Y,
                        	QUALITY18B  : bsConnection._source.QUALITY18B,
                        	ASSESSMENT56Y  : bsConnection._source.ASSESSMENT56Y,
                        	QUALITY56Y  : bsConnection._source.QUALITY56Y,
                        	EQUIPPING  : bsConnection._source.EQUIPPING,
                        	SITESTART  : bsConnection._source.SITESTART,
                        	SITESTARTPR  : bsConnection._source.SITESTARTPR,
                        	SITESTARTEPlus  : bsConnection._source.SITESTARTEPlus,
                        	NESTART  : bsConnection._source.NESTART,
                        	NESTARTTYPE  : bsConnection._source.NESTARTTYPE,
                        	NESTARTSTATUS  : bsConnection._source.NESTARTSTATUS,
                        	NESTARTKAT  : bsConnection._source.NESTARTKAT,
                        	NESTARTDUEDATE  : bsConnection._source.NESTARTDUEDATE,
                        	NESTARTPRJNAME  : bsConnection._source.NESTARTPRJNAME,
                        	NESTARTST29B  : bsConnection._source.NESTARTST29B,
                        	NESTARTST18B  : bsConnection._source.NESTARTST18B,
                        	NESTARTST56Y  : bsConnection._source.NESTARTST56Y,
                        	NESTARTST56YCOMMENT  : bsConnection._source.NESTARTST56YCOMMENT,
                        	NESTARTST90  : bsConnection._source.NESTARTST90,
                        	NESTARTST156Y  : bsConnection._source.NESTARTST156Y,
                        	NESTARTST156YCOMMENT  : bsConnection._source.NESTARTST156YCOMMENT,
                        	NESTARTST190  : bsConnection._source.NESTARTST190,
                        	SITEEND  : bsConnection._source.SITEEND,
                        	NEEND  : bsConnection._source.NEEND,
                        	NEENDTYPE  : bsConnection._source.NEENDTYPE,
                        	NEENDDUEDATE  : bsConnection._source.NEENDDUEDATE,
                        	NEENDKAT  : bsConnection._source.NEENDKAT,
                        	NEENDST62W  : bsConnection._source.NEENDST62W,
                        	NEENDST90  : bsConnection._source.NEENDST90,
                        	NEENDFT  : bsConnection._source.NEENDFT,
                        	NEENDFTTYPE  : bsConnection._source.NEENDFTTYPE,
                        	NEENDFTDUEDATE  : bsConnection._source.NEENDFTDUEDATE,
                        	NEENDFTKAT  : bsConnection._source.NEENDFTKAT,
                        	NEENDFTST76  : bsConnection._source.NEENDFTST76,
                        	NEENDFTST90  : bsConnection._source.NEENDFTST90,
                        	TYP  : bsConnection._source.TYP,
                        	CAP  : bsConnection._source.CAP,
                        	E1  : bsConnection._source.E1,
                        	LEN  : bsConnection._source.LEN,
                        	SITEPATH  : bsConnection._source.SITEPATH,
                        	USRLINK_01  : bsConnection._source.USRLINK_01,
                        	LINKREV_01  : bsConnection._source.LINKREV_01,
                        	LINKVAR_01  : bsConnection._source.LINKVAR_01,
                        	STATUS_01  : bsConnection._source.STATUS_01,
                        	ST82S_01  : bsConnection._source.ST82S_01,
                        	ST85S_01  : bsConnection._source.ST85S_01,
                        	ST90S_01  : bsConnection._source.ST90S_01,
                        	ST95S_01  : bsConnection._source.ST95S_01,
                        	TDCN_01  : bsConnection._source.TDCN_01,
                        	TODO_01  : bsConnection._source.TODO_01,
                        	USRLINK_02  : bsConnection._source.USRLINK_02,
                        	LINKREV_02  : bsConnection._source.LINKREV_02,
                        	LINKVAR_02  : bsConnection._source.LINKVAR_02,
                        	STATUS_02  : bsConnection._source.STATUS_02,
                        	ST82S_02  : bsConnection._source.ST82S_02,
                        	ST85S_02  : bsConnection._source.ST85S_02,
                        	ST90S_02  : bsConnection._source.ST90S_02,
                        	ST95S_02  : bsConnection._source.ST95S_02,
                        	TDCN_02  : bsConnection._source.TDCN_02,
                        	TODO_02  : bsConnection._source.TODO_02,
                        	USRLINK_03  : bsConnection._source.USRLINK_03,
                        	LINKREV_03  : bsConnection._source.LINKREV_03,
                        	LINKVAR_03  : bsConnection._source.LINKVAR_03,
                        	STATUS_03  : bsConnection._source.STATUS_03,
                        	ST82S_03  : bsConnection._source.ST82S_03,
                        	ST85S_03  : bsConnection._source.ST85S_03,
                        	ST90S_03  : bsConnection._source.ST90S_03,
                        	ST95S_03  : bsConnection._source.ST95S_03,
                        	TDCN_03  : bsConnection._source.TDCN_03,
                        	TODO_03  : bsConnection._source.TODO_03,
                        	USRLINK_04  : bsConnection._source.USRLINK_04,
                        	LINKREV_04  : bsConnection._source.LINKREV_04,
                        	LINKVAR_04  : bsConnection._source.LINKVAR_04,
                        	STATUS_04  : bsConnection._source.STATUS_04,
                        	ST82S_04  : bsConnection._source.ST82S_04,
                        	ST85S_04  : bsConnection._source.ST85S_04,
                        	ST90S_04  : bsConnection._source.ST90S_04,
                        	ST95S_04  : bsConnection._source.ST95S_04,
                        	TDCN_04  : bsConnection._source.TDCN_04,
                        	TODO_04  : bsConnection._source.TODO_04,
                        	USRLINK_05  : bsConnection._source.USRLINK_05,
                        	LINKREV_05  : bsConnection._source.LINKREV_05,
                        	LINKVAR_05  : bsConnection._source.LINKVAR_05,
                        	STATUS_05  : bsConnection._source.STATUS_05,
                        	ST82S_05  : bsConnection._source.ST82S_05,
                        	ST85S_05  : bsConnection._source.ST85S_05,
                        	ST90S_05  : bsConnection._source.ST90S_05,
                        	ST95S_05  : bsConnection._source.ST95S_05,
                        	TDCN_05  : bsConnection._source.TDCN_05,
                        	TODO_05  : bsConnection._source.TODO_05,
                        	USRLINK_06  : bsConnection._source.USRLINK_06,
                        	LINKREV_06  : bsConnection._source.LINKREV_06,
                        	LINKVAR_06  : bsConnection._source.LINKVAR_06,
                        	STATUS_06  : bsConnection._source.STATUS_06,
                        	ST82S_06  : bsConnection._source.ST82S_06,
                        	ST85S_06  : bsConnection._source.ST85S_06,
                        	ST90S_06  : bsConnection._source.ST90S_06,
                        	ST95S_06  : bsConnection._source.ST95S_06,
                        	TDCN_06  : bsConnection._source.TDCN_06,
                        	TODO_06  : bsConnection._source.TODO_06,
                        	USRLINK_07  : bsConnection._source.USRLINK_07,
                        	LINKREV_07  : bsConnection._source.LINKREV_07,
                        	LINKVAR_07  : bsConnection._source.LINKVAR_07,
                        	STATUS_07  : bsConnection._source.STATUS_07,
                        	ST82S_07  : bsConnection._source.ST82S_07,
                        	ST85S_07  : bsConnection._source.ST85S_07,
                        	ST90S_07  : bsConnection._source.ST90S_07,
                        	ST95S_07  : bsConnection._source.ST95S_07,
                        	TDCN_07  : bsConnection._source.TDCN_07,
                        	TODO_07  : bsConnection._source.TODO_07,
                        	USRLINK_08  : bsConnection._source.USRLINK_08,
                        	LINKREV_08  : bsConnection._source.LINKREV_08,
                        	LINKVAR_08  : bsConnection._source.LINKVAR_08,
                        	STATUS_08  : bsConnection._source.STATUS_08,
                        	ST82S_08  : bsConnection._source.ST82S_08,
                        	ST85S_08  : bsConnection._source.ST85S_08,
                        	ST90S_08  : bsConnection._source.ST90S_08,
                        	ST95S_08  : bsConnection._source.ST95S_08,
                        	TDCN_08  : bsConnection._source.TDCN_08,
                        	TODO_08  : bsConnection._source.TODO_08,
                        	USRLINK_09  : bsConnection._source.USRLINK_09,
                        	LINKREV_09  : bsConnection._source.LINKREV_09,
                        	LINKVAR_09  : bsConnection._source.LINKVAR_09,
                        	STATUS_09  : bsConnection._source.STATUS_09,
                        	ST82S_09  : bsConnection._source.ST82S_09,
                        	ST85S_09  : bsConnection._source.ST85S_09,
                        	ST90S_09  : bsConnection._source.ST90S_09,
                        	ST95S_09  : bsConnection._source.ST95S_09,
                        	TDCN_09  : bsConnection._source.TDCN_09,
                        	TODO_09  : bsConnection._source.TODO_09,
                        	USRLINK_10  : bsConnection._source.USRLINK_10,
                        	LINKREV_10  : bsConnection._source.LINKREV_10,
                        	LINKVAR_10  : bsConnection._source.LINKVAR_10,
                        	STATUS_10  : bsConnection._source.STATUS_10,
                        	ST82S_10  : bsConnection._source.ST82S_10,
                        	ST85S_10  : bsConnection._source.ST85S_10,
                        	ST90S_10  : bsConnection._source.ST90S_10,
                        	ST95S_10  : bsConnection._source.ST95S_10,
                        	TDCN_10  : bsConnection._source.TDCN_10,
                        	TODO_10  : bsConnection._source.TODO_10,
                        	USRLINK_11  : bsConnection._source.USRLINK_11,
                        	LINKREV_11  : bsConnection._source.LINKREV_11,
                        	LINKVAR_11  : bsConnection._source.LINKVAR_11,
                        	STATUS_11  : bsConnection._source.STATUS_11,
                        	ST82S_11  : bsConnection._source.ST82S_11,
                        	ST85S_11  : bsConnection._source.ST85S_11,
                        	ST90S_11  : bsConnection._source.ST90S_11,
                        	ST95S_11  : bsConnection._source.ST95S_11,
                        	TDCN_11  : bsConnection._source.TDCN_11,
                        	TODO_11  : bsConnection._source.TODO_11,
                        	USRLINK_12  : bsConnection._source.USRLINK_12,
                        	LINKREV_12  : bsConnection._source.LINKREV_12,
                        	LINKVAR_12  : bsConnection._source.LINKVAR_12,
                        	STATUS_12  : bsConnection._source.STATUS_12,
                        	ST82S_12  : bsConnection._source.ST82S_12,
                        	ST85S_12  : bsConnection._source.ST85S_12,
                        	ST90S_12  : bsConnection._source.ST90S_12,
                        	ST95S_12  : bsConnection._source.ST95S_12,
                        	TDCN_12  : bsConnection._source.TDCN_12,
                        	TODO_12  : bsConnection._source.TODO_12,
                        	USRLINK_13  : bsConnection._source.USRLINK_13,
                        	LINKREV_13  : bsConnection._source.LINKREV_13,
                        	LINKVAR_13  : bsConnection._source.LINKVAR_13,
                        	STATUS_13  : bsConnection._source.STATUS_13,
                        	ST82S_13  : bsConnection._source.ST82S_13,
                        	ST85S_13  : bsConnection._source.ST85S_13,
                        	ST90S_13  : bsConnection._source.ST90S_13,
                        	ST95S_13  : bsConnection._source.ST95S_13,
                        	TDCN_13  : bsConnection._source.TDCN_13,
                        	TODO_13  : bsConnection._source.TODO_13,
                        	USRLINK_14  : bsConnection._source.USRLINK_14,
                        	LINKREV_14  : bsConnection._source.LINKREV_14,
                        	LINKVAR_14  : bsConnection._source.LINKVAR_14,
                        	STATUS_14  : bsConnection._source.STATUS_14,
                        	ST82S_14  : bsConnection._source.ST82S_14,
                        	ST85S_14  : bsConnection._source.ST85S_14,
                        	ST90S_14  : bsConnection._source.ST90S_14,
                        	ST95S_14  : bsConnection._source.ST95S_14,
                        	TDCN_14  : bsConnection._source.TDCN_14,
                        	TODO_14  : bsConnection._source.TODO_14
                       };
                      };

                      var getPage = function() {
                        $header.setStatus(alertService.processing());
                        var size = paginationOptions.pageSize;
                        var from = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                        var sort = paginationOptions.sort;
                        var filter = paginationOptions.filter;
                        console.log('filter', JSON.stringify(filter));
                        $bsConnections.getBsConnections($scope.dbIndex, size, from, sort, filter, function(err, total, bsConnections) {
                          if (err) {
                            $header.setStatus(alertService.failed(err));
                            console.log('htLog:', err);
                            return;
                          }

                          $scope.gridOptions.totalItems = total;
                          
                          $scope.gridOptions.data = [];
                          // console.log(JSON.stringify(bsConnections));
                          bsConnections.map(function(bsConnection) {
                            $scope.gridOptions.data.push(reduce(bsConnection));
                          });
                         
                          $header.setStatus(alertService.success());
                         
                        });
                      };
                      
                      getPage();
                    }
                  ]
                });
      }
    ]);

htBsConnections.factory('$bsConnections', ['$rootScope', '$database', function($rootScope, $database) {
    'use strict';

    var service = {};
    
    service.getBsConnections = function(dbIndex, size, from, sort, filter, callback) {
      var docType = {key: 'bsconnections'};
      $database.getData(dbIndex, docType, size, from, sort, filter, function(data){
        if (!data || data.length ===0) {
          // nothing found or error
          callback('Nothing found!', []);
        } else {
          callback(null, data.hits.total, data.hits.hits);
        }
      });
    };

    service.getSitePath = function(dbIndex, routeId, callback) {
        
        var docType = 'path';
        var size = 99; // expected result always 1 due to valid unique id
        var from = 0;
        var sort; 
        var filter = {term: {ROUID: routeId}};

        $database.getData(dbIndex, docType, size, from, sort, filter, function(data) {
        	console.log(data);
        	return callback([]);
        });
        
//        
//        var segments = path._source.LEN;
//        var startSite = path._source.SITESTART;
//        
//        var result = [];
//        result.push(startSite);
//
//        var index = 0;
//        var start = startSite;
//        // order matters! -> not asynch, start by 0
//        while (index < segments.length) {
//            var segment = segments[index].references.owningLOSLinkReference;
//            if (segment) {
//                if (start === segment.low) {
//                    result.push(segment.high);
//                    start = segment.high;
//                } else {
//                    result.push(segment.low);
//                    start = segment.low;
//                }
//            } else {
//                result.push('unknown');
//                start = null;
//            }
//            index = index + 1;
//        }
        
        // return result;
    };

    return service;
}]);

/**
 * angular.js for htDatabase
 */
var htDatabase = angular.module('htDatabase', []);
htDatabase.config(['$stateProvider', function($stateProvider) {
  'use strict';
  $stateProvider.state('database', {
    // abstract:
    // true,
    url : '/database/:dbIndex',
    templateUrl : 'modules/database/database.html',
    controller : [
      '$rootScope', '$scope', '$stateParams', '$database', 'alertService', '$header', '$uibModal',
      function($rootScope, $scope, $stateParams, $database, alertService, $header, $uibModal) {

        $scope.dbIndex = $stateParams.dbIndex;
        $rootScope.title = 'htDatabase';

        alertService.setMessage([
          'LOADING', 'SUCCESS', 'FAILED'
        ]);
        $header.setStatus(alertService.processing());

        var maxSize = 1000;
        
        var mappings = {};
        var typeMapping = {
          string: 'string',
          boolean: 'boolean',
          integer: 'number',
          long: 'number',
          float: 'number',
          double : 'number',
          null: 'string',
          undefined: 'object'
          };
        var getColumn = function(name, value, callback) {
          var type = typeMapping[value.type];
          var column = {
            field : name,
            type: type,
            minWidth : 80, 
            headerCellClass : $scope.highlightFilteredHeader
          };
          if (type === 'number') {
            column.cellClass = 'number';
          }
          if (type === 'object') {
            column.cellTemplate = '<div ng-click="grid.appScope.show(row.entity[col.field], col.field)" title="{{ COL_FIELD }}" class="ui-grid-cell-contents pointer cellTooltip">{{ COL_FIELD }}</div>';
          }
          if (name.startsWith('id')) {
            column.pinnedLeft = true;
          }
          return callback(column);
        };
        
        $scope.show = function(cellContent, field) {
          $scope.selectedCell = cellContent;
          $scope.field = field;
          var modalInstance = $uibModal.open({
            animation : $scope.animationsEnabled,
            templateUrl : '/ux/modules/database/database.info.html',
            controller : 'ObjectInfoCtrl',
            size : 'lg',
            resolve : {
              selectedCell : function() {
                return $scope.selectedCell;
              },
              field : function() {
                return $scope.field;
              }
            }
          });
          modalInstance.result.then(function(selectedCell, field) {
            console.log(selectedCell, field);
          }, function() {
            console.log('Modal dismissed at: ' + new Date());
          });
        };
        
        var updateColumnDefs = function(docType, callback) {
          var columns = [];
          var keys = Object.keys(mappings[docType].properties);
          keys.map(function(property) {
            getColumn(property, mappings[docType].properties[property], function(column){
              columns.push(column);
            });
          });
          return callback(columns);
        };
        var previous = {};
        var getDataCallback = function(data){
          data.hits.hits.map(function(row){
            $scope.gridOptions.data.push(row._source);
          });
          if ($scope.gridOptions.data.length >= previous.count) {
            $header.setStatus(alertService.success());
          }
        };
        var getContent = function() {
          if (this.key === previous.key) {
            return;
          }
          previous = this;
          $header.setStatus(alertService.processing());
          updateColumnDefs(this.key, function(columns) {
            $scope.gridOptions.columnDefs = columns;
          });
          
          $scope.gridOptions.data = [];
          var from = 0;
          while (from <= this.count) {
            $header.setStatus(alertService.processing());
            var sort;
            var filter;
            $database.getData($scope.dbIndex, this, maxSize, from, sort, filter, getDataCallback);
            from = from + maxSize;
          }
        };
        $scope.docTypes = [];
        $database.getMappings($scope.dbIndex, function(err, data) {
          if (err) {
            console.info(err);
          } else {
            mappings = data;
            var keys = Object.keys(data);
            var docTypes = [];
            $database.count($scope.dbIndex, keys, function(counts) {
              counts.terms.map(function(term) {
                docTypes.push({
                  key : term.term,
                  label : term.term.toUpperCase(),
                  count : term.count,
                  getContent : getContent
                });
              });
              var last = docTypes.length - 1;
              docTypes[last].active = true;
              $scope.docTypes = docTypes.sort(function(a, b) {
                return b.count - a.count;
              });
            });
          }
        });

        $scope.gridOptions = {
          data : [],
          enableSorting : true,
          enableColumnResizing : true,
          enableFiltering : true,
          enableGridMenu : true,
          showGridFooter : true,
          showColumnFooter : true,
          fastWatch : false, // important
          enableRowSelection : true,
          enableRowHeaderSelection : true,
          multiSelect : false,
          columnDefs : $scope.columns,
          onRegisterApi : function(gridApi) {
            $scope.gridApi = gridApi;
          }
        };
        $scope.gridOptions.gridMenuCustomItems = [
          {
            title : 'Rotate Grid',
            action : function($event) {
              console.log($event);
              this.grid.element.toggleClass('rotated');
            },
            order : 210
          }
        ];
      }
    ]
  });
}]);

htDatabase.controller('ObjectInfoCtrl', ['$scope', '$uibModalInstance', 'selectedCell', 'field', function($scope, $uibModalInstance, selectedCell, field) {

  $scope.selectedCell = selectedCell;
  $scope.field = field;

  $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
  };
}]);
htDatabase.factory('$database', ['$http', '$app', function($http, $app) {
  'use strict';

  var dbIndex = 'networknordhorn';
  $app.getDbIndex(function(data) {
    console.log('htLog:', data);
    dbIndex = data;
  });
  var getRestURL = function(dbIndex, docType) {
    var url = [
      '/db', dbIndex, docType, '_search'
    ];
    return url.join('/');
  };
  var getRequest = function(dbIndex, docType, size, from, sort, filter) {
    if (size === undefined) {
      size = 999;
    }
    if (from === undefined) {
      from = 0;
    }
    if (filter === undefined || (filter.bool && filter.bool.must.length === 0)) {
    	filter = {
    		  match_all: {}
    	};
    }
    return {
      method : 'POST',
      url : getRestURL(dbIndex, docType),
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {
        from : from,
        size : size,
        sort : sort,
        query : filter
      }
    };
  };

  var service = {};

  service.resourceType = 'radio';
  service.tables = {
    radio : {
      columns : [
        {
          id : 0,
          name : 'idRadio',
          width : 40,
          cls : 'text-right',
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
          cls : 'text-right',
          query : '05'
        }, {
          id : 6,
          name : 'bandwidth',
          width : 'Auto',
          cls : 'text-right',
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
          cls : 'text-right',
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
          cls : 'text-right',
          query : '41'
        }, {
          id : 2,
          name : 'minLength',
          width : 100,
          cls : 'text-right',
          query : '42'
        }, {
          id : 3,
          name : 'maxLength',
          width : 100,
          cls : 'text-right',
          query : '43'
        }, {
          id : 4,
          name : 'lossM',
          width : 80,
          cls : 'text-right',
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

  service.getMappings = function(dbIndex, callback) {
    var req = {
      method : 'GET',
      url : '/db/' + dbIndex,
      headers : {
        'Content-Type' : 'application/json'
      }
    };
    $http(req).success(function(data) {
      // console.info(JSON.stringify(data));
      return callback(null, data[dbIndex].mappings);
    }).error(function(data, status) {
      console.info('htLog: ERROR', data, status);
      return callback("An error occured: " + status, null);
    });
  };

  service.count = function(dbIndex, docTypes, callback) {
    var url = [
      '/db', dbIndex, docTypes.join(','), '_search'
    ];
    var req = {
      method : 'POST',
      url : url.join('/'),
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {
        "size" : 0,
        "facets" : {
          "counts" : {
            "terms" : {
              "field" : "_type"
            }
          }
        }
      }
    };
    $http(req).success(function(data) {
      return callback(data.facets.counts);
    }).error(function(data, status) {
      console.info('htLog:', data, status);
      return callback([]);
    });
  };

  service.getData = function(dbIndex, docType, size, from, sort, filter, callback) {
    var req = getRequest(dbIndex, docType.key, size, from, sort, filter);
    //console.log(JSON.stringify(req));
    $http(req).success(function(data) {
      //console.log('htLog:', data.hits.hits.length);
      callback(data);
    }).error(function(data, status) {
      console.info('htLog: ERROR', data, status);
      callback([]);
    });
  };
  
  service.getTableData = function(dbIndex, rt, callback) {

    var req = getRequest(dbIndex, rt);
    // console.log(JSON.stringify(req));
    $http(req).success(function(data) {
      // console.log(rt, data.hits.total);
      service.tables[rt].rows = data.hits.hits;
      callback(null, service.tables[rt]);
    }).error(function(data, status) {
      service.tables[data.output.resourceType].rows = [];
      callback("An error occured: " + status, null);
    });
  };

  Object.keys(service.tables).map(function(key) {
    var table = service.tables[key];
    table.columns.map(function(column) {
      column.query = '';
      table.search[column.name] = column.query;
    });
  });

  return service;
}]);

app.directive('newMwrLink', ['$networkMap', 'alertService', function($networkMap, alertService) {

    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/newMwrLink/newMwrLink.html',
        scope : {
            dbIndex : '@dbIndex',
            siteIdA : '=',
            siteIdB : '=',
            revisionType : '='
        },
        controller : ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

            alertService.setMessage([
                'CREATING', 'CREATE_SUCCESS', 'CREATE_FAILED'
            ]);

            $scope.mpA = 'new';
            $networkMap.getSiteById($scope.dbIndex, $scope.siteIdA, function(site){
                $scope.siteA = site;
                if ($scope.siteA._source.antennamountingpositions.length > 0) {
                    $scope.mpA = 'item0';
                }
                console.log($scope.mpA);
            });

            $scope.mpB = 'new';
            $networkMap.getSiteById($scope.dbIndex, $scope.siteIdB, function(site){
                $scope.siteB = site;
                if ($scope.siteB._source.antennamountingpositions.length > 0) {
                    $scope.mpB = 'item0';
                }
                console.log($scope.mpB);
            });

            $scope.cancelMwrLink = function() {
                console.log($scope.mpA, $scope.mpB);
                $rootScope.cancelMwrLink({dbIndex: $scope.dbIndex, siteLinkId: {low: $scope.siteIdA, high: $scope.siteIdB}});
            };

            $scope.createMwrLink = function() {
                $scope.status = alertService.processing();
                var req = {
                    method : 'GET',
                    url : '/api/create/MWRLINKREVISIONVARIANT/' + $scope.siteIdA + '/' + $scope.siteIdB,
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                };
                // console.log(JSON.stringify(req));
                $http(req).success(function(data) {
                    //console.log(JSON.stringify(data));
                    $scope.status = alertService.success();
                    $rootScope.mwrLinkCreated({dbIndex: $scope.dbIndex, siteLinkId: {low: $scope.siteIdA, high: $scope.siteIdB}}, data); 
                }).error(function(data, status) {
                    console.log(data, status);
                    $scope.status = alertService.failed();
                });
            };
        }]
    };
}]);
app.filter('nominus', function () {
    return function (value) {
        return (!value ? '' : value.replace(/-/g, ''));
    };
});

app.directive('siteLinkDetails', function() {
    'use strict';
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/siteLinkDetails/siteLinkDetails.html',
        scope : {
            siteLinkIndex : '=',
            siteLinkIdLow : '=',
            siteLinkIdHigh : '='
        },
        controller : ['$rootScope', '$scope', '$http', '$networkMap', function($rootScope, $scope, $http, $networkMap) {
            $scope.status = {
                message : 'Searching...',
                type : 'warning',
                isWorking : true
            };
            
            $scope.showNewMwrLinkButton = false;
            if ($rootScope.newLink !== undefined) {
                $scope.showNewMwrLinkButton = true;
            }
            
            $scope.getSiteLinkId = function(){return{
                low:$scope.siteLinkIdLow,
                high:$scope.siteLinkIdHigh
            };};
            
            $scope.removeSiteLink = function() {
                $rootScope.removeSiteLink($scope.siteLinkIndex, $scope.getSiteLinkId() );
            };
            
            $scope.createMwrLink = function() {
                $rootScope.createMwrLink($scope.siteLinkIndex, $scope.getSiteLinkId() );
            };
            
            var updateSiteLink = function() {
                $networkMap.getSiteLink($scope.siteLinkIndex, $scope.getSiteLinkId(), function(siteLink) {
                    // console.log(JSON.stringify(siteLink));
                    $scope.siteLink = siteLink;
                    $scope.status.message = undefined;
                    $scope.status.type = 'success';
                    $scope.status.isWorking = false;
                    $networkMap.getSitesOfLink($scope.siteLink, function(sites) {
                        $scope.sites = sites;
                    });
                });
            };
            updateSiteLink();
        }]
    };
});
app.directive('siteDetails', function() {
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/siteDetails/siteDetails.html',
        scope : {
            siteIndex : '=',
            siteId : '='
        },
        controller : ['$rootScope', '$scope', '$networkMap', function($rootScope, $scope, $networkMap) {
            $scope.status = {
                message : 'Searching...',
                type : 'warning',
                isWorking : true
            };

            $scope.removeSite = function() {
                $rootScope.removeSite($scope.siteIndex, $scope.siteId);
            };

            $scope.showNewLinkButton = false;
            // TODO !!! - single site web appb???
            if ($rootScope.newLink !== undefined) {
                $scope.showNewLinkButton = true;
                $scope.createNewLinkMode = $rootScope.newLink.mode($scope.siteId);
                $scope.toggleCreateNewLinkMode = function() {
                    $scope.createNewLinkMode = $rootScope.newLink.toggle($scope.site);
                };
            }

            $scope.$watch('siteId', function(v) {
                if (v !== undefined && v !== 0) { // on init siteId is 0
                    $networkMap.getSiteById($scope.siteIndex, v, function(site) {
                        if (site) {
                            $scope.site = site._source;
                            $scope.site.isFiberPoP = function() {
                                if (site.planta14) {
                                    if ($scope.site.planta14.indexOf('Fib') !== -1) {
                                        return '2014';
                                    }
                                    if ($scope.site.ultima15.indexOf('Fib') !== -1) {
                                        return '2015';
                                    }
                                    if ($scope.site.externa17.indexOf('Fib') !== -1) {
                                        return '2017';
                                    }
                                }
                                return 'false';
                            };
                            var siteIds = [];
                            siteIds.push(site._source.id.siteId);
                            // console.log(site._index, siteIds);
                            $networkMap.getSiteLinksBySiteIds(site._index, siteIds, function(siteLinks) {
                                // console.log(siteLinks.length);
                                $scope.detailedSiteLinks = siteLinks;
                            });
                            $networkMap.getDetailedNetworkElements(site._index, site._source.id.siteId, function(detailedNetworkElements) {
                                $scope.detailedNetworkElements = detailedNetworkElements;
                            });
                            $scope.status.message = undefined;
                            $scope.status.type = 'success';
                            $scope.status.isWorking = false;
                        } else {
                            $scope.status.message = 'Site \'' + v + '\' not found!';
                            $scope.status.type = 'danger';
                            $scope.status.isWorking = false;
                        }
                    });
                }
            });
        }]
    };
});

app.directive('htHeader', function() {
    'use strict';
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/header/header.html',
        scope : {
            headline : '@headline',
            objectId : '@objectId',
            objectName : '@objectName'
        },
        controller : ['$scope', 'translateService', '$header', function($scope, translateService, $header) {
          console.log('initheader');
          $scope.languages = {
            en_US : {
              title: 'English US',
              flag : 'us'
            },
            pt_BR : {
              title: 'Português Brasileiro',
              flag: 'br'
            }, 
            es_ES : {
              title: 'Español',
              flag: 'es'
            },
            it_IT : {
              title: 'Italiano',
              flag: 'it'
            },
            fr_FR : {
              title: 'Français',
              flag: 'fr'
            },
            de_DE : {
              title: 'Deutsch',
              flag: 'de'
            }
          };
          
            $scope.changeLanguage = translateService.changeLanguage;
            $scope.status = $header.status;
            $scope.previous = $header.previous;
            $scope.next = $header.next;
            $header.attributeValueChangeListener(function() {
                $scope.status = $header.status;
                $scope.previous = $header.previous;
                $scope.next = $header.next;               
            });
        }]
    };
});

app.factory('$header', ['$rootScope', function($rootScope) {
    
    var notificationId = 'headerChanged';
    var service = {};

    service.status = {};
    service.previous = {link: '/ux/#/', title: '', active: false};
    service.next = {link: '/ux/#/', title: '', acrive: false};
    
    service.setNavigation = function(nav) {
      service.navigation = nav;
      this.attributeValueChangeNotification(notificationId);
    };
    service.setStatus = function(status) {
      service.status = status;
      this.attributeValueChangeNotification(notificationId);
    };
    service.setPrevious = function(previous) {
        service.previous = previous;
        this.attributeValueChangeNotification(notificationId);
    };
    service.setNext = function(next) {
        service.next = next;
        this.attributeValueChangeNotification(notificationId);
    };
    service.attributeValueChangeNotification = function(handle) {
        $rootScope.$broadcast(handle);
    };
    service.attributeValueChangeListener = function(callback) {
        $rootScope.$on(notificationId, callback);
    };
    return service;
}]);
app.directive('htFooter', function() {
    return {
        restrict : 'E',
        // replace: true, // important! do not un-comment
        templateUrl : '/ux/modules/directives/footer/footer.html',
        scope : {
        },
        controller : function() {
        }
    };
});

/**
 * angular.js for htEngineer
 */
var htEngineer = angular.module('htEngineer', [
    'ui.bootstrap', 'htLogin', 'alert', 'translate'
]);

htEngineer.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('engineer', {
            // abstract:
            // true,
            url : '/engineer/:dbIndex/:high/:low',
            templateUrl : 'modules/engineer/engineer.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$window', 
                '$revisionStatus', 
                '$stateParams', 
                '$engineer', 
                'authenticationService', 
                'alertService', 
                '$header', 
                function($rootScope, $scope, $window, $revisionStatus, $stateParams, $engineer, authenticationService, alertService, $header) {

                    $scope.dbIndex = $stateParams.dbIndex;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    var displayId = $stateParams.low + '-' + $stateParams.high;
                    var id = {
                        low : $stateParams.low,
                        high : $stateParams.high
                    };

                    $rootScope.title = '(' + displayId + ') htEngineer';

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.processing());
                    $scope.results = [];
                    $scope.select = function(mwrLink) {
                        console.log(JSON.stringify(mwrLink));
                        $scope.selectedVariant = mwrLink;
                    };


                    var mwrLinkCreated = function(mwrLinkRevision) {
                        var profile = authenticationService.getProfileName();
                        var flag = {
                            revisionState: {
                                orderId: 5,
                                id: 'created',
                                name: 'Created',
                                isMain: true
                            },
                            required:new Date(),
                            plan:new Date(),
                            actual:new Date(),
                            planner:authenticationService.getUsername(profile),
                            comment:'Creation via htEngineer.'
                        };
                        var rs = {};
                        rs.id = mwrLinkRevision.id;
                        rs.lifeCycle = {};
                        rs.lifeCycle.revisionFlags = [];
                        rs.lifeCycle.revisionFlags.push(flag);
                        
//                        // create first revisionstatus
                        $revisionStatus.set($scope.dbIndex, rs, function(err, data){
                            console.log('htLog: ', err, data);
                            var url = '/ux/#/mwrLinkRevision/';
                            url += $scope.dbIndex;
                            url += '/';
                            url += $scope.siteLinkIdLow;
                            url += '/';
                            url += $scope.siteLinkIdHigh;
                            url += '/';
                            url += mwrLinkRevision.id.mwrLinkId;
                            url += '/';
                            url += mwrLinkRevision.id.revision;
                            $window.location.href =  url;
                        });
                    };
                    $scope.createMwrLinkRevision = function() {
                        $header.setStatus(alertService.processing());
                        $scope.selectedVariant.id.siteLinkId = {
                            low: $scope.siteLinkIdLow,
                            high: $scope.siteLinkIdHigh
                        };
                        $engineer.createMwrLinkRevision($scope.dbIndex, $scope.selectedVariant, function(err, mwrLink) {
                            if (err) {
                                console.log('htLog: ', mwrLink, status);
                                $header.setStatus(alertService.failed(err));
                                $scope.selectedVariant = undefined;
                            } else {
                                console.log(JSON.stringify(mwrLink.mwrlinkrevision));
                                $header.setStatus(alertService.success());
                                mwrLinkCreated(mwrLink.mwrlinkrevision);
                                $scope.selectedVariant = undefined;
                            }
                        });
                    };

                    $engineer.getResults(id, function(err, results) {
                        if (err) {
                            $scope.results = [];
                            $header.setStatus(alertService.failed(err));
                            $scope.selectedVariant = undefined;
                        } else {
                            $scope.results = results.output.linkEngineering;
                            $header.setStatus(alertService.success());
                            if ($scope.results.length > 1) {
                                $scope.selectedVariant = $scope.results[$scope.results.length - 2];
                            }
                        }
                    });

                }
            ]
        });
    }
]);
htEngineer.factory('$engineer', ['$http', function($http) {
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
        $http(req).success(function(results) {
            // console.log(JSON.stringify(results));
            return callback(null, results);
        }).error(function(data, status) {
          console.info(data, status);
            return callback(status, null);
        });
    };

    service.createMwrLinkRevision = function(dbIndex, mwrLinkRevision, callback) {
        var req = {
            method : 'POST',
            url : '/api/create/MWRLINKREVISIONVARIANT/' + mwrLinkRevision.id.siteLinkId.high + '/' + mwrLinkRevision.id.siteLinkId.low,
            headers : {
                'Content-Type' : 'application/json'
            },
            data : mwrLinkRevision
        };
        //console.log(1, JSON.stringify(req));
        $http(req).success(function(data) {
            // console.log(2, data);
            return callback(null, data);
        }).error(function(data, status) {
            console.info('htLog: RevisionState set failed!', data, status);
            return callback(status, null);
        });
    };

    return service;
}]);

/**
 * angular.js for htInventory
 */
var htInventory =
                angular.module('htInventory', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'htLogin', 'htDatabase', 'alert', 'translate'
                ]);

htInventory.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('inventory', {
            // abstract:
            // true,
            url : '/inventory/:dbIndex',
            templateUrl : '/ux/modules/inventory/inventory.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                '$inventory',
                'translateService',
                function($rootScope, $scope, $stateParams, $inventory, translateService) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htInventory';

                    $scope.show = function(row) {
                      var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?networkelement=' + row.id;
                      window.open(link, 'htNetworkMap');
                    };

                    $scope.open = function(row) {
                      var link = '/ux/#/networkElements/' + $scope.dbIndex + '/' + row.id;
                      window.open(link, 'htSolutions');
                    };

                    
                    var from = 0;
                    var maxSize = 1000;
                    var numNetworkElements = 0;

                    var actionCellTemplate = ['<a class="vCenter" >',
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>',
                    '<span> </span>',
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>',
                    '</a>'].join('');
                    
                    $scope.gridOptions = {};
                    $scope.gridOptions.data = [];
                    $scope.gridOptions.enableColumnResizing = true;
                    $scope.gridOptions.enableSorting = true;
                    $scope.gridOptions.enableFiltering = true;
                    $scope.gridOptions.enableGridMenu = true;
                    $scope.gridOptions.showGridFooter = true;
                    // $scope.gridOptions.showColumnFooter = true;
                    $scope.gridOptions.fastWatch = true;
                    $scope.gridOptions.enableRowSelection = true;
                    $scope.gridOptions.enableRowHeaderSelection = true;
                    $scope.gridOptions.multiSelect = false;

                    $scope.gridOptions.gridMenuCustomItems = [
                                           {
                                               title : 'Rotate Grid',
                                               action : function($event) {
                                                   console.log($event);
                                                   this.grid.element.toggleClass('rotated');
                                               },
                                               order : 210
                                           }
                                       ];
                    
                    var bandwidth = 'something';
                    translateService.org('BANDWIDTH').then(function (translation) {
                      bandwidth = translation;
                    });
                    $scope.gridOptions.columnDefs =  [
                            {
                                field : 'id',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width: 100,
                                pinnedLeft : true
                            }, {
                              field : 'site',
                              type : 'string',
                              width : 100,
                              cellTemplate : '<div class="ui-grid-cell-contents"><a href="/ux/#/sites/'+$scope.dbIndex + '/{{ COL_FIELD }}" title="{{ COL_FIELD }}">{{ COL_FIELD }}</a></div>',
                              headerCellClass : $scope.highlightFilteredHeader
                            }, {
                              field : 'type',
                              type : 'string',
                              width : 120,
                              headerCellClass : $scope.highlightFilteredHeader
                            }, {
                              field : 'isAggregator',
                              type : 'boolean',
                              width : 80,
                              headerCellClass : $scope.highlightFilteredHeader
                            }, {
                              field : 'v99',
                              categoryDisplayName : bandwidth,
                              type : 'number',
                              width : 80,
                              headerCellClass : $scope.highlightFilteredHeader, 
                              cellClass : 'number'
                            }, {
                              field : 'rumpf',
                              categoryDisplayName : bandwidth,
                              type : 'number',
                              width : 80,
                              headerCellClass : $scope.highlightFilteredHeader,
                              cellClass : 'number'
                            }, {
                              field : 'e1Channels',
                              categoryDisplayName : bandwidth,
                              type : 'number',
                              width : 80,
                              headerCellClass : $scope.highlightFilteredHeader,
                              cellClass : 'number'
                            }, {
                              field : 'pathToAggregator',
                              categoryDisplayName : bandwidth,
                              type : 'object',
                              width : 120,
                              headerCellClass : $scope.highlightFilteredHeader
                            }, {
                              field : 'carriers',
                              type : 'object',
                              width : 100,
                              headerCellClass : $scope.highlightFilteredHeader
                            }, {
                              field : 'status',
                              type : 'string',
                              width : 120,
                              headerCellClass : $scope.highlightFilteredHeader
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true,
                                cellClass : 'number'
                            }
                        ];
                    
                    var reduce = function(networkElement) {
                      // console.log('htLog:', networkElement);
                      var agg = (networkElement._source.aggregator !== undefined) && networkElement._source.aggregator.isAggregator;
var v99 = 0;
var rumpf = 0;
var e1Channels = 0;
var pathToAggregator = [];

if (networkElement._source.basisStation) {
  v99 = networkElement._source.basisStation.payLoadBandwidthV99;
  rumpf = networkElement._source.basisStation.payLoadBandwidthRumpf;
  e1Channels = networkElement._source.basisStation.e1Channels;
  pathToAggregator = networkElement._source.basisStation.path2Agg;
}

var carriers = {};
if (networkElement._source.carriers) {
  carriers = networkElement._source.carriers.xchannels;
}
                      
                      return {
                        id : networkElement._source.id.networkElementId,
                        site : networkElement._source.siteRef,
                      type : networkElement._source.type,
                        isAggregator: agg,
                        v99 : v99,
                        rumpf : rumpf,
                        e1Channels : e1Channels,
                        pathToAggregator : pathToAggregator,
                        carriers : carriers,
                        status : networkElement._source.lifeCycleStatus[0].catgegorie
//                        
//                        startNetworkElement : geNetworkElementId(path._source.startNe),
//                        endNetworkElement : geNetworkElementId(path._source.endNe),
//                        countE1 : parseInt(path._source.e1Anzahl),
//                        countSegments : path._source.pathSegments.length,
//                        path : $pathManager.getPath(path).toString().replace(/"/g, '')
                      };
                    };

                    var checkForMore = function() {
                      // console.log(0, 'sdf');
                      var done = (from >= numNetworkElements);
                      // console.log(0, done);
                      if (!done) {
                        // console.log(1,'not done');
                        from = from + maxSize;
                        $inventory.getNetworkElements($scope.dbIndex, maxSize, from, function(err, total, networkElements) {
                          if (err) {
                            done = true;
                            console.log('htLog:', err);
                            return;
                          }
                          networkElements.map(function(networkElement) {
                            $scope.gridOptions.data.push(reduce(networkElement));
                          });
                        });
                        checkForMore();
                      }
                    };
                    var initialize = function() {
console.info($inventory.name);
$inventory.getNetworkElements($scope.dbIndex, maxSize, from, function(err, total, networkElements) {
  if (err) {
    console.log('htLog:', err);
    return;
  }
  numNetworkElements = total;
  networkElements.map(function(networkElement) {
    $scope.gridOptions.data.push(reduce(networkElement));
  });
  checkForMore();
});

                    };
                    initialize();
                }
            ]
        });
    }
]);

htInventory.factory('$inventory', ['$database', function($database) {
  'use strict';

  var service = {};

  service.name = 'Inventory';

  service.getNetworkElements = function(dbIndex, size, from, callback) {
    var docType = {key: 'networkelement'};
    var sort;
    var filter;
    $database.getData(dbIndex, docType, size, from, sort, filter, function(data){
      if (!data || data.length ===0) {
        // nothing found or error
        callback('Nothing found!', []);
      } else {
        callback(null, data.hits.total, data.hits.hits);
      }
    });
  };

  return service;
}]);

var htLinkcalculator = angular.module('htLinkcalculator', [
  'ui.bootstrap', 'base64', 'htDatabase', 'ngCookies', 'htLogin', 'alert', 'translate'
]);
htLinkcalculator.config([
  '$stateProvider',
  function($stateProvider) {
    'use strict';
    $stateProvider.state('linkcalculator', {
      // abstract:
      // true,
      url : '/linkcalculator/:dbIndex/:high/:low/:mwrLinkId/:revision/:variant',
      templateUrl : 'modules/linkcalculator/linkcalculator.html',
      controller : [
        '$rootScope', '$scope', '$filter', '$http', '$stateParams', '$location', '$base64', '$database', '$mwrLink', '$networkMap', 'alertService', '$header',
        function($rootScope, $scope, $filter, $http, $stateParams, $location, $base64, $database, $mwrLink, $networkMap, alertService, $header) {

          $scope.dbIndex = $stateParams.dbIndex;
          if ($scope.dbIndex === 'sandbox') {
            $scope.dbIndex = 'networknordhorn';
          }
          $scope.siteLinkIdLow = $stateParams.low;
          $scope.siteLinkIdHigh = $stateParams.high;
          $scope.mwrLinkId = $stateParams.mwrLinkId;
          $scope.revision = $stateParams.revision;
          $scope.variant = $stateParams.variant;
          
          $scope.result = {output:{linkCalculation:null},message:'Please wait...'};

          $scope.displayId = '(';
          $scope.displayId += $stateParams.high;
          $scope.displayId += '-';
          $scope.displayId += $stateParams.low;
          $scope.displayId += '-';
          $scope.displayId += $stateParams.mwrLinkId;
          $scope.displayId += '-';
          $scope.displayId += $stateParams.revision;
          $scope.displayId += '-';
          $scope.displayId += $stateParams.variant;
          $scope.displayId += ') ';
          if ($scope.displayId === '(0-0-0-0-0) ') {
            $scope.displayId = '';
          }

          $rootScope.title = $scope.displayId + 'htLinkcalculator';

          $header.setStatus(alertService.processing());

          var id = {
            siteLinkId : {
              low : $scope.siteLinkIdLow,
              high : $scope.siteLinkIdHigh
            },
            mwrLinkId : $scope.mwrLinkId,
            revision : $scope.revision,
            variant : 0
          };

          $scope.resources = {
            radio : false,
            antenna : false,
            waveguide : false,
            mwrLink : false,
            getStatus : function() {
              // console.log(JSON.stringify(this));
              return this.radio && this.antenna && this.waveguide && this.mwrLink;
            }
          };

          var getPossibles = function(radioName) {
            if (!$scope.resources.getStatus()) {
              return;
            }
            var index = $scope.tables.radio.rows.map(function(radio) {
              return radio._source.model;
            }).indexOf(radioName);
            if (index === -1) {
              $scope.possible.modulationTypes = [];
              $scope.possible.configuration = [];
              $scope.linkDefinition.mwpA.mwChannel.band = 'BAND15';
              $scope.linkDefinition.mwpA.mwChannel.bandwidth = 'BW28';
            } else {
              var radio = $scope.tables.radio.rows[index]._source;
              $scope.possible.modulationTypes = Object.keys(radio.variants).map(function(type){
                var name = type;
                if (type.indexOf('MOD_') === 0) {
                  name = type.substring(4);
                }
                return {id:type, name: name};
              });
              // console.info('htLog', JSON.stringify($scope.possible.modulationTypes));
              $scope.possible.configuration = Object.keys(radio.config).map(function(config){
                var name = config;
                if (config.indexOf('CONF_') === 0) {
                  name = config.substring(5);
                }
                return {id:config, name: name};
              });
              $scope.possible.configuration.push({id:'CONF_NO', name:'NO'});

              if ($scope.linkDefinition.mwpA.mwChannel.band !== radio.band) {
                $scope.linkDefinition.mwpA.mwChannel.band = radio.band;
              }
              if ($scope.linkDefinition.mwpA.mwChannel.bandwidth !== radio.bandwidth) {
                $scope.linkDefinition.mwpA.mwChannel.bandwidth = radio.bandwidth;
              }
            }
          };
          var updateWaveguide = function(site, wgName) {
            if ($scope.tables.waveguide.rows === undefined || $scope.mwrLink === undefined || $scope.tables.waveguide.rows.length === 0) {
              return;
            }
            var index = $scope.tables.waveguide.rows.map(function(wg) {
              return wg._source.model;
            }).indexOf(wgName);
            if (index === -1) {
              $scope.waveguides[site].type = "FLEXIBLE";
              $scope.waveguides[site].min = 0.3;
              $scope.waveguides[site].max = 0.3;
            } else {
              var wg = $scope.tables.waveguide.rows[index]._source;
              $scope.waveguides[site].type = wg.type;
              $scope.waveguides[site].min = wg.minLength;
              $scope.waveguides[site].max = wg.maxLength;
              if (site === 'siteA') {
                  $scope.linkDefinition.sa.wg.lengthM = wg.maxLength;
              } else {
                  $scope.linkDefinition.sb.wg.lengthM = wg.maxLength;
              }
            }
          };

          alertService.setMessage([
            'CALCULATING', 'CALCULATION_OK', 'CALCULATION_FAILED'
          ]);
          $scope.tables = $database.tables;

          $scope.ignore = false;

          $scope.possible = {
            modulationTypes : [],
            configuration : [],
            update : getPossibles
          };
          $scope.waveguides = {
            siteA : {
              type : 'FLEXIBLE',
              min : 0.3,
              max : 0.3
            },
            siteB : {
              type : 'FLEXIBLE',
              min : 0.3,
              max : 0.3
            },
            update : updateWaveguide
          };

          $scope.searchRadio = {
            _source : {
              band : 'BAND18',
              bandwidth : 'BW28'
            }
          };

          $database.getTableData($scope.dbIndex, 'radio', function(err, data) {
            if (err) {
              $header.setStatus(alertService.failed(err));
            } else {
              $scope.tables.radio.rows = data.rows;
              // $header.setStatus(alertService.success());
              $scope.resources.radio = true;
              updateResult();
            }
          });

          $scope.searchAntennas = {
            band : 'BAND18'
          };
          $database.getTableData($scope.dbIndex, 'antenna', function(err, data) {
            if (err) {
              $header.setStatus(alertService.failed(err));
            } else {
              $scope.tables.antenna.rows = data.rows;
              // $header.setStatus(alertService.success());
              $scope.resources.antenna = true;
              updateResult();
              // updateAntennas($scope.searchAntennas);
            }
          });

          $scope.searchWG = {
            band : 'BAND18'
          };
          $database.getTableData($scope.dbIndex, 'waveguide', function(err, data) {
            if (err) {
              $header.setStatus(alertService.failed(err));
            } else {
              $scope.tables.waveguide.rows = data.rows;
              // $header.setStatus(alertService.success());
              $scope.resources.waveguide = true;
              // updateWG($scope.searchWG);
              updateResult();
            }
          });

          angular.extend($scope, {
            mweLink : {
              exists : false
            },

            restURL : '/api/calculate',
            locations : {
              open : true
            },
            general : {
              open : true
            },
            defaultMwrLink : {
              "id" : {
                "siteLinkId" : {
                  "high" : "149990519",
                  "low" : "149990514"
                },
                "mwrLinkId" : "0",
                "revision" : "0",
                "variant" : "0"
              },
              "spa" : {
                "antPos" : -1,
                "siteRef" : {
                  "siteId" : "149990514"
                }
              },
              "spb" : {
                "antPos" : -1,
                "siteRef" : {
                  "siteId" : "149990519"
                }
              },
              "etoDo" : null,
              "lenKm" : 12.345,
              "sa" : {
                "loc" : {
                  "location" : {
                    "lon" : 6.80776,
                    "lat" : 52.50821
                  },
                  "amslGrd" : 46,
                  "sourceGeo" : "MWR",
                  "sourceAmsl" : "LOS"
                },
                "ant" : {
                  "name" : "SBX1-142BB",
                  "dia" : 0.3,
                  "currentAzimuth" : 343.532074,
                  "currentHightCL" : 49.2
                },
                "wg" : {
                  "name" : "E150 (15GHZ)",
                  "lengthM" : 2
                },
                "losses" : {
                  "other" : 0,
                  "attCom" : 0,
                  "attTx" : 0,
                  "attRx" : 0
                },
                "pr" : "REGION_1"
              },
              "sb" : {
                "loc" : {
                  "location" : {
                    "lon" : 6.7543,
                    "lat" : 52.61824
                  },
                  "amslGrd" : 13,
                  "sourceGeo" : "MWR",
                  "sourceAmsl" : "LOS"
                },
                "ant" : {
                  "name" : "SBX2-142CB",
                  "dia" : 0.6,
                  "currentAzimuth" : 163.489609,
                  "currentHightCL" : 37.15
                },
                "wg" : {
                  "name" : "E150 (15GHZ)",
                  "lengthM" : 5.5
                },
                "losses" : {
                  "other" : 0,
                  "attCom" : 0,
                  "attTx" : 0,
                  "attRx" : 0
                },
                "pr" : "REGION_1"
              },
              "capacity" : {
                "bwV99" : 0,
                "bwRumpf" : 0,
                "noE1" : 0,
                "noSTM1" : 0
              },
              "modDemand" : null,
              "fieldMargin" : null,
              "obstrLoss" : null,
              "fep" : null,
              "internalType" : "DBDO",
              "gu" : "GU_EMPTY",
              "toc" : {
                "year" : 2008,
                "no" : 10,
                "um" : "NORMAL"
              },
              "parManufacturer" : null,
              "radio" : {
                "name" : "SRAL xD HDe/HP 15-7",
                "currentTsl" : 16,
                "currentQam" : 4,
                "_currentModulation" : "MOD_4QAM",
                "_currentConfA" : "CONF_1_0_MK",
                "_currentConfB" : "CONF_1_0_MK"
              },
              "currentTsl" : null,
              "bGhz" : "BAND15",
              "channelStr" : null,
              "pol" : null,
              "layA" : null,
              "mwLink" : null,
              "mwParA" : null,
              "NENameAB" : "104301247A;Itterbeck;104301246A;B403-Eschebrugge",
              "fileNo" : -1,
              "isObsolete" : false,
              "xLinkReference" : null,
              "siteAId" : "149990514",
              "siteBId" : "149990519"
            },
            "linkDefinition" : {
              "mWType" : "PDH",
              "lenKm" : 12.345,
              "fm" : 1.0,
              "obstructionLoss" : 0.0,
              "mwpA" : {
                "mwChannel" : {
                  "band" : "BAND15",
                  "bandwidth" : "BW7",
                  "channel" : 1
                },
                "bandhalf" : "HIGH",
                "polarization" : "V"
              },
              "mwpB" : {
                "mwChannel" : {
                  "band" : "BAND15",
                  "bandwidth" : "BW7",
                  "channel" : 1
                },
                "bandhalf" : "LOW",
                "polarization" : "V"
              },
              "radio" : {
                "name" : "SRAL xD HDe/HP 15-7",
                "currentTsl" : 0.0,
                "currentQam" : 4,
                "_radio" : null,
                "_currentModulation" : null,
                "_currentConfA" : null,
                "_currentConfB" : null
              },
              "sa" : {
                "loc" : {
                  "location" : {
                    "lon" : 13.144174,
                    "lat" : 52.420421
                  },
                  "amslGrd" : 0.0,
                  "sourceGeo" : "UNKNOWN",
                  "sourceAmsl" : "UNKNOWN"
                },
                "ant" : {
                  "name" : "SBX1-142BB",
                  "currentAzimuth" : 120.0,
                  "currentHightCL" : 50.0,
                  "dia" : 0.3,
                  "antFromTable" : null
                },
                "wg" : {
                  "name" : "E150 (15GHZ)",
                  "lengthM" : 2.1
                },
                "losses" : {
                  "other" : 0.0,
                  "attCom" : 0.0,
                  "attTx" : 0.0,
                  "attRx" : 0.0
                },
                "pr" : "REGION_1"
              },
              "sb" : {
                "loc" : {
                  "location" : {
                    "lon" : 13.127732,
                    "lat" : 52.417748
                  },
                  "amslGrd" : 0.0,
                  "sourceGeo" : "UNKNOWN",
                  "sourceAmsl" : "UNKNOWN"
                },
                "ant" : {
                  "name" : "SBX2-142CB",
                  "currentAzimuth" : 240.0,
                  "currentHightCL" : 40.0,
                  "dia" : 0.3,
                  "antFromTable" : null
                },
                "wg" : {
                  "name" : "E150 (15GHZ)",
                  "lengthM" : 0.9
                },
                "losses" : {
                  "other" : 0.0,
                  "attCom" : 0.0,
                  "attTx" : 0.0,
                  "attRx" : 0.0
                },
                "pr" : "REGION_1"
              }
            }
          });

          var updateResult = function() {
            if (!$scope.resources.getStatus()) {
              return;
            }

            $header.setStatus(alertService.processing());
            var req = {
              method : 'POST',
              url : $scope.restURL,
              headers : {
                'Content-Type' : 'application/json'
              },
              data : {
                input : {
                  linkDefinition : JSON.parse(JSON.stringify($scope.linkDefinition))
                }
              },
            };
            delete req.data.input.linkDefinition.mwpB;
            $http(req).success(function(data) {
              $scope.result = data;
              $scope.error = undefined;
              if ($scope.result.output.message !== 'OK'){
                $header.setStatus(alertService.warning());
              } else {
                 $header.setStatus(alertService.success());
              }
//              if ($scope.result.output.linkCalculation.avl === 100) {
//                $scope.result.type = 'warning';
//              } else if ($scope.result.output.linkCalculation.avl > 99.5) {
//                $scope.result.type = 'success';
//              } else {
//                $scope.result.type = 'danger';
//              }

            }).error(function(data, status) {
              $scope.result = {};
//              $scope.error = data.errorMessage;
              $header.setStatus(alertService.failed(status));
              $scope.result.type = 'error';
              // console.log(data);
            });
          };

          var updateMwrLink = function(mwrLink) {

            // console.info(JSON.stringify(mwrLink));
            $scope.mwrLink = mwrLink;
            $networkMap.getSitesByIds($scope.dbIndex, [mwrLink.spa.siteRef.siteId, mwrLink.spb.siteRef.siteId], function(sites){
              // console.info(JSON.stringify(sites));
              if (mwrLink.spa.siteRef.siteId === sites[0]._source.id.siteId) {
                $scope.siteA = sites[0];
                $scope.siteB = sites[1];
              } else {
                $scope.siteA = sites[1];
                $scope.siteB = sites[0];
              }
            });
//            $networkMap.getSiteLink($scope.dbIndex, id.siteLinkId, function(siteLink) {
//              $scope.siteLink = siteLink;
//            });

            if ($scope.mwrLink.mwLinkDefinitionBuilder.bGhz !== null && $scope.mwrLink.mwLinkDefinitionBuilder.bGhz !== undefined) {
              
              if ($scope.mwrLink.radio) {
                $scope.possible.update($scope.mwrLink.radio.name);
              }
              $scope.linkDefinition.radio = $scope.mwrLink.radio;
              
            }
            $scope.linkDefinition.sa = $scope.mwrLink.mwLinkDefinitionBuilder.sa;
            $scope.linkDefinition.sb = $scope.mwrLink.mwLinkDefinitionBuilder.sb;

            $scope.linkDefinition.lenKm = $scope.mwrLink.lenKm;

            
            $scope.mwrLink.exists = (mwrLink.id.mwrLinkId !== "0");
            $scope.resources.mwrLink = true; // (mwrLink.id.mwrLinkId !== "0");
            updateResult();
          };
          
          $scope.$watch('mwrLinkId', function(v) {
            if (v !== undefined && parseInt(v) !== 0) {
              $mwrLink.get($scope.dbIndex, id, function(err, mwrLink) {
                updateMwrLink(mwrLink);
              });
            } else {
              $mwrLink.get($scope.dbIndex, id, function(err, mwrLink) {
                console.log('htLog:', err, mwrLink);
                updateMwrLink($scope.defaultMwrLink);
              });
            }
          });

          $scope.$watch('linkDefinition.mWType', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.lenKm', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.fm', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.obstructionLoss', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.radio.name', function(v) {
            if (v !== undefined && v !== 0) {
              // console.log('linkDefinition.radio.name');
              $scope.possible.update(v);
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.radio.currentTsl', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.radio.currentQam', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.radio._currentModulation', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.radio._currentConfA', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.radio._currentConfB', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          var updateRadio = function(filter) {
            var result = $filter('filter')($scope.tables.radio.rows, filter);
            if (result !== undefined && result.length > 0 && $scope.mwrLink !== undefined) {
              var index = result.map(function(radio) {
                return radio._source.model;
              }).indexOf($scope.mwrLink.radio.name);
              // console.log(filter, result, index);
              if (index === -1) {
                console.info('htLog:', 'DONT GO HERE');
                $scope.linkDefinition.radio.name = result[0]._source.model;
              }
            } else {
              $scope.linkDefinition.radio.name = null;
            }
          };

          var updateAntennas = function(filter) {
            var result = $filter('filter')($scope.tables.antenna.rows, filter);
            if (result !== undefined && result.length > 0 && $scope.mwrLink !== undefined) {
              // siteA
              var indexA = result.map(function(radio) {
                return radio._source.model;
              }).indexOf($scope.mwrLink.sa.ant.name);
              if (indexA === -1) {
                $scope.linkDefinition.sa.ant.name = result[0]._source.model;
              }
              // siteB
              var indexB = result.map(function(radio) {
                return radio._source.model;
              }).indexOf($scope.mwrLink.sb.ant.name);
              if (indexB === -1) {
                $scope.linkDefinition.sb.ant.name = result[0]._source.model;
              }
            } else {
              $scope.linkDefinition.sa.ant.name = null;
              $scope.linkDefinition.sb.ant.name = null;
            }
          };

          var updateWG = function(filter) {
            var result = $filter('filter')($scope.tables.waveguide.rows, filter);
            if (result !== undefined && result.length > 0 && $scope.mwrLink !== undefined) {
              // siteA
              var indexA = result.map(function(radio) {
                return radio._source.model;
              }).indexOf($scope.mwrLink.sa.wg.name);
              if (indexA === -1) {
                $scope.linkDefinition.sa.wg = {name : result[0]._source.model, lengthM : result[0]._source.maxLength };
              }
              // siteB
              var indexB = result.map(function(radio) {
                return radio._source.model;
              }).indexOf($scope.mwrLink.sb.wg.name);
              if (indexB === -1) {
                $scope.linkDefinition.sb.wg = {name : result[0]._source.model, lengthM : result[0]._source.maxLength };
              }
            } else {
              $scope.linkDefinition.sa.wg = {name : null, lengthM : 0 };
              $scope.linkDefinition.sb.wg = {name : null, lengthM : 0 };
            }
          };

          $scope.$watch('linkDefinition.mwpA.mwChannel.band', function(v) {

            var bandwidth = $scope.linkDefinition.mwpA.mwChannel.bandwidth;
            $scope.searchRadio = {
              _source : {
                band : v,
                bandwidth : bandwidth
              }
            };
            updateRadio($scope.searchRadio);

            $scope.searchAntennas = {
              _source : {
                band : v
              }
            };
            updateAntennas($scope.searchAntennas);

            $scope.searchWG = {
              _source : {
                band : v
              }
            };
            updateWG($scope.searchWG);

            if (v !== undefined && v !== 0) {
              $scope.linkDefinition.mwpB.mwChannel.band = v;
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.mwpA.mwChannel.bandwidth', function(v) {

            var band = $scope.linkDefinition.mwpA.mwChannel.band;
            $scope.searchRadio = {
              _source : {
                band : band,
                bandwidth : v
              }
            };
            updateRadio($scope.searchRadio);

            if (v !== undefined && v !== 0) {
              $scope.linkDefinition.mwpB.mwChannel.bandwidth = v;
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.mwpA.mwChannel.channel', function(v) {
            $scope.linkDefinition.mwpB.mwChannel.channel = v;
            if (v !== undefined && v !== 0) {
              $scope.linkDefinition.mwpB.mwChannel.channel = v;
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.mwpA.bandhalf', function(v) {
            if (v !== undefined && v !== 0) {
              if (v === 'LOW') {
                $scope.linkDefinition.mwpB.bandhalf = 'HIGH';
              } else {
                $scope.linkDefinition.mwpB.bandhalf = 'LOW';
              }
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.mwpA.polarization', function(v) {
            if (v !== undefined && v !== 0) {
              $scope.linkDefinition.mwpB.polarization = v;
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.ant.currentHightCL', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.losses.other', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.losses.attCom', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.losses.attTx', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.losses.attRx', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.loc.location.lat', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.loc.location.lon', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.loc.amslGrd', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.ant.name', function(v) {

            var filter = {
              _source: {
                 model : v
              }
            };
            var result = $filter('filter')($scope.tables.antenna.rows, filter);
            if (result !== undefined && result.length > 0) {
              $scope.linkDefinition.sa.ant.dia = result[0]._source.dia;
            } else {
              console.info('htLog:', 'Antenna not found!');
              $scope.linkDefinition.sa.ant.dia = 0.0;
            }

            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.ant.azimuth', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.ant.mountingPosition', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          // $scope.$watch('linkDefinition.sa.ant.dia',
          // function(v) {
          // if (v !== undefined && v !== 0) {
          // updateResult();
          // }
          // });
          //
          $scope.$watch('linkDefinition.sa.wg.name', function(v) {

            $scope.waveguides.update('siteA', v);
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sa.wg.lengthM', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.ant.currentHightCL', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.losses.other', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.losses.attCom', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.losses.attTx', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.losses.attRx', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.loc.location.lat', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.loc.location.lon', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.loc.amslGrd', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.ant.name', function(v) {

            var filter = {
              _source: {
                 model : v
              }
            };
            var result = $filter('filter')($scope.tables.antenna.rows, filter);
            if (result !== undefined && result.length > 0) {
              $scope.linkDefinition.sb.ant.dia = result[0]._source.dia;
            } else {
              console.info('htLog:', 'Antenna not found!');
              $scope.linkDefinition.sb.ant.dia = 0.0;
            }

            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.ant.azimuth', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.ant.mountingPosition', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          // $scope.$watch('linkDefinition.sb.ant.diameter',
          // function(v) {
          // if (v !== undefined && v !== 0) {
          // updateResult();
          // }
          // });
          //
          $scope.$watch('linkDefinition.sb.wg.name', function(v) {

            $scope.waveguides.update('siteB', v);
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          $scope.$watch('linkDefinition.sb.wg.lengthM', function(v) {
            if (v !== undefined && v !== 0) {
              updateResult();
            }
          });

          updateResult();

        }
      ]
    });
  }
]);

/**
 * angular.js for htMbhPlanner
 */
var htMbhPlanner =
                angular.module('htMbhPlanner', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'htLogin', 'alert', 'translate'
                ]);



htMbhPlanner.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('mbhPlanner', {
            // abstract:
            // true,
            url : '/mbhPlanner/:dbIndex',
            templateUrl : '/ux/modules/mbhPlanner/mbhPlanner.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                '$mbhPlanner',
                function($rootScope, $scope, $stateParams, $mbhPlanner) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htMbhPlanner';
                    
                    var actionCellTemplate = '<a class="vCenter" >' + 
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>' +
                    '</a>';

                    $scope.gridOptions = {};
                    $scope.gridOptions.data = [];
                    $scope.gridOptions.enableColumnResizing = true;
                    $scope.gridOptions.enableSorting = true;
                    $scope.gridOptions.enableFiltering = true;
                    $scope.gridOptions.enableGridMenu = true;
                    $scope.gridOptions.showGridFooter = true;
                    // $scope.gridOptions.showColumnFooter = true;
                    $scope.gridOptions.fastWatch = true;
                    $scope.gridOptions.enableRowSelection = true;
                    $scope.gridOptions.enableRowHeaderSelection = true;
                    $scope.gridOptions.multiSelect = false;

                    $scope.gridOptions.gridMenuCustomItems = [
                                           {
                                               title : 'Rotate Grid',
                                               action : function($event) {
                                                   console.log($event);
                                                   this.grid.element.toggleClass('rotated');
                                               },
                                               order : 210
                                           }
                                       ];
                    
                    $scope.gridOptions.columnDefs =  [
                            {
                                field : 'id',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width: 80,
                                pinnedLeft : true
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true
                            }
                        ];
                    var initialize = function() {
                      console.info($mbhPlanner.name);
                    };
                    initialize();
                }
            ]
        });
    }
]);

htMbhPlanner.factory('$mbhPlanner', function() {
    'use strict';

    var service = {};
    
    service.name = 'MBH Planner';

    return service;
});

/**
 * angular.js for htMwrLinkManager
 */
var htMwrLinkManager =
    angular.module('htMwrLinkManager', [
      'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.autoResize',
      'htLogin', 'htDatabase', 'alert', 'translate'
    ]);

htMwrLinkManager
    .config([
      '$stateProvider',
      function($stateProvider) {
        'use strict';
        $stateProvider
            .state(
                'mwrLinkManager',
                {
                  // abstract:
                  // true,
                  url : '/mwrLinkManager/:dbIndex',
                  templateUrl : '/ux/modules/mwrLinkManager/mwrLinkManager.html',
                  controller : [
                    '$rootScope',
                    '$scope',
                    '$stateParams',
                    '$window',
                    'uiGridConstants',
                    '$mwrLinkManager',
                    '$header',
                    'alertService',
                    function($rootScope, $scope, $stateParams, $window, uiGridConstants, $mwrLinkManager, $header, alertService) {
                      $scope.dbIndex = $stateParams.dbIndex;
                      $rootScope.title = 'htMwrLinkManager';

                      alertService.setMessage([
                                               'LOADING', 'SUCCESS', 'FAILED'
                                           ]);

                      var from = 0;
                      var maxSize = 1000;
                      var numMwrLinks = 0;

                      var actionCellTemplate =
                          [
                            '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >',
                            '<span ng-mouseenter="grid.appScope.hover=true" ng-mouseleave="grid.appScope.hover=false" ng-show="!row.entity.numMwrLinks" title="{{grid.appScope.getTitle(row.entity, 0)}}"  ng-click="grid.appScope.delete(row.entity)" class="pointer glyphicon glyphicon-trash"></span>',
                            '<span> </span>',
                            '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>',
                            '<span> </span>',
                            '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>',
                            '</a>'
                          ].join('');

                      $scope.getTableHeight = function() {
                        var rowHeight = 30; // your row height
                        var headerHeight = 30; // your header height
                        var displayedRows = ($window.innerHeight - 300)/rowHeight;
                        return {
                           height: (displayedRows * rowHeight + headerHeight) + 'px'
                        };
                     };
                     $scope.gridHeight = $scope.getTableHeight();
                     $scope.$watch(function(){
                       return $window.innerHeight;
                     }, function(value) {
                       console.info('htLog:', value);
                       $scope.gridHeight = $scope.getTableHeight();
                     });                     
                     
                     $scope.highlightFilteredHeader = function(row, rowRenderIndex, col) {
                        if (col.filters[0].term) {
                          return 'header-filtered';
                        } else {
                          return '';
                        }
                      };

                      $scope.show = function(row) {
                        var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?sitelink=' + row.siteLink;
                        window.open(link, 'htNetworkMap');
                      };

                      $scope.open = function(row) {
                        var link = ['/ux', '#', 'mwrLinkRevision', $scope.dbIndex, row.siteLink.replace('-', '/'), row.mwrLinkId, '0'].join('/');
                        window.open(link, 'htSolutions');
                      };

                      $scope.gridOptions = {};
                      $scope.gridOptions.data = [];
                      $scope.gridOptions.enableColumnResizing = true;
                      $scope.gridOptions.enableSorting = true;
                      $scope.gridOptions.enableFiltering = true;
                      $scope.gridOptions.enableGridMenu = true;
                      $scope.gridOptions.showGridFooter = true;
                      // $scope.gridOptions.showColumnFooter = true;
                      $scope.gridOptions.fastWatch = true;
                      $scope.gridOptions.enableRowSelection = true;
                      $scope.gridOptions.enableRowHeaderSelection = true;
                      $scope.gridOptions.multiSelect = false;

                      $scope.gridOptions.gridMenuCustomItems = [
                        {
                          title : 'Rotate Grid',
                          action : function($event) {
                            console.log($event);
                            this.grid.element.toggleClass('rotated');
                          },
                          order : 210
                        }
                      ];

                      $scope.gridOptions.columnDefs = [
                        {
                          field : 'siteLink',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 180,
                          pinnedLeft : true
                        }, {
                          field : 'mwrLinkId',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          pinnedLeft : true
                        }, {
                          field : 'siteA',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100
                        }, {
                          field : 'siteB',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100
                        }, {
                          field : 'mountingPositionA',
                          type : 'number',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'currentHightCLA',
                          type : 'number',
                          displayName: 'CL A [m]',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'mountingPositionB',
                          type : 'number',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'currentHightCLB',
                          type : 'number',
                          displayName: 'CL B [m]',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'length',
                          type : 'number',
                          displayName : 'Length [km]',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'comesFrom',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 180
                        }, {
                          field : 'goesTo',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 180
                        }, {
                          field : 'replacementStep',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 180
                        }, {
                          name : 'actions',
                          enableSorting : false,
                          enableFiltering : false,
                          cellClass : 'number',
                          cellTemplate : actionCellTemplate,
                          width : 95,
                          pinnedRight : true
                        }
                      ];
                      
                      var getComesFrom = function(mwrLink) {
                        if (mwrLink.reuseResultDeconstuctedLink !== null) {
                           return mwrLink.reuseResultDeconstuctedLink.linkRef.mwrLinkId;
                        }
                        return '';
                      };
                      
                      var getGoesTo = function(mwrLink) {
                        if (mwrLink.reuseResultNewLink !== null) {
                           return mwrLink.reuseResultNewLink.linkRef.mwrLinkId;
                        }
                        return '';
                      };
                      
                      var getReplacementStep = function(mwrLink) {
                        var list = [];
                        if (mwrLink.reuseResultDeconstuctedLink !== null) {
                          list.push(mwrLink.reuseResultDeconstuctedLink.passIdentification);
                        }
                        if (mwrLink.reuseResultNewLink !== null) {
                          list.push(mwrLink.reuseResultNewLink.passIdentification);
                        }
                        return list.join(', ');
                      };
 
                      var reduce = function(mwrLink) {
                        var clA = parseFloat(mwrLink._source.mwLinkDefinitionBuilder.sa.ant.currentHightCL);
                        var clB = parseFloat(mwrLink._source.mwLinkDefinitionBuilder.sb.ant.currentHightCL);
                        var comesFrom = getComesFrom(mwrLink._source);
                        var goesTo = getGoesTo(mwrLink._source);
                        var replacementStep = getReplacementStep(mwrLink._source);
                        
                        return {
                          siteLink : mwrLink._source.id.siteLinkId.high + '-' + mwrLink._source.id.siteLinkId.low,
                          mwrLinkId : mwrLink._source.id.mwrLinkId,
                          siteA : mwrLink._source.spa.siteRef.siteId,
                          siteB : mwrLink._source.spb.siteRef.siteId,
                          mountingPositionA : mwrLink._source.spa.antPos,
                          currentHightCLA : clA.toFixed(1),
                          mountingPositionB : mwrLink._source.spb.antPos,
                          currentHightCLB : clB.toFixed(1),
                          length: mwrLink._source.lenKm.toFixed(3),
                          revisionType: mwrLink._source.revisionType,
                          revisionStatus: mwrLink._source.revisionStatus,
                          comesFrom: comesFrom,
                          goesTo: goesTo,
                          replacementStep: replacementStep
                        };
                      };

                      var checkForMore = function() {
                        // console.log(0, 'sdf');
                        var done = (from >= numMwrLinks);
                        // console.log('htLog: ', from, numMwrLinks, done);
                        if (!done) {
                          // console.log(1,'not done');
                          from = from + maxSize;
                          $mwrLinkManager.getMwrLinks($scope.dbIndex, from, maxSize, function(err, total, mwrLinks) {
                            if (err) {
                              done = true;
                              console.log('htLog:', err);
                              return;
                            }
                            mwrLinks.map(function(mwrLink) {
                              $scope.gridOptions.data.push(reduce(mwrLink));
                            });
                            $scope.progressbar.value = $scope.gridOptions.data.length;
                            if (total <= $scope.gridOptions.data.length ) {
                              $header.setStatus(alertService.success());
                           }
                          });
                          checkForMore();
                        }
                      };
                      var initialize = function() {
                        $header.setStatus(alertService.processing());
                        $mwrLinkManager.getMwrLinks($scope.dbIndex, from, maxSize, function(err, total, mwrLinks) {
                          if (err) {
                            console.log('htLog:', err);
                            return;
                          }
                          numMwrLinks = total;
                          mwrLinks.map(function(mwrLink) {
                            $scope.gridOptions.data.push(reduce(mwrLink));
                          });
                          $scope.progressbar = {max: total, value: $scope.gridOptions.data.length};
                          if (total <= $scope.gridOptions.data.length ) {
                            $header.setStatus(alertService.success());
                         }
                          checkForMore();
                        });
                      };
                      initialize();
                    }
                  ]
                });
      }
    ]);

htMwrLinkManager.factory('$mwrLinkManager', ['$database', function($database) {
  'use strict';

  var service = {};

  service.getMwrLinks = function(dbIndex, from, size, callback) {
	var sort;
	var filter;
    $database.getData(dbIndex, {key:'mwrlinkrevisionvariant'}, size, from, sort, filter, function(data) {
      console.log('htLog:', data);
      return callback(null, data.hits.total, data.hits.hits);
    });
  };

  return service;
}]);

/**
 * angular.js for htProfil
 */
var htMwrLinkRevision = angular.module('htMwrLinkRevision', [
    'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);
htMwrLinkRevision.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('mwrLinkRevision', {
            // abstract:
            // true,
            url : '/mwrLinkRevision/:dbIndex/:high/:low/:mwrLinkId/:revision',
            templateUrl : 'modules/mwrLinkRevision/mwrLinkRevision.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$filter', 
                '$uibModal', 
                '$base64', 
                '$stateParams', 
                '$mwrLink', 
                'authenticationService', 
                'alertService',
                '$header',
                function($rootScope, $scope, $filter, $uibModal, $base64, $stateParams, $mwrLink, authenticationService, alertService, $header) {

                    $scope.dbIndex = $stateParams.dbIndex;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    $scope.mwrLinkId = $stateParams.mwrLinkId;
                    $scope.revision = $stateParams.revision;
                    // $scope.variant = $stateParams.variant;
                    $scope.displayId = $stateParams.high + '-' + $stateParams.low + '-' + $stateParams.mwrLinkId + '-' + $stateParams.revision; // + '-' + $stateParams.variant;
                    $rootScope.title = '(' + $scope.displayId + ') htMwrLinkRevision';

                    $scope.mwrLinkRevision = {};

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.processing());

                    $scope.oneAtATime = true;
                    $scope.groups = [
                      {
                        labelId : 'INFORMATION',
                        templateUrl : '/ux/modules/mwrLinkRevision/templates/info.html',
                        open : true
                      }, {
                        labelId : 'RAW_DATA',
                        templateUrl : '/ux/modules/mwrLinkRevision/templates/rawData.html',
                        open : false
                      }
                    ];

                    var id = {
                        siteLinkId : {
                            low : $scope.siteLinkIdLow,
                            high : $scope.siteLinkIdHigh
                        },
                        mwrLinkId : $scope.mwrLinkId,
                        revision : $scope.revision,
                        variant : 0
                    };

                    $mwrLink.get($scope.dbIndex, id, function(err, mwrLink) {
                        if (err) {
                            $header.setStatus(alertService.failed(err + ' ' + id));
                        } else {
                            $scope.mwrLinkRevision = mwrLink;
                            $header.setStatus(alertService.success());
                        }
                    });

                }
            ]
        });
    }
]);

/**
 * angular.js for htNetworkElementDetails
 */
var htNetworkElementDetails = angular.module('htNetworkElementDetails', [
  'ui.bootstrap', 'alert'
]);

htNetworkElementDetails.config([
  '$stateProvider',
  function($stateProvider) {
    'use strict';
    $stateProvider.state('htNetworkElementDetails', {
      // abstract:
      // true,
      url : '/networkElements/:dbIndex/:id',
      templateUrl : 'modules/networkElementDetails/networkElementDetails.html',
      controller : [
        '$rootScope', '$scope', '$stateParams', '$networkElementDetails', 'uiGridConstants', '$bsConnections', 'authenticationService', 'alertService', '$header',
        function($rootScope, $scope, $stateParams, $networkElementDetails, uiGridConstants, $bsConnections, authenticationService, alertService, $header) {

          alertService.setMessage([
            'LOADING', 'SUCCESS', 'FAILED'
          ]);

          $scope.dbIndex = $stateParams.dbIndex;
          $scope.networkElementId = $stateParams.id;
          $rootScope.title = '(' + $scope.networkElementId + ') htSolutions';

          $scope.oneAtATime = true;
          $scope.groups = [
                           {
                               labelId : 'INFO',
                               templateUrl : '/ux/modules/networkElementDetails/templates/info.html',
                               open : true
                           },
                           {
                               labelId : 'BS_CONNECTIONS',
                               templateUrl : '/ux/modules/networkElementDetails/templates/bsConnections.html',
                               open : false
                           },
                           {
                               labelId : 'RAW_DATA',
                               templateUrl : '/ux/modules/networkElementDetails/templates/rawData.html',
                               open : false
                             }
          ];

          $scope.networkElement = {
            model : {},
            get : function(dbIndex, id, callback) {
              $header.setStatus(alertService.processing());
              $networkElementDetails.getNetworkElement(dbIndex, id, function(networkElement) {
                $header.setStatus(alertService.success());
                console.info('htLog:', id, JSON.stringify(networkElement));
                $scope.networkElement.model = networkElement._source;
                
                if (networkElement._source.basisStation) {
                	$networkElementDetails.getBsConnections(dbIndex, id, function(bsConnections) {
                		//console.log('length', bsConnections.length);
                		$scope.gridOptions.data = [];
                		bsConnections.map(function(bsConnection) {
                			$bsConnections.getSitePath(dbIndex, bsConnection._source.ROUID, function(sitePath){
                				$scope.gridOptions.data.push(reduce(bsConnection, sitePath));
                			});
                        });
                	});
                }
                return callback($scope.networkElement.model);
              });
            },
            getPrevious : function(dbIndex, id, callback) {
              $networkElementDetails.getPreviousNetworkElement(dbIndex, id, function(networkElement) {
                console.log('123', JSON.stringify(networkElement));
                if (networkElement === undefined) {
                  return callback();
                } 
                return callback(networkElement._source.id.networkElementId);
              });          
            },
            getNext : function(dbIndex, id, callback) {
              $networkElementDetails.getNextNetworkElement(dbIndex, id, function(networkElement) {
                if (networkElement === undefined) {
                  return callback();
                } 
                return callback(networkElement._source.id.networkElementId);
              });          
            }
          };

          // bsConnectionGrid
          $scope.gridOptions = {};
          $scope.gridOptions.data = [];
          $scope.gridOptions.enableColumnResizing = true;
          $scope.gridOptions.enableSorting = true;
          $scope.gridOptions.enableFiltering = false;
          $scope.gridOptions.enableGridMenu = true;
          $scope.gridOptions.showGridFooter = true;
          // $scope.gridOptions.showColumnFooter = true;
          $scope.gridOptions.fastWatch = true;
          $scope.gridOptions.enableRowSelection = true;
          $scope.gridOptions.enableRowHeaderSelection = true;
          $scope.gridOptions.multiSelect = true;

          $scope.gridOptions.gridMenuCustomItems = [
            {
              title : 'Rotate Grid',
              action : function($event) {
                console.log($event);
                this.grid.element.toggleClass('rotated');
              },
              order : 2100
            }
          ];
          $scope.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
          };          

          var message = [
                         'Delete', 'Show in network map', 'Show details'
                       ];
                       $scope.getTitle = function(value, msgId) {
                           var info = message[msgId] + ': ' + value;
                           return info;
                       };

                       $scope.show = function(value) {
                         var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?path=' + value;
                         window.open(link, 'htNetworkMap');
                       };

                       $scope.open = function(value) {
                         var link = '/ux/#/paths/' + $scope.dbIndex + '/' + value;
                         window.open(link, 'htSolutions');
                       };

                       $scope.showNetworkElement = function(value) {
                           var link = '/ux/#/networkElements/' + $scope.dbIndex + '/' + value;
                           window.open(link, 'htSolutions');
                       };

                       $scope.showSite = function(value) {
                          var link = '/ux/#/sites/' + $scope.dbIndex + '/' + value;
                          window.open(link, 'htSolutions');
                       };

          var defaultGridSort = {
                  direction: uiGridConstants.ASC,
                  priority: 1
                };
          var routeCellTemplate =
              [
               '<div class="ui-grid-cell-contents">',
               '<span>{{COL_FIELD}} </span>',
                '<a class="vCenter text-right" >',
                '<span title="{{grid.appScope.getTitle( row.entity[col.field] , 2)}}" ng-click="grid.appScope.open(row.entity[col.field])" class="pointer glyphicon glyphicon-info-sign"></span>',
                '<span> </span>',
                '<span title="{{grid.appScope.getTitle( row.entity[col.field] , 1)}}" ng-click="grid.appScope.show(row.entity[col.field])" class="pointer glyphicon glyphicon-map-marker"></span>',
                '</a>',
                '</div>'].join('');
          
          var networkElementCellTemplate =
              [
               '<div class="ui-grid-cell-contents">',
               '<span>{{COL_FIELD}} </span>',
               '<a class="vCenter text-right" >',
               '<span title="Show details of network element: {{COL_FIELD}}" ng-click="grid.appScope.showNetworkElement(row.entity[col.field])" class="pointer glyphicon glyphicon-info-sign"></span>',
               '</a>',
               '</div>'].join('');
          
          var siteCellTemplate = [
                                  '<div class="ui-grid-cell-contents">',
                                  '<span>{{COL_FIELD}} </span>',
                                  '<a class="vCenter text-right" >',
                                  '<span title="Show details of site: {{COL_FIELD}}" ng-click="grid.appScope.showSite(row.entity[col.field])" class="pointer glyphicon glyphicon-info-sign"></span>',
                                  '</a>',
                                  '</div>'].join('');
          // check Excel reference for semi auto code generation
          // add pinnedLeft : true, sort: defaultGridSort for id field
          $scope.gridOptions.columnDefs = [
{ pinnedLeft : true, sort: defaultGridSort,
 field: 'ROUID', displayName: 'ROUID', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : routeCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'SITEEND', displayName: 'SITEEND', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : siteCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEEND', displayName: 'NEEND', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : networkElementCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LEN', displayName: 'LEN', type: 'string', width: '*', minWidth: 60, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'PLANER', displayName: 'PLANER', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TYP', displayName: 'TYP', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'CAP', displayName: 'CAP', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'E1', displayName: 'E1', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'SITEPATH', displayName: 'SITEPATH', type: 'string', width: '*', minWidth: 300, maxWidth: 1000,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'PATHTOCNAME', displayName: 'PATHTOCNAME', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'SOURCE', displayName: 'SOURCE', type: 'string', width: '*', minWidth: 80, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO29B', displayName: 'TODO29B', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ASSESSMENT18Y', displayName: 'ASSESSMENT18Y', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'QUALITY18B', displayName: 'QUALITY18B', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ASSESSMENT56Y', displayName: 'ASSESSMENT56Y', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'QUALITY56Y', displayName: 'QUALITY56Y', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'EQUIPPING', displayName: 'EQUIPPING', type: 'string', width: '*', minWidth: 100, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
// {field: 'SITESTART', displayName: 'SITESTART', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : siteCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'SITESTARTPR', displayName: 'SITESTARTPR', type: 'string', width: '*', minWidth: 160, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'SITESTARTEPlus', displayName: 'SITESTARTEPlus', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
// {field: 'NESTART', displayName: 'NESTART', type: 'string', width: '*', minWidth: 140, maxWidth: 255, cellTemplate : networkElementCellTemplate, headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTTYPE', displayName: 'NESTARTTYPE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTSTATUS', displayName: 'NESTARTSTATUS', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTKAT', displayName: 'NESTARTKAT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTDUEDATE', displayName: 'NESTARTDUEDATE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTPRJNAME', displayName: 'NESTARTPRJNAME', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST29B', displayName: 'NESTARTST29B', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST18B', displayName: 'NESTARTST18B', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST56Y', displayName: 'NESTARTST56Y', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST56YCOMMENT', displayName: 'NESTARTST56YCOMMENT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST90', displayName: 'NESTARTST90', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST156Y', displayName: 'NESTARTST156Y', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST156YCOMMENT', displayName: 'NESTARTST156YCOMMENT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NESTARTST190', displayName: 'NESTARTST190', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDTYPE', displayName: 'NEENDTYPE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDDUEDATE', displayName: 'NEENDDUEDATE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDKAT', displayName: 'NEENDKAT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDST62W', displayName: 'NEENDST62W', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDST90', displayName: 'NEENDST90', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDFT', displayName: 'NEENDFT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDFTTYPE', displayName: 'NEENDFTTYPE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDFTDUEDATE', displayName: 'NEENDFTDUEDATE', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDFTKAT', displayName: 'NEENDFTKAT', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDFTST76', displayName: 'NEENDFTST76', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'NEENDFTST90', displayName: 'NEENDFTST90', type: 'string', width: '*', minWidth: 120, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_01', displayName: 'USRLINK_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_01', displayName: 'LINKREV_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_01', displayName: 'LINKVAR_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_01', displayName: 'STATUS_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_01', displayName: 'ST82S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_01', displayName: 'ST85S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_01', displayName: 'ST90S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_01', displayName: 'ST95S_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_01', displayName: 'TDCN_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_01', displayName: 'TODO_01', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_02', displayName: 'USRLINK_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_02', displayName: 'LINKREV_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_02', displayName: 'LINKVAR_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_02', displayName: 'STATUS_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_02', displayName: 'ST82S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_02', displayName: 'ST85S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_02', displayName: 'ST90S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_02', displayName: 'ST95S_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_02', displayName: 'TDCN_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_02', displayName: 'TODO_02', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_03', displayName: 'USRLINK_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_03', displayName: 'LINKREV_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_03', displayName: 'LINKVAR_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_03', displayName: 'STATUS_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_03', displayName: 'ST82S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_03', displayName: 'ST85S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_03', displayName: 'ST90S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_03', displayName: 'ST95S_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_03', displayName: 'TDCN_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_03', displayName: 'TODO_03', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_04', displayName: 'USRLINK_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_04', displayName: 'LINKREV_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_04', displayName: 'LINKVAR_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_04', displayName: 'STATUS_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_04', displayName: 'ST82S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_04', displayName: 'ST85S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_04', displayName: 'ST90S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_04', displayName: 'ST95S_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_04', displayName: 'TDCN_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_04', displayName: 'TODO_04', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_05', displayName: 'USRLINK_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_05', displayName: 'LINKREV_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_05', displayName: 'LINKVAR_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_05', displayName: 'STATUS_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_05', displayName: 'ST82S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_05', displayName: 'ST85S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_05', displayName: 'ST90S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_05', displayName: 'ST95S_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_05', displayName: 'TDCN_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_05', displayName: 'TODO_05', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_06', displayName: 'USRLINK_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_06', displayName: 'LINKREV_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_06', displayName: 'LINKVAR_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_06', displayName: 'STATUS_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_06', displayName: 'ST82S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_06', displayName: 'ST85S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_06', displayName: 'ST90S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_06', displayName: 'ST95S_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_06', displayName: 'TDCN_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_06', displayName: 'TODO_06', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_07', displayName: 'USRLINK_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_07', displayName: 'LINKREV_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_07', displayName: 'LINKVAR_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_07', displayName: 'STATUS_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_07', displayName: 'ST82S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_07', displayName: 'ST85S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_07', displayName: 'ST90S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_07', displayName: 'ST95S_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_07', displayName: 'TDCN_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_07', displayName: 'TODO_07', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_08', displayName: 'USRLINK_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_08', displayName: 'LINKREV_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_08', displayName: 'LINKVAR_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_08', displayName: 'STATUS_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_08', displayName: 'ST82S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_08', displayName: 'ST85S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_08', displayName: 'ST90S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_08', displayName: 'ST95S_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_08', displayName: 'TDCN_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_08', displayName: 'TODO_08', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_09', displayName: 'USRLINK_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_09', displayName: 'LINKREV_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_09', displayName: 'LINKVAR_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_09', displayName: 'STATUS_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_09', displayName: 'ST82S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_09', displayName: 'ST85S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_09', displayName: 'ST90S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_09', displayName: 'ST95S_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_09', displayName: 'TDCN_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_09', displayName: 'TODO_09', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_10', displayName: 'USRLINK_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_10', displayName: 'LINKREV_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_10', displayName: 'LINKVAR_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_10', displayName: 'STATUS_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_10', displayName: 'ST82S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_10', displayName: 'ST85S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_10', displayName: 'ST90S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_10', displayName: 'ST95S_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_10', displayName: 'TDCN_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_10', displayName: 'TODO_10', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_11', displayName: 'USRLINK_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_11', displayName: 'LINKREV_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_11', displayName: 'LINKVAR_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_11', displayName: 'STATUS_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_11', displayName: 'ST82S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_11', displayName: 'ST85S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_11', displayName: 'ST90S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_11', displayName: 'ST95S_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_11', displayName: 'TDCN_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_11', displayName: 'TODO_11', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_12', displayName: 'USRLINK_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_12', displayName: 'LINKREV_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_12', displayName: 'LINKVAR_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_12', displayName: 'STATUS_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_12', displayName: 'ST82S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_12', displayName: 'ST85S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_12', displayName: 'ST90S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_12', displayName: 'ST95S_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_12', displayName: 'TDCN_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_12', displayName: 'TODO_12', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_13', displayName: 'USRLINK_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_13', displayName: 'LINKREV_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_13', displayName: 'LINKVAR_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_13', displayName: 'STATUS_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_13', displayName: 'ST82S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_13', displayName: 'ST85S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_13', displayName: 'ST90S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_13', displayName: 'ST95S_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_13', displayName: 'TDCN_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_13', displayName: 'TODO_13', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'USRLINK_14', displayName: 'USRLINK_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKREV_14', displayName: 'LINKREV_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'LINKVAR_14', displayName: 'LINKVAR_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'STATUS_14', displayName: 'STATUS_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST82S_14', displayName: 'ST82S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST85S_14', displayName: 'ST85S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST90S_14', displayName: 'ST90S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'ST95S_14', displayName: 'ST95S_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TDCN_14', displayName: 'TDCN_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader},
{field: 'TODO_14', displayName: 'TODO_14', type: 'string', width: '*', minWidth: 200, maxWidth: 255,  headerCellFilter:'translate', headerCellClass: $scope.highlightFilteredHeader}
          ];
          
          var reduce = function(bsConnection, sitePath) {
              return {
            	sitePath : sitePath,
              	ROUID  : bsConnection._source.ROUID,
              	PATHTOCNAME  : bsConnection._source.PATHTOCNAME,
              	SOURCE  : bsConnection._source.SOURCE,
              	PLANER  : bsConnection._source.PLANER,
              	TODO29B  : bsConnection._source.TODO29B,
              	ASSESSMENT18Y  : bsConnection._source.ASSESSMENT18Y,
              	QUALITY18B  : bsConnection._source.QUALITY18B,
              	ASSESSMENT56Y  : bsConnection._source.ASSESSMENT56Y,
              	QUALITY56Y  : bsConnection._source.QUALITY56Y,
              	EQUIPPING  : bsConnection._source.EQUIPPING,
              	SITESTART  : bsConnection._source.SITESTART,
              	SITESTARTPR  : bsConnection._source.SITESTARTPR,
              	SITESTARTEPlus  : bsConnection._source.SITESTARTEPlus,
              	NESTART  : bsConnection._source.NESTART,
              	NESTARTTYPE  : bsConnection._source.NESTARTTYPE,
              	NESTARTSTATUS  : bsConnection._source.NESTARTSTATUS,
              	NESTARTKAT  : bsConnection._source.NESTARTKAT,
              	NESTARTDUEDATE  : bsConnection._source.NESTARTDUEDATE,
              	NESTARTPRJNAME  : bsConnection._source.NESTARTPRJNAME,
              	NESTARTST29B  : bsConnection._source.NESTARTST29B,
              	NESTARTST18B  : bsConnection._source.NESTARTST18B,
              	NESTARTST56Y  : bsConnection._source.NESTARTST56Y,
              	NESTARTST56YCOMMENT  : bsConnection._source.NESTARTST56YCOMMENT,
              	NESTARTST90  : bsConnection._source.NESTARTST90,
              	NESTARTST156Y  : bsConnection._source.NESTARTST156Y,
              	NESTARTST156YCOMMENT  : bsConnection._source.NESTARTST156YCOMMENT,
              	NESTARTST190  : bsConnection._source.NESTARTST190,
              	SITEEND  : bsConnection._source.SITEEND,
              	NEEND  : bsConnection._source.NEEND,
              	NEENDTYPE  : bsConnection._source.NEENDTYPE,
              	NEENDDUEDATE  : bsConnection._source.NEENDDUEDATE,
              	NEENDKAT  : bsConnection._source.NEENDKAT,
              	NEENDST62W  : bsConnection._source.NEENDST62W,
              	NEENDST90  : bsConnection._source.NEENDST90,
              	NEENDFT  : bsConnection._source.NEENDFT,
              	NEENDFTTYPE  : bsConnection._source.NEENDFTTYPE,
              	NEENDFTDUEDATE  : bsConnection._source.NEENDFTDUEDATE,
              	NEENDFTKAT  : bsConnection._source.NEENDFTKAT,
              	NEENDFTST76  : bsConnection._source.NEENDFTST76,
              	NEENDFTST90  : bsConnection._source.NEENDFTST90,
              	TYP  : bsConnection._source.TYP,
              	CAP  : bsConnection._source.CAP,
              	E1  : bsConnection._source.E1,
              	LEN  : bsConnection._source.LEN,
              	SITEPATH  : bsConnection._source.SITEPATH,
              	USRLINK_01  : bsConnection._source.USRLINK_01,
              	LINKREV_01  : bsConnection._source.LINKREV_01,
              	LINKVAR_01  : bsConnection._source.LINKVAR_01,
              	STATUS_01  : bsConnection._source.STATUS_01,
              	ST82S_01  : bsConnection._source.ST82S_01,
              	ST85S_01  : bsConnection._source.ST85S_01,
              	ST90S_01  : bsConnection._source.ST90S_01,
              	ST95S_01  : bsConnection._source.ST95S_01,
              	TDCN_01  : bsConnection._source.TDCN_01,
              	TODO_01  : bsConnection._source.TODO_01,
              	USRLINK_02  : bsConnection._source.USRLINK_02,
              	LINKREV_02  : bsConnection._source.LINKREV_02,
              	LINKVAR_02  : bsConnection._source.LINKVAR_02,
              	STATUS_02  : bsConnection._source.STATUS_02,
              	ST82S_02  : bsConnection._source.ST82S_02,
              	ST85S_02  : bsConnection._source.ST85S_02,
              	ST90S_02  : bsConnection._source.ST90S_02,
              	ST95S_02  : bsConnection._source.ST95S_02,
              	TDCN_02  : bsConnection._source.TDCN_02,
              	TODO_02  : bsConnection._source.TODO_02,
              	USRLINK_03  : bsConnection._source.USRLINK_03,
              	LINKREV_03  : bsConnection._source.LINKREV_03,
              	LINKVAR_03  : bsConnection._source.LINKVAR_03,
              	STATUS_03  : bsConnection._source.STATUS_03,
              	ST82S_03  : bsConnection._source.ST82S_03,
              	ST85S_03  : bsConnection._source.ST85S_03,
              	ST90S_03  : bsConnection._source.ST90S_03,
              	ST95S_03  : bsConnection._source.ST95S_03,
              	TDCN_03  : bsConnection._source.TDCN_03,
              	TODO_03  : bsConnection._source.TODO_03,
              	USRLINK_04  : bsConnection._source.USRLINK_04,
              	LINKREV_04  : bsConnection._source.LINKREV_04,
              	LINKVAR_04  : bsConnection._source.LINKVAR_04,
              	STATUS_04  : bsConnection._source.STATUS_04,
              	ST82S_04  : bsConnection._source.ST82S_04,
              	ST85S_04  : bsConnection._source.ST85S_04,
              	ST90S_04  : bsConnection._source.ST90S_04,
              	ST95S_04  : bsConnection._source.ST95S_04,
              	TDCN_04  : bsConnection._source.TDCN_04,
              	TODO_04  : bsConnection._source.TODO_04,
              	USRLINK_05  : bsConnection._source.USRLINK_05,
              	LINKREV_05  : bsConnection._source.LINKREV_05,
              	LINKVAR_05  : bsConnection._source.LINKVAR_05,
              	STATUS_05  : bsConnection._source.STATUS_05,
              	ST82S_05  : bsConnection._source.ST82S_05,
              	ST85S_05  : bsConnection._source.ST85S_05,
              	ST90S_05  : bsConnection._source.ST90S_05,
              	ST95S_05  : bsConnection._source.ST95S_05,
              	TDCN_05  : bsConnection._source.TDCN_05,
              	TODO_05  : bsConnection._source.TODO_05,
              	USRLINK_06  : bsConnection._source.USRLINK_06,
              	LINKREV_06  : bsConnection._source.LINKREV_06,
              	LINKVAR_06  : bsConnection._source.LINKVAR_06,
              	STATUS_06  : bsConnection._source.STATUS_06,
              	ST82S_06  : bsConnection._source.ST82S_06,
              	ST85S_06  : bsConnection._source.ST85S_06,
              	ST90S_06  : bsConnection._source.ST90S_06,
              	ST95S_06  : bsConnection._source.ST95S_06,
              	TDCN_06  : bsConnection._source.TDCN_06,
              	TODO_06  : bsConnection._source.TODO_06,
              	USRLINK_07  : bsConnection._source.USRLINK_07,
              	LINKREV_07  : bsConnection._source.LINKREV_07,
              	LINKVAR_07  : bsConnection._source.LINKVAR_07,
              	STATUS_07  : bsConnection._source.STATUS_07,
              	ST82S_07  : bsConnection._source.ST82S_07,
              	ST85S_07  : bsConnection._source.ST85S_07,
              	ST90S_07  : bsConnection._source.ST90S_07,
              	ST95S_07  : bsConnection._source.ST95S_07,
              	TDCN_07  : bsConnection._source.TDCN_07,
              	TODO_07  : bsConnection._source.TODO_07,
              	USRLINK_08  : bsConnection._source.USRLINK_08,
              	LINKREV_08  : bsConnection._source.LINKREV_08,
              	LINKVAR_08  : bsConnection._source.LINKVAR_08,
              	STATUS_08  : bsConnection._source.STATUS_08,
              	ST82S_08  : bsConnection._source.ST82S_08,
              	ST85S_08  : bsConnection._source.ST85S_08,
              	ST90S_08  : bsConnection._source.ST90S_08,
              	ST95S_08  : bsConnection._source.ST95S_08,
              	TDCN_08  : bsConnection._source.TDCN_08,
              	TODO_08  : bsConnection._source.TODO_08,
              	USRLINK_09  : bsConnection._source.USRLINK_09,
              	LINKREV_09  : bsConnection._source.LINKREV_09,
              	LINKVAR_09  : bsConnection._source.LINKVAR_09,
              	STATUS_09  : bsConnection._source.STATUS_09,
              	ST82S_09  : bsConnection._source.ST82S_09,
              	ST85S_09  : bsConnection._source.ST85S_09,
              	ST90S_09  : bsConnection._source.ST90S_09,
              	ST95S_09  : bsConnection._source.ST95S_09,
              	TDCN_09  : bsConnection._source.TDCN_09,
              	TODO_09  : bsConnection._source.TODO_09,
              	USRLINK_10  : bsConnection._source.USRLINK_10,
              	LINKREV_10  : bsConnection._source.LINKREV_10,
              	LINKVAR_10  : bsConnection._source.LINKVAR_10,
              	STATUS_10  : bsConnection._source.STATUS_10,
              	ST82S_10  : bsConnection._source.ST82S_10,
              	ST85S_10  : bsConnection._source.ST85S_10,
              	ST90S_10  : bsConnection._source.ST90S_10,
              	ST95S_10  : bsConnection._source.ST95S_10,
              	TDCN_10  : bsConnection._source.TDCN_10,
              	TODO_10  : bsConnection._source.TODO_10,
              	USRLINK_11  : bsConnection._source.USRLINK_11,
              	LINKREV_11  : bsConnection._source.LINKREV_11,
              	LINKVAR_11  : bsConnection._source.LINKVAR_11,
              	STATUS_11  : bsConnection._source.STATUS_11,
              	ST82S_11  : bsConnection._source.ST82S_11,
              	ST85S_11  : bsConnection._source.ST85S_11,
              	ST90S_11  : bsConnection._source.ST90S_11,
              	ST95S_11  : bsConnection._source.ST95S_11,
              	TDCN_11  : bsConnection._source.TDCN_11,
              	TODO_11  : bsConnection._source.TODO_11,
              	USRLINK_12  : bsConnection._source.USRLINK_12,
              	LINKREV_12  : bsConnection._source.LINKREV_12,
              	LINKVAR_12  : bsConnection._source.LINKVAR_12,
              	STATUS_12  : bsConnection._source.STATUS_12,
              	ST82S_12  : bsConnection._source.ST82S_12,
              	ST85S_12  : bsConnection._source.ST85S_12,
              	ST90S_12  : bsConnection._source.ST90S_12,
              	ST95S_12  : bsConnection._source.ST95S_12,
              	TDCN_12  : bsConnection._source.TDCN_12,
              	TODO_12  : bsConnection._source.TODO_12,
              	USRLINK_13  : bsConnection._source.USRLINK_13,
              	LINKREV_13  : bsConnection._source.LINKREV_13,
              	LINKVAR_13  : bsConnection._source.LINKVAR_13,
              	STATUS_13  : bsConnection._source.STATUS_13,
              	ST82S_13  : bsConnection._source.ST82S_13,
              	ST85S_13  : bsConnection._source.ST85S_13,
              	ST90S_13  : bsConnection._source.ST90S_13,
              	ST95S_13  : bsConnection._source.ST95S_13,
              	TDCN_13  : bsConnection._source.TDCN_13,
              	TODO_13  : bsConnection._source.TODO_13,
              	USRLINK_14  : bsConnection._source.USRLINK_14,
              	LINKREV_14  : bsConnection._source.LINKREV_14,
              	LINKVAR_14  : bsConnection._source.LINKVAR_14,
              	STATUS_14  : bsConnection._source.STATUS_14,
              	ST82S_14  : bsConnection._source.ST82S_14,
              	ST85S_14  : bsConnection._source.ST85S_14,
              	ST90S_14  : bsConnection._source.ST90S_14,
              	ST95S_14  : bsConnection._source.ST95S_14,
              	TDCN_14  : bsConnection._source.TDCN_14,
              	TODO_14  : bsConnection._source.TODO_14
             };
            };
          
            var getLinkDef = function(networkElementId) {
              var r = {
                link: ['/ux', '#', 'networkElements', $scope.dbIndex, networkElementId].join('/'),
                title: networkElementId,
                active: networkElementId !== undefined
              };
              if (!networkElementId) {
                r.link = ['/ux', '#', ''].join('/');
                r.title = 'HOME';
              }
              return r;
            };

            $scope.showPathsInMap = function() {
              var pathSegments = $scope.gridApi.selection.getSelectedRows();
              if (pathSegments.length === 0) {
                pathSegments = $scope.gridOptions.data;
              }
              var pathIds = pathSegments.map(function(pathSegment){
                // console.log(JSON.stringify(pathSegment));
                return pathSegment.ROUID;
              });
              var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?path=' + pathIds.join('|');
              window.open(link, 'htNetworkMap');
            };
            
            var initialzed = function() {
            $scope.networkElement.get($scope.dbIndex, $scope.networkElementId, function(networkElement) {
              console.log('htLog:', networkElement);
            });
            $scope.networkElement.getPrevious($scope.dbIndex, $scope.networkElementId, function(networkElementId) {
              $scope.networkElement.previous = networkElementId;
              $header.setPrevious(getLinkDef(networkElementId)); 
            });
            $scope.networkElement.getNext($scope.dbIndex, $scope.networkElementId, function(networkElementId) {
              console.log('ääääääää ' + $scope.networkElementId + ' - ' + networkElementId);
              $scope.networkElement.next = networkElementId;
              $header.setNext(getLinkDef(networkElementId)); 
            });
          };
          
          initialzed();
        }
      ]
    });
  }
]);

// htNetworkElementDetails.controller('MountingPositionModifyCtrl',
// function($scope, $uibModalInstance, selectedMpRow) {
//
// $scope.mp = selectedMpRow;
//
// $scope.ok = function() {
// $uibModalInstance.close($scope.mp);
// };
//
// $scope.cancel = function() {
// $uibModalInstance.dismiss('cancel');
// };
// });
//
// htNetworkElementDetails.controller('MountingPositionAddCtrl',
// function($scope, $uibModalInstance, newMp) {
//
// $scope.mp = newMp;
//
// $scope.ok = function() {
// $uibModalInstance.close($scope.mp);
// };
//
// $scope.cancel = function() {
// $uibModalInstance.dismiss('cancel');
// };
// });

htNetworkElementDetails.factory('$networkElementDetails', ['$http', '$database', function($http, $database) {

  var getNeighborNetworkElement = function(dbIndex, networkElementId, filter, callback) {
    var field = Object.keys(filter)[0];
    var order = 'asc';
    if (filter[field].lt) {
      order = 'desc';
    }
      var url = [
                 '/db', dbIndex, 'networkelement', '_search'
      ].join('/');
      var data = {
         from : 0,
         size : 1,
         sort: [
                  {
                    networkElementId: {
                      order: order
                    }
                  }
                ],
         _source: {
           include: [field]
         },
         query : {
           constant_score: {
                 filter: {
                    range: filter
                 }
              }
         }
      };
      var req = getRequest('POST', url, data);
      console.log('789', JSON.stringify(req));
      $http(req).success(function(networkElement, status) {
        console.log('htLog: ', networkElement, status);
        return callback(networkElement.hits.hits[0]);
      }).error(function(data, status) {
        console.info("htLog: Request for path failed.", JSON.stringify(req), data, status);
        return callback([]);
      });
  };

  var getRequest = function(method, url, data) {
    return {
      method : method,
      url : url,
      headers : {
        'Content-Type' : 'application/json'
      },
      data : data
    };
  };

  var service = {};
  service.getBsConnections = function(dbIndex, networkElementId, callback) {
	  var docType = {key: 'bsconnections'};
	  var size = 99; // all
	  var from = 0;
	  var sort = {ROUID:{order:'asc'}};
	  var filter = {term: {NESTART: networkElementId}};
      $database.getData(dbIndex, docType, size, from, sort, filter, function(data){
        if (!data || data.length ===0) {
          // nothing found or error
          callback('Nothing found!', []);
        } else {
          callback(data.hits.hits);
        }
      });
  };
  
  service.getNetworkElement = function(dbIndex, networkElementId, callback) {
    var url = [
      '/db', dbIndex, 'networkelement', '_search'
    ].join('/');
    var data = {
      from : 0,
      size : 1,
      query : {
        match : {
          'id.networkElementId' : networkElementId
        }
      }
    };
    var req = getRequest('POST', url, data);
    $http(req).success(function(networkElement, status) {
      console.log(networkElement, status);
      return callback(networkElement.hits.hits[0]);
    }).error(function(data, status) {
      console.info("htLog: Request for networkElement failed.", JSON.stringify(req), data, status);
      return callback([]);
    });
  
    service.getPreviousNetworkElement = function(dbIndex, networkElementId, callback) {
      
      console.log('huhu');
      var filter = {'id.networkElementId': {lt: networkElementId}};
      getNeighborNetworkElement(dbIndex, networkElementId, filter, function(networkElement) {
        console.log('456', JSON.stringify(networkElement));
            return callback(networkElement);        
      });
    };

    service.getNextNetworkElement = function(dbIndex, networkElementId, callback) {
      console.log('ääääääää0', networkElementId);
      var filter = {'id.networkElementId': {gt: networkElementId}};
      getNeighborNetworkElement(dbIndex, networkElementId, filter, function(networkElement) {
            return callback(networkElement);        
      });
    };

  };

  return service;
}]);

if (typeof Array.prototype.contains === 'undefined') {
  Array.prototype.contains = function(v) {
    return this.join('/').indexOf(v) !== -1;
  };
}

if (typeof (Array.prototype.diff) === "undefined") {
  Array.prototype.diff = function(a) {
    return this.filter(function(i) {
      return a.indexOf(i) < 0;
    });
  };
}

var app =
    angular.module('htNetworkMap', [
      'uiGmapgoogle-maps', 'ui.bootstrap', 'ui.router', 'angular-geohash', 'ngCookies', 'htLogin', 'htProfile', 'htRevisionStatus', 'htQueryService',
      'htPathManager', 'htPathDetails', 'alert', 'translate', 'coordinateFilter'
    ]);

app.controller('mapCtrl', [
  '$rootScope',
  '$scope',
  '$location',
  '$compile',
  'geohash',
  '$query',
  '$networkMap',
  'siteMarkerService',
  '$htCluster',
  '$mapOverlay',
  '$revisionStatus',
  'authenticationService',
  function($rootScope, $scope, $location, $compile, geohash, $query, $networkMap, siteMarkerService, $htCluster, $mapOverlay, $revisionStatus,
      authenticationService) {
    'use strict';

    var dbIndex;


    /**
     * scan url
     */
    $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl, newState, oldState) {
      console.log('htLog:', event, newUrl, oldUrl, newState, oldState);
      dbIndex = $location.path().split('/')[1];
      var search = $location.search();
      // clean up paths
      $rootScope.mapObjects.paths.models = [];
      if (Object.keys(search).length !== 0) {
        var request = {};
        request.dbIndex = dbIndex;
        request.objectType = Object.keys(search)[0];
        if (request.objectType === 'path') {
            request.value = search[request.objectType].split('|');
            console.log(JSON.stringify(request.value));
        } else {
          console.log(JSON.stringify('noooo', request.value));
           request.value = search[request.objectType];
        }
        
        $query.query(request, function(result) {
          $networkMap.handleQueryResult(result);
        });
      }
    });

    /**
     * Global settings and functions
     */
    var profile = authenticationService.getProfileName();

    // mapObjectId: numeric string needed to identify a marker or polyline
    var mapObjectId = 0;

    // global variable for map protection
    var projection;

    /**
     * Map level settings and functions
     */
    var mapCenter = {
      latitude : 0,
      longitude : 0
    };
    var mapClusterOptions = {
      maxZoom : 14,
      minimumClusterSize : 8,
      // range 2..9
      maxSiteCountToDisplayLinks : 400,
      minimumObjectsForClustering : 400
    };

    var mapEvents = {
      bounds_changed : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
      },
      // center_changed : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' +
      // JSON.stringify(map.getCenter()));
      // },
      click : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
        $networkMap.infowindowOpen = null;
        $networkMap.infowindow.close();
      },
      // dblclick : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      // drag : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      // dragend : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // // doNetwork(map.getBounds(), function() {
      // // $scope.isProsessing = false;
      // // });
      // },
      // dragstart : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // // $scope.newLink.clear();
      // // $scope.isProsessing = true;
      // },
      heading_changed : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
      },
      idle : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
        var bounds = map.getBounds();
        if (dbIndex && !bounds.equals($scope.previousBounds)) {
          $rootScope.map.zoom = map.getZoom();
          $scope.isProsessing = true;
          doNetwork(map.getBounds(), function() {
            $scope.isProsessing = false;
            $scope.previousBounds = bounds;
            isInit = true;
          });
        }
      },
      maptypeid_changed : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
      },
      // mousemove : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      // mouseout : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      // mouseover : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      resize : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
      },
      rightclick : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
        $rootScope.mapObjects.newSite.create(data[0].latLng);
      },
      projection_changed : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
        projection = map.getProjection();
      },
      // tilesloaded : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      // tilt_changed : function(map, eventName, data) {
      // console.log('map.' + eventName + ': ' + JSON.stringify(data));
      // },
      zoom_changed : function(map, eventName, data) {
        console.log('htLog:', map, eventName, data);
      }
    };
    var mapOptions = {
      mapTypeId : 'hybrid',
      backgroundColor : '#dd0000',
      draggable : true,
      disableDoubleClickZoom : false,
      minZoom : 3,
      mapTypeControl : false,
      mapTypeControlOptions : {
        position : google.maps.ControlPosition.LEFT_TOP,
        mapTypeIds : [
          'hybrid', 'roadmap', 'terrain', 'satellite'
        ]
      },

      panControl : true,
      panControlOptions : {
        position : google.maps.ControlPosition.RIGHT_TOP
      },
      rotateControl : true,
      rotateControlOptions : {
        position : google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControl : true,
      streetViewControlOptions : {
        position : google.maps.ControlPosition.RIGHT_TOP
      },
      overviewMapControl : true,
      overviewMapControlOptions : {
        opened : true
      },
      zoomControl : true,
      zoomControlOptions : {
        position : google.maps.ControlPosition.RIGHT_TOP
      },
      scaleControl : true,
      scrollwheel : true
    };

    /***************************************************************************
     * Angular Google Map
     */
    $rootScope.map = {
      // bounds : bounds,
      center : mapCenter,
      clusterOptions : mapClusterOptions,
      control : {},
      // dragging : false,
      events : mapEvents,
      options : mapOptions,
      zoom : 3,
    };
    $scope.doCluster = false; // initial site grid-clustering by ES and
    // geoHash
    $scope.doHtCluster = true; // server side distance clustering
    $scope.doGoogleCluster = false;

    /**
     * Functions for clusters
     */
    var addClusterMarker = function(clusterMarkers) {
      $rootScope.mapObjects.clusters.models.push(clusterMarkers);
    };
    var changeIconClusterMarker = function(geohash, callback) {
      var gMarker = $rootScope.mapObjects.clusters.getByKey(geohash);
      if (gMarker === undefined) {
        return;
      }
      var tempCluster = {
        doc_count : gMarker.model.options.labelContent,
        key : geohash
      };
      var icon = createClusterIcon(tempCluster);
      gMarker.setIcon(icon);
      callback();
    };
    var containsClusterMarker = function(geoHash) {
      return $rootScope.mapObjects.clusters.models.map(function(clusterMarker) {
        return clusterMarker.mykey;
      }).indexOf(geoHash) > -1;
    };
    var createClusterMarker = function(cluster, callback) {
      var newMarker;
      if (cluster.doc_count >= $rootScope.map.clusterOptions.minimumClusterSize) {
        var key = 'opt5';
        if (cluster.doc_count > 1 && cluster.doc_count < 99999) {
          key = 'opt' + cluster.doc_count.toString().length;
        }
        var geoPoint = geohash.decode(cluster.key);
        var icon = createClusterIcon(cluster);
        newMarker = {
          id : mapObjectId++,
          isCluster : true,
          mykey : cluster.key,
          latitude : geoPoint.latitude,
          longitude : geoPoint.longitude,
          icon : icon,
          showWindow : false,
          title : cluster.key + ": " + cluster.doc_count,
          options : {
            zIndex : 10,
            draggable : false,
            labelContent : cluster.doc_count,
            labelAnchor : $rootScope.mapObjects.clusters.options[key].anchor,
            labelClass : 'labelClass'
          }
        };
      }
      return callback(newMarker);
    };
    var createClusterIcon = function(cluster) {
      var count = cluster.doc_count;
      var key = 'opt5';
      var strokeWeight = 5;
      if (count > 0 && count < 99999) {
        strokeWeight = count.toString().length;
        key = 'opt' + strokeWeight;

      }

      // [minlat, minlon, maxlat, maxlon]
      var bb = geohash.decode_bbox(cluster.key);

      var sw = new google.maps.LatLng(bb[0], bb[1]);
      var ne = new google.maps.LatLng(bb[2], bb[3]);

      var bl = projection.fromLatLngToPoint(sw);
      var tr = projection.fromLatLngToPoint(ne);
      // console.log(bl, tr);

      var numTiles = 1 << $rootScope.map.zoom;
      var height = Math.abs(parseInt((tr.y - bl.y) * numTiles));
      var width = Math.abs(parseInt((tr.x - bl.x) * numTiles));

      var x = -width / 2;
      var y = -height / 2;

      var path = 'M ' + x + ',' + y + ' h+' + (width - 0) + ' v+' + (height - 0) + ' h-' + (width - 0) + ' z';
      // var path = 'M ' + (x+5) + ',' + (y+5) + ' h+' + (width-10) + '
      // v+' + (height-10) + ' h-' + (width-10) + ' z';
      return {
        path : path,
        scale : 1,
        strokeWeight : strokeWeight,
        strokeColor : '#0CF',
        fillColor : '#0CF',
        fillOpacity : strokeWeight * 2 / 10,
        anchor : new google.maps.Point(0, 0)
      };
    };
    var doDistanceClusters = function(clusters, callback) {
      if ($scope.previousZoom !== $rootScope.map.zoom) {
        $rootScope.mapObjects.clusters.models = [];
      }
      clusters.map(function(cluster) {
        var lat = cluster.center.location.lat;
        var lon = cluster.center.location.lon;
        var key = geohash.encode(lat, lon, 7);

        if ($rootScope.mapObjects.clusters.contains(key)) {
          return;
        }

        // clusters are removed by tiles
        // $htCluster.createDistanceClusterMarker(cluster,
        // mapObjectId++, function(clusterMarker) {
        // $rootScope.mapObjects.clusters.models.push(clusterMarker);
        // });
      });
      return callback();
    };
    var drawClusterMarkers = function(bounds, callback) {
      var noneClusteredGeoHashes = [];
      $networkMap.getClusters(bounds, function(clusters, precision) {
        if ($rootScope.mapObjects.clusters.previousPrecision !== precision) {
          // all previous cluster markers must be removed when
          // precision changed.
          if ($rootScope.mapObjects.clusters.previousPrecision > precision) {
            // delete underlying markers (could be improved by
            // keeping markers which should not be clustered)
            $rootScope.mapObjects.siteLinks.models = [];
            $rootScope.mapObjects.sites.models = [];
          }
          $rootScope.mapObjects.clusters.removeAll();
          $rootScope.mapObjects.clusters.previousPrecision = precision;
          // $rootScope.mapObjects.clusters.previousZoom =
          // $rootScope.map.zoom;
        }

        var markers = [];
        // var markers = $rootScope.mapObjects.clusters.models;
        clusters.map(function(cluster) {
          // if (!$rootScope.mapObjects.clusters.contains(cluster.key)) {
          $rootScope.mapObjects.clusters.create(cluster, function(clusterMarker) {
            if (clusterMarker !== undefined) {
              markers.push(clusterMarker);
            } else {
              noneClusteredGeoHashes.push(cluster.key);
            }
          });
          // } else {
          // // console.log(cluster.key + ' already exists ;) ');
          // $rootScope.mapObjects.clusters.changeIcon(cluster.key,
          // function() {
          // // no further activities required ;)
          // });
          // }
        });
        $rootScope.mapObjects.clusters.models = markers;

        // continue with sites
        var siteMarkers = $rootScope.mapObjects.sites.models;
        $networkMap.getSitesByGeoHashes(noneClusteredGeoHashes, function(sites) {
          var siteIds = {};
          sites.map(function(site) {
            if (siteIds[site._index] === undefined) {
              siteIds[site._index] = [];
            }
            if (siteIds[site._index].indexOf(site.fields.forMap[0].id.siteId) === -1) {
              siteIds[site._index].push(site.fields.forMap[0].id.siteId);
            }
            if ($rootScope.mapObjects.sites.contains(site.fields.forMap[0].id.siteId)) {
              return;
            }
            site.fields.forMap[0]._index = site._index;
            var options = {
              type : 'site',
              status : 'normal',
              visible : $rootScope.mapObjects.sites.visible
            };
            siteMarkerService.createSiteMarker(mapObjectId++, site.fields.forMap[0], options, function(siteMarker) {
              siteMarkers.push(siteMarker);
            });
          });
          // console.log('2222 siteIds', JSON.stringify(siteIds));
          doSiteLinks(siteIds, function() {
            callback();
          });
        });
      });
    };
    var clusterMarkersEvents = {
      click : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        $rootScope.map.center = {
          latitude : model.latitude,
          longitude : model.longitude
        };
        $rootScope.map.zoom = $rootScope.map.zoom + 3;
      },
      // dblclick : function(marker, eventName, model, args){
      // // dont use dblclick - bad behavior with click, //
      // console.log(eventName);
      // },
      dragstart : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        $networkMap.infowindow.close();
      },
    // mouseover : function(marker, eventName, model, args) {
    // marker.icon.strokeWeight = 5;
    // marker.setIcon(marker.icon);
    // $scope.$apply();
    // },
    // mouseout : function(marker, eventName, model, args) {
    // if (model.isCluster) {
    // marker.icon.strokeWeight =
    // model.options.labelContent.toString().length;
    // } else {
    // marker.icon.strokeWeight = 3;
    // }
    // marker.setIcon(marker.icon);
    // $scope.$apply();
    // }
    };
    var getClusterMarkerByKey = function(key) {
      var array = $rootScope.mapObjects.clusters.control.getGMarkers();
      var index = array.length;
      while (array[--index] && array[index].model.mykey !== key) {
        // console.log(index, array[index].model.mykey);
      }
      return array[index];
    };
    var clusterOptions = {
      opt1 : {
        scale : 8,
        anchor : '4 8'
      },
      opt2 : {
        scale : 13,
        anchor : '7 8'
      },
      opt3 : {
        scale : 16,
        anchor : '11 8'
      },
      opt4 : {
        scale : 19,
        anchor : '15 8'
      },
      opt5 : {
        scale : 22,
        anchor : '19 8'
      },
    };
    var removeAllClusterMarkers = function() {
      $rootScope.mapObjects.clusters.models = [];
    };
    var replaceClusterMarkers = function(markers) {
      $rootScope.mapObjects.clusters.models = markers;
    };

    /**
     * Functions for sites
     */
    var containsSiteMarker = function(siteId) {
      return $rootScope.mapObjects.sites.models.map(function(siteMarker) {
        return siteMarker.site.id.siteId;
      }).indexOf(siteId) > -1;
    };
    var siteMarkersEvents = {
      click : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        if ($networkMap.infowindowOpen === null || $networkMap.infowindowOpen === undefined || $networkMap.infowindowOpen !== model.siteId) {
          // console.log(JSON.stringify(model.site));
          $networkMap.infowindowOpen = model.site.id.siteId;
          var content = '<site-details site-index="\'' + dbIndex + '\'" site-id="\'' + model.site.id.siteId + '\'"></site-details>';
          var compiled = $compile(content)($rootScope);
          $networkMap.handleInfoWindow(args[0].latLng, compiled[0]);
        } else {
          $networkMap.infowindowOpen = null;
          $networkMap.infowindow.close();
        }
      },
      // dblclick : function(marker, eventName, model, args){
      // // dont use dblclick - bad behavior with click, //
      // console.log(eventName);
      // },
      dragstart : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        $networkMap.infowindow.close();
      },
      mouseover : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        if (model.isCluster) {
          marker.icon.strokeWeight = 5;
          marker.setIcon(marker.icon);
        } else {
          var options = {
            type : model.type,
            status : 'hover'
          };
          model.icon = siteMarkerService.getIcon(model.site, options);
          $scope.$apply();
        }
      },
      mouseout : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        if (model.isCluster) {
          marker.icon.strokeWeight = model.options.labelContent.toString().length;
          marker.setIcon(marker.icon);
          $scope.$apply();
        } else {
          var options = {
            type : model.type,
            status : 'normal'
          };
          model.icon = siteMarkerService.getIcon(model.site, options);
          $scope.$apply();
        }
      }
    };
    var removeSiteMarker = function(dbIndex, siteId) {
      var array = $rootScope.mapObjects.sites.models;
      var index = array.length;
      while (index) {
        index = index - 1;
        if (array[index].site.id.siteId.toString() === siteId.toString()) {
          array.splice(index, 1);
        }
      }
    };

    /**
     * Functions for siteLinks
     */
    var containsSiteLinkPolylines = function(siteLinkId) {
      return $rootScope.mapObjects.siteLinks.models.map(function(siteLinkPolyline) {
        return siteLinkPolyline.siteLinkId;
      }).indexOf(siteLinkId) > -1;
    };
    var siteLinksEvents = {
      click : function(line, eventName, model, args) {
        console.log('htLog:', line, eventName, model, args);
        if (model.siteLinkId !== undefined) {
          if ($networkMap.infowindowOpen === null || $networkMap.infowindowOpen === 'undefined' || $networkMap.infowindowOpen !== model.siteLinkId) {
            $networkMap.infowindowOpen = model.siteLinkId;
            var content = '<site-link-details site-link-index="\'';
            content += model.index;
            content += '\'" site-link-id-low="\'';
            content += model.siteLinkId.low;
            content += '\'" site-link-id-high="\'';
            content += model.siteLinkId.high;
            content += '\'"></site-link-details>';
            var compiled = $compile(content)($rootScope);
            $networkMap.handleInfoWindow(args[0].latLng, compiled[0]);
          } else {
            $networkMap.infowindowOpen = null;
            $networkMap.infowindow.close();
          }
        }
      },
      mouseover : function(line, eventName, model, args) {
        console.log('htLog:', line, eventName, model, args);
    	model.stroke.weight = 6;
      },
      mouseout : function(line, eventName, model, args) {
        console.log('htLog:', line, eventName, model, args);
        model.stroke.weight = 3;
      }
    };

    var sitePathEvents = {
        click : function(line, eventName, model, args) {
          console.log('htLog:', line, eventName, model, args);
          if (model.id !== undefined) {
            if ($networkMap.infowindowOpen === null || $networkMap.infowindowOpen === 'undefined' || $networkMap.infowindowOpen !== model.id) {
              $networkMap.infowindowOpen = model.id;
              var content = '<site-path-details db-index="\'' + model.index + '\'" site-path-id="\'' + model.id + '\'"></site-path-details>';
              var compiled = $compile(content)($rootScope);
              $networkMap.handleInfoWindow(args[0].latLng, compiled[0]);
            } else {
              $networkMap.infowindowOpen = null;
              $networkMap.infowindow.close();
            }
          }
        },
        mouseover : function(line, eventName, model, args) {
          console.log('htLog:', line, eventName, model, args);
          var weight = 10;
          if (model.icons.length === 1) {
            model.stroke.weight = weight;
            model.icons[0].icon.scale = weight;
          } else {
            model.stroke.weight = weight;
            model.icons[0].icon.scale = weight;
            model.icons[1].icon.scale = weight;
          }
          console.log(JSON.stringify(model));
          
        },
        mouseout : function(line, eventName, model, args) {
          console.log('htLog:', line, eventName, model, args);
          var weight = 6;
          if (model.icons.length === 1) {
            model.stroke.weight = weight; 
            model.icons[0].icon.scale = weight;
          } else {
            model.stroke.weight = weight;
            model.icons[0].icon.scale = weight;
            model.icons[1].icon.scale = weight;
          }
        }
      };


    /**
     * Functions for NEW site
     */
    var createNewSiteMarker = function(latLng) {
      var location = {
        lat : latLng.lat(),
        lon : latLng.lng()
      };

      var newSite = {
        _index : dbIndex,
        id : {
          siteId : -1
        },
        siteName : 'New site at ' + location.lat.toFixed(6) + '/' + location.lon.toFixed(6),
        siteExtensions : {concentrator: false, fiberPlanDate : null, fiberActualDate : null},
        geoLocation : {
          location : location
        },
        siteLinks : []
      };
      var options = {
        type : 'siteNew',
        status : 'normal'
      };
      siteMarkerService.createSiteMarker(mapObjectId++, newSite, options, function(siteMarker) {
        $rootScope.mapObjects.newSite.model.push(siteMarker);
        $scope.$apply();
      });
    };
    $rootScope.cancelSite = function() {
      $networkMap.infowindow.close();
      $rootScope.mapObjects.newSite.model = [];
    };
    $rootScope.createNewSiteOnMap = function(newSite, callback) {
      // console.log(JSON.stringify(newSite.site._source));
      $rootScope.cancelSite();
      var site = {
        _index : dbIndex,
        id : {
          siteId : newSite.site._source.id.siteId
        },
        siteName : newSite.site._source.id.siteId,
        siteExtensions : {concentrator: false, fiberPlanDate : null, fiberActualDate : null},
        geoLocation : newSite.site._source.geoLocation,
        siteLinks : []
      };
      var options = {
        type : 'site',
        status : 'normal'
      };
      siteMarkerService.createSiteMarker(mapObjectId++, site, options, function(siteMarker) {
        $rootScope.mapObjects.sites.models.push(siteMarker);
        // $scope.$apply();
        return callback();
      });
    };
    var newSiteEvents = {
      click : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        if ($networkMap.infowindowOpen === null || $networkMap.infowindowOpen === undefined || $networkMap.infowindowOpen !== model.siteId) {
          $networkMap.infowindowOpen = model.siteId;
          var lat = model.latitude.toFixed(6);
          var lon = model.longitude.toFixed(6);
          var name = geohash.encode(lat, lon, 9);
          var content = '<new-site name="\'' + name + '\'" lat=' + lat + ' lon=' + lon + '></new-site>';
          var compiled = $compile(content)($rootScope);
          $networkMap.handleInfoWindow(args[0].latLng, compiled[0]);
        } else {
          $networkMap.infowindowOpen = null;
          $networkMap.infowindow.close();
        }
      },
      // dblclick : function(marker, eventName, model, args){
      // // dont use dblclick - bad behavior with click, //
      // console.log(eventName);
      // },
      dragstart : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        $networkMap.infowindow.close();
      },
      mouseover : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        marker.icon.strokeWeight = 5;
        marker.setIcon(marker.icon);
        $scope.$apply();
      },
      mouseout : function(marker, eventName, model, args) {
        console.log('htLog:', marker, eventName, model, args);
        if (model.isCluster) {
          marker.icon.strokeWeight = model.options.labelContent.toString().length;
        } else {
          marker.icon.strokeWeight = 3;
        }
        marker.setIcon(marker.icon);
        $scope.$apply();
      }
    };
    var removeSite = function(siteIndex, siteId) {
      $networkMap.removeSite(siteIndex, siteId, function(err, data) {
        if (!err) {
          $networkMap.infowindow.close();
          removeSiteMarker(siteIndex, siteId);
        } else {
          console.info('htLog:', err, data);
        }
      });
    };
    $rootScope.removeSite = function(siteIndex, siteId) {
      $rootScope.mapObjects.sites.remove(siteIndex, siteId);
    };

    /*
     * Functions for siteLinks
     */
    $rootScope.cancelSiteLink = function() {
      $networkMap.infowindow.close();
      $scope.newLink.line.setMap(null);
      $scope.newLink.clear();
    };
    var removeSiteLinkPolyline =
        function(siteLinkIndex, siteLinkId) {
          var array = $rootScope.mapObjects.siteLinks.models;
          var index = array.length;
          var found = false;
          while (!found) {
            index = index - 1;
            // Don't remove toString() it's important
            found =
                array[index] && array[index].siteLinkId.low.toString() === siteLinkId.low.toString() && 
                array[index].siteLinkId.high.toString() === siteLinkId.high.toString() && 
                array[index].index === siteLinkIndex;
          }
          if (index > -1) {
            array.splice(index, 1);
          }
        };
    var removeSiteLink = function(siteLinkIndex, siteLinkId) {
      $networkMap.removeSiteLink(siteLinkIndex, siteLinkId, function(err, data) {
        if (!err) {
          $networkMap.infowindow.close();
          removeSiteLinkPolyline(siteLinkIndex, siteLinkId);
        } else {
          console.error(err, data);
        }
      });
    };
    $rootScope.removeSiteLink = function(siteLinkIndex, siteLinkId) {
      $rootScope.mapObjects.siteLinks.remove(siteLinkIndex, siteLinkId);
    };

    /**
     * Functions for MwrLink
     */
    $rootScope.createMwrLink = function(dbIndex, siteLinkId) {
      // console.log('yippiiii', dbIndex, siteLinkId);

      $networkMap.infowindowOpen = 'newMwrLink';
      var content = '<new-mwr-link ';
      content += 'db-index="';
      content += dbIndex;
      content += '" site-id-a="';
      content += siteLinkId.high;
      content += '" site-id-b="';
      content += siteLinkId.low;
      content += '" revision-type="';
      content += 'construction';
      content += '"></new-mwr-link>';
      // console.log(content);
      var compiled = $compile(content)($rootScope);
      // console.log(compiled[0]);
      $networkMap.handleInfoWindow($networkMap.infowindow.getPosition(), compiled[0]);
    };

    var openSiteLinkInfoWindow = function(siteLink) {
      // console.log(JSON.stringify(siteLink), '?index');
      $networkMap.infowindowOpen = siteLink.siteLinkId;
      var content = '<site-link-details site-link-index="\'';
      content += siteLink.dbIndex;
      content += '\'" site-link-id-low="\'';
      content += siteLink.siteLinkId.low;
      content += '\'" site-link-id-high="\'';
      content += siteLink.siteLinkId.high;
      content += '\'"></site-link-details>';
      var compiled = $compile(content)($rootScope);
      // console.log(content);
      $networkMap.handleInfoWindow($networkMap.infowindow.getPosition(), compiled[0]);
    };
    $rootScope.cancelMwrLink = function(siteLink) {
      openSiteLinkInfoWindow(siteLink);
    };
    $rootScope.mwrLinkCreated = function(siteLink, mwrLinkRevision) {
      // console.log(JSON.stringify(mwrLink));

      var flag = {
        revisionState : {
          orderId : 5,
          id : 'created',
          name : 'Created',
          isMain : true
        },
        required : new Date(),
        plan : new Date(),
        actual : new Date(),
        planner : authenticationService.getUsername(profile),
        comment : 'Creation via htNetworkMap.'
      };
      var rs = {};
      rs.id = mwrLinkRevision.mwrlinkrevision.id;
      rs.lifeCycle = {};
      rs.lifeCycle.revisionFlags = [];
      rs.lifeCycle.revisionFlags.push(flag);

      // // create first revisionstatus
      $revisionStatus.set(dbIndex, rs, function(err, data) {
        console.log('htLog: ', err, data);
        openSiteLinkInfoWindow(siteLink);
      });
    };

    /***************************************************************************
     * Map objects drawn on map
     */

    $rootScope.mapObjects = {
      sites : {
        contains : containsSiteMarker,
        events : siteMarkersEvents,
        models : [],
        circles : [],
        remove : removeSite,
        visible : true
      },
      siteLinks : {
        contains : containsSiteLinkPolylines,
        events : siteLinksEvents,
        models : [],
        remove : removeSiteLink,
        visible : true
      },
      paths : {
        // contains : containsSiteLinkPolylines,
        events : sitePathEvents,
        models : [],
        visible : true
      // remove : removeSiteLink
      },
      clusters : {
        add : addClusterMarker,
        changeIcon : changeIconClusterMarker,
        contains : containsClusterMarker,
        control : {},
        create : createClusterMarker,
        draw : drawClusterMarkers,
        events : clusterMarkersEvents,
        getByKey : getClusterMarkerByKey,
        models : [],
        options : clusterOptions,
        removeAll : removeAllClusterMarkers,
        replace : replaceClusterMarkers
      },
      newSite : {
        create : createNewSiteMarker,
        events : newSiteEvents,
        model : []
      },
      selectedSites : {
        create : 'äää',
        list : [],
        models : [],
      },
      newSiteLink : {
        models : []
      },
      urban : {
        models : [],
        events : {},
        visible : false
      },
      suburban : {
        models : [],
        events : {},
        visible : false
      }
    };

    /**
     * REVIEW FROM HERE ONWARDS
     */

    var doNetwork = function(gBounds, callback) {
      console.time('doNetwork');
      var bounds = {
        northeast : {
          latitude : gBounds.getNorthEast().lat(),
          longitude : gBounds.getNorthEast().lng()
        },
        southwest : {
          latitude : gBounds.getSouthWest().lat(),
          longitude : gBounds.getSouthWest().lng()
        }
      };

      if ($scope.doCluster) {
        // $rootScope.mapObjects.sites.models = [];
        // $rootScope.mapObjects.siteLinks.models = [];
        if ($rootScope.map.zoom < $rootScope.map.clusterOptions.maxZoom) {
          $rootScope.mapObjects.clusters.draw(bounds, function() {
            callback();
          });
        } else {
          $rootScope.mapObjects.clusters.removeAll();
          doSites(bounds, function() {
            callback();
          });
        }
      }
      if ($scope.doHtCluster) {
        var min = $rootScope.map.clusterOptions.minimumClusterSize;
        var minObjects = $rootScope.map.clusterOptions.minimumObjectsForClustering;

        $htCluster.getMapObjects(bounds, min, minObjects, function(clusters, sites) {
          // console.log('yippi: ', clusters.length, sites.length);
          doDistanceClusters(clusters, function() {
            // just do it
          });
          doRemainingSites(sites, function() {
            $scope.previousZoom = $rootScope.map.zoom;
            $networkMap.statistics.sites.displayed = $rootScope.mapObjects.sites.models.length;
          });
        });
      } else {
        if ($rootScope.mapObjects.sites.models.length === 0) {
          doSites(bounds, function() {
            callback();
          });
        }

      }
      console.timeEnd('doNetwork');
    };

    $rootScope.createNewSitelinkInDB = function(link, callback) {
      $rootScope.cancelSiteLink();
      createSiteLinkPolyline(link, function(polyline) {
        if (polyline) {
          $rootScope.mapObjects.siteLinks.models.push(polyline);
        }
        return callback();
      });
    };

    var doSiteLinks = function(siteIds, callback) {
      console.time('doSiteLinks');
      // console.log('3333 siteIds', JSON.stringify(siteIds));
      var networks = Object.keys(siteIds);
      networks.map(function(network) {
        var polylines = $rootScope.mapObjects.siteLinks.models;
        if (siteIds[network].length > $rootScope.map.clusterOptions.maxSiteCountToDisplayLinks) {
          console.log('Too many single sites to display links: ' + siteIds[network].length);

          $networkMap.getSiteLinksByBounds($rootScope.map.bounds, function(siteLinks) {
            siteLinks.map(function(siteLink) {
              createSiteLinkPolyline(siteLink, function(polyline) {
                if (polyline) {
                  polylines.push(polyline);
                }
              });
            });
          });
          callback();
          return;
        }

        // JSON.stringify(siteIds[network]));
        $networkMap.getSiteLinksBySiteIds(network, siteIds[network], function(siteLinks) {
          // search for missing siteIds (sites not visbile or in a
          // cluster)
          siteLinks.map(function(siteLink) {
            createSiteLinkPolyline(siteLink, function(polyline) {
              if (polyline) {
                polylines.push(polyline);
              }
            });
          });
          callback();
        });
      });
      console.timeEnd('doSiteLinks');
    };

    var createSiteLinkPolyline =
        function(siteLink, callback) {
          if (siteLink._source.id === undefined) {
            return callback(undefined);
          }

          // TODO (profile???)
          // "DBDO", "DBGREEN", SMTX, PMTS
          var color = '#00CCFF';
          if (siteLink._source.dbOriginations.contains('PMTS')) {
            color = '#00FF00';
          }
          if (siteLink._source.dbOriginations.contains('PMTS') && siteLink._source.dbOriginations.contains('SMTX')) {
            color = '#FFFF00';
          }
          if (siteLink._source.fiberPlanDateA !== undefined && siteLink._source.fiberPlanDateB !== undefined) {
            if ((siteLink._source.fiberPlanDateA !== null) && (siteLink._source.fiberPlanDateB !== null) || 
                (siteLink._source.fiberPlanDateA !== null) && (siteLink._source.numSiteLinksA === 1) || 
                (siteLink._source.fiberPlanDateB !== null) && (siteLink._source.numSiteLinksB === 1)) {
              color = '#EEEEEE';
              
              if (siteLink._source.dbOriginations.contains('PMTS') ) {
                color = '#FF0000';
              }
            }
          }

          var path = [
            {
              latitude : siteLink._source.geoLocationA.location.lat,
              longitude : siteLink._source.geoLocationA.location.lon
            }, {
              latitude : siteLink._source.geoLocationB.location.lat,
              longitude : siteLink._source.geoLocationB.location.lon
            }
          ];
          // console.log(id, coords);
          // console.log($rootScope.map.control.getGMap());
          var siteLinkId = siteLink._source.id.high + '-' + siteLink._source.id.low;
          if (siteLink._index === undefined) {
            siteLink._index = dbIndex;
          }
          var newLine = {
            id : mapObjectId++,
            index : siteLink._index,
            siteLinkId : siteLink._source.id,
            path : path,
            stroke : {
              color : color,
              weight : 3
            },
            editable : false,
            draggable : false,
            geodesic : true,
            visible : true,
            options : {
              zIndex : 16,
              title : siteLinkId
            }
          };
          callback(newLine);
        };

    // var createSelectionMarker = function(lat, lon) {
    // var icon = {
    // path : google.maps.SymbolPath.CIRCLE,
    // scale : 12,
    // strokeWeight : 3,
    // strokeColor : '#dd0000',
    // fillColor : '#dd0000',
    // fillOpacity : 0.1,
    // anchor : new google.maps.Point(0, 0)
    // };
    // var newMarker = {
    // id : mapObjectId++,
    // latitude : lat,
    // longitude : lon,
    // icon : icon,
    // showWindow : false,
    // options : {
    // zIndex : 0,
    // draggable : false,
    // title : ''
    // }
    // };
    // return newMarker;
    // };

    // doSites for htCluster
    var doRemainingSites = function(sites, callback) {
      // TODO IN case of jump from pathManager or siteManager sometime siteLinks
      // are delete based on old viewPort
      var zoomedOut = $scope.previousZoom > $rootScope.map.zoom && $location.path().indexOf('?') === 0;

      var siteIds = {};
      console.time('sites.map');
      sites.map(function(site) {
        if ($rootScope.mapObjects.sites.contains(site._source.id.siteId)) {
          return;
        }
        if (siteIds[dbIndex] === undefined) {
          siteIds[dbIndex] = [];
        }
        if (siteIds[dbIndex].indexOf(site._source.id.siteId) === -1) {
          siteIds[dbIndex].push(site._source.id.siteId);
        }
        var options = {
          type : 'site',
          status : 'normal',
          visible : $rootScope.mapObjects.sites.visible
        };
        siteMarkerService.createSiteMarker(mapObjectId++, site._source, options, function(siteMarker) {
          $rootScope.mapObjects.sites.models.push(siteMarker);
        });
        // just a fixed radius around a site - enable if needed of distance analysis
        // siteMarkerService.getCircle(mapObjectId++, site._source, 1000, function(circle) {
        //   $rootScope.mapObjects.sites.circles.push(circle);
        // });
      });

      console.timeEnd('sites.map');
      if (siteIds[dbIndex] !== undefined) {
        $networkMap.getSiteLinksBySiteIds(dbIndex, siteIds[dbIndex], function(siteLinks) {
          // search for missing siteIds (sites not visbile or in a
          // cluster)

          // no idea but it does not work :(
          // console.log(1, siteLinks.length);
          // var requiredIds = siteLinks.map(function(siteLink) {
          // var siteLinkId = siteLink._source.id.high + '-' +
          // siteLink._source.id.low;
          // return siteLinkId;
          // });
          // console.log(2, requiredIds.length);
          // console.log(3,
          // $rootScope.mapObjects.siteLinks.models.length);
          //
          // // remove not required siteLinks
          // var i = $rootScope.mapObjects.siteLinks.models.length;
          // console.log(3, i);
          // while (i--) {
          // console.log('???');
          // var siteLink = $rootScope.mapObjects.siteLinks.models[i];
          // var siteLinkId = siteLink.siteLinkId.high + '-' +
          // siteLink.siteLinkId.low;
          // if (requiredIds.indexOf(siteLinkId) === -1) {
          // $rootScope.mapObjects.siteLinks.models.splice(i, 1);
          // console.log(5, siteLinkId);
          // }
          // }

          if (zoomedOut) {
            console.log('zoomedOut');
            $rootScope.mapObjects.siteLinks.models = [];
          }

          siteLinks.map(function(siteLink) {
            var siteLinkId = siteLink._source.id.high + '-' + siteLink._source.id.low;
            // console.log(JSON.stringify(siteLinkId));
            if ($rootScope.mapObjects.siteLinks.contains(siteLinkId)) {
              return;
            }
            createSiteLinkPolyline(siteLink, function(polyline) {
              if (polyline) {
                $rootScope.mapObjects.siteLinks.models.push(polyline);
              }
            });
          });
          console.log($rootScope.mapObjects.siteLinks.models.length);
        });
      }

      if ($rootScope.mapObjects.sites.models.length > 0) {
        cleanupSites($rootScope.mapObjects.sites.models, sites, function() {
          console.log('after', $rootScope.mapObjects.sites.models.length, sites.length);
        });
      }
      return callback();
    };

    var cleanupSites = function(stored, displayed, callback) {
      var displayedSiteIds = displayed.map(function(site) {
        return site._source.id.siteId;
      });
      var storedSiteIds = stored.map(function(model) {
        return model.site.id.siteId;
      });

      var diff = storedSiteIds.diff(displayedSiteIds);
      diff.map(function(siteId) {
        var index = storedSiteIds.indexOf(siteId);
        if (index > -1) {
          storedSiteIds.splice(index, 1);
          stored.splice(index, 1);
        }
      });

      console.timeEnd('removeNonDisplayedSites');

      return callback();
    };

    // original doSites
    var doSites = function(bounds) {
      console.log('doSites: ' + dbIndex);
      $networkMap.getSites(bounds, function(sites) {
        var markers = $rootScope.mapObjects.sites.models;
        console.log('markers: ' + markers.length);
        var siteIds = {};
        sites.map(function(site) {
          if ($rootScope.mapObjects.sites.contains(site.fields.forMap[0].id.siteId)) {
            return;
          }
          if (siteIds[site._index] === undefined) {
            siteIds[site._index] = [];
          }
          if (siteIds[site._index].indexOf(site.fields.forMap[0].id.siteId) === -1) {
            siteIds[site._index].push(site.fields.forMap[0].id.siteId);
          }
          site.fields.forMap[0]._index = site._index;
          var options = {
            type : 'site',
            status : 'normal',
            visible : $rootScope.mapObjects.sites.visible
          };
          siteMarkerService.createSiteMarker(mapObjectId++, site.fields.forMap[0], options, function(siteMarker) {
            markers.push(siteMarker);
          });
        });
        $rootScope.mapObjects.sites.models = markers;
        // console.log('1111 siteIds', siteIds);
        doSiteLinks(siteIds, function() {
          // do nothing
        });
      });
    };

    var init = function(callback) {
      console.time('init');
      siteMarkerService.init(profile);
      $networkMap.getDbIndex(function(databaseIndex) {
        // console.log(databaseIndex);
        dbIndex = databaseIndex;
        $networkMap.getStatistics(function(err, statistics) {
          console.log('htLog:', err, statistics);
          if (!err) {
            $networkMap.setMap($rootScope.map);
            $rootScope.map.zoom = $networkMap.googleMap().getZoom();
            $scope.isProsessing = true;

            var mapOverlay = $mapOverlay.getOverlay($networkMap.googleMap(), $rootScope.map.options.minZoom, $rootScope.map.clusterOptions.maxZoom);
            $networkMap.googleMap().overlayMapTypes.insertAt(0, mapOverlay);

            doNetwork($networkMap.googleMap().getBounds(), function() {
              $scope.isProsessing = false;
              isInit = true;
            });
          } else {
            console.info('htLog:', err);
          }
        });
        $networkMap.getBounds(function(bounds) {
          $rootScope.map.bounds = bounds;
          $networkMap.setOptions($rootScope.map.options);
        });
        callback();
      });
      $networkMap.infowindow = new google.maps.InfoWindow();
    };

    var toggleSiteSelection = function(site) {
      var index = this.sites.map(function(v) {
        return v.id.siteId;
      }).indexOf(site.id.siteId);
      if (index > -1) { // contains
        // remove
        this.sites.splice(index, 1);
        unhighligthSite(site);
        this.remove();
        return false;
      } else if (this.sites.length < this.maxSites) {
        // add
        $networkMap.infowindow.close();
        this.sites.push(site);
        highligthSite(site);
        this.create();
        return true;
      } else {
        // ignore -> one site must be removed first
        // from
        // list
        return false;
      }
    };

    var openWidget = function(latLng) {
      $networkMap.infowindowOpen = 'newSiteLink';
      var content = '<new-site-link site-id-a="';
      content += $scope.newLink.sites[0].id.siteId;
      content += '" site-id-b="';
      content += $scope.newLink.sites[1].id.siteId;
      content += '"></new-site-link>';
      var compiled = $compile(content)($rootScope);
      $networkMap.handleInfoWindow(latLng, compiled[0]);
    };

    $rootScope.newLink =
        {
          minSites : 2,
          maxSites : 2,
          sites : [],
          line : undefined,
          mode : function(siteId) {
            return this.sites.map(function(e) {
              return e.id;
            }).indexOf(siteId) > -1;
          },
          remove : function() {
            if (this.line !== undefined) {
              this.line.setMap(null);
            }
          },
          create : function() {
            if (this.sites.length === this.minSites) {
              var color = '#dd0000';
              var coords =
                  [
                    new google.maps.LatLng(this.sites[0].geoLocation.location.lat, this.sites[0].geoLocation.location.lon),
                    new google.maps.LatLng(this.sites[1].geoLocation.location.lat, this.sites[1].geoLocation.location.lon)
                  ];
              this.line = new google.maps.Polyline({
                path : coords,
                geodesic : true,
                map : $rootScope.map.control.getGMap(),
                strokeColor : color,
                strokeOpacity : 1.0,
                strokeWeight : 3,
                zIndex : 6
              // title: site.id
              });

              var lat = (coords[0].lat() + coords[1].lat()) / 2;
              var lon = (coords[0].lng() + coords[1].lng()) / 2;
              var latLng = new google.maps.LatLng(lat, lon);
              openWidget(latLng);

              google.maps.event.addListener(this.line, 'click', function(evt) {
                if ($networkMap.infowindowOpen === null || $networkMap.infowindowOpen === 'undefined') {
                  openWidget(evt.latLng);
                } else {
                  $networkMap.infowindowOpen = null;
                  $networkMap.infowindow.close();
                }
              });
              google.maps.event.addListener(this.line, 'mouseover', function() {
                $scope.newLink.line.setOptions({
                  strokeWeight : 6
                });
                tooltip.show($scope.newLink.sites[0].id.siteId + '-' + $scope.newLink.sites[1].id.siteId);
              });
              google.maps.event.addListener(this.line, 'mouseout', function() {
                $scope.newLink.line.setOptions({
                  strokeWeight : 3
                });
                tooltip.hide();
              });
            }
          },
          toggle : toggleSiteSelection,
          clear : function() {
            unhighligthSite(this.sites[0]);
            unhighligthSite(this.sites[1]);
            this.sites = [];
          }
        };

    var highligthSite = function(site) {
      var icon = {
        path : google.maps.SymbolPath.CIRCLE,
        scale : 12,
        strokeWeight : 3,
        strokeColor : '#dd0000',
        fillColor : '#dd0000',
        fillOpacity : 0.0,
        anchor : new google.maps.Point(0, 0)
      };
      var lat = site.geoLocation.location.lat;
      var lon = site.geoLocation.location.lon;
      var newMarker = {
        id : mapObjectId++,
        index : site._index,
        siteId : site.id.siteId,
        isCluster : false,
        mykey : geohash.encode(lat, lon, 7),
        latitude : lat,
        longitude : lon,
        icon : icon,
        showWindow : false,
        selected : true,
        toggle : siteMarkerService.markerToggle,
        options : {
          zIndex : 0,
          draggable : false,
          title : site.siteName
        }
      };
      $rootScope.mapObjects.selectedSites.models.push(newMarker);
    };

    var unhighligthSite = function(site) {
      var index = $rootScope.mapObjects.selectedSites.models.map(function(e) {
        return e.id.siteId;
      }).indexOf(site.id.siteId);
      $rootScope.mapObjects.selectedSites.models.splice(index, 1);
    };

    $rootScope.setOverlayVisible = function(overlay, visible) {
      console.info('htLog:', $rootScope.mapObjects[overlay].visible);
      $rootScope.mapObjects[overlay].visible = visible;
      if (overlay === 'sites') {
        $rootScope.mapObjects.sites.models.map(function(site) {
          site.options.visible = visible;
        });
      }
    };

    var isInit = false;
    init(function() {
      console.timeEnd('init');
      
      // enable/disable reading of urban, suburban areas
      if (false) {
        $networkMap.getDensity('urban', function(data) {
          $rootScope.mapObjects.urban.models = data;
        });
        $networkMap.getDensity('suburban', function(data) {
          $rootScope.mapObjects.suburban.models = data;
        });
      }
    });
  }
]);

if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

app.factory('$networkMap', ['$rootScope', '$http', '$compile', '$query', '$pathManager', 'geohash', function($rootScope, $http, $compile, $query, $pathManager, geohash) {

  var dbIndex;
  var setBounds = function(south, north, west, east) {
    $rootScope.map.bounds = {
      northeast : {
        latitude : north,
        longitude : east
      },
      southwest : {
        latitude : south,
        longitude : west
      }
    };
  };

  var showSite = function(site) {
    
    service.queryResult = "Site: " + site.siteName;
    service.attributeValueChangeNotification('mapChanged');

    // open new infoWindow
    $rootScope.infoWindowOpen = site.id.siteId;
    var latLng = new google.maps.LatLng(site.geoLocation.location.lat, site.geoLocation.location.lon);
    var content = '<site-details site-index="\'' + dbIndex + '\'" site-id="\'' + site.id.siteId + '\'"></site-details>';
    var compiled = $compile(content)($rootScope);
    service.handleInfoWindow(latLng, compiled[0]);
    
    $rootScope.isSearching = false;

    var location = site.geoLocation.location;
    $rootScope.map.center = {
      latitude : location.lat,
      longitude : location.lon
    };
    if ($rootScope.map.zoom < 16) {
      $rootScope.map.zoom = 16;
    }
  };

  var getBoundingBox = function(a, b) {
    var bbox = {
      west : 180,
      east : -180,
      north : -90,
      south : 90,
    };
    
      if (a.lat < b.lat) {
        bbox.south = a.lat;
        bbox.north = b.lat;
      } else {
        bbox.south = b.lat;
        bbox.north = a.lat;
      }
      if (a.lon < b.lon) {
        bbox.west = a.lon;
        bbox.east = b.lon;
      } else {
        bbox.west = b.lon;
        bbox.east = a.lon;
      }
     
    return bbox;
  };
  
  var showSitelink = function(link) {
    service.queryResult = "Sitelink: " + link.name;
    service.attributeValueChangeNotification('mapChanged');

    var a = link.geoLocationA.location;
    var b = link.geoLocationB.location;
    var bbox = getBoundingBox(a,b);
    setBounds(bbox.south, bbox.north, bbox.west, bbox.east);
    
    var lat = (a.lat + b.lat) / 2;
    var lon = (a.lon + b.lon) / 2;
    var latLng = new google.maps.LatLng(lat, lon);
    
    service.infowindowOpen = link.id;
    var content = '<site-link-details site-link-index="\'';
    content += dbIndex;
    content += '\'" site-link-id-low="\'';
    content += link.id.low;
    content += '\'" site-link-id-high="\'';
    content += link.id.high;
    content += '\'"></site-link-details>';
    var compiled = $compile(content)($rootScope);
    service.handleInfoWindow(latLng, compiled[0]);
    
    $rootScope.isSearching = false;
  };

  var showMwrLink = function(link) {
    service.queryResult = 'MWR link: ' + link.id.mwrLinkId;
    service.attributeValueChangeNotification('mapChanged');
    
    var a = link.sa.loc.location;
    var b = link.sb.loc.location;
    var bbox = getBoundingBox(a,b);
    setBounds(bbox.south, bbox.north, bbox.west, bbox.east);
    
    var lat = (a.lat + b.lat) / 2;
    var lon = (a.lon + b.lon) / 2;
    var latLng = new google.maps.LatLng(lat, lon);
    
    service.infowindowOpen = link.id.mwrLinkId;
    var content = '<site-link-details site-link-index="\'';
    content += dbIndex;
    content += '\'" site-link-id-low="\'';
    content += link.id.siteLinkId.low;
    content += '\'" site-link-id-high="\'';
    content += link.id.siteLinkId.high;
    content += '\'"></site-link-details>';
    var compiled = $compile(content)($rootScope);
    service.handleInfoWindow(latLng, compiled[0]);
    
    $rootScope.isSearching = false;
  };
  
  var arrowSymbol = {
      path : google.maps.SymbolPath.FORWARD_OPEN_ARROW,
      strokeOpacity: 1,
      scale: 4
  };
  var lineSymbolDashed = {
      path: 'M 0,-2 0,2',
      strokeOpacity: 1,
      scale: 6
    }; // 50px
  var lineSymbolDotted = {
      path: 'M 0,0.5 0,-0.5',
      strokeOpacity: 1,
      scale: 6
    };
  var lineTypes = {
      solid: {
        icons: [ {
          icon : arrowSymbol,
          offset : '100%'
      }],
        stroke : {
          color : '#00dd00',
          weight : 6,
          opacity: 1
        },
        strokeOpacity: 1,
        editable : false,
        draggable : false,
        geodesic : true,
        visible : true,
        zIndex : 30,
        title : 'todo'
      },
      dashed: {
        icons: [{
          icon: lineSymbolDashed,
          offset: '0%',
          repeat: '50px'
        }, {
          icon : arrowSymbol,
          offset : '100%'
      }],
        stroke : {
          color : '#00ff00',
          weight : 6,
          opacity: 0.1
        },
        strokeOpacity: 0,
        editable : false,
        draggable : false,
        geodesic : true,
        visible : true,
        zIndex : 30,
        title : 'todo'
      },
      dotted: {
        icons: [{
          icon: lineSymbolDotted,
          offset: '0%',
          repeat: '20px'
        }, {
          icon : arrowSymbol,
          offset : '100%'
      }],
        stroke : {
          color : '#dddd00',
          weight : 6,
          opacity: 0.1
        },
        strokeOpacity: 0,
        editable : false,
        draggable : false,
        geodesic : true,
        visible : true,
        zIndex : 30,
        title : 'todo'
      }
  };
  var createPathPolyline = function(mapPath, callback) {
    
    var lineTypeIndex = 'solid';
    if (mapPath.status === 'required') {
      lineTypeIndex = 'solid';
    } else if (mapPath.status === 'planned') {
      lineTypeIndex = 'dashed';
    } else {
      lineTypeIndex = 'dotted';
    }
    var line = lineTypes[lineTypeIndex];
    line.id = mapPath.id;
    line.index = dbIndex;
    line.path = mapPath.sitePath;
    return callback(line);
  };

  var showPaths = function(paths) {
    
    var west = 180;
    var east = -180;
    var north = -90;
    var south = 90;

    var pathIds = paths.map(function(path){
      console.log('++++++++', JSON.stringify(path._source.id));
      var siteIds = $pathManager.getPath(path);
      service.getSitesByIds(dbIndex, siteIds, function(sites) {
        var points = {};
        sites.map(function(site) {
          var location = site._source.geoLocation.location;
          if (west > location.lon) {
            west = location.lon;
          }
          if (location.lon > east) {
            east = location.lon;
          }
          if (south > location.lat) {
            south = location.lat;
          }
          if (location.lat > north) {
            north = location.lat;
          }
          points[site._source.id.siteId] = {
            latitude : location.lat,
            longitude : location.lon
          };
        });

        var mapPath = {};
        mapPath.sitePath = [];
        siteIds.map(function(siteId) {
          if (points[siteId]) {
            mapPath.sitePath.push(points[siteId]);
          }
        });

        mapPath.status = 'unknown';
        if (path._source.ePlanner.planner === 'x:akta') {
          mapPath.status = 'required';
        } else if (path._source.ePlanner.planner.startsWith('autor')) {
          mapPath.status = 'proposed';
        } else {
          mapPath.status = 'planned';
        }
        
        mapPath.id = 'path_' + path._source.id;
        createPathPolyline(mapPath, function(model) {
          $rootScope.mapObjects.paths.models.push(model);
        });
        console.info('before', south, north, west, east);
        setBounds(south, north, west, east);
      });
       return path._source.id;
    });
    
    service.queryResult = 'Paths: ' + pathIds.join(', ');
    service.attributeValueChangeNotification('mapChanged');

  };

  var showResult = function(data) {
    service.queryResult = data.display_name;
    service.attributeValueChangeNotification('mapChanged');
    var bounds = {
      northeast : {
        latitude : data.boundingbox[1],
        longitude : data.boundingbox[3]
      },
      southwest : {
        latitude : data.boundingbox[0],
        longitude : data.boundingbox[2]
      }
    };
    $rootScope.map.bounds = bounds;
    //$networkMap.setMap($scope.map);
  };

  var getPrecision =
      function(screenBounds) {
        var minlat = screenBounds.southwest.latitude;
        var minlon = screenBounds.southwest.longitude;
        var maxlat = screenBounds.northeast.latitude;
        var maxlon = screenBounds.northeast.longitude;

        var precision = 1;
        var geohashes = [];
        var goahead = true;
        var precisionFactor = 3;

        while (goahead) {
          precision++;
          geohashes = geohash.bboxes(minlat, minlon, maxlat, maxlon, precision);
          var sw = geohash.encode(minlat, minlon, precision);
          var east = geohash.neighbor(sw, [
            0, precisionFactor
          ]);
          var north = geohash.neighbor(sw, [
            precisionFactor, 0
          ]);
          goahead =
              (sw === east || sw === north || geohashes.indexOf(east) === -1 || geohashes.indexOf(north) === -1) && 
              (geohashes.length < 33) && 
              (geohashes.length > 0);
        }
        console.log('precision: ' + precision, 'geohashes: ', geohashes.length);
        return precision;
      };

  var getRestURL = function(index, documentType, command) {
    var s = '/db/';
    // var s = $location.protocol();
    // s += '://';
    // s += $location.host();
    // s += ':';
    // s += ($location.port() === 9092) ? '9092/db/' : '9200/';
    s += index;
    s += '/';
    s += documentType;
    s += '/';
    s += command;

    // console.log(counter++, s);
    return s;
  };

  var partial_fields = {
    forMap : {
      exclude : [
        "networkElements", "bandwidth14", "siteSource"
      ]
    }
  };

  var service = {};

  service.statistics = {
    sites : {
      label : 'SITES',
      count : 0,
      displayed : 0
    },
    siteLinks : {
      label : 'SITELINKS',
      count : 0,
      displayed : 0
    }
  };

  service.options = {};
  service.isWorking = false;
  service.setOptions = function(options) {
    this.options = options;
    this.attributeValueChangeNotification('mapChanged');
  };

  service.getNewRequest = function(method, url, data) {
    return {
      method : method,
      url : url,
      headers : {
        'Content-Type' : 'application/json'
      },
      data : data
    };
  };

  service.getBounds = function(callback) {
    var data = {
      from : 0,
      size : 0,
      query : {
        match_all : {}
      },
      partial_fields : partial_fields,
      aggs : {
        west : {
          min : {
            field : 'lon'
          }
        },
        east : {
          max : {
            field : 'lon'
          }
        },
        south : {
          min : {
            field : 'lat'
          }
        },
        north : {
          max : {
            field : 'lat'
          }
        }
      }
    };
    var url = getRestURL(dbIndex, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log('htLog: ' + '>> ' + requestId++);
    service.setWorking(true);
    // console.log('htLog: ' + JSON.stringify(req));
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      // console.log('htLog: ' + '<< ' + requestId);
      var bounds = {
        northeast : {
          latitude : data.aggregations.north.value,
          longitude : data.aggregations.east.value
        },
        southwest : {
          latitude : data.aggregations.south.value,
          longitude : data.aggregations.west.value
        }
      };
      // console.log('htLog: ' + JSON.stringify(bounds));
      callback(bounds);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting bounds. ', data, status);
      callback(null);
    });
  };

  service.getClusters = function(bounds, callback) {
    var precision = getPrecision(bounds);
    var northWest = geohash.encode(bounds.northeast.latitude, bounds.southwest.longitude, precision);
    var topLeft = geohash.decode_bbox(northWest);
    var southEast = geohash.encode(bounds.southwest.latitude, bounds.northeast.longitude, precision);
    var bottom_right = geohash.decode_bbox(southEast);
    var data = {
      from : 0,
      size : 0,
      query : {
        filtered : {
          query : {
            match_all : {}
          },
          filter : {
            geo_bounding_box : {
              'geoLocation.location' : {
                top_left : {
                  // [minlat, minlon, maxlat, maxlon].
                  lat : topLeft[2],
                  lon : topLeft[1]
                },
                bottom_right : {
                  lat : bottom_right[0],
                  lon : bottom_right[3]
                }
              }
            }
          }
        }
      },
      partial_fields : partial_fields,
      aggs : {
        clusters : {
          geohash_grid : {
            field : 'location',
            precision : precision,
          }
        }
      }
    };
    var url = getRestURL(dbIndex, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log('htLog: ' + JSON.stringify(req));
    service.setWorking(true);
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      // console.log('htLog: ' + '<< ' + requestId);
      // console.log('htLog: Count of clusters: ' +
      // data.aggregations.clusters.buckets.length);
      callback(data.aggregations.clusters.buckets, precision);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting clusters. ', data, status);
      callback(null, precision);
    });
  };

  service.getAltitude = function(lat, lon, callback) {
    var restUrl = 'https://open.mapquestapi.com/elevation/v1/profile';
    restUrl += '?key=Fmjtd%7Cluu8296z2h%2C25%3Do5-9w1xqu';
    restUrl += '&shapeFormat=raw';
    restUrl += '&latLngCollection=' + lat + ',' + lon;

    $http.get(restUrl).success(function(data) {
      return callback(null, data.elevationProfile[0].height);
    }).error(function(data, status) {
      return callback('Error! ' + data + ' (' + status + ')', null);
    });
  };

  service.getSiteById = function(dbIndex, siteId, callback) {
    var data = {
      from : 0,
      size : 1,
      query : {
        match : {
          'siteId' : siteId
        }
      }
    };
    var url = getRestURL(dbIndex, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log(JSON.stringify(req));
    service.setWorking(true);
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      // console.log('htLog: ' + '<< ' + requestId);
      callback(data.hits.hits[0]);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting site (' + siteId + ').', data, status);
      callback(null);
    });

  };

  service.removeSite = function(siteIndex, siteId, callback) {
    service.setWorking(true);
    // console.log(siteIndex, siteId);
    var req = {
      method : 'GET',
      url : '/api/delete/site/' + siteId,
      headers : {
        'Content-Type' : 'application/json'
      }
    };
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      callback(null, data);
    }).error(function(data, status) {
      console.info('htLog: ', data, status);
      service.setWorking(false);
      callback(data, null);
    });
  };

  service.removeSiteLink = function(siteLinkIndex, siteLinkId, callback) {
    service.setWorking(true);
    // console.log('removeInDB', siteLinkIndex, siteLinkId);
    var req = {
      method : 'GET',
      url : '/api/delete/loslink/' + siteLinkId.high + '/' + siteLinkId.low,
      headers : {
        'Content-Type' : 'application/json'
      }
    };
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      callback(null, data);
    }).error(function(data, status) {
      console.info('error', 'remove', siteLinkIndex, siteLinkId, data, status);
      service.setWorking(false);
      callback(data, null);
    });
  };

  service.getSites = function(bounds, callback) {
    var data = {
      from : 0,
      size : service.statistics.sites.count, // get all
      query : {
        filtered : {
          query : {
            match_all : {}
          },
          filter : {
            geo_bounding_box : {
              'geoLocation.location' : {
                top_left : {
                  lat : bounds.northeast.latitude,
                  lon : bounds.southwest.longitude
                },
                bottom_right : {
                  lat : bounds.southwest.latitude,
                  lon : bounds.northeast.longitude
                }
              }
            }
          }
        }
      },
      partial_fields : partial_fields
    };
    var url = getRestURL(dbIndex, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log('htLog: ' + '>> ' + requestId++);
    service.setWorking(true);
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      callback(data.hits.hits);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting clusters. ', data, status);
      callback(null);
    });
  };

  service.getSiteLinksByBounds = function(bounds, callback) {
    // console.log(JSON.stringify(bounds));
    if (bounds === undefined) {
      console.log('htLog: bounds are undefined.');
      return callback([]);
    }

    var west = bounds.southwest.longitude;
    var south = bounds.southwest.latitude;
    var east = bounds.northeast.longitude;
    var north = bounds.northeast.latitude;

    var url = ['/api', 'loslinks', west, south, east, north, 50].join('/');

    var req = service.getNewRequest('POST', url, undefined);
    service.setWorking(true);
    $http(req).success(function(siteLinks, status) {
      console.log('htLog: ', siteLinks, status);
      service.setWorking(false);
      return callback(siteLinks);
    }).error(function(data, status) {
      console.info("htLog: Request for sitelinks in viewport failed.", JSON.stringify(req), data, status);
      return callback([]);
    });
  };

  service.getDetailedNetworkElements = function(dbIndex, siteId, callback) {
    var data = {
      from : 0,
      size : 999, // get all
      query : {
        term : {
          siteRef : siteId
        }
      }
    };
    var url = getRestURL(dbIndex, 'networkelement', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log('htLog: ' + '>> ' + requestId++);
    service.setWorking(true);
    $http(req).success(function(networkElements, status) {
      console.log('htLog: ', networkElements, status);
      service.setWorking(false);
      callback(networkElements.hits.hits);
    }).error(function(data, status) {
      console.info("htLog: Request for networkElements failed.", data, status);
      callback([]);
    });
  };

  service.getSiteLinksBySiteIds = function(dbIndex, siteIds, callback) {
    // console.log('### ', index, JSON.stringify(siteIds));
    if (siteIds.length === 0) {
      service.statistics.siteLinks.displayed = 0;
      return callback([]);
    }

    // console.log(0, siteIds);
    // siteIds = JSON.parse(JSON.stringify(siteIds).toLowerCase().replace(/\//g,
    // 'X').replace(/_/g, 'X'));
    var data = {
      from : 0,
      size : 99999, // get all
      query : {
        filtered : {
          query : {
            match_all : {}
          },
          filter : {
            or : [
              {
                terms : {
                  siteARef : siteIds
                }
              }, {
                terms : {
                  siteBRef : siteIds
                }
              }
            ]
          }
        }
      }
    };

    // console.log(55555, JSON.stringify(data));
    var url = getRestURL(dbIndex, 'sitelink', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log(JSON.stringify(req));
    service.setWorking(true);
    $http(req).success(function(siteLinks, status) {
      console.log('htLog: ', siteLinks, status);
      service.setWorking(false);
      service.statistics.siteLinks.displayed = siteLinks.hits.hits.length;
      callback(siteLinks.hits.hits);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting siteLinks by siteIds. ', data, status);
      callback([]);
    });
  };

  service.getSitesOfLink = function(siteLink, callback) {
    var req = {
      method : 'POST',
      url : getRestURL(siteLink._index, 'site', '_search'),
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {
        from : 0,
        size : 2,
        query : {
          terms : {
            'id.siteId' : [
              siteLink._source.id.high, siteLink._source.id.low
            ],
            minimum_should_match : 1
          }
        }
      }
    };
    // console.log(JSON.stringify(req));
    $http(req).success(function(sites, status) {
      console.log('htLog: ', sites, status);
      callback(sites.hits.hits);
    }).error(function(data, status) {
      console.info('htLog: Request for sites of siteLink failed.', data, status);
      callback({});
    });

  };

  service.getSiteLink = function(index, siteLinkId, callback) {
    // console.log('### ', index, siteLinkId);
    var data = {
      from : 0,
      size : 1, // get all
      query : {
        filtered : {
          query : {
            match_all : {}
          },
          filter : {
            and : [
              {
                term : {
                  'id.high' : siteLinkId.high
                }
              }, {
                term : {
                  'id.low' : siteLinkId.low
                }
              }
            ]
          }
        }
      }
    };

    // console.log(JSON.stringify(data));
    var url = getRestURL(index, 'sitelink', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log(JSON.stringify(req));
    service.setWorking(true);
    $http(req).success(function(siteLink, status) {
      console.log('htLog: ', siteLink, status);
      service.setWorking(false);
      // console.log(1, JSON.stringify(siteLinks));
      callback(siteLink.hits.hits[0]);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting siteLink by siteLinkId. ', data, status);
      callback(null);
    });
  };

  service.getSitesByGeoHashes = function(geoHashes, callback) {
    if (geoHashes.length === 0) {
      service.statistics.sites.displayed = 0;
      return callback([]);
    }

    var or = [];
    geoHashes.map(function(geoHash) {
      var orItem = {
        geohash_cell : {
          'geoLocation.location' : geoHash
        }
      };
      or.push(orItem);
    });
    var data = {
      from : 0,
      size : service.statistics.sites.count, // get all
      query : {
        filtered : {
          query : {
            match_all : {}
          },
          filter : {
            or : or
          }
        }
      },
      partial_fields : partial_fields
    };
    // console.log(JSON.stringify(data));
    var url = getRestURL(dbIndex, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    // console.log('htLog: ' + '>> ' + requestId++);
    service.setWorking(true);
    $http(req).success(function(sites, status) {
      console.log('htLog: ', sites, status);
      service.setWorking(false);
      // console.log(JSON.stringify(sites));
      service.statistics.sites.displayed = sites.hits.hits.length;
      callback(sites.hits.hits);
    }).error(function(data, status) {
      console.info('htLog: Error while requesting documents by geoHashes. ', data, status);
      callback(null);
    });
  };

  service.googleMap = function() {
    return $rootScope.map.control.getGMap();
  };

  service.infowindow = new google.maps.InfoWindow();
  service.setMarker = function(marker) {
    this.marker = marker;
  };

  service.getInfowindow = function() {
    return this.infowindow;
  };

  // TODO remove after switched to new DB
  service.icon = {
    path : google.maps.SymbolPath.CIRCLE,
    scale : 10,
    strokeWeight : 3,
    strokeColor : '#dd0000',
    fillColor : '#dd0000',
    fillOpacity : 1.0,
    anchor : new google.maps.Point(0, 0)
  };

  service.getSitesByIds = function(index, siteIds, callback) {
    if (siteIds.length === 0) {
      return callback([]);
    }

    var data = {
      from : 0,
      size : 99999, // get all
      query : {
        terms : {
          siteId : siteIds,
        // minimum_should_match : 1
        }
      }
    };
    var url = getRestURL(index, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    service.setWorking(true);
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      callback(data.hits.hits);
    }).error(function(data, status) {
      console.log('htLog: Error while requesting sites by siteIds. ', data, status);
      callback(null);
    });
  };

  service.getStatistics = function(callback) {
    // try new DB
    var data = {
      from : 0,
      size : 0,
      query : {
        match_all : {}
      },
      aggs : {
        west : {
          min : {
            field : 'geoLocation.location.lon'
          }
        },
        east : {
          max : {
            field : 'geoLocation.location.lon'
          }
        },
        south : {
          min : {
            field : 'geoLocation.location.lat'
          }
        },
        north : {
          max : {
            field : 'geoLocation.location.lat'
          }
        }
      }
    };
    var url = getRestURL(dbIndex, 'site', '_search');
    var req = service.getNewRequest('POST', url, data);
    service.setWorking(true);
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      service.network = {
        bounds : {
          northeast : {
            latitude : data.aggregations.north.value,
            longitude : data.aggregations.east.value
          },
          southwest : {
            latitude : data.aggregations.south.value,
            longitude : data.aggregations.west.value
          }
        }
      };
      service.statistics.sites.count = data.hits.total;

      var url = getRestURL(dbIndex, 'sitelink', '_count');
      var reqSiteLinkCount = service.getNewRequest('GET', url, data);
      service.setWorking(true);
      $http(reqSiteLinkCount).success(function(data, status) {
        console.log('htLog: ', data, status);
        service.setWorking(false);
        service.statistics.siteLinks.count = data.count;
        return callback(null, service.statistics);
      });

    }).error(function(data, status) {
      console.info("htLog: this must not happen!", data, status);
      return callback('Server not reachable? Please check internet connectivity. (' + status + ')', null);
    });
  };

  service.getDbIndex = function(callback) {
    service.setWorking(true);
    var url = '/api/server';
    var req = service.getNewRequest('GET', url);
    $http(req).success(function(data, status) {
      console.log('htLog: ', data, status);
      service.setWorking(false);
      dbIndex = data.network_index;
      return callback(dbIndex);
    }).error(function(data, status) {
      console.info('htLog: ', data, status);
      return callback(dbIndex);
    });
  };

  service.setWorking = function(working) {
    this.isWorking = working;
    this.attributeValueChangeNotification('mapChanged');
  };
  service.setMap = function(map) {
    this.map = map;
    this.attributeValueChangeNotification('mapChanged');
  };
  service.attributeValueChangeNotification = function(handle) {
    $rootScope.$broadcast(handle);
  };

  service.attributeValueChangeListener = function(callback) {
    $rootScope.$on('mapChanged', callback);
  };

  service.getDbIndex(function(value) {
    dbIndex = value;
  });

  service.handleQueryResult = function(result) {
    if (result.result.status === 'OK' && result.result.data.hits.hits.length > 0) {
      var type = result.result.data.hits.hits[0]._type;
      switch (type) {
        case 'site':
          showSite(result.result.data.hits.hits[0]._source);
          break;
        case 'sitelink':
          showSitelink(result.result.data.hits.hits[0]._source);
          break;
        case 'mwrlinkrevisionvariant':
          showMwrLink(result.result.data.hits.hits[0]._source);
          break;
        case 'path':
          showPaths(result.result.data.hits.hits);
          break;
      }
    } else {
      var request = result.request;
      request.objectType = 'nominatim';
      $query.query(request, function(result) {
        if (result.result.status === 'OK' && result.result.data.length > 0) {
          showResult(result.result.data[0]);
        } else {
          $rootScope.queryResult = "Not found!";
        }
        $rootScope.isSearching = false;
      });
    }
  };

  service.handleInfoWindow = function(latLng, content) {
    this.infowindow.setContent(content);
    this.infowindow.setPosition(latLng);
    this.infowindow.open(this.googleMap());
  };

  service.getDensity = function(type, callback) {
    var url = [
      '/ux/modules/density/' + type + '.json'
    ].join('');
    $http.get(url).success(function(data) {
      callback(data);
    }).error(function(data, status) {
      console.info('htLog:', data, status);
      callback([]);
    });
  };
  return service;
}]);

app.factory('siteMarkerService', ['$rootScope', 'geohash', 'profileService', function($rootScope, geohash, profileService) {

  var getSiteFillOpacity = function(site, options) {
    var opacity = 0;
    opacity = parseFloat(profileService.profile[options.type][options.status].fill.opacity);
    return opacity;
  };
  var getPath = function(type) {
    var count = service.shape.types.indexOf(type);
    switch (count) {
      case 0:
        return 'M-1,0a1,1 0 1,0 2,0a1,1 0 1,0 -2,0';
      case 1:
        return 0;
      case 2:
        return 'M0,0 L0,-1';
      default:
        var index = count;
        var path = "z";
        while (index) {
          index--;
          var angle = 2 * Math.PI / count * index;
          var x = Math.round(Math.cos(angle) * 100) / 100;
          var y = Math.round(Math.sin(angle) * 100) / 100;
          if (index === 0) {
            path = "M" + x + "," + y + " " + path;
          } else {
            path = "L" + x + "," + y + " " + path;
          }
        }
        path = "M0,0 " + path;
        return path;
    }
    return 0;
  };

  /**
   * siteMarker Service
   */
  var service = {};

  service.shape = {
    types : [
      'circle', 'dot', 'dash', 'triangle', 'square', 'pentagon', 'hexagon', 'heptagon', 'octagon'
    ],
  };

  service.init = function(profileId) {
    profileService.getProfileData(profileId, function(err, data) {
      // do nothing
      console.log(err, data);
    });
  };
  service.getIcon = function(site, options) {
    // console.log('htLog: options', JSON.stringify(options));
    // JSON.stringify(site));
    var s = profileService.profile[options.type].shape;
    var p = profileService.profile[options.type][options.status];

    var scale = parseInt(s.scale);
    var rotation = parseInt(s.rotation);

    if (site.isAggregator) {
      scale = profileService.profile.siteIsAggregator.shape.scale;
      rotation = profileService.profile.siteIsAggregator.shape.rotation;
    }

    // DENSITY SETTINGS // TODO mow to Profile?
    // values in sites per square km
    var ranges = {
      urban : {
        from : 1,
        color : '#FF4500'
      },
      suburban : {
        from : 0.3,
        to : 1,
        color : '#FFA500'
      },
      rural : {
        from : 0,
        to : 0.3,
        color : '#FFD700'
      }
    };

    var strokeColor = p.stroke.color;
    var fillColor = p.fill.color;
    
    // temp eplus in green
    if (site.geoLocation.sourceGeo && site.geoLocation.sourceGeo.indexOf('DAYLIGHT') > -1) {
        strokeColor = '#00FF00';
        fillColor = '#00FF00';    	
    }
    
    
    if (site.densityBsPerSKm) {
      var keys = Object.keys(ranges);
      var rangeKey;
      keys.map(function(key) {
        if (ranges[key].from && ranges[key].to) {
          if (ranges[key].from <= site.densityBsPerSKm && site.densityBsPerSKm < ranges[key].to) {
            rangeKey = key;
          }
        } else if (ranges[key].from) {
          if (ranges[key].from <= site.densityBsPerSKm) {
            rangeKey = key;
          }
        } else {
          if (site.densityBsPerSKm < ranges[key].to) {
            rangeKey = key;
          }
        }
      });
      strokeColor = ranges[rangeKey].color;
      fillColor = ranges[rangeKey].color;
    }

    return {
      path : getPath(s.type),
      scale : scale,
      rotation : rotation,
      strokeWeight : parseInt(p.stroke.width),
      strokeColor : strokeColor,
      strokeOpacity : parseFloat(p.stroke.opacity),
      fillColor : fillColor,
      fillOpacity : getSiteFillOpacity(site, options),
      anchor : {
        x : 0,
        y : 0
      }
    };
  };

  service.getCircle = function(id, site, radius, callback) {
    // console.info('circle', JSON.stringify(site));
    return callback({
      id : id,
      center : {
        latitude : site.geoLocation.location.lat,
        longitude : site.geoLocation.location.lon
      },
      radius : radius,
      stroke : {
        color : '#EEEEEE',
        weight : 1,
        opacity : 1
      },
      fill : {
        color : '#EEEEEE',
        opacity : 0.1
      },
      geodesic : true, // optional: defaults to false
      draggable : false, // optional: defaults to false
      clickable : false, // optional: defaults to true
      editable : false, // optional: defaults to false
      visible : true, // optional: defaults to true
      control : {}
    });
  };

  service.createSiteMarker = function(id, site, options, callback) {
    // console.log('htLog: site: ', JSON.stringify(site));
    var siteLinks = site.siteLinks.length;
    if (site.siteSource === 'linkTable') {
      siteLinks = 0;
      console.log('linkTable');
    }
    // console.log('### ' + JSON.stringify(site));
    
    var fiberPlanDate;
    var fiberActualDate;
    
    // check for agg and init site Extensions, if exists
    var aggregator = function(site) {
      if (site.isAggregator) {
        return site.isAggregator;
      }
      if (site.siteExtensions) {
        fiberPlanDate = site.siteExtensions.fiberPlanDate;
        fiberActualDate = site.siteExtensions.fiberActualDate;
        if (site.siteExtensions.fiberPlanDate) {
          options.type = 'siteHasFiberPlanned';
        }
        if (site.siteExtensions.fiberActualDate) {
          options.type = 'siteHasFiber';
        }
        return site.siteExtensions.concentrator;
      }
      return false;
    };
    
    var reducedSite = {
      id : {
        siteId : site.id.siteId
      },
      siteName : site.siteName,
      geoLocation : site.geoLocation,
      siteLinks : siteLinks,
      densityBsPerSKm : undefined, // site.densityBsPerSKm
      isAggregator : aggregator(site),
      fiberPlanDate : fiberPlanDate,
      fiberActualDate : fiberActualDate
    };

    var icon = service.getIcon(reducedSite, options);
    var lat = site.geoLocation.location.lat;
    var lon = site.geoLocation.location.lon;

    var newMarker = {
      id : id,
      site : reducedSite,
      isCluster : false,
      mykey : geohash.encode(lat, lon, 5),
      type : options.type,
      latitude : lat,
      longitude : lon,
      icon : icon,
      showWindow : false,
      selected : false,
      toggle : service.markerToggle,
      options : {
        visible : options.visible,
        zIndex : profileService.profile[options.type].shape.zIndex,
        draggable : (site.id.siteId === -1),
        title : site.siteName.toString()
      }
    };
    return callback(newMarker);
  };

  // service.markerToggle = function(dbIndex, id) {
  // // TODO is this needed
  // console.log('site selected: ' + id);
  // this.selected = !this.selected;
  // if (this.selected) {
  // this.seletedId = id;
  // $scope.mapObjects.sites.models.push(createSelectionMarker(this.seletedId,
  // this.latitude, this.longitude));
  // } else {
  // removeSiteMarker(dbIndex, this.selectedId);
  // this.selectedId = undefined;
  // }
  // };
  //
  return service;

}]);

app.controller('mapControlCtrl', [
  '$rootScope', '$scope', '$compile', '$http', '$query', '$networkMap',  
  function($rootScope, $scope, $compile, $http, $query, $networkMap) {

    $networkMap.attributeValueChangeListener(function() {
      $scope.map = $networkMap.map;
      $scope.options = $networkMap.options;
      $scope.statistics = $networkMap.statistics;
      $scope.isWorking = $networkMap.isWorking;
      $scope.queryResult = $networkMap.queryResult;
    });

    var getDbIndex = function() {
      if (dbIndex === undefined) {
        $networkMap.getDbIndex(function(value) {
          dbIndex = value;
          return dbIndex;
        });
      } else {
        return dbIndex;
      }
    };
    var dbIndex = getDbIndex();

    $scope.refresh = function() {
      console.log('refresh');
    };

    angular.extend($scope, {

      showControls : true,
      controlClick : function() {
        $scope.showControls = !$scope.showControls;
      },
      oneAtATime : true,
      query : '',
      panTo : function(latLon) {
        $scope.map.center = {
          latitude : latLon[0],
          longitude : latLon[1]
        };
        $scope.map.zoom = 12;
        $networkMap.setMap($scope.map);
      },
      groups : [
        {
          title : 'Search',
          templateUrl : '/ux/modules/networkMap/templates/search.html',
          open : false
        }, {
          title : 'Cities',
          templateUrl : '/ux/modules/networkMap/templates/cities.html',
          open : false
        }, {
          title : 'Geographical Coordinates',
          templateUrl : '/ux/modules/networkMap/templates/geographicalCoordinates.html',
          open : false
        }, {
          title : 'Layer',
          templateUrl : '/ux/modules/networkMap/templates/layer.html',
          open : false
        }, {
          title : 'Statistics',
          templateUrl : '/ux/modules/networkMap/templates/statistics.html',
          open : false
        }, {
          title : 'Legend',
          templateUrl : '/ux/modules/networkMap/templates/legend.html',
          open : false
        }
      ],
      cities : [
        {
          name : "Berlin",
          latlng : [
            52.518611, 13.408333
          ]
        }, {
          name : "Hamburg",
          latlng : [
            53.550556, 9.993333
          ]
        }, {
          name : "München",
          latlng : [
            48.137222, 11.575556
          ]
        }, {
          name : "Köln",
          latlng : [
            50.938056, 6.956944
          ]
        }, {
          name : "Frankfurt am Main",
          latlng : [
            50.110556, 8.682222
          ]
        }, {
          name : "Stuttgart",
          latlng : [
            48.775556, 9.182778
          ]
        }, {
          name : "Düsseldorf",
          latlng : [
            51.225556, 6.782778
          ]
        }, {
          name : "Dortmund",
          latlng : [
            51.514167, 7.463889
          ]
        }, {
          name : "Essen",
          latlng : [
            51.458069, 7.014761
          ]
        }, {
          name : "Bremen",
          latlng : [
            53.075878, 8.807311
          ]
        }, {
          name : "Leipzig",
          latlng : [
            51.340333, 12.37475
          ]
        }, {
          name : "Dresden",
          latlng : [
            51.049259, 13.73836
          ]
        }, {
          name : "Hannover",
          latlng : [
            52.374444, 9.738611
          ]
        }, {
          name : "Nürberg",
          latlng : [
            49.455556, 11.078611
          ]
        }, {
          name : "Duisburg",
          latlng : [
            51.435147, 6.762692
          ]
        }
      ],
      legend : {
        // changeColor: function(baselayer) {
        // var obj = $scope.legend.data;
        // Object.keys(obj).forEach(function (key) {
        // obj[key].color = obj[key].colors[baselayer];
        // });
        // $scope.paths = {};
        // leafletData.getMap().then(function(map) {
        // doLayer(map.getBounds());
        // })
        // },
        data : {
          'Provider A' : {
            label : 'ProviderA',
            color : '#0CF',
            colors : {
              osm : '#0000FF',
              satellit : '#0CF'
            }
          },
          TELEFONICA : {
            label : 'Leased',
            color : '#0CF',
            colors : {
              osm : '#0000FF',
              satellit : '#0CF'
            }
          },
          EPLUS : {
            label : 'Provider1',
            color : '#0F3',
            colors : {
              osm : '#008800',
              satellit : '#0F3'
            }
          },
          MIX : {
            label : 'Mix',
            color : '#00FFFF',
            colors : {
              osm : '#00AAAA',
              satellit : '#00FFFF'
            }
          }
        }
      },
      layers : {
        baseLayers : {
          hybrid : {
            name : 'Satellite and Roads'
          },
          terrain : {
            name : 'Terrain'
          },
          roadmap : {
            name : 'Roadmap'
          },
          satellite : {
            name : 'Satellite'
          }
        },
        overlays : {
          sites : {
            name : 'SITES',
            type : 'group',
            visible : true
          },
          siteLinks : {
            name : 'SITELINKS',
            type : 'group',
            visible : true
          },
          paths : {
            name : 'PATHS',
            type : 'group',
            visible : true
          },
          urban : {
            name : 'URBAN',
            type : 'group',
            visible : false
          },
          suburban : {
            name : 'SUBURBAN',
            type : 'group',
            visible : false
          }
        },
        changeLayer : function(layer) {
          $scope.options.mapTypeId = layer;
          $scope.map.control.getGMap().setOptions($scope.options);
        }
      },
      map : $networkMap.map,
      options : $networkMap.options,
      statistics : $networkMap.statistics
    });

    $rootScope.isWorking = false;
    $rootScope.isSearching = false;

    $scope.addMarker = function() {
      // $scope.map.zoom = 20;

      var color = '#DD0000';
      var icon = {
        path : google.maps.SymbolPath.CIRCLE,
        scale : 10,
        strokeWeight : 3,
        strokeColor : color,
        fillColor : color,
        fillOpacity : 0.5,
        anchor : new google.maps.Point(0, 0)
      };

      var marker = new google.maps.Marker({
        position : new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude),
        map : $scope.map.control.getGMap(),
        icon : icon,
        zIndex : 20,
        draggable : true
      });

      $networkMap.setMarker(marker);

      var getPosLabel = function(v) {
        var keys = Object.keys(v);
        var lat = Math.round(v[keys[0]] * 1000000) / 1000000;
        var lng = Math.round(v[keys[1]] * 1000000) / 1000000;
        var s = lat;
        s += ' : ';
        s += lng;
        return s;
      };

      google.maps.event.addListener(marker, 'dragend', function() {
        console.log(JSON.stringify(marker.position));
        tooltip.show(getPosLabel(marker.position));
      });
      google.maps.event.addListener(marker, 'click', function(evt) {
        if ($scope.infoWindowOpen === null || $scope.infoWindowOpen === 'undefined') {
          $scope.infoWindowOpen = 'newSite';

          var keys = Object.keys(marker.position);
          var lat = Math.round(marker.position[keys[0]] * 1000000) / 1000000;
          var lng = Math.round(marker.position[keys[1]] * 1000000) / 1000000;
          var content = '<new-site lat=' + lat + ' lng=' + lng + '></new-site>';
          var compiled = $compile(content)($scope);
          $networkMap.handleInfoWindow(evt.latLng, compiled[0]);
        } else {
          $scope.infoWindowOpen = null;
          $networkMap.infowindow.close();
        }
      });
      google.maps.event.addListener(marker, 'mouseover', function() {
        console.log(JSON.stringify(marker.position));
        tooltip.show(getPosLabel(marker.position));
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        tooltip.hide();
      });
    };
    
    $scope.submit = function() {
      $scope.query = this.query; // This should not be needed :/
      if ($scope.query) {
        $rootScope.isSearching = true;

        var request = {};
        request.dbIndex = getDbIndex();
        request.objectType = 'database';
        request.value = $scope.query;
        $query.query(request, function(result) {
          $networkMap.handleQueryResult(result);
        });
      }
    };

    $scope.$watch('groups[4].open', function(v) {
      if (v) {
        $networkMap.statistics = $scope.statistics;
      }
    });

    $scope.$watch('layers.overlays.sites.visible', function(nv, ov) {
      if (nv !== undefined && ov !== undefined && nv !== ov) {
        $rootScope.setOverlayVisible('sites', nv);
      }
    });

    $scope.$watch('layers.overlays.siteLinks.visible', function(nv, ov) {
      if (nv !== undefined && ov !== undefined && nv !== ov) {
        $rootScope.setOverlayVisible('siteLinks', nv);
      }
    });

    $scope.$watch('layers.overlays.paths.visible', function(nv, ov) {
      if (nv !== undefined && ov !== undefined && nv !== ov) {
        $rootScope.setOverlayVisible('paths', nv);
      }
    });

    $scope.$watch('layers.overlays.urban.visible', function(nv, ov) {
      if (nv !== undefined && ov !== undefined && nv !== ov) {
        $rootScope.setOverlayVisible('urban', nv);
      }
    });

    $scope.$watch('layers.overlays.suburban.visible', function(nv, ov) {
      if (nv !== undefined && ov !== undefined && nv !== ov) {
        $rootScope.setOverlayVisible('suburban', nv);
      }
    });

  }
]);

/**
 * angular.js for htPathDetails
 */
var htPathDetails = angular.module('htPathDetails', [
  'ui.bootstrap', 'alert'
]);

htPathDetails.config([
  '$stateProvider',
  function($stateProvider) {
    'use strict';
    $stateProvider.state('htPathDetails', {
      // abstract:
      // true,
      url : '/paths/:dbIndex/:id',
      templateUrl : 'modules/pathDetails/pathDetails.html',
      controller : [
        '$rootScope', '$scope', '$stateParams', '$pathDetails', 'authenticationService', 'alertService', '$header',
        function($rootScope, $scope, $stateParams, $pathDetails, authenticationService, alertService, $header) {

          alertService.setMessage([
            'LOADING', 'SUCCESS', 'FAILED'
          ]);

          $scope.dbIndex = $stateParams.dbIndex;
          $scope.pathId = $stateParams.id;
          $rootScope.title = '(' + $scope.pathId + ') htPath';

          $scope.oneAtATime = true;
          $scope.groups = [
                           {
                               labelId : 'INFO',
                               templateUrl : '/ux/modules/pathDetails/templates/info.html',
                               open : true
                             },
                           {
                               labelId : 'RAW_DATA',
                               templateUrl : '/ux/modules/pathDetails/templates/rawData.html',
                               open : false
                             }
          ];

          $scope.path = {
            model : {},
            get : function(dbIndex, id, callback) {
              $header.setStatus(alertService.processing());
              $pathDetails.getPath(dbIndex, id, function(path) {
                $header.setStatus(alertService.success());
                $scope.path.model = path._source;
                // console.log(JSON.stringify(path));
                return callback($scope.path.model);
              });
            },
            getPrevious : function(dbIndex, id, callback) {
            	$pathDetails.getPreviousPath(dbIndex, id, function(path) {
            		if (path === undefined) {
            			return callback();
            		} 
                    return callback(path._source.id);
                 });        	
            },
            getNext : function(dbIndex, id, callback) {
            	$pathDetails.getNextPath(dbIndex, id, function(path) {
            		if (path === undefined) {
            			return callback();
            		} 
                    return callback(path._source.id);
                 });        	
            }
          };

          var getLinkDef = function(pathId) {
          	var r = {
        			link: ['/ux', '#', 'paths', $scope.dbIndex, pathId].join('/'),
        			title: pathId,
        			active: pathId !== undefined
        	};
        	if (!pathId) {
        		r.link = ['/ux', '#', ''].join('/');
        		r.title = 'HOME';
        	}
          	return r;
          };
          
          var initialzed = function() {
            $scope.path.get($scope.dbIndex, $scope.pathId, function(path) {
              console.log('htLog:', path);
            });
            $scope.path.getPrevious($scope.dbIndex, $scope.pathId, function(pathId) {
            	$scope.path.previous = pathId;
            	$header.setPrevious(getLinkDef(pathId)); 
            });
            $scope.path.getNext($scope.dbIndex, $scope.pathId, function(pathId) {
            	$scope.path.next = pathId;
            	$header.setNext(getLinkDef(pathId)); 
            });
          };
          initialzed();
        }
      ]
    });
  }
]);

// htPathDetails.controller('MountingPositionModifyCtrl',
// function($scope, $uibModalInstance, selectedMpRow) {
//
// $scope.mp = selectedMpRow;
//
// $scope.ok = function() {
// $uibModalInstance.close($scope.mp);
// };
//
// $scope.cancel = function() {
// $uibModalInstance.dismiss('cancel');
// };
// });
//
// htPathDetails.controller('MountingPositionAddCtrl',
// function($scope, $uibModalInstance, newMp) {
//
// $scope.mp = newMp;
//
// $scope.ok = function() {
// $uibModalInstance.close($scope.mp);
// };
//
// $scope.cancel = function() {
// $uibModalInstance.dismiss('cancel');
// };
// });

htPathDetails.factory('$pathDetails', ['$http', function($http) {

  var getRequest = function(method, url, data) {
    return {
      method : method,
      url : url,
      headers : {
        'Content-Type' : 'application/json'
      },
      data : data
    };
  };

  var getNeighborPath = function(dbIndex, pathId, filter, callback) {
	  var field = Object.keys(filter)[0];
	  var order = 'asc';
	  if (filter[field].lt) {
		  order = 'desc';
	  }
      var url = [
                 '/db', dbIndex, 'path', '_search'
       ].join('/');
      var data = {
         from : 0,
         size : 1,
         sort: [
                  {
                    id: {
                      order: order
                    }
                  }
                ],
         _source: {
           include: [field]
         },
         query : {
      	   constant_score: {
      	         filter: {
      	            range: filter
      	         }
      	      }
         }
       };
       var req = getRequest('POST', url, data);
       $http(req).success(function(path, status) {
         console.log('htLog: ', path, status);
         return callback(path.hits.hits[0]);
       }).error(function(data, status) {
         console.info("htLog: Request for path failed.", JSON.stringify(req), data, status);
         return callback([]);
       });
  };
  
  var service = {};
  service.getPath = function(dbIndex, pathId, callback) {
    var url = [
      '/db', dbIndex, 'path', '_search'
    ].join('/');
    var data = {
      from : 0,
      size : 1,
      query : {
        match : {
          id : pathId
        }
      }
    };
    var req = getRequest('POST', url, data);
    $http(req).success(function(path, status) {
      console.log('htLog: ', path, status);
      return callback(path.hits.hits[0]);
    }).error(function(data, status) {
      console.info("htLog: Request for path failed.", JSON.stringify(req), data, status);
      return callback([]);
    });

    service.getPreviousPath = function(dbIndex, pathId, callback) {
    	var filter = {id: {lt: pathId}};
    	getNeighborPath(dbIndex, pathId, filter, function(path) {
            return callback(path);    		
    	});
    };

    service.getNextPath = function(dbIndex, pathId, callback) {
    	var filter = {id: {gt: pathId}};
    	getNeighborPath(dbIndex, pathId, filter, function(path) {
            return callback(path);    		
    	});
    };

};

  return service;
}]);

/**
 * angular.js for htPathManager
 */
var htPathManager =
    angular.module('htPathManager', [
      'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.resizeColumns',
      'htLogin', 'htDatabase', 'alert', 'translate'
    ]);

htPathManager
    .config([
      '$stateProvider',
      function($stateProvider) {
        'use strict';
        $stateProvider
            .state(
                'pathManager',
                {
                  // abstract:
                  // true,
                  url : '/pathManager/:dbIndex',
                  templateUrl : '/ux/modules/pathManager/pathManager.html',
                  controller : [
                    '$rootScope',
                    '$scope',
                    '$stateParams',
                    'uiGridConstants',
                    '$pathManager',
                    '$header',
                    'alertService',
                    function($rootScope, $scope, $stateParams, uiGridConstants, $pathManager, $header, alertService) {
                      $scope.dbIndex = $stateParams.dbIndex;
                      $rootScope.title = 'htPathManager';

                      alertService.setMessage([
                                               'LOADING', 'SUCCESS', 'FAILED'
                                           ]);

                      var from = 0;
                      var maxSize = 1000;
                      var numPaths = 0;

                      var actionCellTemplate =
                          [
                            '<a class="vCenter text-right" >',
                            '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>',
                            '<span> </span>',
                            '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>',
                            '</a>'
                          ].join('');

                      $scope.highlightFilteredHeader = function(row, rowRenderIndex, col) {
                        if (col.filters[0].term) {
                          return 'header-filtered';
                        } else {
                          return '';
                        }
                      };

                      var message = [
                        'Delete', 'Show in network map', 'Show details'
                      ];
                      $scope.getTitle = function(row, msgId) {
                        var info = message[msgId] + ': ' + row.id;
                        return info;
                      };

                      $scope.show = function(row) {
                        var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?path=' + row.id;
                        window.open(link, 'htNetworkMap');
                      };

                      $scope.open = function(row) {
                        var link = '/ux/#/paths/' + $scope.dbIndex + '/' + row.id;
                        window.open(link, 'htSolutions');
                      };

                      $scope.gridOptions = {};
                      $scope.gridOptions.data = [];
                      $scope.gridOptions.enableColumnResizing = true;
                      $scope.gridOptions.enableSorting = true;
                      $scope.gridOptions.enableFiltering = true;
                      $scope.gridOptions.enableGridMenu = true;
                      $scope.gridOptions.showGridFooter = true;
                      // $scope.gridOptions.showColumnFooter = true;
                      $scope.gridOptions.fastWatch = true;
                      $scope.gridOptions.enableRowSelection = true;
                      $scope.gridOptions.enableRowHeaderSelection = true;
                      $scope.gridOptions.multiSelect = false;

                      $scope.gridOptions.gridMenuCustomItems = [
                        {
                          title : 'Rotate Grid',
                          action : function($event) {
                            console.log($event);
                            this.grid.element.toggleClass('rotated');
                          },
                          order : 210
                        }
                      ];

                      $scope.gridOptions.columnDefs = [
                        {
                          field : 'id',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 80,
                          pinnedLeft : true
                        }, {
                          field : 'status',
                          type : 'string',
                          width : 120,
                          headerCellClass : $scope.highlightFilteredHeader
                        }, {
                          field : 'type',
                          type : 'string',
                          width : 80,
                          headerCellClass : $scope.highlightFilteredHeader
                        }, {
                          field : 'startNetworkElement',
                          displayName : 'Start NE',
                          width : 100,
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader
                        }, {
                          field : 'endNetworkElement',
                          displayName : 'End NE',
                          width : 100,
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader
                        }, {
                          field : 'planner',
                          displayName : 'Planner',
                          type : 'string',
                          width : 70,
                          headerCellClass : $scope.highlightFilteredHeader
                        }, {
                          field : 'countE1',
                          displayName : 'E1 count',
                          type : 'number',
                          width : 70,
                          headerCellClass : $scope.highlightFilteredHeader,
                          cellClass : 'number'
                        }, {
                          field : 'countSegments',
                          displayName : 'Segments count',
                          type : 'number',
                          width : 80,
                          headerCellClass : $scope.highlightFilteredHeader,
                          cellClass : 'number'
                        }, {
                          field : 'path',
                          displayName : 'Path (Site Ids)',
                          width : 600,
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          enableSorting : false
                        }, {
                          name : 'actions',
                          enableSorting : false,
                          enableFiltering : false,
                          cellTemplate : actionCellTemplate,
                          width : 95,
                          pinnedRight : true,
                          cellClass : 'number'
                        }
                      ];
                      var geNetworkElementId = function(networkElement) {
                        if (!networkElement) {
                          return 'undefined';
                        }
                        return networkElement.id.networkElementId;
                      };

                      var reduce = function(path) {
                        return {
                          id : path._source.id,
                          type : path._source.eType,
                          status : path._source.summaryStatus,
                          startNetworkElement : geNetworkElementId(path._source.startNe),
                          endNetworkElement : geNetworkElementId(path._source.endNe),
                          planner : path._source.ePlanner.planner,
                          countE1 : parseInt(path._source.e1Anzahl),
                          countSegments : path._source.pathSegments.length,
                          path : $pathManager.getPath(path).toString().replace(/"/g, '')
                        };
                      };

                      var checkForMore = function() {
                        // console.log(0, 'sdf');
                        var done = (from >= numPaths);
                        // console.log(0, done);
                        if (!done) {
                          // console.log(1,'not done');
                          from = from + maxSize;
                          $pathManager.getPaths($scope.dbIndex, maxSize, from, function(err, total, paths) {
                            if (err) {
                              done = true;
                              console.log('htLog:', err);
                              return;
                            }
                            paths.map(function(path) {
                              $scope.gridOptions.data.push(reduce(path));
                            });
                            $scope.progressbar.value = $scope.gridOptions.data.length;
                            if (total <= $scope.gridOptions.data.length ) {
                              $header.setStatus(alertService.success());
                           }
                          });
                          checkForMore();
                        }
                      };
                      var initialize = function() {
                        $header.setStatus(alertService.processing());
                        $pathManager.getPaths($scope.dbIndex, maxSize, from, function(err, total, paths) {
                          if (err) {
                            console.log('htLog:', err);
                            return;
                          }
                          numPaths = total;
                          paths.map(function(path) {
                            $scope.gridOptions.data.push(reduce(path));
                          });
                          $scope.progressbar = {max: total, value: $scope.gridOptions.data.length};
                          if (total <= $scope.gridOptions.data.length ) {
                            $header.setStatus(alertService.success());
                         }
                          checkForMore();
                        });
                      };
                      initialize();
                    }
                  ]
                });
      }
    ]);

htPathManager.factory('$pathManager', ['$rootScope', '$database', function($rootScope, $database) {
    'use strict';

    var service = {};
    
    service.getPaths = function(dbIndex, size, from, callback) {
      var docType = {key: 'path'};
      var sort;
      var filter;
      $database.getData(dbIndex, docType, size, from, sort, filter, function(data){
        if (!data || data.length ===0) {
          // nothing found or error
          callback('Nothing found!', []);
        } else {
          callback(null, data.hits.total, data.hits.hits);
        }
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
        // var start = startSite;
        // order matters! -> not asynch, start by 0
        while (index < segments.length) {
            var next = segments[index].references.siteEndReference.siteId;
            result.push(next);
            index = index + 1;
        }
        
        return result;
    };

    return service;
}]);

if (typeof String.prototype.contains === 'undefined') {
  String.prototype.contains = function(v) {
    return this.indexOf(v) !== -1;
  };
}

/**
 * angular.js for htProfil
 */
var htProfil = angular.module('htProfile', [
  'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);

htProfil.config([
  '$stateProvider',
  function($stateProvider) {
    'use strict';
    $stateProvider.state('profil', {
      // abstract:
      // true,
      url : '/profile',
      templateUrl : 'modules/profile/profile.html',
      controller : [
        '$rootScope', '$scope', '$uibModal', '$base64', 'profileService', 'siteMarkerService', 'authenticationService', 'alertService', 'translateService',
        function($rootScope, $scope, $uibModal, $base64, profileService, siteMarkerService, authenticationService, alertService, translateService) {

          var client = new ZeroClipboard(document.getElementById("copy-button"));
          client.on("copy", function(event) {
            var clipboard = event.clipboardData;
            clipboard.setData("text/plain", JSON.stringify($scope.profile, null, ' '));
          });

          $scope.openPaste = function() {
            var modalInstance = $uibModal.open({
              animation : true,
              templateUrl : '/ux/modules/profile/profile.paste.html',
              controller : 'ModalInstanceCtrl',
              size : 'lg',
              resolve : {
                items : function() {
                  return $scope.items;
                }
              }
            });

            modalInstance.result.then(function(text) {
              try {
                var json = JSON.parse(text);
                if (json.common.version === '0.1.0') {
                  $scope.profile = json;
                } else {
                  console.info("Not a valid profile ;( ");
                }
              } catch (e) {
                console.info("Not a valid profile ;( ");
                return false;
              }

            }, function() {
              console.log('Modal dismissed at: ' + new Date());
            });
          };

          $scope.profileId = authenticationService.getProfileName();
          $scope.username = authenticationService.getUsername($scope.profileId);
          $rootScope.title = '(' + $scope.username + ') htProfile';

          alertService.setMessage([
            'LOADING', 'SUCCESS', 'FAILED'
          ]);
          $scope.changeLanguage = translateService.changeLanguage;

          $scope.status = alertService.processing();

          $scope.shape = siteMarkerService.shape;
          $scope.stroke = {
            types : [
              'solid', 'dotted', 'dashed', 'double'
            ],
          };

          var supportedTypes = {};
          supportedTypes.points = [
            'site', 'siteHasFiber', 'siteHasFiberPlanned', 'siteIsAggregator', 'siteNew'
          ];
          supportedTypes.lines = [
            'siteLink', 'siteLinkPlanned', 'siteLinkEngineered', 'path'
          ];

          var getUrl = function(id) {
            if (!supportedTypes.points.join('/').contains(id) && !supportedTypes.lines.join('/').contains(id)) {
              id = supportedTypes.points[0];
              $scope.object.id = id;
            }
            return [
              '/ux/modules/profile/templates/', id, '.html'
            ].join('');
          };
          $scope.object = {};
          $scope.object.id = 'site';
          $scope.object.url = getUrl($scope.object.id);
          $scope.selected = function(id) {
            $scope.object.id = id;
            $scope.object.url = getUrl(id);
            if (supportedTypes.points.join('/').contains(id)) {
              console.log('update point');
              updateSiteMarker();
            } else if (supportedTypes.lines.join('/').contains(id)) {
              console.log('update line');
              updateSiteLink();
            }
            console.log('htLog:', $scope.object.url);
          };
          $scope.profile = null;

          if (!$scope.profile) {
            console.log('loading...');
            profileService.getProfileData($scope.profileId, function(err, data) {
              if (err) {
                $scope.status = alertService.failed(err);
                console.log('htLog: Profile could not be loaded.' + err);
                $scope.profile = null;
              } else {
                $scope.status = alertService.success();
                $scope.profile = data;
                $scope.profile.site.active = true;
                $scope.object.id = 'site';
                updateSiteMarker();
              }
            });
          }

          $scope.restoreDefaults = function() {
            profileService.profile = profileService.defaultProfile;
            $scope.profile = profileService.defaultProfile;
          };

          $scope.apply = function() {
            console.log('apply');
            $scope.status = alertService.processing();
            profileService.apply($scope.profileId, $scope.profile, function(err, data) {
              if (err) {
                $scope.status = alertService.failed(err);
                console.log('htLog: Profile could not be set.' + err);
              } else {
                $scope.status = alertService.success();
                $scope.profile = data;
              }
            });
          };

          /*********************************************************************
           * Angular Google Map
           */
          var mapCenter = {
            latitude : 52.25566931416853,
            longitude : 12.98757791519165
          };
          var mapOptions = {
            mapTypeId : 'hybrid',
            backgroundColor : '#dd0000',
            draggable : false,
            disableDoubleClickZoom : false,
            mapTypeControl : true,
            panControl : true,
            rotateControl : false,
            streetViewControl : false,
            overviewMapControl : false,
            zoomControl : true,
            scaleControl : false,
            scrollwheel : false
          };
          $scope.map = {
            center : mapCenter,
            options : mapOptions,
            zoom : 18,
          };
          var siteLinksEvents = {
            click : function(line, eventName, model, args) {
              console.log('htLog:', line, eventName, model, args);
              // TODO switch to selected
            },
            mouseover : function(line, eventName, model, args) {
              console.log('htLog:', line, eventName, model, args);
              var options = {
                type : model.type,
                status : 'hover'
              };
              console.log(options);
//              siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
//                model.icon = siteMarker.icon;
//                $scope.$apply();
//              });
            },
            mouseout : function(line, eventName, model, args) {
              console.log('htLog:', line, eventName, model, args);
              var options = {
                type : model.type,
                status : 'normal'
              };
              console.log(options);
//              siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
//                model.icon = siteMarker.icon;
//                $scope.$apply();
//              });
            }
          };
          var pathEvents = {
            click : function(line, eventName, model, args) {
              console.log('htLog:', line, eventName, model, args);
              // TODO switch to selected
            },
            mouseover : function(line, eventName, model, args) {
              console.log('htLog:', line, eventName, model, args);
              var options = {
                type : model.type,
                status : 'hover'
              };
              console.log(options);
//              siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
//                model.icon = siteMarker.icon;
//                $scope.$apply();
//              });
            },
            mouseout : function(line, eventName, model, args) {
              console.log('htLog:', line, eventName, model, args);
              var options = {
                type : model.type,
                status : 'normal'
              };
              console.log(options);
//              siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
//                model.icon = siteMarker.icon;
//                $scope.$apply();
//              });
            }
          };
          var siteMarkersEvents = {
            click : function(marker, eventName, model, args) {
              console.log('htLog:', marker, eventName, model, args);
              // TODO switch to selected
            },
            mouseover : function(marker, eventName, model, args) {
              console.log('htLog:', marker, eventName, model, args);
              var options = {
                type : model.type,
                status : 'hover'
              };
              siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
                model.icon = siteMarker.icon;
                $scope.$apply();
              });
            },
            mouseout : function(marker, eventName, model, args) {
              console.log('htLog:', marker, eventName, model, args);
              var options = {
                type : model.type,
                status : 'normal'
              };
              siteMarkerService.createSiteMarker(model.id, model.site, options, function(siteMarker) {
                model.icon = siteMarker.icon;
                $scope.$apply();
              });
            }
          };

          var mapObjectsCount = 0;
          var location = {
            lat : $scope.map.center.latitude,
            lon : $scope.map.center.longitude
          };
          var siteA = {
            _index : 'configuration',
            id : {
              siteId : mapObjectsCount++
            },
            siteName : 'Site A',
            geoLocation : {
              location : location
            },
            siteLinks : [
              'ExampleSiteLink'
            ],
            siteExtensions : {
              concentrator : false,
              fiberPlanDate : null,
              fiberActualDate : null
            }
          };

          var siteB = JSON.parse(JSON.stringify(siteA));
          siteB.id.siteId = mapObjectsCount++;
          siteB.geoLocation.location.lat = siteA.geoLocation.location.lat + 0.1;
          siteB.geoLocation.location.lon = siteA.geoLocation.location.lon + 0.1;
          siteB.siteName = "Site B";

          var siteC = JSON.parse(JSON.stringify(siteA));
          siteC.id.siteId = mapObjectsCount++;
          siteC.geoLocation.location.lat = siteA.geoLocation.location.lat + 0.05;
          siteC.geoLocation.location.lon = siteA.geoLocation.location.lon + 0.2;
          siteC.siteName = "Site C";

          $scope.mapObjects = {
            sites : {
              events : siteMarkersEvents,
              models : [],
              rebuild : false
            },
            siteLinks : {
              events : siteLinksEvents,
              models : [],
              visible : true,
              rebuild : false
            },
            paths : {
              events : pathEvents,
              models : [],
              visible : false,
              rebuild : false
            }
          };
          
          var createPolyline = function(sites, options, callback) {

            var p = profileService.profile[options.type][options.status];

            var color = p.stroke.color;
            var weight = p.stroke.width;
            var opacity = p.stroke.opacity;

            var d = 10/weight;
            var lineSymbol = {
              path: 'M 0,0 v-' + d,
              strokeOpacity: opacity,
              scale: weight
            };

            var path = [];
            sites.map(function(site){
              path.push({
                latitude : site.geoLocation.location.lat,
                longitude : site.geoLocation.location.lon
              });
            });
            
            var siteLinkId = sites[0].id.siteId + '-' + sites[sites.length-1].id.siteId;
            var newLine = {
                id : mapObjectsCount++,
                index : 'configuration',
                siteLinkId : siteLinkId,
                path : path,
                icons: [{
                  icon: lineSymbol,
                  offset: '0%',
                  repeat: '20px'
                }],
                stroke : {
                    color : color,
                    weight : weight,
                    opacity : 0.1
                },
                editable : false,
                draggable : false,
                geodesic : true,
                visible : true,
                options : {
                    zIndex : 16,
                    title : siteLinkId
                }
            };
            callback(newLine);
        };

        
          
          var updateSiteLink = function() {
            console.log('htLog: sites.length: ', $scope.mapObjects.sites.models.length);
            var siteOptions = {
              type : 'site',
              status : 'normal'
            };

            siteMarkerService.createSiteMarker(1, siteB, siteOptions, function(siteMarker) {
              if ($scope.mapObjects.sites.models.length < 2) {
                $scope.mapObjects.sites.models.push(siteMarker);
              }
              $scope.mapObjects.sites.models[0].icon = siteMarker.icon;
              $scope.mapObjects.sites.models[1].icon = siteMarker.icon;
              
            });
            
            var sites = [siteA, siteB];
            var options = {
              type : $scope.object.id,
              status : 'normal'
            };
            createPolyline(sites, options, function(polyline){
              $scope.mapObjects.siteLinks.models = [polyline];
            });

            var a = siteA.geoLocation.location;
            var b = siteB.geoLocation.location;
            $scope.map.center = {
              latitude : a.lat + (b.lat - a.lat)/2,
              longitude : a.lon + (b.lon - a.lon)/2
            };
            $scope.map.zoom = 11;

          };

          var updateSiteMarker = function() {

            var options = {
              type : $scope.object.id,
              status : 'normal'
            };

            if (options.type === 'site') {
              siteA.siteExtensions.concentrator = false;
              siteA.siteExtensions.fiberPlanDate = null;
              siteA.siteExtensions.fiberActualDate = null;
            } else if (options.type === 'siteHasFiber') {
              siteA.siteExtensions.concentrator = false;
              siteA.siteExtensions.fiberPlanDate = new Date();
              siteA.siteExtensions.fiberActualDate = new Date();
            } else if (options.type === 'siteHasFiberPlanned') {
              siteA.siteExtensions.concentrator = false;
              siteA.siteExtensions.fiberPlanDate = new Date();
              siteA.siteExtensions.fiberActualDate = null;
            } else if (options.type === 'siteNew') {
              siteA.siteExtensions.concentrator = false;
              siteA.siteExtensions.fiberPlanDate = null;
              siteA.siteExtensions.fiberActualDate = null;
            } else if (options.type === 'siteIsAggregator') {
              options.type = 'site';
              siteA.siteExtensions.concentrator = true;
              siteA.siteExtensions.fiberPlanDate = null;
              siteA.siteExtensions.fiberActualDate = null;
            }

            siteMarkerService.createSiteMarker(0, siteA, options, function(siteMarker) {
              if ($scope.mapObjects.sites.models.length === 0) {
                $scope.mapObjects.sites.models.push(siteMarker);
              }
              $scope.mapObjects.sites.models[0].icon = siteMarker.icon;
            });
            
            if ($scope.mapObjects.sites.models.length > 1) {
              $scope.mapObjects.sites.models.splice(1,$scope.mapObjects.sites.models.length);
            }

            $scope.mapObjects.siteLinks.models = [];
            $scope.mapObjects.paths.models = [];
            $scope.map.center = mapCenter;
            $scope.map.zoom = 18;
          };

          $scope.$watch('profile', function(newValue, oldValue) {
            console.log('htLog:', newValue, oldValue);
            var id = $scope.object.id;
            if (supportedTypes.points.join('/').contains(id)) {
              updateSiteMarker();
            } else if (supportedTypes.lines.join('/').contains(id)) {
              updateSiteLink();
            }
          }, true);

        }
      ]
    });
  }
]);

htProfil.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

  $scope.text = 'Paste your profile json string here.';

  $scope.ok = function() {
    $uibModalInstance.close($scope.text);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);

htProfil.factory('profileService', ['$http', function($http) {
    'use strict';

    var defaultProfile = {
        common: {
            language: 'en_US',
            mapTypeId: 'hybrid',
            viewBox : {},
            version: '0.1.0',
        },
        site : {
            shape : {
                type : 'circle',
                scale : 8,
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#00ccff',
                    opacity : 0.5
                }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#00ccff',
                    opacity : 0.8
                }
            }
        },
        siteHasFiber : {
          shape : {
              type : 'circle',
              scale : 8,
              rotation : 45,
              zIndex: 10
          },
          normal : {
              stroke : {
                  color : '#ffff00',
                  width : 3,
                  type : 'solid',
                  opacity : 0.9
              },
              fill : {
                  color : '#ffff00',
                  opacity : 0.5
              }
          },
          hover : {
              stroke : {
                  color : '#ffff00',
                  width : 3,
                  type : 'solid',
                  opacity : 0.9
              },
              fill : {
                  color : '#ffff00',
                  opacity : 0.8
              }
          }
      },
      siteHasFiberPlanned : {
        shape : {
            type : 'circle',
            scale : 8,
            rotation : 45,
            zIndex: 10
        },
        normal : {
            stroke : {
                color : '#ffff00',
                width : 3,
                type : 'solid',
                opacity : 0.9
            },
            fill : {
                color : '#00ccff',
                opacity : 0.5
            }
        },
        hover : {
            stroke : {
                color : '#ffff00',
                width : 3,
                type : 'solid',
                opacity : 0.9
            },
            fill : {
                color : '#00ccff',
                opacity : 0.8
            }
        }
    },
    siteIsAggregator : {
      shape : {
          scale : 16,
          rotation : 45,
          zIndex: 10
      }
  },
  siteNew : {
    shape : {
        type : 'circle',
        scale : 8,
        rotation : 45,
        zIndex: 10
    },
    normal : {
        stroke : {
            color : '#dd0000',
            width : 3,
            type : 'solid',
            opacity : 0.9
        },
        fill : {
            color : '#dd0000',
            opacity : 0.5
        }
    },
    hover : {
        stroke : {
            color : '#dd0000',
            width : 5,
            type : 'solid',
            opacity : 0.9
        },
        fill : {
            color : '#dd0000',
            opacity : 0.8
        }
    }
},
        siteLink : {
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            zIndex: 5
        },
        cluster : {
            shape : {
                type : 'circle',
                scale : 50, // will be overwritten by function
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 0,
                    type : 'solid',
                    opacity : 0.9
                },
            fill : {
                color : '#00ccff',
                opacity : 0.3
            }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.5
                },
                fill : {
                    color : '#00ccff',
                    opacity : 0.4
                }

            },
            zIndex: 5
        },
        newSiteLink : {
            normal : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            hover : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            zIndex: 5
        },
        selectedSite : {
            shape : {
                type : 'circle',
                scale : 8,
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#dd0000',
                    opacity : 0.5
                }
            },
            hover : {
                stroke : {
                    color : '#dd0000',
                    width : 5,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#dd0000',
                    opacity : 0.8
                }
            }
        },
        selectedSiteLink : {
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            zIndex: 5
        }
    };

    var getRestURL = function(profil) {
        var index = 'configuration';
        var docType = 'profile';
        var url = '/db/' + index + '/' + docType + '/' + profil;
        return url;
    };

    var createProfile = function(profileId, callback) {
        var data = defaultProfile;
        data.common.lastChange = new Date();
        var req = {
            method : 'PUT',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        // console.log(JSON.stringify(req));
        $http(req).success(function(data, status) {
            console.log('htLog:', data, status);
            return callback(null, defaultProfile);
        }).error(function(data, status) {
            console.log('htLog:', data, status);
            return callback(status, null);
        });
    };

    var service = {};

    service.profile = defaultProfile;
    service.defaultProfile = defaultProfile;
    
    service.apply = function(profileId, profileData, callback) {
        profileData.common.lastChange = new Date();
        var req = {
            method : 'PUT',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : profileData
        };
        $http(req).success(function(data, status) {
            console.log('htLog:', data, status);
            return callback(null, profileData);
        }).error(function(data, status) {
            console.log('htLog:', data, status);
            return callback(status, null);
        });
    };

    service.restoreDefaults = function(profileId, callback) {
        var data = defaultProfile;
        data.common.lastChange = new Date();
        var req = {
            method : 'PUT',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        $http(req).success(function(data, status) {
            console.log('htLog:', data, status);
            service.profile = defaultProfile;
            return callback(null, defaultProfile);
        }).error(function(data, status) {
            console.log('htLog:', data, status);
            return callback(status, null);
        });
    };

    service.getProfileData = function(profileId, callback) {
        var req = {
            method : 'GET',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        $http(req).success(function(data) {
            service.profile = data._source;
            return callback(null, data._source);
        }).error(function(data, status) {
            if (status === 400 || status === 404) {
                createProfile(profileId, function(err, data) {
                    return callback(null, data);
                });
            } else {
                return callback(status, null);
            }
        });
    };

    return service;
}]);

/**
 * angular.js for htSecurity
 */
var htSecurity =
                angular.module('htSecurity', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'htLogin', 'alert', 'translate'
                ]);



htSecurity.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('security', {
            // abstract:
            // true,
            url : '/security',
            templateUrl : '/ux/modules/security/security.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                '$security',
                function($rootScope, $scope, $stateParams, $security) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htSecurity';

//                    var from = 0;
//                    var maxSize = 1000;
//                    var numSites = 0;

                    var actionCellTemplate = '<a class="vCenter" >' + 
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>' +
                    '</a>';
                    
                    $scope.gridOptions = {};
                    $scope.gridOptions.data = [];
                    $scope.gridOptions.enableColumnResizing = true;
                    $scope.gridOptions.enableSorting = true;
                    $scope.gridOptions.enableFiltering = true;
                    $scope.gridOptions.enableGridMenu = true;
                    $scope.gridOptions.showGridFooter = true;
                    // $scope.gridOptions.showColumnFooter = true;
                    $scope.gridOptions.fastWatch = true;
                    $scope.gridOptions.enableRowSelection = true;
                    $scope.gridOptions.enableRowHeaderSelection = true;
                    $scope.gridOptions.multiSelect = false;

                    $scope.gridOptions.gridMenuCustomItems = [
                                           {
                                               title : 'Rotate Grid',
                                               action : function($event) {
                                                   console.log($event);
                                                   this.grid.element.toggleClass('rotated');
                                               },
                                               order : 210
                                           }
                                       ];
                    
                    $scope.gridOptions.columnDefs =  [
                            {
                                field : 'id',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width: 80,
                                pinnedLeft : true
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true
                            }
                        ];
                    var initialize = function() {
console.info($security.name);
                    };
                    initialize();
                }
            ]
        });
    }
]);

htSecurity.factory('$security', function() {
    'use strict';
    
    var service = {};

    service.name = 'Security';
    
    return service;
});

/**
 * angular.js for htProfil
 */
var htServers = angular.module('htServers', [
    'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);
htServers.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('servers', {
            // abstract:
            // true,
            url : '/servers',
            templateUrl : 'modules/servers/servers.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$filter', 
                '$uibModal', 
                '$base64', 
                '$stateParams', 
                'authenticationService', 
                'alertService',
                '$header',
                function($rootScope, $scope, $filter, $uibModal, $base64, $stateParams, authenticationService, alertService, $header) {

                    $rootScope.title = '(' + 'Configuration example' + ') htServers';

                    $scope.object = {
                      id: 12345678,
                      name: 'ObjectName',
                      integer: 123,
                      unit: 13.9,
                      date: new Date(12345789)
                    };

                    $scope.objectgroup = [
                        {
                          id: 12345678,
                          name: 'ObjectName',
                          integer: 123,
                          unit: 13.9,
                          date: new Date(12345789)
                        },
                        {
                          id: 891343214,
                          name: 'some other',
                          integer: 234,
                          unit: 132314324.9,
                          date: new Date(11112011)
                        }
                    ];
                    
                    $scope.group1 = {
                      readonly: true
                    };

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.clear());

                    $scope.oneAtATime = true;
                    $scope.groups = [
                      {
                        labelId : 'INFORMATION',
                        templateUrl : '/ux/modules/servers/templates/info.html',
                        open : true
                      }, {
                        labelId : 'GEN_SITE',
                        templateUrl : '/ux/modules/servers/templates/gensite.html',
                        open : true
                      }, {
                         labelId : 'a',
                         templateUrl : '/ux/modules/servers/templates/dynamic_form.html',
                         open : true
                       }, {
                        labelId : 'RAW_DATA',
                        templateUrl : '/ux/modules/servers/templates/rawData.html',
                        open : false
                      }
                    ];

                }
            ]
        });
    }
]);

htServers.factory('$servers', function() {
    'use strict';

    
    var service = {};

    service.name = 'Servers';
    
    return service;
});

/**
 * angular.js for htSiteLinkDetails
 */
var htSiteLinkDetails = angular.module('htSiteLinkDetails', [
    'ui.bootstrap', 'ui.router', 'uiGmapgoogle-maps', 'alert', 'translate'
]);

htSiteLinkDetails.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';

        $stateProvider.state('siteLinks', {
            // abstract: true,
            url : '/siteLinks/:index/:high/:low',
            templateUrl : 'modules/siteLinkDetails/siteLinkDetails.html',
            controller : [
                '$rootScope',
                '$scope',
                '$http',
                '$stateParams',
                'uiGmapGoogleMapApi',
                'uiGmapIsReady',
                '$networkMap',
                'authenticationService',
                'alertService',
                'translateService',
                function($rootScope, $scope, $http, $stateParams, uiGmapGoogleMapApi, IsReady, $networkMap, authenticationService, alertService,
                                translateService) {

                    var isSitesExists = false;
                    var isMapExists = false;
                    var checkInitStatus = function() {
                        if (isSitesExists && isMapExists) {
                            initialize();
                        }
                    };
                    
                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $scope.changeLanguage = translateService.changeLanguage;

                    $scope.siteLinkIndex = $stateParams.index;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    $scope.siteLinkId = $stateParams.high + '-' + $stateParams.low;

                    $scope.siteLink = {
                        data : {},
                        get : function(id, callback) {
                            $scope.processing();
                            $networkMap.getSiteLink($scope.siteLinkIndex, id, function(siteLink) {
                                $scope.success();
                                $rootScope.title = '(' + siteLink._source.name + ') htSiteLinks';
                                $scope.siteLink.data = siteLink;
                                $networkMap.getSitesOfLink($scope.siteLink.data, function(sites) {
                                    $scope.sites = sites;
                                    
                                    isSitesExists = true;
                                    checkInitStatus();

                                    $scope.siteLink.bounds(function(bounds) {
                                        $scope.map.bounds = bounds;
                                    });
                                    return callback(null, $scope.siteLink.data);
                                });
                            });

                        },
                        bounds : function(callback) {
                            var north = 0;
                            var south = 0;
                            var east = 0;
                            var west = 0;

                            // console.log('### ' +
                            // JSON.stringify($scope.siteLink));
                            if ($scope.sites[0]._source.geoLocation.location.lat < $scope.sites[1]._source.geoLocation.location.lat) {
                                south = $scope.sites[0]._source.geoLocation.location.lat;
                                north = $scope.sites[1]._source.geoLocation.location.lat;
                            } else {
                                south = $scope.sites[1]._source.geoLocation.location.lat;
                                north = $scope.sites[0]._source.geoLocation.location.lat;
                            }
                            if ($scope.sites[0]._source.geoLocation.location.lon < $scope.sites[1]._source.geoLocation.location.lon) {
                                west = $scope.sites[0]._source.geoLocation.location.lon;
                                east = $scope.sites[1]._source.geoLocation.location.lon;
                            } else {
                                west = $scope.sites[1]._source.geoLocation.location.lon;
                                east = $scope.sites[0]._source.geoLocation.location.lon;
                            }
                            return callback({
                                northeast : {
                                    latitude : north,
                                    longitude : east
                                },
                                southwest : {
                                    latitude : south,
                                    longitude : west
                                }
                            });
                        }
                    };

                    $scope.oneAtATime = true;
                    $scope.groups = [
                      {
                        labelId : 'INFORMATION',
                        templateUrl : '/ux/modules/siteLinkDetails/templates/info.html',
                        open : false
                      }, {
                        labelId : 'MAP',
                        templateUrl : '/ux/modules/siteLinkDetails/templates/map.html',
                        open : true
                      }, {
                        labelId : 'MWR_LINK_REVISIONS',
                        templateUrl : '/ux/modules/siteLinkDetails/templates/mwrLinkRevisions.html',
                        open : false
                      }, {
                        labelId : 'RAW_DATA',
                        templateUrl : '/ux/modules/siteLinkDetails/templates/rawData.html',
                        open : false
                      }
                    ];

                    angular.extend($scope, {
                        map : {
                            center : {
                                latitude : 0,
                                longitude : 0
                            },
                            zoom : 8,
                            control : {}
                        },
                        options : {
                            zoomControl : true,
                            zoomControlOptions : {
                                position : google.maps.ControlPosition.LEFT_TOP
                            },
                            scaleControl : false,
                            mapTypeId : 'terrain',
                            mapTypeControl : true,
                            mapTypeControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP,
                                mapTypeIds : [
                                    'hybrid', 'roadmap', 'terrain', 'satellite'
                                ]
                            },
                            panControl : false,
                            panControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP
                            },
                            rotateControl : false,
                            rotateControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP
                            },
                            streetViewControl : false,
                            streetViewControlOptions : {
                                position : google.maps.ControlPosition.RIGHT_TOP
                            },
                            overviewMapControl : false,
                            overviewMapControlOptions : {
                                opened : true
                            },
                            scrollwheel : false
                        },
                        processing : function() {
                            $scope.status = {
                                isWorking : true,
                                type : 'warning',
                                message : 'Loading...'
                            };
                        },
                        clear : function() {
                            $scope.status = {};
                        },
                        success : function() {
                            $scope.status = {
                                isWorking : false,
                                type : 'success',
                                message : 'Loading completed successfully.'
                            };
                        },
                        failed : function(e) {
                            console.log(e);
                            $scope.status = {
                                isWorking : false,
                                type : 'danger',
                                message : 'Error while loading data.'
                            };
                        }
                    });

                    var init = function(maps, callback) {
                        $scope.icon = {
                            path : google.maps.SymbolPath.CIRCLE,
                            scale : 10,
                            strokeWeight : 3,
                            strokeColor : '#0CF',
                            fillColor : '#0CF',
                            fillOpacity : 0.5,
                            anchor : new google.maps.Point(0, 0)
                        };

                        var id = {
                            low : $scope.siteLinkIdLow,
                            high : $scope.siteLinkIdHigh
                        };
                        $scope.siteLink.get(id, function(err, siteLink) {
                            console.log('htLog:', err, siteLink);
                            var map1 = $scope.map.control.getGMap();
                            var color = '#0CF';

                            $scope.sites.map(function(site) {
                                var marker = new google.maps.Marker({
                                    position : new google.maps.LatLng(site._source.geoLocation.location.lat, site._source.geoLocation.location.lon),
                                    map : map1,
                                    icon : getIcon(color, 3, 0.5, 10),
                                    url : '/ux/#/sites/' + site._index + '/' + site._source.id.siteId,
                                    zIndex : 10
                                // site.isAggregator
                                // ? 10
                                // : 8
                                });
                                google.maps.event.addListener(marker, 'click', function() {
                                    window.open(marker.url, '_self');
                                });
                                google.maps.event.addListener(marker, 'mouseover', function() {
                                    var icon = getIcon(color, 5, 0.9, 10);
                                    this.setIcon(icon);
                                    tooltip.show(site._source.siteName);
                                });
                                google.maps.event.addListener(marker, 'mouseout', function() {
                                    var icon = getIcon(color, 3, 0.5, 10);
                                    this.setIcon(icon);
                                    tooltip.hide();
                                });
                            });
                            return callback(true);
                        });
                    };

                    uiGmapGoogleMapApi.then(function(maps) {
                        init(maps, function(status) {
                            console.log('htLog: init=', status);
                        });
                    });

                    var getIcon = function(color, weight, opacity, scale) {
                        var icon = $scope.icon;
                        icon.strokeColor = color;
                        icon.fillColor = color;
                        icon.strokeWeight = weight;
                        icon.fillOpacity = opacity;
                        icon.scale = scale;
                        return icon;
                    };

                    var initialize = function() {
                        var map1 = $scope.map.control.getGMap();
                        var color = '#00CCFF';
                        var coordA = $scope.sites[0]._source.geoLocation.location;
                        var coordB = $scope.sites[1]._source.geoLocation.location;
                        var coords = [
                            new google.maps.LatLng(coordA.lat, coordA.lon), new google.maps.LatLng(coordB.lat, coordB.lon)
                        ];
                        var line = new google.maps.Polyline({
                            path : coords,
                            map : map1,
                            geodesic : true,
                            strokeColor : color,
                            strokeOpacity : 1.0,
                            strokeWeight : 3,
                            zIndex : 6,
                        });
                        google.maps.event.addListener(line, 'mouseover', function() {
                            line.setOptions({
                                strokeWeight : 6
                            });
                            tooltip.show($scope.sites[0]._source.siteName + '-' + $scope.sites[1]._source.siteName);
                        });
                        google.maps.event.addListener(line, 'mouseout', function() {
                            line.setOptions({
                                strokeWeight : 3
                            });
                            tooltip.hide();
                        });
                        // doLayer($scope.map.bounds);
                    };

                    IsReady.promise().then(function(maps) {
                        console.log(maps);
                        isMapExists = true;
                        checkInitStatus();
                    });

                }
            ]
        });
    }
]);

/**
 * angular.js for htSiteDetails
 */
var htSiteDetails = angular.module('htSiteDetails', [
  'ui.bootstrap', 'ui-rangeSlider', 'uiGmapgoogle-maps', 'ngCookies', 'htLogin', 'alert', 'translate'
]);

htSiteDetails.config([
  '$stateProvider',
  function($stateProvider) {
    'use strict';
    $stateProvider.state('htSiteDetails', {
      // abstract:
      // true,
      url : '/sites/:dbIndex/:id',
      templateUrl : 'modules/siteDetails/siteDetails.html',
      controller : [
        '$rootScope', '$scope', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$siteDetails', 'authenticationService', 'alertService',
        '$header','$uibModal', '$networkMap',
        function($rootScope, $scope, $stateParams, uiGmapGoogleMapApi, IsReady, $siteDetails, authenticationService, alertService, $header, $uibModal, $networkMap) {

          alertService.setMessage([
            'LOADING', 'SUCCESS', 'FAILED'
          ]);
          
          $scope.selectedMpRow = {};
          $scope.animationsEnabled = true;
          
          $scope.modifySite = function() {
            $siteDetails.modify($scope.site.model, function() {
              console.log('site changed', $scope.site.model);
            });
          };
          var deleteMountingPosition = function() {
            console.log('delete', this);
            var index = $scope.site.model.antennaResources.antennamountingpositions.length;
            while (index) {
              index = index - 1;
              var mp = $scope.site.model.antennaResources.antennamountingpositions[index];
              if (this.antennaSupportId === mp.antennaSupportId && 
                  this.id === mp.id) {
                $scope.site.model.antennaResources.antennamountingpositions.splice(index,1);
              }
            }
            $siteDetails.modify($scope.site.model, function() {
              console.log('mounting position deleted -> site changed', $scope.site.model);
            });
          };
          var modifyMountingPosition = function() {
            $scope.selectedMpRow = this;
            var modalInstance = $uibModal.open({
              animation : $scope.animationsEnabled,
              templateUrl : '/ux/modules/siteDetails/templates/mountingPosition.modify.html',
              controller : 'MountingPositionModifyCtrl',
              size : 'lg',
              resolve : {
                selectedMpRow : function() {
                  return $scope.selectedMpRow;
                }
              }
            });

            modalInstance.result.then(function(selectedMpRow) {
              console.log('chnaged mp' , selectedMpRow);
            }, function() {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
          var copyMountingPosition = function() {
            $scope.newMp = JSON.parse(JSON.stringify(this));
            delete $scope.newMp.$$hashKey;
            $scope.newMp.id = parseInt($scope.newMp.id) + 1;
            $scope.newMp.mwrLinkRevisionVariantReference = null;
            $scope.newMp.lifeCicle = null;
            $scope.newMp.delete = deleteMountingPosition;
            $scope.newMp.modify = modifyMountingPosition;
            $scope.newMp.copy = copyMountingPosition;
            $scope.newMp.hover = false;

            var modalInstance = $uibModal.open({
              animation : $scope.animationsEnabled,
              templateUrl : '/ux/modules/siteDetails/templates/mountingPosition.add.html',
              controller : 'MountingPositionAddCtrl',
              size : 'lg',
              resolve : {
                newMp : function() {
                  return $scope.newMp;
                }
              }
            });
            modalInstance.result.then(function(newMp) {
              console.log('new mp' , newMp);
              $scope.site.model.antennaResources.antennamountingpositions.push(newMp);
            }, function() {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
          var addMountingPosition = function() {
            $scope.newMp =  {
              "id": -1,
              "lifeCycle": {
                "revisionFlags": [
                  {
                    "revisionState": {
                      "orderId": 6,
                      "id": "created",
                      "name": "PLANUNG",
                      "isMain": true
                    },
                    "plan": new Date(),
                    "required": new Date(),
                    "actual": new Date(),
                    "planner": "Planner",
                    "comment": "Created by highstreet technologies site manager."
                  }
                ],
                "revisionType": {
                  "orderId": "4",
                  "id": "construction",
                  "name": "new"
                },
                "revisionTypeStatus": {
                  "orderId": 6,
                  "id": "created",
                  "name": "PLANUNG",
                  "isMain": true
                }
              },
              "antennaSupportId": "Antenna support #x",
              "diameter": {
                "lowerBoundType": "CLOSED",
                "upperBountType": "CLOSED",
                "lowerBound": 0,
                "upperBound": 2400
              },
              "azimuth": {
                "lowerBoundType": "CLOSED",
                "upperBountType": "CLOSED",
                "lowerBound": 0,
                "upperBound": 360
              },
              "centerline": {
                "lowerBoundType": "CLOSED",
                "upperBountType": "CLOSED",
                "lowerBound": 10,
                "upperBound": 40
              },
              "mwrLinkRevisionVariantReference": null,
              "hover": false
            };
            $scope.newMp.delete = deleteMountingPosition;
            $scope.newMp.modify = modifyMountingPosition;
            $scope.newMp.copy = copyMountingPosition;
            console.log('#ä#ä#ä#', $scope.newMp);

            var modalInstance = $uibModal.open({
              animation : $scope.animationsEnabled,
              templateUrl : '/ux/modules/siteDetails/templates/mountingPosition.add.html',
              controller : 'MountingPositionAddCtrl',
              size : 'lg',
              resolve : {
                newMp : function() {
                  return $scope.newMp;
                }
              }
            });
            modalInstance.result.then(function(newMp) {
              console.log('new mp' , newMp);
              $scope.site.model.antennaResources.antennamountingpositions.push(newMp);
            }, function() {
              console.log('Modal dismissed at: ' + new Date());
            });
          };

          $scope.dbIndex = $stateParams.dbIndex;
          $scope.siteId = $stateParams.id;
          $rootScope.title = '(' + $scope.siteId + ') htNetworkMap';
          
          $scope.oneAtATime = true;
          $scope.groups = [
            {
              labelId : 'LOCATION',
              templateUrl : '/ux/modules/siteDetails/templates/location.html',
              open : false
            }, {
              labelId : 'MAP',
              templateUrl : '/ux/modules/siteDetails/templates/map.html',
              open : true
            }, {
              labelId : 'MOUNTING_POSITIONS',
              templateUrl : '/ux/modules/siteDetails/templates/mountingPositions.html',
              open : false
            }, {
              labelId : 'SITE_LINKS',
              templateUrl : '/ux/modules/siteDetails/templates/siteLinks.html',
              open : false
            }, {
              labelId : 'NETWORK_ELEMENTS',
              templateUrl : '/ux/modules/siteDetails/templates/networkElements.html',
              open : false
            }, {
              labelId : 'RAW_DATA',
              templateUrl : '/ux/modules/siteDetails/templates/rawData.html',
              open : false
            }
          ];
//          $scope.$watch('groups', function(groups){
//            groups.map(function(group){
//              if (group.labelId === 'MAP') {
//                init(null, function(status) {
//                  console.log('htLog: init=', status);
//                });
//              }
//            });
//          }, true);
          $scope.addMountingPosition = addMountingPosition;
          $scope.site = {
            model : {},
            get : function(dbIndex, id, callback) {
              $header.setStatus(alertService.processing());
              $siteDetails.getSite(dbIndex, id, function(site) {
                $header.setStatus(alertService.success());
                $scope.site.model = site._source;
                
                // add functions to mounting positions
                $scope.site.model.antennaResources.antennamountingpositions.map(function(mp){
                  mp.delete = deleteMountingPosition;
                  mp.modify = modifyMountingPosition;
                  mp.copy = copyMountingPosition;
                  mp.hover = false;
                });
                return callback($scope.site.model);
              });
            },
            center : function(callback) {
              console.log('center');
              return callback({
                latitude : $scope.site.model.geoLocation.location.lat,
                longitude : $scope.site.model.geoLocation.location.lon
              });
            }
          };

          angular.extend($scope, {
            map : {
              center : {
                latitude : 0,
                longitude : 0
              },
              bounds : {
                northeast : {
                  latitude : 0,
                  longitude : 0
                },
                southwest : {
                  latitude : 0,
                  longitude : 0
                }
              },
              zoom : 14,
              control : {}
            },
            options : {
              zoomControl : true,
              zoomControlOptions : {
                position : google.maps.ControlPosition.LEFT_TOP
              },
              scaleControl : false,
              mapTypeId : 'terrain',
              mapTypeControl : true,
              mapTypeControlOptions : {
                position : google.maps.ControlPosition.RIGHT_TOP,
                mapTypeIds : [
                  'hybrid', 'roadmap', 'terrain', 'satellite'
                ]
              },
              panControl : false,
              panControlOptions : {
                position : google.maps.ControlPosition.RIGHT_TOP
              },
              rotateControl : false,
              rotateControlOptions : {
                position : google.maps.ControlPosition.RIGHT_TOP
              },
              streetViewControl : false,
              streetViewControlOptions : {
                position : google.maps.ControlPosition.RIGHT_TOP
              },
              overviewMapControl : false,
              overviewMapControlOptions : {
                opened : true
              },
              scrollwheel : false
            }
          });

          var getIcon = function(color, weight, opacity, scale) {
            return {
              path : google.maps.SymbolPath.CIRCLE,
              scale : scale,
              strokeWeight : weight,
              strokeColor : color,
              fillColor : color,
              fillOpacity : opacity,
              anchor : new google.maps.Point(0, 0)
            };
          };

          var createMarker = function(site) {
            var color = '#888';
            var marker = new google.maps.Marker({
              position : new google.maps.LatLng(site.geoLocation.location.lat, site.geoLocation.location.lon),
              map : $scope.map.control.getGMap(),
              icon : getIcon(color, 1, 0.5, 8),
              url : '/ux/#/sites/' + $scope.dbIndex + '/' + site.siteId,
              zIndex : 20
            });
            google.maps.event.addListener(marker, 'click', function() {
              window.open(marker.url, '_self');
            });
            google.maps.event.addListener(marker, 'mouseover', function() {
              var icon = getIcon(color, 3, 0.9, 8);
              this.setIcon(icon);
              tooltip.show(site.siteName);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
              var icon = getIcon(color, 1, 0.5, 8);
              this.setIcon(icon);
              tooltip.hide();
            });
          };

          var init = function(maps, callback) {
            
            $scope.icon = {
              path : google.maps.SymbolPath.CIRCLE,
              scale : 10,
              strokeWeight : 3,
              strokeColor : '#0CF',
              fillColor : '#0CF',
              fillOpacity : 0.5,
              anchor : new google.maps.Point(0, 0)
            };
            $scope.site.get($scope.dbIndex, $scope.siteId, function(site) {
              $scope.site.center(function(center) {
                $scope.map.center = center;
              });
              
            $networkMap.getDetailedNetworkElements($scope.dbIndex, $scope.siteId, function(detailedNetworkElements) {
              console.log('htLog: nes:', detailedNetworkElements.length);
              $scope.detailedNetworkElements = detailedNetworkElements;
            });

              $siteDetails.getSiteLinks($scope.dbIndex, site.id, function(detailedSiteLinks) {
                var map1 = $scope.map.control.getGMap();
                $scope.detailedSiteLinks = detailedSiteLinks;
                
                detailedSiteLinks.map(function(siteLink) {


                $siteDetails.getSitesOfLink(siteLink, function(sites) {
                    if (sites[0]._source.siteName === site.siteName) {
                      createMarker(sites[1]._source);
                    } else {
                      createMarker(sites[0]._source);
                    }
                    var coordA = sites[0]._source.geoLocation.location;
                    var coordB = sites[1]._source.geoLocation.location;
                    var coords = [
                      new google.maps.LatLng(coordA.lat, coordA.lon), new google.maps.LatLng(coordB.lat, coordB.lon),
                    ];
                    var line = new google.maps.Polyline({
                      path : coords,
                      map : map1,
                      geodesic : true,
                      strokeColor : '#0CF',
                      strokeOpacity : 1.0,
                      strokeWeight : 3,
                      url : '/ux/#/siteLinks/' + $scope.dbIndex + '/' + siteLink._source.id.high + '/' + siteLink._source.id.low,
                      zIndex : 6,
                    });
                    google.maps.event.addListener(line, 'click', function() {
                      window.open(line.url, '_self');
                    });
                    google.maps.event.addListener(line, 'mouseover', function() {
                      line.setOptions({
                        strokeWeight : 6
                      });
                      tooltip.show(sites[0]._source.siteName + '-' + sites[1]._source.siteName);
                    });
                    google.maps.event.addListener(line, 'mouseout', function() {
                      line.setOptions({
                        strokeWeight : 3
                      });
                      tooltip.hide();
                    });
                  });
                });
              });
            });
            return callback(true);
          };

          uiGmapGoogleMapApi.then(function(maps) {
            init(maps, function(status) {
              console.log('htLog: init=', status);
            });
          });

          IsReady.promise().then(function(maps) {
            console.log('htLog:', maps);
            var map1 = $scope.map.control.getGMap();

            var site = $scope.site.model;

            var marker = new google.maps.Marker({
              position : new google.maps.LatLng(site.geoLocation.location.lat, site.geoLocation.location.lon),
              map : map1,
              icon : getIcon('#0CF', 3, 0.5, 10),
              zIndex : 10
            // site.isAggregator
            // ? 10
            // : 8
            });
            google.maps.event.addListener(marker, 'mouseover', function() {
              var icon = $scope.icon;
              icon.strokeColor = marker.icon.strokeColor;
              icon.fillColor = marker.icon.strokeColor;
              icon.scale = marker.icon.scale;
              icon.strokeWeight = 5;
              icon.fillOpacity = 0.9;
              this.setIcon(icon);
              tooltip.show(site.siteName);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
              var icon = $scope.icon;
              icon.strokeColor = marker.icon.strokeColor;
              icon.fillColor = marker.icon.strokeColor;
              icon.scale = marker.icon.scale;
              icon.strokeWeight = 3;
              icon.fillOpacity = 0.5;
              this.setIcon(icon);
              tooltip.hide();
            });
          });
        }
      ]
    });
  }
]);

htSiteDetails.controller('MountingPositionModifyCtrl', ['$scope', '$uibModalInstance', 'selectedMpRow', function($scope, $uibModalInstance, selectedMpRow) {

  $scope.mp = selectedMpRow;

  $scope.ok = function() {
    $uibModalInstance.close($scope.mp);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);

htSiteDetails.controller('MountingPositionAddCtrl', ['$scope', '$uibModalInstance', 'newMp', function($scope, $uibModalInstance, newMp) {

  $scope.mp = newMp;

  $scope.ok = function() {
    $uibModalInstance.close($scope.mp);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);

htSiteDetails.factory('$siteDetails', ['$networkMap', function($networkMap) {

    var service = {};
    service.getSite = function(dbIndex, siteId, callback) {
        $networkMap.getSiteById(dbIndex, siteId, function(site) {
            return callback(site);
        });
    };

    service.getSiteLinks = function(dbIndex, siteId, callback) {
        var siteIds = [];
        siteIds.push(siteId);
        $networkMap.getSiteLinksBySiteIds(dbIndex, siteIds, function(siteLinks) {
            return callback(siteLinks);
        });
    };
    
    service.getSitesOfLink = function(siteLink, callback) {
        $networkMap.getSitesOfLink(siteLink, function(sites) {
            return callback(sites);
        });
    };
    
    service.modify = function(site, callback) {
      // TODO send request for modify site
      return callback();
    };
    return service;
}]);

/**
 * angular.js for htSiteManager
 */
var htSiteLinkManager =
    angular.module('htSiteLinkManager', [
      'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.resizeColumns',
      'htLogin', 'htDatabase', 'alert', 'translate'
    ]);

htSiteLinkManager
    .config([
      '$stateProvider',
      function($stateProvider) {
        'use strict';
        $stateProvider
            .state(
                'siteLinkManager',
                {
                  // abstract:
                  // true,
                  url : '/siteLinkManager/:dbIndex',
                  templateUrl : '/ux/modules/siteLinkManager/siteLinkManager.html',
                  controller : [
                    '$rootScope',
                    '$scope',
                    '$stateParams',
                    'uiGridConstants',
                    '$siteLinkManager',
                    '$header',
                    'alertService',
                    function($rootScope, $scope, $stateParams, uiGridConstants, $siteLinkManager, $header, alertService) {
                      $scope.dbIndex = $stateParams.dbIndex;
                      $rootScope.title = 'htSiteLinkManager';
                      
                      alertService.setMessage([
                                               'LOADING', 'SUCCESS', 'FAILED'
                                           ]);

                      var from = 0;
                      var maxSize = 1000;
                      var numSiteLinks = 0;

                      var actionCellTemplate =
                          [
                            '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >',
                            '<span ng-mouseenter="grid.appScope.hover=true" ng-mouseleave="grid.appScope.hover=false" ng-show="!row.entity.numMwrLinks" title="{{grid.appScope.getTitle(row.entity, 0)}}"  ng-click="grid.appScope.delete(row.entity)" class="pointer glyphicon glyphicon-trash"></span>',
                            '<span> </span>',
                            '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>',
                            '<span> </span>',
                            '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>',
                            '</a>'
                          ].join('');

                      $scope.highlightFilteredHeader = function(row, rowRenderIndex, col) {
                        if (col.filters[0].term) {
                          return 'header-filtered';
                        } else {
                          return '';
                        }
                      };

                      $scope.show = function(row) {
                        var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?sitelink=' + row.id;
                        window.open(link, 'htNetworkMap');
                      };

                      $scope.open = function(row) {
                        var link = '/ux/#/siteLinks/' + $scope.dbIndex + '/' + row.id.replace('-', '/');
                        window.open(link, 'htSolutions');
                      };

                      $scope.gridOptions = {};
                      $scope.gridOptions.data = [];
                      $scope.gridOptions.enableColumnResizing = true;
                      $scope.gridOptions.enableSorting = true;
                      $scope.gridOptions.enableFiltering = true;
                      $scope.gridOptions.enableGridMenu = true;
                      $scope.gridOptions.showGridFooter = true;
                      // $scope.gridOptions.showColumnFooter = true;
                      $scope.gridOptions.fastWatch = true;
                      $scope.gridOptions.enableRowSelection = true;
                      $scope.gridOptions.enableRowHeaderSelection = true;
                      $scope.gridOptions.multiSelect = false;

                      $scope.gridOptions.gridMenuCustomItems = [
                        {
                          title : 'Rotate Grid',
                          action : function($event) {
                            console.log($event);
                            this.grid.element.toggleClass('rotated');
                          },
                          order : 210
                        }
                      ];

                      $scope.gridOptions.columnDefs = [
                        {
                          field : 'id',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          pinnedLeft : true
                        }, {
                          field : 'name',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 150,
                          pinnedLeft : true
                        }, {
                          field : 'siteA',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100
                        }, {
                          field : 'siteB',
                          type : 'string',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100
                        }, {
                          field : 'length',
                          type : 'number',
                          displayName : 'Length [km]',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'mwrLinks',
                          type : 'string',
                          displayName : 'MWR links',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 200
                        }, {
                          field : 'numMwrLinks',
                          type : 'number',
                          displayName : 'MWR links count',
                          headerCellClass : $scope.highlightFilteredHeader,
                          cellClass : 'number',
                          width : 100
                        }, {
                          field : 'fiberAtA',
                          type : 'date',
                          cellFilter : 'date:"yyyy-MM-dd"',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100
                        }, {
                          field : 'fiberAtB',
                          type : 'date',
                          cellFilter : 'date:"yyyy-MM-dd"',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100
                        }, {
                          field : 'sitelinksAtA',
                          type : 'number',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
                          field : 'sitelinksAtB',
                          type : 'number',
                          headerCellClass : $scope.highlightFilteredHeader,
                          width : 100,
                          cellClass : 'number'
                        }, {
//                          field : 'isReuseCandidate',
//                          type : 'boolean',
//                          headerCellClass : $scope.highlightFilteredHeader,
//                          width : 100
//                        }, {
                            field : 'reusePlanDate',
                            type : 'date',
                            cellFilter : 'date:"yyyy-MM-dd"',
                            headerCellClass : $scope.highlightFilteredHeader,
                            width : 100
                          }, {
                            field : 'source',
                            type : 'string',
                            headerCellClass : $scope.highlightFilteredHeader,
                            width : 250
                          }, {
                          name : 'actions',
                          enableSorting : false,
                          enableFiltering : false,
                          cellClass : 'number',
                          cellTemplate : actionCellTemplate,
                          width : 95,
                          pinnedRight : true
                        }
                      ];
                      var reduce = function(siteLink) {
                        var mwrLinks = [];
                        siteLink._source.mwrLinkRevisionVariants.map(function(link) {
                          mwrLinks.push(link.mwrLinkId);
                        });
                        var fiberPlanDateA = siteLink._source.fiberPlanDateA;
                        if (fiberPlanDateA !== null) {
                          fiberPlanDateA = new Date(siteLink._source.fiberPlanDateA);
                        }
                        var fiberPlanDateB = siteLink._source.fiberPlanDateB;
                        if (fiberPlanDateB !== null) {
                          fiberPlanDateB = new Date(siteLink._source.fiberPlanDateB);
                        }
                        var reusePlanDate = siteLink._source.getReusePlanDate;
                        if (reusePlanDate !== null) {
                          reusePlanDate = new Date(siteLink._source.getReusePlanDate);
                        }
                        return {
                          id : [
                            siteLink._source.id.high, siteLink._source.id.low
                          ].join('-'),
                          name : siteLink._source.name,
                          siteA : siteLink._source.siteARef,
                          siteB : siteLink._source.siteBRef,
                          length : siteLink._source.length.toFixed(3),
                          mwrLinks : mwrLinks.join('; '),
                          numMwrLinks : mwrLinks.length,
                          fiberAtA : fiberPlanDateA,
                          fiberAtB : fiberPlanDateB,
                          sitelinksAtA : siteLink._source.numSiteLinksA,
                          sitelinksAtB : siteLink._source.numSiteLinksB,
                          // isReuseCandidate : siteLink._source.isReuseCandidate,
                          reusePlanDate : reusePlanDate,
                          source: siteLink._source.dbOriginations.join('; ')
                        };
                      };

                      var checkForMore = function() {
                        // console.log(0, 'sdf');
                        var done = (from >= numSiteLinks);
                        // console.log('htLog: ', from, numSiteLinks, done);
                        if (!done) {
                          // console.log(1,'not done');
                          from = from + maxSize;
                          $siteLinkManager.getSiteLinks($scope.dbIndex, from, maxSize, function(err, total, siteLinks) {
                            if (err) {
                              done = true;
                              console.log('htLog:', err);
                              return;
                            }
                            siteLinks.map(function(siteLink) {
                              $scope.gridOptions.data.push(reduce(siteLink));
                            });
                            $scope.progressbar.value = $scope.gridOptions.data.length;
                            if (total <= $scope.gridOptions.data.length ) {
                              $header.setStatus(alertService.success());
                           }
                          });
                          checkForMore();
                        }
                      };
                      var initialize = function() {
                        $header.setStatus(alertService.processing());
                        $siteLinkManager.getSiteLinks($scope.dbIndex, from, maxSize, function(err, total, siteLinks) {
                          if (err) {
                            console.log('htLog:', err);
                            return;
                          }
                          numSiteLinks = total;
                          siteLinks.map(function(siteLink) {
                            $scope.gridOptions.data.push(reduce(siteLink));
                          });
                          $scope.progressbar = {max: total, value: $scope.gridOptions.data.length};
                          if (total <= $scope.gridOptions.data.length ) {
                            $header.setStatus(alertService.success());
                         }
                          checkForMore();
                        });
                      };
                      initialize();
                    }
                  ]
                });
      }
    ]);

htSiteLinkManager.factory('$siteLinkManager', ['$database', function($database) {
  'use strict';

  var service = {};

  service.getSiteLinks = function(dbIndex, from, size, callback) {
	var sort;
	var filter;
    $database.getData(dbIndex, {key:'sitelink'}, size, from, sort, filter, function(data) {
      console.log('htLog:', data);
      return callback(null, data.hits.total, data.hits.hits);
    });
  };

  return service;
}]);

/**
 * angular.js for htSiteManager
 */
var htSiteManager =
                angular.module('htSiteManager', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'angularFileUpload', 'htLogin', 'alert', 'translate'
                ]);

htSiteManager.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('siteManager', {
            // abstract:
            // true,
            url : '/siteManager/:dbIndex',
            templateUrl : '/ux/modules/siteManager/siteManager.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                'uiGridConstants',
                '$siteManager',
                '$header',
                'alertService',
                function($rootScope, $scope, $stateParams, uiGridConstants, $siteManager, $header, alertService) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htSiteManager';

                    alertService.setMessage([
                                             'LOADING', 'SUCCESS', 'FAILED'
                                         ]);

                    var from = 0;
                    var maxSize = 1000;
                    var numSites = 0;

                    var actionCellTemplate = '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >' + 
                    '<span ng-mouseenter="grid.appScope.hover=true" ng-mouseleave="grid.appScope.hover=false" ng-show="!row.entity.siteLinks" title="{{grid.appScope.getTitle(row.entity, 0)}}"  ng-click="grid.appScope.delete(row.entity)" class="pointer glyphicon glyphicon-trash"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>' +
                    '</a>';

                    $siteManager.objectChangeListener(function(event, data) {
                        $scope.newSite = data._source;
                    });

                    $scope.cancelSite = function(){
                        $scope.newSite = undefined;
                    };
                    
                    $scope.createSite = function() {
                        console.info(JSON.stringify($scope.newSite));
                        $siteManager.createSite($scope.dbIndex, $scope.newSite, function(err, data){
                            if (err){
                                console.error('htLog: ', err, data);
                            } else {
                                $scope.gridOptions.data.push(reduce( {'_source': $scope.newSite} ));
                                $scope.newSite=undefined;
                            }
                        });
                    };
                    
                    $scope.highlightFilteredHeader = function(row, rowRenderIndex, col) {
                        if (col.filters[0].term) {
                            return 'header-filtered';
                        } else {
                            return '';
                        }
                    };

                    var message = ['Delete', 'Show in network map', 'Show details'];
                    $scope.getTitle = function(row, msgId) {
                        var info = message[msgId] + ': ' + row.name;
                        return info;
                    };
                    
                    $scope.show = function(row) {
                        var link = '/ux/modules/networkMap/map.html#/' + $scope.dbIndex + '?site=' + row.id;
                        window.open(link, 'htNetworkMap');
                    };
                        
                    $scope.open = function(row) {
                        var link = '/ux/#/sites/' + $scope.dbIndex + '/' + row.id;
                        window.open(link, 'htSolutions');
                    };
                    
                    $scope.delete = function(row) {
                        $siteManager.deleteSite($scope.dbIndex, row.id, function(data, status){
                            console.log(data, status);
                            var index = $scope.gridOptions.data.map(function(obj) {return obj.id; }).indexOf(row.id);
                            $scope.gridOptions.data.splice(index,1);
                        });
                    };
                    
                    $scope.gridOptions = {};
                    $scope.gridOptions.data = [];
                    $scope.gridOptions.enableColumnResizing = true;
                    $scope.gridOptions.enableSorting = true;
                    $scope.gridOptions.enableFiltering = true;
                    $scope.gridOptions.enableGridMenu = true;
                    $scope.gridOptions.showGridFooter = true;
                    // $scope.gridOptions.showColumnFooter = true;
                    $scope.gridOptions.fastWatch = true;
                    $scope.gridOptions.enableRowSelection = true;
                    $scope.gridOptions.enableRowHeaderSelection = true;
                    $scope.gridOptions.multiSelect = false;

                    $scope.gridOptions.gridMenuCustomItems = [
                                           {
                                               title : 'Rotate Grid',
                                               action : function($event) {
                                                   console.log($event);
                                                   this.grid.element.toggleClass('rotated');
                                               },
                                               order : 210
                                           }
                                       ];
                    
                    $scope.gridOptions.columnDefs =  [
                            {
                                field : 'id',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                pinnedLeft : true
                            }, {
                                field : 'name',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                pinnedLeft : true
                            }, {
                                field : 'latitude',
                                type: 'number',
                                displayName: 'Latitude [°]',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                cellClass: 'number'
                            }, {
                                field : 'longitude',
                                displayName: 'Longitude [°]',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                cellClass: 'number'
                            }, {
                                field : 'amslGrd',
                                displayName : 'AMSL Ground [m]',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                cellClass: 'number'
                            }, {
                                field : 'siteLinks',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                cellClass: 'number'
                            }, {
                                field : 'networkElements',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                cellClass: 'number'
                            }, {
                              field : 'fiberPlanDate',
                              displayName : 'Fiber (P)',
                              type: 'date',
                              cellFilter : 'date:"yyyy-MM-dd"',
                              headerCellClass : $scope.highlightFilteredHeader,
                              width : 100,
                              cellClass : 'number'
                            }, {
                              field : 'fiberActualDate',
                              displayName : 'Fiber (R)',
                              type: 'date',
                              cellFilter : 'date:"yyyy-MM-dd"',
                              headerCellClass : $scope.highlightFilteredHeader,
                              width : 100,
                              cellClass : 'number'
                            }, {
                              field : 'isAggregator',
                              displayName : 'isAggregator',
                              type: 'boolean',
                              headerCellClass : $scope.highlightFilteredHeader,
                              width : 100,
                              cellClass : 'number'
                            }, {
                              field : 'isConcentrator',
                              displayName : 'isConcentrator',
                              type: 'boolean',
                              headerCellClass : $scope.highlightFilteredHeader,
                              width : 100,
                              cellClass : 'number'
                            }, {
                                field : 'density',
                                displayName : 'Density [1/km²]',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width : 100,
                                cellClass: 'number'
                            }, {
                              field : 'owner',
                              displayName : 'Owner',
                              type: 'string',
                              headerCellClass : $scope.highlightFilteredHeader,
                              width : 100,
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellClass: 'number',
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true
                            }
                        ];
                    var reduce = function(site) {
                      var fiberPlanDate;
                      var fiberActualDate;
                      var concentrator;
                      var owner;
                      if (site._source.siteExtensions) {
                        concentrator = site._source.siteExtensions.concentrator;
                        owner = site._source.siteExtensions.owner;
                         fiberPlanDate = site._source.siteExtensions.fiberPlanDate;
                      if (fiberPlanDate !== null ) {
                        fiberPlanDate = new Date(site._source.siteExtensions.fiberPlanDate);
                      }
                       fiberActualDate = site._source.siteExtensions.fiberActualDate;
                      if (fiberActualDate !== null ) {
                        fiberActualDate = new Date(site._source.siteExtensions.fiberActualDate);
                      }}
                        return {
                            id : site._source.id.siteId,
                            name : site._source.siteName,
                            latitude : site._source.geoLocation.location.lat.toFixed(6),
                            longitude : site._source.geoLocation.location.lon.toFixed(6),
                            amslGrd : parseFloat(site._source.geoLocation.amslGrd).toFixed(2),
                            siteLinks : site._source.siteLinks.length,
                            networkElements : site._source.networkElements.length,
                            fiberPlanDate: fiberPlanDate,
                            fiberActualDate: fiberActualDate,
                            isAggregator: site._source.isAggregator,
                            isConcentrator: concentrator,
                            density : parseFloat(site._source.densityBsPerSKm).toFixed(2),
                            owner: owner
                        };
                    };

                    
                    var checkForMore = function() {
                        // console.log(0, 'sdf');
                        var done = (from >= numSites);
                        // console.log(0, done);
                        if (!done) {
                            // console.log(1,'not done');
                            from = from + maxSize;
                            $siteManager.getSites($scope.dbIndex, from, maxSize, function(err, total, sites) {
                                if (err) {
                                    done = true;
                                    console.log('htLog:', err);
                                    return;
                                }
                                sites.map(function(site) {
                                    $scope.gridOptions.data.push(reduce(site));
                                });
                                $scope.progressbar.value = $scope.gridOptions.data.length;
                                if (total <= $scope.gridOptions.data.length ) {
                                   $header.setStatus(alertService.success());
                                }
                                // console.log(from, total,
                                // $scope.gridOptions.data.length);
                                // getPage();
                            });
                            checkForMore();
                        }
                    };
                    var initialize = function() {
                      $header.setStatus(alertService.processing());
                        $siteManager.getSites($scope.dbIndex, from, maxSize, function(err, total, sites) {
                            if (err) {
                                console.log('htLog:', err);
                                return;
                            }
                            numSites = total;
                            sites.map(function(site) {
                                $scope.gridOptions.data.push(reduce(site));
                            });
                            $scope.progressbar = {max: total, value: $scope.gridOptions.data.length};
                            if (total <= $scope.gridOptions.data.length ) {
                              $header.setStatus(alertService.success());
                           }
                            checkForMore();
                        });
                    };
                    initialize();
                }
            ]
        });
    }
]);

htSiteManager.factory('$siteManager', ['$rootScope', '$http', function($rootScope, $http) {
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
        $http(req).success(function(data) {
            // console.log(data.hits.total, data.hits.hits.length);
            return callback(null, data.hits.total, data.hits.hits);
        }).error(function(data, status) {
            return callback(status, data);
        });
    };
    service.createSite = function(dbIndex, site, callback) {

        var url = '/api/create/site';

        var req = {
            method : 'PUT',
            url : url,
            headers : {
                'Content-Type' : 'application/json'
            },
            data : site
        };
        $http(req).success(function(data) {
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
        $http(req).success(function(data) {
            callback(null, data);
        }).error(function(data, status) {
            console.info(data, status);
            callback(data, null);
        });
    };

    return service;
}]);


// var htSiteManager = angular.module('fileUpload', ['angularFileUpload'])


htSiteManager.controller('FileUploadController', ['$scope', 'FileUploader', '$siteManager', function($scope, FileUploader, $siteManager) {
    'use strict';
        var uploader = $scope.uploader = new FileUploader({
            // url: '/convert/echo',
            url: '/convert/sitexlsx2json',
            autoUpload: true,
            removeAfterUpload: true,
            queueLimit: 1
        });

        // FILTERS
        uploader.filters.push({
            name: 'xslxFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('htLog: ', 'filters fn', item, options);
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|xlsx|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.log('onWhenAddingFileFailed', item, filter, options);
            $scope.failed = true;
            $scope.errorMessage = ' Error: ' + item.name + ' is not an Excel file.';
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $scope.failed = false;
            $scope.errorMessage = '';
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            $siteManager.setNewSite(response);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        // console.info('uploader', uploader);
    }]);
/**
 * angular.js for racklayouts
 */
var htRacklayout = angular.module('htRacklayout', []);

htRacklayout.config([
         '$stateProvider',
         function($stateProvider) {
             'use strict';
             $stateProvider.state('rack', {
                 // abstract:
                 // true,
                 url : '/rack/:index/:id',
                 templateUrl : 'modules/racklayout/racklayout.html',
                 controller: ['$rootScope' , '$scope', '$http', '$stateParams', '$networkMap', 'alertService', 'translateService', function ($rootScope, $scope, $http, $stateParams, $networkMap, alertService, translateService) {

                     alertService.setMessage([
                                              'LOADING', 'SUCCESS', 'FAILED'
                                          ]);
                                          $scope.changeLanguage = translateService.changeLanguage;

                     $scope.siteIndex = $stateParams.index;
                     $scope.siteId = $stateParams.id;
                     $rootScope.title = '(' + $scope.siteId + ') htRacklayout';

                     var getRestURL = function() {
                         var index = $scope.siteIndex;
                         var docType = 'networkelement';
                         var url = '/db/' + index + '/' + docType + '/_search';
                         return url;
                     };

                     var ru = 1.75; // rack unit [U]: 1.75"
  var railWidth = 0.625; // 0.625"
//  var neTypes = {
//    'R2D2-4711': {
//      height: {value: 2, unit: 'U'},
//    },
//    'L0815bid': {
//      height: {value: 4, unit: 'U'},      
//    },
//    'DWDM-MTS11': {
//      height: {value: 3, unit: 'U'},      
//    }
//  };

  var cb = function(comp){
    canvas.add(comp);
    // canvas.renderAll();
  };
  
  var canvas = new fabric.Canvas('canvas');
  angular.extend($scope, {
    
    selection: '',
    scale: 8,
    options: {
          step: [1, 4, 8, 12, 16, 24, 32]
    },
    update: function() {
      // console.log($scope.scale);
      // $scope.$apply();
      draw($scope.rack, $scope.scale, function(){
          // do nothing
      });
    },
      rack: {
              height: {value: 48, unit: 'U'},
              width: {value: 23, unit: 'inch'},
              networkElements: []
            }    
  });

  
// {
// id: 1,
// type: 'R2D2-4711',
// position: {value: 4, unit: 'U'}
// }
  
  
  var highlight = function(target) {
    if (target.selectable === true) {
      var rect = target;
      if (target.type === 'group') {
        rect = target.item(0);
      }
      rect.set({ strokeWidth: 4 });
      // canvas.renderAll();

      $scope.selection = target.item(0);
      $scope.$apply();
    }
  };
  var normal = function(target) {
    if (target.selectable === true) {
      var rect = target;
      if (target.type === 'group') {
        rect = target.item(0);
      }
      rect.set({ strokeWidth: 2 });
      // canvas.renderAll();
        
      $scope.selection = '';
      $scope.$apply();
    }
  };

  canvas.on('mouse:over', function(e) {
    highlight(e.target, 4);
  });
  
  canvas.on('mouse:out', function(e) {
    normal(e.target, 2);
  });
  
  var background = function(callback) {
      var bg = new fabric.Rect({
        top : 0,
        left : 0,
        width : canvas.width,
        height : canvas.height,
        strokeWidth: 0, 
        stroke: 'red',
        angle: 0,
        flipY: false,
        selectable: false,
        hasControls: false,
        hasBorders: false
    });
    bg.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: canvas.width,
      y2: canvas.height,
      colorStops: {
        0: '#FFFFFF',
        0.25: '#DDDDDD',
        0.50: '#EEEEEE',
        0.75: '#DDDDDD',
        1: '#FFFFFF'
       }
    });
    return callback(bg);
  };

  var makeLine = function(coords, callback) {
    return callback(new fabric.Line(coords, {
      fill: '#CCCCCC',
      stroke: '#CCCCCC',
      strokeWidth: 1,
      selectable: false
      }));
  };
    
  var makeRail = function(rail, height, width, scale, callback) {
    var rect = new fabric.Rect({
      left: rail*(canvas.width-railWidth*scale),
      top: 0,
      width: railWidth*scale,
      height: height,
      stroke: '#eeeeee',
      strokeWidth: 0,
      selectable: false
      });
    rect.setGradient('fill', {
      x1: 0,
      y1: -rail * height/2,
      x2: height,
      y2: height,
      colorStops: {
          0: '#949494',
          0.15: '#FFFFFF',
          0.20: '#ADADAD',
          0.25: '#CCCCCC',
          0.30: '#9E9E9E',
          0.35: '#BABABA',
          0.40: '#FFFFFF',
          0.50: '#949494',
          1: '#949494'
       }
    });
    return callback(rect);
  };
    
  var makeAcDc = function(pos, width, scale, callback) {

    var text = 'AC/DC';
    var label = new fabric.Text(text, {
      fontSize: 15*scale/10,
      fill: 'red',
        left: 0, 
        top: 0.8*scale
    });
    
    var rect = new fabric.Rect({
      left: label.width + width*0.1 - (width-2*railWidth*scale),
      top: 0,
      width: width-2*railWidth*scale,
      height: 2*ru*scale,
      stroke: '#FF0000',
      strokeWidth: 1,
      selectable: false
      });
    rect.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: rect.width,
      y2: rect.height,
      colorStops: {
          0: '#666666',
          0.70: '#EEEEEE',
          1: '#666666'
      }
    });

    return callback(new fabric.Group([ rect, label ], {
        left: railWidth*scale,
        top: pos,
        selectable: false
    }));
  };

  var makeNe = function(ne, width, scale, callback) {
    var text = ne.type;
    var label = new fabric.Text(text, {
      fontSize: 15*scale/10,
      fontFamily: 'Arial',
        fontStyle: 'bold',
         fill: 'white',
        left: 0, 
        top: ne.position.value*ru*scale + 0.8*scale
    });
    // console.log(neTypes[ne.type].height.value);
    var rect = new fabric.Rect({
      left: label.width + width*0.1 - (width-2*railWidth*scale),
      top: ne.position.value*ru*scale,
      width: width-2*railWidth*scale,
      height: 2*ru*scale, // TODO neTypes[ne.type].height.value*ru*scale,
      stroke: '#0000FF',
      strokeWidth: 2,
      selectable: true
      });
    rect.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: rect.width,
      y2: rect.height,
      colorStops: {
          0: '#0088FF',
          0.30: '#00EEFF',
          1: '#0088FF'
       }
    });
    return callback(new fabric.Group([ rect, label ], {
      left: railWidth*scale,
      top: ne.position.value*ru*scale,
      stroke: '#0000FF',
      strokeWidth: 0,
      selectable: true,
        hasControls: false,
        hasBorders: false
    }));
  };
    

    var draw = function(rack, scale, callback) {
      // init canvas
    canvas.setWidth(rack.width.value*scale);
        canvas.setHeight(rack.height.value*ru*scale); // rack unit: 1ru =
                                                        // 1,75"

      canvas.clear().renderAll();
      
      background(cb);
      
      for (var index = 0; index < rack.height.value; index++) {
        var x1 = 0*scale;
        var y1 = index*ru*scale;
        var x2 = canvas.width*scale;
        var y2 = index*ru*scale;
        makeLine([ x1, y1, x2, y2 ], cb);
      }

      for (var rail = 0; rail < 2; rail++) {
        makeRail(rail, canvas.height, canvas.width, scale, cb );
      }

      makeAcDc(0, canvas.width, scale, cb);

      // NEs
      for (var index1 = 0; index1 < $scope.rack.networkElements.length; index1++) {
      var ne = $scope.rack.networkElements[index1];
      makeNe( ne, canvas.width, scale, cb);
      }
      return callback();
   };

   var getNetworkElements = function(networkElements, callback) {
       var data = {
           from : 0,
           size : 99, // get all
           query : {
               filtered : {
                   query : {
                       match_all : {}
                   },
                   filter : {
                       terms : {
                           'id.networkElementId' : networkElements
                       }
                   }
               }
           }
       };
       var req = {
           method : 'POST',
           url : getRestURL(),
           headers : {
               'Content-Type' : 'application/json'
           },
           data : data
       };
       $http(req).success(function(data) {
           // console.log(JSON.stringify(neData));
           var nes = data.hits.hits;
           nes.map(function(ne){
               $scope.networkElements.push(ne._source);
               $scope.rack.networkElements.push({
                 id: ne._source.id.networkElementId,
                 type: ne._source.inventory.type,
                 position: {value: $scope.pos, unit: 'U'},
                 height: {value: 2, unit: 'U'}
               });
               $scope.networkElements[$scope.networkElements.length-1].position = $scope.pos;
               $scope.networkElements[$scope.networkElements.length-1].height = 2;
               
               $scope.pos += 3;
           });
           draw($scope.rack, $scope.scale, function(){
               return callback();
           });
       }).error(function(data, status){
           console.error('htLog: Error while loading NetworkElement data for ', data, status);
           return callback();
       });
   };
   
   var getSite = function() {
       $networkMap.getSitesByIds($scope.siteIndex, [$scope.siteId], function(sites){
           angular.extend($scope, {
               site: sites[0]._source,
               pos: 5,
               networkElements: []
             });
             
           getNetworkElements($scope.site.networkElements, function(){
               // do nothing
           });
     });
  };
  draw($scope.rack, $scope.scale, function(){
      // do nothing
  });
  getSite();
  
  /*
     * 
     * 
     * var rect = new fabric.Rect({ top : 100, left : 100, width : 60, height :
     * 70, strokeWidth: 2, stroke: 'red', angle: 15, flipY:true, selectable:
     * false, hasControls: false, hasBorders: false }); rect.setGradient('fill', {
     * x1: 0, y1: 0, x2: rect.width, y2: rect.height, colorStops: { 0: "red",
     * 0.2: "orange", 0.4: "yellow", 0.6: "green", 0.8: "blue", 1: "purple" }
     * }); canvas.add(rect);
     */  
                 }]
                 });
             }
         ]);

/**
 * angular.js for htProfil
 */
var htRevisionStatus = angular.module('htRevisionStatus', [
  'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);

htRevisionStatus.filter('username', function() {
  return function(input) {
    input = input || '';
    var out = input;
    var index = out.indexOf('@');
    if (index > -1) {
      out = out.substring(0, index);
    }
    return out;
  };
});

htRevisionStatus.config([
  '$stateProvider',
  function($stateProvider) {
    'use strict';
    $stateProvider.state('revisionStatus', {
      // abstract:
      // true,
      url : '/revisionStatus/:index/:high/:low/:mwrLinkId/:revision',
      templateUrl : 'modules/revisionStatus/revisionStatus.html',
      controller : [
        '$rootScope', '$scope', '$filter', '$uibModal', '$base64', '$stateParams', '$mwrLink', '$revisionStatus', 'authenticationService', 'alertService',
        '$header',
        function($rootScope, $scope, $filter, $uibModal, $base64, $stateParams, $mwrLink, $revisionStatus, authenticationService, alertService, $header) {

          alertService.setMessage([
            'LOADING', 'SUCCESS', 'FAILED'
          ]);
          $header.setStatus(alertService.processing());

          var isInit = false;
          var loadingStati = {
            mwrLinkLoaded : false,
            revisionStatesLoaded : false,
            revisionTypesLoaded : false,
            getInitStatus : function() {
              return this.mwrLinkLoaded && this.revisionStatesLoaded && this.revisionTypesLoaded;
            }
          };
          var createTableModel = function() {
            var tableModel = [];
            $scope.revisionStates.map(function(revState) {
              var row = {
                revisionState : revState,
                required : null,
                plan : null,
                actual : null,
                planner : null,
                comment : null
              };
              tableModel.push(row);
            });

            if ($scope.mwrLink.lifeCycle.revisionFlags !== undefined) {
              $scope.mwrLink.lifeCycle.revisionFlags.map(function(flag) {
                tableModel.map(function(row) {
                  console.log(JSON.stringify(flag));
                  console.log(flag.actual);
                  if (flag.revisionState.id === row.revisionState.id) {
                    // console.log('yippi');
                    row.required = flag.required;
                    row.plan = flag.plan;
                    row.actual = flag.actual;
                    row.planner = flag.planner;
                    row.comment = flag.comment;
                  }
                });
              });
            }
            $scope.tableModel = tableModel;
          };

          $scope.dbIndex = $stateParams.index;
          $scope.siteLinkIdLow = $stateParams.low;
          $scope.siteLinkIdHigh = $stateParams.high;
          $scope.mwrLinkId = $stateParams.mwrLinkId;
          $scope.revision = $stateParams.revision;
          $scope.displayId = $stateParams.high + '-' + $stateParams.low + '-' + $stateParams.mwrLinkId + '-' + $stateParams.revision;
          $rootScope.title = '(' + $scope.displayId + ') htRevisionStatus';

          var profileId = authenticationService.getProfileName();
          $scope.username = authenticationService.getUsername(profileId);
          $scope.revisionStatus = {};

          $scope.editRow = function(revisionStatusId) {
            $scope.selectedRow = {};
            $scope.tableModel.map(function(row) {
              if (row.revisionState.id === revisionStatusId) {
                $scope.selectedRow = JSON.parse(JSON.stringify(row));
              }
            });
            if ($scope.selectedRow.planner === null || $scope.selectedRow.planner === undefined) {
              $scope.selectedRow.planner = $scope.username;
            }

            if ($scope.selectedRow.required !== null) {
              $scope.selectedRow.required = new Date($scope.selectedRow.required);
            }

            if ($scope.selectedRow.plan !== null) {
              $scope.selectedRow.plan = new Date($scope.selectedRow.plan);
            }

            if ($scope.selectedRow.actual !== null) {
              $scope.selectedRow.actual = new Date($scope.selectedRow.actual);
            }

            var modalInstance = $uibModal.open({
              animation : $scope.animationsEnabled,
              templateUrl : '/ux/modules/revisionStatus/revisionStatus.modify.html',
              controller : 'ModifyCtrl',
              size : 'lg',
              resolve : {
                selectedRow : function() {
                  return $scope.selectedRow;
                }
              }
            });

            modalInstance.result.then(function(selectedRow) {
              selectedRow.$$hashKey = undefined;
              var rs = {};
              rs.id = $scope.mwrLink.id;
              rs.lifeCycle = {};
              rs.lifeCycle.revisionFlags = [];
              rs.lifeCycle.revisionFlags.push(selectedRow);
              $revisionStatus.set($scope.dbIndex, rs, function(err, data) {
                if (err) {
                  console.log('htLog:', err, data);
                } else {
                  $scope.tableModel.map(function(row) {
                    if (row.revisionState.id === selectedRow.revisionState.id) {
                      row.required = selectedRow.required;
                      row.plan = selectedRow.plan;
                      row.actual = selectedRow.actual;
                      row.planner = selectedRow.planner;
                      row.comment = selectedRow.comment;
                    }
                  });
                }
              });

            }, function() {
              console.log('Modal dismissed at: ' + new Date());
            });

          };

          $scope.status = alertService.processing();

          $revisionStatus.getRevisionStates($scope.dbIndex, function(revisionStates) {

            $scope.revisionStates = revisionStates;
            loadingStati.revisionStatesLoaded = true;
            isInit = loadingStati.getInitStatus();
            if (isInit) {
              $header.setStatus(alertService.success());
              createTableModel();
            }
          });

          $revisionStatus.getRevisionTypes($scope.dbIndex, function(revisionTypes) {
            $scope.revisionTypes = revisionTypes;
            loadingStati.revisionTypesLoaded = true;
            isInit = loadingStati.getInitStatus();
            if (isInit) {
              $header.setStatus(alertService.success());
              createTableModel();
            }
          });

          var id = {
            siteLinkId : {
              low : $scope.siteLinkIdLow,
              high : $scope.siteLinkIdHigh
            },
            mwrLinkId : $scope.mwrLinkId,
            revision : $scope.revision,
            variant : 0
          };
          $mwrLink.get($scope.dbIndex, id, function(err, mwrLink) {
            if (err) {
              $scope.status = alertService.failed(err);
            } else {
              $scope.mwrLink = mwrLink;
              loadingStati.mwrLinkLoaded = true;
              isInit = loadingStati.getInitStatus();
              if (isInit) {
                $header.setStatus(alertService.success());
                createTableModel();
              }
            }
          });
        }
      ]
    });
  }
]);

htRevisionStatus.controller('ModifyCtrl', ['$scope', '$uibModalInstance', 'selectedRow', function($scope, $uibModalInstance, selectedRow) {

  $scope.selectedRow = selectedRow;

  $scope.ok = function() {
    $uibModalInstance.close($scope.selectedRow);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);

htRevisionStatus.factory('$mwrLink', ['$http', function($http) {
    'use strict';

    var getRestURL = function(index) {
        var docType = 'mwrlinkrevisionvariant';
        var url = '/db/' + index + '/' + docType + '/_search';
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
//                                    high : id.siteLinkId.high
//                                }
//                            }, {
//                                term : {
//                                    low : id.siteLinkId.low
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
        $http(req).success(function(data) {
            // console.log(JSON.stringify(data));
            if (data.hits.total === 0) {
                return callback('Nothing found in DB ;(', null);
            }
            return callback(null, data.hits.hits[0]._source);
        }).error(function(data, status) {
            console.log('htLog: Request to DB failed! ', JSON.stringify(req));
                return callback(status, null);
        });
    };

    return service;
}]);

htRevisionStatus.factory('$revisionStatus', ['$http', function($http) {
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
        $http(req).success(function(data) {
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
        $http(req).success(function(data) {
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
        $http(req).success(function(data) {
            //console.log(data);
            return callback(null, data);
        }).error(function(data, status) {
            console.log('htLog: RevisionState set failed!');
            return callback(status, null);
        });
    };

    return service;
}]);

/**
 * angular.js for htUsers
 */
var htUsers =
                angular.module('htUsers', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'htLogin', 'alert', 'translate'
                ]);



htUsers.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('users', {
            // abstract:
            // true,
            url : '/users',
            templateUrl : '/ux/modules/users/users.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                '$users',
                function($rootScope, $scope, $stateParams, $users) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htUsers';

//                    var from = 0;
//                    var maxSize = 1000;
//                    var numSites = 0;

                    var actionCellTemplate = '<a class="vCenter" >' + 
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>' +
                    '</a>';
                    
                    $scope.gridOptions = {};
                    $scope.gridOptions.data = [];
                    $scope.gridOptions.enableColumnResizing = true;
                    $scope.gridOptions.enableSorting = true;
                    $scope.gridOptions.enableFiltering = true;
                    $scope.gridOptions.enableGridMenu = true;
                    $scope.gridOptions.showGridFooter = true;
                    // $scope.gridOptions.showColumnFooter = true;
                    $scope.gridOptions.fastWatch = true;
                    $scope.gridOptions.enableRowSelection = true;
                    $scope.gridOptions.enableRowHeaderSelection = true;
                    $scope.gridOptions.multiSelect = false;

                    $scope.gridOptions.gridMenuCustomItems = [
                                           {
                                               title : 'Rotate Grid',
                                               action : function($event) {
                                                   console.log($event);
                                                   this.grid.element.toggleClass('rotated');
                                               },
                                               order : 210
                                           }
                                       ];
                    
                    $scope.gridOptions.columnDefs =  [
                            {
                                field : 'id',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width: 80,
                                pinnedLeft : true
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true
                            }
                        ];
                    var initialize = function() {
console.info($users.name);
                    };
                    initialize();
                }
            ]
        });
    }
]);

htUsers.factory('$users', function() {
    'use strict';

    
    var service = {};

    service.name = 'Uses';
    
    return service;
});

(function() {
  'use strict';

  // jezz order of modules matters :(
  var app =
      angular.module('htSolutions', [
        'htLogin', 'htNetworkMap', 'htSiteLinkDetails', 'htSiteDetails', 'htNetworkElementDetails', 'htPathDetails', 'htRacklayout', 'htRevisionStatus',
        'htLinkcalculator', 'htProfile', 'htMwrLinkRevision', 'htEngineer', 'htMwrLinkManager', 'htSiteLinkManager', 'htSiteManager', 'htPathManager', 'htBsConnections',
        'htMbhPlanner', 'htInventory', 'htSecurity', 'htServers', 'htUsers', 'ui.router', 'coordinateFilter'
      ]);

  app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

    // It's very handy to add references to $state and $stateParams to
    // the
    // $rootScope
    // so that you can access them from any scope within your
    // applications.
    // For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will
    // set
    // the <li>
    // to active whenever 'contacts.list' or one of its decendents is
    // active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.title = 'htSolutions';
  }]);

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // ///////////////////////////
    // Redirects and Otherwise //
    // ///////////////////////////

    // Use $urlRouterProvider to configure any redirects (when) and
    // invalid
    // urls (otherwise).
    $urlRouterProvider

    // The `when` method says if the url is ever the 1st param, then
    // redirect to the 2nd param
    // Here we are just setting up some convenience urls.
    // .when('/c?id', '/contacts/:id')
    // .when('/user/:id', '/contacts/:id')

    // If the url is ever invalid, e.g. '/asdf', then redirect to '/'
    // aka
    // the home state
    .otherwise('/');

    // Use $stateProvider to configure your states.
    $stateProvider.state("home", {
      url : "/",
      templateUrl : 'modules/app/app.html',
      controller : ['$rootScope', '$scope', '$app', '$header', 'alertService', function($rootScope, $scope, $app, $header, alertService) {
        $rootScope.title = 'htSolutions';
        $header.setStatus(alertService.clear());
        $app.getDbIndex(function(dbIndex) {
          $scope.dbIndex = dbIndex;
          var nav = $app.getNavigation(dbIndex);
          $scope.managers = nav.slice(0, 4);
          $scope.reports = nav.slice(4);
          $scope.apps = [
            {
              label : 'NETWORK_MAP',
              link : '/ux/modules/networkMap/map.html#/' + $scope.dbIndex,
              image : '/ux/modules/networkMap/images/networkMap.png',
              templateUrl : '/ux/modules/app/templates/default.html',
              target : 'htNetworkMap'
            }, {
                label : 'MANAGEMENT',
                link : '/ux/#/siteManager/' + $scope.dbIndex,
                image : '/ux/modules/app/images/management.png',
                templateUrl : '/ux/modules/app/templates/management.html',
                target : 'htSiteManager'
            }, {
                label : 'REPORTS',
                link : '/ux/#/siteManager/' + $scope.dbIndex,
                image : '/ux/modules/app/images/reports.png',
                templateUrl : '/ux/modules/app/templates/reports.html',
                target : 'htBsPath'
            }, {
              label : 'LINK_CALCULATOR',
              link : '/ux/#/linkcalculator/sandbox/0/0/0/0/0',
              image : '/ux/modules/linkcalculator/images/linkcalculator.png',
              templateUrl : '/ux/modules/app/templates/default.html',
              target : 'htSolutions'
            }, {
              label : 'LINK_ENGINEER',
              link : '/ux/#/engineer/' + $scope.dbIndex + '/0/0',
              image : '/ux/modules/engineer/images/linkEngineer.png',
              templateUrl : '/ux/modules/app/templates/default.html',
              target : 'htSolutions'
//            }, {
//              label : 'MBH_PLANNER',
//              link : '/ux/#/mbhPlanner/' + $scope.dbIndex,
//              image : '/ux/modules/mbhPlanner/images/mbhPlanner.png',
//              templateUrl : '/ux/modules/app/templates/default.html',
//              target : 'htSolutions'
            }, {
              label : 'INVENTORY',
              link : '/ux/#/inventory/' + $scope.dbIndex,
              image : '/ux/modules/inventory/images/inventory.png',
              templateUrl : '/ux/modules/app/templates/default.html',
              target : 'htSolutions'
            }
          ];
          $scope.utilities = [
            {
              label : 'PROFILE',
              link : '/ux/#/profile',
              icon : 'fa fa-user',
              target : 'htSolutions'
            }, {
//              label : 'LOGOUT',
//              icon : 'fa fa-power-off',
//              link : '/#/login',
//              target : 'htSolutions'
//            }, {
              label : 'USERS',
              icon : 'fa fa-users',
              link : '/ux/#/users',
              target : 'htSolutions'
            }, {
              label : 'SECURITY',
              icon : 'fa fa-lock',
              link : '/ux/#/security',
              target : 'htSolutions'
            }, {
              label : 'SERVERS',
              icon : 'fa fa-server',
              link : '/ux/#/servers',
              target : 'htSolutions'
            }, {
              label : 'API_DOCUMENTATION',
              icon : 'fa fa-question',
              link : '/ux/swagger/index.html',
              target : 'htSolutions'
            }, {
              label : 'DATABASE',
              link : '/ux/#/database/' + $scope.dbIndex,
              icon : 'fa fa-database',
              target : 'htDatabase'
            }
          ];
        });
      }]
    }).state('about', {
      url : '/about',

      // Showing off how you could return a promise from
      // templateProvider
      templateProvider : [
        '$timeout', function($timeout) {
          return $timeout(function() {
            return '<p class="lead">About box </p>';
          }, 100);
        }
      ]
    });
  }]);
})();

app.factory('$app', ['$http', function($http) {
	'use strict';

	var getNewRequest = function(method, url) {
		return {
			method : method,
			url : url,
			headers : {
				'Content-Type' : 'application/json'
			}
		};
	};
	

	var service = {};

	service.dbIndex = 'unknown';
	
	service.getDbIndex = function(callback) {
		var url = '/api/server';
		var req = getNewRequest('GET', url);
		$http(req).success(function(data) {
			service.dbIndex = data.network_index;			
			return callback(service.dbIndex);
		}).error(function(data, status) {
			console.log('htLog: ', data, status);
			return callback(service.dbIndex);
		});
	};

  service.getNavigation = function(dbIndex) {
    var r = [ {
      label : 'SITE_MANAGER',
      link : '/ux/#/siteManager/' + dbIndex,
      target : 'htSiteManager'
    }, {
      label : 'SITELINK_MANAGER',
      link : '/ux/#/siteLinkManager/' + dbIndex,
      target : 'htSiteLinkManager'
    }, {
      label : 'MWRLINK_MANAGER',
      link : '/ux/#/mwrLinkManager/' + dbIndex,
      target : 'htMwrLinkManager'
    }, {
      label : 'PATH_MANAGER',
      link : '/ux/#/pathManager/' + dbIndex,
      target : 'htPathManager'
    }, {
      label : 'BS_CONNECTIONS',
      link : '/ux/#/bsConnections/' + dbIndex,
      target : 'htBsConnections'
    } ];
    return r;
  };

  return service;

}]);