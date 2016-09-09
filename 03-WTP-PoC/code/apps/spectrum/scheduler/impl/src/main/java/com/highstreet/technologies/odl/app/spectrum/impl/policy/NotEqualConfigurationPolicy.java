/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.policy;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.NeCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.NotEquals.is;

/**
 * Created by olinchy on 16-9-3.
 */
public interface NotEqualConfigurationPolicy
{
    default void execute(DataAgent agent, NeCommunicator neCommunicator)
    {
        is(agent.get(new DN("some_airInterface")), neCommunicator.running(new DN("some_airInterface")),
           () -> neCommunicator.set(agent.planned(new DN("some_airInterface"))));
    }
}
