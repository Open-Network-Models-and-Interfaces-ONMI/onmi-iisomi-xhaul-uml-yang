package com.highstreet.technologies.odl.app.spectrum.impl;

/**
 * Created by olinchy on 16-9-3.
 */
public class NotEqualConfigurationPolicy
{
    public void execute()
    {
        notEquals(planned(new DN("agent")), running(new DN("device")), () -> set(planned(new DN("agent"))));
    }

    private void notEquals(Attribute planned, Attribute running, Then then)
    {
        if (planned.equals(running))
            then.then();
    }

    private Then then(Execute set)
    {
        return null;
    }

    private Execute set(Attribute planned)
    {

        return null;
    }

    private Attribute running(DN dn)
    {
        return null;
    }

    private Attribute planned(DN dn)
    {
        return null;
    }
}
