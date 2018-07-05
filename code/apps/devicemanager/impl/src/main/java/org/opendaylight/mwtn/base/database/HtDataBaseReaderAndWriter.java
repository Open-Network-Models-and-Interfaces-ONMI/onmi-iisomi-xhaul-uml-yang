/*********************************************************************************
 *  Copyright © 2015, highstreet technologies GmbH
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
 *  @author: Martin Skorupski [martin@skorupski.de]
 *********************************************************************************/
package org.opendaylight.mwtn.base.database;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Generic class to write lists of model classes to the database.
 *
 */
public class HtDataBaseReaderAndWriter<T extends IsEsObject> {

    private static final Logger log = LoggerFactory.getLogger(HtDataBaseReaderAndWriter.class);


    private final HtDataBase db;
    private final String dataTypeName;
    private final HtMapper<T> mapper;

    /**
     * Class specific access to database
     * @param db ES database descriptor
     * @param dataTypeName datatype name
     * @param clazz class of datatype
     */
    public HtDataBaseReaderAndWriter(HtDataBase db, String dataTypeName, Class<? extends T> clazz) {

        this.db = db;
        this.dataTypeName = dataTypeName;
        this.mapper = new HtMapper<>( clazz );

    }

    /**
     * Remove Object from database
     * @param object Object with content
     * @return true if remove is done
     */
    public boolean doRemove( T object) {

        return db.doRemove(dataTypeName, object );

    }

    /**
     * Remove all data that match the filter
     * @param query to specify data to be deleted
     * @return number of removed objects
     */
    public int doRemoveByQuery(QueryBuilder query) {

        int idx = 0;                //Idx for getAll
        int iterateLength = 100;    //Step width for iterate

        SearchHit hits[];
        do {
            hits = db.doReadByQueryJsonData(idx, iterateLength, dataTypeName, query);
            log.debug("Found: {} elements: {}  Failures: {}",dataTypeName,hits.length, mapper.getMappingFailures());

            T object;
            idx += hits.length;
            for (SearchHit hit : hits) {

                object = mapper.getObjectFromJson( hit.getSourceRef() );

                log.debug("Mapp Object: {}\nSource: '{}'\nResult: '{}'\n Failures: {}", hit.getId(), hit.getSourceAsString(), object, mapper.getMappingFailures());
                if (object != null) {
                    object.setEsId( hit.getId() );
                    doRemove(object);
                } else {
                    log.warn("Mapp result null Object: {}\n Source: '{}'\n : '", hit.getId(), hit.getSourceAsString());
                }
            }
        } while (hits.length == iterateLength); //Do it until end indicated, because less hits than iterateLength allows.

        return idx;
    }



    /**
     * Write one object into Database
     * @param object Object with content
     * @return This object for chained call pattern.
     */
    public T doWrite( T object) {

        log.debug("doWrite {} {}",object.getClass().getSimpleName(), object.getEsId());

        String json = mapper.objectToJson(object);
        if (json != null) {
            String esId = db.doWrite(dataTypeName, object, json);
            object.setEsId(esId);
            log.debug("doWrite done for {} {}",object.getClass().getSimpleName(), object.getEsId());
            return esId == null ? null : object;
        } else {
            log.warn("Can not map object and write to database. {}",object.getClass().getSimpleName());
            return null;
        }

    }

    /**
     * Write a list of Objects to the database.
     * @param list Object list with content
     * @return This object for chained call pattern.
     */
    public HtDataBaseReaderAndWriter<T> doWrite( Collection<T> list) {

        int writeError = 0;
        String indexName = db.getNetworkIndex();

        log.debug("Write to ES database {}, {} Class: {}  {} elements",indexName,dataTypeName, mapper.getClazz().getSimpleName(), list.size());

        if (indexName == null) {
            throw new IllegalArgumentException("Missing Index");
        }

        if (list != null && !list.isEmpty()) {
            for( T s : list ) {
                if ( doWrite(s) == null )  {
                    if ( ++writeError > 5 ) {
                        log.warn("Leave because of to >5 write errors");
                        break;
                    }
                }
            }

        }

        return this;
    }

    /**
     * Read one object via the object class specific ID
     * @param object Object refrenced by idString
     * @return The Object if found or null
     */
    public T doRead( IsEsObject object ) {
        return mapper.getObjectFromJson( db.doReadJsonData( dataTypeName, object) );
    }

    /**
     * Read all existing objects of a type
     * @return the list of all objects
     */
    public List<T> doReadAll() {

        List<T> res = new ArrayList<>();
        int idx = 0;                //Idx for getAll
        int iterateLength = 100;    //Step width for iterate

        SearchHit hits[];


        do {
            hits = db.doReadAllJsonData(idx, iterateLength, dataTypeName);
            log.debug("Read: {} elements: {}  Failures: {}",dataTypeName,hits.length, mapper.getMappingFailures());

            T object;
            idx += hits.length;
            for (SearchHit hit : hits) {

                object = mapper.getObjectFromJson( hit.getSourceRef() );

                log.debug("Mapp Object: {}\nSource: '{}'\nResult: '{}'\n Failures: {}", hit.getId(), hit.getSourceAsString(), object, mapper.getMappingFailures());
                if (object != null) {
                    object.setEsId( hit.getId() );
                    res.add( object );
                } else {
                    log.warn("Mapp result null Object: {}\n Source: '{}'\n : '", hit.getId(), hit.getSourceAsString());
                }
            }
        } while (hits.length == iterateLength); //Do it until end indicated, because less hits than iterateLength allows.

        return res;
    }

}
