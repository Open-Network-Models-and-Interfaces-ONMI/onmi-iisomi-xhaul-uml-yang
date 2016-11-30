/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.primitive;

import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author Administrator
 */
public abstract class Singleton
{
    private static final ConcurrentHashMap<Class<?>, Object> INSTANCES = new ConcurrentHashMap<Class<?>, Object>();

    private Singleton()
    {
    }

    private static Object createNewInstance(Class<?> claxx) throws Exception
    {
        boolean isAccessible;
        Constructor<?> constructor = null;

        try
        {
            constructor = claxx.getDeclaredConstructor();
            isAccessible = constructor.isAccessible();
            if (isAccessible || Modifier.isPublic(constructor.getModifiers()))
            {
                throw new Exception(claxx.getName());
            }
            constructor.setAccessible(true);
            return constructor.newInstance();
        } catch (Exception e)
        {
            throw e;
        } finally
        {
            if (constructor != null)
            {
                constructor.setAccessible(false);
            }
        }
    }

    public static <T> T getInstance(Class<T> claxx) throws RuntimeException
    {
        synchronized (claxx)
        {
            Object instance = INSTANCES.get(claxx);
            if (instance == null)
            {
                try
                {
                    instance = createNewInstance(claxx);
                } catch (Exception e)
                {
                    throw new IllegalArgumentException(e);
                }
                INSTANCES.put(claxx, instance);
            }
            return claxx.cast(instance);
        }
    }

    public static <T> void reset(Class<T> claxx) throws Exception
    {
        INSTANCES.put(claxx, createNewInstance(claxx));
    }
}
