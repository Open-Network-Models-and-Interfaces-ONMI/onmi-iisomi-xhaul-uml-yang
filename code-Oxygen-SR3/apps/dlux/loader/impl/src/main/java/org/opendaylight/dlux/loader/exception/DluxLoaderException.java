/*
 * Copyright (c) 2015 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.dlux.loader.exception;

public class DluxLoaderException extends Exception {

    public DluxLoaderException(final String message) {
        super(message);
    }

    public DluxLoaderException(final String message, final Throwable throwable) {
        super(message, throwable);
    }
}
