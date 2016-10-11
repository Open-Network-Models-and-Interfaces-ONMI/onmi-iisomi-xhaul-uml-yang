/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Pair;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;

/**
 * Created by olinchy on 16-9-5.
 */
public interface Communicator
{
    Result<JsonNode> ls(String path, String targetName);

    Object get(String dn, String attrName);

    void set(String dn, Pair<String, Object>... values);
}
