// Class Node	                                    
function SigmaNode(id, label, x, y, color, size){
	this.id = id;
	this.label = label;
	this.x = x;
	this.y = y;
    this.color =  color;
	this.size = size;
}

// Class Edge
function SigmaEdge(id, label, source, target, color){
	this.id = id;
	this.label = label;
	this.source = source;
	this.target = target;
	this.color = color;
	this.hover_color = color;
	this.size = 2;
}

var AIR_INTERFACE_NODE_SIZE = 3;
var DISTANCE_BETWEEN_AIR_INTERFACE_NODES = 7;

var sigmaObj;
var controllerData;
var siteArr; 							// Hold ths "site" json that specify the site coordinates and NE that it contains

var mwNetworkElementArr = [];
var networkElementNameArr = [];
var plannedTimeSlotsArr = [];			// Hold an array that specifies how many timeslots are planned for every link

$(document).ready(function() {
  	setInterval(function(){ 
  		updateNetwrokElementArr();
	}, 2000);
	
  	setInterval(function(){ 
  		updateGraph();
	}, 2000);
});

var networkElementArr = []; // MwNetworkElement
$("#update-button").click(function() {
	controllerData = extractControllerData();
	updateGraph();
	
});

function updateNetwrokElementArr(){
	if  (typeof controllerData === 'undefined'){
		controllerData = extractControllerData();
	}

	mwNetworkElementArr.length = 0;
	getNetworkElements(controllerData, networkElementNameArr, mwNetworkElementArr);
}

