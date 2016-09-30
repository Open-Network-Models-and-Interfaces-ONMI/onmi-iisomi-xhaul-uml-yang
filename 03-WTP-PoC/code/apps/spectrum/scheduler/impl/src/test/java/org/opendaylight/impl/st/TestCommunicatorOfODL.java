package org.opendaylight.impl.st;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.api.RestfulODLCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import org.junit.BeforeClass;
import org.junit.Test;

import java.net.Authenticator;
import java.net.PasswordAuthentication;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

/**
 * Created by olinchy on 9/30/16.
 */
public class TestCommunicatorOfODL
{
    @BeforeClass
    public static void setUp() throws Exception
    {
        Authenticator.setDefault(new Authenticator()
        {
            @Override
            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication("admin", "admin".toCharArray());
            }
        });
    }

    @Test
    public void test_ls() throws Exception
    {
        RestfulODLCommunicator communicator = new RestfulODLCommunicator();
        Result<JsonNode> res = communicator.ls("network-topology:network-topology/topology/topology-netconf", "node");

        assertTrue(res.isSuccess());
        assertThat(res.getMo().size(), is(2));
    }
}
