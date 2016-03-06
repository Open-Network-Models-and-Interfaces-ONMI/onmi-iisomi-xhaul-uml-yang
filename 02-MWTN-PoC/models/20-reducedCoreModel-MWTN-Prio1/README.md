# Reduced Core Model and Prio1 Microwave Model
For the second ONF MWTN PoC the ONF Core Model 1.1 is reduced to focus on the important ObjectClases and to avoid unnecessary (less important) error analysis.
The focus is on the Object Classes: NetworkElement, LogicalTerminaionPoint and LayerProtocol.

In addition the microwave transport network specific coditional packages and its prio1 attributes are availalble in this folder.

## Status 
Date: 2016-03-05

- Generated YANG files are valid according to pyang 1.6.
- Generated YANG files are valid according to OpenDaylight yang-validation-tool-0.7.3-Lithium-SR3
- Final confirmation for usage with "Netopeer" is open...
- OpenYuma compiler generates C code, however there are the following warnings:
  - Warning: no get-CB generated for top-level operational list 'scriptList'
  - Warning: no get-CB generated for top-level operational list 'airInterfaceCapabilityList'
  - Warning: no get-CB generated for top-level operational list 'availableKindsOfContainerList'

## Changes made on ONF Core Model 1.1

### removal of unused packages, classes and types
- remove package CoreModel::ExplanatoryFiguresUsedIndDocumentsAndSlides
- remove package CoreModel::CoreModelEnhancements
- remove package CoreModel::CoreNetworkModule::TypeDefinitions::TopologyPacs
- remove package CoreModel::CoreNetworkModule::ObjectClasses::TopologyPacs
- remove package CoreModel::CoreNetworkModule::Diagrams::TopologyPacs
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::OperationalState
- remove obsolete type definition CoreModel::CoreNetworkModule::TypeDefinitions::Directionality
- remove obsolete property CoreModel::CoreNetworkModule::ObjectClasses::NetworkElement::_ltppList
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::SdnController
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::NetworkControlDomain
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::ForwardingDomain
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::Link
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::LinkPort
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcRoute
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcSwitch
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::ForwardingConstruct
- remove object class CoreModel::CoreNetworkModule::ObjectClasses::FcPort

### removal of unused attributes for GlobalClass, LocalClass and LogicalTerminationPoints
- remove Extension from CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::GlobalClass
- remove Label from CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::GlobalClass
- remove Extension from CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass
- remove Label from CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass
- remove State_Pac from CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass
- remove optional parameter CoreModel::CoreNetworkModule::ObjectClasses::LogicalTerminationPoint::_connectedLtpRef
- remove optional parameter CoreModel::CoreNetworkModule::ObjectClasses::LogicalTerminationPoint::_peerLtpRef
- remove optional parameter CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::TypeDefinitions::NameAndValue::_nameAndValueAuthorityRef
- remove optional parameter CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::TypeDefinitions::NameAndValue::_globalClassRef
- remove optional parameter CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::TypeDefinitions::NameAndValue::_localClassRef

### changes of the ONF CoreModel
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String
- add attribute CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::uuid

Please note that these changes are necessary to generate valid yang modules. They need to be discussed within the ONF Information Model group and should be covered in the ONF CoreModel 1.2 version.
The attribute CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::uuid was added because CoreModel::CoreFoundationModule::SuperClassesAndCommonPackages::ObjectClasses::LocalClass::localIdList is a list and lists must not be used as keys. However the microwave transport network specific conditional packages need a key (reference) to the LayerProtocol.

### add mircorwave specific conditional packages
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::AirInterface::MW_AirInterface_Pac (Prio1 only)
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::Structure::MW_Structure_Pac (Prio1 only)
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::Container::MW_Container_Pac (Prio1 only)

### update profile
The OpenModelProfile was updated from verstion 0.0.2 to version 0.2.2.

## Supported object classes
The following list shows the microwave transport network object classes.
In addition the all attributes are listed, even when they are not susported.


- uuid (containerType)
- containerName (containerType)
- numberOfTimeSlotsRequired (containerType)
- //  tdmTimeSlotsIsRequired (containerType) 
- bundlingIsAvail (containerType)

timeSlotIDType
- structureID (timeSlotIDType)
- timeSlotID (timeSlotIDType)

timeSlotStatusType
- uuid (timeSlotStatusType)
- //  timeSlotIsReservedForTdm (timeSlotStatusType) 
- //  priorityClass (timeSlotStatusType) 
- //  dropOrderRank (timeSlotStatusType) 
- operationalStatus (timeSlotStatusType)

