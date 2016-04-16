package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.SeverityType;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160305.DateAndTime;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Notification;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-Notifications&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-Notifications.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * notification ProblemNotification {
 *     leaf counter {
 *         type uint64;
 *     }
 *     leaf timeStamp {
 *         type DateAndTime;
 *     }
 *     leaf objectID {
 *         type UniversalId;
 *     }
 *     leaf problem {
 *         type string;
 *     }
 *     leaf severity {
 *         type severityType;
 *     }
 *     status CURRENT;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-Notifications/ProblemNotification&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ProblemNotificationBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ProblemNotificationBuilder
 *
 */
public interface ProblemNotification
    extends
    DataObject,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ProblemNotification>,
    Notification
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-Notifications","2016-03-20","ProblemNotification"));

    /**
     * Counts problem notifications
     *
     */
    BigInteger getCounter();
    
    DateAndTime getTimeStamp();
    
    /**
     * ID of the affected MW_AirInterface_Pac, MW_AirInterfaceDiversity_Pac, 
     * MW_Structure_Pac or MW_Container_Pac
     *
     */
    UniversalId getObjectID();
    
    /**
     * Name of the problem according to 
     * AirInterface::AirInterfaceCapability::supportedAlarms or 
     * AirInterfaceDiversity::AirInterfaceDiversityCapability::supportedAlarms or 
     * Structure::StructureCapability::supportedAlarms or 
     * Container::ContainerCapability::supportedAlarms
     *
     */
    java.lang.String getProblem();
    
    /**
     * Severity of the problem according to 
     * AirInterface::AirInterfaceConfiguration::problemSeverityList, 
     * AirInterfaceDiversity::AirInterfaceDiversityConfiguration::problemSeverityList, 
     * Structure::StructureConfiguration::problemSeverityList and 
     * Container::ContainerConfiguration::problemSeverityList
     *
     */
    SeverityType getSeverity();

}

