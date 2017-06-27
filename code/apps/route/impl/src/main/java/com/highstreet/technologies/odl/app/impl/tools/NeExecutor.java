/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

import com.google.common.base.Optional;
import com.highstreet.technologies.odl.app.impl.delegates.LtpInOdlCreator;
import com.highstreet.technologies.odl.app.impl.listener.ACMListener;
import org.opendaylight.controller.md.sal.binding.api.*;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.*;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.local._class.g.LocalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.local._class.g.LocalIdBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.name.g.Name;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.name.g.NameBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.FdBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacKey;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.RestoreFollowTopoInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.SwitchFollowTopoInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ExecutionException;

import static com.highstreet.technologies.odl.app.impl.tools.MountPointServiceHolder.getMountPoint;
import static com.highstreet.technologies.odl.app.impl.tools.RPCHolder.rpc;
import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.CONFIGURATION;

/**
 * Created by odl on 17-6-3.
 */
public class NeExecutor
{
    private boolean isBroken = false;

    public NeExecutor(Fc fc, Integer vlanid, LtpInOdlCreator ltpCreator)
    {
        this(getMountPoint(fc.getNodeName()));
        this.vlanId = vlanid;
        process(fc, vlanid, ltpCreator);
    }

    public NeExecutor(MountPoint mountPoint)
    {
        if (mountPoint != null)
        {
            this.dataBroker = mountPoint.getService(DataBroker.class).get();
            mountPoint.getService(NotificationService.class).get().registerNotificationListener(new ACMListener(this));
        } else
        {
            this.isBroken = true;
            LOG.warn("mount point is null");
        }
    }

    private List<LogicalTerminationPointList> process(Fc fc, Integer vlanId, LtpInOdlCreator ltpInOdlCreator)
    {
        try
        {
            if (isBroken)
                return new ArrayList<>();
            getNe();

            // start the creation of fc
            // add client ltps
            ltp.add(addClientLtpTo(neBuilder, vlanId, fc.getAEnd(), ltpInOdlCreator));
            ltp.add(addClientLtpTo(neBuilder, vlanId, fc.getZEnd(), ltpInOdlCreator));

            // add fc into fd
            FdBuilder fdBuilder = new FdBuilder(neBuilder.getFd().remove(0));
            if (fdBuilder.getFc() == null)
                fdBuilder.setFc(new ArrayList<>());

            fdBuilder.getFc().add(new UniversalId(buildFcName(ltp)));

            neBuilder.getFd().add(fdBuilder.build());
        } catch (Throwable e)
        {
            LOG.warn(e.getMessage(), e);
        }

        return ltp;
    }

    private void getNe() throws ReadFailedException
    {
        InstanceIdentifier<NetworkElement> path = InstanceIdentifier.create(NetworkElement.class);
        ReadOnlyTransaction networkElementTransaction = dataBroker.newReadOnlyTransaction();
        try
        {
            Optional<NetworkElement> networkElementOpt = networkElementTransaction.read(
                    CONFIGURATION, path).checkedGet();
            if (networkElementOpt.isPresent())
            {
                this.neBuilder = new NetworkElementBuilder(oldNe = networkElementOpt.get());
            }
        } finally
        {
            networkElementTransaction.close();
        }
    }

