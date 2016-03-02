# Reduced Core Model and Prio1 Microwave Model
For the second ONF MWTN PoC the ONF Core Model 1.1 is reduced to focus on the important ObjectClases and to avoid unnecessary (less important) error analysis.
The focus is on the Object Classes: NetworkElement, LogicalTerminaionPoint and LayerProtocol.

In addition the microwave transport network specific coditional packages and its prio1 attributes are availalble in this folder.

## Status [2016-03-02]
- Generated YANG files are valid according to pyang 1.6.
- Generated YANG files are valid according to OpenDaylight yang-validation-tool-0.7.3-Lithium-SR3
- Final confirmation for usage with "Netopeer" and "OpenYuma" is open...
- The YANG statements "feature" and "if-feature" should be removed, because they must not have any function in the 2. ONF MWTN PoC.
- The following types will moved to "TypeDefinitions"
  - polarizationType
  - roleType
  - protectionType
  - airInterfaceDiversityStatusType
  - timeSlotStatusType
  - timeSlotIDType
- Notifications missing

## Changes made on ONF Core Model 1.1
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
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::terminationState - set to Boolean
- define type for CoreModel::CoreNetworkModule::ObjectClasses::LayerProtocol::configuredClientCapacity - set to String
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::AirInterface::MW_AirInterface_Pac (Prio1 only)
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::Structure::MW_Structure_Pac (Prio1 only)
- add conditional package MicrowaveModel::ObjectClasses::MwConnection::Container::MW_Container_Pac (Prio1 only)
