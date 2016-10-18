/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.task;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Pair;

import java.util.HashMap;
import java.util.List;

import static com.highstreet.technologies.odl.app.spectrum.impl.meta.Pair.pair;
import static com.highstreet.technologies.odl.app.spectrum.impl.task.Direction.ASC;
import static com.highstreet.technologies.odl.app.spectrum.impl.task.Direction.DESC;

/**
 * Created by olinchy on 15/10/2016.
 */
public class NextFrequencyGetter
{
    private DataAgent agent;
    private HashMap<DN, HashMap<String, Direction>> reverseSignMap = new HashMap<>();

    public NextFrequencyGetter(DataAgent agent)
    {
        this.agent = agent;
    }

    public Pair<String, Object> next(DN dnAgent, String fieldName, Object currentValue)
    {
        List<String> list = null;
        try
        {
            list = agent.ls(new DN(dnAgent.toString()).append(fieldName));
        } catch (Exception e)
        {
            e.printStackTrace();
        }
        int index;
        if ((index = list.indexOf(currentValue)) == list.size() - 1 || index == 0)
        {
            index = reverseIndex(dnAgent, fieldName, index);
        } else
        {
            index = nextIndex(dnAgent, fieldName, index);
        }
        if (index < 0)
            index = 0;

        return pair(fieldName, list.get(index));
    }

    private int nextIndex(DN dnAgent, String fieldName, int currentIndex)
    {
        HashMap<String, Direction> mapDirection = getMap(dnAgent, fieldName, ASC);

        return mapDirection.get(fieldName).next(currentIndex);
    }

    private int reverseIndex(DN dnAgent, String fieldName, int currentIndex)
    {
        HashMap<String, Direction> mapDirection = getMap(dnAgent, fieldName, DESC);
        if ((mapDirection.get(fieldName).equals(DESC) || mapDirection.get(fieldName).equals(ASC)) && currentIndex == 0)
            mapDirection.put(fieldName, ASC);
        else
            mapDirection.put(fieldName, DESC);

        return mapDirection.get(fieldName).next(currentIndex);
    }

    private HashMap<String, Direction> getMap(DN dnAgent, String fieldName, Direction direction)
    {
        if (!reverseSignMap.containsKey(dnAgent))
        {
            reverseSignMap.put(dnAgent, new HashMap<>());
        }

        HashMap<String, Direction> mapDirection = reverseSignMap.get(dnAgent);
        if (!mapDirection.containsKey(fieldName))
            mapDirection.put(fieldName, direction);
        return mapDirection;
    }
}
