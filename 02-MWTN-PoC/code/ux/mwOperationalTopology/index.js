/**
 * @Description
 * Microwave Operational topology visual application, translates MW topology object into a Sigma graph 
 *
 * @Summary   Microwave operation topology display application
 *
 * @since     21.4.16
 * @auther 	  Gavriel Karasin (gavrielk@ceragon.com)
 * @requires mw.topo.js, jQuery, Bootstrap, Sigma.js
 * @copyright ONF
 */

/* @global */
var networkElementNameArr = [];
var plannedTimeSlotsArr = [];			// specify how many timeslots are planned for every link
var sigmaObj;
var siteArr; 							// "site" JSON that specifies the site coordinates and NE that it contains

/* @const */
var AIR_INTERFACE_NODE_SIZE = 3;
var DISTANCE_BETWEEN_AIR_INTERFACE_NODES = 7;


/**********************
 *      General       *
 **********************/
$(document).ready(function() {

	assignWebComponentsFunctionality();
	
  	setInterval(function(){ 
  		updateNetworkElementArr(); 
  		updateGraph();
	}, 2000);
});


/**********************
 *  UI Functionality  *
 **********************/
function assignWebComponentsFunctionality(){
	$("#update-button").click(function() {
		setControllerData(extractControllerData());
		updateNetworkElementArr();
		updateGraph();
	});

	$("#controller-ip").val(location.host);

	if($('#odl').is(':checked')){
		$("#controller-cred").show();
	}

	$("input[type=radio][name=controller-type]").change(function(){
		if ($(this).attr('id') == "odl"){
			$("#controller-cred").show();
		}
		else{
			$("#controller-cred").hide();
		}
	});

	$('input[type=radio][name=controller-type]').change(function() {
		if ($(this).attr('id') == "odl") {
	    	$("#layer-protocol").show( "drop");
	    }
	    else{
	    	$("#layer-protocol").hide( "drop");
	    }
	});
}

function updateNetworkElementArr(){
	if  (getControllerData() == undefined){
		setControllerData(extractControllerData());
	}

	extractNetworkElements(window.networkElementNameArr);
}

// Extract controller data from UI components
function extractControllerData(){
	var controllerIP = $("#controller-ip").val();
	var controllerPort = $("#controller-port").val();
	var controllerTypeStr = $('input[type=radio][name="controller-type"]:checked').val();
	var controllerTypeEnum;

	siteArr = $.parseJSON($("#site-json").val());

	window.networkElementNameArr.length = 0;;
	for (var i = 0; i < siteArr.length; i++){
		var siteNetworkElementArr = siteArr[i].neworkElementArr;
		for (var j = 0; j < siteNetworkElementArr.length; j++){
			window.networkElementNameArr.push(siteNetworkElementArr[j]);
		}
	}

	plannedTimeSlotsArr = $.parseJSON($("#planned-json").val());

	switch(controllerTypeStr) {
	    case "odl":
	        controllerTypeEnum = ControllerType.ODL;
	        break;
	    case "static":
	        controllerTypeEnum = ControllerType.STATIC;
	        break;
	    default:
	        controllerTypeEnum = ControllerType.STATIC;
	}

    controllerUsername = $("#controller-username").val();
    controllerPassword = $("#controller-password").val();
	
	return new ControllerData(controllerIP, controllerPort, controllerTypeEnum, controllerUsername, controllerPassword);
}


/*********************
 *     MW-Sigma      *
 *********************/
function updateGraph(){
	var mwNetworkElementArr = getMwNetworkElementArr();
    var mwLinkArr = extractMwLinks();

    topologyData = mwToSigma(mwNetworkElementArr, mwLinkArr);

	if (typeof sigmaObj === 'undefined'){
	    sigmaObj = new sigma({
		                    	graph: topologyData,
		                    	container: 'graph-container',
		                    	renderer: {
        							container: document.getElementById('graph-container'),
        							type: 'canvas'
    							},
		                    	settings: {
									defaultLabelColor: '#ec5148',
									doubleClickEnabled: false,
									labelThreshold: 8,
									minNodeSize: 0,
									maxNodeSize: 0,
								    enableEdgeHovering: true,
								    edgeHoverColor: 'edge',
								    defaultEdgeHoverColor: '#000',
								    edgeHoverSizeRatio: 2,
								    edgeHoverExtremities: true
        						}
		                	});
	    // Doesn't work well because it refereshes every second
		// var dragListener = sigma.plugins.dragNodes(sigmaObj, sigmaObj.renderers[0]);
	}
	else{
		
		sigmaObj.graph.clear();
		sigmaObj.graph.read(topologyData);
	}
	sigmaObj.refresh();
}

