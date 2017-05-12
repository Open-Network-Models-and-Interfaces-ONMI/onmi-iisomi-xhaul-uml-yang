/*
 * Copyright © 2016 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.topology;

import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Link;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by olinchy on 4/19/17.
 */
public class Graph
{
    // todo data source from https://github.com/Melacon/WirelessTransportEmulator/blob/master/topology.json

    private Graph(List<Vertex> vertices)
    {
        this.vertices = vertices;
        init();
    }

    public static Graph instance()
    {
        return graph;
    }

    private static Graph graph;
    private final List<Vertex> vertices;
    private boolean[][] matrix;

    private void init()
    {
        this.matrix = new boolean[vertices.size()][vertices.size()];
        for (int i = 0; i < matrix.length; i++)
        {
            for (int j = 0; j < matrix[i].length; j++)
            {
                matrix[i][j] = false;
            }
        }
    }

    public void add(Vertex source, Vertex target)
    {
        matrix[vertices.indexOf(source)][vertices.indexOf(target)] = true;
        matrix[vertices.indexOf(target)][vertices.indexOf(source)] = true;
    }

    public List<List<Vertex>> routes(Vertex source, Vertex target)
    {
        List<List<Vertex>> results = new LinkedList<>();
        results.addAll(routes(source, target, new LinkedList<>()));
        return results;
    }

    private List<Vertex> nextOf(Vertex source)
    {
        List<Vertex> list = new ArrayList<>();
        int index = this.vertices.indexOf(source);
        for (int i = 0; i < matrix[index].length; i++)
        {
            if (matrix[index][i])
            {
                list.add(vertices.get(i));
            }
        }
        return list;
    }

    private List<List<Vertex>> routes(Vertex source, Vertex target, List<Vertex> passed)
    {
        List<List<Vertex>> results = new LinkedList<>();
        passed.add(source);
        for (Vertex next : nextOf(source))
        {
            if (!passed.contains(next))
            {
                List<Vertex> temp = new LinkedList<>();
                temp.addAll(passed);
                if (next.equals(target))
                {
                    // exit point --- found
                    temp.add(next);
                    results.add(temp);
                }
                else
                {
                    results.addAll(routes(next, target, temp));
                }
            }
        }
        return results;
    }

    public static void instance(List<Link> links)
    {
    }
}
