package com.highstreet.technologies.odl.app.spectrum.impl;

/**
 * Created by olinchy on 16-9-3.
 */
public class NotEqualConfigurationPolicy
{
    public void execute()
    {
        notEquals(
                planned(new DN("some_airInterface")), running(new DN("some_airInterface")),
                () -> set(planned(new DN("some_airInterface"))));
    }

    private void notEquals(Attribute planned, Attribute running, Then then)
    {
        if (planned.equals(running))
            then.then();
    }

    private void set(Attribute attr)
    {
        // set the attribute via netconf
    }

    private Attribute running(DN dn)
    {
        // fetch via netconf
        return null;
    }

    private Attribute planned(DN dn)
    {
        // fetch via agent
        return null;
    }
}
