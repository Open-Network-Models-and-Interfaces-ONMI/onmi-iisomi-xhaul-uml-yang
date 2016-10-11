package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.MosAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import org.junit.Test;

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
}
