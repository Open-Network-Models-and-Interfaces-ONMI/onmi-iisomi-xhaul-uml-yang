/*********************************************************************************
 *  Copyright © 2016, highstreet technologies GmbH
 *  All rights reserved!
 *
 *  http://www.highstreet-technologies.com/
 *
 *  The reproduction, transmission or use of this document or its contents is not
 *  permitted without express written authority. Offenders will be liable for
 *  damages. All rights, including rights created by patent grant or registration
 *  of a utility model or design, are reserved. Technical modifications possible.
 *  Technical specifications and features are binding only insofar as they are
 *  specifically and expressly agreed upon in a written contract.
 *
 *  @author: Herbert Eiselt [herbert.eiselt@highstreet-technologies.com]
 *********************************************************************************/
package org.opendaylight.mwtn.base.database;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;

import javax.annotation.Nullable;

import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesResponse;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse;
import org.elasticsearch.action.admin.indices.mapping.put.PutMappingResponse;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequestBuilder;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.cluster.node.DiscoveryNode;
import org.elasticsearch.common.bytes.BytesReference;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Herbert
 *
 */
public class HtDatabaseClientAbstract implements HtDataBase, AutoCloseable {

    private final Logger log = LoggerFactory.getLogger(HtDatabaseClientAbstract.class);

    private static int DELAYSECONDS = 10;
    private Client client;
    private String esIndexAlias;

    /**
     * Full database initialization.
     * @param esIndex Database index
     * @param esNodeserverName Servername or Server-IP that hosts the node.
     * @param esClusterName Name of the cluster
     * @param esNodeName  Name of the node within the cluster to connect to.
     * @throws UnknownHostException Servername not known.
     */
    public HtDatabaseClientAbstract(String esIndex, String esNodeserverName, String esClusterName, String esNodeName) throws UnknownHostException {

        this.esIndexAlias = esIndex;

        Settings settings = Settings.settingsBuilder()
                .put("cluster.name", esClusterName)
                .put("node.name", esNodeName)
                .build();
        this.client = getClient(esNodeserverName, settings);

    }

    /**
     * Do not use the hostname for getting the client
     * @param esIndex
     * @param esClusterName
     * @param esNodeName
     * @throws UnknownHostException
     */
    public HtDatabaseClientAbstract(String esIndex, String esClusterName, String esNodeName) throws UnknownHostException {

        this.esIndexAlias = esIndex;
        Settings settings = Settings.settingsBuilder()
                .put("cluster.name", esClusterName)
                .put("node.name", esNodeName)
                .build();
        this.client = getClient(null, settings);
    }


    /**
     * Simple database initialization. Query all ES configuration information from cluster node.
     * @param esIndex Database index
     * @param esNodeserverHostName Servername or Server-IP that hosts the node.
     * @throws UnknownHostException Servername not known.
     */

    public HtDatabaseClientAbstract(String esIndex, String esNodeserverHostName) throws UnknownHostException {

        this.esIndexAlias = esIndex;

        Settings settings = Settings.settingsBuilder()
                .put("client.transport.ignore_cluster_name",true)
                .put("client.transport.sniff", true)
                .build();
        this.client = getClient(esNodeserverHostName, settings);
    }

    /**
     * Simple database initialization. Query all ES configuration information from cluster node.
     * @param esIndex Database index
     * @param database databse node descriptor
     */
    public HtDatabaseClientAbstract(String esIndex, HtDatabaseNode database)  {

        this.esIndexAlias = esIndex;
    	this.client = database.getClient();
    }


    /*----------------------------------
     * some constructing functions, used by public constructors
     */
    /**
     *
     * @param esNodeserverName
     * @param settings
     * @return
     * @throws UnknownHostException
     */
    private final TransportClient getClient(@Nullable String esNodeserverName, Settings settings) throws UnknownHostException {

    	TransportClient newClient = TransportClient.builder().settings(settings).build();

        if (esNodeserverName != null) {
    		InetAddress nodeIp = InetAddress.getByName(esNodeserverName);
			newClient.addTransportAddress(new InetSocketTransportAddress(nodeIp, 9300));
    	}

        setup(newClient);
        return newClient;
    }

