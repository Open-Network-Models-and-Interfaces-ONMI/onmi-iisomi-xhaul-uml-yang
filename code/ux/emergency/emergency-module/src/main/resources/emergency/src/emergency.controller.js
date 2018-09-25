define("emergency.service", ["require", "exports", "angularAMD"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emergency = angular.module('app.emergency');
    /**
     * Represents the accassor service for the emegency application.
     */
    var EmergencyService = /** @class */ (function () {
        /** Initialises a new instance. */
        function EmergencyService($q, $http, $mwtnCommons) {
            this.$q = $q;
            this.$http = $http;
            this.$mwtnCommons = $mwtnCommons;
        }
        EmergencyService.prototype.getEquiomentIds = function () {
            return this.$q.resolve([
                "CommScope-OneCell-01",
                "CommScope-OneCell-02"
            ]);
        };
        /** Internal helper for getting the fab control lte response object */
        EmergencyService.prototype.getFabControlLte = function (equipmentId, alias) {
            if (alias === void 0) { alias = '1'; }
            var request = {
                url: "config/network-topology:network-topology/topology/topology-netconf/node/" + equipmentId + "/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/" + alias + "/fap-control/fap-control-lte",
                method: "GET"
            };
            return this.$mwtnCommons.genericRequest(request).then(function (result) {
                if (result && result.status == 200 && result.data) {
                    return (result.data);
                }
                return null;
            }, function (err) { return (null); });
        };
        /**
         * Get the current adminUp.adminState attribute.
         * @params equipmentId The equipmentId.
         * @params alias The alias (default = '1').
         * @returns An angular promise with the adminState.
         */
        EmergencyService.prototype.getAdminUpState = function (equipmentId, alias) {
            if (alias === void 0) { alias = '1'; }
            return this.getFabControlLte(equipmentId, alias).then(function (adminUp) {
                return (adminUp["fap-control-lte"] && adminUp["fap-control-lte"]["admin-state"]);
            });
        };
        /**
         * Set the current adminUp.adminState attribute.
         * @params equipmentId The equipmentId.
         * @params alias The alias (default = '1').
         * @returns An angular promise with the adminState.
         */
        EmergencyService.prototype.setAdminUpState = function (adminState, equipmentId, alias) {
            var _this = this;
            if (alias === void 0) { alias = '1'; }
            return this.getFabControlLte(equipmentId, alias).then(function (adminUp) {
                // set the admin state 
                adminUp["fap-control-lte"]["admin-state"] = adminState;
                // prepair the requenst
                var request = {
                    method: "PUT",
                    url: "config/network-topology:network-topology/topology/topology-netconf/node/" + equipmentId + "/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/" + alias + "/fap-control/fap-control-lte",
                    data: adminUp
                };
                // execute the request and retuen the result
                return _this.$mwtnCommons.genericRequest(request).then(function (result) {
                    if (result && result.status == 200 && result.data && result.data["fap-control-lte"]) {
                        return (result.data["fap-control-lte"]["admin-state"]);
                    }
                    return null;
                }, function (err) { return (null); });
            }, function (err) { return (null); });
        };
        /** Internal helper for getting the barring factor response object */
        EmergencyService.prototype.getLteRanCellRestriction = function (equipmentId, alias) {
            if (alias === void 0) { alias = '1'; }
            var request = {
                url: "config/network-topology:network-topology/topology/topology-netconf/node/" + equipmentId + "/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/" + alias + "/cell-config/lte/lte-ran/lte-ran-cell-restriction",
                method: "GET"
            };
            return this.$mwtnCommons.genericRequest(request).then(function (result) {
                if (result && result.status == 200 && result.data) {
                    return (result.data);
                }
                return null;
            }, function (err) { return (null); });
        };
        /**
         * Get the current barring factor attribute.
         * @params equipmentId The equipmentId.
         * @params alias The alias (default = '1').
         * @returns An angular promise with the x-0005b9-mo-sig-barring-factor.
         */
        EmergencyService.prototype.getBarringFactor = function (equipmentId, alias) {
            if (alias === void 0) { alias = '1'; }
            return this.getLteRanCellRestriction(equipmentId, alias).then(function (lteRanCellRestriction) {
                return (lteRanCellRestriction["lte-ran-cell-restriction"] && lteRanCellRestriction["lte-ran-cell-restriction"]["x-0005b9-mo-sig-barring-factor"]);
            });
        };
        /**
         * Set the berring factor attribute.
         * @params equipmentId The equipmentId.
         * @params alias The alias (default = '1').
         * @returns An angular promise with the adminState.
         */
        EmergencyService.prototype.setBarringFactor = function (barringFactor, equipmentId, alias) {
            var _this = this;
            if (alias === void 0) { alias = '1'; }
            return this.getLteRanCellRestriction(equipmentId, alias).then(function (lteRanCellRestriction) {
                // set the lteRanCellRestriction.barringFactor attribute
                lteRanCellRestriction["lte-ran-cell-restriction"]["x-0005b9-mo-sig-barring-factor"] = barringFactor;
                // prepair the requenst
                var request = {
                    method: "PUT",
                    url: "config/network-topology:network-topology/topology/topology-netconf/node/" + equipmentId + "/yang-ext:mount/bbf-tr-196-2-0-3-full:fap-service/" + alias + "/cell-config/lte/lte-ran/lte-ran-cell-restriction",
                    data: lteRanCellRestriction
                };
                // execute the request and retuen the result
                return _this.$mwtnCommons.genericRequest(request).then(function (result) {
                    if (result && result.status == 200 && result.data && result.data["lte-ran-cell-restriction"]) {
                        return (result.data["lte-ran-cell-restriction"]["x-0005b9-mo-sig-barring-factor"]);
                    }
                    return null;
                }, function (err) { return (null); });
            }, function (err) { return (null); });
        };
        return EmergencyService;
    }());
    exports.EmergencyService = EmergencyService;
    emergency.service('emergencyService', ['$q', '$http', "$mwtnCommons", EmergencyService]);
});
define( ["require", "exports", "emergency.service"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emergency = angular.module('app.emergency');
    var EmergencyCtrl = /** @class */ (function () {
        function EmergencyCtrl($scope, $timeout, $q, $mwtnCommons, emergencyService) {
            var _this = this;
            this.$q = $q;
            this.emergencyService = emergencyService;
            this.lastSelectedEquipmentId = undefined;
            $rootScope.section_logo = 'src/app/emergency/src/images/emergency.png'; 
            $scope.message = "Empty";
            $scope.equipmentIds = [];
            $scope.selectedEquipmentId = undefined;
            $scope.adminState = undefined;
            $scope.emergency = undefined;
            $scope.isBusy = false;
            $scope.currentLteRanCellRestriction = undefined;
            // get all avaliable equipments from the emegercy service
            emergencyService.getEquiomentIds().then(function (equipmentIds) {
                $scope.equipmentIds = equipmentIds;
            });
            // selected equiment has changed
            $scope.$watch("selectedEquipmentId", function (newVal, oldVal) {
                if (newVal === oldVal || !newVal)
                    return;
                _this.$q.all([
                    emergencyService.getAdminUpState(newVal),
                    emergencyService.getBarringFactor(newVal),
                    emergencyService.getLteRanCellRestriction(newVal)
                ]).then(function (results) {
                    $scope.adminState = results[0];
                    $scope.emergency = results[1] == 0;
                    $scope.currentLteRanCellRestriction = results[2];
                });
            });
            // toggles the admin state
            $scope.toggleAdminState = function () {
                $scope.isBusy = true;
                emergencyService.setAdminUpState(!$scope.adminState, $scope.selectedEquipmentId)
                    .then(function (r) {
                    $scope.isBusy = false;
                    $scope.adminState = r;
                })
                    .catch(function (err) {
                    $scope.isBusy = false;
                    console.error(err);
                });
            };
            // toggles the emergency state
            $scope.toggleEmergencyState = function () {
                emergencyService.setBarringFactor($scope.emergency ? 95 : 0, $scope.selectedEquipmentId)
                    .then(function (r) {
                    $scope.emergency = r == 0;
                    emergencyService.getLteRanCellRestriction($scope.selectedEquipmentId).then(function (res) {
                        $scope.isBusy = false;
                        $scope.currentLteRanCellRestriction = res;
                    });
                })
                    .catch(function (err) {
                    $scope.isBusy = false;
                    console.error(err);
                });
            };
        }
        return EmergencyCtrl;
    }());
    emergency.controller('emergencyCtrl', ['$scope', '$timeout', '$q', '$mwtnCommons', 'emergencyService', EmergencyCtrl]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1lcmdlbmN5LmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvYXBwL2VtZXJnZW5jeS9lbWVyZ2VuY3kuc2VydmljZS50cyIsInNyYy9hcHAvZW1lcmdlbmN5L2VtZXJnZW5jeS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUVBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7SUE4Q2xEOztPQUVHO0lBQ0g7UUFHRSxrQ0FBa0M7UUFDbEMsMEJBQW9CLEVBQWdCLEVBQVUsS0FBc0IsRUFBVSxZQUEyQjtZQUFyRixPQUFFLEdBQUYsRUFBRSxDQUFjO1lBQVUsVUFBSyxHQUFMLEtBQUssQ0FBaUI7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBZTtRQUV6RyxDQUFDO1FBRU0sMENBQWUsR0FBdEI7WUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNyQixzQkFBc0I7Z0JBQ3RCLHNCQUFzQjthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsc0VBQXNFO1FBQy9ELDJDQUFnQixHQUF2QixVQUF3QixXQUFtQixFQUFFLEtBQW1CO1lBQW5CLHNCQUFBLEVBQUEsV0FBbUI7WUFDOUQsSUFBTSxPQUFPLEdBQXNCO2dCQUNqQyxHQUFHLEVBQUUsNkVBQTJFLFdBQVcsMERBQXFELEtBQUssaUNBQThCO2dCQUNuTCxNQUFNLEVBQUUsS0FBSzthQUNkLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFnQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUMxRSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUNqRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN0QjtnQkFDRCxPQUFPLElB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QyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO1lBRUYsOEJBQThCO1lBQzlCLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRztnQkFDNUIsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLG1CQUFtQixDQUFDO3FCQUNyRixJQUFJLENBQUMsVUFBQSxDQUFDO29CQUNMLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUIsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRzt3QkFDNUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7d0JBQ3RCLE1BQU0sQ0FBQyw0QkFBNEIsR0FBRyxHQUFHLENBQUM7b0JBQzVDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsVUFBQSxHQUFHO29CQUNSLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztRQUVKLENBQUM7UUFDSCxvQkFBQztJQUFELENBQUMsQUE5REQsSUE4REM7SUFFRCxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLENBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICdhbmd1bGFyQU1EJztcblxuY29uc3QgZW1lcmdlbmN5ID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5lbWVyZ2VuY3knKTtcblxuZXhwb3J0IHR5cGUgRmFiQ29udHJvbEx0ZSA9IHtcbiAgXCJmYXAtY29udHJvbC1sdGVcIjoge1xuICAgIFwib3Atc3RhdGVcIjogYm9vbGVhbixcbiAgICBcImFkbWluLXN0YXRlXCI6IGJvb2xlYW4sICAvLyBudXIgZGllc2VuIHplaWdlbiwgdW5kIGVpbmUgQXVzd2FobCB6d2lzY2hlbiB0cnVlIHVuZCBmYWxzZSBlaW5iYXVlblxuICAgIFwicmYtdHgtc3RhdHVzXCI6IGJvb2xlYW4sXG4gICAgXCJmYXAtY29udHJvbC1sdGUtZ2F0ZXdheVwiOiB7XG4gICAgICBcInMxLXNpZy1saW5rLXBvcnRcIjogbnVtYmVyLFxuICAgICAgXCJzZWMtZ3ctc2VydmVyMVwiOiBzdHJpbmcsXG4gICAgICBcInNlYy1ndy1zZXJ2ZXIyXCI6IHN0cmluZyxcbiAgICAgIFwic2VjLWd3LXNlcnZlcjNcIjogc3RyaW5nLFxuICAgICAgXCJzMS1zaWctbGluay1zZXJ2ZXItbGlzdFwiOiBzdHJpbmdbXSxcbiAgICAgIFwiczEtY29ubmVjdGlvbi1tb2RlXCI6IHN0cmluZ1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHR5cGUgTHRlUmFuQ2VsbFJlc3RyaWN0aW9uID0ge1xuICBcImx0ZS1yYW4tY2VsbC1yZXN0cmljdGlvblwiOiB7XG4gICAgXCJ4LTAwMDViOS1tby1zaWctYmFycmluZy1mb3Itc3BlY2lhbC1hY1wiOiBzdHJpbmcsICAgICAgICAgLy8gYW56ZWlnZW5cbiAgICBcImJhcnJpbmctZm9yLWVtZXJnZW5jeVwiOiBib29sZWFuLFxuICAgIFwieC0wMDA1YjktbW8tc2lnLWJhcnJpbmctZmFjdG9yXCI6IG51bWJlciwgICAgICAgICAgICAgICAgIC8vIGFuemVpZ2VuICwgZ3Jvw59lciByb3RlciBidXR0b24gbWFjaHQgYXVzIGRlciA5NSBlaW5lIDAgXG4gICAgXCJjZWxsLWJhcnJlZFwiOiBib29sZWFuLFxuICAgIFwiY2VsbC1yZXNlcnZlZC1mb3Itb3BlcmF0b3ItdXNlXCI6IGJvb2xlYW4sXG4gICAgXCJ4LTAwMDViOS1tby1zaWctYmFycmluZy10aW1lXCI6IG51bWJlciAgICAgICAgICAgICAgICAgICAgLy8gYW56ZWlnZW5cbiAgfVxufTtcblxuaW50ZXJmYWNlIEdlbmVyaWNHZXRSZXF1ZXN0IHtcbiAgdXJsOiBzdHJpbmc7XG4gIG1ldGhvZDogXCJHRVRcIjtcbn1cblxuaW50ZXJmYWNlIEdlbmVyaWNQb3N0UmVxdWVzdDxUPiB7XG4gIHVybDogc3RyaW5nO1xuICBtZXRob2Q6IFwiUE9TVFwiIHwgXCJQVVRcIjtcbiAgZGF0YTogVFxufVxuXG5pbnRlcmZhY2UgQ29tbW9uU2VydmljZSB7XG4gIGdlbmVyaWNSZXF1ZXN0PFRSZXN1bHQ+KHJlcXVlc3Q6IEdlbmVyaWNHZXRSZXF1ZXN0KTogbmcuSVByb21pc2U8bmcuSUh0dHBSZXNwb25zZTxUUmVzdWx0Pj47XG4gIGdlbmVyaWNSZXF1ZXN0PFRSZXF1ZXN0LCBUUmVzdWx0PihyZXF1ZXN0OiBHZW5lcmljUG9zdFJlcXVlc3Q8VFJlcXVlc3Q+KTogbmcuSVByb21pc2U8bmcuSUh0dHBSZXNwb25zZTxUUmVzdWx0Pj47XG4gIGdldE1vdW50UG9pbnRzPFRSZXN1bHQ+KCk6IG5nLklQcm9taXNlPFRSZXN1bHQ+O1xufVxuXG4vKiogXG4gKiBSZXByZXNlbnRzIHRoZSBhY2Nhc3NvciBzZXJ2aWNlIGZvciB0aGUgZW1lZ2VuY3kgYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFbWVyZ2VuY3lTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjcmVkZW50aWFsczogbmcuSVByb21pc2U8c3RyaW5nPjtcblxuICAvKiogSW5pdGlhbGlzZXMgYSBuZXcgaW5zdGFuY2UuICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IG5nLklRU2VydmljZSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCBwcml2YXRlICRtd3RuQ29tbW9uczogQ29tbW9uU2VydmljZSkge1xuXG4gIH1cblxuICBwdWJsaWMgZ2V0RXF1aW9tZW50SWRzKCk6IG5nLklQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuJHEucmVzb2x2ZShbXG4gICAgICBcIkNvbW1TY29wZS1PbmVDZWxsLTAxXCIsXG4gICAgICBcIkNvbW1TY29wZS1PbmVDZWxsLTAyXCJcbiAgICBdKTtcbiAgfVxuXG4gIC8qKiBJbnRlcm5hbCBoZWxwZXIgZm9yIGdldHRpbmcgdGhlIGZhYiBjb250cm9sIGx0ZSByZXNwb25zZSBvYmplY3QgKi9cbiAgcHVibGljIGdldEZhYkNvbnRyb2xMdGUoZXF1aXBtZW50SWQ6IHN0cmluZywgYWxpYXM6IHN0cmluZyA9ICcxJyk6IG5nLklQcm9taXNlPEZhYkNvbnRyb2xMdGU+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBHZW5lcmljR2V0UmVxdWVzdCA9IHtcbiAgICAgIHVybDogYGNvbmZpZy9uZXR3b3JrLXRvcG9sb2d5Om5ldHdvcmstdG9wb2xvZ3kvdG9wb2xvZ3kvdG9wb2xvZ3ktbmV0Y29uZi9ub2RlLyR7ZXF1aXBtZW50SWR9L3lhbmctZXh0Om1vdW50L2JiZi10ci0xOTYtMi0wLTMtZnVsbDpmYXAtc2VydmljZS8ke2FsaWFzfS9mYXAtY29udHJvbC9mYXAtY29udHJvbC1sdGVgLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy4kbXd0bkNvbW1vbnMuZ2VuZXJpY1JlcXVlc3Q8RmFiQ29udHJvbEx0ZT4ocmVxdWVzdCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdGF0dXMgPT0gMjAwICYmIHJlc3VsdC5kYXRhKSB7XG4gICAgICAgIHJldHVybiAocmVzdWx0LmRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSwgZXJyID0+IChudWxsKSk7XG4gIH1cblxuICAvKiogXG4gICAqIEdldCB0aGUgY3VycmVudCBhZG1pblVwLmFkbWluU3RhdGUgYXR0cmlidXRlLiBcbiAgICogQHBhcmFtcyBlcXVpcG1lbnRJZCBUaGUgZXF1aXBtZW50SWQuXG4gICAqIEBwYXJhbXMgYWxpYXMgVGhlIGFsaWFzIChkZWZhdWx0ID0gJzEnKS5cbiAgICogQHJldHVybnMgQW4gYW5ndWxhciBwcm9taXNlIHdpdGggdGhlIGFkbWluU3RhdGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0QWRtaW5VcFN0YXRlKGVxdWlwbWVudElkOiBzdHJpbmcsIGFsaWFzOiBzdHJpbmcgPSAnMScpOiBuZy5JUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmFiQ29udHJvbEx0ZShlcXVpcG1lbnRJZCwgYWxpYXMpLnRoZW4oKGFkbWluVXApID0+IHtcbiAgICAgIHJldHVybiAoYWRtaW5VcFtcImZhcC1jb250cm9sLWx0ZVwiXSAmJiBhZG1pblVwW1wiZmFwLWNvbnRyb2wtbHRlXCJdW1wiYWRtaW4tc3RhdGVcIl0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYWRtaW5VcC5hZG1pblN0YXRlIGF0dHJpYnV0ZS4gXG4gICAqIEBwYXJhbXMgZXF1aXBtZW50SWQgVGhlIGVxdWlwbWVudElkLlxuICAgKiBAcGFyYW1zIGFsaWFzIFRoZSBhbGlhcyAoZGVmYXVsdCA9ICcxJykuXG4gICAqIEByZXR1cm5zIEFuIGFuZ3VsYXIgcHJvbWlzZSB3aXRoIHRoZSBhZG1pblN0YXRlLlxuICAgKi9cbiAgcHVibGljIHNldEFkbWluVXBTdGF0ZShhZG1pblN0YXRlOiBib29sZWFuLCBlcXVpcG1lbnRJZDogc3RyaW5nLCBhbGlhczogc3RyaW5nID0gJzEnKTogbmcuSVByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmdldEZhYkNvbnRyb2xMdGUoZXF1aXBtZW50SWQsIGFsaWFzKS50aGVuKChhZG1pblVwKSA9PiB7XG4gICAgICAvLyBzZXQgdGhlIGFkbWluIHN0YXRlIFxuICAgICAgYWRtaW5VcFtcImZhcC1jb250cm9sLWx0ZVwiXVtcImFkbWluLXN0YXRlXCJdID0gYWRtaW5TdGF0ZTtcblxuICAgICAgLy8gcHJlcGFpciB0aGUgcmVxdWVuc3RcbiAgICAgIGNvbnN0IHJlcXVlc3Q6IEdlbmVyaWNQb3N0UmVxdWVzdDxGYWJDb250cm9sTHRlPiA9IHtcbiAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICB1cmw6IGBjb25maWcvbmV0d29yay10b3BvbG9neTpuZXR3b3JrLXRvcG9sb2d5L3RvcG9sb2d5L3RvcG9sb2d5LW5ldGNvbmYvbm9kZS8ke2VxdWlwbWVudElkfS95YW5nLWV4dDptb3VudC9iYmYtdHItMTk2LTItMC0zLWZ1bGw6ZmFwLXNlcnZpY2UvJHthbGlhc30vZmFwLWNvbnRyb2wvZmFwLWNvbnRyb2wtbHRlYCxcbiAgICAgICAgZGF0YTogYWRtaW5VcFxuICAgICAgfTtcblxuICAgICAgLy8gZXhlY3V0ZSB0aGUgcmVxdWVzdCBhbmQgcmV0dWVuIHRoZSByZXN1bHRcbiAgICAgIHJldHVybiB0aGlzLiRtd3RuQ29tbW9ucy5nZW5lcmljUmVxdWVzdDxGYWJDb250cm9sTHRlLCBGYWJDb250cm9sTHRlPihyZXF1ZXN0KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3RhdHVzID09IDIwMCAmJiByZXN1bHQuZGF0YSAmJiByZXN1bHQuZGF0YVtcImZhcC1jb250cm9sLWx0ZVwiXSkge1xuICAgICAgICAgIHJldHVybiAocmVzdWx0LmRhdGFbXCJmYXAtY29udHJvbC1sdGVcIl1bXCJhZG1pbi1zdGF0ZVwiXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LCBlcnIgPT4gKG51bGwpKTtcbiAgICB9LCBlcnIgPT4gKG51bGwpKTtcbiAgfVxuXG4gIC8qKiBJbnRlcm5hbCBoZWxwZXIgZm9yIGdldHRpbmcgdGhlIGJhcnJpbmcgZmFjdG9yIHJlc3BvbnNlIG9iamVjdCAqL1xuICBwdWJsaWMgZ2V0THRlUmFuQ2VsbFJlc3RyaWN0aW9uKGVxdWlwbWVudElkOiBzdHJpbmcsIGFsaWFzOiBzdHJpbmcgPSAnMScpOiBuZy5JUHJvbWlzZTxMdGVSYW5DZWxsUmVzdHJpY3Rpb24+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBHZW5lcmljR2V0UmVxdWVzdCA9IHtcbiAgICAgIHVybDogYGNvbmZpZy9uZXR3b3JrLXRvcG9sb2d5Om5ldHdvcmstdG9wb2xvZ3kvdG9wb2xvZ3kvdG9wb2xvZ3ktbmV0Y29uZi9ub2RlLyR7ZXF1aXBtZW50SWR9L3lhbmctZXh0Om1vdW50L2JiZi10ci0xOTYtMi0wLTMtZnVsbDpmYXAtc2VydmljZS8ke2FsaWFzfS9jZWxsLWNvbmZpZy9sdGUvbHRlLXJhbi9sdGUtcmFuLWNlbGwtcmVzdHJpY3Rpb25gLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy4kbXd0bkNvbW1vbnMuZ2VuZXJpY1JlcXVlc3Q8THRlUmFuQ2VsbFJlc3RyaWN0aW9uPihyZXF1ZXN0KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN0YXR1cyA9PSAyMDAgJiYgcmVzdWx0LmRhdGEpIHtcbiAgICAgICAgcmV0dXJuIChyZXN1bHQuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LCBlcnIgPT4gKG51bGwpKTtcbiAgfVxuXG4gIC8qKiBcbiAgICogR2V0IHRoZSBjdXJyZW50IGJhcnJpbmcgZmFjdG9yIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtcyBlcXVpcG1lbnRJZCBUaGUgZXF1aXBtZW50SWQuXG4gICAqIEBwYXJhbXMgYWxpYXMgVGhlIGFsaWFzIChkZWZhdWx0ID0gJzEnKS5cbiAgICogQHJldHVybnMgQW4gYW5ndWxhciBwcm9taXNlIHdpdGggdGhlIHgtMDAwNWI5LW1vLXNpZy1iYXJyaW5nLWZhY3Rvci5cbiAgICovXG4gIHB1YmxpYyBnZXRCYXJyaW5nRmFjdG9yKGVxdWlwbWVudElkOiBzdHJpbmcsIGFsaWFzOiBzdHJpbmcgPSAnMScpOiBuZy5JUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRMdGVSYW5DZWxsUmVzdHJpY3Rpb24oZXF1aXBtZW50SWQsIGFsaWFzKS50aGVuKChsdGVSYW5DZWxsUmVzdHJpY3Rpb24pID0+IHtcbiAgICAgIHJldHVybiAobHRlUmFuQ2VsbFJlc3RyaWN0aW9uW1wibHRlLXJhbi1jZWxsLXJlc3RyaWN0aW9uXCJdICYmIGx0ZVJhbkNlbGxSZXN0cmljdGlvbltcImx0ZS1yYW4tY2VsbC1yZXN0cmljdGlvblwiXVtcIngtMDAwNWI5LW1vLXNpZy1iYXJyaW5nLWZhY3RvclwiXSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogXG4gICAqIFNldCB0aGUgYmVycmluZyBmYWN0b3IgYXR0cmlidXRlLiBcbiAgICogQHBhcmFtcyBlcXVpcG1lbnRJZCBUaGUgZXF1aXBtZW50SWQuXG4gICAqIEBwYXJhbXMgYWxpYXMgVGhlIGFsaWFzIChkZWZhdWx0ID0gJzEnKS5cbiAgICogQHJldHVybnMgQW4gYW5ndWxhciBwcm9taXNlIHdpdGggdGhlIGFkbWluU3RhdGUuXG4gICAqL1xuICBwdWJsaWMgc2V0QmFycmluZ0ZhY3RvcihiYXJyaW5nRmFjdG9yOiBudW1iZXIsIGVxdWlwbWVudElkOiBzdHJpbmcsIGFsaWFzOiBzdHJpbmcgPSAnMScpOiBuZy5JUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRMdGVSYW5DZWxsUmVzdHJpY3Rpb24oZXF1aXBtZW50SWQsIGFsaWFzKS50aGVuKChsdGVSYW5DZWxsUmVzdHJpY3Rpb24pID0+IHtcbiAgICAgIC8vIHNldCB0aGUgbHRlUmFuQ2VsbFJlc3RyaWN0aW9uLmJhcnJpbmdGYWN0b3IgYXR0cmlidXRlXG4gICAgICBsdGVSYW5DZWxsUmVzdHJpY3Rpb25bXCJsdGUtcmFuLWNlbGwtcmVzdHJpY3Rpb25cIl1bXCJ4LTAwMDViOS1tby1zaWctYmFycmluZy1mYWN0b3JcIl0gPSBiYXJyaW5nRmFjdG9yO1xuXG4gICAgICAvLyBwcmVwYWlyIHRoZSByZXF1ZW5zdFxuICAgICAgY29uc3QgcmVxdWVzdDogR2VuZXJpY1Bvc3RSZXF1ZXN0PEx0ZVJhbkNlbGxSZXN0cmljdGlvbj4gPSB7XG4gICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgdXJsOiBgY29uZmlnL25ldHdvcmstdG9wb2xvZ3k6bmV0d29yay10b3BvbG9neS90b3BvbG9neS90b3BvbG9neS1uZXRjb25mL25vZGUvJHtlcXVpcG1lbnRJZH0veWFuZy1leHQ6bW91bnQvYmJmLXRyLTE5Ni0yLTAtMy1mdWxsOmZhcC1zZXJ2aWNlLyR7YWxpYXN9L2NlbGwtY29uZmlnL2x0ZS9sdGUtcmFuL2x0ZS1yYW4tY2VsbC1yZXN0cmljdGlvbmAsXG4gICAgICAgIGRhdGE6IGx0ZVJhbkNlbGxSZXN0cmljdGlvblxuICAgICAgfTtcblxuICAgICAgLy8gZXhlY3V0ZSB0aGUgcmVxdWVzdCBhbmQgcmV0dWVuIHRoZSByZXN1bHRcbiAgICAgIHJldHVybiB0aGlzLiRtd3RuQ29tbW9ucy5nZW5lcmljUmVxdWVzdDxMdGVSYW5DZWxsUmVzdHJpY3Rpb24sIEx0ZVJhbkNlbGxSZXN0cmljdGlvbj4ocmVxdWVzdCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN0YXR1cyA9PSAyMDAgJiYgcmVzdWx0LmRhdGEgJiYgcmVzdWx0LmRhdGFbXCJsdGUtcmFuLWNlbGwtcmVzdHJpY3Rpb25cIl0pIHtcbiAgICAgICAgICByZXR1cm4gKHJlc3VsdC5kYXRhW1wibHRlLXJhbi1jZWxsLXJlc3RyaWN0aW9uXCJdW1wieC0wMDA1YjktbW8tc2lnLWJhcnJpbmctZmFjdG9yXCJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sIGVyciA9PiAobnVsbCkpO1xuICAgIH0sIGVyciA9PiAobnVsbCkpO1xuICB9XG5cbn1cblxuZW1lcmdlbmN5LnNlcnZpY2UoJ2VtZXJnZW5jeVNlcnZpY2UnLCBbJyRxJywgJyRodHRwJywgXCIkbXd0bkNvbW1vbnNcIiwgRW1lcmdlbmN5U2VydmljZV0pOyIsImRlY2xhcmUgdmFyIGFuZ3VsYXI6IGFuZ3VsYXIuSUFuZ3VsYXJTdGF0aWM7IFxuXG5pbXBvcnQgeyBFbWVyZ2VuY3lTZXJ2aWNlLCBMdGVSYW5DZWxsUmVzdHJpY3Rpb24sIEZhYkNvbnRyb2xMdGUgfSBmcm9tIFwiLi9lbWVyZ2VuY3kuc2VydmljZVwiOyBcblxuaW1wb3J0IFwiLi9lbWVyZ2VuY3kuc2VydmljZVwiO1xuXG5jb25zdCBlbWVyZ2VuY3kgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmVtZXJnZW5jeScpO1xuXG5pbnRlcmZhY2UgSUVtZXJnZW5jeUN0cmxTY29wZSB7XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgZXF1aXBtZW50SWRzOiBzdHJpbmdbXTtcbiAgc2VsZWN0ZWRFcXVpcG1lbnRJZDogc3RyaW5nO1xuICBhZG1pblN0YXRlOiBib29sZWFuO1xuICBlbWVyZ2VuY3k6IGJvb2xlYW47XG4gIHRvZ2dsZUFkbWluU3RhdGU6ICgpID0+IHZvaWQ7XG4gIHRvZ2dsZUVtZXJnZW5jeVN0YXRlOiAoKSA9PiB2b2lkO1xuICBpc0J1c3k6IGJvb2xlYW47XG4gIGN1cnJlbnRMdGVSYW5DZWxsUmVzdHJpY3Rpb246IEx0ZVJhbkNlbGxSZXN0cmljdGlvblxufVxuXG5jbGFzcyBFbWVyZ2VuY3lDdHJsIHtcbiAgcHJpdmF0ZSBsYXN0U2VsZWN0ZWRFcXVpcG1lbnRJZDogc3RyaW5nID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKCRzY29wZTogbmcuSVNjb3BlICYgSUVtZXJnZW5jeUN0cmxTY29wZSwgJHRpbWVvdXQsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSwgJG13dG5Db21tb25zLCBwcml2YXRlIGVtZXJnZW5jeVNlcnZpY2U6IEVtZXJnZW5jeVNlcnZpY2UpIHtcbiAgICAkc2NvcGUubWVzc2FnZSA9IFwiRW1wdHlcIjtcbiAgICAkc2NvcGUuZXF1aXBtZW50SWRzID0gW107XG4gICAgJHNjb3BlLnNlbGVjdGVkRXF1aXBtZW50SWQgPSB1bmRlZmluZWQ7XG4gICAgJHNjb3BlLmFkbWluU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgJHNjb3BlLmVtZXJnZW5jeSA9IHVuZGVmaW5lZDtcbiAgICAkc2NvcGUuaXNCdXN5ID0gZmFsc2U7XG4gICAgJHNjb3BlLmN1cnJlbnRMdGVSYW5DZWxsUmVzdHJpY3Rpb24gPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBnZXQgYWxsIGF2YWxpYWJsZSBlcXVpcG1lbnRzIGZyb20gdGhlIGVtZWdlcmN5IHNlcnZpY2VcbiAgICBlbWVyZ2VuY3lTZXJ2aWNlLmdldEVxdWlvbWVudElkcygpLnRoZW4oZXF1aXBtZW50SWRzID0+IHtcbiAgICAgICRzY29wZS5lcXVpcG1lbnRJZHMgPSBlcXVpcG1lbnRJZHM7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3RlZCBlcXVpbWVudCBoYXMgY2hhbmdlZFxuICAgICRzY29wZS4kd2F0Y2goXCJzZWxlY3RlZEVxdWlwbWVudElkXCIsIChuZXdWYWw6IHN0cmluZywgb2xkVmFsOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChuZXdWYWwgPT09IG9sZFZhbCB8fCAhbmV3VmFsKSByZXR1cm47XG4gICAgICB0aGlzLiRxLmFsbChbXG4gICAgICAgIGVtZXJnZW5jeVNlcnZpY2UuZ2V0QWRtaW5VcFN0YXRlKG5ld1ZhbCksXG4gICAgICAgIGVtZXJnZW5jeVNlcnZpY2UuZ2V0QmFycmluZ0ZhY3RvcihuZXdWYWwpLFxuICAgICAgICBlbWVyZ2VuY3lTZXJ2aWNlLmdldEx0ZVJhbkNlbGxSZXN0cmljdGlvbihuZXdWYWwpXG4gICAgICBdKS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAkc2NvcGUuYWRtaW5TdGF0ZSA9IHJlc3VsdHNbMF07XG4gICAgICAgICRzY29wZS5lbWVyZ2VuY3kgPSByZXN1bHRzWzFdID09IDA7XG4gICAgICAgICRzY29wZS5jdXJyZW50THRlUmFuQ2VsbFJlc3RyaWN0aW9uID0gcmVzdWx0c1syXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gdG9nZ2xlcyB0aGUgYWRtaW4gc3RhdGVcbiAgICAkc2NvcGUudG9nZ2xlQWRtaW5TdGF0ZSA9ICgpID0+IHtcbiAgICAgICRzY29wZS5pc0J1c3kgPSB0cnVlO1xuICAgICAgZW1lcmdlbmN5U2VydmljZS5zZXRBZG1pblVwU3RhdGUoISRzY29wZS5hZG1pblN0YXRlLCAkc2NvcGUuc2VsZWN0ZWRFcXVpcG1lbnRJZClcbiAgICAgICAgLnRoZW4ociA9PiB7XG4gICAgICAgICAgJHNjb3BlLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICRzY29wZS5hZG1pblN0YXRlID0gcjsgXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICRzY29wZS5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyB0b2dnbGVzIHRoZSBlbWVyZ2VuY3kgc3RhdGVcbiAgICAkc2NvcGUudG9nZ2xlRW1lcmdlbmN5U3RhdGUgPSAoKSA9PiB7XG4gICAgICBlbWVyZ2VuY3lTZXJ2aWNlLnNldEJhcnJpbmdGYWN0b3IoJHNjb3BlLmVtZXJnZW5jeSA/IDk1IDogMCwgJHNjb3BlLnNlbGVjdGVkRXF1aXBtZW50SWQpXG4gICAgICAgIC50aGVuKHIgPT4ge1xuICAgICAgICAgICRzY29wZS5lbWVyZ2VuY3kgPSByID09IDA7XG4gICAgICAgICAgZW1lcmdlbmN5U2VydmljZS5nZXRMdGVSYW5DZWxsUmVzdHJpY3Rpb24oJHNjb3BlLnNlbGVjdGVkRXF1aXBtZW50SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICRzY29wZS5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50THRlUmFuQ2VsbFJlc3RyaWN0aW9uID0gcmVzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAkc2NvcGUuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gIH1cbn1cblxuZW1lcmdlbmN5LmNvbnRyb2xsZXIoJ2VtZXJnZW5jeUN0cmwnLCBbJyRzY29wZScsICckdGltZW91dCcsICckcScsICckbXd0bkNvbW1vbnMnLCAnZW1lcmdlbmN5U2VydmljZScsIEVtZXJnZW5jeUN0cmwgXSk7Il19