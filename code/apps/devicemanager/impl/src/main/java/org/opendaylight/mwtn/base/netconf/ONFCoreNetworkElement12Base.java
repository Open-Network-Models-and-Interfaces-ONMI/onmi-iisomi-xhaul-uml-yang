package org.opendaylight.mwtn.base.netconf;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;
import org.opendaylight.mwtn.base.netconf.container.Capabilities;
import org.opendaylight.mwtn.base.netconf.util.GenericTransactionUtils;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.InstanceList;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.InstanceListKey;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.PortDsEntry;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.instance.list.PortDsList;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.ptp.dataset.rev170208.port.ds.entry.PortIdentity;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.extension.g.Extension;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.onf.core.model.conditional.packages.rev170402.NetworkElementPac;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



/**
 * This class contains the ONF Core model Version 1.2 related functions.
 * It should import
 */
public abstract class ONFCoreNetworkElement12Base extends ONFCoreNetworkElementBase implements ONFCOreNetworkElementCoreData {

    private static final Logger LOG = LoggerFactory.getLogger(ONFCoreNetworkElement12Base.class);

    protected static final List<Extension> EMPTYLTPEXTENSIONLIST = new ArrayList<>();
    // private static final List<Ltp> EMPTYLTPLIST = new ArrayList<>();

    protected static final InstanceIdentifier<NetworkElement> NETWORKELEMENT_IID = InstanceIdentifier
            .builder(NetworkElement.class).build();

    protected static final InstanceIdentifier<InstanceList> PTPINSTANCES_IID = InstanceIdentifier
            .builder(InstanceList.class, new InstanceListKey(1)).build();

    /*-----------------------------------------------------------------------------
     * Class members
     */

    // Non specific part. Used by all functions.
    /** interfaceList is used by PM task and should be synchronized */
    protected final @Nonnull List<Lp> interfaceList = Collections.synchronizedList(new CopyOnWriteArrayList<>());
    protected @Nullable NetworkElement optionalNe = null;

    // Performance monitoring specific part
    /** Lock for the PM access specific elements that could be null */
    protected final @Nonnull Object pmLock = new Object();
    protected @Nullable Iterator<Lp> interfaceListIterator = null;
    /** Actual pmLp used during iteration over interfaces */
    protected @Nullable Lp pmLp = null;

    // Device monitoring specific part
    /** Lock for the DM access specific elements that could be null */
    protected final @Nonnull Object dmLock = new Object();

    protected final boolean isNetworkElementCurrentProblemsSupporting12;

    protected final ONFCoreNetworkElement12Equipment equipment;

    /*
     * Constructor
     */

	protected ONFCoreNetworkElement12Base(String mountPointNodeName, DataBroker netconfNodeDataBroker,
			Capabilities capabilities) {
		super(mountPointNodeName, netconfNodeDataBroker, capabilities);
		// TODO Auto-generated constructor stub
        this.isNetworkElementCurrentProblemsSupporting12 = capabilities.isSupportingNamespaceAndRevision(NetworkElementPac.QNAME);
        this.equipment = new ONFCoreNetworkElement12Equipment(this, capabilities);
        LOG.debug("support necurrent-problem-list=" + this.isNetworkElementCurrentProblemsSupporting12);
        LOG.info("Create NE instance {}", InstanceList.QNAME.getLocalName());
	}

    /*---------------------------------------------------------------
     * Getter/ Setter
     */

	public NetworkElement getOptionalNetworkElement() {
		return optionalNe;
	}


    /*---------------------------------------------------------------
     * Device Monitor
     */

    @Override
    public boolean checkIfConnectionToMediatorIsOk() {
        synchronized (dmLock) {
            return optionalNe != null;
        }
    }

    /*
     * New implementation to interpret status with empty LTP List as notConnected => return false
     * 30.10.2018 Since this behavior is very specific and implicit for specific NE Types
     *     it needs to be activated by extension or configuration. Change to be disabled at the moment
     */
    @Override
    public boolean checkIfConnectionToNeIsOk() {
    	return true;
    	/* => TODO Activate by extension.
        synchronized (dmLock) {
            return optionalNe != null && !interfaceList.isEmpty();
        }
        */

    }

    /*---------------------------------------------------------------
     * Synchronization
     */

    /**
     * Query synchronization information out of NE
     */

    @Override
    public void initSynchronizationExtension() {
        // ClockIdentityType vv;
        try {
            if (!capabilities.isSupportingNamespaceAndRevision(InstanceList.QNAME)) {
                LOG.debug("Mountpoint {} does not support PTP", mountPointNodeName);
            } else {
                StringBuffer sb = new StringBuffer();
                sb.append("NE " + mountPointNodeName + " does support synchronisation.\n");
                InstanceList ptpInstance = readPTPClockInstances();
                if (ptpInstance != null) {
                    List<PortDsList> dsList = ptpInstance.getPortDsList();
                    if (dsList != null) {
                        int t = 0;
                        for (PortDsEntry portDs : ptpInstance.getPortDsList()) {
                            PortIdentity portId = portDs.getPortIdentity();
                            if (portId != null) {
                                sb.append("Port[");
                                sb.append(portId.getPortNumber());
                                sb.append("]{ ClockId: ");
                                sb.append(portId.getClockIdentity());
                                sb.append(", Portstate: ");
                                sb.append(portDs.getPortState());
                                sb.append("}, ");
                            } else {
                                sb.append("Incomplete port #" + t + ", ");
                            }
                            t++;
                        }
                    } else {
                        sb.append("dsList contains null");
                    }
                } else {
                    sb.append("ptpInstance equals null");
                }
                LOG.trace(sb.toString());
            }
        } catch (Exception e) {
            LOG.info("Inconsistent synchronisation structure: " + e.getMessage());
        }

    }

    @Nullable
    private InstanceList readPTPClockInstances() {
        return GenericTransactionUtils.readData(netconfNodeDataBroker, LogicalDatastoreType.OPERATIONAL,
                PTPINSTANCES_IID);
    }

    /*---------------------------------------------------------------
     * Equipment related functions
     */


    @Override
    public InventoryInformation getInventoryInformation() {
        return this.getInventoryInformation(null);
    }


    @Override
    public @Nonnull InventoryInformation getInventoryInformation(String layerProtocolFilter) {
        LOG.debug("request inventory information. filter:" + layerProtocolFilter);
        return this.equipment.getInventoryInformation(getFilteredInterfaceUuidsAsStringList(layerProtocolFilter));
    }

    /*---------------------------------------------------------------
     * Other
     */

    @Override
    protected List<String> getFilteredInterfaceUuidsAsStringList(String layerProtocolFilter) {
        List<String> uuids = new ArrayList<>();

        LOG.debug("request inventory information. filter:" + layerProtocolFilter);
        if (optionalNe != null) {
            // uuids
            for (Lp lp : this.interfaceList) {
                if (layerProtocolFilter == null || layerProtocolFilter.isEmpty()) {
                    uuids.add(lp.getUuid().getValue());
                } else if (lp.getLayerProtocolName() != null && lp.getLayerProtocolName().getValue() != null
                        && lp.getLayerProtocolName().getValue().equals(layerProtocolFilter)) {
                    uuids.add(lp.getUuid().getValue());
                }
            }
        }
        LOG.debug("uuids found: {}", uuids);
        return uuids;
    }

}
