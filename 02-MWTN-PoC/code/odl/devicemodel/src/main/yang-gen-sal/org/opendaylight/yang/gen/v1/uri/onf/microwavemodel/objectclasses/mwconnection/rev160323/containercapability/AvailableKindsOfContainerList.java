package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.ContainerCapability;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * Available container types to be listed.
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list availableKindsOfContainerList {
 *     key "uuid"
 *     leaf uuid {
 *         type UniversalId;
 *     }
 *     leaf containerName {
 *         type string;
 *     }
 *     leaf numberOfTimeSlotsRequired {
 *         type uint64;
 *     }
 *     leaf bundlingIsAvail {
 *         type boolean;
 *     }
 *     uses containerType;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/ContainerCapability/availableKindsOfContainerList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerListBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerListKey
 *
 */
public interface AvailableKindsOfContainerList
    extends
    ChildOf<ContainerCapability>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>,
    ContainerType,
    Identifiable<AvailableKindsOfContainerListKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","availableKindsOfContainerList"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    AvailableKindsOfContainerListKey getKey();

}

