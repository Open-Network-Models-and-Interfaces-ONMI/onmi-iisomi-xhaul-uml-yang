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
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.binding.api.ReadWriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElementBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.local._class.g.LocalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.local._class.g.LocalIdBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.name.g.Name;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.name.g.NameBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.FdBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointList;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

import static com.highstreet.technologies.odl.app.impl.tools.MountPointServiceHolder.getMountPoint;
import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.CONFIGURATION;

/**
 * Created by odl on 17-6-3.
 */
public class NeExecutor
{
    public NeExecutor(Fc fc, Integer vlanid, LtpInOdlCreator ltpCreator)
    {
        mountPoint = getMountPoint(fc.getNodeName());
        dataBroker = mountPoint.getService(DataBroker.class).get();
        process(fc, vlanid, ltpCreator);
    }

    private List<LogicalTerminationPointList> process(Fc fc, Integer vlanId, LtpInOdlCreator ltpInOdlCreator)
    {
        try
        {
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
        }
        catch (Exception e)
        {
            LOG.warn(e.getMessage(), e);
        }

        return ltp;
    }

    private void getNe() throws ReadFailedException
    {
        InstanceIdentifier<NetworkElement> path = InstanceIdentifier.create(NetworkElement.class);
        ReadOnlyTransaction networkElementTransaction = dataBroker.newReadOnlyTransaction();
        Optional<NetworkElement> networkElementOpt = networkElementTransaction.read(
                CONFIGURATION, path).checkedGet();
        if (networkElementOpt.isPresent())
        {
            this.neBuilder = new NetworkElementBuilder(oldNe = networkElementOpt.get());
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
    private final MountPoint mountPoint;
    private final DataBroker dataBroker;
    private ArrayList<LogicalTerminationPointList> ltp = new ArrayList<>();
    private NetworkElementBuilder neBuilder;
    private NetworkElement oldNe;

    public List<LogicalTerminationPointList> getLtp()
    {
        return ltp;
    }

    public void clear(int vlanId)
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
                ltpList.add(ltpBuilder.build());
                ltpBuilder.getLp().removeIf(
                        lp -> lp.getKey().getUuid().getValue().contains(LAYER_PROTOCOL_NAME.getValue() + "-" + vlanId));
            }
        }

        neBuilder.setLtp(ltpList);

        commit();
    }

    public void commit()
    {
        // submit to network element
        ReadWriteTransaction neCommitTrans = dataBroker.newReadWriteTransaction();
        neCommitTrans.put(CONFIGURATION, InstanceIdentifier.create(NetworkElement.class), neBuilder.build());

        neCommitTrans.submit();
    }
}
