package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.RestfulODLCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.task.SpectrumTask;
import org.junit.BeforeClass;
import org.junit.Test;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
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
        SpectrumTask task = new SpectrumTask((dnAgent, attrName) -> 500, new RestfulODLCommunicator()
        {
            @Override
            public void set(String dn, String attrName, Object o)
            {
                obj[0] = o;
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

//        assertThat(obj[0], is(500));

    }
}
