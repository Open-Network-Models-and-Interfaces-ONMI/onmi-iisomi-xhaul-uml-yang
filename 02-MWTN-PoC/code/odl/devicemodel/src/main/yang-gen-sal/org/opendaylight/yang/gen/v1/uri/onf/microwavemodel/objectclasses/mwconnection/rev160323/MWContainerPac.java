package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerCapability;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerConfiguration;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list MW_Container_Pac {
 *     key "layerProtocol"
 *     leaf layerProtocol {
 *         type UniversalId;
 *     }
 *     container containerCapability {
 *         leaf containerID {
 *             type string;
 *         }
 *         list availableKindsOfContainerList {
 *             key "uuid"
 *             leaf uuid {
 *                 type UniversalId;
 *             }
 *             leaf containerName {
 *                 type string;
 *             }
 *             leaf numberOfTimeSlotsRequired {
 *                 type uint64;
 *             }
 *             leaf bundlingIsAvail {
 *                 type boolean;
 *             }
 *             uses containerType;
 *         }
 *         uses ContainerCapability;
 *     }
 *     container containerConfiguration {
 *         container container {
 *             leaf uuid {
 *                 type UniversalId;
 *             }
 *             leaf containerName {
 *                 type string;
 *             }
 *             leaf numberOfTimeSlotsRequired {
 *                 type uint64;
 *             }
 *             leaf bundlingIsAvail {
 *                 type boolean;
 *             }
 *             uses containerType;
 *         }
 *         list timeSlotIDList {
 *             key "structureID" 
 *         "timeSlotID"
 *             leaf structureID {
 *                 type string;
 *             }
 *             leaf timeSlotID {
 *                 type string;
 *             }
 *             uses timeSlotIDType;
 *         }
 *         uses ContainerConfiguration;
 *     }
 *     leaf containerStatus {
 *         type string;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_Container_Pac&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPacBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPacBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPacKey
 *
 */
public interface MWContainerPac
    extends
    ChildOf<MicrowaveModelObjectClassesMwConnectionData>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>,
    Identifiable<MWContainerPacKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","MW_Container_Pac"));

    UniversalId getLayerProtocol();
    
    ContainerCapability getContainerCapability();
    
    ContainerConfiguration getContainerConfiguration();
    
    java.lang.String getContainerStatus();
    
    /**
     * Returns Primary Key of Yang List Type
     *
     */
    MWContainerPacKey getKey();

}

