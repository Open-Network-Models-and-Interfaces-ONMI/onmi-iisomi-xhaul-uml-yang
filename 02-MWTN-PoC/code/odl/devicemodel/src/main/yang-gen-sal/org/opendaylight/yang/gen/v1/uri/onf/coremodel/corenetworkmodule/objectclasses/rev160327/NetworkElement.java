package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass;
import org.opendaylight.yangtools.yang.common.QName;
import java.util.List;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-ObjectClasses&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-ObjectClasses.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list NetworkElement {
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
 *     leaf operationalState {
 *         type OperationalState;
 *     }
 *     leaf administrativeControl {
 *         type AdministrativeControl;
 *     }
 *     leaf adminsatratveState {
 *         type AdministrativeState;
 *     }
 *     leaf lifecycleState {
 *         type LifecycleState;
 *     }
 *     list localIdList {
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
 *     list _ltpRefList {
 *         key "uuid"
 *         list nameList {
 *             key "valueName"
 *             leaf valueName {
 *                 type string;
 *             }
 *             leaf value {
 *                 type string;
 *             }
 *             uses NameAndValue;
 *         }
 *         leaf operationalState {
 *             type OperationalState;
 *         }
 *         leaf administrativeControl {
 *             type AdministrativeControl;
 *         }
 *         leaf adminsatratveState {
 *             type AdministrativeState;
 *         }
 *         leaf lifecycleState {
 *             type LifecycleState;
 *         }
 *         list localIdList {
 *             key "valueName"
 *             leaf valueName {
 *                 type string;
 *             }
 *             leaf value {
 *                 type string;
 *             }
 *             uses NameAndValue;
 *         }
 *         leaf uuid {
 *             type UniversalId;
 *         }
 *         leaf-list _serverLtpRefList {
 *             type leafref;
 *         }
 *         leaf-list _clientLtpRefList {
 *             type leafref;
 *         }
 *         list _lpList {
 *             key "uuid"
 *             list nameList {
 *                 key "valueName"
 *                 leaf valueName {
 *                     type string;
 *                 }
 *                 leaf value {
 *                     type string;
 *                 }
 *                 uses NameAndValue;
 *             }
 *             leaf uuid {
 *                 type UniversalId;
 *             }
 *             container localIdList {
 *                 leaf valueName {
 *                     type string;
 *                 }
 *                 leaf value {
 *                     type string;
 *                 }
 *                 uses NameAndValue;
 *             }
 *             leaf layerProtocolName {
 *                 type LayerProtocolName;
 *             }
 *             leaf configuredClientCapacity {
 *                 type uint64;
 *             }
 *             leaf lpDirection {
 *                 type TerminationDirection;
 *             }
 *             leaf terminationState {
 *                 type boolean;
 *             }
 *             uses LayerProtocol;
 *         }
 *         leaf-list physicalPortReference {
 *             type string;
 *         }
 *         leaf-list _ltpRefList {
 *             type leafref;
 *         }
 *         leaf ltpDirection {
 *             type TerminationDirection;
 *         }
 *         uses LogicalTerminationPoint;
 *     }
 *     uses GlobalClass;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreNetworkModule-ObjectClasses/NetworkElement&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElementBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElementBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElementKey
 *
 */
public interface NetworkElement
    extends
    ChildOf<CoreModelCoreNetworkModuleObjectClassesData>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>,
    GlobalClass,
    Identifiable<NetworkElementKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreNetworkModule-ObjectClasses","2016-03-27","NetworkElement"));

    /**
     * An NE has associated LTPs that are at its boundary.The NeEncompassesFd 
     * association occurs for FDs that are within the bounds of the NetworkElement 
     * definition such that the FD is bounded by LTPs, all of which are on the boundary
     * of the NetworkElement or are within the NetworkElement. An LTP can be 
     * independent of an NE.
     *
     */
    List<LtpRefList> getLtpRefList();
    
    /**
     * Returns Primary Key of Yang List Type
     *
     */
    NetworkElementKey getKey();

}

