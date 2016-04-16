package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotStatusType;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureStatus;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list timeSlotStatusList {
 *     key "structureID" 
 * "timeSlotID"
 *     leaf structureID {
 *         type string;
 *     }
 *     leaf timeSlotID {
 *         type string;
 *     }
 *     leaf operationalStatus {
 *         type OperationalState;
 *     }
 *     uses timeSlotStatusType;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/StructureStatus/timeSlotStatusList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusListBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusListKey
 *
 */
public interface TimeSlotStatusList
    extends
    ChildOf<StructureStatus>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>,
    TimeSlotStatusType,
    Identifiable<TimeSlotStatusListKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","timeSlotStatusList"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    TimeSlotStatusListKey getKey();

}

