function DeviceInfo(obj){
	if(obj !== undefined) {
		this.Id = obj.id;
		this.Vendor = obj.vendor;
		this.Device = obj.device;
		this.Version = obj.version;
		this.Xml = obj.xml;
	}
	else
		{
		this.Id = 0;
		this.Vendor = "unknown";
		this.Device = "unknown";
		this.Version = "0.0.0";
		this.Xml = "unknown.xml";		
		}

}
DeviceInfo.prototype.GetFullName = function()
{
	return this.Vendor + " "+ this.Device+" ("+this.Version+")";
}
function Version(str){
	var x=str.split('.');
	this.Main = parseInt(x[0]);
	this.Major = parseInt(x[1]);;
	this.Minor = parseInt(x[2]);;
}
Version.prototype.isBiggerThan = function(s)
{
	if(typeof(s)==='string')
		s=new Version(s);
	if(this.Main>s.Main)
		return true;
	if(this.Major>s.Major)
		return true;
	if(this.Minor>s.Minor)
		return true;
	return false;
}
function MediatorConfig(obj,server) {
	if (obj !== undefined) {
		this.Name = obj.Name;
		this.DeviceType = obj.DeviceType;
		this.DeviceIp = obj.DeviceIp;
		this.DevicePort = 'DevicePort' in obj?obj.DevicePort:161;
		this.TrapsPort = obj.TrapPort;
		this.IsNetConfConnected = obj.IsNCConnected;
		this.NetconfConnections = 'ncconnections' in obj?obj.ncconnections:[];
		this.IsNetworkElementConnected = obj.IsNeConnected;
		this.NeModel = obj.NeXMLFile;
		this.NetconfPort = obj.NcPort;
		this.PID = obj.pid;
		this.IsLocked = obj.islocked;
		this.Autorun = obj.autorun;
		this.FirewallRuleActive = obj.fwactive;
		this.OpenDaylightConfigs = obj.ODLConfig;
	} else {
		this.Name ="";
		this.DeviceType = -1;
		this.DeviceIp = "";
		this.DevicePort = 161;
		this.TrapsPort = 0;
		this.IsNetConfConnected = false;
		this.NetconfConnections=[];
		this.IsNetworkElementConnected = false;
		this.NeModel = "";
		this.NetconfPort = 0;
		this.PID =0;
		this.IsLocked = false;
		this.Autorun = false;
		this.FirewallRuleActive = false;
		this.OpenDaylightConfigs=[];
	}
	this.DeviceTypeString = server.getDeviceTypeString(this.DeviceType);
	var n=this.NetconfConnections===undefined?"0":this.NetconfConnections.length;
	var o=this.OpenDaylightConfigs===undefined?"0":this.OpenDaylightConfigs.length;
	this.ConnectionStatus = {Netconf:this.IsNetConfConnected,NetworkElement:this.IsNetworkElementConnected,NetconfConnetionsString:""+n+"/"+o}

}
MediatorConfig.prototype.refreshData = function(obj,server)
{
	if(obj!==undefined)
	{
		//this.Name = obj.Name;
		this.DeviceType = obj.DeviceType;
		this.DeviceIp = obj.DeviceIp;
		this.DevicePort = 'DevicePort' in obj?obj.DevicePort:161;
		this.TrapsPort = obj.TrapPort;
		this.IsNetConfConnected = obj.IsNCConnected;
		this.NetconfConnections = 'ncconnections' in obj?obj.ncconnections:[];
		this.IsNetworkElementConnected = obj.IsNeConnected;
		this.NeModel = obj.NeXMLFile;
		this.NetconfPort = obj.NcPort;
		this.PID = obj.pid;
		this.IsLocked = obj.islocked;
		this.Autorun = false;
		this.FirewallRuleActive = obj.fwactive;
		this.OpenDaylightConfigs = obj.ODLConfig;
	}
	this.DeviceTypeString = server.getDeviceTypeString(this.DeviceType);
	var n=this.NetconfConnections===undefined?"0":this.NetconfConnections.length;
	var o=this.OpenDaylightConfigs===undefined?"0":this.OpenDaylightConfigs.length;
	this.ConnectionStatus = {Netconf:this.IsNetConfConnected,NetworkElement:this.IsNetworkElementConnected,NetconfConnetionsString:""+n+"/"+o}

}
MediatorConfig.prototype.RefreshDeviceName = function(server)
{
	this.DeviceTypeString = server.getDeviceTypeString(this.DeviceType);
}

