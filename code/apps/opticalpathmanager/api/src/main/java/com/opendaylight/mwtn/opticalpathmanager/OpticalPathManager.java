package com.opendaylight.mwtn.opticalpathmanager;

import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.path.computation.rev180307.path.computation.context.g.Path;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.Topology;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;

public interface OpticalPathManager {

	public List<Path> getPath(Topology abstractTopology, Node startPoint, Node endPoint);
	
	public boolean createConnectivityService(Path path);
}