function updateGraph(){
	var mwLinkArr = []; // MwLink

    mwLinkArr = extractMwLinks(mwNetworkElementArr);

    topologyData = mwToSigma(mwNetworkElementArr, mwLinkArr);

	console.log(topologyData);

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

$('input[type=radio][name=controller-type]').change(function() {
	if ($(this).attr('id') == "odl") {
    	$("#layer-protocol").show( "drop");
    }
    else{
    	$("#layer-protocol").hide( "drop");
    }
});

function extractControllerData(){
	var controllerIP = $("#controller-ip").val();
	var controllerPort = $("#controller-port").val();
	var controllerTypeStr = $('input[type=radio][name="controller-type"]:checked').val();
	var controllerTypeEnum;

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

	siteArr = $.parseJSON($("#site-json").val());
	
	networkElementNameArr = [];
	for (var i = 0; i < siteArr.length; i++){
		var siteNetworkElementArr = siteArr[i].neworkElementArr;
		for (var j = 0; j < siteNetworkElementArr.length; j++){
			networkElementNameArr.push(siteNetworkElementArr[j]);
		}
	}
	console.log(networkElementNameArr);

	plannedTimeSlotsArr = $.parseJSON($("#planned-json").val());
	console.log(plannedTimeSlotsArr);

	return new ControllerData(controllerIP, controllerPort, controllerTypeEnum);
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
	return "error";
}

function NetworkElementSiteInfo(site, indexInSite){
	this.site = site;
	this.indexInSite = indexInSite;
}

function mwToSigma(networkElementArr, mwLinkArr){
	var sigmaNodeArr = [];
	var sigmaEdgeArr = [];


	for (var currentNetworkElementIndex = 0; currentNetworkElementIndex < networkElementArr.length; currentNetworkElementIndex++){
		var currentNetworkElement = networkElementArr[currentNetworkElementIndex];

		var siteInfo = getSiteByNetowrkElementId(currentNetworkElement.getId()); // NetworkElementSiteInfo
		if (siteInfo == "error"){
			console.log("Network element(" + currentNetworkElement.getId() + ") doesn't exist in any of the sites");
			continue;
		}

		var networkElementX = siteInfo.site.x;
		var networkElementY = siteInfo.site.y;
		var mwConnectionInitialX;
		var mwConnectionInitialY;

		var networkElementSize = AIR_INTERFACE_NODE_SIZE + (DISTANCE_BETWEEN_AIR_INTERFACE_NODES * (currentNetworkElement.mwConnectionArr.length - 1));

		// Place NEs in a square shape on it's edges
		switch(siteInfo.indexInSite) {
		    case 0:
		        networkElementX += networkElementSize / 2;	//EAST
		        mwConnectionInitialX = networkElementX;
		        mwConnectionInitialY = networkElementY - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 1:
		        networkElementY += networkElementSize / 2;
		        mwConnectionInitialY = networkElementY;
		        mwConnectionInitialX = networkElementX - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 2:
		        networkElementX -= networkElementSize / 2;	//EAST
		        mwConnectionInitialX = networkElementX;
		        mwConnectionInitialY = networkElementY - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 3:
		        networkElementY -= networkElementSize / 2;
		        mwConnectionInitialY = networkElementY;
		        mwConnectionInitialX = networkElementX - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		}

		// Add netowrk element node
		var networkElementNode = new SigmaNode(currentNetworkElement.getId(),
											   currentNetworkElement.getId(),
											   networkElementX,
											   networkElementY,
											   "rgba(190,190,190,0.8)",
											   networkElementSize * 2);
		sigmaNodeArr.push(networkElementNode);

		// Add MW nodes(LTP)
		for (var currentMwConnectionIndex = 0; currentMwConnectionIndex < currentNetworkElement.mwConnectionArr.length; currentMwConnectionIndex++){
			var currentMwConnection = currentNetworkElement.mwConnectionArr[currentMwConnectionIndex];
			var nodeName = currentMwConnection.getId();

			var mwConnectionNode = new SigmaNode(nodeName, nodeName, mwConnectionInitialX, mwConnectionInitialY,"#000", AIR_INTERFACE_NODE_SIZE);
			sigmaNodeArr.push(mwConnectionNode);

			switch(siteInfo.indexInSite) {
			    case 0:
			        mwConnectionInitialY += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//EAST
			        break;
			    case 1:
			        mwConnectionInitialX += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//SOUTH
			        break;
			    case 2:
			        mwConnectionInitialY += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//EAST
			        break;
			    case 3:
			        mwConnectionInitialX += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//SOUTH
			        break;
			}
		}
	}

	// Add site node
	for (var i = 0; i < siteArr.length; i++){
		var siteNode = new SigmaNode(siteArr[i].siteName,
								   siteArr[i].siteName,
								   siteArr[i].x,
								   siteArr[i].y,
								   "rgba(190,190,190,0.3)",
								   3.5 * AIR_INTERFACE_NODE_SIZE * DISTANCE_BETWEEN_AIR_INTERFACE_NODES);
		sigmaNodeArr.push(siteNode);
	}

	for (var i = 0; i < mwLinkArr.length; i++){
		var effectiveCapacity = Math.round(mwLinkArr[i].getEffectiveCapacity() / 1000);
		var configuredCapacity = Math.round(mwLinkArr[i].getConfiguredCapacity() / 1000);
		try{
			var plannedCapacityAvailable = true;
			var plannedCapacity = Math.round((getPlannedTimeSlotValueByRadioSignalId(mwLinkArr[i].id) * mwLinkArr[i].getTimeSlotCapacity(1)) /1000);
			
		}
		catch(err){
			// If planned capacity not found, don't display it in the label by marking plannedCapacity as -1
			console.log(err);
			plannedCapacityAvailable = false;
		}
		console.log(mwLinkArr[i]);

		// Determine edge color
		// If effective capacity is 0 -> Grey
		// If configured < planned -> Red
		// If effective = configured -> blue
		// If effective < configured -> orange
		color = "#666666"; //Grey
		if (plannedCapacityAvailable == true && configuredCapacity != plannedCapacity){
			color = "#990000";
		}
		else if (effectiveCapacity == configuredCapacity){
			color = "#3399ff";
		}
		else{
			color = "#ffcc66";
		}

		if (plannedCapacityAvailable == true){
			label = mwLinkArr[i].id + ":[" + effectiveCapacity + "," +  configuredCapacity + "," + plannedCapacity + "]";
		}
		else{
			label = mwLinkArr[i].id + ":[" + effectiveCapacity + "," +  configuredCapacity + "]";
		}
		sigmaEdgeArr.push(new SigmaEdge(mwLinkArr[i].id, label, mwLinkArr[i].mwConnection1.getId(), mwLinkArr[i].mwConnection2.getId(), color));
	}

	topologyData = { nodes: sigmaNodeArr, edges: sigmaEdgeArr};

    return topologyData;
}

function getPlannedTimeSlotValueByRadioSignalId(id){
	for (var i = 0 ;i < plannedTimeSlotsArr.length; i++){
		if (plannedTimeSlotsArr[i].radioSignalId == id){
			return plannedTimeSlotsArr[i].numberOfTimeSlots;
		}
	}
	throw "RadioslotId(" + id + ") not found in planned time slots";
}