package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container airInterfaceConfiguration {
 *     leaf airInterfaceName {
 *         type string;
 *     }
 *     leaf radioSignalId {
 *         type string;
 *     }
 *     leaf txFrequency {
 *         type uint64;
 *     }
 *     leaf rxFrequency {
 *         type uint64;
 *     }
 *     leaf txChannelBandwidth {
 *         type uint64;
 *     }
 *     leaf rxChannelBandwidth {
 *         type uint64;
 *     }
 *     leaf powerIsOn {
 *         type boolean;
 *     }
 *     leaf transmitterIsOn {
 *         type boolean;
 *     }
 *     leaf txPower {
 *         type int64;
 *     }
 *     leaf adaptiveModulationIsOn {
 *         type boolean;
 *     }
 *     leaf modulationMin {
 *         type uint64;
 *     }
 *     leaf modulationMax {
 *         type uint64;
 *     }
 *     leaf xpicIsOn {
 *         type boolean;
 *     }
 *     uses AirInterfaceConfiguration;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_AirInterface_Pac/airInterfaceConfiguration&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfigurationBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfigurationBuilder
 *
 */
public interface AirInterfaceConfiguration
    extends
    ChildOf<MWAirInterfacePac>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>,
    org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","airInterfaceConfiguration"));


}

