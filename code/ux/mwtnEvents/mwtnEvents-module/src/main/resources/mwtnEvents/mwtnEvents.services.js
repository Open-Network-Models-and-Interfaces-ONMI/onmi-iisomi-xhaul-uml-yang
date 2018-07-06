/*
 * Copyright (c) 2016 Tech Mahindra Ltd. and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([ 'app/mwtnEvents/mwtnEvents.module' ], function(mwtnEventsApp) {

  mwtnEventsApp.register.factory('$mwtnEvents', function($mwtnCommons) {

    var service = {};
    
    service.gridOptions = $mwtnCommons.gridOptions;
    service.getMwtnWebSocketUrl = $mwtnCommons.getMwtnWebSocketUrl;
    service.formatData = $mwtnCommons.formatData;
    
    
    return service;
  });
});