function MediatorConfigStatus(obj){
	this.Status=obj.Status;
	this.Name=obj.Name;
};
MediatorConfigStatus.STATUS_OKAY = 1;
MediatorConfigStatus.STATUS_CORRUPTED = 2;
MediatorConfigStatus.STATUS_LOCKED = 3;
MediatorConfigStatus.STATUS_REPAIRED = 4;
MediatorConfigStatus.StatusTypes=[
	{Value:MediatorConfigStatus.STATUS_OKAY,Name:"Okay"},
	{Value:MediatorConfigStatus.STATUS_CORRUPTED,Name:"Corrupted"},
	{Value:MediatorConfigStatus.STATUS_LOCKED,Name:"Locked"},
	{Value:MediatorConfigStatus.STATUS_REPAIRED,Name:"Repaired"}
];

MediatorConfig.DefaultDeviceInfos=[{
	id:0,vendor:"OpenSource",device:"Simulator",version:"1.0.0",xml:"DVM_MWCore12_BasicAir.xml"
}];
MediatorConfig.prototype.IsRunning = function() {
	return this.PID > 0;
}
MediatorConfig.prototype.TestParams = function() {
	if(this.Name===undefined || this.Name.length<=0)
		throw "Name is not given";
	// Name without spaces
	var inValidName = /\s/;
	if(inValidName.test(this.Name))
		throw "Name cannot have whitespaces";
	// DeviceType: int from 0 to ...
	if(this.DeviceType<0 || this.DeviceType>MediatorConfig.DeviceTypes[MediatorConfig.DeviceTypes.length-1].Value)
		throw "DeviceType is not set";
	// DeviceIp: valid IP-Address
	var validIpTest =/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
	if(!validIpTest.test(this.DeviceIp))
		throw "IP-Address is not valid";
	// TrapsPort: valid Port
	if(this.TrapsPort<=0 || this.TrapsPort>65535)
		throw "TrapsPort is not valid";
	// NeModel: valid XMLFilename
	if(this.NeModel===undefined || this.NeModel.length<=0)
		throw "NE XML Filename is not valid";
	// NetconfPort: valid Port
	if(this.NetconfPort<=0 || this.NetconfPort>65535)
		throw "Netconf Port is not valid";

	return true;
}
function PortRange(a)
{
	if(a!==undefined)
	{
		this.Min=a[0];
		this.Max=a[1];
	}
	else
	{
		this.Min=0;
		this.Max=0;
	}
}
function JavaMemParam(str)
{
	if(str!==undefined)
	{


	}
}
function ServerConfig(obj){
	if (obj !== undefined) {
		this.HomeDir = obj.home;
		this.Host = obj.host;
		this.Port = obj.port;
		this.NetconfRange=new PortRange(obj.ncrange);
		this.SnmpRange = new PortRange(obj.snmprange);
		this.JmxRange = new PortRange(obj.jmxrange);
		this.LogLevel = obj.loglevel;
		this.LogFile = obj.logfile;
		this.MediatorLogLevel = obj.mediator-loglevel;
		this.MediatorDevicePingTimeout=obj.mediator-devicepingtimeout;
		this.MediatorSnmpLatency = obj.mediator-snmplatency;
		this.MediatorMemory = new JavaMemParam(obj.mediator-memory);
	}
	else
	{
		this.HomeDir = "";
		this.Host = "";
		this.Port = 0;
		this.NetconfRange=new PortRange();
		this.SnmpRange = new PortRange();
		this.JmxRange = new PortRange();
		this.LogLevel = "";
		this.LogFile = "";
		this.MediatorLogLevel = "";
		this.MediatorDevicePingTimeout=0;
		this.MediatorSnmpLatency = 0;
		this.MediatorMemory = new JavaMemParam();
	}
}
function MediatorServer(url) {
	this._root = url;
	// if(this._root.endsWith("/"))
	this._root = this._root + "/";
	this._mediatorConfigs = [];
	this._neXMLFilenames = undefined;
	this._supportedDevices = [];
	this.defaultODLConfig = {Server:location.hostname,Port:8181,User:"admin",Password:"admin"};
	this._serverVersion=undefined;
	this._mediatorVersion=undefined;
	this._autoDeviceSupported=false;
}
MediatorServer.prototype.getConfigs = function(){return this._mediatorConfigs;}

