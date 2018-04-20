/**
 *
 */
package org.opendaylight.mwtn.genericpathmanager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.InstanceList;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.InstanceListKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpKey;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author herbert
 *
 */
public class ONFCoreNetworkElementRepresentation {

    private static final Logger LOG = LoggerFactory.getLogger(ONFCoreNetworkElementRepresentation.class);

    protected static final String EMPTY = "";

    private static final InstanceIdentifier<NetworkElement> NETWORKELEMENT_IID = InstanceIdentifier
            .builder(NetworkElement.class)
            .build();

    //Example, for IID creation , not used in the code
    private static final InstanceIdentifier<Lp> NETWORKELEMENT_IIDLP = InstanceIdentifier
            .builder(NetworkElement.class)
            .child(Ltp.class, new LtpKey(new UniversalId("1")))
            .child(Lp.class)
            .build();


    private static final InstanceIdentifier<InstanceList> PTPINSTANCES_IID = InstanceIdentifier
            .builder(InstanceList.class, new InstanceListKey(1))
            .build();

    private final String mountPointNodeName;
    private final DataBroker netconfNodeDataBroker;
    private @Nullable NetworkElement optionalNe = null;
    private final @Nonnull List<Lp> interfaceList = Collections.synchronizedList(new CopyOnWriteArrayList<>());


    /*-----------------------------------------------------------------------------
     * Construction
     */

    /**
     * Constructor
     * @param mountPointNodeName Name of the mountpoint
     * @param netconfNodeDataBroker Name of the NE databroker
     */
    public ONFCoreNetworkElementRepresentation(
            String mountPointNodeName,
            DataBroker netconfNodeDataBroker) {

        this.mountPointNodeName = mountPointNodeName;
        this.netconfNodeDataBroker = netconfNodeDataBroker;

        //LOG.debug("support necurrent-problem-list="+this.isNetworkElementCurrentProblemsSupporting12);
        LOG.info("Create NE mountpoint {}", mountPointNodeName);
    }

    /**
     * Read during startup all relevant structure and status parameters from device
     */
    public void initialReadFromNetworkElement() {
        //optionalNe.getLtp().get(0).getLp();
        LOG.debug("Get info about {}", mountPointNodeName);

        readNetworkElement();

        LOG.info("Found info at {} for device {}", mountPointNodeName, getUuId());
    }

    /**
     * Read from NetworkElement and verify LTPs have changed.
     * If the NE has changed, update to the new structure.
     * From initial state it changes also.
     */
    private void readNetworkElement() {

        LOG.debug("Update mountpoint if changed {}", mountPointNodeName);

        optionalNe = GenericTransactionUtils.readData(netconfNodeDataBroker, LogicalDatastoreType.OPERATIONAL, NETWORKELEMENT_IID);

        if (optionalNe == null) {
            LOG.debug("Unable to read NE data for mountpoint {}", mountPointNodeName);
            if (! interfaceList.isEmpty()) {
                interfaceList.clear();
             }

        } else {
            LOG.debug("Mountpoint '{}' NE-Name '{}'", mountPointNodeName, optionalNe.getName().toString());
            List<Lp> actualInterfaceList = getLpList(optionalNe);
            if (! interfaceList.equals(actualInterfaceList) ) {
                LOG.debug("Mountpoint '{}' Update LTP List. Elements {}", mountPointNodeName, actualInterfaceList.size() );
                interfaceList.clear();
                interfaceList.addAll(actualInterfaceList);
            }
        }

     }

    /**
     * Get uuid of Optional NE.
     * @return Uuid or EMPTY String if optionNE is not available
     */
    private String getUuId() {
        String uuid = EMPTY;

        try {
            uuid = optionalNe != null ? optionalNe.getUuid() != null ? optionalNe.getUuid().getValue() : EMPTY : EMPTY;
        } catch (NullPointerException  e) {
            //Unfortunately throws null pointer if not definied
        }
        return uuid;
    }

    /**
     * Get List of UUIDs for conditional packages from Networkelement<br>
     * Possible interfaces are:<br>
     * @param ne
     * @return
     */
    private static List<Lp> getLpList( @Nullable NetworkElement ne ) {

        List<Lp> res = Collections.synchronizedList(new ArrayList<Lp>());

        if (ne != null) {
            List<Ltp> ltpRefList = ne.getLtp();
            if (ltpRefList == null) {
                LOG.debug("DBRead NE-Interfaces: null");
            } else {
                for (Ltp ltRefListE : ltpRefList ) {
                    List<Lp> lpList = ltRefListE.getLp();
                    if (lpList == null) {
                        LOG.debug("DBRead NE-Interfaces Reference List: null");
                    } else {
                        for (Lp ltp : lpList) {
                            ////LayerProtocolName layerProtocolName = lpListE.getLayerProtocolName();
                            //UniversalId uuId = lpListE.getUuid();
                            res.add(ltp);
                        }
                    }
                }
            }
        } else {
            LOG.debug("DBRead NE: null");
        }

        //---- Debug
        if (LOG.isDebugEnabled()) {
            StringBuffer strBuf = new StringBuffer();
            for (Lp ltp : res) {
                if (strBuf.length() > 0) {
                    strBuf.append(", ");
                }
                strBuf.append(ltp.getLayerProtocolName().getValue());
                strBuf.append(':');
                strBuf.append(ltp.getUuid().getValue());
            }
            LOG.debug("DBRead NE-Interfaces: {}", strBuf.toString());
        }
        //---- Debug end

        return res;
    }


}
