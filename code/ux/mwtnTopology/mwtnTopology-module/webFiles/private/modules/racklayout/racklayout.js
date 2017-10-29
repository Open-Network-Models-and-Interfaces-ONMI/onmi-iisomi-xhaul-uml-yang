/**
 * angular.js for racklayouts
 */
var htRacklayout = angular.module('htRacklayout', []);

htRacklayout.config([
         '$stateProvider',
         '$urlRouterProvider',
         function($stateProvider, $urlRouterProvider) {
             'use strict';
             $stateProvider.state('rack', {
                 // abstract:
                 // true,
                 url : '/rack/:index/:id',
                 templateUrl : 'modules/racklayout/racklayout.html',
                 controller: ['$rootScope' , '$scope', '$http', '$stateParams', 'sitesService', 'alertService', 'translateService', function ($rootScope, $scope, $http, $stateParams, sitesService, alertService, translateService) {

                     alertService.setMessage([
                                              'LOADING', 'SUCCESS', 'FAILED'
                                          ]);
                                          $scope.changeLanguage = translateService.changeLanguage;

                     $scope.siteIndex = $stateParams.index;
                     $scope.siteId = $stateParams.id;
                     $rootScope.title = '(' + $scope.siteId + ') htRacklayout';

                     var getRestURL = function() {
                         var index = $scope.siteIndex;
                         var docType = 'networkelement';
                         var url = '/db/' + index + '/' + docType + '/_search';
                         return url;
                     };

                     var ru = 1.75; // rack unit [U]: 1.75"
  var railWidth = 0.625; // 0.625"
  var neTypes = {
    'R2D2-4711': {
      height: {value: 2, unit: 'U'},
    },
    'L0815bid': {
      height: {value: 4, unit: 'U'},      
    },
    'DWDM-MTS11': {
      height: {value: 3, unit: 'U'},      
    }
  };

  var cb = function(comp){
    canvas.add(comp);
    // canvas.renderAll();
  };
  
  var canvas = new fabric.Canvas('canvas');
  angular.extend($scope, {
    
    selection: '',
    scale: 8,
    options: {
          step: [1, 4, 8, 12, 16, 24, 32]
    },
    update: function() {
      // console.log($scope.scale);
      // $scope.$apply();
      draw($scope.rack, $scope.scale, function(){
          // do nothing
      });
    },
      rack: {
              height: {value: 48, unit: 'U'},
              width: {value: 23, unit: 'inch'},
              networkElements: []
            }    
  });

  
// {
// id: 1,
// type: 'R2D2-4711',
// position: {value: 4, unit: 'U'}
// }
  
  
  var highlight = function(target) {
    if (target.selectable === true) {
      var rect = target;
      if (target.type === 'group') {
        rect = target.item(0);
      }
      rect.set({ strokeWidth: 4 });
      // canvas.renderAll();

      $scope.selection = target.item(0);
      $scope.$apply();
    }
  };
  var normal = function(target) {
    if (target.selectable === true) {
      var rect = target;
      if (target.type === 'group') {
        rect = target.item(0);
      }
      rect.set({ strokeWidth: 2 });
      // canvas.renderAll();
        
      $scope.selection = '';
      $scope.$apply();
    }
  };

  canvas.on('mouse:over', function(e) {
    highlight(e.target, 4);
  });
  
  canvas.on('mouse:out', function(e) {
    normal(e.target, 2);
  });
  
  var background = function(callback) {
      var bg = new fabric.Rect({
        top : 0,
        left : 0,
        width : canvas.width,
        height : canvas.height,
        strokeWidth: 0, 
        stroke: 'red',
        angle: 0,
        flipY: false,
        selectable: false,
        hasControls: false,
        hasBorders: false
    });
    bg.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: canvas.width,
      y2: canvas.height,
      colorStops: {
        0: '#FFFFFF',
        0.25: '#DDDDDD',
        0.50: '#EEEEEE',
        0.75: '#DDDDDD',
        1: '#FFFFFF'
       }
    });
    return callback(bg);
  };

  var makeLine = function(coords, callback) {
    return callback(new fabric.Line(coords, {
      fill: '#CCCCCC',
      stroke: '#CCCCCC',
      strokeWidth: 1,
      selectable: false
      }));
  };
    
  var makeRail = function(rail, height, width, scale, callback) {
    var rect = new fabric.Rect({
      left: rail*(canvas.width-railWidth*scale),
      top: 0,
      width: railWidth*scale,
      height: height,
      stroke: '#eeeeee',
      strokeWidth: 0,
      selectable: false
      });
    rect.setGradient('fill', {
      x1: 0,
      y1: -rail * height/2,
      x2: height,
      y2: height,
      colorStops: {
          0: '#949494',
          0.15: '#FFFFFF',
          0.20: '#ADADAD',
          0.25: '#CCCCCC',
          0.30: '#9E9E9E',
          0.35: '#BABABA',
          0.40: '#FFFFFF',
          0.50: '#949494',
          1: '#949494'
       }
    });
    return callback(rect);
  };
    
  var makeAcDc = function(pos, width, scale, callback) {

    var text = 'AC/DC';
    var label = new fabric.Text(text, {
      fontSize: 15*scale/10,
      fill: 'red',
        left: 0, 
        top: 0.8*scale
    });
    
    var rect = new fabric.Rect({
      left: label.width + width*0.1 - (width-2*railWidth*scale),
      top: 0,
      width: width-2*railWidth*scale,
      height: 2*ru*scale,
      stroke: '#FF0000',
      strokeWidth: 1,
      selectable: false
      });
    rect.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: rect.width,
      y2: rect.height,
      colorStops: {
          0: '#666666',
          0.70: '#EEEEEE',
          1: '#666666'
      }
    });

    return callback(new fabric.Group([ rect, label ], {
        left: railWidth*scale,
        top: pos,
        selectable: false
    }));
  };

  var makeNe = function(ne, width, scale, callback) {
    var text = ne.type;
    var label = new fabric.Text(text, {
      fontSize: 15*scale/10,
      fontFamily: 'Arial',
        fontStyle: 'bold',
         fill: 'white',
        left: 0, 
        top: ne.position.value*ru*scale + 0.8*scale
    });
    // console.log(neTypes[ne.type].height.value);
    var rect = new fabric.Rect({
      left: label.width + width*0.1 - (width-2*railWidth*scale),
      top: ne.position.value*ru*scale,
      width: width-2*railWidth*scale,
      height: 2*ru*scale, // TODO neTypes[ne.type].height.value*ru*scale,
      stroke: '#0000FF',
      strokeWidth: 2,
      selectable: true
      });
    rect.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: rect.width,
      y2: rect.height,
      colorStops: {
          0: '#0088FF',
          0.30: '#00EEFF',
          1: '#0088FF'
       }
    });
    return callback(new fabric.Group([ rect, label ], {
      left: railWidth*scale,
      top: ne.position.value*ru*scale,
      stroke: '#0000FF',
      strokeWidth: 0,
      selectable: true,
        hasControls: false,
        hasBorders: false
    }));
  };
    

    // context
    var ctx=canvas.getContext('2d');
  // function draw
    var draw = function(rack, scale, callback) {
      // init canvas
    canvas.setWidth(rack.width.value*scale);
        canvas.setHeight(rack.height.value*ru*scale); // rack unit: 1ru =
                                                        // 1,75"

      canvas.clear().renderAll();
      
      background(cb);
      
      for (var index = 0; index < rack.height.value; index++) {
        var x1 = 0*scale;
        var y1 = index*ru*scale;
        var x2 = canvas.width*scale;
        var y2 = index*ru*scale;
        makeLine([ x1, y1, x2, y2 ], cb);
      }

      for (var rail = 0; rail < 2; rail++) {
        makeRail(rail, canvas.height, canvas.width, scale, cb );
      }

      makeAcDc(0, canvas.width, scale, cb);

      // NEs
      for (var index1 = 0; index1 < $scope.rack.networkElements.length; index1++) {
      var ne = $scope.rack.networkElements[index1];
      makeNe( ne, canvas.width, scale, cb);
      }
      return callback();
   };

   var getNetworkElements = function(networkElements, callback) {
       var data = {
           from : 0,
           size : 99, // get all
           query : {
               filtered : {
                   query : {
                       match_all : {}
                   },
                   filter : {
                       terms : {
                           'id.networkElementId' : networkElements
                       }
                   }
               }
           }
       };
       var req = {
           method : 'POST',
           url : getRestURL(),
           headers : {
               'Content-Type' : 'application/json'
           },
           data : data
       };
       $http(req).success(function(data, status) {
           // console.log(JSON.stringify(neData));
           var nes = data.hits.hits;
           nes.map(function(ne){
               $scope.networkElements.push(ne._source);
               $scope.rack.networkElements.push({
                 id: ne._source.id.networkElementId,
                 type: ne._source.inventory.type,
                 position: {value: $scope.pos, unit: 'U'},
                 height: {value: 2, unit: 'U'}
               });
               $scope.networkElements[$scope.networkElements.length-1].position = $scope.pos;
               $scope.networkElements[$scope.networkElements.length-1].height = 2;
               
               $scope.pos += 3;
           });
           draw($scope.rack, $scope.scale, function(){
               return callback();
           });
       }).error(function(data, status){
           console.error('htLog: Error while loading NetworkElement data for ', data, status);
           return callback();
       });
   };
   
   var getSite = function() {
       sitesService.getSitesByIds($scope.siteIndex, [$scope.siteId], function(sites){
           angular.extend($scope, {
               site: sites[0]._source,
               pos: 5,
               networkElements: []
             });
             
           getNetworkElements($scope.site.networkElements, function(){
               // do nothing
           });
     });
  };
  draw($scope.rack, $scope.scale, function(){
      // do nothing
  });
  getSite();
  
  /*
     * 
     * 
     * var rect = new fabric.Rect({ top : 100, left : 100, width : 60, height :
     * 70, strokeWidth: 2, stroke: 'red', angle: 15, flipY:true, selectable:
     * false, hasControls: false, hasBorders: false }); rect.setGradient('fill', {
     * x1: 0, y1: 0, x2: rect.width, y2: rect.height, colorStops: { 0: "red",
     * 0.2: "orange", 0.4: "yellow", 0.6: "green", 0.8: "blue", 1: "purple" }
     * }); canvas.add(rect);
     */  
                 }]
                 });
             }
         ]);
