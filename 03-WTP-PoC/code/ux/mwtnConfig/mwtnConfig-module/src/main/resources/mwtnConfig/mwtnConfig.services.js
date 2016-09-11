/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnConfig/mwtnConfig.module'],function(mwtnConfigApp) {


  mwtnConfigApp.register.factory('$mwtnConfig', function($mwtnCommons, $mwtnLog) {
    
    var COMPONENT = '$mwtnConfig';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnConfig started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;
    service.parts = $mwtnCommons.parts;
    service.getActualNetworkElements = $mwtnCommons.getActualNetworkElements;
    service.getPacParts = $mwtnCommons.getPacParts;
    service.getSchema = $mwtnCommons.getSchema;

    return service;
  });

});
