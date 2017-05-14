package com.highstreet.technologies.odl.app.impl.policy;

import com.highstreet.technologies.odl.app.impl.topology.Vertex;

import java.util.List;

/**
 * Created by olinchy on 14/05/2017.
 */
public interface Policy
{
    boolean consent(List<Vertex> path);
}