    private LogicalTerminationPointList addClientLtpTo(
            NetworkElementBuilder ne, int vlanid, String ltpName,
            LtpInOdlCreator ltpInOdlCreator)
    {
        String clientLtpName = nameFrom(ltpName, LAYER_PROTOCOL_NAME.getValue(), vlanid);
        String lpName = nameFrom(clientLtpName, "LP", 1);

        // add client ltp to ltp
        Ltp serverLTP = null;
        Iterator<Ltp> iterator = ne.getLtp().iterator();
        while (iterator.hasNext())
        {
            Ltp temp = iterator.next();
            if (temp.getUuid().getValue().equalsIgnoreCase(ltpName))
            {
                iterator.remove();
                serverLTP = temp;
                break;
            }
        }
        if (serverLTP == null)
        {
            StringBuffer serverNames = new StringBuffer();
            ne.getLtp().forEach(sltp -> serverNames.append(sltp.getKey().getUuid().getValue()).append(" | "));
            throw new IllegalArgumentException(
                    "no proper server ltp found, input name is: " + ltpName + " and ltps from NE are: " + serverNames);
        }

        LtpBuilder serverBuilder = new LtpBuilder(serverLTP);

        if (serverBuilder.getClientLtp() == null)
            serverBuilder.setClientLtp(new ArrayList<>());
        serverBuilder.getClientLtp().add(new UniversalId(clientLtpName));

        // add client ltp to ltps
        LtpBuilder clientLtpBuilder = new LtpBuilder();
        clientLtpBuilder.setKey(new LtpKey(new UniversalId(clientLtpName)));
        clientLtpBuilder.setName(new ArrayList<>());
        clientLtpBuilder.getName().add(toName(clientLtpName));
        clientLtpBuilder.setServerLtp(Arrays.asList(new UniversalId(serverLTP.getKey().getUuid())));
        // add lp to client ltp
        LpBuilder lpBuilder = new LpBuilder();
        lpBuilder.setKey(new LpKey(new UniversalId(lpName)));
        lpBuilder.setLayerProtocolName(LAYER_PROTOCOL_NAME);
        lpBuilder.setName(new ArrayList<>());
        lpBuilder.getName().add(toName(lpName));

        lpBuilder.setLocalId(new ArrayList<>());
        lpBuilder.getLocalId().add(toLocalId(lpName));
        lpBuilder.setTerminationState(TerminationState.LpCanNeverTerminate);
        clientLtpBuilder.setLp(Arrays.asList(lpBuilder.build()));

        ne.getLtp().add(clientLtpBuilder.build());
        ne.getLtp().add(serverBuilder.build());

        return ltpInOdlCreator.create(ne.getName().get(0).getValue(), clientLtpName, serverLTP);
    }

    private String buildFcName(ArrayList<LogicalTerminationPointList> clientLtpsInFC)
    {
//        String fcName = "LTP-ETY-1.1.1-ETH-23,LTP-ETC-1.3.1-ETH-23"
        StringBuilder fcName = new StringBuilder("");
        for (LogicalTerminationPointList ltp : clientLtpsInFC)
        {
            fcName.append(ltp.getLtpReference().getValue()).append(",");
        }
        return fcName.deleteCharAt(fcName.length() - 1).toString();
    }

    private String nameFrom(String ltpName, String mediator, int vlanId)
    {
        return String.format(ltpName + "-%1$s-%2$d", mediator, vlanId);
    }

    private Name toName(String name)
    {
        NameBuilder nameBuilder = new NameBuilder();
        nameBuilder.setValue(name);
        nameBuilder.setValueName("vName");
        return nameBuilder.build();
    }

    private LocalId toLocalId(String name)
    {
        LocalIdBuilder builder = new LocalIdBuilder();
        builder.setValue(name);
        builder.setValueName("vLocalId");
        return builder.build();
    }

    private static final Logger LOG = LoggerFactory.getLogger(NeExecutor.class);
    private static final LayerProtocolName LAYER_PROTOCOL_NAME = new LayerProtocolName("ETH");
    private static boolean IS_MAIN = true;
    private DataBroker dataBroker;
    private Integer vlanId;
    private ArrayList<LogicalTerminationPointList> ltp = new ArrayList<>();
    private NetworkElementBuilder neBuilder;
    private NetworkElement oldNe;

    public List<LogicalTerminationPointList> getLtp()
    {
        return ltp;
    }

