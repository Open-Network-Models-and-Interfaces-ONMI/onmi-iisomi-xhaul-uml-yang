/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnSpectrum/mwtnSpectrum.module','app/mwtnSpectrum/mwtnSpectrum.services','app/mwtnCommons/mwtnCommons.services'], function(mwtnSpectrumApp) {

  mwtnSpectrumApp.register.controller('mwtnSpectrumCtrl', ['$scope', '$rootScope', '$mwtnSpectrum', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnSpectrum, $mwtnCommons, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnSpectrum/images/mwtnSpectrum.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.mwtnSpectrumInfo = {};

    $mwtnCommons.getData(function(data){
      $scope.data = data;      
    });

  }]);


});
