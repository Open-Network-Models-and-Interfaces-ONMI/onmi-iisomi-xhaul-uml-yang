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
        alert.id = new Enum('PROCESSING', 'SUCCESS', 'FAILED');
        alert.isWorking = [
            true, false, false
        ];
        alert.type = [
            'warning', 'success', 'danger'
        ];
        alert.message = [
            'CALCULATING', 'CALCULATION_OK', 'CALCULATION_FAILED'
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

        service.failed = function(err) {
            return status(alert.id.FAILED);
        };

        service.clear = function() {
            return {};
        };

        return service;
    });
})();