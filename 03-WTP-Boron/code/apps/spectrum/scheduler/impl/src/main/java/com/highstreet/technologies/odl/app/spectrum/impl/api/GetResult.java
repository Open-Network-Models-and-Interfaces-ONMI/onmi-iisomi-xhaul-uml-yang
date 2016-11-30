/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;


import com.highstreet.technologies.odl.app.spectrum.impl.meta.Maybe;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Mo;

import java.util.ArrayList;

/**
 * Created by olinchy on 15-5-8.
 */
public class GetResult
{
    public int result;
    public ArrayList<Mo> mo;
    public Maybe<Integer> transId;
}
