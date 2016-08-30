/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([ 'app/mwtnConfig/mwtnConfig.module',], function(mwtnConfigApp) {

  mwtnConfigApp.register.directive('parameters', function() {
    return {
      restrict : 'A',
      scope: {
        parameters: '=parameters',
        schema: '=schema'
      },
      templateUrl : 'src/app/mwtnConfig/templates/show.tpl.html'
    };
  });
  
});