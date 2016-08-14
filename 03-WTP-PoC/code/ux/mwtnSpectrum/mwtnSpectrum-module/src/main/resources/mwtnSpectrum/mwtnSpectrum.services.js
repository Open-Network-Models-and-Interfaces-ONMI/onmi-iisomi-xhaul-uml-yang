/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnSpectrum/mwtnSpectrum.module'],function(mwtnSpectrumApp) {


  mwtnSpectrumApp.register.factory('$mwtnSpectrum', function($http, ENV) {
    var service = {
      base: ENV.getBaseURL("MD_SAL") + "/restconf/"
    };

    /*
     * You can define all of your REST API interactions here.
     */

    return service;
  });

});
