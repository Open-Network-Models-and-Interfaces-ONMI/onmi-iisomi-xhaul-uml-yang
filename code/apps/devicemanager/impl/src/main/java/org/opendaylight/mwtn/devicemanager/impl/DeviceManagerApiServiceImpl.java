package org.opendaylight.mwtn.devicemanager.impl;

import java.util.List;
import java.util.concurrent.Future;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.mwtn.maintenance.MaintenanceRPCServiceAPI;
import org.opendaylight.mwtn.maintenance.impl.MaintenanceServiceImpl;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ClearCurrentFaultByNodenameInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ClearCurrentFaultByNodenameOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ClearCurrentFaultByNodenameOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.DevicemanagerApiService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetRequiredNetworkElementKeysOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetRequiredNetworkElementKeysOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeOutputBuilder;
import org.opendaylight.yangtools.yang.common.RpcError.ErrorType;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeviceManagerApiServiceImpl implements DevicemanagerApiService, AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(DevicemanagerApiService.class);

	private RpcRegistration<DevicemanagerApiService> rpcReg;

	private MaintenanceRPCServiceAPI maintenanceService;
	private ResyncNetworkElementsListener resyncCallbackListener;

	DeviceManagerApiServiceImpl(ProviderContext pSession) {
		// Register ourselves as the REST API RPC implementation
		LOG.info("Register RPC Service");
		this.maintenanceService = null;
		pSession.addRpcImplementation(DevicemanagerApiService.class, this);
	}

	public void setMaintenanceService(MaintenanceServiceImpl maintenanceService2) {
		this.maintenanceService = maintenanceService2;
	}

	@Override
	public void close() throws Exception {
		LOG.info("Close RPC Service");
		if (rpcReg != null)
			rpcReg.close();
	}

    /*-------------------------------
     * Interfaces for MaintenanceService
     */

	@Override
	public Future<RpcResult<GetRequiredNetworkElementKeysOutput>> getRequiredNetworkElementKeys() {

		LOG.info("RPC Request: getRequiredNetworkElementKeys");
		RpcResultBuilder<GetRequiredNetworkElementKeysOutput> result;
		try {
			GetRequiredNetworkElementKeysOutputBuilder outputBuilder = maintenanceService.getRequiredNetworkElementKeys();
			result =  RpcResultBuilder.success(outputBuilder);
		} catch (Exception e) {
			result = RpcResultBuilder.failed();
			result.withError(ErrorType.APPLICATION, "Exception", e);
		}
		return result.buildFuture();
	}

	@Override
	public Future<RpcResult<ShowRequiredNetworkElementOutput>> showRequiredNetworkElement(
			ShowRequiredNetworkElementInput input) {

		LOG.info("RPC Request: showRequiredNetworkElement input: {}", input.getMountpointName());
		RpcResultBuilder<ShowRequiredNetworkElementOutput> result;

		try {
			ShowRequiredNetworkElementOutputBuilder outputBuilder = maintenanceService.showRequiredNetworkElement(input);
			result =  RpcResultBuilder.success(outputBuilder);
		} catch (Exception e) {
			result = RpcResultBuilder.failed();
			result.withError(ErrorType.APPLICATION, "Exception", e);
		}
		return result.buildFuture();
	}

	@Override
	public Future<RpcResult<SetMaintenanceModeOutput>> setMaintenanceMode(SetMaintenanceModeInput input) {

		LOG.info("RPC Request: setMaintenanceMode input: {}", input.getMountpointName());
		RpcResultBuilder<SetMaintenanceModeOutput> result;

		try {
			SetMaintenanceModeOutputBuilder outputBuilder = maintenanceService.setMaintenanceMode(input);
			result =  RpcResultBuilder.success(outputBuilder);
		} catch (Exception e) {
			result = RpcResultBuilder.failed();
			result.withError(ErrorType.APPLICATION, "Exception", e);
		}
		return result.buildFuture();

	}



	@Override
	public Future<RpcResult<GetMaintenanceModeOutput>> getMaintenanceMode(GetMaintenanceModeInput input) {

		LOG.info("RPC Request: getMaintenanceMode input: {}", input.getMountpointName());
		RpcResultBuilder<GetMaintenanceModeOutput> result;

		try {
			GetMaintenanceModeOutputBuilder outputBuilder = maintenanceService.getMaintenanceMode(input);
			result =  RpcResultBuilder.success(outputBuilder);
		} catch (Exception e) {
			result = RpcResultBuilder.failed();
			result.withError(ErrorType.APPLICATION, "Exception", e);
		}
		return result.buildFuture();

	}

	@Override
	public Future<RpcResult<TestMaintenanceModeOutput>> testMaintenanceMode(TestMaintenanceModeInput input) {
		LOG.info("RPC Request: getMaintenanceMode input: {}", input.getMountpointName());
		RpcResultBuilder<TestMaintenanceModeOutput> result;

		try {
			TestMaintenanceModeOutputBuilder outputBuilder = maintenanceService.testMaintenanceMode(input);
			result =  RpcResultBuilder.success(outputBuilder);
		} catch (Exception e) {
			result = RpcResultBuilder.failed();
			result.withError(ErrorType.APPLICATION, "Exception", e);
		}
		return result.buildFuture();

	}


	@Override
	public Future<RpcResult<ClearCurrentFaultByNodenameOutput>> clearCurrentFaultByNodename(
			ClearCurrentFaultByNodenameInput input) {
		LOG.info("RPC Request: clearNetworkElementAlarms input: {}", input.getNodenames());
		RpcResultBuilder<ClearCurrentFaultByNodenameOutput> result;
		try {
			if(this.resyncCallbackListener!=null) {
				List<String> nodeNames= this.resyncCallbackListener.doClearCurrentFaultByNodename(input.getNodenames());
				ClearCurrentFaultByNodenameOutputBuilder outputBuilder = new ClearCurrentFaultByNodenameOutputBuilder();
				outputBuilder.setNodenames(nodeNames);
				result =  RpcResultBuilder.success(outputBuilder);
			} else {
				result = RpcResultBuilder.failed();
				result.withError(ErrorType.APPLICATION, "Startup running" );
			}
		} catch(Exception e) {
			result = RpcResultBuilder.failed();
			result.withError(ErrorType.APPLICATION, "Exception", e);
		}
		return result.buildFuture();
	}

	public void setResyncListener(ResyncNetworkElementsListener listener) {
		this.resyncCallbackListener = listener;
	}



}
