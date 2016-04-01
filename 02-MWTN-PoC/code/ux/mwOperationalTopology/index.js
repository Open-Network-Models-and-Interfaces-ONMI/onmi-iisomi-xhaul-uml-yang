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
// var NE_NODE_SIZE = 15;
// var SITE_RADIUS_COEFFICIENT = NE_RADIUS_COEFFICIENT*6;

var siteArr = 	[
					{
						"siteName": "Hamburg",
						"x": 100,
						"y": 100,
						// "neworkElementArr":["mw-111"]
						"neworkElementArr":["Ceragon-1", "SIAE-1"]
					},
					{
						"siteName": "Berlin",
						"x": 160,
						"y": 140,
						// "neworkElementArr":["mw-112"]
						"neworkElementArr":["Ceragon-2"]
					},
					{
						"siteName": "Munich",
						"x": 130,
						"y": 200,
						"neworkElementArr":["SIAE-2"]
					}
				];

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
			alert("Network element(" + currentNetworkElement.getId() + ") doesn't exist in any of sites");
			continue;
		}

		var networkElementX = siteInfo.site.x;
		var networkElementY = siteInfo.site.y;
		var airInterfaceInitialX;
		var airInterfaceInitialY;

		var networkElementSize = AIR_INTERFACE_NODE_SIZE + (DISTANCE_BETWEEN_AIR_INTERFACE_NODES * (currentNetworkElement.mwAirInterfaceArr.length - 1));

		switch(siteInfo.indexInSite) {
		    case 0:
		        networkElementX += networkElementSize / 2;	//EAST
		        airInterfaceInitialX = networkElementX;
		        airInterfaceInitialY = networkElementY - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
		        break;
		    case 1:
		        networkElementY += networkElementSize / 2;
		        airInterfaceInitialY = networkElementY;
		        airInterfaceInitialX = networkElementX - (networkElementSize / 2) + (AIR_INTERFACE_NODE_SIZE / 2);
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
		for (var currentAirInterfaceIndex = 0; currentAirInterfaceIndex < currentNetworkElement.mwAirInterfaceArr.length; currentAirInterfaceIndex++){
			var currentAirInterface = currentNetworkElement.mwAirInterfaceArr[currentAirInterfaceIndex];
			var nodeName = currentAirInterface.getId();

			var airInterfaceNode = new SigmaNode(nodeName, nodeName, airInterfaceInitialX, airInterfaceInitialY,"#000", AIR_INTERFACE_NODE_SIZE);
			sigmaNodeArr.push(airInterfaceNode);

			switch(siteInfo.indexInSite) {
			    case 0:
			        airInterfaceInitialY += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//EAST
			        break;
			    case 1:
			        airInterfaceInitialX += DISTANCE_BETWEEN_AIR_INTERFACE_NODES;	//SOUTH
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
		color = "#666666";
		console.log(mwLinkArr[i]);
		if (mwLinkArr[i].isUp() == true){
			color = "#3399ff"
		}
		sigmaEdgeArr.push(new SigmaEdge(mwLinkArr[i].id, mwLinkArr[i].id, mwLinkArr[i].mwAirInterface1.getId(), mwLinkArr[i].mwAirInterface2.getId(), color));
	}

	topologyData = { nodes: sigmaNodeArr, edges: sigmaEdgeArr};

	console.log(topologyData);

    return topologyData;
}

var topologyData;
var sigmaObj;
$(document).ready(function() {
	var networkElementArr = []; // MwNetworkElement
	var mwLinkArr = []; // MwLink

	networkElementArr = getNetworkElements("127.0.0.1", "80", ControllerType.SELF);
    mwLinkArr = extractMwLinks(networkElementArr);

    topologyData = mwToSigma(networkElementArr, mwLinkArr);

	console.log(topologyData);

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
									// defaultLabelAlignment: 'bottom'
        						}
		                	});

	var dragListener = sigma.plugins.dragNodes(sigmaObj, sigmaObj.renderers[0]);

	sigmaObj.refresh();

  	setInterval(function(){ 
  		updateGraph();
	}, 1000);
});



	function updateGraph(){
		// var networkElementArr = []; // MwNetworkElement
		// var mwLinkArr = []; // MwLink
		// networkElementArr = getNetworkElements("127.0.0.1", "80");
	 //    mwLinkArr = extractMwLinks(networkElementArr);

	 //    topologyData = mwToSigma(networkElementArr, mwLinkArr);

	 //    sigmaObj.graph = topologyData;

	 	topologyData.edges[0].color = "#000";


  		sigmaObj.refresh();
	}