    public void clear(int vlanId)
    {
        try
        {
            this.neBuilder = new NetworkElementBuilder(oldNe);

            // remove fc in fd
            FdBuilder fdBuilder = new FdBuilder(neBuilder.getFd().get(0));
            fdBuilder.getFc().removeIf(fcName -> fcName.getValue().contains(LAYER_PROTOCOL_NAME.getValue() + "-" + vlanId));
            neBuilder.setFd(Collections.singletonList(fdBuilder.build()));

            // remove ltp created by vlan
            neBuilder.getLtp().removeIf(
                    ltp1 -> ltp1.getUuid().getValue().endsWith(LAYER_PROTOCOL_NAME.getValue() + "-" + vlanId));

            // remove all client ltp
            ArrayList<Ltp> ltpList = new ArrayList<>();
            for (Ltp ltp : neBuilder.getLtp())
            {
                LtpBuilder ltpBuilder = new LtpBuilder(ltp);
                if (ltpBuilder.getClientLtp() != null)
                {
                    ltpBuilder.getClientLtp().removeIf(
                            uuid -> uuid.getValue().endsWith(LAYER_PROTOCOL_NAME.getValue() + "-" + vlanId));
                    ltpBuilder.getLp().removeIf(
                            lp -> lp.getKey().getUuid().getValue().contains(LAYER_PROTOCOL_NAME.getValue() + "-" + vlanId));
                }
                ltpList.add(ltpBuilder.build());
            }

            neBuilder.setLtp(ltpList);

            commit();
        } catch (Exception e)
        {
            LOG.warn("", e);
        }
    }

    public void commit()
    {
        // submit to network element
        try
        {
            ReadWriteTransaction neCommitTrans = dataBroker.newReadWriteTransaction();
            neCommitTrans.put(CONFIGURATION, InstanceIdentifier.create(NetworkElement.class), neBuilder.build());

            neCommitTrans.submit();
        } catch (Exception e)
        {
            LOG.warn("caught exception when commit to ne, skip it", e);
        }
    }

    public <T extends ChildOf<MwAirInterfacePac>> T getUnderAirPac(
            String lpId_airInterface, Class<T> tClass,
            LogicalDatastoreType type) throws ReadFailedException, ExecutionException, InterruptedException
    {
        try (ReadOnlyTransaction readOnlyTrans = dataBroker.newReadOnlyTransaction())
        {
            InstanceIdentifier<T> mwAirInterfaceConfigurationIID = InstanceIdentifier
                    .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(new UniversalId(lpId_airInterface)))
                    .child(tClass)
                    .build();

            Optional<T> op = readOnlyTrans.read(type, mwAirInterfaceConfigurationIID).get();
            return op.isPresent() ? op.get() : null;
        }
    }

    public boolean isLtpOfThisOnPath(String lpName)
    {
        for (LogicalTerminationPointList logicalTerminationPointList : ltp)
        {
            String ethLtpName = logicalTerminationPointList.getLtpReference().getValue();
            Ltp airInterface = getLtpNameByLp(lpName);
            if (belongTo(airInterface, ethLtpName))
            {
                return true;
            }
        }
        return false;
    }

    private boolean belongTo(Ltp airInterface, String ethLtpName)
    {
        if (airInterface == null || airInterface.getClientLtp() == null)
        {
            return false;
        }
        for (UniversalId clientID : airInterface.getClientLtp())
        {
            if (clientID.getValue().equalsIgnoreCase(ethLtpName))
                return true;
            if (belongTo(getLtpByName(clientID), ethLtpName))
            {
                return true;
            }
        }
        return false;
    }

    private Ltp getLtpByName(UniversalId clientID)
    {
        for (Ltp ltp1 : neBuilder.getLtp())
        {
            if (ltp1.getKey().getUuid().equals(clientID))
            {
                return ltp1;
            }
        }
        return null;
    }

    private Ltp getLtpNameByLp(String lpId_airInterface)
    {
        for (Ltp ltp1 : neBuilder.getLtp())
        {
            for (Lp lp : ltp1.getLp())
            {
                if (lp.getKey().getUuid().getValue().equalsIgnoreCase(lpId_airInterface))
                {
                    return ltp1;
                }
            }
        }
        return null;
    }

    public void reportSwitch()
    {

        if (IS_MAIN)
        {
            SwitchFollowTopoInputBuilder builder = new SwitchFollowTopoInputBuilder();
            builder.setVlanid(vlanId);
            rpc.switchFollowTopo(builder.build());
        } else
        {
            RestoreFollowTopoInputBuilder builder = new RestoreFollowTopoInputBuilder();
            builder.setVlanid(vlanId);
            rpc.restoreFollowTopo(builder.build());
        }

        IS_MAIN = !IS_MAIN;
    }
}