    private void setup(TransportClient newClient) {
        NodesInfoResponse nodeInfos = newClient.admin().cluster().prepareNodesInfo().get();
        String clusterName = nodeInfos.getClusterName().value();

        // ------ Debug/ Info
        StringBuffer logInfo = new StringBuffer();
        logInfo.append("Create ES Client an localhost for Cluster '");
        logInfo.append(clusterName);
        logInfo.append("' for index '");
        logInfo.append(esIndexAlias);
        logInfo.append("' Nodelist: ");
        for (DiscoveryNode node : newClient.connectedNodes()) {
            logInfo.append("(");
            logInfo.append(node.toString());
            logInfo.append(") ");
        }
        log.info(logInfo.toString());
        // ------ Debug/ Info

        log.info("Starting Database service. Short wait.");

		ClusterHealthResponse nodeStatus = newClient.admin().cluster().prepareHealth()
				.setWaitForGreenStatus()
				//.setWaitForYellowStatus()
		        .setTimeout(TimeValue.timeValueSeconds(DELAYSECONDS))
		        .get();
		log.debug("Elasticsearch client started with status {}",nodeStatus.toString());


        List<DiscoveryNode> nodeList = newClient.connectedNodes();

        if (nodeList.isEmpty()) {
            log.info("ES Client created for nodes: <empty node list>");
        } else {
            int t=0;
            for (DiscoveryNode dn : nodeList) {
                log.info("ES Client created for node#{}: {}",t , dn.getName());
            }
        }

        Runtime.getRuntime().addShutdownHook(new Thread(){
            @Override public void run(){
                log.info("Shutdown node "+HtDatabaseClientAbstract.class.getSimpleName());
            }
        });

        log.info("Database service started.");

    }


    /*----------------------------------
     * Getter / Setter
     */

    @Override
    public String getNetworkIndex() {
        return esIndexAlias;
    }

    @Override
    public void setNetworkIndex(String es_index) {
        this.esIndexAlias = es_index;
    }

    @Override
    public Client getClient() {
        return client;
    }

    /*----------------------------------
     * Functions
     */

    /**
     * Close function
     */
    public void close() {
    	client.close();
    }

    /**
     * Create an ES index. Delete an existing index.
     */
    public void doDeleteIndex() {
        log.info("Remove index {}", esIndexAlias);

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        try {

            // Delete index
            IndicesExistsResponse res = client.admin().indices().prepareExists(esIndexAlias)
                    .execute()
                    .actionGet();

            if (res.isExists()) {
                log.info("Delete Index start: {}",esIndexAlias);
                DeleteIndexRequestBuilder delIdx = client.admin().indices().prepareDelete(esIndexAlias);
                delIdx.execute().actionGet();
                log.info("Delete Index done.");
            }

        } catch (ElasticsearchException e) {
            log.warn(e.getDetailedMessage());
        }
    }

    /**
     * Verify if index already created
     * @return boolean accordingly
     */
    public boolean isExistsIndex() {

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        log.debug("Check status of ES index: {}", esIndexAlias);

        final IndicesExistsResponse indexStatus = client.admin()
            .indices().
            prepareExists(esIndexAlias).
            execute().
            actionGet();

        return indexStatus.isExists();

    }


