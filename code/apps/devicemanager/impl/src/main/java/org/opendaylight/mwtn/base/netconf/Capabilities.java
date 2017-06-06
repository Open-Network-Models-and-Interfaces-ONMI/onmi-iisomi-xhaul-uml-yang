/**
 *
 */
package org.opendaylight.mwtn.base.netconf;

import java.util.List;
import org.opendaylight.yangtools.yang.common.QName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author herbert
 *
 */
public class Capabilities {

    private static final Logger LOG = LoggerFactory.getLogger(Capabilities.class);

    private final List<String> capabilities;

    public Capabilities(List<String> capabilities) {
        LOG.info("Create Capabilities");
        this.capabilities = capabilities;
    }

    /**
     * check if namespace is supported by given capabilites
     * @param theCapability Capability to search
     * @return true if available
     */
    public boolean isSupportingNamespace(QName theCapability ) {

        String theNameSpace = theCapability.getNamespace().toString();

        for (String capability : capabilities) {
            //LOG.info("Check {} against {}", capability, theNameSpace);
            if (capability.contains(theNameSpace)) {
                return true;
            }
        }
        return false;
    }

}
