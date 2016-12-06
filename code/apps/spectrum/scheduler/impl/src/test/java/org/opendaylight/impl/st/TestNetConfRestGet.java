package org.opendaylight.impl.st;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.Arrays;
import java.util.Collection;

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
//                        {"http://localhost:8181/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/mw-112/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement", ""},
//                        {"http://localhost:8181/restconf/config/network-topology:network-topology/topology/topology-netconf/node/mw-112/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/LP-MWPS-ifIndex1", ""},
                        {"http://localhost:8181/restconf/config/network-topology:network-topology/topology/topology-netconf/node/mw-112/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/LP-MWPS-ifIndex1/airInterfaceConfiguration", ""},
                });
    }

    @Test
    public void get() throws Exception
    {

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

        ((ObjectNode) node.get("airInterfaceConfiguration")).put("rxFrequency", 15600000);

        try
        {
            resource.accept("application/json").type("application/json").put(node.toString());
            System.out.println("using json passed");
        } catch (Throwable e)
        {
            System.out.println("using json not passed");
        }

        System.out.println(get);

    }
}
