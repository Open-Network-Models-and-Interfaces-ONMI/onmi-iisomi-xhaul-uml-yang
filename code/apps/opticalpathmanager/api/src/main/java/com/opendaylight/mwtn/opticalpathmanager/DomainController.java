package com.opendaylight.mwtn.opticalpathmanager;

import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LifecycleState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.tapi.context.g.ServiceInterfacePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.connectivity.rev180307.CreateConnectivityServiceInput;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.connectivity.rev180307.DeleteConnectivityServiceInput;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.connectivity.rev180307.create.connectivity.service.input.EndPoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.path.computation.rev180307.path.computation.context.g.Path;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.Topology;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;

public interface DomainController {

	/**
	 * List of topologies: OTSi topology and DSR topology
	 * 
	 * @return
	 */
	public List<Topology> getTopologyList();

	/**
	 * 
	 */
	public List<ServiceInterfacePoint> getInterfaceServicePointList ();
	
	/**
	 * Get the related service end points: start and end points for the path in the domain
	 * for the subsequent create connection service request
	 * @param path
	 * @param otsi topology of the otsi domain
	 * @return List of 2 Node elements: start node and end node of the service end point
	 */
	public List<Node> getIntraDomainConnectivityNodes(Path path, Topology otsi);

	/*
	 * To be used along with ConnectivityServiceInput
	 */
	public Uuid createConnectivityService(CreateConnectivityServiceInput createConnectivityInput);
	
	public void deleteConnectivityService(DeleteConnectivityServiceInput deleteConnectivityInput);

	/*
	 * To be used along with other parameters
	 */
	/**
	 * To be used for planning or activating the User selected path
	 * 
	 * @param startEndPoint
	 * @param endEndPoint
	 * @param lifecycleState only LifecycleState.PLANNED or LifecycleState.INSTALLED to be used
	 * @return
	 */
	public Uuid createConnectivityService(EndPoint startEndPoint, EndPoint endEndPoint, LifecycleState lifecycleState);

	/**
	 * To be used for deleting the service after the test creation
	 * 
	 * @param uuid id of the Service
	 */
	public void deleteConnectivityService(Uuid uuid);

	public List<Double> getOpticalParameters(Uuid uuid);
}
