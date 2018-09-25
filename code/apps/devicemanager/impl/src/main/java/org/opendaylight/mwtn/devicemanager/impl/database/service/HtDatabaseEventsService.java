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

package org.opendaylight.mwtn.devicemanager.impl.database.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nonnull;

import org.opendaylight.mwtn.base.database.HtDataBaseReaderAndWriter;
import org.opendaylight.mwtn.base.database.HtDatabaseClientAbstract;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.base.database.IndexClientBuilder;
import org.opendaylight.mwtn.devicemanager.impl.database.types.EsEventBase;
import org.opendaylight.mwtn.devicemanager.impl.database.types.EsFaultCurrent;
import org.opendaylight.mwtn.devicemanager.impl.database.types.EsFaultLog;
import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.MwtNotificationBase;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Event service, writing all events into the database into the appropriate index.
 *
 * @author herbert
 */
public class HtDatabaseEventsService {
    private static final Logger LOG = LoggerFactory.getLogger(HtDatabaseEventsService.class);

    ///** Filename in the resources with maven initialized version information  */
    //private static final String RESOURCENAME = "version.properties"; // could also be a constant
    ///** Index name to be used */
    private static final String INDEX = "sdnevents";
    private static final String MAPPING = "/elasticsearch/index/sdnevents/sdneventsMapping.json";

    private HtDatabaseClientAbstract client;
    private HtDataBaseReaderAndWriter<EsEventBase> eventRWEventLog;
    private HtDataBaseReaderAndWriter<EsFaultCurrent> eventRWFaultCurrent;
    private HtDataBaseReaderAndWriter<EsFaultLog> eventRWFaultLog;


    // --- Construct and initialize

    public HtDatabaseEventsService(HtDatabaseNode database) {

    	LOG.info("Create {} start", HtDatabaseEventsService.class);

    	try {
    		// Create control structure
    		IndexClientBuilder clientBuilder = IndexClientBuilder.getBuilder(INDEX).setMappingSettingJsonFileName(MAPPING);
    		client = clientBuilder.create(database);

    		eventRWEventLog = new HtDataBaseReaderAndWriter<>(client, EsEventBase.ESDATATYPENAME, EsEventBase.class);
    		eventRWFaultLog = new HtDataBaseReaderAndWriter<>(client, EsFaultLog.ESDATATYPENAME, EsFaultLog.class);
    		eventRWFaultCurrent = new HtDataBaseReaderAndWriter<>(client, EsFaultCurrent.ESDATATYPENAME, EsFaultCurrent.class);


    	} catch (Exception e) {
    		LOG.error("Can not start database client. Exception: {}", e.getMessage());
    	}
    	LOG.info("Create {} finished. DB Service {} started.", HtDatabaseEventsService.class,  client != null ? "sucessfully" : "not" );
    }

    // --- Function

    public void writeEventLog(ObjectCreationNotificationXml event) {
        writeEventGeneric(event);
    }

    public void writeEventLog(ObjectDeletionNotificationXml event) {
        writeEventGeneric(event);
    }

    public void writeEventLog(AttributeValueChangedNotificationXml event) {
        writeEventGeneric(event);
    }

    private void writeEventGeneric(MwtNotificationBase event) {
        if (client == null) {
            LOG.debug("No DB, can not write: {}",event.toString());
            return;
        }

        LOG.debug("Write event: {}",event.toString());
        EsEventBase eventBase = new EsEventBase();
        eventBase.setProblem(event);
        eventRWEventLog.doWrite(eventBase);
    }

    public void writeFaultLog(ProblemNotificationXml fault) {
        if (client == null) {
            LOG.debug("No DB, can not write: {}",fault.toString());
            return;
        }

        LOG.debug("Write fault to faultlog: {}",fault.toString());
        EsFaultLog eventProblem = new EsFaultLog();
        eventProblem.setProblem(fault);
        eventRWFaultLog.doWrite(eventProblem);
    }

    public void updateFaultCurrent(ProblemNotificationXml fault) {
        if (client == null) {
            LOG.debug("No DB, can not write: {}",fault.toString());
            return;
        }

        if (!fault.isNotManagedAsCurrentProblem()) {
        	EsFaultCurrent eventProblem = new EsFaultCurrent();
        	eventProblem.setProblem(fault);

        	if (eventProblem.isNoAlarmIndication()) {
        		LOG.debug("Remove from currentFaults: {}",fault.toString());
        		eventRWFaultCurrent.doRemove(eventProblem);
        	} else {
        		LOG.debug("Write to currentFaults: {}",fault.toString());
        		eventRWFaultCurrent.doWrite(eventProblem);
        	}
        } else {
    		LOG.debug("Ingnore for currentFaults: {}",fault.toString());
        }
    }

    /**
     * Remove all entries for one node
     * @param nodeName contains the mountpointname
     * @return number of deleted entries
     */
    public int clearFaultsCurrentOfNode(String nodeName) {
        if (client == null) {
            LOG.debug("No DB, can not delete for node: {}", nodeName);
            return -1;
        }
        LOG.debug("Remove from currentFaults all faults for node: {}", nodeName);
        return eventRWFaultCurrent.doRemoveByQuery(EsFaultCurrent.getQueryForOneNode(nodeName));
    }

    /**
     * Remove all entries for one node
     * @param nodeName contains the mountpointname
     * @param objectId of element to be deleted
     * @return number of deleted entries
     */
    public int clearFaultsCurrentOfNodeWithObjectId(String nodeName, String objectId) {
        if (client == null) {
            LOG.debug("No DB, can not delete for node: {}", nodeName);
            return -1;
        }
        LOG.debug("Remove from currentFaults all faults for node/objectId: {}/{}", nodeName, objectId);
        return eventRWFaultCurrent.doRemoveByQuery(EsFaultCurrent.getQueryForOneNodeAndObjectId(nodeName, objectId));

    }

    /**
     * Deliver list with all mountpoint/node-names in the database.
     * @return List of all mountpoint/node-names the had active alarms.
     */
	public @Nonnull List<String> getAllNodesWithCurrentAlarms() {
		if (client == null) {
			LOG.debug("No DB, can not delete for all nodes");
			return new ArrayList<String>();
		}
		LOG.debug("Remove from currentFaults faults for all node");
		List<String> nodeNames = new ArrayList<String>();

		for (EsFaultCurrent fault : eventRWFaultCurrent.doReadAll()) {
			String nodeName = fault.getProblem().getNodeName();
			if (!nodeNames.contains(nodeName)) {
				//this.clearFaultsCurrentOfNode(nodeName); -> Function shifted
				nodeNames.add(nodeName);
			}
		}
		return nodeNames;
	}

}
