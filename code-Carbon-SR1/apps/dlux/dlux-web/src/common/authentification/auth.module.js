/*
 * Copyright (c) 2014 Inocybe Technologies, and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angular', './auth.services', 'common/config/env.module'], function (angular, services) {
  'use strict';
  var auth = angular.module('app.common.auth', ['config']);

  // services
  auth.factory('Auth', services.Auth);
  auth.factory('Base64', services.Base64);
  auth.factory('NbInterceptor', services.NbInterceptor);

  return auth;
});
