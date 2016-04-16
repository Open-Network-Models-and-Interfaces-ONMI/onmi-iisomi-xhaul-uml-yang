package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.TerminationDirection;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.LayerProtocolName;
import java.math.BigInteger;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-ObjectClasses&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-ObjectClasses.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping LayerProtocol {
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
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreNetworkModule-ObjectClasses/LayerProtocol&lt;/i&gt;
 *
 */
public interface LayerProtocol
    extends
    DataObject,
    LocalClass
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreNetworkModule-ObjectClasses","2016-03-27","LayerProtocol"));

    /**
     * Indicate the specific layer-protocol described by the LayerProtocol entity.
     *
     */
    LayerProtocolName getLayerProtocolName();
    
    /**
     * Provides a summarized view of the client capacity that is configurable for 
     * use.Note the cleint LTP association should provide all necessary detail hence 
     * this attribute is questionable.
     *
     */
    BigInteger getConfiguredClientCapacity();
    
    /**
     * The overall directionality of the LP. - A BIDIRECTIONAL LP will have some SINK 
     * and/or SOURCE flowss.- A SINK LP can only contain elements with SINK flows or 
     * CONTRA_DIRECTION_SOURCE flows- A SOURCE LP can only contain SOURCE flows or 
     * CONTRA_DIRECTION_SINK flows
     *
     */
    TerminationDirection getLpDirection();
    
    /**
     * Indicates whether the layer is terminated and if so how.
     *
     */
    java.lang.Boolean isTerminationState();

}