    /**
     * Create and write the mapping and setting of the index
     * @param jsonString with mapping and setting definition Object or null for no configuration
     */
    public void doCreateIndexWithMapping(JSONObject jsonIndexMappingSetting) {

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        try {
        	String esIndexName = esIndexAlias+"_v1";
            log.debug("Create not existing ES index: {} with alias:{}", esIndexName, esIndexAlias);

            //Create index with mapping
            CreateIndexRequestBuilder createIndexRequestBuilder = client.admin().indices().prepareCreate(esIndexName);

            if(jsonIndexMappingSetting!=null) {
                // Handle optional mappings if requested
            	JSONObject jsonMapping = jsonIndexMappingSetting.optJSONObject("mappings");
            	if (jsonMapping != null) {
            		log.debug("Set mapping for index {} {}", esIndexAlias, jsonMapping);
            		Set<?> keys = jsonMapping.keySet();
            		log.debug("Found length:"+jsonMapping.length()+" keys:"+keys.size());
            		for (Object key : keys) {
            			String docType = (String)key;
            			log.debug("Doctype:{} mapping:{}",docType,jsonMapping.getJSONObject(docType).toString());
            			createIndexRequestBuilder.addMapping(docType, jsonMapping.getJSONObject(docType).toString());
            		}
            	} else {
            		log.debug("No mapping requested for index {}", esIndexAlias);
            	}
                // Handle optional settings if requested
            	JSONObject jsonSettings = jsonIndexMappingSetting.optJSONObject("settings");
            	if (jsonSettings != null) {
            		log.debug("Set setting for index {} {}", esIndexAlias, jsonSettings);
            		createIndexRequestBuilder.setSettings(Settings.settingsBuilder().loadFromSource(jsonSettings.toString()));
            	} else {
            		log.debug("No settings requested for index {}", esIndexAlias);
            	}
            }


            CreateIndexResponse createResponse = createIndexRequestBuilder.execute().actionGet();
            log.debug("CreateIndex response {}",createResponse);

            {
            //Set Alias
            log.debug("Set alias {} to index {}",esIndexAlias, esIndexName);
            IndicesAliasesResponse setAliasResponse = client.admin().indices().prepareAliases().addAlias(esIndexName,esIndexAlias)
            		.execute().actionGet();
            log.debug("CreateIndex response {}",setAliasResponse);
            }

        } catch (ElasticsearchException e) {
        	log.warn("ElasticsearchException: {}",e.getDetailedMessage());
        }
    }

    /**
     * Create Index with alias according to definition, but no mapping
     */
    public void doCreateIndex() {
    	doCreateIndexWithMapping(null);
    }

    /**
     * Write a JSON mapping definition for a document from a file to ES
     * Hint: A change of the mapping is not possible.
     * @param documentType Document type in focus
     * @param jsonString String with mapping definition in JSON Format
     */

    public void doWriteMappingJson( String jsonString) throws IllegalArgumentException {

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }
        if (jsonString == null) {
            String s = "Mapping string parameter is null";
            log.warn(s);
            throw new IllegalArgumentException(s);
        }

