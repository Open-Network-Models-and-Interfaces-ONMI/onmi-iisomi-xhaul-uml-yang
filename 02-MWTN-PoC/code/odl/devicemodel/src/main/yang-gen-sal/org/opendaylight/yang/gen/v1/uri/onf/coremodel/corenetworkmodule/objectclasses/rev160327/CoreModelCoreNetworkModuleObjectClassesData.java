package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327;
import org.opendaylight.yangtools.yang.binding.DataRoot;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-ObjectClasses&lt;/b&gt;
 * &lt;br&gt;Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-ObjectClasses.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * module CoreModel-CoreNetworkModule-ObjectClasses {
 *     yang-version 1;
 *     namespace "uri:onf:CoreModel-CoreNetworkModule-ObjectClasses";
 *     prefix "CoreModel-CoreNetworkModule-ObjectClasses";
 *
 *     import CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages { prefix "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages"; }
 *     
 *     import CoreModel-CoreNetworkModule-TypeDefinitions { prefix "CoreModel-CoreNetworkModule-TypeDefinitions"; }
 *     revision 2016-03-27 {
 *         description "";
 *     }
 *
 *     list NetworkElement {
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
 *         list _ltpRefList {
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
 *             leaf operationalState {
 *                 type OperationalState;
 *             }
 *             leaf administrativeControl {
 *                 type AdministrativeControl;
 *             }
 *             leaf adminsatratveState {
 *                 type AdministrativeState;
 *             }
 *             leaf lifecycleState {
 *                 type LifecycleState;
 *             }
 *             list localIdList {
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
 *             leaf-list _serverLtpRefList {
 *                 type leafref;
 *             }
 *             leaf-list _clientLtpRefList {
 *                 type leafref;
 *             }
 *             list _lpList {
 *                 key "uuid"
 *                 list nameList {
 *                     key "valueName"
 *                     leaf valueName {
 *                         type string;
 *                     }
 *                     leaf value {
 *                         type string;
 *                     }
 *                     uses NameAndValue;
 *                 }
 *                 leaf uuid {
 *                     type UniversalId;
 *                 }
 *                 container localIdList {
 *                     leaf valueName {
 *                         type string;
 *                     }
 *                     leaf value {
 *                         type string;
 *                     }
 *                     uses NameAndValue;
 *                 }
 *                 leaf layerProtocolName {
 *                     type LayerProtocolName;
 *                 }
 *                 leaf configuredClientCapacity {
 *                     type uint64;
 *                 }
 *                 leaf lpDirection {
 *                     type TerminationDirection;
 *                 }
 *                 leaf terminationState {
 *                     type boolean;
 *                 }
 *                 uses LayerProtocol;
 *             }
 *             leaf-list physicalPortReference {
 *                 type string;
 *             }
 *             leaf-list _ltpRefList {
 *                 type leafref;
 *             }
 *             leaf ltpDirection {
 *                 type TerminationDirection;
 *             }
 *             uses LogicalTerminationPoint;
 *         }
 *         uses GlobalClass;
 *     }
 *
 *     grouping LayerProtocol {
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
 *         leaf uuid {
 *             type UniversalId;
 *         }
 *         container localIdList {
 *             leaf valueName {
 *                 type string;
 *             }
 *             leaf value {
 *                 type string;
 *             }
 *             uses NameAndValue;
 *         }
 *         leaf layerProtocolName {
 *             type LayerProtocolName;
 *         }
 *         leaf configuredClientCapacity {
 *             type uint64;
 *         }
 *         leaf lpDirection {
 *             type TerminationDirection;
 *         }
 *         leaf terminationState {
 *             type boolean;
 *         }
 *     }
 *     grouping LogicalTerminationPoint {
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
 *     }
 * }
 * &lt;/pre&gt;
 *
 */
public interface CoreModelCoreNetworkModuleObjectClassesData
    extends
    DataRoot
{




    List<NetworkElement> getNetworkElement();

}