MediatorServer.prototype.SetDefaultODLConfig = function(cfg)
{
	this.defaultODLConfig = cfg;
}
MediatorServer.prototype.GetDefaultODLConfig = function()
{
	return this.defaultODLConfig;
}
MediatorServer.prototype.GetSupportedDevices = function()
{
	return this._supportedDevices;
}
MediatorServer.prototype.SupportsAutoDevice = function()
{
	return this._autoDeviceSupported;
}
MediatorServer.prototype.GetXmlByType = function(devType)
{
	var xml=undefined;
	if(this._supportedDevices!==undefined && this._supportedDevices.length>0)
	{
		for(var i=0;i<this._supportedDevices.length;i++)
		{
			if(this._supportedDevices[i].Id==devType)
			{
				xml=this._supportedDevices[i].Xml;
				break;
			}
		}
	}
	return xml;
}
MediatorServer.prototype.getDeviceTypeString = function(deviceType)
{
	var i;
	if(this._supportedDevices!==undefined)
	{
		for(i=0;i<this._supportedDevices.length;i++)
		{
			if(this._supportedDevices[i].Id==deviceType)
				return this._supportedDevices[i].GetFullName();
		}
	}
	for(i=0;i<MediatorConfig.DefaultDeviceInfos.length;i++)
	{
		if(MediatorConfig.DefaultDeviceInfos[i].id==deviceType)
		{
			return new DeviceInfo(MediatorConfig.DefaultDeviceInfos[i]).GetFullName();
		}
	}
	return "unknown";
}
MediatorServer.prototype.refreshConfig = function(configs,cb)
{
	var changed = [];
	if(this._mediatorConfigs===undefined)
	{
		if(cb!==undefined)
			cb(changed);
		return;
	}
	if(configs!==undefined && configs.length>0)
	{
		var i,j;
		for(i=0;i<configs.length;i++)
		{
			//find config in array by name
			for(j=0;j<this._mediatorConfigs.length;j++)
			{
				if(this._mediatorConfigs[j].Name==configs[i].Name)
				{
					//refresh data
					this._mediatorConfigs[j].refreshData(configs[i],mediatorServer);
					changed.push(configs[i]);
					break;
				}
			}
		}
	}
	if(cb!==undefined)
		cb(changed);
}
MediatorServer.prototype.onConfigsReceived = function(configJSONArray) {
	this._mediatorConfigs = [];
	for (var i = 0; i < configJSONArray.length; i++) {
		var c = new MediatorConfig(configJSONArray[i],this);
		this._mediatorConfigs.push(c);
	}
}
MediatorServer.prototype.onNeXMLReceived = function(neXMLFilenamesArray) {
	this._neXMLFilenames = neXMLFilenamesArray;
}
MediatorServer.prototype.onSupportedDevicesReceived = function(devicesArray){
	this._supportedDevices = [];
	if(devicesArray!==undefined)
	{
		for(var i=0;i<devicesArray.length;i++)
		this._supportedDevices.push(new DeviceInfo(devicesArray[i]));
	}
}
MediatorServer.prototype.LoadSupportedDevices = function(cb,cbError) {
	if(this._supportedDevices!==undefined && this._supportedDevices.length>0)
	{
		if(cb!==undefined)
			cb(this._supportedDevices);
	}
	else
	{
		if(this._serverVersion!==undefined)
		{
			if(this._serverVersion.isBiggerThan("1.0.4"))
			{
				var _self = this;
				this.post("getdevices", function(response) {
					if (response.code == 1) {
						_self.onSupportedDevicesReceived(response.data);
						this._autoDeviceSupported=true;
						if (cb !== undefined)
							cb(_self._neXMLFilenames);
					} else
					{
						_self.log(response.data);
						if(cbError!==undefined)
							cbError(response.data);
					}
				},function(err){
					if(cbError!==undefined)
						cbError(err);
				});
			}
			else
			{
				this.onSupportedDevicesReceived(MediatorConfig.DefaultDeviceInfos);
				this._autoDeviceSupported=false;
			}
		}
		else
		{
			var _self = this;
			this.LoadVersion(function(){
				_self.LoadSupportedDevices(cb,cbError);
			});
		}
	}
}
MediatorServer.prototype.LoadNetworkElementXMLFiles = function(cb,cbError) {
	var _self = this;
	this.post("getnemodels", function(response) {
		if (response.code == 1) {
			_self.onNeXMLReceived(response.data);
			if (cb !== undefined)
				cb(_self._neXMLFilenames);
		} else
		{
			_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.LoadLogs = function(name,cb,cbError)
{
	var _self = this;
	this.post("getlog&name="+name,function(response){
		if (response.code == 1) {
			if (cb !== undefined)
				cb(response.data);
		} else
		{	_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.LoadAvailableNCPorts = function(cb,cbError)
{
	var _self = this;
	this.post("getncports",function(response){
		if (response.code == 1) {
			if (cb !== undefined)
				cb(response.data);
		} else
		{	_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.LoadAvailableSnmpPorts = function(cb,cbError)
{
	var _self = this;
	this.post("getsnmpports",function(response){
		if (response.code == 1) {
			if (cb !== undefined)
				cb(response.data);
		}
		else
		{
			_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.StartMediator = function(name, cb, cbError) {
	var _self = this;
	this.post("start",{name:name}, function(response) {
		if (response.code == 1) {
			if (cb !== undefined)
				cb(response.data);
		} else {
			_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.StopMediator = function(name, cb, cbError) {
	var _self = this;
	this.post("stop",{name:name}, function(response) {
		if (response.code == 1) {
			if (cb !== undefined)
				cb(response.data);
		} else {
			_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.ReloadConfig = function(name,cb,cbError)
{
	var _self = this;
	this.post("getconfig",{name:name},function(response){
		if (response.code == 1) {
			_self.refreshConfig(response.data,function(changes){
				if (cb !== undefined)
					cb(changes);
			});
		} else {
			_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}

	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});

}
MediatorServer.prototype.LoadConfigs = function(cb,cbError) {
	var _self = this;
	this.post("getconfig", function(response) {
		if (response.code == 1) {
			_self.onConfigsReceived(response.data);
			if (cb !== undefined)
				cb(_self._mediatorConfigs);
		} else {
			_self.log(response.data);
		}

	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.Repair = function(cb,cbError)
{
	var _self = this;
	this.post("repair", function(response) {
		if (response.code == 1) {
			if (cb !== undefined)
				cb(response.data);
		} else {
			_self.log(response.data);
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.LoadVersion = function(cb,cbError)
{
	var _self = this;
	this.post("version", function(response) {
		if (response.code == 1) {
			_self.onVersionsReceived(response.data);
			if (cb !== undefined)
				cb(response.data);
		} else {
			_self.log(response.data);
		}

	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.onVersionsReceived = function(versions){
	this._serverVersion = new Version(versions.server);
	this._mediatorVersion = new Version(versions.mediator);
}
/*
 * name: <String> deviceType: <int> deviceip: <Ipv4-String> trapsPort:<int>
 * nexml:<String> ncport:<int> cb: callback-function
 */
MediatorServer.prototype.CreateMediator = function(name,devicetype,deviceip,deviceport,trapsPort,nexml,ncport, cb, cbError) {

	var obj;
	try
	{
		obj=new MediatorConfig({
			Name:name,
			DeviceType:devicetype,
			DeviceIp:deviceip,
			DevicePort:deviceport,
			TrapPort:trapsPort,
			NeXMLFile:nexml,
			NcPort:ncport
		},this);
		obj.TestParams();
	}
	catch(e)
	{
		if(cbError!==undefined)
			cbError(e);
	}
	this.post("create", {
		config : JSON.stringify({
			Name : obj.Name,
			DeviceType : obj.DeviceType,
			DeviceIp : obj.DeviceIp,
			DevicePort : obj.DevicePort,
			TrapPort : obj.TrapsPort,
			NeXMLFile : obj.NeModel,
			NcPort : obj.NetconfPort,
			ODLConfig:[this.defaultODLConfig]
		})
	}, function(response) {
		if(response.code==1)
		{
			if(cb!==undefined)
				cb(true)
		}
		else
		{
			if(cbError!==undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.DeleteMediator = function(name, cb, cbError)
{
	var _self = this;
	this.post('delete', {name:name}, function(response){
		if(response.code==1)
		{
			if(cb!==undefined)
				cb(true);
		}
		else
		{
			if(cb!==undefined)
				cb(response.data);
		}

	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}
MediatorServer.prototype.ClearLock = function(name, cb, cbError) {
	var _self = this;
	this.post("clearlock", {
		name : name
	}, function(response) {
		if (response.code == 1) {
			if (cb !== undefined)
				cb(true);
		} else {
			_self.log(response.data);
			if (cbError !== undefined)
				cbError(response.data);
		}
	},function(err){
		if(cbError!==undefined)
			cbError(err);
	});
}

/*
 * do post request
 *
 * @params task
 */
MediatorServer.prototype.post = function(task, data, callback,callbackError) {
	var _self = this;
	if (typeof (data) === "function")
	{
		callbackError = callback;
		callback = data;
	}
	var cb=function(r) {
				if (callback !== undefined) {
					try {
						if (typeof (r) === "string")
							r = JSON.parse(r);
						callback(r);
					} catch (e) {
						_self.log(e);
						if(callbackError!==undefined)
							callbackError(e);
					}
				}
			};

	if(this.usejQueryv3)
	{
		$.post({
			url : this._root + "api/?task=" + task,
			data : data,
			success : cb
		});
	}
	else //jquery 1.x
	{
		if(typeof(data)=== "function")
		{
			$.post(this._root + "api/?task=" + task,cb).done(function() {
				_self.log( "second success" );
			  })
			  .fail(function(e) {
				  _self.log( "error" +e);
				  if(callbackError!==undefined)
					  callbackError(e);
			  })
			  .always(function() {
				  _self.log( "finished" );
			  });
		}
		else
		{
			$.post(this._root + "api/?task=" + task,data,cb).done(function() {
				_self.log( "second success" );
			  })
			  .fail(function(e) {
				  _self.log( "error" +e);
				  if(callbackError!==undefined)
					  callbackError(e);
			  })
			  .always(function() {
				  _self.log( "finished" );
			  });
		}
	}
}

MediatorServer.prototype._error = function(message) {
	console.log(message);
}
MediatorServer.prototype.log = function(message) {
//	console.log(message);
}