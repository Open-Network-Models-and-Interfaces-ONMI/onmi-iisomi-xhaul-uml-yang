package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list scriptList {
 *     key "scriptID"
 *     leaf scriptID {
 *         type string;
 *     }
 *     leaf channelBandwidth {
 *         type uint64;
 *     }
 *     leaf modulationScheme {
 *         type uint64;
 *     }
 *     leaf txPowerMin {
 *         type int64;
 *     }
 *     leaf txPowerMax {
 *         type int64;
 *     }
 *     leaf xpicIsAvail {
 *         type boolean;
 *     }
 *     uses Script;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/AirInterfaceCapability/scriptList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptListBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptListKey
 *
 */
public interface ScriptList
    extends
    ChildOf<AirInterfaceCapability>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>,
    Script,
    Identifiable<ScriptListKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","scriptList"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    ScriptListKey getKey();

}

