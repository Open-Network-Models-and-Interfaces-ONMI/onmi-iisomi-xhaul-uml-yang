package org.opendaylight.mwtn.genericpathmanager.topology;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
 * {@link JsonToTopology} class to which takes Json file or Json filePath as input and translates it into TAPI Topology object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToTopology{
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
	 * TopologyImpl by passing the path of topology JSON file
	 * 
	 * @param jsonFilePath
	 * @throws JsonIOException
	 * @throws JsonSyntaxException
	 * @throws FileNotFoundException
	 */
	public JsonToTopology(String jsonFilePath) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		FileReader fileReader = new FileReader(jsonFilePath);
		setJsonValues(fileReader);
	}

	/**
	 * TopologyImpl by passing the topology JSON file
	 * 
	 * @param jsonFile
	 * @throws JsonIOException
	 * @throws JsonSyntaxException
	 * @throws FileNotFoundException
	 */
	public JsonToTopology(File jsonFile) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		FileReader fileReader = new FileReader(jsonFile);
		setJsonValues(fileReader);
	}

	/**
	 * Initialize values from Topology JSON file
	 * 
	 * @param fileReader
	 */
	private void setJsonValues(FileReader fileReader) {
		// Object of TopologyBuilder
		this._builder = new TopologyBuilder();

		JsonParser parser = new JsonParser();
		Object obj = parser.parse(fileReader);
		JsonObject jsonObj = (JsonObject) obj;
		JsonObject topology = jsonObj.getAsJsonObject("topology");

		/**
		 * uses tapi-common:resource-spec-g;
		 */
		Uuid _uuid = Uuid.getDefaultInstance(topology.get("uuid").getAsString());
		// UUID of the Topology
		this._builder.setUuid(_uuid);
		// TopologyKey
		this._builder.setKey(new TopologyKey(_uuid));
		// Topology Name and Value
		JsonToName _name = new JsonToName();
		this._builder.setName(_name.setNameFromJson(topology.getAsJsonArray("name")));

		/**
		 * list node
		 */
		//Set Topology Nodes
		this._builder.setNode(this.setNodesFromJson(topology.getAsJsonArray("node")));

		/**
		 * list link
		 */
		//Set Topology Links
		this._builder.setLink(this.setLinksFromJson(topology.getAsJsonArray("link")));

		/**
		 * leaf-list layer-protocol-name
		 */
		//Set Topology LayerProtocolName
		JsonToLayerProtocolName _lpn = new JsonToLayerProtocolName();
		this._builder.setLayerProtocolName(_lpn.setLayerProtocolNameFromJson(topology.getAsJsonArray("layer-protocol-name")));

		//Build the Topology Object
		this._topology = this._builder.build();
	}

	/**
	 * Translate the Json Node to Java Node Object
	 * 
	 * @param nodeArray
	 * @return {@link List<Node>}
	 */
	public List<Node> setNodesFromJson(JsonArray nodeArray) {
		this._nodes	= new ArrayList<>();

		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = nodeArray.iterator(); iter.hasNext(); ) {
			JsonObject nodeObject = iter.next().getAsJsonObject();
			JsonToNode _node = new JsonToNode();
			Node node = _node.getNodeFromJson(nodeObject);
			this._nodes.add(node);
		}
		return this._nodes;
	}

	/**
	 * Translate the Json Link to Java Link Object
	 * 
	 * @param linkArray
	 * @return {@link List<Link>}
	 */
	public List<Link> setLinksFromJson(JsonArray linkArray) {
		this._links	= new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = linkArray.iterator(); iter.hasNext(); ) {
			JsonObject linkObject = iter.next().getAsJsonObject();
			JsonToLink _link = new JsonToLink();
			Link link = _link.getLinkFromJson(linkObject);
			this._links.add(link);
		}
		return this._links;
	}

	/**
	 * Translate the Json LayerProtocolName to Java LayerProtocolName Object
	 * 
	 * @param layerProtocolNameArray
	 * @return {@link List<LayerProtocolName>}
	 */
	public List<LayerProtocolName> setLayerProtocolNameFromJson(JsonArray layerProtocolNameArray) {
		this._layerProtocolName = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = layerProtocolNameArray.iterator(); iter.hasNext(); ) {
			String lpnObject = iter.next().getAsString();
			this._layerProtocolName.add(LayerProtocolName.valueOf(lpnObject));
		}
		return this._layerProtocolName;
	}

//	public void setNode(List<Node> nodes) {
//		this._nodes = nodes;
//	}
//
//	public void addNode(Node node) {
//		this._nodes.add(node);
//	}
//
//	public List<Node> getNodes() {
//		return this._nodes;
//	}
//
//	public void setLink(List<Link> links) {
//		this._links = links;
//	}
//
//	public void addLink(Link link) {
//		this._links.add(link);
//	}
//
//	public void setLayerProtocolNames(List<LayerProtocolName> listLayerProtocolName) {
//		this._layerProtocolName = listLayerProtocolName;
//	}
//
//	public void addLayerProtocolName(LayerProtocolName layerProtocolName) {
//		this._layerProtocolName.add(layerProtocolName);
//	}
//
	public static void main(String[] args) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		File file = new File("src/main/resources/topology.json");
		JsonToTopology _buildTopology = new JsonToTopology(file);
		_buildTopology.getTopology();
	}

	/**
	 * Get the Topology Object
	 * 
	 * @return {@link Topology}
	 */
	public Topology getTopology() {
		return this._topology;
	}

	/**
	 * Get the List of Node Objects
	 * 
	 * @return {@link List<Node>}
	 */
	public List<Node> getTopologyNodes() {
		return this._nodes;
	}

	/**
	 * Get the List of Link Objects
	 * 
	 * @return {@link List<Link>}
	 */
	public List<Link> getTopologyLinks() {
		return this._links;
	}

	/**
	 * Get the List of LayerProtocolName Objects
	 * 
	 * @return {@link List<LayerProtocolName>}
	 */
	public List<LayerProtocolName> getTopologyLayerProtocolNames() {
		return this._layerProtocolName;
	}
}
