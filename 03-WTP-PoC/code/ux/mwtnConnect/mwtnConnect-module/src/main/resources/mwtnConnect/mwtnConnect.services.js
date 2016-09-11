/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnConnect/mwtnConnect.module','app/mwtnCommons/mwtnCommons.services'],function(mwtnConnectApp) {


  mwtnConnectApp.register.factory('$mwtnConnect', function($mwtnCommons, $mwtnLog) {

    var COMPONENT = '$mwtnConnect';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnConnect started!'});

    var service = {};

    service.getActualNetworkElements = $mwtnCommons.getActualNetworkElements;
    service.mount = $mwtnCommons.mount;
    service.unmount = $mwtnCommons.unmount;
    
    return service;
  });

});
