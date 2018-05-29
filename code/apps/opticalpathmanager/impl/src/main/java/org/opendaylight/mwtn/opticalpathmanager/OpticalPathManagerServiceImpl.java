/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.opticalpathmanager;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.path.computation.rev180307.path.computation.service.g.Path;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.path.computation.rev180307.path.computation.service.g.PathBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.ComputeP2PPathInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.ComputeP2PPathOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.ComputeP2PPathOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.GetInformationInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.GetInformationOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.GetInformationOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.OpticalpathmanagerService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.compute.p._2.p.path.output.ServiceBuilder;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class OpticalPathManagerServiceImpl implements OpticalpathmanagerService, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(OpticalPathManagerServiceImpl.class);

    /*
     * Example
     *   HelloWorldOutputBuilder helloBuilder = new HelloWorldOutputBuilder();
     *   helloBuilder.setGreeting("Hello " + input.getName());
     *   return RpcResultBuilder.success(helloBuilder.build()).buildFuture();
     */
 	@Override
	public Future<RpcResult<ComputeP2PPathOutput>> computeP2PPath(ComputeP2PPathInput input) {
        LOG.debug("handle computeP2PPath");
        ComputeP2PPathOutputBuilder output = new ComputeP2PPathOutputBuilder();

        // Example ... odes not do anything
        ServiceBuilder service = new ServiceBuilder();
        PathBuilder pathBuilder = new PathBuilder();
        Path p = pathBuilder.build();
        List<Path> pathes = new ArrayList<Path>();
        pathes.add(p);
        service.setPath(pathes);
        output.setService(service.build());

		return RpcResultBuilder.success(output.build()).buildFuture();
	}

	@Override
	public void close() throws Exception {
	}

	@Override
	public Future<RpcResult<GetInformationOutput>> getInformation(GetInformationInput input) {
		GetInformationOutputBuilder outputBuilder = new GetInformationOutputBuilder();
		outputBuilder.setInformation("TAPI - Optical path manager V1.00");
		return RpcResultBuilder.success(outputBuilder.build()).buildFuture();
	}


}
