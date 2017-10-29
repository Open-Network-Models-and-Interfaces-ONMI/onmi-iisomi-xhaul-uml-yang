var app = angular.module('htDatabase', [
    'datatables', 'ui.bootstrap', 'base64', 'alert', 'translate'
]);

app.controller('htDatabaseCtrl', function($scope, databaseService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder,
                alertService, translateService) {
    'use strict';

    alertService.setMessage([
        'LOADING', 'SUCCESS', 'FAILED'
    ]);
    $scope.changeLanguage = translateService.changeLanguage;
    
    var dataTables = {};
    $scope.tables = databaseService.tables;
    $scope.resourceType = 'Radios';

    $scope.seraching = function(table, index, value) {
        var dt = dataTables[table].DataTable;
        dt.column(index).search(value).draw();
    };
    $scope.$on('event:dataTableLoaded', function(event, loadedDT) {
        dataTables[loadedDT.id] = loadedDT;
    });

    $scope.dtOptions =
                    DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10).withOption('language', translateService.en_US)
                                    .withBootstrap().withBootstrapOptions({
                                        TableTools : {
                                            classes : {
                                                container : 'btn-group',
                                                buttons : {
                                                    normal : 'btn btn-default'
                                                }
                                            }
                                        },
                                        ColVis : {
                                            classes : {
                                                masterButton : 'btn btn-default'
                                            }
                                        }
                                    });

    $scope.tables.Radios.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(9).notVisible()
    ];

    $scope.$watch('resourceType', function(v) {
        if (v !== undefined && v !== 0) {
            $scope.tables[v].show = false;
            $scope.status = alertService.processing();
            databaseService.getTableData(v, function(err, data){
                if (err) {
                    $scope.result = undefined;
                    $scope.error = data;
                    $scope.status = alertService.failed(status);
                } else {
                    $scope.tables[v] = data;
                    $scope.error = undefined;
                    $scope.status = alertService.success();
                    $scope.tables[v].show = true;
                }
            });
        }
    });
});
