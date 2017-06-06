package org.opendaylight.mwtn.base.netconf;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public enum ONFLayerProtocolName {

    MWAirInterface("MWPS"),                    //V1.0 + V1.2
    EthernetContainer10("ETH-CTP"),            //V1.0
    EthernetContainer12("ETC"),                //V1.2
    EthernetPhysical("ETY"),                //V1.2
    TDMContainer("TDM"),                    //V1.2
    Structure("MWS"),                        //V1.0 + V1.2
    Ethernet("ETH"),                        //V1.2
    Unknown("");

    private static final Logger LOG = LoggerFactory.getLogger(ONFLayerProtocolName.class);

    private final String myLayerProtocolName;

    ONFLayerProtocolName( String myLayerProtocolName ) {
        this.myLayerProtocolName = myLayerProtocolName;
    }

    public boolean is( org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.LayerProtocolName onfName ) {
        return myLayerProtocolName.equals(onfName.getValue());
    }

    public boolean is( org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160710.LayerProtocolName onfName ) {
        return myLayerProtocolName.equals(onfName.getValue());
    }

    public static ONFLayerProtocolName valueOf( org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.LayerProtocolName onfName ) {
        for (ONFLayerProtocolName protocol : ONFLayerProtocolName.values()) {
            if (protocol.is(onfName)) {
                return protocol;
            }
        }
        LOG.info("Can not map {}. Use Unknown",onfName.getValue() );
        return Unknown;
    }

    public static ONFLayerProtocolName valueOf( org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160710.LayerProtocolName onfName ) {
        for (ONFLayerProtocolName protocol : ONFLayerProtocolName.values()) {
            if (protocol.is(onfName)) {
                return protocol;
            }
        }
        LOG.info("Can not map {}. Use Unknown",onfName.getValue() );
        return Unknown;
    }
}