MW_AirInterface_Pac
- layerProtocol (MW_AirInterface_Pac)
- //  airInterfacePort (MW_AirInterface_Pac) 
- airInterfaceCapabilityList (MW_AirInterface_Pac)
- airInterfaceConfiguration (MW_AirInterface_Pac)
- airInterfaceStatus (MW_AirInterface_Pac)
- //  airInterfaceCurrentProblemList (MW_AirInterface_Pac) 
- //  airInterfaceCurrentPerformance (MW_AirInterface_Pac) 
- //  airInterfaceHistoricalPerformanceList (MW_AirInterface_Pac) 

AirInterfaceCapability
- airInterfaceID (AirInterfaceCapability)
- typeOfEquipment (AirInterfaceCapability)
- supportedChannelPlans (AirInterfaceCapability)
- txFrequencyMin (AirInterfaceCapability)
- txFrequencyMax (AirInterfaceCapability)
- rxFrequencyMin (AirInterfaceCapability)
- rxFrequencyMax (AirInterfaceCapability)
- //  duplexDistanceIsVariable (AirInterfaceCapability) 
- //  duplexDistance (AirInterfaceCapability) 
- adaptiveModulationIsAvail (AirInterfaceCapability)
- //  mimoIsAvail (AirInterfaceCapability) 
- //  mimoChannels (AirInterfaceCapability) 
- //  afrIsAvail (AirInterfaceCapability) 
- //  atpcIsAvail (AirInterfaceCapability) 
- //  atpcRange (AirInterfaceCapability) 
- //  autoFreqSelectIsAvail (AirInterfaceCapability) 
- //  loopBackIsAvail (AirInterfaceCapability) 
- //  maintenanceTimerRange (AirInterfaceCapability) 
- //  supportedAlarms (AirInterfaceCapability) 
- scriptList (AirInterfaceCapability)

Script
- scriptID (Script)
- channelBandwidth (Script)
- modulationScheme (Script)
- //  informationRate (Script) 
- txPowerMin (Script)
- txPowerMax (Script)
- //  rxThreshold (Script) 
- //  amUpshiftLevel (Script) 
- //  amDownshiftLevel (Script) 
- xpicIsAvail (Script)

AirInterfaceConfiguration
- airInterfaceName (AirInterfaceConfiguration)
- radioSignalId (AirInterfaceConfiguration)
- txFrequency (AirInterfaceConfiguration)
- rxFrequency (AirInterfaceConfiguration)
- txChannelBandwidth (AirInterfaceConfiguration)
- rxChannelBandwidth (AirInterfaceConfiguration)
- //  polarization (AirInterfaceConfiguration) 
- powerIsOn (AirInterfaceConfiguration)
- transmitterIsOn (AirInterfaceConfiguration)
- txPower (AirInterfaceConfiguration)
- adaptiveModulationIsOn (AirInterfaceConfiguration)
- modulationMin (AirInterfaceConfiguration)
- modulationMax (AirInterfaceConfiguration)
- xpicIsOn (AirInterfaceConfiguration)
- //  mimoIsOn (AirInterfaceConfiguration) 
- //  afrIsOn (AirInterfaceConfiguration) 
- //  coChannelGroup (AirInterfaceConfiguration) 
- //  atpcIsOn (AirInterfaceConfiguration) 
- //  atpcThreshUpper (AirInterfaceConfiguration) 
- //  atpcThreshLower (AirInterfaceConfiguration) 
- //  autoFreqSelectIsOn (AirInterfaceConfiguration) 
- //  autoFreqSelectRange (AirInterfaceConfiguration) 
- //  modulationIsOn (AirInterfaceConfiguration) 
- //  loopBackIsOn (AirInterfaceConfiguration) 
- //  maintenanceTimer (AirInterfaceConfiguration) 
- //  problemSeverityList (AirInterfaceConfiguration) 

AirInterfaceStatus
- txFrequencyCur (AirInterfaceStatus)
- rxFrequencyCur (AirInterfaceStatus)
- txLevelCur (AirInterfaceStatus)
- rxLevelCur (AirInterfaceStatus)
- //  modulationCur (AirInterfaceStatus) 
- //  informationRateCur (AirInterfaceStatus) 
- snrCur (AirInterfaceStatus)
- //  xpdCur (AirInterfaceStatus) 
- //  rxTempCur (AirInterfaceStatus) 
- //  lastStatusChange (AirInterfaceStatus) 
- //  radioPowerIsUp (AirInterfaceStatus) 
- linkIsUp (AirInterfaceStatus)
- xpicIsUp (AirInterfaceStatus)
- //  mimoIsUp (AirInterfaceStatus) 
- //  afrIsUp (AirInterfaceStatus) 
- //  atpcIsUp (AirInterfaceStatus) 
- //  autoFreqSelectIsUp (AirInterfaceStatus) 
- //  loopBackIsUp (AirInterfaceStatus) 

