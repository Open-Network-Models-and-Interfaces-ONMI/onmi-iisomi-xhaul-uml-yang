package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureConfiguration;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureStatus;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list MW_Structure_Pac {
 *     key "layerProtocol"
 *     leaf layerProtocol {
 *         type UniversalId;
 *     }
 *     container structureCapability {
 *         leaf structureID {
 *             type string;
 *         }
 *         leaf totalNumberOfTimeSlots {
 *             type uint64;
 *         }
 *         leaf timeSlotCapacity {
 *             type uint64;
 *         }
 *         uses StructureCapability;
 *     }
 *     container structureConfiguration {
 *         leaf serverID {
 *             type string;
 *         }
 *         uses StructureConfiguration;
 *     }
 *     container structureStatus {
 *         list timeSlotStatusList {
 *             key "structureID" 
 *         "timeSlotID"
 *             leaf structureID {
 *                 type string;
 *             }
 *             leaf timeSlotID {
 *                 type string;
 *             }
 *             leaf operationalStatus {
 *                 type OperationalState;
 *             }
 *             uses timeSlotStatusType;
 *         }
 *         uses StructureStatus;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_Structure_Pac&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePacBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePacBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePacKey
 *
 */
public interface MWStructurePac
    extends
    ChildOf<MicrowaveModelObjectClassesMwConnectionData>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>,
    Identifiable<MWStructurePacKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","MW_Structure_Pac"));

    UniversalId getLayerProtocol();
    
    StructureCapability getStructureCapability();
    
    StructureConfiguration getStructureConfiguration();
    
    StructureStatus getStructureStatus();
    
    /**
     * Returns Primary Key of Yang List Type
     *
     */
    MWStructurePacKey getKey();

}

