/**
 * @Description
 * Provide topology operational services for Microwave SDN applications
 * The classes represent the hirarchy and relations between the ONF data model(https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/02-MWTN-PoC/models/24-reducedCoreModel-MWTN-Prio1)
 * Public API for fetching the object classes and extracting information from it
 *
 * @Summary   Microwave operational topology library
 *
 * @since     21.4.16
 * @auther 	  Gavriel Karasin (gavrielk@ceragon.com)
 * @requires  jQuery
 * @copyright ONF
 */

ControllerType = {
    ODL : 0,
    STATIC : 1
}

/*********************
 *      Classes      *
 *********************/

/*
 * @Public
 * @Class ControllerData - Hold controller related information
 */
function ControllerData(controllerIP, controllerPort, controllerType, controllerUsername, controllerPassword){
	this.controllerIP = controllerIP;
	this.controllerPort = controllerPort;
	this.controllerType = controllerType;
	this.controllerUsername = controllerUsername;
	this.controllerPassword = controllerPassword;
}

/**
 * @Public
 * @Class MwNetworkElement - 	Represent MW network element which contains a lists of models(AirInterfaces, Structure, Container)
 *								For ease of use, MwStructureEndpoint class will represent the AirInterface<-->Structure relation
 * @param {String} id - 		Structure endpoint, unique to the containing netowkr element
 * @wavers						1) No need to support containers and 
 * 								2) Air interface has 1 to 1 relation with Structure
 */                                    
function MwNetworkElement(id){
	this.id = id;
	this.mwStructureEndpointArr = [];

	this.getId = function(){
		return this.id;
	}

	this.getStructureEndpointById = function(id){
		for (var i = 0; i < this.mwStructureEndpointArr.length; i++){
			if (this.mwStructureEndpointArr[i].getId() == id){
				return this.mwStructureEndpointArr[i];
			}
		}
		return undefined;
	}
}


/**
 * @Public
 * @Class MwStructureEndpoint 					aggregates the MW Sructure and AirInterface(1 by 1 relation) in a MwNetworkElement
 * 												For ease of use, MwStructureEndpoint class will represent the AirInterface<-->Structure relation
 * @param {MwNetworkElement} mwNetworkElement   Reference to the containing MW NE 
 * @param {String} id 							Structure endpoint, unique to the containing netowkr element
 * @param {MwAirInterface} mwAirInterface 	 	related MwAirInterface
 * @param {MwStructure} mwStructure 			related MwStructure
 * @todo mwContainer - related MwContainer
 */
