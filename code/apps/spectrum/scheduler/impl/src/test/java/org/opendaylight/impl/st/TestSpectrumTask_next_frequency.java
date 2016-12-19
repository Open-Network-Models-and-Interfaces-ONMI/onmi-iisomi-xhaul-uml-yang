/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.task.NextFrequencyGetter;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.core.Is.is;

/**
 * Created by olinchy on 15/10/2016.
 */
public class TestSpectrumTask_next_frequency
{
    @Test
    public void test_next() throws Exception
    {
        NextFrequencyGetter getter = new NextFrequencyGetter(new DataAgent()
        {
            @Override
            public Object get(DN dnAgent, String attrName)
            {
                return null;
            }

            @Override
            public List<String> ls(DN dnAgent) throws Exception
            {
                ArrayList<String> list = new ArrayList<>();
                list.add("100");
                list.add("200");
                list.add("300");
                list.add("400");
                list.add("500");
                return list;
            }
        });

        Object current = "100";

        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("200"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("300"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("400"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("500"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("400"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("300"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("200"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("100"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("200"));
        Assert.assertThat(current = getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("300"));
        Assert.assertThat(getter.next(new DN("/Ems/1"), "aa", "txFrequency", current).second(), is("400"));


    }
}
