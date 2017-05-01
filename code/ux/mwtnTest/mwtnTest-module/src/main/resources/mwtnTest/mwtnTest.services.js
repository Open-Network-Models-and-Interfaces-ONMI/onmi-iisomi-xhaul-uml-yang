/*
 * @copyright 2017 highstreet technologies and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnTest/mwtnTest.module'],function(mwtnTestApp) {

  mwtnTestApp.register.factory('$mwtnTest', function($mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnTest';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnTest started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;
    service.parts = $mwtnCommons.parts;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.getPacParts = $mwtnCommons.getPacParts;
    service.yangify = $mwtnCommons.yangify;
    service.yangifyObject = $mwtnCommons.yangifyObject;
    service.getModules = $mwtnDatabase.getModules;
    service.getPartGlobalId = $mwtnCommons.getPartGlobalId;
    service.getPartLocalId = $mwtnCommons.getPartLocalId;
      
    return service;
  });

});
