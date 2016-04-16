package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.TerminationDirection;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass;
import org.opendaylight.yangtools.yang.common.QName;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-ObjectClasses&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-ObjectClasses.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping LogicalTerminationPoint {
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
 *     leaf-list _serverLtpRefList {
 *         type leafref;
 *     }
 *     leaf-list _clientLtpRefList {
 *         type leafref;
 *     }
 *     list _lpList {
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
 *         uses LayerProtocol;
 *     }
 *     leaf-list physicalPortReference {
 *         type string;
 *     }
 *     leaf-list _ltpRefList {
 *         type leafref;
 *     }
 *     leaf ltpDirection {
 *         type TerminationDirection;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreNetworkModule-ObjectClasses/LogicalTerminationPoint&lt;/i&gt;
 *
 */
public interface LogicalTerminationPoint
    extends
    DataObject,
    GlobalClass
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreNetworkModule-ObjectClasses","2016-03-27","LogicalTerminationPoint"));

    /**
     * References contained LTPs representing servers of this LTP in an inverse 
     * multiplexing configuration (e.g. VCAT).
     *
     */
    List<UniversalId> getServerLtpRefList();
    
    /**
     * References contained LTPs representing client traffic of this LTP for normal 
     * cases of multiplexing.
     *
     */
    List<UniversalId> getClientLtpRefList();
    
    /**
     * Ordered list of LayerProtocols that this LTP is comprised of where the first 
     * entry in the list is the lowest server layer (e.g. physical)
     *
     */
    List<LpList> getLpList();
    
    /**
     * One or more text labels for the unmodelled physical port associated with the 
     * LTP.In many cases there is no associated physical port
     *
     */
    List<java.lang.String> getPhysicalPortReference();
    
    /**
     * References one or more LTPs in other views that represent this LTP. The 
     * referencing LTP is the rovider of capability.
     *
     */
    List<UniversalId> getLtpRefList();
    
    /**
     * The overall directionality of the LTP. - A BIDIRECTIONAL LTP must have at least 
     * some LPs that are BIDIRECTIONAL but may also have some SINK and/or SOURCE LPs.- 
     * A SINK LTP can only contain SINK LPs- A SOURCE LTP can only contain SOURCE LPs
     *
     */
    TerminationDirection getLtpDirection();

}

