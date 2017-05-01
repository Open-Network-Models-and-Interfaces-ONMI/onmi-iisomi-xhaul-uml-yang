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
import java.security.InvalidParameterException;
import java.util.List;
import java.util.Properties;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
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
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Herbert
 *
 */
public class HtDatabaseClientAbstract implements HtDataBase {

    private static final String PROPERTY_ES_CLUSTERNAME = "ES_CLUSTERNAME";
    private static final String PROPERTY_ES_NODESERVERNAME = "ES_NODESERVERNAME";
    private static final String PROPERTY_ES_NODENAME = "ES_NODENAME";
    private static final String PROPERTY_ES_INDEX = "ES_INDEX";

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private TransportClient client;
    private String esIndex;

    /**
     * Full database initialization via properties.
     * @param properties Properties file with related properties
     *                 The properties, defined by constants must contain entries for all properties
     *                 PROPERTY_ES_INDEX Index in the database to be used
     *                 PROPERTY_ES_NODESERVERNAME hostname or IP of hostiing server to contact.
     *                 PROPERTY_ES_CLUSTERNAME name of the cluster. If empty cluster and nodename are sniffed.
     *                 PROPERTY_ES_NODENAME name of the node within the cluster. If empty cluster and nodename are sniffed.
     * @throws UnknownHostException Host not known
     * @throws InvalidParameterException Index parameter not correct
     */
    public HtDatabaseClientAbstract(Properties properties) throws UnknownHostException, InvalidParameterException {

        String esClusterName = properties.getProperty(PROPERTY_ES_CLUSTERNAME, "");
        String esNodeName = properties.getProperty(PROPERTY_ES_NODENAME, "");
        String esNodeserverName = properties.getProperty(PROPERTY_ES_NODESERVERNAME, "localhost");
        this.esIndex = properties.getProperty(PROPERTY_ES_INDEX, "");

        if (esIndex == null || esIndex.isEmpty()) {
            throw new InvalidParameterException("Empty es index not allowed here");
        }

        Settings settings;
        if (esClusterName.isEmpty() || esNodeName.isEmpty()) {
            settings = Settings.settingsBuilder()
                    .put("client.transport.ignore_cluster_name",true)
                    .put("client.transport.sniff", true)
                    .build();
        } else {
            settings = Settings.settingsBuilder()
                .put("cluster.name", esClusterName)
                .put("node.name", esNodeName)
                .build();
        }

        constructor(esNodeserverName, settings);
    }

    /**
     * Full database initialization.
     * @param esIndex Database index
     * @param esNodeserverName Servername or Server-IP that hosts the node.
     * @param esClusterName Name of the cluster
     * @param esNodeName  Name of the node within the cluster to connect to.
     * @throws UnknownHostException Servername not known.
     */
    public HtDatabaseClientAbstract(String esIndex, String esNodeserverName, String esClusterName, String esNodeName) throws UnknownHostException {

        this.esIndex = esIndex;

        Settings settings = Settings.settingsBuilder()
                .put("cluster.name", esClusterName)
                .put("node.name", esNodeName)
                .build();

        this.client = constructor(esNodeserverName, settings);
    }

    /**
     * Simple database initialization. Query all ES configuration information from cluster node.
     * @param esIndex Database index
     * @param esNodeserverHostName Servername or Server-IP that hosts the node.
     * @throws UnknownHostException Servername not known.
     */

    public HtDatabaseClientAbstract(String esIndex, String esNodeserverHostName) throws UnknownHostException {

        this.esIndex = esIndex;

        Settings settings = Settings.settingsBuilder()
                .put("client.transport.ignore_cluster_name",true)
                .put("client.transport.sniff", true)
                .build();

        this.client = constructor(esNodeserverHostName, settings);
    }


    /*----------------------------------
     * single constructor function, used by all public constructors
     */

    private final TransportClient constructor(String esNodeserverName, Settings settings) throws UnknownHostException {

        InetAddress nodeIp = InetAddress.getByName(esNodeserverName);

        TransportClient newClient = TransportClient.builder().settings(settings).build()
                .addTransportAddress(new InetSocketTransportAddress(nodeIp, 9300));

        NodesInfoResponse nodeInfos = newClient.admin().cluster().prepareNodesInfo().get();
        String clusterName = nodeInfos.getClusterName().value();

        // ------ Debug/ Info
        StringBuffer logInfo = new StringBuffer();
        logInfo.append("Create ES Client an localhost for Cluster '");
        logInfo.append(clusterName);
        logInfo.append("' for index '");
        logInfo.append(esIndex);
        logInfo.append("' Nodelist: ");
        for (DiscoveryNode node : newClient.connectedNodes()) {
            logInfo.append("(");
            logInfo.append(node.toString());
            logInfo.append(") ");
        }
        log.info(logInfo.toString());
        // ------ Debug/ Info

        log.info("Starting Database service. Short wait.");
        try {
            Thread.sleep(2500);                 //1000 milliseconds is one second.
        } catch(InterruptedException ex) {
            Thread.currentThread().interrupt();
        }

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
        return newClient;
    }


    /*----------------------------------
     * Getter / Setter
     */

    @Override
    public String getNetworkIndex() {
        return esIndex;
    }

    @Override
    public void setNetworkIndex(String es_index) {
        this.esIndex = es_index;
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
    }

