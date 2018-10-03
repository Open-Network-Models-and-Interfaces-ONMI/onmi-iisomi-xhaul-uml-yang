define("security.service", ["require", "exports", "angularAMD"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var security = angular.module('app.security');
    var SecurityService = /** @class */ (function () {
        function SecurityService($q, $http, $window, env) {
            this.$q = $q;
            this.$http = $http;
            this.$window = $window;
            this.env = env;
            this.ensureCrendentials();
        }
        SecurityService.prototype.ensureCrendentials = function () {
            var credentialsDefer = this.$q.defer();
            this.credentials = credentialsDefer.promise;
            var url = this.env.getBaseURL('MD_SAL') + "/oauth2/token";
            this.$http({
                method: "POST",
                url: url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: "grant_type=password&username=" + this.$window.sessionStorage.odlUser + "&password=" + this.$window.sessionStorage.odlPass + "&scope=sdn"
            }).then(function (res) {
                credentialsDefer.resolve(res.data && res.data.access_token);
            }, function (err) {
                credentialsDefer.reject(err);
            });
        };
        Object.defineProperty(SecurityService.prototype, "token", {
            get: function () {
                return this.credentials;
            },
            enumerable: true,
            configurable: true
        });
        SecurityService.prototype.getAllUsers = function () {
            var _this = this;
            var url = this.env.getBaseURL('MD_SAL') + "/auth/v1/users";
            return this.token.then(function (token) {
                return _this.$http({
                    method: "GET",
                    url: url,
                    headers: { 'Authorization': "Bearer " + token }
                }).then(function (result) { return result.data && result.data.users; });
            });
        };
        SecurityService.prototype.getAllRoles = function () {
            var _this = this;
            var url = this.env.getBaseURL('MD_SAL') + "/auth/v1/roles";
            return this.token.then(function (token) {
                return _this.$http({
                    method: "GET",
                    url: url,
                    headers: { 'Authorization': "Bearer " + token }
                }).then(function (result) { return result.data && result.data.roles; });
            });
        };
        SecurityService.prototype.getUserById = function (userId) {
            var _this = this;
            var url = this.env.getBaseURL('MD_SAL') + "/auth/v1/users/" + userId;
            return this.token.then(function (token) {
                return _this.$http({
                    method: "GET",
                    url: url,
                    headers: { 'Authorization': "Bearer " + token }
                }).then(function (result) { return result.data && result.data; });
            });
        };
        SecurityService.prototype.getRolesForDomainUser = function (userId, domain) {
            var _this = this;
            if (domain === void 0) { domain = "sdn"; }
            var url = this.env.getBaseURL('MD_SAL') + "/auth/v1/domains/" + domain + "/users/" + userId + "/roles";
            return this.token.then(function (token) {
                return _this.$http({
                    method: "GET",
                    url: url,
                    headers: { 'Authorization': "Bearer " + token }
                }).then(function (result) { return result.data && result.data.roles; });
            });
        };
        return SecurityService;
    }());
    exports.SecurityService = SecurityService;
    security.service('securityService', ['$q', '$http', '$window', 'ENV', SecurityService]);
});
define( ["require", "exports", "security.service"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var security = angular.module('app.security');
    var UserDetailsCtrl = /** @class */ (function () {
        function UserDetailsCtrl($scope, $uibModalInstance, userid, roles) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.userid = userid;
            this.roles = roles;
            this.ok = function () {
                _this.$uibModalInstance.close( /* Parameter*/);
            };
            this.cancel = function () {
                _this.$uibModalInstance.dismiss('cancel');
            };
        }
        return UserDetailsCtrl;
    }());
    security.controller('userDetailsCtrl', ['$scope', '$uibModalInstance', 'userid', 'roles', UserDetailsCtrl]);
    var SecurityCtrl = /** @class */ (function () {
        function SecurityCtrl($scope, $rootScope, $timeout, $q, $uibModal, $document, $mwtnCommons, securityService) {
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.$document = $document;
            this.securityService = securityService;

            $rootScope.section_logo = 'src/app/security/images/security.png';

            $scope.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
            $scope.oneAtATime = true;
            $scope.status = { user: true };
            $scope.spinner = {};
            $scope.spinner.TEST = true;

            var nameCellTemplates = [
                '<div class="ui-grid-cell-contents">',
                '  <a href="{{row.entity.webUri}}" target="_blank" title="Access NE web application" ng-show="row.entity.webUri">',
                '    <i class="fa fa-external-link" aria-hidden="true"></i>',
                '    <span>{{grid.getCellValue(row, col)}}</span>',
                '  </a>',
                '  <span ng-show="!row.entity.webUri">{{grid.getCellValue(row, col)}}</span>',
                '</div>'].join('');

                
            var actionsTemplate = [
                '<span>&nbsp;&nbsp;</span>',
                '<div class="btn-group">',
                '<button class="btn btn-success" ng-click="grid.appScope.getCurrentUserById(row.entity.userid)">Info</button>',
                '<div class="btn-group">',
                '<span>&nbsp;</span>'].join('');

            $scope.userDetailsGridOptions = JSON.parse(JSON.stringify($mwtnCommons.gridOptions));
            $scope.userDetailsGridOptions.rowHeight = 44;
            $scope.userDetailsGridOptions.columnDefs = [
              {
                field: 'userid',
                type: 'string', 
                displayName: 'User Id',
                headerCellClass: $scope.highlightFilteredHeader, 
                width: 230,
                cellTemplate: nameCellTemplates,
                pinnedLeft: true,
                sort: {
                  ignoreSort: false,
                  priority: 0
                },
                enableCellEdit: false
              },
              { field: 'name', type: 'string', displayName: 'User Name', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
              { field: 'description', type: 'string', displayName: 'Description', headerCellClass: $scope.highlightFilteredHeader, width: 140, enableCellEdit: false },
              { field: 'enabled', type: 'boolean', displayName: 'Enabled', headerCellClass: $scope.highlightFilteredHeader, width: 140, enableCellEdit: false },
              { field: 'email', type: 'string', displayName: 'Email Id', headerCellClass: $scope.highlightFilteredHeader, width: 140, enableCellEdit: false },
              { field: 
                'domainid', type: 'string', displayName: 'Domain Id', headerCellClass: $scope.highlightFilteredHeader, width: 140, enableCellEdit: false },
              {
                name: 'Actions',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: actionsTemplate,
                width: 300,
                pinnedRight: false
              }
            ];

            $scope.roleDetailsGridOptions = JSON.parse(JSON.stringify($mwtnCommons.gridOptions));
            $scope.roleDetailsGridOptions.rowHeight = 44;
            $scope.roleDetailsGridOptions.columnDefs = [
              {
                field: 'roleid',
                type: 'string', 
                displayName: 'Role Id',
                headerCellClass: $scope.highlightFilteredHeader, 
                width: 230,
                pinnedLeft: true,
                sort: {
                  ignoreSort: false,
                  priority: 0
                },
                enableCellEdit: false
              },
              { field: 'name', type: 'string', displayName: 'Role Name', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
              { field: 'description', type: 'string', displayName: 'Description', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
              { field: 'domainid', type: 'string', displayName: 'Domain Id', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false }
            ];
            $scope.message = "Empty";
            $scope.users = [];
            $scope.roles = [];
            $scope.currentUser = {}; 
            $scope.getCurrentUserById = function (id) {
                id !== null && securityService.getRolesForDomainUser(id).then(function (roles) {
                //    var parentElem = angular.element($document[0].querySelector('#security'));
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'src/app/security/templates/userDetails.html',
                        controller: 'userDetailsCtrl',
                        controllerAs: 'vm',
                        //appendTo: parentElem,
                        size: 'sm',
                        resolve: {
                            roles: function () { return roles; },
                            userid: function () { return id; },
                        }
                    });
                });
            };
            securityService.token.then(function (res) {
                $q.all([
                    securityService.getAllUsers(),
                    securityService.getAllRoles()
                ]).then(function (_a) {
                    var users = _a[0], roles = _a[1];
                    $scope.users = users;
                    $scope.userDetailsGridOptions.data = users;
                    $scope.roles = roles;
                    $scope.roleDetailsGridOptions.data = roles;
                });
            });
        }
        return SecurityCtrl;
    }());
    security.controller('securityCtrl', ['$scope', '$rootScope', '$timeout', '$q', '$uibModal', '$document', '$mwtnCommons', 'securityService', SecurityCtrl]);
});
