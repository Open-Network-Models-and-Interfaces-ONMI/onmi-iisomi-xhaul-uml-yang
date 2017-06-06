(function() {
    'use strict';
    var app = angular.module('translate', [
        'pascalprecht.translate'
    ]);

    app.config(function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix : '/modules/languages/lang-',
            suffix : '.json'
        });

        $translateProvider.fallbackLanguage('en_US');
        $translateProvider.preferredLanguage('en_US');
    });

    app.factory('translateService', function($translate) {

        var service = {};

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
    });
})();