package com.highstreet.technologies.odl.app.spectrum.impl.primitive;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.StringWriter;
import java.text.SimpleDateFormat;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static com.fasterxml.jackson.databind.DeserializationFeature.READ_ENUMS_USING_TO_STRING;
import static com.fasterxml.jackson.databind.SerializationFeature.WRITE_ENUMS_USING_TO_STRING;

/**
 * Created by olinchy on 6/18/14 for MO_JAVA.
 */
public class JsonUtil
{
    private static final Logger LOG = LoggerFactory.getLogger(JsonUtil.class);

    private static ObjectMapper mapper;

    static
    {
        mapper = new ObjectMapper();
        mapper.configure(WRITE_ENUMS_USING_TO_STRING, true);
        mapper.configure(FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(READ_ENUMS_USING_TO_STRING, true);
        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
    }

    public static String toString(Object obj) throws Exception
    {
        StringWriter sw = new StringWriter();
        JsonGenerator gen = null;
        try
        {
            gen = new JsonFactory().createJsonGenerator(sw);
            mapper.writeValue(gen, obj);
        } catch (IOException e)
        {
            LOG.warn("toString caught exception!", e);
            return "";
        } finally
        {
            assert gen != null;
            try
            {
                gen.close();
            } catch (IOException e)
            {
                throw new Exception(e);
            }
        }
        return sw.toString();
    }

    public static <T> T toObject(String content, Class<T> clazz)
    {
        try
        {
            return mapper.readValue(content, clazz);
        } catch (IOException e)
        {
            LOG.warn("read value failed !", e);
            return null;
        }
    }

    public static ObjectNode newObjNode()
    {
        return new ObjectMapper().createObjectNode();
    }

    public static ArrayNode newArrayNode()
    {
        return new ObjectMapper().createArrayNode();
    }

    public static JsonNode toNode(String content)
    {
        try
        {
            return mapper.readTree(content);
        } catch (IOException e)
        {
            LOG.warn("toNode failed !", e);
            return newObjNode();
        }
    }

    public static JsonNode toNode(Object o) throws Exception
    {
        return toNode(toString(o));
    }

}
