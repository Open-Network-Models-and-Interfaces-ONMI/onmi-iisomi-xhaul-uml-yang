package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list airInterfaceCapabilityList {
 *     key "airInterfaceID"
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
 *     uses AirInterfaceCapability;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_AirInterface_Pac/airInterfaceCapabilityList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityListBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityListKey
 *
 */
public interface AirInterfaceCapabilityList
    extends
    ChildOf<MWAirInterfacePac>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>,
    AirInterfaceCapability,
    Identifiable<AirInterfaceCapabilityListKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","airInterfaceCapabilityList"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    AirInterfaceCapabilityListKey getKey();

}

