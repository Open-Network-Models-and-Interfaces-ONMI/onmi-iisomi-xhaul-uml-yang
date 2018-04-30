/**
 * Convert capabilities of netconfnode into internal format.
 * Boron and Carbon are providing different versions
 */
package org.opendaylight.mwtn.base.netconf;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yangtools.yang.common.QName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Capabilities {

    private static final Logger LOG = LoggerFactory.getLogger(Capabilities.class);
    private static final String INTERFACE_AVAILABLECAPABILITY = "org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.netconf.node.connection.status.available.capabilities.AvailableCapability";

    private final List<String> capabilities = new ArrayList<String>();

    public Capabilities(NetconfNode nnode) {
    	LOG.info("Create Capabilities constructor");

    	if (nnode != null) {
	    	constructor( nnode.getAvailableCapabilities().getAvailableCapability() );
    	}
    }

    /**
     * Does all construction steps
     * @param pcapabilities with a list of capabilities. <br>
     * Type could be <br>
     * - Boron: List<code><String></code> <br>
     * - Carbon: List<AvailableCapability>
     */
    private void constructor(List<?> pcapabilities) {
    	for (Object capability : pcapabilities) {
    		if (LOG.isTraceEnabled()) {
    			LOG.trace("capability class: {} Interfaces: {}", capability.getClass().getName(), Arrays.toString(capability.getClass().getInterfaces()));
    		}
    		if (capability instanceof String) { //ODL Boron specific
    			this.capabilities.add((String)capability);
    		} else if (hasInterface(capability, INTERFACE_AVAILABLECAPABILITY)) {  //Carbon specific part  .. handled via generic
    			try {
    				Method method = capability.getClass().getDeclaredMethod("getCapability");
    				this.capabilities.add(method.invoke(capability).toString());
    			} catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
    				LOG.warn("Unknown capability class leads to a problem", e);
    			}
    		} else {
    			LOG.warn("Unknown capability class: {}", capability.getClass(), Arrays.toString(capability.getClass().getInterfaces()));
    		}
    	}
    }

    /**
     * check if namespace is supported by given capabilites
     * @param theCapability Capability to search
     * @return true if available
     */
    public boolean isSupportingNamespace(QName theCapability ) {

        String theNameSpace = theCapability.getNamespace().toString();

        for (String capability : capabilities) {
            LOG.trace("Check {} against {}", capability, theNameSpace);
            if (capability.contains(theNameSpace)) {
                return true;
            }
        }
        return false;
    }

	@Override
	public String toString() {
		return "Capabilities [capabilities=" + capabilities + "]";
	}


	/**
	 * Check if object is proxy and has specific interface
	 * @param object Name of the object to verify
	 * @param interfaceName is the name of the interface
	 * @return boolean accordingly
	 */
	static boolean hasInterface(Object object, String interfaceName) {
		if (object instanceof Proxy) {
			Class<?>[] interfaces = object.getClass().getInterfaces();
			for (Class<?> i : interfaces) {
				if (i.getName().equals(interfaceName)) {
					return true;
				}
			}
		}
		return false;
	}

}
