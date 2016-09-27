/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * Created by olinchy on 15-5-8.
 */
public class DNJsonDeserializer extends JsonDeserializer<DN>
{
    @Override
    public DN deserialize(JsonParser jsonParser,
                          DeserializationContext deserializationContext) throws IOException
    {
        return new DN(jsonParser.getText());
    }
}
