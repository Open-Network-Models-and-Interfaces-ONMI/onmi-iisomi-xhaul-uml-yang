/*
 * @copyright 2017 highstreet technologies and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnMediator/mwtnMediator.module'],function(mwtnMediatorApp) {

  mwtnMediatorApp.register.factory('$mwtnMediator', function($http, $q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnMediator';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnMediator started!'});

    var service = {};

    // globals for this service
    //service.url = 'http://192.168.11.44:7070/api';

    // import of mwtnCommons
    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.odlKarafVersion = $mwtnCommons.odlKarafVersion;
    service.getAllData = $mwtnDatabase.getAllData;
    service.getFilteredSortedData = $mwtnDatabase.getFilteredSortedData;
    // service specific functions
    service.getServerData = function(id){
    	var deferred = $q.defer();
    	/*var table=[{id:1,name:"Server 1",url:"http://192.168.11.44:7070"},
    	    		{id:2,name:"Server 2",url:"http://192.168.11.45:7070"}];
    	if(id===undefined)
    		deferred.resolve(table);
    	else
    		deferred.resolve(table[id-1]);//idx=id-1
    		*/
    	var functionid="mwtn";
    	var type="mediator-server";
    	var sort = [ { 'id' : {order : 'asc'}}];

    	if(id===undefined)
    		 $mwtnDatabase.getAllData(functionid,type,0,99,sort,null).then(function(success){
    			 	var list=[];
    			 	success.data.hits.hits.map(function(entry){
					     var row = {
					       id: entry._source.id,
					       url: entry._source.url,
					       name: entry._source.name
					   };
					  list.push(row);
    			 	});
    			deferred.resolve(list);
    		}, function(error){
    	        $mwtnLog.error({component: 'private getAlldata', message: JSON.stringify(error.data)});
    	        deferred.reject(error);
    	      });
    	else
    		 $mwtnDatabase.getFilteredSortedData(functionid,type,0,99,sort,{'match':{'id':id}}).then(function(success){
    			 var list=[];
 			 	success.data.hits.hits.map(function(entry){
					     var row = {
					       id: entry._source.id,
					       url: entry._source.url,
					       name: entry._source.name
					   };
					  list.push(row);
 			 	});
 			 	deferred.resolve(list.length>0?list[0]:undefined);
    		}, function(error){
    	        $mwtnLog.error({component: 'private getFilteredSortedData', message: JSON.stringify(error.data)});
    	        deferred.reject(error);
    	      });

    	return deferred.promise;


    };

    service.addServer = function(name,url){
    	var deferred = $q.defer();
    	//check params

    	//check if contains
    	//insert into db

    	return deferred.promise;
    };
    service.removeServer = function(id){
    	var deferred = $q.defer();


    	return deferred.promise;
    };

    return service;
  });

});
