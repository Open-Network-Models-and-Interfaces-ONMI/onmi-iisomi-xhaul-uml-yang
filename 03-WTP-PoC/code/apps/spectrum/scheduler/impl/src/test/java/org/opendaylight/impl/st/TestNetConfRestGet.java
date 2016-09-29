package org.opendaylight.impl.st;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.Set;

/**
 * Created by olinchy on 9/24/16.
 */

@RunWith(Parameterized.class)
public class TestNetConfRestGet
{
    private String target;
    private String expect;

    public TestNetConfRestGet(String target, String expect)
    {
        this.target = target;
        this.expect = expect;
    }

    @Parameterized.Parameters
    public static Collection<Object[]> data()
    {
        return Arrays.asList(new String[][]
                {
//                        {"http://localhost:8181/restconf/operational/network-topology:network-topology/topology/topology-netconf/", ""},
                        {"http://localhost:8181/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/mw-112/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement", ""}
                });
    }

    @Test
    public void get() throws Exception
    {

        ClientConfig config = new ClientConfig() {
            @Override
            public Set<Class<?>> getClasses()
            {
                return null;
            }

            @Override
            public Set<Object> getSingletons()
            {
                return null;
            }

            @Override
            public boolean getPropertyAsFeature(String featureName)
            {
                return false;
            }

            @Override
            public Map<String, Boolean> getFeatures()
            {
                return null;
            }

            @Override
            public boolean getFeature(String s)
            {
                return false;
            }

            @Override
            public Map<String, Object> getProperties()
            {
                return null;
            }

            @Override
            public Object getProperty(String s)
            {
                return null;
            }
        };
        Authenticator.setDefault(new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication("admin", "admin".toCharArray());
            }
        });
        Client client = Client.create();

        WebResource resource = client.resource(target);
        String get = resource.get(String.class);

        JsonNode node = JsonUtil.toNode(get);

        System.out.println(get);

    }
}
