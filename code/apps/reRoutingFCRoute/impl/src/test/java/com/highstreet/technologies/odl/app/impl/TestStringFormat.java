package com.highstreet.technologies.odl.app.impl;

import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

/**
 * Created by olinchy on 14/05/2017.
 */
public class TestStringFormat
{

    @Test
    public void name() throws Exception
    {
        assertThat(String.format("LTP-ETY-1.1.1" + "-%1$s-%2$d", "ETH", 23), is("LTP-ETY-1.1.1-ETH-23"));
    }
}
