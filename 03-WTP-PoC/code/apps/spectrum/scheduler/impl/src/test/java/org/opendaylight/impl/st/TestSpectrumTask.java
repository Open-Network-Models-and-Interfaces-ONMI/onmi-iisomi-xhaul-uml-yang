package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.RestfulODLCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Pair;
import com.highstreet.technologies.odl.app.spectrum.impl.task.SpectrumTask;
import org.junit.BeforeClass;
import org.junit.Test;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Created by olinchy on 9/30/16.
 */
public class TestSpectrumTask
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
    public void given_fake_dataAgent_and_fake_set_communicator() throws Exception
    {
        Object[] obj = new Object[1];
        SpectrumTask task = new SpectrumTask(new DataAgent()
        {
            @Override
            public Object get(DN dnAgent, String attrName)
            {
                return 500;
            }

            @Override
            public List<String> ls(DN dnAgent) throws Exception
            {
                return new ArrayList<>();
            }
        }, new RestfulODLCommunicator()
        {
            @Override
            public void set(String dn, Pair<String, Object>... values)
            {
                obj[0] = values[0].second();
            }
        });
        task.executeIn(new ThreadPoolExecutor(5, 20, 1, TimeUnit.SECONDS, new LinkedBlockingDeque<>())
        {
            @Override
            public void execute(Runnable command)
            {
                try
                {
                    command.run();
                } catch (Throwable e)
                {
                    System.out.println("");
                }
            }
        });
    }
}
