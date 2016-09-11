/*
 * Copyright (c) 2016 HCL Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnTest/mwtnTest.module'],function(mwtnTestApp) {

  mwtnTestApp.register.factory('$mwtnTest', function($mwtnCommons, $mwtnLog) {

    var COMPONENT = '$mwtnTest';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnTest started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;
    service.parts = $mwtnCommons.parts;
    service.getActualNetworkElements = $mwtnCommons.getActualNetworkElements;
    service.getPacParts = $mwtnCommons.getPacParts;
      
    return service;
  });

});
