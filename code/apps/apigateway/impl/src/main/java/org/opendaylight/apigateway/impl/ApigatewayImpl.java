/*
 * Copyright © 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.apigateway.impl;

import java.util.concurrent.Future;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.apigateway.rev171016.ApigatewayService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.apigateway.rev171016.GetInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.apigateway.rev171016.GetOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.apigateway.rev171016.GetOutputBuilder;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

public class ApigatewayImpl implements ApigatewayService {

	@Override
	public Future<RpcResult<GetOutput>> get(GetInput input) {

		GetOutputBuilder getOutputBuilder = new GetOutputBuilder();

		getOutputBuilder.setGreeting("Hello "+input.getName());
		return RpcResultBuilder.success(getOutputBuilder.build()).buildFuture();
	}

}
