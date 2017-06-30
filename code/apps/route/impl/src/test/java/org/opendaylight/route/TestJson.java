/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.route;

import com.highstreet.technologies.odl.app.impl.delegates.PredefinePath;
import com.highstreet.technologies.odl.app.impl.tools.JsonUtil;
import org.junit.Test;

import java.io.File;

/**
 * Created by odl on 17-6-5.
 */
public class TestJson
{
    @Test
    public void test_to_object_given_json() throws Exception
    {
        String fileName = "/home/odl/workspace/CENTENNIAL/code/apps/route/impl/src/main/resources/topology.json";
        PredefinePath path = JsonUtil.toObject(new File(fileName), PredefinePath.class);

        System.out.println("");
    }

    @Test
    public void test_to_obj_from_file()
    {
        PredefinePath path = JsonUtil.toObject(
                new File(System.getenv().get("ODL_KARAF_HOME") + File.separator + "data" + File.separator + "topology.json"), PredefinePath.class);
        System.out.println(path);
    }

}
