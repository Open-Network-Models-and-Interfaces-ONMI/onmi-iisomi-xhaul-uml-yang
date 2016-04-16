package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;


/**
 * A configured alternative for LLDP based on LLDP-V2-MIB 
 * (http://www.ieee802.org/1/files/public/MIBs/LLDP-V2-MIB-200906080000Z.txt). It 
 * is needed in the 2. MWTN PoC because not all vendors will implemented LLDP. 
 * Therefore the connectivity between LTP-ETH-CTPs needs to be configured according
 * to planning.Tracy calls it the LLPD of a poor men ;) 
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-Ethernet&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-Ethernet.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping LldpV2Rem {
 *     leaf lldpV2RemSysName {
 *         type string;
 *     }
 *     leaf lldpV2RemPortId {
 *         type UniversalId;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-Ethernet/LldpV2Rem&lt;/i&gt;
 *
 */
public interface LldpV2Rem
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-Ethernet","2016-03-20","LldpV2Rem"));

    /**
     * The string value used to identify the system name of the remote system 
     * (NetworkElement::Name).
     *
     */
    java.lang.String getLldpV2RemSysName();
    
    /**
     * The string value used to identify the port component associated with the remote 
     * system. In the 2. ONF MWTN PoC the string value of the remote LTP_ETH-CTP::uuid 
     * (for remote Microwave device) or a string value for a remote ETH-TTP identifying
     * a host device..
     *
     */
    UniversalId getLldpV2RemPortId();

}

