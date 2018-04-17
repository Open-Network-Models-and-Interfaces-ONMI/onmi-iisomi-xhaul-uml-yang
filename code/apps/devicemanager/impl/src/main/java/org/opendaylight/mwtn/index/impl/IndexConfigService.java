package org.opendaylight.mwtn.index.impl;

import org.opendaylight.mwtn.base.database.HtDatabaseClientAbstract;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.base.database.IndexClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Setup index mwtn in the database
 * @author herbert
 *
 */
public class IndexConfigService implements AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(IndexConfigService.class);

    /** Index name to be used */
    private static final String INDEX = "config";
    /** Location of configuration data **/
    private static final String MODELDATA = "/elasticsearch/index/config";

    private HtDatabaseClientAbstract client;

    // --- Construct and initialize

    public IndexConfigService(HtDatabaseNode database, String esNodeserverName, String esClusterName,String esNodeName) {
    	LOG.info("Create {} start", this.getClass().getSimpleName());

    	IndexClientBuilder clientBuilder = IndexClientBuilder.getBuilder(INDEX).setDatabase(database).setModelDataDirectory(MODELDATA);
    	client = clientBuilder.create(esNodeserverName, esClusterName, esNodeName);
    	LOG.info("Create {} finished. DB Service {} started.", this.getClass().getSimpleName(),  client != null ? "sucessfully" : "not" );
    }

	@Override
	public void close() throws Exception {
		client.close();
	}

}
