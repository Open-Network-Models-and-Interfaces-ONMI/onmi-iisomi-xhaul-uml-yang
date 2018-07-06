/*
 * Copyright (c) 2018 sendate.eu and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */


/**
 * @ original author Dmitry Khomchenko (VPI photonics)
 *
 */


package org.opendaylight.mwtn.opmalgorithm;

import java.util.ArrayList;
import java.util.Comparator;

class Location
{
    public Location(int source, double weight) {
        this.source = source;
        this.weight = weight;
        this.linkCapacity = -1;
        this.usedIndices =  new ArrayList<Integer>();
    }

    public int source;
    public double weight;
    public int linkCapacity; // number of wavelengths allowed in a link might differ from system limit, e.g. 96 indices (for ITUT (100GHz)  are used)
    public ArrayList<Integer> usedIndices;//  wavelength indices available for the route within the current link
}

class LocationComparator implements Comparator<Integer>
{
    ArrayList<Location> locations = null;

    public LocationComparator(ArrayList<Location> locations)
    {
        this.locations = locations;
    }

    public int compare(Integer item1, Integer item2)
    {
        return Double.compare(locations.get(item1).weight, locations.get(item2).weight);
    }
}

