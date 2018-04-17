/*
 * @copyright 2017 highstreet technologies and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnBrowser/mwtnBrowser.module'],function(mwtnBrowserApp) {

  mwtnBrowserApp.register.factory('$mwtnBrowser', function($mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnBrowser';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnBrowser started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;
    
    service.parts = $mwtnCommons.parts;
    service.getPacParts = $mwtnCommons.getPacParts;
    service.getModules = $mwtnDatabase.getModules;
    service.getPartGlobalId = $mwtnCommons.getPartGlobalId;
    service.getPartLocalId = $mwtnCommons.getPartLocalId;
    service.getViewData = $mwtnCommons.getViewData;
    service.getForwardingConstruct = $mwtnCommons.getForwardingConstruct;
    service.layerProtocolNameOrder = $mwtnCommons.layerProtocolNameOrder;
    service.yangify = $mwtnCommons.yangify;
    service.yangifyObject = $mwtnCommons.yangifyObject;
    
    service.refreshPTP = function() {
      console.error('refresh ptp');
    }
    return service;
  });

});
