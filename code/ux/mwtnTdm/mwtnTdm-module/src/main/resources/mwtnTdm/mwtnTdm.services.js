/*
 * @copyright 2017 highstreet technologies and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnTdm/mwtnTdm.module'],function(mwtnTdmApp) {

  mwtnTdmApp.register.factory('$mwtnTdm', function($mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var service = {};
    
    service.getPacParts = $mwtnCommons.getPacParts;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.gridOptions = $mwtnCommons.gridOptions;
    service.getActualNetworkElement = $mwtnCommons.getActualNetworkElement;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.getPacParts = $mwtnCommons.getPacParts;
    
    service.parts = $mwtnCommons.parts;
    service.separator = $mwtnCommons.separator;
    service.yangify = $mwtnCommons.yangify;
    service.yangifyObject = $mwtnCommons.yangifyObject;
    
    return service;
  });

});
