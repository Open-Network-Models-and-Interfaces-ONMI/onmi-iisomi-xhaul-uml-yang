/*********************************************************************************
 * Copyright (c) 2017 highstreet technologies and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 *
 * Deliver a configuration that was read from the ES database service available on the
 * ODL node under the entry with Index: "config", Type: " database", Id: "org.opendaylight.mwtn.eventmanager"
 *
 * @author: Herbert Eiselt [herbert.eiselt@highstreet-technologies.com]
 *********************************************************************************/

package org.opendaylight.mwtn.config.impl;

import java.net.UnknownHostException;

import org.opendaylight.mwtn.aotsMConnector.impl.HtConfigurationAotsConnector;
import org.opendaylight.mwtn.base.database.HtDataBaseReaderAndWriter;
import org.opendaylight.mwtn.base.database.HtDatabaseClientAbstract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HtDatabaseConfigService {
    private static final Logger LOG = LoggerFactory.getLogger(HtDatabaseConfigService.class);

    private HtDatabaseClientAbstract client;
    private HtDataBaseReaderAndWriter<HtConfiguration> configurationRW;
    private HtDataBaseReaderAndWriter<HtConfigurationEcompConnector> configurationEcompConnectorRW;
    private HtDataBaseReaderAndWriter<HtConfigurationAotsConnector> configurationAotsConnectorRW;

    public HtDatabaseConfigService() {
        LOG.info("HtConfigService start.");

        try {
            client = new HtDatabaseClientAbstract("config", "localhost");
            configurationRW = new HtDataBaseReaderAndWriter<>(client, HtConfiguration.ESDATATYPENAME, HtConfiguration.class);
            configurationEcompConnectorRW = new HtDataBaseReaderAndWriter<>(client, HtConfigurationEcompConnector.ESDATATYPENAME, HtConfigurationEcompConnector.class);
            configurationAotsConnectorRW = new HtDataBaseReaderAndWriter<>(client, HtConfigurationAotsConnector.ESDATATYPENAME, HtConfigurationAotsConnector.class);
            LOG.info("HtConfigService {} finished with configuration.", HtDatabaseConfigService.class);
        } catch (UnknownHostException e) {

            LOG.info("HtConfigService database not accessable {}", e.getMessage());
        }
    }

    public HtConfiguration getHtConfiguration(String configurationId) {

        LOG.info("HtConfigService start read from {}", configurationId);

        HtConfiguration htConfiguration = new HtConfiguration();
        htConfiguration.setEsId(configurationId);

        try {
            htConfiguration = configurationRW.doRead(htConfiguration);
        } catch (NullPointerException e) {
            LOG.warn("HtConfigService problem reading {}", configurationId);
            htConfiguration = null;
        }

        LOG.info("HtConfigService got from {} the configuration {}", configurationId, String.valueOf(htConfiguration));
        return htConfiguration;
    }

    public HtConfigurationEcompConnector getHtConfigurationEcompConnector(String configurationId) {

        LOG.info("HtConfigService read from {}", configurationId);

        HtConfigurationEcompConnector htConfiguration = new HtConfigurationEcompConnector();
        htConfiguration.setEsId(configurationId);

        try {
            htConfiguration = configurationEcompConnectorRW.doRead(htConfiguration);
        } catch (NullPointerException e) {
            LOG.warn("HtConfigurationEcompConnector problem reading {}", configurationId);
            htConfiguration = null;
        }

        LOG.info("HtConfigService got from {} the configuration {}", configurationId, String.valueOf(htConfiguration));
        return htConfiguration;
    }
    public HtConfigurationAotsConnector getHtConfigurationAotsConnector(String configurationId) {

        LOG.info("HtConfigService read from {}", configurationId);

        HtConfigurationAotsConnector htConfiguration = new HtConfigurationAotsConnector();
        htConfiguration.setEsId(configurationId);

        try {
            htConfiguration = configurationAotsConnectorRW.doRead(htConfiguration);
        } catch (NullPointerException e) {
            LOG.warn("HtConfigurationAotsConnector problem reading {}", configurationId);
            htConfiguration = null;
        }

        LOG.info("HtConfigService got from {} the configuration {}", configurationId, String.valueOf(htConfiguration));
        return htConfiguration;
    }


}
