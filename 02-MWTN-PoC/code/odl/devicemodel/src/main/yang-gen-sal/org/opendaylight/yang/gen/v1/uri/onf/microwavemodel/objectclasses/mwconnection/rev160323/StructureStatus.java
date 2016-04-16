package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping StructureStatus {
 *     list timeSlotStatusList {
 *         key "structureID" 
 *     "timeSlotID"
 *         leaf structureID {
 *             type string;
 *         }
 *         leaf timeSlotID {
 *             type string;
 *         }
 *         leaf operationalStatus {
 *             type OperationalState;
 *         }
 *         uses timeSlotStatusType;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/StructureStatus&lt;/i&gt;
 *
 */
public interface StructureStatus
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","StructureStatus"));

    List<TimeSlotStatusList> getTimeSlotStatusList();

}

