ControllerType = {
    ODL : 0,
    STATIC : 1
}

LogLevelEnum = {
	NONE: 0,
	INFO: 1,
	DEBUG: 2
}

var logLevel = LogLevelEnum.INFO;
function log(level, message){
	if (level <= logLevel){
		console.log(message);
	}
}

// Class Network Element
// Will include a list of all the MW interfaces inside this element	                                    
function MwNetworkElement(id){
	this.id = id
	this.mwConnectionArr = [];

	this.getId = function(){
		return this.id;
	}
}

/**
 * MwConnection object class
 * @param {1} mwNetworkElement - reference to the containing MW NE 
 * @param {2} mwAirInterfaceJson - represent the Air Interface(physical radio port) data
 * @param {3} mwStructureJson - represent the Structure(radio link) data
 * @param {4} mwContainerJson - represent the Container(multi radio group) data - TBD
 */
function MwConnection(mwNetworkElement, mwAirInterface, mwStructure, mwContainer){
	this.containingMwNetworkElement = mwNetworkElement;// MwNetworkElement
	this.airInterfaceData = mwAirInterface;
	this.structureData = mwStructure;
	// this.containerData = new MwContainer(mwContainerJson);

	this.getId = function(){
		return this.containingMwNetworkElement.getId() + "-" + this.airInterfaceData.getId();
	}

	this.isLinkUp = function(){
		return this.airInterfaceData.isLinkUp();
	}

	this.getRadioSignalId = function(){
		return this.airInterfaceData.getRadioSignalId();
	}

	this.getEffectiveCapacity = function(){
		return this.structureData.getEffectiveCapacity();
	}

	this.getConfiguredCapacity = function(){
		return this.structureData.getConfiguredCapacity();
	}

	this.getTimeSlotCapacity = function(){
		return this.structureData.getTimeSlotCapacity();
	}
}

// Class mwAirInterface LTP
function MwAirInterface(mwAirInterfaceJson){
	this.data = mwAirInterfaceJson;

	this.getId = function(){
		return this.data.layerProtocol;
	}

	this.getName = function(){
		return this.data.layerProtocol;
	}

	this.getDescription = function(){
		return this.data.airInterfaceCapability.airInterfaceID;
	}

	this.getRadioSignalId = function(){
		return this.data.airInterfaceConfiguration.radioSignalId;
	}

	this.isLinkUp = function(){
		return this.data.airInterfaceStatus.linkIsUp;
	}
}

// Class mwStructure
function MwStructure(mwStructureJson){
	this.data = mwStructureJson;

	this.getEffectiveCapacity = function(){
		var numOfEnabledTimeSlots = 0;
		var timeSlotStatusArr = this.data.structureStatus.timeSlotStatusList;
		for(var i = 0; i < timeSlotStatusArr.length; i++){
			if (timeSlotStatusArr[i].operationalStatus == "ENABLED"){
				numOfEnabledTimeSlots++
			}
		}
		log(LogLevelEnum.DEBUG, "Number of enabled time slots is " + numOfEnabledTimeSlots);
		return numOfEnabledTimeSlots * this.data.structureCapability.timeSlotCapacity;
	}

	this.getConfiguredCapacity = function(){
		return this.data.structureCapability.totalNumberOfTimeSlots * this.data.structureCapability.timeSlotCapacity;
	}

	this.getTimeSlotCapacity = function(){
		return this.data.structureCapability.timeSlotCapacity;
	}
}

// Class Link
// source and target should point to mwConnection object
function MwLink(id, mwConnection1, mwConnection2){
	this.id = id;
	this.mwConnection1 = mwConnection1;
	this.mwConnection2 = mwConnection2;

	this.isUp = function(){
		if (mwConnection1.isLinkUp() == "false" || mwConnection2.isLinkUp() == "false"){
			return false;
		}
		else{
			return true;
		}
	}

	/**
	 * Read effective Capacity from According to the requirement, take the minimum of the two
	 */
	this.getEffectiveCapacity = function(){
		return Math.min(this.mwConnection1.getEffectiveCapacity(), this.mwConnection2.getEffectiveCapacity());
	}

	// According to the requirement, take the minimum of the two
	this.getConfiguredCapacity = function(){
		return Math.min(this.mwConnection1.getConfiguredCapacity(), this.mwConnection2.getConfiguredCapacity());
	}

	/**
	 * Get Time slot according to the mwConnection ID
	 * @param {1} id - 1 for mwConnection1 or 2 for mwConnection2
	 */
	this.getTimeSlotCapacity = function(id){
		switch(id) {
		    case 1:
		    	return this.mwConnection1.getTimeSlotCapacity();
		    case 2:
		    	return this.mwConnection2.getTimeSlotCapacity();
		    default:
		    	return undefined;
		}
	}
}

