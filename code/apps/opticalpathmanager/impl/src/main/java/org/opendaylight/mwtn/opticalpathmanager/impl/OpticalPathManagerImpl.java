package org.opendaylight.mwtn.opticalpathmanager.impl;

import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.path.computation.rev180307.path.computation.context.g.Path;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.Topology;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;

import com.opendaylight.mwtn.opticalpathmanager.OpticalPathManager;

public class OpticalPathManagerImpl implements OpticalPathManager {

	@Override
	public List<Path> getPath(Topology abstractTopology, Node startPoint, Node endPoint) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean createConnectivityService(Path path) {
		// TODO Auto-generated method stub
		return false;
	}

}
