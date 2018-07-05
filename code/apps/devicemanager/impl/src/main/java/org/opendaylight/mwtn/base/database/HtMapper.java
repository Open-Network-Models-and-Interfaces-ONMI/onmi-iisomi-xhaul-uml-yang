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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.elasticsearch.common.bytes.BytesReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * @author Herbert
 *
 */
public class HtMapper<T> {

    private static final Logger log = LoggerFactory.getLogger(HtDatabaseClientAbstract.class);

    private final Class<? extends T> clazz;

    private final JsonMapperBase objectMapperRead;
    private final JsonMapperBase objectMapperWrite;

    private int mappingFailures;


    public HtMapper(Class<? extends T> clazz) {

        this.mappingFailures = 0;
        this.clazz = clazz;

        this.objectMapperRead = new JsonMapperBase();
        this.objectMapperWrite = this.objectMapperRead;
    }

    public Class<? extends T> getClazz() {
        return clazz;
    }

    public int getMappingFailures() {
        return mappingFailures;
    }

    public String objectToJson( T object ) {
        return objectMapperWrite.objectToJson(object);
    }

    public String objectListToJson( List<T> objectList ) {
        return objectMapperWrite.objectListToJson( objectList );
    }

    public T readValue( JsonNode node ) {

        try {
            T object = objectMapperRead.readValue(node.traverse(), clazz);
            return object;
        } catch (JsonParseException e) {
            mappingFailures++;
            log.warn(e.toString());
        } catch (JsonMappingException e) {
            mappingFailures++;
            log.warn(e.toString());
        } catch (IOException e) {
            mappingFailures++;
            log.warn(e.toString());
        } catch (Exception e) {
            mappingFailures++;
            log.warn(e.toString());
        }
        log.warn("Can not parse: {} {} ", clazz, node);
        return null;

    }

    /**
     * Do the mapping from Json to class
     * Block further mapping if there is are to many failures
     * @param json String with Objects JSON representation
     * @return The Object
     */
    public T getObjectFromJson(byte[] json) {

        if (json != null &&    mappingFailures < 10) {
            try {
                T object = objectMapperRead.readValue(json, clazz);
                return object;
            } catch (JsonParseException e) {
                mappingFailures++;
                log.warn(e.toString());
            } catch (JsonMappingException e) {
                mappingFailures++;
                log.warn(e.toString());
            } catch (IOException e) {
                mappingFailures++;
                log.warn(e.toString());
            } catch (Exception e) {
                mappingFailures++;
                log.warn(e.toString());
            }
        }
        log.warn("Problems parsing : {} {}", clazz, json);
        return null;
    }

    /**
     * Do the mapping from Json to class
     * Block further mapping if there is are to many failures
     * @param json Byte array with JSON Object representation
     * @return The Object
     */
    public T getObjectFromJson(BytesReference json) {

        return getObjectFromJson(json.toBytes());

    }

    /**
     * Read json from File.
     * @param fileName File with JSON text
     * @return Object Object
     */
    public T readJsonObjectFromFile( String fileName ) {
        byte[] content = null;
        log.debug("Filename readJsonObjectFromFile: {}",fileName);

        try {
            content = Files.readAllBytes(Paths.get(fileName));
        } catch (IOException e1) {
            log.warn("IO Problem: {}", e1.getMessage());
        }

        if (content != null) {
            return getObjectFromJson(content);
        } else {
            return null;
        }
    }


}
