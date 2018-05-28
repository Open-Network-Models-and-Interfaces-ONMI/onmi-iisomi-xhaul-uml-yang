/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.genericpathmanager;

import java.util.concurrent.Future;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.genericpathmanager.rev180119.ComputeP2PPathInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.genericpathmanager.rev180119.ComputeP2PPathOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.genericpathmanager.rev180119.GenericpathmanagerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GenericPathManagerServiceImpl implements GenericpathmanagerService {

    private static final Logger LOG = LoggerFactory.getLogger(GenericPathManagerServiceImpl.class);

    /*
        LOG.debug("handle helloWorld");

        HelloWorldOutputBuilder helloBuilder = new HelloWorldOutputBuilder();
        helloBuilder.setGreeting("Hello " + input.getName());
        return RpcResultBuilder.success(helloBuilder.build()).buildFuture();

    */

	@Override
	public Future<RpcResult<ComputeP2PPathOutput>> computeP2PPath(ComputeP2PPathInput input) {
		// TODO Auto-generated method stub
		return null;
	}


}
