$(window).bind('resize', function () {
  var scrollBodyheight = $(window).height() - 460;
  if (scrollBodyheight < 330) {
    scrollBodyheight = 330;
  }
  $(".dataTables_scrollBody").height(scrollBodyheight);
});

var app = angular.module('htListsApp', ['ui.bootstrap', 'datatables']);
app.filter('keylength', function(){
  return function(input){
    if(!angular.isObject(input)){
      // throw Error("Usage of non-objects with keylength filter!!")
      return 0;
    }
    return Object.keys(input).length;
  };
});

var dtOptions = function(route, $scope, $http, DTOptionsBuilder) {
    
  return DTOptionsBuilder.newOptions()
    .withOption('ajax', {
        dataSrc: 'data',
        url: route, // e.g: 'lists/sites/data',
        type: 'POST'
    })
    .withOption('serverSide', true)    
    // .withOption('paginationType', "full_numbers") // default is sufficient
    // and saves space
    .withOption('language', {
        paginate: {
          first: '<span title="Show first entry" class="glyphicon glyphicon-fast-backward"></span>',
          previous: '<span title="Show previous entries" class="glyphicon glyphicon-step-backward"></span>',
          next: '<span title="Show next entries" class="glyphicon glyphicon-step-forward"></span>',
          last: '<span title="Show last entry" class="glyphicon glyphicon-fast-forward"></span>'
        }
     })
    .withOption('displayLength', 10)
    .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see
            // https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                  $scope.clickHandler(aData);                    
                });
            });
            return nRow;
    })
    // Add Bootstrap compatibility
    .withBootstrap()
    .withBootstrapOptions({
        TableTools: {
            classes: {
                container: 'btn-group',
                buttons: {
                    normal: 'btn btn-default'
                }
            }
        },
        ColVis: {
            classes: {
                masterButton: 'btn btn-default'
            }
        }
    }) 
    
    // Add Scroller compatibility
    .withScroller()
    .withOption('deferRender', true)
    // Do not forget to add the scorllY option!!!
    .withOption('scrollY', 330)
    
    // Add ColVis compatibility
    .withColVis()
    
    // Add ColReorder compatibility
    .withColReorder()
    
    // Add FixedColumns compatibility
    // .withFixedColumns() // TODO does not work ;(
    
    // Add FixedHeader compatibility
    // .withFixedHeader() // TODO does not work ;(
    
    // Add Responsive compatibility
    // .withResponsive() // TODO does not work ;(
    
    // Add Table tools compatibility
    .withTableTools('bower_components/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf')
    .withTableToolsButtons([
              {'sExtends': 'copy','sButtonText': 'Copy to Clipboard',},
              // {'sExtends': 'print','sButtonText': 'Print view',}, // TODO
              // needs to adopt server side processing
              {'sExtends': 'csv','sButtonText': 'Save as CSV',},
                {'sExtends': 'pdf','sButtonText': 'Save as PDF',}
       ]);
};
    
app.controller('htListsAppCtrl', function ($scope) {

  angular.extend($scope, {
    myInfo: '',
    tabs: [
        { title:'Sites', templateUrl:'/template/map.html', active: true, init: true },
        { title:'LOS-Links', templateUrl:'/template/losLinks.html', active: false, init: false },
        { title:'Network Elements', templateUrl:'/template/networkElements.html', active:false, init: false }
     ],
     changedTab: function(info) {
       var index = 0;
       while ($scope.tabs[index].active !== true) {
         index++;
       }
       if (!$scope.tabs[index].init) {
         $scope.$broadcast("init", {tab: $scope.tabs[index].title});
         $scope.tabs[index].init = true;
       }
      var scrollBodyheight = $(window).height() - 460;
      if (scrollBodyheight < 330) {
        scrollBodyheight = 330;
      }
      $(".dataTables_scrollBody").height(scrollBodyheight);
      }
    }
  );
});