/**
 * Controller class
 */
function ControllerData(controllerIP, controllerPort, controllerType){
	this.controllerIP = controllerIP;
	this.controllerPort = controllerPort;
	this.controllerType = controllerType;
	//this.username
	//this.password
}

/**
 * Get Netowrk elements data(jSON) and fill the MW network element array
 * @param {1} controllerData - Contorller related credentials(IP, port, type)
 * @param {2} neNameArr - netowrk elements names which will be used in case of static mode to retrieve the JSON data
 * @param {3} mwNetworkElementArr - return parameter to hold the network element data in Objects
 */
function getNetworkElements(controllerData, neNameArr, mwNetworkElementArr){
	if (controllerData.controllerType == ControllerType.ODL){
		var baseUrl = "http://" + controllerData.controllerIP + ":" + controllerData.controllerPort + "/restconf/operational/network-topology:network-topology/topology/topology-netconf";
		odlSendAjax(baseUrl, odlExtractMwNetworkElements, ajaxErrorCallback, baseUrl, mwNetworkElementArr);
		log(LogLevelEnum.DEBUG, mwNetworkElementArr);
	}
	else{ 	// ControllerType.STATIC

		// For each NE get JSON data via AJAX and append it into relevant object to fill in the mwNetworkElementArr
		for (var i = 0; i < neNameArr.length; i++){
			$.ajax({
				url: "http://" + controllerData.controllerIP + ":" + controllerData.controllerPort + "/network-elements/" + neNameArr[i] + ".json",
    			async:false,
				cache:false,
				success: function(data, status){
			    	log(LogLevelEnum.DEBUG, "Data: " + JSON.stringify(data) + "\nStatus: " + status);
			    	var mwNetworkElement = new MwNetworkElement(neNameArr[i]);

			    	// For each physical interface(MwConnection) get MW_AirInterface_Pac and MW_Structure_Pac,
			    	// create an MwConnection Object and add it the mwNetworkElement data
			    	for (var j = 0; j < data.MW_AirInterface_Pac.length; j++){
			    		var mwAirInterface = new MwAirInterface(data.MW_AirInterface_Pac[j]);
			    		var mwStructure = new MwStructure(data.MW_Structure_Pac[j]);

			    		var mwConnection = new MwConnection(mwNetworkElement, mwAirInterface, mwStructure);

						mwNetworkElement.mwConnectionArr.push(mwConnection);
					}
					mwNetworkElementArr.push(mwNetworkElement);
	    		},
			    error: ajaxErrorCallback
	    	});
		}
	}
}

