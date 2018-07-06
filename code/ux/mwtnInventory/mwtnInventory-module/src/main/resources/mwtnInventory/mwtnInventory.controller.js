var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("mwtnInventory.service", ["require", "exports", "angularAMD"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mwtnInventory = angular.module('app.mwtnInventory');
    var ExtensionResult = /** @class */ (function () {
        function ExtensionResult() {
        }
        return ExtensionResult;
    }());
    var InventoryService = /** @class */ (function () {
        function InventoryService($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {
            var _this = this;
            this.$q = $q;
            this.$mwtnCommons = $mwtnCommons;
            this.$mwtnDatabase = $mwtnDatabase;
            this.$mwtnLog = $mwtnLog;
            /**
             * Helperfunction to detect and convert the 'value-name-group' .
             * @param propertyName Name of the object property.
             * @param propertyValue Value of the object property.
             * @param valueName Optional: The value-name to be used instaed of the propertyName.
             * @returns A simplified property value if this is a 'value-name-group' otherwhise the propertyValue. */
            this.convertValue = function (propertyName, propertyValue, valueName) {
                if (valueName === void 0) { valueName = ''; }
                if (propertyValue && propertyValue instanceof Array && propertyValue.length == 1 && (valueName == null ||
                    propertyValue[0]["value-name"] === propertyName ||
                    propertyValue[0]["value-name"] === valueName)) {
                    return propertyValue[0]["value"];
                }
                return propertyValue;
            };
            /**
             *  Converts an API object to a simplified local object.
             *  @param apiResult The API object to convert.
             *  @param valueName Optional: The value-name to be used instaed of the propertyName.
             *  @returns The simplified local object.
            */
            this.convertObject = function (apiResult, valueName) {
                if (valueName === void 0) { valueName = ''; }
                if (apiResult instanceof Array) {
                    return apiResult.map(function (elm) { return _this.convertObject(elm, valueName); });
                }
                else if (apiResult instanceof Object) {
                    var keys = Object.keys(apiResult);
                    var result_1 = {};
                    keys.forEach(function (key) {
                        var value = _this.convertValue(key, apiResult[key], valueName);
                        result_1[key] = (value instanceof Object || value instanceof Array)
                            ? _this.convertObject(value)
                            : value;
                    });
                    return result_1;
                }
                return apiResult;
            };
        }
        /** Requests all active moint points */
        InventoryService.prototype.getConnectedMountpoints = function () {
            return this.$mwtnCommons.getMountPoints().then(function (mountpoints) {
                //console.log(mountpoints);
                return mountpoints.reduce(function (acc, cur, ind, arr) {
                    if (cur['netconf-node-topology:connection-status'] === 'connected')
                        acc.push(cur["node-id"]);
                    return acc;
                }, []);
            });
        };
        /**
         * Requests all 'root identifiers' for the given 'node id'.
         * @param nodeId The id of the node to request the root identifiers for.
         * @returns A q.Promise containing an array of all root identifiers for the requested node id.
         * */
        InventoryService.prototype.getRootIdentifiers = function (nodeId) {
            var _this = this;
            var request = {
                url: "operational/network-topology:network-topology/topology/topology-netconf/node/" + nodeId + "/yang-ext:mount/core-model:network-element/extension/top-level-equipment",
                method: "GET"
            };
            return this.$mwtnCommons.genericRequest(request).then(function (result) {
                if (result && result.status == 200 && result.data) {
                    var topLevelEquipment = _this.convertObject(result.data, 'top-level-equipment');
                    var rootIdentifiers = topLevelEquipment && topLevelEquipment.extension && topLevelEquipment.extension.split(',');
                    return rootIdentifiers && rootIdentifiers.map(function (identifier) { return identifier && identifier.trim(); });
                }
                return null;
            }, function (err) { return (null); });
        };
        /**
         * Requests the detail information for the given combination of 'nodeId' and 'equipmentIdentifier'.
         * @param nodeId The id of the root node.
         * @param identifier The identifier to request the details for.
         * @returns A q.Promise containing an object with all the details.
         * */
        InventoryService.prototype.getEquipmentDetails = function (nodeId, identifier) {
            var _this = this;
            var request = {
                url: "operational/network-topology:network-topology/topology/topology-netconf/node/" + nodeId + "/yang-ext:mount/core-model:equipment/" + identifier,
                method: "GET"
            };
            return this.$mwtnCommons.genericRequest(request).then(function (result) {
                if (result && result.status == 200 && result.data) {
                    return _this.convertObject(result.data);
                }
                return null;
            }, function (err) { return (null); });
        };
        /**
         * Requests the conditional information for the given combination of 'nodeId' and 'equipmentIdentifier'.
         * @param nodeId The id of the root node.
         * @param identifier The identifier to request the conditionals for.
         * @returns A q.Promise containing an object with all the conditional informations.
         * */
        InventoryService.prototype.getEquipmentConditionals = function (nodeId, identifier) {
            var _this = this;
            var request = {
                url: "operational/network-topology:network-topology/topology/topology-netconf/node/" + nodeId + "/yang-ext:mount/onf-core-model-conditional-packages:equipment-pac/" + identifier,
                method: "GET"
            };
            return this.$mwtnCommons.genericRequest(request).then(function (result) {
                if (result && result.status == 200 && result.data) {
                    return _this.convertObject(result.data);
                }
                return {"equipment-pac":[]};
            }, function (err) { return ({"equipment-pac":[]}); });
        };
        return InventoryService;
    }());
    exports.InventoryService = InventoryService;
    mwtnInventory.service('mwtnInventoryService', ["$q", "$mwtnCommons", "$mwtnDatabase", "$mwtnLog", InventoryService]);
});
define("models/equipment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Equipment = /** @class */ (function () {
        function Equipment() {
        }
        return Equipment;
    }());
    exports.Equipment = Equipment;
});
define("components/equipment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mwtnInventory = angular.module('app.mwtnInventory');
    var EquipmentDirective = function () {
        return {
            templateUrl: 'src/app/mwtnInventory/components/equipment.html',
            controller: 'mwtnEquipmentCtrl',
            controllerAs: 'vm',
            scope: {
                equipment: "="
            }
        };
    };
    mwtnInventory.directive('mwtnEquipment', EquipmentDirective);
    var EquipmentController = /** @class */ (function () {
        function EquipmentController($scope) {
            this.$scope = $scope;
        }
        return EquipmentController;
    }());
    exports.EquipmentController = EquipmentController;
    mwtnInventory.controller('mwtnEquipmentCtrl', ['$scope', EquipmentController]);
});
define("components/equipmentGroup", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mwtnInventory = angular.module('app.mwtnInventory');
    var EquipmentGroupDirective = function ($compile) {
        return {
            templateUrl: 'src/app/mwtnInventory/components/equipmentGroup.html',
            controller: 'mwtnEquipmentGroupCtrl',
            controllerAs: 'vm',
            scope: {
                equipments: "="
            },
            // HACK: for angular 1.4. compatibility
            compile: function (tElement, tAttr, transclude) {
                var contents = tElement.contents().remove();
                var compiledContents;
                return function (scope, iElement, iAttr) {
                    if (!compiledContents) {
                        compiledContents = $compile(contents, transclude);
                    }
                    compiledContents(scope, function (clone, scope) {
                        iElement.append(clone);
                    });
                };
            }
        };
    };
    mwtnInventory.directive('mwtnEquipmentGroup', ['$compile', EquipmentGroupDirective]);
    var EquipmentGroupController = /** @class */ (function () {
        function EquipmentGroupController($scope) {
            //console.log("EquipmentGroupController", $scope.equipments);
            this.$scope = $scope;
        }
        return EquipmentGroupController;
    }());
    exports.EquipmentGroupController = EquipmentGroupController;
    mwtnInventory.controller('mwtnEquipmentGroupCtrl', ['$scope', EquipmentGroupController]);
});
define( ["require", "exports", "mwtnInventory.service", "components/equipment", "components/equipmentGroup"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mwtnInventory = angular.module('app.mwtnInventory');
    var MwtnInventoryCtrl = /** @class */ (function () {
        function MwtnInventoryCtrl($rootScope, $scope, $state, $timeout, mwtnInventoryService) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$state = $state;
            this.$timeout = $timeout;
            this.mwtnInventoryService = mwtnInventoryService;
            // todo: change this
            $rootScope.section_logo = 'src/app/mwtnInventory/images/mwtnInventory.png';
            $scope.loading = false;
            $scope.message = "Empty";
            $scope.equipments = [];
            $scope.selectedMountPoint = null;
            $scope.activeMountPoints = [];
            var getAllChildEquipments = function (equipmentsRootId, equimentIds) { return __awaiter(_this, void 0, void 0, function () {
                var equipmentObjects, equipmentConditionals, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!equimentIds || !equimentIds.length) {
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, Promise.all(equimentIds.map(function (id) {
                                    return mwtnInventoryService.getEquipmentDetails(equipmentsRootId, id);
                                }))];
                        case 1:
                            equipmentObjects = (_a.sent()).map(function (eq) { return (eq["equipment"][0]); });
                            return [4 /*yield*/, Promise.all(equimentIds.map(function (id) {
                                    return mwtnInventoryService.getEquipmentConditionals(equipmentsRootId, id);
                                }))];
                        case 2:
                            equipmentConditionals = (_a.sent()).map(function (eq) { return (eq["equipment-pac"][0]); });
                            return [4 /*yield*/, Promise.all(equipmentObjects.map(function (eq) {
                                    var fruNames = (eq["contained-holder"] || []).map(function (ch) { return ch["occupying-fru"]; }).filter(function (fru) { return !!fru; });
                                    return getAllChildEquipments(equipmentsRootId, fruNames);
                                }))];
                        case 3:
                            results = _a.sent();
                            return [2 /*return*/, equipmentObjects.reduce(function (acc, cur, ind, arr) {
                                    var conditional = equipmentConditionals[ind] || null;
                                    // ensure EVERY property can be null or undefined
                                    var manufacturedThing = cur['manufactured-thing'];
                                    var equipmentType = manufacturedThing && manufacturedThing['equipment-type'];
                                    var manufacturerProperties = manufacturedThing && manufacturedThing['manufacturer-properties'];
                                    var equipmentInstance = manufacturedThing && manufacturedThing['equipment-instance'];
                                    var card = {
                                        name: cur.name,
                                        label: cur.label,
                                        uuid: cur.uuid,
                                        manufacturer: {
                                            version: equipmentType && equipmentType["version"],
                                            description: equipmentType && equipmentType["description"],
                                            partTypeIdentifier: equipmentType && equipmentType["part-type-identifier"],
                                            modelIdentifier: equipmentType && equipmentType["model-identifier"],
                                            partTypeIdetypeNamentifier: equipmentType && equipmentType["type-name"],
                                            id: manufacturerProperties && manufacturerProperties['manufacturer-identifier'],
                                            date: equipmentInstance && equipmentInstance['manufacture-date'] && Date.parse(equipmentInstance && equipmentInstance['manufacture-date']),
                                            serial: equipmentInstance && equipmentInstance['serial-number']
                                        },
                                        conditional: conditional
                                    };
                                    (results[ind].length ? card['children'] = results[ind] : null);
                                    acc.push(card);
                                    return acc;
                                }, [])];
                    }
                });
            }); };
            var pleaseSelect = "... please select a mount point";
            var refresh = function (equipmentsRootId) { return __awaiter(_this, void 0, void 0, function () {
                var rootIdentifiers, equipments, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, mwtnInventoryService.getRootIdentifiers(equipmentsRootId)];
                        case 1:
                            rootIdentifiers = _b.sent();
                            _a = rootIdentifiers;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, getAllChildEquipments(equipmentsRootId, rootIdentifiers)];
                        case 2:
                            _a = (_b.sent());
                            _b.label = 3;
                        case 3:
                            equipments = _a;
                            $timeout(function () {
                                $scope.equipments = equipments;
                            });
                            return [2 /*return*/];
                    }
                });
            }); };
            mwtnInventoryService.getConnectedMountpoints().then(function (res) {
                $scope.activeMountPoints = [pleaseSelect].concat(res);
                $scope.selectedMountPoint = $scope.selectedMountPoint || pleaseSelect;
            });
            $scope.$watch(function () { return ($state.params.nodeId); }, function (newVal, oldVal) {
                $scope.selectedMountPoint = newVal;
            });
            $scope.$watch("selectedMountPoint", function (newVal, oldVal) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!newVal || newVal === pleaseSelect) {
                                $scope.equipments = [];
                                return [2 /*return*/];
                            }
                            if ($scope.activeMountPoints[0] === pleaseSelect) {
                                _a = $scope.activeMountPoints, $scope.activeMountPoints = _a.slice(1);
                            }
                            $scope.loading = true;
                            if ($state.params.nodeId !== newVal) {
                                $state.go('main.mwtnInventory', { nodeId: newVal }, { notify: false });
                            }
                            return [4 /*yield*/, refresh(newVal).catch(function (err) {
                                    $timeout(function () { $scope.equipments = null; });
                                })];
                        case 1:
                            _b.sent();
                            $timeout(function () { $scope.loading = false; });
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        return MwtnInventoryCtrl;
    }());
    mwtnInventory.controller('mwtnInventoryCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'mwtnInventoryService', MwtnInventoryCtrl]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXd0bkludmVudG9yeS5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2FwcC9td3RuSW52ZW50b3J5L213dG5JbnZlbnRvcnkuc2VydmljZS50cyIsInNyYy9hcHAvbXd0bkludmVudG9yeS9tb2RlbHMvZXF1aXBtZW50LnRzIiwic3JjL2FwcC9td3RuSW52ZW50b3J5L2NvbXBvbmVudHMvZXF1aXBtZW50LnRzIiwic3JjL2FwcC9td3RuSW52ZW50b3J5L2NvbXBvbmVudHMvZXF1aXBtZW50R3JvdXAudHMiLCJzcmMvYXBwL213dG5JbnZlbnRvcnkvbXd0bkludmVudG9yeS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUEsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTFEO1FBQUE7UUFJQSxDQUFDO1FBQUQsc0JBQUM7SUFBRCxDQUFDLEFBSkQsSUFJQztJQW1CRDtRQUNFLDBCQUFvQixFQUFnQixFQUFVLFlBQTJCLEVBQVUsYUFBYSxFQUFVLFFBQVE7WUFBbEgsaUJBRUM7WUFGbUIsT0FBRSxHQUFGLEVBQUUsQ0FBYztZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFlO1lBQVUsa0JBQWEsR0FBYixhQUFhLENBQUE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFBO1lBSWxIOzs7OztvSEFLd0c7WUFDaEcsaUJBQVksR0FBRyxVQUFDLFlBQW9CLEVBQUUsYUFBa0IsRUFBRSxTQUFzQjtnQkFBdEIsMEJBQUEsRUFBQSxjQUFzQjtnQkFDdEYsRUFBRSxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsWUFBWSxLQUFLLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FDbEYsU0FBUyxJQUFJLElBQUk7b0JBQ2pCLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMs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QUMsVUFBQSxHQUFHO29DQUM3QixRQUFRLENBQUMsY0FBUSxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNoRCxDQUFDLENBQUMsRUFBQTs7NEJBRkYsU0FFRSxDQUFDOzRCQUNILFFBQVEsQ0FBQyxjQUFRLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7aUJBQzdDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUFoR0QsSUFnR0M7SUFFRCxhQUFhLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnYW5ndWxhckFNRCc7XG5cbmNvbnN0IG13dG5JbnZlbnRvcnkgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLm13dG5JbnZlbnRvcnknKTtcblxuY2xhc3MgRXh0ZW5zaW9uUmVzdWx0IHtcbiAgcHVibGljIGV4dGVuc2lvbjogW1xuICAgIHsgXCJ2YWx1ZS1uYW1lXCI6IHN0cmluZywgXCJ2YWx1ZVwiOiBzdHJpbmcgfVxuICBdXG59XG5cbmludGVyZmFjZSBHZW5lcmljR2V0UmVxdWVzdCB7XG4gIHVybDogc3RyaW5nO1xuICBtZXRob2Q6IFwiR0VUXCI7XG59XG5cbmludGVyZmFjZSBHZW5lcmljUG9zdFJlcXVlc3Q8VD4ge1xuICB1cmw6IHN0cmluZztcbiAgbWV0aG9kOiBcIlBPU1RcIjtcbiAgZGF0YTogVFxufVxuXG5pbnRlcmZhY2UgQ29tbW9uU2VydmljZSB7XG4gIGdlbmVyaWNSZXF1ZXN0PFRSZXN1bHQ+KHJlcXVlc3Q6IEdlbmVyaWNHZXRSZXF1ZXN0KTogbmcuSVByb21pc2U8bmcuSUh0dHBSZXNwb25zZTxUUmVzdWx0Pj47XG4gIGdlbmVyaWNSZXF1ZXN0PFRSZXF1ZXN0LCBUUmVzdWx0PihyZXF1ZXN0OiBHZW5lcmljUG9zdFJlcXVlc3Q8VFJlcXVlc3Q+KTogbmcuSVByb21pc2U8bmcuSUh0dHBSZXNwb25zZTxUUmVzdWx0Pj47XG4gIGdldE1vdW50UG9pbnRzPFRSZXN1bHQ+KCk6IG5nLklQcm9taXNlPFRSZXN1bHQ+O1xufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IG5nLklRU2VydmljZSwgcHJpdmF0ZSAkbXd0bkNvbW1vbnM6IENvbW1vblNlcnZpY2UsIHByaXZhdGUgJG13dG5EYXRhYmFzZSwgcHJpdmF0ZSAkbXd0bkxvZykge1xuXG4gIH1cblxuICAvKiogXG4gICAqIEhlbHBlcmZ1bmN0aW9uIHRvIGRldGVjdCBhbmQgY29udmVydCB0aGUgJ3ZhbHVlLW5hbWUtZ3JvdXAnIC5cbiAgICogQHBhcmFtIHByb3BlcnR5TmFtZSBOYW1lIG9mIHRoZSBvYmplY3QgcHJvcGVydHkuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eVZhbHVlIFZhbHVlIG9mIHRoZSBvYmplY3QgcHJvcGVydHkuXG4gICAqIEBwYXJhbSB2YWx1ZU5hbWUgT3B0aW9uYWw6IFRoZSB2YWx1ZS1uYW1lIHRvIGJlIHVzZWQgaW5zdGFlZCBvZiB0aGUgcHJvcGVydHlOYW1lLlxuICAgKiBAcmV0dXJucyBBIHNpbXBsaWZpZWQgcHJvcGVydHkgdmFsdWUgaWYgdGhpcyBpcyBhICd2YWx1ZS1uYW1lLWdyb3VwJyBvdGhlcndoaXNlIHRoZSBwcm9wZXJ0eVZhbHVlLiAqL1xuICBwcml2YXRlIGNvbnZlcnRWYWx1ZSA9IChwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHJvcGVydHlWYWx1ZTogYW55LCB2YWx1ZU5hbWU6IHN0cmluZyA9ICcnKTogYW55ID0+IHtcbiAgICBpZiAocHJvcGVydHlWYWx1ZSAmJiBwcm9wZXJ0eVZhbHVlIGluc3RhbmNlb2YgQXJyYXkgJiYgcHJvcGVydHlWYWx1ZS5sZW5ndGggPT0gMSAmJiAoXG4gICAgICB2YWx1ZU5hbWUgPT0gbnVsbCB8fFxuICAgICAgcHJvcGVydHlWYWx1ZVswXVtcInZhbHVlLW5hbWVcIl0gPT09IHByb3BlcnR5TmFtZSB8fFxuICAgICAgcHJvcGVydHlWYWx1ZVswXVtcInZhbHVlLW5hbWVcIl0gPT09IHZhbHVlTmFtZSlcbiAgICApIHtcbiAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlWzBdW1widmFsdWVcIl07XG4gICAgfVxuICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICB9XG5cbiAgLyoqIFxuICAgKiAgQ29udmVydHMgYW4gQVBJIG9iamVjdCB0byBhIHNpbXBsaWZpZWQgbG9jYWwgb2JqZWN0LlxuICAgKiAgQHBhcmFtIGFwaVJlc3VsdCBUaGUgQVBJIG9iamVjdCB0byBjb252ZXJ0LlxuICAgKiAgQHBhcmFtIHZhbHVlTmFtZSBPcHRpb25hbDogVGhlIHZhbHVlLW5hbWUgdG8gYmUgdXNlZCBpbnN0YWVkIG9mIHRoZSBwcm9wZXJ0eU5hbWUuXG4gICAqICBAcmV0dXJucyBUaGUgc2ltcGxpZmllZCBsb2NhbCBvYmplY3QuXG4gICovXG4gIHByaXZhdGUgY29udmVydE9iamVjdCA9IChhcGlSZXN1bHQ6IGFueSwgdmFsdWVOYW1lOiBzdHJpbmcgPSAnJyk6IGFueSA9PiB7XG4gICAgaWYgKGFwaVJlc3VsdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gYXBpUmVzdWx0Lm1hcChlbG0gPT4geyByZXR1cm4gdGhpcy5jb252ZXJ0T2JqZWN0KGVsbSwgdmFsdWVOYW1lKTsgfSk7XG4gICAgfSBlbHNlIGlmIChhcGlSZXN1bHQgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcGlSZXN1bHQpO1xuICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jb252ZXJ0VmFsdWUoa2V5LCBhcGlSZXN1bHRba2V5XSwgdmFsdWVOYW1lKTtcbiAgICAgICAgcmVzdWx0W2tleV0gPSAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QgfHwgdmFsdWUgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICA/IHRoaXMuY29udmVydE9iamVjdCh2YWx1ZSlcbiAgICAgICAgICA6IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gYXBpUmVzdWx0O1xuICB9XG5cbiAgLyoqIFJlcXVlc3RzIGFsbCBhY3RpdmUgbW9pbnQgcG9pbnRzICovXG4gIHB1YmxpYyBnZXRDb25uZWN0ZWRNb3VudHBvaW50cygpOiBuZy5JUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiB0aGlzLiRtd3RuQ29tbW9ucy5nZXRNb3VudFBvaW50czx7fT4oKS50aGVuKChtb3VudHBvaW50czoge31bXSkgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhtb3VudHBvaW50cyk7XG4gICAgICByZXR1cm4gPHN0cmluZ1tdPm1vdW50cG9pbnRzLnJlZHVjZSgoYWNjOiBzdHJpbmdbXSwgY3VyLCBpbmQsIGFycikgPT4ge1xuICAgICAgICBpZiAoY3VyWyduZXRjb25mLW5vZGUtdG9wb2xvZ3k6Y29ubmVjdGlvbi1zdGF0dXMnXSA9PT0gJ2Nvbm5lY3RlZCcpIGFjYy5wdXNoKGN1cltcIm5vZGUtaWRcIl0pO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwgW10pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFxuICAgKiBSZXF1ZXN0cyBhbGwgJ3Jvb3QgaWRlbnRpZmllcnMnIGZvciB0aGUgZ2l2ZW4gJ25vZGUgaWQnLlxuICAgKiBAcGFyYW0gbm9kZUlkIFRoZSBpZCBvZiB0aGUgbm9kZSB0byByZXF1ZXN0IHRoZSByb290IGlkZW50aWZpZXJzIGZvci5cbiAgICogQHJldHVybnMgQSBxLlByb21pc2UgY29udGFpbmluZyBhbiBhcnJheSBvZiBhbGwgcm9vdCBpZGVudGlmaWVycyBmb3IgdGhlIHJlcXVlc3RlZCBub2RlIGlkLlxuICAgKiAqL1xuICBwdWJsaWMgZ2V0Um9vdElkZW50aWZpZXJzKG5vZGVJZDogc3RyaW5nKTogbmcuSVByb21pc2U8c3RyaW5nW10+IHtcblxuICAgIGNvbnN0IHJlcXVlc3Q6IEdlbmVyaWNHZXRSZXF1ZXN0ID0ge1xuICAgICAgdXJsOiBgb3BlcmF0aW9uYWwvbmV0d29yay10b3BvbG9neTpuZXR3b3JrLXRvcG9sb2d5L3RvcG9sb2d5L3RvcG9sb2d5LW5ldGNvbmYvbm9kZS8ke25vZGVJZH0veWFuZy1leHQ6bW91bnQvY29yZS1tb2RlbDpuZXR3b3JrLWVsZW1lbnQvZXh0ZW5zaW9uL3RvcC1sZXZlbC1lcXVpcG1lbnRgLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLiRtd3RuQ29tbW9ucy5nZW5lcmljUmVxdWVzdDxFeHRlbnNpb25SZXN1bHQ+KHJlcXVlc3QpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3RhdHVzID09IDIwMCAmJiByZXN1bHQuZGF0YSkge1xuICAgICAgICBjb25zdCB0b3BMZXZlbEVxdWlwbWVudCA9IHRoaXMuY29udmVydE9iamVjdChyZXN1bHQuZGF0YSwgJ3RvcC1sZXZlbC1lcXVpcG1lbnQnKTtcbiAgICAgICAgY29uc3Qgcm9vdElkZW50aWZpZXJzID0gdG9wTGV2ZWxFcXVpcG1lbnQgJiYgdG9wTGV2ZWxFcXVpcG1lbnQuZXh0ZW5zaW9uICYmIHRvcExldmVsRXF1aXBtZW50LmV4dGVuc2lvbi5zcGxpdCgnLCcpO1xuICAgICAgICByZXR1cm4gcm9vdElkZW50aWZpZXJzICYmIHJvb3RJZGVudGlmaWVycy5tYXAoaWRlbnRpZmllciA9PiBpZGVudGlmaWVyICYmIGlkZW50aWZpZXIudHJpbSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sIGVyciA9PiAobnVsbCkpO1xuICB9XG5cbiAgLyoqIFxuICAgKiBSZXF1ZXN0cyB0aGUgZGV0YWlsIGluZm9ybWF0aW9uIGZvciB0aGUgZ2l2ZW4gY29tYmluYXRpb24gb2YgJ25vZGVJZCcgYW5kICdlcXVpcG1lbnRJZGVudGlmaWVyJy5cbiAgICogQHBhcmFtIG5vZGVJZCBUaGUgaWQgb2YgdGhlIHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIGlkZW50aWZpZXIgVGhlIGlkZW50aWZpZXIgdG8gcmVxdWVzdCB0aGUgZGV0YWlscyBmb3IuXG4gICAqIEByZXR1cm5zIEEgcS5Qcm9taXNlIGNvbnRhaW5pbmcgYW4gb2JqZWN0IHdpdGggYWxsIHRoZSBkZXRhaWxzLlxuICAgKiAqL1xuICBwdWJsaWMgZ2V0RXF1aXBtZW50RGV0YWlscyhub2RlSWQ6IHN0cmluZywgaWRlbnRpZmllcjogc3RyaW5nKTogbmcuSVByb21pc2U8e30+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBHZW5lcmljR2V0UmVxdWVzdCA9IHtcbiAgICAgIHVybDogYG9wZXJhdGlvbmFsL25ldHdvcmstdG9wb2xvZ3k6bmV0d29yay10b3BvbG9neS90b3BvbG9neS90b3BvbG9neS1uZXRjb25mL25vZGUvJHtub2RlSWR9L3lhbmctZXh0Om1vdW50L2NvcmUtbW9kZWw6ZXF1aXBtZW50LyR7aWRlbnRpZmllcn1gLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy4kbXd0bkNvbW1vbnMuZ2VuZXJpY1JlcXVlc3Q8RXh0ZW5zaW9uUmVzdWx0PihyZXF1ZXN0KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN0YXR1cyA9PSAyMDAgJiYgcmVzdWx0LmRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydE9iamVjdChyZXN1bHQuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LCBlcnIgPT4gKG51bGwpKTtcbiAgfVxuXG4gIC8qKiBcbiAgICogUmVxdWVzdHMgdGhlIGNvbmRpdGlvbmFsIGluZm9ybWF0aW9uIGZvciB0aGUgZ2l2ZW4gY29tYmluYXRpb24gb2YgJ25vZGVJZCcgYW5kICdlcXVpcG1lbnRJZGVudGlmaWVyJy5cbiAgICogQHBhcmFtIG5vZGVJZCBUaGUgaWQgb2YgdGhlIHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIGlkZW50aWZpZXIgVGhlIGlkZW50aWZpZXIgdG8gcmVxdWVzdCB0aGUgY29uZGl0aW9uYWxzIGZvci5cbiAgICogQHJldHVybnMgQSBxLlByb21pc2UgY29udGFpbmluZyBhbiBvYmplY3Qgd2l0aCBhbGwgdGhlIGNvbmRpdGlvbmFsIGluZm9ybWF0aW9ucy5cbiAgICogKi9cbiAgcHVibGljIGdldEVxdWlwbWVudENvbmRpdGlvbmFscyhub2RlSWQ6IHN0cmluZywgaWRlbnRpZmllcjogc3RyaW5nKTogbmcuSVByb21pc2U8e30+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBHZW5lcmljR2V0UmVxdWVzdCA9IHtcbiAgICAgIHVybDogYG9wZXJhdGlvbmFsL25ldHdvcmstdG9wb2xvZ3k6bmV0d29yay10b3BvbG9neS90b3BvbG9neS90b3BvbG9neS1uZXRjb25mL25vZGUvJHtub2RlSWR9L3lhbmctZXh0Om1vdW50L29uZi1jb3JlLW1vZGVsLWNvbmRpdGlvbmFsLXBhY2thZ2VzOmVxdWlwbWVudC1wYWMvJHtpZGVudGlmaWVyfWAsXG4gICAgICBtZXRob2Q6IFwiR0VUXCJcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLiRtd3RuQ29tbW9ucy5nZW5lcmljUmVxdWVzdDxFeHRlbnNpb25SZXN1bHQ+KHJlcXVlc3QpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3RhdHVzID09IDIwMCAmJiByZXN1bHQuZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0T2JqZWN0KHJlc3VsdC5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sIGVyciA9PiAobnVsbCkpO1xuICB9XG59XG5td3RuSW52ZW50b3J5LnNlcnZpY2UoJ213dG5JbnZlbnRvcnlTZXJ2aWNlJywgW1wiJHFcIiwgXCIkbXd0bkNvbW1vbnNcIiwgXCIkbXd0bkRhdGFiYXNlXCIsIFwiJG13dG5Mb2dcIiwgSW52ZW50b3J5U2VydmljZV0pO1xuIiwiZXhwb3J0IGNsYXNzIEVxdWlwbWVudCB7XG4gIHV1aWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBjaGlsZHJlbjogRXF1aXBtZW50W107XG59IiwiZGVjbGFyZSB2YXIgYW5ndWxhcjogYW5ndWxhci5JQW5ndWxhclN0YXRpYzsgIFxuXG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuLi9tb2RlbHMvZXF1aXBtZW50JztcblxuY29uc3QgbXd0bkludmVudG9yeSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAubXd0bkludmVudG9yeScpO1xuXG5jb25zdCBFcXVpcG1lbnREaXJlY3RpdmUgPSAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICdzcmMvYXBwL213dG5JbnZlbnRvcnkvY29tcG9uZW50cy9lcXVpcG1lbnQuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ213dG5FcXVpcG1lbnRDdHJsJyxcbiAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgc2NvcGU6IHtcbiAgICAgIGVxdWlwbWVudDogXCI9XCJcbiAgICB9XG4gIH1cbn07XG5cbm13dG5JbnZlbnRvcnkuZGlyZWN0aXZlKCdtd3RuRXF1aXBtZW50JywgRXF1aXBtZW50RGlyZWN0aXZlKTtcblxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudENvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlICYgeyBlcXVpcG1lbnQ6IEVxdWlwbWVudCB9KSB7XG4gICBcbiAgfVxuXG4gXG59XG5cbm13dG5JbnZlbnRvcnkuY29udHJvbGxlcignbXd0bkVxdWlwbWVudEN0cmwnLCBbJyRzY29wZScsIEVxdWlwbWVudENvbnRyb2xsZXJdKTtcbiIsImRlY2xhcmUgdmFyIGFuZ3VsYXI6IGFuZ3VsYXIuSUFuZ3VsYXJTdGF0aWM7IFxuXG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuLi9tb2RlbHMvZXF1aXBtZW50JztcblxuY29uc3QgbXd0bkludmVudG9yeSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAubXd0bkludmVudG9yeScpO1xuXG5jb25zdCBFcXVpcG1lbnRHcm91cERpcmVjdGl2ZSA9ICgkY29tcGlsZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FwcC9td3RuSW52ZW50b3J5L2NvbXBvbmVudHMvZXF1aXBtZW50R3JvdXAuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ213dG5FcXVpcG1lbnRHcm91cEN0cmwnLFxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICBzY29wZToge1xuICAgICAgZXF1aXBtZW50czogXCI9XCJcbiAgICB9LFxuICAgIC8vIEhBQ0s6IGZvciBhbmd1bGFyIDEuNC4gY29tcGF0aWJpbGl0eVxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0RWxlbWVudCwgdEF0dHIsIHRyYW5zY2x1ZGUpIHtcbiAgICAgIHZhciBjb250ZW50cyA9IHRFbGVtZW50LmNvbnRlbnRzKCkucmVtb3ZlKCk7XG4gICAgICB2YXIgY29tcGlsZWRDb250ZW50cztcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cikge1xuICAgICAgICBpZiAoIWNvbXBpbGVkQ29udGVudHMpIHtcbiAgICAgICAgICBjb21waWxlZENvbnRlbnRzID0gJGNvbXBpbGUoY29udGVudHMsIHRyYW5zY2x1ZGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGVkQ29udGVudHMoc2NvcGUsIGZ1bmN0aW9uIChjbG9uZSwgc2NvcGUpIHtcbiAgICAgICAgICBpRWxlbWVudC5hcHBlbmQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59O1xuXG5td3RuSW52ZW50b3J5LmRpcmVjdGl2ZSgnbXd0bkVxdWlwbWVudEdyb3VwJywgWyckY29tcGlsZScsIEVxdWlwbWVudEdyb3VwRGlyZWN0aXZlXSk7XG5cbmV4cG9ydCBjbGFzcyBFcXVpcG1lbnRHcm91cENvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlICYgeyBlcXVpcG1lbnRzOiBFcXVpcG1lbnRbXSB9KSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIkVxdWlwbWVudEdyb3VwQ29udHJvbGxlclwiLCAkc2NvcGUuZXF1aXBtZW50cyk7XG4gICAgXG4gIH1cblxufVxuXG5td3RuSW52ZW50b3J5LmNvbnRyb2xsZXIoJ213dG5FcXVpcG1lbnRHcm91cEN0cmwnLCBbJyRzY29wZScsIEVxdWlwbWVudEdyb3VwQ29udHJvbGxlcl0pOyIsImRlY2xhcmUgdmFyIGFuZ3VsYXI6IGFuZ3VsYXIuSUFuZ3VsYXJTdGF0aWM7IFxuXG5pbXBvcnQgeyBJbnZlbnRvcnlTZXJ2aWNlIH0gZnJvbSBcIi4vbXd0bkludmVudG9yeS5zZXJ2aWNlXCI7IFxuaW1wb3J0IFwiLi9td3RuSW52ZW50b3J5LnNlcnZpY2VcIjtcbmltcG9ydCBcIi4vY29tcG9uZW50cy9lcXVpcG1lbnRcIjtcbmltcG9ydCBcIi4vY29tcG9uZW50cy9lcXVpcG1lbnRHcm91cFwiO1xuXG5jb25zdCBtd3RuSW52ZW50b3J5ID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5td3RuSW52ZW50b3J5Jyk7XG5cbmludGVyZmFjZSBJTXd0bkludmVudG9yeVNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcbiAgbWVzc2FnZTogc3RyaW5nLFxuICBlcXVpcG1lbnRzOiB7fVtdO1xuICBsb2FkaW5nOiBib29sZWFuO1xuICBhY3RpdmVNb3VudFBvaW50czogc3RyaW5nW107XG4gIHNlbGVjdGVkTW91bnRQb2ludDogc3RyaW5nO1xufVxuXG5jbGFzcyBNd3RuSW52ZW50b3J5Q3RybCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgJHJvb3RTY29wZSwgcHJpdmF0ZSAkc2NvcGU6IElNd3RuSW52ZW50b3J5U2NvcGUsIHByaXZhdGUgJHN0YXRlLCBwcml2YXRlICR0aW1lb3V0LCBwcml2YXRlIG13dG5JbnZlbnRvcnlTZXJ2aWNlOiBJbnZlbnRvcnlTZXJ2aWNlKSB7XG4gICAgLy8gdG9kbzogY2hhbmdlIHRoaXNcbiAgICAkcm9vdFNjb3BlLnNlY3Rpb25fbG9nbyA9ICdzcmMvYXBwL213dG5JbnZlbnRvcnkvaW1hZ2VzL213dG5JbnZlbnRvcnkucG5nJztcblxuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBcIkVtcHR5XCI7XG4gICAgJHNjb3BlLmVxdWlwbWVudHMgPSBbXTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRNb3VudFBvaW50ID0gbnVsbDtcblxuICAgICRzY29wZS5hY3RpdmVNb3VudFBvaW50cyA9IFtdO1xuXG4gICAgY29uc3QgZ2V0QWxsQ2hpbGRFcXVpcG1lbnRzID0gYXN5bmMgKGVxdWlwbWVudHNSb290SWQ6IHN0cmluZywgZXF1aW1lbnRJZHM6IHN0cmluZ1tdKSA9PiB7XG4gICAgICBpZiAoIWVxdWltZW50SWRzIHx8ICFlcXVpbWVudElkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZXF1aXBtZW50T2JqZWN0cyA9IChhd2FpdCBQcm9taXNlLmFsbChlcXVpbWVudElkcy5tYXAoaWQgPT4ge1xuICAgICAgICByZXR1cm4gbXd0bkludmVudG9yeVNlcnZpY2UuZ2V0RXF1aXBtZW50RGV0YWlscyhlcXVpcG1lbnRzUm9vdElkLCBpZCk7XG4gICAgICB9KSkpLm1hcChlcSA9PiAoZXFbXCJlcXVpcG1lbnRcIl1bMF0pKTtcblxuICAgICAgY29uc3QgZXF1aXBtZW50Q29uZGl0aW9uYWxzID0gKGF3YWl0IFByb21pc2UuYWxsKGVxdWltZW50SWRzLm1hcChpZCA9PiB7XG4gICAgICAgIHJldHVybiBtd3RuSW52ZW50b3J5U2VydmljZS5nZXRFcXVpcG1lbnRDb25kaXRpb25hbHMoZXF1aXBtZW50c1Jvb3RJZCwgaWQpO1xuICAgICAgfSkpKS5tYXAoZXEgPT4gKGVxW1wiZXF1aXBtZW50LXBhY1wiXVswXSkpO1xuICAgICAgXG4gICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKGVxdWlwbWVudE9iamVjdHMubWFwKGVxID0+IHtcbiAgICAgICAgbGV0IGZydU5hbWVzOiBzdHJpbmdbXSA9IChlcVtcImNvbnRhaW5lZC1ob2xkZXJcIl0gfHwgW10pLm1hcChjaCA9PiBjaFtcIm9jY3VweWluZy1mcnVcIl0pLmZpbHRlcihmcnUgPT4gISFmcnUpO1xuICAgICAgICByZXR1cm4gZ2V0QWxsQ2hpbGRFcXVpcG1lbnRzKGVxdWlwbWVudHNSb290SWQsIGZydU5hbWVzKTtcbiAgICAgIH0pKTtcblxuICAgICAgcmV0dXJuIGVxdWlwbWVudE9iamVjdHMucmVkdWNlKChhY2MsIGN1ciwgaW5kLCBhcnIpID0+IHtcbiAgICAgICAgbGV0IGNvbmRpdGlvbmFsID0gZXF1aXBtZW50Q29uZGl0aW9uYWxzW2luZF0gfHwgbnVsbDtcbiAgICAgICAgLy8gZW5zdXJlIEVOVkVSWSBwcm9wZXJ0eSBjYW4gYmUgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgICAgbGV0IG1hbnVmYWN0dXJlZFRoaW5nID0gY3VyWydtYW51ZmFjdHVyZWQtdGhpbmcnXTtcbiAgICAgICAgbGV0IGVxdWlwbWVudFR5cGUgPSBtYW51ZmFjdHVyZWRUaGluZyAmJiBtYW51ZmFjdHVyZWRUaGluZ1snZXF1aXBtZW50LXR5cGUnXTtcbiAgICAgICAgbGV0IG1hbnVmYWN0dXJlclByb3BlcnRpZXMgPSBtYW51ZmFjdHVyZWRUaGluZyAmJiBtYW51ZmFjdHVyZWRUaGluZ1snbWFudWZhY3R1cmVyLXByb3BlcnRpZXMnXTtcbiAgICAgICAgbGV0IGVxdWlwbWVudEluc3RhbmNlID0gbWFudWZhY3R1cmVkVGhpbmcgJiYgbWFudWZhY3R1cmVkVGhpbmdbJ2VxdWlwbWVudC1pbnN0YW5jZSddO1xuXG4gICAgICAgIGxldCBjYXJkID0ge1xuICAgICAgICAgIG5hbWU6IGN1ci5uYW1lLFxuICAgICAgICAgIGxhYmVsOiBjdXIubGFiZWwsXG4gICAgICAgICAgdXVpZDogY3VyLnV1aWQsXG4gICAgICAgICAgbWFudWZhY3R1cmVyOiB7XG4gICAgICAgICAgICB2ZXJzaW9uOiBlcXVpcG1lbnRUeXBlICYmIGVxdWlwbWVudFR5cGVbXCJ2ZXJzaW9uXCJdLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGVxdWlwbWVudFR5cGUgJiYgZXF1aXBtZW50VHlwZVtcImRlc2NyaXB0aW9uXCJdLFxuICAgICAgICAgICAgcGFydFR5cGVJZGVudGlmaWVyOiBlcXVpcG1lbnRUeXBlICYmIGVxdWlwbWVudFR5cGVbXCJwYXJ0LXR5cGUtaWRlbnRpZmllclwiXSxcbiAgICAgICAgICAgIG1vZGVsSWRlbnRpZmllcjogZXF1aXBtZW50VHlwZSAmJiBlcXVpcG1lbnRUeXBlW1wibW9kZWwtaWRlbnRpZmllclwiXSxcbiAgICAgICAgICAgIHBhcnRUeXBlSWRldHlwZU5hbWVudGlmaWVyOiBlcXVpcG1lbnRUeXBlICYmIGVxdWlwbWVudFR5cGVbXCJ0eXBlLW5hbWVcIl0sXG4gICAgICAgICAgICBpZDogbWFudWZhY3R1cmVyUHJvcGVydGllcyAmJiBtYW51ZmFjdHVyZXJQcm9wZXJ0aWVzWydtYW51ZmFjdHVyZXItaWRlbnRpZmllciddLFxuICAgICAgICAgICAgZGF0ZTogZXF1aXBtZW50SW5zdGFuY2UgJiYgZXF1aXBtZW50SW5zdGFuY2VbJ21hbnVmYWN0dXJlLWRhdGUnXSAmJiBEYXRlLnBhcnNlKGVxdWlwbWVudEluc3RhbmNlICYmIGVxdWlwbWVudEluc3RhbmNlWydtYW51ZmFjdHVyZS1kYXRlJ10pLFxuICAgICAgICAgICAgc2VyaWFsOiBlcXVpcG1lbnRJbnN0YW5jZSAmJiBlcXVpcG1lbnRJbnN0YW5jZVsnc2VyaWFsLW51bWJlciddXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25kaXRpb25hbDogY29uZGl0aW9uYWxcbiAgICAgICAgfTtcbiAgICAgICAgKHJlc3VsdHNbaW5kXS5sZW5ndGggPyBjYXJkWydjaGlsZHJlbiddID0gcmVzdWx0c1tpbmRdIDogbnVsbCk7XG4gICAgICAgIGFjYy5wdXNoKGNhcmQpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHBsZWFzZVNlbGVjdCA9IFwiUGxlYXNlIHNlbGVjdCBhIG1vdW50IHBvaW50XCI7XG5cbiAgICBjb25zdCByZWZyZXNoID0gYXN5bmMgKGVxdWlwbWVudHNSb290SWQ6IHN0cmluZykgPT4ge1xuICAgICAgbGV0IHJvb3RJZGVudGlmaWVycyA9IGF3YWl0IG13dG5JbnZlbnRvcnlTZXJ2aWNlLmdldFJvb3RJZGVudGlmaWVycyhlcXVpcG1lbnRzUm9vdElkKTtcbiAgICAgIGxldCBlcXVpcG1lbnRzID0gcm9vdElkZW50aWZpZXJzICYmIGF3YWl0IGdldEFsbENoaWxkRXF1aXBtZW50cyhlcXVpcG1lbnRzUm9vdElkLCByb290SWRlbnRpZmllcnMpO1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkc2NvcGUuZXF1aXBtZW50cyA9IGVxdWlwbWVudHM7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbXd0bkludmVudG9yeVNlcnZpY2UuZ2V0Q29ubmVjdGVkTW91bnRwb2ludHMoKS50aGVuKHJlcyA9PiB7XG4gICAgICAkc2NvcGUuYWN0aXZlTW91bnRQb2ludHMgPSBbcGxlYXNlU2VsZWN0LCAuLi5yZXNdIDtcbiAgICAgICRzY29wZS5zZWxlY3RlZE1vdW50UG9pbnQgPSAkc2NvcGUuc2VsZWN0ZWRNb3VudFBvaW50IHx8IHBsZWFzZVNlbGVjdDtcbiAgICB9KTtcblxuICAgICRzY29wZS4kd2F0Y2goKCkgPT4gKCRzdGF0ZS5wYXJhbXMubm9kZUlkKSwgKG5ld1ZhbDogc3RyaW5nLCBvbGRWYWw6IHN0cmluZykgPT4ge1xuICAgICAgJHNjb3BlLnNlbGVjdGVkTW91bnRQb2ludCA9IG5ld1ZhbDtcbiAgICB9KTtcblxuICAgICRzY29wZS4kd2F0Y2goXCJzZWxlY3RlZE1vdW50UG9pbnRcIiwgYXN5bmMgKG5ld1ZhbDogc3RyaW5nLCBvbGRWYWw6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFuZXdWYWwgfHwgbmV3VmFsID09PSBwbGVhc2VTZWxlY3QpIHtcbiAgICAgICAgJHNjb3BlLmVxdWlwbWVudHMgPSBbXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCRzY29wZS5hY3RpdmVNb3VudFBvaW50c1swXSA9PT0gcGxlYXNlU2VsZWN0KSB7XG4gICAgICAgIFssIC4uLiRzY29wZS5hY3RpdmVNb3VudFBvaW50c10gPSAkc2NvcGUuYWN0aXZlTW91bnRQb2ludHM7XG4gICAgICB9IFxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgaWYgKCRzdGF0ZS5wYXJhbXMubm9kZUlkICE9PSBuZXdWYWwpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdtYWluLm13dG5JbnZlbnRvcnknLCB7IG5vZGVJZDogbmV3VmFsIH0sIHsgbm90aWZ5OiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHJlZnJlc2gobmV3VmFsKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7ICRzY29wZS5lcXVpcG1lbnRzID0gbnVsbDsgfSk7XG4gICAgICB9KTtcbiAgICAgICR0aW1lb3V0KCgpID0+IHsgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTsgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxubXd0bkludmVudG9yeS5jb250cm9sbGVyKCdtd3RuSW52ZW50b3J5Q3RybCcsIFsnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJHN0YXRlJywgJyR0aW1lb3V0JywgJ213dG5JbnZlbnRvcnlTZXJ2aWNlJywgTXd0bkludmVudG9yeUN0cmxdKTtcbiJdfQ==