        try {
            // MAPPING GOES HERE
            log.debug("Check status of ES index: {}", esIndexAlias);

            final IndicesExistsResponse indexStatus = client.admin()
                .indices().
                prepareExists(esIndexAlias).
                execute().
                actionGet();

            if (indexStatus.isExists()) {
                log.debug("ES index exists: {}", esIndexAlias);
                // TODO: CHANGE Mapping is not working. This here works only for new datatypes

                PutMappingResponse res= client.admin().indices()
                .preparePutMapping(esIndexAlias)
                .setSource(jsonString)
                .execute()
                .actionGet();
                log.debug("Result: {}", res.toString());

            } else {
                log.debug("Create not existing ES index: {}", esIndexAlias);

                CreateIndexRequestBuilder createIndexRequestBuilder = client.admin().indices().prepareCreate(esIndexAlias);
                createIndexRequestBuilder
                .addMapping(jsonString)
                .execute()
                .actionGet();
            }

        } catch (ElasticsearchException e) {
            log.warn(e.getDetailedMessage());
        }
    }

    /**
     * Write a Json mapping definition for a document from a file to ES
     * @param fileName Filename with json definition.
     */
    public void doWriteMappingFromFile(String fileName) {


        log.info("Write mapping from File: {}", fileName);

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        if (fileName == null) {
            log.warn("No mapping for {} specified in parameter file.", esIndexAlias);
            return;
        }

        String content = null;

        try {
            content = new String(Files.readAllBytes(Paths.get(fileName)),"UTF-8");
        } catch (IOException e1) {
            log.warn("Can not read file: {}",e1.getMessage());
        }

        doWriteMappingJson(content);

    }

    /**
     * Write list with json objects from json files
     * @param docTypeAndFileName List with 2 String Array.
     *      String[0] Contains the dataType name
     *      String[1] Contains the filename
     */
    public void doWriteJsonFiles( List<String[]> docTypeAndFileName ) {

        log.debug("Write JSONFiles: {}", docTypeAndFileName.size());
        if (docTypeAndFileName != null) {
            int t = 1;
            for (String[] s : docTypeAndFileName) {
                if (s.length == 2) {
                    writeJsonObjectsFromFile( s[0], s[1]);
                } else {
                    log.warn("Wrong parameters number. Entry: {}", t);
                }
                t++;
            }
        }
    }

    /**
     * Write one object into Database
     * @param esId Database index
     * @param dataTypeName Name of datatype
     * @param json String in JSON format.
     * @return esId of the object
     */
    @Override
    public String doWrite( String dataTypeName, IsEsObject esId, String json) {
        return doWrite(dataTypeName, esId, json.getBytes());
    }

    /**
     * Write one object into Database
     * @param esId Database index
     * @param dataTypeName Name of datatype
     * @param json String in JSON format.
     * @return esId of the object
     */

    @Override
    public String doWrite( String dataTypeName, IsEsObject esId, byte[] json) {
       return doWrite(dataTypeName, esId.getEsId(), json);
    }

    /**
     * Write one object into Database
     * @param dataTypeName
     * @param id id of the object or null
     * @param json Object as json
     * @return esId of the Object
     */
    public String dowrite(String dataTypeName, String id, JSONObject json) {
       return doWrite(dataTypeName, id, json.toString().getBytes());
    }

    /**
     * Write one object into Database
     * @param esId Database index or null
     * @param dataTypeName Name of datatype
     * @param json String in JSON format.
     * @return esId of the object
     */

    public String doWrite( String dataTypeName, String esId, byte[] json) {

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        IndexRequestBuilder request = esId == null || esId.isEmpty() ?
                client.prepareIndex(esIndexAlias, dataTypeName) :
                    client.prepareIndex(esIndexAlias, dataTypeName, esId);

                IndexResponse response = null;
                try {
                    response = request.setSource(json).execute().actionGet();
                } catch (ElasticsearchException e) {
                    log.warn("ES Exception {} Json: {}", e.getMessage(), new String(json));
                }

                if (response == null) {
                    log.warn("Response null during write: {} {}", esId, new String(json));
                    return null;
                } else {
                    return response.getId();
                }
    }

    /**
     * Write JSON Data. First level contains datatype, next level id
     * Example
     *      "datatype" : {
     *           "id" : {
     *             }
     *           }
     *
     * @param da
     */
	public void doWriteJSONObject(JSONObject json) {

		Set<?> docTypes = json.keySet();
		log.debug("Found number of keys:"+json.length()+" keys:"+docTypes.size());
		for (Object docTypeKey : docTypes) {
			String docType = (String)docTypeKey;
			JSONObject objects = json.optJSONObject(docType);
			if (objects == null) {
				log.debug("Skip json {} with class {}",docType, json.get(docType).getClass());
			} else {
				Set<?> ids = objects.keySet();
				log.debug("write doctype {} with elements {}",docType,ids.size());
				for (Object idKey : ids) {
					String id = (String)idKey;

					JSONObject jsonIdObject = objects.optJSONObject(id);
					if (jsonIdObject == null) {
						log.debug("Skip jsonsub {} with class {}",id, objects.get(id).getClass());
					} else {
						if (log.isTraceEnabled()) {
							log.trace("Jsonsub object of id {} '{}'", id, jsonIdObject);
						}
						this.doWrite(docType, id, jsonIdObject.toString().getBytes());
					}
				}
			}
		}
	}


	/**
     * Remove Object from database
     */
    @Override
    public boolean doRemove( String dataTypeName, IsEsObject esId ) {

        if (esIndexAlias == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        DeleteResponse response = client.prepareDelete(esIndexAlias, dataTypeName, esId.getEsId())
                .execute()
                .actionGet();

        return response.isFound();
    }

    /**
     * Read Json Object from database
     */
    @Override
    public BytesReference doReadJsonData( String dataTypeName, IsEsObject esId ) {

        log.debug("NetworkIndex: {}",esIndexAlias);
        if (esId.getEsId() == null) {
            throw new IllegalArgumentException("Read access to object without database Id");
        }

        GetResponse response = client.prepareGet(esIndexAlias, dataTypeName, esId.getEsId())
                //.setOperationThreaded(false)
                .execute()
                .actionGet();

        BytesReference json = response.getSourceAsBytesRef();
        return json;
    }

    @Override
    public SearchHit[] doReadByQueryJsonData( int start, int length, String dataTypeName, QueryBuilder qb ) {

        log.debug("NetworkIndex: {}",esIndexAlias);

        SearchResponse response1 = client.prepareSearch(esIndexAlias)
                .setTypes(dataTypeName)
                .setQuery( qb )
                .setFrom(start).setSize(length)
                .execute().actionGet();

        SearchHit hits[] = response1.getHits().hits();
        return hits;
    }


    @Override
    public SearchHit[] doReadAllJsonData( int start, int length, String dataTypeName ) {

        log.debug("NetworkIndex: {}",esIndexAlias);

        //Use query
        QueryBuilder qb = QueryBuilders.matchAllQuery();

        SearchResponse response1 = client.prepareSearch(esIndexAlias)
                .setTypes(dataTypeName)
                .setQuery( qb )
                .setFrom(start).setSize(length)
                .execute().actionGet();

        SearchHit hits[] = response1.getHits().hits();
        return hits;
    }



    /**
     * Write Json datetype that is specified by file to ES
     * @param dataType    ES Datatype name
     * @param fileName    file name
     */
    public void writeJsonObjectsFromFile( String dataType, String fileName ) {

        log.debug("Start: Index: '{}' ' datatype: '{}'  File: '{}'", esIndexAlias, dataType, fileName);

        String content = null;

        try {
            content = new String( Files.readAllBytes(Paths.get(fileName)), "UTF-8");
        } catch (IOException e1) {
            log.warn("Can not read file: {}",e1.getMessage());
        }

        if (content != null && content.charAt(0) == 0xfeff) {
            content = content.substring(1);
            log.debug("Delete first char {} {}", dataType, fileName);
        }

        if (content != null) {
            IndexResponse response = null;
            try {
                response = client.prepareIndex(esIndexAlias, dataType)
                        .setSource(content)
                        .execute()
                        .actionGet();
            } catch (ElasticsearchException e) {
                log.error("ElasticsearchException during write:  for {} from {}", e.getMessage(), dataType, fileName);
            } catch (Exception e) {
                log.error("Exception during write:  for {} from {}", e.getMessage(), dataType, fileName);
            }

            if (response != null) {
                if (! response.isCreated()) {
                    log.warn("Jackson Response not created: {} {} {}", response.toString(), dataType, fileName);
                } else {
                    log.debug("Created: {}", response.getId());
                }
            } else {
                log.warn("Jackson Response null after write {} {}", dataType, fileName);
            }
        }

    }

    @Override
    public void closeDb() {
    }

}