function odlExtractMwNetworkElements(data){
	// Parse passed parameters from odlSendAjax
	baseUrl = arguments[1][0];
	mwNetworkElementArr = arguments[1][1];

	// For each ODL node (network element) extract it's MwConnection and append to relevant data structures
	$.each(data.topology[0].node, function(index ,value){
		nodeName = value["node-id"];
		if (nodeName != "controller-config"){
			var layerProtocolArr = [];
	    	var mwNetworkElement = new MwNetworkElement(nodeName);

	    	// 1. Get all layer protocols from Core model
    		coreModelUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/" + nodeName;
    		odlSendAjax(coreModelUrl, extractLayerProtocolArr, ajaxErrorCallback, layerProtocolArr);

    		log(LogLevelEnum.DEBUG, layerProtocolArr);

	    	// 2. For each layer protocol add, create new MwAirInterface and add it to mwNetworkElement
	    	for (var i = 0;i < layerProtocolArr.length; i++){
	    		var mwAirInterface;
	    		var mwStructure;
	    		var mwContainer;
	    		var mwConnection;

	    		airInterfacePacUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/" + layerProtocolArr[i];
	    		structurePacUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Structure_Pac/" + layerProtocolArr[i].replace("MWPS", "MWS");
	    		// structurePacUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Container_Pac/" + layerProtocolArr[i].replace("MWPS", "MWS");

	    		mwAirInterface = odlSendAjax(airInterfacePacUrl, getMwAirInterface, ajaxErrorCallback);
	    		mwStructure = odlSendAjax(structurePacUrl, getStructure, ajaxErrorCallback);

	    		mwConnection = new MwConnection(mwNetworkElement, mwAirInterface, mwStructure, mwContainer);

	    		mwNetworkElement.mwConnectionArr.push(mwConnection);
			}
			try{
				mwNetworkElementArr.push(mwNetworkElement);
			}
			catch(err) {
				log(LogLevelEnum.INFO, "Failed to push mwNetworkElement to mwNetworkElementArr: " + err.message);
			}
		}
	});
}

function extractLayerProtocolArr(data){
	layerProtocolArr = arguments[1][0];
	if (layerProtocolArr != undefined){
		$.each(data.NetworkElement[0]._ltpRefList, function(index, value){
			if (value._lpList[0].uuid.indexOf('LP-MWPS-TTP') >= 0){
				layerProtocolArr.push(value._lpList[0].uuid);
				log(LogLevelEnum.DEBUG, "UUID: " + value._lpList[0].uuid);
			}
		});
	}
}


function getMwAirInterface(data){
	return new MwAirInterface(data.MW_AirInterface_Pac[0]);
}

function getStructure(data){
	return new MwStructure(data.MW_Structure_Pac[0]);
}

// 
function extractMwLinks(networkElementArr){
	var mwLinkArr = []; // MwLink

	for (var currentNetworkElementIndex = 0; currentNetworkElementIndex < networkElementArr.length; currentNetworkElementIndex++){
		currentNetworkElement = networkElementArr[currentNetworkElementIndex];
		
		for (var currentMwConntectionIndex = 0; currentMwConntectionIndex < currentNetworkElement.mwConnectionArr.length; currentMwConntectionIndex++){
			currentMwConnection = currentNetworkElement.mwConnectionArr[currentMwConntectionIndex];

			// Find the target node to add an edge
			for (var targetNetworkElementIndex = currentNetworkElementIndex + 1; targetNetworkElementIndex < networkElementArr.length; targetNetworkElementIndex++){
				targetNetworkElement = networkElementArr[targetNetworkElementIndex];
				for(var targetMwConnectionIndex = 0; targetMwConnectionIndex < targetNetworkElement.mwConnectionArr.length; targetMwConnectionIndex++){
					var targetMwConnection = targetNetworkElement.mwConnectionArr[targetMwConnectionIndex];
					if (currentMwConnection.getRadioSignalId() == targetMwConnection.getRadioSignalId()){
						mwLink = new MwLink(currentMwConnection.getRadioSignalId(), currentMwConnection, targetMwConnection);
						mwLinkArr.push(mwLink);
					}
				}
			}
		}
	}

	return mwLinkArr;
}

// AJAX utilities 
function odlSendAjax(url, successFunc, errorFunc){
	var inputParameters = Array.prototype.slice.call(arguments, odlSendAjax.length);	// Get the additional parameters, which are intended for the successFunc
	var result;
	$.ajax({
		url: url,
		timeout: 1000, // sets timeout to 3 seconds
		async: false,
		cache:false,
		beforeSend: function (xhr) {
		    xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
		},
		success: function(data){
			log(LogLevelEnum.DEBUG, "Data: " + JSON.stringify(data));
			log(LogLevelEnum.DEBUG, inputParameters);
			result = successFunc(data, inputParameters);
		},
	    error: errorFunc
	});
	return result;
}

function ajaxErrorCallback(jqXHR, textStatus, errorThrown) {
	log(LogLevelEnum.IFNO, jqXHR, textStatus, errorThrown);
}