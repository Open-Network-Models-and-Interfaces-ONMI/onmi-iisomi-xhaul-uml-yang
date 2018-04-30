/*
 * Copyright (c) 2016 HCL Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnPerformanceCurrent/mwtnPerformanceCurrent.module'],function(mwtnPerformanceCurrentApp) {

  mwtnPerformanceCurrentApp.register.factory('$mwtnPerformanceCurrent', function($mwtnCommons, $mwtnLog) {

    var COMPONENT = '$mwtnPerformanceCurrent';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnPerformanceCurrent started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;
    service.parts = $mwtnCommons.parts;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.getPacParts = $mwtnCommons.getPacParts;
    service.layerProtocolNameOrder = $mwtnCommons.layerProtocolNameOrder;
    service.formatTimeStamp = $mwtnCommons.formatTimeStamp;
    
    service.yangifyObject=$mwtnCommons.yangifyObject;
      
    return service;
  });

});