MW_Structure_Pac
- layerProtocol (MW_Structure_Pac)
- structureCapability (MW_Structure_Pac)
- structureConfiguration (MW_Structure_Pac)
- structureStatus (MW_Structure_Pac)
- //  structureCurrentProblemList (MW_Structure_Pac) 
- //  structureCurrentPerformance (MW_Structure_Pac) 
- //  structureHistoricalPerformanceList (MW_Structure_Pac) 
- //  airInterfaceProtectionLTP (MW_Structure_Pac) 
- //  mw_airInterface_pac (MW_Structure_Pac) 

StructureCapability
- structureID (StructureCapability)
- totalNumberOfTimeSlots (StructureCapability)
- //  tdmTimeSlotsIsSupported (StructureCapability) 
- //  supportedAlarms (StructureCapability) 

StructureConfiguration
- //  tdmReservedNumberOfTimeSlots (StructureConfiguration) 
- serverID (StructureConfiguration)
- //  problemSeverityList (StructureConfiguration) 

StructureStatus
- timeSlotStatusList (StructureStatus)
- //  lastStatusChange (StructureStatus) 

MW_Container_Pac
- layerProtocol (MW_Container_Pac)
- containerCapability (MW_Container_Pac)
- containerConfiguration (MW_Container_Pac)
- containerStatus (MW_Container_Pac)
- //  containerCurrentProblemList (MW_Container_Pac) 
- //  containerCurrentPerformance (MW_Container_Pac) 
- //  containerHistoricalPerformanceList (MW_Container_Pac) 
- //  mw_structure_pac (MW_Container_Pac) 
- //  port (MW_Container_Pac) 
- //  ethernetSwitch (MW_Container_Pac) 

ContainerCapability
- containerID (ContainerCapability)
- availableKindsOfContainerList (ContainerCapability)
- //  priorityClassesIsAvail (ContainerCapability) 
- //  encryptionIsAvail (ContainerCapability) 
- //  packetCompressionIsAvail (ContainerCapability) 
- //  layer2CompressionIsAvail (ContainerCapability) 
- //  vlanCompressionIsAvail (ContainerCapability) 
- //  qInQCompressionIsAvail (ContainerCapability) 
- //  mplsCompressionIsAvail (ContainerCapability) 
- //  l2vpnCompressionIsAvail (ContainerCapability) 
- //  ipv4CompressionIsAvail (ContainerCapability) 
- //  ipv6CompressionIsAvail (ContainerCapability) 
- //  l3vpnCompressionIsAvail (ContainerCapability) 
- //  layer4CompressionIsAvail (ContainerCapability) 
- //  supportedAlarms (ContainerCapability) 

ContainerConfiguration
- container (ContainerConfiguration)
- //  priorityClass (ContainerConfiguration) 
- timeSlotIDList (ContainerConfiguration)
- //  encryptionIsOn (ContainerConfiguration) 
- //  packetCompressionIsOn (ContainerConfiguration) 
- //  layer2CompressionIsOn (ContainerConfiguration) 
- //  vlanCompressionIsOn (ContainerConfiguration) 
- //  qInQCompressionIsOn (ContainerConfiguration) 
- //  mplsCompressionIsOn (ContainerConfiguration) 
- //  l2vpnCompressionIsOn (ContainerConfiguration) 
- //  ipv4CompressionIsOn (ContainerConfiguration) 
- //  ipv6CompressionIsOn (ContainerConfiguration) 
- //  l3vpnCompressionIsOn (ContainerConfiguration) 
- //  layer4CompressionIsOn (ContainerConfiguration) 
- //  problemSeverityList (ContainerConfiguration) 

ObjectCreationNotification
- counter (ObjectCreationNotification)
- timeStamp (ObjectCreationNotification)
- objectId (ObjectCreationNotification)

ObjectDeletionNotification
- counter (ObjectDeletionNotification)
- timeStamp (ObjectDeletionNotification)
- objectId (ObjectDeletionNotification)

AttributeValueChangedNotification
- counter (AttributeValueChangedNotification)
- timeStamp (AttributeValueChangedNotification)
- objectId (AttributeValueChangedNotification)
- attributeName (AttributeValueChangedNotification)
- newValue (AttributeValueChangedNotification)
