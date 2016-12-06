/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.eventmanager.api;

public interface EventManagerService {
	public void startListenerOnNode(String nodeName);

	public void removeListenerOnNode(String nodeName);
}
