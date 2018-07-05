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
import java.io.StringWriter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator.Feature;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * This class is used to define default for JSON Serialization and Deserialization for the project at a single place
 */
public class JsonMapperBase extends ObjectMapper {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(JsonMapperBase.class);

    public JsonMapperBase() {

        setVisibility(PropertyAccessor.ALL, Visibility.NONE);
        setVisibility(PropertyAccessor.FIELD, Visibility.ANY);

        // Deserialization
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        configure(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL, true);

        // Serialization
        configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        getFactory().configure(Feature.ESCAPE_NON_ASCII, true);
    }


    public String objectToJson( Object object ) {
        String res = null;

        try {

            StringWriter stringEmp = new StringWriter();
            writeValue(stringEmp, object);
            res = stringEmp.toString();
            stringEmp.close();

        } catch (JsonGenerationException e) {
            LOG.debug(e.toString());
        } catch (JsonMappingException e) {
            LOG.debug(e.toString());
        } catch (IOException e) {
            LOG.debug(e.toString());
        } catch (Exception e) {
            LOG.debug(e.toString());
        }

        return res;
    }

    public String objectListToJson( List<? extends Object> objectList ) {
        String res = null;

        try {

            StringWriter stringEmp = new StringWriter();
            writeValue(stringEmp, objectList);
            res = stringEmp.toString();
            stringEmp.close();

        } catch (JsonGenerationException e) {
            LOG.debug(e.toString());
        } catch (JsonMappingException e) {
            LOG.debug(e.toString());
        } catch (IOException e) {
            LOG.debug(e.toString());
        } catch (Exception e) {
            LOG.debug(e.toString());
        }

        return res;
    }

}
