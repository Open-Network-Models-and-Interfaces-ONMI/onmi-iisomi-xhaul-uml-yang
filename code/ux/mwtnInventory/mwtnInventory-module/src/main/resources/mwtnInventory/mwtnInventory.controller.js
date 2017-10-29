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
                    return rootIdentifiers;
                }
                return null;
            }, function (err) { return (null); });
        };
        InventoryService.prototype.getEquipmentDetails = function (nodeId, identifier) {
            var _this = this;
            var request = {
                url: "operational/network-topology:network-topology/topology/topology-netconf/node/" + nodeId + "/yang-ext:mount/core-model:equipment/" + identifier,
                method: "GET"
            };
            return this.$mwtnCommons.genericRequest(request).then(function (result) {
                if (result && result.status == 200 && result.data) {
                    //console.log(result.data);
                    return _this.convertObject(result.data);
                }
                return null;
            }, function (err) { return (null); });
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
            $rootScope.section_logo = 'src/app/mwtnInventory/images/mwtnInventory.png'; 
            
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$timeout = $timeout;
            this.mwtnInventoryService = mwtnInventoryService;
            $scope.loading = false;
            $scope.message = "Empty";
            $scope.equipments = [];
            $scope.selectedMountPoint = null;
            $scope.activeMountPoints = [];
            var getAllChildEquipments = function (equipmentsRootId, equimentIds) { return __awaiter(_this, void 0, void 0, function () {
                var equipmentObjects, results;
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
                            return [4 /*yield*/, Promise.all(equipmentObjects.map(function (eq) {
                                    var fruNames = (eq["contained-holder"] || []).map(function (ch) { return ch["occupying-fru"]; }).filter(function (fru) { return !!fru; });
                                    return getAllChildEquipments(equipmentsRootId, fruNames);
                                }))];
                        case 2:
                            results = _a.sent();
                            return [2 /*return*/, equipmentObjects.reduce(function (acc, cur, ind, arr) {
                                    // ensure ENVERY property can be null or undefined
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
                                    };
                                    (results[ind].length ? card['children'] = results[ind] : null);
                                    acc.push(card);
                                    return acc;
                                }, [])];
                    }
                });
            }); };
            var pleaseSelect = "Please select a mount point";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXd0bkludmVudG9yeS5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2FwcC9td3RuSW52ZW50b3J5L213dG5JbnZlbnRvcnkuc2VydmljZS50cyIsInNyYy9hcHAvbXd0bkludmVudG9yeS9tb2RlbHMvZXF1aXBtZW50LnRzIiwic3JjL2FwcC9td3RuSW52ZW50b3J5L2NvbXBvbmVudHMvZXF1aXBtZW50LnRzIiwic3JjL2FwcC9td3RuSW52ZW50b3J5L2NvbXBvbmVudHMvZXF1aXBtZW50R3JvdXAudHMiLCJzcmMvYXBwL213dG5JbnZlbnRvcnkvbXd0bkludmVudG9yeS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUEsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTFEO1FBQUE7UUFJQSxDQUFDO1FBQUQsc0JBQUM7SUFBRCxDQUFDLEFBSkQsSUFJQztJQW1CRDtRQUNFLDBCQUFvQixFQUFnQixFQUFVLFlBQTJCLEVBQVUsYUFBYSxFQUFVLFFBQVE7WUFBbEgsaUJBRUM7WUFGbUIsT0FBRSxHQUFGLEVBQUUsQ0FBYztZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFlO1lBQVUsa0JBQWEsR0FBYixhQUFhLENBQUE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFBO1lBSWxIOzs7OztvSEFLd0c7WUFDaEcsaUJBQVksR0FBRyxVQUFDLFlBQW9CLEVBQUUsYUFBa0IsRUFBRSxTQUFzQjtnQkFBdEIsMEJBQUEsRUFBQSxjQUFzQjtnQkFDdEYsRUFBRSxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsWUFBWSxLQUFLLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FDbEYsU0FBUyxJQUFJLElBQUk7b0JBQ2pCLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMs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QUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7aUJBQzdDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUF2RkQsSUF1RkM7SUFFRCxhQUFhLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICdhbmd1bGFyQU1EJztcblxuY29uc3QgbXd0bkludmVudG9yeSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAubXd0bkludmVudG9yeScpO1xuXG5jbGFzcyBFeHRlbnNpb25SZXN1bHQge1xuICBwdWJsaWMgZXh0ZW5zaW9uOiBbXG4gICAgeyBcInZhbHVlLW5hbWVcIjogc3RyaW5nLCBcInZhbHVlXCI6IHN0cmluZyB9XG4gIF1cbn1cblxuaW50ZXJmYWNlIEdlbmVyaWNHZXRSZXF1ZXN0IHtcbiAgdXJsOiBzdHJpbmc7XG4gIG1ldGhvZDogXCJHRVRcIjtcbn0gXG5cbmludGVyZmFjZSBHZW5lcmljUG9zdFJlcXVlc3Q8VD4ge1xuICB1cmw6IHN0cmluZztcbiAgbWV0aG9kOiBcIlBPU1RcIjtcbiAgZGF0YTogVFxufSBcblxuaW50ZXJmYWNlIENvbW1vblNlcnZpY2Uge1xuICBnZW5lcmljUmVxdWVzdDxUUmVzdWx0PihyZXF1ZXN0OiBHZW5lcmljR2V0UmVxdWVzdCApOiBuZy5JUHJvbWlzZTxuZy5JSHR0cFJlc3BvbnNlPFRSZXN1bHQ+PjsgIFxuICBnZW5lcmljUmVxdWVzdDxUUmVxdWVzdCxUUmVzdWx0PihyZXF1ZXN0OiAgR2VuZXJpY1Bvc3RSZXF1ZXN0PFRSZXF1ZXN0Pik6IG5nLklQcm9taXNlPG5nLklIdHRwUmVzcG9uc2U8VFJlc3VsdD4+O1xuICBnZXRNb3VudFBvaW50czxUUmVzdWx0PigpOiBuZy5JUHJvbWlzZTxUUmVzdWx0Pjtcbn0gXG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlLCBwcml2YXRlICRtd3RuQ29tbW9uczogQ29tbW9uU2VydmljZSwgcHJpdmF0ZSAkbXd0bkRhdGFiYXNlLCBwcml2YXRlICRtd3RuTG9nKSB7XG5cbiAgfVxuXG4gIC8qKiBcbiAgICogSGVscGVyZnVuY3Rpb24gdG8gZGV0ZWN0IGFuZCBjb252ZXJ0IHRoZSAndmFsdWUtbmFtZS1ncm91cCcgLlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIE5hbWUgb2YgdGhlIG9iamVjdCBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHByb3BlcnR5VmFsdWUgVmFsdWUgb2YgdGhlIG9iamVjdCBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHZhbHVlTmFtZSBPcHRpb25hbDogVGhlIHZhbHVlLW5hbWUgdG8gYmUgdXNlZCBpbnN0YWVkIG9mIHRoZSBwcm9wZXJ0eU5hbWUuXG4gICAqIEByZXR1cm5zIEEgc2ltcGxpZmllZCBwcm9wZXJ0eSB2YWx1ZSBpZiB0aGlzIGlzIGEgJ3ZhbHVlLW5hbWUtZ3JvdXAnIG90aGVyd2hpc2UgdGhlIHByb3BlcnR5VmFsdWUuICovXG4gIHByaXZhdGUgY29udmVydFZhbHVlID0gKHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eVZhbHVlOiBhbnksIHZhbHVlTmFtZTogc3RyaW5nID0gJycpOiBhbnkgPT4ge1xuICAgIGlmIChwcm9wZXJ0eVZhbHVlICYmIHByb3BlcnR5VmFsdWUgaW5zdGFuY2VvZiBBcnJheSAmJiBwcm9wZXJ0eVZhbHVlLmxlbmd0aCA9PSAxICYmIChcbiAgICAgIHZhbHVlTmFtZSA9PSBudWxsIHx8XG4gICAgICBwcm9wZXJ0eVZhbHVlWzBdW1widmFsdWUtbmFtZVwiXSA9PT0gcHJvcGVydHlOYW1lIHx8XG4gICAgICBwcm9wZXJ0eVZhbHVlWzBdW1widmFsdWUtbmFtZVwiXSA9PT0gdmFsdWVOYW1lKVxuICAgICkge1xuICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWVbMF1bXCJ2YWx1ZVwiXTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gIH1cblxuICAvKiogXG4gICAqICBDb252ZXJ0cyBhbiBBUEkgb2JqZWN0IHRvIGEgc2ltcGxpZmllZCBsb2NhbCBvYmplY3QuXG4gICAqICBAcGFyYW0gYXBpUmVzdWx0IFRoZSBBUEkgb2JqZWN0IHRvIGNvbnZlcnQuXG4gICAqICBAcGFyYW0gdmFsdWVOYW1lIE9wdGlvbmFsOiBUaGUgdmFsdWUtbmFtZSB0byBiZSB1c2VkIGluc3RhZWQgb2YgdGhlIHByb3BlcnR5TmFtZS5cbiAgICogIEByZXR1cm5zIFRoZSBzaW1wbGlmaWVkIGxvY2FsIG9iamVjdC5cbiAgKi9cbiAgcHJpdmF0ZSBjb252ZXJ0T2JqZWN0ID0gKGFwaVJlc3VsdDogYW55LCB2YWx1ZU5hbWU6IHN0cmluZyA9ICcnKTogYW55ID0+IHtcbiAgICBpZiAoYXBpUmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiBhcGlSZXN1bHQubWFwKGVsbSA9PiB7IHJldHVybiB0aGlzLmNvbnZlcnRPYmplY3QoZWxtLCB2YWx1ZU5hbWUpOyB9KTtcbiAgICB9IGVsc2UgaWYgKGFwaVJlc3VsdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFwaVJlc3VsdCk7XG4gICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmNvbnZlcnRWYWx1ZShrZXksIGFwaVJlc3VsdFtrZXldLCB2YWx1ZU5hbWUpO1xuICAgICAgICByZXN1bHRba2V5XSA9ICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCB8fCB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0T2JqZWN0KHZhbHVlKVxuICAgICAgICAgIDogdmFsdWU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiBhcGlSZXN1bHQ7XG4gIH1cblxuICAvKiogUmVxdWVzdHMgYWxsIGFjdGl2ZSBtb2ludCBwb2ludHMgKi9cbiAgcHVibGljIGdldENvbm5lY3RlZE1vdW50cG9pbnRzKCk6IG5nLklQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuJG13dG5Db21tb25zLmdldE1vdW50UG9pbnRzPHt9PigpLnRoZW4oKG1vdW50cG9pbnRzOiB7fVtdKSA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKG1vdW50cG9pbnRzKTtcbiAgICAgIHJldHVybiA8c3RyaW5nW10+bW91bnRwb2ludHMucmVkdWNlKChhY2M6IHN0cmluZ1tdLCBjdXIsIGluZCwgYXJyKSA9PiB7XG4gICAgICAgIGlmIChjdXJbJ25ldGNvbmYtbm9kZS10b3BvbG9neTpjb25uZWN0aW9uLXN0YXR1cyddID09PSAnY29ubmVjdGVkJykgYWNjLnB1c2goY3VyW1wibm9kZS1pZFwiXSk7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCBbXSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogXG4gICAqIFJlcXVlc3RzIGFsbCAncm9vdCBpZGVudGlmaWVycycgZm9yIHRoZSBnaXZlbiAnbm9kZSBpZCcuXG4gICAqIEBwYXJhbSBub2RlSWQgVGhlIGlkIG9mIHRoZSBub2RlIHRvIHJlcXVlc3QgdGhlIHJvb3QgaWRlbnRpZmllcnMgZm9yLlxuICAgKiBAcmV0dXJucyBBIHEuUHJvbWlzZSBjb250YWluaW5nIGFuIGFycmF5IG9mIGFsbCByb290IGlkZW50aWZpZXJzIGZvciB0aGUgcmVxdWVzdGVkIG5vZGUgaWQuXG4gICAqICovXG4gIHB1YmxpYyBnZXRSb290SWRlbnRpZmllcnMobm9kZUlkOiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxzdHJpbmdbXT4ge1xuXG4gICAgY29uc3QgcmVxdWVzdDogR2VuZXJpY0dldFJlcXVlc3QgPSB7XG4gICAgICB1cmw6IGBvcGVyYXRpb25hbC9uZXR3b3JrLXRvcG9sb2d5Om5ldHdvcmstdG9wb2xvZ3kvdG9wb2xvZ3kvdG9wb2xvZ3ktbmV0Y29uZi9ub2RlLyR7bm9kZUlkfS95YW5nLWV4dDptb3VudC9jb3JlLW1vZGVsOm5ldHdvcmstZWxlbWVudC9leHRlbnNpb24vdG9wLWxldmVsLWVxdWlwbWVudGAsXG4gICAgICBtZXRob2Q6IFwiR0VUXCJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuJG13dG5Db21tb25zLmdlbmVyaWNSZXF1ZXN0PEV4dGVuc2lvblJlc3VsdD4ocmVxdWVzdCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdGF0dXMgPT0gMjAwICYmIHJlc3VsdC5kYXRhKSB7XG4gICAgICAgIGNvbnN0IHRvcExldmVsRXF1aXBtZW50ID0gdGhpcy5jb252ZXJ0T2JqZWN0KHJlc3VsdC5kYXRhLCAndG9wLWxldmVsLWVxdWlwbWVudCcpO1xuICAgICAgICBjb25zdCByb290SWRlbnRpZmllcnMgPSB0b3BMZXZlbEVxdWlwbWVudCAmJiB0b3BMZXZlbEVxdWlwbWVudC5leHRlbnNpb24gJiYgdG9wTGV2ZWxFcXVpcG1lbnQuZXh0ZW5zaW9uLnNwbGl0KCcsJyk7XG4gICAgICAgIHJldHVybiByb290SWRlbnRpZmllcnM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LCBlcnIgPT4gKG51bGwpKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRFcXVpcG1lbnREZXRhaWxzKG5vZGVJZDogc3RyaW5nLCBpZGVudGlmaWVyOiBzdHJpbmcpOiBuZy5JUHJvbWlzZTx7fT4ge1xuICAgIGNvbnN0IHJlcXVlc3Q6IEdlbmVyaWNHZXRSZXF1ZXN0ID0ge1xuICAgICAgdXJsOiBgb3BlcmF0aW9uYWwvbmV0d29yay10b3BvbG9neTpuZXR3b3JrLXRvcG9sb2d5L3RvcG9sb2d5L3RvcG9sb2d5LW5ldGNvbmYvbm9kZS8ke25vZGVJZH0veWFuZy1leHQ6bW91bnQvY29yZS1tb2RlbDplcXVpcG1lbnQvJHtpZGVudGlmaWVyfWAsXG4gICAgICBtZXRob2Q6IFwiR0VUXCJcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLiRtd3RuQ29tbW9ucy5nZW5lcmljUmVxdWVzdDxFeHRlbnNpb25SZXN1bHQ+KHJlcXVlc3QpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3RhdHVzID09IDIwMCAmJiByZXN1bHQuZGF0YSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydE9iamVjdChyZXN1bHQuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LCBlcnIgPT4gKG51bGwpKTtcbiAgfVxufVxuXG5td3RuSW52ZW50b3J5LnNlcnZpY2UoJ213dG5JbnZlbnRvcnlTZXJ2aWNlJywgW1wiJHFcIiwgXCIkbXd0bkNvbW1vbnNcIiwgXCIkbXd0bkRhdGFiYXNlXCIsIFwiJG13dG5Mb2dcIiwgIEludmVudG9yeVNlcnZpY2UgXSk7IiwiZXhwb3J0IGNsYXNzIEVxdWlwbWVudCB7XG4gIHV1aWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBjaGlsZHJlbjogRXF1aXBtZW50W107XG59IiwiZGVjbGFyZSB2YXIgYW5ndWxhcjogYW5ndWxhci5JQW5ndWxhclN0YXRpYzsgIFxuXG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuLi9tb2RlbHMvZXF1aXBtZW50JztcblxuY29uc3QgbXd0bkludmVudG9yeSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAubXd0bkludmVudG9yeScpO1xuXG5jb25zdCBFcXVpcG1lbnREaXJlY3RpdmUgPSAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICdzcmMvYXBwL213dG5JbnZlbnRvcnkvY29tcG9uZW50cy9lcXVpcG1lbnQuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ213dG5FcXVpcG1lbnRDdHJsJyxcbiAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgc2NvcGU6IHtcbiAgICAgIGVxdWlwbWVudDogXCI9XCJcbiAgICB9XG4gIH1cbn07XG5cbm13dG5JbnZlbnRvcnkuZGlyZWN0aXZlKCdtd3RuRXF1aXBtZW50JywgRXF1aXBtZW50RGlyZWN0aXZlKTtcblxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudENvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlICYgeyBlcXVpcG1lbnQ6IEVxdWlwbWVudCB9KSB7XG4gICBcbiAgfVxuXG4gXG59XG5cbm13dG5JbnZlbnRvcnkuY29udHJvbGxlcignbXd0bkVxdWlwbWVudEN0cmwnLCBbJyRzY29wZScsIEVxdWlwbWVudENvbnRyb2xsZXJdKTtcbiIsImRlY2xhcmUgdmFyIGFuZ3VsYXI6IGFuZ3VsYXIuSUFuZ3VsYXJTdGF0aWM7IFxuXG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuLi9tb2RlbHMvZXF1aXBtZW50JztcblxuY29uc3QgbXd0bkludmVudG9yeSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAubXd0bkludmVudG9yeScpO1xuXG5jb25zdCBFcXVpcG1lbnRHcm91cERpcmVjdGl2ZSA9ICgkY29tcGlsZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FwcC9td3RuSW52ZW50b3J5L2NvbXBvbmVudHMvZXF1aXBtZW50R3JvdXAuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ213dG5FcXVpcG1lbnRHcm91cEN0cmwnLFxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICBzY29wZToge1xuICAgICAgZXF1aXBtZW50czogXCI9XCJcbiAgICB9LFxuICAgIC8vIEhBQ0s6IGZvciBhbmd1bGFyIDEuNC4gY29tcGF0aWJpbGl0eVxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0RWxlbWVudCwgdEF0dHIsIHRyYW5zY2x1ZGUpIHtcbiAgICAgIHZhciBjb250ZW50cyA9IHRFbGVtZW50LmNvbnRlbnRzKCkucmVtb3ZlKCk7XG4gICAgICB2YXIgY29tcGlsZWRDb250ZW50cztcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cikge1xuICAgICAgICBpZiAoIWNvbXBpbGVkQ29udGVudHMpIHtcbiAgICAgICAgICBjb21waWxlZENvbnRlbnRzID0gJGNvbXBpbGUoY29udGVudHMsIHRyYW5zY2x1ZGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGVkQ29udGVudHMoc2NvcGUsIGZ1bmN0aW9uIChjbG9uZSwgc2NvcGUpIHtcbiAgICAgICAgICBpRWxlbWVudC5hcHBlbmQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59O1xuXG5td3RuSW52ZW50b3J5LmRpcmVjdGl2ZSgnbXd0bkVxdWlwbWVudEdyb3VwJywgWyckY29tcGlsZScsIEVxdWlwbWVudEdyb3VwRGlyZWN0aXZlXSk7XG5cbmV4cG9ydCBjbGFzcyBFcXVpcG1lbnRHcm91cENvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlICYgeyBlcXVpcG1lbnRzOiBFcXVpcG1lbnRbXSB9KSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIkVxdWlwbWVudEdyb3VwQ29udHJvbGxlclwiLCAkc2NvcGUuZXF1aXBtZW50cyk7XG4gICAgXG4gIH1cblxufVxuXG5td3RuSW52ZW50b3J5LmNvbnRyb2xsZXIoJ213dG5FcXVpcG1lbnRHcm91cEN0cmwnLCBbJyRzY29wZScsIEVxdWlwbWVudEdyb3VwQ29udHJvbGxlcl0pOyIsImRlY2xhcmUgdmFyIGFuZ3VsYXI6IGFuZ3VsYXIuSUFuZ3VsYXJTdGF0aWM7IFxuXG5pbXBvcnQgeyBJbnZlbnRvcnlTZXJ2aWNlIH0gZnJvbSBcIi4vbXd0bkludmVudG9yeS5zZXJ2aWNlXCI7IFxuaW1wb3J0IFwiLi9td3RuSW52ZW50b3J5LnNlcnZpY2VcIjtcbmltcG9ydCBcIi4vY29tcG9uZW50cy9lcXVpcG1lbnRcIjtcbmltcG9ydCBcIi4vY29tcG9uZW50cy9lcXVpcG1lbnRHcm91cFwiO1xuXG5jb25zdCBtd3RuSW52ZW50b3J5ID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5td3RuSW52ZW50b3J5Jyk7XG5cbmludGVyZmFjZSBJTXd0bkludmVudG9yeVNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcbiAgbWVzc2FnZTogc3RyaW5nLFxuICBlcXVpcG1lbnRzOiB7fVtdO1xuICBsb2FkaW5nOiBib29sZWFuO1xuICBhY3RpdmVNb3VudFBvaW50czogc3RyaW5nW107XG4gIHNlbGVjdGVkTW91bnRQb2ludDogc3RyaW5nO1xufVxuXG5jbGFzcyBNd3RuSW52ZW50b3J5Q3RybCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgJHNjb3BlOiBJTXd0bkludmVudG9yeVNjb3BlLCBwcml2YXRlICRzdGF0ZSwgcHJpdmF0ZSAkdGltZW91dCwgcHJpdmF0ZSBtd3RuSW52ZW50b3J5U2VydmljZTogSW52ZW50b3J5U2VydmljZSkge1xuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBcIkVtcHR5XCI7XG4gICAgJHNjb3BlLmVxdWlwbWVudHMgPSBbXTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRNb3VudFBvaW50ID0gbnVsbDtcblxuICAgICRzY29wZS5hY3RpdmVNb3VudFBvaW50cyA9IFtdO1xuXG4gICAgY29uc3QgZ2V0QWxsQ2hpbGRFcXVpcG1lbnRzID0gYXN5bmMgKGVxdWlwbWVudHNSb290SWQ6IHN0cmluZywgZXF1aW1lbnRJZHM6IHN0cmluZ1tdKSA9PiB7XG4gICAgICBpZiAoIWVxdWltZW50SWRzIHx8ICFlcXVpbWVudElkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZXF1aXBtZW50T2JqZWN0cyA9IChhd2FpdCBQcm9taXNlLmFsbChlcXVpbWVudElkcy5tYXAoaWQgPT4ge1xuICAgICAgICByZXR1cm4gbXd0bkludmVudG9yeVNlcnZpY2UuZ2V0RXF1aXBtZW50RGV0YWlscyhlcXVpcG1lbnRzUm9vdElkLCBpZCk7XG4gICAgICB9KSkpLm1hcChlcSA9PiAoZXFbXCJlcXVpcG1lbnRcIl1bMF0pKTtcbiAgICAgIGxldCByZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoZXF1aXBtZW50T2JqZWN0cy5tYXAoZXEgPT4ge1xuICAgICAgICBsZXQgZnJ1TmFtZXM6IHN0cmluZ1tdID0gKGVxW1wiY29udGFpbmVkLWhvbGRlclwiXSB8fCBbXSkubWFwKGNoID0+IGNoW1wib2NjdXB5aW5nLWZydVwiXSkuZmlsdGVyKGZydSA9PiAhIWZydSk7XG4gICAgICAgIHJldHVybiBnZXRBbGxDaGlsZEVxdWlwbWVudHMoZXF1aXBtZW50c1Jvb3RJZCwgZnJ1TmFtZXMpO1xuICAgICAgfSkpO1xuXG4gICAgICByZXR1cm4gZXF1aXBtZW50T2JqZWN0cy5yZWR1Y2UoKGFjYywgY3VyLCBpbmQsIGFycikgPT4ge1xuICAgICAgICAvLyBlbnN1cmUgRU5WRVJZIHByb3BlcnR5IGNhbiBiZSBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICBsZXQgbWFudWZhY3R1cmVkVGhpbmcgPSBjdXJbJ21hbnVmYWN0dXJlZC10aGluZyddO1xuICAgICAgICBsZXQgZXF1aXBtZW50VHlwZSA9IG1hbnVmYWN0dXJlZFRoaW5nICYmIG1hbnVmYWN0dXJlZFRoaW5nWydlcXVpcG1lbnQtdHlwZSddO1xuICAgICAgICBsZXQgbWFudWZhY3R1cmVyUHJvcGVydGllcyA9IG1hbnVmYWN0dXJlZFRoaW5nICYmIG1hbnVmYWN0dXJlZFRoaW5nWydtYW51ZmFjdHVyZXItcHJvcGVydGllcyddO1xuICAgICAgICBsZXQgZXF1aXBtZW50SW5zdGFuY2UgPSBtYW51ZmFjdHVyZWRUaGluZyAmJiBtYW51ZmFjdHVyZWRUaGluZ1snZXF1aXBtZW50LWluc3RhbmNlJ107XG5cbiAgICAgICAgbGV0IGNhcmQgPSB7XG4gICAgICAgICAgbmFtZTogY3VyLm5hbWUsXG4gICAgICAgICAgbGFiZWw6IGN1ci5sYWJlbCxcbiAgICAgICAgICB1dWlkOiBjdXIudXVpZCxcbiAgICAgICAgICBtYW51ZmFjdHVyZXI6IHtcbiAgICAgICAgICAgIHZlcnNpb246IGVxdWlwbWVudFR5cGUgJiYgZXF1aXBtZW50VHlwZVtcInZlcnNpb25cIl0sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZXF1aXBtZW50VHlwZSAmJiBlcXVpcG1lbnRUeXBlW1wiZGVzY3JpcHRpb25cIl0sXG4gICAgICAgICAgICBwYXJ0VHlwZUlkZW50aWZpZXI6IGVxdWlwbWVudFR5cGUgJiYgZXF1aXBtZW50VHlwZVtcInBhcnQtdHlwZS1pZGVudGlmaWVyXCJdLFxuICAgICAgICAgICAgbW9kZWxJZGVudGlmaWVyOiBlcXVpcG1lbnRUeXBlICYmIGVxdWlwbWVudFR5cGVbXCJtb2RlbC1pZGVudGlmaWVyXCJdLFxuICAgICAgICAgICAgcGFydFR5cGVJZGV0eXBlTmFtZW50aWZpZXI6IGVxdWlwbWVudFR5cGUgJiYgZXF1aXBtZW50VHlwZVtcInR5cGUtbmFtZVwiXSxcbiAgICAgICAgICAgIGlkOiBtYW51ZmFjdHVyZXJQcm9wZXJ0aWVzICYmIG1hbnVmYWN0dXJlclByb3BlcnRpZXNbJ21hbnVmYWN0dXJlci1pZGVudGlmaWVyJ10sXG4gICAgICAgICAgICBkYXRlOiBlcXVpcG1lbnRJbnN0YW5jZSAmJiBlcXVpcG1lbnRJbnN0YW5jZVsnbWFudWZhY3R1cmUtZGF0ZSddICYmIERhdGUucGFyc2UoZXF1aXBtZW50SW5zdGFuY2UgJiYgZXF1aXBtZW50SW5zdGFuY2VbJ21hbnVmYWN0dXJlLWRhdGUnXSksXG4gICAgICAgICAgICBzZXJpYWw6IGVxdWlwbWVudEluc3RhbmNlICYmIGVxdWlwbWVudEluc3RhbmNlWydzZXJpYWwtbnVtYmVyJ11cbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIG1hbnVmYWN0dXJlZFRoaW5nOiBjdXJbJ21hbnVmYWN0dXJlZC10aGluZyddXG4gICAgICAgIH07XG4gICAgICAgIChyZXN1bHRzW2luZF0ubGVuZ3RoID8gY2FyZFsnY2hpbGRyZW4nXSA9IHJlc3VsdHNbaW5kXSA6IG51bGwpO1xuICAgICAgICBhY2MucHVzaChjYXJkKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIFtdKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbGVhc2VTZWxlY3QgPSBcIlBsZWFzZSBzZWxlY3QgYSBtb3VudCBwb2ludFwiO1xuXG4gICAgY29uc3QgcmVmcmVzaCA9IGFzeW5jIChlcXVpcG1lbnRzUm9vdElkOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCByb290SWRlbnRpZmllcnMgPSBhd2FpdCBtd3RuSW52ZW50b3J5U2VydmljZS5nZXRSb290SWRlbnRpZmllcnMoZXF1aXBtZW50c1Jvb3RJZCk7XG4gICAgICBsZXQgZXF1aXBtZW50cyA9IHJvb3RJZGVudGlmaWVycyAmJiBhd2FpdCBnZXRBbGxDaGlsZEVxdWlwbWVudHMoZXF1aXBtZW50c1Jvb3RJZCwgcm9vdElkZW50aWZpZXJzKTtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgJHNjb3BlLmVxdWlwbWVudHMgPSBlcXVpcG1lbnRzO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG13dG5JbnZlbnRvcnlTZXJ2aWNlLmdldENvbm5lY3RlZE1vdW50cG9pbnRzKCkudGhlbihyZXMgPT4ge1xuICAgICAgJHNjb3BlLmFjdGl2ZU1vdW50UG9pbnRzID0gW3BsZWFzZVNlbGVjdCwgLi4ucmVzXSA7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRNb3VudFBvaW50ID0gJHNjb3BlLnNlbGVjdGVkTW91bnRQb2ludCB8fCBwbGVhc2VTZWxlY3Q7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJHdhdGNoKCgpID0+ICgkc3RhdGUucGFyYW1zLm5vZGVJZCksIChuZXdWYWw6IHN0cmluZywgb2xkVmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICRzY29wZS5zZWxlY3RlZE1vdW50UG9pbnQgPSBuZXdWYWw7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJHdhdGNoKFwic2VsZWN0ZWRNb3VudFBvaW50XCIsIGFzeW5jIChuZXdWYWw6IHN0cmluZywgb2xkVmFsOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghbmV3VmFsIHx8IG5ld1ZhbCA9PT0gcGxlYXNlU2VsZWN0KSB7XG4gICAgICAgICRzY29wZS5lcXVpcG1lbnRzID0gW107XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICgkc2NvcGUuYWN0aXZlTW91bnRQb2ludHNbMF0gPT09IHBsZWFzZVNlbGVjdCkge1xuICAgICAgICBbLCAuLi4kc2NvcGUuYWN0aXZlTW91bnRQb2ludHNdID0gJHNjb3BlLmFjdGl2ZU1vdW50UG9pbnRzO1xuICAgICAgfSBcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIGlmICgkc3RhdGUucGFyYW1zLm5vZGVJZCAhPT0gbmV3VmFsKSB7XG4gICAgICAgICRzdGF0ZS5nbygnbWFpbi5td3RuSW52ZW50b3J5JywgeyBub2RlSWQ6IG5ld1ZhbCB9LCB7IG5vdGlmeTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCByZWZyZXNoKG5ld1ZhbCkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4geyAkc2NvcGUuZXF1aXBtZW50cyA9IG51bGw7IH0pO1xuICAgICAgfSk7XG4gICAgICAkdGltZW91dCgoKSA9PiB7ICRzY29wZS5sb2FkaW5nID0gZmFsc2U7IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbm13dG5JbnZlbnRvcnkuY29udHJvbGxlcignbXd0bkludmVudG9yeUN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJHRpbWVvdXQnLCAnbXd0bkludmVudG9yeVNlcnZpY2UnLCBNd3RuSW52ZW50b3J5Q3RybF0pO1xuXG4iXX0=