package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.OperationalState;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-TypeDefinitions&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-TypeDefinitions.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping timeSlotStatusType {
 *     leaf structureID {
 *         type string;
 *     }
 *     leaf timeSlotID {
 *         type string;
 *     }
 *     leaf operationalStatus {
 *         type OperationalState;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-TypeDefinitions/timeSlotStatusType&lt;/i&gt;
 *
 */
public interface TimeSlotStatusType
    extends
    DataObject,
    TimeSlotIDType
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-TypeDefinitions","2016-03-23","timeSlotStatusType"));

    /**
     * Current operational status of each time slot.
     *
     */
    OperationalState getOperationalStatus();

}

