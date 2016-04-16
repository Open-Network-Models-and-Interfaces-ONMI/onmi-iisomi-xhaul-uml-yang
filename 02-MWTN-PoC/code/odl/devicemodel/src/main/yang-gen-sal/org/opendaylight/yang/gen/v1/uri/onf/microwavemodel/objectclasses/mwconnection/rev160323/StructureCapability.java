package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping StructureCapability {
 *     leaf structureID {
 *         type string;
 *     }
 *     leaf totalNumberOfTimeSlots {
 *         type uint64;
 *     }
 *     leaf timeSlotCapacity {
 *         type uint64;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/StructureCapability&lt;/i&gt;
 *
 */
public interface StructureCapability
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","StructureCapability"));

    /**
     * Identifies the Structure for bundling and container.
     *
     */
    java.lang.String getStructureID();
    
    /**
     * Maximum number of time slots available with the current configuration of the air
     * interface (means e.g. that AirInterface::AirInterfaceStatus::modulationCur is 
     * equal to AirInterface::AirInterfaceConfiguration::modulationMax).
     *
     */
    BigInteger getTotalNumberOfTimeSlots();
    
    /**
     * The value of the size or width of one time slot. The value should be identical 
     * for all stuctures of the device.
     *
     */
    BigInteger getTimeSlotCapacity();

}

