package com.highstreet.technologies.odl.app.impl.policy;

import com.highstreet.technologies.odl.app.impl.topology.Vertex;

import java.util.List;

/**
 * Created by olinchy on 14/05/2017.
 */
public class BandwidthPolicy implements Policy
{
    @Override
    public boolean consent(List<Vertex> path)
    {
        return false;
    }
}
