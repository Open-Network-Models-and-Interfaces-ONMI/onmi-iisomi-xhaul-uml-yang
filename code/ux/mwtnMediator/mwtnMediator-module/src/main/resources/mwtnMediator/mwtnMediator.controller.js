/*
 * @copyright 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * @license
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnMediator/mwtnMediator.module',
        'app/mwtnMediator/mwtnMediator.services'],
        function(mwtnMediatorApp) {

  var mediatorServer;
  mwtnMediatorApp.register.controller('mwtnMediatorCtrl', ['$scope', '$rootScope','$uibModal', '$mwtnLog', '$mwtnMediator',
    function($scope, $rootScope, $uibModal, $mwtnLog, $mwtnMediator) {

    var COMPONENT = 'mwtnMediatorCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnMediatorCtrl started!'});
    $rootScope.section_logo = 'src/app/mwtnMediator/images/mwtnMediator.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
    $scope.odlKarafVersion = $mwtnMediator.odlKarafVersion;
    $scope.highlightFilteredHeader = $mwtnMediator.highlightFilteredHeader;



    $scope.gridOptions = JSON.parse(JSON.stringify($mwtnMediator.gridOptions));
    $scope.gridOptions.rowHeight = 44;

   	var requiredNesActionCellTemplate = [
      '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >',
      '<button class="btn btn-primary" ng-click="grid.appScope.startMediator(row.entity)">Start</button>',
      '<button class="btn btn-default" ng-click="grid.appScope.stopMediator(row.entity)">Stop</button>',
      '<button class="btn btn-default" ng-click="grid.appScope.showDetails(row.entity)"><i class="fa fa-info-circle" aria-hidden="true"></i></button>',
      '</a>' ].join('<span>&nbsp;</span>');

    $scope.gridOptions.columnDefs = [
       { field: 'Name',  type: 'string', displayName: 'Mediator',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
       { field: 'PID',  type: 'string', displayName: 'Status',  headerCellClass: $scope.highlightFilteredHeader, width : 120 },
       { field: 'DeviceIp',  type: 'string', displayName: 'IP address',  headerCellClass: $scope.highlightFilteredHeader, width : 120 },
       {  name : 'actions',
          enableSorting : false,
          enableFiltering: false,
          cellTemplate: requiredNesActionCellTemplate,
          width : 280,
          pinnedRight : true
	   }
     ];


    $scope.editMediatorServers = function()
    		{
    			console.log("edit server list");
    		}
    $scope.createNewMediator = function()
    {
    		if(mediatorServer!==undefined)
    		{
    			console.log("create new mediator");
    			var modalInstance = $uibModal.open({
    		      	animation:true,
    		      	 ariaLabelledBy: 'modal-title',
    		        ariaDescribedBy: 'modal-body',
    		        templateUrl: 'src/app/mwtnMediator/templates/mediatorCreateNew.tpl.html',
    		        controller: 'MediatorNewCtrl',
    		        size: 'lg',
    		        resolve: {
    		          currentElement: function () {
    		            return $scope.currentElement;
    		          }
    		        }

    		 });
    		}
    		else
    		{
    			console.log("no mediatorserver selected");
    		}
    }
    var refreshMediators = function()
    {
    	console.log("refresh mediators list");
    	if(mediatorServer!==undefined)
    	{
    		mediatorServer.LoadConfigs(function(configs){
			   $scope.data = configs;
			   $scope.$apply();
			},
			function(err){
				$scope.data = [];
				$scope.$apply();
				console.log("cannot reach mediatorserver:"+err);
			});
		}
    }
    var refreshMediator = function(name)
    {
    	console.log("refresh mediators list");
    	if(mediatorServer!==undefined)
    	{
    		mediatorServer.ReloadConfig(name,function(changes){
			   $scope.$apply();
			},
			function(err){
				console.log("cannot reach mediatorserver:"+err);
			});
		}
    }
    $scope.refreshMediators = refreshMediators;

    $scope.startMediator =  function(el)
    {
    	var btn=$(this);
    	if(btn!==undefined)
    		btn.prop('disabled',true);
    	console.log("starting mediator "+el.Name+" ...");
    	if(mediatorServer!==undefined)
    	{
    		mediatorServer.StartMediator(el.Name,function(res){
    			refreshMediator(el.Name);
    			console.log(res);
    		},function(err){
    			if(btn!==undefined)
    	    		btn.prop('disabled',false);
    			console.log("error starting mediator");
    		});
    	}
    }
    $scope.stopMediator = function(el)
    {
    	var btn=$(this);
    	if(btn!==undefined)
    		btn.prop('disabled',true);
    	console.log("stopping mediator "+el.Name+" ...");
   		if(mediatorServer!==undefined)
    	{
    		mediatorServer.StopMediator(el.Name,function(res){
    			refreshMediator(el.Name);
    			console.log(res);
    		},function(err){
    			if(btn!==undefined)
    	    		btn.prop('disabled',false);
    			console.log("error stopping mediator");
    		});
    	}
    }
    $scope.showDetails = function(el)
    {
      $scope.currentElement = el;
      var modalInstance = $uibModal.open({
      	animation:true,
      	 ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnMediator/templates/mediatorDetails.tpl.html',
        controller: 'MediatorDetailsCtrl',
        size: 'lg',
        resolve: {
          currentElement: function () {
            return $scope.currentElement;
          }
        }

      });
    }
    $scope.gridOptions.data = 'data';
    $scope.options={

    }
    var onServerSelectedChanged = function(item){
    	var serverURL;
    	if(item!==undefined)
    	{
    		if(typeof(item)==='object')
    			serverURL=item.url;
    		else if(typeof(item)==='string')
    		{
    			try
    			{
    				$mwtnMediator.getServerData(parseInt(item)).then(function(data){
    					if(data!==undefined)
    					{
    					serverURL=data.url;
    					mediatorServer = new MediatorServer(serverURL);
				    	$mwtnLog.info({component: COMPONENT, message: 'loading server configs for '+serverURL});
				    	mediatorServer.LoadConfigs(function(configs){
				    	   $scope.data = configs;
				    	   $scope.$apply();
				    	},
				    	function(err){
				    		$scope.data = [];
				    		$scope.$apply();
				    		console.log("cannot reach mediatorserver:"+err);
				    	});
    					}
    					else
    						console.log("search for server data failed. should never happened")
				    });
				}
				catch(e)
				{"error loading server:n"+console.log(e);}
			}
    	}



    }

    //load mediator servers from database
    $mwtnMediator.getServerData().then(function(data){
    	//set as option source for GUI selector
    	$scope.options.medservers=data;
    	//autoselect first item
    	if(data!==undefined && data.length>0)
    	{
    		onServerSelectedChanged(data[0]);
    		//$scope.medserver=
    	}
    });
    $scope.onchangeserver = function(){
    	onServerSelectedChanged($scope.medserver);
    }

  }]);


  /************************************************************************************
   * medaitorDetails Controller definition
   ************************************************************************************/
  mwtnMediatorApp.register.controller('MediatorDetailsCtrl', ['$scope', '$uibModalInstance', '$uibModal', '$mwtnConnect', '$mwtnLog', 'currentElement',
                                                                  function ($scope, $uibModalInstance, $uibModal, $mwtnConnect, $mwtnLog, currentElement) {

    	var COMPONENT = 'MediatorDetailsCtrl';
    	var element = currentElement;
    	$scope.statusmessage='';
    	$scope.errormessage='';
    	// $mwtnLog.info({component: COMPONENT, message: 'MediatorDetailsCtrl started!'});
		$scope.data = {
			el:currentElement
		};
		$scope.ok = function () {
      		$uibModalInstance.close({el: currentElement});
    	};
    	$scope.start = function(){
    		var btn=$(this);
    		if(btn!==undefined)
    			btn.prop('disabled', true);
    		mediatorServer.StartMediator(element.Name,function(res){
    			if(btn!==undefined)
        			btn.prop('disabled', true);
    			$scope.errormessage='';
    			$scope.statusmessage=res;
    			$scope.$apply();

    		},function(err){
    			if(btn!==undefined)
        			btn.prop('disabled', false);
    			$scope.errormessage=err;
    			$scope.statusmessage='';
    			$scope.$apply();

    		});
    	};
    	$scope.stop = function(){
    		var btn=$(this);
    		if(btn!==undefined)
    			btn.prop('disabled', true);
    		mediatorServer.StopMediator(element.Name,function(res){
    			if(btn!==undefined)
        			btn.prop('disabled', true);
    			$scope.errormessage='';
    			$scope.statusmessage=res;
    			$scope.$apply();

    		},function(err){
    			if(btn!==undefined)
        			btn.prop('disabled', false);
    			$scope.errormessage=err;
    			$scope.statusmessage='';
    			$scope.$apply();

    		});
    	};
    	$scope.delete = function(){
    		var btn=$(this);
    		if(btn!==undefined)
    			btn.prop('disabled', true);
    		if(confirm("Do you really want to delete this mediator?"))
    		{
    			mediatorServer.DeleteMediator(element.Name,function(res){

    			},function(err){
    				if(btn!==undefined)
            			btn.prop('disabled', false);
        			$scope.errormessage=err;
        			$scope.statusmessage='';
        			$scope.$apply();
    			});
    		}
    		else
    		{
    			if(btn!==undefined)
        			btn.prop('disabled', false);
    		}
    	};

  	}
  ]);
  /************************************************************************************
   * medaitorCreateNew Controller definition
   ************************************************************************************/
  mwtnMediatorApp.register.controller('MediatorNewCtrl', ['$scope', '$uibModalInstance', '$uibModal', '$mwtnConnect', '$mwtnLog',
                                                                  function ($scope, $uibModalInstance, $uibModal, $mwtnConnect, $mwtnLog) {

    	var COMPONENT = 'MediatorNewCtrl';
    	// $mwtnLog.info({component: COMPONENT, message: COMPONENT + ' started!'});

    	$scope.options={
    		nexmlmodel:[],
    		nedevicetype:MediatorConfig.DeviceTypes
    	};
    	$scope.mediator={name:'',devicetype:0,remoteip:'',trapsport:0,ncport:0,nexml:''};

    	mediatorServer.LoadNetworkElementXMLFiles(function(xmlNames){
    		$scope.options.nexmlmodel=xmlNames;
    	});
    	$scope.errormessage='';
    	$scope.statusmessage='';

		$scope.ok = function () {
			var btn=$(this);
			if(btn!==undefined)
				btn.prop('disabled', true);
			mediatorServer.CreateMediator($scope.mediator.name,
										$scope.mediator.devicetype,
										$scope.mediator.remoteip,
										$scope.mediator.trapsport,
										$scope.mediator.nexml,
										$scope.mediator.ncport,
				function(e){
					if(e==true)
					{
						$scope.statusmessage="mediator created";
						$scope.errormessage="";
						$scope.$apply();
						setTimeout(function(){$uibModalInstance.close();},2000);
					}
					else
					{
						if(btn!==undefined)
							btn.prop('disabled', false);
						$scope.statusmessage="";
						$scope.errormessage=e;
						$scope.$apply();
					}
				},function(err){
					if(btn!==undefined)
						btn.prop('disabled', false);
					$scope.statusmessage="";
					$scope.errormessage=e;
					$scope.$apply();
				});

    	};
    	$scope.cancel = function(){
    		$uibModalInstance.close();
    	};

  	}
  ]);

});
