/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.policy;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.Communicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Attribute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.NotEquals.notEqualsThen;

/**
 * Created by olinchy on 16-9-3.
 */
public class NotEqualConfigurationPolicy
{
    private static final Logger LOG = LoggerFactory.getLogger(NotEqualConfigurationPolicy.class);

    public static void execute(DataAgent agent, Communicator Communicator, Attribute attr)
    {
        notEqualsThen(agent.get(attr), Communicator.running(attr), () -> Communicator.set(attr, agent.get(attr)));
    }
}
