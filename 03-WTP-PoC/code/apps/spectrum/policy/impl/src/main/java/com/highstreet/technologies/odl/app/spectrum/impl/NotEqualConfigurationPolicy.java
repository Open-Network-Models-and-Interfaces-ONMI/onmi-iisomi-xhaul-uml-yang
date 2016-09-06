/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl;

/**
 * Created by olinchy on 16-9-3.
 */
public abstract class NotEqualConfigurationPolicy
{
    private DataAgent agent;
    private NeCommunicator neCommuicate;

    public void execute()
    {
        notEquals(
                agent.planned(new DN("some_airInterface")), neCommuicate.running(new DN("some_airInterface")),
                () -> neCommuicate.set(agent.planned(new DN("some_airInterface"))));
    }

    private void notEquals(Attribute planned, Attribute running, Then then)
    {
        if (planned.equals(running))
            then.then();
    }
}
