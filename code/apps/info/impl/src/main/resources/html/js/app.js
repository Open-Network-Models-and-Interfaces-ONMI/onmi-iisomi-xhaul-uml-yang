Application = function(){

	this._baseUrl="/info";
}
Application.prototype._get = function(uri,cb,cbError){
	var _self = this;
	$.get({
		url:this._baseUrl+uri,
		method:'GET',
		success:function(r){
			try {
				if (typeof (r) === "string")
					r = JSON.parse(r);
				cb(r);
			} catch (e) {
				_self.log(e);
				if(cbError!==undefined)
					cbError(e);
			}
		}
	}).fail(function(){
		if(cbError!==undefined)
			cbError("error");

	});
}
Application.prototype._post = function(uri,data,cb,cbError){
	var _self = this;
	$.get({
		url:this._baseUrl+uri,
		method:'POST',
		data:data,
		success:function(r){
			try {
				if(r===undefined)
					r="";
				if(cb!==undefined){
					//if (typeof (r) === "string")
					//	r = JSON.parse(r);
					cb(r);
				}
			} catch (e) {
				_self.log(e);
				if(cbError!==undefined)
					cbError(e);
			}
		}
	}).fail(function(){
		if(cbError!==undefined)
			cbError("error");

	});
}

Application.prototype.loadBundleList = function(outputSelector){
	this._post("/api/data/bundle.list","",function(r){
		$(outputSelector).html(JSON.stringify(r));
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.loadAkkaConf = function(outputSelector){
	this._post("/api/data/akka.conf","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.loadGeoConf = function(outputSelector){
	this._post("/api/data/geo.conf","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.loadDevMgrProp = function(outputSelector){
	this._post("/api/data/devmgr.prop","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.loadEsYml = function(outputSelector){
	this._post("/api/data/es.yml","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.loadLogProp = function(outputSelector){
	this._post("/api/data/log.prop","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.createLogDL = function(){
	this._post("/api/data/log.download","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.createLogDLGet = function(){
	window.open(this._baseUrl+"/api/data/log.download");
}
Application.prototype.createDBBackup = function(outputSelector){
	this._post("/api/api/task/dbbackup.create","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}
Application.prototype.restoreDBBackup = function(outputSelector){
	this._post("/api/task/dbbackup.restore","",function(r){
		$(outputSelector).html(r);
	},function(e){
		$(outputSelector).html(e);
	});
}

Application.prototype.log = function(msg){
	console.log(msg);
}
