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
import org.opendaylight.yangtools.yang.binding.DataContainer;

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

	private TopologyBuilder			_builder;
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

		Uuid _uuid = Uuid.getDefaultInstance(topology.get("uuid").getAsString());

		// UUID of the Topology
		_builder.setUuid(_uuid);

		// TopologyKey
		_builder.setKey(new TopologyKey(_uuid));

		// Topology Name and Value
		JsonToName _name = new JsonToName();
		_builder.setName(_name.setNameFromJson(topology.getAsJsonArray("name")));

		//Set Topology Nodes
		_builder.setNode(this.setNodesFromJson(topology.getAsJsonArray("node")));
		System.out.println("---------------------------------------");
		//Set Topology Links
		_builder.setLink(this.setLinksFromJson(topology.getAsJsonArray("link")));
		System.out.println("---------------------------------------");
		//Set Topology LayerProtocolName
		_builder.setLayerProtocolName(this.setLayerProtocolNameFromJson(topology.getAsJsonArray("layer-protocol-name")));
	}

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

	public List<LayerProtocolName> setLayerProtocolNameFromJson(JsonArray layerProtocolNameArray) {
		this._layerProtocolName = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = layerProtocolNameArray.iterator(); iter.hasNext(); ) {
			String lpnObject = iter.next().getAsString();
			this._layerProtocolName.add(LayerProtocolName.valueOf(lpnObject));
		}
		return this._layerProtocolName;
	}

	public void setNode(List<Node> nodes) {
		this._nodes = nodes;
	}

	public void addNode(Node node) {
		this._nodes.add(node);
	}

	public List<Node> getNodes() {
		return this._nodes;
	}

	public void setLink(List<Link> links) {
		this._links = links;
	}

	public void addLink(Link link) {
		this._links.add(link);
	}

	public void setLayerProtocolNames(List<LayerProtocolName> listLayerProtocolName) {
		this._layerProtocolName = listLayerProtocolName;
	}

	public void addLayerProtocolName(LayerProtocolName layerProtocolName) {
		this._layerProtocolName.add(layerProtocolName);
	}

	public static void main(String[] args) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		File file = new File("src/main/resources/topology.json");
		JsonToTopology _buildTopology = new JsonToTopology(file);
		_buildTopology.getImplementedInterface();
	}

	public Class<? extends DataContainer> getImplementedInterface() {
		return Topology.class;
	}

	public Topology geTopology() {
		return _builder.build();
	}

	public List<Node> getTopologyNodes() {
		return this._nodes;
	}

	public List<Link> getTopologyLinks() {
		return this._links;
	}

	public List<LayerProtocolName> getTopologyLayerProtocolNames() {
		return this._layerProtocolName;
	}
}