app.controller('htSitesAppCtrl', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
  
  angular.extend($scope, {
    siteId: 0,
    templateUrl: '/template/site.html',
    showSite: false,
    show: function(bool) {
            $scope.showSite = bool;
            // $scope.message = $scope.message + $scope.showSite.toString();
    },
    clickHandler: function(info) {
      $scope.show(true);
      $scope.siteId = '' +info.id;
        $rootScope.$broadcast('changeSiteId', $scope.siteId);
      },
      dtOptions: dtOptions('lists/sites/data', $scope, $http, DTOptionsBuilder),
    dtColumns: [
            // DTColumnBuilder.newColumn('id').withTitle('Id'),
            DTColumnBuilder.newColumn('userId').withTitle('User Id'),
            DTColumnBuilder.newColumn('isAggregator').withTitle('is Aggregator'),
            DTColumnBuilder.newColumn('owner').withTitle('Owner').withClass('text-right'),
            DTColumnBuilder.newColumn('lat').withTitle('Latitude').withClass('text-right'),
            DTColumnBuilder.newColumn('lng').withTitle('Longitude').withClass('text-right'),
            DTColumnBuilder.newColumn('numberLOSLinks').withTitle('# Los-Links').withClass('text-right'),
            DTColumnBuilder.newColumn('numberNetworkElements').withTitle('# Network Elements').withClass('text-right')
        ]
  });
  
  $scope.$on("init", function (event, args) {
    if (args.tab === 'Sites') {
      $scope.dtOptions.reloadData();
    }
  });
});

app.controller('htLosLinksAppCtrl', function ($scope, $http, $rootScope, DTOptionsBuilder, DTColumnBuilder) {
  
    angular.extend($scope, {
    message: '',
    losLinkId: 0,
    templateUrl: '/template/losLink.html',
    showLosLink: false,
    show: function(bool) {
            $scope.showLosLink = bool;
    },
    clickHandler: function(info) {
      $scope.show(true);
      $scope.losLinkId = '' +info.id;
        $rootScope.$broadcast('changeLosLinkId', $scope.losLinkId);
      },
      dtOptions: dtOptions('lists/loslinks/data', $scope, $http, DTOptionsBuilder),
    dtColumns: [
            // DTColumnBuilder.newColumn('id').withTitle('Id'),
            DTColumnBuilder.newColumn('userId').withTitle('User Id'),
            DTColumnBuilder.newColumn('distance').withTitle('Distance [km]').withClass('text-right'),
            DTColumnBuilder.newColumn('owner').withTitle('Owner').withClass('text-right'),
            DTColumnBuilder.newColumn('siteA').withTitle('Site A'),
            DTColumnBuilder.newColumn('azimuthA').withTitle('Azimuth of Site A [°]').withClass('text-right'),
            DTColumnBuilder.newColumn('siteB').withTitle('Site B'),
            DTColumnBuilder.newColumn('azimuthB').withTitle('Azimuth of Site B [°]').withClass('text-right')
        ]
  });

  $scope.$on("init", function (event, args) {
    if (args.tab === 'LOS-Links') {
      $scope.dtOptions.reloadData();
    }
  });
});

app.controller('htNetworkElementsAppCtrl', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
  
  angular.extend($scope, {
    message: '',
    templateUrl: '/template/networkElement.html',
    showNetworkElement: false,
    show: function(bool) {
            $scope.showNetworkElement = bool;
    },
    clickHandler: function(info) {
      $scope.show(true);
      var route = 'api/networkelement/' + info.id;
      $http.get(route).success(function(data, status) {
        $scope.networkElement = data;
      });
      },
      dtOptions: dtOptions('lists/networkelements/data', $scope, $http, DTOptionsBuilder),
    dtColumns: [
            DTColumnBuilder.newColumn('userId').withTitle('User Id'),
            DTColumnBuilder.newColumn('site').withTitle('Site'),
            DTColumnBuilder.newColumn('inventory.status').withTitle('Status'),
            DTColumnBuilder.newColumn('inventory.type').withTitle('Type'),
            DTColumnBuilder.newColumn('inventory.isIubPS').withTitle('Eth capable')
            ]
  });

  $scope.$on("init", function (event, args) {
    if (args.tab === 'Network Elements') {
      $scope.dtOptions.reloadData();
    }
  });

});
