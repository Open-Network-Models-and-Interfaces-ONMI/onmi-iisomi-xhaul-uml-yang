/*
 * Copyright (c) 2015 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.dlux.loader;

import org.junit.Test;
import org.junit.Assert;
import org.opendaylight.dlux.loader.exception.DluxLoaderException;
import org.opendaylight.dlux.loader.implementation.DluxLoader;
import org.opendaylight.dlux.loader.implementation.DluxLoaderIndexServlet;

import java.util.List;
import java.util.Properties;


public class DluxLoaderIndexServletTest {

    private DluxLoader dluxLoader = new DluxLoader();

    @Test
    public void testLoadModulePropertyFile() throws DluxLoaderException {

        DluxLoaderIndexServlet indexServlet = new DluxLoaderIndexServlet(dluxLoader);
        Properties properties = indexServlet.getProp();
        String defineJS = properties.getProperty("defineJS");
        Assert.assertNotNull(defineJS); 
        Assert.assertTrue(defineJS.contains("'angular',"));
        String requireJS = properties.getProperty("requireJS");
        Assert.assertNotNull(requireJS);
        Assert.assertTrue(requireJS.contains("common/config/env.module"));
        String angularJS = properties.getProperty("angularJS");
        Assert.assertNotNull(angularJS);
        Assert.assertTrue(angularJS.contains("'ui.router',"));
    }

    @Test
    public void testLoadIndexHTML() throws DluxLoaderException {
        DluxLoaderIndexServlet indexServlet = new DluxLoaderIndexServlet(dluxLoader);
        List<String> indexHTML = indexServlet.getIndexHTML();
        Properties properties = indexServlet.getProp();

        String jsReplace = properties.getProperty("javascriptReplaceString");
        String cssReplace = properties.getProperty("cssReplaceString");

        boolean containsJSReplace = false;
        boolean containsCssReplace = false;

        for(String line : indexHTML) {
            if(line.contains(jsReplace)) {
                containsJSReplace = true;
            }

            if(line.contains(cssReplace)) {
                containsCssReplace = true;
            }
        }

        Assert.assertTrue(containsCssReplace);
        Assert.assertTrue(containsJSReplace);
    }

}
