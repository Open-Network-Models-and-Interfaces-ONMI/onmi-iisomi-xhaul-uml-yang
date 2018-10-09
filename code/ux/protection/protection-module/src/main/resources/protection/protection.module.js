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
        var protectionApp = angular.module('app.protection', ['ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit',
            'ui.bootstrap', 'app.core',
            'ui.router.state', 'config', 'ui.grid.exporter',
            'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
            'ui.grid.resizeColumns', 'angular-clipboard']);

        protectionApp.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {

            protectionApp.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                factory: $provide.factory,
                service: $provide.service
            };

            NavHelperProvider.addControllerUrl('app/protection/protection.controller');
            NavHelperProvider.addToMenu('protection', {
                "link": "#/protection",
                "active": "main.protection",
                "title": "Protection",
                "icon": "fa fa-share-alt",  // Add navigation icon css class here
                "page": {
                    "title": "Protection",
                    "description": "Connection supervision of physical network function to ONAP SDN-C-4-Wireless"
                }
            });

            var access = routingConfig.accessLevels;

            $stateProvider.state('main.protection', {
                url: 'protection',
                access: access.admin,
                views: {
                    'content': {
                        templateUrl: 'src/app/protection/protection.tpl.html',
                        controller: 'protectionCtrl'
                    }
                }
            });

        });

        return protectionApp;
    });
