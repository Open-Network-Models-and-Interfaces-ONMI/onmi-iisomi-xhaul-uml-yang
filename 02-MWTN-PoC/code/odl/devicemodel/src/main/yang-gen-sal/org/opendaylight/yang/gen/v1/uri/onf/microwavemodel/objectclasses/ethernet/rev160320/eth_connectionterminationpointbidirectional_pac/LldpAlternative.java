package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * An alterantive to LLDP as long as the ETH switches do not support native LLDP 
 * (LLDP-V2-MIB).
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-Ethernet&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-Ethernet.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container lldpAlternative {
 *     leaf lldpV2RemSysName {
 *         type string;
 *     }
 *     leaf lldpV2RemPortId {
 *         type UniversalId;
 *     }
 *     uses LldpV2Rem;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-Ethernet/ETH_ConnectionTerminationPointBidirectional_Pac/lldpAlternative&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternativeBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternativeBuilder
 *
 */
public interface LldpAlternative
    extends
    ChildOf<ETHConnectionTerminationPointBidirectionalPac>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>,
    LldpV2Rem
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-Ethernet","2016-03-20","lldpAlternative"));


}

