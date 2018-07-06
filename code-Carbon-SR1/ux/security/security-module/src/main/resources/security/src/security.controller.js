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
        function SecurityCtrl($scope, $timeout, $q, $uibModal, $document, $mwtnCommons, securityService) {
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.$document = $document;
            this.securityService = securityService;
            $scope.message = "Empty";
            $scope.users = [];
            $scope.roles = [];
            $scope.currentUser = {};
            $scope.getCurrentUserById = function (id) {
                id !== null && securityService.getRolesForDomainUser(id).then(function (roles) {
                    var parentElem = angular.element($document[0].querySelector('#security'));
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'src/app/security/templates/userDetails.html',
                        controller: 'userDetailsCtrl',
                        controllerAs: 'vm',
                        appendTo: parentElem,
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
                    $scope.roles = roles;
                });
            });
        }
        return SecurityCtrl;
    }());
    security.controller('securityCtrl', ['$scope', '$timeout', '$q', '$uibModal', '$document', '$mwtnCommons', 'securityService', SecurityCtrl]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHkuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9hcHAvc2VjdXJpdHkvc2VjdXJpdHkuc2VydmljZS50cyIsInNyYy9hcHAvc2VjdXJpdHkvc2VjdXJpdHkuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFFQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBdUJoRDtRQUdFLHlCQUFvQixFQUFnQixFQUFVLEtBQXNCLEVBQVUsT0FBTyxFQUFVLEdBQWdCO1lBQTNGLE9BQUUsR0FBRixFQUFFLENBQWM7WUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtZQUFVLFlBQU8sR0FBUCxPQUFPLENBQUE7WUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFhO1lBQzdHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFFTyw0Q0FBa0IsR0FBMUI7WUFDRSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFVLENBQUM7WUFDakQsSUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7WUFFNUMsSUFBTSxHQUFHLEdBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGtCQUFlLENBQUM7WUFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBMkI7Z0JBQ25DLE1BQU0sRUFBRSxNQUFNO2dCQUNkLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRTtnQkFDaEUsSUFBSSxFQUFFLGtDQUFnQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLGtCQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sZUFBWTthQUN0SSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztnQkFDVCxnQkFBZ0Is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ZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO2dCQUM1QixFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNMLGVBQWUsQ0FBQyxXQUFXLEVBQUU7b0JBQzdCLGVBQWUsQ0FBQyxXQUFXLEVBQUU7aUJBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQWM7d0JBQWIsYUFBSyxFQUFFLGFBQUs7b0JBQ2pELE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNyQixNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDekIsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCxtQkFBQztJQUFELENBQUMsQUFwQ0QsSUFvQ0M7SUFFRCxRQUFRLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXJBTUQnO1xuXG5jb25zdCBzZWN1cml0eSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VjdXJpdHknKTtcblxuaW50ZXJmYWNlIElFbnZTZXJ2aWNlIHtcbiAgZ2V0QmFzZVVSTChwb3J0OiBzdHJpbmcpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFVzZXIgPSB7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGRvbWFpbmlkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGVuYWJsZWQ6IGJvb2xlYW47XG4gIHBhc3N3b3JkOiBzdHJpbmc7XG4gIHNhbHQ6IHN0cmluZztcbiAgdXNlcmlkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFJvbGUgPSB7XG4gIHJvbGVpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGRvbWFpbmlkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBTZWN1cml0eVNlcnZpY2Uge1xuICBwcml2YXRlIGNyZWRlbnRpYWxzOiBuZy5JUHJvbWlzZTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IG5nLklRU2VydmljZSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCBwcml2YXRlICR3aW5kb3csIHByaXZhdGUgZW52OiBJRW52U2VydmljZSkge1xuICAgIHRoaXMuZW5zdXJlQ3JlbmRlbnRpYWxzKCk7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUNyZW5kZW50aWFscygpIHtcbiAgICBjb25zdCBjcmVkZW50aWFsc0RlZmVyID0gdGhpcy4kcS5kZWZlcjxzdHJpbmc+KCk7XG4gICAgdGhpcy5jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzRGVmZXIucHJvbWlzZTtcblxuICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW52LmdldEJhc2VVUkwoJ01EX1NBTCcpfS9vYXV0aDIvdG9rZW5gO1xuICAgIHRoaXMuJGh0dHA8eyBhY2Nlc3NfdG9rZW46IHN0cmluZyB9Pih7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgZGF0YTogYGdyYW50X3R5cGU9cGFzc3dvcmQmdXNlcm5hbWU9JHt0aGlzLiR3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uub2RsVXNlcn0mcGFzc3dvcmQ9JHt0aGlzLiR3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uub2RsUGFzc30mc2NvcGU9c2RuYFxuICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgIGNyZWRlbnRpYWxzRGVmZXIucmVzb2x2ZShyZXMuZGF0YSAmJiByZXMuZGF0YS5hY2Nlc3NfdG9rZW4pO1xuICAgIH0sIGVyciA9PiB7XG4gICAgICBjcmVkZW50aWFsc0RlZmVyLnJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCB0b2tlbigpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVkZW50aWFscztcbiAgfVxuXG4gIHB1YmxpYyBnZXRBbGxVc2VycygpOiBuZy5JUHJvbWlzZTxVc2VyW10+IHtcbiAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVudi5nZXRCYXNlVVJMKCdNRF9TQUwnKX0vYXV0aC92MS91c2Vyc2A7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udGhlbih0b2tlbiA9PiB7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cDx7IHVzZXJzOiBVc2VyW10gfT4oe1xuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Rva2VufWAgfVxuICAgICAgfSkudGhlbihyZXN1bHQgPT4gcmVzdWx0LmRhdGEgJiYgcmVzdWx0LmRhdGEudXNlcnMpXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0QWxsUm9sZXMoKTogbmcuSVByb21pc2U8Um9sZVtdPiB7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy5lbnYuZ2V0QmFzZVVSTCgnTURfU0FMJyl9L2F1dGgvdjEvcm9sZXNgO1xuICAgIHJldHVybiB0aGlzLnRva2VuLnRoZW4odG9rZW4gPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuJGh0dHA8eyByb2xlczogUm9sZVtdIH0+KHtcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgaGVhZGVyczogeyAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHt0b2tlbn1gIH1cbiAgICAgIH0pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdC5kYXRhICYmIHJlc3VsdC5kYXRhLnJvbGVzKVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldFVzZXJCeUlkKHVzZXJJZDogc3RyaW5nKTogbmcuSVByb21pc2U8VXNlcj4ge1xuICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW52LmdldEJhc2VVUkwoJ01EX1NBTCcpfS9hdXRoL3YxL3VzZXJzLyR7dXNlcklkfWA7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udGhlbih0b2tlbiA9PiB7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cDxVc2VyPih7XG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7dG9rZW59YCB9XG4gICAgICB9KS50aGVuKHJlc3VsdCA9PiByZXN1bHQuZGF0YSAmJiByZXN1bHQuZGF0YSlcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRSb2xlc0ZvckRvbWFpblVzZXIodXNlcklkOiBzdHJpbmcsIGRvbWFpbjogc3RyaW5nPSBcInNkblwiKTogbmcuSVByb21pc2U8Um9sZVtdPiB7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy5lbnYuZ2V0QmFzZVVSTCgnTURfU0FMJyl9L2F1dGgvdjEvZG9tYWlucy8ke2RvbWFpbn0vdXNlcnMvJHt1c2VySWR9L3JvbGVzYDtcbiAgICByZXR1cm4gdGhpcy50b2tlbi50aGVuKHRva2VuID0+IHtcbiAgICAgIHJldHVybiB0aGlzLiRodHRwPHsgcm9sZXM6IFJvbGVbXSB9Pih7XG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7dG9rZW59YCB9XG4gICAgICB9KS50aGVuKHJlc3VsdCA9PiByZXN1bHQuZGF0YSAmJiByZXN1bHQuZGF0YS5yb2xlcylcbiAgICB9KTtcbiAgfVxufVxuXG5zZWN1cml0eS5zZXJ2aWNlKCdzZWN1cml0eVNlcnZpY2UnLCBbJyRxJywgJyRodHRwJywgJyR3aW5kb3cnLCAnRU5WJywgU2VjdXJpdHlTZXJ2aWNlXSk7IiwiZGVjbGFyZSB2YXIgYW5ndWxhcjogYW5ndWxhci5JQW5ndWxhclN0YXRpYzsgXG5cbmltcG9ydCB7IFNlY3VyaXR5U2VydmljZSwgUm9sZSB9IGZyb20gXCIuL3NlY3VyaXR5LnNlcnZpY2VcIjsgXG5cbmltcG9ydCBcIi4vc2VjdXJpdHkuc2VydmljZVwiO1xuXG5jb25zdCBzZWN1cml0eSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VjdXJpdHknKTtcblxuY2xhc3MgVXNlckRldGFpbHNDdHJsIHtcbiAgY29uc3RydWN0b3IoJHNjb3BlLCBwcml2YXRlICR1aWJNb2RhbEluc3RhbmNlLCBwdWJsaWMgdXNlcmlkOiBzdHJpbmcsIHB1YmxpYyByb2xlczogUm9sZVtdKSB7XG5cbiAgfVxuXG4gIHB1YmxpYyBvayA9ICgpID0+IHtcbiAgICB0aGlzLiR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKC8qIFBhcmFtZXRlciovKTtcbiAgfTtcblxuICBwdWJsaWMgY2FuY2VsID0gKCkgPT4ge1xuICAgIHRoaXMuJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gIH07XG59XG5cbnNlY3VyaXR5LmNvbnRyb2xsZXIoJ3VzZXJEZXRhaWxzQ3RybCcsIFsnJHNjb3BlJywgJyR1aWJNb2RhbEluc3RhbmNlJywgJ3VzZXJpZCcsICdyb2xlcycsIFVzZXJEZXRhaWxzQ3RybF0pO1xuXG5jbGFzcyBTZWN1cml0eUN0cmwge1xuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICR0aW1lb3V0LCBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2UsIHByaXZhdGUgJHVpYk1vZGFsLCBwcml2YXRlICRkb2N1bWVudCA6IG5nLklEb2N1bWVudFNlcnZpY2UsICAkbXd0bkNvbW1vbnMsIHByaXZhdGUgc2VjdXJpdHlTZXJ2aWNlOiBTZWN1cml0eVNlcnZpY2UpIHtcbiAgICAkc2NvcGUubWVzc2FnZSA9IFwiRW1wdHlcIjtcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcbiAgICAkc2NvcGUucm9sZXMgPSBbXTtcbiAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB7fTtcblxuICAgICRzY29wZS5nZXRDdXJyZW50VXNlckJ5SWQgPSBmdW5jdGlvbiAoaWQ6IHN0cmluZykge1xuICAgICAgaWQgIT09IG51bGwgJiYgc2VjdXJpdHlTZXJ2aWNlLmdldFJvbGVzRm9yRG9tYWluVXNlcihpZCkudGhlbihyb2xlcyA9PiB7XG4gICAgICAgIGNvbnN0IHBhcmVudEVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoJGRvY3VtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJyNzZWN1cml0eScpKTtcbiAgICAgICAgY29uc3QgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgYXJpYUxhYmVsbGVkQnk6ICdtb2RhbC10aXRsZScsXG4gICAgICAgICAgYXJpYURlc2NyaWJlZEJ5OiAnbW9kYWwtYm9keScsXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvYXBwL3NlY3VyaXR5L3RlbXBsYXRlcy91c2VyRGV0YWlscy5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAndXNlckRldGFpbHNDdHJsJyxcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgYXBwZW5kVG86IHBhcmVudEVsZW0sXG4gICAgICAgICAgc2l6ZTogJ3NtJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICByb2xlczogKCkgPT4gcm9sZXMsXG4gICAgICAgICAgICB1c2VyaWQ6ICgpID0+IGlkLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfTsgIFxuXG4gICAgc2VjdXJpdHlTZXJ2aWNlLnRva2VuLnRoZW4ocmVzID0+IHtcbiAgICAgICRxLmFsbChbXG4gICAgICAgIHNlY3VyaXR5U2VydmljZS5nZXRBbGxVc2VycygpLFxuICAgICAgICBzZWN1cml0eVNlcnZpY2UuZ2V0QWxsUm9sZXMoKV0pLnRoZW4oKFt1c2Vycywgcm9sZXNdKSA9PiB7XG4gICAgICAgICAgJHNjb3BlLnVzZXJzID0gdXNlcnM7XG4gICAgICAgICAgJHNjb3BlLnJvbGVzID0gcm9sZXM7XG4gICAgICB9KVxuICAgIH0pO1xuICB9XG59XG5cbnNlY3VyaXR5LmNvbnRyb2xsZXIoJ3NlY3VyaXR5Q3RybCcsIFsnJHNjb3BlJywgJyR0aW1lb3V0JywgJyRxJywgJyR1aWJNb2RhbCcsJyRkb2N1bWVudCcsICckbXd0bkNvbW1vbnMnLCAnc2VjdXJpdHlTZXJ2aWNlJywgU2VjdXJpdHlDdHJsIF0pOyJdfQ==