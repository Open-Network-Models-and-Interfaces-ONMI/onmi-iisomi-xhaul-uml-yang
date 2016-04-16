package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * A very simple ETH-CTP conditional package for microwave device to support an ETH
 * topology. This _Pac is used for LTPs related to physical ETH ports and 
 * MW-Client-CTP.
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-Ethernet&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-Ethernet.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list ETH_ConnectionTerminationPointBidirectional_Pac {
 *     key "layerProtocol"
 *     leaf layerProtocol {
 *         type UniversalId;
 *     }
 *     leaf currentClientCapacity {
 *         type uint64;
 *     }
 *     leaf vlanId {
 *         type uint64;
 *     }
 *     container lldpAlternative {
 *         leaf lldpV2RemSysName {
 *             type string;
 *         }
 *         leaf lldpV2RemPortId {
 *             type UniversalId;
 *         }
 *         uses LldpV2Rem;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-Ethernet/ETH_ConnectionTerminationPointBidirectional_Pac&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPacBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPacBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPacKey
 *
 */
public interface ETHConnectionTerminationPointBidirectionalPac
    extends
    ChildOf<MicrowaveModelObjectClassesEthernetData>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>,
    Identifiable<ETHConnectionTerminationPointBidirectionalPacKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-Ethernet","2016-03-20","ETH_ConnectionTerminationPointBidirectional_Pac"));

    UniversalId getLayerProtocol();
    
    /**
     * The current transported capacity. The configuredClientCapacity is an existing 
     * attribute of the LayerProtocol object class.
     *
     */
    BigInteger getCurrentClientCapacity();
    
    /**
     * Please see ITU-T G.8021 (https://www.itu.int/rec/T-REC-G.8021-201504-I/en).
     *
     */
    BigInteger getVlanId();
    
    /**
     * An alterantive to LLDP as long as the ETH switches do not support native LLDP 
     * (LLDP-V2-MIB).
     *
     */
    LldpAlternative getLldpAlternative();
    
    /**
     * Returns Primary Key of Yang List Type
     *
     */
    ETHConnectionTerminationPointBidirectionalPacKey getKey();

}

