/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.URL;
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

    public static <T> T toObject(URL content, Class<T> clazz)
    {
        try
        {
            return mapper.readValue(content, clazz);
        }
        catch (IOException e)
        {
            LOG.warn("read value failed !", e);
            return null;
        }
    }

    public static <T> T toObject(File content, Class<T> clazz)
    {
        try
        {
            return mapper.readValue(content, clazz);
        }
        catch (IOException e)
        {
            LOG.warn("read value failed !", e);
            return null;
        }
    }
}
