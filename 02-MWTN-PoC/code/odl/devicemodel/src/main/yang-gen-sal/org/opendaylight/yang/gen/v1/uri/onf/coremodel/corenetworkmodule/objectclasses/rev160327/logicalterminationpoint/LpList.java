package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * Ordered list of LayerProtocols that this LTP is comprised of where the first 
 * entry in the list is the lowest server layer (e.g. physical)
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-ObjectClasses&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-ObjectClasses.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list _lpList {
 *     key "uuid"
 *     list nameList {
 *         key "valueName"
 *         leaf valueName {
 *             type string;
 *         }
 *         leaf value {
 *             type string;
 *         }
 *         uses NameAndValue;
 *     }
 *     leaf uuid {
 *         type UniversalId;
 *     }
 *     container localIdList {
 *         leaf valueName {
 *             type string;
 *         }
 *         leaf value {
 *             type string;
 *         }
 *         uses NameAndValue;
 *     }
 *     leaf layerProtocolName {
 *         type LayerProtocolName;
 *     }
 *     leaf configuredClientCapacity {
 *         type uint64;
 *     }
 *     leaf lpDirection {
 *         type TerminationDirection;
 *     }
 *     leaf terminationState {
 *         type boolean;
 *     }
 *     uses LayerProtocol;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreNetworkModule-ObjectClasses/LogicalTerminationPoint/_lpList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpListBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpListKey
 *
 */
public interface LpList
    extends
    ChildOf<LogicalTerminationPoint>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>,
    LayerProtocol,
    Identifiable<LpListKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreNetworkModule-ObjectClasses","2016-03-27","_lpList"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    LpListKey getKey();

}