function MwStructureEndpoint(mwNetworkElement, id, mwAirInterface, mwStructure, mwContainer){
	this.containingMwNetworkElement = mwNetworkElement;// MwNetworkElement
	this.id = id;
	this.airInterfaceData = mwAirInterface;
	this.structureData = mwStructure;
	// this.containerData = new MwContainer(mwContainerJson);

	// Unique to the containing network element
	this.getId = function(){
		return id;
	}

	// Unique to the whole network
	this.getGlobalUniqueId = function(){
		return this.containingMwNetworkElement.getId() + "-" + this.structureData.getId();
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

/**
 * @Public
 * @Class MwAirInterface - Physical section MW AirInterface Layer Protocol
 * @param {JSON} mwAirInterfaceJson
 */
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

/**
 * @Public
 * @Class MwStructure - MW Structure Layer Protocol
 * @param {JSON} mwStructureJson
 */
function MwStructure(mwStructureJson){
	// @Private
	this.data = mwStructureJson;

	// @Public

	this.getId = function(){
		return this.data.layerProtocol;
	}

	// Count the number of operationalStatus=ENABLED time slots in the time slot timeSlotStatusList
	this.getEffectiveCapacity = function(){
		var numOfEnabledTimeSlots = 0;
		var timeSlotStatusArr = this.data.structureStatus.timeSlotStatusList;
		for(var i = 0; i < timeSlotStatusArr.length; i++){
			if (timeSlotStatusArr[i].operationalStatus == "ENABLED"){
				numOfEnabledTimeSlots++
			}
		}
		return numOfEnabledTimeSlots * this.data.structureCapability.timeSlotCapacity;
	}

	// Capacity(Kbps) = number of time slots * time slot capacity(Kbps)
	this.getConfiguredCapacity = function(){
		return this.data.structureCapability.totalNumberOfTimeSlots * this.data.structureCapability.timeSlotCapacity;
	}

	// Time slot capacity in Kbps
	this.getTimeSlotCapacity = function(){
		return this.data.structureCapability.timeSlotCapacity;
	}
}

/**
 * @Public
 * @Class MwLink - MW link connection between 2 MW structure endpoints
 * @param {String} id
 * @param {MwStructureEndpoint} mwStructureEndpoint1 - reference to one of the link MW structure endpoints
 * @param {MwStructureEndpoint} mwStructureEndpoint2
 */
function MwLink(id, mwStructureEndpoint1, mwStructureEndpoint2){
	// @Private
	this.id = id;
	this.mwStructureEndpoint1 = mwStructureEndpoint1;
	this.mwStructureEndpoint2 = mwStructureEndpoint2;

	// @Public

	this.getId = function(){
		return this.id;
	}

	// return true if both endpoints are up
	this.isUp = function(){
		if (this.mwStructureEndpoint1.isLinkUp() == "false" || this.mwStructureEndpoint2.isLinkUp() == "false"){
			return false;
		}
		else{
			return true;
		}
	}

	//get effective Capacity from According to the requirement, take the minimum of the two
	this.getEffectiveCapacity = function(){
		return Math.min(this.mwStructureEndpoint1.getEffectiveCapacity(), this.mwStructureEndpoint2.getEffectiveCapacity());
	}

	// According to the requirement, take the minimum of the two
	this.getConfiguredCapacity = function(){
		return Math.min(this.mwStructureEndpoint1.getConfiguredCapacity(), this.mwStructureEndpoint2.getConfiguredCapacity());
	}

	/**
	 * Get Time slot according to the MwStructureEndpoint ID
	 * @param {1} id - 1 for mwStructureEndpoint1 or 2 for mwStructureEndpoint2
	 */
	this.getTimeSlotCapacity = function(id){
		switch(id) {
		    case 1:
		    	return this.mwStructureEndpoint1.getTimeSlotCapacity();
		    case 2:
		    	return this.mwStructureEndpoint2.getTimeSlotCapacity();
		    default:
		    	return undefined;
		}
	}
}

/*
 * @global 		MwNetworkElementArr array
 * @Summary		Manage network elements data structure
 * @private
 */
var mwNetworkElementArr = [];

/*
 * @Global
 * @Summary		Manage network elements data structure
 * @private
 */
var controllerData; // Global ControllerData instance


/*********************
 * Public Functions  *
 *********************/


/**
 * @public
 */
function getMwNetworkElementById(id){
	for (var i = 0; i < window.mwNetworkElementArr.length; i++){
		if (window.mwNetworkElementArr[i].getId() == id){
			return window.mwNetworkElementArr[i];
		}
	}
	return undefined;
}

/**
 * @public
 */
function getMwNetworkElementArr(){
	return window.mwNetworkElementArr;
}

function setControllerData(controllerData){
	window.controllerData = controllerData;

	// empty MW NE array to refresh Netowrk element data
	window.mwNetworkElementArr.length = 0;
}

function getControllerData(){
	return window.controllerData;
}

/*
 * @Public
 * @Summary 					Extract Netowrk elements data(JSON) and fill the MW network element array
 * @param {Strin[]} neNameArr - netowrk elements names which will be used in case of STATIC mode to retrieve the JSON data
 */
function extractNetworkElements(neNameArr){
	if (getControllerData().controllerType == ControllerType.ODL){
		var restPath = "/restconf/operational/network-topology:network-topology/topology/topology-netconf";
		odlSendAjax(restPath, odlExtractMwNetworkElements, ajaxErrorCallback, restPath);
	}
	else{ 	// ControllerType.STATIC
		window.mwNetworkElementArr.length = 0;
		staticExtractMwNetworkElements(neNameArr);
	}
}

/**
 * @Public
 * @Summary 							Extract MW links from the mwNetworkElementArr by matching the signal radio IDs of the Structure endpoints
 */
function extractMwLinks(){
	var mwLinkArr = []; // MwLink

	for (var currentNetworkElementIndex = 0; currentNetworkElementIndex < window.mwNetworkElementArr.length; currentNetworkElementIndex++){
		currentNetworkElement = window.mwNetworkElementArr[currentNetworkElementIndex];
		
		for (var currentMwConntectionIndex = 0; currentMwConntectionIndex < currentNetworkElement.mwStructureEndpointArr.length; currentMwConntectionIndex++){
			currentMwStructureEndpoint = currentNetworkElement.mwStructureEndpointArr[currentMwConntectionIndex];

			// Find the target node to add an edge
			for (var targetNetworkElementIndex = currentNetworkElementIndex + 1; targetNetworkElementIndex < window.mwNetworkElementArr.length; targetNetworkElementIndex++){
				targetNetworkElement = window.mwNetworkElementArr[targetNetworkElementIndex];
				for(var targetMwStructureEndpointIndex = 0; targetMwStructureEndpointIndex < targetNetworkElement.mwStructureEndpointArr.length; targetMwStructureEndpointIndex++){
					var targetMwStructureEndpoint = targetNetworkElement.mwStructureEndpointArr[targetMwStructureEndpointIndex];
					if (currentMwStructureEndpoint.getRadioSignalId() == targetMwStructureEndpoint.getRadioSignalId()){
						mwLink = new MwLink(currentMwStructureEndpoint.getRadioSignalId(), currentMwStructureEndpoint, targetMwStructureEndpoint);
						mwLinkArr.push(mwLink);
					}
				}
			}
		}
	}

	return mwLinkArr;
}

/*********************
 *      Private      *
 *********************/


/*********************
 *    OpenDaylight   *
 *********************/

/**
 * @Private
 * @Summary					Build/update MW network elements data by fetching it from ODL
 * @param {JSON} data   	ODL Netconf Toplogy JSON data
 * @param {String} baseUrl	Netconf Toplogy module REST URL (will be used for further ODL requests)
 */
function odlExtractMwNetworkElements(data){
	// Parse passed parameters from odlSendAjax
	baseUrl = arguments[1][0];

	// For each ODL node (network element) extract it's MwStructureEndpoint and append to relevant data structures
	$.each(data.topology[0].node, function(index ,value){
		nodeName = value["node-id"];
		if (nodeName != "controller-config"){
	    	//Get all layer protocols from Core model and extract network element related data
    		coreModelUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/" + nodeName;
    		odlSendAjax(coreModelUrl, extractAssociations, ajaxErrorCallback, extractMwNetworkElementData);
		}
	});
}

/*
 * @Private
 * @Summary							Based on the ONF Core model match assocaiated MwAirInterface and MwContainer to MwStructure
 * @param {JSON} ne 				Network element's core model representation, including all LTP/LP references 
 * @param {JSON} callback			Function that will be ran with the association map
 */
function extractAssociations(ne) {
	ne = ne.NetworkElement[0];
    var callback = arguments[1][0];
	var ltpAssociationMap = {};

    //console.info(JSON.stringify(ne._ltpRefList)); 

    // for each MW Structure UUID find associated MW Physical Section UUID
	ne._ltpRefList.map(function(ltp){
		//console.log(ltp._lpList[0].uuid, ltp._lpList[0].layerProtocolName);
		if (ltp._lpList[0].layerProtocolName === 'MWS') {
			try{
				ltpAssociationMap[ltp._serverLtpRefList[0]] = {
				    lp: getActualLP(ne, ltp._serverLtpRefList[0]),
				    clients : {}
				};
			}
			catch (e){
				console.log("Failed to get container for " + ltp.uuid);
			}
			try{
				ltpAssociationMap[ltp._serverLtpRefList[0]].clients[ltp.uuid] = {
				    lp: getActualLP(ne, ltp.uuid),
				    clients : {}
				};
			}
			catch (e){
				console.log("Failed to get container for " + ltp.uuid);
			}
			try{
				ltpAssociationMap[ltp._serverLtpRefList[0]].clients[ltp.uuid].clients[ltp._clientLtpRefList[0]] = {
				    lp:getActualLP(ne, ltp._clientLtpRefList[0])
				};
			}
			catch (e){
				console.log("Failed to get container for " + ltp.uuid);
			}
		}
	});
	// console.log('treeA', JSON.stringify(ltpAssociationMap));
	callback(ne.uuid, ltpAssociationMap);
}


/*
 * @Private
 * @Summary							Find relevant uuid in the NE core model data
 * @param {JSON} ne 				Network element's core model representation, including all LTP/LP references 
 * @param {JSON} callback			target uuid to search for
 */
function getActualLP(ne, search) {
	var result = 'notFound!';
	try{
		ne._ltpRefList.map(function(ltp){
		  if (ltp.uuid === search) {
		    result = ltp._lpList[0].uuid;
		    var hash = [ne.uuid, result].join('-');
		    return result;
		  }
		});
	}
	catch (e){
		console.log(e);
	}
	if (result == 'notFound!'){
		throw "uuid(" + search + ") not found";
	}
	return result;
}

/**
 * @Private
 * @Summary					Extract MW AirInterface, Structure and Conatiner(TBD) Pacs to relevant Network element/Structure endpoint
 * @param {JSON} data
 */
function extractMwNetworkElementData(nodeName, ltpAssociationMap){
	console.log("LTP association map for " + nodeName + ": " + JSON.stringify(ltpAssociationMap));
	var mwNetworkElement = getMwNetworkElementById(nodeName);

	// Check if netowrk element already exists in the array, if not create it
	if (mwNetworkElement == undefined){
		mwNetworkElement = new MwNetworkElement(nodeName);
		window.mwNetworkElementArr.push(mwNetworkElement);
	}

	// 2. For each layer protocol add, create new MwAirInterface and add it to mwNetworkElement
	for (var key in ltpAssociationMap){
		mwStructureLayerProtocol = ltpAssociationMap[key].lp;
		var mwStructureEndpoint = mwNetworkElement.getStructureEndpointById(mwStructureLayerProtocol);

		if (mwStructureEndpoint == undefined){
			mwStructureEndpoint = new MwStructureEndpoint(mwNetworkElement, mwStructureLayerProtocol);
			mwNetworkElement.mwStructureEndpointArr.push(mwStructureEndpoint);
		}

		// Extract Pacs URLs
		mwAirInterfaceLP = ltpAssociationMap[key].clients[Object.keys(ltpAssociationMap[key].clients)[0]].lp; // Get MW physical section(AirInterface) layer protocol ID
		airInterfacePacUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/" + mwStructureLayerProtocol;
		structurePacUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Structure_Pac/" + mwAirInterfaceLP;
		// containerPacUrl = baseUrl + "/node/" + nodeName + "/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Container_Pac/" + layerProtocolArr[i].replace("MWPS", "MWS");

		odlSendAjax(airInterfacePacUrl, getMwAirInterface, ajaxErrorCallback, nodeName, mwStructureEndpoint.getId());
		odlSendAjax(structurePacUrl, getMwStructure, ajaxErrorCallback, nodeName, mwStructureEndpoint.getId());
	}
}


/**
 * @Private
 * @Summary									Append data(MwAirInterface) into relevant MW structure endpoint
 * @param {JSON} data 	    				JSON objects which represents a MW Air Interface model
 * @param {String} mwNetworkElementId 	    Network element ID which contains this Mw Structure
 * @param {String} structureEndpointId 	    Structure endpoint ID which contains this Mw Structure
 */
function getMwAirInterface(data){
    var mwNetworkElementId = arguments[1][0];
    var structureEndpointId = arguments[1][1];
	var mwAirInterface = new MwAirInterface(data.MW_AirInterface_Pac[0]);
	
	// Add mwAirInterface to relevant MwStructureEndpoint
	var ne = getMwNetworkElementById(mwNetworkElementId);
	if (ne != undefined){
		var structureEndpoint = ne.getStructureEndpointById(structureEndpointId);
		if (structureEndpoint != undefined){
			structureEndpoint.airInterfaceData = mwAirInterface; // 
		}
		else{
			console.log("[getMwAirInterface] MW structure endpoint (" + structureEndpointId + ") not found for MW network element (" + mwNetworkElementId + ")");
		}
	}
	else{
		console.log("[getMwAirInterface] MW network element (" + mwNetworkElementId + ") not found");
	}
}

/**
 * @Private
 * @Summary									Append data(MwStructure) into relevant MW structure endpoint
 * @param {JSON} data 	    				JSON objects which represents a MW structure model
 * @param {String} mwNetworkElementId 	    Network element ID which contains this Mw Structure
 * @param {String} structureEndpointId 	    Structure endpoint ID which contains this Mw Structure
 */
function getMwStructure(data){
    var mwNetworkElementId = arguments[1][0];
    var structureEndpointId = arguments[1][1];
	var mwStructure = new MwStructure(data.MW_Structure_Pac[0]);
	
	// Add mwStructure to relevant MwStructureEndpoint
	var ne = getMwNetworkElementById(mwNetworkElementId);
	if (ne != undefined){
		var structureEndpoint = ne.getStructureEndpointById(structureEndpointId);
		if (structureEndpoint != undefined){
			structureEndpoint.structureData = mwStructure; 
		}
		else{
			console.log("[getMwStructure] MW structure endpoint (" + structureEndpointId + ") not found for MW network element (" + mwNetworkElementId + ")");
		}
	}
	else{
		console.log("[getMwStructure] MW network element (" + mwNetworkElementId + ") not found");
	}
}


/**
 * @Private
 * @Summary						Wrapper function for sending requests for ODL
 * @IMPORTENT					The function receives additional arguments which will be passed to the success callback
 * @param {JSON} restPath		Target REST URL for the request
 * @param {JSON} successFunc	Callback which will be invoked for a successfull response
 * @param {JSON} errorFunc		Callback which will be invoked for a error response
 */
function odlSendAjax(restPath, successFunc, errorFunc){
	var inputParameters = Array.prototype.slice.call(arguments, odlSendAjax.length);	// Get the additional parameters, which are intended for the successFunc
	var result;
	var url = "http://" + getControllerData().controllerIP + ":" + getControllerData().controllerPort + restPath;
	$.ajax({
		url: url,
		timeout: 3000, // sets timeout to 3 seconds
		cache:false,
		// crossDomain: true,
		beforeSend: function (xhr) {
		    xhr.setRequestHeader ("Authorization", "Basic " + btoa(getControllerData().controllerUsername + ":" + getControllerData().controllerPassword));
		},
		success: function(data){
			// console.log("Data: " + JSON.stringify(data));
			// console.log(inputParameters);
			result = successFunc(data, inputParameters);
		},
	    error: errorFunc
	});
	return result;
}

function ajaxErrorCallback(jqXHR, textStatus, errorThrown) {
	console.log(jqXHR, textStatus, errorThrown);
}



/*********************
 *       Static      *
 *********************/

/**
 * @Private
 * @Summary				ODL AJAX utilities 
 * @param {JSON} data
 */
function staticExtractMwNetworkElements(neNameArr){
	// For each NE get JSON data via AJAX and append it into relevant object to fill in the mwNetworkElementArr
	for (var i = 0; i < neNameArr.length; i++){
		$.ajax({
			url: "http://" + getControllerData().controllerIP + ":" + getControllerData().controllerPort + "/network-elements/" + neNameArr[i] + ".json",
			async:false,
			cache:false,
			dataType: "json",
			success: function(data, status){
		    	// console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
		    	var mwNetworkElement = new MwNetworkElement(neNameArr[i]);

		    	// For each physical interface(MwStructureEndpoint) get MW_AirInterface_Pac and MW_Structure_Pac,
		    	// create an MwStructureEndpoint Object and add it the mwNetworkElement data
		    	for (var j = 0; j < data.MW_AirInterface_Pac.length; j++){
		    		var mwAirInterface = new MwAirInterface(data.MW_AirInterface_Pac[j]);
		    		var mwStructure = new MwStructure(data.MW_Structure_Pac[j]);

		    		var mwStructureEndpoint = new MwStructureEndpoint(mwNetworkElement, j, mwAirInterface, mwStructure);

					mwNetworkElement.mwStructureEndpointArr.push(mwStructureEndpoint);
				}
				window.mwNetworkElementArr.push(mwNetworkElement);
    		},
		    error: ajaxErrorCallback
    	});
	}
}