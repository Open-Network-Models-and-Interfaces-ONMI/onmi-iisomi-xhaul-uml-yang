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
public class IndexMwtnService implements AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(IndexMwtnService.class);

    /** Index name to be used */
    private static final String INDEX = "mwtn";
    /** Location of mapping data **/
    private static final String MAPPING = "/elasticsearch/index/mwtn/mwtnMapping.json";
    /** Location of configuration data **/
    private static final String MODELDATA = "/elasticsearch/index/mwtn/modelDescription";

    private HtDatabaseClientAbstract client;

    // --- Construct and initialize

    public IndexMwtnService(HtDatabaseNode database) {
    	LOG.info("Create {} start", this.getClass().getSimpleName());

    	IndexClientBuilder clientBuilder = IndexClientBuilder.getBuilder(INDEX)
    			.setMappingSettingJsonFileName(MAPPING)
    			.setModelDataDirectory(MODELDATA);
    	client = clientBuilder.create(database);
    	LOG.info("Create {} finished. DB Service {} started.", this.getClass().getSimpleName(),  client != null ? "sucessfully" : "not" );
    }

	@Override
	public void close() throws Exception {
		client.close();
	}
}
