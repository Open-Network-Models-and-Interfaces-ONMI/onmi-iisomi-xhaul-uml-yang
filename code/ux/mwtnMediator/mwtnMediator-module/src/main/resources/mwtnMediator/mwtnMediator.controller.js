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
  var autoRefresh;
  mwtnMediatorApp.register.controller('mwtnMediatorCtrl', ['$scope', '$rootScope','$uibModal', '$mwtnLog', '$mwtnMediator',
    function($scope, $rootScope, $uibModal, $mwtnLog, $mwtnMediator) {
	autoRefresh=false;
    var COMPONENT = 'mwtnMediatorCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnMediatorCtrl started!'});
    $rootScope.section_logo = 'src/app/mwtnMediator/images/mwtnMediator.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
    $scope.highlightFilteredHeader = $mwtnMediator.highlightFilteredHeader;



    $scope.gridOptions = JSON.parse(JSON.stringify($mwtnMediator.gridOptions));
    $scope.gridOptions.rowHeight = 44;

    var statusCellTemplate = [
    	'<div class="ui-grid-cell-contents">',
    	'<span class="mwtnMediatorStatusRunning" ng-show="grid.getCellValue(row, col)>0">running ({{grid.getCellValue(row, col)}})</span>',
    	'<span class="mwtnMediatorStatusNotRunning" ng-show="grid.getCellValue(row, col)==0">stopped</span>',
    	'</div>'
    ].join('');
    var connectionStatusCellTemplate = [
    	'<div class="ui-grid-cell-contents">',
    	'<span class="fa fa-server mwtnMediatorOStatusIcon" style="margin-right:-0.5rem;"></span>',
    	'<span class="fa fa-check-circle-o mwtnMediatorCStatusIcon" style="color:green;" ng-show="grid.getCellValue(row, col).Netconf"></span>',
    	'<span class="fa fa-times-circle-o mwtnMediatorCStatusIcon" style="color:red;" ng-show="!grid.getCellValue(row, col).Netconf"></span>',
    	'<span class="fa fa-minus mwtnMediatorCStatusIcon" style="color:green;font-weight:bold;" ng-show="grid.getCellValue(row, col).Netconf"></span>',
    	'<span class="fa fa-ellipsis-h mwtnMediatorCStatusIcon" style="color:red;font-weight:bold;" ng-show="!grid.getCellValue(row, col).Netconf"></span>',
    	'<span class="fa fa-dot-circle-o mwtnMediatorCStatusIcon" style="font-size:3rem;color:#666;"></span>',
    	'<span class="fa fa-minus mwtnMediatorCStatusIcon" style="color:green;font-weight:bold;" ng-show="grid.getCellValue(row, col).NetworkElement"></span>',
    	'<span class="fa fa-ellipsis-h mwtnMediatorCStatusIcon" style="color:red;font-weight:bold;" ng-show="!grid.getCellValue(row, col).NetworkElement"></span>',
    	'<span class="fa fa-check-circle-o mwtnMediatorCStatusIcon" style="color:green;" ng-show="grid.getCellValue(row, col).NetworkElement"></span>',
    	'<span class="fa fa-times-circle-o mwtnMediatorCStatusIcon" style="color:red;" ng-show="!grid.getCellValue(row, col).NetworkElement"></span>',
    	'<span class="fa fa-wifi mwtnMediatorOStatusIcon" style="margin-left:-0.5rem;"></span>',
    	'</div>'].join('');

   	var requiredNesActionCellTemplate = [
      '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >',
      '<button class="btn btn-primary" ng-click="grid.appScope.startMediator(row.entity)">Start</button>',
      '<button class="btn btn-default" ng-click="grid.appScope.stopMediator(row.entity)">Stop</button>',
      '<button class="btn btn-default" ng-click="grid.appScope.showDetails(row.entity)"><i class="fa fa-info-circle" aria-hidden="true"></i></button>',
      '</a>' ].join('<span>&nbsp;</span>');

    $scope.gridOptions.columnDefs = [
       { field: 'Name',  type: 'string', displayName: 'Mediator',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
       { field: 'PID', type: 'int', name: 'Status', cellTemplate:statusCellTemplate, headerCellClass: $scope.highlightFilteredHeader, width : 120 },
       { field: 'DeviceIp',  type: 'string', displayName: 'IP address',  headerCellClass: $scope.highlightFilteredHeader, width : 120 },
       {
    	   field: 'ConnectionStatus',
    	   type: 'object',
    	   name: 'Connection',
    	   enableSorting : false,
           enableFiltering: false,
           cellTemplate:connectionStatusCellTemplate,
           width : 150
       },
       {  name : 'actions',
          enableSorting : false,
          enableFiltering: false,
          cellTemplate: requiredNesActionCellTemplate,
          width : 280,
          pinnedRight : true
	   }
     ];



    var refreshMediators = function()
    {
    	var i=$('#btn_refreshMediators > i');
    	i.addClass("fa-spin");
    	console.log("refresh mediators list");
    	if(mediatorServer!==undefined)
    	{
    		mediatorServer.LoadConfigs(function(configs){
			   $scope.data = configs;
			   $scope.$apply();
			   i.removeClass("fa-spin");
		    },
			function(err){
				$scope.data = [];
				$scope.$apply();
			    i.removeClass("fa-spin");
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
					    	refreshMediators();
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

    /* GUI Events =======================================*/
    $scope.onAutoRefreshChanged = function()
    {
    	autoRefresh = $('#ckbx_mediatorAutorefresh').prop('checked');
    	console.log("set autorefresh to "+autoRefresh);
    }
    $scope.editMediatorServers = function()
    {
    	var modalInstance = $uibModal.open({
	      	animation:true,
	      	 ariaLabelledBy: 'modal-title',
	        ariaDescribedBy: 'modal-body',
	        templateUrl: 'src/app/mwtnMediator/templates/mediatorServerConfigCtrl.tpl.html',
	        controller: 'MediatorServerConfigCtrl',
	        size: 'lg',
	        resolve: {
	          currentElement: function () {
	            return $scope.currentElement;
	          }
	        }

	 });
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
    			//console.log(res);
    		},function(err){
    			if(btn!==undefined)
    	    		btn.prop('disabled',false);
    		//	console.log("error starting mediator");
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
    			//console.log(res);
    		},function(err){
    			if(btn!==undefined)
    	    		btn.prop('disabled',false);
    		//	console.log("error stopping mediator");
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
    $scope.onchangeserver = function(){
    	autoRefresh=false;
    	$('#ckbx_mediatorAutorefresh').prop('checked',autoRefresh);
    	onServerSelectedChanged($scope.medserver);
    }
    /* End of GUI Events===========================*/


    $scope.gridOptions.data = 'data';
    $scope.options={

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
    var timer = setInterval(function(){
    	if(autoRefresh && mediatorServer!==undefined)
    	{
    		refreshMediators();
    	}

    },30000);

  }]);


  /************************************************************************************
   * medaitorDetails Controller definition
   ************************************************************************************/
  mwtnMediatorApp.register.controller('MediatorDetailsCtrl', ['$scope', '$uibModalInstance', '$uibModal', '$mwtnConnect', '$mwtnLog', '$mwtnMediator','currentElement',
                                                                  function ($scope, $uibModalInstance, $uibModal, $mwtnConnect, $mwtnLog, $mwtnMediator, currentElement) {

	   	var COMPONENT = 'MediatorDetailsCtrl';
    	var element = currentElement;
    	var error = function(msg)
    	{
    		$scope.statusmessage='';
        	$scope.errormessage=msg;
        	$scope.$apply();
    	}
    	var status = function(msg)
    	{
    		$scope.statusmessage=msg;
        	$scope.errormessage='';
        	$scope.$apply();
    	}
    	var reloadDelayed = function()
    	{
    		setTimeout(function(){
	    		mediatorServer.ReloadConfig(element.Name,function(res){
	    			$scope.$apply();
	    		},function(err){error(err);});
    		},1000);
    	}
    	var refreshLogs = function()
    	{
    		mediatorServer.LoadLogs(currentElement.Name,function(res){
    			$scope.logdata=res;
    			$scope.$apply();

    		},function(err){
    			$scope.logdata=[];
    			$scope.$apply();
    		});
    	}
    	$scope.statusmessage='';
    	$scope.errormessage='';
    	$scope.logGridOptions = JSON.parse(JSON.stringify($mwtnMediator.logGridOptions));
	    //$scope.logGridOptions.rowHeight = 44;
	    $scope.logGridOptions.columnDefs = [
	        { field: 'ts',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 180 },
	        { field: 'lvl', type: 'String', displayName: 'LogLevel', headerCellClass: $scope.highlightFilteredHeader, width : 90 },
	        { field: 'src',  type: 'string', displayName: 'Source',  headerCellClass: $scope.highlightFilteredHeader, width : 120 },
	        { field: 'msg',  type: 'string', displayName: 'Message',  headerCellClass: $scope.highlightFilteredHeader, width : 300 },

	      ];
	    $scope.logGridOptions.data = 'logdata';
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
    			status(res);
    			reloadDelayed();
    		},function(err){
    			if(btn!==undefined)
        			btn.prop('disabled', false);
    			error(err);

    		});
    	};
    	$scope.stop = function(){
    		var btn=$(this);
    		if(btn!==undefined)
    			btn.prop('disabled', true);
    		mediatorServer.StopMediator(element.Name,function(res){
    			if(btn!==undefined)
        			btn.prop('disabled', true);
    			status(res);
    			reloadDelayed();
    		},function(err){
    			if(btn!==undefined)
        			btn.prop('disabled', false);
    			error(err);

    		});
    	};
    	$scope.delete = function(){
    		var btn=$(this);
    		if(btn!==undefined)
    			btn.prop('disabled', true);
    		if(confirm("Do you really want to delete this mediator?"))
    		{
    			mediatorServer.DeleteMediator(element.Name,function(res){
    				status(res);
    			},function(err){
    				if(btn!==undefined)
            			btn.prop('disabled', false);
        			error(err);
    			});
    		}
    		else
    		{
    			if(btn!==undefined)
        			btn.prop('disabled', false);
    		}
    	};
    	$scope.unlock = function(){
    		var btn=$(this);
    		if(btn!==undefined)
    			btn.prop('disabled', true);
    		mediatorServer.ClearLock(element.Name,function(res){
    			status(res);
    			reloadDelayed();
    		},function(err){
    			if(btn!==undefined)
            		btn.prop('disabled', false);
        		error(err);
    		});
    	}
    	refreshLogs();
  	}
  ]);
  /************************************************************************************
   * medaitorCreateNew Controller definition
   ************************************************************************************/
  mwtnMediatorApp.register.controller('MediatorNewCtrl', ['$scope', '$uibModalInstance', '$uibModal', '$mwtnConnect', '$mwtnLog',
                                                                  function ($scope, $uibModalInstance, $uibModal, $mwtnConnect, $mwtnLog) {

    	var COMPONENT = 'MediatorNewCtrl';
    	// $mwtnLog.info({component: COMPONENT, message: COMPONENT + ' started!'});
    	var status = function(msg)
    	{
    		$scope.statusmessage=msg;
			$scope.errormessage="";
			$scope.$apply();
    	}
    	var error = function(msg)
    	{
    		$scope.statusmessage="";
			$scope.errormessage=msg;
			$scope.$apply();
    	}
    	$scope.options={
    		nexmlmodel:[],
    		nedevicetype:MediatorConfig.DeviceTypes
    	};
    	$scope.mediator={name:'',devicetype:0,remoteip:'',remoteport:161,trapsport:0,ncport:0,nexml:''};
    	$scope.odlconfig=mediatorServer.GetDefaultODLConfig();
    	$scope.odlsavebtn={enabled:false};

    	//=======load data
    	mediatorServer.LoadNetworkElementXMLFiles(function(xmlNames){
    		$scope.options.nexmlmodel=xmlNames;
    		$scope.$apply();
    	},function(err){
    		error(err);
    	});
    	mediatorServer.LoadAvailableNCPorts(function(portValues){
    		if(portValues!==undefined && portValues.length>0)
    		{
    			$scope.mediator.ncport = portValues[0];
    		}
    	},function(err){error(err);});
    	mediatorServer.LoadAvailableSnmpPorts(function(portValues){
    		if(portValues!==undefined && portValues.length>0)
    		{
    			$scope.mediator.trapsport = portValues[0];
    		}
    	},function(err){error(err);});


    	$scope.errormessage='';
    	$scope.statusmessage='';

    	//====handle events========
    	$scope.odledit = function(){
    		$scope.odlsavebtn.enabled=true;
    		console.log("enable odl configs")
    		$scope.$apply();
    	}
    	$scope.odlsave = function(){
    		mediatorServer.SetDefaultODLConfig($scope.odlconfig);
    	}
		$scope.ok = function () {
			var btn=$(this);
			if(btn!==undefined)
				btn.prop('disabled', true);
			mediatorServer.CreateMediator($scope.mediator.name,
										$scope.mediator.devicetype,
										$scope.mediator.remoteip,
										$scope.mediator.remoteport,
										$scope.mediator.trapsport,
										$scope.mediator.nexml,
										$scope.mediator.ncport,
				function(e){
					if(e==true)
					{
						status("mediator created");
						setTimeout(function(){$uibModalInstance.close();},2000);
					}
					else
					{
						if(btn!==undefined)
							btn.prop('disabled', false);
						error(e);

					}
				},function(err){
					if(btn!==undefined)
						btn.prop('disabled', false);
					error(err);

				});

    	};
    	$scope.cancel = function(){
    		$uibModalInstance.close();
    	};

  	}
  ]);
  /************************************************************************************
   * medaitorServerConfig Controller definition
   ************************************************************************************/
  mwtnMediatorApp.register.controller('MediatorServerConfigCtrl', ['$scope', '$uibModalInstance', '$uibModal', '$mwtnConnect', '$mwtnLog', '$mwtnMediator',
                                                                  function ($scope, $uibModalInstance, $uibModal, $mwtnConnect, $mwtnLog, $mwtnMediator) {

    	var COMPONENT = 'MediatorServerConfigCtrl';
    	// $mwtnLog.info({component: COMPONENT, message: COMPONENT + ' started!'});
    	var onServerRowSelect = function(obj,id)
    	{
    		if(obj!=undefined)
    			$(obj).addClass("selected");
    		var tbxId=$('#tbx_mediatorserver-id');
    		var tbxName=$('#tbx_mediatorserver-name');
    		var tbxHost = $('#tbx_mediatorserver-host');
    		var tbxVersion = $('#tbx_mediatorserver-version');
    		var tbxVersionMed = $('#tbx_mediatorserver-medversion');
    		tbxId.prop('disabled',true);
    		tbxName.prop('disabled',true);
    		tbxHost.prop('disabled',true);
    		tbxVersion.prop('disabled',true);
    		tbxVersionMed.prop('disabled',true);

    		$mwtnMediator.getServerData(id).then(function(data){
    			if(data!==undefined)
    			{
    				tbxId.val(data.id);
    				tbxName.val(data.name);
    				tbxHost.val(data.url);
    				tbxVersion.val("");
					tbxVersionMed.val("");
    				var s=new MediatorServer(data.url);
    				s.LoadVersion(function(d){
    					tbxVersion.val(d.server);
    					tbxVersionMed.val(d.mediator);

    				},function(err){

    				});
        		}
    		});
    	}
    	var create = function(host,name,port)
    	{
    		var url=host+":"+port;
    		$mwtnMediator.addServer(name,url).then(function(data){
    			reload();
    		});
    	}
    	var onEdit = function(id)
    	{
    		var tbxName=$('#tbx_mediatorserver-name');
    		var tbxHost = $('#tbx_mediatorserver-host');
    		tbxName.prop('disabled',false);
    		tbxHost.prop('disabled',false);

    	}
    	var onDelete = function(id)
    	{
    		if(confirm("Do you really want to delete?"))
    		{
    		//	console.log("delete server with id="+id);
    			$mwtnMediator.removeServer(id).then(function(){reload();});
    		}
    	}
    	var reload = function(){
	    	$mwtnMediator.getServerData().then(function(data){

	    		//fill table
	    		var list=$('#mediatorserver-list');
	    		list.html('');
	    		if(data!==undefined && data.length>0)
	    		{
	    			for(var i=0;i<data.length;i++)
	    			{
	    				var desc=$('<span class="desc" id="item_'+data[i].id+'">'+data[i].name+'</span>');
	    				var li=$('<li></li>');
	    				var iconsbox=$('<div class="icons"></div>');
	    				var edit=$('<span class="fa fa-edit" id="item_edit_'+data[i].id+'"></span>');
	    				var del=$('<span class="fa fa-trash-o" id="item_del_'+data[i].id+'"></span>');
	    				iconsbox.html([edit,del]);
	    				li.html([desc,iconsbox]);
	    				if(i==0)
	    					li.addClass("selected");
	    				//register click handlers
	    				desc.click(function(){
	    					$('#mediatorserver-list > li').removeClass('selected');
	    					onServerRowSelect(this.parentNode,$(this).prop('id').substr(5));
	    				});
	    				edit.click(function(){
	    					onEdit($(this).prop('id').substr(10));
	    				});
	    				del.click(function(){
	    					onDelete($(this).prop('id').substr(9));
	    				});
	    				list.append(li);
	    			}
	    			onServerRowSelect(undefined,data[0].id);
	    		}
	    	});
    	}
    	reload();
    	$scope.close = function(){
    		$uibModalInstance.close();
    	};
  }]);

});
