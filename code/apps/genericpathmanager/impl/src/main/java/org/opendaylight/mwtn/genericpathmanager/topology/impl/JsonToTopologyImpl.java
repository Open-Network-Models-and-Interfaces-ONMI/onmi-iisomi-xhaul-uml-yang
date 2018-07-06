package org.opendaylight.mwtn.genericpathmanager.topology.impl;

import static org.opendaylight.mwtn.genericpathmanager.topology.constants.TopologyConstants.LAYER_PROTOCOL_NAME;
import static org.opendaylight.mwtn.genericpathmanager.topology.constants.TopologyConstants.LINK;
import static org.opendaylight.mwtn.genericpathmanager.topology.constants.TopologyConstants.NAME;
import static org.opendaylight.mwtn.genericpathmanager.topology.constants.TopologyConstants.NODE;
import static org.opendaylight.mwtn.genericpathmanager.topology.constants.TopologyConstants.TOPOLOGY;
import static org.opendaylight.mwtn.genericpathmanager.topology.constants.TopologyConstants.UUID;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.mwtn.genericpathmanager.topology.api.JsonToTopology;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToLayerProtocolName;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToName;
import org.opendaylight.mwtn.genericpathmanager.topology.link.JsonToLink;
import org.opendaylight.mwtn.genericpathmanager.topology.node.JsonToNode;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.Topology;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.TopologyBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Link;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

/**
 * {@link JsonToTopologyImpl} class to which takes Json file or Json filePath as input and translates it into TAPI Topology object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
class JsonToTopologyImpl implements JsonToTopology {
	/**
	 * grouping topology-g {
	 *     list node {
	 *          key 'uuid';
	 *          config false;
	 *          uses node-g;
	 *          description "none";
	 *      }
	 *      list link {
	 *          key 'uuid';
	 *          config false;
	 *          uses link-g;
	 *          description "none";
	 *      }
	 *      leaf-list layer-protocol-name {
	 *          type tapi-common:layer-protocol-name;
	 *          config false;
	 *          min-elements 1;
	 *          description "none";
	 *      }
	 *      uses tapi-common:resource-spec-g;
	 *      description "The ForwardingDomain (FD) object class models the ForwardingDomain topological component which is used to effect forwarding of transport characteristic information and offers the potential to enable forwarding. 
	 *          At the lowest level of recursion, an FD (within a network element (NE)) represents a switch matrix (i.e., a fabric). Note that an NE can encompass multiple switch matrices (FDs). ";
     *  }
     */

	private TopologyBuilder			_builder;
	private Topology				_topology;
	private List<Node>				_nodes;
	private List<Link>				_links;
	private List<LayerProtocolName> _layerProtocolName;

	/**
	 * {@link JsonToTopologyImpl} by passing the {@link JsonObject}
	 * @param jsonObject
	 */
	JsonToTopologyImpl(JsonObject jsonObject) {
		this.buildTopology(jsonObject);
	}

	/**
	 * {@link JsonToTopologyImpl} by passing the topology .json file
	 * 
	 * @param jsonFile
	 * @throws JsonIOException
	 * @throws JsonSyntaxException
	 * @throws FileNotFoundException
	 */
	JsonToTopologyImpl(File jsonFile) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		FileReader fileReader = new FileReader(jsonFile);
		readValues(fileReader);
	}

	/**
	 * buildTopology object
	 * @param object
	 */
	private void buildTopology(JsonObject object) {
		JsonObject	topology	= object.getAsJsonObject(TOPOLOGY);

		/**
		 * uses tapi-common:resource-spec-g;
		 */
		Uuid _uuid = Uuid.getDefaultInstance(topology.get(UUID).getAsString());
		// UUID of the Topology
		this._builder.setUuid(_uuid);
		// TopologyKey
		this._builder.setKey(new TopologyKey(_uuid));
		// Topology Name and Value
		JsonToName _name = new JsonToName();
		this._builder.setName(_name.getGlobalNameFromJson(topology.getAsJsonArray(NAME)));

		/**
		 * list node
		 */
		//Set Topology Nodes
		this._builder.setNode(this.getNodesFromJson(topology.getAsJsonArray(NODE)));

		/**
		 * list link
		 */
		//Set Topology Links
		this._builder.setLink(this.getLinksFromJson(topology.getAsJsonArray(LINK)));

		/**
		 * leaf-list layer-protocol-name
		 */
		//Set Topology LayerProtocolName
		this._builder.setLayerProtocolName((new JsonToLayerProtocolName()).getLayerProtocolNameFromJson(topology.getAsJsonArray(LAYER_PROTOCOL_NAME)));

		//Build the Topology Object
		this._topology = this._builder.build();

	}
	/**
	 * Initialize values from Topology JSON file
	 * 
	 * @param fileReader
	 */
	private void readValues(FileReader fileReader) {
		// Object of TopologyBuilder
		this._builder			= new TopologyBuilder();
		this._nodes				= new ArrayList<>();
		this._links				= new ArrayList<>();
		this._layerProtocolName	= new ArrayList<>();

		JsonParser	parser		= new JsonParser();
		Object		obj			= parser.parse(fileReader);
		JsonObject	jsonObj		= (JsonObject) obj;
		this.buildTopology(jsonObj);
	}

	/**
	 * Translate the Json Node to Java Node Object
	 * 
	 * @param nodeArray
	 * @return {@link List<Node>}
	 */
	private List<Node> getNodesFromJson(JsonArray nodeArray) {
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = nodeArray.iterator(); iter.hasNext(); ) {
			JsonObject nodeObject = iter.next().getAsJsonObject();
			this._nodes.add((new JsonToNode()).getNodeFromJson(nodeObject));
		}
		return this._nodes;
	}

	@Override
	public void addNode(JsonArray nodeArray) throws Exception {
		if(this._topology.getNode() != null) {
			this._nodes = this._topology.getNode();
			this._builder.setNode(this.getNodesFromJson(nodeArray));
			this._topology = this._builder.build();
		} else {
			throw new Exception("Object nodes in topology is not initialised.");
		}
	}

	/**
	 * Translate the Json Link to Java Link Object
	 * 
	 * @param linkArray
	 * @return {@link List<Link>}
	 */
	public List<Link> getLinksFromJson(JsonArray linkArray) {
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = linkArray.iterator(); iter.hasNext(); ) {
			JsonObject linkObject = iter.next().getAsJsonObject();
			this._links.add((new JsonToLink()).getLinkFromJson(linkObject));
		}
		return this._links;
	}

	/**
	 * Get the Topology Object
	 * 
	 * @return {@link Topology}
	 */
	@Override
	public Topology getTopology() {
		return this._topology;
	}

	/**
	 * Get the List of Node Objects
	 * 
	 * @return {@link List<Node>}
	 */
	@Override
	public List<Node> getTopologyNodes() {
		return this._nodes;
	}

	/**
	 * Get the List of Link Objects
	 * 
	 * @return {@link List<Link>}
	 */
	@Override
	public List<Link> getTopologyLinks() {
		return this._links;
	}

	/**
	 * Get the List of LayerProtocolName Objects
	 * 
	 * @return {@link List<LayerProtocolName>}
	 */
	@Override
	public List<LayerProtocolName> getTopologyLayerProtocolNames() {
		return this._layerProtocolName;
	}

	@Override
	public void addLink(JsonArray linkArray) throws Exception {
		if(this._topology.getNode() != null) {
			this._links = this._topology.getLink();
			this._builder.setLink(this.getLinksFromJson(linkArray));
			this._topology = this._builder.build();
		} else {
			throw new Exception("Object links in topology is not initialised.");
		}
	}
}
