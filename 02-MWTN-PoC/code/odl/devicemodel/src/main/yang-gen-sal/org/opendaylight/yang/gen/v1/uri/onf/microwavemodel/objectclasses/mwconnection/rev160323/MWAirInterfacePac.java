package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCurrentProblemList;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list MW_AirInterface_Pac {
 *     key "layerProtocol"
 *     leaf layerProtocol {
 *         type UniversalId;
 *     }
 *     list airInterfaceCapabilityList {
 *         key "airInterfaceID"
 *         leaf airInterfaceID {
 *             type string;
 *         }
 *         leaf typeOfEquipment {
 *             type string;
 *         }
 *         leaf supportedChannelPlans {
 *             type string;
 *         }
 *         leaf txFrequencyMin {
 *             type uint64;
 *         }
 *         leaf txFrequencyMax {
 *             type uint64;
 *         }
 *         leaf rxFrequencyMin {
 *             type uint64;
 *         }
 *         leaf rxFrequencyMax {
 *             type uint64;
 *         }
 *         leaf adaptiveModulationIsAvail {
 *             type boolean;
 *         }
 *         list scriptList {
 *             key "scriptID"
 *             leaf scriptID {
 *                 type string;
 *             }
 *             leaf channelBandwidth {
 *                 type uint64;
 *             }
 *             leaf modulationScheme {
 *                 type uint64;
 *             }
 *             leaf txPowerMin {
 *                 type int64;
 *             }
 *             leaf txPowerMax {
 *                 type int64;
 *             }
 *             leaf xpicIsAvail {
 *                 type boolean;
 *             }
 *             uses Script;
 *         }
 *         uses AirInterfaceCapability;
 *     }
 *     container airInterfaceConfiguration {
 *         leaf airInterfaceName {
 *             type string;
 *         }
 *         leaf radioSignalId {
 *             type string;
 *         }
 *         leaf txFrequency {
 *             type uint64;
 *         }
 *         leaf rxFrequency {
 *             type uint64;
 *         }
 *         leaf txChannelBandwidth {
 *             type uint64;
 *         }
 *         leaf rxChannelBandwidth {
 *             type uint64;
 *         }
 *         leaf powerIsOn {
 *             type boolean;
 *         }
 *         leaf transmitterIsOn {
 *             type boolean;
 *         }
 *         leaf txPower {
 *             type int64;
 *         }
 *         leaf adaptiveModulationIsOn {
 *             type boolean;
 *         }
 *         leaf modulationMin {
 *             type uint64;
 *         }
 *         leaf modulationMax {
 *             type uint64;
 *         }
 *         leaf xpicIsOn {
 *             type boolean;
 *         }
 *         uses AirInterfaceConfiguration;
 *     }
 *     container airInterfaceStatus {
 *         leaf txFrequencyCur {
 *             type uint64;
 *         }
 *         leaf rxFrequencyCur {
 *             type uint64;
 *         }
 *         leaf txLevelCur {
 *             type int64;
 *         }
 *         leaf rxLevelCur {
 *             type int64;
 *         }
 *         leaf snrCur {
 *             type int64;
 *         }
 *         leaf linkIsUp {
 *             type boolean;
 *         }
 *         leaf xpicIsUp {
 *             type boolean;
 *         }
 *         uses AirInterfaceStatus;
 *     }
 *     container airInterfaceCurrentProblemList {
 *         leaf-list problemList {
 *             type string;
 *         }
 *         uses AirInterfaceCurrentProblem;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_AirInterface_Pac&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePacBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePacBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePacKey
 *
 */
public interface MWAirInterfacePac
    extends
    ChildOf<MicrowaveModelObjectClassesMwConnectionData>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>,
    Identifiable<MWAirInterfacePacKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","MW_AirInterface_Pac"));

    UniversalId getLayerProtocol();
    
    List<AirInterfaceCapabilityList> getAirInterfaceCapabilityList();
    
    AirInterfaceConfiguration getAirInterfaceConfiguration();
    
    AirInterfaceStatus getAirInterfaceStatus();
    
    AirInterfaceCurrentProblemList getAirInterfaceCurrentProblemList();
    
    /**
     * Returns Primary Key of Yang List Type
     *
     */
    MWAirInterfacePacKey getKey();

}

