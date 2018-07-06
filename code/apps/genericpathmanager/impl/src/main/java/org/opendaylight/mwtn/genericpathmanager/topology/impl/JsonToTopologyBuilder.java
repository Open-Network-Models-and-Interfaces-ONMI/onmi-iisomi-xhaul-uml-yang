package org.opendaylight.mwtn.genericpathmanager.topology.impl;

import java.io.File;
import java.io.FileNotFoundException;

import org.opendaylight.mwtn.genericpathmanager.topology.api.JsonToTopology;

import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

public class JsonToTopologyBuilder {

	public static JsonToTopology getJsonToTopology(File jsonFile) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		return new JsonToTopologyImpl(jsonFile);
	}

	public static JsonToTopology getJsonToTopology(JsonObject object) {
		return new JsonToTopologyImpl(object);
	}

	public static void main(String[] args) throws JsonIOException, JsonSyntaxException, FileNotFoundException {
		File file = new File("src/main/resources/topology.json");
		JsonToTopology _buildTopology = JsonToTopologyBuilder.getJsonToTopology(file);
		_buildTopology.getTopology();
	}

}
