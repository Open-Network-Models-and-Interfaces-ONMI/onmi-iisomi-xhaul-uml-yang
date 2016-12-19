/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.MosAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Created by olinchy on 10/10/2016.
 */
public class TestMosAgent
{
    @Test
    public void test_get() throws Exception
    {
        String dn = "/NE/mw-112/AirInterface/LP-MWPS-ifIndex1";
        MosAgent agent = new MosAgent("http://localhost:8282/mos");
        Object value = agent.get(new DN(dn), "txFrequency");


        System.out.println(value);


    }

    @Test
    public void test_ls() throws Exception
    {
        String dn = "/NE/1/AirInterface/1/txFrequency";
        MosAgent agent = new MosAgent("http://localhost:8282/mos");
        List<String> list = agent.ls(new DN(dn));

        assertTrue(list.size() > 0);
    }
}
