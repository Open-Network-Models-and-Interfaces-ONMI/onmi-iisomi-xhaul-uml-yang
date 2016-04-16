package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping AirInterfaceCapability {
 *     leaf airInterfaceID {
 *         type string;
 *     }
 *     leaf typeOfEquipment {
 *         type string;
 *     }
 *     leaf supportedChannelPlans {
 *         type string;
 *     }
 *     leaf txFrequencyMin {
 *         type uint64;
 *     }
 *     leaf txFrequencyMax {
 *         type uint64;
 *     }
 *     leaf rxFrequencyMin {
 *         type uint64;
 *     }
 *     leaf rxFrequencyMax {
 *         type uint64;
 *     }
 *     leaf adaptiveModulationIsAvail {
 *         type boolean;
 *     }
 *     list scriptList {
 *         key "scriptID"
 *         leaf scriptID {
 *             type string;
 *         }
 *         leaf channelBandwidth {
 *             type uint64;
 *         }
 *         leaf modulationScheme {
 *             type uint64;
 *         }
 *         leaf txPowerMin {
 *             type int64;
 *         }
 *         leaf txPowerMax {
 *             type int64;
 *         }
 *         leaf xpicIsAvail {
 *             type boolean;
 *         }
 *         uses Script;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/AirInterfaceCapability&lt;/i&gt;
 *
 */
public interface AirInterfaceCapability
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","AirInterfaceCapability"));

    /**
     * Identifies the air interface for connecting with structure or diversity.
     *
     */
    java.lang.String getAirInterfaceID();
    
    /**
     * This parameter indicates the equipment type.Instead of uploading the complete 
     * set of capabilities, capabilities of the same equipment type could be reused.
     *
     */
    java.lang.String getTypeOfEquipment();
    
    /**
     * Unique identifiers of international agreements that describe allocations of 
     * frequency channels, to which this air interface complies, to be 
     * listed.Corresponding channel plans to be delivered by the hardware vendor and to
     * be stored by the operator in the controller/application/attached database.Names 
     * are to be separated by commas.
     *
     */
    java.lang.String getSupportedChannelPlans();
    
    /**
     * Value of the minimum transmit frequency tunable at the air interface.This value 
     * is only relevant, if the channel plan, which is referenced in channelPlanID is 
     * stored in the controller.
     *
     */
    BigInteger getTxFrequencyMin();
    
    /**
     * Value of the maximum transmit frequency tunable at the air interface.This value 
     * is only relevant, if the channel plan, which is referenced in channelPlanID is 
     * stored in the controller.
     *
     */
    BigInteger getTxFrequencyMax();
    
    /**
     * Value of the minimum receive frequency tunable at the air interface.This value 
     * is only relevant, if the channel plan, which is referenced in channelPlanID is 
     * stored in the controller.
     *
     */
    BigInteger getRxFrequencyMin();
    
    /**
     * Value of the maximum receive frequency tunable at the air interface.This value 
     * is only relevant, if the channel plan, which is referenced in channelPlanID is 
     * stored in the controller.
     *
     */
    BigInteger getRxFrequencyMax();
    
    /**
     * In case the Air Interface Port is capable of adaptive modulation, this field 
     * shall contain an '1'.
     *
     */
    java.lang.Boolean isAdaptiveModulationIsAvail();
    
    List<ScriptList> getScriptList();

}

