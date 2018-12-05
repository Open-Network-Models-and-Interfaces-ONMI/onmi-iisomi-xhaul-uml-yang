/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.demoapp;

import java.util.concurrent.Future;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.DemoappService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.HelloAgainOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.HelloWorldInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.HelloWorldOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.HelloWorldOutputBuilder;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DemoAppServiceImpl implements DemoappService, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(DemoAppServiceImpl.class);
    private final RpcRegistration<DemoappService> demoappService;

    public DemoAppServiceImpl(ProviderContext pSession) {

        // Register ourselves as the REST API RPC implementation
        LOG.info("Register RPC Service");

        this.demoappService = pSession.addRpcImplementation(DemoappService.class, this);
    }

    /* (non-Javadoc)
     * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.DemoappService#helloWorld(org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.HelloWorldInput)
     */
    @Override
    public Future<RpcResult<HelloWorldOutput>> helloWorld(HelloWorldInput input) {
        LOG.debug("handle helloWorld: " + input.getName() + " from " + input.getCountry());
        HelloWorldOutputBuilder helloBuilder = new HelloWorldOutputBuilder();
        helloBuilder.setGreeting("hello " + input.getName() + " from " + input.getCountry());
        return RpcResultBuilder.success(helloBuilder.build()).buildFuture();
    }

    /* (non-Javadoc)
     * @see java.lang.AutoCloseable#close()
     */
    @Override
    public void close() throws Exception {
        // TODO Auto-generated method stub
        demoappService.close();
    }

    /* (non-Javadoc)
     * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.demoapp.rev181205.DemoappService#helloAgain()
     */
    @Override
    public Future<RpcResult<HelloAgainOutput>> helloAgain() {
        // TODO Auto-generated method stub
        return null;
    }

}