    /**
     * Create an ES index. Delete an existing index.
     */
    public void doCreateIndex() {
        log.info("Create index {}", esIndex);

        if (esIndex == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        try {

            // Delete index
            IndicesExistsResponse res = client.admin().indices().prepareExists(esIndex)
                    .execute()
                    .actionGet();

            if (res.isExists()) {
                log.info("Delete Index start: {}",esIndex);
                DeleteIndexRequestBuilder delIdx = client.admin().indices().prepareDelete(esIndex);
                delIdx.execute().actionGet();
                log.info("Delete Index done.");
            }

        } catch (ElasticsearchException e) {
            log.warn(e.getDetailedMessage());
        }
    }

    /**
     * Write a JSON mapping definition for a document from a file to ES
     * @param documentType Document type in focus
     * @param jsonString String with mapping definition in JSON Format
     */

    @Override
    public void doWriteMappingJson( String documentType, String jsonString) throws IllegalArgumentException {


        log.debug("Write mapping from json string for {} with content {}", documentType, jsonString);

        if (esIndex == null) {
            throw new IllegalArgumentException("Missing Index");
        }
        if (jsonString == null) {
            String s = "Mapping string parameter is null";
            log.warn(s);
            throw new IllegalArgumentException(s);
        }

        try {
            // MAPPING GOES HERE
            log.debug("Check status of ES index: {}", esIndex);

            final IndicesExistsResponse indexStatus = client.admin()
                .indices().
                prepareExists(esIndex).
                execute().
                actionGet();

            if (indexStatus.isExists()) {
                log.debug("ES index exists: {}", esIndex);
                // TODO: CHANGE Mapping is not working. This here works only for new datatypes

                PutMappingResponse res= client.admin().indices()
                .preparePutMapping(esIndex)
                .setType(documentType)
                .setSource(jsonString)
                .execute()
                .actionGet();
                log.debug("Result: {}", res.toString());

            } else {
                log.debug("Create not existing ES index: {}", esIndex);

                CreateIndexRequestBuilder createIndexRequestBuilder = client.admin().indices().prepareCreate(esIndex);
                createIndexRequestBuilder
                .addMapping(documentType, jsonString)
                .execute()
                .actionGet();
            }

            // TODO [sko] HOW TO WRITE NEW MAPPPING TO EXISTING INDEX

        } catch (ElasticsearchException e) {
            log.warn(e.getDetailedMessage());
        }
    }


    /**
     * Write a Json mapping definition for a document from a file to ES
     * @param documentType document type in focus.
     * @param fileName Filename with json definition.
     */
    @Override
    public void doWriteMappingFromFile( String documentType, String fileName) {


        log.info("Write mapping {} from File: {}", documentType, fileName);

        if (esIndex == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        if (fileName == null) {
            log.warn("No mapping for {} specified in parameter file.", esIndex);
            return;
        }

        String content = null;

        try {
            content = new String(Files.readAllBytes(Paths.get(fileName)),"UTF-8");
        } catch (IOException e1) {
            log.warn("Can not read file: {}",e1.getMessage());
        }

        doWriteMappingJson(documentType, content);

    }

    /**
     * Write a bunch of mapping to ES
     * @param docTypeAndFileName List with 2 String Array.
     *      String[0] Contains the mapping dataType name
     *      String[1] Contains the filename
     */
    public void doWriteMappings( List<String[]> docTypeAndFileName ) {

        log.debug("Write Mappings: {}", docTypeAndFileName.size());
        if (docTypeAndFileName != null) {
            int t = 1;
            for (String[] s : docTypeAndFileName) {
                if (s.length == 2) {
                    doWriteMappingFromFile( s[0], s[1]);
                } else {
                    log.warn("Wrong parameters number MAPPINGS. Entry: {}", t);
                }
                t++;
            }
        }
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

        if (esIndex == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        IndexRequestBuilder request = esId.getEsId() == null ?
                client.prepareIndex(esIndex, dataTypeName) :
                    client.prepareIndex(esIndex, dataTypeName, esId.getEsId());

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
     * Remove Object from database
     */
    @Override
    public boolean doRemove( String dataTypeName, IsEsObject esId ) {

        if (esIndex == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        DeleteResponse response = client.prepareDelete(esIndex, dataTypeName, esId.getEsId())
                .execute()
                .actionGet();

        return response.isFound();
    }

    /**
     * Read Json Object from database
     */
    @Override
    public BytesReference doReadJsonData( String dataTypeName, IsEsObject esId ) {

        log.debug("NetworkIndex: {}",esIndex);
        if (esId.getEsId() == null) {
            throw new IllegalArgumentException("Read access to object without database Id");
        }

        GetResponse response = client.prepareGet(esIndex, dataTypeName, esId.getEsId())
                //.setOperationThreaded(false)
                .execute()
                .actionGet();

        BytesReference json = response.getSourceAsBytesRef();
        return json;
    }

    @Override
    public SearchHit[] doReadByQueryJsonData( int start, int length, String dataTypeName, QueryBuilder qb ) {

        log.debug("NetworkIndex: {}",esIndex);

        SearchResponse response1 = client.prepareSearch(esIndex)
                .setTypes(dataTypeName)
                .setQuery( qb )
                .setFrom(start).setSize(length)
                .execute().actionGet();

        SearchHit hits[] = response1.getHits().hits();
        return hits;
    }


    @Override
    public SearchHit[] doReadAllJsonData( int start, int length, String dataTypeName ) {

        log.debug("NetworkIndex: {}",esIndex);

        //Use query
        QueryBuilder qb = QueryBuilders.matchAllQuery();

        SearchResponse response1 = client.prepareSearch(esIndex)
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

        log.debug("Start: Index: '{}' ' datatype: '{}'  File: '{}'", esIndex, dataType, fileName);

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
                response = client.prepareIndex(esIndex, dataType)
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