// Class SigmaNode	                                    
function SigmaNode(id, label, x, y, color, size){
	this.id = id;
	this.label = label;
	this.x = x;
	this.y = y;
    this.color =  color;
	this.size = size;
}

// Class SigmaEdge
function SigmaEdge(id, label, source, target, color){
	this.id = id;
	this.label = label;
	this.source = source;
	this.target = target;
	this.color = color;
	this.hover_color = color;
	this.size = 2;
}


// Class NetworkElementSiteInfo for placing NE and MW interfaces on the graph
function NetworkElementSiteInfo(site, indexInSite){
	this.site = site;
	this.indexInSite = indexInSite;
}


/**
 * @Summary												Translate MW Network element and links to Sigma nodes and edges
 * @param {MwNetworkElement[]} 	networkElementArr   	Mw Network elements
 * @param {MwLinks[]} 			networkElementArr   	Mw Links
 * @return {Graph} 				topologyData			Sigma nodes and edges	
 */
function mwToSigma(networkElementArr, mwLinkArr){
	return { 
			nodes: mwNetworkElementstoSigmaNodes(networkElementArr),
			edges: mwLinksToSigmaEdges(mwLinkArr)
		   };
}

/**
 * @Summary												Translate MW Network element array to Sigma node array
 * @param {MwNetworkElement[]} networkElementArr   		Mw Network elements
 * @return {SigmaNode[]} sigmaNodeArr					Sigma nodes	
 */
function mwNetworkElementstoSigmaNodes(networkElementArr){
	var sigmaNodeArr = [];

	// Add site nodes
	for (var i = 0; i < siteArr.length; i++){
		var siteNode = new SigmaNode(siteArr[i].siteName,
								   siteArr[i].siteName,
								   siteArr[i].x,
								   siteArr[i].y,
								   "rgba(190,190,190,0.3)",
								   3.5 * AIR_INTERFACE_NODE_SIZE * DISTANCE_BETWEEN_AIR_INTERFACE_NODES);
		sigmaNodeArr.push(siteNode);
	}

	// Add Network elements and MW interfaces
	for (var currentNetworkElementIndex = 0; currentNetworkElementIndex < networkElementArr.length; currentNetworkElementIndex++){
		var currentNetworkElement = networkElementArr[currentNetworkElementIndex];

		var siteInfo = getSiteByNetowrkElementId(currentNetworkElement.getId()); // NetworkElementSiteInfo
		if (siteInfo == undefined){
			console.log("Network element(" + currentNetworkElement.getId() + ") doesn't exist in any of the sites");
			continue;
		}

		var networkElementX = siteInfo.site.x;
		var networkElementY = siteInfo.site.y;
		var mwStructureEndpointInitialX;
		var mwStructureEndpointInitialY;

		var networkElementSize = AIR_INTERFACE_NODE_SIZE + (DISTANCE_BETWEEN_AIR_INTERFACE_NODES * (currentNetworkElement.mwStructureEndpointArr.length - 1));

		// Place NEs in a square shape edges inside the site circle 
		switch(siteInfo.indexInSite) {
		    case 0:
		        networkElementX += networkElementSize / 2;	//EAST
		        mwStructureEndpointInitialX = networkElementX;
		        mwStructureEndpointInitialY = networkElementY - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 1:
		        networkElementY += networkElementSize / 2;	// SOUTH
		        mwStructureEndpointInitialY = networkElementY;
		        mwStructureEndpointInitialX = networkElementX - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 2:
		        networkElementX -= networkElementSize / 2;	// WEST
		        mwStructureEndpointInitialX = networkElementX;
		        mwStructureEndpointInitialY = networkElementY - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 3:
		        networkElementY -= networkElementSize / 2;	// NORTH
		        mwStructureEndpointInitialY = networkElementY;
		        mwStructureEndpointInitialX = networkElementX - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    default:
		    	console.log("Up to 4 network elements are supported per site");
		    	continue;
		}

		// Add network element node
		var networkElementNode = new SigmaNode(currentNetworkElement.getId(),
											   currentNetworkElement.getId(),
											   networkElementX,
											   networkElementY,
											   "rgba(190,190,190,0.8)",
											   networkElementSize * 2);
		sigmaNodeArr.push(networkElementNode);

		// Add MW interfaces(LP)
		for (var currentMwStructureEndpointIndex = 0; currentMwStructureEndpointIndex < currentNetworkElement.mwStructureEndpointArr.length; currentMwStructureEndpointIndex++){
			var currentMwStructureEndpoint = currentNetworkElement.mwStructureEndpointArr[currentMwStructureEndpointIndex];
			var nodeName = currentMwStructureEndpoint.getGlobalUniqueId();

			var mwStructureEndpointNode = new SigmaNode(nodeName, nodeName, mwStructureEndpointInitialX, mwStructureEndpointInitialY,"#000", AIR_INTERFACE_NODE_SIZE);
			sigmaNodeArr.push(mwStructureEndpointNode);

			switch(siteInfo.indexInSite) {
			    case 0:
			        mwStructureEndpointInitialY += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//EAST
			        break;
			    case 1:
			        mwStructureEndpointInitialX += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//SOUTH
			        break;
			    case 2:
			        mwStructureEndpointInitialY += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//WEST
			        break;
			    case 3:
			        mwStructureEndpointInitialX += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//NORTH
			        break;
			}
		}
	}

	return sigmaNodeArr;
}

