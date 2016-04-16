package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320;
import org.opendaylight.yangtools.yang.binding.DataRoot;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-Ethernet&lt;/b&gt;
 * &lt;br&gt;Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-Ethernet.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * module MicrowaveModel-ObjectClasses-Ethernet {
 *     yang-version 1;
 *     namespace "uri:onf:MicrowaveModel-ObjectClasses-Ethernet";
 *     prefix "MicrowaveModel-ObjectClasses-Ethernet";
 *
 *     import CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages { prefix "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages"; }
 *     revision 2016-03-20 {
 *         description "";
 *     }
 *
 *     list ETH_ConnectionTerminationPointBidirectional_Pac {
 *         key "layerProtocol"
 *         leaf layerProtocol {
 *             type UniversalId;
 *         }
 *         leaf currentClientCapacity {
 *             type uint64;
 *         }
 *         leaf vlanId {
 *             type uint64;
 *         }
 *         container lldpAlternative {
 *             leaf lldpV2RemSysName {
 *                 type string;
 *             }
 *             leaf lldpV2RemPortId {
 *                 type UniversalId;
 *             }
 *             uses LldpV2Rem;
 *         }
 *     }
 *
 *     grouping LldpV2Rem {
 *         leaf lldpV2RemSysName {
 *             type string;
 *         }
 *         leaf lldpV2RemPortId {
 *             type UniversalId;
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 *
 */
public interface MicrowaveModelObjectClassesEthernetData
    extends
    DataRoot
{




    /**
     * A very simple ETH-CTP conditional package for microwave device to support an ETH
     * topology. This _Pac is used for LTPs related to physical ETH ports and 
     * MW-Client-CTP.
     *
     */
    List<ETHConnectionTerminationPointBidirectionalPac> getETHConnectionTerminationPointBidirectionalPac();

}

