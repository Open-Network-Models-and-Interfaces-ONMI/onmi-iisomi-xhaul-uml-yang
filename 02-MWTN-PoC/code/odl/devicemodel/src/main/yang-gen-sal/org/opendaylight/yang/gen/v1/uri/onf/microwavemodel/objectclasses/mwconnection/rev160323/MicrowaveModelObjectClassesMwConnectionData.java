package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataRoot;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * module MicrowaveModel-ObjectClasses-MwConnection {
 *     yang-version 1;
 *     namespace "uri:onf:MicrowaveModel-ObjectClasses-MwConnection";
 *     prefix "MicrowaveModel-ObjectClasses-MwConnection";
 *
 *     import CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages { prefix "CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages"; }
 *     
 *     import MicrowaveModel-TypeDefinitions { prefix "MicrowaveModel-TypeDefinitions"; }
 *     revision 2016-03-23 {
 *         description "";
 *     }
 *
 *     list MW_AirInterface_Pac {
 *         key "layerProtocol"
 *         leaf layerProtocol {
 *             type UniversalId;
 *         }
 *         list airInterfaceCapabilityList {
 *             key "airInterfaceID"
 *             leaf airInterfaceID {
 *                 type string;
 *             }
 *             leaf typeOfEquipment {
 *                 type string;
 *             }
 *             leaf supportedChannelPlans {
 *                 type string;
 *             }
 *             leaf txFrequencyMin {
 *                 type uint64;
 *             }
 *             leaf txFrequencyMax {
 *                 type uint64;
 *             }
 *             leaf rxFrequencyMin {
 *                 type uint64;
 *             }
 *             leaf rxFrequencyMax {
 *                 type uint64;
 *             }
 *             leaf adaptiveModulationIsAvail {
 *                 type boolean;
 *             }
 *             list scriptList {
 *                 key "scriptID"
 *                 leaf scriptID {
 *                     type string;
 *                 }
 *                 leaf channelBandwidth {
 *                     type uint64;
 *                 }
 *                 leaf modulationScheme {
 *                     type uint64;
 *                 }
 *                 leaf txPowerMin {
 *                     type int64;
 *                 }
 *                 leaf txPowerMax {
 *                     type int64;
 *                 }
 *                 leaf xpicIsAvail {
 *                     type boolean;
 *                 }
 *                 uses Script;
 *             }
 *             uses AirInterfaceCapability;
 *         }
 *         container airInterfaceConfiguration {
 *             leaf airInterfaceName {
 *                 type string;
 *             }
 *             leaf radioSignalId {
 *                 type string;
 *             }
 *             leaf txFrequency {
 *                 type uint64;
 *             }
 *             leaf rxFrequency {
 *                 type uint64;
 *             }
 *             leaf txChannelBandwidth {
 *                 type uint64;
 *             }
 *             leaf rxChannelBandwidth {
 *                 type uint64;
 *             }
 *             leaf powerIsOn {
 *                 type boolean;
 *             }
 *             leaf transmitterIsOn {
 *                 type boolean;
 *             }
 *             leaf txPower {
 *                 type int64;
 *             }
 *             leaf adaptiveModulationIsOn {
 *                 type boolean;
 *             }
 *             leaf modulationMin {
 *                 type uint64;
 *             }
 *             leaf modulationMax {
 *                 type uint64;
 *             }
 *             leaf xpicIsOn {
 *                 type boolean;
 *             }
 *             uses AirInterfaceConfiguration;
 *         }
 *         container airInterfaceStatus {
 *             leaf txFrequencyCur {
 *                 type uint64;
 *             }
 *             leaf rxFrequencyCur {
 *                 type uint64;
 *             }
 *             leaf txLevelCur {
 *                 type int64;
 *             }
 *             leaf rxLevelCur {
 *                 type int64;
 *             }
 *             leaf snrCur {
 *                 type int64;
 *             }
 *             leaf linkIsUp {
 *                 type boolean;
 *             }
 *             leaf xpicIsUp {
 *                 type boolean;
 *             }
 *             uses AirInterfaceStatus;
 *         }
 *         container airInterfaceCurrentProblemList {
 *             leaf-list problemList {
 *                 type string;
 *             }
 *             uses AirInterfaceCurrentProblem;
 *         }
 *     }
 *     list MW_Structure_Pac {
 *         key "layerProtocol"
 *         leaf layerProtocol {
 *             type UniversalId;
 *         }
 *         container structureCapability {
 *             leaf structureID {
 *                 type string;
 *             }
 *             leaf totalNumberOfTimeSlots {
 *                 type uint64;
 *             }
 *             leaf timeSlotCapacity {
 *                 type uint64;
 *             }
 *             uses StructureCapability;
 *         }
 *         container structureConfiguration {
 *             leaf serverID {
 *                 type string;
 *             }
 *             uses StructureConfiguration;
 *         }
 *         container structureStatus {
 *             list timeSlotStatusList {
 *                 key "structureID" 
 *             "timeSlotID"
 *                 leaf structureID {
 *                     type string;
 *                 }
 *                 leaf timeSlotID {
 *                     type string;
 *                 }
 *                 leaf operationalStatus {
 *                     type OperationalState;
 *                 }
 *                 uses timeSlotStatusType;
 *             }
 *             uses StructureStatus;
 *         }
 *     }
 *     list MW_Container_Pac {
 *         key "layerProtocol"
 *         leaf layerProtocol {
 *             type UniversalId;
 *         }
 *         container containerCapability {
 *             leaf containerID {
 *                 type string;
 *             }
 *             list availableKindsOfContainerList {
 *                 key "uuid"
 *                 leaf uuid {
 *                     type UniversalId;
 *                 }
 *                 leaf containerName {
 *                     type string;
 *                 }
 *                 leaf numberOfTimeSlotsRequired {
 *                     type uint64;
 *                 }
 *                 leaf bundlingIsAvail {
 *                     type boolean;
 *                 }
 *                 uses containerType;
 *             }
 *             uses ContainerCapability;
 *         }
 *         container containerConfiguration {
 *             container container {
 *                 leaf uuid {
 *                     type UniversalId;
 *                 }
 *                 leaf containerName {
 *                     type string;
 *                 }
 *                 leaf numberOfTimeSlotsRequired {
 *                     type uint64;
 *                 }
 *                 leaf bundlingIsAvail {
 *                     type boolean;
 *                 }
 *                 uses containerType;
 *             }
 *             list timeSlotIDList {
 *                 key "structureID" 
 *             "timeSlotID"
 *                 leaf structureID {
 *                     type string;
 *                 }
 *                 leaf timeSlotID {
 *                     type string;
 *                 }
 *                 uses timeSlotIDType;
 *             }
 *             uses ContainerConfiguration;
 *         }
 *         leaf containerStatus {
 *             type string;
 *         }
 *     }
 *
 *     grouping AirInterfaceCapability {
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
 *     }
 *     grouping AirInterfaceConfiguration {
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
 *     }
 *     grouping AirInterfaceCurrentProblem {
 *         leaf-list problemList {
 *             type string;
 *         }
 *     }
 *     grouping AirInterfaceStatus {
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
 *     }
 *     grouping ContainerCapability {
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
 *     }
 *     grouping ContainerConfiguration {
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
 *     }
 *     grouping Script {
 *         leaf scriptID {
 *             type string;
 *         }
 *         leaf channelBandwidth {
 *             type uint64;
 *         }
 *         leaf modulationScheme {
 *             type uint64;
 *         }
 *         leaf txPowerMin {
 *             type int64;
 *         }
 *         leaf txPowerMax {
 *             type int64;
 *         }
 *         leaf xpicIsAvail {
 *             type boolean;
 *         }
 *     }
 *     grouping StructureCapability {
 *         leaf structureID {
 *             type string;
 *         }
 *         leaf totalNumberOfTimeSlots {
 *             type uint64;
 *         }
 *         leaf timeSlotCapacity {
 *             type uint64;
 *         }
 *     }
 *     grouping StructureConfiguration {
 *         leaf serverID {
 *             type string;
 *         }
 *     }
 *     grouping StructureStatus {
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
 *     }
 * }
 * &lt;/pre&gt;
 *
 */
public interface MicrowaveModelObjectClassesMwConnectionData
    extends
    DataRoot
{




    List<MWAirInterfacePac> getMWAirInterfacePac();
    
    List<MWStructurePac> getMWStructurePac();
    
    List<MWContainerPac> getMWContainerPac();

}

