package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containerconfiguration.Container;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containerconfiguration.TimeSlotIDList;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping ContainerConfiguration {
 *     container container {
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
 *     list timeSlotIDList {
 *         key "structureID" 
 *     "timeSlotID"
 *         leaf structureID {
 *             type string;
 *         }
 *         leaf timeSlotID {
 *             type string;
 *         }
 *         uses timeSlotIDType;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/ContainerConfiguration&lt;/i&gt;
 *
 */
public interface ContainerConfiguration
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","ContainerConfiguration"));

    /**
     * Defines the data type of the container offered to client layers.
     *
     */
    Container getContainer();
    
    List<TimeSlotIDList> getTimeSlotIDList();

}