/**
 * @Summary								Translate MwLink array to SigmaEdge
 * @param {MwLink[]} mwLinkArr   		Mw links
 * @return {SigmaEdge[]} sigmaEdgeArr	Sigma edges		
 */
function mwLinksToSigmaEdges(mwLinkArr){
	var sigmaEdgeArr = [];

	for (var i = 0; i < mwLinkArr.length; i++){
		var color = "#666666";

		var effectiveCapacity = Math.round(mwLinkArr[i].getEffectiveCapacity() / 1000);
		var configuredCapacity = Math.round(mwLinkArr[i].getConfiguredCapacity() / 1000);
		try{
			var plannedCapacityAvailable = true;
			var plannedCapacity = Math.round((getPlannedTimeSlotValueByRadioSignalId(mwLinkArr[i].id) * mwLinkArr[i].getTimeSlotCapacity(1)) /1000);
			
		}
		catch(err){
			// If planned capacity not found, don't display it in the label
			console.log(err);
			plannedCapacityAvailable = false;
		}
		console.log(mwLinkArr[i]);

		// Determine edge color
		// If effective capacity is 0 -> grey
		// If configured < planned -> red
		// If effective = configured -> blue
		// If effective < configured -> yellow
		if (plannedCapacityAvailable == true && configuredCapacity != plannedCapacity){
			color = "#990000"; // Red
		}
		else if (effectiveCapacity != 0 && effectiveCapacity == configuredCapacity){
			color = "#3399ff"; // Blue
		}
		else if (effectiveCapacity > 0 && effectiveCapacity < configuredCapacity){
			color = "#ffcc66"; //yellow
		}
		else{
			color = "#666666"; //Grey
		}

		if (plannedCapacityAvailable == true){
			label = mwLinkArr[i].getId() + ":[" + effectiveCapacity + "," +  configuredCapacity + "," + plannedCapacity + "]";
		}
		else{
			label = mwLinkArr[i].getId() + ":[" + effectiveCapacity + "," +  configuredCapacity + "]";
		}

		// Make sure edge with the same ID doesn't exist, so Sigma doesn't crash
		if (isEdgeExists(sigmaEdgeArr, mwLinkArr[i].getId()) == false){
			sigmaEdgeArr.push(new SigmaEdge(mwLinkArr[i].getId(), label, mwLinkArr[i].mwStructureEndpoint1.getGlobalUniqueId(), mwLinkArr[i].mwStructureEndpoint2.getGlobalUniqueId(), color));
		}
	}

	return sigmaEdgeArr;
}

function getSiteByNetowrkElementId(id){
	for (var i = 0; i < siteArr.length; i++){
		var currentSite = siteArr[i];
		for (var j = 0; j < currentSite.neworkElementArr.length; j++){
			if (currentSite.neworkElementArr[j] == id){
				return new NetworkElementSiteInfo(currentSite, j);
			}
		}
	}
	return undefined;
}

function getPlannedTimeSlotValueByRadioSignalId(id){
	for (var i = 0 ;i < plannedTimeSlotsArr.length; i++){
		if (plannedTimeSlotsArr[i].radioSignalId == id){
			return plannedTimeSlotsArr[i].numberOfTimeSlots;
		}
	}
	throw "RadioslotId(" + id + ") not found in planned time slots";
}

function isEdgeExists(sigmaEdgeArr, edgeId){
	for (var i = 0; i < sigmaEdgeArr.length; i++){
		if (sigmaEdgeArr[i].id == edgeId){
			console.log("Edge with id " + edgeId + " already exists between (" + sigmaEdgeArr[i].source + "," + sigmaEdgeArr[i].target + ")");
				return true;
		}
	}
	return false;
}