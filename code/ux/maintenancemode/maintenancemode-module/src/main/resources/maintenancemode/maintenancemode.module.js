/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD',
    'app/routingConfig',
    'app/core/core.services',
    'common/config/env.module',
    'app/mwtnCommons/mwtnCommons.module'], function (ng) {
        var maintenancemodeApp = angular.module('app.maintenancemode', ['ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit',
            'ui.bootstrap', 'app.core',
            'ui.router.state', 'config', 'ui.grid.exporter',
            'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
            'ui.grid.resizeColumns', 'angular-clipboard']);

        maintenancemodeApp.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {

            maintenancemodeApp.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                factory: $provide.factory,
                service: $provide.service
            };

            NavHelperProvider.addControllerUrl('app/maintenancemode/maintenancemode.controller');
            NavHelperProvider.addToMenu('maintenancemode', {
                "link": "#/maintenancemode",
                "active": "main.maintenancemode",
                "title": "Maintenance",
                "icon": "fa fa-wrench",  // Add navigation icon css class here
                "page": {
                    "title": "Maintenance",
                    "description": "Connection supervision of physical network function to ONAP SDN-C-4-Wireless"
                }
            });

            var access = routingConfig.accessLevels;

            $stateProvider.state('main.maintenancemode', {
                url: 'maintenancemode',
                access: access.admin,
                views: {
                    'content': {
                        templateUrl: 'src/app/maintenancemode/maintenancemode.tpl.html',
                        controller: 'maintenancemodeCtrl'
                    }
                }
            });

        });

        return maintenancemodeApp;
    });
