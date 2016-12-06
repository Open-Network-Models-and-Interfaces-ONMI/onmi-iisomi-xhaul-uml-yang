/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl;

import com.highstreet.technologies.odl.app.spectrum.impl.task.Task;
import com.highstreet.technologies.odl.app.spectrum.impl.task.TaskCreator;

import java.util.HashMap;

/**
 * Created by olinchy on 16-9-14.
 */
public class TaskFactory
{
    private static HashMap<String, TaskCreator> map = new HashMap<>();

    private TaskFactory()
    {
    }

    public Task create(String taskName) throws Exception
    {
        if (map.containsKey(taskName))
            return map.get(taskName).create();
        throw new Exception("no such task");
    }

    public void register(String name, TaskCreator creator)
    {
        map.put(name, creator);
    }
}
