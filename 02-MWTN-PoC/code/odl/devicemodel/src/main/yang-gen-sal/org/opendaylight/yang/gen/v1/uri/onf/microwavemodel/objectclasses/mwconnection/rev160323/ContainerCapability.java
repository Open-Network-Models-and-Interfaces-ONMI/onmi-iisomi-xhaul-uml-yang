package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping ContainerCapability {
 *     leaf containerID {
 *         type string;
 *     }
 *     list availableKindsOfContainerList {
 *         key "uuid"
 *         leaf uuid {
 *             type UniversalId;
 *         }
 *         leaf containerName {
 *             type string;
 *         }
 *         leaf numberOfTimeSlotsRequired {
 *             type uint64;
 *         }
 *         leaf bundlingIsAvail {
 *             type boolean;
 *         }
 *         uses containerType;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/ContainerCapability&lt;/i&gt;
 *
 */
public interface ContainerCapability
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","ContainerCapability"));

    /**
     * ContainterID in Netconf must be the same as EthernetPortID in OpenFlow so a 
     * connection can be made between the two items, which are existing separately in 
     * the controller.
     *
     */
    java.lang.String getContainerID();
    
    /**
     * Available container types to be listed.
     *
     */
    List<AvailableKindsOfContainerList> getAvailableKindsOfContainerList();

}

