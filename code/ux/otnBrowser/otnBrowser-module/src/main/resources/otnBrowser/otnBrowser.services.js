/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/otnBrowser/otnBrowser.module', 'app/mwtnCommons/mwtnCommons.services'], function (otnBrowserApp) {

  otnBrowserApp.register.factory('$otnBrowser', function ($q, $http, Base64, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var service = {};

    service.checkModules = $mwtnCommons.checkModules;
    

    return service;
  });
});
