var htLinkcalculator = angular.module('htLinkcalculator', [
    'ui.bootstrap', 'base64', 'htDatabase', 'ngCookies', 'htLogin', 'alert', 'translate'
]);
htLinkcalculator.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('linkcalculator', {
            // abstract:
            // true,
            url : '/linkcalculator/:dbIndex/:low/:high/:mwrLinkId/:revision/:variant',
            templateUrl : 'modules/linkcalculator/linkcalculator.html',
            controller : [
                          '$rootScope',
                          '$scope',
                          '$filter',
                          '$http',
                          '$stateParams',
                          '$location',
                          '$base64',
                          'databaseService',
                          '$mwrLink',
                          'alertService',
                          '$header',
                          function($rootScope, $scope, $filter, $http, $stateParams, $location, $base64, databaseService, $mwrLink, alertService, $header) {

                              $scope.dbIndex = $stateParams.dbIndex;
                              $scope.siteLinkIdLow = $stateParams.low;
                              $scope.siteLinkIdHigh = $stateParams.high;
                              $scope.mwrLinkId = $stateParams.mwrLinkId;
                              $scope.revision = $stateParams.revision;
                              $scope.variant = $stateParams.variant;
                              
                              $scope.displayId = '(';
                              $scope.displayId += $stateParams.low;
                              $scope.displayId += '-';
                              $scope.displayId += $stateParams.high;
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
                            $scope.possible.configuation = [];
                            $scope.linkDefinition.mwpA.mwChannel.band = 'BAND15';
                            $scope.linkDefinition.mwpA.mwChannel.bandwidth = 'BW28';
                        } else {
                            var radio = $scope.tables.radio.rows[index]._source;
                            $scope.possible.modulationTypes = Object.keys(radio.variants);
                            $scope.possible.configuation = Object.keys(radio.config);
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
                                if (wgName !== $scope.mwrLink.sa.wg.name) {
                                    $scope.linkDefinition.sa.wg.lengthM = wg.maxLength;
                                }
                            } else {
                                if (wgName !== $scope.mwrLink.sb.wg.name) {
                                    $scope.linkDefinition.sb.wg.lengthM = wg.maxLength;
                                }
                            }
                        }
                    };

                    alertService.setMessage([
                        'CALCULATING', 'CALCULATION_OK', 'CALCULATION_FAILED'
                    ]);
                    $scope.tables = databaseService.tables;

                    $scope.ignore = false;

                    $scope.possible = {
                        modulationTypes : [],
                        configuation : [],
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

                    databaseService.getTableData('radio', function(err, data) {
                        if (err) {
                            $header.setStatus(alertService.failed(err));
                        } else {
                            $scope.tables.radio.rows = data.rows;
// $header.setStatus(alertService.success());
                            $scope.resources.radio = true;
                        }
                    });

                    $scope.searchAntennas = {
                        band : 'BAND18'
                    };
                    databaseService.getTableData('antenna', function(err, data) {
                        if (err) {
                            $header.setStatus(alertService.failed(err));
                        } else {
                            $scope.tables.antenna.rows = data.rows;
// $header.setStatus(alertService.success());
                            $scope.resources.antenna = true;
                            // updateAntennas($scope.searchAntennas);
                        }
                    });

                    $scope.searchWG = {
                        band : 'BAND18'
                    };
                    databaseService.getTableData('waveguide', function(err, data) {
                        if (err) {
                            $header.setStatus(alertService.failed(err));
                        } else {
                            $scope.tables.waveguide.rows = data.rows;
// $header.setStatus(alertService.success());
                            $scope.resources.waveguide = true;
                            // updateWG($scope.searchWG);
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
                            "id":{ 
                                "siteLinkId":{"high":"149990519","low":"149990514"},
                                "mwrLinkId":"0",
                                "revision":"0","variant":"0"
                             },
                             "spa":{"antPos":-1,"siteRef":{"siteId":"149990514"}},
                             "spb":{"antPos":-1,"siteRef":{"siteId":"149990519"}},
                             "etoDo":null,
                             "lenKm":12.345,
                             "sa":{
                                 "loc":{"location":{"lon":6.80776,"lat":52.50821},"amslGrd":46,"sourceGeo":"MWR","sourceAmsl":"LOS"},
                                 "ant":{"name":"SBX1-142BB","dia":0.3,"currentAzimuth":343.532074,"currentHightCL":49.2},
                                 "wg":{"name":"E150 (15GHZ)","lengthM":2},
                                 "losses":{"other":0,"attCom":0,"attTx":0,"attRx":0},"pr":"REGION_1"},
                             "sb":{"loc":{"location":{"lon":6.7543,"lat":52.61824},"amslGrd":13,"sourceGeo":"MWR","sourceAmsl":"LOS"},
                                 "ant":{"name":"SBX2-142CB","dia":0.6,"currentAzimuth":163.489609,"currentHightCL":37.15},
                                 "wg":{"name":"E150 (15GHZ)","lengthM":5.5},
                                 "losses":{"other":0,"attCom":0,"attTx":0,"attRx":0},"pr":"REGION_1"},
                            "capacity":{"bwV99":0,"bwRumpf":0,"noE1":0,"noSTM1":0},
                            "modDemand":null,"fieldMargin":null,"obstrLoss":null,"fep":null,
                            "internalType":"DBDO","gu":"GU_EMPTY","toc":{"year":2008,"no":10,"um":"NORMAL"},
                            "parManufacturer":null,
                            "radio":{"name":"SRAL xD HDe/HP 15-7","currentTsl":16,"currentQam":4,"_currentModulation":"MOD_4QAM","_currentConfA":"CONF_1_0_MK","_currentConfB":"CONF_1_0_MK"},
                            "currentTsl":null,"bGhz":"BAND15","channelStr":null,"pol":null,"layA":null,"mwLink":null,"mwParA":null,
                            "NENameAB":"104301247A;Itterbeck;104301246A;B403-Eschebrugge","fileNo":-1,"isObsolete":false,"xLinkReference":null,"siteAId":"149990514","siteBId":"149990519"},
                        "linkDefinition" : {
                            "mWType" : "PDH",
                            "lenKm" : 12.345,
                            "fm" : 2.0,
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
                        // console.log(JSON.stringify(req));
                        $http(req).success(function(data, status) {
                            
                                $scope.result = data;
                                $scope.error = undefined;
                                $header.setStatus(alertService.success());
                                if ($scope.result.output.linkCalculation.avl === 100) {
                                    $scope.result.type = 'warning';
                                } else if ($scope.result.output.linkCalculation.avl > 99.5) {
                                    $scope.result.type = 'success';
                                } else {
                                    $scope.result.type = 'danger';
                                }
                            
                        }).error(function(data, status) {
                            $scope.result = undefined;
                            $scope.error = data.errorMessage;
                            $header.setStatus(alertService.failed(status));
                            $scope.result.type = 'error';
                            // console.log(data);
                        });
                    };

                    var updateMwrLink = function(mwrLink) {

                        //console.log(JSON.stringify(mwrLink));
                        $scope.mwrLink = mwrLink;

                        var info = {
                            band : $scope.mwrLink.bGhz,
                            radio : $scope.mwrLink.radio.name,
                            siteA : {
                                antenna : {
                                    name : $scope.mwrLink.sa.ant.name,
                                    diameter : $scope.mwrLink.sa.ant.dia
                                },
                                waveguide : {
                                    name : $scope.mwrLink.sa.wg.name,
                                    length : $scope.mwrLink.sa.wg.lengthM
                                }
                            },
                            siteB : {
                                antenna : {
                                    name : $scope.mwrLink.sb.ant.name,
                                    diameter : $scope.mwrLink.sb.ant.dia
                                },
                                waveguide : {
                                    name : $scope.mwrLink.sb.wg.name,
                                    length : $scope.mwrLink.sb.wg.lengthM
                                }
                            }
                        };
//                        console.log(JSON.stringify(info));

                        if ($scope.mwrLink.bGhz !== null && $scope.mwrLink.bGhz !== undefined) {
                            $scope.linkDefinition.mwpA.mwChannel.band = $scope.mwrLink.bGhz;
                            $scope.linkDefinition.mwpB.mwChannel.band = $scope.mwrLink.bGhz;

                            $scope.linkDefinition.radio = $scope.mwrLink.radio;
                            $scope.linkDefinition.sa = $scope.mwrLink.sa;
                            $scope.linkDefinition.sb = $scope.mwrLink.sb;

                            $scope.linkDefinition.lenKm = $scope.mwrLink.lenKm;
                        }
                            $scope.mwrLink.exists = (mwrLink.id.mwrLinkId !== "0");
                            $scope.resources.mwrLink = true; // (mwrLink.id.mwrLinkId !== "0");
                    };
                    $scope.$watch('mwrLinkId', function(v) {
                        if (v !== undefined && parseInt(v) !== 0) {
                            $mwrLink.get($scope.dbIndex, id, function(err,mwrLink){
                                updateMwrLink(mwrLink);
                            });
                        } else {
                            $mwrLink.get($scope.dbIndex, id, function(err,mwrLink){
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
                                $scope.linkDefinition.radio.name = result[0]._source.model;
                            }
                        } else {
                            $scope.linkDefinition.radio.name = 'no radio found';
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
                            $scope.linkDefinition.sa.ant.name = 'no antennas found';
                            $scope.linkDefinition.sb.ant.name = 'no antennas found';
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
                                $scope.linkDefinition.sa.wg.name = result[0]._source.model;
                            }
                            // siteB
                            var indexB = result.map(function(radio) {
                                return radio._source.model;
                            }).indexOf($scope.mwrLink.sb.wg.name);
                            if (indexB === -1) {
                                $scope.linkDefinition.sb.wg.name = result[0]._source.model;
                            }
                        } else {
                            $scope.linkDefinition.sa.wg.name = 'no waveguide found';
                            $scope.linkDefinition.sb.wg.name = 'no waveguide found';
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
                            model : v
                        };
                        var result = $filter('filter')($scope.tables.antenna.rows, filter);
                        if (result !== undefined && result.length > 0) {
                            $scope.linkDefinition.sa.ant.diameter = result[0].dia;
                        } else {
                            $scope.linkDefinition.sa.ant.diameter = 0.0;
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

                    // $scope.$watch('linkDefinition.sa.ant.diameter',
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
                            model : v
                        };
                        var result = $filter('filter')($scope.tables.antenna.rows, filter);
                        if (result !== undefined && result.length > 0) {
                            $scope.linkDefinition.sb.ant.diameter = result[0].dia;
                        } else {
                            $scope.linkDefinition.sb.ant.diameter = 0.0;
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
