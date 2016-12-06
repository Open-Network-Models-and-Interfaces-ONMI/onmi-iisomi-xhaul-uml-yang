/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * Created by olinchy on 5/6/15.
 */
public class DNJsonSerializer extends JsonSerializer<DN>
{
    @Override
    public void serialize(
            DN dn, JsonGenerator jsonGenerator,
            SerializerProvider serializerProvider) throws IOException
    {
        jsonGenerator.writeString(dn.toString());
    }
}
