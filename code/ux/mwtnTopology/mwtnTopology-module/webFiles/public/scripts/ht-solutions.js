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


var app = angular.module('htSolutions', [
    'ngRoute', 'ngCookies', 'htLogin'
]);

app.config([
    '$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl : '/modules/login/login.html',
            controller : 'htLoginCtrl'
        }).otherwise({
            redirectTo : '/login'
        });
    }
]);
